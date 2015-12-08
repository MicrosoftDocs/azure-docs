<properties 
	pageTitle="Node.js samples on github for DocumentDB | Microsoft Azure" 
	description="Find Node.js samples on github for common tasks in DocumentDB, including CRUD operations for JSON documents in NoSQL databases." 
	services="documentdb" 
	authors="mimig1" 
	manager="jhubbard" 
	editor="monicar" 
	documentationCenter="nodejs"/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/08/2015" 
	ms.author="mimig"/>


# DocumentDB Node.js samples

Sample solutions that perform CRUD operations and other common operations on DocumentDB resources are included in the [azure-documentdb-nodejs](https://github.com/Azure/azure-documentdb-node/tree/master/samples) GitHub repository. This article provides:

- Links to the tasks in each of the sample Node.js project files. 
- Links to the related API reference content.

**Prerequisites**

1. You need an Azure account to use these samples:
    - You can [open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/): You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites. Your credit card will never be charged, unless you explicitly change your settings and ask to be charged.
   - You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/): Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.
2. You also need the [Node.js SDK](documentdb-sdk-node.md). 

> [AZURE.NOTE] Each sample is self-contained, it sets itself up and cleans up after itself. As such, the samples issues multiple calls to [DocumentClient.createCollection](http://azure.github.io/azure-documentdb-node/DocumentClient.html). Each time this is done your subscription will be billed for 1 hour of usage per the performance tier of the collection being created. 

## Database samples

The [app.js](https://github.com/mimig1/azure-documentdb-node/blob/master/samples/DocumentDB.Samples.CollectionManagement/app.js) file of the [DocumentDB.Samples.CollectionManagement](https://github.com/mimig1/azure-documentdb-node/tree/master/samples/DocumentDB.Samples.CollectionManagement) project shows how to perform the following tasks.

Task | API reference
--- | ---
[Create a database](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DatabaseManagement/app.js#L121-L131) | [DocumentClient.createDatabase](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Query an account for a database](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DatabaseManagement/app.js#L146-L171) | [DocumentClient.queryDatabases](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Read a database by Id](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DatabaseManagement/app.js#L89-L99) | [DocumentClient.readDatabase](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[List databases for an account](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DatabaseManagement/app.js#L111-L119) | [DocumentClient.readDatabases](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Delete a database](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DatabaseManagement/app.js#L133-L144) | [DocumentClient.deleteDatabase](http://azure.github.io/azure-documentdb-node/DocumentClient.html)

## Collection samples 

The [app.js](https://github.com/mimig1/azure-documentdb-node/blob/master/samples/DocumentDB.Samples.CollectionManagement/app.js) file of the [DocumentDB.Samples.CollectionManagement](https://github.com/mimig1/azure-documentdb-node/tree/master/samples/DocumentDB.Samples.CollectionManagement) project shows how to perform the following tasks.

Task | API reference
--- | ---
[Create a collection](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.CollectionManagement/app.js#L97-L118) | [DocumentClient.createCollection](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Read a list of all collections in a database](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.CollectionManagement/app.js#L120-L130) | [DocumentClient.listCollections](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Get a collection by _self](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.CollectionManagement/app.js#L132-L141) | [DocumentClient.readCollection](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Get a collection by Id](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.CollectionManagement/app.js#L143-L156) | [DocumentClient.readCollection](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Get performance tier of a collection](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.CollectionManagement/app.js#L158-L186) | [DocumentQueryable.queryOffers](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Change performance tier of a collection](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.CollectionManagement/app.js#L188-L202) | [DocumentClient.replaceOffer](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Delete a collection](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.CollectionManagement/app.js#L204-L215) | [DocumentClient.deleteCollection](http://azure.github.io/azure-documentdb-node/DocumentClient.html)

## Document samples

The [app.js](https://github.com/mimig1/azure-documentdb-node/blob/master/samples/DocumentDB.Samples.DocumentManagement/app.js) file of the [DocumentDB.Samples.DocumentManagement](https://github.com/mimig1/azure-documentdb-node/tree/master/samples/DocumentDB.Samples.DocumentManagement) project shows how to perform the following tasks.

Task | API reference
--- | ---
[Create documents](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DocumentManagement/app.js#L153-L177) | [DocumentClient.createDocument](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Read the document feed for a collection](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DocumentManagement/app.js#L179-L189) | [DocumentClient.readDocuments](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Read a document by ID](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DocumentManagement/app.js#L191-L201) | [DocumentClient.readDocument](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Query for documents](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DocumentManagement/app.js#L82-L110) | [DocumentClient.queryDocuments](http://azure.github.io/azure-documentdb-node/DocumentClient.html) 
[Update a document](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DocumentManagement/app.js#L112-L119) | [DocumentClient.replaceDocument](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Delete a document](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.DocumentManagement/app.js#L122-L133) | [DocumentClient.deleteDocument](http://azure.github.io/azure-documentdb-node/DocumentClient.html)

## Indexing samples

The [app.js](https://github.com/Azure/azure-documentdb-node/blob/master/samples/DocumentDB.Samples.IndexManagement/app.js) file of the [DocumentDB.Samples.IndexManagement](https://github.com/mimig1/azure-documentdb-node/tree/master/samples/DocumentDB.Samples.IndexManagement) project shows how to perform the following tasks.

As a reminder, the default indexing policy sets [IndexingPolicy.automatic](http://azure.github.io/azure-documentdb-node/global.html#IndexingPolicy) to **True** by default.

Task | API reference
--- | ---
Create a collection with default indexing | [DocumentClient.createDocument](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Manually index a specific document](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.IndexManagement/app.js#L185-L238) | [indexingDirective: 'include'](http://azure.github.io/azure-documentdb-node/global.html)
[Manually exclude a specific document from the index](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.IndexManagement/app.js#L120-L183) | [indexingDirective: 'exclude'](http://azure.github.io/azure-documentdb-node/global.html)
[Use lazy indexing for bulk import or read heavy collections](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.IndexManagement/app.js#L240-L269) | [indexingMode: "lazy"](http://azure.github.io/azure-documentdb-node/global.html#indexingmode)
[Include specific paths of a document in indexing](https://github.com/mimig1/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.IndexManagement/app.js#L433-L444) | [IndexingPolicy.IncludedPaths](http://azure.github.io/azure-documentdb-node/global.html) 
[Exclude certain paths from indexing](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.IndexManagement/app.js#L427-L450) | [ExcludedPath](http://azure.github.io/azure-documentdb-node/global.html)
[Allow a scan on a string path during a range operation](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.IndexManagement/app.js#L271-L347)| [ExcludedPath.EnableScanInQuery](http://azure.github.io/azure-documentdb-node/global.html)
[Create a range index on a string path](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.IndexManagement/app.js#L349-L425) | [DocumentClient.queryDocument](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Create a collection with default indexPolicy, then update this online](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.IndexManagement/app.js#L519-L614) | [DocumentClient.createCollection](http://azure.github.io/azure-documentdb-node/DocumentClient.html)<br> [DocumentClient.replaceCollection](http://azure.github.io/azure-documentdb-node/DocumentClient.html)

For more information about indexing, see [DocumentDB indexing policies](documentdb-indexing-policies.md).

## Server-side programming samples

The [app.js](https://github.com/mimig1/azure-documentdb-node/blob/master/samples/DocumentDB.Samples.ServerSideScripts/app.js) file of the [DocumentDB.Samples.IndexManagement](https://github.com/mimig1/azure-documentdb-node/tree/master/samples/DocumentDB.Samples.ServerSideScripts) project shows how to perform the following tasks.

Task | API reference
--- | ---
[Create a stored procedure](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.ServerSideScripts/app.js#L44-L71) | [DocumentClient.createStoredProcedureAsync](http://azure.github.io/azure-documentdb-node/DocumentClient.html)
[Execute a stored procedure](https://github.com/Azure/azure-documentdb-node/blob/ef53e5f6707a5dc45920fb6ad54d9c7e008a6c18/samples/DocumentDB.Samples.ServerSideScripts/app.js#L73-L90) | [DocumentClient.executeStoredProcedure](http://azure.github.io/azure-documentdb-node/DocumentClient.html)

For more information about server-side programming, see [DocumentDB server-side programming: Stored procedures, database triggers, and UDFs](documentdb-programming.md).



