---
title: Manage a Conditional Azure Credit Offer (CACO) Resource
description: Learn how to manage your Conditional Azure Credit Offer (CACO) resource, including moving it across resource groups or subscriptions.
author: dekadays
ms.reviewer: liuyizhu
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 2/23/2026
ms.author: liuyizhu
#customer intent: As a Microsoft Customer Agreement billing owner, I want to learn about managing a CACO so that I can move it when necessary.

service.tree.id: b69a7832-2929-4f60-bf9d-c6784a865ed8
---

# Manage a Conditional Azure Credit Offer (CACO) resource under a subscription

When you accept a Conditional Azure Credit Offer (CACO) in a Microsoft Customer Agreement, Microsoft creates a CACO commitment and one or more provisional (not spendable) credit resources. The commitment and provisional credit resources are placed in a subscription and a resource group. They follow the same setup as other credit resources, as described in [Manage an Azure credit resource under a subscription](../credits/manage-azure-credits.md). The provisional credit resources turn into awarded credits if you meet the spending target and other conditions in the CACO.

In the Azure portal, you can view metadata for a CACO. The metadata includes the status of the offer, start and end dates, spending target, currency, target end date, award credit, award start date, award end date, and system ID. You can view the metadata under the CACO resource.

:::image type="content" source="../../manage/media/conditional-credit-offer/view-conditional-credit-offer.png" border="true" alt-text="Screenshot that shows the Conditional Azure Credit Offer overview pane." lightbox="../../manage/media/conditional-credit-offer/view-conditional-credit-offer.png" :::

## Move a CACO resource across resource groups or subscriptions

You can move a CACO resource to another resource group or subscription, just like other Azure resources. This move only changes metadata and doesn't affect the credit or commitment.

The new resource group or subscription must remain within the same billing profile as the original billing profile that contains the CACO resource.

Moving a CACO resource doesn't move any provisional or awarded credits. You have to move those credit resources separately as needed.

### Move a CACO resource

Here are the high-level steps to move a CACO resource. For more information about moving an Azure resource, see [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md).

1. In the [Azure portal](https://portal.azure.com), go to **Resource groups**.

2. Select the resource group that contains the CACO resource.

3. Select the resource.

4. At the top of the pane, select **Move**, and then select **Move to another subscription** or **Move to another resource group**.

5. Follow the instructions to move the resource.

6. After the move is complete, verify that the resource is in the new resource group or subscription.

Moving a CACO resource changes its URI.

### View the CACO resource URI

1. In the [Azure portal](https://portal.azure.com), enter **conditional credit** in the search box.

2. Under **Services**, select **Conditional Credits**.

3. Select the CACO resource.

4. On the left pane, expand **Settings**, and then select **Properties**.

5. The CACO resource URI is the **Id** value.

:::image type="content" source="../../manage/media/conditional-credit-offer/conditional-credit-offer-uri.png" border="true" alt-text="Screenshot that shows an example Conditional Azure Credit Offer resource URI on the Properties pane." lightbox="../../manage/media/conditional-credit-offer/conditional-credit-offer-uri.png" :::

## Rename a CACO resource

The name of a CACO resource is a part of its URI and can't be changed. However, you can use [tags](../../../azure-resource-manager/management/tag-resources.md) to help identify the CACO resource based on a nomenclature that's relevant to your organization.

## Delete a CACO resource

You can delete a CACO resource only if its status is **Failed**, **Canceled**, or **Expired**. Deletion of a CACO resource is a permanent action and can't be undone.  

## Cancel a CACO

If you have questions about canceling your CACO, contact your Microsoft account team.

## Related content

- [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md)
