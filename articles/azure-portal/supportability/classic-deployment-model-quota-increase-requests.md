---
title: Azure classic deployment model | Microsoft Docs
description: Azure classic deployment model 
author: sowmyavenkat86
ms.author: svenkat
ms.date: 06/20/2019
ms.topic: article
ms.service: azure-supportability
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Classic Deployment Model

The Classic deployment model is the older generation Azure deployment model. It enforces a global vCPU quota limit for virtual machines and virtual machine scale sets. The Classic deployment model is no longer recommended, and is now superseded by the Resource Manager model.

To learn more about these two deployment models and the advantages of using Resource Manager, see [Resource Manager and classic deployment](../../azure-resource-manager/management/deployment-models.md).

When a new subscription is created, a default quota of vCPUs is assigned to it. Anytime a new virual machine is to be deployed using the Classic deployment model, the sum of new and existing vCPU usage across all regions must not exceed the vCPU quota approved for the Classic deployment model.

Learn more about quotas on the [Azure subscription and service limits](https://aka.ms/quotalimits) page.

You can request an increase in the vCPU quota limit for the Classic deployment model by using **Help + support** or **Usage + quotas** in the Azure portal.

## Request per VM series vCPU quota increase at subscription level using Help + support

Follow the instructions below to create a support request by using **Help + support** in the Azure portal.

1. From the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

   ![Help + support](./media/resource-manager-core-quotas-request/helpsupport.png)

1. Select **New support request**.

   ![New support request](./media/resource-manager-core-quotas-request/newsupportrequest.png)

1. In **Issue type**, choose **Service and subscription limits (quotas)**.

   ![Issue type dropdown](./media/resource-manager-core-quotas-request/issuetypedropdown.png)

1. Select the subscription for an increased quota.

   ![Select subscription newSR](./media/resource-manager-core-quotas-request/select-subscription-sr.png)

1. For **Quota type**, select **Compute -VM (cores-vCPUs) subscription limit increases**.

   ![Select quota type](./media/resource-manager-core-quotas-request/select-quota-type.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. Select **Provide details** to provide additional information.

   ![Provide details](./media/resource-manager-core-quotas-request/provide-details.png)

1. In **Quota details**, select **Classic** and select a **Location**.

   ![Quota Details DM](./media/resource-manager-core-quotas-request/quota-details-classic.png)

1. Select one or more **SKU family** to increase.

   ![SKU Family](./media/resource-manager-core-quotas-request/sku-family-classic.png)

1. Enter the new limits you would like on the subscription. To remove a line, unselect the SKU from **SKU family** or select the discard "x" icon. After you enter a quota for each SKU family, select **Save and Continue** in **Quota details** to continue with the support request.

   ![New Limits](./media/resource-manager-core-quotas-request/new-limits-classic.png)

## Request per VM series vCPU quota increase at subscription level using Usage + quotas

Follow the instructions below using to create a support request by using **Usage + quotas** in the Azure portal. 

1. In the [Azure portal](https://portal.azure.com), search for and select **Subscriptions**.

   ![Subscriptions](./media/resource-manager-core-quotas-request/subscriptions.png)

1. Select the subscription for an increased quota.

   ![Select subscription](./media/resource-manager-core-quotas-request/select-subscription.png)

1. Select **Usage + quotas**

   ![Select usage and quotas](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

1. In the upper right corner, select **Request increase**.

   ![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

1. Select **Compute-VM (cores-vCPUs) subscription limit increases** as the quote type.

   ![Fill in form](./media/resource-manager-core-quotas-request/select-quota-type.png)

1. Select **Next: Solutions** to open **PROBLEM DETAILS**. Select **Provide details** to provide additional information.

   ![Provide details](./media/resource-manager-core-quotas-request/provide-details.png)

1. In **Quota details**, select **Classic** and a **Location**.

   ![Quota Details DM](./media/resource-manager-core-quotas-request/quota-details-classic.png)

1. Select one or more **SKU family** for an increase.

   ![SKU Family](./media/resource-manager-core-quotas-request/sku-family-classic.png)

1. Enter the new limits you would like on the subscription. To remove a line, unselect the SKU from **SKU family** or select the discard "x" icon. After you enter a quota for each SKU family, select **Save and Continue** in **Quota details** to continue with the support request.

   ![New Limits](./media/resource-manager-core-quotas-request/new-limits-classic.png)

