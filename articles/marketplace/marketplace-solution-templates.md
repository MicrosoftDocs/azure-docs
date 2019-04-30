---
title: Azure Applications Solution Template Offer Publishing Guide | Azure Marketplace
description: This article describes the requirements to publish a solution template in the Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
author: ellacroi
manager: nunoc
ms.service: marketplace
ms.topic: article
ms.date: 11/15/2018
ms.author: ellacroi
---

# Azure Applications: Solution Template Offer Publishing Guide

Solution templates are one of the main ways to publish a solution in the Marketplace. Use this guide to understand the requirements for this offer. 

Use the Azure app: solution template offer type when your solution requires additional deployment and configuration automation beyond a single VM. You may automate the provisioning of one or more VMs using Azure apps: solution templates. You may also provision networking and storage resources. Azure apps: solution templates offer type provides automation benefits for single VMs and entire IaaS-based solutions.

These solution templates are transaction offers, which are deployed and billed through the Marketplace. The call to action that a user sees is "Get It Now."


## Requirements for Solution Templates

| **Requirements** | **Details**  |
| ---------------  | -----------  |
|Billing and metering    |  The resources will be provisioned in the customer’s Azure subscription. Pay-as-you-go (PAYGO) virtual machines will be transacted with the customer via Microsoft, billed via the customer’s Azure subscription (PAYGO).  <br/> In the case of bring-your-own-license (BYOL), while Microsoft will bill infrastructure costs incurred in the customer subscription, you will transact your software licensing fees to the customer directly.   |
|Azure-compatible virtual hard disk (VHD)  |   VMs must be built on Windows or Linux.  For more information, [see Create an Azure-compatible VHD](./cloud-partner-portal/virtual-machine/cpp-create-vhd.md). |
| Customer Usage Attribution | Enabling customer usage attribution is required on all solution templates published to the Azure Marketplace. For more information on customer usage attribution and how to enable it, see [Azure partner customer usage attribution](./azure-partner-customer-usage-attribution.md).  |
|  |  |

## Next steps
If you haven't already done so, [register](https://azuremarketplace.microsoft.com/sell) in the marketplace.

If you're registered and are creating a new offer or working on an existing one, sign in to [Cloud Partner Portal](https://cloudpartner.azure.com) to create or complete your offer.
