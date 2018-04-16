const {URL} = require('url');

/**
 *
 * @param {Object} ctx the graph context which contains references to the connectors.
 * @param {String} id the designated string for the asset.
 * @param {String} url the designated url for the asset.
 */
const findOrCreateAsset = async (ctx, id, url) => {

  // Pull our connectors out of the context.
  const {
    connectors: {
      models: {
        Asset,
      },
      services: {
        DomainList,
        Settings,
        Scraper,
      },
      errors: {
        APIError,
        ErrInvalidAssetURL,
      },
    },
  } = ctx;

  // Try to validate that the url is valid. If the URL constructor throws an
  // error, throw our internal ErrInvalidAssetURL instead. This will validate
  // that the url contains a valid scheme.
  try {
    new URL(url);
  } catch (err) {
    throw ErrInvalidAssetURL;
  }

  if (!id || id.length === 0) {
    throw new APIError('asset id is invalid', {
      translation_key: 'INVALID_ASSET_ID',
      status: 400
    });
  }

  // Check for whitelisting + get the settings at the same time.
  const [
    whitelisted,
    settings,
  ] = await Promise.all([
    DomainList.urlCheck(url),
    Settings.retrieve(),
  ]);

  // If the domain wasn't whitelisted, then we shouldn't create this asset!
  if (!whitelisted) {
    throw ErrInvalidAssetURL;
  }

  // Construct the update operator that we'll use to create the asset.
  const update = {
    $setOnInsert: {
      id,
      url,
    },
  };

  // If the auto-close stream is enabled, close the stream after the designated
  // timeout.
  if (settings.autoCloseStream) {
    update.$setOnInsert.closedAt = new Date(Date.now() + settings.closedTimeout * 1000);
  }

  // We're using the findOneAndUpdate here instead of a insert to protect
  // against race conditions.
  const asset = await Asset.findOneAndUpdate({
    id,
  }, update, {

    // Ensure that if it's new, we return the new object created.
    new: true,

    // Perform an upsert in the event that this doesn't exist.
    upsert: true,

    // Set the default values if not provided based on the mongoose models.
    setDefaultsOnInsert: true,

    // Ensure that we validate the input that we do have.
    runValidators: true,
  });

  // If this is a new asset, then we need to scrape it!
  if (!asset.scraped) {

    // Create the Scraper job.
    await Scraper.create(ctx, id);
  }

  return asset;
};

module.exports = (ctx) => ({
  Assets: {
    findOrCreate: (id, url) => findOrCreateAsset(ctx, id, url),
  },
});
