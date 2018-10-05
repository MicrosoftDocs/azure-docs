---
title: Use an Azure App Service environment
description: How to create, publish, and scale apps in an Azure App Service environment
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
# Use an App Service environment #

## Overview ##

Azure App Service Environment is a deployment of Azure App Service into a subnet in a customer’s Azure virtual network. It consists of:

- **Front ends**: The front ends are where HTTP/HTTPS terminates in an App Service environment (ASE).
- **Workers**: The workers are the resources that host your apps.
- **Database**: The database holds information that defines the environment.
- **Storage**: The storage is used to host the customer-published apps.

> [!NOTE]
> There are two versions of App Service Environment: ASEv1 and ASEv2. In ASEv1, you must manage the resources before you can use them. To learn how to configure and manage ASEv1, see [Configure an App Service environment v1][ConfigureASEv1]. The rest of this article focuses on ASEv2.
>
>

You can deploy an ASE (ASEv1 and ASEv2) with an external or internal VIP for app access. The deployment with an external VIP is commonly called an External ASE. The internal version is called the ILB ASE because it uses an internal load balancer (ILB). To learn more about the ILB ASE, see [Create and use an ILB ASE][MakeILBASE].

## Create a web app in an ASE ##

To create a web app in an ASE, you use the same process as when you create it normally, but with a few small differences. When you create a new App Service plan:

- Instead of choosing a geographic location in which to deploy your app, you choose an ASE as your location.
- All App Service plans created in an ASE must be in an Isolated pricing tier.

If you don't have an ASE, you can create one by following the instructions in [Create an App Service environment][MakeExternalASE].

To create a web app in an ASE:

1. Select **Create a resource** > **Web + Mobile** > **Web App**.

1. Enter a name for the web app. If you already selected an App Service plan in an ASE, the domain name for the app reflects the domain name of the ASE.

	![Web app name selection][1]

1. Select a subscription.

1. Enter a name for a new resource group, or select **Use existing** and select one from the drop-down list.

1. Select your OS. 

    * Hosting a Linux app in an ASE is a new preview feature, so we suggest that you do not add Linux apps into an ASE that is currently running production workloads. 
    * Adding a Linux app into an ASE means that the ASE will also be in preview mode. 

1. Select an existing App Service plan in your ASE, or create a new one by following these steps:

	a. Select **Create New**.

	b. Enter the name for your App Service plan.

	c. Select your ASE in the **Location** drop-down list. Hosting a Linux app in an ASE is only enabled in 6 regions, at the moment: **West US, East US, West Europe, North Europe, Australia East, Southeast Asia.** 

	d. Select an **Isolated** pricing tier. Select **Select**.

	e. Select **OK**.
	
	![Isolated pricing tiers][2]

	> [!NOTE]
	> Linux web apps and Windows web apps cannot be in the same App Service Plan, but can be in the same App Service Environment. 
	>

1. Select **Create**.

## How scale works ##

Every App Service app runs in an App Service plan. The container model is environments hold App Service plans, and App Service plans hold apps. When you scale an app, you scale the App Service plan and thus scale all the apps in the same plan.

In ASEv2, when you scale an App Service plan, the needed infrastructure is automatically added. There is a time delay to scale operations while the infrastructure is added. In ASEv1, the needed infrastructure must be added before you can create or scale out your App Service plan. 

In the multitenant App Service, scaling is usually immediate because a pool of resources is readily available to support it. In an ASE, there is no such buffer, and resources are allocated upon need.

In an ASE, you can scale up to 100 instances. Those 100 instances can be all in one single App Service plan or distributed across multiple App Service plans.

## IP addresses ##

App Service has the ability to allocate a dedicated IP address to an app. This capability is available after you configure an IP-based SSL, as described in [Bind an existing custom SSL certificate to Azure web apps][ConfigureSSL]. However, in an ASE, there is a notable exception. You can't add additional IP addresses to be used for an IP-based SSL in an ILB ASE.

In ASEv1, you need to allocate the IP addresses as resources before you can use them. In ASEv2, you use them from your app just as you do in the multitenant App Service. There is always one spare address in ASEv2 up to 30 IP addresses. Each time you use one, another is added so that an address is always readily available for use. A time delay is required to allocate another IP address, which prevents adding IP addresses in quick succession.

## Front-end scaling ##

In ASEv2, when you scale out your App Service plans, workers are automatically added to support them. Every ASE is created with two front ends. In addition, the front ends automatically scale out at a rate of one front end for every 15 instances in your App Service plans. For example, if you have 15 instances, then you have three front ends. If you scale to 30 instances, then you have four front ends, and so on.

This number of front ends should be more than enough for most scenarios. However, you can scale out at a faster rate. You can change the ratio to as low as one front end for every five instances. There is a charge for changing the ratio. For more information, see [Azure App Service pricing][Pricing].

Front-end resources are the HTTP/HTTPS endpoint for the ASE. With the default front-end configuration, memory usage per front end is consistently around 60 percent. Customer workloads don't run on a front end. The key factor for a front end with respect to scale is the CPU, which is driven primarily by HTTPS traffic.

