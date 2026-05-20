---
title: Respond to database changes in Azure Cosmos DB using Azure Functions
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy a local project to a Flex Consumption plan on Azure. The project features an Azure Cosmos DB trigger function that runs in response to changes in an Azure Cosmos DB database."
ms.date: 05/19/2026
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy an Azure Cosmos DB triggered function project securely to a new function app in the Flex Consumption plan in Azure by using azd templates and the azd up command.
---

# Quickstart: Respond to database changes in Azure Cosmos DB using Azure Functions

In this Quickstart, you use Visual Studio Code to build an app that responds to database changes in a No SQL database in Azure Cosmos DB. After testing the code locally, you deploy it to a new serverless function app you create running in a Flex Consumption plan in Azure Functions. 

The project source uses the Azure Developer CLI (azd) extension with Visual Studio Code to simplify initializing and verifying your project code locally, as well as deploying your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments.

While the Flex Consumption plan follows a _pay-for-what-you-use_ billing model, this code project creates additional Azure resources, including an Azure Cosmos DB instance. Make sure to [clean up resources](#clean-up-resources) when you're done to avoid ongoing charges.

::: zone pivot="programming-language-javascript,programming-language-typescript"
This article supports version 4 of the Node.js programming model for Azure Functions.
::: zone-end
::: zone pivot="programming-language-python"
This article supports version 2 of the Python programming model for Azure Functions.
::: zone-end  

[!INCLUDE [functions-scenario-quickstarts-prerequisites-full](../../includes/functions-scenario-quickstarts-prerequisites-full.md)]

+ [Azure Databases extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

## Initialize the project

You can use the `azd init` command from the command palette to create a local Azure Functions code project from a template.
 
1. In Visual Studio Code, open a folder or workspace in which you want to create your project.

1. Press <kbd>F1</kbd> to open the command palette, search for and run the command `Azure Developer CLI (azd): Initialize App (init)`, and then choose **Select a template**.

    There might be a slight delay while `azd` initializes the current folder or workspace.  
 
::: zone pivot="programming-language-csharp" 
3. When prompted, choose **Select a template**, then search for and select `Azure Functions with Cosmos DB Bindings (.NET)`. 

4. When prompted, enter a unique environment name, such as `cosmosdbchanges-dotnet`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-cosmosdb) and initializes the project in the current folder or workspace. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure. 
::: zone-end  
::: zone pivot="programming-language-java"  
3. When prompted, choose **Select a template**, then search for and select `Azure Functions with Cosmos DB Bindings (Java)`. 

4. When prompted, enter a unique environment name, such as `cosmosdbchanges-java`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-java-azd-cosmosdb) and initializes the project in the current folder or workspace. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure.
::: zone-end  
::: zone pivot="programming-language-javascript"  
3. When prompted, choose **Select a template**, then search for and select `Azure Functions JavaScript CosmosDB trigger`. 

4. When prompted, enter a unique environment name, such as `cosmosdbchanges-js`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-javascript-azd-cosmosdb) and initializes the project in the current folder or workspace. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure.
::: zone-end  
::: zone pivot="programming-language-powershell" 
3. When prompted, choose **Select a template**, then search for and select `Azure Functions PowerShell CosmosDB trigger`. 

4. When prompted, enter a unique environment name, such as `cosmosdbchanges-ps`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-powershell-azd-cosmosdb) and initializes the project in the current folder or workspace. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure.
::: zone-end  
::: zone pivot="programming-language-typescript"  
3. When prompted, choose **Select a template**, then search for and select `Azure Functions TypeScript CosmosDB trigger`. 

4. When prompted, enter a unique environment name, such as `cosmosdbchanges-ts`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-cosmosdb) and initializes the project in the current folder or workspace. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure. 
::: zone-end  
::: zone pivot="programming-language-python"  
3. When prompted, choose **Select a template**, then search for and select `Azure Functions Python with CosmosDB triggers and bindings...`. 

4. When prompted, enter a unique environment name, such as `cosmosdbchanges-py`.

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-python-azd-cosmosdb) and initializes the project in the current folder or workspace. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also part of the name of the resource group you create in Azure. 
::: zone-end

