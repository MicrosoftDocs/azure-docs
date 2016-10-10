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
	ms.date="09/12/2016"
	ms.author="mimig"/>

# How to create a DocumentDB NoSQL account using the Azure portal

> [AZURE.SELECTOR]
- [Azure portal](documentdb-create-account.md)
- [Azure CLI and Azure Resource Manager](documentdb-automation-resource-manager-cli.md)

To build a database with Microsoft Azure DocumentDB, you must:

- Have an Azure account. You can get a [free Azure account](https://azure.microsoft.com/free) if you don't have one already. 
- Create a DocumentDB account.  

You can create a DocumentDB account using either the Azure portal, Azure Resource Manager templates, or Azure command-line interface (CLI). This article shows how to create a DocumentDB account using the Azure portal. To create an account using Azure Resource Manager or Azure CLI, see [Automate DocumentDB database account creation](documentdb-automation-resource-manager-cli.md).

Are you new to DocumentDB? Watch [this](https://azure.microsoft.com/documentation/videos/create-documentdb-on-azure/) four-minute video by Scott Hanselman to see how to complete the most common tasks in the online portal.

1.	Sign in to the [Azure portal](https://portal.azure.com/).
2.	In the Jumpbar, click **New**, click **Data + Storage**, and then click **DocumentDB (NoSQL)**.

	![Screen shot of the Azure portal, highlighting More Services, and DocumentDB (NoSQL)](./media/documentdb-create-account/create-nosql-db-databases-json-tutorial-1.png)  

3. In the **New account** blade, specify the desired configuration for the DocumentDB account.

	![Screen shot of the New DocumentDB blade](./media/documentdb-create-account/create-nosql-db-databases-json-tutorial-2.png)

	- In the **ID** box, enter a name to identify the DocumentDB account.  When the **ID** is validated, a green check mark appears in the **ID** box. The **ID** value becomes the host name within the URI. The **ID** may contain only lowercase letters, numbers, and the '-' character, and must be between 3 and 50 characters. Note that *documents.azure.com* is appended to the endpoint name you choose, the result of which becomes your DocumentDB account endpoint.

    - In the **NoSQL API** box, select the programming model to use:
        - **DocumentDB**: The DocumentDB API is available via .NET, Java, Node.js, Python and JavaScript [SDKs](documentdb-sdk-dotnet.md), as well as HTTP [REST](https://msdn.microsoft.com/library/azure/dn781481.aspx), and offers programmatic access to all the DocumentDB functionality. 
       
        - **MongoDB**: DocumentDB also offers [protocol-level support](documentdb-protocol-mongodb.md) for **MongoDB** APIs. When you choose the MongoDB API option, you can use existing MongoDB SDKs and [tools](documentdb-mongodb-mongochef.md) to talk to DocumentDB. You can [move](documentdb-import-data.md) your existing MongoDB apps to use DocumentDB, with [no code changes needed](documentdb-connect-mongodb-account.md), and take advantage of a fully managed database as a service, with limitless scale, global replication, and other capabilities.

	- For **Subscription**, select the Azure subscription that you want to use for the DocumentDB account. If your account has only one subscription, that account is selected by default.

	- In **Resource Group**, select or create a resource group for your DocumentDB account.  By default, a new resource group is created. For more information, see [Using the Azure portal to manage your Azure resources](../articles/azure-portal/resource-group-portal.md).

	- Use **Location** to specify the geographic location in which to host your DocumentDB account. 

4.	Once the new DocumentDB account options are configured, click **Create**. To check the status of the deployment, check the Notifications hub.  

	![Create databases quickly - Screen shot of the Notifications hub, showing that the DocumentDB account is being created](./media/documentdb-create-account/create-nosql-db-databases-json-tutorial-4.png)  

	![Screen shot of the Notifications hub, showing that the DocumentDB account was created successfully and deployed to a resource group - Online database creator notification](./media/documentdb-create-account/create-nosql-db-databases-json-tutorial-5.png)

5.	After the DocumentDB account is created, it is ready for use with the default settings. The default consistency of the DocumentDB account is set to **Session**.  You can adjust the default consistency by clicking **Default Consistency** in the resource menu. To learn more about the consistency levels offered by DocumentDB, see [Consistency levels in DocumentDB](documentdb-consistency-levels.md).

    ![Screen shot of the Resource Group blade - begin application development](./media/documentdb-create-account/create-nosql-db-databases-json-tutorial-6.png)  

    ![Screen shot of the Consistency Level blade - Session Consistency](./media/documentdb-create-account/create-nosql-db-databases-json-tutorial-7.png)  

[How to: Create a DocumentDB account]: #Howto
[Next steps]: #NextSteps
[documentdb-manage]:../articles/documentdb/documentdb-manage.md


## Next steps

Now that you have a DocumentDB account, the next step is to create a DocumentDB database. 

You can create a new database by using one of the following:

- The Azure portal, as described in [Create a DocumentDB database using the Azure portal](documentdb-create-database.md).
- The all-inclusive tutorials, which include sample data: [.NET](documentdb-get-started.md), [.NET MVC](documentdb-dotnet-application.md), [Java](documentdb-java-application.md), [Node.js](documentdb-nodejs-application.md), or [Python](documentdb-python-application.md).
- The [.NET](documentdb-dotnet-samples.md#database-examples), [Node.js](documentdb-nodejs-samples.md#database-examples), or [Python](documentdb-python-samples.md#database-examples) sample code available in GitHub.
- The [.NET](documentdb-sdk-dotnet.md), [Node.js](documentdb-sdk-node.md), [Java](documentdb-sdk-java.md), [Python](documentdb-sdk-python.md), and [REST](https://msdn.microsoft.com/library/azure/mt489072.aspx) SDKs.

After creating your database, you need to [add one or more collections](documentdb-create-collection.md) to the database, then [add documents](documentdb-view-json-document-explorer.md) to the collections.

After you have documents in a collection, you can use [DocumentDB SQL](documentdb-sql-query.md) to [execute queries](documentdb-sql-query.md#executing-queries) against your documents. You can execute queries by using the [Query Explorer](documentdb-query-collections-query-explorer.md) in the portal, the [REST API](https://msdn.microsoft.com/library/azure/dn781481.aspx), or one of the [SDKs](documentdb-sdk-dotnet.md).

### Learn more

To learn more about DocumentDB, explore these resources:

-	[Learning path for DocumentDB](https://azure.microsoft.com/documentation/learning-paths/documentdb/)
-	[DocumentDB hierarchical resource model and concepts](documentdb-resources.md)
