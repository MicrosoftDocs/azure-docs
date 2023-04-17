---
title: 'Work in VS Code connected to an Azure Machine Learning compute instance (preview)'
titleSuffix: Azure Machine Learning
description: Details for working with jupyter notebooks and Jupyter services from a VS Code remote connection to an Azure Machine Learning compute instance.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: lebaro
author: lebaro-msft
ms.reviewer: sgilley 
ms.date: 04/17/2023
# As a data scientist, I want to use Jupyter notebooks and Jupyter tools while working from a VS Code remote connection to my Azure Machine Learning compute instance.
---

# Work in VS Code connected to a compute instance
 
In this article, you'll learn specifics of working within a VS Code remote connection to an Azure Machine Learning compute instance. Use VS Code as your **full-featured integrated development environment (IDE)** with the power of Azure Machine Learning resources. 

VS Code has multiple extensions that can help you achieve your machine learning goals. You can work with a remote connection to your compute instance in the browser with VS Code for the Web, or the VS Code desktop application.
  * We recommend **VS Code for the Web**, as you can do all your machine learning work directly from the browser, and without any required installations or dependencies.
[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

> [!IMPORTANT]
> To connect to a compute instance behind a firewall, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md#scenario-visual-studio-code).

## Connecting to a kernel
There are a few ways to connect to a Jupyter kernel from VS Code. Its important to understand the differences in behavior, and the benefits of the different approaches.
When connecting to a kernel, we recommend you connect to a session on the compute instance. This will reconnect to an existing session and let you work transition seamleslly from Azure Machine Learning to VS Code.

## Transitioning between Azure ML and VS Code
We recommend not trying to work on the same files in both application at the same time as you may have conflicts you need to resolve. We will save your current file when you click out to VS Code.

## Signing in to Azure

## Managing extensions
Jupyter has an extension that let's you manage sessions, just like Azure ML and 


