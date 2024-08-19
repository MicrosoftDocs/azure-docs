---
title: Create functions in Azure using the Azure Developer CLI
description: "Learn how to use the Azure Developer CLI (azd) to create resources and deploy the local project to a Flex Consumption plan on Azure."
ms.date: 11/08/2022
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy my function code securely to a new function app in the Flex Consumption plan in Azure by using azd templates and the azd up command.
---

# Quickstart: Create and deploy functions to Azure Functions using the Azure Developer CLI

In this Quickstart, you use Azure Developer command-line tools to create functions that respond to HTTP requests. After testing the code locally, you deploy it to a new serverless function app you create running in a Flex Consumption plan in Azure Functions. 

The project source uses the Azure Developer CLI (azd) to simplify deploying your code to Azure. This deployment follows current best practices for secure and scalable Azure Functions deployments.

[!INCLUDE [functions-flex-preview-note](../../includes/functions-flex-preview-note.md)]

Because of the Flex Consumption plan, completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).

+ [Azurite storage emulator](../storage/common/storage-use-azurite.md).

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
+ A secure HTTP test tool for sending HTTP GET and HTTP POST requests to your function endpoints. `<<link to source>>`

## Initialize the project

<!--- replace this with `azd init` after the samples make it into awesomeazd -->

The project is maintained in its own GitHub repository. You must first clone the project locally.

::: zone pivot="programming-language-csharp"  
1. In your local terminal or command prompt, run these commands to clone the sample repository:
 
    ```command
    git clone https://github.com/Azure-Samples/functions-quickstart-dotnet-azd
    cd functions-quickstart-dotnet-azd/FunctionHttp
    ```

