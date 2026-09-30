---
title: 'Quickstart: Create Bicep files with Visual Studio Code and Bicep MCP server'
description: Learn how to use Visual Studio Code and the Bicep MCP server to create Bicep files and deploy Azure resources.
ms.topic: quickstart
ms.date: 02/04/2026
ms.custom:
  - mode-ui
  - devx-track-bicep
  - sfi-image-nochange
#customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Bicep files so that I can use them to deploy Azure resources.
---

# Quickstart: Create Bicep files with Visual Studio Code and Bicep MCP server

This quickstart shows you how to use Visual Studio Code and [Bicep MCP server](./visual-studio-code.md) to create a [Bicep file](overview.md).

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* To set up your environment for Bicep development, see [Install Bicep tools](install.md). After completing those steps, you have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) version 0.40.2 or later installed. The Bicep extension version 0.40.2 automatically installs the Bicep MCP server. You also have either the latest [Azure CLI](/cli/azure/) version or [Azure PowerShell module](/powershell/azure/new-azureps-module-az).
* Start Bicep MCP server. See the third option of [Manage installed MCP servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_manage-installed-mcp-servers).

## Create a Bicep file by using Bicep MCP

Use the Copilot chat and the Bicep MCP server to create your Bicep files.

1. From the `File` menu, select `New File` to create a new Bicep file named `main.bicep`.
1. From the `View` menu, select `Chat` to open the Copilot chat pane. Notice the current file context changes to `main.bicep`. If it doesn't, select the `Add context` button to add the file.

    :::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code-model-context-protocol/vscode-copilot-chat-new.png" alt-text="Screenshot of Visual Studio Code chat pane.":::
1. Select the `Configure tools` icon.
1. Expand Bicep to see the available Bicep MCP server tools. Select `Bicep` if it is not selected, and then select `OK`. For more information about enabling the Bicep MCP server tools, see [Use MCP tools in chat](https://code.visualstudio.com/docs/copilot/customization/mcp-servers#_use-mcp-tools-in-chat).

After you add the Bicep MCP server, use the tools it provides in chat. MCP tools work like other tools in VS Code: agents can automatically invoke them or you can explicitly reference them in your prompts.

1. For demonstration purposes, submit the following prompt to ensure the usage of the Bicep MCP server tools.

    ```
    For this conversation, only use tools from the "bicep-mcp" MCP server. Do not call any other MCP tools.
    ```

1. Submit the following prompt to create a simple storage account.

    ```
    Add a storage account resource with only the required properties using Bicep best practices.
    ```

    The chat pane lists the Bicep MCP server tools used, and the Bicep file it generated.

    :::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code-model-context-protocol/prompt-add-storage.png" alt-text="Screenshot of adding a storage account.":::

1. Hover your cursor over the generated code, select `Apply in Editor`, and then select `Active editor ...` to add the code to `main.bicep`.
1. In the editor, select `Keep` to confirm the insert. The generated Bicep code might be slightly different from the following screenshot.

    :::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code-model-context-protocol/prompt-add-storage-keep.png" alt-text="Screenshot of confirming adding a storage account.":::

1. Submit the following prompt to update or verify that you have the latest API version:

    ```
    Update the API versions to the latest.
    ```

1. If there's a newer API version identified, hover your cursor over the generated code, select `Apply in Editor`, and then select `Active editor ...` to add the code to `main.bicep`.

1. Submit the following prompt to add default values for the parameters:

    ```
    Add default values for the parameters.
    ```

1. Hover your cursor over the generated code, select `Apply in Editor`, select `Active editor ...`, and then select `Keep`.

1. Submit the following prompt:

    ```
    Verify the Bicep file.
    ```

1. Select `Allow without Review in this Session`.

    The "Run Get Bicep File Diagnostics" tool is used. It shows `no errors or warnings`.

1. Submit the following prompt to add default values:

    ```
    Create a Bicep parameters file with all the parameters defined in the Bicep file.
    ```

1. From the generated code block, select `Apply in Editor`, select `New untitled editor`, and then select `Keep`.

1. From the `File` menu, select `Save`, and save the file as `main.bicepparam`.

1. Submit the following prompt:

    ```
    Get a snapshot of the deployment.
    ```
    
    The "Ran Get deployment snapshot" command runs. You get the result similar to the following screenshot:

    :::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code-model-context-protocol/vscode-bicep-mcp-server-deployment-snapshot.png" alt-text="Screenshot of Bicep MCP server deployment snapshot.":::

## Deploy the Bicep file

1. Open the `main.bicep` file that you created in VS Code.
1. Right-click the Bicep file inside Visual Studio Code, and then select **Deploy Bicep file**.
1. In the **Please enter name for deployment** text box, type **deployStorage**, and then press <kbd>ENTER</kbd>.

1. From the **Select Resource Group** list, select **Create new Resource Group**.

1. Enter **exampleRG** as the resource group name, and then press <kbd>ENTER</kbd>.

1. Select a location for the resource group, select **Central US** or a location of your choice, and then press <kbd>ENTER</kbd>.

1. From **Select a parameters file**, select **Browse**, and then specify the `main.bicepparam` file you created.

It takes a few moments to create the resources. For more information, see [Deploy Bicep files with Visual Studio Code](./deploy-visual-studio-code.md).

## Clean up resources

When you no longer need the Azure resources, use the Azure CLI or Azure PowerShell module to delete the quickstart resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name exampleRG
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Create Bicep file using Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md)
