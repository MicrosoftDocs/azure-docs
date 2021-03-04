---
title: Setup Bicep development and deployment environments
description: How to configure Bicep development and deployment environments
ms.topic: conceptual
ms.date: 03/04/2021
---

# Setup Bicep development and deployment environment

Learn how to setup Bicep development and deployment environments.

## Deployment environment

You can deploy Bicep files by using Azure CLI or Azure PowerShell. For Azure CLI, you need version 2.20.0 or later; for Azure PowerShell, you need version 5.6.0 or later. For the installation instructions, see:

- [Install Azure PowerShell](/powershell/azure/install-az-ps)
- [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
- [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux)
- [Install Azure CLI on macOS](/cli/azure/install-azure-cli-macos)

> [!NOTE]
> Currently, both Azure CLI and Azure PowerShell can only deploy local Bicep files. For more information, see [Deploy - CLI](/deploy-cli.md#deploy-remote-template) and [Deploy - PowerShell](/deploy-powershell.md#deploy-remote-template).

## Development environment

To get the best Bicep authoring experience, you need two components:

- **Bicep extension for Visual Studio Code**. To create Bicep files, you need a good Bicep editor. We recommend [Visual Studio Code](https://code.visualstudio.com/) with the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). These tools provides language support and resource autocompletion. They help create and validate Bicep files. For more information, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code).
- **Bicep CLI**. Use Bicep CLI to compile Bicep files to ARM JSON templates, and decompile ARM JSON templates to Bicep files.



## Next steps

Get started with the [Bicep tutorial](./bicep-tutorial-create-first-bicep.md).
