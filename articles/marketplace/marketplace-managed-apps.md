---
title: Azure Applications Managed Application Offer Publishing Guide
description: This article describes the requirements to publish a managed application in the Marketplace
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
author: MaggiePucciEvans
manager: evansma
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
ms.date: 06/14/2018
ms.author: evansma

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
|Deployed to a customer's Azure subscription | Managed Apps must be deployed in the customer's subscription and can be managed by a third party. | 
|Billing and metering    |  The resources will be provisioned in the customer's Azure subscription. Pay-as-you-go (PAYGO) virtual machines will be transacted with the customer via Microsoft, billed via the customer's Azure subscription (PAYGO). <br> In the case of bring-your-own-license, while Microsoft will bill infrastructure costs incurred in the customer subscription, you will transact your software licensing fees to the customer directly.        |
|Azure-compatible virtual hard disk (VHD)    |   VMs must be built on Windows or Linux.<ul> <ul> <li>For more information about creating a Linux VHD, see [Linux distributions endorsed on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).</li> <li>For more information about creating a Windows VHD, see [Create an Azure-compatible VHD](./cloud-partner-portal/virtual-machine/cpp-create-vhd.md).</li> </ul> |

>[!NOTE]
> Managed apps must be deployable through the Marketplace. If customer communication is a concern, then you should reach out to interested customers after you have enabled lead sharing.  

>[!Note]
>Cloud Solution Providers (CSP) partner channel opt-in is now available.  Please see [Cloud Solution Providers](./cloud-solution-providers.md) for more information on marketing your offer through the Microsoft CSP partner channels.

## Next steps
If you haven't already done so, 

- [Register](https://azuremarketplace.microsoft.com/sell) in the marketplace.

If you're registered and are creating a new offer or working on an existing one,

- [Sign in to the Cloud Partner Portal](https://cloudpartner.azure.com) to create or complete your offer.
