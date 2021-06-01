---
title: Control traffic with Traffic Manager
description: Find best practices for configuring Azure Traffic Manager when you integrate it with Azure App Service.

ms.assetid: dabda633-e72f-4dd4-bf1c-6e945da456fd
ms.topic: article
ms.date: 02/25/2016
ms.custom: seodec18

---
# Controlling Azure App Service traffic with Azure Traffic Manager
> [!NOTE]
> This article provides summary information for Microsoft Azure Traffic Manager as it relates to Azure App Service. More information about Azure Traffic Manager itself can be found by visiting the links at the end of this article.
> 
> 

## Introduction
You can use Azure Traffic Manager to control how requests from web clients are distributed to apps in Azure App Service. When App Service endpoints are added to an Azure Traffic Manager profile, Azure Traffic Manager keeps track of the status of your App Service apps (running, stopped, or deleted) so that it can decide which of those endpoints should receive traffic.

## Routing methods
Azure Traffic Manager uses four different routing methods. These methods are described  in the following list as they pertain to Azure App Service.

* **[Priority](../traffic-manager/traffic-manager-routing-methods.md#priority-traffic-routing-method):** use a primary app for all traffic, and provide backups in case the primary or the backup apps are unavailable.
* **[Weighted](../traffic-manager/traffic-manager-routing-methods.md#weighted):** distribute traffic across a set of apps, either evenly or according to weights, which you define.
* **[Performance](../traffic-manager/traffic-manager-routing-methods.md#performance):** when you have apps in different geographic locations, use the "closest" app in terms of the lowest network latency.
* **[Geographic](../traffic-manager/traffic-manager-routing-methods.md#geographic):** direct users to specific apps based on which geographic location their DNS query originates from. 

For more information, see [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).

## App Service and Traffic Manager Profiles
To configure the control of App Service app traffic, you create a profile in Azure Traffic Manager that uses one of the four load balancing methods described previously, and then add the endpoints (in this case, App Service) for which you want to control traffic to the profile. Your app status (running, stopped, or deleted) is regularly communicated to the profile so that Azure Traffic Manager can direct traffic accordingly.

When using Azure Traffic Manager with Azure, keep in mind the following points:

* For app only deployments within the same region, App Service already provides failover and round-robin functionality without regard to app mode.
* For deployments in the same region that use App Service in conjunction with another Azure cloud service, you can combine both types of endpoints to enable hybrid scenarios.
* You can only specify one App Service endpoint per region in a profile. When you select an app as an endpoint for one region, the remaining apps in that region become unavailable for selection for that profile.
* The App Service endpoints that you specify in an Azure Traffic Manager profile appears under the **Domain Names** section on the Configure page for the app in the profile, but is not configurable there.
* After you add an app to a profile, the **Site URL** on the Dashboard of the app's portal page displays the custom domain URL of the app if you have set one up. Otherwise, it displays the Traffic Manager profile URL (for example, `contoso.trafficmanager.net`). Both the direct domain name of the app and the Traffic Manager URL are visible on the app's Configure page under the **Domain Names** section.
* Your custom domain names work as expected, but in addition to adding them to your apps, you must also configure your DNS map to point to the Traffic Manager URL. For information on how to set up a custom domain for an App Service app, see [Configure a custom domain name in Azure App Service with Traffic Manager integration](configure-domain-traffic-manager.md).
* You can only add apps that are in standard or premium mode to an Azure Traffic Manager profile.
* Adding an app to a Traffic Manager profile causes the app to be restarted.

## Next Steps
For a conceptual and technical overview of Azure Traffic Manager, see [Traffic Manager Overview](../traffic-manager/traffic-manager-overview.md).


