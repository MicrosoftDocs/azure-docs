---
title: Use a firewall
titleSuffix: Azure Machine Learning
description: 'Control access to Azure Machine Learning workspaces with Azure Firewalls. Learn about the hosts that you must allow through the firewall.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 07/29/2021
ms.custom: devx-track-python
---

# Use workspace behind a Firewall for Azure Machine Learning

In this article, learn how to configure Azure Firewall to control access to your Azure Machine Learning workspace and the public internet. To learn more about securing Azure Machine Learning, see [Enterprise security for Azure Machine Learning](concept-enterprise-security.md).

> [!NOTE]
> The information in this article applies to Azure Machine Learning workspace whether it uses a private endpoint or a service endpoint.

> [!TIP]
> This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:
>
> * [Virtual network overview](how-to-network-security-overview.md)
> * [Secure the workspace resources](how-to-secure-workspace-vnet.md)
> * [Secure the training environment](how-to-secure-training-vnet.md)
> * [Secure the inference environment](how-to-secure-inferencing-vnet.md)
> * [Enable studio functionality](how-to-enable-studio-virtual-network.md)
> * [Use custom DNS](how-to-custom-dns.md)

## Required public internet access

[!INCLUDE [machine-learning-required-public-internet-access](../../includes/machine-learning-public-internet-access.md)]

## Azure Firewall

