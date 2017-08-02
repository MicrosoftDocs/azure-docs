---
title: Infrequent questions with good answers (Azure Search) | Microsoft Docs
description: Troubleshooting help for valid but infrequently asked questions about Microsoft Azure Search Service
services: search
author: HeidiSteen
manager: jhubbard

ms.service: search
ms.technology: search
ms.topic: article
ms.date: 08/01/2017
ms.author: heidist
---

# Azure Search - Uncommon questions (UQ) with good technical answers (troubleshooting...)
 
This article is a companion to [frequently asked questions](search-faq-frequently-asked-questions.md). It's a collection of not-so-frequently asked questions - and deeper technical answers - for developers encountering harder problems not already discussed on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-search) or other forums. 
 

## Hit highlighting over-extension: entire field is highlighted 

 All wildcard search queries, such as prefix, fuzzy, and regex, first go through an internal query expansion process before the actual search. For example, let’s suppose that in a field of a document, you have the following text “term1 term2”. Let’s also suppose that you are using the default standard analyzer, which tokenizes text based on white space, symbols and etc. The standard analyzer tokenizes the text to <term1> and <term2> and the tokenized terms are stored in the search index. Now, when a regex query like /.*term.*/ is issued against the search index, the internal expansion process rewrites the query with the matching terms in the index, so the regex query “/.*term.*/” is rewritten to “term1 OR term2”. The highlighter highlights the expanded terms, not the pattern so both of the matching words in the document gets highlighted <em>term1</em> <em>term2</em>. 

In your specific case, I suspect you are using a keyword analyzer in one of the fields you are searching. Keyword analyzer treats the entire field value as a single token (ie, no whitespace tokenization). A wildcard search against such field can be rewritten with the entire field value. With the example above, with the keyword analyzer, “term1 term2” is analyzed to a single token <term1 term2> and a regex seardch /.*term.*/ is rewritten to “term1 term2” and finally the highlighter highlights the entire field because the entire field value matched. Please let me know if this is not the case. I can take a closer look.

Using wildcard searches cause this behavior because queries are internally rewritten. To workaround, you will need to issue regular term searches, no wildcard. How can you do “contains” query with a regular term search? Please take a look at nGramTokenizer or nGramTokenFilter and examples in https://docs.microsoft.com/en-us/rest/api/searchservice/custom-analyzers-in-azure-search. A custom analysis with the component generates n-grams (abc => <a>, <b>, <c>, <ab>, <bc>, <abc>). At indexing, you can use a custom analyzer that generates ngrams for the search index. At query time, you don’t need the ngrams so I would use either standard or keyword analyzer as the queryAnalyzer. With the configuration, you can simply issue a regular term search because the search index has partial/ngram terms you can directly match against. With the approach, highlight will return as you’d expect and also the query latency will improve because the internal query expansion process is now omitted. Please do, however, keep an eye on the index size because it will be bigger with this configuration. 


## See also

  [StackOverflow: Azure Search](https://stackoverflow.com/questions/tagged/azure-search)     
  [User Voice web site](https://feedback.azure.com/forums/263029-azure-search)     



