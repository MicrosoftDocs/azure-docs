---
title: Virtual Machine Offer Publishing Guide for Azure Marketplace
description: This article describes the requirements to publish a virtual machine and a software free trial to be deployed from the Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: dsindona
---

# Virtual Machine Offer Publishing Guide

Virtual Machine images are one of the main ways to publish a solution in the Azure Marketplace. Use this guide to understand the requirements for this offer. 

These are transaction offers which are deployed and billed through the Marketplace. The call to action that a user sees is "Get It Now."

## Free Trial 

You can arrange for users to test your offer by accessing limited term software licenses when using the Bring Your Own License (BYOL) billing model. 

## Test Drive

You deploy one or more virtual machines through infrastructure-as-a-service (IaaS) or software-as-a-service (SaaS) apps. A benefit of the test drive publishing option is the automated provisioning of a virtual machine or entire solution led by a partner-hosted guided tour. A test drive provides an evaluation at no additional cost to your customer. Your customer does not need to be an existing Azure customer to engage with the trial experience. 

Contact us at [amp-testdrive](mailto:amp-testdrive@microsoft.com) to get started. 

|Requirements  |Details |
|---------|---------|
| You have a Marketplace app   |    One or more virtual machines through IaaS or SaaS.      |

## Interactive Demo

You provide a guided experience of your solution to your customers by using an interactive demonstration. The benefit of interactive demo publishing option is that you provide a trial experience without complicated provisioning of your complex solution. 

## Virtual Machine Offer

Use the virtual machine offer type when you deploy a virtual appliance to the subscription associated with your customer. VMs are fully commerce enabled using pay-as-you-go or bring-your-own-license (BYOL) licensing models. Microsoft hosts the commerce transaction and bills your customer on your behalf. You get the benefit of using the preferred payment relationship between your customer and Microsoft, including any Enterprise Agreements.

> [!NOTE]
> At this time, the monetary commitments associated with an Enterprise Agreement are able to be used against the Azure usage of your VM, but not against your software licensing fees.  
> 
> [!NOTE]
> You are able to restrict the discovery and deployment of your VM to a specific set of customers by publishing the image and pricing as a Private offer. Private offers unlock the ability for you to create exclusive offers for your closest customers and offer customized software and terms. The customized terms enable you to highlight a variety of scenarios, including field-led deals with specialized pricing and terms as well as early access to limited release software. Private offers enable you to give specific pricing or products to a limited set of customers by creating a new SKU with those details.  
> *   For more information about Private Offers, visit the Private Offers on Azure Marketplace page located at [azure.microsoft.com/blog/private-offers-on-azure-marketplace](https://azure.microsoft.com/blog/private-offers-on-azure-marketplace).  

| Requirement | Details |  
|:--- |:--- | 
| Billing and metering | Your VM must support either BYOL or Pay-As-You-Go monthly billing. |  
| Azure-compatible virtual hard disk (VHD) | VMs must be built on Windows or Linux. <ul> <li>For more information about creating a Linux VHD, see [Linux distributions endorsed on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).</li> <li>For more information about creating a Windows VHD, see [Create an Azure-compatible VHD](./partner-center-portal/azure-vm-create-offer.md).</li> </ul> |  

>[!Note]
>Cloud Solution Providers (CSP) partner channel opt-in is now available.  Please see [Cloud Solution Providers](./cloud-solution-providers.md) for more information on marketing your offer through the Microsoft CSP partner channels.

## Next steps

If you haven't already done so, 

- [Learn](https://azuremarketplace.microsoft.com/sell) about the marketplace.

If you're registered and are creating a new offer or working on an existing one,

- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- See [create a virtual machine offer](./partner-center-portal/azure-vm-create-offer.md) for more information.
