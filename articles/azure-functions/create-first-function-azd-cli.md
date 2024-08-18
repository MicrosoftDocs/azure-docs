---
title: Create functions in Azure using the Azure Developer CLI
description: "Learn how to create a C# function from the command line, then publish the local project to serverless hosting in Azure Functions."
ms.date: 11/08/2022
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions
#customer intent: 
---

# Quickstart: Create and deploy functions to Azure Functions using the Azure Developer CLI

In this Quickstart, you use Azure Developer command-line tools to create a function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions. 

The project you acquire is configured to use the Azure Developer CLI (azd). This command-line interface simplies the process to create your function app and required resources in Azure and deploy your code using the `azd up` command. The deployment creates a function app running on the Flex Consumption plan in a virtual network. Connections between services are made using managed identities instead of stored connection strings. This deployment follows current best practices for secure and scalable Azure Functions deployments.

[!INCLUDE [functions-flex-preview-note](../../includes/functions-flex-preview-note.md)]

Because of the Flex Consumption plan, completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd).

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools)
::: zone pivot="programming-language-csharp"  
+ [.NET 8.0 SDK](https://dotnet.microsoft.com/download).
::: zone-end  
::: zone pivot="programming-language-java"  
+ [Java Developer Kit](/azure/developer/java/fundamentals/java-support-on-azure), version: 8, 11, 17, 21 (Linux only).  
   The `JAVA_HOME` environment variable must be set to the install location of the correct version of the JDK.

+ [Apache Maven](https://maven.apache.org), version 3.0 or above.  
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
+ [Node.js](https://nodejs.org/) version 18 or above.  
::: zone-end  
::: zone pivot="programming-language-powershell"  
+ [PowerShell 7.2](/powershell/scripting/install/installing-powershell-core-on-windows)

+ [.NET 6.0 SDK](https://dotnet.microsoft.com/download)  
::: zone-end
::: zone pivot="programming-language-python" 
+ [A Python version supported by Azure Functions](supported-languages.md#languages-by-runtime-version).
::: zone-end  

## Initialize the project

<!--- replace this with `azd init` after the samples make it into awesomeazd -->

The project is maintained in its own GitHub repository. You must first clone the project locally.

::: zone pivot="programming-language-csharp" 
1. In your local terminal or command prompt, run these commands to clone the sample repository:
 
    ```command
    git clone https://github.com/Azure-Samples/functions-quickstart-dotnet-azd
    cd functions-quickstart-dotnet-azd
    ```

1. Run this command to restore the _local.settings.json_ file, which is required to run locally:

    ```command
    func init --worker-runtime dotnet-isolated --target-framework net8.0
    ```
3. (Optional) Review the code that defines the functions:
    <detail>
    <summary>`httpget`</summary>
    :::code language="csharp" source="~/functions-quickstart-dotnet-azd/FunctionHttp/httpGetFunction.cs" :::
    </detail>
    <detail>
    <summary>`httppostbody`</summary>
    :::code language="csharp" source="~/functions-quickstart-dotnet-azd/FunctionHttp/httpPostBodyFunction.cs" :::
    </detail>
::: zone-end
::: zone pivot="programming-language-java"  
```git
git clone https://github.com/Azure-Samples/azure-functions-java-flex-consumption-azd
cd azure-functions-java-flex-consumption-azd
```
::: zone-end
::: zone pivot="programming-language-javascript"  
```git
git clone https://github.com/Azure-Samples/functions-quickstart-javascript-azd
cd functions-quickstart-javascript-azd
```
::: zone-end
::: zone pivot="programming-language-powershell"  
```git
git clone https://github.com/Azure-Samples/functions-quickstart-powershell-azd
cd functions-quickstart-powershell-azd
```
::: zone-end
::: zone pivot="programming-language-python"  
```git
git clone https://github.com/Azure-Samples/functions-quickstart-python-http-azd
cd functions-quickstart-python-http-azd
```
::: zone-end
::: zone pivot="programming-language-typescript"  
```git
git clone https://github.com/Azure-Samples/functions-quickstart-typescript-azd
cd functions-quickstart-typescript-azd
```
::: zone-end


::: zone pivot="programming-language-python" 
## Create and activate a virtual environment

In a suitable folder, run the following commands to create and activate a virtual environment named `.venv`. Make sure that you're using a [version of Python supported by Azure Functions](supported-languages.md?pivots=programming-language-python#languages-by-runtime-version).

::: zone-end



## Run the function locally

* Embed from existing documentation

## Install Azure Developer CLI

* Embed from existing documentation (https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)

## Deploy the Azure Function to Azure

To deploy the function to Azure, use the commands:

```
azd auth login
```

Run the azd up command. This will deploy your Function application and create additional resources for your app in Azure. By using the referenced bicep templates, your project will be secure by default.

```
azd up
```

Parameter	Description
* Azure Location: The Azure location where your resources will be deployed.
* Azure Subscription: The Azure Subscription where your resources will be deployed.

Select your desired values and press enter. The azd up command handles the following tasks for you using the template configuration and infrastructure files:

* Creates and configures all necessary Azure resources (azd provision), including:
* Access policies and roles for your account
* Service-to-service communication with Managed Identities
* Packages and deploys the code (azd deploy)

When the azd up command completes successfully, the CLI displays links to view resources created. You can call azd up as many times as you like to both provision and deploy updates to your application.

## Invoke the function on Azure

Because your function uses an HTTP trigger, you invoke it by making an HTTP request to its URL in the browser or with a tool like curl. 

* Embed from existing documentation

## Clean up resources

`azd down`

## Related content

