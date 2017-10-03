---
title: Azure Resource Manager core quota increase requests | Microsoft Docs
description: Azure Resource Manager core quota increase requests
author: ganganarayanan
ms.author: gangan
ms.date: 1/18/2017
ms.topic: article
ms.service: microsoft-docs
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Resource Manager core quota increase requests

Resource Manager core quotas are enforced at the region level and SKU family level.
Learn more about how quotas are enforced on the [Azure subscription and service limits](http://aka.ms/quotalimits) page.
To learn more about SKU Families, you may compare cost and performance on the [Virtual Machines Pricing](http://aka.ms/pricingcompute) page.

To request an increase, create a Quota support case for Cores in the Azure portal, [https://portal.azure.com](https://portal.azure.com).

> [!NOTE]
> Learn how to [create a support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request) in the Azure portal

1. On the new support request page, select Issue type as "Quota" and Quota type as "Cores".

    ![Quota Basics blade](./media/resource-manager-core-quotas-request/Basics-blade.png)

2. Select Deployment model as "Resource Manager" and select a location.

    ![Quota Problem blade](./media/resource-manager-core-quotas-request/Problem-step.png)

3. Select the SKU Families that require an increase.

    ![SKU series selected](./media/resource-manager-core-quotas-request/SKU-selected.png)

4. Enter the new limits you would like on the subscription.

    ![SKU new quota request](./media/resource-manager-core-quotas-request/SKU-new-quota.png)

- To remove a line, uncheck the SKU from the SKU family dropdown or click the discard "x" icon.
After entering the desired quota for each SKU family, click "Next" on the Problem step page to continue with the support request creation.
