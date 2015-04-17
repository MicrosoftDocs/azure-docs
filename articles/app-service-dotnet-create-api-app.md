<properties 
	pageTitle="Create an ASP.NET API App in Azure App Service " 
	description="Learn how to to create an ASP.NET API App in Azure App Service, using Visual Studio 2013 " 
	services="app-service\api" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="dotnet" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/19/2015" 
	ms.author="bradyg;tarcher"/>

# Create an API App in Azure App Service

## Overview

This tutorial shows how to create an ASP.NET Web API project that is configured for deployment to the cloud as an [API app](app-service-api-apps-why-best-platform.md) in [Azure App Service](app-service-value-prop-what-is.md). Subsequent tutorials in the series show how to [deploy](app-service-dotnet-deploy-api-app.md) and [debug](app-service-dotnet-remotely-debug-api-app.md) the API app project that you create in this tutorial.

For information about API apps, see [What are API apps?](app-service-api-apps-why-best-platform.md).

[AZURE.INCLUDE [install-sdk-2013-only](../includes/install-sdk-2013-only.md)]

This tutorial requires version 2.5.1 or later of the Azure SDK for .NET.

## Choose between creating a new project and configuring an existing project 

If you're creating a new Web API project and you know you'll be deploying it to Azure as an API app, you can use an API app project template. If you have an existing Web API project that you want to configure for deployment as an API app, you can easily add the required NuGet packages and metadata. This tutorial shows both methods.  To follow the tutorial, start with one of these tutorial sections:

