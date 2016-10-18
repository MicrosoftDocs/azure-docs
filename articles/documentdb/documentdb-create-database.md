<properties 
	pageTitle="How to create a database in DocumentDB | Microsoft Azure" 
	description="Learn how to create a database using the online service portal for Azure DocumentDB, your blazing fast, global-scale NoSQL database." 
	keywords="how to create a database" 
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
	ms.date="10/17/2016" 
	ms.author="mimig"/>

# How to create a database for DocumentDB using the Azure portal

To use Microsoft Azure DocumentDB, you must have a [DocumentDB account](documentdb-create-account.md), a database, a collection, and documents. In the Azure portal, DocumentDB databases are now created at the same time as a collection is created. 

To create a DocumentDB database and collection in the portal, see [How to create a DocumentDB collection using the Azure portal](documentdb-create-collection.md).

## Other ways to create a DocumentDB database

Databases do not have to be created using the portal, you can also create them using the [DocumentDB SDKs](documentdb-sdk-dotnet.md) or the [REST API](https://msdn.microsoft.com/library/mt489072.aspx). For information on working with databases by using the .NET SDK, see [.NET database examples](documentdb-dotnet-samples.md#database-examples). For information on working with databases by using the Node.js SDK, see [Node.js database examples](documentdb-nodejs-samples.md#database-examples). 

## Next steps

Once your database and collection are created, you can [add JSON documents](documentdb-view-json-document-explorer.md) by using the Document Explorer in the portal, [import documents](documentdb-import-data.md) into the collection by using the DocumentDB Data Migration Tool, or use one of the [DocumentDB SDKs](documentdb-sdk-dotnet.md) to perform CRUD operations. DocumentDB has .NET, Java, Python, Node.js, and JavaScript API SDKs. For .NET code samples showing how to create, remove, update and delete documents, see [.NET document examples](documentdb-dotnet-samples.md#document-examples). For information on working with documents by using the Node.js SDK, see [Node.js document examples](documentdb-nodejs-samples.md#document-examples). 

After you have documents in a collection, you can use [DocumentDB SQL](documentdb-sql-query.md) to [execute queries](documentdb-sql-query.md#executing-sql-queries) against your documents by using the [Query Explorer](documentdb-query-collections-query-explorer.md) in the Portal, the [REST API](https://msdn.microsoft.com/library/azure/dn781481.aspx), or one of the [SDKs](documentdb-sdk-dotnet.md). 
