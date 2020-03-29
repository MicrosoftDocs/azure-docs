---
title: Delete marketplace offers | Azure Marketplace 
description: Delete offers on the Azure and AppSource Marketplaces using the Cloud Partner Portal
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 01/09/2019
ms.author: dsindona
---

# Delete Azure Marketplace and AppSource offers or SKUs

For various reasons, you may decide to withdraw your offer from its Microsoft marketplace, which can take two forms:

- *Offer removal* ensures that new customers may no longer purchase or deploy your offer, but has no impact on existing customers, whom you must support according to your license agreement and pertinent laws. 
- *Offer termination* is the process of terminating the service and/or licensing agreement between you and your existing customers. 

Guidance and policies related to offer removal and termination are governed by [Microsoft Marketplace Publisher Agreement](https://go.microsoft.com/fwlink/?LinkID=699560) and the [Participation Policies](https://azure.microsoft.com/support/legal/marketplace/participation-policies/)
(section [Offering suspension and removal](https://docs.microsoft.com/legal/marketplace/participation-policy#offering-suspension-and-removal)). 

This article talks about the different supported deletion scenarios and the steps required to perform each.  

> [!NOTE]
> You can delete an offer that has not been published by simply selecting the **Delete** button in the toolbar of the **Editor** tab.


## Delete a published SKU from the Azure Marketplace

You can delete a published SKU from Azure Marketplace using the following steps:

1.  Sign in to the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2.  In the **All offers** page, select your offer.  Your offer should be displayed in the **Editor** tab.
3.  In the left toolbar, select the **SKUs** tab. 
4.  Select the SKU that you want to delete and click the **Delete** button.
5.  [Republish](./cpp-publish-offer.md) the offer to Azure Marketplace.

After the modified offer is published to the Azure Marketplace, the selected SKU will no longer be listed in the Azure Marketplace and Azure portal.


## Roll back to a previous SKU version

You can delete the current version of a published SKU from Azure Marketplace by using the steps here. When the process is complete, the SKU is rolled back to its previous version.

1. Sign in to the [Cloud Partner  Portal](https://cloudpartner.azure.com/).
2. In the **All offers** page, select your offer.  Your offer should be displayed in the **Editor** tab.
3. In the left toolbar, select the **SKUs** tab. 
4. Delete the latest version of the associated solution asset from the list of disk versions.  Depending upon the offer type, this field could be **Disk Version**, **Package Versions**, or similar asset. 
5. [Republish](./cpp-publish-offer.md) the offer to Azure Marketplace.

After the modified offer is published on theAzure Marketplace, the current version of the listed SKU will no longer be listed. in the Azure Marketplace and the Azure portal.  The SKU is rolled back to its previous version.


## Delete a live offer

There are various procedural, business, and legal aspects to removing a live offer. Follow the following steps to get guidance from the support team to remove a live offer from the Azure Marketplace:

1.  Raise a support ticket using the [Create an incident](https://go.microsoft.com/fwlink/?linkid=844975) page, or by
    clicking **Support** in the upper-right corner of the [Cloud Partner  Portal](https://cloudpartner.azure.com/).

2.  Select your specific offer type in the **Problem type** list and select **Remove a published offer** in the **Category** list.

3.  Submit the request.

The support team guides you through the offer deletion process.

> [!NOTE]
> Deleting an offer (or SKU) will not affect current purchases of that offer (or SKU). These purchases will continue to work as before. However, deleted offers or SKUs won't be available for any future purchases.


## Next steps

After you are familiar with the basic operations used to manage offers, you are ready to create an instance of a Microsoft [marketplace offer](../cpp-marketplace-offers.md).
