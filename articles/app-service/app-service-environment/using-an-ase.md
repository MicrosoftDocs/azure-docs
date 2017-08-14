---
title: Using an Azure App Service Environment
description: How to create, publish and scale apps in an Azure App Service Environment
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: a22450c4-9b8b-41d4-9568-c4646f4cf66b
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: ccompy
---
# Using an App Service Environment #

## Overview ##

An App Service Environment (ASE) is a deployment of the Azure App Service into a subnet in a customer’s Azure Virtual Network (VNet). It consists of:

- Front Ends – This is where HTTP/HTTPS terminates in an ASE
- Workers – These are the resources that host your apps
- Database – This holds information that defines the environment
- Storage – The storage is used to host the customer published apps

> [!NOTE]
> There are two versions of the App Service Environment: ASEv1 and ASEv2. In ASEv1, you must manage the resources before you could use them. To learn how to configure and manage an ASEv1, see [Configure an App Service Environment v1][ConfigureASEv1]. The rest of this document is focused on ASEv2.
>
>

You can deploy an ASE (both ASEv1 and ASEv2) with an external VIP for app access or an internal VIP for app access. The deployment with an external VIP is commonly called an External ASE and the internal version is called the ILB ASE because it uses an Internal Load Balancer (ILB). To learn more about the ILB ASE, see [Creating and using an ILB ASE][MakeILBASE].

## Create a web app in an ASE ##

Creating a web app in an ASE is the same process as creating it normally with just a few small differences. When creating a new App Service plan:

- Instead of picking a geographic location to deploy your app, you pick an ASE as your location
- All App Service plans created in an ASE must be in an Isolated pricing tier.

If you do not have an ASE, you can create one by following the instructions at [Create an App Service Environment][MakeExternalASE].

To create a web app in an ASE:

1. Click **New &gt; Web and Mobile**, select **Web App**.
2. Provide a name for the web app. If you already selected an App Service plan in an ASE, then the domain name for the app will reflect the domain name of the ASE.

	![][1]

1. Select a subscription.
2. Provide a name for a new resource group or select **Use existing** and pick one from the drop down.
3. Select an existing App Service plan in your ASE or create a new one with the following steps:
	1. Select **Create New**.
	2. Provide the name for your App Service plan.
	3. Select your ASE in the **Location** drop down.
	4. Select an **Isolated** pricing tier. Click **Select**.
	5. Click **Okay**.
	
	![][2]
1. Click **Create**.

## How scale works ##

Every App Service app runs in an App Service plan. The container model is: environments hold App Service plans, and App Service plans hold apps. When you scale an app, you scale the App Service plan and thus scale all the apps in the same plan.

In an ASEv2, when you scale an App Service plan, the needed infrastructure is automatically added. This is different from ASEv1 where the needed infrastructure needs to be added before you can create or scale out your App Service plan. In ASEv2, this means that there is a time delay to scale operations as the infrastructure is added.

In the multi-tenant App Service, scaling is usually immediate because there is a readily available pool of resources that can be used to support scale-out. In an ASE there is no such buffer and resources are allocated upon need.

In an ASE you can scale up to 100 instances. Those 100 instances can be all in one single App Service plan or distributed across multiple App Service plans.

## IP addresses ##

App Service has the ability to allocate a dedicated IP address to an app. This capability is available by configuring an IP-based SSL as described here: [Bind an existing custom SSL certificate to Azure Web Apps][ConfigureSSL]. However, in an ASE, there is a notable exception: you cannot add additional IP addresses to be used for IP-based SSL in an ILB ASE.

In ASEv1, you need to allocate the IP addresses as resources before you can use them. In ASEv2 you simply use it from your app just as you would in the multi-tenant App Service. There is always one spare address in an ASEv2 up to 30 IP addresses. Each time you use one, another is added so that there is always a readily available address for use. There is a time delay required to allocate another IP address which does prevent adding IP addresses in quick succession.

## Front end scaling ##

In an ASEv2, when you scale out your App Service plans, the workers are automatically added to support them. In addition to the two Front Ends that every ASE is created with, the Front Ends are also automatically scaled out at a rate of one Front End for every 15 instances in your App Service plans. That means that if you have 15 instances, then you have three Front Ends. If you scale to 30 instances, then you have four Front Ends, and so on.

This should be more than enough for most scenarios, but if there is a need to scale out at a faster rate, you can change the ratio to as low as one Front End for every 5 instances in your App Service plans. There is a charge for changing the ratio, as outlined in [Azure App Service Pricing][Pricing].

Front End resources are the HTTP/HTTPS endpoint for the ASE. With the default front end configuration, memory usage per Frond End is consistently around 60%. Customer workloads do not run on a Front End. The key factor for a Front End with respect to scale is the CPU, which is driven primarily by HTTPS traffic.

## App access ##

