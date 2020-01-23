---
title: Azure Cosmos DB Table API using .NET Standard SDK
description: Learn how to store and query the structured data in Azure Cosmos DB Table API account
author: wmengmsft
ms.author: wmeng
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: dotnet
ms.topic: sample
ms.date: 12/03/2019
---
# Get started with Azure Cosmos DB Table API and Azure Table storage using the .NET SDK

[!INCLUDE [storage-selector-table-include](../../includes/storage-selector-table-include.md)]

[!INCLUDE [storage-table-applies-to-storagetable-and-cosmos](../../includes/storage-table-applies-to-storagetable-and-cosmos.md)]

You can use the Azure Cosmos DB Table API or Azure Table storage to store structured NoSQL data in the cloud, providing a key/attribute store with a schema less design. Because Azure Cosmos DB Table API and Table storage are schema less, it's easy to adapt your data as the needs of your application evolve. You can use Azure Cosmos DB Table API or the Table storage to store flexible datasets such as user data for web applications, address books, device information, or other types of metadata your service requires. 

This tutorial describes a sample that shows you how to use the [Microsoft Azure Cosmos DB Table Library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table) with Azure Cosmos DB Table API and Azure Table storage scenarios. You must use the connection specific to the Azure service. These scenarios are explored using C# examples that illustrate how to create tables, insert/ update data, query data and delete the tables.

## Prerequisites

You need the following to complete this sample successfully:

