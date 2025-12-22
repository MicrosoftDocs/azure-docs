---
title: Build a custom remote MCP server using Azure Functions
description: "Learn how to create and deploy a custom Model Context Protocol (MCP) server using Azure Functions. This quickstart uses the Azure Developer CLI to deploy an MCP server project that enables AI clients to access custom tools hosted on Azures Flex Consumption plan."
ms.date: 12/01/2025
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

In this quickstart, you create a custom remote Model Context Protocol (MCP) server from a template project using the Azure Developer CLI (`azd`). The MCP server uses the Azure Functions MCP server extension to provide tools for AI models, agents, and assistants. After running the project locally and verifying your code using GitHub Copilot, you deploy it to a new serverless function app in Azure Functions that follows current best practices for secure and scalable deployments.

>[!TIP]  
>Functions also enables you to deploy an existing MCP server code project to a Flex Consumption plan app without having to make changes to your code project. For more information, see [Quickstart: Host existing MCP servers on Azure Functions](scenario-host-mcp-server-sdks.md). 

Because the new app runs on the Flex Consumption plan, which follows a _pay-for-what-you-use_ billing model, completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

::: zone pivot="programming-language-javascript,programming-language-powershell"  
> [!IMPORTANT]  
> While [creating custom MCP servers](./functions-bindings-mcp.md) is supported for all Functions languages, this quickstart scenario currently only has examples for C#, Python, and TypeScript. To complete this quickstart, select one of these supported languages at the top of the article. 
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
    + If you use another [supported version of Java](supported-languages.md?pivots=programming-language-java#languages-by-runtime-version), you must update the project's pom.xml file. 
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

Use the Azurite emulator to simulate an Azure Storage account connection when running your code project locally.

1. If you haven't already, [install Azurite](/azure/storage/common/storage-use-azurite#install-azurite).

1. Press <kbd>F1</kbd>. In the command palette, search for and run the command `Azurite: Start` to start the local storage emulator.

## Run your MCP server locally 

Visual Studio Code integrates with [Azure Functions Core tools](functions-run-local.md) to let you run this project on your local development computer by using the Azurite emulator.

1. To start the function locally, press <kbd>F5</kbd> or the **Run and Debug** icon in the left-hand side Activity bar. The **Terminal** panel displays the output from Core Tools. Your app starts in the **Terminal** panel, and you can see the name of the functions that are running locally.

1. Make a note of the local MCP server endpoint (like `http://localhost:7071/runtime/webhooks/mcp`), which you use to configure GitHub Copilot in Visual Studio Code. 

## Verify using GitHub Copilot

To verify your code, add the running project as an MCP server for GitHub Copilot in Visual Studio Code: 

1. Press <kbd>F1</kbd>. In the command palette, search for and run **MCP: Add Server**.

1. Choose **HTTP (Server-Sent Events)** for the transport type.

1. Enter the URL of the MCP endpoint you copied in the previous step.

1. Use the generated **Server ID** and select **Workspace** to save the MCP server connection to your Workspace settings.

1. Open the command palette and run **MCP: List Servers** and verify that the server you added is listed and running.

1. In Copilot chat, select **Agent** mode and run this prompt:

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

:::code language="csharp" source="~/functions-scenarios-custom-mcp-dotnet/src/HelloTool.cs" range="10-17" :::  

:::code language="csharp" source="~/functions-scenarios-custom-mcp-dotnet/src/SnippetsTool.cs" range="11-34" :::

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

:::code language="python" source="~/functions-scenarios-custom-mcp-python/src/function_app.py" range="37-49" :::

:::code language="python" source="~/functions-scenarios-custom-mcp-python/src/function_app.py" range="84-106" :::

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

This project is configured to use the `azd up` command to deploy this project to a new function app in a Flex Consumption plan in Azure. The project includes a set of Bicep files that `azd` uses to create a secure deployment to a Flex consumption plan that follows best practices.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette. Search for and run the command `Azure Developer CLI (azd): Package, Provison and Deploy (up)`. Then, sign in by using your Azure account.

1. If you're not already signed in, authenticate with your Azure account.

1. When prompted, provide these required deployment parameters:

   | Parameter | Description |
   | ---- | ---- |
   | _Azure subscription_ | Subscription in which your resources are created.|
   | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|

   After the command completes successfully, you see links to the resources you created.

## Connect to your remote MCP server

Your MCP server is now running in Azure. When you access the tools, you need to include a system key in your request. This key provides a degree of access control for clients accessing your remote MCP server. After you get this key, you can connect GitHub Copilot to your remote server.

1. Run this script that uses `azd` and the Azure CLI to print out both the MCP server URL and the system key (`mcp_extension`) required to access the tools:

    ### [Linux/macOS](#tab/linux)

    ```bash
    eval $(azd env get-values --output dotenv)
    MCP_EXTENSION_KEY=$(az functionapp keys list --resource-group $AZURE_RESOURCE_GROUP \
        --name $AZURE_FUNCTION_NAME --query "systemKeys.mcp_extension" -o tsv)
    printf "MCP Server URL: %s\n" "https://$SERVICE_API_NAME.azurewebsites.net/runtime/webhooks/mcp"
    printf "MCP Server key: %s\n" "$MCP_EXTENSION_KEY"
    ```

    ### [Windows](#tab/windows-cmd)

    ```powershell
    azd env get-values --output dotenv | ForEach-Object { 
        if ($_ -match "^([^=]+)=(.*)$") { 
            Set-Variable -Name $matches[1] -Value ($matches[2] -replace '"', '')
        } 
    }
    $MCP_EXTENSION_KEY = az functionapp keys list --resource-group $AZURE_RESOURCE_GROUP `
        --name $AZURE_FUNCTION_NAME --query "systemKeys.mcp_extension" -o tsv
    Write-Host "MCP Server URL: https://$SERVICE_API_NAME.azurewebsites.net/runtime/webhooks/mcp"
    Write-Host "MCP Server key: $MCP_EXTENSION_KEY"
    ```

    ---

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette, search for and run the command `MCP: Open Workspace Folder MCP Configuraton`, which opens the `mcp.json` configuration file.

1. In the `mcp.json` configuration, find the named MCP server you added earlier, change the `url` value to your remote MCP server URL, and add a `headers.x-functions-key` element, which contains your copied MCP server access key, as in this example:   

    ```json
    {
        "servers": {
            "remote-mcp-function": {
                "type": "http",
                "url": "https://contoso.azurewebsites.net/runtime/webhooks/mcp",
                "headers": {
                    "x-functions-key": "A1bC2dE3fH4iJ5kL6mN7oP8qR9sT0u..."
                }
            }
        }
    }
    ```

1. Select the **Start** button above your server name in the open `mcp.json` to restart the remote MCP server, this time using your deployed app. 

## Verify your deployment

You can now have GitHub Copilot use your remote MCP tools just as you did locally, but now the code runs securely in Azure. Replay the same commands you used earlier to ensure everything works correctly.

## Clean up resources

When you're done working with your MCP server and related resources, use this command to delete the function app and its related resources from Azure to avoid incurring further costs:

```console
azd down --no-prompt
```

> [!NOTE]  
> The `--no-prompt` option instructs `azd` to delete your resource group without confirmation from you. This command doesn't affect your local code project.
::: zone-end  
## Next steps

> [!div class="nextstepaction"]
> [Configure built-in MCP server authorization](../app-service/configure-authentication-mcp.md)

