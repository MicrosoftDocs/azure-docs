---
title: Apply billing tags
titleSuffix: Microsoft Cost Management
description: This article explains what billing tags are how and how to apply them in Cost Management.
author: bandersmsft
ms.author: banders
ms.date: 12/15/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: sadoulta
---


# Apply billing tags

Billing tags are metadata elements that you can apply to Microsoft Customer Agreement MCA billing entities including billing profiles and invoice sections. Just like Azure tags, billing tags are key-value pairs that are used to identify the entities.

For example, to identify an invoice section with subscriptions belonging to the marketing department, you could use the tag with `key` : *Department* and `value` : *Marketing*.  The fully formed `key` : *value* pair would be `Department` : *Marketing*.

> [!NOTE]
> The limitations and recommendations that apply to Azure tags also apply to billing tags.

> [!WARNING]
> Tags are stored as plain text. Never add sensitive values to tags. Sensitive values could be exposed through many methods, including cost reports, commands that return existing tag definitions, deployment histories, exported templates, and monitoring logs.

## Tag application

**Required permissions**
Billing tags are applied in the Azure portal. The required permissions are:

- Billing profile contributor/owner for billing profile tags
- Invoice section contributor/owner for invoice section tags

**Billing profile tags**

1. Go to [https://portal.azure.com.](https://portal.azure.com).
1. Search for and select **Cost Management + Billing**.
1. Select the billing profile where you want to set the tags.
1. On the left menu, select **Properties** under **Settings** and then select **Add or Update tags**.  
    :::image type="content" source="./media/billing-tags/billing-profile-tag.png" alt-text="Screenshot showing tag application to a billing profile." lightbox="./media/billing-tags/billing-profile-tag.png" :::

### Invoice section tags

1. Go to [https://portal.azure.com](https://portal.azure.com). 
1. Search for and select **Cost Management + Billing**.
1. Select your billing profile.
1. On the left menu, select **Invoice sections** under **Billing**.
1. Select the invoice section where you want to set the tags.
1. On the left menu, select **Properties** under **Settings** and then select **Add or update Tags**.  
    :::image type="content" source="./media/billing-tags/invoice-section-tag.png" alt-text="Screenshot showing tag application to an invoice section." lightbox="./media/billing-tags/invoice-section-tag.png" :::

## Tag inheritance and billing tags

When you enable the **Tag inheritance** setting at the billing profile level, tags from billing profile and invoices sections are applied to usage records for all child resources. For more information about tag inheritance, see [Group and allocate costs using tag inheritance](enable-tag-inheritance.md).

## Related content

- Learn how to [Group and allocate costs using tag inheritance](enable-tag-inheritance.md).
