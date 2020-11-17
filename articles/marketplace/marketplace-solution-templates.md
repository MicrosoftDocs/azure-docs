---
title: Publishing guide for Azure applications solution template offers - Azure Marketplace
description: This article describes the requirements for publishing solution templates on Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: msjogarrig
ms.author: jogarrig
ms.date: 04/22/2020
---

# Publishing guide for Azure applications solution template offers

This article explains the requirements for publishing solution template offers, which is one way to publish Azure application offers in Azure Marketplace. The solution template offer type requires an [Azure Resource Manager template (ARM template)](../azure-resource-manager/templates/overview.md) to automatically deploy your solution infrastructure.

Use the Azure application *solution template* offer type under the following conditions:

- Your solution requires additional deployment and configuration automation beyond a single virtual machine (VM), such as a combination of VMs, networking, and storage resources.
- Your customers are going to manage the solution themselves.

The listing option that a customer sees for this offer type is *Get It Now*.

## Requirements for solution template offers

| **Requirements** | **Details**  |
| ---------------  | -----------  |
|Billing and metering    |  Solution template offers are not transaction offers, but they can be used to deploy paid VM offers that are billed through the Microsoft commercial marketplace. The resources that the solution's ARM template deploys are set up in the customer's Azure subscription. Pay-as-you-go virtual machines are transacted with the customer via Microsoft and billed via the customer's Azure subscription.<br/> For bring-your-own-license (BYOL) billing, although Microsoft bills infrastructure costs that are incurred in the customer subscription, you transact your software licensing fees with the customer directly.   |
|Azure-compatible virtual hard disk (VHD)  |   VMs must be built on Windows or Linux. For more information, see: <ul> <li>[Create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md) (for Windows VHDs).</li><li>[Linux distributions endorsed on Azure](../virtual-machines/linux/endorsed-distros.md) (for Linux VHDs).</li></ul> |
| Customer usage attribution | Enabling customer usage attribution is required on all solution templates that are published on Azure Marketplace. For more information about customer usage attribution and how to enable it, see [Azure partner customer usage attribution](./azure-partner-customer-usage-attribution.md).  |
| Use managed disks | [Managed disks](../virtual-machines/managed-disks-overview.md) is the default option for persisted disks of infrastructure as a service (IaaS) VMs in Azure. You must use managed disks in solution templates. <ul><li>To update your solution templates, follow the guidance in [Use managed disks in Azure Resource Manager templates](../virtual-machines/using-managed-disks-template-deployments.md), and use the provided [samples](https://github.com/Azure/azure-quickstart-templates).<br><br> </li><li>To publish the VHD as an image in Azure Marketplace, import the underlying VHD of the managed disks to a storage account by using either of the following methods:<ul><li>[Azure PowerShell](../virtual-machines/scripts/virtual-machines-powershell-sample-copy-managed-disks-vhd.md) </li> <li> [The Azure CLI](../virtual-machines/scripts/virtual-machines-cli-sample-copy-managed-disks-vhd.md) </li> </ul></ul> |

## Next steps

If you haven't already done so, learn how to [Grow your cloud business with Azure Marketplace](https://azuremarketplace.microsoft.com/sell).

To register for and start working in Partner Center:

- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.
- See [Create an Azure application offer](./partner-center-portal/create-new-azure-apps-offer.md) for more information.