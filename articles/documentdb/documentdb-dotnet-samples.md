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
	ms.date="11/20/2015" 
	ms.author="mimig"/>


# DocumentDB .NET samples

Sample solutions that perform CRUD operations and other common operations on DocumentDB resources are included in the [azure-documentdb-net](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples) GitHub repository. This article provides:

- Links to the tasks in each of the sample c# project files. 
- Links to the related API reference content.

**Prerequisites**

1. You need an Azure account to use these samples:
    - You can [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F): You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Websites. Your credit card will never be charged, unless you explicitly change your settings and ask to be charged.
   - You can [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F): Your MSDN subscription gives you credits every month that you can use for paid Azure services.
2. You also need the [Microsoft.Azure.DocumentDB NuGet package](http://www.nuget.org/packages/Microsoft.Azure.DocumentDB/). 

## Database samples

The database sample file, [azure-documentdb-net/samples/code-samples/DatabaseManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DatabaseManagement/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
[Create a database](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/DatabaseManagement/Program.cs#L63) | [DocumentClient.CreateDatabaseAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdatabaseasync.aspx#M:Microsoft.Azure.Documents.Client.DocumentClient.CreateDatabaseAsync(Microsoft.Azure.Documents.Database,Microsoft.Azure.Documents.Client.RequestOptions)
[Query an account for a database](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/DatabaseManagement/Program.cs#L57) | [DocumentQueryable.CreateDatabaseQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdatabasequery.aspx)
[List databases for an account](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/DatabaseManagement/Program.cs#L102) | [DocumentClient.ReadDatabaseFeedAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readdatabasefeedasync.aspx)
[Delete a database](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/DatabaseManagement/Program.cs#L79) | [DocumentClient.DeleteDatabaseAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.deletedatabaseasync.aspx#M:Microsoft.Azure.Documents.Client.DocumentClient.DeleteDatabaseAsync)

## Collection samples 

The collection sample file,[azure-documentdb-net/samples/code-samples/CollectionManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/CollectionManagement/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
[Create a collection](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/CollectionManagement/Program.cs#L93) | [DocumentClient.CreateDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentcollectionasync.aspx)
[Set the indexing policy](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/CollectionManagement/Program.cs#L107) | [IndexingPolicy.Automatic](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.automatic.aspx?f=255&MSPPError=-2147217396)
[Set the indexing mode](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/CollectionManagement/Program.cs#L108) | [IndexingPolicy.IndexingMode](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.indexingmode.aspx)
[Query an account for performance tier of a collection](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/CollectionManagement/Program.cs#L122) | [DocumentQueryable.CreateOfferQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createofferquery.aspx)
[Retrieve the performance tier of a collection](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/CollectionManagement/Program.cs#L134) | [DocumentClient.ReplaceOfferAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replaceofferasync.aspx)
[Query a database for collections](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/CollectionManagement/Program.cs#L157) | [DocumentClient.CreateDocumentCollectionQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentcollectionquery.aspx)
[Read a list of all collections in a database](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/CollectionManagement/Program.cs#L198) | [DocumentClient.ReadDocumentCollectionFeedAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readdocumentcollectionfeedasync.aspx?f=255&MSPPError=-2147217396)
[Delete a collection](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/CollectionManagement/Program.cs#L169) | [DocumentClient.DeleteDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.deletedocumentcollectionasync.aspx)

## Document samples

The document sample file, [azure-documentdb-net/samples/code-samples/DocumentManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DocumentManagement/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
[Create documents](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DocumentManagement/Program.cs#L188) | [DocumentClient.CreateDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentasync.aspx)
[Query for documents](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DocumentManagement/Program.cs#L197) | [DocumentClient.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentquery.aspx) 
[Update a document](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DocumentManagement/Program.cs#L204) | [DocumentClient.ReplaceDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replacedocumentasync.aspx)
[Create a document attachment](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DocumentManagement/Program.cs#L305) | [DocumentClient.CreateAttachmentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createattachmentasync.aspx)
[Query the document for attachments](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DocumentManagement/Program.cs#L309) | [DocumentClient.CreateAttachmentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createattachmentquery.aspx) 
[Read media content in an attachment](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/DocumentManagement/Program.cs#L312) | [DocumentClient.ReadMediaAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readmediaasync.aspx)

## Indexing samples

The indexing sample file, [azure-documentdb-net/samples/code-samples/IndexManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/IndexManagement/Program.cs), shows how to do the following tasks.

As a reminder, the default indexing policy sets [IndexingPolicy.Automatic](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.automatic.aspx) to **True** by default.

Task | API reference
--- | ---
[Create a collection with default indexing](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/IndexManagement/Program.cs#L108) | [DocumentClient.CreateDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentcollectionasync.aspx?f=255&MSPPError=-2147217396)
[Manually index a specific document](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/IndexManagement/Program.cs#L161) | [IndexingDirective.Include](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingdirective.aspx)
[Manually exclude a specific document from the index](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/IndexManagement/Program.cs#L122) | [IndexingDirective.Exclude](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingdirective.aspx)
[Use lazy indexing for bulk import or read heavy collections](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/IndexManagement/Program.cs#L185) | [IndexingMode.Lazy](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingmode.aspx)
[Include specific paths of a document in indexing](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/IndexManagement/Program.cs#L203) | [IndexingPolicy.IncludedPaths](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.includedpaths.aspx#P:Microsoft.Azure.Documents.IndexingPolicy.IncludedPaths) 
[Exclude certain paths from indexing](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/IndexManagement/Program.cs#L278) | [IndexingPolicy.ExcludedPaths](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.excludedpaths.aspx)
[Allow scan when no range index is present](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/IndexManagement/Program.cs#L341)| [FeedOptions.EnableScanInQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.feedoptions.enablescaninquery.aspx)

For more information about indexing, see [DocumentDB indexing policies](documentdb-indexing-policies.md).
 
## Partitioning samples

The partitioning sample file, [azure-documentdb-net/samples/code-samples/Partitioning/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Partitioning/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
[Use a HashPartitionResolver](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L100) | [HashPartitionResolver](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.partitioning.hashpartitionresolver.aspx)
[Use a RangePartitionResolver](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L106) | [Range](https://msdn.microsoft.com/library/azure/mt126048.aspx) used with a [RangePartitionResolver](https://msdn.microsoft.com/library/azure/mt126047.aspx)
[Implement custom partition resolvers](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L285) | [IPartitionResolver](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.ipartitionresolver.aspx)
[Implement a simple lookup table](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L115-L119) [with RangePartitionResolver](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/Partitioning/Partitioners/LookupPartitionResolver.cs) | [RangePartitionResolver](https://msdn.microsoft.com/library/azure/mt126047.aspx)
[Implement a partition resolver that creates or clones collections](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L121-L126) with [HashPartitionResolver](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/Partitioning/Partitioners/ManagedHashPartitionResolver.cs) | [IPartitionResolver](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.ipartitionresolver.aspx)
[Implement a spillover scheme](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L128-L134) with a [PartitionResolver](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/Partitioning/Partitioners/SpilloverPartitionResolver.cs) | [IPartitionResolver](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.ipartitionresolver.aspx)
[Saving and loading resolver configs](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L136-L137) using the [RunSerializeDeserializeSample sample method](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L295-L311) | [IPartitionResolver](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.ipartitionresolver.aspx)
[Adding, removing, and re-balancing data among partitions](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L139-L141) with [RepartitionDataSample](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Partitioning/Program.cs#L313-L345), and [DocumentClientHashPartitioningManager](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/Partitioning/Util/DocumentClientHashPartitioningManager.cs) | [HashPartitionResolver](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.partitioning.hashpartitionresolver.aspx)
[Implement a partition resolver for routing during repartitioning](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/Partitioning/Partitioners/TransitionHashPartitionResolver.cs) | [IPartitionResolver](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.ipartitionresolver.aspx) 

For more information about partitioning and sharding, see [Partition and scale data in DocumentDB](documentdb-partition-data).

## Geospatial samples

The geospatial sample file, [azure-documentdb-net/samples/code-samples/Queries.Spatial/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries.Spatial/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
[Enable geospatial indexing on a new collection](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries.Spatial/Program.cs#L45-L63) | [IndexingPolicy](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpolicy.aspx) and [IndexKind.Spatial](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexkind.aspx) and [DataType.Point](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.datatype.aspx)
[Insert documents with GeoJSON points](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries.Spatial/Program.cs#L116-L126) | [CreateDocumentAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createdocumentasync.aspx) and [DataType.Point]() 
[Find points within a specified distance](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries.Spatial/Program.cs#L152-L194) | [ST_DISTANCE](documentdb-sql-query.md/#built-in-functions) or [GeometryOperationExtensions.Distance](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.spatial.geometryoperationextensions.distance.aspx#M:Microsoft.Azure.Documents.Spatial.GeometryOperationExtensions.Distance(Microsoft.Azure.Documents.Spatial.Geometry,Microsoft.Azure.Documents.Spatial.Geometry))
[Find points within a polygon](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries.Spatial/Program.cs#L196-L221) | [ST_WITHIN](documentdb-sql-query.md/#built-in-functions), or [GeometryOperationExtensions.Within](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.spatial.geometryoperationextensions.within.aspx#M:Microsoft.Azure.Documents.Spatial.GeometryOperationExtensions.Within(Microsoft.Azure.Documents.Spatial.Geometry,Microsoft.Azure.Documents.Spatial.Geometry)) and [Polygon](https://msdn.microsoft.com/en-us/library/azure/microsoft.azure.documents.spatial.polygon.aspx)
[Enable geospatial indexing on an existing collection](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries.Spatial/Program.cs#L312-L336) | [ReplaceDocumentCollectionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replacedocumentcollectionasync.aspx) and [IndexingPolicy](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.documentcollection.indexingpolicy.aspx#P:Microsoft.Azure.Documents.DocumentCollection.IndexingPolicy)
[Validate point and polygon data](https://github.com/Azure/azure-documentdb-dotnet/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries.Spatial/Program.cs#L223-L265) | [ST_ISVALID](documentdb-sql-query.md/#built-in-functions), [ST_ISVALIDDETAILED](documentdb-sql-query.md/#built-in-functions), [GeometryOperationExtensions.IsValid](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.spatial.geometryoperationextensions.isvalid.aspx), [GeometryOperationExtensions.IsValidDetailed](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.spatial.geometryoperationextensions.isvaliddetailed.aspx)

For more information about working with Geospatial data, see [Working with Geospatial data in Azure DocumentDB](documentdb-geospatial.md).

## JavaScript query samples

The javascript query project, [azure-documentdb-net/samples/code-samples/Queries.JavaScript/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries.JavaScript/Program.cs), shows how to use DocumentDB's JavaScript integrated queries within stored procedures.

Add link to programming topic - js query subtopic.#javascript-language-integrated-query-api

## Order by samples

The Order by sample file, [azure-documentdb-net/samples/code-samples/Queries.OrderBy/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries.OrderBy/Program.cs), shows how to do use Order by as an end-to-end sample using Twitter's JSON API.

Task | API reference
--- | ---
[Create a collection with the required indexing policies to support Order By on any numeric or string property](CreateCollectionForOrderBy method definition) | [DocumentCollection](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.documentcollection.aspx), [IndexingPolicy](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.documentcollection.indexingpolicy.aspx#P:Microsoft.Azure.Documents.DocumentCollection.IndexingPolicy), and [RangeIndex](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.rangeindex.aspx)
[Run Order by using Linq or SQL](https://github.com/Azure/azure-documentdb-dotnet/blob/069a94990034218652027299badedb93d4d48e01/samples/code-samples/Queries.OrderBy/Program.cs#L135-L172) | [SQL Order by in MSDN](https://msdn.microsoft.com/library/azure/dn782250.aspx#bk_orderby_clause) 

For more information about Order by, see [Sorting DocumentDB data using Order by](documentdb-orderby.md).

## Query samples

The query document file, [azure-documentdb-net/samples/code-samples/Queries/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/Queries/Program.cs), shows how to do each of the following tasks using the SQL query grammar, the LINQ provider with query, and with Lambda.

Task | API reference
--- | ---
[Query for all documents](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L126) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
[Query for equality using ==](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L255) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)  
[Query for inequality using != and NOT](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L274) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
[Query using range operators like >, <, >=, <=](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L308) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
[Query using range operators against strings](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L340) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
[Query with Order by](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L373) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
[Work with subdocuments](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L401) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
[Query with intra-document Joins](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L421) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
[Query with string, math and array operators](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L530) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)
[Query with parameterized SQL using SqlQuerySpec](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L146) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29) and [SqlQuerySpec](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.sqlqueryspec.aspx)
[Query with explict paging](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/Queries/Program.cs#L569) | [DocumentQueryable.CreateDocumentQuery](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createdocumentquery.aspx#M:Microsoft.Azure.Documents.Linq.DocumentQueryable.CreateDocumentQuery%28Microsoft.Azure.Documents.Client.DocumentClient,System.String,Microsoft.Azure.Documents.SqlQuerySpec,Microsoft.Azure.Documents.Client.FeedOptions,System.Object%29)

For more information about writing queries, see [SQL query within DocumentDB](documentdb-sql-query.md).


## Server-side programming samples

The server-side programming file, [azure-documentdb-net/samples/code-samples/ServerSideScripts/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/ServerSideScripts/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
[Create a stored procedure](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/ServerSideScripts/Program.cs#L112) | [DocumentClient.CreateStoredProcedureAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createstoredprocedureasync.aspx)
[Execute a stored procedure](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/ServerSideScripts/Program.cs#L127) | [DocumentClient.ExecuteStoredProcedureAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.executestoredprocedureasync.aspx)
[Read a document feed for a stored procedure](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/ServerSideScripts/Program.cs#L194) | [DocumentClient.ReadDocumentFeedAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readdocumentfeedasync.aspx)
[Create a stored procedure with OrderBy](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/ServerSideScripts/Program.cs#L219) | [DocumentClient.CreateStoredProcedureAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createstoredprocedureasync.aspx) 
[Create a pre-trigger](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/ServerSideScripts/Program.cs#L264) | [DocumentClient.CreateTriggerAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createtriggerasync.aspx)
[Create a post-trigger](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/ServerSideScripts/Program.cs#L329) | [DocumentClient.CreateTriggerAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createtriggerasync.aspx)
[Create a User Defined Function (UDF)](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/ServerSideScripts/Program.cs#L389) | [DocumentClient.CreateUserDefinedFunctionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createuserdefinedfunctionasync.aspx) 

For more information about server-side programming, see [DocumentDB server-side programming: Stored procedures, database triggers, and UDFs](documentdb-programming.md).

## User management samples

The user management file, [azure-documentdb-net/samples/code-samples/UserManagement/Program.cs](https://github.com/Azure/azure-documentdb-net/blob/master/samples/code-samples/UserManagement/Program.cs), shows how to do the following tasks.

Task | API reference
--- | ---
[Create a user](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/UserManagement/Program.cs#L81) | [CreateUserAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createuserasync.aspx)
[Set permissions on a collection or document](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/UserManagement/Program.cs#L85) | [CreatePermissionAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.createpermissionasync.aspx)
[Get a list of a user's permissions](https://github.com/Azure/azure-documentdb-net/blob/d17c0ca5be739a359d105cf4112443f65ca2cb72/samples/code-samples/UserManagement/Program.cs#L218) | [DocumentClient.ReadUserAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readuserasync.aspx), [DocumentClient.ReadPermissionFeedAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readpermissionfeedasync.aspx)




