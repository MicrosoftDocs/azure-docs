---
title: Build a web app using Azure Cosmos DB's API for MongoDB and .NET SDK
description: Presents a .NET code sample you can use to connect to and query using Azure Cosmos DB's API for MongoDB.
author: rimman
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo

ms.devlang: dotnet
ms.topic: quickstart
ms.date: 05/21/2019
ms.author: rimman
---

# Quickstart: Build a .NET web app using Azure Cosmos DB's API for MongoDB 

> [!div class="op_single_selector"]
> * [.NET](create-mongodb-dotnet.md)
> * [Java](create-mongodb-java.md)
> * [Node.js](create-mongodb-nodejs.md)
> * [Python](create-mongodb-flask.md)
> * [Xamarin](create-mongodb-xamarin.md)
> * [Golang](create-mongodb-golang.md)
>  

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Cosmos DB. 

This quickstart demonstrates how to create a Cosmos account with [Azure Cosmos DB's API for MongoDB](mongodb-introduction.md). You'll then build and deploy a tasks list web app built using the [MongoDB .NET driver](https://docs.mongodb.com/ecosystem/drivers/csharp/).

## Prerequisites to run the sample app

To run the sample, you'll need [Visual Studio](https://www.visualstudio.com/downloads/) and a valid Azure Cosmos DB account.

If you don't already have Visual Studio, download [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** workload installed with setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

<a id="create-account"></a>
## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount-mongodb.md)]

The sample described in this article is compatible with MongoDB.Driver version 2.6.1.

## Clone the sample app

First, download the sample app from GitHub. 

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
    git clone https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-getting-started.git
    ```

If you don't wish to use git, you can also [download the project as a ZIP file](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-dotnet-getting-started/archive/master.zip).

## Review the code

This step is optional. If you're interested in learning how the database resources are created in the code, you can review the following snippets. Otherwise, you can skip ahead to [Update your connection string](#update-your-connection-string). 

The following snippets are all taken from the Dal.cs file in the DAL directory.

* Initialize the client.

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

* Retrieve the database and the collection.

    ```cs
    private string dbName = "Tasks";
    private string collectionName = "TasksList";

    var database = client.GetDatabase(dbName);
    var todoTaskCollection = database.GetCollection<MyTask>(collectionName);
    ```

* Retrieve all documents.

    ```cs
    collection.Find(new BsonDocument()).ToList();
    ```

Create a task and insert it into the collection

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

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. In the [Azure portal](https://portal.azure.com/), in your Cosmos account, in the left navigation click **Connection String**, and then click **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the Username, Password, and Host into the Dal.cs file in the next step.

2. Open the **Dal.cs** file in the **DAL** directory. 

3. Copy your **username** value from the portal (using the copy button) and make it the value of the **username** in your **Dal.cs** file. 

4. Then copy your **host** value from the portal and make it the value of the **host** in your **Dal.cs** file. 

5. Finally copy your **password** value from the portal and make it the value of the **password** in your **Dal.cs** file. 

You've now updated your app with all the info it needs to communicate with Cosmos DB. 
    
## Run the web app

1. In Visual Studio, right-click on the project in **Solution Explorer** and then click **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type *MongoDB.Driver*.

3. From the results, install the **MongoDB.Driver** library. This installs the MongoDB.Driver package as well as all dependencies.

4. Click CTRL + F5 to run the application. Your app displays in your browser. 

5. Click **Create** in the browser and create a few new tasks in your task list app.

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create a Cosmos account, create a collection and run a console app. You can now import additional data to your Cosmos database. 

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](mongodb-migrate.md)
