---
title: Service quotas and limits
description: Learn about default Azure Batch quotas, limits, and constraints, and how to request quota increases
ms.topic: conceptual
ms.date: 07/20/2021
ms.custom: seodec18
---

# Batch service quotas and limits

As with other Azure services, there are limits on certain resources associated with the Batch service. Many of these limits are default quotas applied by Azure at the subscription or account level.

Keep these quotas in mind as you design and scale up your Batch workloads. For example, if your pool doesn't reach the target number of compute nodes you specified, you might have reached the core quota limit for your Batch account.

You can run multiple Batch workloads in a single Batch account, or distribute your workloads among Batch accounts that are in the same subscription but in different Azure regions.

If you plan to run production workloads in Batch, you may need to increase one or more of the quotas above the default. To raise a quota, you can [request a quota increase](#increase-a-quota) at no charge.

## Resource quotas

A quota is a limit, not a capacity guarantee. If you have large-scale capacity needs, please contact Azure support.

Also note that quotas are not guaranteed values. Quotas can vary based on changes from the Batch service or a user request to change a quota value.

[!INCLUDE [azure-batch-limits](../../includes/azure-batch-limits.md)]

## Core quotas

### Cores quotas in Batch service mode

Core quotas exist for each VM series supported by Batch. These core quotas are displayed on the **Quotas** page in the Azure portal. VM series quota limits can be updated with a support request, as detailed below. For dedicated nodes, Batch enforces a core quota limit for each VM series, as well as a total core quota limit for the entire Batch account. For low priority nodes, Batch enforces only a total core quota for the Batch account without any distinction between different VM series.

### Cores quotas in user subscription mode

If you created a [Batch account](accounts.md) with pool allocation mode set to **user subscription**, Batch VMs and other resources are created directly in your subscription when a pool is created or resized. The Azure Batch core quotas do not apply and the quotas in your subscription for regional compute cores, per-series compute cores, and other resources are used and enforced.

To learn more about these quotas, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).

## Pool size limits

Pool size limits are set by the Batch service. Unlike [resource quotas](#resource-quotas), these values can't be changed. Only pools with inter-node communication and custom images have restrictions different from the standard quota.

| **Resource** | **Maximum Limit** |
| --- | --- |
| **Compute nodes in [inter-node communication enabled pool](batch-mpi.md)**  ||
| Batch service pool allocation mode | 100 |
| Batch subscription pool allocation mode | 80 |
| **Compute nodes in [pool created with a managed image resource](batch-custom-images.md)**<sup>1</sup> ||
| Dedicated nodes | 2000 |
| Low-priority nodes | 1000 |

<sup>1</sup> For pools that are not inter-node communication enabled.

## Other limits

These additional limits are set by the Batch service. Unlike [resource quotas](#resource-quotas), these values cannot be changed.

| **Resource** | **Maximum Limit** |
| --- | --- |
| [Concurrent tasks](batch-parallel-node-tasks.md) per compute node | 4 x number of node cores |
| [Applications](batch-application-packages.md) per Batch account | 200 |
| Application packages per application | 40 |
| Application packages per pool | 10 |
| Maximum task lifetime | 180 days<sup>1</sup> |
| [Mounts](virtual-file-mount.md) per compute node | 10 |
| Certificates per pool | 12 |

<sup>1</sup> The maximum lifetime of a task, from when it is added to the job to when it completes, is 180 days. Completed tasks persist for seven days; data for tasks not completed within the maximum lifetime is not accessible.

## View Batch quotas

To view your Batch account quotas in the [Azure portal](https://portal.azure.com):

1. Select **Batch accounts**, then select the Batch account you're interested in.
1. Select **Quotas** on the Batch account's menu.
1. View the quotas currently applied to the Batch account.

:::image type="content" source="./media/batch-quota-limit/account-quota-portal.png" alt-text="Screenshot showing Batch account quotas in the Azure portal.":::

## Increase a quota

You can request a quota increase for your Batch account or your subscription using the [Azure portal](https://portal.azure.com) or by using the [Azure Quota REST API](#azure-quota-rest-api).

The type of quota increase depends on the pool allocation mode of your Batch account. To request a quota increase, you must include the VM series you would like to increase the quota for. When the quota increase is applied, it is applied to all series of VMs.

Once you've submitted your support request, Azure support will contact you. Quota requests may be completed within a few minutes or up to two business days.

### Azure portal

1. From the **Quotas** page, select **Request quota increase**. Alternately, you can select the **Help + support** tile on your portal dashboard (or from the question mark (**?**) in the upper-right corner of the portal), and then select **New support request.**

1. In **Basics**:

    1. For **Issue Type**, select **Service and subscription limits (quotas)**.
    1. Select your subscription.
    1. For **Quota type**, select **Batch**.
    1. Select **Next** to continue.

1. In **Details**:

    1. In the **Provide details** section, specify the location, quota type, and Batch account (if applicable), then select the quota(s) to increase.

       :::image type="content" source="media/batch-quota-limit/quota-increase.png" alt-text="Screenshot of the Quota details screen when requesting a quota increase.":::

       Quota types include:

       - **Per Batch account**  
         Use this option to request quota increases specific to a single Batch account, including dedicated and low-priority cores, and the number of jobs and pools.

         If you select this option, specify the Batch account to which this request should apply, and then select the quota(s) you'd like to update. Provide the new limit you are requesting for each resource.

         Low-priority quota is a single value across all VM series. If you need constrained SKUs, you must select **Low-priority cores** and include the VM families to request.

       - **All accounts in this region**  
         Use this option to request quota increases that apply to all Batch accounts in a region, such as the number of Batch accounts per region per subscription.

    1. In **Support method**, select a **Severity** according to your [business impact](https://aka.ms/supportseverity) and your preferred contact method and support language.

    1. In **Contact information**, verify and enter the required contact details.

1. Select **Review + create**, then select **Create** to submit the support request.

### Azure Quota REST API

You can use the Azure Quota REST API to request a quota increase at the subscription level or at the Batch account level.

For details and examples, see [Request a quota increase using the Azure Support REST API](/rest/api/support/quota-payload#azure-batch).

## Related quotas for VM pools

[Batch pools in the Virtual Machine Configuration deployed in an Azure virtual network](batch-virtual-network.md) automatically allocate additional Azure networking resources. These resources are created in the subscription that contains the virtual network supplied when creating the Batch pool.

The following resources are created for each 100 pool nodes in a virtual network:

- One [network security group](../virtual-network/network-security-groups-overview.md#network-security-groups)
- One [public IP address](../virtual-network/public-ip-addresses.md)
- One [load balancer](../load-balancer/load-balancer-overview.md)

These resources are limited by the subscription's [resource quotas](../azure-resource-manager/management/azure-subscription-service-limits.md). If you plan large pool deployments in a virtual network, you may need to request a quota increase for one or more of these resources.

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).