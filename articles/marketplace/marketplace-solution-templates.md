---  
title: Azure Applications Solution Template Offer Publishing Guide
description: This article describes the requirements to publish a solution template in the Marketplace
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

# Azure Applications: Solution Template Offer Publishing Guide

Solution Templates are one of the main ways to publish a solution in the Marketplace. Use this guide to understand the requirements for this offer. 

These are transaction offers which are deployed and billed through the Marketplace. The call to action that a user sees is "Get It Now."

Use the Azure app: solution template offer type when your solution requires additional deployment and configuration automation beyond a simple VM. You may automate the provisioning of one or more VMs using Azure apps: solution templates. You may also provision networking and storage resources. Azure apps: solution templates offer type provides automation benefits for single VMs and entire IaaS-based solutions.

## Requirements for Solution Templates

|Requirements |Details  |
|---------|---------|
|Billing and metering    |  The resources will be provisioned in the customer’s Azure subscription. Pay-as-you-go (PAYGO) virtual machines will be transacted with the customer via Microsoft, billed via the customer’s Azure subscription (PAYGO) 
In the case of bring-your-own-license, while Microsoft will bill infrastructure costs incurred in the customer subscription, you will transact your software licensing fees to the customer directly        |
|Azure-compatible virtual hard disk (VHD)    |   VMs must be built on Windows or Linux.<ul> <li>For more information about creating a Linux VHD, visit the Create an Azure-compatible VHD (Linux-based) section located at [docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#2-create-an-azure-compatible-vhd-linux-based](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#2-create-an-azure-compatible-vhd-linux-based).</li> <li>For more information about creating a Windows VHD, visit the Create an Azure-compatible VHD (Windows-based) section located at [docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#3-create-an-azure-compatible-vhd-windows-based](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation#3-create-an-azure-compatible-vhd-windows-based).</li> </ul>      |



## Next Steps
If you haven't already done so, 

- [Register](https://azuremarketplace.microsoft.com/sell) in the marketplace

If you're registered and are creating a new offer or working on an existing one,

- [Log in to Cloud Partner Portal](https://cloudpartner.azure.com) to create or complete your offer