5. Run this command, depending on your local operating system, to grant configuration scripts the required permissions:

    ### [Linux/macOS](#tab/linux)
    
    Run this command with sufficient privileges:

    ```bash
    chmod +x ./infra/scripts/*.sh
    ```

    ### [Windows](#tab/windows-cmd)
    
    Run this command from the Windows command prompt:
 
    ```cmd
    pwsh -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    ```

    If prompted, select **Yes** to approve the policy change.     

    ---

Before you can run your app locally, you must create the resources in Azure. This project doesn't use local emulation for Azure Cosmos DB.

## Create Azure resources

This project is configured to use the `azd provision` command to create a function app in a Flex Consumption plan, along with other required Azure resources that follows current best practices. 

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette, search for and run the command `Azure Developer CLI (azd): Sign In with Azure Developer CLI`, and then sign in using your Azure account.

1. Press <kbd>F1</kbd> to open the command palette, search for and run the command `Azure Developer CLI (azd): Provision Azure resources (provision)` to create the required Azure resources:

1. When prompted in the Terminal window, provide these required deployment parameters:

    | Prompt | Description |
    | ---- | ---- |
    | Select an Azure Subscription to use | Choose the subscription in which you want your resources to be created.|
    | _location_ deployment parameter | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|
    | _vnetEnabled_ deployment parameter | While the template supports creating resources inside a virtual network, to simplify deployment and testing, choose `False`. |
    
    The `azd provision` command uses your response to these prompts with the Bicep configuration files to create and configure these required Azure resources, following the latest best practices:

    + Flex Consumption plan and function app
    + Azure Cosmos DB account
    + Azure Storage (required) and Application Insights (recommended)
    + Access policies and roles for your account
    + Service-to-service connections using managed identities (instead of stored connection strings)

    Post-provision hooks also generate the _local.settings.json_ file required when running locally. This file also contains the settings required to connect to your Azure Cosmos DB database in Azure.

    > [!TIP]  
    > Should any steps fail during provisioning, you can rerun the `azd provision` command again after resolving any issues.  

    After the command completes successfully, you can run your project code locally and trigger on the Azure Cosmos DB database in Azure. 

## Run the function locally  

Visual Studio Code integrates with [Azure Functions Core tools](functions-run-local.md) to let you run this project on your local development computer before you publish to your new function app in Azure.

1. Press <kbd>F1</kbd> and in the command palette search for and run the command `Azurite: Start`.  

1. To start the function locally, press <kbd>F5</kbd> or the **Run and Debug** icon in the left-hand side Activity bar. The **Terminal** panel displays the output from Core Tools. Your app starts in the **Terminal** panel, and you can see the name of the function that's running locally.

    If you have trouble running on Windows, make sure that the default terminal for Visual Studio Code isn't set to **WSL Bash**.

1. With Core Tools still running in **Terminal**, press <kbd>F1</kbd> and in the command palette search for and run the command `NoSQL: Create Item...` and select both the `document-db` database and the `documents` container.

1. Replace the contents of the _New Item.json_ file with this JSON data and select **Save**:

    ```json    
    {
        "id": "doc1", 
        "title": "Sample document", 
        "content": "This is a sample document for testing my Azure Cosmos DB trigger in Azure Functions."
    } 
    ```

    After you select **Save**, you see the execution of the function in the terminal and the local document is updated to include metadata added by the service.  

1. When you're done, press Ctrl+C in the terminal window to stop the `func.exe` host process.

## Review the code (optional)

The function is triggered based on the change feed in an Azure Cosmos DB NoSQL database.
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"
These environment variables configure how the trigger monitors the change feed:

- `COSMOS_CONNECTION__accountEndpoint`: The Cosmos DB account endpoint
- `COSMOS_DATABASE_NAME`: The name of the database to monitor
- `COSMOS_CONTAINER_NAME`: The name of the container to monitor

