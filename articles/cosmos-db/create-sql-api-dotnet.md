---
title: Build a .NET web app with Azure Cosmos DB using the SQL API 
description: In this quickstart, create and manage Azure Cosmos DB resources using SQL API in the portal and a .NET web app.
author: SnehaGunda
ms.author: sngun
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 03/21/2019
---
# Quickstart: Build a .NET web app using SQL API with an Azure Cosmos DB account

> [!div class="op_single_selector"]
> * [.NET](create-sql-api-dotnet.md)
> * [.NET (Preview)](create-sql-api-dotnet-preview.md)
> * [Java](create-sql-api-java.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)
>  
> 

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can use Cosmos DB to quickly create and query key/value, document, and graph databases, which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quickstart demonstrates how to use the Azure portal to create an Azure Cosmos DB [SQL API](sql-api-introduction.md) account, create a document database and collection, and add sample data to the collection. You then build and deploy a [SQL .NET SDK](sql-api-sdk-dotnet.md) to-do list web app that can add more data to the collection. 

In this quickstart, you create the database and collection by using the Azure portal. To learn how to create the database and the collection by using the .NET sample instead, see [Review the code](#review-the-code). 

## Prerequisites

Visual Studio 2017 with Azure development workflow installed:
- You can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup. 

An Azure subscription or free Cosmos DB trial account:
- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
- [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]  

<a id="create-account"></a>
## Create a Cosmos DB account

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

## Use Data Explorer

You can use the Data Explorer in the Azure portal to create a database and collection, add data to the database, and query the data. 

<a id="create-collection-database"></a>
### Add a database and a collection 

Use the Data Explorer to create a database and collection. 

1. Select **Data Explorer** from the left navigation on the Azure Cosmos DB account page, and then select **New Collection**. 
   
   You may need to scroll right to see the **Add Collection** area.

    ![The Azure portal Data Explorer, Add Collection pane](./media/create-sql-api-dotnet/azure-cosmosdb-data-explorer-dotnet.png)

1. In the **Add collection** page, enter the settings for the new collection.

    |Setting|Suggested value|Description
    |---|---|---
    |**Database id**|ToDoList|Enter *ToDoList* as the name for the new database. Database names must contain from 1 through 255 characters, and they cannot contain `/, \\, #, ?`, or a trailing space.|
    |**Collection id**|Items|Enter *Items* as the name for your new collection. Collection IDs have the same character requirements as database names.|
    |**Partition key**| /category| The sample described in this article uses */category* as the partition key.|
    |**Throughput**|400|Leave the throughput at 400 request units per second (RU/s). If you want to reduce latency, you can scale up the throughput later.| 
    
    Don't add **Unique keys** for this example. Unique keys let you add a layer of data integrity to the database by ensuring the uniqueness of one or more values per partition key. For more information, see [Unique keys in Azure Cosmos DB](unique-keys.md).
    
1. Select **OK**. 
   Data Explorer displays the new database and collection.

    ![The Azure portal Data Explorer, showing the new database and collection](./media/create-sql-api-dotnet/azure-cosmos-db-new-collection.png)

### Add data to your database

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

1. Select **New Document** again, and create and save another document with a unique `id`, and any other properties and values you want. Your documents can have any structure, because Azure Cosmos DB doesn't impose any schema on your data.

### Query your data

[!INCLUDE [cosmos-db-create-sql-api-query-data](../../includes/cosmos-db-create-sql-api-query-data.md)]

## Use the SQL API sample app

Now switch to working with C# code in Visual Studio, to see how easy it is to work with your data programmatically. Clone the sample SQL API web app from GitHub, update the connection string, and run the app. 

### Clone the sample app

First, clone a [SQL API app](https://github.com/Azure-Samples/documentdb-dotnet-todo-app) from GitHub. 

1. Open a git terminal window, create a new folder named *git-samples*, and change to it:

    ```bash
    md "C:\git-samples"
    cd "C:\git-samples"
    ```

1. Run the following command to clone the sample repository and create a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/documentdb-dotnet-todo-app.git
    ```

### Update the connection string 

1. In Visual Studio, navigate to and open the *todo.sln* file in your cloned app. 

1. In Visual Studio **Solution Explorer**, open the *web.config* file. 

1. Go back to the Azure portal to copy your connection string information and paste it into the *web.config*.

   1. Select **Keys** > **Read-write Keys** in your Cosmos DB account left navigation.
   
   ![View and copy an access key in the Azure portal, Keys blade](./media/create-sql-api-dotnet/keys.png)
   
   1. Using the copy button at the right, copy the **URI** value and paste it into the `endpoint` key in the *web.config*. For example: 
   
   `<add key="endpoint" value="https://mysqlapicosmosdb.documents.azure.com:443/" />`
   
   1. Copy the **PRIMARY KEY** value and paste it into the `authKey` in the *web.config*. For example:
   
   `<add key="authKey" value="1234567890abcdefgabcdefgABCDEFG000000000000000000000000000000000000000000000000000==" />`
    
1. Update the database and collection values in the *web.config* to match the names you created earlier. 

   ```csharp
   <add key="database" value="ToDoList"/>
   <add key="collection" value="Items"/>
   ```
 
1. Save the *web.config.* You've now updated your app with all the information it needs to communicate with Azure Cosmos DB. 

## Run the web app

1. In Visual Studio, right-click on the project in **Solution Explorer** and then select **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type *DocumentDB*.

3. From the results, install the **Microsoft.Azure.DocumentDB** library. This installs the Microsoft.Azure.DocumentDB package and all dependencies.

4. Select **Ctrl** + **F5** to run the app in your browser. 

5. Select **Create New** in the browser, and create a few new tasks in your to-do app.

   ![Todo app with sample data](./media/create-sql-api-dotnet/azure-comosdb-todo-app-list.png)

You can go back to Data Explorer to see, query, modify, and work with this new data. 

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

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a collection using the Data Explorer, and run a web app. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](import-data.md)


