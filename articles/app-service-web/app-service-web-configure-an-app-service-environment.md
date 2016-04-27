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
	ms.date="04/04/2016" 
	ms.author="ccompy"/>


# Configuring an App Service Environment #

## Overview ##

At a high level an App Service Environment consists of several major components:

- Compute resources running in the Azure App Environment Hosted Service
- Storage
- Database
- A classic "v1" Virtual Network with at least one subnet
- subnet with the Azure App Environment hosted service running in it

### Compute resources

The compute resources are used for your 4 resource pools.  Each App Service Environment has a set of Front Ends and 3 possible Worker Pools.  You don't need to use all 3 Worker Pools and if you want you can just use one or two.  The resource pools, Front Ends and Workers, are not directly accessible to tenants.  You cannot RDP to them, change their provisioning or act as an admin on them but you can set their quantity and size. In an ASE you have 4 size options labeled P1 through P4.  For details around those sizes and their pricing please see here [App Service Pricing](../app-service/app-service-value-prop-what-is.md).
Only one scale operation can be in progress at a time.

**Front Ends** The Front Ends are the HTTP/HTTPS endpoints for your apps held in your ASE.  You do not run workloads in the Front Ends. 

- An ASE starts with (2) P2s which is sufficient for dev/test workloads, and low-level production workloads. P3s are strongly recommended for moderate to heavy production workloads.
- For moderate to heavy production workloads, it is recommended to have at least 4 x P3s to ensure there are sufficient front-ends running when scheduled maintenance occurs.  Scheduled maintenance activities will bring down (1) front-end at a time, thus reducing overall available front-end capacity during maintenance activities.
- You cannot instantly add a new Front End instance.  They can take between 2-3 hours to provision.
- For further scaling fine-tuning, customers should monitor the CPU percentage, Memory percentage and Active Requests metrics for the front-end pool.  If CPU or Memory percentage are above 70% when running P3s, add more front-ends.  If Active Requests averages out to 15K-to-20K requests per front-end, you should also add more front-ends.  The overall goal is to keep CPU and Memory percentages below 70%, and Active Requests averaging out to below 15K requests per front-end when running P3s.  

**Workers** The Workers are where your apps actually run.  When you scale up your App Service Plans, that uses up workers in the associated worker pool.

- You cannot instantly add workers.  They can take from 2 to 3 hours to provision regardless of how many are being added.
- Scaling the size of a compute resource for any pool will take 2-3 hours per update domain.  There are 20 update domains in an ASE.  If you scaled the compute size of a worker pool with 10 instances it could take between 20 to 30 hours to complete. 
- if you change the size of the compute resources used in a worker pool you will cause cold starts of the apps running in that worker pool

The fastest way to change the compute resource size of a worker pool that is not running any apps is to:

- scale down the instance count to 0.  It will take about 30 minutes to deallocate your instances
- select the new compute size and number of instances.  From here it will take between 2 to 3 hours to complete.

If your apps require a larger compute resource size you cannot take advantage of the previous guidance.  Instead of changing the size of the worker pool hosting those apps you can populate another worker pool with workers of the desired size and move your apps over to that pool.

- create the additional instances of the needed compute size in another worker pool.  This will take from 2 to 3 hours to complete.
- reassign your App Service Plans hosting the apps that need a larger size to the newly configured worker pool.  This is a fast operation that should take less than a minute to complete.  
- scale down the first worker pool if you do not need those unused instances anymore.  This operation takes about 30 minutes to complete.

**Autoscaling** One of the tools that can help manage your compute resource consumption is autoscaling which you can do for Front End or Worker pools.  You can do things such as increase your instances of any pool type in the morning and reduce it in the evening or perhaps add instances when the number of workers available in a worker pool drops below a certain threshhold.  If you wish to set autoscale rules around compute resource pool metrics then keep in mind the time that provisioning requires.  For more details on autoscaling of App Service Environments go here [How to configure autoscale in an App Service Environment][ASEAutoscale]

### Storage

Each ASE is configured with 500 Gb of storage.  This space is used across all the apps in the ASE.  This storage space is a part of the ASE and currently cannot be switched to use the customer's storage space.  If making adjustments to your VNET routing or security you need to still allow access to Azure Storage or the ASE cannot function.

