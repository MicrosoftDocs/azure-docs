---
title: Manage a Microsoft Azure Consumption Commitment Resource
description: Learn how to manage your Microsoft Azure Consumption Commitment (MACC) resource, including moving it across resource groups or subscriptions.
author: dekadays
ms.reviewer: liuyizhu
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 2/4/2026
ms.author: liuyizhu
ms.custom:
- sfi-image-nochange
- build-2025
#customer intent: As a Microsoft Customer Agreement billing owner, I want to learn about managing a MACC so that I can move it when necessary.

service.tree.id: b69a7832-2929-4f60-bf9d-c6784a865ed8
---

# Manage a Microsoft Azure Consumption Commitment resource under a subscription

When you accept a Microsoft Azure Consumption Commitment (MACC) in a Microsoft Customer Agreement, the MACC resource is placed in a subscription and a resource group. The resource contains the metadata for the MACC. This metadata includes the status of the commitment, commitment amount, start date, end date, and system ID. You can view the metadata in the Azure portal.

:::image type="content" source="../../manage/media/benefits/azure-consumption-commitment/consumption-commitment-overview.png" border="true" alt-text="Screenshot that shows the Microsoft Azure Consumption Commitment overview pane." lightbox="../../manage/media/benefits/azure-consumption-commitment/consumption-commitment-overview.png" :::

## Move a MACC resource across resource groups or subscriptions

You can move a MACC resource to another resource group or subscription. Moving it works the same way as moving other Azure resources.

Moving a MACC resource to another subscription or resource group is a metadata change. The move doesn't affect the commitment. The destination resource group or subscription must be within the same billing profile that contains the MACC.

### Move a MACC resource

Here are the high-level steps to move a MACC resource. For more information about moving an Azure resource, see [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md).

1. In the [Azure portal](https://portal.azure.com), go to **Resource groups**.

2. Select the resource group that contains the MACC resource.

3. Select the resource.

4. At the top of the pane, select **Move**, and then select **Move to another subscription** or **Move to another resource group**.

5. Follow the instructions to move the resource.

6. After the move is complete, verify that the resource is in the new resource group or subscription.

After a MACC resource moves, its URI changes to reflect the new location.

### View the MACC resource URI

1. In the [Azure portal](https://portal.azure.com), enter **Microsoft Azure Consumption Commitments** in the search box.

2. Under **Services**, select **Microsoft Azure Consumption Commitments**.

3. Select the MACC resource.

4. On the left pane, expand **Settings**, and then select **Properties**.

5. The MACC resource URI is the **Id** value.

   :::image type="content" source="../../manage/media/benefits/azure-consumption-commitment/consumption-commitment-uri.png" border="true" alt-text="Screenshot that shows an example Microsoft Azure Consumption Commitment resource URI on the Properties pane." lightbox="../../manage/media/benefits/azure-consumption-commitment/consumption-commitment-uri.png":::

## Rename a MACC resource

The name of a MACC resource is part of its URI and can't be changed. However, you can use [tags](../../../azure-resource-manager/management/tag-resources.md) to help identify the MACC resource based on a nomenclature that's relevant to your organization.

## Delete a MACC resource

You can delete a MACC resource only if its status is **Failed** or **Canceled**. Deletion of a MACC resource is a permanent action and can't be undone.  

## Cancel a MACC

If you have questions about canceling your MACC, contact your Microsoft account team.

## Track your MACC

If your organization has a MACC associated with a Microsoft Customer Agreement or Enterprise Agreement billing account, you can track key details through the Azure portal or REST APIs. These details include start and end dates, remaining balance, and eligible spending. For more information, see [Track your Microsoft Azure Consumption Commitment (MACC)](track-consumption-commitment.md).

### View MACC milestones

If your MACC includes milestones, you can view milestone details in the Azure portal. Go to your MACC resource and select the **Milestones** tab. For more information about milestones, see [Azure Consumption Commitment milestones](track-consumption-commitment.md#macc-milestones).

The **Milestones** tab displays the following information for each milestone:

- **End Date**: Deadline for reaching the milestone commitment amount.
- **Commitment amount**: Amount that needs to be consumed by the end date.
- **Status**: Current status of the milestone (such as **Active**, **Completed**, or **Failed**).
- **Automatic Shortfall**: Indicator of whether automatic shortfall is applicable for the milestone.
- **Shortfall Amount**: Any shortfall amount if the commitment isn't met (appears when applicable).

:::image type="content" source="../../manage/media/benefits/azure-consumption-commitment/manage-consumption-commitment-milestones.png" border="true" alt-text="Screenshot that shows Microsoft Azure Consumption Commitment milestones and progress tracking." lightbox="../../manage/media/benefits/azure-consumption-commitment/manage-consumption-commitment-milestones.png" :::

## Related content

- [Track your MACC](track-consumption-commitment.md)
- [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md)
