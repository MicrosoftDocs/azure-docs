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
ms.date: 11/18/2020
ms.custom: how-to, devx-track-python
---

# Use workspace behind a Firewall for Azure Machine Learning

In this article, learn how to configure Azure Firewall to control access to your Azure Machine Learning workspace and the public internet. To learn more about securing Azure Machine Learning, see [Enterprise security for Azure Machine Learning](concept-enterprise-security.md)

## Azure Firewall

When using Azure Firewall, use __destination network address translation (DNAT)__ to create NAT rules for inbound traffic. For outbound traffic, create __network__ and/or __application__ rules. These rule collections are described in more detail in [What are some Azure Firewall concepts](../firewall/firewall-faq.md#what-are-some-azure-firewall-concepts).

### Inbound configuration

If you use an Azure Machine Learning __compute instance__ or __compute cluster__, add a [user-defined routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md) for the subnet that contains the Azure Machine Learning resources. This route forces traffic __from__ the IP addresses of the `BatchNodeManagement` and `AzureMachineLearning` resources to the public IP of your compute instance and compute cluster.

These UDRs enable the Batch service to communicate with compute nodes for task scheduling. Also add the IP address for the Azure Machine Learning service where the resources exist, as this is required for access to Compute Instances. To get a list of IP addresses of the Batch service and Azure Machine Learning service, use one of the following methods:

* Download the [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) and search the file for `BatchNodeManagement.<region>` and `AzureMachineLearning.<region>`, where `<region>` is your Azure region.

* Use the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true) to download the information. The following example downloads the IP address information and filters out the information for the East US 2 region:

    ```azurecli-interactive
    az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'Batch')] | [?properties.region=='eastus2']"
    az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'AzureMachineLearning')] | [?properties.region=='eastus2']"
    ```

    > [!TIP]
    > If you are using the US-Virginia, US-Arizona regions, or China-East-2 regions, these commands return no IP addresses. Instead, use one of the following links to download a list of IP addresses:
    >
    > * [Azure IP ranges and service tags for Azure Government](https://www.microsoft.com/download/details.aspx?id=57063)
    > * [Azure IP ranges and service tags for Azure China](https://www.microsoft.com//download/details.aspx?id=57062)

When you add the UDRs, define the route for each related Batch IP address prefix and set __Next hop type__ to __Internet__. The following image shows an example of this UDR in the Azure portal:

![Example of a UDR for an address prefix](./media/how-to-enable-virtual-network/user-defined-route.png)

> [!IMPORTANT]
> The IP addresses may change over time.

For more information, see [Create an Azure Batch pool in a virtual network](../batch/batch-virtual-network.md#user-defined-routes-for-forced-tunneling).

### Outbound configuration

1. Add __Network rules__, allowing traffic __to__ and __from__ the following service tags:

    * AzureActiveDirectory
    * AzureMachineLearning
    * AzureResourceManager
    * Storage.region
    * KeyVault.region
    * ContainerRegistry.region

    If you plan on using the default Docker images provided by Microsoft, and enabling user-managed dependencies, you must also add the following service tags:

    * MicrosoftContainerRegistry.region
    * AzureFrontDoor.FirstParty

    For entries that contain `region`, replace with the Azure region that you are using. For example, `keyvault.westus`.

    For the __protocol__, select `TCP`. For the source and destination __ports__, select `*`.

1. Add __Application rules__ for the following hosts:

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

    For __Protocol:Port__, select use __http, https__.

    For more information on configuring application rules, see [Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md#configure-an-application-rule).

1. To restrict access to models deployed to Azure Kubernetes Service (AKS), see [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md).

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

For information on restricting access to models deployed to Azure Kubernetes Service (AKS), see [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md).

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
