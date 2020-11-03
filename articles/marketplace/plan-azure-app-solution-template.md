---
title: Plan a solution template for an Azure application offer
description: Learn what is required to create a solution template plan for a new Azure application offer using the commercial marketplace portal in Microsoft Partner Center.
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 10/30/2020
---

# Plan a solution template for an Azure application offer

This article explains the requirements for publishing a solution template plan for an Azure Application offer. A solution template plan is one of the two types of plans supported by Azure Application offers. For information about the difference between these two plan types, see [Types of plans](plan-azure-application-offer.md#plans). If you haven’t already done so, read [Plan an Azure application offer](plan-azure-application-offer.md).

The solution template plan type requires an [Azure Resource Manager template (ARM template)](/azure/azure-resource-manager/templates/overview.md) to automatically deploy your solution infrastructure.

## Solution template requirements

| Requirements | Details |
| ------------ | ------------- |
| Billing and metering | Solution template plans are not transactable, but they can be used to deploy paid VM offers that are billed through the Microsoft commercial marketplace. The resources that the solution's ARM template deploys are set up in the customer's Azure subscription. Pay-as-you-go virtual machines are transacted with the customer via Microsoft and billed via the customer's Azure subscription. <br><br> For bring-your-own-license (BYOL) billing, although Microsoft bills infrastructure costs that are incurred in the customer subscription, you transact your software licensing fees with the customer directly. |
| Azure-compatible virtual hard disk (VHD) | VMs must be built on Windows or Linux. For more information, see:<br> • [Create an Azure VM technical asset](/azure/marketplace/partner-center-portal/vm-certification-issues-solutions#how-to-address-a-vulnerability-or-exploit-in-a-vm-offer.md) (for Windows VHDs).<br> • [Linux distributions endorsed on Azure](/azure/virtual-machines/linux/endorsed-distros.md) (for Linux VHDs). |
| Customer usage attribution | Enabling customer usage attribution is required on all solution templates that are published on Azure Marketplace. For more information about customer usage attribution and how to enable it, see [Azure partner customer usage attribution](azure-partner-customer-usage-attribution.md). |
| Use managed disks | [Managed disks](/azure/virtual-machines/windows/managed-disks-overview.md) is the default option for persisted disks of infrastructure as a service (IaaS) VMs in Azure. You must use managed disks in solution templates.<br> - To update your solution templates, follow the guidance in [Use managed disks in Azure Resource Manager templates](/azure/virtual-machines/using-managed-disks-template-deployments.md), and use the provided samples.<br> • To publish the VHD as an image in Azure Marketplace, import the underlying VHD of the managed disks to a storage account by using either of the following methods:<br> • [Azure PowerShell](/azure/virtual-machines/scripts/virtual-machines-powershell-sample-copy-managed-disks-vhd.md) <br> • [The Azure CLI](/azure/virtual-machines/scripts/virtual-machines-cli-sample-copy-managed-disks-vhd.md) |
|||

## Azure regions

You can publish your plan to the Azure public region, Azure Government region, or both. Before publishing to [Azure Government](/azure/azure-government/documentation-government-manage-marketplace-partners.md), test and validate your plan in the environment as certain endpoints may differ. To set up and test your plan, request a trial account from [Microsoft Azure Government trial](https://azure.microsoft.com/global-infrastructure/government/request/).

You, as the publisher, are responsible for any compliance controls, security measures, and best practices. Azure Government uses physically isolated data centers and networks (located in the U.S. only).

For a list of countries and regions supported by the commercial marketplace, see [Geographic availability and currency support](marketplace-geo-availability-currencies.md).

Azure Government services handle data that is subject to certain government regulations and requirements. For example, FedRAMP, NIST 800.171 (DIB), ITAR, IRS 1075, DoD L4, and CJIS. To bring awareness to your certifications for these programs, you can provide up to 100 links that describe them. These can be either links to your listing on the program directly or links to descriptions of your compliance with them on your own websites. These links visible to Azure Government customers only.

## Choose who can see your plan

You can configure each plan to be visible to everyone (public) or to only a specific audience (private). You can create up to 100 plans and up to 45 of them can be private. You may want to create a private plan to offer different pricing options or technical configurations to specific customers.

You grant access to a private plan using Azure subscription IDs with the option to include a description of each subscription ID you assign. You can add a maximum of 10 subscription IDs manually or up to 10,000 subscription IDs using a .CSV file. Azure subscription IDs are represented as GUIDs and letters must be lowercase.

> [!NOTE]
> If you publish a private plan, you can change its visibility to public later. However, once you publish a public plan, you cannot change its visibility to private.

For solution template plans, you can also choose to hide the plan from Azure Marketplace. You might want to do this if the plan is only deployed indirectly through another solution template or managed application.

> [!NOTE]
> Private plans are not supported with Azure subscriptions established through a reseller of the Cloud Solution Provider program (CSP).

For more information, see [Private offers in the Microsoft commercial marketplace](private-offers.md).

## Deployment package

You’ll need a deployment package that will let customers deploy your plan. This package contains all of the template files needed for this plan, as well as any additional resources, packaged as a .zip file.

All Azure applications must include these two files in the root folder of a .zip archive:

- A Resource Manager template file named [mainTemplate.json](/azure/azure-resource-manager/resource-group-overview.md). This template defines the resources to deploy into the customer's Azure subscription. For examples of Resource Manager templates, see the [Azure Quickstart Templates gallery](https://azure.microsoft.com/documentation/templates/) or the corresponding [GitHub: Azure Resource Manager Quickstart Templates](https://github.com/azure/azure-quickstart-templates) repo.
- A user interface definition for the Azure application creation experience named [createUiDefinition.json](/azure/azure-resource-manager/managed-application-createuidefinition-overview.md). In the user interface, you specify elements that enable consumers to provide parameter values.

Maximum file sizes supported are:

- Up to 1 Gb in total compressed .zip archive size
- Up to 1 Gb for any individual uncompressed file within the .zip archive

All new Azure application offers must also include an [Azure partner customer usage attribution](azure-partner-customer-usage-attribution.md) GUID.

If you create multiple plans that require the same technical configuration, you can use the same plan package.

## Next steps

- [How to create an Azure application offer in the commercial marketplace](create-new-azure-apps-offer.md)
