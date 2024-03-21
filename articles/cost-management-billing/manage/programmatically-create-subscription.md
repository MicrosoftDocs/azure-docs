---
title: Create Azure subscriptions programmatically
description: This article helps you understand options available to programmatically create Azure subscriptions.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/21/2024
ms.reviewer: andalmia
ms.author: banders 
---

# Create Azure subscriptions programmatically

This article helps you understand options available to programmatically create Azure subscriptions.

Using various REST APIs you can create a subscription for the following Azure agreement types:

- Enterprise Agreement (EA)
- Microsoft Customer Agreement (MCA)
- Microsoft Partner Agreement (MPA)

You can't create support plans programmatically. You can buy a new support plan or upgrade one in the Azure portal. Navigate to **Help + support** and then at the top of the page, select **Choose the right support plan**.

Requirements and details to create subscriptions differ for different agreements and API versions. See the following articles that apply to your situation:

Latest APIs:

- [Create EA subscriptions](programmatically-create-subscription-enterprise-agreement.md)
- [Create MCA subscriptions](programmatically-create-subscription-microsoft-customer-agreement.md)
- [Create MPA subscriptions](programmatically-create-subscription-microsoft-partner-agreement.md)

These articles also show how to create subscriptions with an Azure Resource Manager template (ARM template). An ARM template helps automate the subscription creation process.

If you're still using [preview APIs](programmatically-create-subscription-preview.md), you can continue to create subscriptions with them. 

## Next steps

* After you create a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* For more information about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md).
