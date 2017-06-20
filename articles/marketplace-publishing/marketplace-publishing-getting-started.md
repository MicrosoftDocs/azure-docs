---
title: Overview of how to create and deploy an offer to the Marketplace | Microsoft Docs
description: Understand the steps required to become an approved Microsoft Developer and create and deploy a virtual machine image, template, data service, or developer service in the Azure Marketplace
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
# How to publish and manage an offer in the Azure Marketplace
This article is provided to help a developer create,  deploy, and manage their solutions listed in the Azure Marketplace for other Azure customers and partners to purchase and utilize.

## What is the Azure Marketplace?
As an Azure publisher, the Azure Marketplace is how you can distribute and sell your innovative solution or service to other developers, ISVs, and IT professionals who want to quickly develop their cloud-based applications and mobile solutions. If your solution targets business users, then you may want to consider the [AppSource](http://appsource.microsoft.com) marketplace.


## Supported types of solutions
The first thing you would want to do as a publisher is to define what kind of solution your company is offering. The Azure Marketplace supports the following types of offers:

|Solution Type|Virtual Machine|Solution Template|
|---|---|---|
|Definition|Pre-configured images with a fully installed operating system and one or more applications. A virtual machine image provides the information necessary to create and deploy virtual machines in the Azure Virtual Machines service.|A data structure that can reference one or more distinct Azure services, including services published by other sellers, to enable Azure subscribers to deploy one or more offerings in a single, coordinated manner.|
|Example|**For example,** as an Azure publisher, you've created and validated a VM with an innovative database service that's compelling enough such that other Azure subscribers would be willing to procure and deploy this VM into their cloud service environments.|**For example,** as an Azure publisher, you've bundled a set of services from across Azure that make it quick to deploy cloud services with load balancing, enhanced security and high availability. Other Azure subscribers can save time by procuring the solution template that meets their objective rather manually locating, procuring, deploying and configuring the same or similar Azure services.|

> [!NOTE]
> Please note some steps are shared between the different types of solutions and others are distinct to the respective type of solution. This article provides a short overview of what steps you will need to complete for any type of solution.

## How to publish a solution
![draw](media/marketplace-publishing-getting-started/img01.png)

### 1. Nominate your solution for pre-approval
- Complete the solution nomination form for **Microsoft Azure Certified for Virtual Machines** [here](https://createopportunity.azurewebsites.net)

>[!NOTE]
> If you are working with a Partner Account Manager or a DX Partner Manager, please ask them to nominate your solution for the Azure Certified program OR go to the [Microsoft Azure Certified](http://createopportunity.azurewebsites.net) webpage, fill out the application form and enter the email of your Partner Account Manager or DX Partner Manager in the Microsoft Sponsor Contact field.

If the eligibility criteria is met per the [Azure Marketplace participation policies](http://go.microsoft.com/fwlink/?LinkID=526833) and your application is approved, we will start working with you to onboard your solution to the Azure Marketplace.

### 2. Register your account as a Microsoft seller
- [Register your Microsoft account as a Microsoft Developer account](marketplace-publishing-accounts-creation-registration.md)

### 3. Publish your solution
1. Fulfill non-technical requirements
  - [Fulfill non-technical pre-requisites](marketplace-publishing-pre-requisites.md)
  - [VM technical pre-requisites](marketplace-publishing-vm-image-creation-prerequisites.md)
  - [Solution Template technical pre-requisites](marketplace-publishing-solution-template-creation-prerequisites.md)
2. Create your offer
  - [Virtual machine](marketplace-publishing-vm-image-creation.md)
  - [Solution Template](marketplace-publishing-solution-template-creation.md)
3. [Create your offer marketing content](marketplace-publishing-push-to-staging.md)
4. Test your offer in staging
  - [Test your VM offer in staging](marketplace-publishing-vm-image-test-in-staging.md)
  - [Test your Solution Template offer in staging](marketplace-publishing-solution-template-test-in-staging.md)
5. [Deploy your offer to the Azure Marketplace](marketplace-publishing-push-to-production.md)


### Virtual Machine Image specific
* [Creating a VM image on-premises](marketplace-publishing-vm-image-creation-on-premise.md)
* [Create a virtual machine running Windows in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Create a virtual machine running Linux in the Azure portal](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Troubleshooting common issues encountered during VHD creation](marketplace-publishing-vm-image-creation-troubleshooting.md)

## How to manage your solution
* [Post-production guide for virtual machine offers](marketplace-publishing-vm-image-post-publishing.md)
* [How to update the non-technical details of an offer or a SKU](marketplace-publishing-vm-image-post-publishing.md#2-how-to-update-the-non-technical-details-of-an-offer-or-a-sku)
* [How to update the technical details of an offer or a SKU](marketplace-publishing-vm-image-post-publishing.md#1-how-to-update-the-technical-details-of-a-sku)
* [How to add a new SKU under a listed offer](marketplace-publishing-vm-image-post-publishing.md#3-how-to-add-a-new-sku-under-a-listed-offer)
* [How to change the data disk count for a listed SKU](marketplace-publishing-vm-image-post-publishing.md#4-how-to-change-the-data-disk-count-for-a-listed-sku)
* [How to delete a listed offer from the Azure Marketplace](marketplace-publishing-vm-image-post-publishing.md)
* [How to delete a listed SKU from the Azure Marketplace](marketplace-publishing-vm-image-post-publishing.md#6-how-to-delete-a-listed-sku-from-the-azure-marketplace)
* [How to delete the current version of a listed SKU from the Azure Marketplace](marketplace-publishing-vm-image-post-publishing.md#7-how-to-delete-the-current-version-of-a-listed-sku-from-the-azure-marketplace)
* [How to revert listing price to production values](marketplace-publishing-vm-image-post-publishing.md#8-how-to-revert-listing-price-to-production-values)
* [How to revert billing model to production values](marketplace-publishing-vm-image-post-publishing.md#9-how-to-revert-billing-model-to-production-values)
* [How to revert visibility setting of a listed SKU to the production value](marketplace-publishing-vm-image-post-publishing.md#10-how-to-revert-visibility-setting-of-a-listed-sku-to-the-production-value)
* [How to change your Cloud Solution Provider reseller incentive](marketplace-publishing-csp-incentive.md)
* [Understanding your payout reporting](marketplace-publishing-report-payout.md)
* [Get support as a publisher](marketplace-publishing-get-publisher-support.md)

## Additional Resources
* [Setting up Azure PowerShell](marketplace-publishing-powershell-setup.md)
