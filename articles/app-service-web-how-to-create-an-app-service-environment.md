<properties 
	pageTitle="How to Create an App Service Environment" 
	description="Creation flow description for app service environments" 
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

# How to Create an App Service Environment #

App Service Environments (ASE) are a Premium service option of Azure App Service that is currently in Preview.  It delivers an enhanced configuration capability that is not available in the multi-tenant stamps.  To gain a greater understanding of the capabilities offered by App Service Environments read the [What is an App Service Environment][WhatisASE] documentation.

### Overview ###

The ASE feature essentially deploys the Azure App Service into a customer’s VNET.  To do this the customer needs: 

- A Regional VNET is required with more than 512 (/23) or more addresses
- A Subnet in this VNET is required with 256 (/24) or more addresses

If you do not already have a VNET you wish to use to host your App Service Environment you can create one during App Service Environment creation.

Each ASE deployment is a Hosted Service that Azure manages and maintains.  The compute resources hosting the ASE system roles are not accessible to the customer though the customer does manage the quantity of instances and their sizes.  

## App Service Environment creation ##

There are two ways to access the ASE creation UI.  It can be found by searching in the Azure Marketplace for ***App Service Environment*** or by going through New -> Web + Mobile.  

### Quick create ###
After entering the creation UI you can quickly create an ASE by simply entering a name for the deployment.  This will in turn create a VNET with 512 addresses, a subnet with 256 addresses in that VNET and an ASE environment with 2 Front Ends and 2 Workers in Worker Pool 1.  Be sure to select the location where you want the system to be located and the subscription that you want it to be in.  The only accounts that can use the ASE to host content must be in the subscription used to create it.

The name that is specified for the ASE will be used for the web apps created in the ASE.  If name of the ASE is appsvcenvdemo then the domain name would be .*appsvcenvdemo.p.azurewebsites.net*.  If you thus created a web app named mytestapp then it would be addressable at *mytestapp.appsvcenvdemo.p.azurewebsites.net*.  You cannot use white space in the name.  If you use upper case characters in the name, the domain name will be the total lowercase version of that name.  


![][1]

### Compute Resource Pools ###

The compute resources that are used for App Service Environment are managed in compute resource pools which allows configuration of how compute resource instances you have in the pool in addition to their size.  An App Service Environment consists of Front End servers and Workers.  The Front End servers handle the app connection load and Workers run the app code.  The Front End servers are managed in a dedicated compute resource pool.  The Workers in turn are managed in 3 separate compute resource pools named 

- Worker Pool 1
- Worker Pool 2
- Worker Pool 3

If you have a large number of requests for simple web apps you would likely scale up your Front Ends and have fewer workers.  If you have CPU or memory intensive web apps with light traffic then you wouldn't need many Front Ends but likely need more or bigger workers.  

Regardless of the size of the compute resources, the minimum footprint has 2 Front End servers and 2 Workers.  An App Service Environment can be configured to use up to 55 total compute resources.  Of those 55 compute resources, only 50 can be used to host workloads. The reason for that is two fold.  There are a minimum of 2 Front End compute resources.  That leaves up to 53 to support worker pool allocation. In order to provide fault tolerance though, you need to have an additional compute resource allocated according to the following rules:

- each worker pool needs at least one additional compute resource which cannot be assigned workload
- when the quantity of compute resources in a pool goes above a certain value then another compute resource is required

Within any single worker pool the fault tolerance requirements are that for a given value of X resources assigned to a worker pool:

- if X is between 2 to 20, the amount of usable compute resources you can use for workloads is X-1
- if X is between 21 to 40, the amount of usable compute resources you can use for workloads is X-2
- if X is between 41 to 53, the amount of usable compute resources you can use for workloads is X-3

In addition to being able to manage the quantity of compute resources that you can assign to a given pool you also have control over the size.  With App Service Environments you can choose from 4 different sizes labeled P1 through P4.  For details around those sizes and their pricing please see here [App Service Pricing][AppServicePricing].  The P1 to P3 compute resource sizes are the same as what is available in the multi-tenant environments.  The P4 compute resource gives 8 cores with 14 GB of RAM and is only available in an App Service Environment.  

