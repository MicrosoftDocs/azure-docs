---
title: Lucene query syntax
titleSuffix: Azure AI Search
description: Reference for the full Lucene query syntax, as used in Azure AI Search for wildcard, fuzzy search, RegEx, and other advanced query constructs.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/17/2024
---

# Lucene query syntax in Azure AI Search

When creating queries in Azure AI Search, you can opt for the full [Lucene Query Parser](https://lucene.apache.org/core/6_6_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html) syntax for specialized query forms: wildcard, fuzzy search, proximity search, regular expressions. Much of the Lucene Query Parser syntax is [implemented intact in Azure AI Search](search-lucene-query-architecture.md), except for *range searches, which are constructed through **`$filter`** expressions. 

To use full Lucene syntax, set the queryType to `full` and pass in a query expression patterned for wildcard, fuzzy search, or one of the other query forms supported by the full syntax. In REST, query expressions are provided in the **`search`** parameter of a [Search Documents (REST API)](/rest/api/searchservice/search-documents) request.

## Example (full syntax)

The following example is a search request constructed using the full syntax. This particular example shows in-field search and term boosting. It looks for hotels where the category field contains the term `budget`. Any documents containing the phrase `"recently renovated"` are ranked higher as a result of the term boost value (3).  

```http
POST /indexes/hotels-sample-index/docs/search?api-version=2023-11-01
{
  "queryType": "full",
  "search": "category:budget AND \"recently renovated\"^3",
  "searchMode": "all"
}
```

While not specific to any query type, the **`searchMode`** parameter is relevant in this example. Whenever operators are on the query, you should generally set `searchMode=all` to ensure that *all* of the criteria are matched.  

For more examples, see [Lucene query syntax examples](search-query-lucene-examples.md). For details about the query request and parameters, including searchMode, see [Search Documents (REST API)](/rest/api/searchservice/Search-Documents).

## <a name="bkmk_syntax"></a> Syntax fundamentals  

The following syntax fundamentals apply to all queries that use the Lucene syntax.  

### Operator evaluation in context

Placement determines whether a symbol is interpreted as an operator or just another character in a string.

For example, in Lucene full syntax, the tilde (`~`) is used for both fuzzy search and proximity search. When placed after a quoted phrase, `~` invokes proximity search. When placed at the end of a term, `~` invokes fuzzy search.

Within a term, such as `business~analyst`, the character isn't evaluated as an operator. In this case, assuming the query is a term or phrase query, [full text search](search-lucene-query-architecture.md) with [lexical analysis](search-lucene-query-architecture.md#stage-2-lexical-analysis) strips out the `~` and breaks the term `business~analyst` in two: `business` OR `analyst`.

The example above is the tilde (`~`), but the same principle applies to every operator.

### Escaping special characters

In order to use any of the search operators as part of the search text, escape the character by prefixing it with a single backslash (`\`). For example, for a wildcard search on `https://`, where `://` is part of the query string, you would specify `search=https\:\/\/*`. Similarly, an escaped phone number pattern might look like this `\+1 \(800\) 642\-7676`.

Special characters that require escaping include the following:  
`+ - & | ! ( ) { } [ ] ^ " ~ * ? : \ /`  

> [!NOTE]  
> Although escaping keeps tokens together, [lexical analysis](search-lucene-query-architecture.md#stage-2-lexical-analysis) during indexing may strip them out. For example, the standard Lucene analyzer will break words on hyphens, whitespace, and other characters. If you require special characters in the query string, you might need an analyzer that preserves them in the index. Some choices include Microsoft natural [language analyzers](index-add-language-analyzers.md), which preserves hyphenated words, or a custom analyzer for more complex patterns. For more information, see [Partial terms, patterns, and special characters](search-query-partial-matching.md).

### Encoding unsafe and reserved characters in URLs

Ensure all unsafe and reserved characters are encoded in a URL. For example, `#` is an unsafe character because it's a fragment/anchor identifier in a URL. The character must be encoded to `%23` if used in a URL. `&` and `=` are examples of reserved characters as they delimit parameters and specify values in Azure AI Search. See [RFC1738: Uniform Resource Locators (URL)](https://www.ietf.org/rfc/rfc1738.txt) for more details.

Unsafe characters are ``" ` < > # % { } | \ ^ ~ [ ]``. Reserved characters are `; / ? : @ = + &`.

## <a name="bkmk_boolean"></a> Boolean operators

You can embed Boolean operators in a query string to improve the precision of a match. The full syntax supports text operators in addition to character operators. Always specify text boolean operators (AND, OR, NOT) in all caps.

|Text operator | Character | Example | Usage |
|--------------|----------- |--------|-------|
| AND | `+` | `wifi AND luxury` | Specifies terms that a match must contain. In the example, the query engine looks for documents containing both `wifi` and `luxury`. The plus character (`+`) can also be used directly in front of a term to make it required. For example, `+wifi +luxury` stipulates that both terms must appear somewhere in the field of a single document.|
| OR | (none) <sup>1</sup> | `wifi OR luxury` | Finds a match when either term is found. In the example, the query engine returns match on documents containing either `wifi` or `luxury` or both. Because OR is the default conjunction operator, you could also leave it out, such that `wifi luxury` is the equivalent of  `wifi OR luxury`.|
| NOT | `!`, `-` | `wifi –luxury` | Returns a match on documents that exclude the term. For example, `wifi –luxury` searches for documents that have the `wifi` term but not `luxury`. |

<sup>1</sup> The `|` character isn't supported for OR operations.

### <a name="bkmk_boolean_not"></a> NOT Boolean operator

> [!Important]
> 
> The NOT operator (`NOT`, `!`, or `-`) behaves differently in full syntax than it does in simple syntax.

* In simple syntax, queries with negation always have a wildcard automatically added. For example, the query `-luxury` is automatically expanded to `-luxury *`.
* In full syntax, queries with negation cannot be combined with a wildcard. For example, the queries `-luxury *` is not allowed.
* In full syntax, queries with a single negation are not allowed. For example, the query `-luxury` is not allowed.
* In full syntax, negations will behave as if they are always ANDed onto the query regardless of the search mode.
   * For example, the full syntax query `wifi -luxury` in full syntax only fetches documents that contain the term `wifi`, and then applies the negation `-luxury` to those documents.
* If you want to use negations to search over all documents in the index, simple syntax with the any search mode is recommended.
* If you want to use negations to search over a subset of documents in the index, full syntax or the simple syntax with the all search mode are recommended.

| Query Type | Search Mode | Example Query | Behavior |
| ---------- | ----------- | ------------- | -------- |
| Simple     | any         | `wifi -luxury`| Returns all documents in the index. Documents with the term "wifi" or documents missing the term "luxury" are ranked higher than other documents. The query is expanded to `wifi OR -luxury OR *`. |
| Simple     | all         | `wifi -luxury`| Returns only documents in the index that contain the term "wifi" and don't contain the term "luxury". The query is expanded to `wifi AND -luxury AND *`. |
| Full       | any         | `wifi -luxury`| Returns only documents in the index that contain the term "wifi", and then documents that contain the term "luxury" are removed from the results. |
| Full       | all         | `wifi -luxury`| Returns only documents in the index that contain the term "wifi", and then documents that contain the term "luxury" are removed from the results. |

##  <a name="bkmk_fields"></a> Fielded search

You can define a fielded search operation with the `fieldName:searchExpression` syntax, where the search expression can be a single word or a phrase, or a more complex expression in parentheses, optionally with Boolean operators. Some examples include the following:  

- `genre:jazz NOT history`  

- `artists:("Miles Davis" "John Coltrane")`

Be sure to put multiple strings within quotation marks if you want both strings to be evaluated as a single entity, in this case searching for two distinct artists in the `artists` field.  

The field specified in `fieldName:searchExpression` must be a `searchable` field.  See [Create Index](/rest/api/searchservice/create-index) for details on how index attributes are used in field definitions.  

> [!NOTE]
> When using fielded search expressions, you do not need to use the `searchFields` parameter because each fielded search expression has a field name explicitly specified. However, you can still use the `searchFields` parameter if you want to run a query where some parts are scoped to a specific field, and the rest could apply to several fields. For example, the query `search=genre:jazz NOT history&searchFields=description` would match `jazz` only to the `genre` field, while it would match `NOT history` with the `description` field. The field name provided in `fieldName:searchExpression` always takes precedence over the `searchFields` parameter, which is why in this example, we do not need to include `genre` in the `searchFields` parameter.

##  <a name="bkmk_fuzzy"></a> Fuzzy search

A fuzzy search finds matches in terms that have a similar construction, expanding a term up to the maximum of 50 terms that meet the distance criteria of two or less. For more information, see [Fuzzy search](search-query-fuzzy.md).

To do a fuzzy search, use the tilde `~` symbol at the end of a single word with an optional parameter, a number between 0 and 2 (default), that specifies the edit distance. For example, `blue~` or `blue~1` would return `blue`, `blues`, and `glue`.

Fuzzy search can only be applied to terms, not quotation-enclosed phrases, but you can append the tilde to each term individually in a multi-part name or phrase. For example, `Unviersty~ of~ Wshington~` would match on `University of Washington`.

##  <a name="bkmk_proximity"></a> Proximity search

Proximity searches are used to find terms that are near each other in a document. Insert a tilde `~` symbol at the end of a phrase followed by the number of words that create the proximity boundary. For example, `"hotel airport"~5` finds the terms `hotel` and `airport` within five words of each other in a document.  

##  <a name="bkmk_termboost"></a> Term boosting

Term boosting refers to ranking a document higher if it contains the boosted term, relative to documents that don't contain the term. This differs from scoring profiles in that scoring profiles boost certain fields, rather than specific terms.  

The following example helps illustrate the differences. Suppose that there's a scoring profile that boosts matches in a certain field, say *genre* in the  [musicstoreindex example](index-add-scoring-profiles.md#bkmk_ex). Term boosting could be used to further boost certain search terms higher than others. For example, `rock^2 electronic` boosts documents that contain the search terms in the genre field higher than other searchable fields in the index. Further, documents that contain the search term *rock* are ranked higher than the other search term *electronic* as a result of the term boost value (2).  

 To boost a term, use the caret, `^`, symbol with a boost factor (a number) at the end of the term you're searching. You can also boost phrases. The higher the boost factor, the more relevant the term is relative to other search terms. By default, the boost factor is 1. Although the boost factor must be positive, it can be less than 1 (for example, 0.20).  

##  <a name="bkmk_regex"></a> Regular expression search
 
 A regular expression search finds a match based on patterns that are valid under Apache Lucene, as documented in the [RegExp class](https://lucene.apache.org/core/6_6_1/core/org/apache/lucene/util/automaton/RegExp.html). In Azure AI Search, a regular expression is enclosed between forward slashes `/`.

 For example, to find documents containing `motel` or `hotel`, specify `/[mh]otel/`. Regular expression searches are matched against single words.

Some tools and languages impose other escape character requirements. For JSON, strings that include a forward slash are escaped with a backward slash: `microsoft.com/azure/` becomes `search=/.*microsoft.com\/azure\/.*/` where `search=/.* <string-placeholder>.*/` sets up the regular expression, and `microsoft.com\/azure\/` is the string with an escaped forward slash.

Two common symbols in regex queries are `.` and `*`. A `.` matches any one character and a `*` matches the previous character zero or more times.  For example, `/be./` matches the terms `bee` and `bet` while `/be*/` would match `be`, `bee`, and `beee` but not `bet`. Together, `.*` allow you to match any series of characters so `/be.*/` would match any term that starts with `be` such as `better`.

##  <a name="bkmk_wildcard"></a> Wildcard search

You can use generally recognized syntax for multiple (`*`) or single (`?`) character wildcard searches. Full Lucene syntax supports prefix, infix, and suffix matching. 

Note the Lucene query parser supports the use of these symbols with a single term, and not a phrase.

| Affix type | Description and examples |
|------------|--------------------------|
| prefix | Term fragment comes before `*` or `?`.  For example, a query expression of `search=alpha*` returns `alphanumeric` or `alphabetical`. Prefix matching is supported in both simple and full syntax. |
| suffix | Term fragment comes after  `*` or `?`, with a forward slash to delimit the construct. For example, `search=/.*numeric/` returns  `alphanumeric`. |
| infix  | Term fragments enclose `*` or `?`.  For example, `search=non*al` returns `non-numerical` and `nonsensical`. |

You can combine operators in one expression. For example, `980?2*` matches on `98072-1222` and `98052-1234`, where `?` matches on a single (required) character, and `*` matches on characters of an arbitrary length that follow.

Suffix matching requires the regular expression forward slash `/` delimiters. Generally, you can’t use a `*` or `?` symbol as the first character of a term, without the `/`. It's also important to note that the `*` behaves differently when used outside of regex queries. Outside of the regex forward slash `/` delimiter, the `*` is a wildcard character and matches any series of characters much like `.*` in regex. As an example, `search=/non.*al/` produces the same result set as `search=non*al`.

> [!NOTE]  
> As a rule, pattern matching is slow so you might want to explore alternative methods, such as edge n-gram tokenization that creates tokens for sequences of characters in a term. With n-gram tokenization, the index will be larger, but queries might execute faster, depending on the pattern construction and the length of strings you are indexing. For more information, see [Partial term search and patterns with special characters](search-query-partial-matching.md#tune-query-performance).
>

### Effect of an analyzer on wildcard queries

During query parsing, queries that are formulated as prefix, suffix, wildcard, or regular expressions are passed as-is to the query tree, bypassing [lexical analysis](search-lucene-query-architecture.md#stage-2-lexical-analysis). Matches will only be found if the index contains the strings in the format your query specifies. In most cases, you need an analyzer during indexing that preserves string integrity so that partial term and pattern matching succeeds. For more information, see [Partial term search in Azure AI Search queries](search-query-partial-matching.md).

Consider a situation where you may want the search query `terminal*` to return results that contain terms such as `terminate`, `termination`, and `terminates`.

If you were to use the en.lucene (English Lucene) analyzer, it would apply aggressive stemming of each term. For example, `terminate`, `termination`, `terminates` will all be tokenized down to the token `termi` in your index. On the other side, terms in queries using wildcards or fuzzy search aren't analyzed at all, so there would be no results that would match the `terminat*` query.

On the other side, the Microsoft analyzers (in this case, the en.microsoft analyzer) are a bit more advanced and use lemmatization instead of stemming. This means that all generated tokens should be valid English words. For example, `terminate`, `terminates`, and `termination` will mostly stay whole in the index, and would be a preferable choice for scenarios that depend a lot on wildcards and fuzzy search.

## Scoring wildcard and regex queries

Azure AI Search uses frequency-based scoring ([BM25](https://en.wikipedia.org/wiki/Okapi_BM25)) for text queries. However, for wildcard and regex queries where scope of terms can potentially be broad, the frequency factor is ignored to prevent the ranking from biasing towards matches from rarer terms. All matches are treated equally for wildcard and regex searches.

## Special characters

In some circumstances, you may want to search for a special character, like an '❤' emoji or the '€' sign. In such cases, make sure that the analyzer you use doesn't filter those characters out. The standard analyzer bypasses many special characters, excluding them from your index.

Analyzers that tokenize special characters include the whitespace analyzer, which takes into consideration any character sequences separated by whitespaces as tokens (so the `❤` string would be considered a token). Also, a language analyzer like the Microsoft English analyzer ("en.microsoft"), would take the "€" string as a token. You can [test an analyzer](/rest/api/searchservice/test-analyzer) to see what tokens it generates for a given query.

When using Unicode characters, make sure symbols are properly escaped in the query url (for instance for `❤` would use the escape sequence `%E2%9D%A4+`). Postman does this translation automatically.  

## Precedence (grouping)

You can use parentheses to create subqueries, including operators within the parenthetical statement. For example, `motel+(wifi|luxury)` searches for documents containing the `motel` term and either `wifi` or `luxury` (or both).

Field grouping is similar but scopes the grouping to a single field. For example, `hotelAmenities:(gym+(wifi|pool))` searches the field `hotelAmenities` for `gym` and `wifi`, or `gym` and `pool`.  

## Query size limits

Azure AI Search imposes limits on query size and composition because unbounded queries can destabilize your search service. There are limits on query size and composition (the number of clauses). Limits also exist for the length of prefix search and for the complexity of regex search and wildcard search. If your application generates search queries programmatically, we recommend designing it in such a way that it doesn't generate queries of unbounded size.

For more information on query limits, see [API request limits](search-limits-quotas-capacity.md#api-request-limits).

## See also

+ [Query examples for simple search](search-query-simple-examples.md)
+ [Query examples for full Lucene search](search-query-lucene-examples.md)
+ [Search Documents](/rest/api/searchservice/Search-Documents)
+ [OData expression syntax for filters and sorting](query-odata-filter-orderby-syntax.md)   
+ [Simple query syntax in Azure AI Search](query-simple-syntax.md)
