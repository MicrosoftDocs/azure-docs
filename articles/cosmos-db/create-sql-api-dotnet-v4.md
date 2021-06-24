---
title: Manage Azure Cosmos DB SQL API resources using .NET V4 SDK
description: Use this quickstart to build a console app by using the .NET V4 SDK to manage Azure Cosmos DB SQL API account resources.
author: anfeldma-ms
ms.author: anfeldma
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 04/07/2021
ms.custom: devx-track-dotnet, devx-track-azurecli
---
# Quickstart: Build a console app by using the .NET V4 SDK (preview) to manage Azure Cosmos DB SQL API account resources
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

> [!div class="op_single_selector"]
> * [.NET V3](create-sql-api-dotnet.md)
> * [.NET V4](create-sql-api-dotnet-V4.md)
> * [Java SDK v4](create-sql-api-java.md)
> * [Spring Data v3](create-sql-api-spring-data.md)
> * [Spark v3 connector](create-sql-api-spark.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)

Get started with the Azure Cosmos DB SQL API client library for .NET. Follow the steps in this article to install the .NET V4 (Azure.Cosmos) package and build an app. Then, try out the example code for basic create, read, update, and delete (CRUD) operations on the data stored in Azure Cosmos DB.

> [!IMPORTANT]
> The .NET V4 SDK for Azure Cosmos DB is currently in public preview. This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities.
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Cosmos DB is Microsoft's fast NoSQL database with open APIs for any scale. You can use Azure Cosmos DB to quickly create and query key/value, document, and graph databases. Use the Azure Cosmos DB SQL API client library for .NET to:

* Create an Azure Cosmos database and a container.
* Add sample data to the container.
* Query the data. 
* Delete the database.

[Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/v4) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Cosmos)

## Prerequisites

