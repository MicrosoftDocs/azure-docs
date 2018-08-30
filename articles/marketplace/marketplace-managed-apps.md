---  
title: Azure Applications Managed Application Offer Publishing Guide
description: This article describes the requirements to publish a managed application in the Marketplace
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

# Azure Applications: Managed Application Offer Publishing Guide

A managed application is one of the main ways to publish a solution in the Marketplace. Use this guide to understand the requirements for this offer. 

These are transaction offers which are deployed and billed through the Marketplace. The call to action that a user sees is "Get It Now."

Use the Azure app: managed app offer type when the following conditions are required:
- You deploy either a subscription-based solution for your customer using either a VM or an entire IaaS-based solution.
- You or your customer require that the solution is managed by a partner.

>[!NOTE]
>For example, a partner may be an SI or managed service provider (MSP).  

## Managed Application Offer

|Requirements |Details  |
|---------|---------|
|Deployed to a customer’s Azure subscription | Managed Apps must be deployed in the customer’s subscription and can be managed by a 3rd party | 
|Billing and metering    |  The resources will be provisioned in the customer’s Azure subscription. Pay-as-you-go (PAYGO) virtual machines will be transacted with the customer via Microsoft, billed via the customer’s Azure subscription (PAYGO) 
In the case of bring-your-own-license, while Microsoft will bill infrastructure costs incurred in the customer subscription, you will transact your software licensing fees to the customer directly        |
|Azure-compatible virtual hard disk (VHD)    |   VMs must be built on Windows or Linux.<ul> <li>For more information about creating a Linux VHD, visit the Create an Azure-compatible VHD (Linux-based) section located at [docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#2-create-an-azure-compatible-vhd-linux-based](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#2-create-an-azure-compatible-vhd-linux-based).</li> <li>For more information about creating a Windows VHD, visit the Create an Azure-compatible VHD (Windows-based) section located at [docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#3-create-an-azure-compatible-vhd-windows-based](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#3-create-an-azure-compatible-vhd-windows-based).</li> </ul>      |

>[!NOTE]
> Managed apps must be deployable through the Marketplace. If customer communication is a concern, then you should reach out to interested customers after you have enabled lead sharing.  


## Next Steps
If you haven't already done so, 

- [Register](https://azuremarketplace.microsoft.com/sell) in the marketplace

If you're registered and are creating a new offer or working on an existing one,

- [Log in to Cloud Partner Portal](https://cloudpartner.azure.com) to create or complete your offer
