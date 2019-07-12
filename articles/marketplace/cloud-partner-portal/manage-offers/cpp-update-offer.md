---
title: Update marketplace offers | Azure Marketplace 
description: Update offers on the Azure and AppSource Marketplaces using the Cloud Partner Portal
services: Azure, AppSource, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 01/11/2019
ms.author: pabutler
---

# Update Azure Marketplace and AppSource offers

There are various kinds of updates you can apply to your offer after it's published.  The [Cloud Partner Portal](https://cloudpartner.azure.com/) assists you in properly modifying attributes of an offer, including:

-  Adding new virtual machine (VM) image or package version to an existing SKU
-  Change regions a SKU is available in
-  Adding new SKUs
-  Updating marketplace metadata for offers or SKUs 
-  Updating pricing on pay-as-you-go offers

The portal also has features, such as the ability to compare features and view a history of features for an offer, that assist you in managing changes.  After you modify an offer or SKU, it must be republished before the changes go "live".  This article walks you through the different aspects of updating your marketplace offer.

## Unpermitted changes to an offer/SKU

There are some attributes of an offer or SKU that cannot be modified once it has been published in the marketplace.  The corresponding fields are disabled in the **Editor** tab of the portal, for example:  

- Offer ID and Publisher ID
- SKU ID 
- Data disk count of existing SKUs
- Billing/license model changes of existing SKUs
- Version tags, for example: `1.0.1`


## Common update operations

The following sections explain how to perform some of the most update operations.  These operations are not available for all offer types.  You must sign into the Cloud Partner Portal to start any of these operations.


### Update offer contacts

Use the following steps to update the support contacts for your offer.
1. In the **All Offers** page, select the offer.
2. Select the **Contacts** tab. Update your contacts.
3. Select the **Save** button.
4. Select **Publish** to start the publishing process.


### Change regions an offer or SKU is available in

Over time, you may want to make your offer/SKU available in more regions.
Alternatively, you may want to stop supporting the offer/SKU in a given region.
To implement these changes, follow the following steps.

1. In the **All offers** page, find the offer you would like to update.

For Azure Marketplace offers:

1. Select the **SKUs** tab.  Select the SKU to modify.
1. Click the **Select Countries** button under the **Country/Region availability** field.
1. In the region availability dialog, add or remove the regions for this SKU.

For AppSource offers:

1. Select the **Storefront Details** tab.
1. Next to the **Supported countries/regions** label, click **Supported countries/regions**. 
1. In the supported countries/regions dialog, add or remove the regions for this offer.

For either marketplace:

1. Click **Publish** to start the publishing process. 

If a SKU is being made available in a new region, you have the ability to specify pricing for that particular region via the **Export Pricing Data** functionality. If you are adding a region back that was previously available, you cannot update its pricing because pricing changes are not permitted.


### Add a new SKU 

To make a new SKU available for an existing offer, use the following steps:

1. In the **All offers** page, find the offer.
3. Under the **SKUs** form, click **Add new SKU** and provide a **SKU ID** in the pop-up.
4. Follow the rest of the steps detailed in [Publish a virtual machine offer](../virtual-machine/cpp-publish-offer.md).
5. Click **Publish** to start the publishing process.


### Update offer marketplace assets

You may have scenarios where you need to update the marketplace text-based and image assets, such your company logos, offer description, etc. Use the
following steps to update these assets.

1. In the **All offers** page, find your offer. 
2. Select the **Marketplace** tab and follow the instructions in your offer's *Marketplace tab* topic.
3. Click **Publish** to start the publishing process.


### Update pricing on published offers

Once your pay-as-you-go offer is published, you cannot increase the price of an existing SKU.  Instead, create a SKU under the same offer, delete the old SKU, and then republish your offer. You can decrease the price on previously published offers. To decrease your offer price:

1. Select the SKU for which you want to decrease pricing.
2. You must set the lower price by the same mechanism you originally used: either directly in the portal UI or with the import/export spreadsheet.
3. Click **Save**.
4. Click **Publish** to start the publishing process.

The pricing is visible to new customers once it is live on the marketplace, and all new customers will then pay the new decreased price.  For existing customers, the price decrease is reflected retroactively to the start of the billing cycle during which the price decrease became effective.  If they have already been billed for the cycle during which a price decrease occurred, they will receive a refund during their next billing cycle to cover the decreased price.


## Compare feature

When you make changes on a published offer, you can use the *Compare* feature to audit the changes. To utilize this feature:

1. At any point in the editing process, you can click the **Compare** button in the **Editor** tab for your offer.
2. A comparison window displays side-by-side versions of the saved changes to this offer as compared to the marketplace offer. 

![Compare offer button in editor tab](./media/offer-compare-button.png)


## History of publishing actions

To view historical publishing activity, select the **History** tab in the left vertical menubar of the Cloud Partner Portal.  The History page provides flexible filtering by several characteristics and supports column ordering.  Each publishing event is timestamped.  For more information, see [Audit history page](../portal-tour/cpp-history-page.md).


## Next steps

You can also use the Cloud Partner Portal to [delete a published SKU or offer](./cpp-delete-offer.md).
