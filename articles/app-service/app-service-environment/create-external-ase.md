---
title: Create an external Azure App Service Environment
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

The Azure App Service Environment is a deployment of the Azure App Service into a subnet in your Azure virtual network. There are two ways to deploy an App Service Environment:

- With a VIP on an external IP address, often called an external App Service Environment.
- With the VIP on an internal IP address, often called an ILB App Service Environment because the internal endpoint is an internal load balancer (ILB).

This article shows you how to create an external App Service Environment. For an overview of the App Service Environment, see [An introduction to the App Service Environment][Intro]. For information on how to create an ILB App Service Environment, see [Create and use an ILB App Service Environment][MakeILBASE].

## Before you create your App Service Environment ##

After you create your App Service Environment, you can't change the following:

- Location
- Subscription
- Resource group
- Virtual network used
- Subnet used
- Subnet size

> [!NOTE]
> When you choose a virtual network and specify a subnet, make sure that it's large enough to accommodate future growth. We recommend a size of `/25` with 128 addresses.
>

## Three ways to create an App Service Environment ##

There are three ways to create an App Service Environment:

- While you create an App Service plan, which creates the App Service Environment and the App Service plan in one step.
- From the standalone App Service Environment creation UI, which creates an App Service Environment with nothing in it. This method is a more advanced App Service Environment creation UI experience and is where you go to create an App Service Environment with an ILB.
- From an Azure Resource Manager template. This method is for advanced users and is explained in [Create an App Service Environment from a template][MakeASEfromTemplate].

An App Service Environment created without an ILB has a public VIP. That means all HTTP traffic to the apps in the App Service Environment hit an Internet-accessible IP address. An App Service Environment with an ILB has an endpoint on a virtual network IP address. Those apps aren't exposed directly to the Internet.

## Create an App Service Environment and an App Service plan together ##

The App Service plan is a container of apps. When you create an app in the App Service, you always need to choose or create an App Service plan. The container model environments hold App Service plans, and App Service plans hold apps.

To create an App Service Environment while you create an App Service plan:

