---
title: How to Scale an App in an App Service Environment - Azure
description: Scaling an app in an App Service Environment
services: app-service
documentationcenter: ''
author: ccompy
manager: stefsch
editor: jimbe

ms.assetid: 78eb1e49-4fcd-49e7-b3c7-f1906f0f22e3
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/17/2016
ms.author: ccompy
ms.custom: seodec18

---
# Scaling apps in an App Service Environment
In the Azure App Service there are normally three things you can scale:

* pricing plan
* worker size 
* number of instances.

In an ASE there is no need to select or change the pricing plan.  In terms of capabilities it is already at a Premium pricing capability level.  

With respect to worker sizes, the ASE admin can assign the size of the compute resource to be used for each worker pool.  That means you can have Worker Pool 1 with P4 compute resources and Worker Pool 2 with P1 compute resources, if desired.  They do not have to be in size order.  For details around the sizes and their pricing see the document here [Azure App Service Pricing][AppServicePricing].  This leaves the scaling options for web apps and App Service Plans in an App Service Environment to be:

* worker pool selection
* number of instances

Changing either item is done through the appropriate UI shown for your ASE hosted App Service Plans.  

![][1]

You can't scale up your ASP beyond the number of available compute resources in the worker pool that your ASP is in.  If you need compute resources in that worker pool you need to get your ASE administrator to add them.  For information around re-configuring your ASE read the information here: [How to Configure an App Service environment][HowtoConfigureASE].  You may also want to take advantage of the ASE autoscale features to add capacity based on schedule or metrics.  To get more details on configuring autoscale for the ASE environment itself see [How to configure autoscale for an App Service Environment][ASEAutoscale].

You can create multiple app service plans using compute resources from different worker pools, or you can use the same worker pool.  For example if you have (10) available compute resources in Worker Pool 1, you can choose to create one app service plan using (6) compute resources, and a second app service plan that uses (4) compute resources.

### Scaling the number of instances
When you first create your web app in an App Service Environment it starts with 1 instance.  You can then scale out to additional instances to provide additional compute resources for your app.   

If your ASE has enough capacity then this is pretty simple.  You go to your App Service Plan that holds the sites you want to scale up and select Scale.  This opens the UI where you can manually set the scale for your ASP or configure autoscale rules for your ASP.  To manually scale your app simply set ***Scale by*** to ***an instance count that I enter manually***.  From here either drag the slider to the desired quantity or enter it in the box next to the slider.  

![][2] 

The autoscale rules for an ASP in an ASE work the same as they do normally.  You can select ***CPU Percentage*** under ***Scale by*** and create autoscale rules for your ASP based on CPU Percentage or you can create more complex rules using ***schedule and performance rules***.  To see more complete details on configuring autoscale use the guide here [Scale an app in Azure App Service][AppScale]. 

### Worker Pool selection
As noted earlier, the worker pool selection is accessed from the ASP UI.  Open the blade for the ASP that you want to scale and select worker pool.  You will see all of the worker pools which you have configured in your App Service Environment.  If you have only one worker pool then you will only see the one pool listed.  To change what worker pool your ASP is in, you simply select the worker pool you want your App Service Plan to move to.  

![][3]

Before moving your ASP from one worker pool to another it is important to make sure you will have adequate capacity for your ASP.  In the list of worker pools, not only is the worker pool name listed but you can also see how many workers are available in that worker pool.  Make sure that there are enough instances available to contain your App Service Plan.  If you need more compute resources in the worker pool you wish to move to, then get your ASE administrator to add them.  

> [!NOTE]
> Moving an ASP from one worker pool will cause cold starts of the apps in that ASP.  This can cause requests to run slowly as your app is cold started on the new compute resources.  The cold start can be avoided by using the [application warm up capability][AppWarmup] in Azure App Service.  The Application Initialization module described in the article also works for cold starts because the initialization process is also invoked when apps are cold started on new compute resources. 
> 
> 

## Getting started
To get started with App Service Environments, see [How To Create An App Service Environment][HowtoCreateASE]

<!--Image references-->
[1]: ./media/app-service-web-scale-a-web-app-in-an-app-service-environment/aseappscale-aspblade.png
[2]: ./media/app-service-web-scale-a-web-app-in-an-app-service-environment/aseappscale-manualscale.png
[3]: ./media/app-service-web-scale-a-web-app-in-an-app-service-environment/aseappscale-sizescale.png

<!--Links-->
[WhatisASE]: app-service-app-service-environment-intro.md
[ScaleWebapp]: ../web-sites-scale.md
[HowtoCreateASE]: app-service-web-how-to-create-an-app-service-environment.md
[HowtoConfigureASE]: app-service-web-configure-an-app-service-environment.md
[CreateWebappinASE]: app-service-web-how-to-create-a-web-app-in-an-ase.md
[Appserviceplans]: ../overview-hosting-plans.md
[AppServicePricing]: https://azure.microsoft.com/pricing/details/app-service/ 
[ASEAutoscale]: app-service-environment-auto-scale.md
[AppScale]: ../web-sites-scale.md
[AppWarmup]: https://ruslany.net/2015/09/how-to-warm-up-azure-web-app-during-deployment-slots-swap/
