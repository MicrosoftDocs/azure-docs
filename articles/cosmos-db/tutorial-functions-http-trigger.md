---
title: Query Azure Cosmos DB Graph API by using an Azure Function | Microsoft Docs
description: Learn how to use Azure Functions with HTTP Triggers to query Azure Cosmos DB.
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard

ms.assetid: 
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: mvc
ms.date: 09/08/2017
ms.author: mimig

---

# Query Azure Cosmos DB Graph API by using an Azure Function

Azure Cosmos DB is a globally distributed, multi-model database that is both schemaless and serverless. Azure Function is a serverless compute service that enables you to run code on-demand. Pair up these two Azure services and you have the foundation for a serverless architecture that enables you to focus on building great apps and not worry about provisioning and maintaining servers for your compute and database needs.

This tutorial builds on the code created in the [Graph API Quickstart for .NET](create-graph-dotnet.md) by adding an Azure Function project that contains an HTTP trigger. The Azure Function searches the Azure Cosmos DB database for *all* the people in the database, or a *specific* person in the database. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Create an Azure Function project 
> * Create an HTTP trigger
> * Publish the Azure Function
> * Connect the Azure Function to the Azure Cosmos DB database

## Prerequisites

- [Visual Studio 2017 version 15.3](https://www.visualstudio.com/vs/preview/), including the **Azure development** workload.

    ![Install Visual Studio 2017 with the Azure development workload](./media/tutorial-functions-http-trigger/functions-vs-workloads.png)
    
    >[!NOTE]  
    >After you install or upgrade to Visual Studio 2017 version 15.3, you must manually update the Visual Studio 2017 tools for Azure Functions. You can update the tools from the **Tools** menu under **Extensions and Updates...** > **Updates** > **Visual Studio Marketplace** > **Azure Functions and Web Jobs Tools** > **Update**. 

- Complete the [Build a .NET application using the Graph API](tutorial-develop-graph-dotnet.md) tutorial, or get the example code from the [azure-cosmos-db-graph-dotnet-getting-started](https://github.com/Azure-Samples/azure-cosmos-db-graph-dotnet-getting-started) GitHub repo and build the project.
## Building a Function using Visual Studio

1. Add an **Azure Functions** project to your solution.

   ![Add an Azure Function project to the solution](./media/tutorial-functions-http-trigger/01-add-function-project.png)

2. After you create the Azure Functions project, there are a few NuGet related updates and installs to perform. 

    a. To make sure you have the latest Functions SDK, use the NuGet Manager to update the **Microsoft.NET.Sdk.Functions** package.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/02-update-functions-sdk.png)

    b. Next, install the the **Microsoft.Azure.Graphs** package to get the Graph API .NET Client SDK.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/03-add-azure-graphs.png)

    c. To support local debugging, install the **Mono.CSharp** package.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/04-add-mono.png)

3. Your Solution Explorer should now include the packages you installed, as shown below. 
   
   Next, we'll need to write some code. To do this, add a new **Azure Function** item to the project. This one is named **Search.cs**, because the point of this Azure Function is to provide database searching.  
 
   ![Update Nuget packages](./media/tutorial-functions-http-trigger/05-add-function.png)

4. The Azure Function will respond to HTTP requests, so the Http trigger template is appropriate here. We want this Azure Function to be "wide open," too, so we'll set the **Access rights** to **Anonymous**, which lets everyone through.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/06-http-trigger.png)

5. After you add Search.cs to the Azure Function project, add these **using** statements to the top of the file:

   ```csharp
   using Microsoft.Azure.Documents;
   using Microsoft.Azure.Documents.Client;
   using Microsoft.Azure.Documents.Linq;
   using Microsoft.Azure.Graphs;
   using Microsoft.Azure.WebJobs;
   using Microsoft.Azure.WebJobs.Extensions.Http;
   using Microsoft.Azure.WebJobs.Host;
   using System;
   using System.Collections.Generic;
   using System.Configuration;
   using System.Linq;
   using System.Net;
   using System.Net.Http;
   using System.Threading.Tasks;
   ```

6. Next, replace the Azure Function's class code with the code below. The code will simply search the Cosmos DB database using the Graph API for either all the people, or for the specific person identified via the name querystring parameter.

   ```csharp
   public static class Search
   {
       static string endpoint = ConfigurationManager.AppSettings["Endpoint"];
       static string authKey = ConfigurationManager.AppSettings["AuthKey"];

       [FunctionName("Search")]
       public static async Task<HttpResponseMessage> Run(
           [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequestMessage req,
           TraceWriter log)
       {
           log.Info("C# HTTP trigger function processed a request.");

           // the person objects will be free-form in structure
           List<dynamic> results = new List<dynamic>();

           // open the client's connection
           using (DocumentClient client = new DocumentClient(
               new Uri(endpoint),
               authKey,
               new ConnectionPolicy
               {
                   ConnectionMode = ConnectionMode.Direct,
                   ConnectionProtocol = Protocol.Tcp
               }))
           {
               // get a reference to the database the console app created
               Database database = await client.CreateDatabaseIfNotExistsAsync(
                   new Database
                   {
                       Id = "graphdb"
                   });

               // get an instance of the database's graph
               DocumentCollection graph = await client.CreateDocumentCollectionIfNotExistsAsync(
                   UriFactory.CreateDatabaseUri("graphdb"),
                   new DocumentCollection { Id = "graphcollz" },
                   new RequestOptions { OfferThroughput = 1000 });

               // build a gremlin query based on the existence of a name parameter
               string name = req.GetQueryNameValuePairs()
                   .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
                   .Value;

               IDocumentQuery<dynamic> query = (!String.IsNullOrEmpty(name))
                   ? client.CreateGremlinQuery<dynamic>(graph, string.Format("g.V('{0}')", name))
                   : client.CreateGremlinQuery<dynamic>(graph, "g.V()");

               // iterate over all the results and add them to the list
               while (query.HasMoreResults)
                   foreach (dynamic result in await query.ExecuteNextAsync())
                       results.Add(result);
           }

           // return the list with an OK response
           return req.CreateResponse<List<dynamic>>(HttpStatusCode.OK, results);
       }
   }
   ```

   The code is basically the same connection logic as in the original console application which seeded the database, with a simple query to retrieve the matching records.

