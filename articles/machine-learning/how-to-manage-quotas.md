---
title: Manage resources & quotas
titleSuffix: Azure Machine Learning
description: Learn about the quotas on resources for Azure Machine Learning and how to request more quota.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.reviewer: jmartens
author: nishankgu
ms.author: nigup
ms.date: 09/30/2020
ms.topic: conceptual
ms.custom: troubleshooting,contperfq4 
---

# Manage & increase quotas for resources with Azure Machine Learning


In this article, you learn about limits on Azure resources related to your [Azure Machine Learning](overview-what-is-azure-ml.md) subscription. Limits are put in place to prevent budget over-runs due to fraud, and to honor Azure capacity constraints. 

Consider these limits as you scale for production workloads. Some limits can be raised up to a Maximum Limit. If no maximum limit is specified, the limit cannot be raised.

Along with managing quotas, you can also learn how to [plan & manage costs for Azure Machine Learning](concept-plan-manage-cost.md).

## Special considerations

+ A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, [contact Azure support to increase your quota](#request-quota-increases).

+ Quota is shared across all the services in your subscriptions, including Azure Machine Learning. Calculate usage across all services when evaluating capacity needs.
    + Azure Machine Learning Compute is an exception, and has a separate quota from the core compute quota. 

+ Default limits vary by offer Category Type, such as Free Trial, Pay-As-You-Go, and virtual machine (VM) series, such as Dv2, F, G, and so on.

## Default resource quotas

In this section, you learn about the default and maximum quota limits for the following resources:

+ Virtual machines
+ Azure Machine Learning Compute
+ Azure Machine Learning pipelines
+ Container Instances
+ Storage

> [!IMPORTANT]
> Limits are subject to change. The latest can always be found at the service-level quota [document](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits/) for all of Azure.

### Virtual machines
Each Azure subscription has is a limit on the number of virtual machines across all services. Virtual machine cores have a regional total limit and a regional limit per size series (Dv2, F, etc.). Both limits are separately enforced.

For example, consider a subscription with a US East total VM core limit of 30, an A series core limit of 30, and a D series core limit of 30. This subscription would be allowed to deploy 30 A1 VMs, or 30 D1 VMs, or a combination of the two that does not exceed a total of 30 cores.

Limits for virtual machines cannot be raised above the value shown in the following table.

[!INCLUDE [azure-subscription-limits-azure-resource-manager](../../includes/azure-subscription-limits-azure-resource-manager.md)]

### Azure Machine Learning Compute
[Azure Machine Learning Compute](concept-compute-target.md#azure-machine-learning-compute-managed) has a default quota limit on both the number of cores and number of unique compute resources allowed per region in a subscription. This quota is separate from the VM core quota from the previous section.

[Request a quota increase](#request-quota-increases) to raise the limits in this section up to the **Maximum limit** shown in the table.

Available resources:
+ **Dedicated cores per region** have a default limit of 24 - 300 depending on your subscription offer type.  The number of dedicated cores per subscription can be increased for each VM family. Specialized VM families like NCv2, NCv3, or ND series start with a default of zero cores.

+ **Low-priority cores per region** have a default limit of 100 - 3000 depending on your subscription offer type. The number of low-priority cores per subscription can be increased and is a single value across VM families.

+ **Clusters per region** have a default limit of 200. These are shared between a training cluster and a compute instance (which is considered as a single node cluster for quota purposes).

The following table shows additional limits that cannot be exceeded.

| **Resource** | **Maximum limit** |
| --- | --- |
| Workspaces per resource group | 800 |
| Wodes in a single Azure Machine Learning Compute (AmlCompute) resource | 100 nodes |
| GPU MPI processes per node | 1-4 |
| GPU workers per node | 1-4 |
| Job lifetime | 21 days<sup>1</sup> |
| Job lifetime on a Low-Priority Node | 7 days<sup>2</sup> |
| Parameter servers per node | 1 |

<sup>1</sup> Maximum lifetime refers to the duration between when a run starts and finishes. Completed runs persist indefinitely. Data for runs not completed within the maximum lifetime is not accessible.
<sup>2</sup> Jobs on a Low-Priority node could be preempted anytime there is a capacity constraint. We recommend you implement check-points in your job.

### Azure Machine Learning Pipelines
[Azure Machine Learning Pipelines](concept-ml-pipelines.md) have the following limits.

| **Resource** | **Limit** |
| --- | --- |
| Steps in a pipeline | 30,000 |
| Workspaces per resource group | 800 |

### Container instances

For more information, see [Container Instances limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#container-instances-limits).

### Storage
There's a limit of 250 storage accounts per region, per subscription. This includes both Standard and Premium Storage accounts.

To increase the limit, make a request through [Azure Support](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/). The Azure Storage team will review your case and may approve up to 250 storage accounts for a region.


## Workspace level quota

Use workspace level quotas to manage Azure Machine Learning Compute target allocation between multiple [workspaces](concept-workspace.md) in the same subscription.

By default, all workspaces share the same quota as the subscription level quota for VM families. However, you can set a maximum quota for individual VM families on workspaces in a subscription. This lets you share capacity and avoid resource contention issues:

1. Navigate to any workspace in your subscription.
1. In the left pane, select **Usages + quotas**.
1. Select the **Configure quotas** tab to view the quotas.
1. Expand a VM family.
1. Set a quota limit on any workspace listed under that VM family.

You cannot set a negative value or a value higher than the subscription level quota.

[![Azure Machine Learning workspace level quota](./media/how-to-manage-quotas/azure-machine-learning-workspace-quota.png)](./media/how-to-manage-quotas/azure-machine-learning-workspace-quota.png)

> [!NOTE]
> You need subscription level permissions to set quota at the workspace level.

## View your usage and quotas

The Azure Machine Learning Compute quota on your subscription is managed separately from other Azure quotas. 

1. Navigate to your **Azure Machine Learning** workspace in the Azure portal.

2. In the left pane, under the **Support + troubleshooting section** select **Usage + quotas** to view your current quota limits and usage.

3. Select a subscription to view the quota limits. Remember to filter to the region you are interested in.

4. You can toggle between a subscription level view and a workspace level views.

Viewing your quota for various other Azure resources, such as Virtual Machines, Storage, Network, is easy through the Azure portal.

1. On the left pane, select **All services** and then select **Subscriptions** under the General category.

2. From the list of subscriptions, select the subscription whose quota you are looking for.

3. Select **Usage + quotas** to view your current quota limits and usage. Use the filters to select the provider and locations. 

## Request quota increases

To raise the limit or quota above the default limit, [open an online customer support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/) at no charge.

The limits can't be raised above the maximum limit value shown in the tables. If there is no maximum limit, then you cannot adjust the limit for the resource.

When requesting a quota increase, select the service you are requesting to raise the quota against, which could be services such as Azure Machine Learning quota, Container instances, or Storage quota. In addition for Azure Machine Learning Compute, you can click on the **Request Quota** button while viewing the quota following the steps above.

> [!NOTE]
> [Free Trial subscriptions](https://azure.microsoft.com/offers/ms-azr-0044p) are not eligible for limit or quota increases. If you have a [Free Trial subscription](https://azure.microsoft.com/offers/ms-azr-0044p), you can upgrade to a [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription. For more information, see [Upgrade Azure Free Trial to Pay-As-You-Go](../billing/billing-upgrade-azure-subscription.md) and  [Free Trial subscription FAQ](https://azure.microsoft.com/free/free-account-faq).

## Private endpoint and private DNS quota increases

There are limitations on the number of private endpoints and private DNS zones that can be created in a subscription. While Azure Machine Learning creates resources in your (customer) subscription, there are some scenarios that create resources in a Microsoft-owned subscription. In the following scenarios, you may need to request a quota allowance in the Microsoft-owned subscription:

* __Private Link enabled workspace with a customer-managed key (CMK)__
* __Azure Container Registry for the workspace behind your virtual network__
* __Attaching a Private Link enabled Azure Kubernetes Service cluster to your workspace__.

To request an allowance for these scenarios, use the following steps:

1. [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request#create-a-support-request) and select the following options from the __Basics__ section:

    | Field | Selection |
    | ----- | ----- |
    | Issue type | Technical |
    | Service | My services. Select __Machine Learning__ in the dropdown list. |
    | Problem type | Workspace setup, SDK and CLI |
    | Problem subtype | Problem provisioning or managing workspace |

2. From the __Details__ section, use the __Description__ field to provide the Azure region you want to use and the scenario that you plan to use. If you need to request quota increases for multiple subscriptions, list the subscription IDs in this field also.

3. Use __Create__ to create the request.

## Next steps

+ [Plan & manage costs for Azure Machine Learning](concept-plan-manage-cost.md)
