---
title: Build a serverless workflow using Durable Functions in Azure Functions
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy a Durable Functions project to a Flex Consumption plan on Azure Functions. The project demonstrates the fan-out/fan-in pattern."
ms.date: 07/17/2026
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions-no-go
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy Durable Functions code that orchestrates multiple tasks in parallel to a new function app in the Flex Consumption plan in Azure Functions.
---

# Quickstart: Build a serverless workflow using Durable Functions

In this quickstart, you use Azure Developer command-line tools to build a serverless workflow that orchestrates multiple tasks running in parallel. You create resources in Azure, verify the code locally, and then deploy it to a new serverless function app running in a Flex Consumption plan in Azure Functions.

The project uses the Azure Developer CLI (azd) to simplify deploying your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments. This quickstart demonstrates the **fan-out/fan-in** pattern in [Durable Functions](../durable-task/common/what-is-durable-task.md), an extension that orchestrates stateful workflows with durable execution. The sample uses the [Durable Task Scheduler](../durable-task/scheduler/durable-task-scheduler.md), a fully managed backend for Durable Functions that replaces the Azure Storage backend. The sample fetches article titles in parallel—the orchestration fans out to multiple activities running concurrently, then fans back in to aggregate the results.

By default, the Flex Consumption plan follows a _pay-for-what-you-use_ billing model, which means completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools)

