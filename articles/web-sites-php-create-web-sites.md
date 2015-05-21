<properties 
	pageTitle="Create a PHP web app in Azure App Service" 
	description="Learn how to create a PHP web app in Azure App Service" 
	documentationCenter="php" 
	services="app-service\web" 
	editor="mollybos" 
	manager="wpickett" 
	authors="tfitzmac"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="tomfitz"/>

# Create a PHP web app in Azure App Service

## Overview
This article will show you how to create a PHP web app in [Azure App Service] by using the [Azure preview portal](https://portal.azure.com), the [Azure CLI for Mac, Linux, and Windows][xplat-tools], or the [Azure PowerShell cmdlets][powershell-cmdlets].

In general, creating a PHP web app is no different that creating *any* web app in Azure App Service. By default, PHP is enabled for all web apps. For information about configuring PHP (or providing your own customized PHP runtime), see [Configure PHP in Azure App Service Web Apps].

Each option described below shows you how to create a web app in a shared hosting environment at no cost, but with some limitations on CPU usage and bandwidth usage. For more information, see [App Service Pricing]. For information about how to upgrade and scale your web app in App Service, see [Scale a web app in Azure App Service].

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Create a PHP web app using the Azure preview portal

When you create a PHP web app in the Azure preview portal, you have three options: 

- **Quick create** - see [How to: Create a web app Using the Azure preview portal](web-sites-create-deploy.md#createawebsiteportal)
- **Create with database** - see [Create a PHP-MySQL web app in Azure App Service and deploy using Git] 
- **From the Marketplace** - see [Create a WordPress web app in Azure App Service]

## Create a PHP web app using the Azure CLI

To create a PHP web app using the Azure CLI do the following:

1. Install the Azure CLI by following the instructions here: [How to install the Azure CLI for Mac, Linux and Windows](xplat-cli.md#install).

1. Download and import your publish settings file by following the instructions here: [How to download and import publish settings](xplat-cli.md#configure).

1. Run the following command from a command prompt:

		azure site create MyWebAppName

The URL for the newly created web app will be  `http://MyWebAppName.azurewebsites.net`.  
 
Note that you can execute the `azure site create` command with any of the following options:

* `--location [location name]`. This option allows you to specify the location of the data center in which your web app is created (e.g. "West US"). If you omit this option, you will be promted to choose a location.
* `--hostname [custom host name]`. This option allows you to specify a custom hostname for your web app.
* `--git`. This option allows you to use git to publish to your web app by creating git repositories in both your local application directory and in your web app's data center. Note that if your local folder is already a git repository, the command will add a new remote to the existing repository, pointing to the repository in your web app's data center.

## Create a PHP web app using the Azure PowerShell cmdlets

To create a PHP web app using the Azure PowerShell cmdlets, do the following:

1. Install the Azure PowerShell cmdlets by following the instructions here: [Get started with Azure PowerShell](/develop/php/how-to-guides/powershell-cmdlets/#GetStarted).

1. Download and import your publish settings file by following the instructions here: [How to: Import publish settings](/develop/php/how-to-guides/powershell-cmdlets/#ImportPubSettings).

1. Open a PowerShell command prompt and execute the following command:

		New-AzureWebsite MyWebAppName

The URL for the newly created web app will be  `http://MyWebAppName.azurewebsites.net`.  
 
Note that you can execute the `New-AzureWebsite` command with any of the following options:

* `-Location [location name]`. This option allows you to specify the location of the data center in which your web app is created (e.g. "West US"). If you omit this option, you will be promted to choose a location.
* `-Hostname [custom host name]`. This option allows you to specify a custom hostname for your web app.
* `-Git`. This option allows you to use git to publish to your web app by creating git repositories in both your local application directory and in your web app's data center. Note that if your local folder is already a git repository, the command will add a new remote to the existing repository, pointing to the repository in your web app's data center.

## Next steps

Now that you have created a PHP web app in Azure App Service, you can manage, configure, monitor, deploy to, and scale your app. For more information, see the following links:

* [Configure web apps in Azure App Service](web-sites-configure.md)
* [Configure PHP in Azure App Service Web Apps]
* [Manage web apps using the Azure Portal](web-sites-manage.md)
* [Monitor Web Apps in Azure App Service](web-sites-monitor.md)
* [Scale a web app in Azure App Service]
* [Continuous deployment using GIT in Azure App Service](web-sites-publish-source-control.md)

For end-to-end tutorials, visit the [PHP Developer Center - Tutorials](/develop/php/tutorials/) page.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the portal to the preview portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

[Azure App Service]: http://go.microsoft.com/fwlink/?LinkId=529714
[Azure Portal]: http://go.microsoft.com/fwlink/?LinkId=529715
[xplat-tools]: xplat-cli.md
[powershell-cmdlets]: powershell-install-configure.md
[Configure PHP in Azure App Service Web Apps]: web-sites-php-configure.md
[Create a PHP-MySQL web app in Azure App Service and deploy using Git]: web-sites-php-mysql-deploy-use-git.md
[Create a WordPress web app in Azure App Service]: web-sites-php-web-site-gallery.md
[App Service Pricing]: /pricing/details/app-service/
[Scale a web app in Azure App Service]: web-sites-scale.md
