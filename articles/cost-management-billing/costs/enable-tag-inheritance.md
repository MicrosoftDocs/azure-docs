---
title: Group costs using tag inheritance
titleSuffix: Microsoft Cost Management
description: This article explains how to group costs using tag inheritance.
author: bandersmsft
ms.author: banders
ms.date: 10/26/2022
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: sadoulta
---

# Group costs using tag inheritance

Azure tags are widely used to group costs to align with different business units, engineering environments, and cost departments. Tags provide the needed visibility for businesses to manage and allocate costs across the different groups.

This article explains how to use the tag inheritance setting in Cost Management. When enabled, tag inheritance applies resource group and subscription tags to child resource usage records. You don't have to tag every resource or rely on resources that emit usage to have their own tags.

Tag inheritance is available for customers with an Enterprise Account (EA) or a Microsoft Customer Agreement (MCA) account.

## Required permissions

- For subscriptions:
  - Cost Management reader to view
  - Cost Management Contributor to edit
- For EA billing accounts:
  - Enterprise Administrator (read-only) to view
  - Enterprise Administrator to edit
- For MCA billing profiles:
  - Billing profile reader to view
  - Billing profile contributor to edit

## Enable tag inheritance

You can enable the tag inheritance setting in the Azure portal and the [Settings API](/rest/api/cost-management/settings). You apply the setting at the EA billing account, MCA billing profile, and subscription scopes. After the setting is enabled, all resource group and subscription tags are automatically applied to usage records of child resources.

To enable tag inheritance in the Azure portal:

1. In the Azure portal, navigate to Cost Management.
2. Select a scope.
3. In the left menu under **Settings**, select either **Manage billing account** or **Manage subscription**, depending on your scope.
4. Under **Tag inheritance**, select **Edit**.  
    :::image type="content" source="./media/enable-tag-inheritance/edit-tag-inheritance.png" alt-text="Screenshot showing the Edit option for Tag inheritance." lightbox="./media/enable-tag-inheritance/edit-tag-inheritance.png" :::
5. In the Tag inheritance (Preview) window, select **Automatically apply subscription and resource group tags to new data**.  
    :::image type="content" source="./media/enable-tag-inheritance/automatically-apply-tags-new-usage-data.png" alt-text="Screenshot showing the Automatically apply subscription and resource group tags to new data option." lightbox="./media/enable-tag-inheritance/automatically-apply-tags-new-usage-data.png" :::

### Enable tag inheritance using the Settings API

In the Settings API, set the `preferContainerTags` property to `True`.

Here's a sample request:

```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.CostManagement/settings/taginheritance?api-version=2022-10-01-preview

{
  "kind": "taginheritance",
  "properties": {
    "preferContainerTags": true
  }
}
```

## Override resource tag behavior

When a resource tag matches the resource group or subscription tag being applied, the resource tag is applied to its usage record by default. You can change the default behavior to have the subscription or resource group tag override the resource tag.

In the Tag inheritance window, select the **Use the subscription or resource group tag** option.

:::image type="content" source="./media/enable-tag-inheritance/use-subscription-resource-group-tag.png" alt-text="Screenshot showing the override options." lightbox="./media/enable-tag-inheritance/use-subscription-resource-group-tag.png" :::

## Usage record updates

After the tag inheritance setting is enabled, it takes about 8-24 hours for the child resource usage records to get updated with subscription and resource group tags. The usage records are updated for the current month using the existing subscription and resource group tags.

For example, if the tag inheritance setting is enabled on October 20, child resource usage records are updated from October 1 using the tags that existed on October 20.

> [!NOTE]
> If a new tag is applied to a subscription or a resource group after you enable the setting, the tag is applied to child resource usage records only from the tag application date.

## Next steps

- Learn about [cost allocation](allocate-costs.md).