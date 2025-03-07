---
title: Deploy Bicep files with Visual Studio Code
description: Learn how to use Visual Studio Code to deploy Bicep files.
ms.topic: how-to
ms.date: 01/10/2025
ms.custom: devx-track-bicep
---

# Deploy Bicep files with Visual Studio Code

You can use [Visual Studio Code with the Bicep extension](./visual-studio-code.md#deploy-bicep-file-command) to deploy a Bicep file. You can deploy to any scope. This article shows how to deploy to a resource group.

There are three ways you can find the command from an open Bicep file in Visual Studio Code:

- Right-click the Bicep file name from the Explorer pane instead of the one under **OPEN EDITORS**:

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-from-explorer.png" alt-text="Screenshot of Deploying Bicep File in the Context menu from the explore pane.":::

- Right-click anywhere inside a Bicep file, and then select **Deploy Bicep File**.

- Select **Command Palette** from the **View** menu, and then select **Bicep: Deploy Bicep File**.

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-from-command-palette.png" alt-text="Screenshot of Deploy Bicep File in the Context menu.":::

After you select the command, follow the wizard to enter the values:

1. If you're not signed in, follow the instructions provided in the prompt to complete the sign-in process.

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-sign-in.png" alt-text="Screenshot of sign-in.":::

    [!INCLUDE [vscode authentication](../../../includes/resource-manager-vscode-authentication.md)]

1. Select or create a resource group.

1. Select a parameters file or **None** to enter values for parameters:

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-select-parameter-file.png" alt-text="Screenshot of Select parameters file.":::

1. If you choose **None**, enter the values for parameters:

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-enter-parameter-values.png" alt-text="Screenshot of Enter parameter values.":::

    After you enter the values, you have the option to create a parameters file from values used in this deployment:

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-create-parameter-file.png" alt-text="Screenshot of Create parameters file.":::

    If you select **Yes**, a parameters file named _&lt;Bicep-file-name>.parameters.json_ is created in the same folder.

See [Create Bicep files with Visual Studio Code](./visual-studio-code.md) for more information about Visual Studio Code commands and how to use Visual Studio Code to create Bicep files.

## Next steps

- For more information about deployment commands, see [Deploy Bicep files with the Azure CLI](./deploy-cli.md) and [Azure PowerShell](./deploy-powershell.md).
- To preview changes before deploying a Bicep file, see [Bicep deployment what-if operation](./deploy-what-if.md).
