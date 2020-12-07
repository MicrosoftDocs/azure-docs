---
title: Create Azure subscriptions with REST API
description: This article helps you understand options available to programmatically create Azure subscriptions with REST APIs.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 12/07/2020
ms.reviewer: andalmia
ms.author: banders 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Create Azure subscriptions with REST API

This article helps you understand options available to programmatically create Azure subscriptions with REST APIs.

Using various REST APIs you can create a subscription for the following Azure agreement types:

- Enterprise Agreement (EA)
- Microsoft Customer Agreement (MCA)
- Microsoft Partner Agreement (MPA)

You can’t programmatically create additional subscriptions for other agreement types with REST APIs.

Requirements and details to create subscriptions differ for different agreements and API versions. See the following articles that apply to your situation:

Latest APIs:

- [Create EA subscriptions](programmatically-create-subscription-enterprise-agreement.md)
- [Create MCA subscriptions](programmatically-create-subscription-microsoft-customer-agreement.md)
- [Create MPA subscriptions](programmatically-create-subscription-microsoft-partner-agreement.md)

If you’re still using [preview APIs](programmatically-create-subscription-preview.md), you can continue to create subscriptions with them. 

And, you can [create subscriptions with an ARM template](create-subscription-template.md). An ARM template helps automate the subscription creation process with REST APIs. 

## Next steps

* After you create a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* For more information about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md).