> [!IMPORTANT]
> Azure Firewall provides security _for Azure Virtual Network resources_. Some Azure Services, such as Azure Storage Accounts, have their own firewall settings that _apply to the public endpoint for that specific service instance_. The information in this document is specific to Azure Firewall.
> 
> For information on service instance firewall settings, see [Use studio in a virtual network](how-to-enable-studio-virtual-network.md#firewall-settings).

* For __inbound__ traffic to Azure Machine Learning compute cluster and compute instance, use [user-defined routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md) to skip the firewall.

* For __outbound__ traffic, create __network__ and __application__ rules. 

These rule collections are described in more detail in [What are some Azure Firewall concepts](../firewall/firewall-faq.yml#what-are-some-azure-firewall-concepts).

### Inbound configuration

When using Azure Machine Learning __compute instance__ or __compute cluster__, allow inbound traffic from Azure Batch management and Azure Machine Learning services. When creating the user-defined routes for this traffic, you can use either **IP Addresses** or **service tags** to route the traffic.

> [!IMPORTANT]
> Using service tags with user-defined routes is currently in preview and may not be fully supported. For more information, see [Virtual Network routing](../virtual-network/virtual-networks-udr-overview.md#service-tags-for-user-defined-routes-preview).

# [IP Address routes](#tab/ipaddress)

For the Azure Machine Learning service, you must add the IP address of both the __primary__ and __secondary__ regions. To find the secondary region, see the [Ensure business continuity & disaster recovery using Azure Paired Regions](../best-practices-availability-paired-regions.md#azure-regional-pairs). For example, if your Azure Machine Learning service is in East US 2, the secondary region is Central US. 

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

> [!IMPORTANT]
> The IP addresses may change over time.

When creating the UDR, set the __Next hop type__ to __Internet__. The following image shows an example IP address based UDR in the Azure portal:

:::image type="content" source="./media/how-to-enable-virtual-network/user-defined-route.png" alt-text="Image of a user-defined route configuration":::

# [Service tag routes](#tab/servicetag)

Create user-defined routes for the following service tags:

* `AzureMachineLearning`
* `BatchNodeManagement.<region>`, where `<region>` is your Azure region.

The following commands demonstrate adding routes for these service tags:

```azurecli
az network route-table route create -g MyResourceGroup --route-table-name MyRouteTable -n AzureMLRoute --address-prefix AzureMachineLearning --next-hop-type Internet
az network route-table route create -g MyResourceGroup --route-table-name MyRouteTable -n BatchRoute --address-prefix BatchNodeManagement.westus2 --next-hop-type Internet
```

---

For information on configuring UDR, see [Route network traffic with a routing table](../virtual-network/tutorial-create-route-table-portal.md).

### Outbound configuration

1. Add __Network rules__, allowing traffic __to__ and __from__ the following service tags:

    | Service tag | Protocol | Port |
    | ----- |:-----:|:-----:|
    | AzureActiveDirectory | TCP | * |
    | AzureMachineLearning | TCP | 443 |
    | AzureResourceManager | TCP | 443 |
    | Storage.region       | TCP | 443 |
    | AzureFrontDoor.FrontEnd</br>* Not needed in Azure China. | TCP | 443 | 
    | ContainerRegistry.region  | TCP | 443 |
    | MicrosoftContainerRegistry.region | TCP | 443 |

    > [!TIP]
    > * ContainerRegistry.region is only needed for custom Docker images. This includes small modifications (such as additional packages) to base images provided by Microsoft.
    > * MicrosoftContainerRegistry.region is only needed if you plan on using the _default Docker images provided by Microsoft_, and _enabling user-managed dependencies_.
    > * For entries that contain `region`, replace with the Azure region that you're using. For example, `ContainerRegistry.westus`.

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
    | **update.code.visualstudio.com**</br></br>**\*.vo.msecnd.net** | Used to retrieve VS Code server bits which are installed on the compute instance through a setup script.|
    | **raw.githubusercontent.com/microsoft/vscode-tools-for-ai/master/azureml_remote_websocket_server/\*** | Used to retrieve websocket server bits which are installed on the compute instance. The websocket server is used to transmit requests from Visual Studio Code client (desktop application) to Visual Studio Code server running on the compute instance.|
    

    For __Protocol:Port__, select use __http, https__.

    For more information on configuring application rules, see [Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md#configure-an-application-rule).

1. To restrict outbound traffic for models deployed to Azure Kubernetes Service (AKS), see the [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md) and [Deploy ML models to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md#connectivity) articles.

### Diagnostics for support

If you need to gather diagnostics information when working with Microsoft support, use the following steps:

1. Add a __Network rule__ to allow traffic to and from the `AzureMonitor` tag.
1. Add __Application rules__ for the following hosts. Select __http, https__ for the __Protocol:Port__ for these hosts:

    + **dc.applicationinsights.azure.com**
    + **dc.applicationinsights.microsoft.com**
    + **dc.services.visualstudio.com**

    For a list of IP addresses for the Azure Monitor hosts, see [IP addresses used by Azure Monitor](../azure-monitor/app/ip-addresses.md).
## Other firewalls

The guidance in this section is generic, as each firewall has its own terminology and specific configurations. If you have questions, check the documentation for the firewall you are using.

If not configured correctly, the firewall can cause problems using your workspace. There are various host names that are used both by the Azure Machine Learning workspace. The following sections list hosts that are required for Azure Machine Learning.

### Microsoft hosts

The hosts in the following tables are owned by Microsoft, and provide services required for the proper functioning of your workspace. The tables list hosts for the Azure public, Azure Government, and Azure China 21Vianet regions.

**General Azure hosts**

| **Required for** | **Azure public** | **Azure Government** | **Azure China 21Vianet** |
| ----- | ----- | ----- | ----- |
| Azure Active Directory | login.microsoftonline.com | login.microsoftonline.us | login.chinacloudapi.cn |
| Azure portal | management.azure.com | management.azure.us | management.azure.cn |
| Azure Resource Manager | management.azure.com | management.usgovcloudapi.net | management.chinacloudapi.cn |

**Azure Machine Learning hosts**

> [!IMPORTANT]
> In the following table, replace `<storage>` with the name of the default storage account for your Azure Machine Learning workspace.

| **Required for** | **Azure public** | **Azure Government** | **Azure China 21Vianet** |
| ----- | ----- | ----- | ----- |
| Azure Machine Learning studio | ml.azure.com | ml.azure.us | studio.ml.azure.cn |
| API |\*.azureml.ms | \*.ml.azure.us | \*.ml.azure.cn |
| Integrated notebook | \*.notebooks.azure.net | \*.notebooks.usgovcloudapi.net |\*.notebooks.chinacloudapi.cn |
| Integrated notebook | \<storage\>.file.core.windows.net | \<storage\>.file.core.usgovcloudapi.net | \<storage\>.file.core.chinacloudapi.cn |
| Integrated notebook | \<storage\>.dfs.core.windows.net | \<storage\>.dfs.core.usgovcloudapi.net | \<storage\>.dfs.core.chinacloudapi.cn |
| Integrated notebook | \<storage\>.blob.core.windows.net | \<storage\>.blob.core.usgovcloudapi.net | \<storage\>.blob.core.chinacloudapi.cn |
| Integrated notebook | graph.microsoft.com | graph.microsoft.us | graph.chinacloudapi.cn |
| Integrated notebook | \*.aznbcontent.net |  | |

**Azure Machine Learning compute instance and compute cluster hosts**

| **Required for** | **Azure public** | **Azure Government** | **Azure China 21Vianet** |
| ----- | ----- | ----- | ----- |
| Compute cluster/instance | \*.batchai.core.windows.net | \*.batchai.core.usgovcloudapi.net |\*.batchai.ml.azure.cn |
| Compute cluster/instance | graph.windows.net | graph.windows.net | graph.chinacloudapi.cn |
| Compute instance | \*.instances.azureml.net | \*.instances.azureml.us | \*.instances.azureml.cn |
| Compute instance | \*.instances.azureml.ms |  |  |

> [!IMPORTANT]
> Your firewall must allow communication with \*.instances.azureml.ms over __TCP__ ports __18881, 443, and 8787__.

**Associated resources used by Azure Machine Learning**

| **Required for** | **Azure public** | **Azure Government** | **Azure China 21Vianet** |
| ----- | ----- | ----- | ----- |
| Azure Storage Account | core.windows.net | core.usgovcloudapi.net | core.chinacloudapi.cn |
| Azure Container Registry | azurecr.io | azurecr.us | azurecr.cn |
| Microsoft Container Registry | mcr.microsoft.com | mcr.microsoft.com | mcr.microsoft.com |
| Azure Machine Learning pre-built images | viennaglobal.azurecr.io | viennaglobal.azurecr.io | viennaglobal.azurecr.io |

> [!TIP]
> * __Azure Container Registry__ is required for any custom Docker image. This includes small modifications (such as additional packages) to base images provided by Microsoft.
> * __Microsoft Container Registry__ is only needed if you plan on using the _default Docker images provided by Microsoft_, and _enabling user-managed dependencies_.
> * If you plan on using federated identity, follow the [Best practices for securing Active Directory Federation Services](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs) article.

Also, use the information in the [inbound configuration](#inbound-configuration) section to add IP addresses for `BatchNodeManagement` and `AzureMachineLearning`.

For information on restricting access to models deployed to AKS, see [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md).

> [!TIP]
> If you are working with Microsoft Support to gather diagnostics information, you must allow outbound traffic to the IP addresses used by Azure Monitor hosts. For a list of IP addresses for the Azure Monitor hosts, see [IP addresses used by Azure Monitor](../azure-monitor/app/ip-addresses.md).

### Python hosts

The hosts in this section are used to install Python packages, and are required during development, training, and deployment. 

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

The hosts in this section are used to install R packages, and are required during development, training, and deployment.

> [!NOTE]
> This is not a complete list of the hosts required for all R resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| **Host name** | **Purpose** |
| ---- | ---- |
| **cloud.r-project.org** | Used when installing CRAN packages. |

### Azure Kubernetes Services hosts

For information on the hosts that AKS needs to communicate with, see the [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md) and [Deploy ML models to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md#connectivity) articles.

### Visual Studio Code hosts

The hosts in this section are used to install Visual Studio Code packages to establish a remote connection between Visual Studio Code and compute instances in your Azure Machine Learning workspace.

> [!NOTE]
> This is not a complete list of the hosts required for all Visual Studio Code resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| **Host name** | **Purpose** |
| ---- | ---- |
|  **update.code.visualstudio.com**</br></br>**\*.vo.msecnd.net** | Used to retrieve VS Code server bits which are installed on the compute instance through a setup script.|
| **raw.githubusercontent.com/microsoft/vscode-tools-for-ai/master/azureml_remote_websocket_server/\*** |Used to retrieve websocket server bits which are installed on the compute instance. The websocket server is used to transmit requests from Visual Studio Code client (desktop application) to Visual Studio Code server running on the compute instance. |

## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the training environment](how-to-secure-training-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)

For more information on configuring Azure Firewall, see [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/tutorial-firewall-deploy-portal.md).
