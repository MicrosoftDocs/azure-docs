---
title: Create an External Azure App Service Environment
description: Explains how to create an Azure App Service Environment while creating an app or standalone
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 94dd0222-b960-469c-85da-7fcb98654241
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: ccompy
---
# Create an external App Service Environment #

The App Service Environment (ASE) is a deployment of the Azure App Service into a subnet in your Azure Virtual Network (VNet). There are two ways to deploy an ASE:

- with a VIP on an external IP address, often called an _External ASE_.
- with the VIP on an internal IP address, often called an _ILB ASE_ because the internal endpoint is an Internal Load Balancer (ILB).

This article shows you how to create an External ASE. For an overview on the ASE you can start with [An Introduction to the App Service Environment][Intro]  For details on creating an ILB ASE, see [Create and use an ILB ASE][MakeILBASE].

## Before you create your ASE ##

It is important to be aware of the things you can't change after ASE creation, which are:

- Location
- Subscription
- Resource Group
- Virtual Network used
- Subnet used
- Subnet size

> [!NOTE]
> When picking a Virtual Network and specifying a subnet, make sure that it's large enough to accommodate any future growth. The recommended size is a `/25` with 128 addresses.
>

## Three ways to create an ASE ##

There are 3 ways to create an ASE. You can create an ASE:

- While creating an App Service plan, which creates the ASE and the App Service plan in one step.
- From the standalone ASE creation UI, which creates an ASE with nothing in it. This is a more advanced ASE creation UI experience, and is where you go to create an ASE with an Internal Load Balancer (ILB).
- From a Resource Manager template. This is for the advanced user and is covered in [Create an ASE from a template][MakeASEfromTemplate].

An ASE created without an ILB has a public VIP. That means that all HTTP traffic to the apps in the ASE will hit an internet accessible IP address. An ASE with an ILB has an endpoint on a Virtual Network IP address. Those apps are not exposed directly to the internet.

## Create an ASE and an App Service plan together ##

The App Service plan is a container of apps. When you create an app in the App Service, you always need to pick or create an App Service plan. The container model is: environments hold App Service plans, and App Service plans hold apps.

To create an ASE during App Service plan creation:

