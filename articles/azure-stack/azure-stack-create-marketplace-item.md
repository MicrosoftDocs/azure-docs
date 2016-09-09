<properties
	pageTitle="Create a new marketplace item in Azure Stack | Microsoft Azure"
	description="Learn how to create a new marketplace item to deploy resources in Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="rupisure"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/29/2016"
	ms.author="rupisure"/>

# Create a Marketplace item


1. [Download](http://www.aka.ms/azurestackmarketplaceitem) the Azure Gallery Packaging Tool and a Sample Gallery Package.

2.  Open the Sample Gallery Package and rename the **SimpleVMTemplate** folder (use the same name as your Marketplace item. For example, Contoso.TodoList). This folder contains:

		/Contoso.TodoList/
		/Contoso.TodoList/Manifest.json
		/Contoso.TodoList/UIDefinition.json
		/Contoso.TodoList/Icons/
		/Contoso.TodoList/Strings/
		/Contoso.TodoList/DeploymentTemplates/

3.  [Create an Azure Resource Manager template](../resource-group-authoring-templates.md) or choose a template from GitHub. The Marketplace item will use this template to create a new resource.

4.  Test the template with the Microsoft Azure Stack APIs to make sure the resource can be deployed successfully.

5. Save your Azure Resource Manager template in the ``/Contoso.TodoList/DeploymentTemplates/`` folder.

6. [Choose the icons and text](azure-stack-marketplace-item-ui-reference.md) for your Marketplace item. Add icons to the **Icons** folder and text to the **resources** file in the **Strings** folder. Use the Small, Medium, Large, and Wide naming convention for icons.

7. In the **manifest.json** file, change the **name** to the name of your Marketplace item and **publisher** to your name or company.

8. Under **artifacts**, change the **name** and **path** with the correct information for the Azure Resource Manager template you included.

         "artifacts": [
            {
	            "name": "Type your template name",
	            "type": "Template",
	            "path": "DeploymentTemplates\\Type your path",
	            "isDefault": true
            }

9. Replace **My Marketplace Items** with a list of the categories where your Marketplace item will appear.

             "categories":[
         		"My Marketplace Items"
              ],

10. Open a command prompt and run the following command to package the folders into an .azpkg file:

    	AzureGalleryPackager.exe package –m <path to manifest.json> -o <output location for the package>
    Note: The full path to output package must exist. For example, if the output path is C:\MarketPlaceItem\yourpackage.azpkg, the folder C:\MarketPlaceItem must exist.

## Next steps

[Publish a marketplace item](azure-stack-publish-marketplace-item.md)
