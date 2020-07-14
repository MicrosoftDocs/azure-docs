---
title: Private offers in Microsoft commercial marketplace
description: Private offers in the Microsoft commercial marketplace for app and service publishers.
author: qianw211
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/19/2020
ms.author: dsindona
---

# Private offers in the Microsoft commercial marketplace

Private offers in [Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/) enable publishers to create plans that are only visible to targeted customers. In this article, you'll learn about the options and benefits of private offers.

## Unlock enterprise deals with private offers

Enterprise customers increasingly use online marketplaces to find, try, and buy cloud solutions. Now with private offers, publishers can use marketplace to privately share customized solutions with targeted customers with capabilities that enterprises require:

- *Negotiated pricing* lets publishers extend discounts and off-list pricing from publicly available offerings.
- *Private terms and conditions* enable publishers to tailor terms and conditions to a specific customer.
- *Specialized configurations* let publishers tailor their Virtual Machines, Azure Applications, and SaaS Apps offer to an individual customer's needs. This option also enables publishers to provide preview access to new product features, before launching more broadly to all customers.

Private offers allow publishers to take advantage of the scale and global availability of a public marketplace, with the flexibility and control needed to negotiate and deliver custom deals and configurations. Together, these features open the door to strong enterprise adoption of cloud marketplaces. Enterprises can now buy and sell in ways they expect and demand.

Private offers are now available for Virtual Machine, Azure Application (implemented as solution templates or managed applications), and SaaS Apps offers. 

<!--- Like public offers, private offers can be created and managed via the [Cloud Partner Portal](./cloud-partner-portal-orig/cloud-partner-portal-azure-private-skus.md).  Customers can be granted or revoked access to private offers in minutes.
--->

## Creating private offers using SKUs and plans

For *new or existing offers with public SKUs or plans*, publishers can easily create new, private variations by creating new SKUs or plans and marking them as private.  

<!--- [Private SKUs](./cloud-partner-portal-orig/cloud-partner-portal-azure-private-skus.md) ---> 

Private SKUs and plans are components of an offer and are only visible and purchasable by the targeted customers. Private SKUs and plans can reuse the base images and/or offer metadata already published for a public SKU or plan. This option allows publishers to create multiple private variations of a public offer without having to publish multiple versions of the same base image and offer metadata. For Virtual Machine and Azure application offers only, when a private SKU shares a base image with a public SKU, any changes to the offer's base image will propagate across all public and private SKUs using that base image.

For *new offers that only include private SKUs or plans*, publishers can create their offers as any other offer, and then mark the SKUs or plans as private. The offers that only have private SKUs or plans will not be discoverable or accessible via the Microsoft commercial marketplace or the [Azure portal](https://azure.microsoft.com/features/azure-portal/) by customers that are not associated with the offer.

## Targeting customers with private offers

For both new and existing private offers, publishers can target customers using subscription identifiers. Publishers using a Virtual Machine or Azure Application offer can constrain availability of a private SKU to an individual Azure subscription ID or upload a CSV of up to 20,000 Azure subscription IDs. While using a SaaS App private offer, publishers can associate either a tenant ID to constrain the availability of a private plan, using either the manual or CSV upload approach.

Once an offer has been certified and published, customers can be updated or removed from the SKU or Plan within minutes by using the Sync Private Subscriptions feature. This capability enables publishers to quickly and easily update the list of customers to which the private SKU or plan is presented without certifying or publishing the offer again.

## Deploying private offers

Private offers are only discoverable via the [Azure portal](https://azure.microsoft.com/features/azure-portal/) and are not shown in [Microsoft AppSource](https://appsource.microsoft.com/) or [Azure Marketplace](https://azuremarketplace.microsoft.com). To learn more about publishing to the different commercial marketplace storefronts, see [Determine your publishing option](./determine-your-listing-type.md).

Once logged into the Azure portal, customers can select the Marketplace navigation element to access their private offers. Private offers will also appear in search results and can be deployed via command line and Azure Resource Manager templates like any other offers.

![[Private offers]](./media/marketplace-publishers-guide/private-offer.png)

Private offers will also appear in search results. Just look for the "Private" badge.

>[!Note]
>Private offers are not supported with subscriptions established through a reseller of the Cloud Solution Provider program (CSP).

<!---
## Next steps

To start using private offers, follow the steps in the [Private SKUs and Plans](./cloud-partner-portal-orig/cloud-partner-portal-azure-private-skus.md) guide.

--->