## App access ##

In an External ASE, the domain that's used when you create apps is different from the multitenant App Service. It includes the name of the ASE. For more information on how to create an External ASE, see [Create an App Service environment][MakeExternalASE]. The domain name in an External ASE looks like *.&lt;asename&gt;.p.azurewebsites.net*. For example, if your ASE is named _external-ase_ and you host an app called _contoso_ in that ASE, you reach it at the following URLs:

- contoso.external-ase.p.azurewebsites.net
- contoso.scm.external-ase.p.azurewebsites.net

The URL contoso.scm.external-ase.p.azurewebsites.net is used to access the Kudu console or for publishing your app by using web deploy. For information on the Kudu console, see [Kudu console for Azure App Service][Kudu]. The Kudu console gives you a web UI for debugging, uploading files, editing files, and much more.

In an ILB ASE, you determine the domain at deployment time. For more information on how to create an ILB ASE, see [Create and use an ILB ASE][MakeILBASE]. If you specify the domain name _ilb-ase.info_, the apps in that ASE use that domain during app creation. For the app named _contoso_, the URLs are:

- contoso.ilb-ase.info
- contoso.scm.ilb-ase.info

## Publishing ##

As with the multitenant App Service, in an ASE you can publish with:

- Web deployment.
- FTP.
- Continuous integration.
- Drag and drop in the Kudu console.
- An IDE, such as Visual Studio, Eclipse, or IntelliJ IDEA.

With an External ASE, these publishing options all behave the same. For more information, see [Deployment in Azure App Service][AppDeploy]. 

The major difference with publishing is with respect to an ILB ASE. With an ILB ASE, the publishing endpoints are all available only through the ILB. The ILB is on a private IP in the ASE subnet in the virtual network. If you don’t have network access to the ILB, you can't publish any apps on that ASE. As noted in [Create and use an ILB ASE][MakeILBASE], you need to configure DNS for the apps in the system. That includes the SCM endpoint. If they're not defined properly, you can't publish. Your IDEs also need to have network access to the ILB in order to publish directly to it.

Internet-based CI systems, such as GitHub and Azure DevOps, don't work with an ILB ASE because the publishing endpoint is not Internet accessible. Instead, you need to use a CI system that uses a pull model, such as Dropbox.

The publishing endpoints for apps in an ILB ASE use the domain that the ILB ASE was created with. You can see it in the app's publishing profile and in the app's portal blade (in **Overview** > **Essentials** and also in **Properties**). 

## Pricing ##

The pricing SKU called **Isolated** was created for use only with ASEv2. All App Service plans that are hosted in ASEv2 are in the Isolated pricing SKU. Isolated App Service plan rates can vary per region. 

In addition to the price for your App Service plans, there is a flat rate for ASE itself. The flat rate doesn't change with the size of your ASE and pays for the ASE infrastructure at a default scaling rate of 1 additional front-end for every 15 App Service plan instances.  

If the default scale rate of 1 front end for every 15 App Service plan instances is not fast enough, you can adjust the ratio at which front-ends are added or the size of the front-ends.  When you adjust the ratio or size, you pay for the front-end cores that would not be added by default.  

For example, if you adjust the scale ratio to 10, a front end is added for every 10 instances in your App Service plans. The flat fee covers a scale rate of one front end for every 15 instances. With a scale ratio of 10, you pay a fee for the third front end that's added for the 10 App Service plan instances. You don't need to pay for it when you reach 15 instances because it was added automatically.

If you adjusted the size of the front-ends to 2 cores but do not adjust the ratio then you pay for the extra cores.  An ASE is created with 2 front-ends, so even below the automatic scaling threshold you would pay for 2 extra cores if you increased the size to 2 core front-ends.

For more information, see [Azure App Service pricing][Pricing].

## Delete an ASE ##

To delete an ASE: 

1. Use **Delete** at the top of the **App Service Environment** blade. 

1. Enter the name of your ASE to confirm that you want to delete it. When you delete an ASE, you delete all of the content within it as well. 

	![ASE deletion][3]

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
[UsingASE]: ./using-an-ase.md
[UDRs]: ../../virtual-network/virtual-networks-udr-overview.md
[NSGs]: ../../virtual-network/security-overview.md
[ConfigureASEv1]: app-service-web-configure-an-app-service-environment.md
[ASEv1Intro]: app-service-app-service-environment-intro.md
[Functions]: ../../azure-functions/index.yml
[Pricing]: http://azure.microsoft.com/pricing/details/app-service/
[ARMOverview]: ../../azure-resource-manager/resource-group-overview.md
[ConfigureSSL]: ../web-sites-purchase-ssl-web-site.md
[Kudu]: http://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/
[AppDeploy]: ../app-service-deploy-local-git.md
[ASEWAF]: app-service-app-service-environment-web-application-firewall.md
[AppGW]: ../../application-gateway/application-gateway-web-application-firewall-overview.md