These environment variables are created for you both in Azure (function app settings) and locally (local.settings.json) during the `azd provision` operation.
::: zone-end
::: zone pivot="programming-language-typescript"
The `COSMOS_CONNECTION` environment variable configures the Cosmos DB account endpoint used by the trigger. This environment variable is created for you both in Azure (function app settings) and locally (local.settings.json) during the `azd provision` operation. The database and container names are defined in the trigger configuration.
::: zone-end

You can review the code that defines the Azure Cosmos DB trigger:
     
::: zone pivot="programming-language-csharp"  
:::code language="csharp" source="~/functions-azd-cosmosdb-dotnet/CosmosTrigger.cs" range="1-7,35-43,52-66,71-93" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-cosmosdb).
::: zone-end  
::: zone pivot="programming-language-java"  
:::code language="java" source="~/functions-azd-cosmosdb-java/src/main/java/com/function/CosmosTrigger.java" range="1-6,32-33,40-57" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-java-azd-cosmosdb).
::: zone-end  
::: zone pivot="programming-language-javascript"  
:::code language="javascript" source="~/functions-azd-cosmosdb-javascript/src/functions/cosmosTrigger.js" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-javascript-azd-cosmosdb).
::: zone-end  
::: zone pivot="programming-language-typescript" 
:::code language="typescript" source="~/functions-azd-cosmosdb-typescript/src/functions/cosmos_trigger.ts" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-cosmosdb).
::: zone-end  
::: zone pivot="programming-language-powershell"  
The trigger is defined in this _function.json_ file:

:::code language="json" source="~/functions-azd-cosmosdb-powershell/cosmos_trigger/function.json" :::

The following code runs when the trigger executes:  

:::code language="powershell" source="~/functions-azd-cosmosdb-powershell/cosmos_trigger/run.ps1" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-powershell-azd-cosmosdb).
::: zone-end  
::: zone pivot="programming-language-python" 
:::code language="python" source="~/functions-azd-cosmosdb-python/function_app.py" :::

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-python-azd-cosmosdb).
::: zone-end  

After you review and verify your function code locally, it's time to publish the project to Azure. 
 
## Deploy to Azure

You can run the `azd deploy` command from Visual Studio Code to deploy the project code to your already provisioned resources in Azure.

1. Press <kbd>F1</kbd> to open the command palette.

1. Search for and run the command `Azure Developer CLI (azd): Deploy to Azure (deploy)`. 
    
    The `azd deploy` command packages and deploys your code to the deployment container. The app is then started and runs in the deployed package. 

    After the command completes successfully, your app is running in Azure. 

## Invoke the function on Azure

1. In Visual Studio Code, press <kbd>F1</kbd> and in the command palette search for and run the command `Azure: Open in portal`, select `Function app`, and choose your new app. Sign in with your Azure account, if necessary. 

    This command opens your new function app in the Azure portal.

1. In the **Overview** tab on the main page, select your function app name and then the **Logs** tab.  

1. Use the `NoSQL: Create Item` command in Visual Studio Code to again add a document to the container as before.

1. Verify again that the function gets triggered by an update in the monitored container.

 ## Redeploy your code

You can run the `azd deploy` command as many times as you need to deploy code updates to your function app. 

>[!NOTE]
>Deployed code files are always overwritten by the latest deployment package.

Your initial responses to `azd` prompts and any environment variables generated by `azd` are stored locally in your named environment. Use the `azd env get-values` command to review all of the variables in your environment that were used when creating Azure resources. 

## Clean up resources

When you're done working with your function app and related resources, you can use this command to delete the function app and its related resources from Azure and avoid incurring any further costs:

```console
azd down --no-prompt
```

>[!NOTE]  
>The `--no-prompt` option instructs `azd` to delete your resource group without a confirmation from you. 
>
>This command doesn't affect your local code project. 

## Related content

+ [Azure Functions scenarios](functions-scenarios.md)
+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/)
+ [azd reference](/azure/developer/azure-developer-cli/reference)
+ [Azure Functions Core Tools reference](functions-core-tools-reference.md)
+ [Code and test Azure Functions locally](functions-develop-local.md)
