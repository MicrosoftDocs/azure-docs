---
title: Upgrade to .NET SDK version 11
titleSuffix: Azure Cognitive Search
description: Migrate code to the Azure Cognitive Search .NET SDK version 11 from older versions. Learn what is new and which code changes are required.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 01/07/2021
ms.custom: devx-track-csharp
---

# Upgrade to Azure Cognitive Search .NET SDK version 11

If you're using version 10.0 or older of the [.NET SDK](/dotnet/api/overview/azure/search), this article will help you upgrade to version 11 and the **Azure.Search.Documents** client library.

Version 11 is a fully redesigned client library, released by the Azure SDK development team (previous versions were produced by the Azure Cognitive Search development team). The library has been redesigned for greater consistency with other Azure client libraries, taking a dependency on [Azure.Core](/dotnet/api/azure.core) and [System.Text.Json](/dotnet/api/system.text.json), and implementing familiar approaches for common tasks.

Some key differences you'll notice in the new version include:

+ One package and library as opposed to multiple
+ A new package name: `Azure.Search.Documents` instead of `Microsoft.Azure.Search`.
+ Three clients instead of two: `SearchClient`, `SearchIndexClient`, `SearchIndexerClient`
+ Naming differences across a range of APIs and small structural differences that simplify some tasks

In addition to this article, you can review the [Change Log](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/CHANGELOG.md) for an itemized list of changes in .NET SDK version 11.

## Package and library consolidation

Version 11 consolidates multiple packages and libraries into one. Post-migration, you will have fewer libraries to manage.

+ [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/)

+ [API reference for the client library](/dotnet/api/overview/azure/search.documents-readme)

## Client differences

Where applicable, the following table maps the client libraries between the two versions.

| Scope of operations | Microsoft.Azure.Search&nbsp;(v10) | Azure.Search.Documents&nbsp;(v11) |
|---------------------|------------------------------|------------------------------|
| Client used for queries and to populate an index. | [SearchIndexClient](/dotnet/api/azure.search.documents.indexes.searchindexclient) | [SearchClient](/dotnet/api/azure.search.documents.searchclient) |
| Client used for indexes, analyzers, synonym maps | [SearchServiceClient](/dotnet/api/microsoft.azure.search.searchserviceclient) | [SearchIndexClient](/dotnet/api/azure.search.documents.indexes.searchindexclient) |
| Client used for indexers, data sources, skillsets | [SearchServiceClient](/dotnet/api/microsoft.azure.search.searchserviceclient) | [SearchIndexerClient (**new**)](/dotnet/api/azure.search.documents.indexes.searchindexerclient) |

