# Talk Plugin Custom ID Assets

:sparkles: Thanks to The Register-Guard for agreeing to open source this plugin. :sparkles:

This plugin is designed to allow the embed for Talk to specify an Asset ID to
lookup and if not found create with the given ID and URL. If the ID is not
provided however, the url will be used instead and it will fall back to Talk
assigning an ID.

## Algorithm

### Asset ID provided

Attempt to lookup Asset with the given ID, if found, return asset. If the asset
is not found, create it with the url.

### Asset ID not provided

Attempt to lookup Asset with the url, if found, return asset. If the asset is
not found, create it with the url and assign a new ID.

## Installation

Simply modify/create the `plugins.json` file to include it:

```js
{
  "server": [
    // ...
    {"@coralproject/talk-plugin-custom-asset-id": "^1.0.0"},
    // ...
  ],
  "client": [
    // ...
  ]
}
```

Which will enable it.