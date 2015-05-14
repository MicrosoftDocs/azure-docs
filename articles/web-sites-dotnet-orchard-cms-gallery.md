<properties 
	pageTitle="Create an Orchard CMS web app from the Azure Marketplace" 
	description="A tutorial that teaches you how to create a new web app in Azure. Also learn how to launch and manage your web app using the Azure Portal." 
	tags="azure-portal"
	services="app-service\web" 
	documentationCenter=".net" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="tomfitz"/>

# Create an Orchard CMS web app from the Azure Marketplace

## Overview

The Marketplace makes available a wide range of popular web applications developed by Microsoft, third party companies, and open source software initiatives. Web applications created from the Marketplace do not require installation of any software other than the browser used to connect to the [Azure preview portal](http://go.microsoft.com/fwlink/?LinkId=529715). For more information about the web applications in the Marketplace, see [Azure Marketplace](/marketplace/).

In this tutorial, you'll learn:

- How to create a new web app from the Marketplace

- How to launch and manage your web app from the Azure Portal
 
You'll build an Orchard CMS web app that uses a default template. [Orchard](http://www.orchardproject.net/) is a free, open-source, .NET-based CMS application that allows you to create customized, content-driven web apps and websites. Orchard CMS includes an extensibility framework through which you can [download additional modules and themes](http://gallery.orchardproject.net/) to customize your web app. The following illustration shows the Orchard CMS web app in [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) that you will create.

![Orchard blog][13]

[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Create an Orchard web app from the Marketplace

1. Login to the [Azure preview portal](http://portal.azure.com).

2. Click **New** > **Web + Mobile** > **Azure Marketplace**.
	
	![Create New][1]

3. Click **Web Apps** > **Orchard CMS**. In the next blade, click **Create**.
	
	![Create From Marketplace][2]

4. Configure the web app's URL, App Service plan, resource group, and location. When you're done, click **Create**.
	
	![Configure the app][3]

	Once your web app is created, the **Notifications** button will show a green "SUCCESS" and your web app's blade will be displayed.

## Launch and manage your Orchard web app

1. In your web app's blade, click **Browse** to open your web app's welcome page.

	![browse button][12]

2. Enter the configuration information required by Orchard, and then click **Finish Setup** to complete the configuration and open the web app's home page.

	![login to Orchard][7]

	You'll have a new Orchard web app that looks similar to the screenshot below.  

	![your Orchard web app][13]

3. Follow the details in the [Orchard Documentation](http://docs.orchardproject.net/) to learn more about Orchard and configure your new web app.

## Next step

* [Develop and deploy a web app with Microsoft WebMatrix](web-sites-dotnet-using-webmatrix.md) -- Learn how to edit an App Service web app in WebMatrix. 
* [Create an ASP.NET MVC app with auth and SQL DB and deploy to Azure App Service](web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database.md)-- Learn how to create a new web app in Azure App Service from Visual Studio.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the portal to the preview portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

[1]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-01.png
[2]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-02.png
[3]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-03.png
[4]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-04.png
[5]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-05.png
[7]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-07.png
[12]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-12.png
[13]: ./media/web-sites-dotnet-orchard-cms-gallery/orchardgallery-08.png


