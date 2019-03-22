---
title: Build a .NET web app with Azure Cosmos DB using the SQL API
description: In this quickstart, create and manage Azure Cosmos DB resources using SQL API in the Azure portal and a .NET web app.
author: SnehaGunda
ms.author: sngun
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 03/21/2019
---
# Quickstart: Build a .NET web app using Azure Cosmos DB SQL API account

> [!div class="op_single_selector"]
> * [.NET](create-sql-api-dotnet.md)
> * [.NET (Preview)](create-sql-api-dotnet-preview.md)
> * [Java](create-sql-api-java.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)
>  
> 

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can use Cosmos DB to quickly create and query document, graph, and key/value databases, which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quickstart demonstrates how to use the Azure portal to create an Azure Cosmos DB [SQL API](sql-api-introduction.md) account, create a document database and collection, and add sample data to the collection. You then build and deploy a [SQL .NET SDK](sql-api-sdk-dotnet.md) to-do list web app that queries and adds more data to the collection. 

## Prerequisites

Visual Studio 2017 with Azure development workflow installed:
- You can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup. 
- To install the Azure development workflow from Visual Studio 2017. ... 

An Azure subscription or free Cosmos DB trial account:
- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
- [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]  

<a id="create-account"></a>
## Create a Cosmos DB account

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

<a id="create-collection-database"></a>
## Add a collection and a database 

Use the Data Explorer in the Azure portal to create a database and collection. 

1. Select **Data Explorer** from the left menu on the Azure Cosmos DB account main page, and then select **New Collection**. 
   
   You may need to scroll right to see the **Add Collection** area.

    ![The Azure portal Data Explorer, Add Collection pane](./media/create-sql-api-dotnet/azure-cosmosdb-data-explorer-dotnet.png)

2. In the **Add collection** page, enter the settings for the new collection.

    Setting|Suggested value|Description
    ---|---|---
    **Database id**|ToDoList|Enter *ToDoList* as the name for the new database. Database names must contain from 1 through 255 characters, and they cannot contain `/, \\, #, ?`, or a trailing space.
    **Collection id**|Items|Enter *Items* as the name for your new collection. Collection IDs have the same character requirements as database names.|
    **Partition key**| /category| The sample described in this article uses */category* as the partition key.|
    **Throughput**|400|Leave the throughput at 400 request units per second (RU/s). If you want to reduce latency, you can scale up the throughput later.| 
    
    Don't add **Unique keys** for this example. Unique keys let you add a layer of data integrity to the database by ensuring the uniqueness of one or more values per partition key. For more information, see [Unique keys in Azure Cosmos DB](unique-keys.md).
    
    Select **OK**.

    Data Explorer displays the new database and collection.

    ![The Azure portal Data Explorer, showing the new database and collection](./media/create-sql-api-dotnet/azure-cosmos-db-new-collection.png)

## Add data to your database

Add data to your new database using Data Explorer.

1. In **Data Explorer**, the new database appears in the **Collections** pane. Expand the **ToDoList** database, expand the **Items** collection, select **Documents**, and then select **New Document**. 

   ![Create new documents in Data Explorer in the Azure portal](./media/create-sql-api-dotnet/azure-cosmosdb-new-document.png)
  
1. Add the following structure to the document on the right side of the **Document** pane:

     ```json
     {
         "id": "1",
         "category": "personal",
         "name": "groceries",
         "description": "Pick up apples and strawberries.",
         "isComplete": false
     }
     ```

1. Select **Save**.

    ![Copy in json data and click Save in Data Explorer in the Azure portal](./media/create-sql-api-dotnet/azure-cosmosdb-save-document.png)

1. Select **New Document** again, and create and save another document with a unique `id`, and other properties as you see fit. Your documents can have any structure you want, because Azure Cosmos DB doesn't impose any schema on your data.

## Query your data

[!INCLUDE [cosmos-db-create-sql-api-query-data](../../includes/cosmos-db-create-sql-api-query-data.md)]

## Clone the sample application

Now let's switch to working with code. Let's clone a [SQL API app from GitHub](https://github.com/Azure-Samples/documentdb-dotnet-todo-app), set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a command prompt, create a new folder named git-samples, then close the command prompt.

    ```bash
    md "C:\git-samples"
    ```

2. Open a git terminal window, such as git bash, and use the `cd` command to change to the new folder to install the sample app.

    ```bash
    cd "C:\git-samples"
    ```

3. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/documentdb-dotnet-todo-app.git
    ```

4. Then open the todo solution file in Visual Studio. 

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). In this quickstart, you create a database and a collection by using Azure portal and add sample data by using the .NET sample. However, you can also create the database and the collection by using the .NET sample. 

The following snippets are all taken from the DocumentDBRepository.cs file.

* The DocumentClient is initialized as shown in the following code:

    ```csharp
    client = new DocumentClient(new Uri(ConfigurationManager.AppSettings["endpoint"]), ConfigurationManager.AppSettings["authKey"]);
    ```

* A new database is created by using the `CreateDatabaseAsync` method as shown in the following code:

    ```csharp
    await client.CreateDatabaseAsync(new Database { Id = DatabaseId });
    ```

* A new collection is created by using the `CreateDocumentCollectionAsync` as shown in the following code:

    ```csharp
    private static async Task CreateCollectionIfNotExistsAsync()
    {
        try
        {
           await client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri(DatabaseId, CollectionId));
        }
        catch (DocumentClientException e)
        {
           if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
           {
              await client.CreateDocumentCollectionAsync(
              UriFactory.CreateDatabaseUri(DatabaseId),
              new DocumentCollection
              {
                  Id = CollectionId
              },
              new RequestOptions { OfferThroughput = 400 });
           }
           else
           {
             throw;
           }
        }
    }
    ```

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. In the [Azure portal](https://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation select **Keys**, and then select **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the URI and Primary Key into the web.config file in the next step.

    ![View and copy an access key in the Azure portal, Keys blade](./media/create-sql-api-dotnet/keys.png)

2. In Visual Studio 2017, open the web.config file. 

3. Copy your URI value from the portal (using the copy button) and make it the value of the endpoint key in web.config. 

    `<add key="endpoint" value="FILLME" />`

4. Then copy your PRIMARY KEY value from the portal and make it the value of the authKey in web.config. 

    `<add key="authKey" value="FILLME" />`
    
5. Then update the database and collection values to match the name of the database you have created earlier. You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

   ```csharp
   <add key="database" value="ToDoList"/>
   <add key="collection" value="Items"/>
   ```
 
## Run the web app

1. In Visual Studio, right-click on the project in **Solution Explorer** and then select **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type *DocumentDB*.

3. From the results, install the **Microsoft.Azure.DocumentDB** library. This installs the Microsoft.Azure.DocumentDB package as well as all dependencies.

4. Select CTRL + F5 to run the application. Your app displays in your browser. 

5. Select **Create New** in the browser and create a few new tasks in your to-do app.

   ![Todo app with sample data](./media/create-sql-api-dotnet/azure-comosdb-todo-app-list.png)

You can now go back to Data Explorer and see query, modify, and work with this new data. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a collection using the Data Explorer, and run a web app. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](import-data.md)


