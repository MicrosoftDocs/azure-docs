---
title: Azure classic deployment model | Microsoft Docs
description: Azure classic deployment model 
author: sowmyavenkat86
ms.author: svenkat
ms.date: 06/20/2019
ms.topic: article
ms.service: azure
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Classic Deployment Model

Classic deployment model is the older generation Azure deployment mode land enforces a global vCPU quota limit for virtual machines and virtual machine scale sets. Classic deployment model is not recommended anymore and is now superseded by Resource Manager model. To learn more about these two deployment models and advantage of Resource Manager refer to Resource Manager Deployment Model page. 
When a new subscription is created, a default quota of vCPUs is assigned to it. Anytime a new VM is to be deployed using Classic deployment model, the sum of new and existing vCPUs usage across all regions must not exceed the vCPU quota approved for the Classic deployment model. 
Learn more about quotas on [Azure subscription and service limits page](https://aka.ms/quotalimits)

You can request an increase in vCPUs limit for Classic deployment model via Help + Support blade or the Usages + Quota blade in the portal.

## Request per VM Series vCPU quota increase at subscription level using the **Help + Support** blade

Follow the instructions below to create a support request via Azure's 'Help + Support' blade available in the Azure portal. 

1. From https://portal.azure.com, select **Help + Support**.

   ![Help + Support](./media/resource-manager-core-quotas-request/helpsupport.png)
 
2.  Select **New support request**. 

      ![New support request](./media/resource-manager-core-quotas-request/newsupportrequest.png)

3. In the Issue type dropdown, choose **Service and subscription limits (quotas)**.

   ![Issue type dropdown](./media/resource-manager-core-quotas-request/issuetypedropdown.png)

4. Select the subscription that needs an increased quota.

   ![Select subscription newSR](./media/resource-manager-core-quotas-request/select-subscription-sr.png)
   
5. Select **Compute -VM (cores-vCPUs) subscription  limit increases** in **quota type** dropdown. 

   ![Select quota type](./media/resource-manager-core-quotas-request/select-quota-type.png)

6. In **Problem Details**, provide additional information to help process your request by clicking **Provide details**.

   ![Provide details](./media/resource-manager-core-quotas-request/provide-details.png)

7. In the **Quota details** panel, select Classic and select a location.

   ![Quota Details DM](./media/resource-manager-core-quotas-request/quota-details-classic.png)

8. Select the **SKU families** that require an increase. 

   ![SKU Family](./media/resource-manager-core-quotas-request/sku-family-classic.png)

9. Enter the new limits you would like on the subscription. To remove a line, uncheck the SKU from the SKU family dropdown or click the discard "x" icon. After entering the desired quota for each SKU family, click **Save and Continue** on the Quota details panel to continue with the support request creation.

   ![New Limits](./media/resource-manager-core-quotas-request/new-limits-classic.png)

## Request per VM Series vCPU quota increase at subscription level using **Usages + Quota** blade

Follow the instructions below using to create a support request via Azure's 'Usage + quota' blade available in the Azure portal. 

1. From https://portal.azure.com, select **Subscriptions**.

   ![Subscriptions](./media/resource-manager-core-quotas-request/subscriptions.png)

2. Select the subscription that needs an increased quota.

   ![Select subscription](./media/resource-manager-core-quotas-request/select-subscription.png)

3. Select **Usage + quotas**

   ![Select usage and quotas](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

4. In the upper right corner, select **Request increase**.

   ![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

5. Select **Compute-VM (cores-vCPUs) subscription limit increases** as the quote type. 

   ![Fill in form](./media/resource-manager-core-quotas-request/select-quota-type.png)
   
6. In **Problem Details**, provide additional information to help process your request by clicking **Provide details**.

   ![Provide details](./media/resource-manager-core-quotas-request/provide-details.png)

7. In the **Quota details** panel, select Classic and select a location.

   ![Quota Details DM](./media/resource-manager-core-quotas-request/quota-details-classic.png)

8. Select the **SKU families** that require an increase. 

   ![SKU Family](./media/resource-manager-core-quotas-request/sku-family-classic.png)

9. Enter the new limits you would like on the subscription. To remove a line, uncheck the SKU from the SKU family dropdown or click the discard "x" icon. After entering the desired quota for each SKU family, click **Save and Continue** on the Quota details panel to continue with the support request creation.

   ![New Limits](./media/resource-manager-core-quotas-request/new-limits-classic.png)

