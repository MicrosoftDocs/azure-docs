<properties 
	pageTitle="Create an Azure API App using Visual Studio" 
	description="Learn how to create an Azure API App using Visual Studio 2013 and ASP.NET Web API." 
	services="app-service" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="2/19/2015" 
	ms.author="tdykstra"/>

# Create an API app using Visual Studio 2013

## Overview

In this tutorial you create an Azure API App using a project template in
Visual Studio 2013. The tutorial explains how to customize the API App
metadata that you specify in project files and folders.

You'll create the same Web API that is created by the [Getting Started with ASP.NET Web API 2](http://www.asp.net/web-api/overview/getting-started-with-aspnet-web-api/tutorial-your-first-web-api) tutorial, but your project will be prepared for publishing and deployment as an Azure API app.

## Prerequisites

This tutorial requires Visual Studio 2013 with [Update
4](http://www.microsoft.com/en-us/download/details.aspx?id=44921). It
also requires the new features for Azure API Services support that are
included in the following installers.

|:-----------|:------------
| Visual Studio       | [\\\\vwdbuild01\\Temp\\EMA\_Tooling\\Release\\Signed\\MSI\\WebToolsExtensionsVS2013.msi](file://vwdbuild01/Temp/EMA_Tooling/Release/Signed/MSI/WebToolsExtensionsVS2013.msi)      
| Visual Web Developer| [\\\\vwdbuild01\\Temp\\EMA\_Tooling\\Release\\Signed\\MSI\\WebToolsExtensionsVWD2013.msi](file://vwdbuild01/Temp/EMA_Tooling/Release/Signed/MSI/WebToolsExtensionsVWD2013.msi)     

## Create an API App project

For this tutorial you’ll use the Azure API App template to create a new
project. For information about how to add API App metadata and runtime
services to an existing ASP.NET Web API project, see [Create an Azure API
App](../app-service-create-api-app/).

1.  Open the **New Project** dialog in Visual Studio.

2.  Select the **Cloud** node in the **Installed Templates** pane, and then select the Azure API App template.

	![Azure API App template](./media/app-service-dotnet-create-api-app-visual-studio/vstemplate.png)

3.  Name the project *ProductsApp*, and then click **OK**.

	Visual Studio creates a typical Web API project file and folder structure including folders such as Controllers, Models, and Views. In addition, there is an *apiapp.json* file and a *Metadata* folder that store information about the API App.

	![API App files in Solution Explorer](./media/app-service-dotnet-create-api-app-visual-studio/metadatainse.png)

In the following sections you change some of the default values for this
API App metadata and look at the other customizations you can make.

## Review apiapp.json

The settings in the *apiapp.json* file determine how the API App is
identified and presented in the API App Gallery and the Azure
Marketplace. In this section you edit the file and review its contents.

1.  Open the *apiapp.json* file.

    The file created by the template looks like the following example:

		{
		  "\$schema": "http://json-schema.org/schemas/2014-11-01/apiapp.json\#",
		  "id": "ProductsApp",
		  "domain": null,
		  "version": "1.0.0",
		  "title": "ProductsApp",
		  "summary": "[Summary]",
		  "author": "[Author]",
		  "endpoints": {
		    "apiDefinition": "/swagger/docs/v1",
		    "status": null
		  }
		}

1.  Change *id* to a unique value, for example:

    “FilePersistingAPI-*{MyLiveIdNoPeriod}*”.

    The *id* can contain letters and numbers. It can’t contain periods,
    slashes, or @ signs.

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

You write code for an API App project as you would for any Web API project. To add a Model and Controller and test the Web API to see that it is working, follow the instructions starting at the **Adding a Model** section of 
[Getting Started with ASP.NET Web API 2](http://www.asp.net/web-api/overview/getting-started-with-aspnet-web-api/tutorial-your-first-web-api).

## Next steps

You now have a working API App. You can deploy it directly to Azure or you can publish it to the Gallery and deploy it from the Azure Marketplace. In the Gallery you can make the API App public, keep it private so only you can see it, or restrict access to members of your organization. For more information, see [“Publish an API App”](../app-service-publish-api-app/) and [“Deploying an API App”](../app-service-publish-api-app/).
