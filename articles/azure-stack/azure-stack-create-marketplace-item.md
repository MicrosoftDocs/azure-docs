<properties
	pageTitle="Create a new marketplace item in Azure Stack"
	description="Learn how to create a new marketplace item to deploy resources in Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="erikje"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/29/2016"
	ms.author="erikje"/>

# To create a new marketplace item in Azure Stack

This document refers to the Azure Gallery Packaging Tool and a Sample Gallery Package. To download the tool and sample package, visit [http://www.aka.ms/azurestackmarketplaceitem](http://www.aka.ms/azurestackmarketplaceitem). 

1.  Create an Azure Resource Manager template or choose a template from GitHub. For more information and guidance, see [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md). The marketplace item will use this template to create a new resource.

2.  Test the template with the Microsoft Azure Stack APIs to make sure the resource can be deployed successfully.

3.  Open up the **SimpleVMTemplate** folder in the package you downloaded. This is a sample Marketplace Item. The folder structure inside sample should resemble the follwing. Rename the folder to whatever you want to call your marketplace item.

		/Contoso.TodoList/
		/Contoso.TodoList/Manifest.json
		/Contoso.TodoList/UIDefinition.json
		/Contoso.TodoList/Icons/
		/Contoso.TodoList/Strings/
		/Contoso.TodoList/DeploymentTemplates/

4. Include your Azure Resource Manager template in the **DeploymentTemplates** folder.

5. Using the guidance provided in [Marketplace Item UI Reference](azure-stack-marketplace-item-ui-reference.md), select the icons and text you want for your marketplace item. Icons should go in the **Icons** folder and text should go into the **resources** file in the **Strings** folder. It is important to make sure the icon names match the convention of Large, Medium, Small, and Wide. 

6. You do not need to make any changes to the UIDefinition.json file in the sample. The UIDefinition.json file specifies the portal experience for creating the marketplace item resource, which will be a simple text-entry experience.

7. Now, we will bring everything together in the **manifest.json** file. This file tells the packaging tools where all the important inputs are, such as the text, icons, and template. The manifest.json in the sample already points to the correct locations for the icons and strings. But you will want to change some fields. For more information about the information in manifest, see [here](azure-stack-marketplace-item-metadata.md).

8. Change the **name** and **publisher**.

		"name": "SimpleVMTemplate",
		"publisher": "Microsoft",

9. Under **artifacts**, replace **name** and **path** with the correct information for the Azure Resource Manager template you included.

         "artifacts": [
            {
	            "name": "azuredeploy-101-simple-windows-vm",
	            "type": "Template",
	            "path": "DeploymentTemplates\\azuredeploy-101-simple-windows-vm.json",
	            "isDefault": true
            }

10. Under **categories**, you can specify the categories where your Marketplace Item will show up in the UI. 

             "categories":[
         		"My Marketplace Items"
              ],

11. Now, you can package your marketplace item using the packaging tool (part of the [download](http://www.aka.ms/marketplaceitem)) In command prompt, Use AzureGalleryPackager.exe to package the folders into an .azpkg file. For example:

    	AzureGalleryPackager.exe package –m <path to manifest.json> -o <output location for the package>

## Next Steps

[Publish a marketplace item](azure-stack-publish-marketplace-item.md)
