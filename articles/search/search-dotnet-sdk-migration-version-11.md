---
title: Upgrade to .NET SDK version 11
titleSuffix: Azure AI Search
description: Migrate your search application code from older SDK versions to the Azure AI Search .NET SDK version 11.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: csharp
ms.topic: conceptual
ms.date: 10/19/2023
ms.custom:
  - devx-track-csharp
  - devx-track-dotnet
  - ignite-2023
---

# Upgrade to Azure AI Search .NET SDK version 11

If your search solution is built on the [**Azure SDK for .NET**](/dotnet/azure/), this article helps you migrate your code from earlier versions of [**Microsoft.Azure.Search**](/dotnet/api/overview/azure/search) to version 11, the new [**Azure.Search.Documents**](/dotnet/api/overview/azure/search.documents-readme) client library. Version 11 is a fully redesigned client library, released by the Azure SDK development team (previous versions were produced by the Azure AI Search development team). 

All features from version 10 are implemented in version 11. Key differences include:

+ One package (**Azure.Search.Documents**) instead of four
+ Three clients instead of two: SearchClient, SearchIndexClient, SearchIndexerClient
+ Naming differences across a range of APIs and small structural differences that simplify some tasks

The client library's [Change Log](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/CHANGELOG.md) has an itemized list of updates. You can review a [summarized version](#WhatsNew) in this article.

All C# code samples and snippets in the Azure AI Search product documentation have been revised to use the new **Azure.Search.Documents** client library.

## Why upgrade?

The benefits of upgrading are summarized as follows:

+ New features are added to **Azure.Search.Documents** only. The previous version, Microsoft.Azure.Search, is now retired. Updates to deprecated libraries are limited to high priority bug fixes only.

+ Consistency with other Azure client libraries. **Azure.Search.Documents** takes a dependency on [Azure.Core](/dotnet/api/azure.core) and [System.Text.Json](/dotnet/api/system.text.json), and follows conventional approaches for common tasks such as client connections and authorization.

**Microsoft.Azure.Search** is officially retired. If you're using an old version, we recommend upgrading to the next higher version, repeating the process in succession until you reach version 11 and **Azure.Search.Documents**. An incremental upgrade strategy makes it easier to find and fix blocking issues. See [Previous version docs](/previous-versions/azure/search/) for guidance.

## Package comparison

Version 11 consolidates and simplifies package management so that there are fewer to manage.

