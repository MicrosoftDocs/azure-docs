---
title: Azure Application offer | Azure Marketplace
description: Overview of the process for publishing an Azure Application offer on the Azure Marketplace.
services: Azure, Marketplace, Cloud Partner Portal, 
author: dan-wesley
ms.service: marketplace
ms.topic: conceptual
ms.date: 02/06/2019
ms.author: pabutler
---

# Azure application offer

|    |    |
|-----------------------------------------------------------------|------------------------------------------|
| <div class="body"> This section explains how to publish a new Azure application offer to the [Azure Marketplace](https://azuremarketplace.microsoft.com).  Each Azure application contains an Azure Resource Manager template that defines all the technical assets used by the application, which typically includes one or more virtual machines and other supporting Azure- or Web-based services. All Azure app offers must enable access security through [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/).  </div> | ![Azure apps icon](./media/azureapp-icon1.png)  |

## Publishing overview

The following video, [Building Solution Templates, and Managed Applications for the Azure Marketplace](https://channel9.msdn.com/Events/Build/2018/BRK3603), is an introduction: what offer types are available, what technical assets are required, how to author an Azure Resource Manager template, developing and testing the app UI, how to publish the app offer, and the app review process.

>[!VIDEO https://channel9.msdn.com/Events/Build/2018/BRK3603/player]


## Types of Azure applications

There are two kinds of Azure applications: managed applications and solution templates. 

- Solution templates are one of the main ways to publish a solution in the Marketplace. This offer type is used when your solution requires additional deployment and configuration automation beyond a single virtual machine (VM). You can automate providing of more than one VM using a solution template. This automation includes provisioning of networking and storage resources to provide complex IaaS solutions. For an overview of solution template requirements and the billing model, see [Azure Applications: solution templates](https://docs.microsoft.com/azure/marketplace/marketplace-solution-templates).

- Managed applications are similar to solution templates, with one key difference. In a managed application, the resources are deployed to a resource group that's managed by the publisher of the app. The resource group is present in the consumer's subscription, but an identity in the publisher's tenant has access to the resource group. As the publisher, you specify the cost for ongoing support of the solution. Use Azure Managed applications to easily build and deliver fully managed, turnkey applications to your customers.

In addition to the Azure Marketplace, you can also offer managed applications in a service catalog. The service catalog is an internal catalog of approved solutions for users in an organization. You use the catalog to meet organizational standards while offering solutions for groups in an organization. Employees use the catalog to easily find applications that are recommended and approved by their IT departments.

>[!Note]
>Cloud Solution Providers (CSP) partner channel opt-in is now available.  Please see [Cloud Solution Providers](../../cloud-solution-providers.md) for more information on marketing your offer through the Microsoft CSP partner channels.

For more information about the advantages and types of managed applications, see the [Azure managed applications overview](https://docs.microsoft.com/azure/managed-applications/overview).


## Publishing process workflow

The following diagram shows the high-level process for publishing an Azure application offer.

![Workflow for publishing offer](./media/new-offer-process.png)

The high-level steps for publishing an Azure application offer are:

1. Meet the [Prerequisites](./cpp-prerequisites.md) - (Not shown) Verify that you have met the business and technical requirements for publishing an Azure app to the Azure Marketplace. 

1. [Create the offer](./cpp-create-offer.md) - Provide detailed information about the offer. This information includes: the offer description, marketing materials, support information, and asset specifications.

1. [Create or collect existing business and technical assets](./cpp-create-technical-assets.md) - Create the business assets (legal documents and marketing materials) and technical assets for the associated solution.

1. [Create the SKU](./cpp-skus-tab.md) - Create the SKU(s) associated with the offer. A unique SKU is required for each image you're planning to publish.

1. Certify and [publish the offer](./cpp-publish-offer.md) - After the offer and the technical assets are completed, you can submit the offer. This submission starts the publishing process. During this process, the solution is tested, validated, certified, then "goes live" on the Azure Marketplace.

## Next steps

Before you consider these steps, you must meet the [technical and business requirements](./cpp-prerequisites.md) for publishing a managed application to the Microsoft Azure Marketplace.
