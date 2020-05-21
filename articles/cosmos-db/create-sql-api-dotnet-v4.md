---
title: Manage Azure Cosmos DB SQL API resources using .NET V4 SDK
description: Quickstart to build a console app using .NET V4 SDK  to manage Azure Cosmos DB SQL API account resources.
author: anfeldma-ms
ms.author: anfeldma
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 05/11/2020
---
# Quickstart: Build a console app using the .NET V4 SDK to manage Azure Cosmos DB SQL API account resources.

> [!div class="op_single_selector"]
> * [.NET V3](create-sql-api-dotnet.md)
> * [.NET V4](create-sql-api-dotnet-V4.md)
> * [Java SDK v4](create-sql-api-java.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)

Get started with the Azure Cosmos DB SQL API client library for .NET. Follow the steps in this doc to install the .NET V4 (Azure.Cosmos) package, build an app, and try out the example code for basic CRUD operations on the data stored in Azure Cosmos DB. 

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can use Azure Cosmos DB to quickly create and query key/value, document, and graph databases. Use the Azure Cosmos DB SQL API client library for .NET to:

* Create an Azure Cosmos database and a container
* Add sample data to the container
* Query the data 
* Delete the database

[Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/v4) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Cosmos)

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/) or you can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments. 
* [NET Core 3 SDK](https://dotnet.microsoft.com/download/dotnet-core). You can verify which version is available in your environment by running `dotnet --version`.

## Setting up

This section walks you through creating an Azure Cosmos account and setting up a project that uses Azure Cosmos DB SQL API client library for .NET to manage resources. The example code described in this article creates a `FamilyDatabase` database and family members (each family member is an item) within that database. Each family member has properties such as `Id, FamilyName, FirstName, LastName, Parents, Children, Address,`. The `LastName` property is used as the partition key for the container. 

### <a id="create-account"></a>Create an Azure Cosmos account

If you use the [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) option to create an Azure Cosmos account, you must create an Azure Cosmos DB account of type **SQL API**. An Azure Cosmos DB test account is already created for you. You don't have to create the account explicitly, so you can skip this section and move to the next section.

If you have your own Azure subscription or created a subscription for free, you should create an Azure Cosmos account explicitly. The following code will create an Azure Cosmos account with session consistency. The account is replicated in `South Central US` and `North Central US`.  

You can use Azure Cloud Shell to create the Azure Cosmos account. Azure Cloud Shell is an interactive, authenticated, browser-accessible shell for managing Azure resources. It provides the flexibility of choosing the shell experience that best suits the way you work, either Bash or PowerShell. For this quickstart, choose **Bash** mode. Azure Cloud Shell also requires a storage account, you can create one when prompted.

Select the **Try It** button next to the following code, choose **Bash** mode select **create a storage account** and login to Cloud Shell. Next copy and paste the following code to Azure Cloud Shell and run it. The Azure Cosmos account name must be globally unique, make sure to update the `mysqlapicosmosdb` value before you run the command.

```azurecli-interactive

# Set variables for the new SQL API account, database, and container
resourceGroupName='myResourceGroup'
location='southcentralus'

# The Azure Cosmos account name must be globally unique, make sure to update the `mysqlapicosmosdb` value before you run the command
accountName='mysqlapicosmosdb'

# Create a resource group
az group create \
    --name $resourceGroupName \
    --location $location

# Create a SQL API Cosmos DB account with session consistency and multi-master enabled
az cosmosdb create \
    --resource-group $resourceGroupName \
    --name $accountName \
    --kind GlobalDocumentDB \
    --locations regionName="South Central US" failoverPriority=0 --locations regionName="North Central US" failoverPriority=1 \
    --default-consistency-level "Session" \
    --enable-multiple-write-locations true

```

The creation of the Azure Cosmos account takes a while, once the operation is successful, you can see the confirmation output. After the command completes successfully, sign into the [Azure portal](https://portal.azure.com/) and verify that the Azure Cosmos account with the specified name exists. You can close the Azure Cloud Shell window after the resource is created. 

### <a id="create-dotnet-core-app"></a>Create a new .NET app

Create a new .NET application in your preferred editor or IDE. Open the Windows command prompt or a Terminal window from your local computer. You will run all the commands in the next sections from the command prompt or terminal.  Run the following dotnet new command to create a new app with the name `todo`. The --langVersion parameter sets the LangVersion property in the created project file.

   ```bash
   dotnet new console –langVersion:8 -n todo
   ```

Change your directory to the newly created app folder. You can build the application with:

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

While still in the application directory, install the Azure Cosmos DB client library for .NET Core by using the dotnet add package command.

   ```bash
   dotnet add package Azure.Cosmos --version 4.0.0-preview3
   ```

### Copy your Azure Cosmos account credentials from the Azure portal

The sample application needs to authenticate to your Azure Cosmos account. To authenticate, you should pass the Azure Cosmos account credentials to the application. Get your Azure Cosmos account credentials by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos account.

1. Open the **Keys** pane and copy the **URI** and **PRIMARY KEY** of your account. You will add the URI and keys values to an environment variable in the next step.

## <a id="object-model"></a>Object model

Before you start building the application, let's look into the hierarchy of resources in Azure Cosmos DB and the object model used to create and access these resources. The Azure Cosmos DB creates resources in the following order:

* Azure Cosmos account 
* Databases 
* Containers 
* Items

To learn in more about the hierarchy of different entities, see the [working with databases, containers, and items in Azure Cosmos DB](databases-containers-items.md) article. You will use the following .NET classes to interact with these resources:

* CosmosClient - This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service.
* CreateDatabaseIfNotExistsAsync - This method creates (if doesn't exist) or gets (if already exists) a database resource as an asynchronous operation. 
* CreateContainerIfNotExistsAsync - This method creates (if it doesn't exist) or gets (if it already exists) a container as an asynchronous operation. You can check the status code from the response to determine whether the container was newly created (201) or an existing container was returned (200). 
* CreateItemAsync - This method creates an item within the container.
* UpsertItemAsync - This method creates an item within the container if it doesn't already exist or replaces the item if it already exists. 
* GetItemQueryIterator - This method creates a query for items under a container in an Azure Cosmos database using a SQL statement with parameterized values. 
* DeleteAsync - Deletes the specified database from your Azure Cosmos account. `DeleteAsync` method only deletes the database.

 ## <a id="code-examples"></a>Code examples

The sample code described in this article creates a family database in Azure Cosmos DB. The family database contains family details such as name, address, location, the associated parents, children, and pets. Before populating the data to your Azure Cosmos account, define the properties of a family item. Create a new class named `Family.cs` at the root level of your sample application and add the following code to it:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Family.cs)]

### Add the using directives & define the client object

From the project directory, open the `Program.cs` file in your editor and add the following using directives at the top of your application:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=Usings)]


