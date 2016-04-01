<properties 
	pageTitle="How to Configure an App Service Environment" 
	description="Configuration, management and monitoring of App Service Environments" 
	services="app-service" 
	documentationCenter="" 
	authors="ccompy" 
	manager="stefsch" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/04/2016" 
	ms.author="ccompy"/>


# Configuring an App Service Environment #

## Overview ##

App Service Environments is a Premium Tier capability in the Azure App Service that offers new scaling and network access capabilities.  This new scale capability allows you to place an instance of the Azure App Service into your VNET.  This capability can host Web Apps, Mobile Apps and API Apps.  Logic Apps do not yet run in an ASE.

If you are unfamiliar with the App Service Environment (ASE) capability then read the document here [What is an App Service Environment](app-service-app-service-environment-intro.md). For information on how to create an ASE read the document here [How to Create an App Service Environment](app-service-web-how-to-create-an-app-service-environment.md). 

At a high level an App Service Environment consists of several major components:

- Compute resources running in the Azure App Environment Hosted Service
- Storage
- Database
- A classic "v1" Virtual Network with at least one subnet
- subnet with the Azure App Environment hosted service running in it

The compute resources are used for your 4 resource pools.  Each App Service Environment has a set of Front Ends and 3 Worker Pools.  You don't need to use all 3 Worker Pools and if you want you can just use one.  The Front Ends are the HTTP endpoints for your apps held in your ASE.  The Workers are where your apps actually run.  The science on when you need to add more Front Ends or more Workers is tied to how the apps you put in the ASE perform.  As an example, let's say you only have one app on your ASE and it's a hello world app that gets a vast number of requests.  In that case you would need to scale up your Front Ends to handle the HTTP load but conversely would not need to scale up your Workers.  Trying to handle all of this by hand is rather daunting especially when you consider that each ASE likely has a mix of apps running on it with varied performance criteria.  Happily enough we have added autoscale to App Service Environments and this is what will make life a lot easier.  For details around scaling and autoscaling of App Service Environments follow the link here [How to configure autoscale in an App Service Environment][ASEAutoscale]

Each ASE is configured with 500 Gb of storage.  This space is used across all the apps in the ASE.  This storage space is a part of the ASE and currently cannot be switched to use the customer's storage space.

The database holds the information that defines the environment as well as details on the apps running within it.  This too is a part of the Azure held subscription and is not something that customers have a direct ability to manipulate. 

The virtual network that is used with your ASE can be one that you made when creating the ASE or one that you had ahead of time.  If you want your VNET to be in a resource group that is separate from the one used for your ASE then you need to make your VNET separately from the ASE creation flow.  It is a good idea to create the subnet you want to use at the same time as creating the subnet during ASE creation will force the ASE to be in the same resource group as the VNET.  Currently there is only support for V1 "classic" VNETs.  

The UI to manage and monitor your App Service Environment is available from the Azure Portal.  If you have an ASE then you are likely to see the App Service symbol on your sidebar.  This symbol is used to represent App Service Environments in the Azure Portal.

![][1]

You can use the icon or select the chevron (greater than symbol) at the bottom of the sidebar and select App Service Environments.  Both do the same thing which is to open up the UI that lists all of your App Service Environments.  Selecting one of the ASEs listed opens up the UI used to monitor and manage it.

![][2]

This first blade shows some properties of your ASE along with a metric chart per resource pool.  Some of the properties shown in the Essentials block are also hyperlinks that will open up the blade associated with it.  For example you can select the VNET Name to open up the UI associated with the VNET that your ASE is running in.  App Service Plans and Apps each open up blades that list these items that are in your ASE.  

## Monitoring ##

The charts give an ability to see a variety of performance metrics in each resource pool.  For the Front End pool it makes a lot of sense to monitor the average CPU and memory.  The Front Ends have a distributed load by looking at an average you can get a good view at the general performance.  The worker pools are however not the same.  Multiple App Service Plans can make use of the workers in a worker pool.  If that is the case then CPU and memory usage do not provide much in the way of useful information.  It's more important to track how many workers you have used and are available especially if you are managing this system for others to use.  

