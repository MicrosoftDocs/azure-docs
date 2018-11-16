---
title: Private offers | Azure
description: Private offers in the Azure Marketplace for app and service publishers.
services: Azure, Marketplace, Compute
documentationcenter:
author: qianw211
manager: pabutler
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 11/1/2018
ms.author: qianw211

---
# Private offers

Private offers on [Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/) enable publishers to create SKUs that are only visible to targeted customers.

## Unlock enterprise deals with Private offers

Enterprise customers increasingly leverage online marketplaces to find, try, and buy cloud solutions. Now with private offers, publishers can use marketplace to privately share customized solutions with targeted customers with capabilities that enterprises require:

- *Negotiated pricing* lets publishers extend discounts and off-list pricing from publicly available offerings.
- *Private terms and conditions* enable publishers to tailor terms and conditions to a specific customer.
- *Specialized configurations* let publishers tailor their Virtual Machines, Azure applications, and SaaS App offer to an individual customer's needs. The private option also enables publishers to provide preview access to new product features, before launching more broadly to all customers.

Private offers allow publishers to leverage the scale and global availability of a public marketplace, with the flexibility and control needed to negotiate and deliver custom deals and configurations.

Private offers are now available for Virtual Machine, Azure Application (implemented as solution templates or managed applications), and SaaS Apps offers. Like public offers, private offers can be created and managed via the [Cloud Partner Portal](https://cloudpartner.azure.com/) where customers can be granted or revoked access to private offers in minutes.

## Private offers on Azure Marketplace

Azure Marketplace publishers are now able to create these private offers via the .  With the new quick customer add capabilities, you can grant or revoke access to customers in a matter of minutes via the Cloud Partner Portal.

The Private Offer option is now available to single virtual machine offers, SaaS applications, and Azure applications (implemented as solution templates or managed applications).

## Creating Private offers and SKUs

For existing offers, publishers can easily create new private variations by creating new SKUs and marking them as private.  [Private SKUs](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-azure-private-skus) are only visible and purchasable by the targeted customers. Private SKUs must use a new SKU ID; however, they may reuse the images already published for a public SKU. This allows publishers to create multiple private SKUs for a public SKU without having to submit multiple images. If you update the base image, the images across all the public and private SKUs will be updated seamlessly.

For **new private offers or SKUs** only available privately, publishers can create their offers as any other offer, and then mark the SKUs private. The offers that only have [private SKUs](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-azure-private-skus) will not have a publicly visible version. These SKUs will not be visible on [Azure Marketplace](https://azuremarketplace.microsoft.com/) or the [Azure portal](https://azure.microsoft.com/features/azure-portal/).

We are giving publishers the ability to target customers using *subscription identifiers*. Publishers may enter an individual subscription ID, or upload a CSV of subscription IDs, to specify access to their private offers.  The customer list can be updated and reflected in the storefront within a matter of minutes.

## Deploying Private offers

The experience of deploying private offers for the end customers remains the same as any other public offer. They are deployed via command line and Azure Resource Manager templates like any other offers. Upon viewing the catalog on the Azure portal, customers will be prompted that they have private offers available to them:

![[Private offers]](./media/marketplace-publishers-guide/private-offer.png)

Private offers will also appear in search results. Just look out for the “Private” badge.

## Next steps

If you would like to take advantage of these new capabilities, you can get started selling on the [Azure Marketplace](https://azuremarketplace.microsoft.com/sell).
