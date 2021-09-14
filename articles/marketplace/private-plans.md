---
title: Private plans in Microsoft commercial marketplace
description: Private plans in the Microsoft commercial marketplace for app and service publishers (Azure Marketplace).
ms.subservice: partnercenter-marketplace-publisher
ms.service: marketplace
ms.topic: article
author: navits09
ms.author: navits
ms.date: 08/13/2021
---

# Private plans in the Microsoft commercial marketplace

Publishers use private plans so they are only visible to targeted customers. This article discusses the options and benefits of private plans.

## Unlock enterprise deals with private plans

Private plans let publishers offer private, customized solutions to targeted customers with capabilities that enterprises require:

- *Negotiated pricing* lets publishers extend discounts and off-list pricing from publicly available offers.
- *Private terms and conditions* enable publishers to tailor terms and conditions to a specific customer.
- *Specialized configurations* let publishers tailor their Virtual Machines, Azure Applications, and software as a service (SaaS) to an individual customer's needs. This option also enables publishers to provide preview access to new product features, before launching them to all customers.

Private plans let publishers take advantage of the scale and global availability of a public marketplace, with the flexibility and control needed to negotiate and deliver custom deals and configurations. Enterprises can now buy and sell in ways they expect.

## Create private plans

For *new or existing offers with plans*, publishers can easily create new, private variations by creating new plans (formerly known as SKUs) and marking them as private. Each offer can have up to 45 private plans.

<!--- [Private SKUs]() --->

Private plans are available for the following offer types:

- Azure Virtual Machine
- Azure Application (implemented as solution templates or managed applications)
- Managed Service
- SaaS offers

Private plans are components of an offer and are only visible and purchasable by the targeted customers. Private plans are visible and purchasable only by the targeted customers. Private plans can be made available to customers in both Azure Global and Azure Government.

Private plans can reuse the base images and/or offer metadata already published for a public plan. This option lets publishers create multiple private variations of a public offer without having to publish multiple versions of the same base image and offer metadata. For Azure Virtual Machine and Azure application offers only, when a private plan shares a base image with a public plan, any changes to the offer's base image will propagate across all public and private plans using that base image.

For *new offers that only include private plans*, publishers can create their offers as any other offer, and then mark the plans as private. The offers that only have private plans will not be discoverable or accessible in the [Azure portal](https://azure.microsoft.com/features/azure-portal/) or [Microsoft AppSource](https://appsource.microsoft.com/) by customers who are not associated with the offer.

>[!NOTE]
>An offer that contains only private plans will not be visible in the public Azure Marketplace.

## Target customers with private plans

For both new and existing private plans, publishers can target customers using subscription identifiers. For Azure Virtual Machine, Azure Application, and Managed Service offers, publishers can constrain availability of a private plan to an individual Azure subscription ID or upload a CSV of up to 10,000 Azure subscription IDs. For SaaS offers, publishers can associate an Azure Active Directory tenant ID to constrain the availability of a private plan, using either the manual or CSV upload approach.

Once an offer has been certified and published, customers can be updated or removed from the plan by using the Sync Private Subscriptions feature. This capability enables publishers to quickly and easily update the list of customers to which the private plan is presented without certifying or publishing the offer again.

## Deploying a private plan

Once signed into the Azure portal, customers can follow these steps to select your private plans.

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Under **Azure services**, select **Create a resource**.
1. On the **New** page, next to **Azure Marketplace**, select **See all**. The Marketplace page appears.
1. In the left navigation, select **Private Plans**.

> [!NOTE]
> Private plans are only discoverable in the [Azure portal](https://azure.microsoft.com/features/azure-portal/) or [Microsoft AppSource](https://appsource.microsoft.com/). They are not visible in [Azure Marketplace](https://azuremarketplace.microsoft.com). To learn more about publishing to the different commercial marketplace online stores, see [Introduction to listing options](./determine-your-listing-type.md).

Private plans will also appear in search results and can be deployed via command line and Azure Resource Manager templates, like any other offers.

[![[Private offers appearing in search results.]](media/marketplace-publishers-guide/private-offer.png)](media/marketplace-publishers-guide/private-offer.png#lightbox)

>[!Note]
>Private plans are not supported with subscriptions established through a reseller of the Cloud Solution Provider (CSP) program.

<!---
## Next steps

To start using private offers, follow the steps in the [Private SKUs and Plans]() guide.
--->
