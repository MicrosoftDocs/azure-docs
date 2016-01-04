<properties 
	pageTitle="To create a new marketplace item" 
	description="To create a new marketplace item" 
	services="" 
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

1.  Create an Azure Resource Manager template or choose a template from GitHub. For more information and guidance, see [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).

2.  Test the template with the Microsoft Azure Stack APIs to make sure the resource can be deployed successfully.

3.  Create the following folder structure and include the ARM template in the DeploymentTemplates folder (Replace 'Contoso.TodoList' with your choice of marketplace item name). These are the folders that will contain the resources for your marketplace item.

		/Contoso.TodoList/ 
		/Contoso.TodoList/Manifest.json 
		/Contoso.TodoList/UIDefinition.json 
		/Contoso.TodoList/Icons/ 
		/Contoso.TodoList/Screenshots/ 
		/Contoso.TodoList/Strings/ 
		/Contoso.TodoList/DeploymentTemplates/ 

4.  Edit the manifest.json. This file specifies all metadata for the marketplace item.

	    {
		    "$schema": "https://gallery.contoso.com/schemas/2015-09-01/manifest.json#",
		    "name": "string", // [A-Za-z0-9]+
		    "publisher": "string", // [A-Za-z0-9]+
		    "version": "string", // SemVer v2 Format - see http://semver.org/
		    "displayName": "string", // max of 256 characters 
		    "publisherDisplayName": "string", // max of 256 characters 
		    "publisherLegalName": "string", // max of 256 characters -->
		    "summary": "string", // max of 100 characters -->
		    "longSummary": "string", // required, max of 256 characters
		    "description": "string", // max of 2000 characters. Can contain HTML
		    "properties": [
		        /* optional. max of 10 properties
		           displayName: max of 64 characters
		           value: max of 64 characters */
		        { "displayName": "string", "value": "string" }
		    ],
		    "uiDefinition": {
		        "path": "string" // required, path to file
		    },
		    "artifacts": [
		        // you probably want an artifact, because this is where the link to your ARM deployment template goes!
		        /* name: max of 256 characters, [A-Za-z0-9\-_]+
		           type: Fragment, Template
		           path: path to artifact
		           isDefault: true|false */
		        { "name": "string", "type": "string", "path": "string", "isDefault": true } // max of 128 characters
		    ],
		    "icons": {
		        "small": "string", // path to image file
		        "medium": "string", // medium images must be 90x90 pixels if bitmaps...
		        "large": "string", // 40x40
		        "wide": "string", // 255x115 Not supported in Azure Stack UI
		        "hero": "string" // Not supported in Azure Stack UI
		    },
		    "links": [
		        /* optional, but highly recommended, max of 10 links
		           displayName: max of 64 characters
		           uri: uri */
		        { "displayName": "string", "uri": "string" }
		    ],
		    "screenshots": [ "string" ],
		    "categories": [ "string" ],
		}


5.  Include icons, screenshots, strings, and so on in the other folders. These are the icons and strings that populate the marketplace user interface.

6.  In the UIDefinition.json file, point to the Extension: HubsExtension as shown below:
	
		"createBlade": { 
		            "name": "DeployFromTemplateBlade", 
		            "extension": "HubsExtension" 

    The UIDefinition.json file specifies the portal experience for creating the marketplace item resource. All items use the same blade that provides a simple create experience that collects parameters using textboxes.

7.  Use AzureGallery.exe (http://aka.ms/t5ula4) to package the folders into an .azpkg file. For example:

    	AzureGallery.exe package –m <path to manifest.json> -o <output location for the azpkg>


