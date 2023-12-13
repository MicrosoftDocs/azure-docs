---
title: 'Work in VS Code remotely connected to a compute instance (preview)'
titleSuffix: Azure Machine Learning
description: Details for working with Jupyter notebooks and services from a VS Code remote connection to an Azure Machine Learning compute instance.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: build-2023
ms.topic: how-to
ms.author: lebaro
author: lebaro-msft
ms.reviewer: sgilley 
ms.date: 04/17/2023
#Customer intent: As a data scientist, I want to use Jupyter notebooks and tools while working from a VS Code remote connection to my Azure Machine Learning compute instance.
---

# Work in VS Code remotely connected to a compute instance (preview)

In this article, learn specifics of working within a VS Code remote connection to an Azure Machine Learning compute instance. Use VS Code as your **full-featured integrated development environment (IDE)** with the power of Azure Machine Learning resources. You can work with a remote connection to your compute instance in the browser with VS Code for the Web, or the VS Code desktop application.

* We recommend **VS Code for the Web**, as you can do all your machine learning work directly from the browser, and without any required installations or dependencies.

 [!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

> [!IMPORTANT]
> To connect to a compute instance behind a firewall, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md#scenario-visual-studio-code).

## Prerequisites

Before you get started, you will need:

* [!INCLUDE [workspace and compute instance](includes/prerequisite-workspace-compute-instance.md)]

## Set up your remotely connected IDE

VS Code has multiple extensions that can help you achieve your machine learning goals. Use the Azure extension to connect and work with your Azure subscription. Use the Azure Machine Learning extension to view, update and create workspace assets like computes, data, environments, jobs and more.

When you use [VS Code for the Web](how-to-launch-vs-code-remote.md?tabs=vscode-web#use-vs-code-as-your-workspace-ide), the latest versions of these extensions are automatically available to you. If you use the [desktop application](how-to-launch-vs-code-remote.md?tabs=vscode-desktop#use-vs-code-as-your-workspace-ide), you may need to install them.

When you [launch VS Code connected to a compute instance](how-to-launch-vs-code-remote.md) for the first time, make sure you follow these steps and take a few moments to orient yourself to the tools in your integrated development environment.

1. Locate the Azure extension and sign in
1. Once your subscriptions are listed, you can filter to the ones you use frequently. You can also pin workspaces you use most often within the subscriptions.

    :::image type="content" source="media/how-to-work-in-vs-code-remote/azure-extension-filter-pin.png" alt-text="Screenshot shows how to filter and pin in VS Code window.":::

1. The workspace you launched the VS Code remote connection from (the workspace the compute instance is in) should be automatically set as the default. You can update the default workspace from the VS Code status bar.

    :::image type="content" source="media/how-to-work-in-vs-code-remote/vs-code-status-bar.png" alt-text="Screenshot shows VS Code status bar.":::

1. If you plan to use the Azure Machine Learning CLI, open a terminal from the menu, and sign in to the Azure Machine Learning CLI using `az login --identity`.

    :::image type="content" source="media/how-to-work-in-vs-code-remote/vs-code-open-terminal.png" alt-text="Screenshot shows opening terminal window from VS Code.":::

Subsequent times you connect to this compute instance, you shouldn't have to repeat these steps.

## Connect to a kernel

There are a few ways to connect to a Jupyter kernel from VS Code. It's important to understand the differences in behavior, and the benefits of the different approaches.

If you have already opened this notebook in Azure Machine Learning, we recommend you connect to an **existing session on the compute instance**. This action reconnects to an existing session you had for this notebook in Azure Machine Learning.

1. Locate the kernel picker in the upper right-hand corner of your notebook and select it

    :::image type="content" source="media/how-to-work-in-vs-code-remote/choose-kernel-source.png" alt-text="Screenshot shows kernel picker in VS Code.":::

1. Choose the 'Azure Machine Learning compute instance' option, and then the 'Remote' if you've connected before

    :::image type="content" source="media/how-to-work-in-vs-code-remote/select-remote.png" alt-text="Screenshot shows selecting the compute instance in VS Code.":::

1. Select a notebook session with an existing connection

    :::image type="content" source="media/how-to-work-in-vs-code-remote/select-existing-kernel.png" alt-text="Screenshot shows selecting the kernel in VS Code.":::

If your notebook didn't have an existing session, you can pick from the kernels available in that list to create a new one. This action creates a VS Code-specific kernel session. These VS Code-specific sessions are usable only within VS Code and must be managed there. You can manage these sessions by installing the Jupyter PowerToys extension.

While there are a few ways to connect and manage kernels in VS Code, connecting to an existing kernel session is the recommended way to enable a seamless transition from the Azure Machine Learning studio to VS Code. If you plan to mostly work within VS Code, you can make use of any kernel connection approach that works for you.



## Transition between Azure Machine Learning and VS Code

We recommend not trying to work on the same files in both applications at the same time as you may have conflicts you need to resolve. We'll save your current file in the studio before navigating to VS Code. You can execute many of the actions provided in the Azure Machine Learning studio in VS Code instead, using a YAML-first approach. You may find you prefer to do certain actions (for example, editing and debugging files) in VS Code, and other actions (for example, Creating a training job) in the Azure Machine Learning studio. You should find you can seamlessly navigate back and forth between the two.

## Next steps

For more information on managing Jupyter kernels in VS Code, see [Jupyter kernel management](https://code.visualstudio.com/docs/datascience/jupyter-kernel-management).