All of the metrics that can be tracked in the charts can also be used to set up Alerts.  Setting up Alerts works the same as they do elsewhere in App Service. You can set an alert from either the Alerts UI part or from drilling into any metrics UI and hitting Add Alert.
 
![][3]

The metrics that were just discussed are the App Service Environment metrics.  There are also metrics available at the App Service Plan level.  This is where monitoring CPU and memory makes a lot of sense.  In an ASE, all of the ASPs are dedicated ASPs.  That is to say that the only apps that are running on the hosts allocated to that ASP are the apps in that ASP.  
To see details on your ASP simply bring up your ASP from any of the lists in the ASE UI or even from browse App Service Plans which lists all of them.   

You may already be familiar with the autoscale capabilities that are available to ASPs outside of an ASE and how those leverage the metrics that are available for a resource.  The same is also true for auto scale of an App Service Environment.  Not only can you still autoscale the ASP based on metrics in an ASE but you can also set up autoscale rules for the ASE itself.  For details around setting up autoscale there is a detailed guide here: [Autoscale in an App Service Environment][ASEAutoscale]  


## Properties ##

The Settings blade will automatically open up when you bring up your ASE blade.  At the top is Properties.  There are a number of items in here that are redundant to what you see in Essentials but what is very useful is the VIP Address as well as the Outbound IP Address.  For now they are the one and the same but at some point in the future it is likely to become possible to have a separate outbound IP address from the VIP address which is why they are both noted here. So if you don't count setting up SSL and adding an IP address just for a single app in your ASE, the IP that will be set in DNS for the apps made in your ASE will be the VIP address that you see here in Properties.

![][4]

## IP Addresses ##

This is where you can add more IP addresses to your ASE for your apps to use.  When you create an app in your ASE that you want to set up with IP SSL then you need to have an IP address that is reserved just for that app.  In order to do that your ASE needs to have some IP addresses that it owns which can be allocated.  When an ASE is created it has 1 address for this purpose.  If you need more then you go here and add more.  Now before you simply drag it to the maximum allotment in case you might ever want more, be aware that there is a charge for additional IP addresses.  The details on how much more are tracked on the pricing page here: [App Service Pricing][AppServicePricing]  Just scroll down to the section on SSL connections.  The additional price is the IP SSL price.

**NOTE:** If you do add more IP addresses then be aware that this is a scale operation.  There can only be one scale operation in progress at a time.  There are three scale operations:

- changing the number of IP addresses in the ASE that are available for IP SSL usage
- changing the size of the compute resource used in a resource pool
- changing the number of compute resources used in a resource pool either manually or through autoscale

## Resource Pools ##

From Settings you can get to the Front End pool or the Worker Pool UI.  Each of these resource pool blades offers the ability to see information only on that resource pool in addition to providing controls to fully scale that resource pool.  

The base blade for each resource pool provides a chart with metrics for that resource pool.  Just like with the charts from the ASE blade you can go into the chart and set up alerts as desired.  Setting an alert from the ASE blade for a specific resource pool does the same thing as doing it from the resource pool.  From the worker pool Settings blade you have access to listing all the Apps or App Service Plans that are running in this worker pool. 

![][5]

### Compute Resource Quantity Scale ###

To give a better perspective on scaling apps in an ASE there is a guide here: [Scaling Apps in an App Service Environment](app-service-web-scale-a-web-app-in-an-app-service-environment.md).  If you want to learn more on how to configure autoscale for the ASE resource pools then start here: [Autoscale in an App Service Environment][ASEAutoscale].  This description details manual scale operations on your resource pools.

The resource pools, Front Ends and Workers, are not directly accessible to tenants.  That is to say, you cannot RDP to them, change their provisioning or act as an admin on them.  They are operated and maintained by Azure.  With that said, the quantity and sizes of compute resources though are up to the user to decide.  

