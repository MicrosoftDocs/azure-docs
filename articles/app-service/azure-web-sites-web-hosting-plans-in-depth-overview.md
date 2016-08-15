<properties
	pageTitle="Azure App Service plans in-depth overview | Microsoft Azure"
	description="Learn how App Service plans for Azure App Service work, and how they benefit your management experience."
	keywords="app service, azure app service, scale, scalable, app service plan, app service cost"
	services="app-service"
	documentationCenter=""
	authors="btardif"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/07/2016"
	ms.author="byvinyal"/>

# Azure App Service plans in-depth overview#

An App Service plan represents a set of features and capacity that you can share across multiple apps, which include Web Apps, Mobile Apps, Logic Apps, or API Apps, in [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714). These plans support five pricing tiers: *Free*, *Shared*, *Basic*, *Standard*, and *Premium*. Each tier has its own capabilities and capacity. Apps in the same subscription and geographic location can share a plan. All the apps that share a plan can use all the capabilities and features that are defined by the plan's tier. All apps that are associated with a plan run on the resources that the plan defines.

For example, if your plan is configured to use two "small" instances in the standard service tier, all apps that are associated with that plan will run on both instances and will have access to the standard service tier functionality. Plan instances on which apps are running are fully managed and highly available.

In this article, we'll explore the key characteristics, such as tier and scale, of an App Service plan and how they come into play while managing your apps.

## Apps and App Service plans

An app in App Service can be associated with only one App Service plan at any given time.

Both apps and plans are contained in a resource group. A resource group serves as the lifecycle boundary for every resource that's within it. You can use resource groups to manage all the pieces of an application together.

Because a single resource group can have multiple App Service plans, you can allocate different apps to different physical resources. For example, you can separate resources among dev, test, and production environments. A scenario for this is when you might want to allocate one plan with its own dedicated set of resources for your production apps, and a second plan for your dev and test environments. In this way, load testing against a new version of your apps will not compete for the same resources as your production apps, which are serving real customers.

When you have multiple plans in a single resource group, you can also define an application that spans geographical regions. For example, a highly available app running in two regions will include two plans, one for each region, and one app associated with each plan. In such a situation, all the copies of the app will be associated with a single resource group. A single view of a resource group that has multiple plans and multiple apps makes it easy to manage, control, and view the health of the application.

## Create a new App Service plan vs. use an existing plan

When you create a new app, you should consider creating a new resource group. On the other hand, if the app that you are about to create is a component for a larger application, this app should be created within the resource group that's allocated for that larger application.

Whether the new app is an altogether new application or part of a larger one, you can choose to use an existing App Service plan to host it or create a new one. This is more a question of capacity and expected load.

If this new app is going to use a lot of resources and have different scaling factors from the other apps hosted in an existing plan, we recommend that you isolate it in its own plan.

When you create a new plan, you can allocate a new set of resources for your app and gain greater control over resource allocation because each plan gets its own set of instances.

Because you can move apps across plans, you can change the way that resources are allocated across the bigger application.

Finally, if you want to create a new app in a different region, and that region doesn't have an existing plan, you will have to create a new plan in that region to be able to host your app there.

## Create an App Service plan

You can create an empty App Service plan from the App Service plan browse experience or as part of app creation.

In the [Azure portal](https://portal.azure.com), click **New**, click **Web + mobile**, and then click 	**Web App**, **Mobile App**, **API App** or **Logic App**.
![Create an app in the Azure portal.][createWebApp]

You can then select or create the App Service plan for the new app.

 ![Create an App Service plan.][createASP]

To create a new App Service plan, click **[+] Create New**, type the **App Service plan** name, and then select an appropriate **Location**. Click **Pricing tier**, and then select an appropriate pricing tier for the service. Select **View all** to view more pricing options, such as **Free** and **Shared**. After you have selected the pricing tier, click the **Select** button.

## Move an app to a different App Service plan

You can move an app to a different app service plan in the [Azure portal](https://portal.azure.com). You can move apps between plans as long as the plans are in the same resource group and geographical region.

To move an app to another plan, go to the app that you want to move. On the **Settings** menu, look for **Change App Service Plan**.

This will open the **App Service plan** selector. At this point, you can either pick an existing plan or create a new one. Only valid plans (in the same resource group and geographical location) are shown.

![App Service plan selector.][change]

Note that each plan has its own pricing tier. For example, when you move a site from a Free tier to a Standard tier, your app will be able to use all the features and resources of the Standard tier.

## Clone an app to a different App Service plan
If you want to move the app to a different region, one alternative is app cloning. Cloning will make a copy of your app in a new or existing App Service plan or App Service environment in any region.

 ![Clone an app.][appclone]

You can find **Clone App** on the **Tools** menu.

Cloning has some limitations that you can read about at [Azure App Service App cloning using Azure portal](../app-service-web/app-service-web-app-cloning-portal.md).

## Scale an App Service plan

There are three ways to scale a plan:

- **Change the plan’s pricing tier**. For example, a plan in the Basic tier can be converted to a Standard or Premium tier, and all apps that are associated with that plan will be able to use the features that the new service tier offers.
- **Change the plan’s instance size**. As an example, a plan in the Basic tier that uses small instances can be changed to use large instances. All apps that are associated with that plan will be able to use the additional memory and CPU resources that the larger instance size offers.
- **Change the plan’s instance count**. For example, a Standard plan that's scaled out to three instances can be scaled to 10 instances. A Premium plan can be scaled out to 20 instances (subject to availability). All apps that are associated with that plan will be able to use the additional memory and CPU resources that the larger instance count offers.

You can change the pricing tier and instance size by clicking the **Scale Up** item under settings for either the app or the App Service plan. Changes will apply to the App Service plan and affect all apps that it hosts.

 ![Set values to scale up an app.][pricingtier]

## Summary

App Service plans represent a set of features and capacity that you can share across your apps. App Service plans give you the flexibility to allocate specific apps to a set of resources and further optimize your Azure resource utilization. This way, if you want to save money on your testing environment, you can share a plan across multiple apps. You can also maximize throughput for your production environment by scaling it across multiple regions and plans.

## What's changed

* For a guide to the change from Websites to App Service, see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

[pricingtier]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/appserviceplan-pricingtier.png
[assign]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/assing-appserviceplan.png
[change]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/change-appserviceplan.png
[createASP]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-appserviceplan.png
[createWebApp]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-web-app.png
[appclone]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/app-clone.png