* Azure subscription. [Create one for free](https://azure.microsoft.com/free/). You can also [try Azure Cosmos DB](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments. 
* [NET Core 3 SDK](https://dotnet.microsoft.com/download/dotnet-core). You can verify which version is available in your environment by running `dotnet --version`.

## Set up

This section walks you through creating an Azure Cosmos account and setting up a project that uses the Azure Cosmos DB SQL API client library for .NET to manage resources. 

The example code described in this article creates a `FamilyDatabase` database and family members within that database. Each family member is an item and has properties such as `Id`, `FamilyName`, `FirstName`, `LastName`, `Parents`, `Children`, and `Address`. The `LastName` property is used as the partition key for the container. 

### <a id="create-account"></a>Create an Azure Cosmos account

If you use the [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) option to create an Azure Cosmos account, you must create an Azure Cosmos account of type **SQL API**. An Azure Cosmos test account is already created for you. You don't have to create the account explicitly, so you can skip this section and move to the next section.

If you have your own Azure subscription or created a subscription for free, you should create an Azure Cosmos account explicitly. The following code will create an Azure Cosmos account with session consistency. The account is replicated in `South Central US` and `North Central US`.  

You can use Azure Cloud Shell to create the Azure Cosmos account. Azure Cloud Shell is an interactive, authenticated, browser-accessible shell for managing Azure resources. It provides the flexibility of choosing the shell experience that best suits the way you work: either Bash or PowerShell. 

For this quickstart, use Bash. Azure Cloud Shell also requires a storage account. You can create one when prompted.

1. Select the **Try It** button next to the following code, choose **Bash** mode, select **create a storage account**, and sign in to Cloud Shell. 

1. Copy and paste the following code to Azure Cloud Shell and run it. The Azure Cosmos account name must be globally unique, so be sure to update the `mysqlapicosmosdb` value before you run the command.

   ```azurecli-interactive

   # Set variables for the new SQL API account, database, and container
   resourceGroupName='myResourceGroup'
   location='southcentralus'

   # The Azure Cosmos account name must be globally unique, so be sure to update the `mysqlapicosmosdb` value before you run the command
   accountName='mysqlapicosmosdb'

   # Create a resource group
   az group create \
       --name $resourceGroupName \
       --location $location

   # Create a SQL API Cosmos DB account with session consistency and multi-region writes enabled
   az cosmosdb create \
       --resource-group $resourceGroupName \
       --name $accountName \
       --kind GlobalDocumentDB \
       --locations regionName="South Central US" failoverPriority=0 --locations regionName="North Central US" failoverPriority=1 \
       --default-consistency-level "Session" \
       --enable-multiple-write-locations true

   ```

The creation of the Azure Cosmos account takes a while. After the operation is successful, you can see the confirmation output. Sign in to the [Azure portal](https://portal.azure.com/) and verify that the Azure Cosmos account with the specified name exists. You can close the Azure Cloud Shell window after the resource is created. 

### <a id="create-dotnet-core-app"></a>Create a .NET app

Create a .NET application in your preferred editor or IDE. Open the Windows command prompt or a terminal window from your local computer. You'll run all the commands in the next sections from the command prompt or terminal.  

Run the following `dotnet new` command to create an app with the name `todo`. The `--langVersion` parameter sets the `LangVersion` property in the created project file.

   ```bash
   dotnet new console --langVersion:8 -n todo
   ```

Use the following commands to change your directory to the newly created app folder and build the application:

   ```bash
   cd todo
   dotnet build
   ```

The expected output from the build should look something like this:

```bash
  Restore completed in 100.37 ms for C:\Users\user1\Downloads\CosmosDB_Samples\todo\todo.csproj.
  todo -> C:\Users\user1\Downloads\CosmosDB_Samples\todo\bin\Debug\netcoreapp3.0\todo.dll

Build succeeded.
    0 Warning(s)
    0 Error(s)

Time Elapsed 00:00:34.17
```

### <a id="install-package"></a>Install the Azure Cosmos DB package

While you're still in the application directory, install the Azure Cosmos DB client library for .NET Core by using the `dotnet add package` command:

   ```bash
   dotnet add package Azure.Cosmos --version 4.0.0-preview3
   ```

### Copy your Azure Cosmos account credentials from the Azure portal

The sample application needs to authenticate to your Azure Cosmos account. To authenticate, pass the Azure Cosmos account credentials to the application. Get your Azure Cosmos account credentials by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to your Azure Cosmos account.

1. Open the **Keys** pane and copy the **URI** and **PRIMARY KEY** values for your account. You'll add the URI and key values to an environment variable in the next procedure.

## <a id="object-model"></a>Learn the object model

Before you continue building the application, let's look into the hierarchy of resources in Azure Cosmos DB and the object model that's used to create and access these resources. Azure Cosmos DB creates resources in the following order:

* Azure Cosmos account 
* Databases 
* Containers 
* Items

To learn more about the hierarchy of entities, see the [Azure Cosmos DB resource model](account-databases-containers-items.md) article. You'll use the following .NET classes to interact with these resources:

* `CosmosClient`. This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service.
* `CreateDatabaseIfNotExistsAsync`. This method creates (if it doesn't exist) or gets (if it already exists) a database resource as an asynchronous operation. 
* `CreateContainerIfNotExistsAsync`. This method creates (if it doesn't exist) or gets (if it already exists) a container as an asynchronous operation. You can check the status code from the response to determine whether the container was newly created (201) or an existing container was returned (200). 
* `CreateItemAsync`. This method creates an item within the container.
* `UpsertItemAsync`. This method creates an item within the container if it doesn't already exist or replaces the item if it already exists. 
* `GetItemQueryIterator`. This method creates a query for items under a container in an Azure Cosmos database by using a SQL statement with parameterized values. 
* `DeleteAsync`. This method deletes the specified database from your Azure Cosmos account.

 ## <a id="code-examples"></a>Configure code examples

The sample code described in this article creates a family database in Azure Cosmos DB. The family database contains family details such as name, address, location, parents, children, and pets. 

Before you populate the data for your Azure Cosmos account, define the properties of a family item. Create a new class named `Family.cs` at the root level of your sample application and add the following code to it:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Family.cs)]

### Add the using directives and define the client object

From the project directory, open the *Program.cs* file in your editor and add the following `using` directives at the top of your application:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=Usings)]


Add the following global variables in your `Program` class. These variables will include the endpoint and authorization keys, the name of the database, and the container that you'll create. Be sure to replace the endpoint and authorization key values according to your environment. 

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=Constants)]