### Database

The database holds the information that defines the environment as well as details on the apps running within it.  This too is a part of the Azure held subscription and is not something that customers have a direct ability to manipulate.  If making adjustments to your VNET routing or security you need to still allow access to SQL Azure or the ASE cannot function.

### Network

The virtual network that is used with your ASE can be one that you made when creating the ASE or one that you made ahead of time.  If you want your VNET to be in a resource group that is separate from the one used for your ASE then you need to make your VNET separately from the ASE creation flow.  If you create the subnet during ASE creation it will force the ASE to be in the same resource group as the VNET.  

There are some restrictions on the VNET used for an ASE:

- Currently there is only support for V1 "classic" VNETs
- the VNET must be a regional VNET
- VNETs used to host an ASE must use RFC1918 addresses (i.e. private addresses)
- there needs to be a subnet with 8 or more addresses where the ASE is deployed
- Once a subnet is used to host an ASE, the address range of the subnet cannot be changed.  For this reason it is recommended that the subnet contains at least 64 addresses to accomodate any future ASE growth 

Unlike the hosted service that contains the ASE, the [Virtual Network][virtualnetwork] and subnet are all under user control.  Administering your VNET is done through the Virtual Network UI or Powershell.

Because this capability places the Azure App Service into your VNET it means that your apps hosted in your ASE can now access resources made available through ExpressRoute or Site to Site VPNs directly.  The apps within your App Service Environments do not require additional networking features to access resources available to the VNET hosting your App Service Environment. This means you don't need to use VNET Integration or Hybrid Connections to get to resources in or connected to your VNET.  You can still use both of those features though to access resources in networks that are not connected to your VNET.  For example you can use VNET Integration to integrate with a VNET that is in your subscription but isn't connected to the VNET that your ASE is in.  You can still also use Hybrid Connections to access resources in other networks just like you normally can.  

If you do have your VNET configured with an ExpressRoute VPN you should be aware of some of the routing needs that an ASE has.  There are some user defined route (UDR) configurations that are incompatible with an ASE.  For more details around running an ASE in a VNET with ExpressRoute see the document here: [Running an App Service Environment in a VNET with ExpressRoute][ExpressRoute]

You can also now control access to your apps using Network Security Groups.  This capability allows you to lock down your App Service Environment to just the IP addresses you wish to restrict it to.  For more information around how to do that see the document here [How to Control Inbound Traffic in an App Service Environment](app-service-app-service-environment-control-inbound-traffic.md).

## Portal

The UI to manage and monitor your App Service Environment is available from the Azure Portal.  If you have an ASE then you are likely to see the App Service symbol on your sidebar.  This symbol is used to represent App Service Environments in the Azure Portal.

![][1]

You can use the icon or select the chevron (greater than symbol) at the bottom of the sidebar and select App Service Environments.  Both do the same thing which is to open up the UI that lists all of your App Service Environments.  Selecting one of the ASEs listed opens up the UI used to monitor and manage it.

![][2]

This first blade shows some properties of your ASE along with a metric chart per resource pool.  Some of the properties shown in the Essentials block are also hyperlinks that will open up the blade associated with it.  For example you can select the VNET Name to open up the UI associated with the VNET that your ASE is running in.  App Service Plans and Apps each open up blades that list these items that are in your ASE.  

### Monitoring

The charts give an ability to see a variety of performance metrics in each resource pool.  For the Front End pool monitor the average CPU and memory.  For worker pools monitor the quantity used and quantity available.  Multiple App Service Plans can make use of the workers in a worker pool.  The workload is not distributed in the same fashion as with Front End servers so the CPU and memory usage do not provide much in the way of useful information.  It's more important to track how many workers you have used and are available especially if you are managing this system for others to use.  

All of the metrics that can be tracked in the charts can also be used to set up Alerts.  Setting up Alerts works the same as they do elsewhere in App Service. You can set an alert from either the Alerts UI part or from drilling into any metrics UI and hitting Add Alert.
 
![][3]

