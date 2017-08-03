---
title: Azure Managed Application in Marketplace | Microsoft Docs
description: Describes Azure Managed Application that are available through the Marketplace.
services: azure-resource-manager
author: ravbhatnagar
manager: rjmax


ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 07/09/2017
ms.author: gauravbh; tomfitz
---

# Azure managed applications in the Marketplace

As discussed in the [Managed Application overview](managed-application-overview.md) article, managed applications in the Microsoft Azure Marketplace enable MSPs, ISVs, and System Integrators (SIs) to offer their solutions to all Azure customers. Such solutions reduce the maintenance and servicing overhead for customers. Publishers can sell infrastructure and software through the Marketplace, and attach services and operational support to them. 

This article explains how an MSP, ISV, or SI can publish an application to the Marketplace and make it broadly available to the customers.  

## Pre-requisites for publishing a managed application

Prerequisites to listing on the Marketplace

* Technical

    *  For information about the basic structure and syntax of Resource Manager templates, see [Author Azure Resource Manager templates](resource-group-authoring-templates.md).
    *  To view complete template solutions, see [Azure Quickstart Templates](https://azure.microsoft.com/en-us/documentation/templates/) or the [Quickstart template repository](https://github.com/azure/azure-quickstart-templates).
    *  For information about creating the interface for customers deploying your application through the marketplace, see [Create user interface definition file](managed-application-createuidefinition-overview.md).

* Non-technical (business requirements)

    *   Your company (or its subsidiary) must be located in a sell from country supported by the Marketplace.
    *   Your product must be licensed in a way that is compatible with billing models supported by the Marketplace.
    *   You are responsible for making technical support available to customers in a commercially reasonable manner. The support can be free, paid, or through community support.
    *   You are responsible for licensing your software and any third-party software dependencies.
    *   You must provide content that meets criteria for your offering to be listed on Azure Marketplace and in the Azure portal
    *   You must agree to the terms of the Azure Marketplace Participation Policies and Publisher Agreement.
    *   You must agree to comply with the Terms of Use, Microsoft Privacy Statement, and Microsoft Azure Certified Program Agreement.

## How to create a new Azure Application offer

After you have met the pre-requisites, you are ready to start authoring your managed application offer. Let's take a quick overview of an offer and SKU.

### Offer

The offer for a managed application corresponds to a class of product offering from a publisher. If you have a new type of solution/application that you would like to make available in the Marketplace, you can set it up as a new offer. An offer is a collection of SKUs. Every offer appears as its own entity in the Marketplace.

### SKU

A SKU is the smallest purchasable unit of an offer. While within the same product class (offer), SKUs allow you to differentiate between different features supported, whether the offer is managed or unmanaged and billing models supported.

A SKU shows up under the parent offer in the Marketplace. It shows up as its own purchasable entity in the Azure portal.

### Set up offer

1.  Log in to the [Cloud Partner Portal](https://cloudpartner.azure.com/).
2.  From the left navigation bar, click on **+ New offer** and select **Azure Applications**.

	![new offer](./media/managed-application-author-marketplace/newOffer.png)

3.  A new offer **Editor** view is now opened for you, and you are ready to start authoring.

	![offer settings](./media/managed-application-author-marketplace/newOffer_OfferSettings.png)

4.  The forms that need to be filled out are visible on the left within the **Editor** view. Each form consists of a set of fields that are to be filled out. Required fields are marked with a red asterisk (*).

 **There are four main forms for authoring a Managed Application**

    *   Offer Settings
    *   SKUs
    *   Marketplace
    *   Support

These forms are described in greater detail in the following sections.

## Offer Settings form

The offer settings form is a basic form to specify the offer settings. The different fields are:

* Offer ID - This field is a unique identifier for the offer within a publisher profile. This ID is visible in product URLs, Resource Manager templates, and billing reports. It can only be composed of lowercase alphanumeric characters or dashes (-). The ID cannot end in a dash and can have a maximum of 50 characters. This field is locked once an offer goes live.
* Publisher ID - This field dropdown allows you to choose the publisher profile you want to publish this offer under. This field is locked once an offer goes live.
* Name - This field is the display name for your offer. It is the name that shows up in the Marketplace and in the portal. It can have a maximum of 50 characters. Guidance here is to include a recognizable brand name for your product. Don't include your company name here unless that is how it is marketed. If you are marketing this offer at your own website, ensure that the name is exactly how it shows up in your website.

Select **Save** to save your progress. The next step is to add SKUs for your offer.

## SKUs form

Select the **SKUs** form. Here you can see an option to **New SKU**. Selecting this option allows you to enter a **SKU ID**.

![select new SKU](./media/managed-application-author-marketplace/newOffer_skus.png)

**SKU ID** is a unique identifier for the SKU within an offer. This ID is visible in product URLs, Resource Manager templates, and billing reports. It can only be composed of lowercase alphanumeric characters or dashes (-). The ID cannot end in a dash and can have a maximum of 50 characters. This field is locked once an offer goes live. You can have multiple SKUs within an offer. You need a SKU for each image you are planning to publish.

After selecting **New SKU**, you need to fill the following form:

![provide new SKU](./media/managed-application-author-marketplace/newOffer_newsku.png)

### How to fill SKU details section

* Title - Provide a title for this SKU. This is what shows up in the gallery for this item.
* Summary - Provide a short summary for this sku. This text shows up right under the title.
* Description - Provide a detailed description about the SKU.
* SKU Type - The allowed values are **Managed Application** and **Solution Templates**. For this case, select **Managed Application**.

### How to fill package details section

The package section has the following fields that need to be filled out

![package](./media/managed-application-author-marketplace/newOffer_newsku_package.png)

**Current version** - Provide a version for the package you upload. It should be in the format - `{number}.{number}.{number}{number}`

**Package File** - This package contains the following files that are compressed into a .zip file.

* **applianceMainTemplate.json** - The deployment template file that is used to deploy the solution/application. You can find more details on how to author deployment template files here - [Create your first Azure Resource Manager template](resource-manager-create-first-template.md)
* **appliancecreateUIDefinition.json** - This file is used by the Azure portal to generate the user interface for provisioning this solution/application. For more information, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
* **mainTemplate.json** - The template file that contains only the Microsoft.Solution/appliances resource. The key properties of this resource to be aware of are as follows:

The mainTemplate includes the following properties:

*  kind - Use **Marketplace** for managed applications in the Marketplace
*  ManagedResourceGroupId - The resource group in the customer's subscription where all the resources defined in the applianceMainTemplate.json are deployed.
*  PublisherPackageId - The string that uniquely identifies the package. Provide the value in the format of `{publisherId}.{OfferId}.{SKUID}.{PackageVersion}`.
  The publisherId and OfferId could be obtained from the publishing portal.

  ![offer id](./media/managed-application-author-marketplace/UniqueString_pubid_offerid.png)
		
  The SKU ID can be obtained as shown in the following image:

  ![SKU id](./media/managed-application-author-marketplace/UniqueString_skuid.png)
		
  The package version can be obtained as shown in the following image:

  ![package version](./media/managed-application-author-marketplace/UniqueString_packageversion.png)
	
  So using the preceding examples, the value of **PublisherPackageId** is `azureappliance-test.ravmanagedapptest.ravpreviewmanagedsku.1.0.0`

  Sample mainTemplate.json:

  ```json
  {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  	"contentVersion": "1.0.0.0",
  	"parameters": {
	  "storageAccountNamePrefix": {
  	    "type": "string",
  		"metadata": {
		  "description": "Specify the name of the storage account"
  		}
	  },
	  "storageAccountType": {
  	    "type": "string"
	  }
  	},
  	"variables": {
	  "managedResourceGroup": "[concat(resourceGroup().id,uniquestring(resourceGroup().id))]"
  	},
  	"resources": [{
  	  "type": "Microsoft.Solutions/appliances",
  	  "apiVersion": "2016-09-01-preview",
  	  "name": "[concat(parameters('storageAccountNamePrefix'), '-', 'managed')]",
  	  "location": "[resourceGroup().location]",
  	  "kind": "marketplace",
  	  "properties": {
	    "managedResourceGroupId": "[variables('managedResourceGroup')]",
		"PublisherPackageId":"azureappliancetest.ravmanagedapptest.ravpreviewmanagedsku.1.0.0",
		"parameters": {
  		  "storageAccountName": {
		    "value": "[parameters('storageAccountNamePrefix')]"
  		  },
  		  "storageAccountType": {
		    "value": "[parameters('storageAccountType')]"
 	 	  }
		}
  	  }
	}],
  	"outputs": {

  	}
  }
  ```

This package should contain any other nested templates or scripts that are required to successfully provision this application. The mainTemplate.json, applianceMainTemplate.json, and applianceCreateUIDefinition.json must be present at the root folder.

**Authorizations** - This property defines who gets access what level of access to the resources in customers subscriptions. It enables the publisher to manage the application on behalf of the customer.

* PrincipalId - This property is the Azure Active directory identifier of a user, user group, or application that is granted certain permissions (as described by the Role Definition) on the resources in the customers subscription.
* Role Definition - This property is a list of all the built-in RBAC roles provided by Azure AD. You can select the role that is most appropriate and allows you to manage the resources on behalf of the customer.

Multiple authorizations can be added. However, it is recommended to create an Active directory user group and specify its Id in the **PrincipalId**. It enables addition of more users to the user group and required without having to update the SKU.

For more information about RBAC, see [Get started with Role-Based Access Control in the Azure portal](../active-directory/role-based-access-control-what-is.md).

## Marketplace form

The Marketplace form asks for fields that show up on the [Azure Marketplace](https://azuremarketplace.microsoft.com) and on the [Azure portal](https://portal.azure.com/).

### Preview subscription IDs

Enter here a list of Azure Subscription IDs that you would like to have access to the offer once it's published. These white-listed subscriptions allow you to test the previewed offer before making it live. The partner portal allows you to white-list upto 100 subscriptions.

### Suggested categories

Select up to five categories from the provided list that your offer can be best associated with. The selected categories are used to map your offer to the product categories available in the [Azure Marketplace](https://azuremarketplace.microsoft.com) and the [portal](https://portal.azure.com/).

#### Azure Marketplace

In the summary of your managed application, the following fields are displayed:

![marketplace summary](./media/managed-application-author-marketplace/publishvm10.png)

In the overview for your managed application, the following fields are displayed:

![marketplace overview](./media/managed-application-author-marketplace/publishvm11.png)

In the plans and pricing for your managed application, the following fields are displayed:

![marketplace plans](./media/managed-application-author-marketplace/publishvm15.png)

#### Azure portal

In the summary of your managed application, the following fields are displayed:

![portal summary](./media/managed-application-author-marketplace/publishvm12.png)

In the overview for your managed application, the following fields are displayed:

![portal overview](./media/managed-application-author-marketplace/publishvm13.png)

#### Logo guidelines

Use the following guidelines for all the logos uploaded in the Cloud Partner Portal:

*   The Azure design has a simple color palette. Keep the number of primary and secondary colors on your logo low.
*   The theme colors of the portal are white and black. Hence avoid using these colors as the background color of your logos. Use some color that would make your logos prominent in the portal. We recommend simple primary colors. **If you are using transparent background, then make sure that the logos/text are not white or black or blue.**
*   Do not use a gradient background on the logo.
*   Avoid placing text, even your company or brand name, on the logo. The look and feel of your logo should be 'flat' and should avoid gradients.
*   Make sure the logo is not stretched.

#### Hero logo

The Hero logo is optional. The publisher can choose not to upload a Hero logo. However once uploaded the hero icon cannot be deleted. At that time, the partner must follow the Marketplace guidelines for Hero icons.

##### Guidelines for the hero logo icon

*   The Publisher Display Name, plan title and the offer long summary are displayed in white font color. Hence you should avoid keeping any light color in the background of the Hero Icon. Black, white, and transparent background is not allowed for Hero icons.
*   The publisher display name, plan title, the offer long summary and the create button are embedded programmatically inside the Hero logo once the offer goes listed. So you should not enter any text while you are designing the Hero logo. Just leave empty space on the right because the text (that is, publisher display name, plan title, the offer long summary) is included programmatically by us over there. The empty space for the text should be 415x100 on the right (and it is offset by 370 px from the left).

![publishvm14](./media/managed-application-author-marketplace/publishvm14.png)

## Support form

The next form to fill out is the support form. This form asks for support contacts from your company like engineering contact information and customer support contact information.

## How to publish an offer

After completing all sections, select **Publish** to start the process of making your offer available to customers.

## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](managed-application-overview.md).
* For information about consuming a managed application from the Marketplace, see [Consume Azure managed applications in the Marketplace](managed-application-consume-marketplace.md).
* For information about publishing a Service Catalog managed application, see [Create and publish Service Catalog managed application](managed-application-publishing.md).
* For information about consuming Service Catalog managed application, see [Consume a Service Catalog managed application](managed-application-consumption.md).
