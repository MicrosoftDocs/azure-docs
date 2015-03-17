<properties 
	pageTitle="Create an Azure API App using Visual Studio" 
	description="Learn how to create an Azure API App using Visual Studio 2013 and ASP.NET Web API." 
	services="app-service\api" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/05/2015" 
	ms.author="tdykstra"/>

# Create an API app using Visual Studio 2013

## Overview

In this tutorial you create an Azure App Service API app using a project template in
Visual Studio 2013. The tutorial explains how to customize the API app
metadata that you specify in project files and folders.

You'll create the same Web API that is created by the [Getting Started with ASP.NET Web API 2](http://www.asp.net/web-api/overview/getting-started-with-aspnet-web-api/tutorial-your-first-web-api) tutorial, but your project will be prepared for publishing and deployment as an Azure API app.

## Prerequisites

This tutorial requires Visual Studio 2013 with Azure SDK 2.5.1.

[AZURE.INCLUDE [install-sdk-2013-only](../includes/install-sdk-2013-only.md)]

## Create an API App project

For this tutorial you’ll use the **Azure API App** template to create a new project.

1.  Open the **New Project** dialog in Visual Studio.

2.  Select the **Cloud** node in the **Installed Templates** pane, and then select the **ASP.NET Web Application** template.

3.  Name the project *ApiAppSite*, and then click **OK**.

	![New Project dialog](./media/app-service-dotnet-create-api-app-visual-studio/vstemplate.png)

4. In the **New ASP.NET Project** dialog, select the **Azure API App** template, clear the **Host in the cloud** check box, and then click **OK**.

	![Azure API App template](./media/app-service-dotnet-create-api-app-visual-studio/vstemplate2.png)

	Visual Studio creates project files for an empty Web API project, plus an *apiapp.json* file and a *Metadata* folder that store information about the Azure App Service API app.

	![API App files in Solution Explorer](./media/app-service-dotnet-create-api-app-visual-studio/metadatainse.png)

In the following sections you change some of the default values for this API app metadata and then add a Model and Controller.

## Review apiapp.json

The settings in the *apiapp.json* file determine how the API App is identified and presented in the API App Gallery and the Azure Marketplace. In this section you edit the file and review its contents.

1.  Open the *apiapp.json* file.

    The file created by the template looks like the following example:

		{
		  "$schema": "http://json-schema.org/schemas/2014-11-01/apiapp.json#",
		  "id": "ContactsList",
		  "domain": null,
		  "version": "1.0.0",
		  "title": "ContactsList",
		  "summary": "[Summary]",
		  "author": "[Author]",
		  "endpoints": {
		    "apiDefinition": "/swagger/docs/v1",
		    "status": null
		  }
		}

1.  Change *id* to a unique value, for example:

    "ContactsList-*{MyLiveIdNoPeriod}*".

    The *id* can contain letters and numbers. It can’t contain periods, slashes, or @ signs.

2.  Change “[Author]” to your name.

3.  Save the file.

The following table explains the format and usage of the fields included
in the file and additional optional fields that you can add to it.

