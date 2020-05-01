---
title: Create an ASE v1
description: Creation flow description for an app service environment v1. This doc is provided only for customers who use the legacy v1 ASE.
author: ccompy

ms.assetid: 81bd32cf-7ae5-454b-a0d2-23b57b51af47
ms.topic: article
ms.date: 07/11/2017
ms.author: ccompy
ms.custom: seodec18

---
# How to Create an App Service Environment v1 

> [!NOTE]
> This article is about the App Service Environment v1. There is a newer version of the App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version start with the [Introduction to the App Service Environment](intro.md).
> 

### Overview
The App Service Environment (ASE) is a Premium service option of Azure App Service that delivers an enhanced configuration capability that is not available in the multi-tenant stamps. The ASE feature essentially deploys the Azure App Service into a customer’s virtual network. To gain a greater understanding of the capabilities offered by App Service Environments read the [What is an App Service Environment][WhatisASE] documentation.

### Before you create your ASE
It is important to be aware of the things you cannot change. Those aspects you cannot change about your ASE after it is created are:

* Location
* Subscription
* Resource Group
* VNet used
* Subnet used 
* Subnet size

When picking a VNet and specifying a subnet, make sure it is large enough to accommodate any future growth. 

### Creating an App Service Environment v1
To create an App Service Environment v1, you can search the Azure Marketplace for ***App Service Environment v1***, or go through **Create a resource** -> **Web + Mobile** -> **App Service Environment**. To create an ASEv1:

1. Provide the name of your ASE. The name you specify for the ASE will be used for the apps created in the ASE. If the name of the ASE is appsvcenvdemo, the subdomain name would be: *appsvcenvdemo.p.azurewebsites.net*. If you thus created an app named *mytestapp*, it would be addressable at *mytestapp.appsvcenvdemo.p.azurewebsites.net*. You cannot use white space in the name of your ASE. If you use upper-case characters in the name, the domain name will be the total lowercase version of that name. If you use an ILB, your ASE name is not used in your subdomain but is instead explicitly stated during ASE creation.
   
    ![][1]
2. Select your subscription. The subscription you use for your ASE will also apply to all apps you create in that ASE. You cannot place your ASE in a VNet that is in another subscription.
3. Select or specify a new resource group. The resource group used for your ASE must be the same that is used for your VNet. If you select a pre-existing VNet, the resource group selection for your ASE will be updated to reflect that of your VNet.
   
    ![][2]
4. Make your Virtual Network and Location selections. You can choose to create a new VNet or select a pre-existing VNet. If you select a new VNet then you can specify a name and location. The new VNet will have the address range 192.168.250.0/23 and a subnet named **default** that is defined as 192.168.250.0/24. You can also simply select a pre-existing Classic or Resource Manager VNet. The VIP Type selection determines if your ASE can be directly accessed from the internet (External) or if it uses an Internal Load Balancer (ILB). To learn more about them read [Using an Internal Load Balancer with an App Service Environment][ILBASE]. If you select a VIP type of External then you can select how many external IP addresses the system is created with for IP SSL purposes. If you select Internal then you need to specify the subdomain that your ASE will use. ASEs can be deployed into virtual networks that use *either* public address ranges, *or* RFC1918 address spaces (i.e. private addresses). In order to use a virtual network with a public address range, you will need to create the VNet ahead of time. When you select a pre-existing VNet you will need to create a new subnet during ASE creation. **You cannot use a pre-created subnet in the portal. You can create an ASE with a pre-existing subnet if you create your ASE using a resource manager template.** To create an ASE from a template use the information here, [Creating an App Service Environment from template][ILBAseTemplate] and here, [Creating an ILB App Service Environment from template][ASEfromTemplate].

### Details
An ASE is created with 2 Front Ends and 2 Workers. The Front Ends act as the HTTP/HTTPS endpoints and send traffic to the Workers which are the roles that host your apps. You can adjust the quantity after ASE creation and can even set up autoscale rules on these resource pools. For more details around manual scaling, management and monitoring of an App Service Environment go here: [How to configure an App Service Environment][ASEConfig] 

Only the one ASE can exist in the subnet used by the ASE. The subnet cannot be used for anything other than the ASE

### After App Service Environment v1 creation
After ASE creation you can adjust:

* Quantity of Front Ends (minimum: 2)
* Quantity of Workers (minimum: 2)
* Quantity of IP addresses available for IP SSL
* Compute resource sizes used by the Front Ends or Workers (Front End minimum size is P2)

There are more details around manual scaling, management and monitoring of App Service Environments here: [How to configure an App Service Environment][ASEConfig] 

For information on autoscaling there is a guide here:
[How to configure autoscale for an App Service Environment][ASEAutoscale]

There are additional dependencies that are not available for customization such as the database and storage. These are handled by Azure and come with the system. The system storage supports up to 500 GB for the entire App Service Environment and the database is adjusted by Azure as needed by the scale of the system.

## Getting started
To get started with App Service Environment v1, see [Introduction to the App Service Environment v1][WhatisASE]

[!INCLUDE [app-service-web-try-app-service](../../../includes/app-service-web-try-app-service.md)]

<!--Image references-->
[1]: ./media/app-service-web-how-to-create-an-app-service-environment/asecreate-basecreateblade.png
[2]: ./media/app-service-web-how-to-create-an-app-service-environment/asecreate-vnetcreation.png

<!--Links-->
[WhatisASE]: app-service-app-service-environment-intro.md
[ASEConfig]: app-service-web-configure-an-app-service-environment.md
[AppServicePricing]: https://azure.microsoft.com/pricing/details/app-service/ 
[ASEAutoscale]: app-service-environment-auto-scale.md
[ILBASE]: app-service-environment-with-internal-load-balancer.md
[ILBAseTemplate]: https://azure.microsoft.com/documentation/templates/201-web-app-ase-create/
[ASEfromTemplate]: app-service-app-service-environment-create-ilb-ase-resourcemanager.md
