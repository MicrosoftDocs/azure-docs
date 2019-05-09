---
title: Azure Resource Manager vCPU quota increase requests | Microsoft Docs
description: Azure Resource Manager vCPU quota increase requests
author: sowmyavenkat86
ms.author: svenkat
ms.date: 5/9/2019
ms.topic: article
ms.service: azure
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Resource Manager vCPU quota increase requests

Resource Manager vCPU quotas are enforced at the region level and SKU family level.
Learn more about how quotas are enforced on the [Azure subscription and service limits](https://aka.ms/quotalimits) page.
To learn more about SKU Families, you may compare cost and performance on the [Virtual Machines Pricing](https://aka.ms/pricingcompute) page.

You can now request an increase via **Help + Support** blade or the **Usages + Quota** blade in the portal. 

## Quota increase using the **Help + Support** blade

Follow the instructions below to create a support request via Azure's 'Help + Support' blade available in the Azure Portal. 

1. From https://portal.azure.com, select **Help + Support**.

 ![Help + Support](./media/resource-manager-core-quotas-request/helpsupport.png)
 
2.  Select **New support request**. 

![New support request](./media/resource-manager-core-quotas-request/newsupportrequest.png)

3. In the Issue type dropdown, choose **Service and subscription limits (quotas)**.

![Issue type dropdown](./media/resource-manager-core-quotas-request/issuetypedropdown.png)

4. Select the subscription that needs an increased quota.

![Select subscription newSR](./media/resource-manager-core-quotas-request/select-subscriptionSR.png)
   
5. Select **Compute -VM (cores-vCPUs) subscription  limit increases** in **quota type** dropdown. 

![Select quota type](./media/resource-manager-core-quotas-request/select-quota-type.png)

6. In **Problem Details**, provide additional information to help process your request by clicking **Provide details**.

![Provide details](./media/resource-manager-core-quotas-request/provide-details.png)

7. In the **Quota details** panel, select Deployment model as "Resource Manager" and select a location.

![Quota Details DM](./media/resource-manager-core-quotas-request/QuotaDetailsDM.png)

8. Select the **SKU families** that require an increase. 

![SKU Family](./media/resource-manager-core-quotas-request/SkuFamily.png)

9. Enter the new limits you would like on the subscription

![New Limits](./media/resource-manager-core-quotas-request/NewLimits.png)

To remove a line, uncheck the SKU from the SKU family dropdown or click the discard "x" icon. After entering the desired quota for each SKU family, click **Save and Continue** on the Quota details panel to continue with the support request creation.

## Quota increase at subscription level using Usages + Quota

Follow the instructions below using to create a support request via Azure's 'Usage + quota' blade available in the Azure Portal. 

1. From https://portal.azure.com, select **Subscriptions**.

   ![Subscriptions](./media/resource-manager-core-quotas-request/subscriptions.png)

2. Select the subscription that needs an increased quota.

   ![Select subscription](./media/resource-manager-core-quotas-request/select-subscription.png)

3. Select **Usage + quotas**

   ![Select usage and quotas](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

4. In the upper right corner, select **Request increase**.

   ![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

5. Select **Compute-VM (cores-vCPUs) subscription limit increases** as the quote type. 

   ![Fill in form](./media/resource-manager-core-quotas-request/forms.png)
   
6. In the **Quota details** panel, select Deployment model as "Resource Manager" and select a location.

    ![Quota Problem blade](./media/resource-manager-core-quotas-request/Problem-step.png)

7. Select the **SKU Families** that require an increase.

    ![SKU series selected](./media/resource-manager-core-quotas-request/SKU-selected.png)

8. Enter the new limits you would like on the subscription.

    ![SKU new quota request](./media/resource-manager-core-quotas-request/SKU-new-quota.png)

- To remove a line, uncheck the SKU from the SKU family dropdown or click the discard "x" icon.
After entering the desired quota for each SKU family, click "Save and Continue" on the Problem step page to continue with the support request creation.
