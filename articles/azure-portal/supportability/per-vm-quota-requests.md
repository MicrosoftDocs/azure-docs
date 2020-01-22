---
title: Request an increase in vCPU quota limits per Azure VM series | Microsoft Docs
description: This article discusses how to request quota limit increases per VM vCPU.
author: sowmyavenkat86
ms.author: svenkat
ms.date: 06/07/2019
ms.topic: article
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

Whenever you deploy a new spot VM, the total new and existing vCPU usage for that VM series must not exceed the approved vCPU quota for that particular VM series. Additionally, the total number of new and existing vCPUs that are deployed across all VM series should not exceed the total approved regional vCPU quota for the subscription. If either of these quotas is exceeded, the VM deployment isn't allowed.

You can request an increase in the vCPU quota limit for the VM series by using the Azure portal. An increase in the VM series quota automatically increases the total regional vCPU limit by the same amount.

To learn more about standard vCPU quotas, see [Virtual machine vCPU quotas](../../virtual-machines/windows/quotas.md) and [Azure subscription and service limits](https://docs.microsoft.com/azure/azure-supportability/classic-deployment-model-quota-increase-requests).

To learn about increasing the vCPU limit by region for standard quota, see [Standard quota: Increase limits by region](regional-quota-requests.md).

To learn more about increasing spot VM vCPU limits, see [Spot quota: Increase limits for all VM series](low-priority-quota.md).

You can request an increase in standard vCPU quota limits per VM series in either of two ways, as described in the next sections.

## Request a standard quota increase from Help + support

To request a standard vCPU quota increase per VM series from **Help + support**:

> [!NOTE]
> You can also request a quota limit increase for multiple regions through a single support case. For details, see step 8.

1. On  the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

   ![The "Help + support" link](./media/resource-manager-core-quotas-request/helpsupport.png)

1. In **Help + support**, select **New support request**.

    ![New support request](./media/resource-manager-core-quotas-request/newsupportrequest.png)

1. For **Issue type**, select **Service and subscription limits (quotas)**.

   ![The "Issue type" drop-down list](./media/resource-manager-core-quotas-request/issuetypedropdown.png)

1. For **Subscription**, select the subscription for an increased quota.

   ![The "Subscription" drop-down list](./media/resource-manager-core-quotas-request/select-subscription-sr.png)

1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.

   ![The "Quota type" drop-down list](./media/resource-manager-core-quotas-request/select-quota-type.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. Select **Provide details** to enter additional information.

   ![The "Provide details" link](./media/resource-manager-core-quotas-request/provide-details.png)

1. In the **Quota details** pane at the top right, do the following actions:

   ![The "Quota details" pane](./media/resource-manager-core-quotas-request/1-7.png)

   1. For **Deployment model**, select the appropriate model.

   1. For **Locations** , select a location. For the selected location, under **Types**, in **Select a type**, enter **Standard**.

      ![The "Quota details" pane - quota types](./media/resource-manager-core-quotas-request/1-8.png)

      Under **Types**, you can request both standard and spot quota types from a single support case through multi-selection support.

      For more information about increasing spot quota limits, see [Azure spot VMs for virtual machine scale sets](../../virtual-machine-sets/use-spot.md).

   1. In **Standard**, select the SKU series for increased quotas.

      ![The "Quota details" pane - SKU series](./media/resource-manager-core-quotas-request/1-9.png)

   1. Enter the new quota limits that you want for this subscription. To remove a SKU from your list, clear the check box next to the SKU or select the discard "x" icon.

   ![The "New vCPU Limit" text box](./media/resource-manager-core-quotas-request/1-10.png)

1. To request a quota increase for more than one location, select an additional location in **Locations**, and then select an appropriate VM type. You can then enter a limit that applies to the additional location.

   ![Additional locations in the "Quota details" pane](./media/resource-manager-core-quotas-request/1-11.png)

1. Select **Save and continue** to continue creating the support request.

## Request a standard quota increase from Subscriptions

To request a standard vCPU quota increase per VM series from **Subscriptions**:

> [!NOTE]
> You can also request a quota limit increase for multiple regions through a single support case. For details, see step 7.

1. In the [Azure portal](https://portal.azure.com), search for and select **Subscriptions**.

   ![The "Subscriptions" link](./media/resource-manager-core-quotas-request/subscriptions.png)

1. Select the subscription for an increased quota.

   ![The "Subscriptions" pane](./media/resource-manager-core-quotas-request/select-subscription.png)

1. In the left pane, select **Usage + quotas**.

   ![The "Usage + quotas" link](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

1. At the top right, select **Request increase**.

   ![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.

   ![The "Quota type" drop-down list](./media/resource-manager-core-quotas-request/select-quota-type.png)

1. In the **Quota details** pane at the top right, do the following steps:

   ![The "Quota details" pane](./media/resource-manager-core-quotas-request/1-1-6.png)

   1. For **Deployment model**, select the appropriate model.

   1. For **Locations**, select a location.

   1. For the selected location, under **Types**, select **Select a type**, and then select **Standard**.

      ![The "Standard" check box](./media/resource-manager-core-quotas-request/1-1-7.png)

      Under **Types**, you can request both standard and low-priority quota types from a single support case through multi-selection support.

      For more information about increasing spot quota limits, see [Azure spot VMs for virtual machine scale sets](../../virtual-machine-sets/use-spot.md).

   1. For **Standard**, select the SKU series whose quotas you want to increase.

      ![The "Quota details" pane - SKU series](./media/resource-manager-core-quotas-request/1-1-8.png)

   1. Enter the new quota limits that you want for this subscription. To remove a SKU from your list, unselect the check box next to the SKU or select the discard "x" icon.

      ![The "New vCPU Limit" text box](./media/resource-manager-core-quotas-request/1-1-9.png)

1. To request a quota increase for more than one location, select an additional location in **Locations**, and then select an appropriate VM type.

   This step preloads the SKU series that you selected for earlier locations. Enter the quota limits that you want to apply to the additional series.

   ![Additional locations in the "Quota details" pane](./media/resource-manager-core-quotas-request/1-1-10.png)

1. Select **Save and continue** to continue creating the support request.
