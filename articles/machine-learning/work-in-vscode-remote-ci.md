---
title: 'Work in VS Code connected to an Azure Machine Learning compute instance (preview)'
titleSuffix: Azure Machine Learning
description: Details for working with Jupyter notebooks and services from a VS Code remote connection to an Azure Machine Learning compute instance.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: lebaro
author: lebaro-msft
ms.reviewer: sgilley 
ms.date: 04/17/2023
# As a data scientist, I want to use Jupyter notebooks and tools while working from a VS Code remote connection to my Azure Machine Learning compute instance.
---

# Work in VS Code connected to a compute instance
 
In this article, you'll learn specifics of working within a VS Code remote connection to an Azure Machine Learning compute instance. Use VS Code as your **full-featured integrated development environment (IDE)** with the power of Azure Machine Learning resources. You can work with a remote connection to your compute instance in the browser with VS Code for the Web, or the VS Code desktop application.
  * We recommend **VS Code for the Web**, as you can do all your machine learning work directly from the browser, and without any required installations or dependencies.
 [!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

> [!IMPORTANT]
> To connect to a compute instance behind a firewall, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md#scenario-visual-studio-code).

## Setting up your remotely connected IDE
 
VS Code has multiple extensions that can help you achieve your machine learning goals. You can use the Azure extension to connect and work with your Azure subscription, the Azure Machine Learning extension to view, update and create workspace assets like computes, data, environments, jobs and more.

When you use VS Code for the Web, the latest versions of these extensions are automatically available to you. If you use the desktop application, you may need to install them.

When you launch a VS Code instance connected to a compute instance for the first time, make sure you follow these steps and take a few moments to orient yourself to the tools in your integrated development environment.

1. Locate the Azure extension and Sign in
1. Once your subscriptions are listed, you can pin or filter to just the subscriptions and workspaces you use frequently
1. The workspace you launched the VS Code remote connection from should be automatically set as the default. You can change this in the bottom banner of the VS Code window.
1. If you plan to use the Azure Machine Learning CLI, open a terminal from the menu, and sign in to the Azure ML CLI using **az login --identity**.

Subsequent times you connect to this compute instance, you should not have to repeat these steps.

## Connecting to a kernel
There are a few ways to connect to a Jupyter kernel from VS Code. Its important to understand the differences in behavior, and the benefits of the different approaches.

When connecting to a kernel, we recommend you connect to a kernel or session **on the compute instance**. This will create or reconnect to an existing session you had for this notebook in Azure ML. To do this, choose "Select kernel", select the compute instance and Remote connection, and then pick a kernel with an existing connection from the list. If your notebook did not have a previous session, you can pick from the kernels available in that list to create a new one. 

** << insert steps and screenshot >> **

There are also VS Code-specific kernel session types that are separate from the remote compute instance connection. These sessions are usable only within VS Code and must be managed there. You can manage these sessions by installing the Jupyter PlayTools extension.

While there are a few ways to connect and manage kernels in VS Code, the compute instance approach mentioned above is the recommended way to enable a seamless transition from the Azure Machine Learning studio to VS Code.

## Transitioning between Azure ML and VS Code
We recommend not trying to work on the same files in both applications at the same time as you may have conflicts you need to resolve. We will save your current file when you click out to VS Code. You can execute many of the actions provided in the Azure ML studio in VS Code instead, using a YAML-first approach. You may find you prefer to do certain actions (e.g. editing and debugging files) in VS Code, and other actions (e.g. Creating a training job) in the Azure ML studio. You should find you can navigate back and forth between the two seamlessly.
