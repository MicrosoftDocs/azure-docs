---
title: Manage a Microsoft Azure Consumption Commitment resource
description: Learn how to manage your Microsoft Azure Consumption Commitment (MACC) resource, including moving it across resource groups or subscriptions.
author: bandersmsft
ms.reviewer: sornaks
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 12/16/2024
ms.author: banders
#customer intent: As a Microsoft Customer Agreement billing owner, I want learn about managing a MACC so that I move it when needed.
---

# Manage a Microsoft Azure Consumption Commitment resource under a subscription

When you accept a Microsoft Azure Consumption Commitment (MACC) in a Microsoft Customer Agreement, the MACC resource gets placed in a subscription and resource group. The resource contains the metadata related to the MACC. Including: status of the MACC, commitment amount, start date, end date, and System ID. You can view the metadata in the Azure portal.

:::image type="content" source="./media/manage-consumption-commitment/consumption-commitment-overview.png" border="true" alt-text="Screenshot showing the MACC overview page." lightbox="./media/manage-consumption-commitment/consumption-commitment-overview.png" :::

## Move MACC across resource groups or subscriptions

You can move the MACC resource to another resource group or subscription. Moving it works the same way as moving other Azure resources.

Moving a MACC resource to another subscription or resource group is a metadata change. The move doesn't affect the commitment. The destination resource group or subscription must be within the same billing profile where the MACC is currently located.

### To move a MACC

Here are the high-level steps to move a MACC resource. For more information about moving an Azure resource, see [Move Azure resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).

1. In the [Azure portal](https://portal.azure.com), navigate to **Resource groups**.
2. Select the resource group that contains the MACC resource.
3. Select the MACC resource.
4. At top of the page select **Move** and then select **Move to another subscription** or **Move to another resource group**.
5. Follow the instructions to move the MACC resource.
6. After the move is complete, verify that the MACC resource is in the new resource group or subscription.

After a MACC moves, its resource URI changes because of the move.

### To view the MACC resource URI

1. In the [Azure portal](https://portal.azure.com), search for **Microsoft Azure Consumption Commitments**.
2. Select the MACC resource.
3. On the Overview page, in the left navigation menu, expand **Settings**, and then select **Properties**.
4. The MACC resource URI is the **ID** value.

Here's an example image:

:::image type="content" source="./media/manage-consumption-commitment/consumption-commitment-uri.png" border="true" alt-text="Screenshot showing the MACC properties page URI." lightbox="./media/manage-consumption-commitment/consumption-commitment-uri.png" :::


## Rename MACC
The MACC’s resource name is a part of its Uniform Resource Identifier (URI) and cannot be changed. However, you can use [tags](../../azure-resource-manager/management/tag-resources.md) to help identify the MACC resource based on a nomenclature relevant to your organization.
 
## Delete MACC
A MACC resource may only be deleted if its status is _failed_ or _canceled_. Deletion of a MACC resource is a permanent action and cannot be undone.  
 
## Cancel MACC
Please contact your Microsoft account team if you have questions about cancelling your MACC.

## Related content

- [Move Azure resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
