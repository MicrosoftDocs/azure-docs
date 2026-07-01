---
title: Control Traffic with Traffic Manager
description: Find best practices for configuring Azure Traffic Manager when you integrate it with Azure App Service.

ms.assetid: dabda633-e72f-4dd4-bf1c-6e945da456fd
ms.topic: concept-article
ms.date: 03/19/2026
author: cephalin
ms.author: cephalin
ms.service: azure-app-service

# Customer intent: As a network engineer, I want to get an overview of how to use Traffic Manager with App Service so that I can control how requests from web clients are distributed to apps in App Service. 

---
# Controlling Azure App Service traffic with Azure Traffic Manager
> [!NOTE]
> This article provides information about Azure Traffic Manager as it relates to Azure App Service. For more information about Traffic Manager, select the link at the end of this article.
> 
> 


You can use Traffic Manager to control how requests from web clients are distributed to apps in App Service. When App Service endpoints are added to a Traffic Manager profile, Traffic Manager keeps track of the status of your App Service apps (running, stopped, or deleted) so that it can determine which of those endpoints should receive traffic.

## Routing methods
Traffic Manager uses four routing methods. These methods, as they pertain to App Service, are described in the following list.

* **[Priority](../traffic-manager/traffic-manager-routing-methods.md#priority-traffic-routing-method):** use a primary app for all traffic, and provide backups in case the primary or the backup apps are unavailable.
* **[Weighted](../traffic-manager/traffic-manager-routing-methods.md#weighted):** distribute traffic across a set of apps, either evenly or according to weights that you define.
* **[Performance](../traffic-manager/traffic-manager-routing-methods.md#performance):** when you have apps in different geographic locations, use the "closest" app, in terms of the lowest network latency.
* **[Geographic](../traffic-manager/traffic-manager-routing-methods.md#geographic):** direct users to specific apps based on the geographic location their DNS query originates from. 

For more information, see [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).

## App Service and Traffic Manager profiles
To configure the control of App Service app traffic, you create a profile in Traffic Manager that uses one of the four load balancing methods described previously. You then add the endpoints (in this case, App Service) for which you want to control traffic to the profile. Your app status (running, stopped, or deleted) is regularly communicated to the profile so that Traffic Manager can direct traffic accordingly.

When you use Traffic Manager with Azure, keep in mind the following points:

* For app-only deployments within a single region, App Service already provides failover and round-robin functionality without regard to app mode.
* For deployments in the same region that use App Service with another Azure cloud service, you can combine both types of endpoints to enable hybrid scenarios.
* You can only specify one App Service endpoint per region in a profile. When you select an app as an endpoint for one region, the remaining apps in that region become unavailable for selection for that profile.
* The App Service endpoint that you specify in a Traffic Manager profile appears on the **Settings** > **Custom domains** page for the app in the profile, but it's not configurable there.
* After you add an app to a profile, the **Default domain** on the app's **Overview** page displays the custom domain URL of the app, if you've set one up. Otherwise, it displays the Traffic Manager profile URL (for example, `contoso.trafficmanager.net`). Both the direct domain name of the app and the Traffic Manager URL are visible on the **Settings** > **Custom domains** page.
* Your custom domain names work as expected, but in addition to adding them to your apps, you must also configure your DNS map to point to the Traffic Manager URL. For information on how to set up a custom domain for an App Service app, see [Configure Traffic Manager for your Azure App Service domain](configure-domain-traffic-manager.md).
* You can only add apps that are in standard or premium mode to a Traffic Manager profile.
* Adding an app to a Traffic Manager profile causes the app to be restarted.

## Related content
For a conceptual and technical overview of Traffic Manager, see the [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md).
