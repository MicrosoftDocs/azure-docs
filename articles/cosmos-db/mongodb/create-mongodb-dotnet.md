---
title: Build a web API using Azure Cosmos DB's API for MongoDB and .NET SDK
description: Presents a .NET code sample you can use to connect to and query using Azure Cosmos DB's API for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo

ms.devlang: dotnet
ms.topic: quickstart
ms.date: 8/13/2021
ms.custom: devx-track-csharp
---

# Quickstart: Build a .NET web API using Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

> [!div class="op_single_selector"]
> * [.NET](create-mongodb-dotnet.md)
> * [Java](create-mongodb-java.md)
> * [Node.js](create-mongodb-nodejs.md)
> * [Xamarin](create-mongodb-xamarin.md)
> * [Golang](create-mongodb-go.md)
>  

This quickstart demonstrates how to:
1. Create an [Azure Cosmos DB API for MongoDB account](mongodb-introduction.md) 
2. Build a product catalog web API using the [MongoDB .NET driver](https://docs.mongodb.com/ecosystem/drivers/csharp/)
3. Import sample data

## Prerequisites to run the sample app

* [Visual Studio](https://www.visualstudio.com/downloads/)
* [.NET 5.0](https://dotnet.microsoft.com/download/dotnet/5.0)
* An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You can also [try Azure Cosmos DB](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments.

If you don't already have Visual Studio, download [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** workload installed with setup.

<a id="create-account"></a>
## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount](../includes/cosmos-db-create-dbaccount-mongodb.md)]

## Learn the object model

Before you continue building the application, let's look into the hierarchy of resources in the API for MongoDB and the object model that's used to create and access these resources. The API for MongoDB creates resources in the following order:

* Azure Cosmos DB API for MongoDB account
* Databases 
* Collections 
* Documents

To learn more about the hierarchy of entities, see the [Azure Cosmos DB resource model](../account-databases-containers-items.md) article.

## Install the sample app template

This sample is a dotnet project template, which can be installed to create a local copy. Run the following commands in a command window:

```bash
mkdir "C:\cosmos-samples"
cd "C:\cosmos-samples"
dotnet new -i Microsoft.Azure.Cosmos.Templates
dotnet new cosmosmongo-webapi
```

The preceding commands:

1. Create the *C:\cosmos-samples* directory for the sample. Choose a folder appropriate for your operating system.
1. Change your current directory to the *C:\cosmos-samples* folder.
1. Install the project template, making it available globally from the dotnet CLI.
1. Create a local sample app using the project template.

If you don't wish to use the dotnet CLI, you can also [download the project templates as a ZIP file](https://github.com/Azure/azure-cosmos-dotnet-templates). This sample is in the `Templates/APIForMongoDBQuickstart-WebAPI` folder.

## Review the code

The following steps are optional. If you're interested in learning how the database resources are created in the code, review the following snippets. Otherwise, skip ahead to [Update the application settings](#update-the-application-settings).

### Setup connection

The following snippet is from the *Services/MongoService.cs* file.

* The following class represents the client and is injected by the .NET framework into services that consume it:

    ```cs
        public class MongoService
        {
            private static MongoClient _client;

            public MongoService(IDatabaseSettings settings)
            {
                _client = new MongoClient(settings.MongoConnectionString);
            }

            public MongoClient GetClient()
            {
                return _client;
            }
        }
    ```

### Setup product catalog data service

The following snippets are from the *Services/ProductService.cs* file.

* The following code retrieves the database and the collection and will create them if they don't already exist:

    ```csharp
    private readonly IMongoCollection<Product> _products;        

    public ProductService(MongoService mongo, IDatabaseSettings settings)
    {
        var db = mongo.GetClient().GetDatabase(settings.DatabaseName);
        _products = db.GetCollection<Product>(settings.ProductCollectionName);
    }
    ```

* The following code retrieves a document by sku, a unique product identifier:

    ```csharp
    public Task<Product> GetBySkuAsync(string sku)
    {
        return _products.Find(p => p.Sku == sku).FirstOrDefaultAsync();
    }
    ```

* The following code creates a product and inserts it into the collection:

    ```csharp
    public Task CreateAsync(Product product)
    {
        _products.InsertOneAsync(product);
    }
    ```

* The following code finds and updates a product:

    ```csharp
    public Task<Product> UpdateAsync(Product update)
    {
        return _products.FindOneAndReplaceAsync(
            Builders<Product>.Filter.Eq(p => p.Sku, update.Sku), 
            update, 
            new FindOneAndReplaceOptions<Product> { ReturnDocument = ReturnDocument.After });
    }
    ```

    Similarly, you can delete documents by using the [collection.DeleteOne()](https://docs.mongodb.com/stitch/mongodb/actions/collection.deleteOne/index.html) method.

## Update the application settings

From the Azure portal, copy the connection string information:

1. In the [Azure portal](https://portal.azure.com/), select your Cosmos DB account, in the left navigation select **Connection String**, and then select **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the primary connection string into the appsettings.json file in the next step.

2. Open the *appsettings.json* file.

3. Copy the **primary connection string** value from the portal (using the copy button) and make it the value of the **DatabaseSettings.MongoConnectionString** property in the **appsettings.json** file.

4. Review the **database name** value in the **DatabaseSettings.DatabaseName** property in the **appsettings.json** file.

5. Review the **collection name** value in the **DatabaseSettings.ProductCollectionName** property in the **appsettings.json** file.

> [!WARNING]
> Never check passwords or other sensitive data into source code.

You've now updated your app with all the info it needs to communicate with Cosmos DB.

## Load sample data

[Download](https://www.mongodb.com/try/download/database-tools) [mongoimport](https://docs.mongodb.com/database-tools/mongoimport/#mongodb-binary-bin.mongoimport), a CLI tool that easily imports small amounts of JSON, CSV, or TSV data. We will use mongoimport to load the sample product data provided in the `Data` folder of this project.

From the Azure portal, copy the connection information and enter it in the command below: 

```bash
mongoimport --host <HOST>:<PORT> -u <USERNAME> -p <PASSWORD> --db cosmicworks --collection products --ssl --jsonArray --writeConcern="{w:0}" --file Data/products.json
```

1. In the [Azure portal](https://portal.azure.com/), select your Azure Cosmos DB API for MongoDB account, in the left navigation select **Connection String**, and then select **Read-write Keys**. 

1. Copy the **HOST** value from the portal (using the copy button) and enter it in place of **<HOST>**.

1. Copy the **PORT** value from the portal (using the copy button) and enter it in place of **<PORT>**.

1. Copy the **USERNAME** value from the portal (using the copy button) and enter it in place of **<USERNAME>**.

1. Copy the **PASSWORD** value from the portal (using the copy button) and enter it in place of **<PASSWORD>**.

1. Review the **database name** value and update it if you created something other than `cosmicworks`.

1. Review the **collection name** value and update it if you created something other than `products`.

> [!Note]
> If you would like to skip this step you can create documents with the correct schema using the POST endpoint provided as part of this web api project.

## Run the app

From Visual Studio, select CTRL + F5 to run the app. The default browser is launched with the app.

If you prefer the CLI, run the following command in a command window to start the sample app. This command will also install project dependencies and build the project, but will not automatically launch the browser.

```bash
dotnet run
```

After the application is running, navigate to [https://localhost:5001/swagger/index.html](https://localhost:5001/swagger/index.html) to see the [swagger documentation](https://swagger.io/) for the web api and to submit sample requests.

Select the API you would like to test and select "Try it out".

:::image type="content" source="./media/create-mongodb-dotnet/try-swagger.png" alt-text="Try API endpoints with Swagger":::

Enter any necessary parameters and select "Execute."

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an API for MongoDB account, create a database and a collection with code, and run a web API app. You can now import additional data to your database. 

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json)
