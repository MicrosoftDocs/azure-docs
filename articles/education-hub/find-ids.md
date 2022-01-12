---
title: Finding Ids for Education Hub APIs
description: Learn how to find all the Ids needed to call the education hub apis
author: vinnieangel
ms.author: vangellotti
ms.service: eduhub
ms.topic: tutorial
ms.date: 12/21/2021
ms.custom: template-tutorial
---

# Tutorial: Find all Ids needed to call Education Hub Apis

This article helps you gather the necessary Ids needed to call the education hub APIs. If you go through the Education Hub UI, these Ids are gathered for you, but to call them publicly, you must have a billing account id, billing profile id and invoice section id.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Find your billing account id
> * Find your billing profile id
> * Find your invoice section id

## Prerequisites

You must have an Azure account linked with education hub.

## Sign in to Azure

* Sign in to the Azure portal at https://portal.azure.com.

## Navigate to Cost Management + Billing

While in the Azure Portal, search for Cost Management + Billing and click on the service from the dropdown menu.

:::image type="content" source="./Media/find-ids/NavigateToBilling.png" alt-text="Navigate to cost management + billing" border="false":::

## Get Billing Account Id

This section will show you how to get your Billing Account Id.

1. Click on the "Properties" tab under Settings
2. The string listed in the ID box is your Billing Account Id
3. Copy this and save it for later

:::image type="content" source="./Media/find-ids/FindBillingAccountID.png" alt-text="Navigate to cost management + billing" border="false":::

## Get Billing Profile Id

This section will show you how to get your Billing Profile Id.

1. Click on "Billing Profiles" tab under the Billing section
2. Click on the desired billing profile
:::image type="content" source="./Media/find-ids/NavigateToBillingProfile.png" alt-text="Navigate to cost management + billing" border="false":::
3. Click on the "Properties" tab under the Settings section
4. This page will display your billing profile ID at the top of the page
5. Copy this and save it for later. You can also see your Billing Account ID at the bottom of the page.

:::image type="content" source="./Media/find-ids/FindBillingProfileID.png" alt-text="Navigate to cost management + billing" border="false":::

## Get Invoice Section Id

This section will show you how to get your Invoice Section Id.

1. Click on "Invoice sections" tab under the Billing tab. Note you must be in Billing Profile to see Invoice Sections
2. Click on the desired Invoice Section
:::image type="content" source="./Media/find-ids/NavigateToInvoiceSection.png" alt-text="Navigate to cost management + billing" border="false":::
3. Click on the "Properties" tab under the Settings section
4. This page will display your invoice section ID at the top of the page
5. Copy this and save it for later. You can also see your Billing Account ID at the bottom of the page.

:::image type="content" source="./Media/find-ids/FindInvoiceSectionID.png" alt-text="Navigate to cost management + billing" border="false":::

## Next steps

- [Manage your Academic Grant using the Overview page](hub-overview-page.md)

- [Support options](educator-service-desk.md)