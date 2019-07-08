---
title: Azure Application offer prerequisites | Azure Marketplace 
description: The prerequisites for publishing an Azure application offer on the Azure Marketplace.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 03/13/2019
ms.author: pabutler
---

# Azure application prerequisites

This article describes the technical and business prerequisites for publishing a managed application offer on the Azure Marketplace.  If you have not already done so, review the following sources of information:
- Depending upon your SKU type, either [Azure Applications: Solution Template Offer Publishing Guide](../../marketplace-solution-templates.md) or [Azure Applications: Managed Application Offer Publishing Guide](../../marketplace-managed-apps.md)
- [Building Solution Templates, and Managed Applications for the Azure Marketplace](https://channel9.msdn.com/Events/Build/2018/BRK3603) video


## Technical requirements

The technical requirements include the following items:

*	Azure Resource Manager templates 
For more information, see  [Understand the structure and syntax of Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates). This article describes the structure of an Azure Resource Manager template. It presents the different sections of a template and the properties that are available in those sections. The template consists of JSON and expressions that you can use to construct values for your deployment. 
* Azure Quickstart templates.<br> 
For more information, see:

  * [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/). Deploy Azure resources through the Azure Resource Manager with community contributed templates to get more done. Azure Resource Manager allows you to provision your applications using a declarative template. In a single template, you can deploy multiple services along with their dependencies. You use the same template to repeatedly deploy your application during every stage of the application lifecycle.
  * [GitHub: Azure Resource Manager Quickstart Templates](https://github.com/azure/azure-quickstart-templates). This repo contains all the currently available Azure Resource Manager templates contributed by the community. A searchable template index is maintained at https://azure.microsoft.com/documentation/templates/.
* Create UI Definition<br>
For more information, see [Create Azure portal user interface for your managed application](https://docs.microsoft.com/azure/azure-resource-manager/managed-application-createuidefinition-overview). This article introduces the core concepts of the createUiDefinition.json file. The Azure portal uses this file to generate the user interface for creating a managed application.


## Business requirements

The business requirements include the following procedural, contractual, and legal obligations:

* You must be a registered Cloud Marketplace Publisher. If you’re not registered, follow the steps in the article [Become a Cloud Marketplace Publisher](https://docs.microsoft.com/azure/marketplace/become-publisher
).

>[!NOTE]
>You should use the same Microsoft Developer Center registration account to sign in to the Cloud Partner Portal. You should have only one Microsoft account for your Azure Marketplace offerings. This account shouldn’t be specific to individual services or offers.

* Your company (or its subsidiary) must be in a sell-from-country/region supported by the Azure Marketplace. For a current list of these countries/regions, see [Microsoft Azure Marketplace Participation Policies](https://azure.microsoft.com/support/legal/marketplace/participation-policies/).
* Your product must be licensed in a way that’s compatible with billing models supported by the Azure Marketplace. For more information, see [billing options](https://docs.microsoft.com/azure/marketplace/marketplace-commercial-transaction-capabilities-and-considerations) in the Azure Marketplace.
* You’re responsible for making technical support available to customers in a commercially reasonable manner. This support can be free, paid, or through community approaches.
* You’re responsible for licensing your software and any third-party software dependencies.
* You must provide content that meets criteria for your offering to be listed on Azure Marketplace and in the Azure portal.
* You must agree to the terms of the Microsoft Azure Marketplace Participation Policies and Publisher Agreement.
* You must comply with the Microsoft Azure Website Terms of Use, Microsoft Privacy Statement, and Microsoft Azure Certified Program Agreement.


## Publishing requirements

To publish a new Azure application offer, you must meet the following prerequisites:

* Have your metadata ready to use. The following list (non-exhaustive) shows an example of this metadata:
  * A title
  * A description (in HTML format)
  * A logo image (in PNG format) and in these fixed image sizes: 40 x 40 pixels, 90 x 90 pixels, 115 x 115 pixels, and 255 x 115 pixels.
* A *Terms of Use* and a *Privacy Policy* documents
* Application documentation
* Support contacts


## Next steps

Once you've met all the requirements, you'll be ready to [create an Azure application offer](./cpp-create-offer.md). 
 
