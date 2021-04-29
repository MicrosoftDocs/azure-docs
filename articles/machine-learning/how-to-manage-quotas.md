---
title: Manage resources and quotas
titleSuffix: Azure Machine Learning
description: Learn about the quotas and limits on resources for Azure Machine Learning and how to request quota increases.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.reviewer: jmartens
author: SimranArora904
ms.author: siarora
ms.date: 12/1/2020
ms.topic: how-to
ms.custom: troubleshooting,contperf-fy20q4, contperf-fy21q2
---

# Manage and increase quotas for resources with Azure Machine Learning

Azure uses limits and quotas to prevent budget overruns due to fraud, and to honor Azure capacity constraints. Consider these limits as you scale for production workloads. In this article, you learn about:

> [!div class="checklist"]
> + Default limits on Azure resources related to [Azure Machine Learning](overview-what-is-azure-ml.md).
> + Creating workspace-level quotas.
> + Viewing your quotas and limits.
> + Requesting quota increases.
> + Private endpoint and DNS quotas.

Along with managing quotas, you can learn how to [plan and manage costs for Azure Machine Learning](concept-plan-manage-cost.md) or learn about the [service limits in Azure Machine Learning](resource-limits-quotas-capacity.md).

## Special considerations

+ A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, [contact Azure support to increase your quota](#request-quota-increases).

+ A quota is shared across all the services in your subscriptions, including Azure Machine Learning. Calculate usage across all services when you're evaluating capacity.
 
  Azure Machine Learning compute is an exception. It has a separate quota from the core compute quota. 

+ Default limits vary by offer category type, such as free trial, pay-as-you-go, and virtual machine (VM) series (such as Dv2, F, and G).

## Default resource quotas

In this section, you learn about the default and maximum quota limits for the following resources:

+ Azure Machine Learning assets
  + Azure Machine Learning compute
  + Azure Machine Learning pipelines
+ Virtual machines
+ Azure Container Instances
+ Azure Storage

> [!IMPORTANT]
> Limits are subject to change. For the latest information, see  [Service limits in Azure Machine Learning](resource-limits-quotas-capacity.md).



### Azure Machine Learning assets
The following limits on assets apply on a per-workspace basis. 

| **Resource** | **Maximum limit** |
| --- | --- |
| Datasets | 10 million |
| Runs | 10 million |
| Models | 10 million|
| Artifacts | 10 million |

In addition, the maximum **run time** is 30 days and the maximum number of **metrics logged per run** is 1 million.

### Azure Machine Learning Compute
[Azure Machine Learning Compute](concept-compute-target.md#azure-machine-learning-compute-managed) has a default quota limit on both the number of cores (split by each VM Family and cumulative total cores) as well as the number of unique compute resources allowed per region in a subscription. This quota is separate from the VM core quota listed in the previous section as it applies only to the managed compute resources of Azure Machine Learning.

[Request a quota increase](#request-quota-increases) to raise the limits for various VM family core quotas, total subscription core quotas and resources in this section.

Available resources:
+ **Dedicated cores per region** have a default limit of 24 to 300, depending on your subscription offer type. You can increase the number of dedicated cores per subscription for each VM family. Specialized VM families like NCv2, NCv3, or ND series start with a default of zero cores.

+ **Low-priority cores per region** have a default limit of 100 to 3,000, depending on your subscription offer type. The number of low-priority cores per subscription can be increased and is a single value across VM families.

+ **Clusters per region** have a default limit of 200. These are shared between a training cluster and a compute instance. (A compute instance is considered a single-node cluster for quota purposes.)

> [!TIP]
> To learn more about which VM family to request a quota increase for, check out [virtual machine sizes in Azure](../virtual-machines/sizes.md). For instance GPU VM families start with an "N" in their family name (eg. NCv3 series)

The following table shows additional limits in the platform. Please reach out to the AzureML product team through a **technical** support ticket to request an exception.

| **Resource or Action** | **Maximum limit** |
| --- | --- |
| Workspaces per resource group | 800 |
| Nodes in a single Azure Machine Learning Compute (AmlCompute) **cluster** setup as a non communication-enabled pool (i.e. cannot run MPI jobs) | 100 nodes but configurable up to 65000 nodes |
| Nodes in a single Parallel Run Step **run** on an Azure Machine Learning Compute (AmlCompute) cluster | 100 nodes but configurable up to 65000 nodes if your cluster is setup to scale per above |
| Nodes in a single Azure Machine Learning Compute (AmlCompute) **cluster** setup as a communication-enabled pool | 300 nodes but configurable up to 4000 nodes |
| Nodes in a single Azure Machine Learning Compute (AmlCompute) **cluster** setup as a communication-enabled pool on an RDMA enabled VM Family | 100 nodes |
| Nodes in a single MPI **run** on an Azure Machine Learning Compute (AmlCompute) cluster | 100 nodes but can be increased to 300 nodes |
| GPU MPI processes per node | 1-4 |
| GPU workers per node | 1-4 |
| Job lifetime | 21 days<sup>1</sup> |
| Job lifetime on a low-priority node | 7 days<sup>2</sup> |
| Parameter servers per node | 1 |

<sup>1</sup> Maximum lifetime is the duration between when a run starts and when it finishes. Completed runs persist indefinitely. Data for runs not completed within the maximum lifetime is not accessible.
<sup>2</sup> Jobs on a low-priority node can be preempted whenever there's a capacity constraint. We recommend that you implement checkpoints in your job.

#### Azure Machine Learning pipelines
[Azure Machine Learning pipelines](concept-ml-pipelines.md) have the following limits.

| **Resource** | **Limit** |
| --- | --- |
| Steps in a pipeline | 30,000 |
| Workspaces per resource group | 800 |

### Virtual machines
Each Azure subscription has a limit on the number of virtual machines across all services. Virtual machine cores have a regional total limit and a regional limit per size series. Both limits are separately enforced.

For example, consider a subscription with a US East total VM core limit of 30, an A series core limit of 30, and a D series core limit of 30. This subscription would be allowed to deploy 30 A1 VMs, or 30 D1 VMs, or a combination of the two that does not exceed a total of 30 cores.

You can't raise limits for virtual machines above the values shown in the following table.

[!INCLUDE [azure-subscription-limits-azure-resource-manager](../../includes/azure-subscription-limits-azure-resource-manager.md)]

### Container Instances

For more information, see [Container Instances limits](../azure-resource-manager/management/azure-subscription-service-limits.md#container-instances-limits).

### Storage
Azure Storage has a limit of 250 storage accounts per region, per subscription. This limit includes both Standard and Premium storage accounts.

To increase the limit, make a request through [Azure Support](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/). The Azure Storage team will review your case and can approve up to 250 storage accounts for a region.


## Workspace-level quotas

Use workspace-level quotas to manage Azure Machine Learning compute target allocation between multiple [workspaces](concept-workspace.md) in the same subscription.

By default, all workspaces share the same quota as the subscription-level quota for VM families. However, you can set a maximum quota for individual VM families on workspaces in a subscription. This lets you share capacity and avoid resource contention issues.

1. Go to any workspace in your subscription.
1. In the left pane, select **Usages + quotas**.
1. Select the **Configure quotas** tab to view the quotas.
1. Expand a VM family.
1. Set a quota limit on any workspace listed under that VM family.

You can't set a negative value or a value higher than the subscription-level quota.

[![Screenshot that shows an Azure Machine Learning workspace-level quota.](./media/how-to-manage-quotas/azure-machine-learning-workspace-quota.png)](./media/how-to-manage-quotas/azure-machine-learning-workspace-quota.png)

> [!NOTE]
> You need subscription-level permissions to set a quota at the workspace level.

## View your usage and quotas

To view your quota for various Azure resources like virtual machines, storage, or network, use the Azure portal:

1. On the left pane, select **All services** and then select **Subscriptions** under the **General** category.

2. From the list of subscriptions, select the subscription whose quota you're looking for.

3. Select **Usage + quotas** to view your current quota limits and usage. Use the filters to select the provider and locations. 

You manage the Azure Machine Learning compute quota on your subscription separately from other Azure quotas: 

1. Go to your **Azure Machine Learning** workspace in the Azure portal.

2. On the left pane, in the **Support + troubleshooting** section, select **Usage + quotas** to view your current quota limits and usage.

3. Select a subscription to view the quota limits. Filter to the region you're interested in.

4. You can switch between a subscription-level view and a workspace-level view.

## Request quota increases

To raise the limit or quota above the default limit, [open an online customer support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/) at no charge.

You can't raise limits above the maximum values shown in the preceding tables. If there's no maximum limit, you can't adjust the limit for the resource.

When you're requesting a quota increase, select the service that you have in mind. For example, select Azure Machine Learning, Container Instances, or Storage. For Azure Machine Learning compute, you can select the **Request Quota** button while viewing the quota in the preceding steps.

> [!NOTE]
> [Free trial subscriptions](https://azure.microsoft.com/offers/ms-azr-0044p) are not eligible for limit or quota increases. If you have a free trial subscription, you can upgrade to a [pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription. For more information, see [Upgrade Azure free trial to pay-as-you-go](../cost-management-billing/manage/upgrade-azure-subscription.md) and [Azure free account FAQ](https://azure.microsoft.com/free/free-account-faq).

## Private endpoint and private DNS quota increases

There are limits on the number of private endpoints and private DNS zones that you can create in a subscription.

Azure Machine Learning creates resources in your (customer) subscription, but some scenarios create resources in a Microsoft-owned subscription.

 In the following scenarios, you might need to request a quota allowance in the Microsoft-owned subscription:

* Azure Private Link enabled workspace with a customer-managed key (CMK)
* Attaching a Private Link enabled Azure Kubernetes Service cluster to your workspace

To request an allowance for these scenarios, use the following steps:

1. [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md#create-a-support-request) and select the following options in the __Basics__ section:

    | Field | Selection |
    | ----- | ----- |
    | Issue type | **Technical** |
    | Service | **My services**. Then select __Machine Learning__ in the drop-down list. |
    | Problem type | **Workspace Configuration and Security** |
    | Problem subtype | **Private Endpoint and Private DNS Zone allowance request** |

2. In the __Details__ section, use the __Description__ field to provide the Azure region and the scenario that you plan to use. If you need to request quota increases for multiple subscriptions, list the subscription IDs in this field.

3. Select __Create__ to create the request.

:::image type="content" source="media/how-to-manage-quotas/quota-increase-private-endpoint.png" alt-text="Screenshot of a private endpoint and private DNS quota increase request.":::

## Next steps

+ [Plan and manage costs for Azure Machine Learning](concept-plan-manage-cost.md)
+ [Service limits in Azure Machine Learning](resource-limits-quotas-capacity.md)