| Name (bold=required) | Type | Comments |
|:-----------|:------------|:------------|
|**id**           |string|The unique id of this package. Must not contain periods, /, or @ characters.
|**domain**       |string|The domain of the API App if it access to it in the Gallery should be restricted to an organization. Null for public access. The domain will be used as the publisher name in the Marketplace, after converting periods to hyphens, and hyphens to two hyphens (--). The domain is "microsoft.com" for Microsoft-provided API Apps.  
|**version**      |string|[Semver](http://docs.nuget.org/Create/Versioning) format, e.g., 1.0.1, 1.1.0-alpha.
|**title**        |string|The displayed name of the API App.
|**summary**      |string|A short summary of the API App, max 100 characters.
|description   |string|The full description of the API App. Can contain HTML, max 1500 characters.
|**author**       |string|The author(s) of the API App, max 256 characters.
|homepage      |URI|The home page of the API App.
|dependencies  |object[]|An array of package dependencies.
|>>dependencies.id|string|The id of the dependency package.
|>>dependencies.domain|string|The domain of the dependency package.
|>>dependencies.version|string|The version of the dependency package.
|endpoints     |object[]|An array of well-known URIs
|  endpoints.apiDefinition|string|Relative URI of if located.
|  endpoints.status|string|
|categories    |string[]|Determines where the packages will show in the Azure Marketplace. Valid values are: social, enterprise, integration, protocol, app-datasvc, other. Default: other.
|license       |object|The license of the API App.
|>>**license.type**|string|the SPDX license identifier, e.g., MIT.
|>>license.url|url|The absolute url pointing to the full license text.
|>>license.requireAcceptance|bool|Whether a license needs to be approved before installing. Default: false.
|links         |object[]|An array of links to add to the Marketplace page.
|>>**links.text**|string|The text of the link.
|>>**links.url**|url|The URL of the link.
|authentication|object[]|What kind of auth this API App needs to work.
|>>authentication.type|string|e.g., google.com, twitter.com, dropbox.com
|>>authentication.scopes|string[]|e.g., ["foo", "bar"]
|>>authentication.name|string|e.g, Github
|>>authenticationUri ||
|Copyright     |string|The copyright notice of the API app.
|brandColor    |string|An optional brand color to drive the UI experience, in any CSS-compatible format, e.g. \#abc, red.

## Review the Metadata folder

The Metadata folder can contain icons and screenshots for the API Apps Gallery, an Azure Resource Manager template that specifies resources required, a Swagger file
documenting the API, and UI configuration for the Azure portal. All of
this information is optional.

![Metadata folder in Solution Explorer](./media/app-service-dotnet-create-api-app-visual-studio/metadatafolderinse.png)

### The icons folder

You can provide icons to be displayed in the Gallery and the workflow designer. If you don't provide custom icons, generic API App icons will be used. Icon files should be in PNG format and follow these name and size conventions:

|File Name|Size
|:-----|:-----:
|small.png|40X40
|medium.png|90X90
|large.png|115X115
|hero.png|815X290
|wide.png|255X115

### The screenshots folder

You can provide up to 5 screenshots to display in the Gallery. The image
files should be in PNG format, 533x324.

### The apiDefinition.swagger.json file

You can use a [Swagger 2.0](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md) format file to describe the API definition of the API app. This enables you to expose API definitions statically in the package. Static API definitions are required for workflow designers to understand the API App triggers and actions before provisioning.

### The resourceTemplate.delta.json file

You can specify a custom Azure Resource Manager template that executes during API App deployment. The resources specified in this delta file are added to the resources that are created by default for an API app. For example, if your API app requires a SQL Database instance you can use this file to cause the database to be provisioned automatically  and the connection string to be set in configuration settings when the API App is deployed.  

### The UIDefinition.json file

You can provide UI information in the [Azure
Marketplace format](https://auxdocs.azurewebsites.net/en-us/documentation/articles/gallery-items). This enables you to improve the portal create
experience by adding more UI hints and validation.

## Add Application Code

You write code for an API App project as you would for any Web API project. 

1. Create a *Models* folder in the project folder.

3. Right-click the **Models** folder in the Web API project, and then in the context menu click **Add > Class**. 

	![](./media/app-service-dotnet-create-api-app/03-add-new-class-v2.png) 

4. Name the new file *Contact.cs*, and then click **Add**.

5. Replace the content of the new *.cs* file with the following code. 

		namespace ContactsList.Models
		{
			public class Contact
			{
				public int Id { get; set; }
				public string Name { get; set; }
				public string EmailAddress { get; set; }
			}
		}

	![](./media/app-service-dotnet-create-api-app/04-contacts-model-v2.png)

5. Right-click the **Controllers** folder, and then in the context menu click **Add > Controller**. 

	![](./media/app-service-dotnet-create-api-app/05-new-controller-v2.png)

6. In the **Add Scaffold** dialog, select the **Web API 2 Controller - Empty** option, and then click **Add**. 

	![](./media/app-service-dotnet-create-api-app/06-new-controller-dialog-v2.png)

7. Name the controller **ContactsController**, and then click **Add**. 

	![](./media/app-service-dotnet-create-api-app/07-new-controller-name-v2.png)

8. Replace the code in the new controller file with the code below. 

		using ContactsList.Models;
		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Net;
		using System.Net.Http;
		using System.Threading.Tasks;
		using System.Web.Http;
		
		namespace ContactsList.Controllers
		{
		    public class ContactsController : ApiController
		    {
		        [HttpGet]
		        public IEnumerable<Contact> Get()
		        {
		            return new Contact[]{
		                new Contact { Id = 1, EmailAddress = "gu@microsoft.com", Name = "ScottGu"},
		                new Contact { Id = 2, EmailAddress = "hu@microsoft.com", Name = "ScottHu"},
		                new Contact { Id = 3, EmailAddress = "ha@microsoft.com", Name = "ScottHa"},
		            };
		        }
		    }
		}

	![](./media/app-service-dotnet-create-api-app/08-contacts-controller-with-get-v2.png)

## Next steps

You now have a working API App. You can deploy it directly to Azure or you can publish it to the Gallery and deploy it from the Azure Marketplace. In the Gallery you can make the API App public, keep it private so only you can see it, or restrict access to members of your organization. For more information, see the following tutorials:

* [Publish an API App](../app-service-dotnet-publish-api-app/)
* [Deploy an API App](../app-service-dotnet-deploy-api-app/)
* [Debug an API App](../app-service-dotnet-remotely-debug-api-app/)