Pricing for App Service Environments is against the compute resources assigned.  You pay for the compute resources allocated to your App Service Environment regardless if they are hosting workloads or not. 



### VNET Creation ###
While there is a quick create capability that will automatically create a new VNET, the feature also supports  selection of an existing VNET and manual creation of a VNET.  You can select an existing VNET if it is large enough to support an App Service Environment deployment.  The VNET must have 512 addresses or more.  If you do select a pre-existing VNET you will also have to specify a subnet to use or create a new one.  The subnet needs to have 256 addresses or more.  

If going through the VNET creation UI you are required to provide:

- VNET Name
- VNET address range in CIDR notation
- Subnet Name
- Subnet range in CIDR notation

If you are unfamiliar with CIDR notation it takes the form of 10.0.0.0/22 where the /22 specifies the range.  In this example a /22 means a range of 1024 addresses or from 10.0.0.0 -10.0.3.255.  A /23 means 512 addresses and so on.  

![][2]

### App Service Environment size definition ###

The next item to configure is the scale of the system.  By default there are 2 Front End P2 compute resources, 2 P1 workers and 1 IP address.  There are 2 Front Ends so as to provide high availability and distribute the load.  The minimum size for the Front Ends is P2 to ensure they have enough capacity to support a modest system.  If you know that the system needs to support a high number of requests then you can adjust the quantity of Front Ends and the server size used.

As noted earlier, within an ASE there are 3 worker pools which a customer can define.  The compute resource size can be from P1 to P4.  By default there are only 2 P1 workers configured in Worker Pool 1.  That is enough to support a single App Service Plan with 1 instance.  

The sliders automatically adjust to reflect the total compute capacity available in the App Service Environment.  As the sliders are adjusted within any one pool the other sliders change to reflect the available quantity of compute resources left before reaching 55.  
 
![][3]

Adding new instances to be available does not happen quickly.  If you know you are going to need additional compute resources then you should provision them well in advance.  Provisioning time can take multiple hours depending on how many are being added to the system.  Remember that to ensure that your system has can meet fault tolerance requirements, every ASE needs to have a reserve instance available in each worker pool.  

By default an ASE comes with 1 IP address that is available for IP SSL.  If you know that you will need more you can specify that here or manage it after creation.
  
### After App Service Environment creation ###

After ASE creation you can adjust:

- Quantity of Front Ends (minimum: 2)
- Quantity of  Workers (minimum: 2)
- Quantity of IP addresses
- Compute resource sizes used by the Front Ends or Workers (Front End minimum size is P2)

You cannot change:

- Location
- Subscription
- Resource Group
- VNET used
- Subnet used

There are more details around management and monitoring of App Service Environments here: [How to configure an App Service Environment][ASEConfig] 

There are additional dependencies that are not available for customization such as the database and storage.  These are handled by Azure and come with the system.  The system storage supports up to 500 GB for the entire App Service Environment.  


## Getting started

To get started with App Service Environments, see [Introduction to App Service Environments][WhatisASE]

For more information about the Azure App Service platform, see [Azure App Service][AzureAppService].

[AZURE.INCLUDE [app-service-web-whats-changed](../includes/app-service-web-whats-changed.md)]

[AZURE.INCLUDE [app-service-web-try-app-service](../includes/app-service-web-try-app-service.md)]
 

<!--Image references-->
[1]: ./media/app-service-web-how-to-create-an-app-service-environment/createaseblade.png
[2]: ./media/app-service-web-how-to-create-an-app-service-environment/createasenetwork.png
[3]: ./media/app-service-web-how-to-create-an-app-service-environment/createasescale.png

<!--Links-->
[WhatisASE]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-intro/
[ASEConfig]: http://azure.microsoft.com/documentation/articles/app-service-web-configure-an-app-service-environment/
[AppServicePricing]: http://azure.microsoft.com/pricing/details/app-service/ 
[AzureAppService]: http://azure.microsoft.com/documentation/articles/app-service-value-prop-what-is/