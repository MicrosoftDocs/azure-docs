---
title: Build a web app using Azure Cosmos DB's API for MongoDB and .NET SDK
description: Presents a .NET code sample you can use to connect to and query using Azure Cosmos DB's API for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo

ms.devlang: dotnet
ms.topic: quickstart
ms.date: 10/15/2020
ms.custom: devx-track-csharp
---

# Quickstart: Build a .NET web app using Azure Cosmos DB's API for MongoDB 
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

> [!div class="op_single_selector"]
> * [.NET](create-mongodb-dotnet.md)
> * [Java](create-mongodb-java.md)
> * [Node.js](create-mongodb-nodejs.md)
> * [Xamarin](create-mongodb-xamarin.md)
> * [Golang](create-mongodb-go.md)
>  

Azure Cosmos DB is Microsoft’s fast NoSQL database with open APIs for any scale. You can quickly create and query document, key/value and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Cosmos DB. 

This quickstart demonstrates how to create a Cosmos account with [Azure Cosmos DB's API for MongoDB](mongodb-introduction.md). You'll then build and deploy a tasks list web app built using the [MongoDB .NET driver](https://docs.mongodb.com/ecosystem/drivers/csharp/).

## Prerequisites to run the sample app

* [Visual Studio](https://www.visualstudio.com/downloads/)
* An Azure Cosmos DB account.

If you don't already have Visual Studio, download [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** workload installed with setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

<a id="create-account"></a>
## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount](includes/cosmos-db-create-dbaccount-mongodb.md)]

The sample described in this article is compatible with MongoDB.Driver version 2.6.1.

## Clone the sample app

Run the following commands in a GitHub enabled command windows such as [Git bash](https://git-scm.com/downloads):

```bash
mkdir "C:\git-samples"
cd "C:\git-samples"
git clone https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-getting-started.git
```

The preceding commands:

1. Create the *C:\git-samples* directory for the sample. Chose a folder appropriate for your operating system.
1. Change your current directory to the *C:\git-samples* folder.
1. Clone the sample into the *C:\git-samples* folder.

If you don't wish to use git, you can also [download the project as a ZIP file](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-getting-started/archive/master.zip).

## Review the code

1. In Visual Studio, right-click on the project in **Solution Explorer** and then click **Manage NuGet Packages**.
1. In the NuGet **Browse** box, type *MongoDB.Driver*.
1. From the results, install the **MongoDB.Driver** library. This installs the MongoDB.Driver package as well as all dependencies.

The following steps are optional. If you're interested in learning how the database resources are created in the code, review the following snippets. Otherwise, skip ahead to [Update your connection string](#update-the-connection-string).

The following snippets are from the *DAL/Dal.cs* file.

* The following code initializes the client:

    ```cs
        MongoClientSettings settings = new MongoClientSettings();
        settings.Server = new MongoServerAddress(host, 10255);
        settings.UseSsl = true;
        settings.SslSettings = new SslSettings();
        settings.SslSettings.EnabledSslProtocols = SslProtocols.Tls12;

        MongoIdentity identity = new MongoInternalIdentity(dbName, userName);
        MongoIdentityEvidence evidence = new PasswordEvidence(password);

        settings.Credential = new MongoCredential("SCRAM-SHA-1", identity, evidence);

        MongoClient client = new MongoClient(settings);
    ```

* The following code retrieves the database and the collection:

    ```cs
    private string dbName = "Tasks";
    private string collectionName = "TasksList";

    var database = client.GetDatabase(dbName);
    var todoTaskCollection = database.GetCollection<MyTask>(collectionName);
    ```

* The following code retrieves all documents:

    ```cs
    collection.Find(new BsonDocument()).ToList();
    ```

The following code creates a task and insert it into the collection:

   ```csharp
    public void CreateTask(MyTask task)
    {
        var collection = GetTasksCollectionForEdit();
        try
        {
            collection.InsertOne(task);
        }
        catch (MongoCommandException ex)
        {
            string msg = ex.Message;
        }
    }
   ```
   Similarly, you can update and delete documents by using the [collection.UpdateOne()](https://docs.mongodb.com/stitch/mongodb/actions/collection.updateOne/index.html) and [collection.DeleteOne()](https://docs.mongodb.com/stitch/mongodb/actions/collection.deleteOne/index.html) methods.

## Update the connection string

From the Azure portal copy the connection string information:

1. In the [Azure portal](https://portal.azure.com/), select your Cosmos account, in the left navigation click **Connection String**, and then click **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the Username, Password, and Host into the Dal.cs file in the next step.

2. Open the *DAL/Dal.cs* file.

3. Copy the **username** value from the portal (using the copy button) and make it the value of the **username** in the **Dal.cs** file.

4. Copy the **host** value from the portal and make it the value of the **host** in the **Dal.cs** file.

5. Copy the **password** value from the portal and make it the value of the **password** in your **Dal.cs** file.

<!-- TODO Store PW correctly-->
> [!WARNING]
> Never check passwords or other sensitive data into source code.

You've now updated your app with all the info it needs to communicate with Cosmos DB.

## Run the web app

1. Click CTRL + F5 to run the app. The default browser is launched with the app. 
1. Click **Create** in the browser and create a few new tasks in your task list app.

<!-- 
## Deploy the app to Azure 
1. In VS, right click .. publish
2. This is so easy, why is this critical step missed?
-->
## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create a Cosmos account, create a collection and run a console app. You can now import additional data to your Cosmos database. 

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json)
