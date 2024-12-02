---
title: Create functions in Azure using the Azure Developer CLI
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy the local project to a Flex Consumption plan on Azure."
ms.date: 10/19/2024
ms.topic: quickstart
ms.custom:
  - ignite-2024
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy my function code securely to a new function app in the Flex Consumption plan in Azure by using azd templates and the azd up command.
---

# Quickstart: Create and deploy functions to Azure Functions using the Azure Developer CLI

In this Quickstart, you use Azure Developer command-line tools to create functions that respond to HTTP requests. After testing the code locally, you deploy it to a new serverless function app you create running in a Flex Consumption plan in Azure Functions. 

The project source uses the Azure Developer CLI (azd) to simplify deploying your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments.

By default, the Flex Consumption plan follows a _pay-for-what-you-use_ billing model, which means to complete this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools).

::: zone pivot="programming-language-csharp"  
+ [.NET 8.0 SDK](https://dotnet.microsoft.com/download)

+ [Azurite storage emulator](../storage/common/storage-use-azurite.md?tabs=npm#install-azurite) 
::: zone-end  
::: zone pivot="programming-language-java"  
+ [Java 17 Developer Kit](/azure/developer/java/fundamentals/java-support-on-azure)
    + If you use another [supported version of Java](supported-languages.md?pivots=programming-language-java#languages-by-runtime-version), you must update the project's pom.xml file. 
    + The `JAVA_HOME` environment variable must be set to the install location of the correct version of the JDK.
+ [Apache Maven 3.8.x](https://maven.apache.org)  
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
+ [Node.js 20](https://nodejs.org/)  
::: zone-end  
::: zone pivot="programming-language-powershell"  
+ [PowerShell 7.2](/powershell/scripting/install/installing-powershell-core-on-windows)

+ [.NET 6.0 SDK](https://dotnet.microsoft.com/download)  
::: zone-end
::: zone pivot="programming-language-python" 
+ [Python 3.11](https://www.python.org/).
::: zone-end  
+ A [secure HTTP test tool](functions-develop-local.md#http-test-tools) for sending requests with JSON payloads to your function endpoints. This article uses `curl`.

## Initialize the project

You can use the `azd init` command to create a local Azure Functions code project from a template.

::: zone pivot="programming-language-csharp"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-dotnet-azd -e flexquickstart-dotnet
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

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
    azd init --template azure-functions-java-flex-consumption-azd -e flexquickstart-java 
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/azure-functions-java-flex-consumption-azd) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

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
    azd init --template functions-quickstart-javascript-azd -e flexquickstart-js
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-javascript-azd) and initializes the project in the root folder. The `-e` flag sets a name for the current environment. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

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
    azd init --template functions-quickstart-powershell-azd -e flexquickstart-ps
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-powershell-azd) and initializes the project in the root folder. The `-e` flag sets a name for the current environment. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

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
    azd init --template functions-quickstart-typescript-azd -e flexquickstart-ts
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-typescript-azd) and initializes the project in the root folder. The `-e` flag sets a name for the current environment. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

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
    azd init --template functions-quickstart-python-http-azd -e flexquickstart-py
    ```
        
    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-python-http-azd) and initializes the project in the root folder. The `-e` flag sets a name for the current environment. In `azd`, the environment is used to maintain a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure. 

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

If Python didn't install the venv package on your Linux distribution, run the following command:

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

1. In your browser, navigate to the `httpget` endpoint, which should look like this URL:

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
::: zone pivot="programming-language-java" 
## Create Azure resources

This project is configured to use the `azd provision` command to create a function app in a Flex Consumption plan, along with other required Azure resources.

>[!NOTE]
>This project includes a set of Bicep files that `azd` uses to create a secure deployment to a Flex consumption plan that follows best practices. 
>
>The `azd up` and `azd deploy` commands aren't currently supported for Java apps.

1. In the root folder of the project, run this command to create the required Azure resources:

    ```console
    azd provision
    ```

    The root folder contains the `azure.yaml` definition file required by `azd`. 

    If you aren't already signed-in, you're asked to authenticate with your Azure account.

1. When prompted, provide these required deployment parameters:

    | Parameter | Description |
    | ---- | ---- |
    | _Azure subscription_ | Subscription in which your resources are created.|
    | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|
    
    The `azd provision` command uses your response to these prompts with the Bicep configuration files to create and configure these required Azure resources:

    + Flex Consumption plan and function app
    + Azure Storage (required) and Application Insights (recommended)
    + Access policies and roles for your account
    + Service-to-service connections using managed identities (instead of stored connection strings)
    + Virtual network to securely run both the function app and the other Azure resources

    After the command completes successfully, you can deploy your project code to this new function app in Azure. 

## Deploy to Azure

You can use Core Tools to package your code and deploy it to Azure from the `target` output folder. 

1. Navigate to the app folder equivalent in the `target` output folder:

    ```console
    cd http/target/azure-functions/contoso-functions
    ```
    
    This folder should have a host.json file, which indicates that it's the root of your compiled Java function app.
 
1. Run these commands to deploy your compiled Java code project to the new function app resource in Azure using Core Tools:
 
    ### [bash](#tab/bash)

    ```bash
    APP_NAME=$(azd env get-value AZURE_FUNCTION_NAME)
    func azure functionapp publish $APP_NAME
    ```

    ### [Cmd](#tab/cmd)
    ```cmd
    for /f "tokens=*" %i in ('azd env get-value AZURE_FUNCTION_NAME') do set APP_NAME=%i
    func azure functionapp publish %APP_NAME% 
    ``` 

    ---

    The `azd env get-value` command gets your function app name from the local environment, which is required for deployment using `func azure functionapp publish`. After publishing completes successfully, you see links to the HTTP trigger endpoints in Azure. 
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
## Deploy to Azure

This project is configured to use the `azd up` command to deploy this project to a new function app in a Flex Consumption plan in Azure.

>[!TIP]
>This project includes a set of Bicep files that `azd` uses to create a secure deployment to a Flex consumption plan that follows best practices.

1. Run this command to have `azd` create the required Azure resources in Azure and deploy your code project to the new function app:

    ```console
    azd up
    ```

    The root folder contains the `azure.yaml` definition file required by `azd`. 

    If you aren't already signed-in, you're asked to authenticate with your Azure account.

1. When prompted, provide these required deployment parameters:

    | Parameter | Description |
    | ---- | ---- |
    | _Azure subscription_ | Subscription in which your resources are created.|
    | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|
    
    The `azd up` command uses your response to these prompts with the Bicep configuration files to complete these deployment tasks:

    + Create and configure these required Azure resources (equivalent to `azd provision`):

        + Flex Consumption plan and function app
        + Azure Storage (required) and Application Insights (recommended)
        + Access policies and roles for your account
        + Service-to-service connections using managed identities (instead of stored connection strings)
        + Virtual network to securely run both the function app and the other Azure resources

    + Package and deploy your code to the deployment container (equivalent to `azd deploy`). The app is then started and runs in the deployed package. 

    After the command completes successfully, you see links to the resources you created. 
::: zone-end
## Invoke the function on Azure

You can now invoke your function endpoints in Azure by making HTTP requests to their URLs using your HTTP test tool or from the browser (for GET requests). When your functions run in Azure, access key authorization is enforced, and you must provide a function access key with your request. 

You can use the Core Tools to obtain the URL endpoints of your functions running in Azure.

1. In your local terminal or command prompt, run these commands to get the URL endpoint values:
    ::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-java,programming-language-python" 
    ### [bash](#tab/bash)

    ```bash
    SET APP_NAME=(azd env get-value AZURE_FUNCTION_NAME)
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
    The `azd env get-value` command gets your function app name from the local environment. Using the `--show-keys` option with `func azure functionapp list-functions` means that the returned **Invoke URL:** value for each endpoint includes a function-level access key.

2. As before, use your HTTP test tool to validate these URLs in your function app running in Azure. 
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
## Redeploy your code

You can run the `azd up` command as many times as you need to both provision your Azure resources and deploy code updates to your function app. 

>[!NOTE]
>Deployed code files are always overwritten by the latest deployment package.

Your initial responses to `azd` prompts and any environment variables generated by `azd` are stored locally in your named environment. Use the `azd env get-values` command to review all of the variables in your environment that were used when creating Azure resources. 
::: zone-end  
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

+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/)
+ [azd reference](/azure/developer/azure-developer-cli/reference)
+ [Azure Functions Core Tools reference](functions-core-tools-reference.md)
+ [Code and test Azure Functions locally](functions-develop-local.md)