* [Microsoft Visual Studio](https://www.visualstudio.com/downloads/)

* [Microsoft Azure CosmosDB Table Library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table) - This library is currently available for .NET Standard and .NET framework. 

* [Azure Cosmos DB Table API account](create-table-dotnet.md#create-a-database-account).

## Create an Azure Cosmos DB Table API account

[!INCLUDE [cosmos-db-create-dbaccount-table](../../includes/cosmos-db-create-dbaccount-table.md)]

## Create a .NET console project

In Visual Studio, create a new .NET console application. The following steps show you how to create a console application in Visual Studio 2019. You can use the Azure Cosmos DB Table Library in any type of .NET application, including an Azure cloud service or web app, and desktop and mobile applications. In this guide, we use a console application for simplicity.

1. Select **File** > **New** > **Project**.

1. Choose **Console App (.NET Core)**, and then select **Next**.

1. In the **Project name** field, enter a name for your application, such as **CosmosTableSamples**. (You can provide a different name as needed.)

1. Select **Create**.

All code examples in this sample can be added to the Main() method of your console application's **Program.cs** file.

## Install the required NuGet package

To obtain the NuGet package, follow these steps:

1. Right-click your project in **Solution Explorer** and choose **Manage NuGet Packages**.

1. Search online for [`Microsoft.Azure.Cosmos.Table`](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table), [`Microsoft.Extensions.Configuration`](https://www.nuget.org/packages/Microsoft.Extensions.Configuration), [`Microsoft.Extensions.Configuration.Json`](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Json), [`Microsoft.Extensions.Configuration.Binder`](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Binder) and select **Install** to install the Microsoft Azure Cosmos DB Table Library.

## Configure your storage connection string

1. From the [Azure portal](https://portal.azure.com/), navigate to your Azure Cosmos account or the Table Storage account. 

1. Open the **Connection String** or **Access keys** pane. Use the copy button on the right side of the window to copy the **PRIMARY CONNECTION STRING**.

   ![View and copy the PRIMARY CONNECTION STRING in the Connection String pane](./media/create-table-dotnet/connection-string.png)
   
1. To configure your connection string, from visual studio right click on your project **CosmosTableSamples**.

1. Select **Add** and then **New Item**. Create a new file **Settings.json** with file type as **TypeScript JSON Configuration** File. 

1. Replace the code in Settings.json file with the following code and assign your primary connection string:

   ```csharp
   {
   "StorageConnectionString": <Primary connection string of your Azure Cosmos DB account>
   }
   ```

1. Right click on your project **CosmosTableSamples**. Select **Add**, **New Item** and add a class named **AppSettings.cs**.

1. Add the following code to the AppSettings.cs file. This file reads the connection string from Settings.json file and assigns it to the configuration parameter:

   ```csharp
   namespace CosmosTableSamples
   {
    using Microsoft.Extensions.Configuration;
    public class AppSettings
    {
        public string StorageConnectionString { get; set; }
        public static AppSettings LoadAppSettings()
        {
            IConfigurationRoot configRoot = new ConfigurationBuilder()
                .AddJsonFile("Settings.json")
                .Build();
            AppSettings appSettings = configRoot.Get<AppSettings>();
            return appSettings;
        }
    }
   }
   ```

## Parse and validate the connection details 

1. Right click on your project **CosmosTableSamples**. Select **Add**, **New Item** and add a class named **Common.cs**. You will write code to validate the connection details and create a table within this class.

1. Define a method `CreateStorageAccountFromConnectionString` as shown below. This method will parse the connection string details and validate that the account name and account key details provided in the "Settings.json" file are valid. 

 ```csharp
using System;

namespace CosmosTableSamples
{
    using System.Threading.Tasks;
    using Microsoft.Azure.Cosmos.Table;
    using Microsoft.Azure.Documents;

    public class Common
    {
        public static CloudStorageAccount CreateStorageAccountFromConnectionString(string storageConnectionString)
        {
            CloudStorageAccount storageAccount;
            try
            {
                storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            }
            catch (FormatException)
            {
                Console.WriteLine("Invalid storage account information provided. Please confirm the AccountName and AccountKey are valid in the app.config file - then restart the application.");
                throw;
            }
            catch (ArgumentException)
            {
                Console.WriteLine("Invalid storage account information provided. Please confirm the AccountName and AccountKey are valid in the app.config file - then restart the sample.");
                Console.ReadLine();
                throw;
            }

            return storageAccount;
        }
    }
}
   ```


## Create a Table 

The [CloudTableClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.table.cloudtableclient) class enables you to retrieve tables and entities stored in Table storage. Because we don’t have any tables in the Cosmos DB Table API account, let’s add the `CreateTableAsync` method to the **Common.cs** class to create a table:

```csharp
public static async Task<CloudTable> CreateTableAsync(string tableName)
  {
    string storageConnectionString = AppSettings.LoadAppSettings().StorageConnectionString;

    // Retrieve storage account information from connection string.
    CloudStorageAccount storageAccount = CreateStorageAccountFromConnectionString(storageConnectionString);

    // Create a table client for interacting with the table service
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());

    Console.WriteLine("Create a Table for the demo");

    // Create a table client for interacting with the table service 
    CloudTable table = tableClient.GetTableReference(tableName);
    if (await table.CreateIfNotExistsAsync())
    {
      Console.WriteLine("Created Table named: {0}", tableName);
    }
    else
    {
      Console.WriteLine("Table {0} already exists", tableName);
    }

    Console.WriteLine();
    return table;
}
```

If you get a "503 service unavailable exception" error, it's possible that the required ports for the connectivity mode are blocked by a firewall. To fix this issue, either open the required ports or use the gateway mode connectivity as shown in the following code:

```csharp
tableClient.TableClientConfiguration.UseRestExecutorForCosmosEndpoint = true;
```

## Define the entity 

Entities map to C# objects by using a custom class derived from [TableEntity](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.table.tableentity). To add an entity to a table, create a class that defines the properties of your entity.

Right click on your project **CosmosTableSamples**. Select **Add**, **New Folder** and name it as **Model**. Within the Model folder add a class named **CustomerEntity.cs** and add the following code to it.

```csharp
namespace CosmosTableSamples.Model
{
    using Microsoft.Azure.Cosmos.Table;
    public class CustomerEntity : TableEntity
    {
        public CustomerEntity()
        {
        }

        public CustomerEntity(string lastName, string firstName)
        {
            PartitionKey = lastName;
            RowKey = firstName;
        }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
```

This code defines an entity class that uses the customer's first name as the row key and last name as the partition key. Together, an entity's partition and row key uniquely identify it in the table. Entities with the same partition key can be queried faster than entities with different partition keys but using diverse partition keys allows for greater scalability of parallel operations. Entities to be stored in tables must be of a supported type, for example derived from the [TableEntity](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.table.tableentity) class. Entity properties you'd like to store in a table must be public properties of the type, and support both getting and setting of values. Also, your entity type must expose a parameter-less constructor.

## Insert or merge an entity

The following code example creates an entity object and adds it to the table. The InsertOrMerge method within the [TableOperation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.table.tableoperation) class is used to insert or merge an entity. The [CloudTable.ExecuteAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.table.cloudtable.executeasync?view=azure-dotnet) method is called to execute the operation. 

Right click on your project **CosmosTableSamples**. Select **Add**, **New Item** and add a class named **SamplesUtils.cs**. This class stores all the code required to perform CRUD operations on the entities. 

```csharp
 public static async Task<CustomerEntity> InsertOrMergeEntityAsync(CloudTable table, CustomerEntity entity)
 {
     if (entity == null)
     {
         throw new ArgumentNullException("entity");
     }
     try
     {
         // Create the InsertOrReplace table operation
         TableOperation insertOrMergeOperation = TableOperation.InsertOrMerge(entity);

         // Execute the operation.
         TableResult result = await table.ExecuteAsync(insertOrMergeOperation);
         CustomerEntity insertedCustomer = result.Result as CustomerEntity;

         // Get the request units consumed by the current operation. RequestCharge of a TableResult is only applied to Azure Cosmos DB
         if (result.RequestCharge.HasValue)
         {
             Console.WriteLine("Request Charge of InsertOrMerge Operation: " + result.RequestCharge);
         }

         return insertedCustomer;
     }
     catch (StorageException e)
     {
         Console.WriteLine(e.Message);
         Console.ReadLine();
         throw;
     }
 }
```

### Get an entity from a partition

You can get entity from a partition by using the Retrieve method under the [TableOperation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.table.tableoperation) class. The following code example gets the partition key row key, email and phone number of a customer entity. This example also prints out the request units consumed to query for the entity. To query for an entity, append the following code to **SamplesUtils.cs** file: 

```csharp
public static async Task<CustomerEntity> RetrieveEntityUsingPointQueryAsync(CloudTable table, string partitionKey, string rowKey)
    {
      try
      {
        TableOperation retrieveOperation = TableOperation.Retrieve<CustomerEntity>(partitionKey, rowKey);
        TableResult result = await table.ExecuteAsync(retrieveOperation);
        CustomerEntity customer = result.Result as CustomerEntity;
        if (customer != null)
        {
          Console.WriteLine("\t{0}\t{1}\t{2}\t{3}", customer.PartitionKey, customer.RowKey, customer.Email, customer.PhoneNumber);
        }

        // Get the request units consumed by the current operation. RequestCharge of a TableResult is only applied to Azure CosmoS DB 
        if (result.RequestCharge.HasValue)
        {
           Console.WriteLine("Request Charge of Retrieve Operation: " + result.RequestCharge);
        }

        return customer;
        }
        catch (StorageException e)
        {
           Console.WriteLine(e.Message);
           Console.ReadLine();
           throw;
        }
    }
```

## Delete an entity

You can easily delete an entity after you have retrieved it by using the same pattern shown for updating an entity. The following code retrieves and deletes a customer entity. To delete an entity, append the following code to **SamplesUtils.cs** file: 

```csharp
public static async Task DeleteEntityAsync(CloudTable table, CustomerEntity deleteEntity)
   {
     try
     {
        if (deleteEntity == null)
     {
        throw new ArgumentNullException("deleteEntity");
     }

    TableOperation deleteOperation = TableOperation.Delete(deleteEntity);
    TableResult result = await table.ExecuteAsync(deleteOperation);

    // Get the request units consumed by the current operation. RequestCharge of a TableResult is only applied to Azure CosmoS DB 
    if (result.RequestCharge.HasValue)
    {
       Console.WriteLine("Request Charge of Delete Operation: " + result.RequestCharge);
    }

    }
    catch (StorageException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
}
```

## Execute the CRUD operations on sample data

After you define the methods to create table, insert or merge entities, run these methods on the sample data. To do so, right click on your project **CosmosTableSamples**. Select **Add**, **New Item** and add a class named **BasicSamples.cs** and add the following code to it. This code creates a table, adds entities to it. If you wish to delete the entity and table at the end of the project remove the comments from `table.DeleteIfExistsAsync()` and `SamplesUtils.DeleteEntityAsync(table, customer)` methods from the following code:

```csharp
using System;
namespace CosmosTableSamples
{
    using System.Threading.Tasks;
    using Microsoft.Azure.Cosmos.Table;
    using Model;

    class BasicSamples
    {
        public async Task RunSamples()
        {
            Console.WriteLine("Azure Cosmos DB Table - Basic Samples\n");
            Console.WriteLine();

            string tableName = "demo" + Guid.NewGuid().ToString().Substring(0, 5);

            // Create or reference an existing table
            CloudTable table = await Common.CreateTableAsync(tableName);

            try
            {
                // Demonstrate basic CRUD functionality 
                await BasicDataOperationsAsync(table);
            }
            finally
            {
                // Delete the table
                // await table.DeleteIfExistsAsync();
            }
        }

        private static async Task BasicDataOperationsAsync(CloudTable table)
        {
            // Create an instance of a customer entity. See the Model\CustomerEntity.cs for a description of the entity.
            CustomerEntity customer = new CustomerEntity("Harp", "Walter")
            {
                Email = "Walter@contoso.com",
                PhoneNumber = "425-555-0101"
            };

            // Demonstrate how to insert the entity
            Console.WriteLine("Insert an Entity.");
            customer = await SamplesUtils.InsertOrMergeEntityAsync(table, customer);

            // Demonstrate how to Update the entity by changing the phone number
            Console.WriteLine("Update an existing Entity using the InsertOrMerge Upsert Operation.");
            customer.PhoneNumber = "425-555-0105";
            await SamplesUtils.InsertOrMergeEntityAsync(table, customer);
            Console.WriteLine();

            // Demonstrate how to Read the updated entity using a point query 
            Console.WriteLine("Reading the updated Entity.");
            customer = await SamplesUtils.RetrieveEntityUsingPointQueryAsync(table, "Harp", "Walter");
            Console.WriteLine();

            // Demonstrate how to Delete an entity
            //Console.WriteLine("Delete the entity. ");
            //await SamplesUtils.DeleteEntityAsync(table, customer);
            //Console.WriteLine();
        }
    }
}
```

The previous code creates a table that starts with “demo” and the generated GUID is appended to the table name. It then adds a customer entity with first and last name as “Harp Walter” and later updates the phone number of this user. 

In this tutorial, you built code to perform basic CRUD operations on the data stored in Table API account. You can also perform advanced operations such as – batch inserting data, query all the data within a partition, query a range of data within a partition, Lists tables in the account whose names begin with the specified prefix. You can download the complete sample form [azure-cosmos-table-dotnet-core-getting-started](https://github.com/Azure-Samples/azure-cosmos-table-dotnet-core-getting-started) GitHub repository. The [AdvancedSamples.cs](https://github.com/Azure-Samples/azure-cosmos-table-dotnet-core-getting-started/blob/master/CosmosTableSamples/AdvancedSamples.cs) class has more operations that you can perform on the data.  

## Run the project

From your project **CosmosTableSamples**. Open the class named **Program.cs** and add the following code to it for calling BasicSamples when the project runs.

```csharp
using System;

namespace CosmosTableSamples
{
    class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Azure Cosmos Table Samples");
            BasicSamples basicSamples = new BasicSamples();
            basicSamples.RunSamples().Wait();
           
            Console.WriteLine();
            Console.WriteLine("Press any key to exit");
            Console.Read();
        }
    }
}
```

Now build the solution and press F5 to run the project. When the project is run, you will see the following output in the command prompt:

![Output from command prompt](./media/tutorial-develop-table-standard/output-from-sample.png)

If you receive an error that says Settings.json file can’t be found when running the project, you can resolve it by adding the following XML entry to the project settings. Right click on CosmosTableSamples, select Edit CosmosTableSamples.csproj and add the following itemGroup: 

```csharp
  <ItemGroup>
    <None Update="Settings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
  </ItemGroup>
```
Now you can sign into the Azure portal and verify that the data exists in the table. 

![Results in portal](./media/tutorial-develop-table-standard/results-in-portal.png)

## Next steps

You can now proceed to the next tutorial and learn how to migrate data to Azure Cosmos DB Table API account. 

> [!div class="nextstepaction"]
>[How to query data](../cosmos-db/table-import.md)
