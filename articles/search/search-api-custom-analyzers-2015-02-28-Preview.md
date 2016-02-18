<properties
	pageTitle="Custom analyzers (Azure Search REST API Version 2015-02-28-Preview) | Microsoft Azure"
	description="Custom analyzers (Azure Search REST API Version 2015-02-28-Preview)"
	services="search"
	documentationCenter=""
	authors="JanuszLembicz"
	manager="pablocas"
	editor=""/>

<tags
	ms.service="search"
	ms.devlang="rest-api"
	ms.workload="search"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.author="jlembicz"
	ms.date="12/06/2015" />

# Analyzers (Azure Search REST API Version 2015-02-28-Preview)

> [AZURE.NOTE] Support for custom analyzers is currently in preview. You must be using the 2015-02-28-Preview version of the Azure Search Service REST API to take advantage of this feature. Note that preview features are currently not added to the .NET SDK, so using the preview REST API is your only programming option at this time.

## Overview

The role of a full-text search engine, in simple terms, is to process and store documents in a way that enables efficient querying and retrieval. At a high level, it all comes down to extracting important words from documents, putting them in an index, and then using the index to find documents that match words of a given query. The process of extracting words from documents and search queries is called lexical analysis. Components that perform lexical analysis are called analyzers. In Azure Search you can choose from a set of [predefined language agnostic analyzers](#Analyzers) and [language specific analyzers](https://msdn.microsoft.com/en-us/library/azure/dn879793.aspx). You also have an option to define your own, custom analyzers. A custom analyzer allows you to take control over the process of converting text into indexable/searchable tokens. It’s a user-defined configuration consisting of a single predefined tokenizer and one or more token filters. The tokenizer is responsible for breaking text into tokens, and the token filters for modifying tokens emitted by the tokenizer.

Popular scenarios enabled by custom analyzers include:

- Phonetic search - add a phonetic filter to enable searching based on how a word sounds, not how it’s spelled.
- Disable lexical analysis - use the Keyword analyzer to create searchable fields that are not analyzed
- Fast prefix/suffix search - Add the Edge N-gram token filter to index prefixes of words to enable fast prefix matching. Combine it with the Reverse token filter to do suffix matching.
- Custom tokenization - for example, use the Whitespace tokenizer to break sentences into tokens using whitespace as a delimiter
- ASCII folding - add the ASCII folding filter to normalize diacritics like ö or ê in search terms.

You can define multiple custom analyzers to vary the combination of filters, but each field can only use one analyzer for indexing analysis and one for search analysis. 
 
This page provides a list of supported analyzers, tokenizers and token filters. You will also find a description of changes to the index definition with a usage example. For an introduction and exploration of scenarios, see [Custom Analyzers in Azure Search](link). For more background about the underlying technology leveraged in the Azure Search implementation, see [Analysis package summary (Lucene)](http://lucene.apache.org/core/4_10_3/core/org/apache/lucene/analysis/package-summary.html).


## Default analyzer

The default analyzer is the [Apache Lucene Standard](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/standard/StandardAnalyzer.html) analyzer. 

## Validation rules

Names of custom analyzers, tokenizers, and token filters have to be unique and can’t be the same as any of the predefined analyzers, tokenizers, or token filters. 
 

## Index definition with custom analyzers 

You define custom analyzers at index creation time. The syntax of custom analysis components in the index definition is shown below. A complete example is provided [here](#Example)

	{
	  	. . .
	 	(standard create index request body)
	 	. . .  
		"analyzers": (optional) [ 
		    {  
		       "name": "name of analyzer",  
		       "@odata.type": "#Microsoft.Azure.Search.CustomAnalyzer", 
		       "tokenizer": "tokenizer_name", (tokenizer_name is the name of a tokenizer from the [Tokenizers](#Tokenizers) table)
		       "tokenFilters": [
				  "token_filter_name", (token_filter_name is the name of a token filter from the [Token Filters](#TokenFilters) table)
				  "token_filter_name"
				] (token filters will be applied from left to right)
		    },
			{  
		       "name": "name of analyzer",  
		       "@odata.type": "#analyzer_type", 
		       "option1": value1,
		       "option2": value2,
		       ...  
		    }
		],  
		"tokenizers": (optional) [ 
		    {  
		       "name": "tokenizer_name",  
		       "@odata.type": "#tokenizer_type", 
		       "option1": value1,  
		       "option2": value2, 
		       ...  
		    }
		],
		"tokenFilters": (optional) [ 
		    {  
		       "name": "token_filter_name",  
		       "@odata.type": "#token_filter_type", 
		       "option1": value1,  
		       "option2": value2, 
		       ...  
		    }
		]	
	}

> [AZURE.NOTE] Custom analyzers that you create are not exposed in the Azure portal. The only way to add a custom analyzer is through code that makes calls to the REST API when defining an index.

##Index attributes for custom analyzers, tokenizers and token filters 

This section specifies the configuration properties for the analyzers, tokenizers, and token filters section of an index definition.

###Analyzers

<table>
  <tbody>
    <tr>
      <td>
        <b>Name</b>
      </td>
      <td>
		It must only contain letters, digits, spaces, dashes or underscores, can only start and end with alphanumeric characters, and is limited to 128 characters.
      </td>
    </tr>
    <tr>
      <td>
        <b>Type</b>
      </td>
      <td>
		Valid values are either "#Microsoft.Azure.Search.CustomAnalyzer" or an analyzer name from the list of supported analyzers. See <b>analyzer_type</b> column in the [Analyzers](#Analyzers) table below.
      </td>
	</tr>
    <tr>
      <td>
        <b>Tokenizer</b> (only valid for #Microsoft.Azure.Search.CustomAnalyzer)
      </td>
      <td>
		Required. Must be one of predefined tokenizers listed in the [Tokenizers](#Tokenizers) table below or any of the custom tokenizers defined in the index definition.
      </td>
	</tr>
    <tr>
      <td>
        <b>TokenFilters</b> (only valid for #Microsoft.Azure.Search.CustomAnalyzer)
      </td>
      <td>
		All of the token filters are either one of predefined token filters listed in the [Token Filters](#TokenFilters) table or any of the custom token filters defined in the index definition.
      </td>
	</tr>
    <tr>
      <td>
        <b>Options</b>
      </td>
      <td>
		Must be [valid options](#Analyzers) of a predefined (non-custom) analyzer.
      </td>
	</tr>
  </tbody>
</table>

###Tokenizers

A tokenizer divides continuous text into a sequence of tokens, such as breaking a sentence into words. 
You can specify exactly one tokenizer per custom analyzer. If you need more than one tokenizer, you can create multiple custom analyzers and assign them on a field-by-field basis in your index schema.
A custom analyzer can use a predefined tokenizer with either default or customized options.

<table>
  <tbody>
    <tr>
      <td>
        <b>Name</b>
      </td>
      <td>
		It must only contain letters, digits, spaces, dashes or underscores, can only start and end with alphanumeric characters, and is limited to 128 characters.
      </td>
    </tr>
    <tr>
      <td>
        <b>Type</b>
      </td>
      <td>
		Tokenizer name from the list of supported tokenizers. See <b>tokenizer_type</b> column in the [Tokenizers](#Tokenizers) table below.
      </td>
	</tr>
     <tr>
      <td>
        <b>Options</b>
      </td>
      <td>
		Must be [valid options](#Tokenizers) of a given tokenizer type.
      </td>
	</tr>
  </tbody>
</table>

###Token filters

A token filter is used to filter out or modify the tokens generated by a tokenizer. For example, you can specify a lowercase filter that converts all characters to lowercase. 
You can have multiple token filters in a custom analyzer. Token filters run in the order in which they are listed.

<table>
  <tbody>
    <tr>
      <td>
        <b>Name</b>
      </td>
      <td>
		It must only contain letters, digits, spaces, dashes or underscores, can only start and end with alphanumeric characters, and is limited to 128 characters.
      </td>
    </tr>
    <tr>
      <td>
        <b>Type</b>
      </td>
      <td>
		Token filter name from the list of supported token filters. See <b>token_filter_type</b> column in the [Token Filters](#TokenFilters) table below.
      </td>
	</tr>
     <tr>
      <td>
        <b>Options</b>
      </td>
      <td>
		Must be [valid options](#TokenFilters) of a given token filter type.
      </td>
	</tr>
  </tbody>
</table>

<a name="Example"></a>
##Index definition example

This index definition example includes one field using a custom analyzer “my_analyzer” which in turn uses a customized standard tokenzier “my_standard_tokenizer” and two token filters: lowercase and customized asciifolding filter “my_asciifolding”. 

	{
	   "name":"myindex",
	   "fields":[
	      {
	         "name":"id",
	         "type":"Edm.String",
	         "key":true,
	         "searchable":false
	      },
	      {
	         "name":"text",
	         "type":"Edm.String",
	         "searchable":true,
	         "analyzer":"my_analyzer"
	      }
	   ],
	   "analyzers":[
	      {
	         "name":"my_analyzer",
	         "@odata.type":"#Microsoft.Azure.Search.CustomAnalyzer",
	         "tokenizer":"my_standard_tokenizer",
	         "tokenFilters":[
	            "my_asciifolding",
	            "lowercase"
	         ]
	      }
	   ],
	   "tokenizers":[
	      {
	         "name":"my_standard_tokenizer",
	         "@odata.type":"#Microsoft.Azure.Search.StandardTokenizer",
	         "maxTokenLength":20
	      }
	   ],
	   "tokenFilters":[
	      {
	         "name":"my_asciifolding",
	         "@odata.type":"#Microsoft.Azure.Search.AsciiFoldingTokenFilter",
	         "preserveOriginal":true
	      }
	   ]
	}

<a name="Analyzers"></a>
##Analyzers

<table>
  <tbody>
	<thead>
	<tr>
		<td>analyzer_name</td>
		<td>analyzer_type</td>
		<td>Description</td>
		<td>Options</td>
	</tr>
	</thead>
    <tr>
      <td>[keyword](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/KeywordAnalyzer.html)</td>
      <td>#Microsoft.Azure.Search.KeywordAnalyzer</td>
	  <td>Treats the entire content of a field as a single token. This is useful for data like zip codes, ids, and some product names</td>
	  <td></td>
    </tr>
    <tr>
      <td>[pattern](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/PatternAnalyzer.html)</td>
      <td>#Microsoft.Azure.Search.PatternAnalyzer</td>
	  <td>Flexibly separates text into terms via a regular expression pattern</td>
	  <td>
		- lowercase - type: bool - should terms be lowercased, default to true
		- [pattern](http://docs.oracle.com/javase/7/docs/api/java/util/regex/Pattern.html?is-external=true) - type: string - a regular expression pattern to match token separators, default: \w+
		- [flags](http://docs.oracle.com/javase/6/docs/api/java/util/regex/Pattern.html#field_summary) - type: string - regular expression flags, default: an empty string
		- stopwords - type: string array - a list of stopwords, default: an empty list
	  </td>
    </tr>
    <tr>
      <td>[simple](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/SimpleAnalyzer.html)</td>
      <td>#Microsoft.Azure.Search.SimpleAnalyzer</td>	 
	  <td>Divides text at non-letters and converts them to lower case</td>
	  <td></td>
    </tr>
    <tr>
      <td>[snowball](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/snowball/SnowballAnalyzer.html)</td>
      <td>#Microsoft.Azure.Search.SnowballAnalyzer</td>
	  <td>A standard analyzer with the [snowball stemming filter](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/snowball/SnowballFilter.html)</td>
	  <td>
		- language - type: string - allowed values: danish, dutch, english, finnish,
		french, german, hungarian, italian, norwegian,
		portuguese, russian, spanish, swedish
		- stopwords - type: string array -  a list of stopwords, default: an empty list
	  </td>
    </tr>
    <tr>
      <td>[standard](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/standard/StandardAnalyzer.html)</td>
      <td>#Microsoft.Azure.Search.StandardAnalyzer</td>
	  <td>Standard Lucene analyzer - composed of the standard tokenizer, lowercase filter and stop filter</td>
	  <td>
		- maxTokenLength - type: int - the maximum token length, default: 255. Tokens longer than the maximum length are split.
		- stopwords - type: string array - a list of stopwords, default: an empty list
	  </td>
    </tr>
    <tr>
      <td>standardasciifolding.lucene</td>
      <td>#Microsoft.Azure.Search.StandardAsciiFoldingAnalyzer</td>	  
	  <td>Standard analyzer with Ascii folding filter</td>
	  <td></td>
    </tr>
    <tr>
      <td>[stop](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/StopAnalyzer.html)</td>
      <td>#Microsoft.Azure.Search.StopAnalyzer</td>
	  <td>Divides text at non-letters, applies the lowercase and stopword token filters</td>
	  <td>
		- stopwords - type: string array - a list of stopwords, default: an empty list
	  </td>
    </tr>
    <tr>
      <td>[whitespace](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/WhitespaceAnalyzer.html)</td>
      <td>#Microsoft.Azure.Search.WhitespaceAnalyzer</td>
	  <td>An analyzer that uses the whitespace tokenizer.</td>
	  <td></td>
    </tr>
  </tbody>
</table>

<a name="Tokenizers"></a>
##Tokenizers

<table>
  <tbody>
	<thead>
	<tr>
		<td>tokenizer_name</td>
		<td>tokenizer_type</td>
		<td>Description</td>
		<td>Options</td>
	</tr>
	</thead>
    <tr>
      <td>[classic](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/standard/ClassicTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.ClassicTokenizer</td>
	  <td>Grammar based tokenizer that is suitable for processing most European-language documents</td>
	  <td>
		- maxTokenLength - type: int - the maximum token length, default: 255. Tokens longer than the maximum length are split. 
	  </td>	  
    </tr>
    <tr>
      <td>[edgeNGram](https://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/ngram/EdgeNGramTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.EdgeNGramTokenizer</td>
	  <td>Tokenizes the input from an edge into n-grams of given size(s)</td>
	  <td>
		- minGram - type: int - default: 1
		- maxGram - type: int - default: 2
		- tokenChars - type: string array - character classes to keep in the tokens, allowed values: letter, digit, whitespace, punctuation, symbol
	  </td>	  
    </tr>
    <tr>
      <td>[keyword](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/KeywordTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.KeywordTokenizer</td>
	  <td>Emits the entire input as a single token</td>
	  <td>
		- bufferSize - type: int - read buffer size, default: 256
	  </td>
    </tr>
    <tr>
      <td>[letter](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/LetterTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.LetterTokenizer</td>
	  <td>Divides text at non-letters</td>
	  <td></td>
    </tr>
    <tr>
      <td>[lowercase](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/LowerCaseTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.LowercaseTokenizer</td>
	  <td>Divides text at non-letters and converts them to lower case</td>
	  <td></td>
    </tr>
    <tr>
      <td>[nGram](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/ngram/NGramTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.NGramTokenizer</td>
	  <td>Tokenizes the input into n-grams of the given size(s)</td>
	  <td>
		- minGram - type: int - default: 1
		- maxGram - type: int - default: 2
		- tokenChars - type: string array - character classes to keep in the tokens, allowed values: letter, digit, whitespace, punctuation, symbol
	  </td>
    </tr>
    <tr>
      <td>[path_hierarchy](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/path/PathHierarchyTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.PathHierarchyTokenizer</td>
	  <td>Tokenizer for path-like hierarchies</td>
	  <td>
		- delimiter - type: string - default: '/' 
		- replacement - type: string - if set, replaces the delimiter character, default: delimiter
		- bufferSize - type: int - default: 1024
		- reverse - type: bool - if true, generates token in reverse order, default: true
		- skip - type: bool - initial tokens to skip, default: 0
	  </td>
    </tr>
    <tr>
      <td>[pattern](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/pattern/PatternTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.PatternTokenizer</td>
	  <td>This tokenizer uses regex pattern matching to construct distinct tokens</td>
	  <td>
		 - pattern - type: string - regular expression pattern, default: \w+
		 - [flags](http://docs.oracle.com/javase/6/docs/api/java/util/regex/Pattern.html#field_summary) - type: string - regular expression flags, default: an empty string
		 - group - type: int - which group to extract into tokens, default: -1 (split)
	  </td>
    </tr>
    <tr>
      <td>[standard](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/standard/StandardTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.StandardTokenizer</td>
	  <td>Breaks text following the [Unicode Text Segmentation rules](http://unicode.org/reports/tr29/)</td>
	  <td>
		 - maxTokenLength - type: int - the maximum token length, defaults to 255. Tokens longer than the maximum length are split. 
	  </td>
    </tr>
    <tr>
      <td>[uax_url_email](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/standard/UAX29URLEmailTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.UaxEmailUrlTokenizer</td>
	  <td>Tokenizes urls and emails as one token</td>
	  <td>
		- maxTokenLength - type: int - the maximum token length, defaults to 255. Tokens longer than the maximum length are split.
	  </td>
    </tr>
    <tr>
      <td>[whitespace](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/WhitespaceTokenizer.html)</td>
      <td>#Microsoft.Azure.Search.WhitespaceTokenizer</td>
	  <td>Divides text at whitespace</td>
	  <td></td>
    </tr>
  </tbody>
</table>

<a name="TokenFilters"></a>
##Token filters

<table>
  <tbody>
	<thead>
	<tr>
		<td>token_filter_name</td>
		<td>token_filter_type</td>
		<td>Description</td>
		<td>Options</td>
	</tr>
	</thead>
    <tr>
      <td>[arabic_normalization](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/ar/ArabicNormalizationFilter.html)</td>
      <td>#Microsoft.Azure.Search.ArabicNormalizationTokenFilter</td>
	  <td>Strips all characters after an apostrophe (including the apostrophe itself)</td>
    </tr>
    <tr>
      <td>[apostrophe](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/tr/ApostropheFilter.html)</td>
      <td>#Microsoft.Azure.Search.ApostropheTokenFilter</td>
	  <td>Strips all characters after an apostrophe</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[asciifolding](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/ASCIIFoldingFilter.html)</td>
      <td>#Microsoft.Azure.Search.AsciiFoldingTokenFilter</td>
	  <td>Converts alphabetic, numeric, and symbolic Unicode characters which are not in the first 127 ASCII characters (the "Basic Latin" Unicode block) into their ASCII equivalents, if one exists</td>
	  <td>
		- preserveOriginal - type: bool - if true, the orginal token will be kept, default: false
	  </td>	  
    </tr>
    <tr>
      <td>[cjk_bigram](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/cjk/CJKBigramFilter.html)</td>
      <td>#Microsoft.Azure.Search.CjkBigramTokenFilter</td>
	  <td>Forms bigrams of CJK terms that are generated from StandardTokenizer</td>
	  <td>
		- ignoreScripts - type: bool - scripts to ignore, allowed values: han, hiragana, katakana, hangul. Default: an empty list
		- outputUnigrams  type: bool -- set to true if you always want to output both unigrams and bigrams, default: false
	  </td>	  
    </tr>
    <tr>
      <td>[cjk_width](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/cjk/CJKWidthFilter.html)</td>
      <td>#Microsoft.Azure.Search.CjkWidthTokenFilter</td>
	  <td>Normalizes CJK width differences. Folds fullwidth ASCII variants into the equivalent basic latin and half width Katakana variants into the equivalent kana</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[classic](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/standard/ClassicFilter.html)</td>
      <td>#Microsoft.Azure.Search.ClassicTokenFilter</td>
	  <td>Removes the English possessives, and dots from acronyms</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[common_grams](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/commongrams/CommonGramsFilter.html)</td>
      <td>#Microsoft.Azure.Search.CommonGramTokenFilter</td>
	  <td>Construct bigrams for frequently occurring terms while indexing. Single terms are still indexed too, with bigrams overlaid.</td>
	  <td>
		- commonWords - type: string array - the set of common words, default: an empty list
		- ignoreCase - type: bool - if true, common words matching will be case insensitive, default: false
		- queryMode - type: bool - generates bigrams then removes common words and single terms followed by a common word, default: false
	  </td>	  
    </tr>
    <tr>
      <td>[delimited_payload_filter](https://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/payloads/DelimitedPayloadTokenFilter.html)</td>
      <td>#Microsoft.Azure.Search.DelimitedPayloadTokenFilter</td>
	  <td>Characters before the delimiter are the "token", those after are the payload. For example, if the delimiter is '|', then for the string  "hello|world", "hello" is the token and "world" is the payload. You can also include an encoder to convert the payload in an appropriate way (from characters to bytes)</td>
	  <td>
		- delimiter - type: char - default: '|'
		- encoding - type: string - allowed values: int, float, identity. Default: float
	  </td>	  
    </tr>
    <tr>
      <td>[dictionary_decompounder](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/compound/DictionaryCompoundWordTokenFilter.html)</td>
      <td>#Microsoft.Azure.Search.DictionaryDecompounderTokenFilter</td>
	  <td>Decomposes compound words found in many Germanic languages</td>
	  <td>
		- wordList - type: string array - the list of words to match against, default: an empty list
		- minWordSize - type: int - only words longer than this get processed, default: 5
		- minSubwordSize - type: int - only subwords longer than this are outputted, default: 2
		- maxSubwordSize - type: int - only subwords shorter than this are outputted, default: 15
		- onlyLongestMatch - type: bool - add only the longest matching subword to output, default: false 
	  </td>	  
    </tr>
    <tr>
      <td>[edgeNGram](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/ngram/EdgeNGramTokenFilter.html)</td>
      <td>#Microsoft.Azure.Search.EdgeNGramTokenFilter</td>
	  <td>Generates n-grams of the given size(s) from starting from the front or the back of an input token</td>
	  <td>
		- minGram - type: int - default: 1
		- maxGram - type: int - default: 2
		- side - type: string - specifies which side of the input the n-gram should be generated from. Allowed values: front, back
	  </td>	  
    </tr>   
    <tr>
      <td>[elision](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/util/ElisionFilter.html)</td>
      <td>#Microsoft.Azure.Search.ElisionTokenFilter</td>
	  <td>Removes elisions. For example, "l'avion" (the plane) will be converted to "avion" (plane).</td>
	  <td>
		- articles - type: string array - a set of articles to remove, default: an empty list
	  </td>	  
    </tr>
    <tr>
      <td>[german_normalization](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/de/GermanNormalizationFilter.html)</td>
      <td>#Microsoft.Azure.Search.GermanNormalizationTokenFilter</td>
	  <td>Normalizes German characters according to the heuristics of the [German2 snowball algorithm](http://snowball.tartarus.org/algorithms/german2/stemmer.html)</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[hindi_normalization](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/hi/HindiNormalizationFilter.html)</td>
      <td>#Microsoft.Azure.Search.HindiNormalizationTokenFilter</td>
	  <td>Normalizes text in Hindi to remove some differences in spelling variations</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[indic_normalization](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/in/IndicNormalizationFilter.html)</td>
      <td>#Microsoft.Azure.Search.IndicNormalizationTokenFilter</td>
	  <td>Normalizes the Unicode representation of text in Indian languages</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[keep](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/KeepWordFilter.html)</td>
      <td>#Microsoft.Azure.Search.KeepTokenFilter</td>
	  <td>A token filter that only keeps tokens with text contained in specified list of words</td>
	  <td>
		- keepWords - type: string array - a list of words to keep, default: an empty list
		- keepWordsCase - type: bool - if true, lower case all words first, default: false
	  </td>	  
    </tr>
    <tr>
      <td>[keep_types](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/TypeTokenFilter.html)</td>
      <td>#Microsoft.Azure.Search.KeepTypesTokenFilter</td>
	  <td>Keeps tokens whose types appear in the given list of allowed types</td>
	  <td>
		- types - type: string array - a list of types to keep
	  </td>	  
    </tr>
    <tr>
      <td>[keyword_marker](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/KeywordMarkerFilter.html)</td>
      <td>#Microsoft.Azure.Search.KeywordMarkerTokenFilter</td>
	  <td>Marks terms as keywords</td>
	  <td>
		- keywords - type: string array - a list of words to mark as keywords, default: an empty list
		- ignoreCase - type: bool - if true, lower case all words first, default: false
	  </td>	  
    </tr>
    <tr>
      <td>[keyword_repeat](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/KeywordRepeatFilter.html)</td>
      <td>#Microsoft.Azure.Search.KeywordRepeatTokenFilter</td>
	  <td>Emits each incoming token twice once as keyword and once non-keyword</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[kstem](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/en/KStemFilter.html)</td>
      <td>#Microsoft.Azure.Search.KStemTokenFilter</td>
	  <td>A high-performance kstem filter for English</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[length](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/LengthFilter.html)</td>
      <td>#Microsoft.Azure.Search.LengthTokenFilter</td>
	  <td>Removes words that are too long or too short</td>
	  <td>
		- min - type: int - the minimum number, default: 0
		- max - type: int - the maximum number, default: max integer value
	  </td>	  
    </tr>
    <tr>
      <td>[limit](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/LimitTokenCountFilter.html)</td>
      <td>#Microsoft.Azure.Search.LimitTokenFilter</td>
	  <td>Limits the number of tokens while indexing</td>
	  <td>
		- maxTokenCount - type: int - max number of tokens to produce, default: 1
		- consumeAllTokens - type: bool - whether all tokens from the input must be consumed even if maxTokenCount is reached, default: false
	  </td>	  
    </tr>
    <tr>
      <td>[lowercase](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/LowerCaseFilter.html)</td>
      <td>#Microsoft.Azure.Search.LowercaseTokenFilter</td>
	  <td>Normalizes token text to lower case</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[nGram](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/ngram/NGramTokenFilter.html)</td>
      <td>#Microsoft.Azure.Search.NGramTokenFilter</td>
	  <td>Generates n-grams of the given size(s)</td>
	  <td>
		- minGram - type: int - default: 1
		- maxGram - type: int - default: 2
	  </td>	  
    </tr>
    <tr>
      <td>[pattern_capture](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/pattern/PatternCaptureGroupTokenFilter.html)</td>
      <td>#Microsoft.Azure.Search.PatternCaptureTokenFilter</td>
	  <td>Uses Java regexes to emit multiple tokens - one for each capture group in one or more patterns</td>
	  <td>
		- patterns - type: string array - a list of patterns to match against each token
		- preserveOriginal - type: bool - set to true to return the original token even if one of the patterns matches
	  </td>	  
    </tr>
    <tr>
      <td>[persian_normalization](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/fa/PersianNormalizationFilter.html)</td>
      <td>#Microsoft.Azure.Search.PersianNormalizationTokenFilter</td>
	  <td>Applies normalization for Persian</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[phonetic]https://lucene.apache.org/core/4_10_3/analyzers-phonetic/org/apache/lucene/analysis/phonetic/package-tree.html)</td>
      <td>#Microsoft.Azure.Search.PhoneticTokenFilter</td>
	  <td>Create tokens for phonetic matches.</td>
	  <td>
		- encoder - type: string - Phonetic encoder to use, allowed values: metaphone, doublemetaphone, soundex, refinedsoundex, caverphone1, caverphone2, cologne, nysiis, koelnerphonetik, haasephonetik, beidermorse. Default: metaphone
		- replace - type: bool - true if encoded tokens should replace original tokens, false if they should be added as synonyms, default: true
	  </td>	  
    </tr>
    <tr>
      <td>[porter_stem](http://lucene.apache.org/core/4_10_3/analyzers-common/org/tartarus/snowball/ext/PorterStemmer.html)</td>
      <td>#Microsoft.Azure.Search.PorterStemTokenFilter</td>
	  <td>Transforms the token stream as per the [Porter stemming algorithm](http://tartarus.org/~martin/PorterStemmer/)</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[reverse](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/reverse/ReverseStringFilter.html)</td>
      <td>#Microsoft.Azure.Search.ReverseTokenFilter</td>
	  <td>Reverses the token string</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[scandinavian_normalization](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/ScandinavianNormalizationFilter.html)</td>
      <td>#Microsoft.Azure.Search.ScandinavianNormalizationTokenFilter</td>
	  <td>Normalizes use of the interchangeable Scandinavian characters</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[scandinavian_folding](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/ScandinavianFoldingFilter.html)</td>
      <td>#Microsoft.Azure.Search.ScandinavianFoldingNormalizationTokenFilter</td>
	  <td>Folds Scandinavian characters åÅäæÄÆ->a and öÖøØ->o. It also discriminates against use of double vowels aa, ae, ao, oe and oo, leaving just the first one.</td>
	  <td></td>	  
    </tr>
    <tr>
      <td>[shingle](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/shingle/ShingleFilter.html)</td>
      <td>#Microsoft.Azure.Search.ShingleTokenFilter</td>
	  <td>Creates combinations of tokens as a single token</td>
	  <td>
		- maxShingleSize - type: int - default: 2
		- minShingleSize - type: int - default: 2
		- outputUnigrams - type: bool - if true, the output stream will contain the input tokens (unigrams) as well as shingles, dDefault: true
		- outputUnigramsIfNoShingles - type: bool - if true, override the behavior of outputUnigrams==false for those times when no shingles are available, default: false
		- tokenSeparator - type: string - the string to use when joining adjacent tokens to form a shingle, default: " "
		- filterToken - type: string - the string to insert for each position at which there is no token, default: "_"
	  </td>	  
    </tr>
    <tr>
      <td>[snowball](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/snowball/SnowballFilter.html)</td>
      <td>#Microsoft.Azure.Search.SnowballTokenFilter</td>
	  <td>Snowaball stemming token filter</td>
	  <td>
		- language - type: string - allowed values: Armenian, Basque, Catalan, Danish,
            Dutch, English, Finnish, French, German,
            German2, Hungarian, Italian, Kp, Lovins,
            Norwegian, Porter, Portuguese, Romanian,
            Russian, Spanish, Swedish, Turkish
	  </td>	  
    </tr>
	<tr>
      <td>[sorani_normalization](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/ckb/SoraniNormalizationFilter.html)</td>
      <td>#Microsoft.Azure.Search.SoraniNormalizationTokenFilter</td>
	  <td>Normalizes the Unicode representation of Sorani text</td>
	  <td></td>	  
    </tr>
	<tr>
      <td>stemmer</td>
      <td>#Microsoft.Azure.Search.StemmerTokenFilter</td>
	  <td>Language specific stemming filter</td>
	  <td>
		- language - type: string - allowed values: 
			- [arabic](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/ar/ArabicStemmer.html)
			- [armenian](http://snowball.tartarus.org/algorithms/armenian/stemmer.html)
			- [basque](http://snowball.tartarus.org/algorithms/basque/stemmer.html)
			- [brazilian](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/br/BrazilianStemmer.html)
			- [bulgarian](http://members.unine.ch/jacques.savoy/Papers/BUIR.pdf)
			- [catalan](http://snowball.tartarus.org/algorithms/catalan/stemmer.html)
			- [czech](http://portal.acm.org/citation.cfm?id=1598600)
			- [danish](http://snowball.tartarus.org/algorithms/danish/stemmer.html)
			- [dutch](http://snowball.tartarus.org/algorithms/dutch/stemmer.html)
			- [dutch_kp](http://snowball.tartarus.org/algorithms/kraaij_pohlmann/stemmer.html)
			- [english](http://snowball.tartarus.org/algorithms/porter/stemmer.html)
			- [light_english](http://ciir.cs.umass.edu/pubfiles/ir-35.pdf)
			- [minimal_english](http://www.researchgate.net/publication/220433848_How_effective_is_suffixing)
			- [possessive_english](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/en/EnglishPossessiveFilter.html)
			- [porter2](http://snowball.tartarus.org/algorithms/english/stemmer.html)
			- [lovins](http://snowball.tartarus.org/algorithms/lovins/stemmer.html)
			- [finnish](http://snowball.tartarus.org/algorithms/finnish/stemmer.html)
			- [light_finnish](http://clef.isti.cnr.it/2003/WN_web/22.pdf)
			- [french](http://snowball.tartarus.org/algorithms/french/stemmer.html)
			- [light_french](http://dl.acm.org/citation.cfm?id=1141523)
			- [minimal_french](http://dl.acm.org/citation.cfm?id=318984)
			- [galician](http://bvg.udc.es/recursos_lingua/stemming.jsp)
			- [minimal_galician](http://bvg.udc.es/recursos_lingua/stemming.jsp)
			- [german](http://snowball.tartarus.org/algorithms/german/stemmer.html)
			- [german2](http://snowball.tartarus.org/algorithms/german2/stemmer.html)
			- [light_german](http://dl.acm.org/citation.cfm?id=1141523)
			- [minimal_german](http://members.unine.ch/jacques.savoy/clef/morpho.pdf)
			- [greek](http://sais.se/mthprize/2007/ntais2007.pdf)
			- [hindi](http://computing.open.ac.uk/Sites/EACLSouthAsia/Papers/p6-Ramanathan.pdf)
			- [hungarian](http://snowball.tartarus.org/algorithms/hungarian/stemmer.html)
			- [light_hungarian](http://dl.acm.org/citation.cfm?id=1141523&dl=ACM&coll=DL&CFID=179095584&CFTOKEN=80067181)
			- [indonesian](http://www.illc.uva.nl/Publications/ResearchReports/MoL-2003-02.text.pdf)
			- [irish](http://snowball.tartarus.org/otherapps/oregan/intro.html)
			- [italian](http://snowball.tartarus.org/algorithms/italian/stemmer.html)
			- [light_italian](http://www.ercim.eu/publication/ws-proceedings/CLEF2/savoy.pdf)
			- [sorani](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/ckb/SoraniStemmer.html)
			- [latvian](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/lv/LatvianStemmer.html)
			- [norwegian](http://snowball.tartarus.org/algorithms/norwegian/stemmer.html)
			- [light_norwegian](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/no/NorwegianLightStemmer.html)
			- [minimal_norwegian](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/no/NorwegianMinimalStemmer.html)
			- [light_nynorsk](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/no/NorwegianLightStemmer.html)
			- [minimal_nynorsk](http://lucene.apache.org/core/4_9_0/analyzers-common/org/apache/lucene/analysis/no/NorwegianMinimalStemmer.html)
			- [portuguese](http://snowball.tartarus.org/algorithms/portuguese/stemmer.html)
			- [light_portuguese](http://dl.acm.org/citation.cfm?id=1141523&dl=ACM&coll=DL&CFID=179095584&CFTOKEN=80067181)
			- [minimal_portuguese](http://www.inf.ufrgs.br/~buriol/papers/Orengo_CLEF07.pdf)
			- [portuguese_rslp](http://www.inf.ufrgs.br//~viviane/rslp/index.htm)
			- [romanian](http://snowball.tartarus.org/algorithms/romanian/stemmer.html)
			- [russian](http://snowball.tartarus.org/algorithms/russian/stemmer.html)
			- [light_russian](http://doc.rero.ch/lm.php?url=1000%2C43%2C4%2C20091209094227-CA%2FDolamic_Ljiljana_-_Indexing_and_Searching_Strategies_for_the_Russian_20091209.pdf)
			- [spanish](http://snowball.tartarus.org/algorithms/spanish/stemmer.html)
			- [light_spanish](http://www.ercim.eu/publication/ws-proceedings/CLEF2/savoy.pdf)
			- [swedish](http://snowball.tartarus.org/algorithms/swedish/stemmer.html)
			- [light_swedish](http://clef.isti.cnr.it/2003/WN_web/22.pdf)
			- [turkish](http://snowball.tartarus.org/algorithms/turkish/stemmer.html)
	  </td>	  
    </tr>
	<tr>
      <td>[stemmer_override](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/StemmerOverrideFilter.html)</td>
      <td>#Microsoft.Azure.Search.StemmerOverrideTokenFilter</td>
	  <td>Any dictionary-stemmed terms will be marked as keywords so that they will not be stemmed with stemmers down the chain. Must be placed before any stemming filters.</td>
	  <td>
		- rules - type: string array - stemming rules in the following format "word => stem" e.g. "ran => run", default: an empty list
	  </td>	  
    </tr>
	<tr>
      <td>[stop](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/StopFilter.html)</td>
      <td>#Microsoft.Azure.Search.StopTokenFilter</td>
	  <td>Removes stop words from a token stream</td>
	  <td>
		- stopwords - type: string array - the list of stopwords, default: an empty list.
		- stopwords_list - type: string - predefined list of stopwords, allowed values: _arabic_, _armenian_, _basque_, 	_brazilian_, _bulgarian_, _catalan_, _czech_, _danish_, _dutch_,
            _english_, _finnish_, _french_, _galician_, _german_,
            _greek_, _hindi_, _hungarian_, _indonesian_, _irish_,
            _italian_, _latvian_, _norwegian_, _persian_, _portuguese_,
            _romanian_, _russian_, _sorani_, _spanish_, _swedish_,
            _thai_, _turkish_, default: _english_
		- ignoreCase - type: bool - if true, all words are lower cased first, default: false
		- removeTrailing - type: bool - if true, ignore the last search term if it's a stop word, default: true
	  </td>	  
    </tr>
	<tr>
      <td>[synonym](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/synonym/SynonymFilter.html)</td>
      <td>#Microsoft.Azure.Search.SynonymTokenFilter</td>
	  <td>Matches single or multi word synonyms in a token stream</td>
	  <td>
		- synonyms - type: string array - list of synonyms in following one of two formats:
			- incredible, unbelievable, fabulous => amazing - all terms on the left side of => symbol will be replaced with all terms on its right side
			- incredible, unbelievable, fabulous, amazing - comma separated list of equivalent words. Set the expand option to change how this list is interpreted
		- ignoreCase - type: bool - case-folds input for matching, default: false
		- expand - type: bool - 
							- if true, all words in the list of synonyms (if => notation is not used) will map to one another. The following list: incredible, unbelievable, fabulous, amazing is equivalent to: incredible, unbelievable, fabulous, amazing => incredible, unbelievable, fabulous, amazing
							- if false, the following list: incredible, unbelievable, fabulous, amazing will be equivalent to: incredible, unbelievable, fabulous, amazing => incredible   
	  </td>	  
    </tr>
	<tr>
      <td>[trim](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/TrimFilter.html)</td>
      <td>#Microsoft.Azure.Search.TrimTokenFilter</td>
	  <td>Trims leading and trailing whitespace from tokens</td>
	  <td></td>	  
    </tr>
	<tr>
      <td>[truncate](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/TruncateTokenFilter.html)</td>
      <td>#Microsoft.Azure.Search.TruncateTokenFilter</td>
	  <td>Truncates the terms into a specific length</td>
	  <td>
		- length - type: int - required option
	  </td>	  
    </tr>
	<tr>
      <td>[unique](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/RemoveDuplicatesTokenFilter.html)</td>
      <td>#Microsoft.Azure.Search.UniqueTokenFilter</td>
	  <td>Filters out tokens with same text as the previous token</td>
	  <td>
		- onlyOnSamePosition - type: bool - if set, removes duplicates only at the same position, default: true
	  </td>	  
    </tr>
    <tr>
      <td>[uppercase](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/core/UpperCaseFilter.html)</td>
      <td>#Microsoft.Azure.Search.UppercaseTokenFilter</td>
	  <td>Normalizes token text to upper case</td>
	  <td></td>	  
    </tr>
	<tr>
      <td>[word_delimiter](http://lucene.apache.org/core/4_10_3/analyzers-common/org/apache/lucene/analysis/miscellaneous/WordDelimiterFilter.html)</td>
      <td>#Microsoft.Azure.Search.WordDelimiterTokenFilter</td>
	  <td>Splits words into subwords and performs optional transformations on subword groups</td>
	  <td>
		- generateWordParts - type: bool - causes parts of words to be generated e.g. "AzureSearch" -> "Azure" "Search", default: true
		- generateNumberParts - type: bool - causes number subwords to be generated, default: true
		- catenateWords - type: bool - causes maximum runs of word parts to be catenated e.g. "Azure-Search" -> "AzureSearch", default: false 
		- catenateNumbers - type: bool - causes maximum runs of number parts to be catenated e.g. "1-2" -> "12", default: false
		- catenateAll - type: bool - causes all subword parts to be catenated e.g "Azure-Search-1" -> "AzureSearch1", default: false
		- splitOnCaseChange - type: bool - if true, splits words on caseChange e.g. "AzureSearch" -> "Azure" "Search", default: true 
		- preserveOriginal - causes original words to be preserved and added to the subword list, default: false
		- splitOnNumerics - type: bool - if true, splits on numbers e.g., "Azure1Search" -> "Azure" "8" "Search", default: true
		- stemEnglishPossessive - type: bool - causes trailing "'s" to be removed for each subword, default: true 
		- protectedWords - type: string array - tokens to protect from being delimited, default: an empty list
	  </td>	  
    </tr>
  </tbody>
</table>

**See Also**
[Azure Search Service REST API](http://msdn.microsoft.com/library/azure/dn798935.aspx) on MSDN <br/>
[Create Index (Azure Search API)](http://msdn.microsoft.com/library/azure/dn798941.aspx) on MSDN<br/>