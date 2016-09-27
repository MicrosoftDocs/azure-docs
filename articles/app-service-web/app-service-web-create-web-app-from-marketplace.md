<properties
	pageTitle="Create a web app from the Azure Marketplace | Microsoft Azure"
	description="Learn how to create a new WordPress web app from the Azure Marketplace by using the Azure Portal."
	services="app-service\web"
	documentationCenter=""
	authors="rmcmurray"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service-web"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="07/11/2016"
	ms.author="robmcm"/>

<!-- Note: This article replaces web-sites-php-web-site-gallery.md -->

# Create a web app from the Azure Marketplace

[AZURE.INCLUDE [tabs](../../includes/app-service-web-get-started-nav-tabs.md)]

The Azure Marketplace makes available a wide range of popular web apps developed by Microsoft, third party companies, and open source software initiatives. For example, WordPress, Umbraco CMS, Drupal, etc. These web apps are built on a wide range of popular frameworks, such as [PHP] in this WordPress example, [.NET], [Node.js], [Java], and [Python], to name a few. To create a web app from the Azure Marketplace the only software you need is the browser that you use for the [Azure Portal].

In this tutorial you'll learn how to:

* Find and create web app in Azure App Service that is based on an Azure Marketplace template.
* Configure Azure App Service settings for the new web app.
* Launch and manage your web app.

For the purpose of this tutorial, you will deploy a WordPress blog site from the Azure Marketplace. When you have completed the steps in this tutorial, you'll have your own WordPress site up and running in the cloud.

![Example WordPress wep app dashboard][WordPressDashboard1]

The WordPress site that you'll deploy in this tutorial uses MySQL for the database. If you wish to instead use SQL Database for the database, see [Project Nami], which is also available through the Azure Marketplace.

> [AZURE.NOTE]
> To complete this tutorial, you need a Microsoft Azure account. If you don't have an account, you can [activate your Visual Studio subscriber benefits][activate] or [sign up for a free trial][free trial].
>
> If you want to get started with Azure App Service before you sign up for an Azure account, go to [Try App Service]. From there you can immediately create a short-lived starter web app in App Service — no credit card is required, and there are no commitments.

## Find and Create a Web App in Azure App Service

1. Log in to the [Azure Portal].

1. Click **New**.
	
	![Create a new Azure resource][MarketplaceStart]
	
1. Search for **WordPress**, and then click **WordPress**. (If you wish to use SQL Database instead of MySQL, search for **Project Nami**.)

	![Search for WordPress in the Marketplace][MarketplaceSearch]
	
1. After reading the description of the WordPress app, click **Create**.

	![Create WordPress web app][MarketplaceCreate]

## Configure Azure App Service Settings for your New Web App

1. After you have created a new web app, the WordPress settings blade will be displayed, which you will use to complete the following steps:

	![Configure WordPress web app settings][ConfigStart]

1. Enter a name for the web app in the **Web app** box.

	This name must be unique in the azurewebsites.net domain because the URL of the web app will be *{name}*.azurewebsites.net. If the name you enter isn't unique, a red exclamation mark appears in the text box.

	![Configure the WordPress web app name][ConfigAppName]

1. If you have more than one subscription, choose the one you want to use. 

	![Configure the subscription for the web app][ConfigSubscription]

1. Select a **Resource Group** or create a new one.

	For more information about resource groups, see [Azure Resource Manager overview][ResourceGroups].

	![Configure the resource group for the web app][ConfigResourceGroup]

1. Select an **App Service plan/Location** or create a new one.

	For more information about App Service plans, see [Azure App Service plans overview][AzureAppServicePlans].	

	![Configure the service plan for the web app][ConfigServicePlan]

1. Click **Database**, and then in the **New MySQL Database** blade provide the required values for configuring your MySQL database.

	a. Enter a new name or leave the default name.

	b. Leave the **Database Type** set to **Shared**.

	c. Choose the same location as the one you chose for the web app.

	d. Choose a pricing tier. **Mercury** - which is free with minimal connections and disk space - is fine for this tutorial.

	e. In the **New MySQL Database** blade, accept the legal terms, and then click **OK**. 

	![Configure the database settings for the web app][ConfigDatabase]

