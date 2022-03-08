---
title: Service quotas and limits
description: Learn about default Azure Batch quotas, limits, and constraints. Also learn how to request quota increases.
ms.topic: conceptual
ms.date: 12/20/2021
ms.custom: seodec18
---

# Batch service quotas and limits

As with other Azure services, there are limits on certain resources associated with Azure Batch. For example, if your pool doesn't reach your target number of compute nodes, you might have reached the core quota limit for your Batch account. Many limits are default quotas, which Azure applies at the subscription or account level. 

Keep these quotas in mind as you design and scale up your Batch workloads. You can run multiple Batch workloads in a single Batch account. Or, you can distribute your workloads among Batch accounts in the same subscription but different Azure regions. If you plan to run production workloads in Batch, you might need to increase one or more of the quotas above the default. To raise a quota, [request a quota increase](#increase-a-quota) at no charge.

## Resource quotas

A quota is a limit, not a capacity guarantee. If you have large-scale capacity needs, contact Azure support.

Also note that quotas aren't guaranteed values. Quotas can vary based on changes from the Batch service or a user request to change a quota value.

[!INCLUDE [azure-batch-limits](../../includes/azure-batch-limits.md)]

## Core quotas

### Core quotas in Batch service mode

Core quotas exist for each virtual machine (VM) series supported by Batch. These core quotas are displayed on the **Quotas** page in the Azure portal. To update VM series quota limits, [open a support request](#increase-a-quota). 

* For dedicated nodes, Batch enforces a core quota limit for each VM series, and a total core quota limit for the entire Batch account. 
* For Spot nodes, Batch enforces only a total core quota for the Batch account without any distinction between different VM series.

### Core quotas in user subscription mode

If you created a [Batch account](accounts.md) with pool allocation mode set to **user subscription**, Batch VMs and other resources are created directly in your subscription when a pool is created or resized. The Azure Batch core quotas don't apply and the quotas in your subscription for regional compute cores, per-series compute cores, and other resources are used and enforced.

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
| [Spot nodes](batch-spot-vms.md) | 1000 |

<sup>1</sup> For pools that aren't inter-node communication enabled.

## Other limits

The Batch service sets the following other limits. Unlike [resource quotas](#resource-quotas), it's not possible to change these values.

| **Resource** | **Maximum Limit** |
| --- | --- |
| [Concurrent tasks](batch-parallel-node-tasks.md) per compute node | 4 x number of node cores |
| [Applications](batch-application-packages.md) per Batch account | 200 |
| Application packages per application | 40 |
| Application packages per pool | 10 |
| Maximum task lifetime | 180 days<sup>1</sup> |
| [Mounts](virtual-file-mount.md) per compute node | 10 |
| Certificates per pool | 12 |

<sup>1</sup> The maximum lifetime of a task, from when it's added to the job to when it completes, is 180 days. Completed tasks persist for seven days; data for tasks not completed within the maximum lifetime isn't accessible.

## View Batch quotas

To view your Batch account quotas in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select or search for **Batch accounts**.
1. On the **Batch accounts** page, select the Batch account that you want to review.
1. On the Batch account's menu, under **Settings**, select **Quotas**.
1. Review the quotas currently applied to the Batch account.

    :::image type="content" source="./media/batch-quota-limit/account-quota-portal.png" alt-text="Screenshot of Batch account's quota page in the Azure portal. Highlights for the quota page in menu, button to request quota increase, and quota column in resource list.":::

## Increase a quota

You can request a quota increase for your Batch account or your subscription using the [Azure portal](https://portal.azure.com) or by using the [Azure Quota REST API](#request-through-azure-quota-rest-api).

The type of quota increase depends on the pool allocation mode of your Batch account. To request a quota increase, you must include the VM series for which you would like to increase the quota. When the quota increase is applied, it's applied to all series of VMs.

Once you've submitted your support request, Azure support will contact you. Quota requests may be completed within a few minutes or up to two business days.

### Quota types

You can select from two quota types when you [create your support request](#request-in-azure-portal).

Select **Per Batch account** to request quota increases for a single Batch account. These quota increases can include dedicated and Spot cores, and the number of jobs and pools. If you select this option, specify the Batch account to which this request applies. Then, select the quota(s) you'd like to update. Provide the new limit you're requesting for each resource. The Spot quota is a single value across all VM series. If you need constrained SKUs, select **Spot cores** and include the VM families to request.

Select **All accounts in this region** to request quota increases that apply to all Batch accounts in a region. For example, use this option to increase the number of Batch accounts per region per subscription.

### Request in Azure portal

To request a quota increase using the Azure portal, first open a support request:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select or search for **Quotas**.

1. On the **Quotas** page, select **Increase my quotas**. 

You can also open the support request as follows: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select or search for **Help + support** in the Azure portal. Or, select the question mark icon (**?**) in the portal menu. Then, in the **Support + troubleshooting** pane, select **Help + support**. 

1. On the **New support request page**, select **Create a support request**.

Next, fill out your support request.

1. On the **Basics** tab:

    1. For **Summary**, enter a description of your issue.

    1. For **Issue Type**, select **Service and subscription limits (quotas)**.

    1. For **Subscription**, select the Azure subscription where your Batch account is.

    1. For **Quota type**, select **Batch**.

    1. Select **Next: Solutions** to continue. The **Solutions** tab is skipped.

        :::image type="content" source="./media/batch-quota-limit/support-request.png" alt-text="Screenshot of new support request in the Azure portal, showing quota as the issue type and Batch as the quota type.":::

1. On the **Details** tab:

    1. Under **Problem details**, select **Enter details**.

    1. On the **Quota details** pane, for **Location**, enter the Azure region where you want to increase the quota.

    1. For **Quota type**, select your quota type. If you're not sure which option to select, see the [explanation of quota types](#quota-types).

    1. If applicable, for **Batch account**, select the Batch account to update.

    1. If applicable, for **Select Quotas to Update**, select which specific quotas to increase.

       :::image type="content" source="media/batch-quota-limit/quota-increase.png" alt-text="Screenshot of the quota increase request screen, highlighting selection box for the quota type.":::

    1. Under **Advanced diagnostic information**, choose whether to allow collection of advanced diagnostic information.

    1. Under **Support method**, select the [appropriate severity level for your business situation](https://aka.ms/supportseverity). Also select your preferred contact method and support language.

    1. Under **Contact information**, enter and verify the required contact details.

    1. Select **Next: Review + create** to continue.

1. Select **Create** to submit the support request.

### Request through Azure Quota REST API

You can use the Azure Quota REST API to request a quota increase at the subscription level or at the Batch account level.

For details and examples, see [Request a quota increase using the Azure Support REST API](/rest/api/support/quota-payload#azure-batch).

## Related quotas for VM pools

[Batch pools in a VM configuration deployed in an Azure virtual network](batch-virtual-network.md) automatically allocate more Azure networking resources. These resources are created in the subscription that contains the virtual network supplied when creating the Batch pool.

The following resources are created for each 100 pool nodes in a virtual network:

- One [network security group](../virtual-network/network-security-groups-overview.md#network-security-groups)
- One [public IP address](../virtual-network/ip-services/public-ip-addresses.md)
- One [load balancer](../load-balancer/load-balancer-overview.md)

These resources are limited by the subscription's [resource quotas](../azure-resource-manager/management/azure-subscription-service-limits.md). If you plan large pool deployments in a virtual network, you may need to request a quota increase for one or more of these resources.

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).