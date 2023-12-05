---
title: Connect Azure Functions to Azure Cosmos DB using Visual Studio Code
description: Learn how to connect Azure Functions to an Azure Cosmos DB account by adding an output binding to your Visual Studio Code project.
ms.date: 02/09/2023
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions-temp
ms.devlang: csharp, javascript, python
ms.custom: mode-ui, vscode-azure-extension-update-completed, ignite-2022, devx-track-extended-java, devx-track-js, devx-track-python
---

# Connect Azure Functions to Azure Cosmos DB using Visual Studio Code

[!INCLUDE [functions-add-storage-binding-intro](../../includes/functions-add-storage-binding-intro.md)]

This article shows you how to use Visual Studio Code to connect [Azure Cosmos DB](../cosmos-db/introduction.md) to the function you created in the previous quickstart article. The output binding that you add to this function writes data from the HTTP request to a JSON document stored in an Azure Cosmos DB container. 

::: zone pivot="programming-language-csharp"
Before you begin, you must complete the [quickstart: Create a C# function in Azure using Visual Studio Code](create-first-function-vs-code-csharp.md). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.
::: zone-end
::: zone pivot="programming-language-javascript"  
Before you begin, you must complete the [quickstart: Create a JavaScript function in Azure using Visual Studio Code](create-first-function-vs-code-node.md). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end
::: zone pivot="programming-language-python"  
Before you begin, you must complete the [quickstart: Create a Python function in Azure using Visual Studio Code](create-first-function-vs-code-python.md). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end

## Configure your environment

Before you get started, make sure to install the [Azure Databases extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb) for Visual Studio Code.

## Create your Azure Cosmos DB account

> [!IMPORTANT]
> [Azure Cosmos DB serverless](../cosmos-db/serverless.md) is now generally available. This consumption-based mode makes Azure Cosmos DB a strong option for serverless workloads. To use Azure Cosmos DB in serverless mode, choose **Serverless** as the **Capacity mode** when creating your account.

1. In Visual Studio Code, select **View** > **Command Palette...** then in the command palette search for `Azure Databases: Create Server...`

1. Provide the following information at the prompts:

    |Prompt| Selection|
    |--|--|
    |**Select an Azure Database Server**| Choose **Core (SQL)** to create a document database that you can query by using a SQL syntax. [Learn more about the Azure Cosmos DB](../cosmos-db/introduction.md). |
    |**Account name**| Enter a unique name to identify your Azure Cosmos DB account. The account name can use only lowercase letters, numbers, and hyphens (-), and must be between 3 and 31 characters long.|
    |**Select a capacity model**| Select **Serverless** to create an account in [serverless](../cosmos-db/serverless.md) mode. 
    |**Select a resource group for new resources**| Choose the resource group where you created your function app in the [previous article](./create-first-function-vs-code-csharp.md). |
    |**Select a location for new resources**| Select a geographic location to host your Azure Cosmos DB account. Use the location that's closest to you or your users to get the fastest access to your data. |

    After your new account is provisioned, a message is displayed in notification area. 

## Create an Azure Cosmos DB database and container

1. Select the Azure icon in the Activity bar, expand **Resources** > **Azure Cosmos DB**, right-click (Ctrl+select on macOS) your account, and select **Create database...**.

1. Provide the following information at the prompts:

    |Prompt| Selection|
    |--|--|
    |**Database name** | Type `my-database`.|
    |**Enter and ID for your collection**| Type `my-container`. |
    |**Enter the partition key for the collection**|Type `/id` as the [partition key](../cosmos-db/partitioning-overview.md).|

1. Select **OK** to create the container and database. 

## Update your function app settings

In the [previous quickstart article](./create-first-function-vs-code-csharp.md), you created a function app in Azure. In this article, you update your app to write JSON documents to the Azure Cosmos DB container you've created. To connect to your Azure Cosmos DB account, you must add its connection string to your app settings. You then download the new setting to your local.settings.json file so you can connect to your Azure Cosmos DB account when running locally.

1. In Visual Studio Code, right-click (Ctrl+select on macOS) on your new Azure Cosmos DB account, and select **Copy Connection String**.

    :::image type="content" source="./media/functions-add-output-binding-cosmos-db-vs-code/copy-connection-string.png" alt-text="Copying the Azure Cosmos DB connection string" border="true":::

1. Press <kbd>F1</kbd> to open the command palette, then search for and run the command `Azure Functions: Add New Setting...`.

1. Choose the function app you created in the previous article. Provide the following information at the prompts:

    |Prompt| Selection|
    |--|--|
    |**Enter new app setting name**| Type `CosmosDbConnectionString`.|
    |**Enter value for "CosmosDbConnectionString"**| Paste the connection string of your Azure Cosmos DB account you copied.|

    This creates an application setting named connection `CosmosDbConnectionString` in your function app in Azure. Now, you can download this setting to your local.settings.json file.

1. Press <kbd>F1</kbd> again to open the command palette, then search for and run the command `Azure Functions: Download Remote Settings...`. 

1. Choose the function app you created in the previous article. Select **Yes to all** to overwrite the existing local settings. 

This downloads all of the setting from Azure to your local project, including the new connection string setting. Most of the downloaded settings aren't used when running locally. 

## Register binding extensions

Because you're using an Azure Cosmos DB output binding, you must have the corresponding bindings extension installed before you run the project. 

::: zone pivot="programming-language-csharp"

Except for HTTP and timer triggers, bindings are implemented as extension packages. Run the following [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the Terminal window to add the Azure Cosmos DB extension package to your project.

# [Isolated worker model](#tab/isolated-process)
```command
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.CosmosDB --version 3.0.9
```
# [In-process model](#tab/in-process)
```command
dotnet add package Microsoft.Azure.WebJobs.Extensions.CosmosDB --version 3.0.10
```
---
::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python"

Your project has been configured to use [extension bundles](functions-bindings-register.md#extension-bundles), which automatically installs a predefined set of extension packages. 

Extension bundles usage is enabled in the *host.json* file at the root of the project, which appears as follows:

:::code language="json" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/host.json":::

::: zone-end

Now, you can add the Azure Cosmos DB output binding to your project.

## Add an output binding
::: zone pivot="programming-language-csharp"
In a C# class library project, the bindings are defined as binding attributes on the function method. 

# [Isolated worker model](#tab/isolated-process)

Open the *HttpExample.cs* project file and add the following classes:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-cosmos-db-isolated/HttpExample.cs" range="36-46":::

The `MyDocument` class defines an object that gets written to the database. The connection string for the Storage account is set by the `Connection` property. In this case, you could omit `Connection` because you're already using the default storage account.

The `MultiResponse` class allows you to both write to the specified collection in the Azure Cosmos DB and return an HTTP success message. Because you need to return a `MultiResponse` object, you need to also update the method signature.

# [In-process model](#tab/in-process)
Open the *HttpExample.cs* project file and add the following parameter to the `Run` method definition:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-cosmos-db/HttpExample.cs" range="18-20":::

The `documentsOut` parameter is an `IAsyncCollector<T>` type, which represents a collection of JSON documents that are written to your Azure Cosmos DB container when the function completes. Specific attributes indicate the names of the container and its parent database. The connection string for your Azure Cosmos DB account is set by the `ConnectionStringSettingAttribute`.

---

Specific attributes specify the name of the container and the name of its parent database. The connection string for your Azure Cosmos DB account is set by the `CosmosDbConnectionString`.

::: zone-end

::: zone pivot="programming-language-javascript"

Binding attributes are defined directly in the *function.json* file. Depending on the binding type, other properties may be required. The [Azure Cosmos DB output configuration](./functions-bindings-cosmosdb-v2-output.md#configuration) describes the fields required for an Azure Cosmos DB output binding. The extension makes it easy to add bindings to the *function.json* file. 

To create a binding, right-click (Ctrl+select on macOS) the *function.json* file in your HttpTrigger folder and choose **Add binding...**. Follow the prompts to define the following binding properties for the new binding:

| Prompt | Value | Description |
| -------- | ----- | ----------- |
| **Select binding direction** | `out` | The binding is an output binding. |
| **Select binding with direction "out"** | `Azure Cosmos DB` | The binding is an Azure Cosmos DB binding. |
| **The name used to identify this binding in your code** | `outputDocument` | Name that identifies the binding parameter referenced in your code. |
| **The Azure Cosmos DB database where data will be written** | `my-database` | The name of the Azure Cosmos DB database containing the target container. |
| **Database collection where data will be written** | `my-container` | The name of the Azure Cosmos DB container where the JSON documents will be written. |
| **If true, creates the Azure Cosmos DB database and collection** | `false` | The target database and container already exist. |
| **Select setting from "local.setting.json"** | `CosmosDbConnectionString` | The name of an application setting that contains the connection string for the Azure Cosmos DB account. |
| **Partition key (optional)** | *leave blank* | Only required when the output binding creates the container. |
| **Collection throughput (optional)** | *leave blank* | Only required when the output binding creates the container. |

A binding is added to the `bindings` array in your *function.json*, which should look like the following after removing any `undefined` values present

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

::: zone pivot="programming-language-python"

The way that you define the new binding depends on your Python programming model.

# [v1](#tab/v1)

Binding attributes are defined directly in the *function.json* file. Depending on the binding type, other properties may be required. The [Azure Cosmos DB output configuration](./functions-bindings-cosmosdb-v2-output.md#configuration) describes the fields required for an Azure Cosmos DB output binding. The extension makes it easy to add bindings to the *function.json* file. 

To create a binding, right-select (Ctrl+select on macOS) the *function.json* file in your HttpTrigger folder and choose **Add binding...**. Follow the prompts to define the following binding properties for the new binding:

| Prompt | Value | Description |
| -------- | ----- | ----------- |
| **Select binding direction** | `out` | The binding is an output binding. |
| **Select binding with direction "out"** | `Azure Cosmos DB` | The binding is an Azure Cosmos DB binding. |
| **The name used to identify this binding in your code** | `outputDocument` | Name that identifies the binding parameter referenced in your code. |
| **The Azure Cosmos DB database where data will be written** | `my-database` | The name of the Azure Cosmos DB database containing the target container. |
| **Database collection where data will be written** | `my-container` | The name of the Azure Cosmos DB container where the JSON documents will be written. |
| **If true, creates the Azure Cosmos DB database and collection** | `false` | The target database and container already exist. |
| **Select setting from "local.setting.json"** | `CosmosDbConnectionString` | The name of an application setting that contains the connection string for the Azure Cosmos DB account. |
| **Partition key (optional)** | *leave blank* | Only required when the output binding creates the container. |
| **Collection throughput (optional)** | *leave blank* | Only required when the output binding creates the container. |

A binding is added to the `bindings` array in your *function.json*, which should look like the following after removing any `undefined` values present

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

# [v2](#tab/v2)

Binding attributes are defined directly in the *function_app.py* file. You use the `cosmos_db_output` decorator to add an [Azure Cosmos DB output binding](./functions-bindings-triggers-python.md#azure-cosmos-db-output-binding):

```python
@app.cosmos_db_output(arg_name="outputDocument", database_name="my-database", 
    collection_name="my-container", connection_string_setting="CosmosDbConnectionString")
```

In this code, `arg_name` identifies the binding parameter referenced in your code, `database_name` and `collection_name` are the database and collection names that the binding writes to, and `connection_string_setting` is the name of an application setting that contains the connection string for the Storage account, which is in the CosmosDbConnectionString setting in the *local.settings.json* file.

---

::: zone-end

## Add code that uses the output binding

::: zone pivot="programming-language-csharp"  

# [Isolated worker model](#tab/isolated-process)

Replace the existing Run method with the following code:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-cosmos-db-isolated/HttpExample.cs" range="11-34":::

# [In-process model](#tab/in-process)

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

---

::: zone-end

::: zone pivot="programming-language-javascript"  

Add code that uses the `outputDocument` output binding object on `context.bindings` to create a JSON document. Add this code before the `context.res` statement.

```javascript
if (name) {
    context.bindings.outputDocument = JSON.stringify({
        // create a random ID
        id: new Date().toISOString() + Math.random().toString().substring(2, 10),
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
            id: new Date().toISOString() + Math.random().toString().substring(2, 10),
            name: name
        });
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}
```

This code now returns a `MultiResponse` object that contains both a document and an HTTP response.

::: zone-end  

::: zone pivot="programming-language-python"

# [v1](#tab/v1)

Update *HttpExample\\\_\_init\_\_.py* to match the following code. Add the `outputDocument` parameter to the function definition and `outputDocument.set()` under the `if name:` statement:

```python
import azure.functions as func
import logging

def main(req: func.HttpRequest, msg: func.Out[func.QueueMessage],
    outputDocument: func.Out[func.Document]) -> str:

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        outputDocument.set(func.Document.from_dict({"id": name}))
        msg.set(name)
        return func.HttpResponse(f"Hello {name}!")
    else:
        return func.HttpResponse(
            "Please pass a name on the query string or in the request body",
            status_code=400
        )
```

The document `{"id": "name"}` is created in the database collection specified in the binding.

# [v2](#tab/v2)

Update *HttpExample\\function_app.py* to match the following code. Add the `outputDocument` parameter to the function definition and `outputDocument.set()` under the `if name:` statement:

```python
import azure.functions as func
import logging

app = func.FunctionApp()

@app.function_name(name="HttpTrigger1")
@app.route(route="hello", auth_level=func.AuthLevel.ANONYMOUS)
@app.queue_output(arg_name="msg", queue_name="outqueue", connection="AzureWebJobsStorage")
@app.cosmos_db_output(arg_name="outputDocument", database_name="my-database", collection_name="my-container", connection_string_setting="CosmosDbConnectionString")
def test_function(req: func.HttpRequest, msg: func.Out[func.QueueMessage],
    outputDocument: func.Out[func.Document]) -> func.HttpResponse:
     logging.info('Python HTTP trigger function processed a request.')
     logging.info('Python Cosmos DB trigger function processed a request.')
     name = req.params.get('name')
     if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

     if name:
        outputDocument.set(func.Document.from_dict({"id": name}))
        msg.set(name)
        return func.HttpResponse(f"Hello {name}!")
     else:
        return func.HttpResponse(
                    "Please pass a name on the query string or in the request body",
                    status_code=400
                )
```

The document `{"id": "name"}` is created in the database collection specified in the binding.

---

::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [functions-run-function-test-local-vs-code-csharp](../../includes/functions-run-function-test-local-vs-code-csharp.md)]
::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python"
## Run the function locally

1. As in the previous article, press <kbd>F5</kbd> to start the function app project and Core Tools. 

1. With Core Tools running, go to the **Azure: Functions** area. Under **Functions**, expand **Local Project** > **Functions**. Right-click (Ctrl-click on Mac) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="../../includes/media/functions-run-function-test-local-vs-code/execute-function-now.png" alt-text="Execute function now from Visual Studio Code":::

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press Enter to send this request message to your function.  
 
1. After a response is returned, press <kbd>Ctrl + C</kbd> to stop Core Tools.
::: zone-end

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

+ [Azure Functions JavaScript developer guide](functions-reference-node.md?tabs=javascript)  
::: zone-end  
::: zone pivot="programming-language-python"
+ [Examples of complete Function projects in Python](/samples/browse/?products=azure-functions&languages=python).

+ [Azure Functions Python developer guide](functions-reference-python.md)  
::: zone-end
