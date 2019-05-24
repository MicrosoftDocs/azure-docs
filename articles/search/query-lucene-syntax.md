---
title: Lucene query syntax - Azure Search
description: Reference for the full Lucene syntax, as used with Azure Search.
services: search
ms.service: search
ms.topic: conceptual
ms.date: 05/13/2019

author: "brjohnstmsft"
ms.author: "brjohnst"
ms.manager: cgronlun
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# Lucene query syntax in Azure Search
You can write queries against Azure Search based on the rich [Lucene Query Parser](https://lucene.apache.org/core/4_10_2/queryparser/org/apache/lucene/queryparser/classic/package-summary.html) syntax for specialized query forms: wildcard, fuzzy search, proximity search, regular expressions are a few examples. Much of the Lucene Query Parser syntax is [implemented intact in Azure Search](search-lucene-query-architecture.md), with the exception of *range searches* which are constructed in Azure Search through `$filter` expressions. 

## How to invoke full parsing

Set the `queryType` search parameter to specify which parser to use. Valid values include `simple|full`, with `simple` as the default, and `full` for Lucene. 

<a name="bkmk_example"></a> 

### Example showing full syntax

The following example finds documents in the index using the Lucene query syntax, evident in the `queryType=full` parameter. This query returns hotels where the category field contains the term "budget" and all searchable fields containing the phrase "recently renovated". Documents containing the phrase "recently renovated" are ranked higher as a result of the term boost value (3).  

The `searchMode=all` parameter is relevant in this example. Whenever operators are on the query, you should generally set `searchMode=all` to ensure that *all* of the criteria is matched.

```
GET /indexes/hotels/docs?search=category:budget AND \"recently renovated\"^3&searchMode=all&api-version=2019-05-06&querytype=full
```

 Alternatively, use POST:  

```
POST /indexes/hotels/docs/search?api-version=2019-05-06
{
  "search": "category:budget AND \"recently renovated\"^3",
  "queryType": "full",
  "searchMode": "all"
}
```

For additional examples, see [Lucene query syntax examples for building queries in Azure Search](search-query-lucene-examples.md). For details about specifying the full contingent of query parameters, see [Search Documents &#40;Azure Search Service REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents).

> [!NOTE]  
>  Azure Search also supports [Simple Query Syntax](query-simple-syntax.md), a simple and robust query language that can be used for straightforward keyword search.  

##  <a name="bkmk_syntax"></a> Syntax fundamentals  
 The following syntax fundamentals apply to all queries that use the Lucene syntax.  

### Operator evaluation in context

Placement determines whether a symbol is interpreted as an operator or just another character in a string.

For example, in Lucene full syntax, the tilde (~) is used for both fuzzy search and proximity search. When placed after a quoted phrase, ~ invokes proximity search. When placed at the end of a term, ~ invokes fuzzy search.

Within a term, such as "business~analyst", the character is not evaluated as an operator. In this case, assuming the query is a term or phrase query, [full text search](search-lucene-query-architecture.md) with [lexical analysis](search-lucene-query-architecture.md#stage-2-lexical-analysis) strips out the ~ and breaks the term "business~analyst" in two: business OR analyst.

The example above is the tilde (~), but the same principle applies to every operator.

### Escaping special characters

 Special characters must be escaped to be used as part of the search text. You can escape them by prefixing them with backslash (\\). Special characters that need to be escaped include the following:  
`+ - && || ! ( ) { } [ ] ^ " ~ * ? : \ /`  

 For example, to escape a wildcard character, use \\\*.

### Encoding unsafe and reserved characters in URLs

 Please ensure all unsafe and reserved characters are encoded in a URL. For example, '#' is an unsafe character because it is a fragement/anchor identifier in a URL. The character must be encoded to `%23` if used in a URL. '&' and '=' are examples of reserved characters as they delimit parameters and specify values in Azure Search. Please see [RFC1738: Uniform Resource Locators (URL)](https://www.ietf.org/rfc/rfc1738.txt) for more details.

 Unsafe characters are ``" ` < > # % { } | \ ^ ~ [ ]``. Reserved characters are `; / ? : @ = + &`.

### Precedence operators: grouping and field grouping  
 You can use parentheses to create subqueries, including operators within the parenthetical statement. For example, `motel+(wifi||luxury)` will search for documents containing the "motel" term and either "wifi" or "luxury" (or both).

Field grouping is similar but scopes the grouping to a single field. For example, `hotelAmenities:(gym+(wifi||pool))` searches the field "hotelAmenities" for "gym" and "wifi", or "gym" and "pool".  

### SearchMode parameter considerations  
 The impact of `searchMode` on queries, as described in [Simple query syntax in Azure Search](query-simple-syntax.md), applies equally to the Lucene query syntax. Namely, `searchMode` in conjunction with NOT operators can result in query outcomes that might seem unusual if you aren't clear on the implications of how you set the parameter. If you retain the default, `searchMode=any`, and use a NOT operator, the operation is computed as an OR action, such that "New York" NOT "Seattle" returns all cities that are not Seattle.  

##  <a name="bkmk_boolean"></a> Boolean operators (AND, OR, NOT) 
 Always specify text boolean operators (AND, OR, NOT) in all caps.  

### OR operator `OR` or `||`

The OR operator is a vertical bar or pipe character. For example: `wifi || luxury` will search for documents containing either "wifi" or "luxury" or both. Because OR is the default conjunction operator, you could also leave it out, such that `wifi luxury` is the equivalent of  `wifi || luxuery`.

### AND operator `AND`, `&&` or `+`

The AND operator is an ampersand or a plus sign. For example: `wifi && luxury` will search for documents containing both "wifi" and "luxury". The plus character (+) is used for required terms. For example, `+wifi +luxury` stipulates that both terms must appear somewhere in the field of a single document.


### NOT operator `NOT`, `!` or `-`

The NOT operator is an exclamation point or the minus sign. For example: `wifi !luxury` will search for documents that have the "wifi" term and/or do not have "luxury". The `searchMode` option controls whether a term with the NOT operator is ANDed or ORed with the other terms in the query in the absence of a + or || operator. Recall that `searchMode` can be set to either `any`(default) or `all`.

Using `searchMode=any` increases the recall of queries by including more results, and by default - will be interpreted as "OR NOT". For example, `wifi -luxury` will match documents that either contain the term *wifi* or those that do not contain the term *luxury.*

Using `searchMode=all` increases the precision of queries by including fewer results, and by default - will be interpreted as "AND NOT". For example, `wifi -luxury` will match documents that contain the term `wifi` and do not contain the term `luxury`. This is arguably a more intuitive behavior for the - operator. Therefore, you should consider choosing `searchMode=all` over `searchMode=any` if you want to optimize searches for precision instead of recall *and* your users frequently use the `-` operator in searches.

##  <a name="bkmk_querysizelimits"></a> Query size limitations  
 There is a limit to the size of queries that you can send to Azure Search. Specifically, you can have at most 1024 clauses (expressions separated by AND, OR, and so on). There is also a limit of approximately 32 KB on the size of any individual term in a query. If your application generates search queries programmatically, we recommend designing it in such a way that it does not generate queries of unbounded size.  

##  <a name="bkmk_searchscoreforwildcardandregexqueries"></a> Scoring wildcard and regex queries
 Azure Search uses frequency-based scoring ([TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)) for text queries. However, for wildcard and regex queries where scope of terms can potentially be broad, the frequency factor is ignored to prevent the ranking from biasing towards matches from rarer terms. All matches are treated equally for wildcard and regex searches.

##  <a name="bkmk_fields"></a> Fielded search  
You can define a fielded search operation with the `fieldName:searchExpression` syntax, where the search expression can be a single word or a phrase, or a more complex expression in parentheses, optionally with Boolean operators. Some examples include the following:  

- genre:jazz NOT history  

- artists:("Miles Davis" "John Coltrane")

Be sure to put multiple strings within quotation marks if you want both strings to be evaluated as a single entity, in this case searching for two distinct artists in the `artists` field.  

The field specified in `fieldName:searchExpression` must be a `searchable` field.  See [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) for details on how index attributes are used in field definitions.  

> [!NOTE]
> When using fielded search expressions, you do not need to use the `searchFields` parameter because each fielded search expression has a field name explicitly specified. However, you can still use the `searchFields` parameter if you want to run a query where some parts are scoped to a specific field, and the rest could apply to several fields. For example, the query `search=genre:jazz NOT history&searchFields=description` would match `jazz` only to the `genre` field, while it would match `NOT history` with the `description` field. The field name provided in `fieldName:searchExpression` always takes precedence over the `searchFields` parameter, which is why in this example, we do not need to include `genre` in the `searchFields` parameter.

##  <a name="bkmk_fuzzy"></a> Fuzzy search  
 A fuzzy search finds matches in terms that have a similar construction. Per [Lucene documentation](https://lucene.apache.org/core/4_10_2/queryparser/org/apache/lucene/queryparser/classic/package-summary.html), fuzzy searches are based on [Damerau-Levenshtein Distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance). Fuzzy searches can expand a term up to the maximum of 50 terms that meet the distance criteria. 

 To do a fuzzy search, use the tilde "~" symbol at the end of a single word with an optional parameter, a number between 0 and 2 (default), that specifies the edit distance. For example, "blue~" or "blue~1" would return "blue", "blues", and "glue".

 Fuzzy search can only be applied to terms, not phrases, but you can append the tilde to each term individually in a multi-part name or phrase. For example, "Unviersty~ of~ "Wshington~" would match on "University of Washington".
 

##  <a name="bkmk_proximity"></a> Proximity search  
 Proximity searches are used to find terms that are near each other in a document. Insert a tilde "~" symbol at the end of a phrase followed by the number of words that create the proximity boundary. For example, `"hotel airport"~5` will find the terms "hotel" and "airport" within 5 words of each other in a document.  


##  <a name="bkmk_termboost"></a> Term boosting  
 Term boosting refers to ranking a document higher if it contains the boosted term, relative to documents that do not contain the term. This differs from scoring profiles in that scoring profiles boost certain fields, rather than specific terms.  

The following example helps illustrate the differences. Suppose that there's a scoring profile that boosts matches in a certain field, say *genre* in the  [musicstoreindex example](index-add-scoring-profiles.md#bkmk_ex). Term boosting could be used to further boost certain search terms higher than others. For example, `rock^2 electronic` will boost documents that contain the search terms in the genre field higher than other searchable fields in the index. Further, documents that contain the search term *rock* will be ranked higher than the other search term *electronic* as a result of the term boost value (2).  

 To boost a term use the caret, "^", symbol with a boost factor (a number) at the end of the term you are searching. You can also boost phrases. The higher the boost factor, the more relevant the term will be relative to other search terms. By default, the boost factor is 1. Although the boost factor must be positive, it can be less than 1 (for example, 0.20).  

##  <a name="bkmk_regex"></a> Regular expression search  
 A regular expression search finds a match based on the contents between forward slashes "/", as documented in the [RegExp class](https://lucene.apache.org/core/4_10_2/core/org/apache/lucene/util/automaton/RegExp.html).  

 For example, to find documents containing "motel" or "hotel", specify `/[mh]otel/`.  Regular expression searches are matched against single words.   

##  <a name="bkmk_wildcard"></a> Wildcard search  
 You can use generally recognized syntax for multiple (*) or single (?) character wildcard searches. Note the Lucene query parser supports the use of these symbols with a single term, and not a phrase.  

 For example, to find documents containing the words with the prefix "note", such as "notebook" or "notepad", specify "note*".  

> [!NOTE]  
>  You cannot use a * or ? symbol as the first character of a search.  
>  No text analysis is performed on wildcard search queries. At query time, wildcard query terms are compared against analyzed terms in the search index and expanded.

## See also  

+ [Search Documents](https://docs.microsoft.com/rest/api/searchservice/Search-Documents)
+ [OData expression syntax for filters and sorting](query-odata-filter-orderby-syntax.md)   
+ [Simple query syntax in Azure Search](query-simple-syntax.md)   
