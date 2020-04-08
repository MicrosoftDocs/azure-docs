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

## Hosts

Your development environment, and the Azure Machine Learning workspace, need to access the hosts listed in this section. 

On your firewall, create a network rule allowing traffic to and from the following addresses:

> [!TIP]
> When adding the network rule, set the __Protocol__ to any, and the ports to `*`.
>
> For more information on configuring Azure Firewall, see [Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md#configure-a-network-rule).

__Azure-specific hosts__

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

__Python-related hosts__

| **Host name** | **Purpose** |
| ---- | ---- |
| **anaconda.com** | Used when installing conda packages |
| **pypi.org** | Used when installing pip packages |



