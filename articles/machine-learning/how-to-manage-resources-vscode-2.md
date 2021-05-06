---
title: Create and manage resources VS Code Extension (preview)
titleSuffix: Azure Machine Learning
description: Learn how to create and manage Azure Machine Learning resources using the Azure Machine Learning Visual Studio Code extension.
services: machine-learning
author: luisquintanilla
ms.author: luquinta
ms.reviewer: luquinta
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 05/06/2021
---

# Manage Azure Machine Learning resources with the VS Code Extension(preview)

Learn how to manage Azure Machine Learning resources with the VS Code extension.

![Azure Machine Learning VS Code Extension](media/how-to-manage-resources-vscode/azure-machine-learning-vscode-extension.png)

## Prerequisites

- Azure subscription. If you don't have one, sign up to try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).
- Visual Studio Code. If you don't have it, [install it](https://code.visualstudio.com/docs/setup/setup-overview).
- VS Code Azure Machine Learning Extension. Follow the [Azure Machine Learning VS Code extension installation guide](how-to-setup-vs-code-extension.md) to set up the extension.

## Create resource

1. Open the Azure Machine Learning view.
1. Select **+** in the extension toolbar.
1. Choose your resource from the dropdown list.
1. Configure the resource template. The information required depends on the type of resource you want to create.
1. Save the resource template
1. Right-click the template file and select **Azure ML: Create Resource**.

Alternatively, you can create a resource by using the:

### Command Palette

1. Open the command palette **View > Command Palette**
1. Enter **> Azure ML: Create <RESOURCE-TYPE>** into the text box. Replace `RESOURCE-TYPE` with the type of resource you want to create.
1. Configure the resource template.
1. Save the resource template.
1. Open the command palette **View > Command Palette**
1. Enter **> Azure ML: Create Resource** into the text box.

### Resource nodes

> [!NOTE]
> This method applies ONLY to resources other than workspaces.

1. Open the Azure Machine Learning view.
1. Expand your workspace node inside of your subscription.
1. Right-click the node for the resource type you want to create and select **Create <RESOURCE-TYPE>** where the *RESOURCE-TYPE* is the type of resource you want to create.
1. Configure the resource template.
1. Save the resource template.
1. Right-click the template file and select **Azure ML: Create Resource**.


## Next steps

[Train an image classification model](tutorial-train-deploy-image-classification-model-vscode.md) with the VS Code extension.