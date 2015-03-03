<properties 
	pageTitle="How to create websites - Azure service management" 
	description="Learn how to create a website using the Azure Management Portal." 
	services="web-sites" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="cephalin"/>

# How to Create a Website

This topic shows how to create a website from the gallery or by using the management portal.

For information about how to deploy your content to an Azure Website that you have created, see the **Deploy** section in [Azure Websites](/en-us/documentation/services/web-sites/).

##<a name="createawebsiteportal"></a> How to: Create a Website Using the Management Portal

Follow these steps to create a website in Azure.
	
1. Login to the [Azure Management Portal](http://manage.windowsazure.com/).

2. Click the **New** icon on the bottom left of the Management Portal.

3. Click the **Website** icon, click the **Quick Create** icon, enter a value for URL and then click the check mark next to **Create Website** on the bottom right corner of the page.

4. When the website has been created, you will see the text **Creating website <*website name*>  succeeded**. You can browse to the website by clicking **Browse** at the bottom of the portal page.

5. In the portal, click the name of the website displayed in the list of websites to open the website's **Quick Start** management page.

6. On the **Quick Start** page, you are provided with options to get website development tools, set up publishing for your website, or set up deployment from a source control provider like TFS or Git. FTP publishing is set up by default for websites and the FTP Host name is displayed in the **Quick Glance** section of the **Dashboard** page under **FTP Host Name**. Before publishing with FTP or Git, choose the option to **Reset deployment credentials** on the **Dashboard** page so that you can authenticate against the FTP Host or the Git Repository when deploying content to your website.

7. The **Configure** management page exposes settings for your website, such as:

	- version of .NET, PHP, Java, or Python for your website
	- edit in Visual Studio Online
	- SSL bindings
	- custom domain names
	- authentication/authorization
	- application and site diagnostics
	- monitoring endpoints
	- logging options
	- app settings for the Azure environment (overriding <appSettings> in your development environment's Web.config, for example)
	- connection strings (overriding <connectionStrings> in your development environment's Web.config, for example)
	- script processors for specific file extensions like *.php

##<a name="howtocreatefromgallery"></a> How to: Create a Website from the Gallery

[AZURE.INCLUDE [website-from-gallery](../includes/website-from-gallery.md)]

##<a name="deleteawebsite"></a> How to: Delete a Website
Websites are deleted using the **Delete** icon in the Azure Management Portal. The **Delete** icon is available in the Azure Portal when you click **Websites** to list all of your websites and at the bottom of each of the website management pages.

##<a name="nextsteps"></a> Next Steps

For more information, see [Azure Web Sites](/en-us/documentation/services/web-sites/).
