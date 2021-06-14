---
title: Request an increase in vCPU quota limits per Azure VM series
description: How to request an increase in the vCPU quota limit for a VM series in the Azure portal, which increases the total regional vCPU limit by the same amount.
author: sowmyavenkat86
ms.author: svenkat
ms.date: 06/05/2021
ms.topic: how-to
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b
---

# Standard quota: Increase limits by VM series

Azure Resource Manager supports two types of vCPU quotas for virtual machines:

* standard vCPU quota
* spot vCPU quota

## Standard vCPU quota

Standard vCPU quota applies to pay-as-you-go VMs and reserved VM instances and it is enforced at two tiers for each subscription in each region:

* The first tier is the *total regional vCPUs limit* and is enforced across all VM series.
* The second tier is the *per-VM series vCPUs limit* and is enforced for a given VM series such as the Dv3-series vCPUs.

An increase in the VM series quota automatically increases the total regional vCPU limit by the same amount. You can request an increase in the vCPU quota limit for a VM series using either [**Help + support**](#hs) or [**Subscriptions**](#subs) in the Azure portal.

## Spot vCPU quotas

Spot vCPU quotas apply to spot VMs. When you deploy a new spot VM, the total new and existing vCPU usage for all spot VM instances must not exceed the approved spot vCPU quota limit. If the spot quota is exceeded, the spot VM cannot be deployed.

## Learn more about standard and spot vCPU quotas

* To learn more about standard vCPU quotas, see [Check vCPU quotas using Azure PowerShell](../../virtual-machines/windows/quotas.md) and [Classic deployment model](./classic-deployment-model-quota-increase-requests.md).

* To learn about increasing the vCPU limit by region for standard quota, see [Standard quota: Increase limits by region](regional-quota-requests.md).

* To learn more about increasing spot VM vCPU limits, see [Spot quota: Increase limits for all VM series](low-priority-quota.md).

## Request a standard quota increase from Help + support<a name="hs"></a>

To request a standard vCPU quota increase per VM series from **Help + support**:

> [!NOTE]
> You can also request a quota limit increase for multiple regions through a single support case. For details, see step 8.

1. On  the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

   ![The Help + support link](./media/resource-manager-core-quotas-request/help-plus-support.png)

2. In **Help + support**, select **New support request**.

    ![Create a new support request](./media/resource-manager-core-quotas-request/new-support-request.png)

3. For **Summary**, enter a concise description for your issue. For **Issue type**, select **Service and subscription limits (quotas)**.

   ![Select an issue type](./media/resource-manager-core-quotas-request/select-quota-issue-type.png)

4. For **Subscription**, select the subscription whose quota you want to increase.

   ![Select a subscription for an increased quota](./media/resource-manager-core-quotas-request/select-subscription-support-request.png)

5. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.

   ![Select a quota type](./media/resource-manager-core-quotas-request/select-quota-type.png)

6. Select **Next: Solutions** to open the **Details** tab. Click **Enter details** under **Provide details for the request** to enter additional information for your request.

   ![The "Provide details" link](./media/resource-manager-core-quotas-request/provide-details-link.png)

7. In **Quota details**, select the following information:

   ![TProvide additional quota details](./media/resource-manager-core-quotas-request/quota-details-deployment-rm-locations.png)

   a.  For **Deployment model**, select the appropriate model.
  
   b.  For **Locations**, select a location. For the selected location, select one or both quota types you want to modify. You can request  both standard and spot quota types from a single support case through multi-selection support.
   
   ![Quota details - quota types](./media/resource-manager-core-quotas-request/quota-details-select-standard-type.png)
   
   For more information about increasing spot quota limits, see [Azure spot VMs for virtual machine scale sets](../../virtual-machine-scale-sets/use-spot.md).
  
   c.  In **Standard**, select the SKU series for increased quotas.
  
  ![Quota details - SKU series](./media/resource-manager-core-quotas-request/quota-details-standard-select-series.png)
  
   d.  Enter the new quota limits that you want for this subscription. To remove a SKU from your list, clear the check box next to the SKU or select the discard "X" icon.
   
   ![Select a new vCPU Limit](./media/resource-manager-core-quotas-request/quota-details-standard-set-vcpu-limit.png)

8. To request a quota increase for multiple locations, select an additional location in **Locations**, and then select an appropriate VM type. You can then enter a limit that applies to the additional location.

   ![Specify additional locations in quota details](./media/resource-manager-core-quotas-request/quota-details-multiple-locations.png)

9. Select **Save and continue** to continue creating the support request.

## Request a standard quota increase from Subscriptions<a name="subs"></a>

To request a standard vCPU quota increase per VM series from **Subscriptions**:

> [!NOTE]
> You can also request a quota limit increase for multiple regions through a single support case. For details, see step 7.

1. In the [Azure portal](https://portal.azure.com), search for and select **Subscriptions**.

   ![Subscriptions in the Azure portal search](./media/resource-manager-core-quotas-request/search-for-subscriptions.png)

1. Select the subscription whose quota you want to increase.

   ![Subscriptions to select for changes](./media/resource-manager-core-quotas-request/select-subscription-change-quota.png)

1. In the left pane, select **Usage + quotas**.

   ![The "Usage + quotas" link](./media/resource-manager-core-quotas-request/select-usage-plus-quotas.png)

1. At the top right, select **Request increase**.

   ![Select to increase quota](./media/resource-manager-core-quotas-request/request-increase-from-subscription.png)

1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.

   ![Select a quota type](./media/resource-manager-core-quotas-request/select-quota-type.png)

1. In the **Quota details**, do the following steps:

   1. For **Deployment model**, select the appropriate model. For **Locations**, select a location.

      ![Provide quota details](./media/resource-manager-core-quotas-request/quota-details-deployment-rm-locations.png)

   1. For the selected location, under **Types**, select **Select a type**, and then select **Standard**.

      ![Select Standard type](./media/resource-manager-core-quotas-request/quota-details-select-standard-type.png)

      Under **Types**, you can request both standard and spot quota types from a single support case through multi-selection support.

      For more information about increasing spot quota limits, see [Azure spot VMs for virtual machine scale sets](../../virtual-machine-scale-sets/use-spot.md).

   1. For **Standard**, select the SKU series whose quotas you want to increase.

      ![Quota details - SKU series](./media/resource-manager-core-quotas-request/quota-details-standard-select-series.png)

   1. Enter the new quota limits that you want for this subscription. To remove a SKU from your list, unselect the check box next to the SKU or select the discard "X" icon.

      ![Select a new vCPU limit](./media/resource-manager-core-quotas-request/quota-details-standard-set-vcpu-limit.png)

1. To request a quota increase for more than one location, select an additional location in **Locations**, and then select an appropriate VM type.

   This step preloads the SKU series that you selected for earlier locations. Enter the quota limits that you want to apply to the additional series.

   ![Select additional locations in quota details](./media/resource-manager-core-quotas-request/quota-details-multiple-locations.png)

1. Select **Save and continue** to continue creating the support request.
