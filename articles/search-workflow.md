<properties 
	pageTitle="Typical workflow for Azure Search development | Microsoft Azure" 
	description="A workflow or roadmap for building prototype and production applications that integrated with Azure Search"
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="04/14/2015" 
	ms.author="heidist"/>

# Typical workflow for Azure Search development

In this article, you’ll find a roadmap for building applications that include Azure Search as a component that provides the search experience. Depending on whether you are testing the waters or ready to dive right in, you’ll want some preliminary guidance on how to integrate Azure Search into your custom development project.

This article breaks down a typical workflow for prototypes that demonstrate the value of Azure Search in the context of your application, followed by a section about important design decisions for a more serious development effort. 

Before you start prototyping, we recommend ramping up with one of our Getting Started tutorials. Get Started tutorials are offered in these languages: [.NET](../search-get-started-dotnet/), [Java](../search-get-started-java/), [Node.JS](../search-get-started-nodejs/).

##Phase 1: Prototype project development

The quickest path to a successful prototype typically include the steps in this section.

###Provision the service	

Azure Search is available through an Azure subscription. [Once you sign up](http://azure.microsoft.com/pricing/free-trial/), adding the Search service is quick. 

There are two pricing tiers to choose from. We recommend the shared service for prototyping, with the caveat that you will need to work with a small subset of your data. The shared service is free to existing subscribers (trial or regular memberships) and fast to setup, but limits the number of indexes and documents you can work with.

[Create a Search service in the portal](http://azure.microsoft.com/documentation/articles/search-create-service-portal/) provides the steps for adding a Search service to your subscription.

###Create the index	

An index is organized, persisted data that serves as the search corpus for all subsequent search operations. It is stored in the cloud as part of your Search service. An index contains searchable data as well as non-searchable data to support filtering, criteria for boosting a search score, and configuration settings that enable auto-complete queries (suggesters).

The fastest and easiest way to create an index is through the portal. You can type in fields, data types, and attributes for the data you want to index. You can also fill in scoring profiles or enable CORS.

An index, as it applies to the documents collection, is structured like a table in a database. If you’ve created tables in client tools before, this is a similar exercise.

To get started, see [Create an index in the portal](http://azure.microsoft.com/documentation/articles/search-create-index-portal/) for more information.

###Load documents

After creating the index, the next step is load documents. Loading documents is a separate operation that populates the index. In this step, data is uploaded, analyzed, tokenized, and stored in data structures (such as inverted indexes) that are designed for search workloads. Storage is built into the service and managed for you. You cannot customize or substitute the data storage layer used in Azure Search.

Each document must have a unique key and a collection of fields containing searchable and non-searchable data. Document data is represented as a set of key/value pairs for each field, in JSON format.

Data that you load to an index must conform to the schema you defined in the previous step. If your schema specifies an ID (key) field, a name field, a number field, and a URL field (which you might do if external images are part of your search results), then all the documents you feed into the index must have values (or null) for each field.

There are several ways to load documents, but right now, all of them require an API. For most prototypes, this step is the most time consuming due to a coding requirement.

For minimal coding and very small datasets, you could use [Fiddler](../search-fiddler) or [Chrome Postman](../search-chrome-postman) to upload documents. 

For SQL Server relational data sources in Azure (specifically Azure SQL Database, or SQL Server in an Azure VM), you can use [indexers](https://msdn.microsoft.com/library/dn946891.aspx).

You could also write a simple program using either the REST API or the .NET library that loads the documents:

- [Add, update, or delete documents (REST API)](https://msdn.microsoft.com/library/dn798930.aspx)
- [DocumentOperationsExtensions Class](https://msdn.microsoft.com/library/microsoft.azure.search.documentoperationsextensions.aspx)

Samples that include code for loading documents are provided for these Getting started tutorials: [.NET](../search-get-started-dotnet/), [Java](../search-get-started-java/), [Node.JS](../search-get-started-nodejs/).

You can also review this code sample for an [Adventure Works C# REST API example](https://azuresearchadventureworksdemo.codeplex.com/) that loads documents from an embedded database (.mdf) in the solution, or this [scoring profiles C# REST API example](https://azuresearchscoringprofiles.codeplex.com/) that loads data from JSON data files included in the solution.

Remember that the shared service has limits of 10,000 documents per index. See [Limits and constraints](https://msdn.microsoft.com/library/dn798934.aspx) for more information.

###Query documents

The fastest way to get initial search results back from your Search service is to use [Fiddler](../search-fiddler) or [Chrome Postman](../search-chrome-postman) to view a response, but realistically, you will want to write some simple UI code to view the results in a readable format. 

APIs for search operations include:

- [Search Documents operation](https://msdn.microsoft.com/library/dn798927.aspx)
- [SearchIndexClient Class](https://msdn.microsoft.com/library/microsoft.azure.search.searchindexclient.aspx)

Queries in Azure Search can be very minimalistic. Including `search=*` on the URI will return the first 50 items in your search corpus; specifying `search=<some phrase>` will perform a full-text search on the phrase, returning up to 50 documents, assuming there are at least 50 documents that contain a match on the term input.

50 documents is the default. You can change the number of items returned using the `$Count` query parameter. This parameter is documented in [Search Documents](https://msdn.microsoft.com/library/dn798927.aspx).

The most comprehensive list of query examples can be found in [Search Documents](https://msdn.microsoft.com/library/dn798927.aspx), but you might also want to review the [syntax reference](https://msdn.microsoft.com/library/dn798920.aspx) to review the list of supported operators.

###Evaluate results and explore capabilities

Now that you have a service and index, you can experiment with features that further evolve the search experience. A short list of features to explore are listed next.

**searchMode=all** is a query parameter that changes how Azure Search evaluates the NOT operator. By default, queries that include NOT (-) expand rather than narrow the results. You can set this parameter to change how the operator is evaluated. It’s documented in [Search Documents](https://msdn.microsoft.com/library/dn798927.aspx) or [SearchMode Enumeration](https://msdn.microsoft.com/library/microsoft.azure.search.models.searchmode.aspx).

**Scoring profiles** are used to boost search scores, causing items that meet the criteria to appear higher in the search results. See [Get started with scoring profiles](../search-get-started-scoring-profiles/) to step through this feature.

**Filters** are used to narrow search results by providing additional criteria on the selection. Filter expressions are provided with the query. See [Search Documents](https://msdn.microsoft.com/library/dn798927.aspx) for details.

**Faceted navigation** is used for self-directed filtering. Azure Search builds and returns the structure, and your code handles the visualization in a search results page. See [Faceted Navigation](../search-faceted-navigation/) for details. 

**Search pages** typically include counts in a result set, or use pagination to subdivide results into more manageable numbers. See [Pagination](../search-pagination-page-layout/) for details.

**Suggesters** refers to type-ahead or autocomplete queries that return suggested search terms as the user types in the first characters of a search phrase. See [Suggestions operation](https://msdn.microsoft.com/library/dn798936.aspx) or [Suggesters Class](https://msdn.microsoft.com/library/microsoft.azure.search.models.suggester.aspx) for more information.

**Language analyzers** provide the linguistic rules used during text analysis. The default language analyzer for Azure Search is Lucene English, but you can use different, or even multiple, analyzers by specifying them in your index. Lucene analyzers are available in all APIs. Microsoft natural language processors are only available in [2015-02-28-Preview REST API](../search-api-2015-02-28-preview/). See [Language Support](https://msdn.microsoft.com/library/dn879793.aspx) for more information.

###Update indexes and documents

Some of the features that you want to evaluate might require an update to your index, which often has the downstream effect of requiring updates to your documents. 

If you need to update an index or documents, for example to add suggesters or specify language analyzers on fields that you’ve added for that purpose, see the following links for instructions:

- [Update Index operation](https://msdn.microsoft.com/library/dn800964.aspx)
- [Update Indexer operation](https://msdn.microsoft.com//library/dn946892.aspx)
- [Add, update or delete documents operation](https://msdn.microsoft.com/library/dn798930.aspx)
- [Index Class](https://msdn.microsoft.com/library/microsoft.azure.search.models.index.aspx)
- [Documents Class](https://msdn.microsoft.com/library/microsoft.azure.search.models.document.aspx)

Once you have built a prototype that establishes proof-of-concept, you can take what you’ve learned to the next level by designing an application development project that can support production workloads.

##Phase 2: Application development

Advancing to the next phase now requires decisions about which APIs to use, how to manage documents and upload frequency, and whether to include external resources in your search results.

###Choose an API

You can use the .NET library or the REST API if your programming language is Java, JavaScript, or another language that does not target the Microsoft .NET Framework.

Currently, a few features are not yet in the .NET library, so even if you prefer to write managed code, you might need to use the REST API to get the features you want. Features that fall into this category include:

- [Indexers](https://msdn.microsoft.com/library/dn946891.aspx)
- [Microsoft Natural Language processors - preview only](../search-api-2015-02-28-preview/)
- [moreLikeThis feature - preview only](../search-api-2015-02-28-preview/)
- [Management API](https://msdn.microsoft.com/library/dn832684.aspx)

You can periodically check the [What’s New](../search-latest-updates/) article to monitor changes in feature status.

###Determine data synchronization methods: Push or Pull

Push and pull models refer to how documents are updated in the index. Often, the scenario dictates which model is right for you. 

If your business is online retail, you most likely need a push model so that you can push or double-write any change in inventory to both your OLTP database and your Azure Search index. When a specific SKU is sold out, or a size or color becomes unavailable, you will want the index to be updated as quickly as possible to avoid disappointing your customers. Only push models can provide that level of near-real-time updating.

There is no specific mechanism in Azure Search for implementing a push model. Your application code, at the data layer, must handle the operation using either the [REST API](https://msdn.microsoft.com/library/dn798935.aspx) or [.NET Library](https://msdn.microsoft.com/library/dn951165.aspx) to update documents in the collection. As an implementation detail, using a product SKU for the document key can help with this task. 

Pull models are usually scheduled operations that retrieve data from external data sources. In Azure Search, a pull model is available through Indexers, which are in turn available for specific data sources: Azure DocumentDB or Azure SQL Database (and also SQL Server on Azure VMs).

###Loading Documents

We recommend adding documents in batches to improve throughput. You can batch up to 1,000 documents, assuming an average document size of about 1-2KB.

There is an overall status code for the POST request. Status codes are either HTTP 200 (Success) or HTTP 207 (Multi-Status) if there is combination of successful and failed documents. In addition to the status code for the POST request, Azure Search maintains a status field for each document. Given a batch upload, you need a way to get per-document status that indicates whether the insert succeeded or failed for each document. The status field provides that information. It will be set to false if the document failed to load.
Under heavy load, it's not uncommon to have some upload failures. Should this occur, the overall status code is 207, indicating a partial success, and the documents that failed indexing will have the 'status' property set to false.

> AZURE.NOTE  When the service receives documents, they are queued up for indexing and may not be immediately included in search results. When not under a heavy load, documents are typically indexed within a few seconds.

When updating an index, you can combine multiple actions (insert, merge, delete) into the same batch, eliminating the need for multiple round trips. Currently Azure Search does not support partial updates (HTTP PATCH), so if you need to update an index, you must resend the index definition.

###Integrating external data into search results

Azure Search uses internal storage for the indexes and documents used in search operations. Text analysis and index parsing is dependent on having all searchable fields and associated attributes readily available.

However, not all fields in a document will be searchable. For example, if your application is an online catalog for music or videos, we recommend storing binary files in Azure BLOB service or some other storage format. The binary files themselves are not searchable, hence there is no need to persist them in Azure Search storage. Although you should store images, videos, and audio files in other services or locations, you should include a field that references the URL to the file location. This way, you can return the external data as part of your search results. 

To use external data, you should define a field in your index that stores a URL pointer to the external data file. If you issue a [Lookup Documents](https://msdn.microsoft.com/library/dn798929.aspx) request, or include the field in search results, the binary file appears in the context of a document.


###Capacity planning

One of the more compelling feature in Azure Search is the ease with which you can scale up or scale down resources in response to demand. While this capability doesn’t eliminate the need for capacity planning, it does minimize most of the risk. You’re not stuck with extra hardware, or the wrong hardware, for running your search workloads. 

As a last step, review the existing resource levels for both replicas and partitions, and determine whether adjustments are needed. The easiest way to adjust capacity is in the [Azure management portal](https://ms.portal.azure.com/).

Remember that only the standard pricing tier can be scaled up or down. Additionally, depending on the degree of adjustment, it can take anywhere from several minutes to several hours to deploy additional clusters for your service.

> AZURE.NOTE Capacity can be adjusted programmatically by using the Management REST API. For more information, see [Management REST API](https://msdn.microsoft.com/library/azure/dn832684.aspx).

