---
title: Connect Azure Functions to Azure SQL Database using Visual Studio Code
description: Learn how to connect Azure Functions to Azure SQL Database by adding an output binding to your Visual Studio Code project.
ms.date: 12/29/2024
ms.topic: quickstart
author: dzsquared
ms.author: drskwier
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions-temp
ms.devlang: csharp
# ms.devlang: csharp, javascript
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
---

# Connect Azure Functions to Azure SQL Database using Visual Studio Code

[!INCLUDE [functions-add-storage-binding-intro](../../includes/functions-add-storage-binding-intro.md)]

This article shows you how to use Visual Studio Code to connect [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview) to the function you created in the previous quickstart article. The output binding that you add to this function writes data from the HTTP request to a table in Azure SQL Database. 

::: zone pivot="programming-language-csharp"
Before you begin, you must complete the [quickstart: Create a C# function in Azure using Visual Studio Code](create-first-function-vs-code-csharp.md). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.
::: zone-end
::: zone pivot="programming-language-javascript"  
Before you begin, you must complete the [quickstart: Create a JavaScript function in Azure using Visual Studio Code](create-first-function-vs-code-node.md?pivot=nodejs-model-v3). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end
::: zone pivot="programming-language-python"  
Before you begin, you must complete the [quickstart: Create a Python function in Azure using Visual Studio Code](create-first-function-vs-code-python.md). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end

More details on the settings for [Azure SQL bindings and trigger for Azure Functions](functions-bindings-azure-sql.md) are available in the Azure Functions documentation.

## Create your Azure SQL Database

1. Follow the [Azure SQL Database create quickstart](/azure/azure-sql/database/single-database-create-quickstart) to create a serverless Azure SQL Database.  The database can be empty or created from the sample dataset AdventureWorksLT.

1. Provide the following information at the prompts:

    |Prompt| Selection|
    |--|--|
    |**Resource group**|Choose the resource group where you created your function app in the [previous article](./create-first-function-vs-code-csharp.md). |
    |**Database name**|Enter `mySampleDatabase`.|
    |**Server name**|Enter a unique name for your server. We can't provide an exact server name to use because server names must be globally unique for all servers in Azure, not just unique within a subscription. |
    |**Authentication method**|Select **SQL Server authentication**.|
    |**Server admin login**|Enter `azureuser`.|
    |**Password**|Enter a password that meets the complexity requirements.|
    |**Allow Azure services and resources to access this server**|Select **Yes**.|

    >[!IMPORTANT]
    >This article currently shows how to connect to Azure SQL Database by using SQL Server authentication. For the best security, you should instead use managed identities for the Azure SQL Database connection. For more information, see the [Create an Azure SQL Database server with a user-assigned managed identity](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity-create-server).

1. Once the creation has completed, navigate to the database blade in the Azure portal, and, under **Settings**, select **Connection strings**. Copy the **ADO.NET** connection string for **SQL authentication**. Paste the connection string into a temporary document for later use.

    :::image type="content" source="./media/functions-add-output-binding-azure-sql-vs-code/adonet-connection-string.png" alt-text="Screenshot of copying the Azure SQL Database connection string in the Azure portal." border="true":::

1. Create a table to store the data from the HTTP request. In the Azure portal, navigate to the database blade and select **Query editor**. Enter the following query to create a table named `dbo.ToDo`:

    :::code language="sql" source="~/functions-sql-todo-sample/sql/create.sql" range="1-7":::

1. Verify that your Azure Function will be able to access the Azure SQL Database by checking the [server's firewall settings](/azure/azure-sql/database/network-access-controls-overview#allow-azure-services). Navigate to the **server blade** on the Azure portal, and under **Security**, select **Networking**.  The exception for **Allow Azure services and resources to access this server** should be checked.

    :::image type="content" source="./media/functions-add-output-binding-azure-sql-vs-code/manage-server-firewall.png" alt-text="Screenshot of checking the Azure SQL Database firewall settings in the Azure portal." border="true":::

## Update your function app settings

In the [previous quickstart article](./create-first-function-vs-code-csharp.md), you created a function app in Azure. In this article, you update your app to write data to the Azure SQL Database you've just created. To connect to your Azure SQL Database, you must add its connection string to your app settings. You then download the new setting to your local.settings.json file so you can connect to your Azure SQL Database when running locally.

1. Edit the connection string in the temporary document you created earlier. Replace the value of `Password` with the password you used when creating the Azure SQL Database. Copy the updated connection string.

1. Press <kbd>Ctrl/Cmd+shift+P</kbd> to open the command palette, then search for and run the command `Azure Functions: Add New Setting...`.

1. Choose the function app you created in the previous article. Provide the following information at the prompts:

    |Prompt| Selection|
    |--|--|
    |**Enter new app setting name**| Type `SqlConnectionString`.|
    |**Enter value for "SqlConnectionString"**| Paste the connection string of your Azure SQL Database you just copied.|

    This creates an application setting named connection `SqlConnectionString` in your function app in Azure. Now, you can download this setting to your local.settings.json file.

1. Press <kbd>Ctrl/Cmd+shift+P</kbd> again to open the command palette, then search for and run the command `Azure Functions: Download Remote Settings...`. 

1. Choose the function app you created in the previous article. Select **Yes to all** to overwrite the existing local settings. 

This downloads all of the setting from Azure to your local project, including the new connection string setting. Most of the downloaded settings aren't used when running locally. 

## Register binding extensions

Because you're using an Azure SQL output binding, you must have the corresponding bindings extension installed before you run the project. 

::: zone pivot="programming-language-csharp"

With the exception of HTTP and timer triggers, bindings are implemented as extension packages. Run the following [dotnet add package](/dotnet/core/tools/dotnet-add-package) command in the Terminal window to add the Azure SQL extension package to your project.

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Sql
```

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python"  

Your project has been configured to use [extension bundles](functions-bindings-register.md#extension-bundles), which automatically installs a predefined set of extension packages. 

Extension bundles usage is enabled in the host.json file at the root of the project, which appears as follows:

:::code language="json" source="~/functions-docs-javascript/functions-add-output-binding-sql-cli-v4-programming-model/host.json":::

:::

::: zone-end

Now, you can add the Azure SQL output binding to your project.

## Add an output binding

In Functions, each type of binding requires a `direction`, `type`, and a unique `name` to be defined in the function.json file. The way you define these attributes depends on the language of your function app.

::: zone pivot="programming-language-csharp"

Open the *HttpExample.cs* project file and add the following `ToDoItem` class, which defines the object that is written to the database:

:::code language="csharp" source="~/functions-sql-todo-sample/ToDoModel.cs" range="6-16":::

In a C# class library project, the bindings are defined as binding attributes on the function method. The *function.json* file required by Functions is then auto-generated based on these attributes.

Open the *HttpExample.cs* project file and add the following output type class, which defines the combined objects that will be output from our function for both the HTTP response and the SQL output:

```cs
public static class OutputType
{
    [SqlOutput("dbo.ToDo", connectionStringSetting: "SqlConnectionString")]
    public ToDoItem ToDoItem { get; set; }
    public HttpResponseData HttpResponse { get; set; }
}
```

Add a using statement to the `Microsoft.Azure.Functions.Worker.Extensions.Sql` library to the top of the file:

```cs
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
```  
::: zone-end  
::: zone pivot="programming-language-javascript"  
Binding attributes are defined directly in your code. The [Azure SQL output configuration](./functions-bindings-azure-sql-output.md#configuration) describes the fields required for an Azure SQL output binding.

For this `MultiResponse` scenario, you need to add an `extraOutputs` output binding to the function.

:::code language="javascript" source="~/functions-docs-javascript/functions-add-output-binding-sql-cli-v4-programming-model/src/functions/httpTrigger1.js" range="9-12":::

Add the following properties to the binding configuration:

:::code language="javascript" source="~/functions-docs-javascript/functions-add-output-binding-sql-cli-v4-programming-model/src/functions/httpTrigger1.js" range="4-7":::

::: zone-end

::: zone pivot="programming-language-python"  
Binding attributes are defined directly in the *function_app.py* file. You use the `generic_output_binding` decorator to add an [Azure SQL output binding](./functions-reference-python.md#outputs):

```python
@app.generic_output_binding(arg_name="toDoItems", type="sql", CommandText="dbo.ToDo", ConnectionStringSetting="SqlConnectionString"
    data_type=DataType.STRING)
```

In this code, `arg_name` identifies the binding parameter referenced in your code, `type` denotes the output binding is a SQL output binding, `CommandText` is the table that the binding writes to, and `ConnectionStringSetting` is the name of an application setting that contains the Azure SQL connection string. The connection string is in the SqlConnectionString setting in the *local.settings.json* file.

::: zone-end


## Add code that uses the output binding

::: zone pivot="programming-language-csharp"  
Replace the existing Run method with the following code:

```cs
[Function("HttpExample")]
public static OutputType Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
    FunctionContext executionContext)
{
    var logger = executionContext.GetLogger("HttpExample");
    logger.LogInformation("C# HTTP trigger function processed a request.");

    var message = "Welcome to Azure Functions!";

    var response = req.CreateResponse(HttpStatusCode.OK);
    response.Headers.Add("Content-Type", "text/plain; charset=utf-8");
    response.WriteString(message);

    // Return a response to both HTTP trigger and Azure SQL output binding.
    return new OutputType()
    {
         ToDoItem = new ToDoItem
        {
            id = System.Guid.NewGuid().ToString(),
            title = message,
            completed = false,
            url = ""
        },
        HttpResponse = response
    };
}
```

::: zone-end  
::: zone pivot="programming-language-javascript"  
Add code that uses the `extraInputs` output binding object on `context` to send a JSON document to the named output binding function, `sendToSql`. Add this code before the `return` statement.

:::code language="javascript" source="~/functions-docs-javascript/functions-add-output-binding-sql-cli-v4-programming-model/src/functions/httpTrigger1.js" range="23-34":::

To utilize the `crypto` module, add the following line to the top of the file:

```javascript
const crypto = require("crypto");
```

At this point, your function should look as follows:

:::code language="javascript" source="~/functions-docs-javascript/functions-add-output-binding-sql-cli-v4-programming-model/src/functions/httpTrigger1.js" :::

::: zone-end


::: zone pivot="programming-language-python"  
Update *HttpExample\\function_app.py* to match the following code. Add the `toDoItems` parameter to the function definition and `toDoItems.set()` under the `if name:` statement:

```python
import azure.functions as func
import logging
from azure.functions.decorators.core import DataType
import uuid

app = func.FunctionApp()

@app.function_name(name="HttpTrigger1")
@app.route(route="hello", auth_level=func.AuthLevel.ANONYMOUS)
@app.generic_output_binding(arg_name="toDoItems", type="sql", CommandText="dbo.ToDo", ConnectionStringSetting="SqlConnectionString",data_type=DataType.STRING)
def test_function(req: func.HttpRequest, toDoItems: func.Out[func.SqlRow]) -> func.HttpResponse:
     logging.info('Python HTTP trigger function processed a request.')
     name = req.get_json().get('name')
     if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

     if name:
        toDoItems.set(func.SqlRow({"Id": str(uuid.uuid4()), "title": name, "completed": False, "url": ""}))
        return func.HttpResponse(f"Hello {name}!")
     else:
        return func.HttpResponse(
                    "Please pass a name on the query string or in the request body",
                    status_code=400
                )
```  
::: zone-end  
::: zone pivot="programming-language-csharp"  
[!INCLUDE [functions-run-function-test-local-vs-code-csharp](../../includes/functions-run-function-test-local-vs-code-csharp.md)]
::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python"
## Run the function locally

1. As in the previous article, press <kbd>F5</kbd> to start the function app project and Core Tools. 

1. With Core Tools running, go to the **Azure: Functions** area. Under **Functions**, expand **Local Project** > **Functions**. Right-click (Ctrl-click on Mac) the `HttpExample` function and choose **Execute Function Now...**.

    :::image type="content" source="../../includes/media/functions-run-function-test-local-vs-code/execute-function-now.png" alt-text="Screenshot of execute function now menu item from Visual Studio Code.":::

1. In **Enter request body** you see the request message body value of `{ "name": "Azure" }`. Press Enter to send this request message to your function.

1. After a response is returned, press <kbd>Ctrl + C</kbd> to stop Core Tools.
::: zone-end

### Verify that information has been written to the database

1. On the Azure portal, go back to your Azure SQL Database and select **Query editor**.

    :::image type="content" source="./media/functions-add-output-binding-azure-sql-vs-code/query-editor-login.png" alt-text="Screenshot of logging in to query editor on the Azure portal." border="true":::

1. Connect to your database and expand the **Tables** node in object explorer on the left. Right-click on the `dbo.ToDo` table and select **Select Top 1000 Rows**.

1. Verify that the new information has been written to the database by the output binding.


## Redeploy and verify the updated app

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Deploy to function app...`.

1. Choose the function app that you created in the first article. Because you're redeploying your project to the same app, select **Deploy** to dismiss the warning about overwriting files.

1. After deployment completes, you can again use the **Execute Function Now...** feature to trigger the function in Azure.

1. Again [check the data written to your Azure SQL Database](#verify-that-information-has-been-written-to-the-database) to verify that the output binding again generates a new JSON document.

## Clean up resources

In Azure, *resources* refer to function apps, functions, storage accounts, and so forth. They're grouped into *resource groups*, and you can delete everything in a group by deleting the group.

You created resources to complete these quickstarts. You may be billed for these resources, depending on your [account status](https://azure.microsoft.com/account/) and [service pricing](https://azure.microsoft.com/pricing/). If you don't need the resources anymore, here's how to delete them:

[!INCLUDE [functions-cleanup-resources-vs-code-inner.md](../../includes/functions-cleanup-resources-vs-code-inner.md)]

## Next steps

You've updated your HTTP triggered function to write data to Azure SQL Database. Now you can learn more about developing Functions using Visual Studio Code:

+ [Develop Azure Functions using Visual Studio Code](functions-develop-vs-code.md)

+ [Azure SQL bindings and trigger for Azure Functions](functions-bindings-azure-sql.md)

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
