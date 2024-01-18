---
title: Knowledge store concepts
titleSuffix: Azure AI Search
description: A knowledge store is enriched content created by an Azure AI Search skillset and saved to Azure Storage for use in other apps and non-search scenarios.
author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/10/2024
---

# Knowledge store in Azure AI Search

Knowledge store is secondary storage for [AI-enriched content created by a skillset](cognitive-search-concept-intro.md) in Azure AI Search. In Azure AI Search, an indexing job always sends output to a search index, but if you attach a skillset to an indexer, you can optionally also send AI-enriched output to a container or table in Azure Storage. A knowledge store can be used for independent analysis or downstream processing in non-search scenarios like knowledge mining.

The two outputs of indexing, a search index and knowledge store, are mutually exclusive products of the same pipeline. They're derived from the same inputs and contain the same data, but their content is structured, stored, and used in different applications.

:::image type="content" source="media/knowledge-store-concept-intro/knowledge-store-concept-intro.svg" alt-text="Pipeline with skillset" border="false":::

Physically, a knowledge store is [Azure Storage](../storage/common/storage-account-overview.md), either Azure Table Storage, Azure Blob Storage, or both. Any tool or process that can connect to Azure Storage can consume the contents of a knowledge store.

When viewed through Azure portal, a knowledge store looks like any other collection of tables, objects, or files. The following screenshot shows a knowledge store composed of three tables. You can adopt a naming convention, such as a `kstore` prefix, to keep your content together.

:::image type="content" source="media/knowledge-store-concept-intro/kstore-in-storage-explorer.png" alt-text="Skills read and write from enrichment tree" border="true":::

## Benefits of knowledge store

The primary benefits of a knowledge store are two-fold: flexible access to content, and the ability to shape data.

Unlike a search index that can only be accessed through queries in Azure AI Search, a knowledge store is accessible to any tool, app, or process that supports connections to Azure Storage. This flexibility opens up new scenarios for consuming the analyzed and enriched content produced by an enrichment pipeline.

The same skillset that enriches data can also be used to shape data. Some tools like Power BI work better with tables, whereas a data science workload might require a complex data structure in a blob format. Adding a [Shaper skill](cognitive-search-skill-shaper.md) to a skillset gives you control over the shape of your data. You can then pass these shapes to projections, either tables or blobs, to create physical data structures that align with the data's intended use.

The following video explains both of these benefits and more.

