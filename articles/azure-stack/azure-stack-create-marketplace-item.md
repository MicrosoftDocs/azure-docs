<properties
	pageTitle="To create a new marketplace item"
	description="To create a new marketplace item"
	services="azure-stack"
	documentationCenter=""
	authors="v-anpasi"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/04/2016"
	ms.author="v-anpasi"/>

# To create a new marketplace item

This document refers to the Azure Gallery Packaging Tool and a Sample Gallery Package which can both be downloaded <a href="http://www.aka.ms/marketplaceitem">here</a>. 

1.  Create an Azure Resource Manager template or choose a template from GitHub. For more information and guidance, see [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md). The marketplace item will use this template to create a new resource.

2.  Test the template with the Microsoft Azure Stack APIs to make sure the resource can be deployed successfully.

3.  Open up the <b>SimpleVMTemplate</b> folder in the package you downloaded. This is a sample Marketplace Item. The folder structure inside sample should resemble the follwing. Rename the folder to whatever you want to call your marketplace item.

		/Contoso.TodoList/
		/Contoso.TodoList/Manifest.json
		/Contoso.TodoList/UIDefinition.json
		/Contoso.TodoList/Icons/
		/Contoso.TodoList/Strings/
		/Contoso.TodoList/DeploymentTemplates/

4. Include your Azure Resource Manager template in the <b>DeploymentTemplates</b> folder.

5. Using the guidance provided [here](azure-stack-marketplace-item-ui-reference.md), select the icons and text you want for your marketplace item. Icons should go in the <b>Icons</b> folder and text should go into the <b>resources</b> file in the <b>Strings</b> folder. It is important to make sure the icon names match the convention of Large, Medium, Small. 

6. You do not need to make any changes to the UIDefinition.json file in the sample. The UIDefinition.json file specifies the portal experience for creating the marketplace item resource, which will be a simple text-entry experience.

7. Now, we will bring everything together in the <b>manifest.json</b> file. This file tells the packaging tools where all the important inputs are, such as the text, icons, and template. The manifest.json in the sample already points to the correct locations for the icons and strings. But you will want to change some fields. For more information about the information in manifest, see [here](azure-stack-marketplace-item-metadata.md).

8. Change the <b>name</b> and <b>publisher</b>.

		"name": "SimpleVMTemplate",
		"publisher": "Microsoft",

9. Under <b>artifacts</b>, replace <b>name</b> and <b>path</b> with the correct information for the Azure Resource Manager template you included.

10. Under <b>categories</b>, you can specify the categories where your Marketplace Item will show up in the UI. 

11. Now, you can package your marketplace item using the packaging tool (part of the <a href="http://www.aka.ms/marketplaceitem">download</a>) In command prompt, Use AzureGalleryPackager.exe to package the folders into an .azpkg file. For example:

    	AzureGalleryPackager.exe package –m <path to manifest.json> -o <output location for the package>

## Next Steps

[Publish a marketplace item](azure-stack-publish-marketplace-item.md)
