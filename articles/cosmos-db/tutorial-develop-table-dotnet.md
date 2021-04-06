---
title: Azure Cosmos DB Table API using .NET Standard SDK
description: Learn how to store and query the structured data in Azure Cosmos DB Table API account
author: sakash279
ms.author: akshanka
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.devlang: dotnet
ms.topic: tutorial
ms.date: 12/03/2019
ms.custom: devx-track-csharp
---
# Get started with Azure Cosmos DB Table API and Azure Table storage using the .NET SDK
[!INCLUDE[appliesto-table-api](includes/appliesto-table-api.md)]

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

   :::image type="content" source="./media/create-table-dotnet/connection-string.png" alt-text="View and copy the PRIMARY CONNECTION STRING in the Connection String pane":::
   
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

  :::code language="csharp" source="~/azure-cosmosdb-dotnet-table/CosmosTableSamples/AppSettings.cs":::

## Parse and validate the connection details

1. Right click on your project **CosmosTableSamples**. Select **Add**, **New Item** and add a class named **Common.cs**. You will write code to validate the connection details and create a table within this class.

1. Define a method `CreateStorageAccountFromConnectionString` as shown below. This method will parse the connection string details and validate that the account name and account key details provided in the "Settings.json" file are valid.

   :::code language="csharp" source="~/azure-cosmosdb-dotnet-table/CosmosTableSamples/Common.cs" id="createStorageAccount":::

## Create a Table 

The [CloudTableClient](/dotnet/api/microsoft.azure.cosmos.table.cloudtableclient) class enables you to retrieve tables and entities stored in Table storage. Because we don’t have any tables in the Cosmos DB Table API account, let’s add the `CreateTableAsync` method to the **Common.cs** class to create a table:

:::code language="csharp" source="~/azure-cosmosdb-dotnet-table/CosmosTableSamples/Common.cs" id="CreateTable":::

If you get a "503 service unavailable exception" error, it's possible that the required ports for the connectivity mode are blocked by a firewall. To fix this issue, either open the required ports or use the gateway mode connectivity as shown in the following code:

```csharp
tableClient.TableClientConfiguration.UseRestExecutorForCosmosEndpoint = true;
```

## Define the entity 

Entities map to C# objects by using a custom class derived from [TableEntity](/dotnet/api/microsoft.azure.cosmos.table.tableentity). To add an entity to a table, create a class that defines the properties of your entity.

Right click on your project **CosmosTableSamples**. Select **Add**, **New Folder** and name it as **Model**. Within the Model folder add a class named **CustomerEntity.cs** and add the following code to it.

:::code language="csharp" source="~/azure-cosmosdb-dotnet-table/CosmosTableSamples/Model/CustomerEntity.cs":::

This code defines an entity class that uses the customer's first name as the row key and last name as the partition key. Together, an entity's partition and row key uniquely identify it in the table. Entities with the same partition key can be queried faster than entities with different partition keys but using diverse partition keys allows for greater scalability of parallel operations. Entities to be stored in tables must be of a supported type, for example derived from the [TableEntity](/dotnet/api/microsoft.azure.cosmos.table.tableentity) class. Entity properties you'd like to store in a table must be public properties of the type, and support both getting and setting of values. Also, your entity type must expose a parameter-less constructor.

## Insert or merge an entity

The following code example creates an entity object and adds it to the table. The InsertOrMerge method within the [TableOperation](/dotnet/api/microsoft.azure.cosmos.table.tableoperation) class is used to insert or merge an entity. The [CloudTable.ExecuteAsync](/dotnet/api/microsoft.azure.cosmos.table.cloudtable.executeasync) method is called to execute the operation. 

Right click on your project **CosmosTableSamples**. Select **Add**, **New Item** and add a class named **SamplesUtils.cs**. This class stores all the code required to perform CRUD operations on the entities. 

:::code language="csharp" source="~/azure-cosmosdb-dotnet-table/CosmosTableSamples/SamplesUtils.cs" id="InsertItem":::

## Get an entity from a partition

You can get entity from a partition by using the Retrieve method under the [TableOperation](/dotnet/api/microsoft.azure.cosmos.table.tableoperation) class. The following code example gets the partition key row key, email and phone number of a customer entity. This example also prints out the request units consumed to query for the entity. To query for an entity, append the following code to **SamplesUtils.cs** file:

:::code language="csharp" source="~/azure-cosmosdb-dotnet-table/CosmosTableSamples/SamplesUtils.cs" id="QueryData":::

## Delete an entity

You can easily delete an entity after you have retrieved it by using the same pattern shown for updating an entity. The following code retrieves and deletes a customer entity. To delete an entity, append the following code to **SamplesUtils.cs** file: 

:::code language="csharp" source="~/azure-cosmosdb-dotnet-table/CosmosTableSamples/SamplesUtils.cs" id="DeleteItem":::

## Execute the CRUD operations on sample data

After you define the methods to create table, insert or merge entities, run these methods on the sample data. To do so, right click on your project **CosmosTableSamples**. Select **Add**, **New Item** and add a class named **BasicSamples.cs** and add the following code to it. This code creates a table, adds entities to it.

If don't want to delete the entity and table at the end of the project, comment the `await table.DeleteIfExistsAsync()` and `SamplesUtils.DeleteEntityAsync(table, customer)` methods from the following code. It's best to comment out these methods and validate the data before you delete the table.

:::code language="csharp" source="~/azure-cosmosdb-dotnet-table/CosmosTableSamples/BasicSamples.cs":::

The previous code creates a table that starts with “demo” and the generated GUID is appended to the table name. It then adds a customer entity with first and last name as “Harp Walter” and later updates the phone number of this user. 

In this tutorial, you built code to perform basic CRUD operations on the data stored in Table API account. You can also perform advanced operations such as – batch inserting data, query all the data within a partition, query a range of data within a partition, Lists tables in the account whose names begin with the specified prefix. You can download the complete sample form [azure-cosmos-table-dotnet-core-getting-started](https://github.com/Azure-Samples/azure-cosmos-table-dotnet-core-getting-started) GitHub repository. The [AdvancedSamples.cs](https://github.com/Azure-Samples/azure-cosmos-table-dotnet-core-getting-started/blob/main/CosmosTableSamples/AdvancedSamples.cs) class has more operations that you can perform on the data.  

## Run the project

From your project **CosmosTableSamples**. Open the class named **Program.cs** and add the following code to it for calling BasicSamples when the project runs.

:::code language="csharp" source="~/azure-cosmosdb-dotnet-table/CosmosTableSamples/Program.cs":::

Now build the solution and press F5 to run the project. When the project is run, you will see the following output in the command prompt:

:::image type="content" source="./media/tutorial-develop-table-standard/output-from-sample.png" alt-text="Output from command prompt":::

If you receive an error that says Settings.json file can’t be found when running the project, you can resolve it by adding the following XML entry to the project settings. Right click on CosmosTableSamples, select Edit CosmosTableSamples.csproj and add the following itemGroup: 

```csharp
  <ItemGroup>
    <None Update="Settings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
  </ItemGroup>
```
Now you can sign into the Azure portal and verify that the data exists in the table. 

:::image type="content" source="./media/tutorial-develop-table-standard/results-in-portal.png" alt-text="Results in portal":::

## Next steps

You can now proceed to the next tutorial and learn how to migrate data to Azure Cosmos DB Table API account. 

> [!div class="nextstepaction"]
>[Migrate data to Azure Cosmos DB Table API](../cosmos-db/table-import.md)
