---
title: Deploy Bicep files with Visual Studio Code
description: Deploy Bicep files from Visual Studio Code.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Deploy Bicep files from Visual Studio Code

You can use [Visual Studio Code with the Bicep extension](./visual-studio-code.md#deploy-bicep-file) to deploy a Bicep file. You can deploy to any scope. This article shows deploying to a resource group.

From an opened Bicep file in VS Code, there are there ways you can find the command:

- Right-click the Bicep file name from the Explorer pane, not the one under **OPEN EDITORS**:

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-from-explorer.png" alt-text="Screenshot of Deploying Bicep File in the Context menu from the explore pane.":::

- Right-click anywhere inside a Bicep file, and then select **Deploy Bicep File**.

- Select **Command Palette** from the **View** menu, and then select **Bicep: Deploy Bicep File**.

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-from-command-palette.png" alt-text="Screenshot of Deploy Bicep File in the Context menu.":::

After you select the command, you follow the wizard to enter the values:

1. Sign in to Azure and select subscription.

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-select-subscription.png" alt-text="Screenshot of Select subscription.":::

    [!INCLUDE [vscode authentication](../../../includes/resource-manager-vscode-authentication.md)]

1. Select or create a resource group.

1. Select a parameter file or select **None** to enter the parameter values.

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-select-parameter-file.png" alt-text="Screenshot of Select parameter file.":::

1. If you choose **None**, enter the parameter values.

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-enter-parameter-values.png" alt-text="Screenshot of Enter parameter values.":::

    After you enter the values, you have the option to create a parameters file from values used in this deployment:

    :::image type="content" source="./media/deploy-vscode/bicep-deploy-create-parameter-file.png" alt-text="Screenshot of Create parameter file.":::

    If you select **Yes**, a parameter file with the file name **&lt;Bicep-file-name>.parameters.json** is created in the same folder.

For more information about VS Code commands, see [Visual Studio Code](./visual-studio-code.md).

## Next steps

- For more information about deployment commands, see [Deploy resources with Bicep and Azure CLI](deploy-cli.md) and [Deploy resources with Bicep and Azure PowerShell](deploy-powershell.md).
- To preview changes before deploying a Bicep file, see [Bicep deployment what-if operation](./deploy-what-if.md).
