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
   ms.date="08/22/2016"
   ms.author="hascipio" />

# How to publish and manage an offer in the Azure Marketplace
This article is provided to help a developer create,  deploy, and manage their solutions listed in the Azure Marketplace for other Azure customers and partners to purchase and utilize.

## What is the Azure Marketplace?
The Azure Marketplace is where an Azure subscriber can find services to facilitate the development of on-premise or cloud based solutions and applications. And use [Azure Certified](http://azure.com/certified) services as building blocks to rapidly develop an innovative application or service for your line of business and other Azure subscribers.

As an Azure publisher, the Azure Marketplace is how you can distribute and sell your innovative solution or service to other developers, ISVs, and IT professionals who want to quickly develop their cloud-based applications and mobile solutions.

## Supported Types of Offers
The first thing you would want to do as a publisher is to define what kind of solution your company is offering. The Azure Marketplace supports three types of offers:

- **Virtual Machine images** are pre-configured images with a fully installed operating system and one or more applications. A virtual machine image provides the information necessary to create and deploy virtual machines in the Azure Virtual Machines service.

    >[AZURE.NOTE] **For example,** as an Azure publisher, you've created and validated a VM with an innovative database service that's compelling enough such that other Azure subscribers would be willing to procure and deploy this VM into their cloud service environments.

- **Developer Services** are fully managed services to use in application development or system management. They provide functionality that enable rapid development of cloud scale applications on Azure.

    >[AZURE.NOTE] **For example,** as an Azure publisher, you developed an API accessible service (hosted on Azure or elsewhere) that provides predictions based on historical data. And this is a service that other Azure subscribers who are building solutions may want to utilize. You can deploy this service to the Azure Marketplace for other find, procure and user in their respective service.

- **Solution template** is a data structure that can reference one or more distinct Azure services, including services published by other sellers, to enable Azure subscribers to deploy one or more offerings in a single, coordinated manner.

    >[AZURE.NOTE] **For example,** as an Azure publisher, you've bundles a set of services from across Azure that makes it quick to deploy a secure, high availability cloud service with load balancing in a few clicks. Other Azure subscribers could fine value in saving time by procuring this solution template rather manually identifying and configuring the same or similar Azure services.

Some steps are shared between the different types of solutions. This article provides a short overview of what steps you will need to complete for any type of solution.

## 1. Pre-requisites

> [AZURE.NOTE] Before you begin any work on the Azure Marketplace, you must be [pre-approved](http://azure.com/certified).

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
- [How to update the technical details of an offer or a SKU](marketplace-publishing-vm-image-post-publishing.md#1-how-to-update-the-technical-details-of-a-sku)
- [How to add a new SKU under a listed offer](marketplace-publishing-vm-image-post-publishing.md#3-how-to-add-a-new-sku-under-a-listed-offer)
- [How to change the data disk count for a listed SKU](marketplace-publishing-vm-image-post-publishing.md#4-how-to-change-the-data-disk-count-for-a-listed-sku)
- [How to delete a listed offer from the Azure Marketplace](marketplace-publishing-vm-image-post-publishing.md#5-how-to-delete-a-listed-offer-from-the-azure-marketplace)
- [How to delete a listed SKU from the Azure Marketplace](marketplace-publishing-vm-image-post-publishing.md#6-how-to-delete-a-listed-sku-from-the-azure-marketplace)
- [How to delete the current version of a listed SKU from the Azure Marketplace](marketplace-publishing-vm-image-post-publishing.md#7-how-to-delete-the-current-version-of-a-listed-sku-from-the-azure-marketplace)
- [How to revert listing price to production values](marketplace-publishing-vm-image-post-publishing.md#8-how-to-revert-listing-price-to-production-values)
- [How to revert billing model to production values](marketplace-publishing-vm-image-post-publishing.md#9-how-to-revert-billing-model-to-production-values)
- [How to revert visibility setting of a listed SKU to the production value](marketplace-publishing-vm-image-post-publishing.md#10-how-to-revert-visibility-setting-of-a-listed-sku-to-the-production-value)
- [How to change your Cloud Solution Provider reseller incentive](marketplace-publishing-csp-incentive.md)
- [Understanding your seller insights reporting](marketplace-publishing-report-seller-insights.md)
- [Understanding your payout reporting](marketplace-publishing-report-payout.md)
- [Get support as a publisher](marketplace-publishing-get-publisher-support.md)

## Additional Resources
- [Setting up Azure PowerShell](marketplace-publishing-powershell-setup.md)
