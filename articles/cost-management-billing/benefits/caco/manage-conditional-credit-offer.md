---
title: Manage a Conditional Azure Credit Offer (CACO) resource
description: Learn how to manage your Conditional Azure Credit Offer (CACO) resource, including moving it across resource groups or subscriptions.
author: dekadays
ms.reviewer: liuyizhu
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 2/23/2026
ms.author: liuyizhu
#customer intent: As a Microsoft Customer Agreement billing owner, I want learn about managing a CACO so that I move it when needed.

service.tree.id: b69a7832-2929-4f60-bf9d-c6784a865ed8
---

# Manage a Conditional Azure Credit Offer (CACO) resource under a subscription

When you accept a Conditional Azure Credit Offer (CACO) in a Microsoft Customer Agreement, it creates a CACO commitment and 1 or more provisional (not spendable) credit resources. The CACO commitment and provisional (not spendable) credit resources get placed in a subscription and resource group, and follow the same setup as the other credit resource as mentioned in [Manage a Microsoft Azure credit resource under a subscription](../credits/manage-azure-credits.md). The provisional credit resources turn into awarded credits if the spending target and other conditions in the CACO are met. Moving a CACO resource doesn't move any provisional or awarded credits. Those credit resources have to be moved separately as needed.

On Azure portal, you can view metadata related to the CACO. Including: status of the CACO, CACO start/end date, spend target, currency, target end date, award credit, award start date, award end date, and System ID. You can view the metadata under the Conditional Credit resource. 

:::image type="content" source="../../manage/media/conditional-credit-offer/view-conditional-credit-offer.png" border="true" alt-text="Screenshot showing the CACO overview page." lightbox="../../manage/media/conditional-credit-offer/view-conditional-credit-offer.png" :::

## Move CACO across resource groups or subscriptions

You can move the CACO to another resource group or subscription just like other Azure resources. This move only changes metadata and doesn't impact the credit or commitment. 

The new resource group or subscription must remain within the same billing profile as the original billing profile where the CACO is currently located.

Moving a CACO resource doesn't move any provisional or awarded credits. Those credit resources have to be moved separately as needed.

### To move a CACO

Here are the high-level steps to move a CACO resource. For more information about moving an Azure resource, see [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md). 

1. In the [Azure portal](https://portal.azure.com), navigate to **Resource groups**.
2. Select the resource group that contains the CACO resource.
3. Select the CACO resource.
4. At top of the page select **Move** and then select **Move to another subscription** or **Move to another resource group**.
5. Follow the instructions to move the CACO resource.
6. After the move is complete, verify that the CACO resource is in the new resource group or subscription.

Moving a CACO changes its resource URI.

### To view the CACO resource URI

1. In the [Azure portal](https://portal.azure.com), search for **Conditional Azure Credit Offer**.
2. Select the CACO resource.
3. On the Overview page, in the left navigation menu, expand **Settings**, and then select **Properties**.
4. The CACO resource URI is the **ID** value.

Here's an example image:

:::image type="content" source="../../manage/media/conditional-credit-offer/conditional-credit-offer-uri.png" border="true" alt-text="Screenshot showing the CACO properties page URI." lightbox="../../manage/media/conditional-credit-offer/conditional-credit-offer-uri.png" :::


## Rename CACO
The CACO's resource name is a part of its Uniform Resource Identifier (URI) and can't be changed. However, you can use [tags](../../../azure-resource-manager/management/tag-resources.md) to help identify the CACO resource based on a nomenclature relevant to your organization.
 
## Delete CACO
A CACO resource may only be deleted if its status is _failed_, _canceled_, or _expired_. Deletion of a CACO resource is a permanent action and can't be undone.  
 
## Cancel CACO
Contact your Microsoft account team if you have questions about canceling your CACO.

## Related content
- [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md)

