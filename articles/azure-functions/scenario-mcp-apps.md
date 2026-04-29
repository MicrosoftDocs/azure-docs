---
title: Build an MCP Apps server using Azure Functions
description: "Learn how to create and deploy an MCP App that returns interactive UI using Azure Functions. This quickstart uses the Azure Developer CLI to deploy an MCP App project that enables AI clients to access tools with rich interactive interfaces hosted on Azure's Flex Consumption plan."
ms.date: 04/06/2026
ms.update-cycle: 180-days
ms.topic: quickstart
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I want to create an MCP Apps server that returns interactive UI from my MCP tools, so AI clients can render rich visual experiences using Azure Functions.
---

# Quickstart: Build an MCP Apps using Azure Functions

In this quickstart, you create a [Model Context Protocol (MCP) App](https://modelcontextprotocol.io/extensions/apps/overview) from a template project built using the Azure Functions MCP extension. MCP Apps are MCP servers with tools that return results in rich, interactive user interfaces instead of text. You deploy the app using the Azure Developer CLI (`azd`). You can also use the Azure Functions MCP extension to create MCP servers that have [text-based tools](./scenario-custom-remote-mcp-server.md). 

After running the project locally and verifying your code by using GitHub Copilot, you deploy it to a new serverless function app in Azure Functions that follows current best practices for secure and scalable deployments.

:::image type="content" source="media/scenario-mcp-apps/mcp-weather-app-seattle.png" alt-text="Screenshot of a weather app UI for Seattle showing drizzle, temperature, humidity, wind, and report timestamp." lightbox="media/scenario-mcp-apps/mcp-weather-app-seattle-full.png":::

Because the new app runs on the Flex Consumption plan, which follows a _pay-for-what-you-use_ billing model, completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

::: zone pivot="programming-language-javascript"  
> [!IMPORTANT]  
> While [creating MCP Apps](./functions-bindings-mcp.md) is supported for JavaScript, this quickstart currently only has examples for C#, Java, Python, and TypeScript. To complete this quickstart, select one of these supported languages at the top of the article. 
::: zone-end  

[!INCLUDE [functions-mcp-extension-powershell-note](../../includes/functions-mcp-extension-powershell-note.md)]  

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
+ [.NET 10 SDK](https://dotnet.microsoft.com/download) 
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
::: zone pivot="programming-language-python" 
+ [Python 3.11](https://www.python.org/)
::: zone-end  
::: zone pivot="programming-language-csharp" 
+ [Node.js](https://nodejs.org/) (required to build the MCP Apps UI)

+ [Visual Studio Code](https://code.visualstudio.com/) with this extension:

    + [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). This extension requires [Azure Functions Core Tools](functions-run-local.md) and attempts to install it when not available. 

+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) version 1.23.x or a later version 
::: zone-end  
::: zone pivot="programming-language-java,programming-language-python,programming-language-typescript" 
+ [Node.js](https://nodejs.org/) (required to build the MCP Apps UI)

+ [Visual Studio Code](https://code.visualstudio.com/) with these extensions:

    + [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). This extension requires [Azure Functions Core Tools](functions-run-local.md) and attempts to install it when not available. 

    + [Azure Developer CLI extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-dev).
::: zone-end   
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
+ [Azurite storage emulator](../storage/common/storage-install-azurite.md#install-azurite) 

+ [Azure CLI](/cli/azure/install-azure-cli). You can also run Azure CLI commands in [Azure Cloud Shell](../cloud-shell/overview.md).

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Initialize the project

Use the Azure Developer CLI to create an Azure Functions code project from a template.

1. In Visual Studio Code, open a folder or workspace where you want to create your project.
::: zone-end  
::: zone pivot="programming-language-csharp"  
2. Run the following command in the Terminal: 

    ```console
    azd init --template remote-mcp-functions-dotnet -e mcpweather-dotnet
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/remote-mcp-functions-dotnet) and initializes the project in the current folder. The -e flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in names of the resources you create in Azure.  
::: zone-end  
::: zone pivot="programming-language-java,programming-language-python,programming-language-typescript" 
2. Press <kbd>F1</kbd> to open the command palette. Search for and run `Azure Developer CLI (azd): init`.

3. When prompted, select **Select a template**.  
::: zone-end  
::: zone pivot="programming-language-typescript"  
4. Search for and select **Remote MCP Functions with TypeScript**.

5. When prompted, enter `mcpweather-ts` as the environment name.

    The command pulls the project files from the [template repository](https://github.com/Azure-Samples/remote-mcp-functions-typescript) and initializes the project in the current folder. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in the names of the resources you create in Azure.   
::: zone-end
::: zone pivot="programming-language-python"  
4. Search for and select **Remote MCP Functions with Python**.

5. When prompted, enter `mcpweather-python` as the environment name.

    The command pulls the project files from the [template repository](https://github.com/Azure-Samples/remote-mcp-functions-python) and initializes the project in the current folder. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in the names of the resources you create in Azure. 
::: zone-end
::: zone pivot="programming-language-java"  
4. Search for and select **Remote MCP Functions with Java**.

5. When prompted, enter `mcpweather-java` as the environment name.

    The command pulls the project files from the [template repository](https://github.com/Azure-Samples/remote-mcp-functions-java) and initializes the project in the current folder. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. It's also used in names of the resources you create in Azure. 
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
## Start the storage emulator

[!INCLUDE [start-storage-emulator](../../includes/functions-mcp-start-storage-emulator.md)]

## Build the MCP Apps UI

The MCP Apps weather tool includes a frontend application that you must build before running the project.
::: zone-end
::: zone pivot="programming-language-csharp"  

1. In the terminal, go to the UI app folder and build the application:

    ```console
    cd src/McpWeatherApp/app
    npm install
    npm run build
    cd ../
    ```

::: zone-end
::: zone pivot="programming-language-java"  

1. In the terminal, go to the UI app folder and build the application:

    ```console
    cd samples/McpWeatherApp/app
    npm install
    npm run build
    cd ..
    ```

::: zone-end
::: zone pivot="programming-language-python"  

1. In the terminal, go to the UI app folder and build the application:

    ```console
    cd src/app
    npm install
    npm run build
    cd ..
    ```

1. In the `src` directory, create a virtual environment for running the app:

    ### [Bash](#tab/bash)

    ```bash
    python -m venv .venv
    ```

    ### [cmd](#tab/cmd)

    ```cmd
    python -m venv .venv
    ```

    ---

::: zone-end
::: zone pivot="programming-language-typescript"  

1. In the terminal, go to the UI app folder and build the application:

    ```console
    cd src/app
    npm install
    npm run build
    cd ../..
    ```

::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
## Run your MCP server locally 
::: zone-end  
::: zone pivot="programming-language-csharp"
When prompted, select **src/McpWeatherApp**. You see this prompt because there are two projects in the solution, and the other project isn't used by this article.
::: zone-end  
::: zone pivot="programming-language-java"
In a terminal window, make sure you're in the `samples/McpWeatherApp` project folder.
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
[!INCLUDE [run-locally](../../includes/functions-mcp-run-locally.md)]

## Verify by using GitHub Copilot

The project template includes a `.vscode/mcp.json` file that defines a `local-mcp-function` server pointing to your local MCP endpoint. Use this configuration to verify your code by using GitHub Copilot in Visual Studio Code:

1. Open the `.vscode/mcp.json` file and select the **Start** button above the `local-mcp-function` configuration.

1. In the Copilot **Chat** window, make sure that the **Agent** mode is selected, select the **Configure tools** icon, and verify that `MCP Server:local-mcp-function` is enabled in the chat.

1. Run this prompt:

    ```copilot-prompt
    What's the weather in Seattle?
    ```

    When prompted to run the tool, select **Allow in this Workspace** so you don't have to keep granting permission. The prompt runs the `GetWeather` tool, which returns weather data. Because this tool declares UI metadata, the MCP host also fetches the UI resource and renders an interactive weather widget in a sandboxed iframe within the chat.

1. When you're done testing, press Ctrl+C to stop the Functions host.

## Review the code (optional)

You can review the code that defines the MCP Apps tools. An MCP Apps tool requires two components:

+ A **tool with UI metadata** that declares a `ui.resourceUri` pointing to a UI resource.
+ A **resource** that serves the bundled HTML/JavaScript at the matching `ui://` URI.
::: zone-end  
::: zone pivot="programming-language-csharp"
The function code for the MCP Apps weather tool is defined in the `src/McpWeatherApp` folder. In this function, the `[McpMetadata]` attribute adds UI metadata to the `GetWeather` tool.

:::code language="csharp" source="~/functions-scenarios-custom-mcp-dotnet/src/McpWeatherApp/WeatherFunction.cs" range="48-76" :::

The `[McpResourceTrigger]` attribute is applied to the `GetWeatherWidget` function, which serves the HTML widget.

:::code language="csharp" source="~/functions-scenarios-custom-mcp-dotnet/src/McpWeatherApp/WeatherFunction.cs" range="34-46" :::  

The `ToolMetadata` constant declares a `ui.resourceUri` that tells the MCP host to fetch the interactive UI from `ui://weather/index.html` after the tool runs.

:::code language="csharp" source="~/functions-scenarios-custom-mcp-dotnet/src/McpWeatherApp/WeatherFunction.cs" range="12-18" :::

The `GetWeatherWidget` function serves the bundled HTML file at that URI using `[McpResourceTrigger]`.

You can view the complete project template in the [Azure Functions .NET MCP Server](https://github.com/Azure-Samples/remote-mcp-functions-dotnet) GitHub repository.
::: zone-end  
::: zone pivot="programming-language-python"
The function code for the MCP Apps weather tool is defined in the `src/McpWeatherApp/function_app.py` file. In this function, the `metadata` parameter on `@app.mcp_tool()` adds UI metadata to the `get_weather` tool.

:::code language="python" source="~/functions-scenarios-custom-mcp-python/src/McpWeatherApp/function_app.py" range="70-92" :::

The `@app.mcp_resource_trigger()` decorator is applied to the `get_weather_widget` function, which serves the HTML widget.

:::code language="python" source="~/functions-scenarios-custom-mcp-python/src/McpWeatherApp/function_app.py" range="27-67" ::: 

The `TOOL_METADATA` constant declares a `ui.resourceUri` that tells the MCP host to fetch the interactive UI from `ui://weather/index.html` after the tool runs.

:::code language="python" source="~/functions-scenarios-custom-mcp-python/src/McpWeatherApp/function_app.py" range="21" ::: 

The `get_weather_widget` function serves the bundled HTML file at that URI using `@app.mcp_resource_trigger()`.

You can view the complete project template in the [Azure Functions Python MCP Server](https://github.com/Azure-Samples/remote-mcp-functions-python) GitHub repository.
::: zone-end   
::: zone pivot="programming-language-typescript"
The function code for the MCP Apps weather tool is defined in the `src/functions/weatherMcpApp.ts` file. In this function, the `metadata` property on `app.mcpTool()` adds UI metadata to the `getWeather` tool when it's registered.

:::code language="typescript" source="~/functions-scenarios-custom-mcp-typescript/src/functions/weatherMcpApp.ts" range="102-110" :::

The `getWeather` handler fetches weather data for a location and returns it as JSON.

:::code language="typescript" source="~/functions-scenarios-custom-mcp-typescript/src/functions/weatherMcpApp.ts" range="54-87" :::

The `app.mcpResource()` function registers the `getWeatherWidget` handler, which serves the HTML widget.

:::code language="typescript" source="~/functions-scenarios-custom-mcp-typescript/src/functions/weatherMcpApp.ts" range="89-97" :::

The `getWeatherWidget` handler reads and returns the bundled HTML file.

:::code language="typescript" source="~/functions-scenarios-custom-mcp-typescript/src/functions/weatherMcpApp.ts" range="29-52" :::

The `TOOL_METADATA` constant declares a `ui.resourceUri` that tells the MCP host to fetch the interactive UI from `ui://weather/index.html` after the tool runs.

:::code language="typescript" source="~/functions-scenarios-custom-mcp-typescript/src/functions/weatherMcpApp.ts" range="13-17" :::

You can view the complete project template in the [Azure Functions TypeScript MCP Server](https://github.com/Azure-Samples/remote-mcp-functions-typescript) GitHub repository.  
::: zone-end  
::: zone pivot="programming-language-java"
The function code for the MCP Apps weather tool is defined in the `samples/McpWeatherApp` folder. In this function, the `@McpMetadata` annotation adds UI metadata to the `GetWeather` tool.

:::code language="java" source="~/functions-scenarios-custom-mcp-java/samples/McpWeatherApp/src/main/java/com/function/weather/WeatherFunction.java" range="98-132" :::

The `@McpResourceTrigger` annotation is applied to the `GetWeatherWidget` function, which serves the HTML widget.

:::code language="java" source="~/functions-scenarios-custom-mcp-java/samples/McpWeatherApp/src/main/java/com/function/weather/WeatherFunction.java" range="53-66" :::  

The `TOOL_METADATA` constant declares a `ui.resourceUri` that tells the MCP host to fetch the interactive UI from `ui://weather/index.html` after the tool runs. 

:::code language="java" source="~/functions-scenarios-custom-mcp-java/samples/McpWeatherApp/src/main/java/com/function/weather/WeatherFunction.java" range="29-35" ::: 

The `GetWeatherWidget` function serves the bundled HTML file at that URI using `@McpResourceTrigger`.

You can view the complete project template in the [Azure Functions Java MCP Server](https://github.com/Azure-Samples/remote-mcp-functions-java) GitHub repository.
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
After verifying the MCP Apps tools locally, you can publish the project to Azure.

## Deploy to Azure
::: zone-end  
::: zone pivot="programming-language-java,programming-language-python,programming-language-typescript" 
[!INCLUDE [deploy-azure](../../includes/functions-mcp-deploy-azure.md)]
::: zone-end

::: zone pivot="programming-language-csharp" 
This project is configured to use `azd` to deploy this project to a new function app in a Flex Consumption plan in Azure. The project includes a set of Bicep files that `azd` uses to create a secure deployment to a Flex Consumption plan that follows best practices.

1. In the Terminal, run this `azd env set` command: 

    ```console
    azd env set DEPLOY_SERVICE weather 
    ```

    This command sets the `DEPLOY_SERVICE` variable to provision `weather` app related resources


1. Run the `azd provision` command and supply the required parameters to provision resources: 

    ```console
    azd provision
    ```

   | Parameter | Description |
   | ---- | ---- |
   | _Azure subscription_ | Subscription in which your resources are created. |
   | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown. |
   | _vnetEnabled_ | `False` to skip creating virtual network resources, which simplifies the deployment. |

   When prompted, pick your subscription, an Azure region for the resources, and choose `false` to skip creating virtual network resources to simplify the deployment.

1. Run the `azd deploy` command to deploy the `weather` app to Azure:

    ```console
    azd deploy --service weather
    ```

::: zone-end
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-typescript" 
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