Finally, replace the `Main` method:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=Main)]

### Create a database 

Define the `CreateDatabaseAsync` method within the `program.cs` class. This method creates the `FamilyDatabase` database if it doesn't already exist.

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=CreateDatabaseAsync)]

### Create a container

Define the `CreateContainerAsync` method within the `Program` class. This method creates the `FamilyContainer` container if it doesn't already exist. 

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=CreateContainerAsync)]

### Create an item

Create a family item by adding the `AddItemsToContainerAsync` method with the following code. You can use the `CreateItemAsync` or `UpsertItemAsync` method to create an item.

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=AddItemsToContainerAsync)]

### Query the items

After you insert an item, you can run a query to get the details of the Andersen family. The following code shows how to execute the query by using the SQL query directly. The SQL query to get the Andersen family details is `SELECT * FROM c WHERE c.LastName = 'Andersen'`. Define the `QueryItemsAsync` method within the `Program` class and add the following code to it:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=QueryItemsAsync)]

### Replace an item 

Read a family item and then update it by adding the `ReplaceFamilyItemAsync` method with the following code:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=ReplaceFamilyItemAsync)]

### Delete an item 

Delete a family item by adding the `DeleteFamilyItemAsync` method with the following code:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=DeleteFamilyItemAsync)]

### Delete the database 

You can delete the database by adding the `DeleteDatabaseAndCleanupAsync` method with the following code:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=DeleteDatabaseAndCleanupAsync)]

After you add all the required methods, save the *Program.cs* file. 

## Run the code

Run the application to create the Azure Cosmos DB resources:

   ```bash
   dotnet run
   ```

The following output is generated when you run the application:

   ```bash
   Created Database: FamilyDatabase
   
   Created Container: FamilyContainer
   
   Created item in database with id: Andersen.1
   
   Running query: SELECT * FROM c WHERE c.LastName = 'Andersen'
   
           Read {"id":"Andersen.1","LastName":"Andersen","Parents":[{"FamilyName":null,"FirstName":"Thomas"},{"FamilyName":null   "FirstName":"Mary Kay"}],"Children":[{"FamilyName":null,"FirstName":"Henriette Thaulow","Gender":"female","Grade":5,"Pets": [{"GivenName":"Fluffy"}]}],"Address":{"State":"WA","County":"King","City":"Seattle"},"IsRegistered":false}
   
   Updated Family [Wakefield,Wakefield.7].
           Body is now: {"id":"Wakefield.7","LastName":"Wakefield","Parents":[{"FamilyName":"Wakefield","FirstName":"Robin"}   {"FamilyName":"Miller","FirstName":"Ben"}],"Children":[{"FamilyName":"Merriam","FirstName":"Jesse","Gender":"female","Grade":6   "Pets":[{"GivenName":"Goofy"},{"GivenName":"Shadow"}]},{"FamilyName":"Miller","FirstName":"Lisa","Gender":"female","Grade":1   "Pets":null}],"Address":{"State":"NY","County":"Manhattan","City":"NY"},"IsRegistered":true}
   
   Deleted Family [Wakefield,Wakefield.7]
   
   Deleted Database: FamilyDatabase
   
   End of demo, press any key to exit.
   ```

You can validate that the data is created by signing in to the Azure portal and seeing the required items in your Azure Cosmos account. 

## Clean up resources

When you no longer need the Azure Cosmos account and the corresponding resource group, you can use the Azure CLI or Azure PowerShell to remove them. The following command shows how to delete the resource group by using the Azure CLI:

```azurecli
az group delete -g "myResourceGroup"
```

## Next steps

In this quickstart, you learned how to create an Azure Cosmos account, create a database, and create a container by using a .NET Core app. You can now import more data to your Azure Cosmos account by using the instructions in the following article: 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](import-data.md)
