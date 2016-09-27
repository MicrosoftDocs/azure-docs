<properties 
	pageTitle="How to Create an App Service Environment" 
	description="Creation flow description for app service environments" 
	services="app-service" 
	documentationCenter="" 
	authors="ccompy" 
	manager="stefsch" 
	editor=""/>

<tags 
	ms.service="app-service" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/12/2016" 
	ms.author="ccompy"/>

# How to Create an App Service Environment #

App Service Environments (ASE) are a Premium service option of Azure App Service that delivers an enhanced configuration capability that is not available in the multi-tenant stamps.  The ASE feature essentially deploys the Azure App Service into a customer’s virtual network.  To gain a greater understanding of the capabilities offered by App Service Environments read the [What is an App Service Environment][WhatisASE] documentation.


### Overview ###

An ASE consists of Front End and Worker compute resources.  The Front Ends act as the HTTP/HTTPS endpoints and send traffic to the Workers which are the roles that host your apps.   

ASE creation requires customers to provide the following pieces of information:

- name of the ASE
- subscription to be used for the ASE  
- resource group
- Azure Virtual Network(VNet) with 8 or more addresses and a subnet to be used by the ASE
- VIP Type, External or Internal 
- ASE resource pool definition


There are some important details to each of those items.

- The name of the ASE will be used in the subdomain for any apps made in that ASE, if configured with an external VIP
- An ASE with an External hosts internet accessible apps.  An ASE with an Internal VIP uses an Internal Load Balancer(ILB) 
- All apps made in an ASE will be in the same subscription as the ASE itself
- If you do not have access to the subscription used to make the ASE you cannot use the ASE to create apps
- VNets used to host an ASE must be Regional VNets.  You can use either Classic or Resource Manager VNets 
- **The subnet used to host the ASE must not contain any other compute resources**
- Only one ASE can exist in a subnet
- ASEs can now be deployed into virtual networks that use *either* public address ranges, *or*
RFC1918 address spaces (i.e. private addresses).  In order to use a virtual network with a public address range, you will need to create the VNet and subnet ahead of time, and then select the subnet in the ASE creation UX.


Each ASE deployment is a Hosted Service that Azure manages and maintains.  The compute resources hosting the ASE system roles are not accessible to the customer though the customer does manage the quantity of instances and their sizes. 

There are two ways to access the ASE creation UI.  It can be found by searching in the Azure Marketplace for ***App Service Environment*** or by going through New -> Web + Mobile.  

If you want the VNet to have a separate resource group from the ASE then you need to first create the VNet separately and then select it during ASE creation.  Also, if you want to create a subnet in an existing VNet during ASE creation, the ASE has to then be in the same resource group as the VNet.


### Quick create ###
The creation experience for an ASE does have a set of defaults to enable a quick creation experience.  You can quickly create an ASE by simply entering a name for the deployment.  This will in turn create an ASE in the region closest to you with a:

- VNet with 512 addresses using an RFC1918 private address space
- subnet with 256 addresses
- External VIP
- Front End pool with 2 P2 compute resources
- Worker pool with 2 P1 compute resources
- single IP address to be used for IP SSL

Front End pools require P2 or larger.  Be careful when selecting the subscription that you want the ASE to be in.  The only accounts that can use the ASE to host content must be in the subscription used to create it.  

![][1]

The name that is specified for the ASE will be used for the apps created in the ASE.  If name of the ASE is appsvcenvdemo then the subdomain name would be .*appsvcenvdemo.p.azurewebsites.net*.  If you thus created an app named *mytestapp* then it would be addressable at *mytestapp.appsvcenvdemo.p.azurewebsites.net*.  You cannot use white space in the name of your ASE.  If you use upper case characters in the name, the domain name will be the total lowercase version of that name.  If you use an ILB then your ASE name is not used in your subdomain but is instead explicitly stated during ASE creation.    

Having the defaults is very useful for a certain number of situations but often you will need to adjust something.  The next few sections walk through each of the ASE related configuration sections.


### Virtual Network ###
The ASE creation process supports selection of an existing Classic or Resource Manager VNet as well as creation of a new Classic VNet.    

When you go to select an existing VNet you will see your Classic and Resource Manager VNets listed together.  The Classic VNets have the word Classic next to the location.  If it doesn't say that, then it's a Resource Manager VNet.  

![][2]


If going through the VNet creation UI you are required to provide:

- VNet Name
- VNet address range in CIDR notation
- Location

The location of the VNet is the location of the ASE.  Remember that this creates a Classic VNet, not a Resource Manager VNet.  

ASEs can be deployed into virtual networks that use *either* public address ranges, *or* RFC1918 address spaces (i.e. private addresses).  In order to use a virtual network with a public address range, you will need to create the subnet ahead of time, and then select the subnet in the ASE creation UX. 

If you do select a pre-existing VNET you will also have to specify a subnet to use or create a new one.  The subnet needs to have 8 addresses or more and cannot have any other resources already in it.  ASE creation will fail if you try to use a subnet that already has VMs allocated into it.  

After your have your VNet specified or selected you need to create or select a subnet as appropriate.  The details you are required to provide here are the:

- Subnet Name
- Subnet range in CIDR notation

If you are unfamiliar with CIDR(Classless Inter-Domain Routing) notation it takes the form of an IP Address that is forward slash separated from the CIDR value.  It looks like this *10.0.0.0/22*.  The CIDR value denotes the number of lead bits that are masked against the IP address shown.  An easier way to express the concept here is that CIDR values provide an IP range.  In this example, 10.0.0.0/22 means a range of 1024 addresses or from 10.0.0.0 to 10.0.3.255.  A /23 means 512 addresses and so on.  