There are really three ways to control how many servers you have in your resource pools
- Scale operation from the main ASE blade at the top
- Manual scale operation from the individual resource pool Scale blade, which is under Settings
- Autoscale which you set up from the individual resource pool Scale blade

To use the Scale operation on the ASE blade simply click on it, drag the slider to the quantity desired and save.  This UI also supports changing the size.  

![][6]

To use the manual or autoscale capabilities in the specific resource pool, start first from the ASE blade and go to Settings.  From Settings open up Front End pool or Worker Pools as desired and open up the pool you wish to change.  Under Settings there is a Scale chevron.  The blade this opens up can be used for manual scale or autoscale. 

![][7] 

An App Service Environment can be configured to use up to 55 total compute resources.  Of those 55 compute resources, only 50 can be used to host workloads. The reason for that is two fold.  There are a minimum of 2 Front End compute resources.  That leaves up to 53 to support worker pool allocation. In order to provide fault tolerance, you need to have an additional compute resource allocated according to the following rules:

- each worker pool needs at least one additional compute resource which is not available to be assigned a workload
- when the quantity of compute resources in a worker pool goes above a certain value then another compute resource is required for fault tolerance.  This is not the case in the front end pool.

Within any single worker pool the fault tolerance requirements are that for a given value of X resources assigned to a worker pool:

- if X is between 2 to 20, the amount of usable compute resources you can use for workloads is X-1
- if X is between 21 to 40, the amount of usable compute resources you can use for workloads is X-2
- if X is between 41 to 53, the amount of usable compute resources you can use for workloads is X-3

Remember that the minimum footprint has 2 Front End servers and 2 Workers.  With the above statements then here are a few examples to clarify.  

- If you have 30 Workers in a single pool then 28 of them can be used to host workloads. 
- If you have 2 Workers in a single pool then 1 can be used to host workloads.
- If you have 20 Workers in a single pool then 19 can be used to host workloads.  
- If you have 21 Workers in a single pool then still, only 19 can be used to host workloads.  

The fault tolerance aspect is important but you need to keep it in mind as your scale above certain thresholds.  If you wanted to add more capacity going from 20 instances, then go to 22 or higher as 21 doesn't add any more capacity.  The same is true going above 40 where the next number that adds capacity is 42.  

### Compute Resource Size Scale ###

In addition to being able to manage the quantity of compute resources that you can assign to a given pool you also have control over the size.  With App Service Environments you can choose from 4 different sizes labeled P1 through P4.  For details around those sizes and their pricing please see here [App Service Pricing](../app-service/app-service-value-prop-what-is.md) The P1 to P3 compute resource sizes are the same as what is available normally.  The P4 compute resource gives 8 cores with 14 GB of RAM and is only available in an App Service Environment.

If you want to change the size of the compute resources used in your pools you have two ways to go about it.  There is the scale command that is available from the ASE blade and also the Pricing Tiers blade that you get to by going to Settings in the individual resource pool.

![][8]

Before making any changes though it is important to note a few things:

- changes made can potentially take a couple of hours to complete depending on how large the change is
- when there is already a App Service Environment configuration change in work, you cannot start another change
- if you change the size of the compute resources used in a worker pool you can cause outages for the apps running in that worker pool

Adding additional instances to a worker pool is a benign operation and does not incur any app outages for resources in that pool.  Changing the size of the compute resource used in a worker pool is another story though.  To avoid any app down time during a size change to a worker pool it is better to:

- use an unused worker pool to bring up the instances required in the size desired
- scale the App Service Plans to the new worker pool.  
 
This is much less disruptive to running apps than changing the compute resource size with running workloads.  For details around scaling apps in an App Service Environment go here [Scaling Apps in an App Service Environment](app-service-web-scale-a-web-app-in-an-app-service-environment.md)  

## Virtual Network ##

Unlike the hosted service that contains the ASE, the [Virtual Network][virtualnetwork] and subnet are all under user control.  App Service Environments do have a few network requirements but the rest is up to the user to control.  Those ASE requirements are:

- a classic "v1" VNET 
- a subnet with at least 8 addresses 
- the VNET must be a regional VNET  
 
