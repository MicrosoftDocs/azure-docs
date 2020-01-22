---
title: Spot virtual machine quota | Microsoft Docs
description: Increase quota limits by making spot quota requests
author: sowmyavenkat86
ms.author: svenkat
ms.date: 11/19/2019
ms.topic: article
ms.service: azure
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Spot quota: Increase limits for all VM series

Spot virtual machines (VMs) provide a different model of Azure usage. They let you assume lower costs in exchange for letting Azure remove virtual machines as needed for pay-as-you-go or reserved VM instance deployments. For more information about spot VMs, see [Azure spot VMs for virtual machine scale sets](../../virtual-machine-sets/use-spot.md).

Azure Resource Manager supports two types of vCPU quotas for virtual machines:

* *Pay-as-you-go VMs* and *reserved VM instances* are subject to a *standard vCPU quota*.
* *Spot VMs* are subject to a *spot vCPU quota*.

For the spot vCPU quota type, Resource Manager vCPU quotas are enforced across all available virtual machine series as a single regional limit.

Whenever you deploy a new spot VM, the total new and existing vCPU usage for all spot VM instances must not exceed the approved spot vCPU quota limit. If the spot quota is exceeded, the spot VM deployment isn't allowed.

This article discusses how to request an increase in the spot vCPU quota limit by using the Azure portal.

To learn more about standard vCPU quotas, see [Virtual machine vCPU quotas](../../virtual-machines/windows/quotas.md) and [Azure subscription and service limits](https://aka.ms/quotalimits). 

To learn about increasing the vCPU limit by region, see [Standard quota: Increase limits by region](regional-quota-requests.md).

## Request a quota limit increase from Help + support

To request a spot quota limit increase for all virtual machine series using **Help + support**:

> [!NOTE]
> You can also request a quota limit increase for multiple regions through a single support case. For details, see step 8.

1. On the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

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

1. In **Quota details** at the top right, do the following actions:

   ![The "Quota details" pane](./media/resource-manager-core-quotas-request/3-7.png)

   1. For **Deployment model**, select the appropriate model.

   1. For **Locations**, select a location. For the selected location, under **Types**, in **Select a type**, enter **Spot**.

      ![The "New support request" Details tab](./media/resource-manager-core-quotas-request/3-8.png)

       Under **Types**, you can request both standard and spot quota types from a single support case through multi-selection support.

       For more information, see [Standard quota: Increase limits by VM series](per-vm-quota-requests.md).

   1. Enter the new quota limit that you want for this subscription.

   ![The "New vCPU Limit" text box](./media/resource-manager-core-quotas-request/3-9.png)

1. To request a quota increase for more than one location, select an additional location in **Locations**, and then select an appropriate VM type. You can then enter a limit that applies to the additional location.

   ![Additional locations in the "Quota details" pane](./media/resource-manager-core-quotas-request/3-10.png)

1. Select **Save and continue** to continue creating the support request.

## Request a quota limit increase from the "Subscriptions" pane

To request a spot quota limit increase for all VM series from the **Subscriptions** pane:

> [!NOTE]
> You can also request a quota limit increase for multiple regions through a single support case. For details, see step 7.

1. In the [Azure portal](https://portal.azure.com), search for and select **Subscriptions**.

   ![The Subscriptions in Azure portal search](./media/resource-manager-core-quotas-request/subscriptions.png)

1. Select the subscription for an increased quota.

   ![The "Subscriptions" pane](./media/resource-manager-core-quotas-request/select-subscription.png)

1. In the left pane, select **Usage + quotas**.

   ![The "Usage + quotas" link](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

1. At the top right, select **Request increase**.

   ![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

1. For **Quota type**, select **Compute-VM (cores-vCPUs) subscription limit increases**.

   ![The "Quota type" drop-down list](./media/resource-manager-core-quotas-request/select-quota-type.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. Select **Provide details** to enter additional information. In the **Quota details** pane at the top right, do the following:

   ![The "Quota details" pane](./media/resource-manager-core-quotas-request/3-2-6.png)

   1. For **Deployment model**, select the appropriate model.

   1. For **Locations**, select a location.

   1. For the selected location, under **Types**, in **Select a type**, enter **Spot**.

      ![The "Quota details" pane](./media/resource-manager-core-quotas-request/3-2-7.png)

      For more information, see [Standard quota: Increase limits by VM series](per-vm-quota-requests.md).

   1. Enter the new quota limit that you want for this subscription.

      ![The "New vCPU Limit" text box](./media/resource-manager-core-quotas-request/3-2-8.png)

1. To request a quota increase for more than one location, select an additional location in **Locations**, and then select an appropriate VM type. You can then enter a limit that applies to the additional location.

   ![Additional locations in the "Quota details" pane](./media/resource-manager-core-quotas-request/3-2-9.png)

1. Select **Save and continue** to continue creating the support request.
