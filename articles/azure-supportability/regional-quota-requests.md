---
title: Azure regional quota increase requests | Microsoft Docs
description: Regional quota increase requests
author: sowmyavenkat86
ms.author: svenkat
ms.date: 06/07/2019
ms.topic: article
ms.service: azure
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---
# Total regional vCPU limit increase 

You can now request an increase via **Help + Support** blade or the **Usages + Quota** blade in the portal. 

## Request Total Regional vCPUs quota increase at subscription level using the **Help + Support** blade

Follow the instructions below to create a support request via Azure's 'Help + Support' blade available in the Azure portal. 

1. From https://portal.azure.com, select **Help + Support**.

![Help + Support](./media/resource-manager-core-quotas-request/helpsupport.png)
 
2.  Select **New support request**. 

![New support request](./media/resource-manager-core-quotas-request/newsupportrequest.png)

3. In the Issue type dropdown, choose **Service and subscription limits (quotas)**.

![Issue type dropdown](./media/resource-manager-core-quotas-request/issuetypedropdown.png)

4. Select the subscription that needs an increased quota.

![Select subscription newSR](./media/resource-manager-core-quotas-request/select-subscription-sr.png)
   
5. Select **Other Requests** in **quota type** dropdown.

![QuotaType](./media/resource-manager-core-quotas-request/regional-quotatype.png)

6. In **Details** pane, provide additional information as per the example below, to help process your request and continue with the case creation. 
    1.	**Deployment model** – Specify ‘Resource Manager’
    2.	**Requested region** – Specify your required region e.g. East US 2
    3.	**New limit Value** – Specify new region limit. This should not exceed the sum of approved quota for individual SKU families for          this subscription

![QuotaDetails](./media/resource-manager-core-quotas-request/regional-details.png)

## Request Total Regional vCPUs quota increase at subscription level using the **Usages + Quota** blade

Follow the instructions below using to create a support request via Azure's 'Usage + quota' blade available in the Azure portal. 

1. From https://portal.azure.com, select **Subscriptions**.

![Subscriptions](./media/resource-manager-core-quotas-request/subscriptions.png)

2. Select the subscription that needs an increased quota.

![Select subscription](./media/resource-manager-core-quotas-request/select-subscription.png)

3. Select **Usage + quotas**

![Select usage and quotas](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

4. In the upper right corner, select **Request increase**.

![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

5. Select **Other Requests** in **quota type** dropdown.

![QuotaType](./media/resource-manager-core-quotas-request/regional-quotatype.png)

6. In **Details** pane, provide additional information as per the example below, to help process your request and continue with the case creation. 
    1.	**Deployment model** – Specify ‘Resource Manager’
    2.	**Requested region** – Specify your required region e.g. East US 2
    3.	**New limit Value** – Specify new region limit. This should not exceed the sum of approved quota for individual SKU families for          this subscription

![QuotaDetails](./media/resource-manager-core-quotas-request/regional-details.png)



