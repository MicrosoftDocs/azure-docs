---
title: Manage resources & quotas
titleSuffix: Azure Machine Learning
description: Learn about the quotas on resources for Azure Machine Learning and how to request more quota.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: troubleshooting

ms.reviewer: jmartens
author: nishankgu
ms.author: nigup
ms.date: 05/08/2020
ms.custom: contperfq4 
---

# Manage & increase quotas for resources with Azure Machine Learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you will learn about preconfigured limits on Azure resources for your [Azure Machine Learning](overview-what-is-azure-ml.md) subscription and what quotas you can manage. These limits are put in place to prevent budget over-runs due to fraud, and to honor Azure capacity constraints. 

As with other Azure services, there are limits on certain resources associated with Azure Machine Learning. These limits range from a cap on the number of [workspaces](concept-workspace.md) to limits on the actual underlying compute that gets used for model training or inference/scoring. 

As you design and scale your Azure Machine Learning resources for production workloads, consider these limits. For example, if your cluster doesn't reach the target number of nodes, then you may have reached an Azure Machine Learning Compute cores limit for your subscription. If you want to raise the limit or quota above the Default Limit, open an online customer support request at no charge. The limits can't be raised above the Maximum Limit value shown in the following tables due to Azure Capacity constraints. If there is no Maximum Limit column, then the resource doesn't have adjustable limits.


Along with managing quotas, you can also learn how to [plan & manage costs for Azure Machine Learning](concept-plan-manage-cost.md).

## Special considerations

+ A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, contact Azure support. You can also [increase your quotas](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quota-errors).

+ Your quota is shared across all the services in your subscriptions including Azure Machine Learning. The only exception is Azure Machine Learning compute which has a separate quota from the core compute quota. Be sure to calculate the quota usage across all services when evaluating your capacity needs.

+ Default limits vary by offer Category Type, such as Free Trial, Pay-As-You-Go, and VM series, such as Dv2, F, G, and so on.

## Default resource quotas

Here is a breakdown of the quota limits by various resource types within your Azure subscription.

> [!IMPORTANT]
> Limits are subject to change. The latest can always be found at the service-level quota [document](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits/) for all of Azure.

### Virtual machines
For each Azure subscription, there is a limit on the number of virtual machines you can have across your services or standalone. This limit is at the region level both on the total cores and also on a per family basis.

Virtual machine cores have a regional total limit and a regional per size series (Dv2, F, etc.) limit, both of which are separately enforced. For example, consider a subscription with a US East total VM core limit of 30, an A series core limit of 30, and a D series core limit of 30. This subscription would be allowed to deploy 30 A1 VMs, or 30 D1 VMs, or a combination of the two not to exceed a total of 30 cores (for example, 10 A1 VMs and 20 D1 VMs).

[!INCLUDE [azure-subscription-limits-azure-resource-manager](../../includes/azure-subscription-limits-azure-resource-manager.md)]

For a more detailed and up-to-date list of quota limits, check the [Azure-wide quota article](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits).