1. In the [Azure portal](https://portal.azure.com/), click **New &gt; Web + Mobile &gt; Web App**

    ![][1]
1. Select your subscription. If you have multiple subscriptions, be aware that to create an app in your ASE, you need to use the same subscription that you used when creating the ASE.
1. Select or create a resource group. *Resource groups* enable you to manage related Azure resources as a unit and are useful when establishing *role-based access control* (RBAC) rules for your apps. For more information, see [Azure Resource Manager overview][ARMOverview].
1. Click the App Service plan and then select **Create New**.

    ![][2]
1. In the **Location** dropdown, pick the region where you want the ASE to be created. If you pick an existing ASE, it will not enable the creation of a new ASE but will simply create the App Service plan in the ASE you selected.
1. Click the **Pricing Plan** UI and pick one of the **Isolated** pricing SKUs. Picking an **Isolated** SKU card and a location that is not an ASE means that you want to create a new ASE in that location. Doing this reveals the ASE creation UI after you click **Select** on the pricing card page. The **Isolated** SKU is only available in conjunction with an ASE. You also cannot use any other pricing SKU in an ASE other than **Isolated**.

    ![][3]
1. Enter the name for your ASE. The name of your ASE is used in the addressable name for your apps. If name of the ASE is _appsvcenvdemo_ then the subdomain name is *.appsvcenvdemo.p.azurewebsites.net*. If you then create an app named *mytestapp*, then it is addressable at *mytestapp.appsvcenvdemo.p.azurewebsites.net*. You cannot use white space in the name of your ASE. If you use upper case characters in the name, the domain name will be the total lowercase version of that name.

    ![][4]
1. Choose either **Create New** or **Select Existing**. The option to select an existing Virtual Network is only available if you have a Virtual Network in the selected region. If you select **Create New**, you provide a name for the Virtual Network, and a new Resource Manager Virtual Network with that name will be created with the address space `192.168.250.0/23` in the selected region. If you select **Select Existing**, you need to:
    1. Select the Virtual Network address block if you have more than one.
    2. Provide a new subnet name.
    3. Select the size of the subnet. **Reminder: This should be something large enough to accommodate any future growth of your ASE.** The recommended size is a `/25` which has 128 addresses and can handle a maximum sized ASE. `/28` is not recommended, for example, because only 16 addresses are available. Infrastructure needs would use up at least 5 addresses, leaving you with just a maximum scaling of 11 instances in a `/28` subnet.
    4. Select the subnet IP range.

The ASE creation process will begin after you select **Create**. This will also create the App Service plan and the app. The ASE, App Service plan and app will all be under the same subscription and also in the same resource group. If you need your ASE to be in a separate resource group from your App Service plan and app, or if you need an ILB ASE, then use the standalone ASE creation experience.

## Create an ASE by itself ##

Going through the standalone ASE creation flow will create an ASE with nothing in it. An empty ASE will still incur a monthly charge for the infrastructure. The main reasons to go through this workflow is to create an ASE with an ILB or to create an ASE in its own resource group. After creating your ASE, you can create apps in the ASE by using the normal app creation experiences and by selecting your new ASE as the location.

Access the ASE creation UI by searching in the Azure Marketplace for ***App Service Environment*** or by going through New -&gt; Web Mobile -&gt; App Service Environment. To create an ASE using the standalone creation experience:

1. Provide the name of your ASE. The name that is specified for the ASE will be used for the apps created in the ASE. If name of the ASE is *mynewdemoase* then the subdomain name would be *.mynewdemoase.p.azurewebsites.net*. If you then create an app named *mytestapp*, then it is addressable at *mytestapp.mynewdemoase.p.azurewebsites.net*. You cannot use white space in the name of your ASE. If you use uppercase characters in the name, the domain name will be the total lowercase version of that name. If you use an ILB, then your ASE name is not used in your subdomain, but is instead explicitly stated during ASE creation.

    ![][5]
1.  Select your subscription. The subscription used for your ASE is also the one that all apps in that ASE will be created with. You cannot place your ASE in a Virtual Network that is in another subscription.
1.  Select or specify a new resource group. The resource group used for your ASE must be the same that is used for your Virtual Network. If you select an existing Virtual Network, then the resource group selection for your ASE will be updated to reflect that of your Virtual Network.

    ![][6]
1. Make your Virtual Network and Location selections. You can choose to create a new Virtual Network or select an existing Virtual Network. If you select a new Virtual Network, then you can specify a name and location. The new Virtual Network will have the address range 192.168.250.0/23 and a subnet named **default** that is defined as 192.168.250.0/24. You can only select a Resource Manager Virtual Network. The **VIP Type** selection determines if your ASE can be directly accessed from the internet (External) or if it uses an Internal Load Balancer (ILB). To learn more about them, see [Create and Use an Internal Load Balancer with an App Service Environment][MakeILBASE]. If you select a VIP type of **External**, then you can select how many external IP addresses the system is created with for IP-based SSL purposes. If you select **Internal**, then you need to specify the subdomain that your ASE will use. ASEs can be deployed into virtual networks that use *either* public address ranges, *or* RFC1918 address spaces (i.e. private addresses). In order to use a virtual network with a public address range, you will need to create the Virtual Network ahead of time. When you select an existing Virtual Network, you will need to create a new subnet during ASE creation. **You cannot use a pre-created subnet in the portal. You can create an ASE with an existing subnet if you create your ASE using a Resource Manager template.** To create an ASE from a template, see [Create an App Service Environment from template][MakeASEfromTemplate]

## App Service Environment v1 ##

You can still create instances of the first version of the ASE feature (ASEv1). To reach that experience search in the marketplace for **App Service Environment v1.** The creation experience is the same as the standalone ASE creation experience. When completed, your ASEv1 will be created with two Front Ends and two Workers. With ASEv1, you need to manage the Front Ends and Workers. They are not automatically added when you create your App Service plans. The Front Ends act as the HTTP/HTTPS endpoints and send traffic to the Workers, which are the roles that host your apps. You can adjust the quantity after ASE creation. To learn more about ASEv1, see [Introduction to the App Service Environment v1][ASEv1Intro]. For more details around scaling, management and monitoring of ASEv1, see [How to configure an App Service Environment][ConfigureASEv1].

<!--Image references-->
[1]: ./media/how_to_create_an_external_app_service_environment/createexternalase-create.png
[2]: ./media/how_to_create_an_external_app_service_environment/createexternalase-aspcreate.png
[3]: ./media/how_to_create_an_external_app_service_environment/createexternalase-pricing.png
[4]: ./media/how_to_create_an_external_app_service_environment/createexternalase-embeddedcreate.png
[5]: ./media/how_to_create_an_external_app_service_environment/createexternalase-standalonecreate.png
[6]: ./media/how_to_create_an_external_app_service_environment/createexternalase-network.png



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