+ [Azurite storage emulator](../storage/common/storage-install-azurite.md?tabs=npm#install-azurite)
::: zone pivot="programming-language-csharp"
+ [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
::: zone-end
::: zone pivot="programming-language-python"
+ [Python 3.12](https://www.python.org/downloads/)
::: zone-end
::: zone pivot="programming-language-typescript"
+ [Node.js 22+](https://nodejs.org/)
::: zone-end
::: zone pivot="programming-language-javascript"
+ [Node.js 22+](https://nodejs.org/)
::: zone-end
::: zone pivot="programming-language-java"
+ [Java Development Kit (JDK) 17](/java/openjdk/download#openjdk-17)

+ [Apache Maven](https://maven.apache.org/)
::: zone-end
::: zone pivot="programming-language-powershell"
+ [PowerShell 7.4](/powershell/scripting/install/installing-powershell)
::: zone-end  

## Initialize the project

Use the `azd init` command to create a local Durable Functions code project from a template.

::: zone pivot="programming-language-csharp"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template durable-functions-quickstart-dotnet-azd -e dfquickstart-dotnet
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/durable-functions-quickstart-dotnet-azd) and initializes the project in a new folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Change to the project directory and then navigate to the `fanoutfanin` app folder:

    ```console
    cd durable-functions-quickstart-dotnet-azd/fanoutfanin
    ```
::: zone-end  
::: zone pivot="programming-language-python"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template durable-functions-quickstart-python-azd -e dfquickstart-python
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/durable-functions-quickstart-python-azd) and initializes the project in a new folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Change to the project directory and then navigate to the `src` app folder:

    ```console
    cd durable-functions-quickstart-python-azd/src
    ```
::: zone-end  
::: zone pivot="programming-language-typescript"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template durable-functions-quickstart-typescript-azd -e dfquickstart-typescript
    ```
        
    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/durable-functions-quickstart-typescript-azd) and initializes the project in a new folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Change to the project directory and then navigate to the `src` app folder:

    ```console
    cd durable-functions-quickstart-typescript-azd/src
    ```
::: zone-end
::: zone pivot="programming-language-java"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template durable-functions-quickstart-java-azd -e dfquickstart-java
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/durable-functions-quickstart-java-azd) and initializes the project in a new folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Change to the project directory:

    ```console
    cd durable-functions-quickstart-java-azd
    ```

::: zone-end
::: zone pivot="programming-language-javascript"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template durable-functions-quickstart-javascript-azd -e dfquickstart-javascript
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/durable-functions-quickstart-javascript-azd) and initializes the project in a new folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Change to the project directory and then navigate to the `src` app folder:

    ```console
    cd durable-functions-quickstart-javascript-azd/src
    ```
::: zone-end
::: zone pivot="programming-language-powershell"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template durable-functions-quickstart-powershell-azd -e dfquickstart-powershell
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/durable-functions-quickstart-powershell-azd) and initializes the project in a new folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Change to the project directory and then navigate to the `src` app folder:

    ```console
    cd durable-functions-quickstart-powershell-azd/src
    ```
::: zone-end

## Provision Azure resources

This project uses the `azd provision` command to create the required Azure resources, including a new function app in a Flex Consumption plan, a Durable Task Scheduler, and a task hub.

>[!TIP]
>The project includes a set of Bicep files (in the `infra` folder) that `azd` uses to create a secure deployment to a Flex consumption plan that follows best practices.

::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript,programming-language-javascript,programming-language-powershell"
1. Go back to the root project folder (the folder that contains the `azure.yaml` file):

    ```console
    cd ..
    ```

::: zone-end
::: zone pivot="programming-language-java"
1. Make sure you're still in the root project folder (the folder that contains the `azure.yaml` file).

::: zone-end

2. Run this command to authenticate with your Azure account:

    ```console
    azd auth login
    ```

3. Run this command from the root project folder to have `azd` create the required Azure resources:

    ```console
    azd provision
    ```

    The root folder contains the `azure.yaml` definition file required by `azd`.

4. When prompted, provide these required deployment parameters:

    | Parameter | Description |
    | ---- | ---- |
    | _Azure subscription_ | Subscription in which your resources are created. If your account has more than one tenant, you must first choose your tenant. |
    | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown. |
    | _vnetEnabled_ | Whether to deploy in a virtual network. For this quickstart, select **false**. |
    
    The `azd provision` command uses your responses to these prompts with the Bicep configuration files to create and configure these required Azure resources:

    + Flex Consumption plan and function app
    + Azure Storage (required) and Application Insights (recommended)
    + Durable Task Scheduler and task hub
    + Access policies and roles for your account
    + Service-to-service connections using managed identities (instead of stored connection strings)

    After the command completes successfully, you see links to the resources you created. 

    Provisioning also runs a post-provision script that generates a _local.settings.json_ file in your app folder. This file contains the connection settings for the deployed Durable Task Scheduler endpoint, which you need to run the project locally.

## Start Azurite

To run the project locally, the Functions runtime needs a local storage emulator. The `"AzureWebJobsStorage": "UseDevelopmentStorage=true"` setting in the local.settings.json file directs the runtime to use Azurite for this purpose.

In a new terminal window, run this command to start Azurite: 

```console
azurite --skipApiVersionCheck --location ~/azurite-data
```

Keep Azurite running in this terminal window while testing locally.

## Run in your local environment  

::: zone pivot="programming-language-csharp"
1. In your original terminal, go to the `fanoutfanin` app folder and start the Functions host:

    ```console
    cd fanoutfanin
    func start
    ```

    When the Functions host starts in your local project folder, it writes the local URL endpoints of your HTTP triggered functions to the terminal output. 


    >[!NOTE]
    >Because access key authorization isn't enforced when running locally, you don't need an access key to call your function. 

1. In your browser, make a GET request to the endpoint that starts the orchestration:

    <http://localhost:7071/api/FetchOrchestration_HttpStart>

    This request starts a new orchestration instance. The orchestration fans out to several activities to fetch the titles of Microsoft Learn articles in parallel. When the activities finish, the orchestration fans back in and returns the titles as a formatted string.    
::: zone-end 
::: zone pivot="programming-language-python" 
1. In your original terminal, go to the `src` app folder, create and activate a virtual environment, install dependencies, and start the Functions host:

    ```console
    cd src
    ```

    The way that you create and activate your virtual environment (named `.venv`) depends on your terminal:

    ### [Linux/macOS](#tab/linux)

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    func start
    ```

    ### [Windows (bash)](#tab/windows-bash)

    ```bash
    py -m venv .venv
    source .venv/scripts/activate
    pip install -r requirements.txt
    func start
    ```

    ### [Windows (Cmd)](#tab/windows-cmd)

    ```shell
    py -m venv .venv
    .venv\scripts\activate
    pip install -r requirements.txt
    func start
    ```

    ---

    When the Functions host starts in your local project folder, it writes the local URL endpoints of your HTTP triggered functions to the terminal output. 


    >[!NOTE]
    >Because access key authorization isn't enforced when running locally, you don't need an access key to call your function. 

1. In your browser, make a GET request to the HTTP start endpoint:

    <http://localhost:7071/api/orchestrators/fetch_orchestration>

    This request starts a new orchestration instance. The orchestration fans out to several activities to fetch the titles of Microsoft Learn articles in parallel. When the activities finish, the orchestration fans back in and returns the titles as a formatted string.  
::: zone-end
::: zone pivot="programming-language-typescript"
1. In your original terminal, go to the `src` app folder, install dependencies, build the project, and start the Functions host:

    ```console
    cd src
    npm install
    npm run build
    func start
    ```

    When the Functions host starts in your local project folder, it writes the local URL endpoints of your HTTP triggered functions to the terminal output. 


    >[!NOTE]
    >Because access key authorization isn't enforced when running locally, you don't need an access key to call your function. 

1. In your browser, make a GET request to the HTTP start endpoint:

    <http://localhost:7071/api/orchestrators/fetchOrchestration>

    This request starts a new orchestration instance. The orchestration fans out to several activities to fetch the titles of Microsoft Learn articles in parallel. When the activities finish, the orchestration fans back in and returns the titles as a formatted string.
::: zone-end
::: zone pivot="programming-language-java"
1. In your original terminal, build the project and then start the Functions host from the build output folder:

    ```console
    mvn clean package
    cd target/azure-functions/durable-functions-quickstart
    func start
    ```

    When the Functions host starts in your local project folder, it writes the local URL endpoints of your HTTP triggered functions to the terminal output. 


    >[!NOTE]
    >Because access key authorization isn't enforced when running locally, you don't need an access key to call your function. 

1. In your browser, make a GET request to the endpoint that starts the orchestration:

    <http://localhost:7071/api/FetchOrchestration_HttpStart>

    This request starts a new orchestration instance. The orchestration fans out to several activities to fetch the titles of Microsoft Learn articles in parallel. When the activities finish, the orchestration fans back in and returns the titles as a formatted string.    
::: zone-end
::: zone pivot="programming-language-javascript"
1. In your original terminal, go to the `src` app folder, install dependencies, and start the Functions host:

    ```console
    cd src
    npm install
    func start
    ```

    When the Functions host starts in your local project folder, it writes the local URL endpoints of your HTTP triggered functions to the terminal output. 


    >[!NOTE]
    >Because access key authorization isn't enforced when running locally, you don't need an access key to call your function. 

1. In your browser, make a GET request to the endpoint that starts the orchestration:

    <http://localhost:7071/api/FetchOrchestration_HttpStart>

    This request starts a new orchestration instance. The orchestration fans out to several activities to fetch the titles of Microsoft Learn articles in parallel. When the activities finish, the orchestration fans back in and returns the titles as a formatted string.    
::: zone-end
::: zone pivot="programming-language-powershell"
1. In your original terminal, go to the `src` app folder and start the Functions host:

    ```console
    cd src
    func start
    ```

    When the Functions host starts in your local project folder, it writes the local URL endpoints of your HTTP triggered functions to the terminal output. 


    >[!NOTE]
    >Because access key authorization isn't enforced when running locally, you don't need an access key to call your function. 

1. In your browser, make a GET request to the endpoint that starts the orchestration:

    <http://localhost:7071/api/FetchOrchestration_HttpStart>

    This request starts a new orchestration instance. The orchestration fans out to several activities to fetch the titles of Microsoft Learn articles in parallel. When the activities finish, the orchestration fans back in and returns the titles as a formatted string.    
::: zone-end

3. The HTTP endpoint returns a JSON response with several URLs. The `statusQueryGetUri` endpoint provides the orchestration status.

4. Copy the `statusQueryGetUri` value and paste it into your browser or HTTP test tool to check the status of the orchestration. When the orchestration completes, you see the fetched article titles in the response.

5. When you're done, press Ctrl+C in the terminal window to stop the `func` host process.

::: zone pivot="programming-language-python"
6. Run `deactivate` to shut down the virtual environment.
::: zone-end

## Review the code (optional)

You can review the code that implements the fan-out/fan-in pattern:

::: zone pivot="programming-language-csharp"
The title fetching activities are tracked using a dynamic task list. The line `await Task.WhenAll(parallelTasks);` waits for all the called activities, which run concurrently, to complete. When done, all outputs are aggregated as a formatted string.

:::code language="csharp" source="~/functions-scenarios-durable-dotnet/fanoutfanin/FetchOrchestration.cs" range="12-41" :::  

You can review the complete template project [here](https://github.com/Azure-Samples/durable-functions-quickstart-dotnet-azd).
::: zone-end  
::: zone pivot="programming-language-python"
The title fetching activities are tracked using a dynamic task list. The line `yield context.task_all(tasks)` waits for all the called activities, which run concurrently, to complete. When done, all outputs are aggregated as a formatted string.

:::code language="python" source="~/functions-scenarios-durable-python/src/function_app.py" range="28-56" :::

You can review the complete template project [here](https://github.com/Azure-Samples/durable-functions-quickstart-python-azd).
::: zone-end
::: zone pivot="programming-language-typescript"
The title fetching activities are tracked using a dynamic task list. The line `yield context.df.Task.all(parallelTasks)` waits for all the called activities, which run concurrently, to complete. When done, all outputs are aggregated as a formatted string.

:::code language="typescript" source="~/functions-scenarios-durable-typescript/src/fetchOrchestration.ts" range="11-35" :::

You can review the complete template project [here](https://github.com/Azure-Samples/durable-functions-quickstart-typescript-azd).
::: zone-end
::: zone pivot="programming-language-java"
The title fetching activities are tracked using a dynamic task list. The line `ctx.allOf(parallelTasks).await()` waits for all the called activities, which run concurrently, to complete. When done, all outputs are aggregated as a formatted string.

:::code language="java" source="~/functions-scenarios-durable-java/src/main/java/com/function/FetchOrchestration.java" range="32-53" :::

You can review the complete template project [here](https://github.com/Azure-Samples/durable-functions-quickstart-java-azd).
::: zone-end
::: zone pivot="programming-language-javascript"
The title fetching activities are tracked using a dynamic task list. The line `yield context.df.Task.all(parallelTasks)` waits for all the called activities, which run concurrently, to complete. When done, all outputs are aggregated as a formatted string.

:::code language="javascript" source="~/functions-scenarios-durable-javascript/src/functions/fetchOrchestration.js" range="7-25" :::

You can review the complete template project [here](https://github.com/Azure-Samples/durable-functions-quickstart-javascript-azd).
::: zone-end
::: zone pivot="programming-language-powershell"
The title fetching activities are tracked using a dynamic task list. The line `Wait-ActivityFunction -Task $parallelTasks` waits for all the called activities, which run concurrently, to complete. When done, all outputs are aggregated as a formatted string.

:::code language="powershell" source="~/functions-scenarios-durable-powershell/src/FetchOrchestration/run.ps1" :::

You can review the complete template project [here](https://github.com/Azure-Samples/durable-functions-quickstart-powershell-azd).
::: zone-end

After you verify your functions locally, it's time to deploy them to Azure.

## Deploy to Azure

Run this command from the root project folder to deploy your code project to the function app in Azure:

```console
azd deploy
```

The `azd deploy` command packages and deploys your code to the function app created during provisioning. After the command completes, the app starts and runs in the deployed package.

## Invoke the function on Azure

You can now invoke your orchestration endpoint in Azure by making an HTTP request to its URL. When your functions run in Azure, access key authorization is enforced, and you must provide a function access key with your request. 

You can use the Core Tools to get the URL endpoint of the HTTP trigger that starts the orchestration in Azure.

1. In your local terminal or command prompt, run these commands to get the URL endpoint values:
    
    ### [bash](#tab/bash)

    ```bash
    APP_NAME=$(azd env get-value AZURE_FUNCTION_NAME)
    func azure functionapp list-functions $APP_NAME --show-keys
    ```

    ### [PowerShell](#tab/powershell)
    ```powershell
    $APP_NAME = azd env get-value AZURE_FUNCTION_NAME
    func azure functionapp list-functions $APP_NAME --show-keys
    ```

    ### [Cmd](#tab/cmd)
    ```cmd
    for /f "tokens=*" %i in ('azd env get-value AZURE_FUNCTION_NAME') do set APP_NAME=%i
    func azure functionapp list-functions %APP_NAME% --show-keys 
    ``` 
    ---
    
    The `azd env get-value` command gets your function app name from the local environment. When you use the `--show-keys` option with `func azure functionapp list-functions`, the returned **Invoke URL:** value for each endpoint includes any required function-level access keys.

1. Use a browser or HTTP test tool to make a GET request to the HTTP start endpoint to start the orchestration in your function app running in Azure. 

## Redeploy your code

Run `azd deploy` as many times as you need to deploy code updates to your function app. If you need to update the Azure resources, run `azd provision` again.

>[!NOTE]
>The latest deployment package always overwrites deployed code files.

Your initial responses to `azd` prompts and any environment variables generated by `azd` are stored locally in your named environment. Use the `azd env get-values` command to review all of the variables in your environment that you used when creating Azure resources. 
 
## Clean up resources

When you're done working with your function app and related resources, use this command to delete the function app and its related resources from Azure and avoid incurring any further costs:

```console
azd down --no-prompt
```

>[!NOTE]  
>The `--no-prompt` option instructs `azd` to delete your resource group without a confirmation from you. 
>
>This command doesn't affect your local code project. 

## Related content

+ [Durable Functions overview](../durable-task/common/what-is-durable-task.md)
+ [Durable Task programming model](../durable-task/common/programming-model-overview.md)
+ [Durable Task Scheduler](../durable-task/scheduler/durable-task-scheduler.md)
+ [Azure Functions scenarios](functions-scenarios.md)
+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/)
+ [azd reference](/azure/developer/azure-developer-cli/reference)
