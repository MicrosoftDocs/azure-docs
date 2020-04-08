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

Azure Firewall can be used to restrict access to and from your Azure Machine Learning workspace and the public internet. However, there are hosts, IP addresses, and ports that need to be enabled on the firewall for your workspace to correctly function. Use the information in this article to correctly configure your firewall for Azure Machine Learning.



## Hosts

You must configure a network rule allowing traffic to and from the following addresses:

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
| **anaconda.com** | Used when installing conda packages |
| **pypi.org** | Used when installing pip packages |
| **windows.net** | Azure Blob Storage |
| **vault.azure.net** | Azure Key Vault |
| **microsoft.com** | Base docker images |
| **azurecr.io** | Azure Container Registry |

When adding the network rule, set the __Protocol__ to any, and the ports to `*`.

For more information on configuring Azure Firewall, see [Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md#configure-a-network-rule).

## IP Addresses

## Ports

