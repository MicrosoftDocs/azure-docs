---
title: Use a firewall
titleSuffix: Azure Machine Learning
description: 'Control access to Azure Machine Learning workspaces with Azure Firewalls. Learn about the hosts that you must allow through the firewall for Azure Machine Learning to function correctly.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 04/27/2020
ms.custom: tracking-python
---

# Use workspace behind Azure Firewall for Azure Machine Learning

In this article, learn how to configure Azure Firewall for use with an Azure Machine Learning workspace.

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
| **\*.batchai.core.windows.net** | Training clusters |
| **ml.azure.com** | Azure Machine Learning studio |
| **\*.azureml.ms** | Used by Azure Machine Learning APIs |
| **\*.experiments.azureml.net** | Used by experiments running in Azure Machine Learning|
| **\*.modelmanagement.azureml.net** | Used to register and deploy models|
| **mlworkspace.azure.ai** | Used by the Azure portal when viewing a workspace |
| **\*.aether.ms** | Used when running Azure Machine Learning pipelines |
| **\*.instances.azureml.net** | Azure Machine Learning compute instances |
| **windows.net** | Azure Blob Storage |
| **vault.azure.net** | Azure Key Vault |
| **azurecr.io** | Azure Container Registry |
| **mcr.microsoft.com** | Microsoft Container Registry for base docker images |

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

Next steps

* [[Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)]
* [Secure Azure ML experimentation and inference jobs within an Azure Virtual Network](how-to-enable-virtual-network.md)