1. In the **WordPress** blade, accept the legal terms, and then click **Create**. 

	![Finish the web app settings and click OK][ConfigFinished]

	Azure App Service creates the web app, typically in less than a minute. You can watch the progress by clicking the bell icon at the top of the portal page.

	![Progress indicator][ConfigProgress]

## Launch and manage your WordPress web app
	
1. When the web app creation is finished, navigate in the Azure Portal to the resource group in which you created the application, and you can see the web app and the database.

	The extra resource with the light bulb icon is [Application Insights][ApplicationInsights], which provides monitoring services for your web app.

1. In the **Resource group** blade, click the web app line.

	![Select your WordPress web app][WordPressSelect]

1. In the Web app blade, click **Browse**.

	![Browse to your WordPress web app][WordPressBrowse]

1. If you are prompted to select the language for your WordPress blog, select your desired language and then click **Continue**.

	![Configure the language for your WordPress web app][WordPressLanguage]

1. In the WordPress **Welcome** page, enter the configuration information required by WordPress, and then click **Install WordPress**.

	![Configure the settings your WordPress web app][WordPressConfigure]

1. Log in using the credentials you created on the **Welcome** page.  

1. Your site Dashboard page will open and display the information that you provided.    

	![View your WordPress dashboard][WordPressDashboard2]

## Next steps

In this tutorial you've seen how to create and deploy an example web app from the Azure Marketplace.

For more information about how to work with App Service Web Apps, see the links on the left side of the page (for wide browser windows) or at the top of the page (for narrow browser windows).

For more information about developing WordPress web apps on Azure, see [Developing WordPress on Azure App Service][WordPressOnAzure]. 

<!-- URL List -->

[PHP]: https://azure.microsoft.com/develop/php/
[.NET]: https://azure.microsoft.com/develop/net/
[Node.js]: https://azure.microsoft.com/develop/nodejs/
[Java]: https://azure.microsoft.com/develop/java/
[Python]: https://azure.microsoft.com/develop/python/
[activate]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[free trial]: https://azure.microsoft.com/pricing/free-trial/
[Try App Service]: http://go.microsoft.com/fwlink/?LinkId=523751
[ResourceGroups]: ../resource-group-overview.md
[AzureAppServicePlans]: ../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md
[ApplicationInsights]: https://azure.microsoft.com/services/application-insights/
[Azure Portal]: https://portal.azure.com/
[Project Nami]: http://projectnami.org/
[WordPressOnAzure]: ./develop-wordpress-on-app-service-web-apps.md

<!-- IMG List -->

[MarketplaceStart]: ./media/app-service-web-create-web-app-from-marketplace/marketplacestart.png
[MarketplaceSearch]: ./media/app-service-web-create-web-app-from-marketplace/marketplacesearch.png
[MarketplaceCreate]: ./media/app-service-web-create-web-app-from-marketplace/marketplacecreate.png
[ConfigStart]: ./media/app-service-web-create-web-app-from-marketplace/configstart.png
[ConfigAppName]: ./media/app-service-web-create-web-app-from-marketplace/configappname.png
[ConfigSubscription]: ./media/app-service-web-create-web-app-from-marketplace/configsubscription.png
[ConfigResourceGroup]: ./media/app-service-web-create-web-app-from-marketplace/configresourcegroup.png
[ConfigServicePlan]: ./media/app-service-web-create-web-app-from-marketplace/configserviceplan.png
[ConfigDatabase]: ./media/app-service-web-create-web-app-from-marketplace/configdatabase.png
[ConfigFinished]: ./media/app-service-web-create-web-app-from-marketplace/configfinished.png
[ConfigProgress]: ./media/app-service-web-create-web-app-from-marketplace/configprogress.png
[WordPressSelect]: ./media/app-service-web-create-web-app-from-marketplace/wpselect.png
[WordPressBrowse]: ./media/app-service-web-create-web-app-from-marketplace/wpbrowse.png
[WordPressLanguage]: ./media/app-service-web-create-web-app-from-marketplace/wplanguage.png
[WordPressDashboard1]: ./media/app-service-web-create-web-app-from-marketplace/wpdashboard1.png
[WordPressDashboard2]: ./media/app-service-web-create-web-app-from-marketplace/wpdashboard2.png
[WordPressConfigure]: ./media/app-service-web-create-web-app-from-marketplace/wpconfigure.png
