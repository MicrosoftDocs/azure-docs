<properties 
	pageTitle="How to Scale a Web App in an App Service Environment" 
	description="Scaling a web app in an App Service Environment" 
	services="app-services\web" 
	documentationCenter="" 
	authors="ccompy" 
	manager="stefsch" 
	editor=""/>

<tags 
	ms.service="app-services-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="ccompy"/>

# Scaling web apps in an App Service Environment #

At a high level, App Service Environments are essentially personal deployments of Azure App Services in your VNET and only manageable by your subscription. They offer new networking capabilities because they are in your VNET and can also be scaled beyond the limitations in the multi-tenant environments.  If you need more information around what an App Service Environment(ASE) is then see [What is an App Service Environment][WhatisASE].  For details around creating an App Service Environment or creating a web app in an App Service Environment see [How to Create an App Service Environment][HowtoCreateASE] and [How to create a web app in an App Service Environment][CreateWebappinASE]

As a quick reminder, when you change a scale attribute for a web app in the multi-tenant stamps you are changing that at an App Service Plan level.  App Service Plans are the containers that hold your web apps.  For details around scaling or App Service Plans in the multi-tenant stamps see [Scale a web app in Azure App Service][ScaleWebapp] and [App Service Plans in depth overview][Appserviceplans].

Scaling a web app in an App Service Environment is very similar to scaling web apps normally.  In a multi-tenant stamp you have 3 scale options:

- pricing plan
- worker size (for dedicated instances)
- number of instances.

In an ASE there is no need to select or change the pricing plan.  In terms of capabilities it is already at a Premium pricing capability level.  In an App Service Environment there are also no shared workers.  They are all dedicated workers.  Instead of fixed sizes though, the ASE admin can assign the size of the VM to be used for each worker pool.  That means you can have Worker Pool 1 with Extra Large VMs and Worker Pool 2 with Small VM's, if desired.  They do not have to be in size order.  This leaves the scaling options for web apps and App Service Plans in an App Service Environment to be:

- worker pool selection
- number of instances

Changing either item is done through the appropriate UI shown with your App Service Plan.

![][1]

### Number of instances ###

When you first create your web app in an App Service Environment you should scale it up to at least two instances to provide fault tolerance.  

If your ASE has enough capacity then this is pretty simple.  You go to your App Service Plan that holds the sites you want to scale up and select Scale.  This opens the UI where you simply slide the instance indicator up to the desired value and save.  

![][2]

You won't be able to scale up your App Service Plan beyond the number of available VM's in the worker pool that your App Service Plan is in.  If you need more you need to get your ASE administrator to create additional VMs in the worker pool that your need them in.  For information around re-configuring your ASE read the information here: [How to Configure an App Service environment][HowtoConfigureASE] 
 

### Worker Pool selection ###

The worker pool selection is accessed from the App Service Plan UI.  Open the App Service Plan that you want to scale and select worker pool.  You will see all of the worker pools which you have configured in your App Service Environment.  If you have only one worker pool then you will only see the one pool listed.  To change what worker pool your App Service Plan is in, you simply select the worker pool you want your App Service Plan to move to.  

![][3]

Before doing this it is important to make sure you will have adequate capacity for your App Service Plan.  In the list of worker pools, not only is the worker pool name listed but you can also see how many workers are available in that worker pool.  Make sure that there are enough instances available to contain your App Service Plan.  If you need more VMs in the worker pool you wish to move to then get your ASE administrator to add them.  

Moving a web app from one worker pool will cause a restart of your web apps.  This can cause a small amount of downtime for your app depending on how long it takes to restart.  

<!--Image references-->
[1]: ./media/app-service-web-scale-a-web-app-in-an-app-service-environment/scaleasp.png
[2]: ./media/app-service-web-scale-a-web-app-in-an-app-service-environment/scaleinstances.png
[3]: ./media/app-service-web-scale-a-web-app-in-an-app-service-environment/scalepool.png

<!--Links-->
[WhatisASE]: http://azure.microsoft.com/documentation/articles/app-service-web-what-is-an-app-service-environment/
[ScaleWebapp]: http://azure.microsoft.com/documentation/articles/web-sites-scale/
[HowtoCreateASE]: http://azure.microsoft.com/documentation/articles/app-service-web-how-to-create-an-app-service-environment/
[HowtoConfigureASE]: http://azure.microsoft.com/documentation/articles/app-service-web-configure-an-app-service-environment/
[CreateWebappinASE]: http://azure.microsoft.com/documentation/articles/app-service-web-how-to-create-a-web-app-in-an-app-service-environment/
[Appserviceplans]: http://azure.microsoft.com/documentation/articles/azure-web-sites-web-hosting-plans-in-depth-overview/