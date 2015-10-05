<properties 
	pageTitle=".NET snippets for DocumentDB | Microsoft Azure" 
	description="Find .NET snippets for common tasks in DocumentDB, including CRUD operations for database accounts, databases, and collections." 
	services="documentdb" 
	authors="mimig1" 
	manager="jhubbard" 
	editor="monicar" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/05/2015" 
	ms.author="mimig"/>


# DocumentDB .NET samples

> [AZURE.SELECTOR]
- [.NET](documentdb-dotnet-samples.md)
- [Node.js](documentdb-nodejs-samples.md)
- [Java](documentdb-java-samples.md)
- [Python](documentdb-python-samples.md)
- [JavaScript client-side](documentdb-javascript-client-samples.md)
- [JavaScript server-side](documentdb-javascript-server-samples.md)

Sample projects that perform common operations on DocumentDB resources are included in the [azure-documentdb-net](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples) GitHub repository. This article lists the tasks performed on each resource in the sample, and provides links to the related reference content.

**Prerequisites**

1. You need an Azure account to use these samples:
    - You can [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F): You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites. Your credit card will never be charged, unless you explicitly change your settings and ask to be charged.
   - You can [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F): Your MSDN subscription gives you credits every month that you can use for paid Azure services.
2. You also need the [Microsoft.Azure.DocumentDB NuGet package](http://www.nuget.org/packages/Microsoft.Azure.DocumentDB/). 

## Database samples

Samples for the following database tasks are included in the [azure-documentdb-net/samples/code-samples/DatabaseManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DatabaseManagement/Program.cs) file.

Task | Method
--- | ---
Create a database | [DocumentClient.CreateDatabaseAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdatabaseasync.aspx#M:Microsoft.Azure.Documents.Client.DocumentClient.CreateDatabaseAsync(Microsoft.Azure.Documents.Database,Microsoft.Azure.Documents.Client.RequestOptions)
Query account for a database | [DocumentQueryable.CreateDatabaseQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdatabasequery.aspx)
List databases for an account | [DocumentClient.ReadDatabaseFeedAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readdatabasefeedasync.aspx)
Retrieve the DocumentDB endpointUrl, primary and secondary authorization keys | [ConfigurationManager.AppSettings](https://msdn.microsoft.com/library/system.configuration.configurationmanager.appsettings%28v=vs.110%29.aspx)
Delete a database | [DocumentClient.DeleteDatabaseAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.deletedatabaseasync.aspx#M:Microsoft.Azure.Documents.Client.DocumentClient.DeleteDatabaseAsync)

## Collection samples 

Samples for the following collection tasks are included in the [azure-documentdb-net/samples/code-samples/ CollectionManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/CollectionManagement/Program.cs) file.

Task | Method
--- | ---
Create a collection | ..
Create a collection with a custom index policy | ..
Retrieve the performance tier of the collection | ..
Update the performance tier of a collection | ..
Delete a collection | ..

## Document samples

The document sample file, [azure-documentdb-net/samples/code-samples/DocumentManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DocumentManagement/Program.cs), shows how to do the following:

Task | Method
--- | ---
Create a list of plain old clr objects (POCOs) and insert them into collection | [DocumentClient.CreateDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createattachmentasync.aspx)
Read a document | [DocumentClient.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentquery.aspx) 
Update a document | [DocumentClient.ReplaceDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replacedocumentasync.aspx).
Create a document attachment | [DocumentClient.CreateAttachmentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createattachmentasync.aspx). 
Query the document for attachments | [DocumentClient.CreateAttachmentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createattachmentquery.aspx). 
Read media content | [DocumentClient.ReadMediaAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readmediaasync.aspx). 

## Indexing samples

The indexing sample file, [azure-documentdb-net/samples/code-samples/IndexManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/IndexManagement/Program.cs), shows how to do the following:

Task | Method
--- | ---
Exclude a document from automatic indexing | [CreateDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createattachmentasync.aspx) and [IndexingDirective.Exclude](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingdirective.aspx).
Opt-in indexing of documents with manual indexing policy | [CreateDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createattachmentasync.aspx).
Use lazy indexing for bulk import or read heavy collections | [DocumentCollection](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.documentcollection.documentcollection.aspx#M:Microsoft.Azure.Documents.DocumentCollection) and [IndexingMode.Lazy](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingmode.aspx).
Use range indexing over strings in order to support Order by | ..
Exclude certain paths from indexing | ..
Force a range-based scan on a Hash index | ..
Update the indexing policy | ..
 
## Partitioning samples

The partitioning sample file, [azure-documentdb-net/samples/code-samples/Partitioning/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Partitioning/Program.cs), shows how to do the following:

Task | Method
--- | ---
A | ..
B | ..
C | ..

## Geospatial samples

The geospatial sample file, [azure-documentdb-net/samples/code-samples/Queries.Spatial/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries.Spatial/Program.cs), shows how to do the following:

Task | Method
--- | ---
Create a new collection, or modify an existing one to enable spatial indexing | GetCollectionWithSpatialIndexingAsync
Insert documents with GeoJSON spatial data | CreateDocumentAsync
Find points within a circle or radius of another point | CreateDocumentQuery
Find points that exist within a polygon | CreateDocumentQuery
Update a collection to enable spatial indexing in the indexing policy | ReplaceDocumentCollectionAsync

## JavaScript samples

The javascript query sample file, [azure-documentdb-net/samples/code-samples/Queries.JavaScript/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries.JavaScript/Program.cs), shows how to do the following:

Task | Method
--- | ---
A | ..
B | ..
C | ..

## Order by samples

The Order by sample file, [azure-documentdb-net/samples/code-samples/Queries.OrderBy/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries.OrderBy/Program.cs), shows how to do the following:

Task | Method
--- | ---
A | ..
B | ..
C | ..

## Query samples

The query document file, [azure-documentdb-net/samples/code-samples/Queries/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries/Program.cs), shows how to do the following:

Task | Method
--- | ---
A | ..
B | ..
C | ..

## Server-side programming samples

The server-side programming file, [azure-documentdb-net/samples/code-samples/ServerSideScripts/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/ServerSideScripts/Program.cs), shows how to do the following:

Task | Method
--- | ---
A | ..
B | ..
C | .. 

## User management samples

The user management file, [azure-documentdb-net/samples/code-samples/UserManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/UserManagement/Program.cs), shows how to do the following:

Task | Method
--- | ---
A | ..
B | ..
C | .. 



