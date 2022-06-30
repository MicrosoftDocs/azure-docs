---
title: Deploy Bicep files with visual Studio Code
description: Deploy Bicep files from Visual Studio Code.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 06/30/2022
---

# Deploy Bicep files from Visual Studio Code

You can use [Visual Studio Code with the Bicep extension](./visual-studio-code.md#deploy-bicep-file) to deploy a Bicep file. You can deploy to any scope. This article shows deploying to a resource group.

From an opened Bicep file in VS Code, there are two ways you can find the command:

- Right-click anywhere inside a Bicep file, and then select **Deploy Bicep File**.
- Select **Command Palette** from the **View** menu, and then select **Bicep: Deploy Bicep File**.

After you select the command, you follow the wizard to enter the values:

- Select or create a resource group.
- Select a parameter file or select **None** to enter the parameter values. After you enter the parameter values, you have the options to create a parameter file or overwrite the existing parameter file.

For more information about VS Code commands, see [Visual Studio Code](./visual-studio-code.md).

## Next steps

- For more information about deployment commands, see [Deploy resources with Bicep and Azure CLI](deploy-cli.md) and [Deploy resources with Bicep and Azure PowerShell](deploy-powershell.md).
- To preview changes before deploying a Bicep file, see [Bicep deployment what-if operation](./deploy-what-if.md).
