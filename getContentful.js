const contentful = require('contentful');

module.exports = getContentful;

const DEFAULT_OPTIONS = {
   client: {  // @see https://contentful.github.io/contentful.js/contentful/latest/contentful.html
      //accessToken:,
      //space:
   },
   query: { }, // @see https://contentful.github.io/contentful.js/contentful/latest/ContentfulClientAPI.html#.getEntries
   msFiles : {
      idField: 'slug',
      filename: "posts/${id}.md"
   }
};


function getContentful(options) {
   options = normalize(options);

   return function(files, metalsmith, done) {

      try {
         const client = contentful.createClient(options.client)
         client.getEntries(options.query)
         .then(function(entries) {
            var contentfulData = {}
            entries.items.forEach(function(item) {
               let id = item.fields[options.msFiles.idField] || item.sys.id;
               let filepath = options.msFiles.filename.replace("${id}", id);
               let contentFields =  Object.assign({}, options.msFiles.addYAML, item.fields);
               if(options.msFiles.postProcess)
                  contentFields = options.msFiles.postProcess(contentFields);
               contentfulData[filepath] = contentFields;
               if (files[filepath]) { // already there
                  throw new Error("metalsmith-get-contentful, path already exists: " + filepath);
               }
               else
                  files[filepath] = contentFields;
            })
            return contentfulData;
         })
         .then(function(contentfulData) {
            if (options.msFiles.metadata)
               metalsmith.metadata()[options.msFiles.metadata] = contentfulData;
            done();
            return contentfulData;
         })
         .catch(err => done(err));
      }

      catch (err) {
         done(err);
      }
   }
};


function normalize(inOptions) {
   inOptions = inOptions || {};
   var options = Object.assign({}, DEFAULT_OPTIONS, inOptions);
   options.msFiles = Object.assign({}, DEFAULT_OPTIONS.msFiles, inOptions.msFiles);  // deeper copy here...
   return options;
};
