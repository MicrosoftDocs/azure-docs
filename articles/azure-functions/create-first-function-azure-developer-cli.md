---
title: Build a scalable web API using Azure Functions
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy a scalable web API project to a Flex Consumption plan on Azure."
ms.date: 11/24/2025
ms.topic: quickstart
ms.custom:
  - ignite-2024
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy my function code securely to a new function app in the Flex Consumption plan in Azure by using azd templates and the azd up command.
---

# Quickstart: Build a scalable web API using Azure Functions

In this quickstart, you use Azure Developer command-line tools to build a scalable web API with function endpoints that respond to HTTP requests. After testing the code locally, you deploy it to a new serverless function app you create running in a Flex Consumption plan in Azure Functions. 

The project source uses the Azure Developer CLI (azd) to simplify deploying your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments.

By default, the Flex Consumption plan follows a _pay-for-what-you-use_ billing model, which means completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools)

[!INCLUDE [functions-requirements-azure-cli](../../includes/functions-requirements-azure-cli.md)]

+ A [secure HTTP test tool](functions-develop-local.md#http-test-tools) for sending requests with JSON payloads to your function endpoints. This article uses `curl`.

## Initialize the project

Use the `azd init` command to create a local Azure Functions code project from a template.

::: zone pivot="programming-language-csharp"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-dotnet-azd -e httpendpoint-dotnet
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

1. Run this command to navigate to the `http` app folder:

    ```console
    cd http
    ```

1. Create a file named _local.settings.json_ in the `http` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
        }
    }
    ```

    This file is required when running locally.
::: zone-end  
::: zone pivot="programming-language-java"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template azure-functions-java-flex-consumption-azd -e httpendpoint-java 
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/azure-functions-java-flex-consumption-azd) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

1. Run this command to navigate to the `http` app folder:

    ```console
    cd http
    ```

1. Create a file named _local.settings.json_ in the `http` folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "java"
        }
    }
    ```

    This file is required when running locally.
::: zone-end  
::: zone pivot="programming-language-javascript"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-javascript-azd -e httpendpoint-js
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-javascript-azd) and initializes the project in the root folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

1. Create a file named _local.settings.json_ in the root folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "node"
        }
    }
    ```

    This file is required when running locally.
::: zone-end  
::: zone pivot="programming-language-powershell"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-powershell-azd -e httpendpoint-ps
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-powershell-azd) and initializes the project in the root folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

1. Run this command to navigate to the `src` app folder:

    ```console
    cd src
    ```

1. Create a file named _local.settings.json_ in the `src`  folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "powershell",
            "FUNCTIONS_WORKER_RUNTIME_VERSION": "7.2"
        }
    }
    ```

    This file is required when running locally.
::: zone-end  
::: zone pivot="programming-language-typescript"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-typescript-azd -e httpendpoint-ts
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-typescript-azd) and initializes the project in the root folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Create a file named _local.settings.json_ in the root folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "node"
        }
    }
    ```

    This file is required when running locally.
::: zone-end  
::: zone pivot="programming-language-python"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-python-http-azd -e httpendpoint-py
    ```
        
    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-python-http-azd) and initializes the project in the root folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name is also used in the name of the resource group you create in Azure. 

