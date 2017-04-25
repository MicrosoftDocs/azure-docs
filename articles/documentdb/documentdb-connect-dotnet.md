---
title: 'Azure Cosmos DB: Use .NET to connect & query data with DocumentDB API | Microsoft Docs'
description: Presents a .NET code sample you can use to connect to and query the Azure Cosmos DB DocumentDB API
services: documentdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: documentdb
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 04/12/2017
ms.author: mimig

---
# Azure Cosmos DB: Use .NET (C#) to connect and query data with the DocumentDB API

This quick start demonstrates how to use the Azure portal and [.NET](documentdb-sdk-dotnet.md) to connect to an Azure Cosmos DB account, create a database and collection, and then build and deploy a web app on the Windows platform.

If you don’t already have Visual Studio 2017 installed, you can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

This quick start uses as its starting point the resources created in one of these quick starts: 

- [Create account - Portal](documentdb-get-started-portal.md)
- [Create account - CLI](documentdb-automation-resource-manager-cli-nodejs.md)
- [Create account - PowerShell](documentdb-manage-account-with-powershell.md)

## Add a collection

Add a collection in the Azure portal. 

1. Log in to the [Azure portal](https://portal.azure.com/).
2. On the left-hand menu, click ![The More services button](./media/documentdb-connect-dotnet/azure-documentdb-more-services.png) at the bottom, type **DocumentDB** in the search box, and then click **NoSQL (DocumentDB)**.
3. In the **NoSQL (DocumentDB)** page, select the Azure Cosmos DB account to add collections to.
4. On the account page, on the left-hand menu, click **Quick start**.
5. On the Quick start page, in the Step 1 area, click **Create 'Items' Collection**. Or if you've already created the Items collection from a different quickstart tab, then proceed to step 6. 

    ![Create 'Items' collection in the portal](./media/documentdb-connect-dotnet/azure-documentdb-create-collection.png)

    Once the collection has been created, the text in the Step 1 area changes to `"Items" collection has been created with 10GB storage capacity and 400 Request Units/sec (RUs) throughput capacity, for up to 400 reads/sec. Estimated hourly bill: $0.033 USD.`

6. In the Step 2 area, click **Download**. When asked if you want to open or save DocumentDB-Quickstart-Dotnet.zip, click **Save** and then click **Open**. 

7. In File Explorer, extract the contents of the zip file. 

8. Open the todo.sln solution in Visual Studio 2017.
    
## Build and deploy the web app

Build and deploy the sample app, then add some sample data to store in Azure Cosmos DB.

1. In Visual Studio 2017, press CTRL + F5 to run the application. 

    The sample application is displayed in your browswer.

2. Click **Create New** in the browser and create a few new tasks in your to-do app.

   ![Todo app with sample data](./media/documentdb-connect-dotnet/azure-documentdb-todo-app-list.png)

## Query data in the Data Explorer in the Azure portal

Once you've added a few sample tasks to your todo app, you can use the Data Explorer (preview) in the Azure portal to view, query, and run business-logic on your data.

* In the Azure portal, in the navigation menu, under **Collections**, click **Data Explorer (Preview)**. In the Data Explorer blade, expand your collection (the ToDoList collection), and then you can view the documents, perform queries, and even create and run stored procedures, triggers, and UDFs.

   ![Data Explorer in the Azure portal](./media/documentdb-connect-dotnet-core/azure-documentdb-data-explorer.png)
   *screenshot to be updated with appropriate data shown*

## Review metrics in the Azure portal

Use the Azure portal to review the availability, latency, throughput, and consistency of your collection. Each graph that's associated with the [Azure Cosmos DB Service Level Agreements (SLAs)](https://azure.microsoft.com/en-us/support/legal/sla/documentdb/) provides a line showing the quota required to meet the SLA and your actual usage, providing you transparency into the performance of your database. Additional metrics such as storage usage, number of requests per minute are also included in the portal

* In the Azure portal, in the left menu, under **Monitoring**, click **Metrics**.

   ![Todo app with sample data](./media/documentdb-connect-dotnet/azure-documentdb-portal-metrics-slas.png)

## Next steps

- For .NET documentation, see [.NET documentation](https://docs.microsoft.com/dotnet/).

- To connect and query using Node.js and a MongoDB app, see [Build a Node.js and MongoDB web app](documentdb-connect-mongodb-app.md).
- To connect and query using the Gremlin console, see [Connect to Gremlin console](documentdb-connect-gremlin-graph.md).
- To connect and query using Visual Graph Explorer, see [Visual Graph Explorer](documentdb-connect-graph-explorer.md).
- To connect and query using the Graph API and .NET, see [Connect to graphs using .NET](documentdb-connect-graph-dotnet.md).
- To connect and query using the Tables API and .NET, see [Connect to tables using .NET](documentdb-connect-tables-dotnet.md).
- To connect and query using Xamarin, see [Connect to Xamarin using .NET](documentdb-connect-xamarin-dotnet.md).