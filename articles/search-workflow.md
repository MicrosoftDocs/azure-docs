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
	ms.date="04/23/2015" 
	ms.author="heidist"/>

# Typical workflow for Azure Search development

This article is a roadmap for including Azure Search as a component that provides the search experience in your custom application. Depending on whether you are testing the waters or ready to dive right in, you’ll want some preliminary guidance on how to integrate Azure Search into your custom development project.

In the following sections, we break out a typical workflow for an initial prototype that will help you evaluate how well Azure Search meets the search requirements of your application. Part two of this article covers important design decisions that factor into a more serious application development effort. 

Before you start prototyping, we recommend that you ramp up with one of our Getting Started tutorials or this [one-hour deep dive presentation video](http://azure.microsoft.com/documentation/videos/tech-ed-europe-2014-azure-search-deep-dive/). Get Started tutorials are offered in these languages: [.NET](../search-get-started-dotnet/), [Java](../search-get-started-java/), [Node.JS](../search-get-started-nodejs/).

##Prototype development

The quickest path to a successful prototype typically include the steps in this section. Steps include provisioning a service, define a schema for your index, load the index with documents, and query the index. 

For applications with volatile data (for example, if the common case includes rapid changes to inventory or content), your prototype should include a component for updating documents as well.

   ![][1]

###Step 1: Provision the service	

Azure Search is a fully-managed online service available through an Azure subscription. [Once you sign up for Azure](http://azure.microsoft.com/pricing/free-trial/), adding the Search service is quick. Visit [Create a Search service in the portal](../search-create-service-portal/) for instructions on how to add a Search service to your subscription.

There are two pricing tiers to choose from. We recommend the shared (free) service for prototyping, with the caveat that you will need to work with a small subset of your data. The shared service is free to existing subscribers (through trial or regular memberships) and is fast to setup, but it constrains the number of indexes and documents you can use to 3 indexes, up to 10,000 documents per index, or 50 MB of storage total, whichever comes first.

###Step 2: Create the index	

After you create the service, you are ready to create an index, starting with its schema definition. 

The fastest and easiest way to create an index is through the portal. At a minimum, each document must have a unique key and at least one field that contains searchable data. To get started, see [Create an index in the portal](../search-create-index-portal/).

> [AZURE.NOTE] **Inside an Azure Search Index**
>
> An *index* is organized, persisted data that serves as the *search corpus* for all subsequent search operations. Your search corpus is stored in the cloud as part of your Search service subscription, which enables search operations to execute quickly and consistently. In search terminology, an item in your search corpus is called a *document*, and the sum total of all documents is the *documents collection*. 
>
>An *index schema* defines all of the fields within a document by name, data type, and attributes that specify whether the field is searchable, filterable, facetable, and so forth. 
>
> Besides document structure, an index schema also specifies scoring profiles that provide criteria for boosting a search score, and configuration settings that enable auto-complete queries (suggesters) and CORS for cross-domain query requests. **For prototypes, we recommend that you start out simply by specifying just the fields in a document**, and then add other features incrementally (see Step 5 for a list of additional functionality to add later).  
> 
> Applied to a real-world example, consider an e-commerce application. The search index would contain all of the products or services that are searchable in your application (anything that comes back in a search results). There would be one document for each SKU. Each document would include the product name, brand, sizes, price, colors, and even references to images or other resource files that you want returned within search results.

###Step 3: Load documents

After saving the index in Azure Search, the next step is to populate the index with documents. In this step, data is uploaded, analyzed, tokenized, and stored in data structures (such as inverted indexes) that are designed for search workloads. 

Data that you upload to an index must conform to the schema you defined in the previous step. Document data is represented as a set of key/value pairs for each field, in JSON format. If your schema specifies an ID (key) field, a name field, a number field, and a URL field (which you might do if external images are part of your search results), then all the documents you feed into the index must have values (or null) for each field.

There are several ways to load documents, but right now, all of them require an API. For most prototypes, this step might be the most time consuming due to a coding requirement. Options are described below.

> [AZURE.NOTE] Remember that the shared service limits you to 10,000 documents per index. Be sure to reduce your dataset so that it stays under the limits. See [Limits and constraints](https://msdn.microsoft.com/library/dn798934.aspx) for more information.

####How to load data into an index

One approach is to use an indexer. For Azure DocumentDB or SQL Server relational data sources in Azure (specifically Azure SQL Database, or SQL Server in an Azure VM), you can use [indexers](https://msdn.microsoft.com/library/dn946891.aspx) to retrieve documents from a supported data source. Code samples that use indexers for loading documents can be found in any of these Getting started tutorials: [.NET](../search-get-started-dotnet/), [Java](../search-get-started-java/), [Node.JS](../search-get-started-nodejs/).

A second option is to write a simple program using either the REST API or the .NET library that loads the documents:

- [Add, update, or delete documents (REST API)](https://msdn.microsoft.com/library/dn798930.aspx)
- [DocumentOperationsExtensions Class](https://msdn.microsoft.com/library/microsoft.azure.search.documentoperationsextensions.aspx)

A third option that works for very small datasets is to use [Fiddler](../search-fiddler/) or [Chrome Postman](../search-chrome-postman/) to upload documents. 

A fourth option, perhaps the easiest one, is to borrow code from either the [Adventure Works C# REST API Example](https://azuresearchadventureworksdemo.codeplex.com/) that loads documents from an embedded database (.mdf) in the solution, or [Scoring Profiles C# REST API Example](https://azuresearchscoringprofiles.codeplex.com/) that loads data from JSON data files included in the solution.

> [AZURE.TIP] You could modify and run the [scoring profiles sample](https://azuresearchscoringprofiles.codeplex.com/), replacing the data JSON files and schema.json file with data that is valid for your application.

###Step 4: Query documents

Once documents are loaded into the index, you can write your first query. 

The fastest way to get initial search results back from your Search service is to use [Fiddler](../search-fiddler/) or [Chrome Postman](../search-chrome-postman/) to view a response, but realistically, you will want to write some simple UI code to view the results in a readable format. 

APIs for search operations include:

- [Search Documents operation](https://msdn.microsoft.com/library/dn798927.aspx)
- [SearchIndexClient Class](https://msdn.microsoft.com/library/microsoft.azure.search.searchindexclient.aspx)

Queries in Azure Search can be very simple. Including `search=*` on the URI will return the first 50 items in your search corpus; specifying `search=<some phrase>` will perform a full-text search on the phrase, returning up to 50 documents, assuming there are at least 50 documents that contain a match on the term input.

50 documents is the default. You can change the number of items returned using the `$Count` query parameter. This parameter is documented in [Search Documents](https://msdn.microsoft.com/library/dn798927.aspx).

> [AZURE.TIP] The most comprehensive list of query examples can be found in [Search Documents](https://msdn.microsoft.com/library/dn798927.aspx), but you might also want to review the [syntax reference](https://msdn.microsoft.com/library/dn798920.aspx) to review the list of supported operators.

###Step 5: Explore more features

Now that you have a service and index, you can experiment with features to further evolve the search experience. A short list of features to investigate are listed next.

**Search pages** often include document counts in a result set, or use pagination to subdivide results into more manageable numbers. See [Pagination](../search-pagination-page-layout/) for details.

**searchMode=all** is a query parameter that changes how Azure Search evaluates the NOT operator. By default, queries that include NOT (-) expand rather than narrow the results. You can set this parameter to change how the operator is evaluated. It’s documented in [Search Documents](https://msdn.microsoft.com/library/dn798927.aspx) or [SearchMode Enumeration](https://msdn.microsoft.com/library/microsoft.azure.search.models.searchmode.aspx).

**Scoring profiles** are used to boost search scores, causing items that meet predefined criteria to appear higher in the search results. See [Get started with scoring profiles](../search-get-started-scoring-profiles/) to step through this feature.

**Filters** are used to narrow search results by providing additional criteria on the selection. Filter expressions are placed within the query. See [Search Documents](https://msdn.microsoft.com/library/dn798927.aspx) for details.

**Faceted navigation** is used for self-directed filtering. Azure Search builds and returns the structure, and your code renders the faceted navigation structure in a search results page. See [Faceted Navigation](../search-faceted-navigation/) for details.

**Suggesters** refers to type-ahead or auto-complete queries that return suggested search terms as the user types in the first characters of a search phrase. See [Suggestions operation](https://msdn.microsoft.com/library/dn798936.aspx) or [Suggesters Class](https://msdn.microsoft.com/library/microsoft.azure.search.models.suggester.aspx) for more information.

**Language analyzers** provide the linguistic rules used during text analysis. The default language analyzer for Azure Search is Lucene English, but you can use different, or even multiple, analyzers by specifying them in your index. Lucene analyzers are available in all APIs. Microsoft natural language processors are only available in [2015-02-28-Preview REST API](../search-api-2015-02-28-preview/). See [Language Support](https://msdn.microsoft.com/library/dn879793.aspx) for more information.

###Step 6: Update indexes and documents

Some of the features that you want to evaluate might require an update to your index, which often has the downstream effect of requiring updates to your documents. 

If you need to update an index or documents, for example to add suggesters or specify language analyzers on fields that you’ve added for that purpose, see the following links for instructions:

- [Update Index operation (REST API)](https://msdn.microsoft.com/library/dn800964.aspx)
- [Update Indexer operation (REST API)](https://msdn.microsoft.com/library/dn946892.aspx)
- [Add, update or delete documents operation (REST API)](https://msdn.microsoft.com/library/dn798930.aspx)
- [Index Class (.NET library)](https://msdn.microsoft.com/library/microsoft.azure.search.models.index.aspx)
- [Documents Class (.NET library)](https://msdn.microsoft.com/library/microsoft.azure.search.models.document.aspx)

Once you have built a prototype that establishes proof-of-concept, you can take what you’ve learned to the next level by designing a development project that can support production workloads.

##Application development

Advancing to the next phase now requires decisions about which APIs to use, how to manage documents and upload frequency, and whether to include external resources in your search results.

Your solution design will still need to include all of the steps described for prototypes, but instead of prioritizing the most expedient path, you will want to consider which approaches are the most compatible with your overall solution.

###Choose an API

Azure Search provides two programming models: the .NET library for managed code, and a REST API for programming languages like Java, JavaScript, or another language that does not target the Microsoft .NET Framework.

Currently, a small subset of features are not yet in the .NET library, so even if you prefer to write managed code, you might need to use the REST API to get the features you want. Features that are only available in the REST API include:

- [Microsoft Natural Language processors - preview only](../search-api-2015-02-28-preview/)
- [moreLikeThis feature - preview only](../search-api-2015-02-28-preview/)
- [Management API](https://msdn.microsoft.com/library/dn832684.aspx)

You can periodically check the [What’s New](../search-latest-updates/) article to monitor changes in feature status.

###Determine data synchronization methods: Push or Pull

Push and pull models refer to how documents are updated in the index. Often, the scenario dictates which model is right for you. 

If your business is online retail, you most likely need a push model so that you can push or double-write any change in inventory to both your OLTP database and your Azure Search index. When a specific SKU is sold out, or a size or color becomes unavailable, you will want the index to be updated as quickly as possible to avoid customer frustration. Only push models can provide near-real-time updates to your search index.

There is no specific mechanism in Azure Search for implementing a push model. Your application code, at the data layer, must handle the documents update operation using either the [REST API](https://msdn.microsoft.com/library/dn798935.aspx) or [.NET Library](https://msdn.microsoft.com/library/dn951165.aspx) to update documents in the collection. As an implementation detail, using a product SKU for the document key can help with this task. 

Pull models are usually scheduled operations that retrieve data from external data sources. In Azure Search, a pull model is available through [Indexers](https://msdn.microsoft.com/library/azure/dn946891.aspx), which are in turn available for specific data sources: Azure DocumentDB or Azure SQL Database (and also SQL Server on Azure VMs).

###Loading Documents in batches

We recommend adding documents in batches to improve throughput. You can batch up to 1,000 documents, assuming an average document size of about 1-2KB.

There is an overall status code for the POST request. Status codes are either HTTP 200 (Success) or HTTP 207 (Multi-Status) if there is combination of successful and failed documents. In addition to the status code for the POST request, Azure Search maintains a status field for each document. Given a batch upload, you need a way to get per-document status that indicates whether the insert succeeded or failed for each document. The status field provides that information. It will be set to false if the document failed to load.

Under heavy load, it's not uncommon to have some upload failures. Should this occur, the overall status code is 207, indicating a partial success, and the documents that failed indexing will have the 'status' property set to false.

> [AZURE.NOTE]  When the service receives documents, they are queued up for indexing and may not be immediately included in search results. When not under a heavy load, documents are typically indexed within a few seconds.

When updating an index, you can combine multiple actions (insert, merge, delete) into the same batch, eliminating the need for multiple round trips. Currently Azure Search does not support partial updates (HTTP PATCH), so if you need to update an index, you must resend the index definition.

###Integrating external data into search results

Azure Search uses internal storage for the indexes and documents used in search operations. Text analysis and index parsing is dependent on having all searchable fields and associated attributes readily available.

However, not all fields in a document will be searchable. For example, if your application is an online catalog for music or videos, we recommend storing binary files in Azure BLOB service or some other storage format. The binary files themselves are not searchable, hence there is no need to persist them in Azure Search storage. Although you should store images, videos, and audio files in other services or locations, you should include a field that references the URL to the file location. This way, you can return the external data as part of your search results. 

To use external data, you should define a field in your index that stores a URL pointer to the external data file. If you issue a [Lookup Documents](https://msdn.microsoft.com/library/dn798929.aspx) request, or include the field in search results, the binary file appears in the context of a document.

###Capacity planning

One of the more compelling feature in Azure Search is the ease with which you can scale up or scale down resources in response to demand. While this capability doesn’t eliminate the need for capacity planning, it does minimize most of the risk. You’re not stuck with extra hardware, or the wrong hardware, for running your search workloads. 

As a last step, review the existing resource levels for both replicas and partitions, and determine whether adjustments are needed. The easiest way to adjust capacity is in the [Azure management portal](https://ms.portal.azure.com/).

Remember that only the standard pricing tier can be scaled up or down. Additionally, depending on the degree of adjustment, it can take anywhere from several minutes to several hours to deploy additional clusters for your service.

> [AZURE.NOTE] Capacity can be adjusted programmatically by using the Management REST API. For more information, see [Management REST API](https://msdn.microsoft.com/library/azure/dn832684.aspx).


<!--Image references-->
[1]: ./media/search-workflow/AzSearch-Workflow.png