Just a reminder that if you want to create a subnet in an existing VNet, the ASE will be in the same resource group as the VNet.  To keep your ASE in a separate resource group from your VNet simply make both your VNet and your subnet separately and in advance of creating your ASE.


#### External or Internal VIP ####

By default the VNet configuration is set with an External VIP Type and 1 IP address.  If you wish to use an ILB instead of an external VIP then go into VNet Configuration and change the VIP Type to Internal.  An External VIP is used by default.  When you change the VIP Type to Internal you will need to specify your subdomain for the ASE.  There are a few tradeoffs when using an ILB as the VIP for an ASE.  To learn more about them read [Using an Internal Load Balancer with an App Service Environment][ILBASE].

![][4]

### Compute Resource Pools ###

During ASE creation you can set the number of resources for each resource pool along with their size.  While you can set the sizes of your resource pools at ASE creation you can also adjust them afterwards with manual scaling options or autoscale options.  

As noted earlier, an ASE consists of Front End servers and Workers.  The Front End servers handle the app connection load and Workers run the app code.  The Front End servers are managed in a dedicated compute resource pool.  The Workers in turn are managed in 3 separate compute resource pools named 

- Worker Pool 1
- Worker Pool 2
- Worker Pool 3

If you have a large number of requests for simple web apps you would likely scale up your Front Ends and perhaps have fewer workers.  If you have CPU or memory intensive web apps with light traffic then you wouldn't need many Front Ends but likely need more or bigger workers.  

![][3]

Regardless of the size of the compute resources, the minimum footprint has 2 Front End servers and 2 Workers.  An ASE can be configured to use up to 55 total compute resources.  Of those 55 compute resources, only 50 can be used to host workloads. The reason for that is two fold.  There are a minimum of 2 Front End compute resources.  That leaves up to 53 to support worker pool allocation. In order to provide fault tolerance, you need to have an additional compute resource allocated according to the following rules:

- each worker pool needs at least one additional compute resource which cannot be assigned workload
- when the quantity of compute resources in a pool goes above a certain value then another compute resource is required

Within any single worker pool the fault tolerance requirements are that for a given value of X resources assigned to a worker pool:

- if X is between 2 to 20, the amount of usable compute resources you can use for workloads is X-1
- if X is between 21 to 40, the amount of usable compute resources you can use for workloads is X-2
- if X is between 41 to 53, the amount of usable compute resources you can use for workloads is X-3

In addition to being able to manage the quantity of compute resources that you can assign to a given pool you also have control over the size.  With App Service Environments you can choose from 4 different sizes labeled P1 through P4.  For details around those sizes and their pricing please see here [App Service Pricing][AppServicePricing].  The P1 to P3 compute resource sizes are the same as what is available in the multi-tenant environments.  The P4 compute resource gives 8 cores with 14 GB of RAM and is only available in an App Service Environment.  

Pricing for App Service Environments is against the compute resources assigned.  You pay for the compute resources allocated to your App Service Environment regardless if they are hosting workloads or not. 

By default an ASE comes with 1 IP address that is available for IP SSL.  If you know that you will need more you can specify that here or manage it after creation.  
  
### After App Service Environment creation ###

After ASE creation you can adjust:

- Quantity of Front Ends (minimum: 2)
- Quantity of  Workers (minimum: 2)
- Quantity of IP addresses available for IP SSL
- Compute resource sizes used by the Front Ends or Workers (Front End minimum size is P2)

You cannot change:

- Location
- Subscription
- Resource Group
- VNET used
- Subnet used

There are more details around manual scaling, management and monitoring of App Service Environments here: [How to configure an App Service Environment][ASEConfig] 

For information on autoscaling there is a guide here:
[How to configure autoscale for an App Service Environment][ASEAutoscale]

There are additional dependencies that are not available for customization such as the database and storage.  These are handled by Azure and come with the system.  The system storage supports up to 500 GB for the entire App Service Environment and the database is adjusted by Azure as needed by the scale of the system.


## Getting started
All articles and How-To's for App Service Environments are available in the [README for Application Service Environments](../app-service/app-service-app-service-environments-readme.md).

To get started with App Service Environments, see [Introduction to App Service Environments][WhatisASE]

For more information about the Azure App Service platform, see [Azure App Service][AzureAppService].

[AZURE.INCLUDE [app-service-web-whats-changed](../../includes/app-service-web-whats-changed.md)]

[AZURE.INCLUDE [app-service-web-try-app-service](../../includes/app-service-web-try-app-service.md)]
 

<!--Image references-->
[1]: ./media/app-service-web-how-to-create-an-app-service-environment/asecreate-basecreateblade.png
[2]: ./media/app-service-web-how-to-create-an-app-service-environment/asecreate-vnetcreation.png
[3]: ./media/app-service-web-how-to-create-an-app-service-environment/asecreate-resources.png
[4]: ./media/app-service-web-how-to-create-an-app-service-environment/asecreate-externalvip.png

<!--Links-->
[WhatisASE]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-intro/
[ASEConfig]: http://azure.microsoft.com/documentation/articles/app-service-web-configure-an-app-service-environment/
[AppServicePricing]: http://azure.microsoft.com/pricing/details/app-service/ 
[AzureAppService]: http://azure.microsoft.com/documentation/articles/app-service-value-prop-what-is/ 
[ASEAutoscale]: http://azure.microsoft.com/documentation/articles/app-service-environment-auto-scale/
[ILBASE]: http://azure.microsoft.com/documentation/articles/app-service-environment-with-internal-load-balancer/
