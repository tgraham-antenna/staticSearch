# staticSearch

A codebase to support a pure JSON search engine requiring no backend for any XHTML5 document collection.

This codebase, developed by Joey Takeda and Martin Holmes, will provide a configurable, customizable tool which you can point at an XHTML5 document collection and have it generate a search page which requires no backend server-side component. It will create stemmed indexes of all document text, along with an HTML search page including faceted search features based on `<meta>` tags in the document collection. The search page uses pure JavaScript to query the index, which is a large collection of small JSON files, to provide a rapid and sophisticated search for any small-to-medium website which does not require any serverside code at all.

The generation code uses XSLT3 and the search functionality is JavaScript. Implementations of the Porter2 stemmer in XSLT and JavaScript are part of the package. The XSLT3 and JavaScript implementations of Porter2 are done and pass all tests. The XSLT3 tokenizer and the JavaScript search page code are under development. A previous implementation of the basic approach is already in use in the site Mapping Keats's Progress http://johnkeats.uvic.ca/search.html.

The code is licensed under both MPL and BSD. 