| Version 10 and earlier | Version 11 |
|------------------------|------------|
| [Microsoft.Azure.Search](https://www.nuget.org/packages/Microsoft.Azure.Search/) </br>[Microsoft.Azure.Search.Service](https://www.nuget.org/packages/Microsoft.Azure.Search.Service/) </br>[Microsoft.Azure.Search.Data](https://www.nuget.org/packages/Microsoft.Azure.Search.Data/) </br>[Microsoft.Azure.Search.Common](https://www.nuget.org/packages/Microsoft.Azure.Search.Common/)  | [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/) |

## Client comparison

Where applicable, the following table maps the client libraries between the two versions.

| Client operations | Microsoft.Azure.Search&nbsp;(v10) | Azure.Search.Documents&nbsp;(v11) |
|---------------------|------------------------------|------------------------------|
| Targets the documents collection of an index (queries and data import) | [SearchIndexClient](/dotnet/api/azure.search.documents.indexes.searchindexclient) | [SearchClient](/dotnet/api/azure.search.documents.searchclient) |
| Targets index-related objects (indexes, analyzers, synonym maps | [SearchServiceClient](/dotnet/api/microsoft.azure.search.searchserviceclient) | [SearchIndexClient](/dotnet/api/azure.search.documents.indexes.searchindexclient) |
| Targets indexer-related objects (indexers, data sources, skillsets) | [SearchServiceClient](/dotnet/api/microsoft.azure.search.searchserviceclient) | [SearchIndexerClient (**new**)](/dotnet/api/azure.search.documents.indexes.searchindexerclient) |

> [!Caution]
> Notice that SearchIndexClient exists in both versions, but targets different operations. In version 10, SearchIndexClient creates indexes and other objects. In version 11, SearchIndexClient works with existing indexes, targeting the documents collection with query and data ingestion APIs. To avoid confusion when updating code, be mindful of the order in which client references are updated. Following the sequence in [Steps to upgrade](#UpgradeSteps) should help mitigate any string replacement issues.

<a name="naming-differences"></a>

## Naming and other API differences

Besides the client differences (noted previously and thus omitted here), multiple other APIs have been renamed and in some cases redesigned. Class name differences are summarized in the following sections. This list isn't exhaustive but it does group API changes by task, which can be helpful for revisions on specific code blocks. For an itemized list of API updates, see the [change log](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/CHANGELOG.md) for `Azure.Search.Documents` on GitHub.

### Authentication and encryption

| Version 10 | Version 11 equivalent |
|------------|-----------------------|
| [SearchCredentials](/dotnet/api/microsoft.azure.search.searchcredentials) | [AzureKeyCredential](/dotnet/api/azure.azurekeycredential) |
| EncryptionKey (Undocumented in API reference. Support for this API transitioned to generally available in v10, but was only available in the [preview SDK](https://www.nuget.org/packages/Microsoft.Azure.Search/8.0.0-preview)) | [SearchResourceEncryptionKey](/dotnet/api/azure.search.documents.indexes.models.searchresourceencryptionkey) |

### Indexes, analyzers, synonym maps

| Version 10 | Version 11 equivalent |
|------------|-----------------------|
| [Index](/dotnet/api/microsoft.azure.documents.index) | [SearchIndex](/dotnet/api/azure.search.documents.indexes.models.searchindex) |
| [Field](/dotnet/api/microsoft.azure.search.models.field) | [SearchField](/dotnet/api/azure.search.documents.indexes.models.searchfield) |
| [DataType](/dotnet/api/microsoft.azure.search.models.datatype) | [SearchFieldDataType](/dotnet/api/azure.search.documents.indexes.models.searchfielddatatype) |
| [ItemError](/dotnet/api/microsoft.azure.search.models.itemerror) | [SearchIndexerError](/dotnet/api/azure.search.documents.indexes.models.searchindexererror) |
| [Analyzer](/dotnet/api/microsoft.azure.search.models.analyzer) | [LexicalAnalyzer](/dotnet/api/azure.search.documents.indexes.models.lexicalanalyzer) (also, `AnalyzerName` to `LexicalAnalyzerName`) |
| [AnalyzeRequest](/dotnet/api/microsoft.azure.search.models.analyzerequest) | [AnalyzeTextOptions](/dotnet/api/azure.search.documents.indexes.models.analyzetextoptions) |
| [StandardAnalyzer](/dotnet/api/microsoft.azure.search.models.standardanalyzer) | [LuceneStandardAnalyzer](/dotnet/api/azure.search.documents.indexes.models.lucenestandardanalyzer) |
| [StandardTokenizer](/dotnet/api/microsoft.azure.search.models.standardtokenizer) | [LuceneStandardTokenizer](/dotnet/api/azure.search.documents.indexes.models.lucenestandardtokenizer) (also, `StandardTokenizerV2` to `LuceneStandardTokenizerV2`) |
| [TokenInfo](/dotnet/api/microsoft.azure.search.models.tokeninfo) | [AnalyzedTokenInfo](/dotnet/api/azure.search.documents.indexes.models.analyzedtokeninfo) |
| [Tokenizer](/dotnet/api/microsoft.azure.search.models.tokenizer) | [LexicalTokenizer](/dotnet/api/azure.search.documents.indexes.models.lexicaltokenizer) (also, `TokenizerName` to `LexicalTokenizerName`) |
| [SynonymMap.Format](/dotnet/api/microsoft.azure.search.models.synonymmap.format) | None. Remove references to `Format`. |

Field definitions are streamlined: [SearchableField](/dotnet/api/azure.search.documents.indexes.models.searchablefield), [SimpleField](/dotnet/api/azure.search.documents.indexes.models.simplefield), [ComplexField](/dotnet/api/azure.search.documents.indexes.models.complexfield) are new APIs for creating field definitions.

### Indexers, datasources, skillsets

| Version 10 | Version 11 equivalent |
|------------|-----------------------|
| [Indexer](/dotnet/api/microsoft.azure.search.models.indexer) | [SearchIndexer](/dotnet/api/azure.search.documents.indexes.models.searchindexer) |
| [DataSource](/dotnet/api/microsoft.azure.search.models.datasource) | [SearchIndexerDataSourceConnection](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourceconnection) |
| [Skill](/dotnet/api/microsoft.azure.search.models.skill) | [SearchIndexerSkill](/dotnet/api/azure.search.documents.indexes.models.searchindexerskill) |
| [Skillset](/dotnet/api/microsoft.azure.search.models.skillset) | [SearchIndexerSkillset](/dotnet/api/azure.search.documents.indexes.models.searchindexerskill) |
| [DataSourceType](/dotnet/api/microsoft.azure.search.models.datasourcetype) | [SearchIndexerDataSourceType](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourcetype) |

### Data import

| Version 10 | Version 11 equivalent |
|------------|-----------------------|
| [IndexAction](/dotnet/api/microsoft.azure.search.models.indexaction) | [IndexDocumentsAction](/dotnet/api/azure.search.documents.models.indexdocumentsaction) |
| [IndexBatch](/dotnet/api/microsoft.azure.search.models.indexbatch) | [IndexDocumentsBatch](/dotnet/api/azure.search.documents.models.indexdocumentsbatch) |
| [IndexBatchException.FindFailedActionsToRetry()](/dotnet/api/microsoft.azure.search.indexbatchexception.findfailedactionstoretry) | [SearchIndexingBufferedSender](/dotnet/api/azure.search.documents.searchindexingbufferedsender-1) |

### Query requests and responses

| Version 10 | Version 11 equivalent |
|------------|-----------------------|
| [DocumentsOperationsExtensions.SearchAsync](/dotnet/api/microsoft.azure.search.documentsoperationsextensions.searchasync) | [SearchClient.SearchAsync](/dotnet/api/azure.search.documents.searchclient.searchasync) |
| [DocumentSearchResult](/dotnet/api/microsoft.azure.search.models.documentsearchresult-1) | [SearchResult](/dotnet/api/azure.search.documents.models.searchresult-1) or [SearchResults](/dotnet/api/azure.search.documents.models.searchresults-1), depending on whether the result is a single document or multiple. |
| [DocumentSuggestResult](/dotnet/api/microsoft.azure.search.models.documentsuggestresult-1) | [SuggestResults](/dotnet/api/azure.search.documents.models.suggestresults-1) |
| [SearchParameters](/dotnet/api/microsoft.azure.search.models.searchparameters) |  [SearchOptions](/dotnet/api/azure.search.documents.searchoptions)  |
| [SuggestParameters](/dotnet/api/microsoft.azure.search.models.suggestparameters) |  [SuggestOptions](/dotnet/api/azure.search.documents.suggestoptions) |
| [SearchParameters.Filter](/dotnet/api/microsoft.azure.search.models.searchparameters.filter) |  [SearchFilter](/dotnet/api/azure.search.documents.searchfilter) (a new class for constructing OData filter expressions) |

### JSON serialization

By default, the Azure SDK uses [System.Text.Json](/dotnet/api/system.text.json) for JSON serialization, relying on the capabilities of those APIs to handle text transformations previously implemented through a native [SerializePropertyNamesAsCamelCaseAttribute](/dotnet/api/microsoft.azure.search.models.serializepropertynamesascamelcaseattribute) class, which has no counterpart in the new library.

To serialize property names into camelCase, you can use the [JsonPropertyNameAttribute](/dotnet/api/system.text.json.serialization.jsonpropertynameattribute) (similar to [this example](https://github.com/Azure/azure-sdk-for-net/tree/d263f23aa3a28ff4fc4366b8dee144d4c0c3ab10/sdk/search/Azure.Search.Documents#use-c-types-for-search-results)).

Alternatively, you can set a [JsonNamingPolicy](/dotnet/api/system.text.json.jsonnamingpolicy) provided in [JsonSerializerOptions](/dotnet/api/system.text.json.jsonserializeroptions). The following System.Text.Json code example, taken from the [Microsoft.Azure.Core.Spatial readme](https://github.com/Azure/azure-sdk-for-net/blob/259df3985d9710507e2454e1591811f8b3a7ad5d/sdk/core/Microsoft.Azure.Core.Spatial/README.md#deserializing-documents) demonstrates the use of camelCase without having to attribute every property:

```csharp
// Get the Azure AI Search service endpoint and read-only API key.
Uri endpoint = new Uri(Environment.GetEnvironmentVariable("SEARCH_ENDPOINT"));
AzureKeyCredential credential = new AzureKeyCredential(Environment.GetEnvironmentVariable("SEARCH_API_KEY"));

// Create serializer options with our converter to deserialize geographic points.
JsonSerializerOptions serializerOptions = new JsonSerializerOptions
{
    Converters =
    {
        new MicrosoftSpatialGeoJsonConverter()
    },
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

SearchClientOptions clientOptions = new SearchClientOptions
{
    Serializer = new JsonObjectSerializer(serializerOptions)
};

SearchClient client = new SearchClient(endpoint, "mountains", credential, clientOptions);
Response<SearchResults<Mountain>> results = client.Search<Mountain>("Rainier");
```

If you're using Newtonsoft.Json for JSON serialization, you can pass in global naming policies using similar attributes, or by using properties on [JsonSerializerSettings](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_JsonSerializerSettings.htm). For an example equivalent to the previous one, see the [Deserializing documents example](https://github.com/Azure/azure-sdk-for-net/blob/259df3985d9710507e2454e1591811f8b3a7ad5d/sdk/core/Microsoft.Azure.Core.Spatial.NewtonsoftJson/README.md) in the Newtonsoft.Json readme.

<a name="WhatsNew"></a>

## Inside v11

Each version of an Azure AI Search client library targets a corresponding version of the REST API. The REST API is considered foundational to the service, with individual SDKs wrapping a version of the REST API. As a .NET developer, it can be helpful to review the more verbose [REST API documentation](/rest/api/searchservice/) for more in depth coverage of specific objects or operations. Version 11 targets the [2020-06-30 search service specification](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/search/data-plane/Azure.Search/stable/2020-06-30). 

Version 11.0 fully supports the following objects and operations:

+ Index creation and management
+ Synonym map creation and management
+ Indexer creation and management
+ Indexer data source creation and management
+ Skillset creation and management
+ All query types and syntax

Version 11.1 additions ([change log](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/CHANGELOG.md#1110-2020-08-11) details):

+ [FieldBuilder](/dotnet/api/azure.search.documents.indexes.fieldbuilder) (added in 11.1)
+ [Serializer property](/dotnet/api/azure.search.documents.searchclientoptions.serializer) (added in 11.1) to support custom serialization

Version 11.2 additions ([change log](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/CHANGELOG.md#1120-2021-02-10) details):

+ [EncryptionKey](/dotnet/api/azure.search.documents.indexes.models.searchindexer.encryptionkey) property added indexers, data sources, and skillsets
+ [IndexingParameters.IndexingParametersConfiguration](/dotnet/api/azure.search.documents.indexes.models.indexingparametersconfiguration) property support
+ [Geospatial types](/dotnet/api/azure.search.documents.indexes.models.searchfielddatatype.geographypoint) are natively supported in [FieldBuilder](/dotnet/api/azure.search.documents.indexes.fieldbuilder.build). [SearchFilter](/dotnet/api/azure.search.documents.searchfilter) can encode geometric types from Microsoft.Spatial without an explicit assembly dependency.

  You can also continue to explicitly declare a dependency on [Microsoft.Spatial](https://www.nuget.org/packages/Microsoft.Spatial/). Examples of this technique are available for [System.Text.Json](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Microsoft.Azure.Core.Spatial/README.md) and [Newtonsoft.Json](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Microsoft.Azure.Core.Spatial.NewtonsoftJson/README.md).

Version 11.3 additions ([change log](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/CHANGELOG.md#1130-2021-06-08) details):

+ [KnowledgeStore](/dotnet/api/azure.search.documents.indexes.models.knowledgestore)
+ Added support for Azure.Core.GeoJson types in [SearchDocument](/dotnet/api/azure.search.documents.models.searchdocument), [SearchFilter](/dotnet/api/azure.search.documents.searchfilter) and [FieldBuilder](/dotnet/api/azure.search.documents.indexes.fieldbuilder).
+ Added EventSource based logging. Event source name is Azure-Search-Documents. Current set of events are focused on tuning batch sizes for [SearchIndexingBufferedSender](/dotnet/api/azure.search.documents.searchindexingbufferedsender-1).
+ Added [CustomEntityLookupSkill](/dotnet/api/azure.search.documents.indexes.models.customentitylookupskill) and [DocumentExtractionSkill](/dotnet/api/azure.search.documents.indexes.models.documentextractionskill). Added DefaultCountryHint in [LanguageDetectionSkill](/dotnet/api/azure.search.documents.indexes.models.languagedetectionskill).

## Before upgrading

+ Quickstarts, tutorials, and [C# samples](samples-dotnet.md) have been updated to use the Azure.Search.Documents package. We recommend reviewing the samples and walkthroughs to learn about the new APIs before embarking on a migration exercise.

+ [How to use Azure.Search.Documents](search-howto-dotnet-sdk.md) introduces the most commonly used APIs. Even  knowledgeable users of Azure AI Search might want to review this introduction to the new library as a precursor to migration.

<a name="UpgradeSteps"></a>

## Steps to upgrade

The following steps get you started on a code migration by walking through the first set of required tasks, especially regarding client references.

1. Install the [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/) by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

1. Replace using directives for Microsoft.Azure.Search with the following using statements:

   ```csharp
   using Azure;
   using Azure.Search.Documents;
   using Azure.Search.Documents.Indexes;
   using Azure.Search.Documents.Indexes.Models;
   using Azure.Search.Documents.Models;
   ```

1. For classes that require JSON serialization, replace `using Newtonsoft.Json` with `using System.Text.Json.Serialization`.

1. Revise client authentication code. In previous versions, you would use properties on the client object to set the API key (for example, the [SearchServiceClient.Credentials](/dotnet/api/microsoft.azure.search.searchserviceclient.credentials) property). In the current version, use the [AzureKeyCredential](/dotnet/api/azure.azurekeycredential) class to pass the key as a credential, so that if needed, you can update the API key without creating new client objects.

   Client properties have been streamlined to just `Endpoint`, `ServiceName`, and `IndexName` (where appropriate). The following example uses the system [Uri](/dotnet/api/system.uri) class to provide the endpoint and the [Environment](/dotnet/api/system.environment) class to read in the key value:

   ```csharp
   Uri endpoint = new Uri(Environment.GetEnvironmentVariable("SEARCH_ENDPOINT"));
   AzureKeyCredential credential = new AzureKeyCredential(
      Environment.GetEnvironmentVariable("SEARCH_API_KEY"));
   SearchIndexClient indexClient = new SearchIndexClient(endpoint, credential);
   ```

1. Add new client references for indexer-related objects. If you're using indexers, datasources, or skillsets, change the client references to [SearchIndexerClient](/dotnet/api/azure.search.documents.indexes.searchindexerclient). This client is new in version 11 and has no antecedent.

1. Revise collections and lists. In the new SDK, all lists are read-only to avoid downstream issues if the list happens to contain null values. The code change is to add items to a list. For example, instead of assigning strings to a Select property, you would add them as follows:

   ```csharp
   var options = new SearchOptions
    {
       SearchMode = SearchMode.All,
       IncludeTotalCount = true
    };

    // Select fields to return in results.
    options.Select.Add("HotelName");
    options.Select.Add("Description");
    options.Select.Add("Tags");
    options.Select.Add("Rooms");
    options.Select.Add("Rating");
    options.Select.Add("LastRenovationDate");
   ```

   Select, Facets, SearchFields, SourceFields, ScoringParameters, and OrderBy are all lists that now need to be reconstructed.

1. Update client references for queries and data import. Instances of [SearchIndexClient](/dotnet/api/microsoft.azure.search.searchindexclient) should be changed to [SearchClient](/dotnet/api/azure.search.documents.searchclient). To avoid name confusion, make sure you catch all instances before proceeding to the next step.

1. Update client references for index, synonym map, and analyzer objects. Instances of [SearchServiceClient](/dotnet/api/microsoft.azure.search.searchserviceclient) should be changed to [SearchIndexClient](/dotnet/api/microsoft.azure.search.searchindexclient). 

1. For the remainder of your code, update classes, methods, and properties to use the APIs of the new library. The [naming differences](#naming-differences) section is a place to start but you can also review the [change log](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/CHANGELOG.md).

   If you have trouble finding equivalent APIs, we suggest logging an issue on [https://github.com/MicrosoftDocs/azure-docs/issues](https://github.com/MicrosoftDocs/azure-docs/issues) so that we can improve the documentation or investigate the problem.

1. Rebuild the solution. After fixing any build errors or warnings, you can make additional changes to your application to take advantage of [new functionality](#WhatsNew).

<a name="ListOfChanges"></a>

## Breaking changes

Given the sweeping changes to libraries and APIs, an upgrade to version 11 is non-trivial and constitutes a breaking change in the sense that your code will no longer be backward compatible with version 10 and earlier. For a thorough review of the differences, see the [change log](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/CHANGELOG.md) for `Azure.Search.Documents`.

In terms of service version updates, where code changes in version 11 relate to existing functionality (and not just a refactoring of the APIs), you'll find the following behavior changes:

+ [BM25 ranking algorithm](index-ranking-similarity.md) replaces the previous ranking algorithm with newer technology. New services use this algorithm automatically. For existing services, you must set parameters to use the new algorithm.

+ [Ordered results](search-query-odata-orderby.md) for null values have changed in this version, with null values appearing first if the sort is `asc` and last if the sort is `desc`. If you wrote code to handle how null values are sorted, you should review and potentially remove that code if it's no longer necessary.

Due to these behavior changes, it's likely that there are slight variations in ranked results.

## Next steps

+ [How to use Azure.Search.Documents in a C# .NET Application](search-howto-dotnet-sdk.md)
+ [Tutorial: Add search to web apps](tutorial-csharp-overview.md)
+ [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/)
+ [Samples on GitHub](https://github.com/azure/azure-sdk-for-net/tree/Azure.Search.Documents_11.0.0/sdk/search/Azure.Search.Documents/samples)
+ [Azure.Search.Document API reference](/dotnet/api/overview/azure/search.documents-readme)
