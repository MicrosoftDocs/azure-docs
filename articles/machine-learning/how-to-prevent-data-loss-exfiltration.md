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
ms.date: 08/26/2022
---

# Azure Machine Learning data exfiltration prevention (Preview)

<!-- Learn how to use a [Service Endpoint policy](../virtual-network/virtual-network-service-endpoint-policies-overview.md) to prevent data exfiltration from storage accounts in your Azure Virtual Network that are used by Azure Machine Learning. -->

Azure Machine Learning has several inbound and outbound dependencies. Some of these dependencies can expose a data exfiltration risk by malicious agents within your organization. This document explains how to minimize data exfiltration risk by limiting inbound and outbound requirements.

* __Inbound__: Azure Machine Learning compute instance and compute cluster have two inbound requirements: the `batchnodemanagement` (ports 29876-29877) and `azuremachinelearning` (port 44224) service tags. You can control this inbound traffic by using a network security group (NSG) and service tags. It's difficult to disguise Azure service IPs, so there's low data exfiltration risk. You can also configure the compute to not use a public IP, which removes inbound requirements.

* __Outbound__: If malicious agents don't have write access to outbound destination resources, they can't use that outbound for data exfiltration. Azure Active Directory, Azure Resource Manager, Azure Machine Learning, and Microsoft Container Registry belong to this category. On the other hand, Storage and AzureFrontDoor.frontend can be used for data exfiltration.

    * __Storage Outbound__: This requirement comes from compute instance and compute cluster. A malicious agent can use this outbound rule to exfiltrate data by provisioning and saving data in their own storage account. You can remove data exfiltration risk by using an Azure Service Endpoint Policy and Azure Batch's simplified node communication architecture.

    * __AzureFrontDoor.frontend outbound__: Azure Front Door is required by the Azure Machine Learning studio UI and AutoML. To narrow down the list of possible outbound destinations to just the ones required by Azure ML, allowlist the following fully qualified domain names (FQDN) on your firewall.

        - `ml.azure.com`
        - `automlresources-prod.azureedge.net`

## Prerequisites

* An Azure subscription
* An Azure Virtual Network (VNet)
* An Azure Machine Learning workspace with a private endpoint that connects to the VNet.
    * The storage account used by the workspace must also connect to the VNet using a private endpoint.

## 1. Opt in to the preview

> [!IMPORTANT]
> Before opting in to this preview, you must have created a workspace and a compute instance on the subscription you plan to use. You can delete the compute instance and/or workspace after creating them.

