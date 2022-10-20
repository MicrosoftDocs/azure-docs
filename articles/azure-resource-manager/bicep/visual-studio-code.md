---
title: Create Bicep files by using Visual Studio Code
description: Describes how to create Bicep files by using Visual Studio Code
ms.topic: conceptual
ms.date: 09/29/2022
---

# Create Bicep files by using Visual Studio Code

This article shows you how to use Visual Studio Code to create Bicep files.

## Install VS Code

To set up your environment for Bicep development, see [Install Bicep tools](install.md). After completing those steps, you'll have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). You also have either the latest [Azure CLI](/cli/azure/) or the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az).

## Bicep commands

Visual Studio Code comes with several Bicep commands.

Open or create a Bicep file in VS Code, select the **View** menu and then select **Command Palette**. You can also use the key combination **[CTRL]+[SHIFT]+P** to bring up the command palette. Type **Bicep** to list the Bicep commands.

:::image type="content" source="./media/visual-studio-code/visual-studio-code-bicep-commands.png" alt-text="Screenshot of Visual Studio Code Bicep commands in the command palette.":::

These commands include:

- [Build ARM Template](#build-arm-template)
- [Create Bicep Configuration File](#create-bicep-configuration-file)
- [Deploy Bicep File](#deploy-bicep-file)
- [Generate Parameters File](#generate-parameters-file)
- [Insert Resource](#insert-resource)
- [Open Bicep Visualizer](#open-bicep-visualizer)
- [Open Bicep Visualizer to the side](#open-bicep-visualizer)
- [Restore Bicep Modules (Force)](#restore-bicep-modules)

These commands are also shown in the context menu when you right-click a Bicep file:

:::image type="content" source="./media/visual-studio-code/visual-studio-code-bicep-context-menu.png" alt-text="Screenshot of Visual Studio Code Bicep commands in the context menu.":::

### Build ARM template

The `build` command converts a Bicep file to an Azure Resource Manager template (ARM template). The new JSON template is stored in the same folder with the same file name.  If a file with the same file name exists, it overwrites the old file.  For more information, see [Bicep CLI commands](./bicep-cli.md#bicep-cli-commands).

### Create Bicep configuration file

The [Bicep configuration file (bicepconfig.json)](./bicep-config.md) can be used to customize your Bicep development experience. You can add `bicepconfig.json` in multiple directories. The configuration file closest to the bicep file in the directory hierarchy is used. When you select this command, the extension opens a dialog for you to select a folder. The default folder is where you store the Bicep file. If a `bicepconfig.json` file already exists in the folder, you can overwrite the existing file.

### Deploy Bicep file

You can deploy Bicep files directly from Visual Studio Code. Select **Deploy Bicep file** from the command palette or from the context menu. The extension prompts you to sign in Azure, select subscription, create/select resource group, and enter parameter values.

### Generate parameters file

This command creates a parameter file in the same folder as the Bicep file. The new parameter file name is `<bicep-file-name>.parameters.json`.

### Insert resource

The `insert resource` command adds a resource declaration in the Bicep file by providing the resource ID of an existing resource. After you select **Insert Resource**, enter the resource ID in the command palette. It takes a few moments to insert the resource.

You can find the resource ID by using one of these methods:

- Use [Azure Resource extension for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups).

    :::image type="content" source="./media/visual-studio-code/visual-studio-code-azure-resources-extension.png" alt-text="Screenshot of Visual Studio Code Azure Resources extension.":::

- Use the [Azure portal](https://portal.azure.com).
- Use Azure CLI or Azure PowerShell:

  # [CLI](#tab/CLI)

  ```azurecli
  az resource list
  ```

  # [PowerShell](#tab/PowerShell)

  ```azurepowershell
  Get-AzResource
  ```

  ---

Similar to exporting templates, the process tries to create a usable resource. However, most of the inserted resources require some modification before they can be used to deploy Azure resources.

For more information, see [Decompiling ARM template JSON to Bicep](./decompile.md).

### Open Bicep visualizer

The visualizer shows the resources defined in the Bicep file with the resource dependency information. The diagram is the visualization of a [Linux virtual machine Bicep file](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vm-simple-linux/main.bicep).

[![Visual Studio Code Bicep visualizer](./media/visual-studio-code/visual-studio-code-bicep-visualizer.png)](./media/visual-studio-code/visual-studio-code-bicep-visualizer-expanded.png#lightbox)

You can also open the visualizer side-by-side with the Bicep file.

### Restore Bicep modules

When your Bicep file uses modules that are published to a registry, the restore command gets copies of all the required modules from the registry. It stores those copies in a local cache. For more information, see [restore](./bicep-cli.md#restore).

## View type document

From Visual Studio Code, you can easily open the template reference for the resource type you're working on. To do so, hover your cursor over the resource symbolic name, and then select **View type document**.

:::image type="content" source="./media/visual-studio-code/visual-studio-code-bicep-view-type-document.png" alt-text="Screenshot of Visual Studio Code Bicep view type document.":::

## Next steps

To walk through a quickstart, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