Administering your VNET is done through the Virtual Network UI or Powershell.

Because this capability places the Azure App Service into your VNET it means that your apps hosted in your ASE can now access resources made available through ExpressRoute or Site to Site VPNs directly.  The apps within your App Service Environments do not require additional networking features to access resources available to the VNET hosting your App Service Environment. This means you don't need to use VNET Integration or Hybrid Connections to get to resources in or connected to your VNET.  You can still use both of those features though to access resources in networks that are not connected to your VNET.  For example you can use VNET Integration to integrate with a VNET that is in your subscription but isn't connected to the VNET that your ASE is in.  You can still also use Hybrid Connections to access resources in other networks just like you normally can.  

If you do have your VNET configured with an ExpressRoute VPN you should be aware of some of the routing needs that an ASE has.  There are some user defined route (UDR) configurations that are incompatible with an ASE.  For more details around running an ASE in a VNET with ExpressRoute see the document here: [Running an App Service Environment in a VNET with ExpressRoute][ExpressRoute]

You can also now control access to your apps using Network Security Groups.  This capability allows you to lock down your App Service Environment to just the IP addresses you wish to restrict it to.  For more information around how to do that see the document here [How to Control Inbound Traffic in an App Service Environment](app-service-app-service-environment-control-inbound-traffic.md).

## Deleting an App Service Environment ##

If you want to delete an App Service Environment then simply use the Delete action at the top of the App Service Environment blade.  When you do this you will be prompted to enter the name of your App Service Environment to confirm that you really want to do this.  NOTE: When you delete an App Service Environment you delete all the content within it as well.  

![][9]  

## Getting started

To get started with App Service Environments, see [How To Create An App Service Environment](app-service-web-how-to-create-an-app-service-environment.md)

For more information about the Azure App Service platform, see [Azure App Service](../app-service/app-service-value-prop-what-is.md).

[AZURE.INCLUDE [app-service-web-whats-changed](../../includes/app-service-web-whats-changed.md)]

[AZURE.INCLUDE [app-service-web-try-app-service](../../includes/app-service-web-try-app-service.md)]

<!--Image references-->
[1]: ./media/app-service-web-configure-an-app-service-environment/ase-icon.png
[2]: ./media/app-service-web-configure-an-app-service-environment/aseconfig-aseblade.png
[3]: ./media/app-service-web-configure-an-app-service-environment/aseconfig-poolchart.png
[4]: ./media/app-service-web-configure-an-app-service-environment/aseconfig-properties.png
[5]: ./media/app-service-web-configure-an-app-service-environment/aseconfig-poolblade.png
[6]: ./media/app-service-web-configure-an-app-service-environment/aseconfig-scalecommand.png
[7]: ./media/app-service-web-configure-an-app-service-environment/aseconfig-poolscale.png
[8]: ./media/app-service-web-configure-an-app-service-environment/aseconfig-pricingtiers.png
[9]: ./media/app-service-web-configure-an-app-service-environment/aseconfig-deletease.png

<!--Links-->
[WhatisASE]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-intro/
[Appserviceplans]: http://azure.microsoft.com/documentation/articles/azure-web-sites-web-hosting-plans-in-depth-overview/
[HowtoCreateASE]: http://azure.microsoft.com/documentation/articles/app-service-web-how-to-create-an-app-service-environment/
[HowtoScale]: http://azure.microsoft.com/documentation/articles/app-service-web-scale-a-web-app-in-an-app-service-environment/
[ControlInbound]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-control-inbound-traffic/
[virtualnetwork]: https://azure.microsoft.com/documentation/articles/virtual-networks-faq/
[AppServicePricing]: http://azure.microsoft.com/pricing/details/app-service/ 
[AzureAppService]: http://azure.microsoft.com/documentation/articles/app-service-value-prop-what-is/
[ASEAutoscale]: http://azure.microsoft.com/documentation/articles/app-service-environment-auto-scale/
[ExpressRoute]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-network-configuration-expressroute/