Add the following global variables in your `Program` class. These will include the endpoint and authorization keys, the name of the database, and container that you will create. Make sure to replace the endpoint and authorization keys values according to your environment. 

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=Constants)]

Finally, replace the `Main` method:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=Main)]

### Create a database 

Define the `CreateDatabaseAsync` method within the `program.cs` class. This method creates the `FamilyDatabase` if it doesn't already exist.

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=CreateDatabaseAsync)]

### Create a container

Define the `CreateContainerAsync` method within the `Program` class. This method creates the `FamilyContainer` if it doesn't already exist. 

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=CreateContainerAsync)]

### Create an item

Create a family item by adding the `AddItemsToContainerAsync` method with the following code. You can use the `CreateItemAsync` or `UpsertItemAsync` methods to create an item:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=AddItemsToContainerAsync)]

### Query the items

After inserting an item, you can run a query to get the details of "Andersen" family. The following code shows how to execute the query using the SQL query directly. The SQL query to get the "Anderson" family details is: `SELECT * FROM c WHERE c.LastName = 'Andersen'`. Define the `QueryItemsAsync` method within the `Program` class and add the following code to it:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=QueryItemsAsync)]

### Replace an item 

Read a family item and then update it by adding the `ReplaceFamilyItemAsync` method with the following code.

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=ReplaceFamilyItemAsync)]

### Delete an item 

Delete a family item by adding the `DeleteFamilyItemAsync` method with the following code.

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=DeleteFamilyItemAsync)]

### Delete the database 

Finally you can delete the database adding the `DeleteDatabaseAndCleanupAsync` method with the following code:

[!code-csharp[Main](~/cosmos-dotnet-v4-getting-started/src/Program.cs?name=DeleteDatabaseAndCleanupAsync)]

After you add all the required methods, save the `Program` file. 

## Run the code

Next build and run the application to create the Azure Cosmos DB resources.

   ```bash
   dotnet run
   ```

The following output is generated when you run the application. You can also sign into the Azure portal and validate that the resources are created:

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

You can validate that the data is created by signing into the Azure portal and see the required items in your Azure Cosmos account. 

## Clean up resources

When no longer needed, you can use the Azure CLI or Azure PowerShell to remove the Azure Cosmos account and the corresponding resource group. The following command shows how to delete the resource group by using the Azure CLI:

```azurecli
az group delete -g "myResourceGroup"
```

## Next steps

In this quickstart, you learned how to create an Azure Cosmos account, create a database and a container using a .NET Core app. You can now import additional data to your Azure Cosmos account with the instructions int the following article. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](import-data.md)
