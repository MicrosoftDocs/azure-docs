---
title: Service quotas and limits
description: Learn about default Azure Batch quotas, limits, and constraints, and how to request quota increases
ms.topic: conceptual
ms.date: 06/03/2020
ms.custom: seodec18
---

# Batch service quotas and limits

As with other Azure services, there are limits on certain resources associated with the Batch service. Many of these limits are default quotas applied by Azure at the subscription or account level.

Keep these quotas in mind as you design and scale up your Batch workloads. For example, if your pool doesn't reach the target number of compute nodes you specified, you might have reached the core quota limit for your Batch account.

You can run multiple Batch workloads in a single Batch account, or distribute your workloads among Batch accounts that are in the same subscription but in different Azure regions.

If you plan to run production workloads in Batch, you may need to increase one or more of the quotas above the default. If you want to raise a quota, you can open an online [customer support request](#increase-a-quota) at no charge.

## Resource quotas

A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, please contact Azure support.

Also note that quotas are not guaranteed values. Quotas can vary based on changes from the Batch service or a user request to change a quota value.

[!INCLUDE [azure-batch-limits](../../includes/azure-batch-limits.md)]

### Cores quotas in user subscription mode

If you created a [Batch account](accounts.md) with pool allocation mode set to **user subscription**, quotas are applied differently. In this mode, Batch VMs and other resources are created directly in your subscription when a pool is created. The Azure Batch cores quotas do not apply to an account created in this mode. Instead, the quotas in your subscription for regional compute cores and other resources are applied.

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

Additional limits set by the Batch service. Unlike [resource quotas](#resource-quotas), these values cannot be changed.

| **Resource** | **Maximum Limit** |
| --- | --- |
| [Concurrent tasks](batch-parallel-node-tasks.md) per compute node | 4 x number of node cores |
| [Applications](batch-application-packages.md) per Batch account | 20 |
| Application packages per application | 40 |
| Application packages per pool | 10 |
| Maximum task lifetime | 180 days<sup>1</sup> |
| [Mounts](virtual-file-mount.md) per compute node | 10 |

<sup>1</sup> The maximum lifetime of a task, from when it is added to the job to when it completes, is 180 days. Completed tasks persist for seven days; data for tasks not completed within the maximum lifetime is not accessible.

## View Batch quotas

To view your Batch account quotas in the [Azure portal](https://portal.azure.com):

1. Select **Batch accounts**, then select the Batch account you're interested in.
1. Select **Quotas** on the Batch account's menu.
1. View the quotas currently applied to the Batch account.

    ![Batch account quotas][account_quotas]

## Increase a quota

You can request a quota increase for your Batch account or your subscription using the [Azure portal](https://portal.azure.com). The type of quota increase depends on the pool allocation mode of your Batch account. To request a quota increase, you must include the VM series you would like to increase the quota for. When the quota increase is applied, it is applied to all series of VMs.

1. Select the **Help + support** tile on your portal dashboard, or the question mark (**?**) in the upper-right corner of the portal.
1. Select **New support request** > **Basics**.
1. In **Basics**:
   
    1. **Issue Type** > **Service and subscription limits (quotas)**
   
    1. Select your subscription.
   
    1. **Quota type** > **Batch**
      
       Select **Next**.
    
1. In **Details**:
      
    1. In **Provide details**, specify the location, quota type, and Batch account.
    
       ![Batch quota increase][quota_increase]

       Quota types include:

       * **Per Batch account**  
         Values specific to a single Batch account, including dedicated and low-priority cores, and number of jobs and pools.
        
       * **Per region**  
         Values that apply to all Batch accounts in a region and includes the number of Batch accounts per region per subscription.

       Low-priority quota is a single value across all VM series. If you need constrained SKUs, you must select **Low-priority cores** and include the VM families to request.

    1. Select a **Severity** according to your [business impact](https://aka.ms/supportseverity).

       Select **Next**.

1. In **Contact information**:
   
    1. Select a **Preferred contact method**.
   
    1. Verify and enter the required contact details.
   
       Select **Create** to submit the support request.

Once you've submitted your support request, Azure support will contact you. Quota requests may be completed within a few minutes or up to two business days.

## Related quotas for VM pools

Batch pools in the Virtual Machine Configuration deployed in an Azure virtual network automatically allocate additional Azure networking resources. The following resources are needed for each 50 pool nodes in a virtual network:

- One [network security group](../virtual-network/security-overview.md#network-security-groups)
- One [public IP address](../virtual-network/public-ip-addresses.md)
- One [load balancer](../load-balancer/load-balancer-overview.md)

These resources are allocated in the subscription that contains the virtual network supplied when creating the Batch pool. These resources are limited by the subscription's [resource quotas](../azure-resource-manager/management/azure-subscription-service-limits.md). If you plan large pool deployments in a virtual network, check the subscription's quotas for these resources. If needed, request an increase in the Azure portal by selecting **Help + support**.

## Next steps

* [Create an Azure Batch account using the Azure portal](batch-account-create-portal.md).
* Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
* Learn about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).

[account_quotas]: ./media/batch-quota-limit/accountquota_portal.png
[quota_increase]: ./media/batch-quota-limit/quota-increase.png
