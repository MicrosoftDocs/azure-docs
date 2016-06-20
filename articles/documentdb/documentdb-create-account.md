<properties
	pageTitle="How to create a DocumentDB account | Microsoft Azure"
	description="Build a NoSQL database with Azure DocumentDB. Follow these instructions to create a DocumentDB account and start building your blazing fast, global-scale NoSQL database." 
	keywords="build a database"
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
	ms.date="05/16/2016"
	ms.author="mimig"/>

# How to create a DocumentDB account using the Azure portal

> [AZURE.SELECTOR]
- [Azure Portal](documentdb-create-account.md)
- [Azure CLI and ARM](documentdb-automation-resource-manager-cli.md)

To build a database with Microsoft Azure DocumentDB, you must:

- Have an Azure account. You can get a [free Azure account](https://azure.microsoft.com/free) if you don't have one already. 
- Create a DocumentDB account.  

You can create a DocumentDB account using either the Azure portal, Azure Resource Manager templates, or Azure command-line interface (CLI). This article shows how to create a database account using the Azure portal. To create an account using Azure Resource Manager or Azure CLI, see [Automate DocumentDB database account creation](documentdb-automation-resource-manager-cli.md).

Are you new to DocumentDB? Watch [this](https://azure.microsoft.com/documentation/videos/create-documentdb-on-azure/) four minute video by Scott Hanselman to see how to complete the most common tasks in the online portal.

[AZURE.INCLUDE [documentdb-create-dbaccount](../../includes/documentdb-create-dbaccount.md)]

## Next steps

Now that you have a DocumentDB acct, the next step is to build the DocumentDB database. You can create a database by using one of the following:

- The Azure portal, as described in [Create a DocumentDB database using the Azure portal](documentdb-create-database.md).
- The C# .NET samples in the [DatabaseManagement](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples/DatabaseManagement) project of the [azure-documentdb-net](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples) repository on GitHub.
- The all-inclusive tutorials: [.NET](documentdb-get-started.md), [.NET MVC](documentdb-dotnet-application.md), [Java](documentdb-java-application.md), [Node.js](documentdb-nodejs-application.md), or [Python](documentdb-python-application.md).
- The [DocumentDB SDKs](documentdb-sdk-dotnet.md). DocumentDB has .NET, Java, Python, Node.js, and JavaScript API SDKs.


After creating your database, you need to [add one or more collections](documentdb-create-collection.md) to the database, then [add documents](documentdb-view-json-document-explorer.md) to the collections.

After you have documents in a collection, you can use [DocumentDB SQL](documentdb-sql-query.md) to [execute queries](documentdb-sql-query.md#executing-queries) against your documents by using the [Query Explorer](documentdb-query-collections-query-explorer.md) in the Portal, the [REST API](https://msdn.microsoft.com/library/azure/dn781481.aspx), or one of the [SDKs](documentdb-sdk-dotnet.md).

To learn more about DocumentDB, explore these resources:

-	[Learning path for DocumentDB](https://azure.microsoft.com/documentation/learning-paths/documentdb/)
-	[DocumentDB resource model and concepts](documentdb-resources.md)