1. In the [Azure portal](https://portal.azure.com/), click **New** > **Web + Mobile** > **Web App**.

    ![][1]

2. Select your subscription. If you have multiple subscriptions, use the same subscription that you used when you created the App Service Environment.

3. Select or create a resource group. With resource groups, you can manage related Azure resources as a unit. Resource groups also are useful when you establish Role-Based Access Control rules for your apps. For more information, see the [Azure Resource Manager overview][ARMOverview].

4. Click the App Service plan, and then select **Create New**.

    ![][2]

5. In the **Location** drop-down list box, select the region where you want to create the App Service Environment. If you select an existing App Service Environment, a new App Service Environment isn't created. The App Service plan is created in the App Service Environment that you selected. 

6. Click the **Pricing tier** page, and select one of the **Isolated** pricing SKUs. If you select an **Isolated** SKU card and a location that's not an App Service Environment, a new App Service Environment is created in that location. To open the App Service Environment creation page, click **Select**. The **Isolated** SKU is available only in conjunction with an App Service Environment. You also can't use any other pricing SKU in an App Service Environment other than **Isolated**.

    ![][3]

7. Enter the name for your App Service Environment. This name is used in the addressable name for your apps. If the name of the App Service Environment is _appsvcenvdemo_, the subdomain name is *.appsvcenvdemo.p.azurewebsites.net*. If you create an app named *mytestapp*, it's addressable at *mytestapp.appsvcenvdemo.p.azurewebsites.net*. You can't use white space in the name. If you use uppercase characters, the domain name is the total lowercase version of that name.

    ![][4]

8. Choose either **Create New** or **Select Existing**. The option to select an existing virtual network is available only if you have a virtual network in the selected region. If you select **Create New**, enter a name for the virtual network. A new Resource Manager virtual network with that name is created with the address space `192.168.250.0/23` in the selected region. If you select **Select Existing**, you need to:

    a. Select the virtual network address block, if you have more than one.

    b. Enter a new subnet name.

    c. Select the size of the subnet. *Remember to select a size large enough to accommodate future growth of your App Service Environment.* We recommend `/25`, which has 128 addresses and can handle a maximum-sized App Service Environment. We do not recommend `/28`, for example, because only 16 addresses are available. Infrastructure uses at least 5 addresses, which leaves you with a maximum scaling of 11 instances in a `/28` subnet.

    d. Select the subnet IP range.

9. Select **Create** to create the App Service Environment. This process also creates the App Service plan and the app. The App Service Environment, App Service plan, and app are all under the same subscription and also in the same resource group. If your App Service Environment needs a separate resource group or if you need an ILB App Service Environment, follow the steps to create an App Service Environment by itself.

## Create an App Service Environment by itself ##

The standalone App Service Environment creation flow creates an App Service Environment with nothing in it. An empty App Service Environment still incurs a monthly charge for the infrastructure. Use this workflow to create an App Service Environment with an ILB or to create an App Service Environment in its own resource group. After you create your App Service Environment, you can create apps in it by using the normal app creation experiences. Select your new App Service Environment as the location.

To access the App Service Environment creation UI, search the Azure Marketplace for **App Service Environment** or use **New** > **Web Mobile** > **App Service Environment**. To create an App Service Environment by using the standalone creation experience:

1. Enter the name of your App Service Environment. This name is used for the apps created in the App Service Environment. If the name is *mynewdemoase*, the subdomain name is *.mynewdemoase.p.azurewebsites.net*. If you create an app named *mytestapp*, it's addressable at *mytestapp.mynewdemoase.p.azurewebsites.net*. You can't use white space in the name. If you use uppercase characters, the domain name is the total lowercase version of the name. If you use an ILB, your App Service Environment name isn't used in your subdomain but is instead explicitly stated during App Service Environment creation.

    ![][5]

2. Select your subscription. This subscription is also the one that all apps in the App Service Environment use. You can't put your App Service Environment in a virtual network that's in another subscription.

3. Select or specify a new resource group. The resource group used for your App Service Environment must be the same one that's used for your virtual network. If you select an existing virtual network, the resource group selection for your App Service Environment is updated to reflect that of your virtual network.

    ![][6]

4. Select your virtual network and location. You can create a new virtual network or select an existing virtual network. 

    * If you select a new virtual network, you can specify a name and location. The new virtual network has the address range 192.168.250.0/23 and a subnet named **default** that's defined as 192.168.250.0/24. You can only select a Resource Manager virtual network. The **VIP Type** selection determines if your App Service Environment can be directly accessed from the Internet (external) or if it uses an ILB. To learn more about these options, see [Create and use an internal load balancer with an App Service Environment][MakeILBASE]. 

        * If you select an **External** VIP type, you can select how many external IP addresses the system is created with for IP-based SSL purposes. 
    
        * If you select an **Internal** VIP type, you need to specify the subdomain that your App Service Environment uses. App Service Environments can be deployed into virtual networks that use either public address ranges or RFC1918 address spaces (for example, private addresses). To use a virtual network with a public address range, you create the virtual network ahead of time. 
    
    * If you select an existing virtual network, a new subnet is created when the App Service Environment is created. *You can't use a pre-created subnet in the portal. You can create an App Service Environment with an existing subnet if you use a Resource Manager template.* To create an App Service Environment from a template, see [Create an App Service Environment from a template][MakeASEfromTemplate].

## App Service Environment v1 ##

You can still create instances of the first version of the App Service Environment feature (App Service Environment v1). To reach that experience, search in the Marketplace for **App Service Environment v1.** The creation experience is the same as the standalone App Service Environment creation experience. When finished, your App Service Environment v1 is created with two Front Ends and two Workers. With App Service Environment v1, you need to manage the Front Ends and Workers. They're not automatically added when you create your App Service plans. The Front Ends act as the HTTP/HTTPS endpoints and send traffic to the Workers, which are the roles that host your apps. You can adjust the quantity after you create your App Service Environment. 

To learn more about App Service Environment v1, see [Introduction to the App Service Environment  v1][ASEv1Intro]. For more information on scaling, managing, and monitoring App Service Environment v1, see [How to configure an App Service Environment][ConfigureASEv1].

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
