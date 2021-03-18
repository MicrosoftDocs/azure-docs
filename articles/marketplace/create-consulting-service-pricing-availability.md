---
title: How to configure your consulting service pricing and availability in Microsoft Partner Center
description: Learn how to configure your consulting service offer price details and market availability in the Microsoft commercial marketplace using Partner Center. 
author:  Microsoft-BradleyWright
ms.author: brwrigh
ms.reviewer: anbene
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 10/27/2020
---

# How to configure your consulting service pricing and availability

This article explains how to define the market availability and the pricing details for your consulting service offer in the Microsoft commercial marketplace.

> [!NOTE]
> Consulting service offers are listing-only. Any transactions must be managed between you and your customers outside of the commercial marketplace.

## Markets

In the **Markets** section, you select the countries or regions where your consulting service will be available.

1. Under **Markets**, select the **Edit markets** link.
2. In the dialog box that appears, select the market locations where you want to make your offer available. You must select a minimum of one and maximum of 141 markets.
3. Select **Save** to close the dialog box.

## Preview audience

When you publish or update your consulting service offer, Partner Center creates a preview version of the listing. This preview is visible only to users that have a **hide key**.

In the **Hide Key** field, enter an alphanumeric string that you’ll use to access the preview version of your offer.

## Pricing (informational only)

In the **Pricing** section, define whether this is a free or paid offer.

For paid offers, specify whether the price is fixed or estimated. If the price is estimated, your offer description must describe what factors will affect the price.

If you chose a single country or region in the **Markets** section, provide the price in a currency supported for that market and select **Save draft**. See [Geographic availability and currency support for the commercial marketplace](./marketplace-geo-availability-currencies.md) for the list of supported currencies.

If you chose multiple countries or regions in the **Markets** section, provide the price in United States dollars (USD) and select **Save draft**. Partner Center will convert that price into the local currency of all selected markets using the exchange rates available when you saved the draft.

To validate the conversion or to set custom prices in an individual market, you need to export, modify, and then import the pricing spreadsheet:

1. Under **Pricing**, select the **Export pricing data** link. This will download a file to your device.
1. Open the exportedPrice.xlsx file in Microsoft Excel.
1. In the spreadsheet, you can adjust prices and currencies for each market. See [Geographic availability and currency support for the commercial marketplace](./marketplace-geo-availability-currencies.md) for the list of supported currencies. When you're done, save the file.
1. In Partner Center, under **Pricing**, select the **Import pricing data** link. Importing the file will overwrite previous pricing information.

> [!IMPORTANT]
> The prices you define in Partner Center are static and don't follow variations in the exchange rates. To change the price in one or more markets after publication, update and resubmit your offer in Partner Center.

Select **Save draft** before continuing.

## Next steps

* [Review and publish](review-publish-offer.md)