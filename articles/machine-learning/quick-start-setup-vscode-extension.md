---
title: Quickstart: Set up Visual Studio Code extension and train a model (preview)
titleSuffix: Azure Machine Learning
description: Learn how to set up the Visual Studio Code Azure Machine Learning extension and train a model
services: machine-learning
author: ssalgadodev
ms.author: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 10/21/2021
ms.topic: how-to
ms.custom: devplatv2
---

# Quickstart: Set up the Visual Studio Code Azure Machine Learning extension and train a model (preview)

Learn how to set up the Azure Machine Learning Visual Studio Code extension for your machine learning workflows and how to train an image classification model.

In this quick start, you learn the following tasks:

- Understand the code
- Create a workspace
- Create a GPU cluster for training
- Train a model

## Prerequisites

- Azure subscription. If you don't have one, sign up to try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- Visual Studio Code. If you don't have it, [install it](https://code.visualstudio.com/docs/setup/setup-overview).
- [Python](https://www.python.org/downloads/)
- (Optional) To create resources using the extension, you need to install the CLI (v2). For setup instructions, see [Install, set up, and use the CLI (v2) (preview)](how-to-configure-cli.md).
- Clone the community driven repository

```bash
git clone https://github.com/Azure/azureml-examples.git --depth 1
```

## Install the extension

1. Open Visual Studio Code.
1. Select **Extensions** icon from the **Activity Bar** to open the Extensions view.
1. In the Extensions view, search for "Azure Machine Learning".
1. Select **Install**.

## Sign in to your Azure Account

In order to provision resources and run workloads on Azure, you have to sign in with your Azure account credentials. To assist with account management, Azure Machine Learning automatically installs the Azure Account extension. Visit the following site to [learn more about the Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

To sign into you Azure account, select the **Azure: Sign In** button on the Visual Studio Code status bar on the bottom of the window to start the sign in process.

Alternatively, use the command palette:

1. Open the command palette by selecting **View > Command Palette** from the menu bar.
1. Enter the command "> Azure: Sign In" into the command palette to start the sign in process.

## Create a workspace

The first thing you have to do to build an application in Azure Machine Learning is to create a workspace. A workspace contains the resources to train models as well as the trained models themselves. For more information, see [what is a workspace](./concept-workspace.md).

1. Open the *azureml-examples-main/cli/jobs/train/tensorflow/mnist* directory in Visual Studio Code.
1. On the Visual Studio Code activity bar, select the **Azure** icon to open the Azure Machine Learning view.
1. In the Azure Machine Learning view, right-click your subscription node and select **Create Workspace**.

1. A specification file appears. Configure the specification file with the following options.

    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/workspace.schema.json
    name: TeamWorkspace
    location: WestUS2
    friendly_name: team-ml-workspace
    description: A workspace for training machine learning models
    tags:
      purpose: training
      team: ml-team
    ```

    The specification file creates a workspace called `TeamWorkspace` in the `WestUS2` region. The rest of the options defined in the specification file provide friendly naming, descriptions, and tags for the workspace.

1. Right-click the specification file and select **Azure ML: Create Resource**. Creating a resource uses the configuration options defined in the YAML specification file and submits a job using the CLI (v2). At this point, a request to Azure is made to create a new workspace and dependent resources in your account. After a few minutes, the new workspace appears in your subscription node.
1. Set `TeamWorkspace` as your default workspace. Doing so places resources and jobs you create in the workspace by default. Select the **Set Azure ML Workspace** button on the Visual Studio Code status bar and follow the prompts to set `TeamWorkspace` as your default workspace.

For more information on workspaces, see [how to manage resources in VS Code](how-to-manage-resources-vscode.md).
