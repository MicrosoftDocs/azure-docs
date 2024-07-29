---
title: Synonyms for query expansion
titleSuffix: Azure AI Search
description: Create a synonym map to expand the scope of a search query over an Azure AI Search index. The query can search on equivalent terms provided in the synonym map, even if the query doesn't explicitly include the term.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 07/22/2024
---

# Synonyms in Azure AI Search

On a search service, a synonym map associates equivalent terms, expanding the scope of a query without the user having to actually provide the term. For example, assuming "dog", "canine", and "puppy" are mapped synonyms, a query on "canine" matches on a document containing "dog". You might create multiple synonym maps for different languages, such as English and French versions, or lexicons if your content includes technical jargon, slang, or obscure terminology. 

Some key points about synonym maps:

- A synonym map is a top-level resource that can be created once and used by many indexes.
- A synonym map applies to string fields.
- You can create and assign a synonym map at any time with no disruption to indexing or queries.
- Your [service tier](search-limits-quotas-capacity.md#synonym-limits) sets the limits on how many synonym maps you can create.
- Your search service can have multiple synonym maps, but within an index, a field definition can only have one synonym map assignment.

## Create a synonym map

A synonym map consists of name, format, and rules that function as synonym map entries. The only format that is supported is `solr`, and the `solr` format determines rule construction.

To create a synonym map, do so programmatically. The portal doesn't support synonym map definitions.

### [REST](#tab/rest)

Use the [Create Synonym Map (REST API)](/rest/api/searchservice/create-synonym-map) to create a synonym map.

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

### [.NET](#tab/dotnet)

Use the [SynonymMap class (.NET)](/dotnet/api/azure.search.documents.indexes.models.synonymmap) and [Create a synonym map(Azure SDK sample)](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/samples/Sample02_Service.md#create-a-synonym-map) to create the map.

### [Python](#tab/python)

Use the [SynonymMap class (Python)](/python/api/azure-search-documents/azure.search.documents.indexes.models.synonymmap) to create the map.

### [Java](#tab/java)

Use the [SynonymMap class (Java)](/java/api/com.azure.search.documents.indexes.models.synonymmap) to create the map.

### [JavaScript](#tab/javascript)

Use the [SynonymMap interface (JavaScript)](/javascript/api/@azure/search-documents/synonymmap) to create the map.

---

### Define rules

Mapping rules adhere to the open-source synonym filter specification of Apache Solr, described in this document: [SynonymFilter](https://cwiki.apache.org/confluence/display/solr/Filter+Descriptions#FilterDescriptions-SynonymFilter). The `solr` format supports two kinds of rules:

- equivalency (where terms are equal substitutes in the query)

- explicit mappings (where terms are mapped to one explicit term)

Each rule is delimited by the new line character (`\n`). You can define up to 5,000 rules per synonym map in a free service and 20,000 rules per map in other tiers. Each rule can have up to 20 expansions (or items in a rule). For more information, see [Synonym limits](search-limits-quotas-capacity.md#synonym-limits).

Query parsers automatically lower-case any upper or mixed case terms. To preserve special characters in the string, such as a comma or dash, add the appropriate escape characters when creating the synonym map.

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

Synonyms are analyzed during query processing just like any other query term, which means that rules for reserved and special characters apply to the terms in your synonym map. The list of characters that requires escaping varies between the simple syntax and full syntax:

- [simple syntax](query-simple-syntax.md)  `+ | " ( ) ' \`
- [full syntax](query-lucene-syntax.md) `+ - & | ! ( ) { } [ ] ^ " ~ * ? : \ /`

To preserve characters that the default analyzer discards, substitute an analyzer that preserves them. Some choices include Microsoft natural [language analyzers](index-add-language-analyzers.md), which preserves hyphenated words, or a custom analyzer for more complex patterns. For more information, see [Partial terms, patterns, and special characters](search-query-partial-matching.md).

The following example shows an example of how to escape a character with a backslash:

```json
{
    "format": "solr",
    "synonyms": "WA\, USA, WA, Washington\n"
}
```

Since the backslash is itself a special character in other languages like JSON and C#, you probably need to double-escape it. Here's an example in JSON:

```json
{
    "format":"solr",
    "synonyms": "WA\\, USA, WA, Washington"
}
```

## Manage synonym maps

You can update a synonym map without disrupting query and indexing workloads. However, once you add a synonym map to a field, if you then delete a synonym map, any query that includes the fields in question fail with a 404 error.

Creating, updating, and deleting a synonym map is always a whole-document operation. You can't update or delete parts of the synonym map incrementally. Updating even a single rule requires a reload.

## Assign synonyms to fields

After you create the synonym map, assign it to a field in your index. To assign synonym maps, do so programmatically. The portal doesn't support synonym map field associations.

- A field must be of type `Edm.String` or `Collection(Edm.String)`
- A field must have `"searchable":true`
- A field can have only one synonym map

If the synonym map exists on the search service, it's used on the next query, with no reindexing or rebuild required.

### [REST](#tab/rest-assign)

Use the [Create or Update Index (REST API)](/rest/api/searchservice/indexes/create-or-update) to modify a field definition.

```http
POST /indexes?api-version=2023-11-01
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

### [**.NET SDK**](#tab/dotnet-assign)

Use the [**SearchIndexClient**](/dotnet/api/azure.search.documents.indexes.searchindexclient) to update an index. Provide the whole index definition and include the new parameters for synonym map assignments.

In this example, the "country" field has a synonymMapName property.

```csharp
// Update anindex
string indexName = "hotels";
SearchIndex index = new SearchIndex(indexName)
{
    Fields =
    {
        new SimpleField("hotelId", SearchFieldDataType.String) { IsKey = true, IsFilterable = true, IsSortable = true },
        new SearchableField("hotelName") { IsFilterable = true, IsSortable = true },
        new SearchableField("description") { AnalyzerName = LexicalAnalyzerName.EnLucene },
        new SearchableField("descriptionFr") { AnalyzerName = LexicalAnalyzerName.FrLucene }
        new ComplexField("address")
        {
            Fields =
            {
                new SearchableField("streetAddress"),
                new SearchableField("city") { IsFilterable = true, IsSortable = true, IsFacetable = true },
                new SearchableField("stateProvince") { IsFilterable = true, IsSortable = true, IsFacetable = true },
                new SearchableField("country") { SynonymMapNames = new[] { synonymMapName }, IsFilterable = true, IsSortable = true, IsFacetable = true },
                new SearchableField("postalCode") { IsFilterable = true, IsSortable = true, IsFacetable = true }
            }
        }
    }
};

await indexClient.CreateIndexAsync(index);
```

For more examples, see[azure-search-dotnet-samples/quickstart/v11/](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/main/quickstart/v11).

### [**Other SDKs**](#tab/other-sdks-assign)

You can use any supported SDK to update a search index. All of them provide a **SearchIndexClient** that has methods for updating indexes.

| Azure SDK | Client | Examples |
|-----------|--------|----------|
| Java | [SearchIndexClient](/java/api/com.azure.search.documents.indexes.searchindexclient) | [CreateIndexExample.java](https://github.com/Azure/azure-sdk-for-java/blob/azure-search-documents_11.1.3/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexExample.java) |
| JavaScript | [SearchIndexClient](/javascript/api/@azure/search-documents/searchindexclient) | [Indexes](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/search/search-documents/samples/v11/javascript) |
| Python | [SearchIndexClient](/python/api/azure-search-documents/azure.search.documents.indexes.searchindexclient) | [sample_index_crud_operations.py](https://github.com/Azure/azure-sdk-for-python/blob/7cd31ac01fed9c790cec71de438af9c45cb45821/sdk/search/azure-search-documents/samples/sample_index_crud_operations.py) |

---

## Query on equivalent or mapped fields

A synonym field assignment doesn't change how you write queries. After the synonym map assignment, the only difference is that if a query term exists in the synonym map, the search engine either expands or rewrites the term or phrase, depending on the rule.

## How synonyms are used during query execution

Synonyms are a query expansion technique that supplements the contents of an index with equivalent terms, but only for fields that have a synonym assignment. If a field-scoped query *excludes* a synonym-enabled field, you don't see matches from the synonym map.

For synonym-enabled fields, synonyms are subject to the same text analysis as the associated field. For example, if a field is analyzed using the standard Lucene analyzer, synonym terms are also subject to the standard Lucene analyzer at query time. If you want to preserve punctuation, such as periods or dashes, in the synonym term, apply a content-preserving analyzer on the field.

Internally, the synonyms feature rewrites the original query with synonyms with the OR operator. For this reason, hit highlighting and scoring profiles treat the original term and synonyms as equivalent.

Synonyms apply to free-form text queries only and aren't supported for filters, facets, autocomplete, or suggestions. Autocomplete and suggestions are based only on the original term; synonym matches don't appear in the response.

Synonym expansions don't apply to wildcard search terms; prefix, fuzzy, and regex terms aren't expanded.

If you need to do a single query that applies synonym expansion and wildcard, regex, or fuzzy searches, you can combine the queries using the OR syntax. For example, to combine synonyms with wildcards for simple query syntax, the term would be `<query> | <query>*`.

If you have an existing index in a development (nonproduction) environment, experiment with a small dictionary to see how the addition of synonyms changes the search experience, including impact on scoring profiles, hit highlighting, and suggestions.

## Next steps

> [!div class="nextstepaction"]
> [Create a synonym map (REST API)](/rest/api/searchservice/create-synonym-map)