> [!Important]
> `SearchIndexClient` exists in both versions, but supports different things. In version 10, `SearchIndexClient` create indexes and other objects. In version 11, `SearchIndexClient` works with existing indexes. To avoid confusion when updating code, be mindful of the order in which client references are updated. Following the sequence in [Steps to upgrade](#UpgradeSteps) should help mitigate any string replacement issues.

<a name="naming-differences"></a>

## Naming and other API differences

Besides the client differences (noted previously and thus omitted here), multiple other APIs have been renamed and in some cases redesigned. Class name differences are summarized below. This list is not exhaustive but it does group API changes by task, which can be helpful for revisions on specific code blocks. For an itemized list of API updates, see the [change log](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/CHANGELOG.md) for `Azure.Search.Documents` on GitHub.

### Authentication and encryption

| Version 10 | Version 11 equivalent |
|------------|-----------------------|
| [SearchCredentials](/dotnet/api/microsoft.azure.search.searchcredentials) | [AzureKeyCredential](/dotnet/api/azure.azurekeycredential) |
| `EncryptionKey` (existed in the [preview SDK](https://www.nuget.org/packages/Microsoft.Azure.Search/8.0.0-preview) as a generally available feature) | [SearchResourceEncryptionKey](/dotnet/api/azure.search.documents.indexes.models.searchresourceencryptionkey) |

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

### Query definitions and results

| Version 10 | Version 11 equivalent |
|------------|-----------------------|
| [DocumentSearchResult](/dotnet/api/microsoft.azure.search.models.documentsearchresult-1) | [SearchResult](/dotnet/api/azure.search.documents.models.searchresult-1) or [SearchResults](/dotnet/api/azure.search.documents.models.searchresults-1), depending on whether the result is a single document or multiple. |
| [DocumentSuggestResult](/dotnet/api/microsoft.azure.search.models.documentsuggestresult-1) | [SuggestResults](/dotnet/api/azure.search.documents.models.suggestresults-1) |
| [SearchParameters](/dotnet/api/microsoft.azure.search.models.searchparameters) |  [SearchOptions](/dotnet/api/azure.search.documents.searchoptions)  |

### JSON serialization

By default, the Azure SDK uses [System.Text.Json](/dotnet/api/system.text.json) for JSON serialization, relying on the capabilities of those APIs to handle text transformations previously implemented through a native [SerializePropertyNamesAsCamelCaseAttribute](/dotnet/api/microsoft.azure.search.models.serializepropertynamesascamelcaseattribute) class, which has no counterpart in the new library.

To serialize property names into camelCase, you can use the [JsonPropertyNameAttribute](/dotnet/api/system.text.json.serialization.jsonpropertynameattribute) (similar to [this example](https://github.com/Azure/azure-sdk-for-net/tree/d263f23aa3a28ff4fc4366b8dee144d4c0c3ab10/sdk/search/Azure.Search.Documents#use-c-types-for-search-results)).

Alternatively, you can set a [JsonNamingPolicy](/dotnet/api/system.text.json.jsonnamingpolicy) provided in [JsonSerializerOptions](/dotnet/api/system.text.json.jsonserializeroptions). The following System.Text.Json code example, taken from the [Microsoft.Azure.Core.Spatial readme](https://github.com/Azure/azure-sdk-for-net/blob/259df3985d9710507e2454e1591811f8b3a7ad5d/sdk/core/Microsoft.Azure.Core.Spatial/README.md#deserializing-documents) demonstrates the use of camelCase without having to attribute every property:

```csharp
// Get the Azure Cognitive Search endpoint and read-only API key.
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

If you are using Newtonsoft.Json for JSON serialization, you can pass in global naming policies using similar attributes, or by using properties on [JsonSerializerSettings](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_JsonSerializerSettings.htm). For an example equivalent to the one above, see the [Deserializing documents example](https://github.com/Azure/azure-sdk-for-net/blob/259df3985d9710507e2454e1591811f8b3a7ad5d/sdk/core/Microsoft.Azure.Core.Spatial.NewtonsoftJson/README.md) in the Newtonsoft.Json readme.


<a name="WhatsNew"></a>

## What's in version 11

Each version of an Azure Cognitive Search client library targets a corresponding version of the REST API. The REST API is considered foundational to the service, with individual SDKs wrapping a version of the REST API. As a .NET developer, it can be helpful to review [REST API documentation](/rest/api/searchservice/) if you want more background on specific objects or operations.

Version 11 targets the [2020-06-30 search service](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/search/data-plane/Azure.Search/preview/2020-06-30/searchservice.json). Because version 11 is also a new client library built from the ground up, most of the development effort has focused on equivalency with version 10, with some REST API feature support still pending.

Version 11.0 fully supports the following objects and operations:

+ Index creation and management
+ Synonym map creation and management
+ All query types and syntax (except geo-spatial filters)
+ Indexer objects and operations for indexing Azure data sources, including data sources and skillsets

Version 11.1 adds the following:

+ [FieldBuilder](/dotnet/api/azure.search.documents.indexes.fieldbuilder) (added in 11.1)
+ [Serializer property](/dotnet/api/azure.search.documents.searchclientoptions.serializer) (added in 11.1) to support custom serialization

### Pending features

The following version 10 features are not yet available in version 11. If you require these features, hold off on migration until they are supported.

+ [Knowledge store](knowledge-store-concept-intro.md)
+ Geospatial types - first class support for geospatial types is still in progress. For now, the [Microsoft.Spatial](https://www.nuget.org/packages/Microsoft.Spatial/) package can be used to support geographic operations. Examples are available for [System.Text.Json](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/core/Microsoft.Azure.Core.Spatial/README.md) and [Newtonsoft.Json](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/core/Microsoft.Azure.Core.Spatial.NewtonsoftJson/README.md).

<a name="UpgradeSteps"></a>

## Steps to upgrade

The following steps get you started on a code migration by walking through the first set of required tasks, especially with regard to client references.

1. Install the [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/) by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

1. Replace using directives for Microsoft.Azure.Search with the following:

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

1. Add new client references for indexer-related objects. If you are using indexers, datasources, or skillsets, change the client references to [SearchIndexerClient](/dotnet/api/azure.search.documents.indexes.searchindexerclient). This client is new in version 11 and has no antecedent.

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

1. For the remainder of your code, update classes, methods, and properties to use the APIs of the new library. The [naming differences](#naming-differences) section is a place to start but you can also review the [change log](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/CHANGELOG.md).

   If you have trouble finding equivalent APIs, we suggest logging an issue on [https://github.com/MicrosoftDocs/azure-docs/issues](https://github.com/MicrosoftDocs/azure-docs/issues) so that we can improve the documentation or investigate the problem.

1. Rebuild the solution. After fixing any build errors or warnings, you can make additional changes to your application to take advantage of [new functionality](#WhatsNew).

<a name="ListOfChanges"></a>

## Breaking changes

Given the sweeping changes to libraries and APIs, an upgrade to version 11 is non-trivial and constitutes a breaking change in the sense that your code will no longer be backward compatible with version 10 and earlier. For a thorough review of the differences, see the [change log](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/CHANGELOG.md) for `Azure.Search.Documents`.

In terms of service version updates, where code changes in version 11 relate to existing functionality (and not just a refactoring of the APIs), you will find the following behavior changes:

+ [BM25 ranking algorithm](index-ranking-similarity.md) replaces the previous ranking algorithm with newer technology. New services will use this algorithm automatically. For existing services, you must set parameters to use the new algorithm.

+ [Ordered results](search-query-odata-orderby.md) for null values have changed in this version, with null values appearing first if the sort is `asc` and last if the sort is `desc`. If you wrote code to handle how null values are sorted, you should review and potentially remove that code if it's no longer necessary.

## Next steps

+ [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/)
+ [Samples on GitHub](https://github.com/azure/azure-sdk-for-net/tree/Azure.Search.Documents_11.0.0/sdk/search/Azure.Search.Documents/samples)
+ [Azure.Search.Document API reference](/dotnet/api/overview/azure/search.documents-readme)