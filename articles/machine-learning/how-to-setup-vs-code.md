---
title: Set up Visual Studio Code extension (preview)
titleSuffix: Azure Machine Learning
description: Learn how to set up the Azure Machine Learning Visual Studio Code extension
services: machine-learning
author: luisquintanilla
ms.author: luquinta
ms.service: machine-learning
ms.subservice: core
ms.date: 05/25/2021
ms.topic: how-to
ms.custom: devplatv2
---

# Set up the Visual Studio Code Azure Machine Learning extension (preview)

Learn how to set up the Azure Machine Learning Visual Studio Code extension for your machine learning workflows.

> [!div class="mx-imgBorder"]
> ![VS Code Extension](./media/how-to-setup-vs-code/vs-code-extension.PNG)

The Azure Machine Learning extension for VS Code provides a user interface to:

- Manage Azure Machine Learning resources (experiments, virtual machines, models, deployments, etc.)
- Develop locally using remote compute instances
- Train machine learning models
- Debug machine learning experiments locally
- Schema-based language support, autocompletion and diagnostics for specification file authoring
- Snippets for common tasks

## Prerequisites

- Azure subscription. If you don't have one, sign up to try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- Visual Studio Code. If you don't have it, [install it](https://code.visualstudio.com/docs/setup/setup-overview).
- [Python](https://www.python.org/downloads/)
- (Optional) To create resources using the extension, you need to install the 2.0 CLI. For setup instructions, see [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md).

## Install the extension

1. Open Visual Studio Code.
1. Select **Extensions** icon from the **Activity Bar** to open the Extensions view.
1. In the Extensions view, search for "Azure Machine Learning".
1. Select **Install**.

    > [!div class="mx-imgBorder"]
    > ![Install Azure Machine Learning VS Code Extension](./media/how-to-setup-vs-code/install-aml-vscode-extension.PNG)

> [!NOTE]
> Alternatively, you can install the Azure Machine Learning extension via the Visual Studio Marketplace by [downloading the installer directly](https://aka.ms/vscodetoolsforai).

The rest of the steps in this tutorial have been tested with the latest version of the extension.

> [!NOTE]
> The Azure Machine Learning VS Code extension uses the 2.0 CLI by default. To switch to the 1.0 CLI, set the `azureML.CLI Compatibility Mode` setting in Visual Studio Code to `1.0`. For more information on modifying your settings in Visual Studio, see the [user and workspace settings documentation](https://code.visualstudio.com/docs/getstarted/settings).

## Sign in to your Azure Account

In order to provision resources and run workloads on Azure, you have to sign in with your Azure account credentials. To assist with account management, Azure Machine Learning automatically installs the Azure Account extension. Visit the following site to [learn more about the Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

To sign into you Azure account, select the **Azure: Sign In** button on the Visual Studio Code status bar to start the sign in process.

Alternatively, use the command palette:

1. Open the command palette by selecting **View > Command Palette** from the menu bar.
1. Enter the command "> Azure: Sign In" into the command palette to start the sign in process.

## Choose your default workspace

Choosing a default Azure Machine Learning workspace enables the following when authoring 2.0 CLI YAML specification files:

- Schema validation
- Autocompletion
- Diagnostics

If you don't have a workspace, create one. For more information, see [manage Azure Machine Learning resources with the VS Code extension](how-to-manage-resources-vscode.md).

To choose your default workspace, select the **Set Azure ML Workspace** button on the Visual Studio Code status bar and follow the prompts to set your workspace.

Alternatively, use the `> Azure ML: Set Default Workspace` command in the command palette and follow the prompts to set your workspace.

## Next Steps

- [Manage your Azure Machine Learning resources](how-to-manage-resources-vscode.md)
- [Develop on a remote compute instance locally](how-to-set-up-vs-code-remote.md)
- [Use a compute instances as a remote Jupyter server](how-to-set-up-vs-code-remote.md)
- [Train an image classification model using the Visual Studio Code extension](tutorial-train-deploy-image-classification-model-vscode.md)
- [Run and debug machine learning experiments locally](how-to-debug-visual-studio-code.md)