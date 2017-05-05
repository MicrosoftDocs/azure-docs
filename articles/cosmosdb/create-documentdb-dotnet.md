---
title: 'Azure Cosmos DB: Build a web app with .NET and the DocumentDB API | Microsoft Docs'
description: Presents a .NET code sample you can use to connect to and query the Azure Cosmos DB DocumentDB API
services: cosmosdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: cosmosdb
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 05/10/2017
ms.author: mimig

---
# Azure Cosmos DB: Build a DocumentDB API web app with .NET and the Azure portal

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quick start demonstrates how to create an Azure Cosmos DB account, document database, and collection using the Azure portal. You'll then build and deploy a todo list web app built on the [DocumentDB .NET API](../documentdb/documentdb-sdk-dotnet.md).  

## Prerequisites

If you don’t already have Visual Studio 2017 installed, you can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a database account

[!INCLUDE [documentdb-create-dbaccount](../../includes/documentdb-create-dbaccount.md)]

## Add a collection

You can now use Data Explorer to create a collection and add data to your database. 

1. In the Azure portal, in the navigation menu, under **Collections**, click **Data Explorer (Preview)**. 
2. In the Data Explorer blade, click **New Collection**, then fill in the page using the following information.

    ![Data Explorer in the Azure portal](./media/create-documentdb-dotnet/azure-cosmosdb-data-explorer.png)


    Setting|Suggested value|Description
    ---|---|---
    Database id|Items|The ID for your new database. Database names must be between 1 and 255 characters, and cannot contain `/ \ # ?` or a trailing space.
    Collection id|ToDoList|The ID for your new collection. Collection names have the same character requirements as database ids.
    Storage Capacity| 10 GB|Leave the default value. This is the storage capacity of the database.
    Throughput|400 RUs|Leave the default value. You can scale up the throughput later if you want to reduce latency.
    Partition key|/category|A partition key that will distribute data evenly to each partition. Selecting the correct partition key is important in creating a performant collection, read more about it in [Designing for partitioning](../documentdb/documentdb-partition-data.md#designing-for-partitioning). 

3. Once the form is filled out, click **OK**.

## Add sample data

You can now add data to your new collection using Data Explorer.

1. In Data Explorer, the new database appears in the Collections pane. Expand the **Items** database, expand the **ToDoList** collection, click **Documents**, and then click **New Documents**. 

   ![Create new documents in Data Explorer in the Azure portal](./media/create-documentdb-dotnet/azure-comosdb-data-explorer-emulator-new-document.png)
  
2. Now add a few new documents to the collection with the following structure, where you insert unique values for id in each document and change the other properties as you see fit. Your new documents can have any structure you want as Azure Cosmos DB doesn't impose any schema on your data.

     ```json
     {
         "id": "1",
         "category": "personal",
         "name": "groceries",
         "description": "Pick up apples and strawberries."
     }
     ```

     You can now use queries in Data Explorer to retrieve your data. By default, Data Explorer uses SELECT * FROM c to retrieve all documents in the collection, but you can change that to SELECT * FROM c ORDER BY c.name ASC, to return all the documents in alphabetic ascending order of the name property. 
 
     You can also use Data Explorer to create stored procedures, UDFs, and triggers to perform server-side business logic. Data Explorer exposes all of the built in programmatic data access available in the APIs, but provides easy access to your data in the Azure Portal.

## Clone the sample application

Now let's clone a DocumentDB API app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/documentdb-dotnet-todo-app.git
    ```

3. Then open the solution file in Visual Studio. 

## Review the code

Let's make a quick review of what's happening in the app. Open the DocumentDBRepository.cs file and you'll find that these lines of code create the Azure Cosmos DB resources. 

* The DocumentClient is initialized.

    ```csharp
    client = new DocumentClient(new Uri(ConfigurationManager.AppSettings["endpoint"]), ConfigurationManager.AppSettings["authKey"]);`
    ```

* A new database is created.

    ```csharp
    await client.CreateDatabaseAsync(new Database { Id = DatabaseId });
    ```

* A new collection is created.

    ```csharp
    await client.CreateDocumentCollectionAsync(
        UriFactory.CreateDatabaseUri(DatabaseId),
        new DocumentCollection { Id = CollectionId },
        new RequestOptions { OfferThroughput = 1000 });
    ```

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. In the [Azure portal](http://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation click **Keys**. You'll use the copy buttons on the right side of the screen to copy the URI and Primary Key into the web.config file in the next step.

    ![View and copy an access key in the Azure Portal, Keys blade](./media/create-documentdb-dotnet/keys.png)

2. In Visual Studio 2017, open the web.config file. 

3. Copy your URI value from the portal (using the copy button) and make it the value of the endpoint key in web.config. 

    `<add key="endpoint" value="FILLME" />`

4. Then copy your PRIMARY KEY value from the portal and make it the value of the authKey in web.config. You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

    `<add key="authKey" value="FILLME" />`
    
## Build and deploy the web app
1. In Visual Studio, right-click on the project in **Solution Explorer** and then click **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type ***DocumentDB***.

3. From the results, install the **Microsoft.Azure.DocumentDB** library. This installs the Microsoft.Azure.DocumentDB package as well as all dependencies.

4. Click CTRL + F5 to run the application. Your app displays in your browser. 

5. Click **Create New** in the browser and create a few new tasks in your to-do app.

   ![Todo app with sample data](./media/create-documentdb-dotnet/azure-comosdb-todo-app-list.png)

You can now go back to Data Explorer and see query, modify, and work with this new data. 

## Review SLAs in the Azure portal

Now that your app is up and running, you'll want to ensure ensure business continuity, and watch user access to ensure high-availability to your users. You can use the Azure portal to review the availability, latency, throughput, and consistency of your collection. Each graph that's associated with the [Azure Cosmos DB Service Level Agreements (SLAs)](https://azure.microsoft.com/support/legal/sla/documentdb/) provides a line showing the quota required to meet the SLA and your actual usage, providing you transparency into the performance of your database. Additional metrics such as storage usage, number of requests per minute are also included in the portal

* In the Azure portal, in the left menu, under **Monitoring**, click **Metrics**.

   ![Todo app with sample data](./media/create-documentdb-dotnet/azure-comosdb-portal-metrics-slas.png)

## Clean up resources

If you're not going to continue to use this app, use the following steps to delete all resources created by this quickstart in the Azure portal. If you plan to continue on to work with subsequent quick starts, do not clean up the resources created in this quick start. 

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

To learn more about the DocumentDB API, see [What is the DocumentDB API?](../documentdb/documentdb-introduction.md). To learn more about the SQL query language which you can use in the Azure portal and programmatically, see [SQL](../documentdb/documentdb-sql-query.md).