### Azure Machine Learning Compute
For [Azure Machine Learning Compute](concept-compute-target.md#azure-machine-learning-compute-managed), there is a default quota limit on both the number of cores and number of unique compute resources allowed per region in a subscription. This quota is separate from the VM core quota above and the core limits are not shared between the two resource types since AmlCompute is a managed service that deploys resources in a hosted-on-behalf-of model.

Available resources:
+ Dedicated cores per region have a default limit of 24 - 300 depending on your subscription offer type with higher defaults for EA and CSP offer types.  The number of dedicated cores per subscription can be increased and is different for each VM family. Certain specialized VM families like NCv2, NCv3, or ND series start with a default of zero cores. Contact Azure support by raising a quota request to discuss increase options.

+ Low-priority cores per region have a default limit of 100 - 3000 depending on your subscription offer type with higher defaults for EA and CSP offer types. The number of low-priority cores per subscription can be increased and is a single value across VM families. Contact Azure support to discuss increase options.

+ Clusters per region have a default limit of 200. These are shared between a training cluster and a compute instance (which is considered as a single node cluster for quota purposes). Contact Azure support if you want to request an increase beyond this limit.

+ There are other strict limits  that cannot be exceeded once hit.

| **Resource** | **Maximum limit** |
| --- | --- |
| Maximum workspaces per resource group | 800 |
| Maximum nodes in a single Azure Machine Learning Compute (AmlCompute) resource | 100 nodes |
| Maximum GPU MPI processes per node | 1-4 |
| Maximum GPU workers per node | 1-4 |
| Maximum job lifetime | 90 days<sup>1</sup> |
| Maximum job lifetime on a Low-Priority Node | 7 days<sup>2</sup> |
| Maximum parameter servers per node | 1 |

<sup>1</sup> The maximum lifetime refers to the time that a run start and when it finishes. Completed runs persist indefinitely; data for runs not completed within the maximum lifetime is not accessible.
<sup>2</sup> Jobs on a Low-Priority node could be preempted anytime there is a capacity constraint. We recommend you implement checkpointing in your job.

### Azure Machine Learning Pipelines
For [Azure Machine Learning Pipelines](concept-ml-pipelines.md), there is a quota limit on the number of steps in a pipeline and on the number of schedule-based runs of published pipelines per region in a subscription.
- Maximum number of steps allowed in a pipeline is 30,000
- Maximum number of the sum of schedule-based runs and blob pulls for blog-triggered schedules of published pipelines per subscription per month is 100,000

> [!NOTE]
> If you want to increase this limit, contact [Microsoft Support](https://azure.microsoft.com/support/options/).

### Container instances

There is also a limit on the number of container instances that you can spin up in a given time period (scoped hourly) or across your entire subscription.

[!INCLUDE [container-instances-limits](../../includes/container-instances-limits.md)]

For a more detailed and up-to-date list of quota limits, check the Azure-wide quota article [here](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#container-instances-limits).

### Storage
There is a limit on the number of storage accounts per region as well in a given subscription. The default limit is 250 and includes both Standard and Premium Storage accounts. If you require more than 250 storage accounts in a given region, make a request through [Azure Support](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/). The Azure Storage team will review your business case and may approve up to 250 storage accounts for a given region.


## Workspace level quota

To better manage resource allocations for Azure Machine Learning Compute target (Amlcompute) between various [workspaces](concept-workspace.md), we have introduced a feature that allows you to distribute subscription level quotas (by VM family) and configure them at the workspace level. The default behavior is that all workspaces have the same quota as the subscription level quota for any VM family. However, as the number of workspaces increases, and workloads of varying priority start sharing the same resources, users want a way to better share capacity and avoid resource contention issues. Azure Machine Learning provides a solution with its managed compute offering by allowing users to set a maximum quota for a particular VM family on each workspace. This is analogous to distributing your capacity between workspaces, and the users can choose to also over-allocate to drive maximum utilization. 

To set quotas at the workspace level, go to any workspace in your subscription, and click on **Usages + quotas** in the left pane. Then select the **Configure quotas** tab to view the quotas, expand any VM family, and set a quota limit on any workspace listed under that VM family. Remember that you cannot set a negative value or a value higher than the subscription level quota. Also, as you would observe, by default all workspaces are assigned the entire subscription quota to allow for full utilization of the allocated quota.

[![Azure Machine Learning workspace level quota](./media/how-to-manage-quotas/azure-machine-learning-workspace-quota.png)](./media/how-to-manage-quotas/azure-machine-learning-workspace-quota.png)


> [!NOTE]
> This is an Enterprise edition feature only. If you have both a [Basic and an Enterprise edition](overview-what-is-azure-ml.md#sku) workspace in your subscription, you can use this to only set quotas on your Enterprise workspaces. Your Basic workspaces will continue to have the subscription level quota which is the default behavior.
>
> You need subscription level permissions to set quota at the workspace level. This is enforced so that individual workspace owners do not edit or increase their quotas and start encroaching onto resources set aside for another workspace. Thus a subscription admin is best suited to allocate and distribute these quotas across workspaces.



## View your usage and quotas

Azure Machine Learning Compute is managed separately from other Azure resource quotas in your subscription. To view this quota, you need to drill down into Machine Learning services.  

1. On the left pane, select **Machine Learning service** and then select any workspace from the list shown.

1. On the next blade, under the **Support + troubleshooting section** select **Usage + quotas** to view your current quota limits and usage.

1. Select a subscription to view the quota limits. Remember to filter to the region you are interested in.

1. You can now toggle between a subscription level view and a workspace level view:
    + **Subscription view:** This allows you to view your usage of core quota by VM family, expanding it by workspace, and further expanding it by the actual cluster names. This view is optimal for quickly getting into the details of core usage for a particular VM family to see the break-up by workspaces and further by the underlying clusters for each of those workspaces. The general convention in this view is (usage/quota), where the usage is the current number of scaled up cores, and quota is the logical maximum number of cores that the resource can scale to. For each **workspace**, the quota would be the workspace level quota (as explained above) which denotes the maximum number of cores that you can scale to for a particular VM family. For a **cluster** similarly, the quota is actually the cores corresponding to the maximum number of nodes that the cluster can scale to defined by the max_nodes property.

    + **Workspace view:** This allows you to view your usage of core quota by Workspace, expanding it by VM family, and further expanding it by the actual cluster names. This view is optimal for quickly getting into the details of core usage for a particular workspace to see the break-up by VM families and further by the underlying clusters for each of those families.

Viewing your quota for various other Azure resources, such as Virtual Machines, Storage, Network, is easy through the Azure portal.

1. On the left pane, select **All services** and then select **Subscriptions** under the General category.

1. From the list of subscriptions, select the subscription whose quota you are looking for.

## Request quota increases

If you want to raise the limit or quota above the default limit, [open an online customer support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/) at no charge.

The limits can't be raised above the maximum limit value shown in the tables. If there is no maximum limit, then the resource doesn't have adjustable limits. [See step by step instructions on how to increase your quota](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quota-errors).

When requesting a quota increase, you need to select the service you are requesting to raise the quota against, which could be services such as Machine Learning service quota, Container instances or Storage quota. In addition for Azure Machine Learning Compute, you can click on the **Request Quota** button while viewing the quota following the steps above.

> [!NOTE]
> [Free Trial subscriptions](https://azure.microsoft.com/offers/ms-azr-0044p) are not eligible for limit or quota increases. If you have a [Free Trial subscription](https://azure.microsoft.com/offers/ms-azr-0044p), you can upgrade to a [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription. For more information, see [Upgrade Azure Free Trial to Pay-As-You-Go](../billing/billing-upgrade-azure-subscription.md) and  [Free Trial subscription FAQ](https://azure.microsoft.com/free/free-account-faq).

## Next steps

Learn more with these articles:

+ [Plan & manage costs for Azure Machine Learning](concept-plan-manage-cost.md)

+ [How to increase your quota](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quota-errors).
