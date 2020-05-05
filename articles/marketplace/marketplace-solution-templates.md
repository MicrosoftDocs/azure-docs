---
title: Azure applications solution template offer publishing guide | Azure Marketplace
description: This article describes the requirements to publish a solution template in the Azure Marketplace.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/22/2020
ms.author: dsindona
---

# Azure Applications: Solution template offer publishing requirements

This article explains the requirements for the solution template offer type, which is one way to publish an Azure application offer in the Azure Marketplace. The solution template offer type requires an [Azure Resource Manager template (ARM template)](../azure-resource-manager/templates/overview.md) to automatically deploy your solution infrastructure.

Use the Azure application solution template offer type when the following conditions are required:

- Your solution requires additional deployment and configuration automation beyond a single VM, such as a combination of VMs, networking, and storage resources.
- Your customer is going to manage the solution themselves.

The call to action that a user sees for this offer type is "Get It Now."

## Requirements for solution template offers

| **Requirements** | **Details**  |
| ---------------  | -----------  |
|Billing and metering    |  Solution template offers are not transact offers, but can be used to deploy paid VM offers billed through the Microsoft commercial marketplace. The resources that the solution's ARM template deploys will be provisioned in the customer's Azure subscription. Pay-as-you-go (PAYGO) virtual machines will be transacted with the customer via Microsoft, billed via the customer's Azure subscription.<br/> In the case of bring-your-own-license (BYOL), while Microsoft will bill infrastructure costs incurred in the customer subscription, you will transact your software licensing fees to the customer directly.   |
|Azure-compatible virtual hard disk (VHD)  |   VMs must be built on Windows or Linux. For more information, see: <ul> <li>[Create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md)(for Windows VHDs)</li><li>[Linux distributions endorsed on Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) (for Linux VHDs).</li></ul> |
| Customer Usage Attribution | Enabling customer usage attribution is required on all solution templates published to the Azure Marketplace. For more information on customer usage attribution and how to enable it, see [Azure partner customer usage attribution](./azure-partner-customer-usage-attribution.md).  |
| Use Managed Disks | [Managed Disks](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview) is the default option for persisted disks of IaaS VMs in Azure. You must use Managed Disks in solution templates. <br> <br> 1. Follow the [guidance](https://docs.microsoft.com/azure/virtual-machines/windows/using-managed-disks-template-deployments) and [samples](https://github.com/Azure/azure-quickstart-templates) for using Managed Disks in the Azure ARM templates to update your solution templates. <br> <br> 2. Follow the instructions below to import the underlying VHD of the Managed Disks to a storage account to publish the VHD as an image in the Marketplace: <br> <ul> <li> [PowerShell](https://docs.microsoft.com/azure/virtual-machines/scripts/virtual-machines-windows-powershell-sample-copy-managed-disks-vhd?toc=%2fpowershell%2fmodule%2ftoc.json) </li> <li> [CLI](https://docs.microsoft.com/azure/virtual-machines/scripts/virtual-machines-linux-cli-sample-copy-managed-disks-vhd?toc=%2fcli%2fmodule%2ftoc.json) </li> </ul> |

## Next steps

- If you haven't already done so, [learn](https://azuremarketplace.microsoft.com/sell) about the Azure Marketplace.
- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- [Create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md) for more information.
