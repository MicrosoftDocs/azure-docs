<properties 
	pageTitle="How to Scale a Web App in an App Service Environment" 
	description="Scaling a web app in an App Service Environment" 
	services="app-service\web" 
	documentationCenter="" 
	authors="ccompy" 
	manager="stefsch" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="ccompy"/>

# Scaling web apps in an App Service Environment #

At a high level, App Service Environments are essentially personal deployments of the Azure App Service into your VNET and only manageable by your subscription. They offer new networking capabilities because they are in your VNET and can also be scaled beyond what is normally available in the Azure App Service environments.  If you need more information around what an App Service Environment(ASE) is then see [What is an App Service Environment][WhatisASE].  For details around creating an App Service Environment or creating a web app in an App Service Environment see [How to Create an App Service Environment][HowtoCreateASE] and [How to create a web app in an App Service Environment][CreateWebappinASE]

As a quick reminder, when you normally change a scale attribute for a web app, you are changing that at an App Service Plan level.  For details around scaling App Service Plans or just for details on App Service Plans outside of the App Service Environments see [Scale a web app in Azure App Service][ScaleWebapp] and [App Service Plans in depth overview][Appserviceplans].

Scaling a web app in an App Service Environment is very similar to scaling web apps normally.  In the Azure App Service there are normally three things you can scale:

- pricing plan
- worker size (for dedicated instances)
- number of instances.

In an ASE there is no need to select or change the pricing plan.  In terms of capabilities it is already at a Premium pricing capability level.  In an App Service Environment there are also no shared workers.  They are all dedicated workers.  Instead of fixed sizes, the ASE admin can assign the size of the compute resource to be used for each worker pool.  That means you can have Worker Pool 1 with P4 compute resources and Worker Pool 2 with P1 compute resources, if desired.  They do not have to be in size order.  For details around the sizes and their pricing see the document here [Azure App Service Pricing][AppServicePricing].  This leaves the scaling options for web apps and App Service Plans in an App Service Environment to be:

- worker pool selection
- number of instances

Changing either item is done through the appropriate UI shown with your App Service Plan.

![][1]

### Scaling the number of instances ###

When you first create your web app in an App Service Environment you should scale it up to at least 2 instances to provide fault tolerance.   

If your ASE has enough capacity then this is pretty simple.  You go to your App Service Plan that holds the sites you want to scale up and select Scale.  This opens the UI where you simply slide the instance indicator up to the desired value and save.  

![][2]

You won't be able to scale up your App Service Plan beyond the number of available compute resources in the worker pool that your App Service Plan is in.  If you need more you need to get your ASE administrator to add more compute resources to the worker pool that you need them in.  For information around re-configuring your ASE read the information here: [How to Configure an App Service environment][HowtoConfigureASE] 
 

### Worker Pool selection ###

The worker pool selection is accessed from the App Service Plan UI.  Open the App Service Plan that you want to scale and select worker pool.  You will see all of the worker pools which you have configured in your App Service Environment.  If you have only one worker pool then you will only see the one pool listed.  To change what worker pool your App Service Plan is in, you simply select the worker pool you want your App Service Plan to move to.  

![][3]

Before doing this it is important to make sure you will have adequate capacity for your App Service Plan.  In the list of worker pools, not only is the worker pool name listed but you can also see how many workers are available in that worker pool.  Make sure that there are enough instances available to contain your App Service Plan.  If you need more compute resources in the worker pool you wish to move to, then get your ASE administrator to add them.  

Moving a web app from one worker pool will cause a restart of your web apps.  This can cause a small amount of downtime for your app depending on how long it takes to restart.  

## Getting started

To get started with App Service Environments, see [How To Create An App Service Environment][HowtoCreateASE]

For more information about the Azure App Service platform, see [Azure App Service][AzureAppService].

[AZURE.INCLUDE [app-service-web-whats-changed](../includes/app-service-web-whats-changed.md)]

[AZURE.INCLUDE [app-service-web-try-app-service](../includes/app-service-web-try-app-service.md)]

<!--Image references-->
[1]: ./media/app-service-web-scale-a-web-app-in-an-app-service-environment/scaleasp.png
[2]: ./media/app-service-web-scale-a-web-app-in-an-app-service-environment/scaleinstances.png
[3]: ./media/app-service-web-scale-a-web-app-in-an-app-service-environment/scalepool.png

<!--Links-->
[WhatisASE]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-intro/
[ScaleWebapp]: http://azure.microsoft.com/documentation/articles/web-sites-scale/
[HowtoCreateASE]: http://azure.microsoft.com/documentation/articles/app-service-web-how-to-create-an-app-service-environment/
[HowtoConfigureASE]: http://azure.microsoft.com/documentation/articles/app-service-web-configure-an-app-service-environment/
[CreateWebappinASE]: http://azure.microsoft.com/documentation/articles/app-service-web-how-to-create-a-web-app-in-an-ase/
[Appserviceplans]: http://azure.microsoft.com/documentation/articles/azure-web-sites-web-hosting-plans-in-depth-overview/
[AppServicePricing]: http://azure.microsoft.com/pricing/details/app-service/ 
[AzureAppService]: http://azure.microsoft.com/documentation/articles/app-service-value-prop-what-is/
