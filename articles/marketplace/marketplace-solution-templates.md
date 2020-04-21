---
title: Azure Applications Solution Template Offer Publishing Guide | Azure Marketplace
description: This article describes the requirements to publish a solution template in the Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/15/2020
ms.author: dsindona
---

# Azure Applications: Solution Template Offer Publishing Guide

Solution templates are one of the main ways to publish a solution in the Marketplace. Use this guide to understand the requirements for this offer. 

Use the Azure app: solution template offer type when your solution requires additional deployment and configuration automation beyond a single VM. You may automate the provisioning of one or more VMs using Azure apps: solution templates. You may also provision networking and storage resources. Azure apps: solution templates offer type provides automation benefits for single VMs and entire IaaS-based solutions.

These solution templates are not transaction offers, but can be used to deploy paid VM offers billed through Microsoft's commercial marketplace. The call to action that a user sees is "Get It Now."


## Requirements for Solution Templates

| **Requirements** | **Details**  |
| ---------------  | -----------  |
|Billing and metering    |  The resources will be provisioned in the customer's Azure subscription. Pay-as-you-go (PAYGO) virtual machines will be transacted with the customer via Microsoft, billed via the customer's Azure subscription (PAYGO).  <br/> In the case of bring-your-own-license (BYOL), while Microsoft will bill infrastructure costs incurred in the customer subscription, you will transact your software licensing fees to the customer directly.   |
|Azure-compatible virtual hard disk (VHD)  |   VMs must be built on Windows or Linux.  For more information, see [create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md). |
| Customer Usage Attribution | Enabling customer usage attribution is required on all solution templates published to the Azure Marketplace. For more information on customer usage attribution and how to enable it, see [Azure partner customer usage attribution](./azure-partner-customer-usage-attribution.md).  |
| Use Managed Disks | [Managed Disks](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview) is the default option for persisted disks of IaaS VMs in Azure. You must use Managed Disks in Solution Templates. <br> <br> 1. Follow the [guidance](https://docs.microsoft.com/azure/virtual-machines/windows/using-managed-disks-template-deployments) and [samples](https://github.com/Azure/azure-quickstart-templates/blob/master/managed-disk-support-list.md) for using Managed Disks in the Azure ARM templates to update your solution templates. <br> <br> 2. Follow the instructions below to import the underlying VHD of the Managed Disks to a Storage account to publish the VHD as an image in the Marketplace: <br> <ul> <li> [PowerShell](https://docs.microsoft.com/azure/virtual-machines/scripts/virtual-machines-windows-powershell-sample-copy-managed-disks-vhd?toc=%2fpowershell%2fmodule%2ftoc.json) </li> <li> [CLI](https://docs.microsoft.com/azure/virtual-machines/scripts/virtual-machines-linux-cli-sample-copy-managed-disks-vhd?toc=%2fcli%2fmodule%2ftoc.json) </li> </ul> |

## Next steps

If you haven't already done so, 

- [Learn](https://azuremarketplace.microsoft.com/sell) about the marketplace.

To register in Partner Center, start creating a new offer or working on an existing one:

- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- See [create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md) for more information.

