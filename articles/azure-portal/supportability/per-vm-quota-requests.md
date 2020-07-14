---
title: Request an increase in vCPU quota limits per Azure VM series
description: How to request an increase in the vCPU quota limit for a VM series in the Azure portal, which increases the total regional vCPU limit by the same amount.
author: sowmyavenkat86
ms.author: svenkat
ms.date: 01/27/2020
ms.topic: how-to
ms.service: azure-supportability
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Standard quota: Increase limits by VM series

Azure Resource Manager supports two types of vCPU quotas for virtual machines:

* *Pay-as-you-go VMs* and *reserved VM instances* are subject to a *standard vCPU quota*.
* *Spot VMs* are subject to a *spot vCPU quota*.

The standard vCPU quota for pay-as-you-go and reserved virtual machine instances is enforced at two tiers for each subscription in each region:

* The first tier is the *total regional vCPUs limit*, across all VM series.
* The second tier is the *per-VM series vCPUs limit*, such as the Dv3-series vCPUs.

Whenever you deploy a new spot VM, the total new and existing vCPU usage for that VM series must not exceed the approved vCPU quota for that particular VM series. Additionally, the total number of new and existing vCPUs that are deployed across all VM series shouldn't exceed the total approved regional vCPU quota for the subscription. If either of these quotas is exceeded, the VM deployment isn't allowed.

You can request an increase in the vCPU quota limit for the VM series by using the Azure portal. An increase in the VM series quota automatically increases the total regional vCPU limit by the same amount.

To learn more about standard vCPU quotas, see [Virtual machine vCPU quotas](../../virtual-machines/windows/quotas.md) and [Azure subscription and service limits](https://docs.microsoft.com/azure/azure-supportability/classic-deployment-model-quota-increase-requests).

To learn about increasing the vCPU limit by region for standard quota, see [Standard quota: Increase limits by region](regional-quota-requests.md).

To learn more about increasing spot VM vCPU limits, see [Spot quota: Increase limits for all VM series](low-priority-quota.md).

You can request an increase in standard vCPU quota limits per VM series in either of two ways, as described in the following sections.

## Request a standard quota increase from Help + support

To request a standard vCPU quota increase per VM series from **Help + support**:

> [!NOTE]
> You can also request a quota limit increase for multiple regions through a single support case. For details, see step 8.

1. On  the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

   ![The Help + support link](./media/resource-manager-core-quotas-request/help-plus-support.png)

1. In **Help + support**, select **New support request**.

    ![Create a new support request](./media/resource-manager-core-quotas-request/new-support-request.png)

1. For **Issue type**, select **Service and subscription limits (quotas)**.

   ![Select an issue type](./media/resource-manager-core-quotas-request/select-quota-issue-type.png)

1. For **Subscription**, select the subscription whose quota you want to increase.

   ![Select a subscription for an increased quota](./media/resource-manager-core-quotas-request/select-subscription-support-request.png)

1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.

   ![Select a quota type](./media/resource-manager-core-quotas-request/select-quota-type.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. Select **Provide details** to enter additional information.

   ![The "Provide details" link](./media/resource-manager-core-quotas-request/provide-details-link.png)

1. In the **Quota details**, do the following steps:

   ![TProvide additional quota details](./media/resource-manager-core-quotas-request/quota-details-deployment-rm-locations.png)

   1. For **Deployment model**, select the appropriate model.

   1. For **Locations**, select a location. For the selected location, under **Types**, in **Select a type**, choose **Standard**.

      ![Quota details - quota types](./media/resource-manager-core-quotas-request/quota-details-select-standard-type.png)

      Under **Types**, you can request both standard and spot quota types from a single support case through multi-selection support.

      For more information about increasing spot quota limits, see [Azure spot VMs for virtual machine scale sets](../../virtual-machine-scale-sets/use-spot.md).

   1. In **Standard**, select the SKU series for increased quotas.

      ![Quota details - SKU series](./media/resource-manager-core-quotas-request/quota-details-standard-select-series.png)

   1. Enter the new quota limits that you want for this subscription. To remove a SKU from your list, clear the check box next to the SKU or select the discard "X" icon.

      ![Select a new vCPU Limit](./media/resource-manager-core-quotas-request/quota-details-standard-set-vcpu-limit.png)

1. To request a quota increase for more than one location, select an additional location in **Locations**, and then select an appropriate VM type. You can then enter a limit that applies to the additional location.

   ![Specify additional locations in quota details](./media/resource-manager-core-quotas-request/quota-details-multiple-locations.png)

1. Select **Save and continue** to continue creating the support request.

## Request a standard quota increase from Subscriptions

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

   1. For **Deployment model**, select the appropriate model, and for **Locations**, select a location.

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
