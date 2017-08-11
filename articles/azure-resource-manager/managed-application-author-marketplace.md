---
title: Azure managed applications in the Marketplace | Microsoft Docs
description: Describes Azure managed applications that are available through the Marketplace.
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

 MSPs, ISVs, and system integrators (SIs) can use Azure managed applications to offer their solutions to all Azure Marketplace customers. Such solutions reduce the maintenance and servicing overhead for customers. Publishers can sell infrastructure and software through the Marketplace. They can attach services and operational support to managed applications. For more information, see [Managed application overview](managed-application-overview.md).

This article explains how an MSP, ISV, or SI can publish an application to the Marketplace and make it broadly available to customers.

## Prerequisites for publishing a managed application

Prerequisites to listing in the Marketplace:

* Technical

    *  For information about the basic structure and syntax of Azure Resource Manager templates, see [Azure Resource Manager templates](resource-group-authoring-templates.md).
    *  To view complete template solutions, see [Azure Quickstart templates](https://azure.microsoft.com/en-us/documentation/templates/) or the [Quickstart template repository](https://github.com/azure/azure-quickstart-templates).
    *  For information about how to create the interface for customers who deploy your application through the Marketplace, see [Create a user interface definition file](managed-application-createuidefinition-overview.md).

* Nontechnical (business requirements)

    *   Your company or its subsidiary must be located in a country where sales are supported by the Marketplace.
    *   Your product must be licensed in a way that is compatible with billing models supported by the Marketplace.
    *   You're responsible for making technical support available to customers in a commercially reasonable manner. The support can be free, paid, or through community support.
    *   You're responsible for licensing your software and any third-party software dependencies.
    *   You must provide content that meets criteria for your offering to be listed in the Marketplace and in the Azure portal.
    *   You must agree to the terms of the Azure Marketplace Participation Policies and Publisher Agreement.
    *   You must agree to comply with the Terms of Use, Microsoft Privacy Statement, and Microsoft Azure Certified Program Agreement.

## Create a new Azure application offer

After you meet the prerequisites, you're ready to create your managed application offer. Let's take a quick overview of an offer and a SKU.

### Offer

The offer for a managed application corresponds to a class of product offering from a publisher. If you have a new type of solution/application that you want to make available in the Marketplace, you can set it up as a new offer. An offer is a collection of SKUs. Every offer appears as its own entity in the Marketplace.

### SKU

A SKU is the smallest purchasable unit of an offer. You can use a SKU within the same product class (offer) to differentiate between:

* Different features that are supported.
* Whether the offer is managed or unmanaged.
* Billing models that are supported.

A SKU appears under the parent offer in the Marketplace. It appears as its own purchasable entity in the Azure portal.

### Set up an offer

1. Sign in to the [Cloud Partner portal](https://cloudpartner.azure.com/).

2. In the navigation pane on the left, select **+ New offer** > **Azure Applications**.

	![New offer](./media/managed-application-author-marketplace/newOffer.png)

3. Fill out the forms that appear on the left in the **Editor** view. Required fields are marked with a red asterisk (*).

	![Offer settings](./media/managed-application-author-marketplace/newOffer_OfferSettings.png)

	Four main forms are used to create a managed application:

	a. Offer Settings

	b. SKUs

	c. Marketplace

	d. Support

These forms are described in greater detail in the following sections.

## Offer Settings form
Use this basic form to specify the offer settings.

1. Fill in the **Offer Settings** form. The different fields are:

	a. **Offer ID**: This unique identifier identifies the offer within a publisher profile. This ID is visible in product URLs, Resource Manager templates, and billing reports. It can only be composed of lowercase alphanumeric characters or dashes (-). The ID can't end in a dash. It's limited to a maximum of 50 characters. After an offer goes live, this field is locked.

	b. **Publisher ID**: Use this drop-down list to choose the publisher profile you want to publish this offer under. After an offer goes live, this field is locked.

	c. **Name**: This display name for your offer appears in the Marketplace and in the portal. It can have a maximum of 50 characters. Include a recognizable brand name for your product. Don't include your company name here unless that's how it's marketed. If you're marketing this offer on your own website, ensure that the name is exactly how it appears on your website.

2. Select **Save** to save your progress. 

## SKUs form
The next step is to add SKUs for your offer.

1. Select **SKUs** > **New SKU**. 

	![Select new SKU](./media/managed-application-author-marketplace/newOffer_skus.png)

2. Enter a **SKU ID**. A SKU ID is a unique identifier for the SKU within an offer. This ID is visible in product URLs, Resource Manager templates, and billing reports. It can only be composed of lowercase alphanumeric characters or dashes (-). The ID can't end in a dash, and it's limited to a maximum of 50 characters. After an offer goes live, this field is locked. You can have multiple SKUs within an offer. You need a SKU for each image you plan to publish.

3. Fill out the **SKU Details** section on the following form:

	![Provide new SKU](./media/managed-application-author-marketplace/newOffer_newsku.png)

	Fill out the following fields:
	
	a. **Title**: Enter a title for this SKU. This title appears in the gallery for this item.

	b. **Summary**: Enter a short summary for this SKU. This text appears underneath the title.

	c. **Description**: Enter a detailed description about the SKU.

	d. **SKU Type**: The allowed values are **Managed Application** and **Solution Templates**. For this case, select **Managed Application**.

4. Fill out the **Package Details** section on the following form:

	![Package](./media/managed-application-author-marketplace/newOffer_newsku_package.png)

	Fill out the following fields:

	a. **Current Version**: Enter a version for the package you upload. It should be in the format `{number}.{number}.{number}{number}`.

	b. **Select a package file**: This package contains the following files that are compressed into a .zip file:
	* **applianceMainTemplate.json**: The deployment template file that's used to deploy the solution/application. For information about how to create deployment template files, see [Create your first Azure Resource Manager template](resource-manager-create-first-template.md).
	* **appliancecreateUIDefinition.json**: This file is used by the Azure portal to generate the user interface that's used to provision this solution/application. For more information, see [Get started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
	* **mainTemplate.json**: This template file contains only the Microsoft.Solution/appliances resource. The mainTemplate file includes the following properties:

		*  **kind**: Use **Marketplace** for managed applications in the Marketplace.
		*  **ManagedResourceGroupId**: This resource group in the customer's subscription is where all the resources defined in applianceMainTemplate.json are deployed.
		*  **PublisherPackageId**: This string uniquely identifies the package. Provide the value in the format of `{publisherId}.{OfferId}.{SKUID}.{PackageVersion}`.

Obtain the **Offer ID** and **Publisher ID** from the publishing portal, as shown in the following image:

![Offer ID](./media/managed-application-author-marketplace/UniqueString_pubid_offerid.png)
		
Obtain the **SKU ID**, as shown in the following image:

![SKU ID](./media/managed-application-author-marketplace/UniqueString_skuid.png)
		
Obtain the package **Version**, as shown in the following image:

![Package version](./media/managed-application-author-marketplace/UniqueString_packageversion.png)
	
  Based on the preceding examples, the value of **PublisherPackageId** is `azureappliance-test.ravmanagedapptest.ravpreviewmanagedsku.1.0.0`.

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

This package should contain any other nested templates or scripts that are required to successfully provision this application. The mainTemplate.json, applianceMainTemplate.json, and applianceCreateUIDefinition.json files must be present at the root folder.

* **Authorizations**: This property defines who gets access and the level of access to the resources in customers' subscriptions. The publisher can use it to manage the application on behalf of the customer.
* **PrincipalId**: This property is the Azure Active Directory (Azure AD) identifier of a user, user group, or application that's granted certain permissions on the resources in the customer's subscription. The Role Definition describes the permissions. 
* **Role Definition**: This property is a list of all the built-in Role-Based Access Control (RBAC) roles provided by Azure AD. You can select the role that's most appropriate to use to manage the resources on behalf of the customer.

You can add multiple authorizations. We recommend that you create an AD user group and specify its ID in **PrincipalId**. This way, you can add more users to the user group without the need to update the SKU.

For more information about RBAC, see [Get started with RBAC in the Azure portal](../active-directory/role-based-access-control-what-is.md).

## Marketplace form

The Marketplace form asks for fields that show up on the [Azure Marketplace](https://azuremarketplace.microsoft.com) and on the [Azure portal](https://portal.azure.com/).

### Preview subscription IDs

Enter a list of Azure subscription IDs that can access the offer after it's published. You can use these white-listed subscriptions to test the previewed offer before you make it live. You can compile a white list of up to 100 subscriptions in the partner portal.

### Suggested categories

Select up to five categories from the list that your offer can be best associated with. These categories are used to map your offer to the product categories that are available in the [Azure Marketplace](https://azuremarketplace.microsoft.com) and the [Azure portal](https://portal.azure.com/).

#### Azure Marketplace

The summary of your managed application displays the following fields:

![Marketplace summary](./media/managed-application-author-marketplace/publishvm10.png)

The **Overview** tab for your managed application displays the following fields:

![Marketplace overview](./media/managed-application-author-marketplace/publishvm11.png)

The **Plans + Pricing** tab for your managed application displays the following fields:

![Marketplace plans](./media/managed-application-author-marketplace/publishvm15.png)

#### Azure portal

The summary of your managed application displays the following fields:

![Portal summary](./media/managed-application-author-marketplace/publishvm12.png)

The overview for your managed application displays the following fields:

![Portal overview](./media/managed-application-author-marketplace/publishvm13.png)

#### Logo guidelines

Follow these guidelines for any logo that you upload in the Cloud Partner portal:

*   The Azure design has a simple color palette. Limit the number of primary and secondary colors on your logo.
*   The theme colors of the portal are white and black. Don't use these colors as the background color for your logo. Use a color that makes your logo prominent in the portal. We recommend simple primary colors. *If you use a transparent background, make sure that the logo and text aren't white, black, or blue.*
*   Don't use a gradient background on the logo.
*   Don't place text on the logo, not even your company or brand name. The look and feel of your logo should be flat and avoid gradients.
*   Make sure the logo isn't stretched.

#### Hero logo

The hero logo is optional. The publisher can choose not to upload a hero logo. After the hero icon is uploaded, it can't be deleted. At that time, the partner must follow the Marketplace guidelines for hero icons.

Follow these guidelines for the hero logo icon:

*   The publisher display name, the plan title, and the offer long summary are displayed in white. Therefore, don't use a light color for the background of the hero icon. A black, white, or transparent background isn't allowed for hero icons.
*   After the offer is listed, the publisher display name, the plan title, the offer long summary, and the **Create** button are embedded programmatically inside the hero logo. Consequently, don't enter any text while you design the hero logo. Leave empty space on the right because the text is included programmatically in that space. The empty space for the text should be 415 x 100 pixels on the right. It's offset by 370 pixels from the left.

	![Hero logo example](./media/managed-application-author-marketplace/publishvm14.png)

## Support form

Fill out the **Support** form with support contacts from your company. This information might be engineering contacts and customer support contacts.

## Publish an offer

After you fill out all the sections, select **Publish** to start the process that makes your offer available to customers.

## Next steps

* For an introduction to managed applications, see [Managed application overview](managed-application-overview.md).
* For information about consuming a managed application from the Marketplace, see [Consume Azure managed applications in the Marketplace](managed-application-consume-marketplace.md).
* For information about publishing a Service Catalog managed application, see [Create and publish a Service Catalog managed application](managed-application-publishing.md).
* For information about consuming a Service Catalog managed application, see [Consume a Service Catalog managed application](managed-application-consumption.md).
