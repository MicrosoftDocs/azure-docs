---
title: Quickstart - Build a .NET console app to manage Azure Cosmos DB SQL API resources
description: Learn how to build a .NET console app to manage Azure Cosmos DB SQL API account resources in this quickstart.
author: anfeldma-ms
ms.author: anfeldma
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 05/11/2020
---
# Quickstart: Build a .NET console app to manage Azure Cosmos DB SQL API resources

> [!div class="op_single_selector"]
> * [.NET V3](create-sql-api-dotnet.md)
> * [.NET V4](create-sql-api-dotnet-V4.md)
> * [Java SDK v4](create-sql-api-java.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)
> * [Xamarin](create-sql-api-xamarin-dotnet.md)

Get started with the Azure Cosmos DB SQL API client library for .NET. Follow the steps in this doc to install the .NET package, build an app, and try out the example code for basic CRUD operations on the data stored in Azure Cosmos DB. 

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can use Azure Cosmos DB to quickly create and query key/value, document, and graph databases. Use the Azure Cosmos DB SQL API client library for .NET to:

* Create an Azure Cosmos database and a container
* Add sample data to the container
* Query the data 
* Delete the database

[API reference documentation](/dotnet/api/microsoft.azure.cosmos?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos)

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/) or you can [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription, free of charge and commitments. 
* The [.NET Core 2.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core/2.1).

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

```console
dotnet new console --langVersion 7.1 -n todo
```

Change your directory to the newly created app folder. You can build the application with:

```console
cd todo
dotnet build
```

The expected output from the build should look something like this:

```console
  Restore completed in 100.37 ms for C:\Users\user1\Downloads\CosmosDB_Samples\todo\todo.csproj.
  todo -> C:\Users\user1\Downloads\CosmosDB_Samples\todo\bin\Debug\netcoreapp2.2\todo.dll
  todo -> C:\Users\user1\Downloads\CosmosDB_Samples\todo\bin\Debug\netcoreapp2.2\todo.Views.dll

Build succeeded.
    0 Warning(s)
    0 Error(s)

Time Elapsed 00:00:34.17
```

### <a id="install-package"></a>Install the Azure Cosmos DB package

While still in the application directory, install the Azure Cosmos DB client library for .NET Core by using the dotnet add package command.

```console
dotnet add package Microsoft.Azure.Cosmos
```

### Copy your Azure Cosmos account credentials from the Azure portal

The sample application needs to authenticate to your Azure Cosmos account. To authenticate, you should pass the Azure Cosmos account credentials to the application. Get your Azure Cosmos account credentials by following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your Azure Cosmos account.

1. Open the **Keys** pane and copy the **URI** and **PRIMARY KEY** of your account. You will add the URI and keys values to an environment variable in the next step.

### Set the environment variables

After you have copied the **URI** and **PRIMARY KEY** of your account, save them to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and run the following command. Make sure to replace `<Your_Azure_Cosmos_account_URI>` and `<Your_Azure_Cosmos_account_PRIMARY_KEY>` values.

**Windows**

```console
setx EndpointUrl "<Your_Azure_Cosmos_account_URI>"
setx PrimaryKey "<Your_Azure_Cosmos_account_PRIMARY_KEY>"
```

**Linux**

```bash
export EndpointUrl = "<Your_Azure_Cosmos_account_URI>"
export PrimaryKey = "<Your_Azure_Cosmos_account_PRIMARY_KEY>"
```

**macOS**

```bash
export EndpointUrl = "<Your_Azure_Cosmos_account_URI>"
export PrimaryKey = "<Your_Azure_Cosmos_account_PRIMARY_KEY>"
```

 ## <a id="object-model"></a>Object model

Before you start building the application, let's look into the hierarchy of resources in Azure Cosmos DB and the object model used to create and access these resources. The Azure Cosmos DB creates resources in the following order:

* Azure Cosmos account 
* Databases 
* Containers 
* Items

To learn in more about the hierarchy of different entities, see the [working with databases, containers, and items in Azure Cosmos DB](databases-containers-items.md) article. You will use the following .NET classes to interact with these resources:

* [CosmosClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.cosmosclient?view=azure-dotnet) - This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service.

* [CreateDatabaseIfNotExistsAsync](/dotnet/api/microsoft.azure.cosmos.cosmosclient.createdatabaseifnotexistsasync?view=azure-dotnet) - This method creates (if doesn't exist) or gets (if already exists) a database resource as an asynchronous operation. 

* [CreateContainerIfNotExistsAsync](/dotnet/api/microsoft.azure.cosmos.database.createcontainerifnotexistsasync?view=azure-dotnet)- - This method creates (if it doesn't exist) or gets (if it already exists) a container as an asynchronous operation. You can check the status code from the response to determine whether the container was newly created (201) or an existing container was returned (200). 
* [CreateItemAsync](/dotnet/api/microsoft.azure.cosmos.container.createitemasync?view=azure-dotnet) - This method creates an item within the container. 

* [UpsertItemAsync](/dotnet/api/microsoft.azure.cosmos.container.upsertitemasync?view=azure-dotnet) - This method creates an item within the container if it doesn't already exist or replaces the item if it already exists. 

* [GetItemQueryIterator](/dotnet/api/microsoft.azure.cosmos.container.GetItemQueryIterator?view=azure-dotnet
) - This method creates a query for items under a container in an Azure Cosmos database using a SQL statement with parameterized values. 

* [DeleteAsync](/dotnet/api/microsoft.azure.cosmos.database.deleteasync?view=azure-dotnet) - Deletes the specified database from your Azure Cosmos account. `DeleteAsync` method only deletes the database. Disposing of the `Cosmosclient` instance should happen separately (which it does in the DeleteDatabaseAndCleanupAsync method. 

 ## <a id="code-examples"></a>Code examples

The sample code described in this article creates a family database in Azure Cosmos DB. The family database contains family details such as name, address, location, the associated parents, children, and pets. Before populating the data to your Azure Cosmos account, define the properties of a family item. Create a new class named `Family.cs` at the root level of your sample application and add the following code to it:

```csharp
using Newtonsoft.Json;

namespace todo
{
    public class Family
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        public string LastName { get; set; }
        public Parent[] Parents { get; set; }
        public Child[] Children { get; set; }
        public Address Address { get; set; }
        public bool IsRegistered { get; set; }
        // The ToString() method is used to format the output, it's used for demo purpose only. It's not required by Azure Cosmos DB
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }

    public class Parent
    {
        public string FamilyName { get; set; }
        public string FirstName { get; set; }
    }

    public class Child
    {
        public string FamilyName { get; set; }
        public string FirstName { get; set; }
        public string Gender { get; set; }
        public int Grade { get; set; }
        public Pet[] Pets { get; set; }
    }

    public class Pet
    {
        public string GivenName { get; set; }
    }

    public class Address
    {
        public string State { get; set; }
        public string County { get; set; }
        public string City { get; set; }
    }
}
```

### Add the using directives & define the client object

From the project directory, open the `Program.cs` file in your editor and add the following using directives at the top of your application:

```csharp

using System;
using System.Threading.Tasks;
using System.Configuration;
using System.Collections.Generic;
using System.Net;
using Microsoft.Azure.Cosmos;
```

To the **Program.cs** file, add code to read the environment variables that you have set in the previous step. Define the `CosmosClient`, `Database`, and the `Container` objects. Next add code to the main method that calls the `GetStartedDemoAsync` method where you manage Azure Cosmos account resources. 

```csharp
namespace todo
{
public class Program
{

    /// The Azure Cosmos DB endpoint for running this GetStarted sample.
    private string EndpointUrl = Environment.GetEnvironmentVariable("EndpointUrl");

    /// The primary key for the Azure DocumentDB account.
    private string PrimaryKey = Environment.GetEnvironmentVariable("PrimaryKey");

    // The Cosmos client instance
    private CosmosClient cosmosClient;

    // The database we will create
    private Database database;

    // The container we will create.
    private Container container;

    // The name of the database and container we will create
    private string databaseId = "FamilyDatabase";
    private string containerId = "FamilyContainer";

    public static async Task Main(string[] args)
    {
       try
       {
           Console.WriteLine("Beginning operations...\n");
           Program p = new Program();
           await p.GetStartedDemoAsync();

        }
        catch (CosmosException de)
        {
           Exception baseException = de.GetBaseException();
           Console.WriteLine("{0} error occurred: {1}", de.StatusCode, de);
        }
        catch (Exception e)
        {
            Console.WriteLine("Error: {0}", e);
        }
        finally
        {
            Console.WriteLine("End of demo, press any key to exit.");
            Console.ReadKey();
        }
    }
}
}
```

### Create a database 

Define the `CreateDatabaseAsync` method within the `program.cs` class. This method creates the `FamilyDatabase` if it doesn't already exist.

```csharp
private async Task CreateDatabaseAsync()
{
    // Create a new database
    this.database = await this.cosmosClient.CreateDatabaseIfNotExistsAsync(databaseId);
    Console.WriteLine("Created Database: {0}\n", this.database.Id);
}
```

### Create a container

Define the `CreateContainerAsync` method within the `program.cs` class. This method creates the `FamilyContainer` if it doesn't already exist. 

```csharp
/// Create the container if it does not exist. 
/// Specifiy "/LastName" as the partition key since we're storing family information, to ensure good distribution of requests and storage.
private async Task CreateContainerAsync()
{
    // Create a new container
    this.container = await this.database.CreateContainerIfNotExistsAsync(containerId, "/LastName");
    Console.WriteLine("Created Container: {0}\n", this.container.Id);
}
```

### Create an item

Create a family item by adding the `AddItemsToContainerAsync` method with the following code. You can use the `CreateItemAsync` or `UpsertItemAsync` methods to create an item:

```csharp
private async Task AddItemsToContainerAsync()
{
    // Create a family object for the Andersen family
    Family andersenFamily = new Family
    {
        Id = "Andersen.1",
        LastName = "Andersen",
        Parents = new Parent[]
        {
           new Parent { FirstName = "Thomas" },
           new Parent { FirstName = "Mary Kay" }
        },
        Children = new Child[]
        {
           new Child
            {
                FirstName = "Henriette Thaulow",
                Gender = "female",
                Grade = 5,
                Pets = new Pet[]
                {
                    new Pet { GivenName = "Fluffy" }
                }
            }
        },
        Address = new Address { State = "WA", County = "King", City = "Seattle" },
        IsRegistered = false
    };

    try
    {
        // Create an item in the container representing the Andersen family. Note we provide the value of the partition key for this item, which is "Andersen".
        ItemResponse<Family> andersenFamilyResponse = await this.container.CreateItemAsync<Family>(andersenFamily, new PartitionKey(andersenFamily.LastName));
        // Note that after creating the item, we can access the body of the item with the Resource property of the ItemResponse. We can also access the RequestCharge property to see the amount of RUs consumed on this request.
        Console.WriteLine("Created item in database with id: {0} Operation consumed {1} RUs.\n", andersenFamilyResponse.Resource.Id, andersenFamilyResponse.RequestCharge);
    }
    catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
    {
        Console.WriteLine("Item in database with id: {0} already exists\n", andersenFamily.Id);                
    }
}

```

### Query the items

After inserting an item, you can run a query to get the details of "Andersen" family. The following code shows how to execute the query using the SQL query directly. The SQL query to get the "Anderson" family details is: `SELECT * FROM c WHERE c.LastName = 'Andersen'`. Define the `QueryItemsAsync` method within the `program.cs` class and add the following code to it:


```csharp
private async Task QueryItemsAsync()
{
    var sqlQueryText = "SELECT * FROM c WHERE c.LastName = 'Andersen'";

    Console.WriteLine("Running query: {0}\n", sqlQueryText);

    QueryDefinition queryDefinition = new QueryDefinition(sqlQueryText);
    FeedIterator<Family> queryResultSetIterator = this.container.GetItemQueryIterator<Family>(queryDefinition);

    List<Family> families = new List<Family>();

    while (queryResultSetIterator.HasMoreResults)
    {
        FeedResponse<Family> currentResultSet = await queryResultSetIterator.ReadNextAsync();
        foreach (Family family in currentResultSet)
        {
            families.Add(family);
            Console.WriteLine("\tRead {0}\n", family);
        }
    }
}

```

### Delete the database 

Finally you can delete the database adding the `DeleteDatabaseAndCleanupAsync` method with the following code:

```csharp
private async Task DeleteDatabaseAndCleanupAsync()
{
   DatabaseResponse databaseResourceResponse = await this.database.DeleteAsync();
   // Also valid: await this.cosmosClient.Databases["FamilyDatabase"].DeleteAsync();

   Console.WriteLine("Deleted Database: {0}\n", this.databaseId);

   //Dispose of CosmosClient
    this.cosmosClient.Dispose();
}
```

### Execute the CRUD operations

After you have defined all the required methods, execute them with in the `GetStartedDemoAsync` method. The `DeleteDatabaseAndCleanupAsync` method commented out in this code because you will not see any resources if that method is executed. You can uncomment it after validating that your Azure Cosmos DB resources were created in the Azure portal. 

```csharp
public async Task GetStartedDemoAsync()
{
    // Create a new instance of the Cosmos Client
    this.cosmosClient = new CosmosClient(EndpointUrl, PrimaryKey);
    await this.CreateDatabaseAsync();
    await this.CreateContainerAsync();
    await this.AddItemsToContainerAsync();
    await this.QueryItemsAsync();
}
```

After you add all the required methods, save the `Program.cs` file. 

## Run the code

Next build and run the application to create the Azure Cosmos DB resources. Make sure to open a new command prompt window, don't use the same instance that you have used to set the environment variables. Because the environment variables are not set in the current open window. You will need to open a new command prompt to see the updates. 

```console
dotnet build
```

```console
dotnet run
```

The following output is generated when you run the application. You can also sign into the Azure portal and validate that the resources are created:

```console
Created Database: FamilyDatabase

Created Container: FamilyContainer

Created item in database with id: Andersen.1 Operation consumed 11.62 RUs.

Running query: SELECT * FROM c WHERE c.LastName = 'Andersen'

        Read {"id":"Andersen.1","LastName":"Andersen","Parents":[{"FamilyName":null,"FirstName":"Thomas"},{"FamilyName":null,"FirstName":"Mary Kay"}],"Children":[{"FamilyName":null,"FirstName":"Henriette Thaulow","Gender":"female","Grade":5,"Pets":[{"GivenName":"Fluffy"}]}],"Address":{"State":"WA","County":"King","City":"Seattle"},"IsRegistered":false}

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
