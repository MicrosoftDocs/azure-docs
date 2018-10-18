---  
title: Virtual Machine Offer Publishing Guide for Azure Marketplace
description: This article describes the requirements to publish a virtual machine and a software free trial to be deployed from the Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
documentationcenter:
author: ellacroi
manager: nunoc
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang:
ms.topic: article
ms.date: 07/09/2018
ms.author: ellacroi

---  

# Virtual Machine Offer Publishing Guide

Virtual Machine images are one of the main ways to publish a solution in the Azure Marketplace. Use this guide to understand the requirements for this offer. 

These are transaction offers which are deployed and billed through the Marketplace. The call to action that a user sees is "Get It Now."

## Free Trial 

You can arrange for users to test your offer by accessing limited term software licenses when using the Bring Your Own License (BYOL) blling model. Below are the requirements to deploy this offer. 

|Requirements  |Details  |
|---------|---------|
|Free trial period and trial experience     |   Your customer may try your app for free for a limited time. Your customer is not required to pay any license or subscription fees for your offer. Your customers are not required to pay for the underlying Microsoft first-party product or service. All trial options are deployed to your Azure subscription. You have sole control of the cost optimization and management. You may choose a free trial or interactive demo. No matter what you choose, your free trial must provide the customer a pre-set amount of time to try your offer at no additional cost.|
|Easily configurable, ready-to-use solution    |  Your app must be easy and quick to configure and set up.       |
|Availability / uptime    |    Your SaaS app or platform must have an uptime of at least 99.9%.     |
|Azure Active Directory     |    Your offer must allow Azure Active Directory (Azure AD) federated single sign-on (SSO) (Azure AD federated SSO) with consent enabled.     |

## Test Drive

You deploy one or more virtual machines through infrastructure-as-a-service(IaaS) or SaaS apps. A benefit of the test drive publishing option is the automated provisioning of a virtual machine or entire solution led by a partner-hosted guided tour. A test drive provides an evaluation at no additional cost to your customer. Your customer does not need to be an existing Azure customer to engage with the trial experience. 

Contact us at [amp-testdrive](mailto:amp-testdrive@microsoft.com) to get started. 

|Requirements  |Details |
|---------|---------|
| You have a Marketplace app   |    One or more virtual machines through IaaS or SaaS.      |

## Interactive Demo

You provide a guided experience of your solution to your customers by using an interactive demonstration. The benefit of interactive demo publishing option is that you provide a trial experience without complicated provisioning of your complex solution. 

## Virtual Machine Offer

Use the virtual machine offer type when you deploy a virtual appliance to the subscription associated with your customer. VMs are fully commerce enabled using pay-as-you-go or bring-your-own-license (BYOL) licensing models. Microsoft hosts the commerce transaction and bills your customer on your behalf. You get the benefit of using the preferred payment relationship between your customer and Microsoft, including any Enterprise Agreements.

>[!NOTE]
>At this time, the monetary commitments associated with an Enterprise Agreement are able to be used against the Azure usage of your VM, but not against your software licensing fees.  

>[!NOTE]
>You are able to restrict the discovery and deployment of your VM to a specific set of customers by publishing the image and pricing as a Private offer. Private offers unlock the ability for you to create exclusive offers for your closest customers and offer customized software and terms. The customized terms enable you to highlight a variety of scenarios, including field-led deals with specialized pricing and terms as well as early access to limited release software. Private offers enable you to give specific pricing or products to a limited set of customers by creating a new SKU with those details.  
*   For more information about Private Offers, visit the Private Offers on Azure Marketplace page located at [azure.microsoft.com/blog/private-offers-on-azure-marketplace](https://azure.microsoft.com/blog/private-offers-on-azure-marketplace).  

| Requirement | Details |  
|:--- |:--- | 
| Billing and metering | Your VM must support either BYOL or Pay-As-You-Go monthly billing. |  
| Azure-compatible virtual hard disk (VHD) | VMs must be built on Windows or Linux.<ul> <li>For more information about creating a Linux VHD, visit the Create an Azure-compatible VHD (Linux-based) section located at [docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#2-create-an-azure-compatible-vhd-linux-based](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#2-create-an-azure-compatible-vhd-linux-based).</li> <li>For more information about creating a Windows VHD, visit the Create an Azure-compatible VHD (Windows-based) section located at [docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#3-create-an-azure-compatible-vhd-windows-based](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#3-create-an-azure-compatible-vhd-windows-based).</li> </ul> |  

## Next Steps

If you haven't already done so, 

- [Register](https://azuremarketplace.microsoft.com/sell) in the marketplace

If you're registered and are creating a new offer or working on an existing one,

- [Log in to Cloud Partner Portal](https://cloudpartner.azure.com) to create or complete your offer
