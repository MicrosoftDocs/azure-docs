---
title: Host servers built with MCP SDKs on Azure Functions
description: "Learn how to host servers built with Anthropic MCP SDKs on Azure Functions. This quickstart shows how to deploy MCP SDK based servers as custom handlers in Azure Functions, using serverless scale and security features."
ms.date: 12/02/2025
ms.topic: quickstart
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
ms.custom:
  - ignite-2025
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to host server built with official MCP SDKs on Azure Functions to benefit from serverless scale and security features.
---

# Quickstart: Host servers built with MCP SDKs on Azure Functions

In this quickstart, you learn how to host on Azure Functions Model Context Protocol (MCP) servers that you create by using official MCP SDKs. Flex Consumption plan hosting lets you take advantage of Azure Functions' serverless scale, pay-for-what-you-use billing model, and built-in security features. It's perfect for MCP servers that use the streamable-http transport.

This article uses a sample MCP server project built by using official MCP SDKs. 

>[!TIP]  
>Functions also provides an MCP extension that enables you to create MCP servers by using Azure Functions programming model. For more information, see [Quickstart: Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md). 

Because the new server runs in a Flex Consumption plan, which follows a _pay-for-what-you-use_ billing model, completing this quickstart incurs a small cost of a few cents or less in your Azure account.

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell"  
> [!IMPORTANT]  
> While [hosting your MCP servers using Custom Handlers](./self-hosted-mcp-servers.md) is supported for all languages, this quickstart scenario currently only has examples for C#, Python, and TypeScript. To complete this quickstart, select one of these supported languages at the top of the article. 
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
## Prerequisites
::: zone-end  
::: zone pivot="programming-language-csharp"  
+ [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
::: zone-end  
<!--- replace after Java gets added:
::: zone pivot="programming-language-java"  
+ [Java 17 Developer Kit](/azure/developer/java/fundamentals/java-support-on-azure)
    + If you use another [supported version of Java](supported-languages.md?pivots=programming-language-java#languages-by-runtime-version), you must update the project configuration. 
    + Set the `JAVA_HOME` environment variable to the install location of the correct version of the Java Development Kit (JDK).
::: zone-end  -->
::: zone pivot="programming-language-typescript"
+ [Node.js 22](https://nodejs.org/) or above  
::: zone-end  
::: zone pivot="programming-language-python" 
+ [Python 3.11](https://www.python.org/) or above
+ [uv](https://docs.astral.sh/uv/getting-started/installation/) for Python package management
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
+ [Visual Studio Code](https://code.visualstudio.com/) with these extensions:

    + [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). This extension requires [Azure Functions Core Tools](functions-run-local.md) v4.5.0 or above and attempts to install it when not available. 

    + [Azure Developer CLI extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev).

+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) v1.17.2 or above

+ [Azure CLI](/cli/azure/install-azure-cli). You can also run Azure CLI commands in [Azure Cloud Shell](../cloud-shell/overview.md).

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

> [!NOTE]  
> This sample requires that you have permission to create a [Microsoft Entra app](https://docs.azure.cn/entra/fundamentals/what-is-entra) in the Azure subscription you use.

## Get started with a sample project

The easiest way to get started is to clone an MCP server sample project built with official MCP SDKs:

1. In Visual Studio Code, open a folder or workspace where you want to create your project.
::: zone-end  
::: zone pivot="programming-language-csharp"  
2. In the Terminal, run this command to initialize the .NET sample:
 
    ```bash
    azd init --template mcp-sdk-functions-hosting-dotnet -e mcpsdkserver-dotnet
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-dotnet) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in names of the resources you create in Azure.    
::: zone-end  
<!---replace when Java is supported:
::: zone pivot="programming-language-java"  
2. In the Terminal, run this command to initialize the .NET sample:
 
    ```bash
    azd init --template mcp-sdk-functions-hosting-java -e mcpsdkserver-java
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-java) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in names of the resources you create in Azure. 
::: zone-end  -->
::: zone pivot="programming-language-typescript"  
2. In the Terminal, run this command to initialize the TypeScript sample:
 
    ```bash
    azd init --template mcp-sdk-functions-hosting-node  -e mcpsdkserver-node
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-node    ) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in names of the resources you create in Azure.  
::: zone-end
::: zone pivot="programming-language-python"  
2. In the Terminal, run this command to initialize the Python sample:
 
    ```bash
    azd init --template mcp-sdk-functions-hosting-python -e mcpsdkserver-python
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-java) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in names of the resources you create in Azure.  
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 

The code project template is for an MCP server with tools that access public weather APIs.        

## Run the MCP server locally 

Visual Studio Code integrates with [Azure Functions Core Tools](functions-run-local.md) to let you run this project on your local development computer.

1. Open Terminal in the editor (``Ctrl+Shift+` ``)
::: zone-end
::: zone pivot="programming-language-csharp"       
2. In the root directory, run `func start` to start the server. The **Terminal** panel displays the output from Core Tools.
::: zone-end 
::: zone pivot="programming-language-typescript"  
2. In the root directory, run `npm install` to install dependencies, then run `npm run build`. 
3. To start the server, run `func start`. 
::: zone-end 
::: zone pivot="programming-language-python"  
2. In the root directory, run `uv run func start` to create virtual environment, install dependencies, and start the server. 
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
## Test server by using GitHub Copilot

To verify your server by using GitHub Copilot in Visual Studio Code, follow these steps: 

1. Open the `mcp.json` file in the `.vscode` directory.

1. Start the server by selecting the **Start** button above the `local-mcp-server` configuration.

1. In the Copilot **Chat** window, make sure that the **Agent** model is selected, select the **Configure tools** icon, and verify that `MCP Server:local-mcp-server` is enabled in the chat.

1. Run this prompt in chat:

    ```copilot-prompt
    Return the weather forecast for New York City using #local-mcp-server
    ```

    Copilot should call one of the weather tools to help answer this question. When prompted to run the tool, select **Allow in this Workspace** so you don't have to keep regranting this permission. 

After you verify the tool functionality locally, you can stop the server and deploy the project code to Azure.

## Deploy to Azure

This project is configured to use the `azd up` command to deploy this project to a new function app in a Flex Consumption plan in Azure. The project includes a set of Bicep files that `azd` uses to create a secure deployment that follows best practices.

1. Sign in to Azure:

    ```bash
    azd login
    ```

1. Configure Visual Studio Code as a preauthorized client application:

    ```bash
    azd env set PRE_AUTHORIZED_CLIENT_IDS aebc6443-996d-45c2-90f0-388ff96faa56
    ```

    A preauthorized application can authenticate to and access your MCP server without requiring more consent prompts.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette. Search for and run the command `Azure Developer CLI (azd): Package, Provision and Deploy (up)`. Then, sign in by using your Azure account.

1. When prompted, provide these required deployment parameters:

    | Parameter | Description |
    | ---- | ---- |
    | _Azure subscription_ | Subscription in which your resources are created.|
    | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|
    
    After the command completes successfully, you see links to the resources you created and the endpoint for your deployed MCP server. Make a note of your function app name, which you need for the next section.

    >[!TIP]
    >If an error occurs when running the `azd up` command, just rerun the command. You can run `azd up` repeatedly because it skips creating any resources that already exist. You can also call `azd up` again when deploying updates to your service.  

## Connect to the remote MCP server

Your MCP server is now running in Azure. To connect GitHub Copilot to your remote server, configure it in your workspace settings.

1. In the `mcp.json` file, switch to the remote server by selecting **Stop** for the `local-mcp-server` configuration and **Start** on the `remote-mcp-server` configuration.

1. When prompted for **The domain of the function app**, enter the name of your function app you noted in the previous section. When prompted to authenticate to Microsoft, select **Allow** then choose your Azure account.

1. Verify the remote server by asking a question like:

    ```copilot-prompt
    Return the weather forecast for Seattle using #remote-mcp-server.
    ```

    Copilot calls one of the weather tools to answer the query.

> [!TIP]  
> You can see output of a server by selecting **More...** > **Show Output**. The output provides useful information about possible connection failures. You can also select the gear icon to change log levels to **Traces** to get more details on the interactions between the client (Visual Studio Code) and the server.

## Review the code (optional)

You can review the code that defines the MCP server:
::: zone-end  
::: zone pivot="programming-language-csharp"
The MCP server code is defined in the project root. The server uses the official C# MCP SDK to define these weather-related tools:

:::code language="csharp" source="~/functions-host-mcp-sdk-dotnet/Tools/WeatherTools.cs" :::  

You can view the complete project template in the [Azure Functions .NET MCP SDK hosting](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-dotnet) GitHub repository.
::: zone-end  
::: zone pivot="programming-language-python"
The MCP server code is defined in the `server.py` file. The server uses the official Python MCP SDK to define weather-related tools. This is the definition of the `get_forecast` tool:

:::code language="python" source="~/functions-host-mcp-sdk-python/server.py" range="1-13,23-29,76-110" :::

You can view the complete project template in the [Azure Functions Python MCP SDK hosting](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-python) GitHub repository.
::: zone-end   
::: zone pivot="programming-language-typescript"
The MCP server code is defined in the `src` folder. The server uses the official Node.js MCP SDK to define weather-related tools. This is the definition of the `get-forecast` tool:

:::code language="typescript" source="~/functions-host-mcp-sdk-node/src/server.ts" range="1-13,60-137,218-219" :::

You can view the complete project template in the [Azure Functions TypeScript MCP SDK hosting](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-node) GitHub repository.  
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
## Clean up resources

When you're done working with your MCP server and related resources, use this command to delete the function app and its related resources from Azure to avoid incurring further costs:

```bash
azd down
```

::: zone-end  
<!--- Re-add this when the new tutorial gets published
## Next steps

> [!div class="nextstepaction"]
> [Enable built-in server authorization and authentication](functions-mcp-tutorial.md#enable-built-in-server-authorization-and-authentication)
-->
