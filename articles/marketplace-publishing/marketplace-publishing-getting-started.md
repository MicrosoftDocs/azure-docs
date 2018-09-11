

---
title: Overview of how to create and deploy an offer to the Marketplace | Microsoft Docs
description: Understand the steps required to become an approved Microsoft developer and create and deploy a virtual machine image, template, data service, or developer service in the Azure Marketplace
services: marketplace-publishing
documentationcenter: ''
author: HannibalSII
manager: hascipio
editor: ''

ms.assetid: 5343bd26-c6e4-4589-85b7-4a2c00bba8ab
ms.service: marketplace
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/05/2017
ms.author: hascipio

---
> [!NOTE]
> This documentation is no longer current and is not accurate. Please instead go to the Azure Marketplace [Seller Guide](https://docs.microsoft.com/azure/marketplace/seller-guide/cloud-partner-portal-seller-guide) for guidance on publishing an offer to Azure Marketplace.

# Publish and manage an offer in the Azure Marketplace
This article is provided to help developers create, deploy, and manage their solutions listed in the Azure Marketplace for other Azure customers and partners to purchase and use.

## Marketplace publishing
As an Azure publisher, you can distribute and sell your innovative solution or service to other developers, ISVs, and IT professionals in the Marketplace. Through the Marketplace, you can reach customers who want to quickly develop their cloud-based applications and mobile solutions. If your solution targets business users, you might want to consider the [AppSource](http://appsource.microsoft.com) marketplace.


## Supported types of solutions
The first thing you want to do as a publisher is to define what kind of solution your company is offering. The Marketplace supports the following types of offers:

|Solution type|Virtual machine|Solution template|
|---|---|---|
|**Definition**|Preconfigured images with a fully installed operating system and one or more applications. A virtual machine image provides the information necessary to create and deploy virtual machines in the Azure Virtual Machines service.|A data structure that can reference one or more distinct Azure services, including services published by other sellers. Azure subscribers can use it to deploy one or more offerings in a single, coordinated manner.|
|**Example**|As an Azure publisher, you've created and validated a VM with an innovative database service. Other Azure subscribers want to procure and deploy this VM into their cloud service environments.|As an Azure publisher, you've bundled a set of services from across Azure that make it quick to deploy cloud services with load balancing, enhanced security, and high availability. Other Azure subscribers can save time by procuring the solution template that meets their objective. They don't have to manually locate, procure, deploy, and configure the same or similar Azure services.|

> [!NOTE]
> Some steps are shared between the different types of solutions, and others are distinct to the respective type of solution. This article provides a short overview of the steps you need to complete for any type of solution.

## Publish a solution
![Nominate, register, publish](media/marketplace-publishing-getting-started/img01.png)

### Nominate your solution for pre-approval
To publish a virtual machine [solution](https://createopportunity.azurewebsites.net) to the Marketplace, complete the Microsoft Azure Certified **Solution Nomination Form**.

>[!NOTE]
> If you are working with a Partner Account Manager or a DX Partner Manager, ask them to nominate your solution for the Azure Certified program. You can also go to the [Microsoft Azure Certified](http://createopportunity.azurewebsites.net) webpage and fill out the application form. Enter the email of your Partner Account Manager or DX Partner Manager in the **Microsoft Sponsor Contact** box.

If you meet the eligibility criteria in the [Azure Marketplace participation policies](http://go.microsoft.com/fwlink/?LinkID=526833) and your application is approved, we start working with you to onboard your solution to the Marketplace.

### Register your account as a Microsoft seller
Register your Microsoft account as a [Microsoft Developer account](marketplace-publishing-accounts-creation-registration.md).

### Publish your solution
To publish a solution to the Marketplace, follow these steps:
1. Fulfill the nontechnical requirements.

    a. Fulfill the [nontechnical prerequisites](marketplace-publishing-pre-requisites.md).

    b. Fulfill the [VM technical prerequisites](marketplace-publishing-vm-image-creation-prerequisites.md).

    c. Fulfill the [solution template technical prerequisites](marketplace-publishing-solution-template-creation-prerequisites.md).

2. Create your offer.

    a. Create a [virtual machine](marketplace-publishing-vm-image-creation.md) offer.

    b. Create a [solution template](marketplace-publishing-solution-template-creation.md) offer.

3. Create your offer [marketing content](marketplace-publishing-push-to-staging.md).

4. Test your offer in staging.

    a. Test your VM offer in [staging](marketplace-publishing-vm-image-test-in-staging.md).

    b. Test your solution template offer in [staging](marketplace-publishing-solution-template-test-in-staging.md).

5. Deploy your offer to the [Marketplace](marketplace-publishing-push-to-production.md).


### Create and manage a virtual machine image
Create and manage a VM image by using these resources:
* Create a VM image [on-premises](marketplace-publishing-vm-image-creation-on-premise.md).
* Create a virtual machine running [Windows in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* Create a virtual machine running [Linux in the Azure portal](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* Troubleshoot common issues encountered during [VHD creation](marketplace-publishing-vm-image-creation-troubleshooting.md).

## Manage your solution
Manage your solution with help from the following resources:
* [Read the post-production guide for virtual machine offers](marketplace-publishing-vm-image-post-publishing.md)
* [Update the nontechnical details of an offer or a SKU](marketplace-publishing-vm-image-post-publishing.md#update-the-nontechnical-details-of-an-offer-or-a-sku)
* [Update the technical details of an offer or a SKU](marketplace-publishing-vm-image-post-publishing.md#update-the-technical-details-of-a-sku)
* [Add a new SKU under a listed offer](marketplace-publishing-vm-image-post-publishing.md#add-a-new-sku-under-a-listed-offer)
* [Change the data disk count for a listed SKU](marketplace-publishing-vm-image-post-publishing.md#change-the-data-disk-count-for-a-listed-sku)
* [Delete a listed offer from the Marketplace](marketplace-publishing-vm-image-post-publishing.md)
* [Delete a listed SKU from the Marketplace](marketplace-publishing-vm-image-post-publishing.md#delete-a-listed-sku-from-the-marketplace)
* [Delete the current version of a listed SKU from the Marketplace](marketplace-publishing-vm-image-post-publishing.md#delete-the-current-version-of-a-listed-sku-from-the-marketplace)
* [Revert the listing price to production values](marketplace-publishing-vm-image-post-publishing.md#revert-the-listing-price-to-production-values)
* [Revert the billing model to production values](marketplace-publishing-vm-image-post-publishing.md#revert-the-billing-model-to-production-values)
* [Revert the visibility setting of a listed SKU to the production value](marketplace-publishing-vm-image-post-publishing.md#revert-the-visibility-setting-of-a-listed-sku-to-the-production-value)

## Additional resources
[Set up Azure PowerShell](marketplace-publishing-powershell-setup.md)
