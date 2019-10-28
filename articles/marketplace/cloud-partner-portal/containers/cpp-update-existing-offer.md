---
title: Update an existing Azure Containers offer | Azure Marketplace
description: How to update an existing container offer on Azure Marketplace.
services: Azure, Marketplace, Cloud Partner Portal, 
author: dan-wesley
ms.service: marketplace
ms.topic: article
ms.date: 11/01/2018
ms.author: pabutler
---

# Update an existing container offer

This article steps through the different aspects of updating your container offer in the [Cloud Partner Portal](https://cloudpartner.azure.com/).

There are several reasons why you might want to update your offer, such as:

-  Adding a new container image version to existing SKUs.
-  Adding new SKUs.
-  Updating the marketplace metadata for the offer or individual SKUs.

To assist you in these modifications, the portal provides the **Compare** and **History** features.  


## Unpermitted changes to a container offer or SKU

There are attributes of a container offer or SKU that can't be changed after the  offer is live on the Azure Marketplace. You can't change the following settings:

-  **Offer ID** and **Publisher ID** of the offer
-  **SKU ID** of existing SKUs
-  Version tags, for example: `1.0.1`
-  Billing/license model changes to existing SKUs

## Common update operations

The following update operations are common.

### Update container image version for a SKU

It's common for a container image to be periodically updated with security patches, additional features, and so on. In this scenario, you want to update the container image that your SKU references by using the following steps:

1. Sign into the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2. Under **All offers**, find the offer you want to update.
3. In the **SKUs** tab, select the SKU associated with the container image to update.
4. Under **Container image**, select **+ New Image Version** to add a new container image.
5. Provide the new container **image versions**. The image version needs to follow the same tags guidelines as previous versions. Version tags should be of the form X.Y.Z, where X, Y, and Z are integers. Verify that the new version you provide is greater than all previous versions.
6. Select **Publish** to start the workflow to publish your new container image version to the Azure Marketplace.

### Add a new SKU

Use the following steps to make a new SKU available for your offer:

1. Sign into the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2. Under **All offers**, find the offer you want to update.
3. Under the **SKUs** tab, select **Add new SKU** and provide a **SKU ID** in the pop-up window.
4. Republish the container using the steps described in [Publish container offer](./cpp-publish-offer.md).
5. Select **Publish** to start the workflow to publish your new SKU.

### Update offer marketplace metadata

Use the following steps to update the marketplace metadata associated with your offer. (For example: company name, logos, and etc.)

1. Sign into the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2. Under **All offers**, find the offer you'd like to update.
3. Go to the **Marketplace** tab. Use the instructions in the [Publish container offer](./cpp-publish-offer.md) offer article to make metadata changes.
4. Select **Publish** to start the workflow to publish your changes.

## Compare feature

When you make changes to a published offer, you can use the **Compare** feature to audit the changes that you've made.

### To use the Compare feature:

1. At any point in the editing process, select Compare for your offer.
2. Look at side-by-side versions of marketing assets and metadata.


## History of publishing actions

To see historical publishing activity, select the **History** tab on the left navigation menu bar of Cloud Partner Portal. You can see the timestamped actions taken during the lifetime of your Azure Marketplace offers.