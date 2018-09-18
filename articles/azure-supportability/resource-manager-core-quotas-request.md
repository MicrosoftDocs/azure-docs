---
title: Azure Resource Manager vCPU quota increase requests | Microsoft Docs
description: Azure Resource Manager vCPU quota increase requests
author: ganganarayanan
ms.author: gangan
ms.date: 6/13/2018
ms.topic: article
ms.service: microsoft-docs
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Resource Manager vCPU quota increase requests

Resource Manager vCPU quotas are enforced at the region level and SKU family level.
Learn more about how quotas are enforced on the [Azure subscription and service limits](http://aka.ms/quotalimits) page.
To learn more about SKU Families, you may compare cost and performance on the [Virtual Machines Pricing](http://aka.ms/pricingcompute) page.

To request an increase, follow the instructions below using to create a support request via Azure's 'Usage + quota' blade available in the Azure Portal. 

## Request quota increase at subscription level

1. From https://portal.azure.com, select **Subscriptions**.

   ![Subscriptions](./media/resource-manager-core-quotas-request/subscriptions.png)

2. Select the subscription that needs an increased quota.

   ![Select subscription](./media/resource-manager-core-quotas-request/select-subscription.png)

3. Select **Usage + quotas**

   ![Select usage and quotas](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

4. In the upper right corner, select **Request increase**.

   ![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

5. Step:1 - Select **Cores** as the quote type. 

   ![Fill in form](./media/resource-manager-core-quotas-request/forms.png)
   
6. Step:2 - Select Deployment model as "Resource Manager" and select a location.

    ![Quota Problem blade](./media/resource-manager-core-quotas-request/Problem-step.png)

3. Select the SKU Families that require an increase.

    ![SKU series selected](./media/resource-manager-core-quotas-request/SKU-selected.png)

4. Enter the new limits you would like on the subscription.

    ![SKU new quota request](./media/resource-manager-core-quotas-request/SKU-new-quota.png)

- To remove a line, uncheck the SKU from the SKU family dropdown or click the discard "x" icon.
After entering the desired quota for each SKU family, click "Next" on the Problem step page to continue with the support request creation.