> [!VIDEO https://www.youtube.com/embed/XWzLBP8iWqg?version=3]

## Knowledge store definition

A knowledge store is defined inside a skillset definition and it has two components: 

+ A connection string to Azure Storage

+ [**Projections**](knowledge-store-projection-overview.md) that determine whether the knowledge store consists of tables, objects or files. The projections element is an array. You can create multiple sets of table-object-file combinations within one knowledge store.

   ```json
   "knowledgeStore": {
      "storageConnectionString":"<YOUR-AZURE-STORAGE-ACCOUNT-CONNECTION-STRING>",
      "projections":[
         {
            "tables":[ ],
            "objects":[ ],
            "files":[ ]
         }
      ]
   }
   ```

The type of projection you specify in this structure determines the type of storage used by knowledge store, but not its structure. Fields in tables, objects, and files are determined by Shaper skill output if you're creating the knowledge store programmatically, or by the Import data wizard if you're using the portal.

+ `tables` project enriched content into Table Storage. Define a table projection when you need tabular reporting structures for inputs to analytical tools or export as data frames to other data stores. You can specify multiple `tables` within the same projection group to get a subset or cross section of enriched documents. Within the same projection group, table relationships are preserved so that you can work with all of them.

  Projected content is not aggregated or normalized. The following screenshot shows a table, sorted by key phrase, with the parent document indicated in the adjacent column. In contrast with data ingestion during indexing, there is no linguistic analysis or aggregation of content. Plural forms and differences in casing are considered unique instances.

  :::image type="content" source="media/knowledge-store-concept-intro/kstore-keyphrases-per-document.png" alt-text="Screenshot of key phrases and documents in a table" border="true":::

+ `objects` project JSON document into Blob storage. The physical representation of an `object` is a hierarchical JSON structure that represents an enriched document.

+ `files` project image files into Blob storage. A `file` is an image extracted from a document, transferred intact to Blob storage. Although it is named "files", it shows up in Blob Storage, not file storage.

## Create a knowledge store

To create knowledge store, use the portal or an API. 

You'll need [Azure Storage](../storage/index.yml), a [skillset](cognitive-search-working-with-skillsets.md), and an [indexer](search-indexer-overview.md). Because indexers require a search index, you'll also need to provide an index definition.

Go with the portal approach for the fastest route to a finished knowledge store. Or, choose the REST API for a deeper understanding of how objects are defined and related.

### [**Azure portal**](#tab/portal)

[**Create your first knowledge store in four steps**](knowledge-store-create-portal.md) using the **Import data** wizard.

1. Define a data source that contains the data you want to enrich.

1. Define a skillset. The skillset specifies enrichment steps and the knowledge store.

1. Define an index schema. You might not need one, but indexers require it. The wizard can infer an index.

1. Complete the wizard. Data extraction, enrichment, and knowledge store creation occur in this last step.

The wizard automates several tasks. Specifically, both shaping and projections (definitions of physical data structures in Azure Storage) are created for you. 

### [**REST**](#tab/kstore-rest)

[**Create your first knowledge store using Postman**](knowledge-store-create-rest.md) is a tutorial that walks you through the objects and requests belonging to this [knowledge store collection](https://github.com/Azure-Samples/azure-search-postman-samples/tree/main/knowledge-store).

REST API version `2020-06-30` can be used to create a knowledge store through additions to a skillset.

+ [Create Skillset (api-version=2020-06-30)](/rest/api/searchservice/create-skillset)
+ [Update Skillset (api-version=2020-06-30)](/rest/api/searchservice/update-skillset)

Within the skillset:

+ Specify the projections that you want built into Azure Storage (tables, objects, files)
+ Include a Shaper skill in your skillset to determine the schema and contents of the projection
+ Assign the named shape to a projection

### [**C#**](#tab/kstore-csharp)

For .NET developers, use the [KnowledgeStore Class](/dotnet/api/azure.search.documents.indexes.models.knowledgestore) in the Azure.Search.Documents client library.

---

<a name="tools-and-apps"></a>

## Connect with apps

Once enriched content exists in storage, any tool or technology that connects to Azure Storage can be used to explore, analyze, or consume the contents. The following list is a start:

+ [Storage Explorer](../storage/blobs/quickstart-storage-explorer.md) or Storage browser (preview) in Azure portal to view enriched document structure and content. Consider this as your baseline tool for viewing knowledge store contents.

+ [Power BI](knowledge-store-connect-power-bi.md) for reporting and analysis. 

+ [Azure Data Factory](../data-factory/index.yml) for further manipulation.

## Content lifecycle

Each time you run the indexer and skillset, the knowledge store is updated if the skillset or underlying source data has changed. Any changes picked up by the indexer are propagated through the enrichment process to the projections in the knowledge store, ensuring that your projected data is a current representation of content in the originating data source. 

> [!NOTE]
> While you can edit the data in the projections, any edits will be overwritten on the next pipeline invocation, assuming the document in source data is updated. 

### Changes in source data

For data sources that support change tracking, an indexer will process new and changed documents, and bypass existing documents that have already been processed. Timestamp information varies by data source, but in a blob container, the indexer looks at the `lastmodified` date to determine which blobs need to be ingested.

### Changes to a skillset

If you are making changes to a skillset, you should [enable caching of enriched documents](cognitive-search-incremental-indexing-conceptual.md) to reuse existing enrichments where possible.

Without incremental caching, the indexer will always process documents in order of the high water mark, without going backwards. For blobs, the indexer would process blobs sorted by `lastModified`, regardless of any changes to indexer settings or the skillset. If you change a skillset, previously processed documents aren't updated to reflect the new skillset. Documents processed after the skillset change will use the new skillset, resulting in index documents being a mix of old and new skillsets.

With incremental caching, and after a skillset update, the indexer will reuse any enrichments that are unaffected by the skillset change. Upstream enrichments are pulled from cache, as are any enrichments that are independent and isolated from the skill that was changed.

### Deletions

Although an indexer creates and updates structures and content in Azure Storage, it does not delete them. Projections continue to exist even when the indexer or skillset is deleted. As the owner of the storage account, you should delete a projection if it is no longer needed. 

## Next steps

Knowledge store offers persistence of enriched documents, useful when designing a skillset, or the creation of new structures and content for consumption by any client applications capable of accessing an Azure Storage account.

The simplest approach for creating enriched documents is [through the portal](knowledge-store-create-portal.md), but you can also use Postman and the REST API, which is more useful if you want insight into how objects are created and referenced programmatically.

> [!div class="nextstepaction"]
> [Create a knowledge store using Postman and REST](knowledge-store-create-rest.md)
