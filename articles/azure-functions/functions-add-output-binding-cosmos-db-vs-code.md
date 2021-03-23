---
title: Connect Azure Functions to Azure Cosmos DB using Visual Studio Code 
description: Learn how to connect Azure Functions to an Azure Cosmos DB account by adding an output binding to your Visual Studio Code project. 
author: ThomasWeiss
ms.date: 03/23/2021
ms.topic: quickstart
ms.author: thweiss
zone_pivot_groups: programming-languages-set-functions-temp
---

# Connect Azure Functions to Azure Cosmos DB using Visual Studio Code

[!INCLUDE [functions-add-storage-binding-intro](../../includes/functions-add-storage-binding-intro.md)]

This article shows you how to use Visual Studio Code to connect [Azure Cosmos DB](../cosmos-db/introduction.md) to the function you created in the previous quickstart article. The output binding that you add to this function writes data from the HTTP request to a JSON document stored in an Azure Cosmos DB container. 

::: zone pivot="programming-language-csharp"
Before you begin, you must complete the article, [Quickstart: Create an Azure Functions project from the command line](create-first-function-cli-csharp.md). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.
::: zone-end
::: zone pivot="programming-language-javascript"  
Before you begin, you must complete the article, [Quickstart: Create an Azure Functions project from the command line](create-first-function-cli-node.md). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end   

## Configure your environment

Before you get started, make sure to install the [Azure Databases extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) for Visual Studio Code.

## Create your Azure Cosmos DB account

> [!IMPORTANT]
> [Azure Cosmos DB serverless](../cosmos-db/serverless.md) is now available in preview. This consumption-based mode makes Azure Cosmos DB a strong option for serverless workloads. To use Azure Cosmos DB in serverless mode, choose **Serverless** as the **Capacity mode** when creating your account.

