---
title: Update an existing Power BI App offer - Azure Marketplace | Microsoft Docs
description: Update a Power BI App offer after it has been published on the Microsoft AppSource Marketplace. 
services: Azure, AppSource, Marketplace, Cloud Partner Portal, Power BI
documentationcenter:
author: v-miclar
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 01/31/2019
ms.author: pbutlerm
---

# Update an existing Power BI App offer

This article walks you through the different aspects of updating your Power BI App offer in the [Cloud Partner Portal](https://cloudpartner.azure.com/) and
then republishing the offer.  There are commonplace reasons for you to update your offer, including:

- Updating the app’s content in Power BI and getting a new Install URL from
    newly packaged app
- Updating the marketplace metadata for the offer: sales, marketing, or support information and assets
 
To assist you in these modifications, the portal offers the **Compare** and **History** features.


## Unpermitted changes to offer

There are some attributes of a Power BI App offer that cannot be modified once the offer is live in the AppSource, mainly  **Offer ID** and **Publisher ID**.


## Common update operations

Although there are a wide range of characteristics you can change on a Power BI App offer, the following operations are common.


### Update app content in Power BI

It is common for the app in Power BI to be periodically updated with new content, security patches, additional features, and so on. Under such scenarios,
you want to update the URL to the new apps content installation by using the following steps:

1.  Sign into the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2.  Under **All offers**, find the offer to update.
3.  In the **Technical Info** tab, enter a new installer URL.
4.  Click on **Publish** to start the workflow to publish your new app’s version to the AppSource.


### Update offer marketplace metadata

Use the following steps to update the marketplace metadata—company name, logos, etc.—associated with your offer:

1.  Sign into the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2.  Under **All offers**, find the offer you would like to update.
3.  Goto the **Storefront Details** tab then follow the instructions in the [Power BI Apps Storefront Details tab](./cpp-storefront-details-tab.md) to make
    metadata changes.
4.  Click on **Publish** to start the workflow to publish your changes.


## Compare feature

When you make changes on an already published offer, you can use the **Compare** feature to audit the changes that have been made. To use this
feature:

1.  At any point in the editing process, click the **Compare** button for your offer.

    ![Compare feature button](./media/compare-feature-button.png)

2.  View side-by-side versions of marketing assets and metadata.


## History of publishing actions

To view any historical publishing activity, click on the **History** tab in the left navigation menubar of Cloud Partner Portal. Here you will be able to view timestamped actions that have been taken during the lifetime of your AppSource offers.


## Next steps

You should regularly use the [Seller Insights](../../cloud-partner-portal-orig/si-getting-started.md) feature of the [Cloud Partner Portal](https://cloudpartner.azure.com/#insights) to provide insights on your marketplace customers and usage.  
