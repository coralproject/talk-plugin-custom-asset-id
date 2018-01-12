module.exports = {
  RootQuery: {
    asset: async (_, {id, url}, {loaders: {Assets}}) => {

      // If the ID is not provided, then fall back to the default loader.
      if (!id) {
        return Assets.getByURL(url);
      }

      // First, try to see if the asset specified by the given ID exists.
      let asset = await Assets.getByID.load(id);
      if (asset) {

        // If the asset exists, then use it!
        return asset;
      }

      // Considering that the asset doesn't exist, we need to pass this off
      // to our custom loader.
      return Assets.findOrCreate(id, url);
    },
  },
};
