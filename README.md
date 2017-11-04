[![Build Status](https://secure.travis-ci.org/MorganConrad/metalsmith-get-contentful.png)](http://travis-ci.org/MorganConrad/metalsmith-get-contentful)
[![License](http://img.shields.io/badge/license-MIT-A31F34.svg)](https://github.com/MorganConrad/metalsmith-get-contentful)
[![NPM Downloads](http://img.shields.io/npm/dm/metalsmith-get-contentful.svg)](https://www.npmjs.org/package/metalsmith-get-contentful)
[![Known Vulnerabilities](https://snyk.io/test/github/morganconrad/metalsmith-get-contentful/badge.svg)](https://snyk.io/test/github/morganconrad/metalsmith-get-contentful)
[![Coverage Status](https://coveralls.io/repos/github/MorganConrad/metalsmith-get-contentful/badge.svg)](https://coveralls.io/github/MorganConrad/metalsmith-get-contentful)

# metalsmith-get-contentful
A [Metalsmith](http://www.metalsmith.io/) plugin to read content from the Contentful API.

Lightweight wrapper around the [Contentful API](https://www.contentful.com/developers/docs/javascript/) to query content, get the content's fields, and place the fields into metalsmith "files" for later processing.  Typically done before the markdown stage.

This plugin works best if your Contentful Content has fields that match up to the YAML data needed for your metalsmith template engine.  For example, they should probably have a "title", "template", and, most importantly, "contents".

If your content has a mismatch, see `options.msFiles.addYAML` and `options.msFiles.postProcess()`.

### Usage

To grab all "projects", use their field "slug" as a filename, and put them under the path "/projects/{slug}.md"

```
var getContentful = require('../getContentful.js');
...
.use(getContentful({
      client: {
         space: '<space_id>',
         accessToken: '<access_token>'
      },
      query : {
         content_type: 'project'
      },
      msFiles : {
         idField: 'slug',
         filename: "projects/${id}.md"
      }
   }) )
```

### Options

#### client:  arg for [Contentful.createClient(client)](https://contentful.github.io/contentful.js/contentful/latest/contentful.html)

 - accessToken: (default is process.env.CONTENTFUL_ACCESS_TOKEN)
 - space:       (default is process.env.CONTENTFUL_SPACE)

#### query: arg for [client.getEntries(query)](https://contentful.github.io/contentful.js/contentful/latest/ContentfulClientAPI.html#.getEntries)
default is {}.  

#### msFiles: how to manipulate and place the content into metalsmith

 - idField: field to use for id.  default is 'slug'.  falsy means use sys.id
 - filename: pattern to create the metalsmith "filename" based on id.  default is "posts/${id}.md"
 - postProcess(): Default is null.  If present, the content will be replaced by `postProcess(content)`.  For example, if you need to rename fields.
 - addYAML: default is {}.  Gets added to each result.  Useful if you want to add fields such a template
 - metadata: default is null.  If present, also place all the data into metalsmith.metadata() here.

### Notes, Todos, and Caveats

If the "file" is already present, getContentful calls `done()` with an Error.

After writing this, discovered a very similar approach and code in [Bitbucket contentful-data](https://bitbucket.org/dmosemann/contentful-data)

A different approach is in [contentful-metalsmith](https://www.npmjs.com/package/contentful-metalsmith)

[leviwheatcroft/metalsmith-contentful](https://github.com/leviwheatcroft/metalsmith-contentful) also gave me a few ideas.
