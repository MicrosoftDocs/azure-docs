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
ms.date: 08/23/2022
---

# Azure Machine Learning data exfiltration prevention (Preview)

Learn how to use a [Service Endpoint policy](/azure/virtual-network/virtual-network-service-endpoint-policies-overview) to prevent data exfiltration from storage accounts in your Azure Virtual Network that are used by Azure Machine Learning.

An Azure Machine Learning workspace requires outbound access to `storage.<region>/*.blob.core.windows.net` on the public internet, where `<region>` is the Azure region of the workspace. This outbound access is required by Azure Machine Learning compute cluster and compute instance. Both are based on Azure Batch, and need to access a storage account provided by Azure Batch on the public network.

By using a Service Endpoint Policy, you can mitigate this vulnerability. 



## Prerequisites

* An Azure subscription
* An Azure Virtual Network (VNet)
* An Azure Machine Learning workspace with a private endpoint that connects to the VNet.
    * The storage account used by the workspace must also connect to the VNet using a private endpoint.

## Limitations

* Data exfiltration prevention isn't supported with an Azure Machine Learning compute cluster or compute instance configured for __no public IP__.

## 1. Opt in to the preview

> [!IMPORTANT]
> Before opting in to this preview, you must have created a workspace and a compute instance on the subscription you plan to use. You can delete the compute instance and/or workspace after creating them.

Use the form at [https://forms.office.com/r/1TraBek7LV](https://forms.office.com/r/1TraBek7LV) to opt in to this Azure Machine Learning preview. Microsoft will contact you once your subscription has been allowlisted to the preview.

## 2. Allow inbound & outbound network traffic

### Inbound

> [!IMPORTANT]
> The following information __modifies__ the guidance provided in the [Inbound traffic](how-to-secure-training-vnet.md#inbound-traffic) section of the "Secure training environment with virtual networks" article.

__Inbound__ traffic from the service tag `BatchNodeManagement.<region>` or equivalent IP addresses is __not required__.

### Outbound

> [!IMPORTANT]
> The following information is __in addition__ to the guidance provided in the [Secure training environment with virtual networks](how-to-secure-training-vnet.md) article.

Select the configuration that you're using:

# [Network security group](#tab/nsg)

__Allow__ outbound traffic over __TCP port 443__ to the following. Replace `<region>` with the Azure region that contains your compute cluster or instance:

* `BatchNodeManagement.<region>`
* `Storage.<region>` - A Service Endpoint Policy will be applied in a later step to limit outbound traffic. 

# [Firewall](#tab/firewall)

__Allow__ outbound traffic over __TCP port 443__ to the following hosts. Replace instances of `<region>` with the Azure region that contains your compute cluster or instance:

* `<region>.batch.azure.com`
* `<region>.service.batch.com`
* `*.blob.core.windows.net` - A Service Endpoint Policy will be applied in a later step to limit outbound traffic. 
* `*.queue.core.windows.net` - A Service Endpoint Policy will be applied in a later step to limit outbound traffic. 
* `*.table.core.windows.net` - A Service Endpoint Policy will be applied in a later step to limit outbound traffic. 

---

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
    1. Select __+ Add an alias__, and then select `/services/Azure/MachineLearning` as the __Server Alias__ value. Select __Add__ to add thee alias.
1. Select __Review + Create__, and then select __Create__.

## Curated environments

When using Azure ML curated environments, make sure to use the latest environment version. The container registry for the environment must also be `mcr.microsoft.com`. To check the container registry, use the following steps:

1. From [Azure ML studio](https://ml.azure.com), select your workspace and then select __Environments__.
1. Verify that the __Azure container registry__ begins with a value of `mcr.microsoft.com`.

    > [!IMPORTANT]
    > If the container registry is `viennaglobal.azurecr.io` you cannot use the curated environment with the data exfiltration preview. Try upgrading to the latest version of the curated environment.

## Next steps

For more information, see the following articles:

* [How to configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md)
* [Azure Batch simplified node communication](/azure/batch/simplified-compute-node-communication)