* [Create an API app project](#create-an-api-app-project)
* [Configure a Web API project as an API app](#configure-a-web-api-project-as-an-api-app)

## Create an API app project 

This section shows how to use the Azure API App project template. To learn how to configure an existing Web API project, skip to the [next section](#configure-a-web-api-project-as-an-api-app).

Open Visual Studio 2013 and select **File > New Project**. Select the **ASP.NET Web Application** Template.  name the project *ContactsList*, and then click **OK**.

![](./media/app-service-dotnet-create-api-app/01-filenew-v3.png)

Select the **Azure API App** project template and then click **OK**.

![](./media/app-service-dotnet-create-api-app/02-api-app-template-v3.png)

Visual Studio creates a Web API project configured for deployment as an API app. You can skip the following section which shows how to configure an existing project, and go directly to the [Review API app metadata](#review-api-app-metadata) section.

## Configure a Web API project as an API app 

This section shows how to configure an existing Web API project as an API app. You'll begin by using the Web API project template to create a Web API project, and then you'll configure it as an API app.

Open Visual Studio 2013 and select **File > New Project**. Select the **ASP.NET Web Application** Template.  name the project *ContactsList*, and then click **OK**.

![](./media/app-service-dotnet-create-api-app/01-filenew-v3.png)

In the **New ASP.NET Project** dialog, select the **Empty** project template.

Click the **Web API** check box.

Clear the **Host in the cloud** check box.

Click **OK**.

![](./media/app-service-dotnet-create-api-app/webapinewproj.png)

Visual Studio creates project files for an empty Web API project.

![](./media/app-service-dotnet-create-api-app/sewebapi.png)

In **Solution Explorer**, right-click the project (not the solution), and then click **Add > Azure API App SDK**.

![](./media/app-service-dotnet-create-api-app/addapiappsdk.png)

In the **Choose API App Metadata source** dialog, click **Automatic Metadata Generation**, and then click **OK**.

![](./media/app-service-dotnet-create-api-app/chooseswagger.png)

This choice enables the dynamic Swagger UI, which you'll see later in the tutorial. For information about the static Swagger metadata file option, see [Convert an existing API to an API app](app-service-dotnet-create-api-app-visual-studio.md). 

When you click **OK**, Visual Studio installs API app NuGet packages and adds API app metadata to the Web API project.  In the next section you see what was added.

## Review API app metadata

The metadata that enables a Web API project to be deployed as an API app is contained in an *apiapp.json* file and a *Metadata* folder.

![](./media/app-service-dotnet-create-api-app-visual-studio/metadatainse.png)

The default contents of the *apiapp.json* file resemble the following example:

		{
		    "$schema": "http://json-schema.org/schemas/2014-11-01/apiapp.json#",
		    "id": "ContactsList",
		    "namespace": "microsoft.com",
		    "gateway": "2015-01-14",
		    "version": "1.0.0",
		    "title": "ContactsList",
		    "summary": "",
		    "author": "",
		    "endpoints": {
		        "apiDefinition": "/swagger/docs/v1",
		        "status": null
		    }
		}

The *Metadata* folder contains information such as screenshots for the API App gallery or a static Swagger API definition file.

For this tutorial you don't need to modify any of this metadata. For more information about the format of *apiapp.json* and the contents of the *Metadata* folder, see [Convert an existing API to an API app](app-service-dotnet-create-api-app-visual-studio.md). 

## Add Web API code

In the following steps you add code for a simple HTTP Get method that returns a hard-coded list of contacts. 

Right-click the **Models** folder in the Web API project, and then in the context menu select **Add > Class**. 

![](./media/app-service-dotnet-create-api-app/03-add-new-class-v3.png) 

Name the new file *Contact.cs*, and then click **Add**. 

![](./media/app-service-dotnet-create-api-app/0301-add-new-class-dialog-v3.png) 

Replace the entire contents of the file with the following code. 

	namespace ContactsList.Models
	{
		public class Contact
		{
			public int Id { get; set; }
			public string Name { get; set; }
			public string EmailAddress { get; set; }
		}
	}

Right-click the **Controllers** folder, and then in the context menu select **Add > Controller**. 

![](./media/app-service-dotnet-create-api-app/05-new-controller-v3.png)

In the **Add Scaffold** dialog, select the **Web API 2 Controller - Empty** option and click **Add**. 

![](./media/app-service-dotnet-create-api-app/06-new-controller-dialog-v3.png)

Name the controller **ContactsController** and click **Add**. 

![](./media/app-service-dotnet-create-api-app/07-new-controller-name-v2.png)

Replace the code in this file with the code below. 

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
					new Contact { Id = 1, EmailAddress = "barney@contoso.com", Name = "Barney Poland"},
					new Contact { Id = 2, EmailAddress = "lacy@contoso.com", Name = "Lacy Barrera"},
                	new Contact { Id = 3, EmailAddress = "lora@microsoft.com", Name = "Lora Riggs"}
	            };
	        }
	    }
	}

## Enable Swagger UI

By default, API App projects are enabled with automatic [Swagger](http://swagger.io/ "Official Swagger information") metadata generation, and if you used the **Add API App SDK** menu entry to convert a Web API project, an API test page is also enabled by default.  

However, the Azure API App new-project template disables the API test page. If you created your API app project by using the API App project template, you need to do the following steps to enable the test page.

Open the *App_Start/SwaggerConfig.cs* file, and search for **EnableSwaggerUI**:

![](./media/app-service-dotnet-create-api-app/12-enable-swagger-ui-with-box.png)

Uncomment the following lines of code:

        })
    .EnableSwaggerUi(c =>
        {

When you're done, the file should look like this:

![](./media/app-service-dotnet-create-api-app/13-enable-swagger-ui-with-box.png)

## Test the Web API

To view the API test page, run the app locally (CTRL-F5) and navigate to `/swagger`. 

![](./media/app-service-dotnet-create-api-app/14-swagger-ui.png)

Click the **Try it out** button, and you see that the API is functioning and returns the expected result. 

![](./media/app-service-dotnet-create-api-app/15-swagger-ui-post-test.png)

## Next steps

Your API app is now ready to be deployed, and you can follow the [Deploy an API app](app-service-dotnet-deploy-api-app.md) tutorial to do that.

For more information, see [What are API apps?](app-service-api-apps-why-best-platform.md)
