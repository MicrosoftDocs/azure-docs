---
title: Configure data exfiltration prevention
titleSuffix: Azure Machine Learning
description: 'How to configure data exfiltration prevention for your storage accounts.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 04/14/2023
ms.custom: engagement-fy23, build-2023
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# Azure Machine Learning data exfiltration prevention

<!-- Learn how to use a [Service Endpoint policy](../virtual-network/virtual-network-service-endpoint-policies-overview.md) to prevent data exfiltration from storage accounts in your Azure Virtual Network that are used by Azure Machine Learning. -->

Azure Machine Learning has several inbound and outbound dependencies. Some of these dependencies can expose a data exfiltration risk by malicious agents within your organization. This document explains how to minimize data exfiltration risk by limiting inbound and outbound requirements.

* __Inbound__: If your compute instance or cluster uses a public IP address, you have an inbound on `azuremachinelearning` (port 44224) service tag. You can control this inbound traffic by using a network security group (NSG) and service tags. It's difficult to disguise Azure service IPs, so there's low data exfiltration risk. You can also configure the compute to not use a public IP, which removes inbound requirements.

* __Outbound__: If malicious agents don't have write access to outbound destination resources, they can't use that outbound for data exfiltration. Azure Active Directory, Azure Resource Manager, Azure Machine Learning, and Microsoft Container Registry belong to this category. On the other hand, Storage and AzureFrontDoor.frontend can be used for data exfiltration.

    * __Storage Outbound__: This requirement comes from compute instance and compute cluster. A malicious agent can use this outbound rule to exfiltrate data by provisioning and saving data in their own storage account. You can remove data exfiltration risk by using an Azure Service Endpoint Policy and Azure Batch's simplified node communication architecture.

    * __AzureFrontDoor.frontend outbound__: Azure Front Door is used by the Azure Machine Learning studio UI and AutoML. Instead of allowing outbound to the service tag (AzureFrontDoor.frontend), switch to the following fully qualified domain names (FQDN). Switching to these FQDNs removes unnecessary outbound traffic included in the service tag and allows only what is needed for Azure Machine Learning studio UI and AutoML.

        - `ml.azure.com`
        - `automlresources-prod.azureedge.net`

> [!TIP]
> The information in this article is primarily about using an Azure Virtual Network. Azure Machine Learning can also use a **managed virtual networks** (preview). With a managed virtual network, Azure Machine Learning handles the job of network isolation for your workspace and managed computes. 
>
> To address data exfiltration concerns, managed virtual networks allow you to restrict egress to only approved outbound traffic. For more information, see [Workspace managed network isolation](how-to-managed-network.md).

## Prerequisites

* An Azure subscription
* An Azure Virtual Network (VNet)
* An Azure Machine Learning workspace with a private endpoint that connects to the VNet.
    * The storage account used by the workspace must also connect to the VNet using a private endpoint.
* You need to recreate compute instance or scale down compute cluster to zero node.
    * Not required if you have joined preview.
    * Not required if you have new compute instance and compute cluster created after December 2022.

## Why do I need to use the service endpoint policy

Service endpoint policies allow you to filter egress virtual network traffic to Azure Storage accounts over service endpoint and allow data exfiltration to only specific Azure Storage accounts. Azure Machine Learning compute instance and compute cluster requires access to Microsoft-managed storage accounts for its provisioning. The Azure Machine Learning alias in service endpoint policies includes Microsoft-managed storage accounts. We use service endpoint policies with the Azure Machine Learning alias to prevent data exfiltration or control the destination storage accounts. You can learn more in [Service Endpoint policy documentation](../virtual-network/virtual-network-service-endpoint-policies-overview.md).

## 1. Create the service endpoint policy