## Debug the Azure Function Locally

Now that the code is complete, you can use the Azure Function's local debugging tools and emulator to run the code locally to test it.

1. Before the code will run properly, you must configure it for local execution with your Cosmos DB connection information. You can use the local.settings.json file to configure the Azure Function for local execution much in the same way you would use the App.config file to configure the original console application for execution.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/07-local-functions-settings.png)

2. After you configure the Azure Function app with your Cosmos DB endpoint and authorization key so that it knows how to find your Cosmos DB database, press F5 to launch the local debugging tool, func.exe, with the Azure Function code hosted and ready for use.

   At the end of the initial output from func.exe, we see that Azure Function is being hosted at localhost:7071. This will be helpful to test it in a client.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/08-functions-emulator.png)

3. To test the Azure Function, use [Visual Studio Code](http://code.visualstudio.com/) with Huachao Mao's extension, [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). REST Client offers local or remote HTTP request capability in a single right-click. We'll add the URL of our person search function and execute the HTTP request.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/09-rest-client-in-vs-code.png)

   You are presented with the raw HTTP response from the locally-running Azure Function headers, JSON body content, everything.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/10-general-results.png)

4. By adding the `name` query string parameter with a value known to be in the database, we can filter the results the Azure Function returns.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/11-search-for-ben.png)

After the Azure Function is validated and seems to be working properly, the last step is to publish it to Azure App Service and configure it to run in the cloud.

## Publish the Azure Function

1. Right-click the project, then select **Publish**.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/12-publish-function.png)

2. We're ready to publish this to the cloud to test it in a publicly available scenario. Select the first option, **Azure Function App**, and select **Create New** to create a new Azure Function in your Azure subscription.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/13-publish-panel.png)

   The **Publish** panel opens next, allowing you to name your Azure Function. We'll opt for creating a new Consumption-based App Service Plan because we intend to use the pay-per-use billing method for the serverless Azure Function. 

   In addition, we'll create a new Storage Account to use with the Azure Function in case we ever need support for Blobs, Tables, or Queues to trigger execution of other functionality.

3. Click the **Create** button in the dialog to create all the resources in your Azure subscription. Then, Visual Studio will download a publish profile (a simple XML file) that it will use the next time you publish your Azure Function code.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/14-new-function-app.png)

4. After the Azure Function is published, you can go to the Azure Portal blade for your Azure Function. There, you can see a link to the Azure Function's **Application settings**. You'll need to go here, as this is where you'll configure the live Azure Function for connectivity to the Cosmos DB database with your Person data.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/15-function-in-portal.png)

5. Just as you did earlier in the console application's App.config file and in the Azure Function app's local.settings.json file, you'll need to configure the published Azure Function with the Endpoint and AuthKey values appropriate for your Cosmos DB database. This way, you never have to check in configuration code that contains your keys - you can configure them in the portal and be sure they're not stored in source control.

   ![Update Nuget packages](./media/tutorial-functions-http-trigger/16-app-settings.png)

6. Once the Azure Function is configured properly in your Azure subscription, you can again use the Visual Studio Code REST Client extension to query the publicly-available Azure Function URL.

  ![Update Nuget packages](./media/tutorial-functions-http-trigger/17-calling-function-from-code.png)

## Summary
This article summarizes how to write a basic Azure Function to search a super-small Cosmos DB database using the Graph API, but there's so much more opportunity here. It's a quick-and-dirty introduction to using Cosmos DB and Functions together - it really drives home the flexibility of using a serverless back-end together with a schemaless data storage mechanism. These two tools are powerful when used together, to enable really rapid, fluid evolution of an API that can evolve around the underlying data structure.

I'll definitely be investigating Cosmos DB and Azure Functions together for some upcoming side project ideas on my backlog, and encourage you to take a look at it. The sample code in my fork of the repository - though kind of brute-force still - demonstrates how easy it is to get up and running with a serverless front-end atop a Graph database with worldwide distribution capability.

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Created an Azure Function project 
> * Created an HTTP trigger
> * Published the Azure Function
> * Connected the Function to the Azure Cosmos DB database