1. In a new browser window, sign in to the [Azure portal](https://portal.azure.com/).

2. Click **Create a resource** > **Databases** > **Azure Cosmos DB**.
   
    :::image type="content" source="../../includes/media/cosmos-db-create-dbaccount/create-nosql-db-databases-json-tutorial-1.png" alt-text="The Azure portal Databases pane" border="true":::

3. In the **Create Azure Cosmos DB Account** page, enter the settings for your new Azure Cosmos DB account. 
 
    Setting|Value|Description
    ---|---|---
    Subscription|*Your subscription*|Choose the Azure subscription where you created your Function App in the [previous article](./create-first-function-vs-code-csharp.md).
    Resource Group|*Your resource group*|Choose the resource group where you created your Function App in the [previous article](./create-first-function-vs-code-csharp.md).
    Account Name|*Enter a unique name*|Enter a unique name to identify your Azure Cosmos DB account.<br><br>The account name can use only lowercase letters, numbers, and hyphens (-), and must be between 3 and 31 characters long.
    API|Core (SQL)|Select **Core (SQL)** to create a document database that you can query by using a SQL syntax. [Learn more about the Azure Cosmos DB SQL API](../cosmos-db/introduction.md).|
    Location|*Select the region closest to your location*|Select a geographic location to host your Azure Cosmos DB account. Use the location that's closest to you or your users to get the fastest access to your data.
    Capacity mode|Serverless or Provisioned throughput|Select **Serverless** to create an account in [serverless](../cosmos-db/serverless.md) mode. Select **Provisioned throughput** to create an account in [provisioned throughput](../cosmos-db/set-throughput.md) mode.<br><br>Choose **Serverless** if you're getting started with Azure Cosmos DB.

4. Click **Review + create**. You can skip the **Network** and **Tags** section. 

5. Review the summary information and click **Create**. 

6. Wait for your new Azure Cosmos DB to be created, then select **Go to resource**.

    :::image type="content" source="../cosmos-db/media/create-cosmosdb-resources-portal/azure-cosmos-db-account-deployment-successful.png" alt-text="The creation of the Azure Cosmos DB account is complete" border="true":::

## Create an Azure Cosmos DB database and container

From your Azure Cosmos DB account, select **Data Explorer**, then **New Container**. Create a new database named *my-database*, a new container named *my-container* and choose `/id` as the [partition key](../cosmos-db/partitioning-overview.md).

:::image type="content" source="./media/functions-add-output-binding-cosmos-db-vs-code/create-container.png" alt-text="Creating a new Azure Cosmos DB container from the Azure portal" border="true":::

## Update your function app settings

In the [previous quickstart article](./create-first-function-vs-code-csharp.md), you created a function app in Azure. In this article, you update your Function App to write JSON documents in the Azure Cosmos DB container you've created above. To connect to your Azure Cosmos DB account, you must add its connection string to your app settings. You then download the new setting to your local.settings.json file so you can connect to your Azure Cosmos DB account when running locally.

1. In Visual Studio Code, locate the Azure Cosmos DB account you have just created. Right-click on its name, and select **Copy Connection String**.

    :::image type="content" source="./media/functions-add-output-binding-cosmos-db-vs-code/copy-connection-string.png" alt-text="Copying the Azure Cosmos DB connection string" border="true":::

1. Press <kbd>F1</kbd> to open the command palette, then search for and run the command `Azure Functions: Add New Setting...`.

1. Choose the function app you created in the previous article. Provide the following information at the prompts:

    + **Enter new app setting name**: Type `CosmosDbConnectionString`.

    + **Enter value for "CosmosDbConnectionString"**: Paste the connection string of your Azure Cosmos DB account, as copied earlier.

1. Press <kbd>F1</kbd> again to open the command palette, then search for and run the command `Azure Functions: Download Remote Settings...`. 

1. Choose the function app you created in the previous article. Select **Yes to all** to overwrite the existing local settings. 

## Register binding extensions

Because you're using an Azure Cosmos DB output binding, you must have the corresponding bindings extension installed before you run the project. 

::: zone pivot="programming-language-csharp"

With the exception of HTTP and timer triggers, bindings are implemented as extension packages. Run the following [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the Terminal window to add the Storage extension package to your project.

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.CosmosDB
```

::: zone-end

::: zone pivot="programming-language-javascript"

Your project has been configured to use [extension bundles](functions-bindings-register.md#extension-bundles), which automatically installs a predefined set of extension packages. 

Extension bundles usage is enabled in the host.json file at the root of the project, which appears as follows:

:::code language="json" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/host.json":::

::: zone-end

Now, you can add the Azure Cosmos DB output binding to your project.

## Add an output binding

In Functions, each type of binding requires a `direction`, `type`, and a unique `name` to be defined in the function.json file. The way you define these attributes depends on the language of your function app.

::: zone pivot="programming-language-csharp"

In a C# class library project, the bindings are defined as binding attributes on the function method. The *function.json* file required by Functions is then auto-generated based on these attributes.

Open the *HttpExample.cs* project file and add the following parameter to the `Run` method definition:

```csharp
[CosmosDB(
    databaseName: "my-database",
    collectionName: "my-container",
    ConnectionStringSetting = "CosmosDbConnectionString")]IAsyncCollector<dynamic> documentsOut,
```

The `documentsOut` parameter is an IAsyncCollector<T> type, which represents a collection of JSON documents that will be written to your Azure Cosmos DB container when the function completes. Specific attributes specifies the name of the container and the name of its parent database. The connection string for your Azure Cosmos DB account is set by the `ConnectionStringSettingAttribute`.

The Run method definition should now look like the following:  

```csharp
[FunctionName("HttpExample")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
    [CosmosDB(
        databaseName: "my-database",
        collectionName: "my-container",
        ConnectionStringSetting = "CosmosDbConnectionString")]IAsyncCollector<dynamic> documentsOut,
    ILogger log)
```

::: zone-end

::: zone pivot="programming-language-javascript"

Binding attributes are defined directly in the function.json file. Depending on the binding type, additional properties may be required. The [Azure Cosmos DB output configuration](./functions-bindings-cosmosdb-v2-output.md#configuration) describes the fields required for an Azure Cosmos DB output binding. The extension makes it easy to add bindings to the function.json file. 

To create a binding, right-click (Ctrl+click on macOS) the `function.json` file in your HttpTrigger folder and choose **Add binding...**. Follow the prompts to define the following binding properties for the new binding:

| Prompt | Value | Description |
| -------- | ----- | ----------- |
| **Select binding direction** | `out` | The binding is an output binding. |
| **Select binding with direction "out"** | `Azure Cosmos DB` | The binding is an Azure Cosmos DB binding. |
| **The name used to identify this binding in your code** | `outputDocument` | Name that identifies the binding parameter referenced in your code. |
| **The Cosmos DB database where data will be written** | `my-database` | The name of the Azure Cosmos DB database containing the target container. |
| **Database collection where data will be written** | `my-container` | The name of the Azure Cosmos DB container where the JSON documents will be written. |
| **If true, creates the Cosmos DB database and collection** | `false` | The target database and container already exist. |
| **Select setting from "local.setting.json"** | `CosmosDbConnectionString` | The name of an application setting that contains the connection string for the Azure Cosmos DB account. |
| **Partition key (optional)** | *leave blank* | Only required when the output binding creates the container. |
| **Collection throughput (optional)** | *leave blank* | Only required when the output binding creates the container. |

A binding is added to the `bindings` array in your function.json, which should look like the following:

```json
{
    "type": "cosmosDB",
    "direction": "out",
    "name": "outputDocument",
    "databaseName": "my-database",
    "collectionName": "my-container",
    "createIfNotExists": "false",
    "connectionStringSetting": "CosmosDbConnectionString"
}
```

::: zone-end

## Add code that uses the output binding

::: zone pivot="programming-language-csharp"  

Add code that uses the `documentsOut` output binding object to create a JSON document. Add this code before the method returns.

```csharp
if (!string.IsNullOrEmpty(name))
{
    // Add a JSON document to the output container.
    await documentsOut.AddAsync(new
    {
        // create a random ID
        id = System.Guid.NewGuid().ToString(),
        name = name
    });
}
```

At this point, your function should look as follows:

```csharp
[FunctionName("HttpExample")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
    [CosmosDB(
        databaseName: "my-database",
        collectionName: "my-container",
        ConnectionStringSetting = "CosmosDbConnectionString")]IAsyncCollector<dynamic> documentsOut,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;

    if (!string.IsNullOrEmpty(name))
    {
        // Add a JSON document to the output container.
        await documentsOut.AddAsync(new
        {
            // create a random ID
            id = System.Guid.NewGuid().ToString(),
            name = name
        });
    }

    string responseMessage = string.IsNullOrEmpty(name)
        ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
        : $"Hello, {name}. This HTTP triggered function executed successfully.";

    return new OkObjectResult(responseMessage);
}
```

::: zone-end

::: zone pivot="programming-language-javascript"  

Add code that uses the `outputDocument` output binding object on `context.bindings` to create a JSON document. Add this code before the `context.res` statement.

```javascript
if (name) {
    context.bindings.outputDocument = JSON.stringify({
        // create a random ID
        id: new Date().toISOString() + Math.random().toString().substr(2,8),
        name: name
    });
}
```

At this point, your function should look as follows:

```javascript
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    if (name) {
        context.bindings.outputDocument = JSON.stringify({
            // create a random ID
            id: new Date().toISOString() + Math.random().toString().substr(2,8),
            name: name
        });
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}
```

::: zone-end  

## Run the function locally

1. As in the previous article, press <kbd>F5</kbd> to start the function app project and Core Tools. 

1. With Core Tools running, go to the **Azure: Functions** area. Under **Functions**, expand **Local Project** > **Functions**. Right-click (Ctrl-click on Mac) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="../../includes/media/functions-run-function-test-local-vs-code/execute-function-now.png" alt-text="Execute function now from Visual Studio Code":::

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press Enter to send this request message to your function.  
 
1. After a response is returned, press <kbd>Ctrl + C</kbd> to stop Core Tools.

### Verify that a JSON document has been created

1. On the Azure portal, go back to your Azure Cosmos DB account and select **Data Explorer**.

1. Expand your database and container, and select **Items** to list the documents created in your container.

1. Verify that a new JSON document has been created by the output binding.

    :::image type="content" source="./media/functions-add-output-binding-cosmos-db-vs-code/verify-output.png" alt-text="Verifying that a new document has been created in the Azure Cosmos DB container" border="true":::

## Redeploy and verify the updated app

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Deploy to function app...`.

1. Choose the function app that you created in the first article. Because you're redeploying your project to the same app, select **Deploy** to dismiss the warning about overwriting files.

1. After deployment completes, you can again use the **Execute Function Now...** feature to trigger the function in Azure.

1. Again [check the documents created in your Azure Cosmos DB container](#verify-that-a-json-document-has-been-created) to verify that the output binding again generates a new JSON document.

## Clean up resources

In Azure, *resources* refer to function apps, functions, storage accounts, and so forth. They're grouped into *resource groups*, and you can delete everything in a group by deleting the group.

You created resources to complete these quickstarts. You may be billed for these resources, depending on your [account status](https://azure.microsoft.com/account/) and [service pricing](https://azure.microsoft.com/pricing/). If you don't need the resources anymore, here's how to delete them:

[!INCLUDE [functions-cleanup-resources-vs-code-inner.md](../../includes/functions-cleanup-resources-vs-code-inner.md)]

## Next steps

You've updated your HTTP triggered function to write JSON documents to an Azure Cosmos DB container. Now you can learn more about developing Functions using Visual Studio Code:

+ [Develop Azure Functions using Visual Studio Code](functions-develop-vs-code.md)

+ [Azure Functions triggers and bindings](functions-triggers-bindings.md).
::: zone pivot="programming-language-csharp"  
+ [Examples of complete Function projects in C#](/samples/browse/?products=azure-functions&languages=csharp).

+ [Azure Functions C# developer reference](functions-dotnet-class-library.md)  
::: zone-end 
::: zone pivot="programming-language-javascript"  
+ [Examples of complete Function projects in JavaScript](/samples/browse/?products=azure-functions&languages=javascript).

+ [Azure Functions JavaScript developer guide](functions-reference-node.md)  
::: zone-end  