1. From the [Azure portal](https://portal.azure.com), add a new __Service Endpoint Policy__. On the __Basics__ tab, provide the required information and then select __Next__.
1. On the __Policy definitions__ tab, perform the following actions:
    1. Select __+ Add a resource__, and then provide the following information:
    
        <!-- > [!TIP]
        > * At least one storage account resource must be listed in the policy.
        > * If you are adding multiple storage accounts, and the _default storage account_ for your workspace is configured with a private endpoint, you do not need to include it in the policy. -->

        * __Service__: Microsoft.Storage
        * __Scope__: Select the scope as __Single account__ to limit the network traffic to one storage account.
        * __Subscription__: The Azure subscription that contains the storage account.
        * __Resource group__: The resource group that contains the storage account.
        * __Resource__: The default storage account of your workspace.
    
        Select __Add__ to add the resource information.

        :::image type="content" source="media/how-to-data-exfiltration-prevention/create-service-endpoint-policy.png" alt-text="A screenshot showing how to create a service endpoint policy." lightbox="media/how-to-data-exfiltration-prevention/create-service-endpoint-policy.png":::

    1. Select __+ Add an alias__, and then select `/services/Azure/MachineLearning` as the __Server Alias__ value. Select __Add__ to add the alias.
    
        > [!NOTE]
        > The Azure CLI and Azure PowerShell do not provide support for adding an alias to the policy.

1. Select __Review + Create__, and then select __Create__.

> [!IMPORTANT]
> If your compute instance and compute cluster need access to additional storage accounts, your service endpoint policy should include the additional storage accounts in the resources section. Note that it is not required if you use Storage private endpoints. Service endpoint policy and private endpoint are independent.

## 2. Allow inbound and outbound network traffic

### Inbound

:::moniker range="azureml-api-2"
> [!IMPORTANT]
> The following information __modifies__ the guidance provided in the [How to secure training environment](how-to-secure-training-vnet.md) article.
:::moniker-end
:::moniker range="azureml-api-1"
> [!IMPORTANT]
> The following information __modifies__ the guidance provided in the [How to secure training environment](./v1/how-to-secure-training-vnet.md) article.
:::moniker-end

When using Azure Machine Learning __compute instance__ _with a public IP address_, allow inbound traffic from Azure Batch management (service tag `BatchNodeManagement.<region>`). A compute instance _with no public IP_ __doesn't__ require this inbound communication.

### Outbound 

:::moniker range="azureml-api-2"
> [!IMPORTANT]
> The following information is __in addition__ to the guidance provided in the [Secure training environment with virtual networks](how-to-secure-training-vnet.md) and [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md) articles.
:::moniker-end
:::moniker range="azureml-api-1"
> [!IMPORTANT]
> The following information is __in addition__ to the guidance provided in the [Secure training environment with virtual networks](./v1/how-to-secure-training-vnet.md) and [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md) articles.
:::moniker-end

Select the configuration that you're using:

# [Service tag/NSG](#tab/servicetag)

__Allow__ outbound traffic to the following __service tags__. Replace `<region>` with the Azure region that contains your compute cluster or instance:

| Service tag | Protocol | Port |
| ----- | ----- | ----- |
| `BatchNodeManagement.<region>` | ANY | 443 |
| `AzureMachineLearning` | TCP | 443 |
| `Storage.<region>` | TCP | 443 |

> [!NOTE]
> For the storage outbound, a Service Endpoint Policy will be applied in a later step to limit outbound traffic. 

# [Firewall](#tab/firewall)

__Allow__ outbound traffic over __ANY port 443__ to the following FQDNs. Replace instances of `<region>` with the Azure region that contains your compute cluster or instance:

* `*.<region>.batch.azure.com`
* `*.<region>.service.batch.azure.com`

> [!WARNING]
> If you enable the service endpoint on the subnet used by your firewall, you must open outbound traffic to the following hosts over __TCP port 443__:
> * `*.blob.core.windows.net`
> * `*.queue.core.windows.net`
> * `*.table.core.windows.net`

---

:::moniker range="azureml-api-2"
For more information, see [How to secure training environments](how-to-secure-training-vnet.md) and [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).
:::moniker-end
:::moniker range="azureml-api-1"
For more information, see [How to secure training environments](./v1/how-to-secure-training-vnet.md) and [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).
:::moniker-end

## 3. Enable storage endpoint for the subnet

1. From the [Azure portal](https://portal.azure.com), select the __Azure Virtual Network__ for your Azure Machine Learning workspace.
1. From the left of the page, select __Subnets__ and then select the subnet that contains your compute cluster/instance resources.
1. In the form that appears, expand the __Services__ dropdown and then enable __Microsoft.Storage__. Select __Save__ to save these changes.
1. Apply the service endpoint policy to your workspace subnet.

:::image type="content" source="media/how-to-data-exfiltration-prevention/enable-storage-endpoint-for-subnet.png" alt-text="A screenshot of the Azure portal showing how to enable storage endpoint for the subnet." lightbox="media/how-to-data-exfiltration-prevention/enable-storage-endpoint-for-subnet.png":::

## 4. Curated environments

When using Azure Machine Learning curated environments, make sure to use the latest environment version. The container registry for the environment must also be `mcr.microsoft.com`. To check the container registry, use the following steps:

1. From [Azure Machine Learning studio](https://ml.azure.com), select your workspace and then select __Environments__.
1. Verify that the __Azure container registry__ begins with a value of `mcr.microsoft.com`.

    > [!IMPORTANT]
    > If the container registry is `viennaglobal.azurecr.io` you cannot use the curated environment with the data exfiltration. Try upgrading to the latest version of the curated environment.

1. When using `mcr.microsoft.com`, you must also allow outbound configuration to the following resources. Select the configuration option that you're using:

    # [Service tag/NSG](#tab/servicetag)

    __Allow__ outbound traffic over __TCP port 443__ to the following service tags. Replace `<region>` with the Azure region that contains your compute cluster or instance.

    * `MicrosoftContainerRegistry.<region>`
    * `AzureFrontDoor.FirstParty`

    # [Firewall](#tab/firewall)

    __Allow__ outbound traffic over __TCP port 443__ to the following FQDNs:

    * `mcr.microsoft.com`
    * `*.data.mcr.microsoft.com`

    ---

## Next steps

For more information, see the following articles:

* [How to configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md)
* [Azure Batch simplified node communication](../batch/simplified-compute-node-communication.md)
