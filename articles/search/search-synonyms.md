---
title: Synonyms for query expansion
titleSuffix: Azure AI Search
description: Create a synonym map to expand the scope of a search query over an Azure AI Search index. Scope is broadened to include equivalent terms you provide in the synonym map.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/12/2024
---

# Synonyms in Azure AI Search

On a search service, synonym maps are a global resource that associate equivalent terms, expanding the scope of a query without the user having to actually provide the term. For example, assuming "dog", "canine", and "puppy" are mapped synonyms, a query on "canine" will match on a document containing "dog".

## Create synonyms

A synonym map is an asset that can be created once and used by many indexes. The [service tier](search-limits-quotas-capacity.md#synonym-limits) determines how many synonym maps you can create, ranging from three synonym maps for Free and Basic tiers, up to 20 for the Standard tiers. 

You might create multiple synonym maps for different languages, such as English and French versions, or lexicons if your content includes technical jargon, slang, or obscure terminology. Although you can create multiple synonym maps in your search service, within an index, a field definition can only have one synonym map assignment.

A synonym map consists of name, format, and rules that function as synonym map entries. The only format that is supported is `solr`, and the `solr` format determines rule construction.

```http
POST /synonymmaps?api-version=2023-11-01
{
    "name": "geo-synonyms",
    "format": "solr",
    "synonyms": "
        USA, United States, United States of America\n
        Washington, Wash., WA => WA\n"
}
```

To create a synonym map, do so programmatically (the portal doesn't support synonym map definitions):

+ [Create Synonym Map (REST API)](/rest/api/searchservice/create-synonym-map). This reference is the most descriptive.
+ [SynonymMap class (.NET)](/dotnet/api/azure.search.documents.indexes.models.synonymmap) and [Add Synonyms using C#](search-synonyms-tutorial-sdk.md)
+ [SynonymMap class (Python)](/python/api/azure-search-documents/azure.search.documents.indexes.models.synonymmap)
+ [SynonymMap interface (JavaScript)](/javascript/api/@azure/search-documents/synonymmap)
+ [SynonymMap class (Java)](/java/api/com.azure.search.documents.indexes.models.synonymmap)

## Define rules

Mapping rules adhere to the open-source synonym filter specification of Apache Solr, described in this document: [SynonymFilter](https://cwiki.apache.org/confluence/display/solr/Filter+Descriptions#FilterDescriptions-SynonymFilter). The `solr` format supports two kinds of rules:

+ equivalency (where terms are equal substitutes in the query)

+ explicit mappings (where terms are mapped to one explicit term prior to querying)

Each rule must be delimited by the new line character (`\n`). You can define up to 5,000 rules per synonym map in a free service and 20,000 rules per map in other tiers. Each rule can have up to 20 expansions (or items in a rule). For more information, see [Synonym limits](search-limits-quotas-capacity.md#synonym-limits).

Query parsers automatically lower-case any upper or mixed case terms, but if you want to preserve special characters in the string, such as a comma or dash, add the appropriate escape characters when creating the synonym map.

### Equivalency rules

Rules for equivalent terms are comma-delimited within the same rule. In the first example, a query on `USA` expands to `USA` OR `"United States"` OR `"United States of America"`. Notice that if you want to match on a phrase, the query itself must be a quote-enclosed phrase query.

In the equivalence case, a query for `dog` expands the query to also include `puppy` and `canine`.

```json
{
"format": "solr",
"synonyms": "
    USA, United States, United States of America\n
    dog, puppy, canine\n
    coffee, latte, cup of joe, java\n"
}
```

### Explicit mapping

Rules for an explicit mapping are denoted by an arrow `=>`. When specified, a term sequence of a search query that matches the left-hand side of `=>` is replaced with the alternatives on the right-hand side at query time.

In the explicit case, a query for `Washington`, `Wash.` or `WA` is rewritten as `WA`, and the query engine only looks for matches on the term `WA`. Explicit mapping only applies in the direction specified, and doesn't rewrite the query `WA` to `Washington` in this case.

```json
{
"format": "solr",
"synonyms": "
    Washington, Wash., WA => WA\n
    California, Calif., CA => CA\n"
}
```

### Escaping special characters

In full text search, synonyms are analyzed during query processing just like any other query term, which means that rules around reserved and special characters apply to the terms in your synonym map. The list of characters that requires escaping varies between the simple syntax and full syntax:

+ [simple syntax](query-simple-syntax.md)  `+ | " ( ) ' \`
+ [full syntax](query-lucene-syntax.md) `+ - & | ! ( ) { } [ ] ^ " ~ * ? : \ /`

Recall that if you need to preserve characters that would otherwise be discarded by the default analyzer during indexing, you should substitute an analyzer that preserves them. Some choices include Microsoft natural [language analyzers](index-add-language-analyzers.md), which preserves hyphenated words, or a custom analyzer for more complex patterns. For more information, see [Partial terms, patterns, and special characters](search-query-partial-matching.md).

The following example shows an example of how to escape a character with a backslash:

```json
{
    "format": "solr",
    "synonyms": "WA\, USA, WA, Washington\n"
}
```

Since the backslash is itself a special character in other languages like JSON and C#, you'll probably need to double-escape it. For example, the JSON sent to the REST API for the above synonym map would look like this:

```json
{
    "format":"solr",
    "synonyms": "WA\\, USA, WA, Washington"
}
```

## Upload and manage synonym maps

As mentioned previously, you can create or update a synonym map without disrupting query and indexing workloads. A synonym map is a standalone object (like indexes or data sources), and as long as no field is using it, updates won't cause indexing or queries to fail. However, once you add a synonym map to a field definition, if you then delete a synonym map, any query that includes the fields in question will fail with a 404 error.

Creating, updating, and deleting a synonym map is always a whole-document operation, meaning that you can't update or delete parts of the synonym map incrementally. Updating even a single rule requires a reload.

## Assign synonyms to fields

After uploading a synonym map, you can enable the synonyms on fields of the type `Edm.String` or `Collection(Edm.String)`, on fields having `"searchable":true`. As noted, a field definition can use only one synonym map.

```http
POST /indexes?api-version=2020-06-30
{
    "name":"hotels-sample-index",
    "fields":[
        {
            "name":"description",
            "type":"Edm.String",
            "searchable":true,
            "synonymMaps":[
            "en-synonyms"
            ]
        },
        {
            "name":"description_fr",
            "type":"Edm.String",
            "searchable":true,
            "analyzer":"fr.microsoft",
            "synonymMaps":[
            "fr-synonyms"
            ]
        }
    ]
}
```

## Query on equivalent or mapped fields

Adding synonyms doesn't impose new requirements on query construction. You can issue term and phrase queries just as you did before the addition of synonyms. The only difference is that if a query term exists in the synonym map, the query engine will either expand or rewrite the term or phrase, depending on the rule.

## How synonyms are used during query execution

Synonyms are a query expansion technique that supplements the contents of an index with equivalent terms, but only for fields that have a synonym assignment. If a field-scoped query *excludes* a synonym-enabled field, you won't see matches from the synonym map.

For synonym-enabled fields, synonyms are subject to the same text analysis as the associated field. For example, if a field is analyzed using the standard Lucene analyzer, synonym terms will also be subject to the standard Lucene analyzer at query time. If you want to preserve punctuation, such as periods or dashes, in the synonym term, apply a content-preserving analyzer on the field.

Internally, the synonyms feature rewrites the original query with synonyms with the OR operator. For this reason, hit highlighting and scoring profiles treat the original term and synonyms as equivalent.

Synonyms apply to free-form text queries only and aren't supported for filters, facets, autocomplete, or suggestions. Autocomplete and suggestions are based only on the original term; synonym matches don't appear in the response.

Synonym expansions don't apply to wildcard search terms; prefix, fuzzy, and regex terms aren't expanded.

If you need to do a single query that applies synonym expansion and wildcard, regex, or fuzzy searches, you can combine the queries using the OR syntax. For example, to combine synonyms with wildcards for simple query syntax, the term would be `<query> | <query>*`.

If you have an existing index in a development (non-production) environment, experiment with a small dictionary to see how the addition of synonyms changes the search experience, including impact on scoring profiles, hit highlighting, and suggestions.

## Next steps

> [!div class="nextstepaction"]
> [Create a synonym map (REST API)](/rest/api/searchservice/create-synonym-map)