In an External ASE, the domain used when creating apps is different from the multi-tenant App Service and includes the name of the ASE. For more information on creating an External ASE, see [Creating an App Service Environment][MakeExternalASE]. The domain name in an External ASE looks like *.&lt;asename&gt;.p.azurewebsites.net*. That means that if your ASE is named _external-ase_, and you host an app called _contoso_ in that ASE, then you would reach it at the following URLs:

- contoso.external-ase.p.azurewebsites.net
- contoso.scm.external-ase.p.azurewebsites.net

The URL *contoso.scm.external-ase.p.azurewebsites.net* is used to access the Kudu console or for publishing your app using web deploy. For information on the Kudu console, see [Kudu console for Azure App Service][Kudu]. The Kudu console gives you a web UI for debugging, uploading files, editing files and much more.

In an ILB ASE, you determine the domain at deployment time. For more information on creating an ILB ASE, see [Create and use an ILB ASE][MakeILBASE]. If you specify the domain name _ilb-ase.info_, then the apps in that ASE use that domain during app creation. For the app named _contoso_, the URLs would be:

- contoso.ilb-ase.info
- contoso.scm.ilb-ase.info

## Publishing ##

Just as with the multi-tenant App Service, in an ASE, you can publish with:

- web deploy
- FTP
- Continuous integration
- Drag and drop in the Kudu console
- An IDE such as Visual Studio, Eclipse or Intellij IDEA

With an External ASE, this all behaves the same. For information, see [Deployment in Azure App Service][AppDeploy]. 

The big difference with publishing is with respect to an ILB ASE. With an ILB ASE the publishing endpoints are all only available through the ILB. The ILB is on a private IP in the ASE subnet in the Virtual Network. If you don’t have network access to the ILB, you cannot publish any apps on that ASE. As noted in [Create and use an ILB ASE][MakeILBASE], you need to configure DNS for the apps in the system. That includes the SCM endpoint. If they are not defined properly, then you won't be able to publish. Your IDEs also need to have network access to the ILB in order to publish directly to it.

Internet-based CI systems, such as Github and VSTS, don't work with an ILB ASE as the publishing endpoint is not internet accessible. Instead, you need to use a CI system that uses a pull model, such as Dropbox.

The publishing endpoints for apps in an ILB ASE use the domain that the ILB ASE was created with. This can be seen in the app's publishing profile, and in the app's portal blade (in **Overview** > **Essentials** and also in **Properties**). 

## Pricing ##

With ASEv2, there is a new pricing SKU that is used only with ASEv2 called **Isolated**. All App Service plans that are hosted in an ASEv2 are in the Isolated pricing SKU. In addition to the price for your App Service plans, there is a flat fee for ASE itself. This price does not change with the size of your ASE. 

The other potential fees are for adjusting the Front End scale ratio or Front End size. If you adjust the scale ratio so that Front Ends are added more quickly, you'll pay for any additional cores that would not have been automatically added to the system. Likewise, if you select a larger size for the Front Ends, you'll pay for any cores that were not being automatically allocated. For example, if you adjust the scale ratio to 10, that means that a Front End is added for every 10 instances in your App Service plans. The flat fee covers a scale rate of 1 Front End for every 15 instances. With a scale ratio of 10, you'll pay a fee for the third Front End that is added for the 10 ASP instances, but you won't need to pay for it when you reach 15 instances, since it would have been added automatically.

For more information, see [Azure App Service Pricing][Pricing].

## Deleting an ASE ##

If you want to delete an App Service Environment, simply use the **Delete** action at the top of the App Service Environment blade. When you do this, you'll be prompted to enter the name of your App Service Environment to confirm that you really want to do this. Note that when you delete an App Service Environment, you delete all of the content within it as well. 

![][3]

<!--Image references-->
[1]: ./media/using_an_app_service_environment/usingase-appcreate.png
[2]: ./media/using_an_app_service_environment/usingase-pricingtiers.png
[3]: ./media/using_an_app_service_environment/usingase-delete.png


<!--Links-->
[Intro]: ./intro.md
[MakeExternalASE]: ./create-external-ase.md
[MakeASEfromTemplate]: ./create-from-template.md
[MakeILBASE]: ./create-ilb-ase.md
[ASENetwork]: ./network-info.md
[ASEReadme]: ./readme.md
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/virtual-networks-nsg.md
[ConfigureASEv1]: ../../app-service-web/app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: ../../app-service-web/app-service-app-service-environment-intro.md
[webapps]: ../../app-service-web/app-service-web-overview.md
[mobileapps]: ../../app-service-mobile/app-service-mobile-value-prop.md
[APIapps]: ../../app-service-api/app-service-api-apps-why-best-platform.md
[Functions]: ../../azure-functions/index.yml
[Pricing]: http://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/resource-group-overview.md
[ConfigureSSL]: ../../app-service-web/web-sites-purchase-ssl-web-site.md
[Kudu]: http://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[AppDeploy]: ../../app-service-web/web-sites-deploy.md
[ASEWAF]: ../../app-service-web/app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../application-gateway/application-gateway-web-application-firewall-overview.md
