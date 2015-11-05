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
	ms.date="11/05/2015" 
	ms.author="mimig"/>


# DocumentDB .NET samples

> [AZURE.SELECTOR]
- [.NET](documentdb-dotnet-samples.md)
- [Node.js](documentdb-nodejs-samples.md)

Sample projects that perform common operations on DocumentDB resources are included in the [azure-documentdb-net](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples) GitHub repository. This article lists the tasks performed on each resource in the sample, and provides links to the related reference content.

**Prerequisites**

1. You need an Azure account to use these samples:
    - You can [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F): You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites. Your credit card will never be charged, unless you explicitly change your settings and ask to be charged.
   - You can [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F): Your MSDN subscription gives you credits every month that you can use for paid Azure services.
2. You also need the [Microsoft.Azure.DocumentDB NuGet package](http://www.nuget.org/packages/Microsoft.Azure.DocumentDB/). 

## Database samples

The database sample file, [azure-documentdb-net/samples/code-samples/DatabaseManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DatabaseManagement/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
Create a database | [DocumentClient.CreateDatabaseAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdatabaseasync.aspx#M:Microsoft.Azure.Documents.Client.DocumentClient.CreateDatabaseAsync(Microsoft.Azure.Documents.Database,Microsoft.Azure.Documents.Client.RequestOptions)
Query account for a database | [DocumentQueryable.CreateDatabaseQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdatabasequery.aspx)
List databases for an account | [DocumentClient.ReadDatabaseFeedAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readdatabasefeedasync.aspx)
Delete a database | [DocumentClient.DeleteDatabaseAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.deletedatabaseasync.aspx#M:Microsoft.Azure.Documents.Client.DocumentClient.DeleteDatabaseAsync)

## Collection samples 

The collection sample file,[azure-documentdb-net/samples/code-samples/CollectionManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/CollectionManagement/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
Create a collection | [DocumentClient.CreateDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentcollectionasync.aspx)
Set the indexing policy | [IndexingPolicy.Automatic](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.automatic.aspx?f=255&MSPPError=-2147217396)
Set the indexing mode | [IndexingPolicy.IndexingMode](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.indexingmode.aspx)
Query account for performance tier of a collection | [DocumentQueryable.CreateOfferQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createofferquery.aspx)
Retrieve performance tier of a collection | [DocumentClient.ReplaceOfferAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replaceofferasync.aspx)
Query a database for collections | [DocumentClient.CreateDocumentCollectionQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentcollectionquery.aspx)
Read a list of all collections in a database | [DocumentClient.ReadDocumentCollectionFeedAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readdocumentcollectionfeedasync.aspx?f=255&MSPPError=-2147217396)
Delete a collection | [DocumentClient.DeleteDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.deletedocumentcollectionasync.aspx)

## Document samples

The document sample file, [azure-documentdb-net/samples/code-samples/DocumentManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DocumentManagement/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
Create documents (SEE IF I CAN DO NEW LINE) and insert them into a collection using plain old clr objects (POCOs), dynamic objects, streams, or document extensions | [DocumentClient.CreateDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentasync.aspx)
Query for documents | [DocumentClient.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentquery.aspx) 
Update a document | [DocumentClient.ReplaceDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replacedocumentasync.aspx)
Create a document attachment | [DocumentClient.CreateAttachmentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createattachmentasync.aspx)
Query the document for attachments | [DocumentClient.CreateAttachmentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createattachmentquery.aspx) 
Read media content in an attachment | [DocumentClient.ReadMediaAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readmediaasync.aspx)

## Indexing samples

The indexing sample file, [azure-documentdb-net/samples/code-samples/IndexManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/IndexManagement/Program.cs), shows how to do the following tasks.

As a reminder, the default indexing policy sets [IndexingPolicy.Automatic](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.automatic.aspx) to **True** by default.

Task | API reference
--- | ---
Create a collection with default indexing | [DocumentClient.CreateDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentcollectionasync.aspx?f=255&MSPPError=-2147217396)
Manually indexing a specific document | [IndexingDirective.Include](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingdirective.aspx)
Use lazy indexing for bulk import or read heavy collections | [IndexingMode](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingmode.aspx) set to **Lazy**
Include specific paths of a document in indexing | [IndexingPolicy.IncludedPaths](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.includedpaths.aspx#P:Microsoft.Azure.Documents.IndexingPolicy.IncludedPaths) 
Exclude certain paths from indexing | [IndexingPolicy.ExcludedPaths](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.excludedpaths.aspx)
Allow scan when no range index is present | [FeedOptions.EnableScanInQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.feedoptions.enablescaninquery.aspx)

For more information about indexing, see [DocumentDB indexing policies](documentdb-indexing-policies.md).
 
## Partitioning samples

TODO: ASK ARAVIND TO COMPLETE

The partitioning sample file, [azure-documentdb-net/samples/code-samples/Partitioning/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Partitioning/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
Use a HashPartitionResolver | [HashPartitionResolver](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.partitioning.hashpartitionresolver.aspx)
Use a RangePartitionResolver | [Range](https://msdn.microsoft.com/library/azure/mt126048.aspx) used with a [RangePartitionResolver](https://msdn.microsoft.com/library/azure/mt126047.aspx)
Implement custom partition resolvers | [IPartitionResolver](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.ipartitionresolver.aspx)

For more information about partitioning and sharding, see [Partition and scale data in DocumentDB](documentdb-partition-data).

## Geospatial samples

TODO: ASK ARAVIND TO COMPLETE

The geospatial sample file, [azure-documentdb-net/samples/code-samples/Queries.Spatial/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries.Spatial/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
Enable geospatial indexing on a collection | [DocumentCollection]() with IndexingPolicy set to IndexingPolicyWithSpatialEnabled
Insert documents with GeoJSON spatial data | [CreateDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentasync.aspx) where the object parameter contains the GeoJSON longitude and latitude, using the WGS-84 coordinate reference standard
Find points within a circle or radius of another point | ST_DISTANCE (ADD LINK) or [GeometryOperationExtensions.Distance](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.spatial.geometryoperationextensions.distance.aspx#M:Microsoft.Azure.Documents.Spatial.GeometryOperationExtensions.Distance(Microsoft.Azure.Documents.Spatial.Geometry,Microsoft.Azure.Documents.Spatial.Geometry)
Find points that exist within a polygon | ST_WITHIN (ADD LINK) or [GeometryOperationExtensions.Within](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.spatial.geometryoperationextensions.within.aspx#M:Microsoft.Azure.Documents.Spatial.GeometryOperationExtensions.Within(Microsoft.Azure.Documents.Spatial.Geometry,Microsoft.Azure.Documents.Spatial.Geometry)
Update a collection to enable spatial indexing in the indexing policy | [ReplaceDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replacedocumentcollectionasync.aspx) where the [IndexingPolicy](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.documentcollection.indexingpolicy.aspx#P:Microsoft.Azure.Documents.DocumentCollection.IndexingPolicy) of the collection has an [IncludedPath.Indexes](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.includedpath.indexes.aspx#P:Microsoft.Azure.Documents.IncludedPath.Indexes) property that contains a [SpatialIndex](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.spatialindex.aspx)

For more information about working with Geospatial data, see [Working with Geospatial data in Azure DocumentDB](documentdb-geospatial.md).

## JavaScript query samples

TODO: ASK ARAVIND ABOUT THIS

The javascript query sample file, [azure-documentdb-net/samples/code-samples/Queries.JavaScript/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries.JavaScript/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
Create and execute a stored procedure. | [DocumentQueryable.CreateStoredProcedureQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createstoredprocedurequery.aspx)
Execute a stored procedure  | [DocumentClient.ExecuteStoredProcedureAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.executestoredprocedureasync.aspx)
Replace or update a stored procedure | [DocumentClient.ReplaceStoredProcedureAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replacestoredprocedureasync.aspx)

## Order by samples

TODO: ASK ARAVIND TO BREAK INTO SEPARATE PARTS

The Order By sample file, [azure-documentdb-net/samples/code-samples/Queries.OrderBy/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries.OrderBy/Program.cs), shows how to do the following tasks. 

Task | API reference
--- | ---
Create a collection with the required indexing policies to support Order By on any numeric or string property | [DocumentCollection](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.documentcollection.aspx) where the [IndexingPolicy](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.documentcollection.indexingpolicy.aspx#P:Microsoft.Azure.Documents.DocumentCollection.IndexingPolicy) of the collection has an [IncludedPath.Indexes](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.includedpath.indexes.aspx#P:Microsoft.Azure.Documents.IncludedPath.Indexes) property that contains a [RangeIndex](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.rangeindex.aspx) of DataType.String and a **RangeIndex** of DataType.Number, with a precision of -1 for maximum precision

For more information about Order by, see [Sorting DocumentDB data using Order By](documentdb-orderby.md).


## Query samples

The query document file, [azure-documentdb-net/samples/code-samples/Queries/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries/Program.cs), shows how to do each of the following tasks using the SQL query grammar, the LINQ provider with query, and with Lambda.

Task | API reference
--- | ---
Querying for all documents | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
Querying for equality using == | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)  
Querying for inequality using != and NOT | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
Querying using range operators like >, <, >=, <= | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
Querying using range operators against strings. | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
Querying with order by | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
Work with subdocuments | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
Query with Intra-document Joins | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
Query with string, math and array operators | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
Query with parameterized SQL using SqlQuerySpec | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29) & LINK TO SQLQUERYSPEC
Query with explict Paging | [CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)

For more information about writing queries, see (SQL query within DocumentDB)[documentdb-sql-query.md].


## Server-side programming samples

The server-side programming file, [azure-documentdb-net/samples/code-samples/ServerSideScripts/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/ServerSideScripts/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
Create a stored procedure | [DocumentClient.CreateStoredProcedureAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createstoredprocedureasync.aspx)
Execute a stored procedure | [DocumentClient.ExecuteStoredProcedureAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.executestoredprocedureasync.aspx)
Read a document feed for a stored procedure | [DocumentClient.ReadDocumentFeedAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readdocumentfeedasync.aspx)
Run a stored procedure with OrderBy | [DocumentClient.CreateStoredProcedureAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createstoredprocedureasync.aspx) and [DocumentClient.ExecuteStoredProcedureAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.executestoredprocedureasync.aspx)
Create a pre-trigger | [DocumentClient.CreateTriggerAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createtriggerasync.aspx)
Create a post-trigger | [DocumentClient.CreateTriggerAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createtriggerasync.aspx)
Create a User Defined Function (UDF) | [DocumentClient.CreateUserDefinedFunctionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createuserdefinedfunctionasync.aspx) 

For more information about server-side programming, see [DocumentDB server-side programming: Stored procedures, database triggers, and UDFs](documentdb-programming.md).

## User management samples

The user management file, [azure-documentdb-net/samples/code-samples/UserManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/UserManagement/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
Create a user | [CreateUserAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createuserasync.aspx)
Set permissions on a collection or document | [CreatePermissionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createpermissionasync.aspx)
Get a user's permissions in a list | [DocumentClient.ReadUserAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readuserasync.aspx), [DocumentClient.ReadPermissionFeedAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readpermissionfeedasync.aspx)




