<properties 
   pageTitle="Create a Business to Employee Multi-Channel App" 
   description="This tutorial shows you how to consume a SaaS API App from an ASP.NET hosted in Web App." 
   services="web-sites" 
   documentationCenter="dev-center-name" 
   authors="syntaxc4" 
   manager="yochayk" 
   editor=""/>

<tags
   ms.service="web-sites"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="web" 
   ms.date="03/05/2015"
   ms.author="cfowler"/>

# Create a Business to Employee Multi-Channel app

This tutorial shows you how to consume an API App from an ASP.NET hosted in Web App.

## Overview

You will learn:

- How to consume an API App from ASP.NET hosted in Web App.

## Prerequisites

This tutorial builds upon the series from the Azure API App Tutorials:

1. [Create an Azure API App](app-service-dotnet-create-api-app)
2. [Publish an Azure API App](app-service-dotnet-publish-api-app)
3. [Deploy an Azure API App](app-service-dotnet-deploy-api-app)
4. [Debug an Azure API App](app-service-dotnet-remotely-debug-api-app)

## Make the Azure API App Publicly Accessible

In the Portal, Select the API App. Click on the Settings button in the command bar. Under the Basic Settings Blade, change the Access Level to Public (anonymous).

![](./media/web-app-connect-web-app-to-saas-api/4-5-Change-Access-Level-To-Public.png)

## Create an ASP.NET MVC Application in Visual Studio

1. Open Visual Studio, use the New Project Dialogue to add a new **ASP.NET Web Application**. Click **OK**.

	![File > New > Web > ASP.NET Web Application](./media/app-service-web-connect-web-app-to-saas-api/1-Create-New-MVC-App-For-Consumption.png)
1. Check the **MVC** Checkbox. Click on the **Change Authentication** button, Select **No Authentication**. Click **OK**, twice.

	![New ASP.NET Application](./media/app-service-web-connect-web-app-to-saas-api/2-Change-Auth-To-No-Auth.png)

1. Right-Click on the newly created Web Application Project. Select **Add Azure App Reference...**

	![Add Azure API App Reference...](./media/app-service-web-connect-web-app-to-saas-api/3-Add-Azure-API-App-SDK.png)

1. Select the API App from the dropdown list which you would like to connect to.

	![Select Existing API App](./media/app-service-web-connect-web-app-to-saas-api/4-Add-Azure-API-App-SDK-Dialog.png)

	<div class="wa-note wa-note-default">
		<span class=""></span>
		<h5>Note:</h5>
		<p>The client code for connecting to the API App will be automatically generated from a Swagger API endpoint</p>
	</div>

1. To leverage the Generated API Code, open the HomeController.cs file and replace the Contact Action with the following:

	```csharp
    public async Task<ActionResult> Contact()
    {
        ViewBag.Message = "Your contact page.";

        var contacts = new ContactsList();
        var response = await contacts.Contacts.GetAsync();
        var contactList = response.Body;

        return View(contactList);
    }
	```

	![HomeController.cs Code Updates](./media/app-service-web-connect-web-app-to-saas-api/5-Write-Code-Which-Leverages-Swagger-Generated-Code.png)

1. Update the Contact view to reflect the Dynamic list of Contacts with the code below:

	```csharp
	// Add to the very top of the view file
	@model IList<MyContactsList.Web.Models.Contact>

	// Replace the default email addresses with the following
    <h3>Public Contacts</h3>
    <ul>
        @foreach (var contact in Model)
        {
            <li><a href="mailto:@contact.EmailAddress">@contact.Name &lt;@contact.EmailAddress&gt;</a></li>
        }
    </ul> 
	```

	![Contact.cshtml Code Updates](./media/app-service-web-connect-web-app-to-saas-api/6-Update-View-To-Reflect-Changes.png)

## Deploy the Web Application to Azure Web App

Follow the instructions available on the [Deploy to Azure Websites](http://azure.microsoft.com/en-us/documentation/articles/web-sites-deploy/) article.
