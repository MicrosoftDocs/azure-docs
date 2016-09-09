<properties
   pageTitle="Overview of how to create and deploy an offer to the Marketplace | Microsoft Azure"
   description="Understand the steps required to become an approved Microsoft Developer and create and deploy a virtual machine image, template, data service, or developer service in the Azure Marketplace"
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/05/2016"
   ms.author="hascipio" />

# How to publish and manage an offer in the Azure Marketplace
This article is provided to help a developer create,  deploy, and manage their solutions listed in the Azure Marketplace for other Azure customers and partners to purchase and utilize.

The first thing you would want to do as a publisher is to define what kind of solution your company is offering. The Azure Marketplace supports multiple solutions, and each of them requires a slightly different set of work from you in order to successfully publish into the Marketplace.

## Types of Offers
|Offer Type| Definition |
|---|---|
|Virtual Machine Image | Pre-configured virtual machine (VM) image with a fully installed operating system and one or more applications. Virtual Machine Image offerings may include a single VM image or multiple VM images tied together by a Solution Template. A virtual machine image ("Image") provides the information necessary to create and deploy virtual machines in the Azure Virtual Machines service. An Image comprises of an operating system virtual hard drive and zero or more data disk virtual hard drives. Customers can deploy an number of virtual machines from a single image.|
|Developer Service| Fully managed service for information workers, business analysts, developers or IT professionals to use in customer application developer or system management. Developer Services provide functionality to enable customers to quickly develop cloud scale applications on Azure. Customers must have an Azure subscription to purchase Developer Services. Publishers are responsible for metering customers' usage of Developers Services and for reporting usage information to Microsoft, as detailed in the Microsoft Azure Marketplace Publisher Agreement.|
|Solution Template|An "Azure Resource Manager (ARM) Solution Template" is a data structure that can reference one or more distinct offerings, including offerings published by other publishers, to enable Azure customers to deploy one or more offerings in a single, coordinated fashion.|

Some steps are shared between the different types of solutions. This article provides a short overview of what steps you will need to complete for any type of solution.

## 1. Pre-requisites

> [AZURE.NOTE] Before you begin any work on the Azure Marketplace, you must be pre-approved. This is not applicable for data service publishers.

1. [Apply for Microsoft Azure Certified Pre-approval](marketplace-publishing-azure-certification.md)
2. [Create and register a Microsoft Developer account](marketplace-publishing-accounts-creation-registration.md)
3. [Fulfill non-technical pre-requisites](marketplace-publishing-pre-requisites.md)

## 2. Publishing your offer
### 2.1 Complete offer specific technical pre-requisites
- [VM technical pre-requisites](marketplace-publishing-vm-image-creation-prerequisites.md)
- [Solution Template technical pre-requisites](marketplace-publishing-solution-template-creation-prerequisites.md)

### 2.2 Create your offer
1. Create your offer using the offer specific guides below.
    - [Create your VM offer](marketplace-publishing-vm-image-creation.md)
    - [Create your Solution Template offer](marketplace-publishing-solution-template-creation.md)
2. [Create your offer marketing content](marketplace-publishing-push-to-staging.md)

### 2.3 Test your offer in staging
- [Test your VM offer in staging](marketplace-publishing-vm-image-test-in-staging.md)
- [Test your Solution Template offer in staging](marketplace-publishing-solution-template-test-in-staging.md)

### 2.4 Deploy your offer to the Marketplace
- [Deploy your offer to the Azure Marketplace](marketplace-publishing-push-to-production.md)

### Virtual Machine Image specific ###
- [Creating a VM image on-premises](marketplace-publishing-vm-image-creation-on-premise.md)
- [Create a virtual machine running Windows in the Azure preview portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md)


- [Troubleshooting common publishing problems in the Marketplace](marketplace-publishing-support-common-issues.md)
- To learn more about the portals used, see [Portals you will need](marketplace-publishing-portals.md).


## 3. Post-Publishing management of your offer
- [Post-production guide for virtual machine offers](marketplace-publishing-vm-image-post-publishing.md)
- [How to update the non-technical details of an offer or a SKU](marketplace-publishing-vm-image-post-publishing.md#2-how-to-update-the-non-technical-details-of-an-offer-or-a-sku)
- [How to delete an offer or SKU from the Azure Marketplace](marketplace-publishing-vm-image-post-publishing.md#4-how-to-delete-a-live-offer-or-sku-from-the-azure-marketplace)
- [How to change your Cloud Solution Provider reseller incentive](marketplace-publishing-csp-incentive.md)
- [Understanding your seller insights reporting](marketplace-publishing-report-seller-insights.md)
- [Understanding your payout reporting](marketplace-publishing-report-payout.md)
- [Get support as a publisher](marketplace-publishing-get-publisher-support.md)

## Additional Resources
- [Setting up Azure PowerShell](marketplace-publishing-powershell-setup.md)
