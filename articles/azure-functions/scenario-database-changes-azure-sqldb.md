---
title: Respond to database changes in Azure SQL Database using Azure Functions
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy a local project to a Flex Consumption plan on Azure. The project features an Azure SQL Database trigger function that runs in response to changes in a SQL table."
ms.date: 12/01/2025
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy an Azure SQL Database triggered function project securely to a new function app in the Flex Consumption plan in Azure by using azd templates and the azd up command.
---

# Quickstart: Respond to Azure SQL Database changes using Azure Functions

In this Quickstart, you use Visual Studio Code to build an app that responds to changes in an Azure SQL Database table. After testing the code locally, you deploy it to a new serverless function app running in a Flex Consumption plan in Azure Functions.

The project source uses the Azure Developer CLI (azd) extension with Visual Studio Code to simplify initializing and verifying your project code locally, and deploying your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments.

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell"  
> [!IMPORTANT]  
> While responding to [changes in an Azure SQL database](./functions-bindings-azure-mysql-trigger.md) is supported for all languages, this quickstart scenario currently only has examples for C#, Python, and TypeScript. To complete this quickstart, select one of these supported languages at the top of the article. 
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
[!INCLUDE [functions-scenario-quickstarts-prerequisites](../../includes/functions-scenario-quickstarts-prerequisites.md)]
+ The [SQL Server (mssql) extension](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql) for Visual Studio Code.

## Initialize the project

You can use the `azd init` command from the command palette to create a local Azure Functions code project from a template.

1. In Visual Studio Code, open a folder or workspace in which you want to create your project.

1. Press <kbd>F1</kbd> to open the command palette, search for and run the command `Azure Developer CLI (azd): Initialize App (init)`, and then choose **Select a template**.

1. When prompted, search for and select `Azure Functions with SQL Triggers and Bindings`.

1. When prompted, enter a unique environment name, such as `sqldbchanges`.
::: zone-end  
::: zone pivot="programming-language-csharp" 
This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-sql) and initializes the project in the current folder or workspace. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure.
::: zone-end
::: zone pivot="programming-language-python" 
This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-python-azd-sql) and initializes the project in the current folder or workspace. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure.
::: zone-end
::: zone pivot="programming-language-typescript" 
This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-sql) and initializes the project in the current folder or workspace. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure.
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
Before you can run your app locally, you must create the resources in Azure.

## Create Azure resources

This project is configured to use the `azd provision` command to create a function app in a Flex Consumption plan, along with other required Azure resources that follow current best practices.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette, search for and run the command `Azure Developer CLI (azd): Sign In with Azure Developer CLI`, and then sign in using your Azure account.
2. Press <kbd>F1</kbd> to open the command palette, search for and run the command `Azure Developer CLI (azd): Provision Azure resources (provision)` to create the required Azure resources.
3. When prompted in the Terminal window, provide these required deployment parameters:
   
    | Prompt | Description |
    | ---- | ---- |
    | Select an Azure Subscription to use | Select the subscription in which you want your resources to be created.|
    | _location_ deployment parameter | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|
    | _vnetEnabled_ deployment parameter | While the template supports creating resources inside a virtual network, to simplify deployment and testing, choose `False`. |


The `azd provision` command uses your response to these prompts with the Bicep configuration files to create and configure these required Azure resources, following the latest best practices:

+ Flex Consumption plan and function app
+ Azure SQL Database (default name: ToDo)
+ Azure Storage (required) and Application Insights (recommended)
+ Access policies and roles for your account
+ Service-to-service connections using managed identities (instead of stored connection strings)

Post-provision hooks also generate the _local.settings.json_ file, which is required to run locally. This file contains the settings required to connect to your database in Azure.

## Review the code (optional)

The sample defines two functions:
::: zone-end 
::: zone pivot="programming-language-csharp" 

| Function name | Code file | Trigger type | Description |
| ---- | ---- | ---- |
| `httptrigger-sql-output` | [sql_output_http_trigger.cs](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-sql/blob/main/sql_output_http_trigger.cs) | HTTP trigger | Accepts a properly formatted JSON payload and uses the SQL output binding to insert the object as a row in the `ToDo` table. |
|  `ToDoTrigger`| [sql_trigger.cs](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-sql/blob/main/sql_trigger.cs)  | SQL trigger | Listens on the `ToDo` table for row-level changes and returns an object that represents the changed row. |

The `ToDoItem` type is defined in [ToDoItem.cs](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-sql/blob/main/ToDoItem.cs).  
::: zone-end
::: zone pivot="programming-language-python"