1. Create a file named _local.settings.json_ in the function app folder (_FunctionHttp_), and add this data to the file, which is required to run locally:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "UseDevelopmentStorage=true",
            "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
        }
    }
    ```
::: zone-end  
::: zone pivot="programming-language-java"  
1. In your local terminal or command prompt, run these commands to clone the sample repository:
 
    ```command
    git clone https://github.com/Azure-Samples/azure-functions-java-flex-consumption-azd
    cd azure-functions-java-flex-consumption-azd
    ```

1. Run this command to restore the _local.settings.json_ file, which is required to run locally:

    ```command
    func init --worker-runtime java
    ```
::: zone-end  
::: zone pivot="programming-language-javascript"  
1. In your local terminal or command prompt, run these commands to clone the sample repository:
 
    ```command
    git clone https://github.com/Azure-Samples/functions-quickstart-javascript-azd
    cd functions-quickstart-javascript-azd
    ```

1. Run this command to restore the _local.settings.json_ file, which is required to run locally:

    ```command
    func init --worker-runtime javascript
    ```
::: zone-end  
::: zone pivot="programming-language-powershell"  
1. In your local terminal or command prompt, run these commands to clone the sample repository:
 
    ```command
    git clone https://github.com/Azure-Samples/functions-quickstart-powershell-azd
    cd functions-quickstart-powershell-azd
    ```
1. Run this command to restore the _local.settings.json_ file, which is required to run locally:

    ```command
    func init --worker-runtime powershell
    ```
::: zone-end  
::: zone pivot="programming-language-typescript"  
1. In your local terminal or command prompt, run these commands to clone the sample repository:
 
    ```command
    git clone https://github.com/Azure-Samples/functions-quickstart-typescript-azd
    cd functions-quickstart-typescript-azd
    ```
1. Run this command to restore the _local.settings.json_ file, which is required to run locally:

    ```command
    func init --worker-runtime typescript
    ```
::: zone-end  
::: zone pivot="programming-language-python"  
1. In your local terminal or command prompt, run these commands to clone the sample repository:
 
    ### [Command / bash](#tab/cmd+bash)

    ```bash
    git clone https://github.com/Azure-Samples/functions-quickstart-python-http-azd
    cd functions-quickstart-python-http-azd
    ```
    
    ---

1. Run this command to restore the _local.settings.json_ file, which is required to run locally:

    ### [Command / bash](#tab/cmd+bash)

    ```command
    func init --worker-runtime python 
    ```

## Create and activate a virtual environment

In a suitable folder, run these commands to create and activate a virtual environment named `.venv`:

### [Command](#tab/cmd)

```cmd
py -m venv .venv
```

```cmd
.venv\scripts\activate
```

### [bash](#tab/bash)

```bash
python -m venv .venv
```

```bash
source .venv/bin/activate
```

If Python didn't install the venv package on your Linux distribution, run the following command:

```bash
sudo apt-get install python3-venv
```
---

::: zone-end

## Run in your local environment  
::: zone pivot="programming-language-csharp"  
1. From the terminal or command prompt, use this command to start the Azurite storage emulator: 

    ```command
    start azurite
    ``` 

1. In a second terminal or command prompt, run this command in your project's root folder (_FunctionHttp_):

    ```command
    func start
    ``` 

    When the Azure Functions host starts in your local project folder, it displays the URL endpoints of the HTTP triggered functions in your project. 

1. From your HTTP test tool in a second terminal or from a browser, call the HTTP GET endpoint, which should look like this URL:

    <http://localhost:7071/api/httpget>

1. From your HTTP test tool in a second terminal, send an HTTP POST request like this example:

    :::code language="csharp" source="~/functions-quickstart-dotnet-azd/FunctionHttp/test.http" range="5-11":::

You can find examples of both HTTP requests in the test.http project file.  
::: zone-end

## Review the code (optional)
::: zone pivot="programming-language-csharp"  
You can review the code that defines two HTTP triggered function endpoints:
    
### `httpget`

:::code language="csharp" source="~/functions-quickstart-dotnet-azd/FunctionHttp/httpGetFunction.cs" :::

 ### `httppostbody`
  
:::code language="csharp" source="~/functions-quickstart-dotnet-azd/FunctionHttp/httpPostBodyFunction.cs" :::
::: zone-end
::: zone pivot="programming-language-java" 
You can review the code that defines the `httpexample` function:
:::code language="java" source="~/functions-quickstart-java-azd/http/src/main/java/com/contoso/Function.java" :::
::: zone-end  

## Deploy to Azure

After you've verified your function executions locally, you can publish them to Azure. This project is configured to use the `azd up` command to create the Azure resources required to host the project in a function app running in the Flex Consmption plan. This project uses the best practices for securing an app in the Flex consumption plan, including using only managed identities (instead of stored connection strings) and running in a virtual network.

1. Before deploying, you must be signed-in to Azure using your account credentials. To sign-in, run this command:

    ```azd
    azd auth login
    ```

1. Run this command to create the Azure resources and deploy your app to Azure.

    ```azd
    azd up
    ```

1. When prompted, provide these parameters, which are required for deployment:

    * _Azure location_: Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.
    * _Azure subscription_: Subscription in which your resources are created. 
    
The `azd up` command applies your reponse to these prompts to the Bicep configuration files to perform these two primary tasks:

+ Create and configure all required Azure resources for secure deployment ([`azd provision`](/azure/developer/azure-developer-cli/reference#azd-provision)), which includes:
    * Flex Consumption plan and function app.
    * Azure Storage (required) and Application Insights (recommended).
    * Access policies and roles for your account.
    * Service-to-service connections using managed identities (instead of stored connection strings).
    * Virtual network to securely run both the function app and the other Azure resources.
* Package and deploy your code to the deployment container ([`azd deploy`](/azure/developer/azure-developer-cli/reference#azd-deploy)).

After the command completes successfully, you see links to the resources created. 

You can run the `azd up` command as many times as you like to both provision and deploy updates to your application. During subsequent executions, existing resources are skipped, but deployed code files are always overwritten by the latest deployment package. 

## Invoke the function on Azure

Because your function uses an HTTP trigger, you invoke it by making an HTTP request to its URL in the browser or with a tool like curl. 

1. From your HTTP test tool in a second terminal or from a browser, call the HTTP GET endpoint, which should look like this URL:

    <http://localhost:7071/api/httpget>

1. From your HTTP test tool in a second terminal, send an HTTP POST request like this example:

    :::code language="csharp" source="~/functions-quickstart-dotnet-azd/FunctionHttp/test.http" range="5-11":::

## Review Bicep files (optional)

 `<<to-do>>`

## Clean up resources

When you are done working with your function app and related resources, you can use this command to delete the function app and its related resources from Azure and avoid incurring any further costs:

```azd
azd down
```

This command doesn't affect your source code repository. For more information about Functions costs, see [Estimating Flex Consumption plan costs](./flex-consumption-plan.md#billing).

## Related content

