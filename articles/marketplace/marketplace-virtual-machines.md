---
title: Plan a virtual machine offer - Microsoft commercial marketplace
description: This article describes the requirements for publishing a virtual machine offer to Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 10/19/2020
---

# Plan a virtual machine offer

This article explains the different options and requirements for publishing a virtual machine (VM) offer to the commercial marketplace. VM offers are transactable offers deployed and billed through Azure Marketplace.

Before you start, [Create a commercial marketplace account in Partner Center](./partner-center-portal/create-account.md) and ensure your account is enrolled in the commercial marketplace program.

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
- The customer can cancel your offer at any time.
- You must create at least one plan for your offer. Your plan is priced based on the [licensing option](#licensing-options) you select.
   > [!IMPORTANT]
   > Every VM Image in a plan must have the same number of data disks.

A VM contains two components:

- **Operating VHD** – Contains the operating system and solution that deploys with your offer. The process of preparing the VHD differs depending on whether it is a Linux-, Windows-, or custom-based VM.
- **Data disk VHDs** (optional) – Dedicated, persistent storage for a VM. Don't use the operating system VHD (for example, the C: drive) to store persistent information. 
    - You can include up to 16 data disks.
    - Use one VHD per data disk, even if the disk is blank.

    > [!NOTE]
    > Regardless of which operating system you use, add only the minimum number of data disks needed by the solution. Customers cannot remove disks that are part of an image at the time of deployment, but they can always add disks during or after deployment.

For detailed instructions on preparing your technical assets, see [Create a virtual machine using an approved base](azure-vm-create-using-approved-base.md) or [Create a virtual machine using your own image](azure-vm-create-using-own-image.md).

## Preview audience

A preview audience can access your VM offer prior to being published live in Azure Marketplace in order to test the end-to-end functionality before you publish it live. On the **Preview audience** page, you can define a limited preview audience. 

> [!NOTE]
> A preview audience differs from a private plan. A private plan is one you make available only to a specific audience you choose. This enables you to negotiate a custom plan with specific customers. For more information, see the next section: Plans.

You can send invites to Microsoft Account (MSA) or Azure Active Directory (Azure AD) email addresses. Add up to 10 email addresses manually or import up to 20 with a .csv file. If your offer is already live, you can still define a preview audience for testing any changes or updates to your offer.

## Plans and pricing

VM offers require at least one plan. A plan defines the solution scope and limits, and the associated pricing. You can create multiple plans for your offer to give your customers different technical and licensing options, as well as free trials. See [Plans and pricing for commercial marketplace offers](plans-pricing.md) for general guidance about plans, including pricing models, free trials, and private plans. 

VMs are fully commerce-enabled, using pay-as-you-go or bring-your-own-license (BYOL) licensing models. Microsoft hosts the commerce transaction and bills your customer on your behalf. You get the benefit of using the preferred payment relationship between your customer and Microsoft, including any Enterprise Agreements. For more information, see [Commercial marketplace transact capabilities](./marketplace-commercial-transaction-capabilities-and-considerations.md).

> [!NOTE]
> The Azure Prepayment (previously called monetary commitment) associated with an Enterprise Agreement can be used against the Azure usage of your VM, but not against your software licensing fees.

### Licensing options

As you prepare to publish a new VM offer, you need to decide which licensing option to choose. This will determine what additional information you'll need to provide later as you create your offer in Partner Center.

These are the available licensing options for VM offers:

| Licensing option | Transaction process |
| --- | --- |
| Free trial | Offer your customers a one-, three- or six-month free trial. |
| Test drive | This option lets your customers evaluate VMs at no additional cost to them. They don't need to be an existing Azure customer to engage with the trial experience. For details, see [What is a test drive?](./what-is-test-drive.md) |
| BYOL | The Bring Your Own Licensing option lets your customers bring existing software licenses to Azure.\* |
| Usage-based | Also known as pay-as-you-go, this option lets your customers pay per hour. |
| Interactive demo  | Give your customers a guided experience of your solution using an interactive demonstration. The benefit is that you can offer a trial experience without having to provide a complicated setup of your complex solution. |
|

\* As the publisher, you support all aspects of the software license transaction, including (but not limited to) order, fulfillment, metering, billing, invoicing, payment, and collection.

The following example shows a VM offer in Azure Marketplace that has usage-based pricing.

:::image type="content" source="media/vm/sample-offer-screen.png" alt-text="Sample VM offer screen.":::

### Private plans

You can restrict the discovery and deployment of your VM to a specific set of customers by publishing the image and pricing as a private plan. Private plans unlock the ability for you to create exclusive offers for your closest customers and offer customized software and terms. The customized terms enable you to highlight a variety of scenarios, including field-led deals with specialized pricing and terms as well as early access to limited release software. Private plans enable you to give specific pricing or products to a limited set of customers.

For more information, see [Plans and pricing for commercial marketplace offers](plans-pricing.md) and [Private offers in the Microsoft commercial marketplace](private-offers.md).

## Test drive

You can choose to enable a test drive for your VM. Test drives give customers access to a preconfigured environment for a fixed number of hours. You can enable test drives for any publishing option, however this feature has additional requirements. To learn more about test drives, see [What is a test drive?](what-is-test-drive.md). For information about configuring different kinds of test drives, see [Test drive technical configuration](test-drive-technical-configuration.md).

> [!TIP]
> A test drive is different from a [free trial](plans-pricing.md#free-trials). You can offer a test drive, free trial, or both. They both provide your customers with your solution for a fixed period-of-time. But, a test drive also includes a hands-on, self-guided tour of your product’s key features and benefits being demonstrated in a real-world implementation scenario.

## Customer leads

You must connect your offer to your customer relationship management (CRM) system to collect customer information. The customer will be asked for permission to share their information. These customer details, along with the offer name, ID, and online store where they found your offer, will be sent to the CRM system that you've configured. The commercial marketplace supports a variety of CRM systems, along with the option to use an Azure table or configure an HTTPS endpoint using Power Automate.

You can add or modify a CRM connection at any time during or after offer creation. For detailed guidance, see
[Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

## Legal contracts

To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a standard contract you can use for your offers in the commercial marketplace. When you offer your software under the standard contract, customers only need to read and accept it one time, and you don't have to create custom terms and conditions.

If you choose to use the standard contract, you have the option to add universal amendment terms and up to 10 custom amendments to the standard contract. You can also use your own terms and conditions instead of the standard contract. You will manage these details in the **Properties** page. For detailed information, see [Standard contract for Microsoft commercial marketplace](standard-contract.md).

> [!NOTE]
> After you publish an offer using the standard contract for the commercial marketplace, you cannot use your own custom terms and conditions. It is an "or" scenario. You either offer your solution under the standard contract or your own terms and conditions. If you want to modify the terms of the standard contract you can do so through Standard Contract Amendments.

## Cloud Solution Providers

When creating your offer in Partner Center, you will see the **Resell through CSPs** tab. This option allows partners who are part of the Microsoft Cloud Solution Providers (CSP) program to resell your VM as part of a bundled offer. All Bring-your-own-license (BYOL) plans are automatically opted in to the program. You can also choose to opt in your non-BYOL plans. See [Cloud Solution Provider program](cloud-solution-providers.md) for more information. 

> [!NOTE]
> The Cloud Solution Provider (CSP) partner channel opt-in is now available. For more information about marketing your offer through Microsoft CSP partner channels, see [**Cloud Solution Providers**](./cloud-solution-providers.md).

## Next steps

- [Create a virtual machine offer on Azure Marketplace](azure-vm-create.md)
- [Create a virtual machine using an approved base](azure-vm-create-using-approved-base.md) or [create a virtual machine using your own image](azure-vm-create-using-own-image.md).
- [Offer listing best practices](gtm-offer-listing-best-practices.md)
