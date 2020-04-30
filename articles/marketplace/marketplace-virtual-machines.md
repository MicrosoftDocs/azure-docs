---
title: Publishing guide for virtual machine offers on Azure Marketplace
description: This article describes the requirements for publishing a virtual machine and a software free trial to be deployed from Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: dsindona
---

# Publishing guide for virtual machine offers

Publishing virtual machine (VM) images is one of the main ways to publish a solution to Azure Marketplace. Use this guide to understand the requirements for this type of offer. 

Virtual machine offers are transaction offers that are deployed and billed through Azure Marketplace. The call to action that a user sees is *Get It Now*.

## Free trial 

To arrange for users to test your offer, access limited-term software licenses when you use the bring-your-own-license (BYOL) billing model. 

## Test drive

You can deploy one or more virtual machines through infrastructure as a service (IaaS) or software as a service (SaaS) apps. A benefit of the *test drive* publishing option is the automated setup of a virtual machine or entire solution led by a partner-hosted guided tour. A test drive lets your customers evaluate VMs at no additional cost to them. A customer doesn't need to be an existing Azure customer to engage with the trial experience. 

To get started, contact us by email at [amp-testdrive](mailto:amp-testdrive@microsoft.com). 

|Requirements  |Details |
|---------|---------|
| You have an Azure Marketplace app   |  One or more virtual machines through IaaS or SaaS.      |

## Interactive demo

With this offer, you give your customers a guided experience of your solution by using an interactive demonstration. The benefit of an interactive demo publishing option is that you can offer a trial experience without having to provide a complicated setup of your complex solution. 

## Virtual machine offer

Use the *virtual machine* offer type when you deploy a virtual appliance to the subscription that's associated with your customer. VMs are fully commerce-enabled, using pay-as-you-go or bring-your-own-license (BYOL) licensing models. Microsoft hosts the commerce transaction and bills your customer on your behalf. You get the benefit of using the preferred payment relationship between your customer and Microsoft, including any Enterprise Agreements.

> [!NOTE]
> At this time, the monetary commitments associated with an Enterprise Agreement can be used against the Azure usage of your VM, but not against your software licensing fees.  
> 
> [!NOTE]
> You can restrict the discovery and deployment of your VM to a specific set of customers by publishing the image and pricing as a Private Offer. Private Offers unlock the ability for you to create exclusive offers for your closest customers and offer customized software and terms. The customized terms enable you to highlight a variety of scenarios, including field-led deals with specialized pricing and terms as well as early access to limited release software. Private Offers enable you to give specific pricing or products to a limited set of customers by creating a new SKU with those details.  
>
> For more information, see [Private Offers on Azure Marketplace](https://azure.microsoft.com/blog/private-offers-on-azure-marketplace).  

| Requirement | Details |  
|:--- |:--- | 
| Billing and metering | Your VM must support either BYOL or pay-as-you-go monthly billing. |  
| Azure-compatible virtual hard disk (VHD) | VMs must be built on Windows or Linux. For more information about creating a VHD, see: <ul> <li>[Linux distributions endorsed on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) (for Linux VHDs).</li> <li>[Create an Azure-compatible VHD](./partner-center-portal/azure-vm-create-offer.md) (for Windows VHDs).</li> </ul> |  

>[!Note]
>The Cloud Solution Provider (CSP) partner channel opt-in is now available. For more information about marketing your offer through Microsoft CSP partner channels, see [Cloud Solution Providers](./cloud-solution-providers.md).

## Next steps

If you haven't already done so, learn how to [Grow your cloud business with Azure Marketplace](https://azuremarketplace.microsoft.com/sell).

To register for and start working in Partner Center:

- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- See [Create a virtual machine offer](./partner-center-portal/azure-vm-create-offer.md) for more information.
