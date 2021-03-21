
/*              ssUtilities.js             */
/* Authors: Martin Holmes and Joey Takeda. */
/*        University of Victoria.          */

/** This file is part of the projectEndings staticSearch
  * project.
  *
  * Free to anyone for any purpose, but
  * acknowledgement would be appreciated.
  * The code is licensed under both MPL and BSD.
  */

 /** WARNING:
   * This lib has "use strict" defined. You may
   * need to remove that if you are mixing this
   * code with non-strict JavaScript.
   */

/* jshint strict:false */
/* jshint esversion: 6*/
/* jshint strict: global*/
/* jshint browser: true */

"use strict";

/**
  * First some constant values for categorizing term types.
  * I would like to put these inside the class, but I can't
  * find an elegant way to do that.
  */
/**
  * @constant PHRASE, MUST_CONTAIN, MUST_NOT_CONTAIN, MAY_CONTAIN, WILDCARD
  * @type {Number}
  * @description Constants representing different types of search command. Note
  *              that WILDCARD is not currently used, but will be if the 
  *              implementation of wildcards is changed.
  */
  /** @type {!number} */
  const PHRASE               = 0;
  /** @type {!number} */
  const MUST_CONTAIN         = 1;
  /** @type {!number} */
  const MUST_NOT_CONTAIN     = 2;
  /** @type {!number} */
  const MAY_CONTAIN          = 3;
  /** @type {!number} */
  const WILDCARD             = 4;

/**@constant arrTermTypes
   * @type {Array}
   * @description array of PHRASE, MUST_CONTAIN, MUST_NOT_CONTAIN, MAY_CONTAIN,
   *              WILDCARD used so we can easily iterate through them.
   */
  const arrTermTypes = [PHRASE, MUST_CONTAIN, MUST_NOT_CONTAIN, MAY_CONTAIN, WILDCARD];

/**
  * @constant TO_GET, GETTING, GOT, FAILED
  * @type {Number}
  * @description Constants representing states of files that may be
  *              fetched.
  */
  /** @type {!number} */
  const TO_GET  = 0;
  /** @type {!number} */
  const GETTING = 1;
  /** @type {!number} */
  const GOT     = 2;
  /** @type {!number} */
  const FAILED  = 3;

/**
  * Components in the ss namespace that are used by default, but
  * which may easily be overridden by the project.
  */
/**
  * Our handy namespace
  * @namespace ss
  */
  var ss = {};

/**
  * @property ss.captions
  * @type {Map}
  * @description ss.captions is the an array of languages (default contains
  * only en and fr), each of which has some caption properties. Extend
  * by adding new languages or replace if necessary.
  */
  //English
  ss.captions = new Map();
  ss.captions.set('en', {});
  ss.captions.get('en').strSearching         = 'Searching...';
  ss.captions.get('en').strDocumentsFound    = 'Documents found: ';
  ss.captions.get('en')[PHRASE]              = 'Exact phrase: ';
  ss.captions.get('en')[MUST_CONTAIN]        = 'Must contain: ';
  ss.captions.get('en')[MUST_NOT_CONTAIN]    = 'Must not contain: ';
  ss.captions.get('en')[MAY_CONTAIN]         = 'May contain: ';
  ss.captions.get('en')[WILDCARD]            = 'Wildcard term: ';
  ss.captions.get('en').strScore             = 'Score: ';
  ss.captions.get('en').strSearchTooBroad    = 'Your search is too broad. Include more letters in every term.';
  ss.captions.get('en').strDiscardedTerms    = 'Not searched (too common or too short): ';
  ss.captions.get('en').strShowMore          = 'Show more';
  ss.captions.get('en').strShowAll           = 'Show all';
  ss.captions.get('en').strTooManyResults    = 'Your search returned too many results. Include more filters or more search terms.'
  //French
  ss.captions.set('fr', {});
  ss.captions.get('fr').strSearching         = 'Recherche en cours...';
  ss.captions.get('fr').strDocumentsFound    = 'Documents localisés: ';
  ss.captions.get('fr')[PHRASE]              = 'Phrase exacte: ';
  ss.captions.get('fr')[MUST_CONTAIN]        = 'Doit contenir: ';
  ss.captions.get('fr')[MUST_NOT_CONTAIN]    = 'Ne doit pas contenir: ';
  ss.captions.get('fr')[MAY_CONTAIN]         = 'Peut contenir: ';
  ss.captions.get('fr')[WILDCARD]            = 'Caractère générique: ';
  ss.captions.get('fr').strScore             = 'Score: ';
  ss.captions.get('fr').strSearchTooBroad    = 'Votre recherche est trop large. Inclure plus de lettres dans chaque terme.';
  ss.captions.get('fr').strDiscardedTerms    = 'Recherche inaboutie (termes trop fréquents ou trop brefs): ';
  ss.captions.get('fr').strShowMore          = 'Montrez plus';
  ss.captions.get('fr').strShowAll           = 'Montrez tout';
  ss.captions.get('fr').strTooManyResults    = 'Votre recherche a obtenu trop de résultats. Il faut inclure plus de filtres ou plus de termes de recherche.';

/**
  * @property ss.stopwords
  * @type {Array}
  * @description a simple array of stopwords. Extend
  * by adding new items or replace if necessary. If a local
  * stopwords.json file exists, that will be loaded and overwrite
  * this set.
  */
  ss.stopwords = new Array('i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now');
  