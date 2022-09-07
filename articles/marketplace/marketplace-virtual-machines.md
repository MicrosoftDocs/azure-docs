---
title: Plan a virtual machine offer - Microsoft commercial marketplace
description: This article describes the requirements for publishing a virtual machine offer to Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 08/22/2022
---

# Plan a virtual machine offer

This article explains the different options and requirements for publishing a virtual machine (VM) offer to the commercial marketplace. VM offers are transactable offers deployed and billed through Azure Marketplace.

Before you start, [Create a commercial marketplace account in Partner Center](create-account.md) and ensure your account is enrolled in the commercial marketplace program.

> [!TIP]
> To see the customer's view of purchasing in the commercial marketplace, see [Azure Marketplace purchasing](/marketplace/azure-purchasing-invoicing).

### Technical fundamentals

The process of designing, building, and testing offers takes time and requires expertise in both the Azure platform and the technologies used to build your offer. Your engineering team should have a working knowledge of [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage#storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking#networking), as well as proficiency with the [design and architecture of Azure applications](https://azure.microsoft.com/solutions/architecture/). See these additional technical resources:

- Tutorials
  - [Linux VMs](../virtual-machines/linux/tutorial-manage-vm.md)
  - [Windows VMs](../virtual-machines/windows/tutorial-manage-vm.md)

- Samples
  - [Azure CLI samples for Linux VMs](https://github.com/Azure-Samples/azure-cli-samples/tree/master/virtual-machine)
  - [Azure PowerShell for Linux VMs](https://github.com/Azure/azure-docs-powershell-samples/tree/master/virtual-machine)
  - [Azure CLI samples for Windows VMs](https://github.com/Azure-Samples/azure-cli-samples/tree/master/virtual-machine)
  - [Azure PowerShell for Windows VMs](/previous-versions/azure/virtual-machines/scripts/virtual-machines-windows-powershell-sample-create-vm-quick)

## Technical requirements

VM offers have the following technical requirements:

- You must prepare one operating system virtual hard disk (VHD). Data disk VHDs are optional. This is explained in more detail below.
- You must create at least one plan for your offer. Your plan is priced based on the [licensing model](#licensing-models) you select.
   > [!IMPORTANT]
   > Every VM image in a plan must have the same number of data disks.

A VM contains two components:

- **Operating VHD** – Contains the operating system and solution that deploys with your offer. The process of preparing the VHD differs depending on whether it is a Linux-, Windows-, or custom-based VM.
- **Data disk VHDs** (optional) – Dedicated, persistent storage for a VM. Don't use the operating system VHD (for example, the C: drive) to store persistent information. 
    - You can include up to 16 data disks.
    - Use one VHD per data disk, even if the disk is blank.

    > [!NOTE]
    > Regardless of which operating system you use, add only the minimum number of data disks needed by the solution. Customers cannot remove disks that are part of an image at the time of deployment, but they can always add disks during or after deployment.

For detailed instructions on preparing your technical assets, see [Create a virtual machine using an approved base](azure-vm-use-approved-base.md) or [Create a virtual machine using your own image](azure-vm-use-own-image.md).

## Preview audience

A preview audience can access your offer prior to it being published live in the marketplace in order to test the end-to-end functionality. On the **Preview audience** page, you can use Azure subscription IDs to define a limited preview audience.

> [!NOTE]
> A preview audience differs from a private audience. A preview audience is a list of subscription IDs that can test and validate your offer. This includes any private plans, before they are made available to your users. In contrast, when making an offer private, you need to specify a private audience to restrict visibility of your offer to customers of your choosing. A private audience (defined on the **Pricing and Availability** page for each of your plans) is a list of subscription IDs and/or tenant IDs that will have access to a particular plan after the offer is live.

## Plans, pricing, and trials

VM offers require at least one plan. A plan defines the solution scope and limits, and the associated pricing. You can create multiple plans for your offer to give your customers different technical and pricing options, as well as trial opportunities. For VM offers with more than one plan, you can change the order that your plans are shown to customers. The first plan listed will become the default plan that customers will see. For info about how to reorder plans, see [Reorder plans](azure-vm-plan-reorder-plans.md). For general guidance about plans, including pricing models, free trials, and private plans, see [Plans and pricing for commercial marketplace offers](plans-pricing.md).

VMs are fully commerce-enabled, using usage-based pay-as-you-go or bring-your-own-license (BYOL) licensing models. Microsoft hosts the commerce transaction and bills your customer on your behalf. You get the benefit of using the preferred payment relationship between your customer and Microsoft, including any Enterprise Agreements. For more information, see [Commercial marketplace transact capabilities](./marketplace-commercial-transaction-capabilities-and-considerations.md).

> [!NOTE]
> The Azure Prepayment (previously called monetary commitment) associated with an Enterprise Agreement can be used against the Azure usage of your VM, but not against your software licensing fees.

### Reservation pricing (optional)

You can offer savings to customers who commit to an annual or three-year agreement through **VM software reservations**. This is called _Reservation pricing_.

Reservation pricing applies to usage-based monthly billed plans with the following price options:

- Flat rate
- Per core
- Per core size

Reservation pricing doesn’t apply to _Bring your own license_ plans or to plans with the following price options:

- Free
- Per market and core size price

#### How prices are calculated

The 1-year and 3-year prices are calculated based on the per hour usage-based price and the percentage savings you configure for a plan.

In this example, we’ll configure a plan with the “Per core” price option as follows:

- Hourly price per core: $1.
- 1-year savings: 30% discount
- 3-year savings: 50% discount

All calculations are based on 8,760 hours per year. Without VM software reservation pricing, the yearly cost of a 1 core VM would be $8,760.00. If the customer purchases a VM software reservation, the price would be as follows:

1-year price with 30% discount = $6,132.00

3-year price with 50% discount = $13,140.00

### Private plans

Private plans restrict the discovery and deployment of your solution to a specific set of customers you choose and offer customized software, terms, and pricing. The customized terms enable you to highlight a variety of scenarios, including field-led deals with specialized pricing and terms as well as early access to limited release software.

For more information, see [Plans and pricing for commercial marketplace offers](plans-pricing.md) and [Private offers in the Microsoft commercial marketplace](private-offers.md).

### Hidden plans

A hidden plan is not visible on Azure Marketplace and can only be deployed through a Solution Template, Managed Application, Azure CLI or Azure PowerShell. Hiding a plan is useful when trying to limit exposure to customers that would normally be searching or browsing for it directly via Azure Marketplace.

> [!NOTE]
> A hidden plan is different from a private plan. When a plan is publicly available but hidden, it is still available for any Azure customer to deploy via Solution Template, Managed Application, Azure CLI or Azure PowerShell. However, a plan can be both hidden and private, in which case only the customers configured in the private audience can deploy via these methods.

### Licensing models

As you prepare to publish a new offer, you need to make pricing-related decisions by selecting the appropriate licensing model.

These are the available licensing options for VM offers:

| Licensing model | Transaction process |
| --- | --- |
| Usage-based | Also known as pay-as-you-go. This licensing model lets you bill your customers per hour through various pricing options. |
| BYOL | The Bring Your Own Licensing option lets your customers bring existing software licenses to Azure. * |

`*` As the publisher, you support all aspects of the software license transaction, including (but not limited to) order, fulfillment, metering, billing, invoicing, payment, and collection.

The following example shows a VM offer in Azure Marketplace that has usage-based pricing.

:::image type="content" source="media/vm/sample-offer-screen.png" alt-text="Sample VM offer screen.":::

### Trials

The following are types of trials that can be configured to help identify customer leads. These trials give potential customers an opportunity to interact with your offer prior to purchasing via the licensing model you selected.

| Trials | Transaction process |
| ------------ | ------------- |
| Free trial | Offer your customers a one-, three- or six-month free trial. |
| Test drive | This option lets your customers evaluate your solution at no additional cost to them. They don't need to be an existing Azure customer to engage with the trial experience. Learn more about [test drives](#test-drive). |

> [!NOTE]
> The licensing model along with any trial opportunities you select will determine the additional information you'll need to provide when you create the offer in Partner Center.

## Test drive

You can enable a test drive that lets customers try your offer prior to purchase by giving them access to a preconfigured environment for a fixed number of hours, resulting in highly qualified leads and an increased conversion rate. Test drives differ depending on the offer type and marketplace. To learn more about types of test drives and how they work, see [What is a test drive?](what-is-test-drive.md). To learn more about test drives for VM offers, see [Configure a VM test drive](azure-vm-test-drive.md).

## Customer leads

The commercial marketplace will collect leads with customer information so you can access them in the [Referrals workspace](https://partner.microsoft.com/dashboard/referrals/v2/leads) in Partner Center. Leads will include information such as customer details along with the offer name, ID, and online store where the customer found your offer.

You can also choose to connect your CRM system to your offer. The commercial marketplace supports Dynamics 365, Marketo, and Salesforce, along with the option to use an Azure table or configure an HTTPS endpoint using Power Automate. For detailed guidance, see [Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

## Legal contracts

You have two options for defining the terms and conditions for your offer:
- Use the standard contract with optional amendments
- Use your own terms and conditions

To learn about the standard contract and optional amendments, see [Standard Contract for the Microsoft commercial marketplace](standard-contract.md). You can download the [Standard Contract](https://go.microsoft.com/fwlink/?linkid=2041178) PDF (make sure your pop-up blocker is off).

## Cloud Solution Providers

When creating your offer in Partner Center, you will see the **Resell through CSPs** tab. This option allows partners who are part of the Microsoft Cloud Solution Providers (CSP) program to resell your VM as part of a bundled offer. All Bring-your-own-license (BYOL) plans are automatically opted in to the program. You can also choose to opt in your non-BYOL plans. See [Cloud Solution Provider program](cloud-solution-providers.md) for more information.

## Next steps

- If you do not yet have an image created for your offer, see [Create a virtual machine using an approved base](azure-vm-use-approved-base.md) or [Create a virtual machine using your own image](azure-vm-use-own-image.md).
- Once you have an image ready, see [Create a virtual machine offer on Azure Marketplace](azure-vm-offer-setup.md)
