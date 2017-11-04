var test = require('tape');
var getContentful = require('../getContentful.js');


function setupFiles(filenames) {
   filenames = filenames || [];
   var files = {};
   for (var file of filenames)
      files[file] = { title: "Title of " + file }

   return files;
}

function setupMockMetalsmith() {
   var _data = {};
   return {
      metadata: function() { return _data; }
   }
}


test('defaults', function(t) {
   var files = setupFiles();
   var mockMetalsmith = setupMockMetalsmith();

   getContentful( { client: {
                              space: 'wl1z0pal05vy',
                              accessToken: '0e3ec801b5af550c8a1257e8623b1c77ac9b3d8fcfc1b2b7494e3cb77878f92a'
                           }
                  })
      (files, mockMetalsmith, done);

   function done(err) {  // yeah hoisting!!!
      if (err) throw err;

      //console.dir(files, { depth: 99 });
      t.equals(Object.keys(files).length, 9);
      var soso_wall_clock = files['posts/soso-wall-clock.md'];
      t.equals(soso_wall_clock.slug, 'soso-wall-clock');
      t.equals(soso_wall_clock.brand.fields.website, "http://www.lemnos.jp/en/");
      t.end();
   }
});


test('msFiles', function(t) {
   var files = setupFiles();
   var mockMetalsmith = setupMockMetalsmith();

   getContentful( { client: {
                              space: 'wl1z0pal05vy',
                              accessToken: '0e3ec801b5af550c8a1257e8623b1c77ac9b3d8fcfc1b2b7494e3cb77878f92a'
                           },
                     query: { },
                     msFiles: {
                        idField: 'sku',
                        filename: "foo/skus/${id}.html",
                        addYAML: { foo: "bar" },
                        postProcess: function(c) {
                           c.priceInPennies = c.price * 100;
                           return c;
                        },
                        metadata: "here"
                     }
                  })
      (files, mockMetalsmith, done);

   function done(err) {  // yeah hoisting!!!
      if (err) throw err;

      //console.dir(files, { depth: 99 });
      t.equals(Object.keys(files).length, 9);
      t.equals(Object.keys(mockMetalsmith.metadata().here).length, 9)
      var soso_wall_clock = files['foo/skus/B00MG4ULK2.html'];
      t.equals(soso_wall_clock.slug, 'soso-wall-clock');
      t.equals(soso_wall_clock.priceInPennies, 12000);
      t.equals(soso_wall_clock.foo, "bar")
      t.end();
   }
});


test('fileExists', function(t) {
   var files = setupFiles(['foo/skus/B00MG4ULK2.html']);
   var mockMetalsmith = setupMockMetalsmith();

   getContentful( { client: {
                              space: 'wl1z0pal05vy',
                              accessToken: '0e3ec801b5af550c8a1257e8623b1c77ac9b3d8fcfc1b2b7494e3cb77878f92a'
                           },
                     query: { },
                     msFiles: {
                        idField: 'sku',
                        filename: "foo/skus/${id}.html"
                     },
                  })
      (files, mockMetalsmith, done);

   function done(err) {  // yeah hoisting!!!
      t.assert(err);
      t.end();
   }
});
