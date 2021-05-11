---
title: Set up Visual Studio Code extension
titleSuffix: Azure Machine Learning
description: Learn how to set up the Azure Machine Learning Visual Studio Code extension
services: machine-learning
author: luisquintanilla
ms.author: luquinta
ms.service: machine-learning
ms.subservice: core
ms.date: 05/10/2021
ms.topic: how-to
---

# Set up the Visual Studio Code Azure Machine Learning extension

Learn how to install the Azure Machine Learning Extension for your machine learning workflows.

The Azure Machine Learning extension for VS Code provides a user interface to:

- Manage Azure Machine Learning resources (experiments, virtual machines, models, deployments, etc.)
- Develop locally using remote compute instances
- Train machine learning models
- Debug machine learning experiments locally
- Schema-based language support, autocompletion and diagnostics for resource authoring
- Snippets for common tasks

## Prerequisites

- Azure subscription. If you don't have one, sign up to try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
- Visual Studio Code. If you don't have it, [install it](https://code.visualstudio.com/docs/setup/setup-overview).
- [Python](https://www.python.org/downloads/)
- (Optional) To create resources using the extension, you need to install the Azure Machine Learning CLI 2.0. For setup instructions, see [how-to-configure-cli.md].

## Install the extension

1. Open Visual Studio Code.
1. Select **Extensions** icon from the **Activity Bar** to open the Extensions view.
1. In the Extensions view, search for "Azure Machine Learning".
1. Select **Install**.

    > [!div class="mx-imgBorder"]
    > ![Install Azure Machine Learning VS Code Extension](./media/tutorial-setup-vscode-extension/install-aml-vscode-extension.PNG)

> [!NOTE]
> Alternatively, you can install the Azure Machine Learning extension via the Visual Studio Marketplace by [downloading the installer directly](https://aka.ms/vscodetoolsforai).

The rest of the steps in this tutorial have been tested with the latest version of the extension.

## Sign in to your Azure Account

In order to provision resources and run workloads on Azure, you have to sign in with your Azure account credentials. To assist with account management, Azure Machine Learning automatically installs the Azure Account extension. Visit the following site to [learn more about the Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

1. Open the command palette by selecting **View > Command Palette** from the menu bar. 
1. Enter the command "Azure: Sign In" into the command palette to start the sign in process.

## Choose your default workspace

Choosing a default Azure Machine Learning workspace enables Azure Machine Learning enables the following on your resources:

- Schema validation
- Autocompletion
- Diagnostics

To choose your default workspace

1. Open the command palette **Tools > Command Palette**
1. Enter "Azure ML: Set Default Workspace" in the text box.
1. Select your workspace from the dropdown.

Alternatively, you can select the "Set Azure ML Workspace" button on the Visual Studio Code status bar and follow the prompts to set your workspace.

## Next Steps

- [Manage your Azure Machine Learning resources](how-to-manage-resources-vscode.md)
- [Develop on a remote compute instance locally](how-to-set-up-vs-code-remote.md)
- [Use a compute instances as a remote Jupyter server](how-to-set-up-vs-code-remote.md)
- [Train & deploy image classification model using the Visual Studio Code extension](tutorial-train-deploy-image-classification-model-vscode.md)
- [Run and debug machine learning experiments locally](how-to-debug-visual-studio-code.md)