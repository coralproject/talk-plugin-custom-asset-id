# Talk Plugin Custom ID Assets

:sparkles: Thanks to The Register-Guard for agreeing to open source this plugin.  :sparkles:

This plugin is designed to allow the embed for Talk to specify an Asset ID to
lookup and if not found create with the given ID and URL. If the ID is not
provided however, the url will be used instead and it will fall back to Talk
assigning an ID.

## Installation

### Docker

If you are using the `coralproject/talk:*-onbuild` images, you can place this
into the `plugins` directory, as:

```
plugins/
  - talk-plugin-custom-asset-id
```

And modify/create the `plugins.json` file to include it:

```js
{
  "server": [
    // ...
    "talk-plugin-custom-asset-id",
    // ...
  ],
  "client": [
    // ...
  ]
}
```

Which will enable it.

### Source

Simply place this folder in the pre-existing `plugins` folder and modify/create
the `plugins.json` file as described in the Docker section above.
