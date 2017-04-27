---
title: How to Create an App Service Environment
description: Creation flow description for app service environments
services: app-service
documentationcenter: ''
author: ccompy
manager: stefsch
editor: ''

ms.assetid: 81bd32cf-7ae5-454b-a0d2-23b57b51af47
ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/22/2016
ms.author: ccompy

---
# How to Create an App Service Environment
### Overview
App Service Environments (ASE) are a Premium service option of Azure App Service that delivers an enhanced configuration capability that is not available in the multi-tenant stamps.  The ASE feature essentially deploys the Azure App Service into a customer’s virtual network.  To gain a greater understanding of the capabilities offered by App Service Environments read the [What is an App Service Environment][WhatisASE] documentation.

### Before you create your ASE
It is important to be aware of the things you cannot change.  Those aspects you cannot change about your ASE after it is created are:

* Location
* Subscription
* Resource Group
* VNet used
* Subnet used 
* Subnet size

When picking a VNet and specifying a subnet, make sure it is large enough to accomodate any future growth.  

### Creating an App Service Environment
There are two ways to access the ASE creation UI.  It can be found by searching in the Azure Marketplace for ***App Service Environment*** or by going through New -> Web + Mobile -> App Service Environment.  To create an ASE:

1. Provide the name of your ASE.  The name that is specified for the ASE will be used for the apps created in the ASE.  If name of the ASE is appsvcenvdemo then the subdomain name would be .*appsvcenvdemo.p.azurewebsites.net*.  If you thus created an app named *mytestapp* then it would be addressable at *mytestapp.appsvcenvdemo.p.azurewebsites.net*.  You cannot use white space in the name of your ASE.  If you use upper case characters in the name, the domain name will be the total lowercase version of that name.  If you use an ILB then your ASE name is not used in your subdomain but is instead explicitly stated during ASE creation
   
    ![][1]
2. Select your subscription.  The subscription used for your ASE is also the one that all apps in that ASE will be created with.  You cannot place your ASE in a VNet that is in another subscription
3. Select or specify a new resource group.  The resource group used for your ASE must be the same that is used for your VNet.  If you select a pre-existing VNet then the resource group selection for your ASE will be updated to reflect that of your VNet.
   
    ![][2]
4. Make your Virtual Network and Location selections.  You can choose to create a new VNet or select a pre-existing VNet.  If you select a new VNet then you can specify a name and location. The new VNet will have the address range 192.168.250.0/23 and a subnet named **default** that is defined as 192.168.250.0/24.  You can also simply select a pre-existing Classic or Resource Manager VNet.  The VIP Type selection determines if your ASE can be directly accessed from the internet (External) or if it uses an Internal Load Balancer (ILB).  To learn more about them read [Using an Internal Load Balancer with an App Service Environment][ILBASE].  If you select a VIP type of External then you can select how many external IP addresses the system is created with for IPSSL purposes.  If you select Internal then you need to specify the subdomain that your ASE will use.  ASEs can be deployed into virtual networks that use *either* public address ranges, *or* RFC1918 address spaces (i.e. private addresses).  In order to use a virtual network with a public address range, you will need to create the VNet ahead of time.  When you select a pre-existing VNet you will need to create a new subnet during ASE creation.  **You cannot use a pre-created subnet in the portal.  You can create an ASE with a pre-existing subnet if you create your ASE using a resource manager template.**  To create an ASE from a template use the information here, [Creating an App Service Environment from template][ILBAseTemplate] and here, [Creating an ILB App Service Environment from template][ASEfromTemplate].

### Details
An ASE is created with 2 Front Ends and 2 Workers.  The Front Ends act as the HTTP/HTTPS endpoints and send traffic to the Workers which are the roles that host your apps.   You can adjust the quantity after ASE creation and can even set up autoscale rules on these resource pools.  For more details around manual scaling, management and monitoring of an App Service Environment go here: [How to configure an App Service Environment][ASEConfig] 

Only the one ASE can exist in the subnet used by the ASE.  The subnet cannot be used for anything other than the ASE

### After App Service Environment creation
After ASE creation you can adjust:

* Quantity of Front Ends (minimum: 2)
* Quantity of  Workers (minimum: 2)
* Quantity of IP addresses available for IP SSL
* Compute resource sizes used by the Front Ends or Workers (Front End minimum size is P2)

There are more details around manual scaling, management and monitoring of App Service Environments here: [How to configure an App Service Environment][ASEConfig] 

For information on autoscaling there is a guide here:
[How to configure autoscale for an App Service Environment][ASEAutoscale]

There are additional dependencies that are not available for customization such as the database and storage.  These are handled by Azure and come with the system.  The system storage supports up to 500 GB for the entire App Service Environment and the database is adjusted by Azure as needed by the scale of the system.

## Getting started
All articles and How-To's for App Service Environments are available in the [README for Application Service Environments](../app-service/app-service-app-service-environments-readme.md).

To get started with App Service Environments, see [Introduction to App Service Environments][WhatisASE]

For more information about the Azure App Service platform, see [Azure App Service][AzureAppService].

[!INCLUDE [app-service-web-whats-changed](../../includes/app-service-web-whats-changed.md)]

[!INCLUDE [app-service-web-try-app-service](../../includes/app-service-web-try-app-service.md)]

<!--Image references-->
[1]: ./media/app-service-web-how-to-create-an-app-service-environment/asecreate-basecreateblade.png
[2]: ./media/app-service-web-how-to-create-an-app-service-environment/asecreate-vnetcreation.png

<!--Links-->
[WhatisASE]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-intro/
[ASEConfig]: http://azure.microsoft.com/documentation/articles/app-service-web-configure-an-app-service-environment/
[AppServicePricing]: http://azure.microsoft.com/pricing/details/app-service/ 
[AzureAppService]: http://azure.microsoft.com/documentation/articles/app-service-value-prop-what-is/ 
[ASEAutoscale]: http://azure.microsoft.com/documentation/articles/app-service-environment-auto-scale/
[ILBASE]: http://azure.microsoft.com/documentation/articles/app-service-environment-with-internal-load-balancer/
[ILBAseTemplate]: http://azure.microsoft.com/documentation/templates/201-web-app-ase-create/
[ASEfromTemplate]: http://azure.microsoft.com/documentation/articles/app-service-app-service-environment-create-ilb-ase-resourcemanager/