| Function name | Code file | Trigger type | Description |
| ---- | ---- | ---- |
| `http_trigger_sql_output` | [function_app.py](https://github.com/Azure-Samples/functions-quickstart-python-azd-sql/blob/main/function_app.py#L46C5-L46C28) | HTTP trigger | Accepts a properly formatted JSON payload and uses the SQL output binding to insert the object as a row in the `ToDo` table. |
| `httptrigger-sql-output` | [sql_trigger_todo](https://github.com/Azure-Samples/functions-quickstart-python-azd-sql/blob/main/function_app.py#L15C5-L15C21) | SQL trigger | Listens on the `ToDo` table for row-level changes and returns an object that represents the changed row. |

The `ToDoItem` type is defined in [todo_item.py](https://github.com/Azure-Samples/functions-quickstart-python-azd-sql/blob/main/todo_item.py).  
::: zone-end
::: zone pivot="programming-language-typescript" 

| Function name | Code file | Trigger type | Description |
| ---- | ---- | ---- |
| `httpTriggerSqlOutput` | [sql_output_http_trigger.ts](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-sql/blob/main/src/functions/sql_output_http_trigger.ts) | HTTP trigger | Accepts a properly formatted JSON payload and uses the SQL output binding to insert the object as a row in the `ToDo` table. |
| `sqlTriggerToDo` | [sql_trigger.ts](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-sql/blob/main/src/functions/sql_trigger.ts) | SQL trigger | Listens on the `ToDo` table for row-level changes and returns an object that represents the changed row. |

The `ToDoItem` type is defined in [ToDoItem.ts](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-sql/blob/main/src/models/ToDoItem.ts).
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 

Both functions use the app-level `AZURE_SQL_CONNECTION_STRING_KEY_*` environment variables that define an identity-based connection to the Azure SQL Database instance using Microsoft Entra ID authentication. These environment variables are created for you both in Azure (function app settings) and locally (local.settings.json) during the `azd provision` operation.

## Connect to the SQL database

You can use the SQL Server (mssql) extension for Visual Studio Code to connect to the new database. This extension helps you make updates in the `ToDo` table to run the SQL trigger function.

1. Press <kbd>F1</kbd> and in the command palette search for and run the command `MS SQL: Add Connection`.  

1. In the **Connection dialog**, change **Input type** to **Browse Azure** and then set these remaining options:

    | Option | Choose | Description |
    | ---- | ---- | --- |
    | **Server** | Your SQL Server instance | By default, all servers accessible to your Azure account are displayed. Use **Subscription**, **Resource group**, and **Location** to help filter the servers list.  |
    | **Database** | `ToDo` | The database created during the provisioning process. |
    | **Authentication type** | **Microsoft Entra ID** | If you aren't already signed-in, select **Sign in** and sign in to your Azure account. |
    | **Tenant ID** | The specific account tenant. | If your account has more than one tenant, choose the correct tenant for your subscription. |

1. Select **Connect** to connect to your database. The connection uses your local user account, which is granted admin permissions in the hosting server and mapped to `dbo` in the database.   

1. In the **SQL Server** view, locate and expand **Connections** and then your new server in SQL Server explorer. Expand **Tables** and verify that the `ToDo` table exists. If it doesn't exist, you might need run `azd provision` again and check for errors.

## Run the function locally

Visual Studio Code integrates with [Azure Functions Core tools](functions-run-local.md) to let you run this project on your local development computer before you publish to your new function app in Azure.

1. Press <kbd>F1</kbd> and in the command palette search for and run the command `Azurite: Start`.  

1. To start the function locally, press <kbd>F5</kbd> or the **Run and Debug** icon in the left-hand side Activity bar. 

    The **Terminal** panel displays the output from Core Tools. Your app starts in the **Terminal** panel, and you can see the name of the function that's running locally.

With the app running, you can verify and debug both function triggers.

### [HTTP trigger](#tab/http-trigger)

To verify the HTTP trigger function that writes to a SQL output binding:

1. Copy this JSON object, which you can also find in the `test.http` project file:

    ::: code language="json" source="~/functions-scenarios-quickstart-sql/test.http" range="5-11" :::

    This data represents a row that you insert in your SQL database when you call the HTTP endpoint. The output binding translates the data object into an `INSERT` operation in the database. 

1. With the app running, in the **Azure** view under **Workspace** expand **Local project** > **Functions**.

1. Right-select your HTTP function (or <kbd>Ctrl</kbd>+click on macOS), select **Execute function now**, paste the copied JSON data, and press <kbd>Enter</kbd>.

    The function handles the HTTP request and writes the item to the connected SQL database and returns the created object. 

1. Back in the SQL Server explorer, right-select the `ToDo` table (or <kbd>Ctrl</kbd>+click on macOS), and choose **Select Top 1000**. When the query executes, it returns the inserted or updated row.

1. Repeat Step 3 and resend the same data object with the same ID. This time, the output binding performs an `UPDATE` operation instead of an `INSERT` and modifies the existing row in the database.

### [SQL trigger](#tab/sql-trigger)

To verify the SQL trigger:

1. With the app running, return to the SQL Server explorer, right-select the database (or <kbd>Ctrl</kbd>+click on macOS), and select **New Query**.

1. Paste this `INSERT` command in the new query window and select the **Execute query** button: 

    ```sql
    INSERT INTO [dbo].[ToDo] ([id], [order], [title], [url], [completed])
    VALUES (
        '22222222-2222-2222-2222-222222222222',
        1,
        'Test Todo Item',
        'https://contoso.com',
        0
    );
    ``` 

    Note in the terminal window that the SQL trigger executes and logs the insert. 

1. Replace the query with this `UPDATE` command that changes the `completed` column value to `1` for the row you just added:

    ```sql
    UPDATE [dbo].[ToDo] 
    SET [completed] = 1
    WHERE [id] = '22222222-2222-2222-2222-222222222222';
    ```
    
    Note again in the terminal window that the SQL trigger executes on the update.

---

When you're done, type <kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal to stop the Core Tools process.

## Deploy to Azure

You can run the `azd deploy` command from Visual Studio Code to deploy the project code to your already provisioned resources in Azure.

1. Press <kbd>F1</kbd> to open the command palette, search for and run the command `Azure Developer CLI (azd): Deploy to Azure (deploy)`.

    The `azd deploy` command packages and deploys your code to the deployment container. The app is then started and runs in the deployed package.

1. After the command completes successfully, your app is running in Azure. Make a note of the `Endpoint` value, which is the URL of your function app running in Azure.  

## Invoke the function on Azure

1. In Visual Studio Code, press <kbd>F1</kbd> and in the command palette search for and run the command `Azure: Open in portal`, select `Function app`, and choose your new app. Sign in with your Azure account, if necessary.

1. Select **Log stream** in the left pane, which connects to the Application Insights logs for your app. 

1. Return to Visual Studio Code to run both the functions in Azure. 

### [HTTP trigger](#tab/http-trigger)

1. Press <kbd>F1</kbd> to open the command palette, search for and run the command `Azure Functions: Execute Function Now...`.

1. Search for and select your remote function app from the list, then select the HTTP trigger function.

1. As before, paste your JSON object data in **Enter payload body** and press <kbd>Enter</kbd>.

    ::: code language="json" source="~/functions-scenarios-quickstart-sql/test.http" range="5-11" :::

    To perform an `INSERT` instead of an `UPDATE`, replace the `id` with a new GUID value.

1. Return to the portal and view the execution output in the log window.

### [SQL trigger](#tab/sql-trigger)

To verify the SQL trigger:

1. With the app running, return to the previous INSERT query tab.

1. Replace the existing `INSERT` command with this new one and select the **Execute query** button: 

    ```sql
    INSERT INTO [dbo].[ToDo] ([id], [order], [title], [url], [completed])
    VALUES (
        '44444444-4444-4444-4444-444444444444',
        1,
        'Test Todo Item',
        'https://example.com',
        0
    );
    ``` 

1. Return to the portal and view the execution output in the log window.

---

## Clean up resources

When you're done working with your function app and related resources, you can use this command to delete the function app and its related resources from Azure and avoid incurring any further costs:

```console
azd down --no-prompt
```

>[!NOTE]
>The `--no-prompt` option instructs `azd` to delete your resource group without a confirmation from you.
>
>This command doesn't affect your local code project.
::: zone-end
## Related articles

+ [Azure Functions scenarios](functions-scenarios.md)
+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/)
+ [azd reference](/azure/developer/azure-developer-cli/reference)
+ [Azure Functions development using Visual Studio Code](./functions-develop-vs-code.md)
+ [Code and test Azure Functions locally](functions-develop-local.md)
+ [SQL bindings extension reference](functions-bindings-azure-sql.md)
+ [Azure SQL Database](/azure/azure-sql/)