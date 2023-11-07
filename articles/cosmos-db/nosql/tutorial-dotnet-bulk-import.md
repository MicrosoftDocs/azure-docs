---
title: Bulk import data to Azure Cosmos DB for NoSQL account by using the .NET SDK
description: Learn how to import or ingest data to Azure Cosmos DB by building a .NET console application that optimizes provisioned throughput (RU/s) required for importing data
author: ealsur
ms.author: maquaran
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: tutorial
ms.date: 03/25/2022
ms.reviewer: mjbrown
ms.devlang: csharp
ms.custom: devx-track-csharp, cosmos-db-video, ignite-2022, devx-track-dotnet
---
# Bulk import data to Azure Cosmos DB for NoSQL account by using the .NET SDK
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This tutorial shows how to build a .NET console application that optimizes provisioned throughput (RU/s) required to import data to Azure Cosmos DB. 

>
> [!VIDEO https://aka.ms/docs.learn-live-dotnet-bulk]

In this article, you'll read data from a sample data source and import it into an Azure Cosmos DB container.
This tutorial uses [Version 3.0+](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) of the Azure Cosmos DB .NET SDK, which can be targeted to .NET Framework or .NET Core.

This tutorial covers:

> [!div class="checklist"]
> * Creating an Azure Cosmos DB account
> * Configuring your project
> * Connecting to an Azure Cosmos DB account with bulk support enabled
> * Perform a data import through concurrent create operations

## Prerequisites

Before following the instructions in this article, make sure that you have the following resources:

* An active Azure account. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

  [!INCLUDE [cosmos-db-emulator-docdb-api](../includes/cosmos-db-emulator-docdb-api.md)]

* [NET Core 3 SDK](https://dotnet.microsoft.com/download/dotnet-core). You can verify which version is available in your environment by running `dotnet --version`.

## Step 1: Create an Azure Cosmos DB account

[Create an Azure Cosmos DB for NoSQL account](quickstart-portal.md) from the Azure portal or you can create the account by using the [Azure Cosmos DB Emulator](../emulator.md).

## Step 2: Set up your .NET project

Open the Windows command prompt or a Terminal window from your local computer. You'll run all the commands in the next sections from the command prompt or terminal. Run the following dotnet new command to create a new app with the name *bulk-import-demo*. 

   ```bash
   dotnet new console -n bulk-import-demo
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

## Step 4: Get your Azure Cosmos DB account credentials

The sample application needs to authenticate to your Azure Cosmos DB account. To authenticate, you should pass the Azure Cosmos DB account credentials to the application. Get your Azure Cosmos DB account credentials by following these steps:

1.    Sign in to the [Azure portal](https://portal.azure.com/).
1.    Navigate to your Azure Cosmos DB account.
1.    Open the **Keys** pane and copy the **URI** and **PRIMARY KEY** of your account.

If you're using the Azure Cosmos DB Emulator, obtain the [emulator credentials from this article](../emulator.md).

## Step 5: Initialize the CosmosClient object with bulk execution support

Open the generated `Program.cs` file in a code editor. You'll create a new instance of CosmosClient with bulk execution enabled and use it to do operations against Azure Cosmos DB. 

Let's start by overwriting the default `Main` method and defining the global variables. These global variables will include the endpoint and authorization keys, the name of the database, container that you'll create, and the number of items that you'll be inserting in bulk. Make sure to replace the endpointURL and authorization key values according to your environment. 


   ```csharp
   using System;
   using System.Collections.Generic;
   using System.Diagnostics;
   using System.IO;
   using System.Text.Json;
   using System.Threading.Tasks;
   using Microsoft.Azure.Cosmos;

   public class Program
   {
        private const string EndpointUrl = "https://<your-account>.documents.azure.com:443/";
        private const string AuthorizationKey = "<your-account-key>";
        private const string DatabaseName = "bulk-tutorial";
        private const string ContainerName = "items";
        private const int AmountToInsert = 300000;

        static async Task Main(string[] args)
        {

        }
   }
   ```

Inside the `Main` method, add the following code to initialize the CosmosClient object:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=CreateClient)]

> [!Note]
> Once bulk execution is specified in the [CosmosClientOptions](/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions), they are effectively immutable for the lifetime of the CosmosClient. Changing the values will have no effect.

After the bulk execution is enabled, the CosmosClient internally groups concurrent operations into single service calls. This way it optimizes the throughput utilization by distributing service calls across partitions, and finally assigning individual results to the original callers.

You can then create a container to store all our items.  Define `/pk` as the partition key, 50000 RU/s as provisioned throughput, and a custom indexing policy that will exclude all fields to optimize the write throughput. Add the following code after the CosmosClient initialization statement:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=Initialize)]

## Step 6: Populate a list of concurrent tasks

To take advantage of the bulk execution support, create a list of asynchronous tasks based on the source of data and the operations you want to perform, and use `Task.WhenAll` to execute them concurrently.
Let's start by using "Bogus" data to generate a list of items from our data model. In a real-world application, the items would come from your desired data source.

First, add the Bogus package to the solution by using the dotnet add package command.

   ```bash
   dotnet add package Bogus
   ```

Define the definition of the items that you want to save. You need to define the `Item` class within the `Program.cs` file:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=Model)]

Next, create a helper function inside the `Program` class. This helper function will get the number of items you defined to insert and generates random data:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=Bogus)]

Use the helper function to initialize a list of documents to work with:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=Operations)]

Next use the list of documents to create concurrent tasks and populate the task list to insert the items into the container. To perform this operation, add the following code to the `Program` class:

[!code-csharp[Main](~/cosmos-dotnet-bulk-import/src/Program.cs?name=ConcurrentTasks)]

All these concurrent point operations will be executed together (that is in bulk) as described in the introduction section.

## Step 7: Run the sample

In order to run the sample, you can do it simply by the `dotnet` command:

   ```bash
   dotnet run
   ```

## Get the complete sample

If you didn't have time to complete the steps in this tutorial, or just want to download the code samples, you can get it from [GitHub](https://github.com/Azure-Samples/cosmos-dotnet-bulk-import-throughput-optimizer).

After cloning the project, make sure to update the desired credentials inside [Program.cs](https://github.com/Azure-Samples/cosmos-dotnet-bulk-import-throughput-optimizer/blob/main/src/Program.cs#L25).

The sample can be run by changing to the repository directory and using `dotnet`:

   ```bash
   cd cosmos-dotnet-bulk-import-throughput-optimizer
   dotnet run
   ```

## Next steps

In this tutorial, you've done the following steps:

> [!div class="checklist"]
> * Creating an Azure Cosmos DB account
> * Configuring your project
> * Connecting to an Azure Cosmos DB account with bulk support enabled
> * Perform a data import through concurrent create operations

You can now proceed to the next tutorial:

> [!div class="nextstepaction"]
>[Query Azure Cosmos DB by using the API for NoSQL](tutorial-query.md)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
