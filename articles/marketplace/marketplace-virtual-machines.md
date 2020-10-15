---
title: Plan a virtual machine offer on Azure Marketplace
description: This article describes the requirements for publishing a virtual machine offer to Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 10/15/2020
---

# Plan a virtual machine offer

This article explains the different options and requirements for publishing a virtual machine (VM) offer to the commercial marketplace. VM offers are transactable offers deployed and billed through Azure Marketplace).

Before you start, [Create a commercial marketplace account in Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-account) and ensure your account is enrolled in the commercial marketplace program.

## Benefits of publishing to Azure Marketplace

When you publish your offers on Azure Marketplace, you can:

- Promote your company with the help of the Microsoft brand.
- Reach over 100 million Microsoft 365 and Dynamics 365 users and more than 200,000 organizations.
- Get high-quality leads from these marketplaces.
- Get your services promoted by the Microsoft field sales and telesales teams.

## Fundamentals in technical knowledge

The process of designing, building, and testing offers takes time and requires expertise in both the Azure platform and the technologies used to build your offer.

Your engineering team should have a working knowledge of the following Microsoft technologies:

- [Azure services](https://azure.microsoft.com/services/)
- [Design and architecture of Azure applications](https://azure.microsoft.com/solutions/architecture/)
- [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage#storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking#networking)

## Licensing options

As you prepare to publish a new VM offer, you need to decide which licensing option to choose. This will determine what additional information you'll need to provide later as you create your offer in Partner Center.

These are the available listing options for VM offers:

| Listing option | Transaction process |
| --- | --- |
| Free trial | Offer your customers a one-, three- or six-month free trial. |
| Test drive | This option lets your customers evaluate VMs at no additional cost to them. They don't need to be an existing Azure customer to engage with the trial experience. For details, see [What is a test drive?](https://docs.microsoft.com/azure/marketplace/what-is-test-drive) |
| BYOL | This Bring Your Own Licensing option lets your customers bring existing software licenses to Azure.\* |
| Usage-based | Also known as pay-as-you-go, this option lets your customers pay per hour. |
| Interactive demo  | Give your customers a guided experience of your solution using an interactive demonstration. The benefit is that you can offer a trial experience without having to provide a complicated setup of your complex solution. |
|

\* As the publisher, you support all aspects of the software license transaction, including (but not limited to) order, fulfillment, metering, billing, invoicing, payment, and collection.

For more information on these listing options, see [Commercial marketplace transact capabilities](https://docs.microsoft.com/azure/marketplace/marketplace-commercial-transaction-capabilities-and-considerations).

After your offer is published, the listing option you chose for your offer appears as a button in the upper-left corner of your offer's listing page. The following example shows an offer page in Azure Marketplace with the **Get it now** button.

:::image type="content" source="media/vm/sample-offer-screen.png" alt-text="Sample VM offer screen.":::

## Virtual machine offer

Use this offer type when your offer is deployed as a virtual machine to the subscription that's associated with your customer. VMs are fully commerce-enabled, using pay-as-you-go or bring-your-own-license (BYOL) licensing models. Microsoft hosts the commerce transaction and bills your customer on your behalf. You get the benefit of using the preferred payment relationship between your customer and Microsoft, including any Enterprise Agreements.

> [!NOTE]
> The monetary commitments associated with an Enterprise Agreement can be used against the Azure usage of your VM, but not against your software licensing fees.

You can restrict the discovery and deployment of your VM to a specific set of customers by publishing the image and pricing as a Private Offer. Private Offers unlock the ability for you to create exclusive offers for your closest customers and offer customized software and terms. The customized terms enable you to highlight a variety of scenarios, including field-led deals with specialized pricing and terms as well as early access to limited release software. Private Offers enable you to give specific pricing or products to a limited set of customers by creating a new plan with those details.

For more information, see [Private Offers on Azure Marketplace](https://azure.microsoft.com/blog/private-offers-on-azure-marketplace).

> [!NOTE]
> The Cloud Solution Provider (CSP) partner channel opt-in is now available. For more information about marketing your offer through Microsoft CSP partner channels, see [**Cloud Solution Providers**](https://docs.microsoft.com/azure/marketplace/cloud-solution-providers).

## Next steps

- Learn how to [Grow your cloud business with Azure Marketplace](https://azuremarketplace.microsoft.com/sell).
- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- Started creating your offer at [Create a VM offer on Azure Marketplace](https://docs.microsoft.com/azure/marketplace/azure-vm-create).
