---
title: Azure Application offer | Microsoft Docs
description: Overview of the process for publishing an Azure Application offer on the Azure Marketplace.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: dan-wesley
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 12/06/2018
ms.author: pbutlerm
---

# Azure application offer

<table> <tr> <td>This section explains how to publish a new Azure application offer to the Microsoft <a href="https://azuremarketplace.microsoft.com">Azure Marketplace</a>. </td> <td><img src="./media/azureapp-icon1.png"  alt="Azure application icon" /></td> </tr> </table>

## Benefits

Some of the benefits of listing your applications on a Microsoft marketplace include:

* Reaching 100 million Azure Active Directory users across Office 365 and Dynamics 365.

* Extending your sales team: reach business users worldwide and gain a sales channel that engages end users, helps generate leads, and initiates conversations with new customers across industries.

* Getting actionable insights: we will share insights into how your app is performing on AppSource, what works well, and how to further improve your sales procedures.

## Types of Azure applications

There are two kinds of Azure applications: a managed application and a solution template. Although similar, there are some notable differences.

### Solution template

Solution templates are one of the main ways to publish a solution in the Marketplace. This offer type is used when your solution requires additional deployment and configuration automation beyond a single virtual machine (VM). You can automate providing of more than one VM using a solution template. This includes provisioning of networking and storage resources to provide complex IaaS solutions. For an overview of solution template requirements and the billing model, see [Azure Applications: solution templates](https://docs.microsoft.com/azure/marketplace/marketplace-solution-templates).

### Managed application

A managed application is similar to a solution template in the Marketplace, with one key difference. In a managed application, the resources are deployed to a resource group that's managed by the publisher of the app. The resource group is present in the consumer's subscription, but an identity in the publisher's tenant has access to the resource group. As the publisher, you specify the cost for ongoing support of the solution. Use Azure Managed applications to easily build and deliver fully managed, turnkey applications to your customers.

In addition to the Marketplace, you can also offer managed applications in a service catalog. The service catalog is an internal catalog of approved solutions for users in an organization. You use the catalog to meet organizational standards while offering solutions for groups in an organization. Employees use the catalog to easily find applications that are recommended and approved by their IT departments.

For more information about the advantages and types of managed applications, see the [Azure managed applications overview](https://docs.microsoft.com/azure/managed-applications/overview).

## Publishing overview

The following video, [Building Solution Templates, and Managed Applications for the Azure Marketplace](https://channel9.msdn.com/Events/Build/2018/BRK3603), is an overview on how to author an Azure Resource Manager template to define an
Azure application solution and then how to subsequently publish the app offer to the Azure Marketplace.

>[!VIDEO https://channel9.msdn.com/Events/Build/2018/BRK3603/player]

## Publishing process workflow

The following diagram shows the high-level process for publishing an Azure application offer.

![Workflow for publishing offer](./media/new-offer-process.png)

## Offer components

This section outlines the elements of publishing a managed application offer and is intended as a guide for the publisher to the Azure Marketplace. Publishing's divided into the following main parts: 

* [Prerequisites](./cpp-prerequisites.md) - Lists the technical and business requirements before creating or publishing a managed application offer. 
* [Create the offer](./cpp-create-offer.md) - Gives the steps required to create a managed application offer entry using the Cloud Partner Portal. 
* [Publish the offer](./cpp-publish-offer.md)- Describes how to submit the offer for publishing to the Azure Marketplace.

## Steps in the publishing process

The high-level steps for publishing an Azure application offer are:

1. Create the offer - Provide detailed information about the offer. This information includes: the offer description, marketing materials, support information, and asset specifications.

2. Create the business and technical assets - Create the business assets (legal documents and marketing materials) and technical assets for the associated solution.

3. Create the SKU - Create the SKU(s) associated with the offer. A unique SKU is required for each image you're planning to publish.

4. Certify and publish the offer - After the offer and the technical assets are completed, you can submit the offer. This submission starts the publishing process. During this process, the solution is tested, validated, certified, then "goes live" on the Azure Marketplace.

## Next steps

Before you consider these steps, you must meet the [technical and business requirements](./cpp-prerequisites.md) for publishing a managed application to the Microsoft Azure Marketplace.