The metrics that were just discussed are the App Service Environment metrics.  There are also metrics available at the App Service Plan level.  This is where monitoring CPU and memory makes a lot of sense.  In an ASE, all of the ASPs are dedicated ASPs.  That is to say that the only apps that are running on the hosts allocated to that ASP are the apps in that ASP.  
To see details on your ASP simply bring up your ASP from any of the lists in the ASE UI or even from browse App Service Plans which lists all of them.   

### Settings

Within the ASE blade there is a Settings section that contains several important capabilities

**Settings > Properties** The Settings blade will automatically open up when you bring up your ASE blade.  At the top is Properties.  There are a number of items in here that are redundant to what you see in Essentials but what is very useful is the VIP Address as well as the Outbound IP Address. 

![][4]

**Settings > IP Addresses** When you create an IP SSL app in your ASE you need an IP SSL address.  In order to do that your ASE needs IP SSL addresses that it owns which can be allocated.  When an ASE is created it has 1 IP SSL address for this purpose but you can add more.  There is a charge for additional IP SSL addresses as shown here [App Service Pricing][AppServicePricing] in the section on SSL connections.  The additional price is the IP SSL price.

**Settings > Front End Pool / Worker Pools** Each of these resource pool blades offers the ability to see information only on that resource pool in addition to providing controls to fully scale that resource pool.  

The base blade for each resource pool provides a chart with metrics for that resource pool.  Just like with the charts from the ASE blade you can go into the chart and set up alerts as desired.  Setting an alert from the ASE blade for a specific resource pool does the same thing as doing it from the resource pool.  From the worker pool Settings blade you have access to listing all the Apps or App Service Plans that are running in this worker pool. 

![][5]

### Portal Scale capabilities  

There are three scale operations:

- changing the number of IP addresses in the ASE that are available for IP SSL usage
- changing the size of the compute resource used in a resource pool
- changing the number of compute resources used in a resource pool either manually or through autoscale

There are three ways in the portal to control how many servers you have in your resource pools

- Scale operation from the main ASE blade at the top.  You can make multiple scale configuration changes to the Front End and Worker Pools and they are all applied as a single operation.
- Manual scale operation from the individual resource pool Scale blade, which is under Settings
- Autoscale which you set up from the individual resource pool Scale blade

To use the Scale operation on the ASE blade drag the slider to the quantity desired and save.  This UI also supports changing the size.  

![][6]

To use the manual or autoscale capabilities in a specific resource pool go to *Settings > Front End Pool / Worker Pools* as appropriate and open up the pool you wish to change.  Go to *Settings > Scale Out or Settings > Scale Up*.  The *Scale Out* blade enables you to control instance quantity.  *Scale Up* enables you to control resource size.  

![][7] 

## Fault tolerance considerations

An App Service Environment can be configured to use up to 55 total compute resources.  Of those 55 compute resources, only 50 can be used to host workloads. The reason for that is two fold.  There are a minimum of 2 Front End compute resources.  That leaves up to 53 to support worker pool allocation. In order to provide fault tolerance, you need to have an additional compute resource allocated according to the following rules:

- each worker pool needs at least one additional compute resource which is not available to be assigned a workload
- when the quantity of compute resources in a worker pool goes above a certain value then another compute resource is required for fault tolerance.  This is not the case in the front end pool.

Within any single worker pool the fault tolerance requirements are that for a given value of X resources assigned to a worker pool:

- if X is between 2 to 20, the amount of usable compute resources you can use for workloads is X-1
- if X is between 21 to 40, the amount of usable compute resources you can use for workloads is X-2
- if X is between 41 to 53, the amount of usable compute resources you can use for workloads is X-3

The minimum footprint has 2 Front End servers and 2 Workers.  With the above statements then here are a few examples to clarify.  

- If you have 30 Workers in a single pool then 28 of them can be used to host workloads. 
- If you have 2 Workers in a single pool then 1 can be used to host workloads.
- If you have 20 Workers in a single pool then 19 can be used to host workloads.  
- If you have 21 Workers in a single pool then still, only 19 can be used to host workloads.  

The fault tolerance aspect is important but you need to keep it in mind as your scale above certain thresholds.  If you wanted to add more capacity going from 20 instances, then go to 22 or higher as 21 doesn't add any more capacity.  The same is true going above 40 where the next number that adds capacity is 42.  

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
