---
title: Use a firewall
titleSuffix: Azure Machine Learning
description: 'Control access to Azure Machine Learning workspaces with Azure Firewalls. Learn about the hosts that you must allow through the firewall for Azure Machine Learning to function correctly.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 07/17/2020
ms.custom: how-to, devx-track-python
---

# Use workspace behind a Firewall for Azure Machine Learning

In this article, learn how to configure Azure Firewall to  control access to your Azure Machine Learning workspace and the public internet.   To learn more about securing Azure Machine Learning, see [Enterprise security for Azure Machine Learning](concept-enterprise-security.md)

While the information in this document is based on using [Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md), you should be able to use it with other firewall products. If you have questions about how to allow communication through your firewall, please consult the documentation for the firewall you are using.

## Application rules

On your firewall, create an _application rule_ allowing traffic to and from the addresses in this article.

> [!TIP]
> When adding the network rule, set the __Protocol__ to any, and the ports to `*`.
>
> For more information on configuring Azure Firewall, see [Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md#configure-an-application-rule).

## Microsoft hosts

If not configured correctly, the firewall can cause problems using your workspace. There are a variety of host names that are used both by the Azure Machine Learning workspace.

The hosts in this section are owned by Microsoft, and provide services required for the proper functioning of your workspace.

| **Host name** | **Purpose** |
| ---- | ---- |
| **\*.batchai.core.windows.net** | Training clusters |
| **ml.azure.com** | Azure Machine Learning studio |
| **default.exp-tas.com** | Used by the Azure Machine Learning studio |
| **\*.azureml.ms** | Used by Azure Machine Learning APIs |
| **\*.experiments.azureml.net** | Used by experiments running in Azure Machine Learning |
| **\*.modelmanagement.azureml.net** | Used to register and deploy models|
| **mlworkspace.azure.ai** | Used by the Azure portal when viewing a workspace |
| **\*.aether.ms** | Used when running Azure Machine Learning pipelines |
| **\*.instances.azureml.net** | Azure Machine Learning compute instances |
| **\*.instances.azureml.ms** | Azure Machine Learning compute instances when workspace has Private Link enabled |
| **windows.net** | Azure Blob Storage |
| **vault.azure.net** | Azure Key Vault |
| **azurecr.io** | Azure Container Registry |
| **mcr.microsoft.com** | Microsoft Container Registry for base docker images |
| **your-acr-server-name.azurecr.io** | Only needed if your Azure Container Registry is behind the virtual network. In this configuration, a private link is created from the Microsoft environment to the ACR instance in your subscription. Use the ACR server name for your Azure Machine Learning workspace. |
| **\*.notebooks.azure.net** | Needed by the notebooks in Azure Machine Learning studio. |
| **graph.windows.net** | Needed for notebooks |

## Python hosts

The hosts in this section are used to install Python packages. They are required during development, training, and deployment. 

| **Host name** | **Purpose** |
| ---- | ---- |
| **anaconda.com** | Used to install default packages. |
| **\*.anaconda.org** | Used to get repo data. |
| **pypi.org** | Used to list dependencies from the default index, if any, and the index is not overwritten by user settings. If the index is overwritten, you must also allow **\*.pythonhosted.org**. |

## R hosts

The hosts in this section are used to install R packages. They are required during development, training, and deployment.

> [!IMPORTANT]
> Internally, the R SDK for Azure Machine Learning uses Python packages. So you must also allow Python hosts through the firewall.

| **Host name** | **Purpose** |
| ---- | ---- |
| **cloud.r-project.org** | Used when installing CRAN packages. |

## Azure Government region

Required URLs for the Azure Government regions.

| **Host name** | **Purpose** |
| ---- | ---- |
| **usgovarizona.api.ml.azure.us** | The US-Arizona region |
| **usgovvirginia.api.ml.azure.us** | The US-Virginia region |

## Next steps

* [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/tutorial-firewall-deploy-portal.md)
* [Secure Azure ML experimentation and inference jobs within an Azure Virtual Network](how-to-network-security-overview.md)
