---
title: Build a custom remote MCP server using Azure Functions
description: "Learn how to create and deploy a custom Model Context Protocol (MCP) server using Azure Functions. This quickstart uses the Azure Developer CLI to deploy an MCP server project that enables AI clients to access custom tools hosted on Azures Flex Consumption plan."
ms.date: 12/01/2025
ms.update-cycle: 180-days
ms.topic: quickstart
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
ms.custom:
  - ignite-2024
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I need to know how to use the Azure Developer CLI to create and deploy my custom MCP server code securely to a new function app in the Flex Consumption plan in Azure by using azd templates and the azd up command.
---

# Quickstart: Build a custom remote MCP server using Azure Functions

In this quickstart, you create a custom remote Model Context Protocol (MCP) server from a template project by using the Azure Developer CLI (`azd`). This MCP server uses the Azure Functions MCP server extension to provide tools for AI models, agents, and assistants. You can also use the MCP server extension to [create interactive MCP Apps](./scenario-mcp-apps.md).

After running the project locally and verifying your code by using GitHub Copilot, you deploy it to a new serverless function app in Azure Functions that follows current best practices for secure and scalable deployments. 

Because the new app runs on the Flex Consumption plan, which follows a _pay-for-what-you-use_ billing model, completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

::: zone pivot="programming-language-javascript,programming-language-powershell"  
> [!IMPORTANT]  
> While [creating custom MCP servers](./functions-bindings-mcp.md) is supported for all Functions languages, this quickstart scenario currently only has examples for C#, Java, Python, and TypeScript. To complete this quickstart, select one of these supported languages at the top of the article. 
::: zone-end  
::: zone pivot="programming-language-typescript"
This article supports version 4 of the Node.js programming model for Azure Functions.
::: zone-end
::: zone pivot="programming-language-python"
This article supports version 2 of the Python programming model for Azure Functions.
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
## Prerequisites
::: zone-end  
::: zone pivot="programming-language-csharp"  
+ [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
::: zone-end  
::: zone pivot="programming-language-java"  
+ [Java 17 Developer Kit](/azure/developer/java/fundamentals/java-support-on-azure)
    + If you use another [supported version of Java](supported-languages.md?pivots=programming-language-java#languages-by-runtime-version), update the project's `pom.xml` file. 
    + Set the `JAVA_HOME` environment variable to the install location of the correct version of the Java Development Kit (JDK).
+ [Apache Maven 3.8.x](https://maven.apache.org)  
::: zone-end  
<!-- replace when supported 
::: zone pivot="programming-language-javascript,programming-language-typescript" -->
::: zone pivot="programming-language-typescript"
+ [Node.js 20](https://nodejs.org/)  
::: zone-end  
<!--- remove when supported
::: zone pivot="programming-language-powershell"  
+ [PowerShell 7.2](/powershell/scripting/install/installing-powershell-core-on-windows)

+ [.NET 6.0 SDK](https://dotnet.microsoft.com/download)  
::: zone-end 
-->
::: zone pivot="programming-language-python" 
+ [Python 3.11](https://www.python.org/)
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
+ [Visual Studio Code](https://code.visualstudio.com/) with these extensions:

    + [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). This extension requires [Azure Functions Core Tools](functions-run-local.md) and attempts to install it when not available. 

    + [Azure Developer CLI extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev).

+ [Azurite storage emulator](../storage/common/storage-install-azurite.md#install-azurite) 

+ [Azure CLI](/cli/azure/install-azure-cli). You can also run Azure CLI commands in [Azure Cloud Shell](../cloud-shell/overview.md).

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Initialize the project

Use the `azd init` command to create a local Azure Functions code project from a template.

1. In Visual Studio Code, open a folder or workspace where you want to create your project.

::: zone-end  
::: zone pivot="programming-language-csharp"  
2. In the Terminal, run this `azd init` command:
 
    ```console
    azd init --template remote-mcp-functions-dotnet -e mcpserver-dotnet
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/remote-mcp-functions-dotnet) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in the name of the resource group you create in Azure.       
::: zone-end  
::: zone pivot="programming-language-java"  
2. In your local terminal or command prompt, run this `azd init` command:
 
    ```console
    azd init --template remote-mcp-functions-java -e mcpserver-java 
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/remote-mcp-functions-java) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in names of the resources you create in Azure. 
::: zone-end  
::: zone pivot="programming-language-typescript"  
2. In your local terminal or command prompt, run this `azd init` command:
 
    ```console
    azd init --template remote-mcp-functions-typescript -e mcpserver-ts
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/remote-mcp-functions-typescript) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in names of the resources you create in Azure.   
::: zone-end
::: zone pivot="programming-language-python"  
2. In your local terminal or command prompt, run this `azd init` command:
 
    ```console
    azd init --template remote-mcp-functions-python -e mcpserver-python
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/remote-mcp-functions-python) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in names of the resources you create in Azure. 
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
## Start the storage emulator

[!INCLUDE [start-storage-emulator](../../includes/functions-mcp-start-storage-emulator.md)]

## Run your MCP server locally 
::: zone-end  
::: zone pivot="programming-language-csharp"  
In a terminal window, go to the `FunctionsMcpTool` project folder:

```console
cd src/FunctionsMcpTool
```
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 

[!INCLUDE [run-locally](../../includes/functions-mcp-run-locally.md)] 

## Verify by using GitHub Copilot

The project template includes a `.vscode/mcp.json` file that already defines a `local-mcp-function` server pointing to your local MCP endpoint. Use this configuration to verify your code by using GitHub Copilot in Visual Studio Code:

1. Open the `.vscode/mcp.json` file and select the **Start** button above the `local-mcp-function` configuration.

1. In the Copilot **Chat** window, make sure that the **Agent** mode is selected, select the **Configure tools** icon, and verify that `MCP Server:local-mcp-function` is enabled in the chat.

1. Run this prompt:

    ```copilot-prompt
    Say Hello
    ```

    When prompted to run the tool, select **Allow in this Workspace** so you don't have to keep granting permission. The prompt runs and returns a `Hello World` response and function execution information is written to the logs.

1. Now, select some code in one of your project files and run this prompt:

    ```copilot-prompt
    Save this snippet as snippet1
    ```

    Copilot stores the snippet and responds to your request with information about how to retrieve the snippet by using the `getSnippets` tool. Again, you can review the function execution in the logs and verify that the `saveSnippets` function ran.

1. In Copilot chat, run this prompt:

    ```copilot-prompt
    Retrieve snippet1 and apply to NewFile
    ```

    Copilot retrieves the snippets, adds it to a file called `NewFile`, and does whatever else it thinks is needed to make the code snippet work in your project. The Functions logs show that the `getSnippets` endpoint was called.

1. When you're done testing, press Ctrl+C to stop the Functions host.

## Review the code (optional)

You can review the code that defines the MCP server tools:
::: zone-end  
::: zone pivot="programming-language-csharp"
The function code for the MCP server tools is defined in the `src` folder. The `McpToolTrigger` attribute exposes the functions as MCP Server tools:

:::code language="csharp" source="~/functions-scenarios-custom-mcp-dotnet/src/FunctionsMcpTool/HelloTool.cs" range="10-17" :::  

:::code language="csharp" source="~/functions-scenarios-custom-mcp-dotnet/src/FunctionsMcpTool/SnippetsTool.cs" range="11-34" :::

You can view the complete project template in the [Azure Functions .NET MCP Server](https://github.com/Azure-Samples/remote-mcp-functions-dotnet) GitHub repository.
::: zone-end  
::: zone pivot="programming-language-java"
The function code for the MCP server tools is defined in the `src/main/java/com/function/` folder. The `@McpToolTrigger` annotation exposes the functions as MCP Server tools:

:::code language="java" source="~/functions-scenarios-custom-mcp-java/src/main/java/com/function/HelloWorld.java" range="35-51" :::

:::code language="java" source="~/functions-scenarios-custom-mcp-java/src/main/java/com/function/Snippets.java" range="80-118" :::

You can view the complete project template in the [Azure Functions Java MCP Server](https://github.com/Azure-Samples/remote-mcp-functions-java) GitHub repository.
::: zone-end  
::: zone pivot="programming-language-python"
The function code for the MCP server tools is defined in the `src/function_app.py` file. The MCP function annotations expose these functions as MCP Server tools:

:::code language="python" source="~/functions-scenarios-custom-mcp-python/src/function_app.py" range="30-33" :::

:::code language="python" source="~/functions-scenarios-custom-mcp-python/src/function_app.py" range="36-60" :::

You can view the complete project template in the [Azure Functions Python MCP Server](https://github.com/Azure-Samples/remote-mcp-functions-python) GitHub repository.
::: zone-end   
::: zone pivot="programming-language-typescript"
The function code for the MCP server tools is defined in the `src` folder. The MCP function registration exposes these functions as MCP Server tools:

:::code language="typescript" source="~/functions-scenarios-custom-mcp-typescript/src/functions/helloMcpTool.ts" range="6-29" :::

:::code language="typescript" source="~/functions-scenarios-custom-mcp-typescript/src/functions/snippetsMcpTool.ts" range="56-86" :::

You can view the complete project template in the [Azure Functions TypeScript MCP Server](https://github.com/Azure-Samples/remote-mcp-functions-typescript) GitHub repository.  
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
After verifying the MCP server tools locally, you can publish the project to Azure.

## Deploy to Azure

[!INCLUDE [deploy-azure](../../includes/functions-mcp-deploy-azure.md)]

## Connect to your remote MCP server

[!INCLUDE [connect-remote](../../includes/functions-mcp-connect-remote.md)] 

## Verify your deployment

You can now have GitHub Copilot use your remote MCP tools just as you did locally, but now the code runs securely in Azure. Replay the same commands you used earlier to ensure everything works correctly.

## Clean up resources

[!INCLUDE [cleanup](../../includes/functions-mcp-cleanup.md)]
::: zone-end  
## Next steps

> [!div class="nextstepaction"]
> [Configure built-in MCP server authorization](../app-service/configure-authentication-mcp.md)

