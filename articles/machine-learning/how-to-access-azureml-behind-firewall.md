---
title: Use a firewall
titleSuffix: Azure Machine Learning
description: 'Control access to Azure Machine Learning workspaces with Azure Firewalls. Learn about the hosts that you must allow through the firewall.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 11/18/2020
ms.custom: how-to, devx-track-python
---

# Use workspace behind a Firewall for Azure Machine Learning

In this article, learn how to configure Azure Firewall to control access to your Azure Machine Learning workspace and the public internet. To learn more about securing Azure Machine Learning, see [Enterprise security for Azure Machine Learning](concept-enterprise-security.md).

> [!WARNING]
> Access to data storage behind a firewall is only supported in code first experiences. Using the [Azure Machine Learning studio](overview-what-is-machine-learning-studio.md) to access data behind a firewall is not supported. To work with data storage on a private network with the studio, you must first [set up a virtual network](../virtual-network/quick-create-portal.md) and [give the studio access to data stored inside of a virtual network](how-to-enable-studio-virtual-network.md).

## Azure Firewall

When using Azure Firewall, use __destination network address translation (DNAT)__ to create NAT rules for inbound traffic. For outbound traffic, create __network__ and/or __application__ rules. These rule collections are described in more detail in [What are some Azure Firewall concepts](../firewall/firewall-faq.yml#what-are-some-azure-firewall-concepts).

### Inbound configuration

If you use an Azure Machine Learning __compute instance__ or __compute cluster__, add a [user-defined routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md) for the subnet that contains the Azure Machine Learning resources. This route forces traffic __from__ the IP addresses of the `BatchNodeManagement` and `AzureMachineLearning` resources to the public IP of your compute instance and compute cluster.

These UDRs enable the Batch service to communicate with compute nodes for task scheduling. Also add the IP address for the Azure Machine Learning service, as this is required for access to Compute Instances. When adding the IP for the Azure Machine Learning service, you must add the IP for both the __primary and secondary__ Azure regions. The primary region being the one where your workspace is located.

To find the secondary region, see the [Ensure business continuity & disaster recovery using Azure Paired Regions](../best-practices-availability-paired-regions.md#azure-regional-pairs). For example, if your Azure Machine Learning service is in East US 2, the secondary region is Central US. 

To get a list of IP addresses of the Batch service and Azure Machine Learning service, use one of the following methods:

* Download the [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) and search the file for `BatchNodeManagement.<region>` and `AzureMachineLearning.<region>`, where `<region>` is your Azure region.

* Use the [Azure CLI](/cli/azure/install-azure-cli) to download the information. The following example downloads the IP address information and filters out the information for the East US 2 region (primary) and Central US region (secondary):

    ```azurecli-interactive
    az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'Batch')] | [?properties.region=='eastus2']"
    # Get primary region IPs
    az network list-service-tags -l "East US 2" --query "values[?starts_with(id, 'AzureMachineLearning')] | [?properties.region=='eastus2']"
    # Get secondary region IPs
    az network list-service-tags -l "Central US" --query "values[?starts_with(id, 'AzureMachineLearning')] | [?properties.region=='centralus']"
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

    > [!NOTE]
    > This is not a complete list of the hosts required for all Python resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

    | **Host name** | **Purpose** |
    | ---- | ---- |
    | **graph.windows.net** | Used by Azure Machine Learning compute instance/cluster. |
    | **anaconda.com**</br>**\*.anaconda.com** | Used to install default packages. |
    | **\*.anaconda.org** | Used to get repo data. |
    | **pypi.org** | Used to list dependencies from the default index, if any, and the index is not overwritten by user settings. If the index is overwritten, you must also allow **\*.pythonhosted.org**. |
    | **cloud.r-project.org** | Used when installing CRAN packages for R development. |
    | **\*pytorch.org** | Used by some examples based on PyTorch. |
    | **\*.tensorflow.org** | Used by some examples based on Tensorflow. |

    For __Protocol:Port__, select use __http, https__.

    For more information on configuring application rules, see [Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md#configure-an-application-rule).

1. To restrict access to models deployed to Azure Kubernetes Service (AKS), see [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md).

## Other firewalls

The guidance in this section is generic, as each firewall has its own terminology and specific configurations. If you have questions about how to allow communication through your firewall, please consult the documentation for the firewall you are using.

If not configured correctly, the firewall can cause problems using your workspace. There are a variety of host names that are used both by the Azure Machine Learning workspace. The following sections list hosts that are required for Azure Machine Learning.

### Microsoft hosts

The hosts in this section are owned by Microsoft, and provide services required for the proper functioning of your workspace. The following tables list the host names for the Azure public, Azure Government, and Azure China 21Vianet regions.

**General Azure hosts**

| **Required for** | **Azure public** | **Azure Government** | **Azure China 21Vianet** |
| ----- | ----- | ----- | ----- |
| Azure Active Directory | login.microsoftonline.com | login.microsoftonline.us | login.chinacloudapi.cn |
| Azure portal | management.azure.com | management.azure.us | management.azure.cn |
| Azure Resource Manager | management.azure.com | management.usgovcloudapi.net | management.chinacloudapi.cn |

**Azure Machine Learning hosts**

| **Required for** | **Azure public** | **Azure Government** | **Azure China 21Vianet** |
| ----- | ----- | ----- | ----- |
| Azure Machine Learning studio | ml.azure.com | ml.azure.us | studio.ml.azure.cn |
| API |\*.azureml.ms | \*.ml.azure.us | \*.ml.azure.cn |
| Experimentation, History, Hyperdrive, labeling | \*.experiments.azureml.net | \*.ml.azure.us | \*.ml.azure.cn |
| Model management | \*.modelmanagement.azureml.net | \*.ml.azure.us | \*.ml.azure.cn |
| Pipeline | \*.aether.ms | \*.ml.azure.us | \*.ml.azure.cn |
| Designer (studio service) | \*.studioservice.azureml.com | \*.ml.azure.us | \*.ml.azure.cn |
| Integrated notebook | \*.notebooks.azure.net | \*.notebooks.usgovcloudapi.net |\*.notebooks.chinacloudapi.cn |
| Integrated notebook | \*.file.core.windows.net | \*.file.core.usgovcloudapi.net | \*.file.core.chinacloudapi.cn |
| Integrated notebook | \*.dfs.core.windows.net | \*.dfs.core.usgovcloudapi.net | \*.dfs.core.chinacloudapi.cn |
| Integrated notebook | \*.blob.core.windows.net | \*.blob.core.usgovcloudapi.net | \*.blob.core.chinacloudapi.cn |
| Integrated notebook | graph.microsoft.com | graph.microsoft.us | graph.chinacloudapi.cn |
| Integrated notebook | \*.aznbcontent.net |  | |

**Azure Machine Learning compute instance and compute cluster hosts**

| **Required for** | **Azure public** | **Azure Government** | **Azure China 21Vianet** |
| ----- | ----- | ----- | ----- |
| Compute cluster/instance | \*.batchai.core.windows.net | \*.batchai.core.usgovcloudapi.net |\*.batchai.ml.azure.cn |
| Compute cluster/instance | graph.windows.net | graph.windows.net | graph.chinacloudapi.cn |
| Compute instance | \*.instances.azureml.net | \*.instances.azureml.us | \*.instances.azureml.cn |
| Compute instance | \*.instances.azureml.ms |  |  |

**Associated resources used by Azure Machine Learning**

| **Required for** | **Azure public** | **Azure Government** | **Azure China 21Vianet** |
| ----- | ----- | ----- | ----- |
| Azure Storage Account | core.windows.net | core.usgovcloudapi.net | core.chinacloudapi.cn |
| Azure Key Vault | vault.azure.net | vault.usgovcloudapi.net | vault.azure.cn |
| Azure Container Registry | azurecr.io | azurecr.us | azurecr.cn |
| Microsoft Container Registry | mcr.microsoft.com | mcr.microsoft.com | mcr.microsoft.com |


> [!TIP]
> If you plan on using federated identity, follow the [Best practices for securing Active Directory Federation Services](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs) article.

Also, use the information in [forced tunneling](how-to-secure-training-vnet.md#forced-tunneling) to add IP addresses for `BatchNodeManagement` and `AzureMachineLearning`.

For information on restricting access to models deployed to Azure Kubernetes Service (AKS), see [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md).

### Python hosts

The hosts in this section are used to install Python packages. They are required during development, training, and deployment. 

> [!NOTE]
> This is not a complete list of the hosts required for all Python resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| **Host name** | **Purpose** |
| ---- | ---- |
| **anaconda.com**</br>**\*.anaconda.com** | Used to install default packages. |
| **\*.anaconda.org** | Used to get repo data. |
| **pypi.org** | Used to list dependencies from the default index, if any, and the index is not overwritten by user settings. If the index is overwritten, you must also allow **\*.pythonhosted.org**. |
| **\*pytorch.org** | Used by some examples based on PyTorch. |
| **\*.tensorflow.org** | Used by some examples based on Tensorflow. |

### R hosts

The hosts in this section are used to install R packages. They are required during development, training, and deployment.

> [!NOTE]
> This is not a complete list of the hosts required for all R resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| **Host name** | **Purpose** |
| ---- | ---- |
| **cloud.r-project.org** | Used when installing CRAN packages. |

> [!IMPORTANT]
> Internally, the R SDK for Azure Machine Learning uses Python packages. So you must also allow Python hosts through the firewall.
## Next steps

* [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/tutorial-firewall-deploy-portal.md)
* [Secure Azure ML experimentation and inference jobs within an Azure Virtual Network](how-to-network-security-overview.md)
