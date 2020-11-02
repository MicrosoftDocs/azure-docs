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

In this article, learn how to configure Azure Firewall to control access to your Azure Machine Learning workspace and the public internet. To learn more about securing Azure Machine Learning, see [Enterprise security for Azure Machine Learning](concept-enterprise-security.md)

## Azure Firewall

When using Azure Firewall, use the following steps:

1. Add __Network rules__, allowing traffic __to__ and __from__ the following service tags:

    * AzureActiveDirectory
    * AzureMachineLearning
    * AzureResourceManager
    * Storage.region
    * KeyVault.region
    * ContainerRegistry.region
    * MCR.region
    * AzureFrontDoor.FirstParty

    For entries that contain `region`, replace with the Azure region that you are using. For example, `keyvault.westus`.

    For the __protocol__, select `TCP`. For the source and destination __ports__, select `*`.

2. Add __Application rules__ for the following hosts:

    | **Host name** | **Purpose** |
    | ---- | ---- |
    | **anaconda.com**</br>**\*.anaconda.com** | Used to install default packages. |
    | **\*.anaconda.org** | Used to get repo data. |
    | **pypi.org** | Used to list dependencies from the default index, if any, and the index is not overwritten by user settings. If the index is overwritten, you must also allow **\*.pythonhosted.org**. |
    | **cloud.r-project.org** | Used when installing CRAN packages for R development. |
    | **\*pytorch.org** | Used by some examples based on PyTorch. |
    | **\*.tensorflow.org** | Used by some examples based on Tensorflow. |
    | **usgovarizona.api.ml.azure.us** | Required if your workspace is in the US-Arizona (Azure Government) region. |
    | **usgovvirginia.api.ml.azure.us** | Required if your workspace is in the US-Virginia (Azure Government) region |

    For more information on configuring application rules, see [Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md#configure-an-application-rule).

3. Configure an outbound route for the subnet that contains Azure Machine Learning resources. Use the guidance in the [forced tunneling](how-to-secure-training-vnet.md#forced-tunneling) section for securing the training environment.

4. To restrict access to models deployed to Azure Kubernetes Service (AKS), see [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic).

## Other firewalls

The guidance in this section is generic, as each firewall has it's own terminology and specific configurations. If you have questions about how to allow communication through your firewall, please consult the documentation for the firewall you are using.

If not configured correctly, the firewall can cause problems using your workspace. There are a variety of host names that are used both by the Azure Machine Learning workspace. The following sections list hosts that are required for Azure Machine Learning.

### Microsoft hosts

The hosts in this section are owned by Microsoft, and provide services required for the proper functioning of your workspace.

| **Host name** | **Purpose** |
| ---- | ---- |
| **login.microsoftonline.com** | Authentication |
| **management.azure.com** | Used to get the workspace information |
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
| **\*.file.core.windows.net** | Needed by the file explorer in Azure Machine Learning studio. |
| **\*.dfs.core.windows.net** | Needed by the file explorer in Azure Machine Learning studio. |
| **graph.windows.net** | Needed for notebooks |

> [!TIP]
> If you plan on using federated identity, follow the [Best practices for securing Active Directory Federation Services](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs) article.

Also, use the information in [forced tunneling](how-to-secure-training-vnet.md#forced-tunneling) to add IP addresses for `BatchNodeManagement` and `AzureMachineLearning`.

For information on restricting access to models deployed to Azure Kubernetes Service (AKS), see [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic).

### Python hosts

The hosts in this section are used to install Python packages. They are required during development, training, and deployment. 

| **Host name** | **Purpose** |
| ---- | ---- |
| **anaconda.com**</br>**\*.anaconda.com** | Used to install default packages. |
| **\*.anaconda.org** | Used to get repo data. |
| **pypi.org** | Used to list dependencies from the default index, if any, and the index is not overwritten by user settings. If the index is overwritten, you must also allow **\*.pythonhosted.org**. |
| **\*pytorch.org** | Used by some examples based on PyTorch. |
| **\*.tensorflow.org** | Used by some examples based on Tensorflow. |

### R hosts

The hosts in this section are used to install R packages. They are required during development, training, and deployment.

> [!IMPORTANT]
> Internally, the R SDK for Azure Machine Learning uses Python packages. So you must also allow Python hosts through the firewall.

| **Host name** | **Purpose** |
| ---- | ---- |
| **cloud.r-project.org** | Used when installing CRAN packages. |

### Azure Government region

Required URLs for the Azure Government regions.

| **Host name** | **Purpose** |
| ---- | ---- |
| **usgovarizona.api.ml.azure.us** | The US-Arizona region |
| **usgovvirginia.api.ml.azure.us** | The US-Virginia region |

## Next steps

* [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/tutorial-firewall-deploy-portal.md)
* [Secure Azure ML experimentation and inference jobs within an Azure Virtual Network](how-to-network-security-overview.md)