Use the form at [https://forms.office.com/r/1TraBek7LV](https://forms.office.com/r/1TraBek7LV) to opt in to this Azure Machine Learning preview. Microsoft will contact you once your subscription has been allowlisted to the preview.

> [!TIP]
> It may take one to two weeks to allowlist your subscription.

## 2. Allow inbound and outbound network traffic

### Inbound

> [!IMPORTANT]
> The following information __modifies__ the guidance provided in the [Inbound traffic](how-to-secure-training-vnet.md#inbound-traffic) section of the "Secure training environment with virtual networks" article.

When using Azure Machine Learning __compute instance__ _with a public IP address_, allow inbound traffic from Azure Batch management (service tag `BatchNodeManagement.<region>`). A compute instance _with no public IP_ (preview) __doesn't__ require this inbound communication.

### Outbound 

> [!IMPORTANT]
> The following information is __in addition__ to the guidance provided in the [Secure training environment with virtual networks](how-to-secure-training-vnet.md) and [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md) articles.

Select the configuration that you're using:

# [Service tag/NSG](#tab/servicetag)

__Allow__ outbound traffic over __TCP port 443__ to the following __service tags__. Replace `<region>` with the Azure region that contains your compute cluster or instance:

* `BatchNodeManagement.<region>`
* `AzureMachineLearning`
* `Storage.<region>` - A Service Endpoint Policy will be applied in a later step to limit outbound traffic. 

# [Firewall](#tab/firewall)

__Allow__ outbound traffic over __TCP port 443__ to the following FQDNs. Replace instances of `<region>` with the Azure region that contains your compute cluster or instance:

* `<region>.batch.azure.com`
* `<region>.service.batch.com`
* `*.blob.core.windows.net` - A Service Endpoint Policy will be applied in a later step to limit outbound traffic. 
* `*.queue.core.windows.net` - A Service Endpoint Policy will be applied in a later step to limit outbound traffic. 
* `*.table.core.windows.net` - A Service Endpoint Policy will be applied in a later step to limit outbound traffic. 

> [!IMPORTANT]
> If you use one firewall for multiple Azure services, having outbound storage rules impacts other services. In this case, limit thee source IP of the outbound storage rule to the address space of the subnet that contains your compute instance and compute cluster resources. This limits the rule to the compute resources in the subnet.

---

For more information, see [How to secure training environments](how-to-secure-training-vnet.md) and [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).

## 3. Enable storage endpoint for the subnet

1. From the [Azure portal](https://portal.azure.com), select the __Azure Virtual Network__ for your Azure ML workspace.
1. From the left of the page, select __Subnets__ and then select the subnet that contains your compute cluster/instance resources.
1. In the form that appears, expand the __Services__ dropdown and then __enable Microsoft.Storage__. Select __Save__ to save these changes.

## 4. Create the service endpoint policy

1. From the [Azure portal](https://portal.azure.com), add a new __Service Endpoint Policy__. On the __Basics__ tab, provide the required information and then select __Next__.
1. On the __Policy definitions__ tab, perform the following actions:
    1. Select __+ Add a resource__, and then provide the following information:
    
        > [!TIP]
        > * At least one storage account resource must be listed in the policy.
        > * If you are adding multiple storage accounts, and the _default storage account_ for your workspace is configured with a private endpoint, you do not need to include it in the policy.

        * __Service__: Microsoft.Storage
        * __Scope__: Select the scope. For example, select __Single account__ if you want to limit the network traffic to one storage account.
        * __Subscription__: The Azure subscription that contains the storage account.
        * __Resource group__: The resource group that contains the storage account.
        * __Resource__: The storage account.
    
        Select __Add__ to add the resource information.
    1. Select __+ Add an alias__, and then select `/services/Azure/MachineLearning` as the __Server Alias__ value. Select __Add__ to add the alias.
    
        > [!NOTE]
        > The Azure CLI and Azure PowerShell do not provide support for adding an alias to the policy.

1. Select __Review + Create__, and then select __Create__.


## 5. Curated environments

When using Azure ML curated environments, make sure to use the latest environment version. The container registry for the environment must also be `mcr.microsoft.com`. To check the container registry, use the following steps:

1. From [Azure ML studio](https://ml.azure.com), select your workspace and then select __Environments__.
1. Verify that the __Azure container registry__ begins with a value of `mcr.microsoft.com`.

    > [!IMPORTANT]
    > If the container registry is `viennaglobal.azurecr.io` you cannot use the curated environment with the data exfiltration preview. Try upgrading to the latest version of the curated environment.

1. When using `mcr.microsoft.com`, you must also allow outbound configuration to the following resources. Select the configuration option that you're using:

    # [Service tag/NSG](#tab/servicetag)

    __Allow__ outbound traffic over __TCP port 443__ to the following service tags. Replace `<region>` with the Azure region that contains your compute cluster or instance.

    * `MicrosoftContainerRegistry.<region>`
    * `AzureFrontDoor.FirstParty`

    # [Firewall](#tab/firewall)

    __Allow__ outbound traffic over __TCP port 443__ to the following FQDNs. Replace instances of `<region>` with the Azure region that contains your compute cluster or instance:

    * `mcr.microsoft.com`
    * `*.data.mcr.microsoft.com`

    ---

## Next steps

For more information, see the following articles:

* [How to configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md)
* [Azure Batch simplified node communication](../batch/simplified-compute-node-communication.md)