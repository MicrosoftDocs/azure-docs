---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/07/2026
ms.author: glenga
---

#### [GitHub Copilot CLI](#tab/copilot-cli)

1. [Install Copilot CLI](https://github.com/github/copilot-cli)

1. Sign in to Azure CLI if you haven't already:
    
    ```azurecli
    az login
    ```
    
    Make sure you're signed in to the subscription that contains the function apps you want to migrate.

1. Launch the Copilot CLI:
    
    ```
    copilot
    ```

1. Add the marketplace source (first time only):
    
    ```
    /plugin marketplace add microsoft/azure-skills
    ```

1. Install the plugin:
    
    ```
    /plugin install azure@azure-skills
    ```

1. After install, reload Model Context Protocol (MCP) servers:
    
    ```
    /mcp reload
    ```

1. Verify installation:
    
    ```
    /mcp show
    ```

    You should see the **azure** plugin listed with a checkmark. The `functionapp` tool is part of this plugin.

#### [Visual Studio Code](#tab/copilot-vscode)

1. [Install the Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server) from the Visual Studio Code Marketplace (Extension ID: `ms-azuretools.vscode-azure-mcp-server`).

1. The extension auto-installs a companion extension, GitHub Copilot for Azure, which contains the Azure skills.

1. Sign in to Azure CLI if you haven't already. Open a terminal and run:
    
    ```azurecli
    az login
    ```
    
    Make sure you're signed in to the subscription that contains the function apps you want to migrate.

1. Open Copilot Chat and switch to Agent mode.

1. Open the Command Palette (Ctrl+Shift+P), search for and select `MCP:List servers`, and verify that the **Azure MCP server** is listed and running. If it's not running, select it and select **Start server**. 

---

> [!TIP]
> If Copilot targets the wrong subscription, ask it to use a specific subscription ID. You can find your subscription ID by running `az account show --query id -o tsv`.
> If Copilot connects to the wrong Azure tenant, ask Copilot to use your specific tenant ID when making Azure calls. You can find your tenant ID by running `az account show --query tenantId -o tsv`.