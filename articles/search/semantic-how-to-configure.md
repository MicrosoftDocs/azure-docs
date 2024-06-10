---
title: Configure semantic ranker
titleSuffix: Azure AI Search
description: Add a semantic configuration to a search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 02/08/2024
---

# Configure semantic ranking and return captions in search results

In this article, learn how to invoke a semantic ranking over a result set, promoting the most semantically relevant results to the top of the stack. You can also get semantic captions, with highlights over the most relevant terms and phrases, and [semantic answers](semantic-answers.md).

## Prerequisites

+ A search service on Basic, Standard tier (S1, S2, S3), or Storage Optimized tier (L1, L2), subject to [region availability](https://azure.microsoft.com/global-infrastructure/services/?products=search).

+ Semantic ranker [enabled on your search service](semantic-how-to-enable-disable.md).

+ An existing search index with rich text content. Semantic ranking applies to text (nonvector) fields and works best on content that is informational or descriptive.

## Choose a client

Choose a search client that supports semantic ranking. Here are some options:

+ [Azure portal](https://portal.azure.com), using the index designer to add a semantic configuration.
+ [Visual Studio Code](https://code.visualstudio.com/download) with the [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
+ [Azure SDK for .NET](https://www.nuget.org/packages/Azure.Search.Documents)
+ [Azure SDK for Python](https://pypi.org/project/azure-search-documents)
+ [Azure SDK for Java](https://central.sonatype.com/artifact/com.azure/azure-search-documents)
+ [Azure SDK for JavaScript](https://www.npmjs.com/package/@azure/search-documents)

## Add a semantic configuration

A *semantic configuration* is a section in your index that establishes field inputs for semantic ranking. You can add or update a semantic configuration at any time, no rebuild necessary. If you create multiple configurations, you can specify a default. At query time, specify a semantic configuration on a [query request](semantic-how-to-query-request.md), or leave it blank to use the default.

A semantic configuration has a name and the following properties:

| Property | Characteristics |
|----------|-----------------|
| Title field | A short string, ideally under 25 words. This field could be the title of a document, name of a product, or a unique identifier. If you don't have suitable field, leave it blank. | 
| Content fields | Longer chunks of text in natural language form, subject to [maximum token input limits](semantic-search-overview.md#how-inputs-are-collected-and-summarized) on the machine learning models. Common examples include the body of a document, description of a product, or other free-form text. | 
| Keyword fields | A list of keywords, such as the tags on a document, or a descriptive term, such as the category of an item. | 

You can only specify one title field, but you can have as many content and keyword fields as you like. For content and keyword fields, list the fields in priority order because lower priority fields might get truncated.

Across all semantic configuration properties, the fields you assign must be:

+ Attributed as `searchable` and `retrievable`
+ Strings of type `Edm.String`, `Collection(Edm.String)`, string subfields of  `Collection(Edm.ComplexType)`

### [**Azure portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to a search service that has [semantic ranking enabled](semantic-how-to-enable-disable.md).

1. From **Indexes** on the left-navigation pane, open an index.

1. Select **Semantic Configurations** and then select **Add Semantic Configuration**.

   The **New Semantic Configuration** page opens with options for selecting a title field, content fields, and keyword fields. Only searchable and retrievable string fields are eligible. Make sure to list content fields and keyword fields in priority order.

   :::image type="content" source="./media/semantic-search-overview/create-semantic-config.png" alt-text="Screenshot that shows how to create a semantic configuration in the Azure portal." lightbox="./media/semantic-search-overview/create-semantic-config.png" border="true":::

   Select **OK** to save the changes.

### [**REST API**](#tab/rest)

1. Formulate a [Create or Update Index](/rest/api/searchservice/indexes/create-or-update) request.

1. Add a semantic configuration to the index definition, perhaps after `scoringProfiles` or `suggesters`. Specifying a default is optional but useful if you have more than one configuration.

    ```json
    "semantic": {
        "defaultConfiguration": "my-semantic-config-default",
        "configurations": [
            {
                "name": "my-semantic-config-default",
                "prioritizedFields": {
                    "titleField": {
                        "fieldName": "HotelName"
                    },
                    "prioritizedContentFields": [
                        {
                            "fieldName": "Description"
                        }
                    ],
                    "prioritizedKeywordsFields": [
                        {
                            "fieldName": "Tags"
                        }
                    ]
                }
            },
                        {
                "name": "my-semantic-config-desc-only",
                "prioritizedFields": {
                    "prioritizedContentFields": [
                        {
                            "fieldName": "Description"
                        }
                    ]
                }
            }
        ]
    }
    ```

### [**.NET SDK**](#tab/sdk)

Use the [SemanticConfiguration class](/dotnet/api/azure.search.documents.indexes.models.semanticconfiguration?view=azure-dotnet&branch=main&preserve-view=true) in the Azure SDK for .NET.

The following example is from the [semantic ranking sample](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/samples/Sample08_SemanticSearch.md) authored by the Azure SDK team.

```c#
string indexName = "hotel";
SearchIndex searchIndex = new(indexName)
{
    Fields =
    {
        new SimpleField("HotelId", SearchFieldDataType.String) { IsKey = true, IsFilterable = true, IsSortable = true, IsFacetable = true },
        new SearchableField("HotelName") { IsFilterable = true, IsSortable = true },
        new SearchableField("Description") { IsFilterable = true },
        new SearchableField("Category") { IsFilterable = true, IsSortable = true, IsFacetable = true },
    },
    SemanticSearch = new()
    {
        Configurations =
        {
            new SemanticConfiguration("my-semantic-config", new()
            {
                TitleField = new SemanticField("HotelName"),
                ContentFields =
                {
                    new SemanticField("Description")
                },
                KeywordsFields =
                {
                    new SemanticField("Category")
                }
            })
        }
    }
};
```

---

## Migrate from preview versions

If your semantic ranking code is using preview APIs, this section explains how to migrate to stable versions. You can check the change logs for verification of general availability:

+ [2023-11-01 (REST)](/rest/api/searchservice/indexes/create-or-update?view=rest-searchservice-2023-11-01&preserve-view=true)
+ [Azure SDK for .NET (11.5) change log](https://github.com/Azure/azure-sdk-for-net/blob/Azure.Search.Documents_11.5.1/sdk/search/Azure.Search.Documents/CHANGELOG.md#1150-2023-11-10)
+ [Azure SDK for Python (11.4) change log](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/search/azure-search-documents/CHANGELOG.md#1140-2023-10-13)
+ [Azure SDK for Java (11.6) change log](https://github.com/Azure/azure-sdk-for-java/blob/azure-search-documents_11.6.1/sdk/search/azure-search-documents/CHANGELOG.md#1160-2023-11-13)
+ [Azure SDK for JavaScript (12.0) change log](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/search-documents_12.0.0/sdk/search/search-documents/CHANGELOG.md#1200-2023-11-13)

**Behavior changes:**

+ As of July 14, 2023, semantic ranker is language agnostic. It can rerank results composed of multilingual content, with no bias towards a specific language. In preview versions, semantic ranking would deprioritize results differing from the language specified by the field analyzer.

+ In 2021-04-30-Preview and all later versions, for the REST API and all SDK packages targeting the same version: `semanticConfiguration` (in an index definition) defines which search fields are used in semantic ranking. Previously in the 2020-06-30-Preview REST API, `searchFields` (in a query request) was used for field specification and prioritization. This approach only worked in 2020-06-30-Preview and is obsolete in all other versions.

### Step 1: Remove queryLanguage

The semantic ranking engine is now language agnostic. If `queryLanguage` is specified in your query logic, it's no longer used for semantic ranking, but still applies to [spell correction](speller-how-to-add.md). 

Keep `queryLanguage` if you're using speller, and if the language value is [supported by speller](speller-how-to-add.md#supported-languages). Spell check has limited availability across languages. 

Otherwise, delete `queryLanguage`.

### Step 2: Replace `searchFields` with `semanticConfiguration`

If your code calls the 2020-06-30-Preview REST API or beta SDK packages targeting that REST API version, you might be using `searchFields` in a query request to specify semantic fields and priorities. In initial beta versions, `searchFields` had a dual purpose, constraining the initial query to the fields listed in `searchFields`, and also setting field priority if semantic ranking was used. In later versions, `searchFields` retains its original purpose, but is no longer used for semantic ranking.

Keep `searchFields` in query requests if you're using it to limit full text search to the list of named fields.

Add a `semanticConfiguration` to an index schema to specify field prioritization, following the [instructions in this article](#add-a-semantic-configuration).

## Next steps

Test your semantic configuration by running a semantic query.

> [!div class="nextstepaction"]
> [Create a semantic query](semantic-how-to-query-request.md)
