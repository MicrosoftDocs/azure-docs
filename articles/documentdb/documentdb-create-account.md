<properties 
	pageTitle="Create a database account - Free Trial | Microsoft Azure" 
	description="Learn how to create database accounts using the online service portal for Azure DocumentDB, a managed NoSQL document database for JSON. Get a free trial today."
	services="documentdb" 
	documentationCenter="" 
	authors="mimig1" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="06/26/2015" 
	ms.author="mimig"/>

# Create a DocumentDB database account using the Azure Preview portal

To use Microsoft Azure DocumentDB, you must create a DocumentDB database account by using the Microsoft Azure Preview portal. 

Are you new to DocumentDB? Watch [this](http://azure.microsoft.com/documentation/videos/create-documentdb-on-azure/) four minute video by Scott Hanselman to see how to complete the most common tasks in the online portal.

[AZURE.INCLUDE [documentdb-create-dbaccount](../../includes/documentdb-create-dbaccount.md)]

## Next steps

Now that you have a DocumentDB account, the next step is to [create a DocumentDB database](documentdb-create-database.md). You can create a database by:

- Using the C# .NET samples in the [DatabaseManagement](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples/DatabaseManagement) project of the [azure-documentdb-net](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples) GitHub repository.
- Using the Preview portal, as described in [Create a DocumentDB database using the Azure Preview portal](documentdb-create-database.md).
- Using one of the other [DocumentDB SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx). DocumentDB has .NET, Java, Python, Node.js, and JavaScript API SDKs. 


After creating your database, you need to [add one or more collections](documentdb-create-collection.md) to the database, then [add documents](../documentdb-view-json-document-explorer.md) to the collections. After you have documents in a collection, you can [query your documents](documentdb-query-collections-query-explorer.md) by using the Query Explorer in the Preview portal, or you can query documents by using [DocumentDB SQL](documentdb-sql-query.md).

To learn more about DocumentDB, explore these resources:

-	[Learning map for DocumentDB](documentdb-learning-map.md)
-	[DocumentDB resource model and concepts](documentdb-resources.md)
-	[Get started with the DocumentDB .NET SDK](documentdb-get-started.md)


 