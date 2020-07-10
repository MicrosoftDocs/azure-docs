---
title: Azure classic deployment model
description: The Classic deployment model, now superseded by the Resource Manager model, enforces a global vCPU quota limit for VMs and virtual machine scale sets.
author: sowmyavenkat86
ms.author: svenkat
ms.date: 01/27/2020
ms.topic: how-to
ms.service: azure-supportability
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Classic deployment model

The Classic deployment model is the older generation Azure deployment model. It enforces a global vCPU quota limit for virtual machines and virtual machine scale sets. The Classic deployment model is no longer recommended, and is now superseded by the Resource Manager model.

To learn more about these two deployment models and the advantages of using Resource Manager, see [Resource Manager and classic deployment](../../azure-resource-manager/management/deployment-models.md).

When a new subscription is created, a default quota of vCPUs is assigned to it. Anytime a new virtual machine is to be deployed using the Classic deployment model, the sum of new and existing vCPU usage across all regions must not exceed the vCPU quota approved for the Classic deployment model.

To learn more about quotas, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).

You can request an increase in the vCPU quota limit for the Classic deployment model. Use either **Help + support** or **Usage + quotas** in the Azure portal.

## Request per VM series vCPU quota increase at subscription level using Help + support

Follow the instructions below to create a support request by using **Help + support** in the Azure portal.

1. From the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

   ![Select Help + support in the Azure portal](./media/resource-manager-core-quotas-request/help-plus-support.png)

1. Select **New support request**.

   ![Create a new support request in the Azure portal](./media/resource-manager-core-quotas-request/new-support-request.png)

1. In **Issue type**, choose **Service and subscription limits (quotas)**.

   ![Select quotas as the type of issue](./media/resource-manager-core-quotas-request/select-quota-issue-type.png)

1. Select the subscription whose quota you want to increase.

   ![Select subscription for which to increase a quota](./media/resource-manager-core-quotas-request/select-subscription-support-request.png)

1. For **Quota type**, select **Compute -VM (cores-vCPUs) subscription limit increases**.

   ![Select quota type to increase](./media/resource-manager-core-quotas-request/select-quota-type.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. Select **Provide details** to provide additional information.

   ![Provide details to help your request along](./media/resource-manager-core-quotas-request/provide-details-link.png)

1. In **Quota details**, select **Classic** and select a **Location**.

   ![Add details including Deployment model and Location](./media/resource-manager-core-quotas-request/quota-details-classic.png)

1. For **SKU family**, select one or more SKU families to increase.

   ![Specify the SKU family to increase](./media/resource-manager-core-quotas-request/sku-family-classic.png)

1. Enter the new limits you would like on the subscription. To remove a line, unselect the SKU from **SKU family** or select the discard "X" icon. After you enter a quota for each SKU family, select **Save and Continue** in **Quota details** to continue with the support request.

   ![Request new limits](./media/resource-manager-core-quotas-request/new-limits-classic.png)

## Request per VM series vCPU quota increase at subscription level using Usage + quotas

Follow the instructions below to create a support request by using **Usage + quotas** in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), search for and select **Subscriptions**.

   ![Go to Subscriptions in the Azure portal](./media/resource-manager-core-quotas-request/search-for-subscriptions.png)

1. Select the subscription whose quota you want to increase.

   ![Select subscription to modify](./media/resource-manager-core-quotas-request/select-subscription-change-quota.png)

1. Select **Usage + quotas**.

   ![Select usage and quotas for a subscription](./media/resource-manager-core-quotas-request/select-usage-plus-quotas.png)

1. In the upper right corner, select **Request increase**.

   ![Select to increase quota](./media/resource-manager-core-quotas-request/request-increase-from-subscription.png)

1. Select **Compute-VM (cores-vCPUs) subscription limit increases** as the **Quota type**.

   ![Select quota type](./media/resource-manager-core-quotas-request/select-quota-type.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. Select **Provide details** to provide additional information.

   ![Provide details for your request](./media/resource-manager-core-quotas-request/provide-details-link.png)

1. In **Quota details**, select **Classic** and a **Location**.

   ![Select quota details including deployment model and location](./media/resource-manager-core-quotas-request/quota-details-classic.png)

1. Select one or more SKU families for an increase.

   ![Select SKU family for increase](./media/resource-manager-core-quotas-request/sku-family-classic.png)

1. Enter the new limits you would like on the subscription. To remove a line, unselect the SKU from **SKU family** or select the discard "X" icon. After you enter a quota for each SKU family, select **Save and Continue** in **Quota details** to continue with the support request.

   ![Enter new quota](./media/resource-manager-core-quotas-request/new-limits-classic.png)

