---
title: Create functions in Azure using the Azure Developer CLI
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy the local project to a Flex Consumption plan on Azure."
ms.date: 08/27/2024
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy my function code securely to a new function app in the Flex Consumption plan in Azure by using azd templates and the azd up command.
---

# Quickstart: Create and deploy functions to Azure Functions using the Azure Developer CLI

In this Quickstart, you use Azure Developer command-line tools to create functions that respond to HTTP requests. After testing the code locally, you deploy it to a new serverless function app you create running in a Flex Consumption plan in Azure Functions. 

The project source uses the Azure Developer CLI (azd) to simplify deploying your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments.

[!INCLUDE [functions-flex-preview-note](../../includes/functions-flex-preview-note.md)]

By default, the Flex Consumption plan follows a _pay for what you use_ billing model, which means completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools).

::: zone pivot="programming-language-csharp"  
+ [.NET 8.0 SDK](https://dotnet.microsoft.com/download).  
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
+ A secure HTTP test tool for sending HTTP GET and HTTP POST requests to your function endpoints. For more information, see [HTTP test tools](functions-develop-local.md#http-test-tools).

## Initialize the project

You can use the `azd init` command to create a local Azure Functions code project from a template.

::: zone pivot="programming-language-csharp"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-dotnet-azd
    cd http
    ```
[!INCLUDE [functions-quickstart-azd-env](../../includes/functions-quickstart-azd-env.md)]

3. Create a file named _local.settings.json_ in the app's root folder (`/http`), and add this JSON data to the file:

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
    azd init --template azure-functions-java-flex-consumption-azd 
    cd http
    ```

[!INCLUDE [functions-quickstart-azd-env](../../includes/functions-quickstart-azd-env.md)]

3. Run this command in the app's root folder (`http`):

    ```console
    func init --worker-runtime java
    ```
    
    This command restores the _local.settings.json_ file in the app's root folder (`http`), which is required when running locally.
::: zone-end  
::: zone pivot="programming-language-javascript"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-javascript-azd 
    ```

[!INCLUDE [functions-quickstart-azd-env](../../includes/functions-quickstart-azd-env.md)]

3. Run this command in the root folder: 

    ```console
    func init --worker-runtime javascript
    ```

    This command restores the _local.settings.json_ file in the root folder, which is required when running locally.
::: zone-end  
::: zone pivot="programming-language-powershell"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-powershell-azd
    cd src
    ```

[!INCLUDE [functions-quickstart-azd-env](../../includes/functions-quickstart-azd-env.md)]

3.  Run this command in the app's root folder (`src`):

    ```console
    func init --worker-runtime powershell
    ```

    This command restores the _local.settings.json_ file in the app's root folder (`src`), which is required when running locally.
::: zone-end  
::: zone pivot="programming-language-typescript"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-typescript-azd
    ```

[!INCLUDE [functions-quickstart-azd-env](../../includes/functions-quickstart-azd-env.md)]

3. Run this command in the root folder:

    ```console
    func init --worker-runtime typescript
    ```

    This command restores the _local.settings.json_ file in the root folder, which is required when running locally.
::: zone-end  
::: zone pivot="programming-language-python"  
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-python-http-azd
    ```

[!INCLUDE [functions-quickstart-azd-env](../../includes/functions-quickstart-azd-env.md)]

3. Run this command in the root folder:

    ```bash
    func init --worker-runtime python 
    ```
    This command restores the _local.settings.json_ file in the root folder, which is required when running locally.

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

### [Windows](#tab/windows)

```shell
py -m venv .venv
.venv\scripts\activate
```

---

::: zone-end

## Run in your local environment  

1. Run this command from your project's root folder in a terminal or command prompt:

    ::: zone pivot="programming-language-csharp, programming-language-powershell,programming-language-python,programming-language-javascript" 
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
    ::: zone pivot="programming-language-typescript"
    ```console
    npm start  
    ```
    ::: zone-end  

    When the Azure Functions host starts in your local project folder, it displays the URL endpoints of the HTTP triggered functions in your project. 

1. From your HTTP test tool in a new terminal (or from your browser), call the HTTP GET endpoint, which should look like this URL:

    <http://localhost:7071/api/httpget>

1. From your HTTP test tool in a new terminal, send an HTTP POST request with a JSON payload like in this example:

    :::code language="http" source="~/functions-quickstart-dotnet-azd/http/test.http" range="5-11" :::

    You can find examples of both HTTP requests in the _test.http_ project file. 

1. When you're done, press Ctrl+C in the terminal window to stop the `func.exe` host process.
::: zone pivot="programming-language-python"
5.  Run `deactivate` to shut down the virtual environment.
::: zone-end

## Review the code (optional)

You can review the code that defines the two HTTP trigger function endpoints:
    
### [`httpget`](#tab/get)
::: zone pivot="programming-language-csharp"  
:::code language="csharp" source="~/functions-quickstart-dotnet-azd/http/httpGetFunction.cs" range="17-28" :::
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
:::code language="csharp" source="~/functions-quickstart-dotnet-azd/http/httpPostBodyFunction.cs" range="19-31":::  
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

After you verify your functions locally, it's time to publish them to Azure. 
 
## Deploy to Azure

This project is configured to use the `azd up` command to deploy this project to a new function app in a Flex Consumption plan in Azure.

>[!TIP]
>This project includes a set of Bicep files that `azd` uses to create a best practices secure deployment to a Flex consumption plan.

1. Run this command to create the Azure resources and deploy your app to Azure.

    ```console
    azd up
    ```

    If you aren't already signed-in, you're asked to authenticate with your Azure account.

1. When prompted, provide these required deployment parameters:

    + _Azure subscription_: Subscription in which your resources are created. 
    + _Azure location_: Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.
    
    The `azd up` command uses your response to these prompts with the Bicep configuration files to complete these deployment tasks:

    + Create and configure these required Azure resources (equivalent to [`azd provision`](/azure/developer/azure-developer-cli/reference#azd-provision)):

        + Flex Consumption plan and function app
        + Azure Storage (required) and Application Insights (recommended)
        + Access policies and roles for your account
        + Service-to-service connections using managed identities (instead of stored connection strings)
        + Virtual network to securely run both the function app and the other Azure resources

    + Package and deploy your code to the deployment container (equivalent to [`azd deploy`](/azure/developer/azure-developer-cli/reference#azd-deploy)). The app is then started and runs in the deployed package. 

1.  After the command completes successfully, you see links to the resources created. Make a copy of the **Function App** name. If you forgot to save the app name, you can always get it again using the `azd env get-values` command and copying `AZURE_FUNCTION_NAME`.  

## Invoke the function on Azure

You can now invoke your function endpoints in Azure by making HTTP requests to their URLs using your HTTP test tool or from the browser (for GET requests). When your functions run in Azure, access key authorization is enforced, and you must provide a function access key with your request. 

You can use the Core Tools to obtain the URL endpoints of your functions running in Azure, along with their required access key values.

1. In your local terminal or command prompt, run this `func azure functionapp list-functions` command:
 
    ```console
    func azure functionapp list-functions <APP_NAME> --show-keys 
    ``` 
    
    In this example, replace `<APP_NAME>` with the name of the function app created by azd during deployment. Using the `--show-keys` option means that the returned **Invoke URL:** value for each endpoint includes a function-level access key.

1. As before, use your HTTP test tool to validate these URLs in your function app running in Azure. 

## Redeploy your code

Your responses to `azd` prompts and other environment variables generated by `azd` are stored in your named environment. This means that you can run the `azd up` command as many times as you need to both reprovision your function app and deploy updates to your source code. During subsequent executions, existing resources are skipped. Deployed code files are always overwritten by the latest deployment package. 

Use the `azd env get-values` command to review all of the variables in your environment that were used when creating Azure resources. 

## Clean up resources

When you're done working with your function app and related resources, you can use this command to delete the function app and its related resources from Azure and avoid incurring any further costs:

```console
azd down
```

This command doesn't affect your local code project. 

## Related content

+ [Flex Consumption plan](flex-consumption-plan.md)
+ [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/)
+ [Azure Functions Core Tools reference](functions-core-tools-reference.md)
+ [Code and test Azure Functions locally](functions-develop-local.md)
