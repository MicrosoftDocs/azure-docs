---
title: Optimize throughput when bulk importing data to Azure Cosmos DB SQL API account 
description: Learn how to set up Azure Cosmos DB global distribution using the SQL API.
author: ealsur
ms.author: maquaran
ms.service: cosmos-db
ms.topic: tutorial
ms.date: 10/23/2019
ms.reviewer: sngun
---
# Optimize throughput when bulk importing data to Azure Cosmos DB SQL API account

This tutorial shows how to build a .NET console application that optimizes provisioned throughput (RU/s) required to import data to Azure Cosmos DB. 

In this article, you will read data from a sample data source and import it into an Azure Cosmos container.

This tutorial uses [Version 3.0+](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) of the Azure Cosmos DB .NET SDK, which can be targeted to .NET Framework or .NET Core.

This tutorial covers:

> [!div class="checklist"]
> * Creating an Azure Cosmos account
> * Configuring your project
> * Connecting to an Azure Cosmos account with bulk support enabled
> * Perform a data import through concurrent create operations

## Prerequisites

Before following the instructions in this article, make sure that you have the following resources:

* An active Azure account. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

  [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

* [NET Core 3 SDK](https://dotnet.microsoft.com/download/dotnet-core). You can verify which version is available in your environment by running `dotnet --version`.

## Step 1: Create an Azure Cosmos DB account

Create an Azure Cosmos DB SQL API account by using the steps described in [this article](create-cosmosdb-resources-portal.md). Optionally, you can [use the Azure Cosmos DB Emulator](local-emulator.md).

## Step 2: Set up your .NET project

Open the Windows command prompt or a Terminal window from your local computer. You will run all the commands in the next sections from the command prompt or terminal. Run the following dotnet new command to create a new app with the name *bulk-import-demo*. The `--langVersion` parameter sets the *LangVersion* property in the created project file.

   ```bash
   dotnet new console –langVersion:8 -n bulk-import-demo
   ```

Change your directory to the newly created app folder. You can build the application with:

   ```bash
   cd bulk-import-demo
   dotnet build
   ```

The expected output from the build should look something like this:

   ```bash
   Restore completed in 100.37 ms for C:\Users\user1\Downloads\CosmosDB_Samples\bulk-import-demo\bulk-import-demo.csproj.
     bulk -> C:\Users\user1\Downloads\CosmosDB_Samples\bulk-import-demo \bin\Debug\netcoreapp2.2\bulk-import-demo.dll

   Build succeeded.
       0 Warning(s)
       0 Error(s)

   Time Elapsed 00:00:34.17
   ```

## Step 3: Add the Azure Cosmos DB package

While still in the application directory, install the Azure Cosmos DB client library for .NET Core by using the dotnet add package command.

   ```bash
   dotnet add package Microsoft.Azure.Cosmos
   ```

## Step 4: Get your Azure Cosmos account credentials

The sample application needs to authenticate to your Azure Cosmos account. To authenticate, you should pass the Azure Cosmos account credentials to the application. Get your Azure Cosmos account credentials by following these steps:

1.	Sign in to the [Azure portal](https://portal.azure.com/).
1.	Navigate to your Azure Cosmos account.
1.	Open the **Keys** pane and copy the **URI** and **PRIMARY KEY** of your account.

If you are using the Azure Cosmos DB Emulator, obtain the [emulator credentials from this article](local-emulator.md#authenticating-requests).

## Step 5: Initialize the CosmosClient object with bulk execution support

Open the generated `Program.cs` file in a code editor. We will create a new instance of CosmosClient with bulk execution enabled and use it to do operations against Azure Cosmos DB. 

Let's start by overwriting the default `Main` method and defining global variables. These global variables will include the endpoint and authorization keys (replace these values with your desired ones), the name of the database and container we will be creating, and the number of items we will be inserting in bulk.


   ```csharp
   public class Program
   {
        private const string EndpointUrl = "https://<your-account>.documents.azure.com:443/";
        private const string AuthorizationKey = "<your-account-key>";
        private const string DatabaseName = "bulk-tutorial";
        private const string ContainerName = "items";
        private const int ItemsToInsert = 300000;

        static async Task Main(string[] args)
        {

        }
   }
   ```

Inside the `Main` method, add the following code to initialize the CosmosClient object:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=CreateClient)]

After the bulk execution is enabled, the CosmosClient internally groups concurrent operations into single service calls. This way it optimizes the throughput utilization by distributing service calls across partitions, and finally assigning individual results to the original callers.

After the bulk execution is enabled, the CosmosClient internally groups concurrent operations into single service calls. This way it optimizes the throughput utilization by distributing service calls across partitions, and finally assigning individual results to the original callers.

We can then create a container to store all our items. We are defining `/pk` as the partition key, 50000 RU/s as provisioned throughput, and a custom indexing policy that will exclude all fields, to optimize write throughput. Add the following code after the CosmosClient initialization statement:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=Initialize)]

## Step 6: Populate a list of concurrent tasks

To take advantage of the bulk execution support, create a list of asynchronous tasks based on the source of data and the operations you want to perform, and use `Task.WhenAll` to execute them concurrently.

Let’s start by using **Bogus** to generate a list of items from our data model.

First, add the Bogus package to the solution by using the dotnet add package command.

   ```bash
   dotnet add package Bogus
   ```

Then, we define the Model of the items we want to save, we can add this class definition inside the same `Program.cs` file:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=Model)]

And create a helper function inside our Program class that will, for the number of items we defined to insert, generate random data:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=Bogus)]

In a real-world application, the items would come from your desired data source.

We then take the items and serialize them into `Stream` instances using `System.Text.Json`. Because of the nature of our data, we receive the information as streams, we can use them directly as long as we know the PartitionKey.

Inside the `Main` method, right after creating the container, add the following code:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=Operations)]

We can also use the Item instance directly, but by using Stream, you can leverage the **performance* of stream APIs in the CosmosClient.

And then use those streams to create concurrent tasks and populate the task list:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=ConcurrentTasks)]

All these concurrent point operations will be executed together/bulk as described in the opening paragraph.

## Step 7: Run the sample

In order to run the sample, you can do it simply by the `dotnet` command:

   ```bash
   dotnet run
   ```

## Get the complete sample

If you didn't have time to complete the steps in this tutorial, or just want to download the code samples, you can get it from [GitHub](https://github.com/Azure-Samples/cosmos-dotnet-bulk-import-throughput-optimizer).

After cloning the project, make sure to update the desired credentials inside [Program.cs](https://github.com/Azure-Samples/cosmos-dotnet-bulk-import-throughput-optimizer/blob/master/src/Program.cs#L25).

The sample can be run by changing to the repository directory and using `dotnet`:

   ```bash
   cd cosmos-dotnet-bulk-import-throughput-optimizer
   dotnet run
   ```

## Next steps

In this tutorial, you've done the following steps:

> [!div class="checklist"]
> * Creating an Azure Cosmos account
> * Configuring your project
> * Connecting to an Azure Cosmos account with bulk support enabled
> * Perform a data import through concurrent create operations

You can now continue with these resources:

* [Partitioning in Azure Cosmos DB](./partitioning-overview.md)
* [Getting started with SQL queries](./how-to-sql-query.md)
* [How to model and partition data on Azure Cosmos DB using a real-world example](./how-to-model-partition-example.md)