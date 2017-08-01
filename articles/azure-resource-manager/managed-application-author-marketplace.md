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

 MSPs, ISVs, and system integrators (SIs) can use managed applications to offer their solutions to all Azure Marketplace customers. Such solutions reduce the maintenance and servicing overhead for customers. Publishers can sell infrastructure and software through the Marketplace. They can attach services and operational support to managed applications. For more information, see [Managed Application overview](managed-application-overview.md).

This article explains how an MSP, ISV, or SI can publish an application to the Marketplace and make it broadly available to customers.  

## Prerequisites for publishing a managed application

Prerequisites to listing in the Marketplace:

* Technical

    *  For information about the basic structure and syntax of Azure Resource Manager templates, see [Author Azure Resource Manager templates](resource-group-authoring-templates.md).
    *  To view complete template solutions, see [Azure Quickstart templates](https://azure.microsoft.com/en-us/documentation/templates/) or the [Quickstart template repository](https://github.com/azure/azure-quickstart-templates).
    *  For information about how to create the interface for customers who deploy your application through the Marketplace, see [Create a user interface definition file](managed-application-createuidefinition-overview.md).

* Nontechnical (business requirements)

    *   Your company or its subsidiary must be located in a sell from country supported by the Marketplace.
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

A SKU is the smallest purchasable unit of an offer. While within the same product class (offer), SKUs allow you to differentiate between:

* Different features that are supported.
* Whether the offer is managed or unmanaged.
* Billing models that are supported.

A SKU appears under the parent offer in the Marketplace. It appears as its own purchasable entity in the Azure portal.

### Set up an offer

1.  Sign in to the [Cloud Partner portal](https://cloudpartner.azure.com/).

2.  In the navigation pane on the left, select **+ New offer** > **Azure Applications**.

	![New offer](./media/managed-application-author-marketplace/newOffer.png)

3.  Fill out the forms that appear on the left in the **Editor** view. Required fields are marked with a red asterisk (*).

	![Offer settings](./media/managed-application-author-marketplace/newOffer_OfferSettings.png)

	There are four main forms for authoring a managed application:

	*   Offer Settings
	*   SKUs
	*   Marketplace
	*   Support

These forms are described in greater detail in the following sections.

## Offer Settings form
Use this basic form to specify the offer settings.

1. Fill in the **Offer Settings** form. The different fields are:

* **Offer ID**: This unique identifier identifies the offer within a publisher profile. This ID is visible in product URLs, Resource Manager templates, and billing reports. It can only be composed of lowercase alphanumeric characters or dashes (-). The ID can't end in a dash. It's limited to a maximum of 50 characters. After an offer goes live, this field is locked.
* **Publisher ID**: Use this drop-down list to choose the publisher profile you want to publish this offer under. After an offer goes live, this field is locked.
* **Name**: This display name for your offer appears in the Marketplace and in the portal. It can have a maximum of 50 characters. Include a recognizable brand name for your product. Don't include your company name here unless that's how it's marketed. If you're marketing this offer on your own website, ensure that the name is exactly how it appears on your website.

2. Select **Save** to save your progress. 

## SKUs form
The next step is to add SKUs for your offer.

1. Select **SKUs** > **New SKU**. 

	![Select new SKU](./media/managed-application-author-marketplace/newOffer_skus.png)

2. Enter a **SKU ID**. A SKU ID is a unique identifier for the SKU within an offer. This ID is visible in product URLs, Resource Manager templates, and billing reports. It can only be composed of lowercase alphanumeric characters or dashes (-). The ID can't end in a dash, and it's limited to a maximum of 50 characters. After an offer goes live, this field is locked. You can have multiple SKUs within an offer. You need a SKU for each image you plan to publish.

3. Fill out the following form:

	![Provide new SKU](./media/managed-application-author-marketplace/newOffer_newsku.png)

### Fill out the SKU details section

* **Title**: Provide a title for this SKU. This title appears in the gallery for this item.
* **Summary**: Provide a short summary for this sku. This text appears underneath the title.
* **Description**: Provide a detailed description about the SKU.
* **SKU Type**: The allowed values are **Managed Application** and **Solution Templates**. For this case, select **Managed Application**.

### Fill out the package details section

The package section has the following fields that need to be filled out:

![Package](./media/managed-application-author-marketplace/newOffer_newsku_package.png)

* **Current version**: Provide a version for the package you upload. It should be in the format `{number}.{number}.{number}{number}`
* **Package File**: This package contains the following files that are compressed into a .zip file:
	* **applianceMainTemplate.json**: The deployment template file that's used to deploy the solution/application. For information about how to author deployment template files, see [Create your first Azure Resource Manager template](resource-manager-create-first-template.md).
	* **appliancecreateUIDefinition.json**: This file is used by the Azure portal to generate the user interface for provisioning this solution/application. For more information, see [Get started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
	* **mainTemplate.json**: This template file contains only the Microsoft.Solution/appliances resource. The key properties of this resource to be aware of are as follows:

The mainTemplate includes the following properties:

*  **kind**: Use **Marketplace** for managed applications in the Marketplace.
*  **ManagedResourceGroupId**: This resource group in the customer's subscription is where all the resources defined in the applianceMainTemplate.json are deployed.
*  **PublisherPackageId**: This string uniquely identifies the package. Provide the value in the format of `{publisherId}.{OfferId}.{SKUID}.{PackageVersion}`.
  The publisherId and OfferId can be obtained from the publishing portal.

  ![Offer ID](./media/managed-application-author-marketplace/UniqueString_pubid_offerid.png)
		
  The SKU ID can be obtained as shown in the following image:

  ![SKU ID](./media/managed-application-author-marketplace/UniqueString_skuid.png)
		
  The package version can be obtained as shown in the following image:

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

This package should contain any other nested templates or scripts that are required to successfully provision this application. The mainTemplate.json, applianceMainTemplate.json, and applianceCreateUIDefinition.json must be present at the root folder.

**Authorizations**: This property defines who gets access and the level of access to the resources in customers' subscriptions. It enables the publisher to manage the application on behalf of the customer.
* **PrincipalId**: This property is the Azure Active Directory identifier of a user, user group, or application that's granted certain permissions (as described by the Role Definition) on the resources in the customer's subscription.
* **Role Definition**: This property is a list of all the built-in RBAC roles provided by Azure AD. You can select the role that is most appropriate and allows you to manage the resources on behalf of the customer.

Multiple authorizations can be added. However, it is recommended to create an Active directory user group and specify its Id in the **PrincipalId**. It enables addition of more users to the user group and required without having to update the SKU.

For more information about RBAC, see [Get started with Role-Based Access Control in the Azure portal](../active-directory/role-based-access-control-what-is.md).

## Marketplace form

The Marketplace form asks for fields that show up on the [Azure Marketplace](https://azuremarketplace.microsoft.com) and on the [Azure portal](https://portal.azure.com/).

### Preview subscription IDs

Enter a list of Azure Subscription IDs that you want to have access to the offer after it's published. You can use these white-listed subscriptions to test the previewed offer before you make it live. You can compile a white list of up to 100 subscriptions in the partner portal.

### Suggested categories

Select up to five categories from the provided list that your offer can be best associated with. The selected categories are used to map your offer to the product categories available in the [Azure Marketplace](https://azuremarketplace.microsoft.com) and the [Azure portal](https://portal.azure.com/).

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

Follow these guidelines for all the logos that you upload in the Cloud Partner portal:

*   The Azure design has a simple color palette. Limit the number of primary and secondary colors on your logo.
*   The theme colors of the portal are white and black. Don't use these colors as the background color for your logos. Use a color that makes your logos prominent in the portal. We recommend simple primary colors. *If you use a transparent background, make sure that the logos and text aren't white, black, or blue.*
*   Don't use a gradient background on the logo.
*   Don't place text on the logo, not even your company or brand name. The look and feel of your logo should be flat and avoid gradients.
*   Make sure the logo isn't stretched.

#### Hero logo

The hero logo is optional. The publisher can choose not to upload a hero logo. After the hero icon is uploaded, it can't be deleted. At that time, the partner must follow the Marketplace guidelines for hero icons.

##### Guidelines for the hero logo icon

*   The publisher display name, the plan title, and the offer long summary are displayed in white. Therefore, don't use a light color for the background of the hero icon. A black, white, or transparent background isn't allowed for hero icons.
*   After the offer is listed, the publisher display name, the plan title, the offer long summary, and the **Create** button are embedded programmatically inside the hero logo. Consequently, don't enter any text while you design the hero logo. Leave empty space on the right because the text is included programmatically in that space. The empty space for the text should be 415x100 on the right. It's offset by 370 px from the left.

![Publishvm14](./media/managed-application-author-marketplace/publishvm14.png)

## Support form

Fill out the support form with support contacts from your company. This information might be engineering contacts and customer support contacts.

## Publish an offer

After you fill out all the sections, select **Publish** to start the process that makes your offer available to customers.

## Next steps

* For an introduction to managed applications, see [Azure managed application overview](managed-application-overview.md).
* For information about consuming a managed application from the Marketplace, see [Consume Azure managed applications in the Marketplace](managed-application-consume-marketplace.md).
* For information about publishing a Service Catalog managed application, see [Create and publish a Service Catalog managed application](managed-application-publishing.md).
* For information about consuming a Service Catalog managed application, see [Consume a Service Catalog managed application](managed-application-consumption.md).
