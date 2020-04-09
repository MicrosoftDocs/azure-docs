---
title: Use Azure Machine Learning behind a firewall
titleSuffix: Azure Machine Learning
description: 'Securely use Azure Machine Learning behind Azure Firewall.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 03/24/2020
---

# Use Azure Machine Learning workspace behind Azure Firewall

This article contains information on configuring Azure Firewall for use with Azure Machine Learning.

Azure Firewall can be used to control access to your Azure Machine Learning workspace and the public internet. If not configured correctly, the firewall can cause problems using your workspace.

## Network rules

On your firewall, create a network rule allowing traffic to and from the addresses in this article.

> [!TIP]
> When adding the network rule, set the __Protocol__ to any, and the ports to `*`.
>
> For more information on configuring Azure Firewall, see [Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md#configure-a-network-rule).

## Microsoft hosts

The hosts in this section are owned by Microsoft, and provide services required for the proper functioning of your workspace.

| **Host name** | **Purpose** |
| ---- | ---- |
| **\*.batchai.core.windows.net** | |
| **ml.azure.com** | |
| **\*.azureml.ms** | |
| **\*.experiments.azureml.net** | |
| **\*.modelmanagement.azureml.net** | |
| **mlworkspace.azure.ai** | |
| **\*.aether.ms** | |
| **\*.instances.azureml.net** | |
| **windows.net** | Azure Blob Storage |
| **vault.azure.net** | Azure Key Vault |
| **microsoft.com** | Base docker images |
| **azurecr.io** | Azure Container Registry |

## Python hosts

The hosts in this section are used to install Python packages. They are required during development, training, and deployment. 

| **Host name** | **Purpose** |
| ---- | ---- |
| **anaconda.com** | Used when installing conda packages |
| **pypi.org** | Used when installing pip packages |

## R hosts

The hosts in this section are used to install R packages. They are required during development, training, and deployment.

> [!IMPORTANT]
> Internally, the R SDK for Azure Machine Learning uses Python packages. So you must also allow Python hosts through the firewall.

| **Host name** | **Purpose** |
| ---- | ---- |
| **cloud.r-project.org** | Used when installing CRAN packages. |
