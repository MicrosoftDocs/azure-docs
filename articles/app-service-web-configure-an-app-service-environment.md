<properties 
	pageTitle="How to Configure an App Service Environment" 
	description="Configuration, management and monitoring of App Service Environments" 
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

# Configuring an App Service Environment #

App Service Environments is a new Premium Tier capability that is being offered in Preview.  It offers new scaling and network access capabilities that are not available in the multi-tenant environments.  This new scale capability essentially allows you to place an instance of Azure App Services into your VNET.  If you are unfamiliar with the App Service Environment (ASE) capability then read the document here [What is an App Service Environment][WhatisASE]. For information on how to create an ASE read the document here [How to Create an App Service Environment][HowtoCreateASE]. 

At a high level an App Service Environment consists of several major components:

- VMs running in the Azure App Environment Hosted Service
- Storage
- Database
- Virtual Network with at least one subnet
- subnet with the Azure App Environment hosted service running in it

To help manage and monitor your App Service Environments you can access UI for that purpose from Browse -> App Service Environments in the new Azure portal. The initial release does have what you need to manage the system and will continue to improve with additional capabilities in coming weeks.  

![][1]

##### Monitoring #####

There aren't many metrics capabilities available in the initial Preview release but they will be rolling out shortly.  Those metrics capabilities will help system administrators to make decisions on system scaling and operations.

Even now in the portal you can list all of the App Service Plans in the ASE as well as all of the web apps in the App Service Environment.  To see either list go to Settings and select the item you are interested in.  

![][3]

In both lists you can see the Worker Pool assignment with how many instances and the size of the VM that is being used.  Details around the performance within an individual App Service Plan will be available the same way it is today in the multi-tenant stamps which is by opening up the App Service Plan UI.  For details around scaling web apps in an App Service Environment go here [Scaling Web Apps in an App Service Environment][HowtoScale]

![][4]

##### Virtual Machines ######

The VM's, Storage and Database are all operated by Azure App Services.  The quantity and sizes of VMs though are up to the user to decide.  

Before describing how to adjust the VMs it is worth describing what they are used for.  An App Service Environment consists of Front End servers and Workers.  The Front End servers handle the app connection load and Workers run the app code.  If you have a large number of requests for simple web apps you would likely scale up your Front Ends with fewer workers.  If you have CPU or memory intensive web apps with light traffic then you wouldn't need many Front Ends but likely need more or bigger workers.  

The Workers are managed in 3 separate pools. Each pool can be scaled independently with varied quantities and sizes.  You do not need to allocate VMs to all 3 worker pools.  If desired you can just have 1.  It all depends on the types of workloads you need to host.

Based on load needs a complete ASE system can be configured to use up to 53 total VMs.  At maximum allocation, 3 of those VMs are not available for workload allocation but are to ensure fault tolerance. 

As noted earlier, the App Service Environment feature is currently in Preview and as such it still has room to grow.  In addition to additional monitoring capabilities, more management features will be rolled out as App Service Environments moves to GA.  For now there are only a few things that can be managed in this interface:

- Number of VMs in each pool
- Size of the VMs in each pool
- Number of IP addresses available

To control these things select the Scale configuration item at the top.  

![][2]

The quantity of VMs in each pool and the size of the VM used in each pool can be adjusted here.  Before making any changes though it is important to note a few things:

- changes made can take hours to complete depending on how many changes are requested
- when there is already a system environment change in work, you cannot start another change
- if you change the size of the VMs used in a worker pool you can cause outages in the web apps running in that worker pool

Adding additional instances to a Worker Pool is a benign operation and does not incur a system impact.  Changing the size of the VM used in a Worker Pool is another story though.  It is best to leverage an unused Worker Pool to bring up the instances required in the size desired and then to scale your App Service Plans to that Worker Pool.  This operation is much less disruptive to the system than changing the VM sizes with running workloads.  

##### Virtual Network #####

The [Virtual Network][virtualnetwork] and subnet are all under user control.  App Service Environments does have a few network requirements but the rest is up to the user to control.  Those ASE requirements are; a VNET with at least 512 addresses, a subnet with at least 256 addreses and the VNET must be a regional subnet.  Administering your VNET is done through the normal Virtual Network UI.

Because this capability places Azure App Services into your VNET it means that your apps hosted in your ASE can now access resources made available through ExpressRoute or Site to Site VPNs directly.  Unlike in the multi-tenant environments, the apps within your App Service Environments do not require additional networking features to access resources available to the VNET hosting your App Service Environment.  

If desired you can also now control access using Network Security Groups.  This capability allows you to lock down your App Service Environment to just the IP addresses you wish to restrict it to.  For more information around how to do that see the document here [How to Control Inbound Traffic in an App Service Environment][ControlInbound].

##### Deleting an App Service Environment #####

If you want to delete an App Service Environment then simply use the Delete action at the top of the App Service Environment blade.  You cannot delete an ASE though that has content in it.  Be sure to remove all web apps and App Service Plans in order to delete your App Service Environment.  

<!--Image references-->
[1]: ./media/app-service-web-configure-an-app-service-environment/configureaseblade.png
[2]: ./media/app-service-web-configure-an-app-service-environment/configurescale.png
[3]: ./media/app-service-web-configure-an-app-service-environment/configureasplist.png
[4]: ./media/app-service-web-configure-an-app-service-environment/configurewebapplist.png

<!--Links-->
[WhatisASE]: http://azure.microsoft.com/documentation/articles/app-service-web-what-is-an-app-service-environment/
[Appserviceplans]: http://azure.microsoft.com/documentation/articles/azure-web-sites-web-hosting-plans-in-depth-overview/
[HowtoCreateASE]: http://azure.microsoft.com/documentation/articles/app-service-web-how-to-create-an-app-service-environment-in-an-ase/
[HowtoScale]: http://azure.microsoft.com/documentation/articles/app-service-web-how-to-scale-a-web-app-in-an-app-service-environment/
[ControlInbound]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-control-inbound-traffic/
[virtualnetwork]: https://msdn.microsoft.com/library/azure/dn133803.aspx