1. Create a file named _local.settings.json_ in the root folder that contains this JSON data:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "python"
        }
    }
    ```

    This file is required when running locally.

## Create and activate a virtual environment

In the root folder, run these commands to create and activate a virtual environment named `.venv`:

### [Linux/macOS](#tab/linux)

```bash
python3 -m venv .venv
source .venv/bin/activate
```

If Python doesn't install the venv package on your Linux distribution, run the following command:

```bash
sudo apt-get install python3-venv
```

### [Windows (bash)](#tab/windows-bash)

```bash
py -m venv .venv
source .venv/scripts/activate
```

### [Windows (Cmd)](#tab/windows-cmd)

```shell
py -m venv .venv
.venv\scripts\activate
```

---

::: zone-end

## Run in your local environment  

1. Run this command from your app folder in a terminal or command prompt:

    ::: zone pivot="programming-language-csharp, programming-language-powershell,programming-language-python" 
    ```console
    func start
    ``` 
    ::: zone-end  
    ::: zone pivot="programming-language-java"  
    ```console
    mvn clean package
    mvn azure-functions:run
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-javascript"  
    ```console
    npm install
    func start  
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-typescript"  
    ```console
    npm install
    npm start  
    ```
    ::: zone-end  

    When the Functions host starts in your local project folder, it writes the URL endpoints of your HTTP triggered functions to the terminal output. 

    >[!NOTE]
    > Because access key authorization isn't enforced when running locally, the function URL returned doesn't include the access key value and you don't need it to call your function. 

1. In your browser, go to the `httpget` endpoint, which should look like this URL:

    <http://localhost:7071/api/httpget>

1. From a new terminal or command prompt window, run this `curl` command to send a POST request with a JSON payload to the `httppost` endpoint: 
    ::: zone pivot="programming-language-csharp, programming-language-powershell,programming-language-python" 
    ```console
    curl -i http://localhost:7071/api/httppost -H "Content-Type: text/json" -d @testdata.json
    ```
    ::: zone-end  
    ::: zone pivot="programming-language-javascript,programming-language-typescript" 
    ```console
    curl -i http://localhost:7071/api/httppost -H "Content-Type: text/json" -d "@src/functions/testdata.json"
    ```
    ::: zone-end  
    This command reads JSON payload data from the `testdata.json` project file. You can find examples of both HTTP requests in the `test.http` project file. 

1. When you're done, press Ctrl+C in the terminal window to stop the `func.exe` host process.
::: zone pivot="programming-language-python"
5. Run `deactivate` to shut down the virtual environment.
::: zone-end

## Review the code (optional)

You can review the code that defines the two HTTP trigger function endpoints:
    
### [`httpget`](#tab/get)
::: zone pivot="programming-language-csharp"  
:::code language="csharp" source="~/functions-quickstart-dotnet-azd/http/httpGetFunction.cs" range="17-29" :::
::: zone-end  
::: zone pivot="programming-language-java" 
:::code language="java" source="~/functions-quickstart-java-azd/http/src/main/java/com/contoso/Function.java" range="24-38" :::
::: zone-end  
::: zone pivot="programming-language-javascript" 
:::code language="javascript" source="~/functions-quickstart-javascript-azd/src/functions/httpGetFunction.js" :::
::: zone-end  
::: zone pivot="programming-language-typescript" 
:::code language="typescript" source="~/functions-quickstart-typescript-azd/src/functions/httpGetFunction.ts" :::
::: zone-end  
::: zone pivot="programming-language-powershell" 
This `function.json` file defines the `httpget` function:
:::code language="json" source="~/functions-quickstart-powershell-azd/src/httpGetFunction/function.json" :::
This `run.ps1` file implements the function code:
:::code language="powershell" source="~/functions-quickstart-powershell-azd/src/httpGetFunction/run.ps1" :::
::: zone-end  
::: zone pivot="programming-language-python" 
:::code language="python" source="~/functions-quickstart-python-azd/function_app.py" range="6-12" :::
::: zone-end  
    
### [`httppost`](#tab/post)
 
::: zone pivot="programming-language-csharp"   
:::code language="csharp" source="~/functions-quickstart-dotnet-azd/http/httpPostBodyFunction.cs" range="19-35":::  
::: zone-end  
::: zone pivot="programming-language-java" 
:::code language="java" source="~/functions-quickstart-java-azd/http/src/main/java/com/contoso/Function.java" range="44-71" :::
::: zone-end  
::: zone pivot="programming-language-javascript" 
:::code language="javascript" source="~/functions-quickstart-javascript-azd/src/functions/httpPostBodyFunction.js" :::
::: zone-end  
::: zone pivot="programming-language-typescript" 
:::code language="typescript" source="~/functions-quickstart-typescript-azd/src/functions/httpPostBodyFunction.ts" :::
::: zone-end  
::: zone pivot="programming-language-powershell" 
This `function.json` file defines the `httppost` function:
:::code language="json" source="~/functions-quickstart-powershell-azd/src/httpPostBodyFunction/function.json" :::
This `run.ps1` file implements the function code:
:::code language="powershell" source="~/functions-quickstart-powershell-azd/src/httpPostBodyFunction/run.ps1" :::
::: zone-end   
::: zone pivot="programming-language-python" 
:::code language="python" source="~/functions-quickstart-python-azd/function_app.py" range="14-34" :::
::: zone-end  

---

::: zone pivot="programming-language-csharp"  
You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd).
::: zone-end  
::: zone pivot="programming-language-java" 
You can review the complete template project [here](https://github.com/Azure-Samples/azure-functions-java-flex-consumption-azd).
::: zone-end  
::: zone pivot="programming-language-javascript" 
You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-javascript-azd).
::: zone-end  
::: zone pivot="programming-language-typescript" 
You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-typescript-azd).
::: zone-end  
::: zone pivot="programming-language-powershell" 
You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-powershell-azd).
::: zone-end  
::: zone pivot="programming-language-python" 
You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-python-http-azd).
::: zone-end  
After you verify your functions locally, it's time to publish them to Azure. 
 
## Deploy to Azure

This project is configured to use the `azd up` command to deploy this project to a new function app in a Flex Consumption plan in Azure.

>[!TIP]
>The project includes a set of Bicep files (in the `infra` folder) that `azd` uses to create a secure deployment to a Flex consumption plan that follows best practices.

1. Run this command to have `azd` create the required Azure resources in Azure and deploy your code project to the new function app:

    ```console
    azd up
    ```

    The root folder contains the `azure.yaml` definition file required by `azd`. 

    If you're not already signed in, you're asked to authenticate with your Azure account.

1. When prompted, provide these required deployment parameters:

    | Parameter | Description |
    | ---- | ---- |
    | _Azure subscription_ | Subscription in which your resources are created.|
    | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|
    |  _vnetEnabled_ | Choose _False_. When set to _True_ the deployment creates your function app in a new virtual network. |
    
    The `azd up` command uses your responses to these prompts with the Bicep configuration files to complete these deployment tasks:

    + Create and configure these required Azure resources (equivalent to `azd provision`):

        + Flex Consumption plan and function app
        + Azure Storage (required) and Application Insights (recommended)
        + Access policies and roles for your account
        + Service-to-service connections using managed identities (instead of stored connection strings)
        + (Option) Virtual network to securely run both the function app and the other Azure resources

    + Package and deploy your code to the deployment container (equivalent to `azd deploy`). The app is then started and runs in the deployed package. 

    After the command completes successfully, you see links to the resources you created. 

## Invoke the function on Azure

You can now invoke your function endpoints in Azure by making HTTP requests to their URLs by using your HTTP test tool or from the browser (for GET requests). When your functions run in Azure, access key authorization is enforced, and you must provide a function access key with your request. 

You can use the Core Tools to get the URL endpoints of your functions running in Azure.

1. In your local terminal or command prompt, run these commands to get the URL endpoint values:
    ::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-java,programming-language-python" 
    ### [bash](#tab/bash)

    ```bash
    SET APP_NAME=$(azd env get-value AZURE_FUNCTION_NAME)
    func azure functionapp list-functions $APP_NAME --show-keys
    ```

    ### [Cmd](#tab/cmd)
    ```cmd
    for /f "tokens=*" %i in ('azd env get-value AZURE_FUNCTION_NAME') do set APP_NAME=%i
    func azure functionapp list-functions %APP_NAME% --show-keys 
    ``` 
    ---
    
    ::: zone-end  
    ::: zone pivot="programming-language-powershell"  
    ### [PowerShell](#tab/powershell)
    ```powershell
    $APP_NAME = azd env get-value AZURE_FUNCTION_NAME
    func azure functionapp list-functions $APP_NAME --show-keys
    ```

    ### [Cmd](#tab/cmd2)
    ```cmd
    for /f "tokens=*" %i in ('azd env get-value AZURE_FUNCTION_NAME') do set APP_NAME=%i
    func azure functionapp list-functions %APP_NAME% --show-keys 
    ``` 
    ---

    ::: zone-end  
    The `azd env get-value` command gets your function app name from the local environment. When you use the `--show-keys` option with `func azure functionapp list-functions`, the returned **Invoke URL:** value for each endpoint includes a function-level access key.

1. As before, use your HTTP test tool to validate these URLs in your function app running in Azure. 
  
## Redeploy your code

Run the `azd up` command as many times as you need to both provision your Azure resources and deploy code updates to your function app. 

>[!NOTE]
>Deployed code files are always overwritten by the latest deployment package.

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

+ [Azure Functions scenarios](functions-scenarios.md)
+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/)
+ [azd reference](/azure/developer/azure-developer-cli/reference)
+ [Azure Functions Core Tools reference](functions-core-tools-reference.md)
+ [Code and test Azure Functions locally](functions-develop-local.md)
