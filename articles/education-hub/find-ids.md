---
title: Find IDs for calling Azure Education Hub APIs
description: Learn how to find all the IDs that you need to call the APIs in the Azure Education Hub.
author: vinnieangel
ms.author: vangellotti
ms.service: azure-education
ms.topic: how-to
ms.date: 12/21/2021
ms.custom: template-how-to
---

# Find IDs for calling Azure Education Hub APIs

This article helps you gather the IDs that you need to call the Azure Education Hub APIs. If you go through the Education Hub UI, these IDs are gathered for you. To call the APIs publicly, you must have a billing account ID, billing profile ID, and invoice section ID.

## Prerequisites

You must have an Azure account linked with the Education Hub.

## Before you begin

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **billing**, and then select **Cost Management + Billing** in the results.

   :::image type="content" source="./Media/find-ids/navigate-to-billing.png" alt-text="Screenshot that shows a search result for cost management and billing." border="true":::

## Get the billing account ID

1. On the left pane, under **Settings**, select **Properties**.
1. The **ID** value is the billing account ID. If you want to copy it for later use, select the **Copy** button.

   :::image type="content" source="./Media/find-ids/find-billing-account-id.png" alt-text="Screenshot that shows a billing account ID.":::

## Get the billing profile ID

1. On the left pane, under **Billing**, select **Billing profiles**.
1. Select the desired billing profile.

   :::image type="content" source="./Media/find-ids/navigate-to-billing-profile.png" alt-text="Screenshot that shows the pane for billing profiles." border="true":::
1. On the left pane, under **Settings**, select **Properties**.
1. Under **Billing profile**, the **ID** value is the billing profile ID. If you want to copy it for later use, select the **Copy** button.

   :::image type="content" source="./Media/find-ids/find-billing-profile-id.png" alt-text="Screenshot that shows a billing profile ID." border="true":::

   The billing account ID also appears on this pane, under **Billing account**.

## Get the invoice section ID

1. On the left pane, under **Billing**, select **Billing profiles**.
1. Select the desired billing profile.

   :::image type="content" source="./Media/find-ids/navigate-to-billing-profile.png" alt-text="Screenshot that shows the pane for billing profiles." border="true":::
1. On the left pane, under **Billing**, select **Invoice sections**.
1. Select the desired invoice section.

   :::image type="content" source="./Media/find-ids/navigate-to-invoice-section.png" alt-text="Screenshot of the pane that lists invoice sections." border="true":::

1. On the left pane, under **Settings**, select **Properties**.
1. Under **Invoice section**, the **ID** value is the invoice section ID. If you want to copy it for later use, select the **Copy** button.

   :::image type="content" source="./Media/find-ids/find-invoice-section-id.png" alt-text="Screenshot that shows an invoice section ID." border="true":::

   The billing account ID also appears on this pane, under **Billing account**.

## Related content

- [Manage your academic grant by using the Overview page](hub-overview-page.md)
- [Learn about support options](educator-service-desk.md)
