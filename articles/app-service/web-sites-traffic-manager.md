---
title: Controlling Azure web app traffic with Azure Traffic Manager
description: This article provides summary information for  Azure Traffic Manager as it relates to Azure web apps.
services: app-service\web
documentationcenter: ''
author: cephalin
writer: cephalin
manager: erikre
editor: mollybos

ms.assetid: dabda633-e72f-4dd4-bf1c-6e945da456fd
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/25/2016
ms.author: cephalin

---
# Controlling Azure web app traffic with Azure Traffic Manager
> [!NOTE]
> This article provides summary information for Microsoft Azure Traffic Manager as it relates to Azure Web Apps. More information about Azure Traffic Manager itself can be found by visiting the links at the end of this article.
> 
> 

## Introduction
You can use Azure Traffic Manager to control how requests from web clients are distributed to web apps in Azure App Service. When web app endpoints are added to an Azure Traffic Manager profile, Azure Traffic Manager keeps track of the status of your web apps (running, stopped, or deleted) so that it can decide which of those endpoints should receive traffic.

## Routing methods
Azure Traffic Manager uses four different routing methods. These methods are described  in the following list as they pertain to Azure Web Apps.

* **[Priority](#priority):** use a primary Web App for all traffic, and provide backups in case the primary or the backup Web Apps are unavailable.
* **[Weighted](#weighted):** distribute traffic across a set of Web Apps, either evenly or according to weights, which you define.
* **[Performance](#performance):** when you have Web Apps in different geographic locations, use the "closest" Web App in terms of the lowest network latency.
* **[Geographic](#geographic):** direct users to specific Web Apps based on which geographic location their DNS query originates from. 

For more information, see [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).

## Web Apps and Traffic Manager Profiles
To configure the control of Web App traffic, you create a profile in Azure Traffic Manager that uses one of the three load balancing methods described previously, and then add the endpoints (in this case, Web Apps) for which you want to control traffic to the profile. Your Web App status (running, stopped, or deleted) is regularly communicated to the profile so that Azure Traffic Manager can direct traffic accordingly.

When using Azure Traffic Manager with Azure, keep in mind the following points:

* For Web App only deployments within the same region, Web Apps already provides failover and round-robin functionality without regard to Web App mode.
* For deployments in the same region that use Web Apps in conjunction with another Azure cloud service, you can combine both types of endpoints to enable hybrid scenarios.
* You can only specify one Web App endpoint per region in a profile. When you select a Web App as an endpoint for one region, the remaining Web Apps in that region become unavailable for selection for that profile.
* The Web App endpoints that you specify in an Azure Traffic Manager profile appears under the **Domain Names** section on the Configure page for the Web App in the profile, but is not configurable there.
* After you add a Web App to a profile, the **Site URL** on the Dashboard of the Web App's portal page displays the custom domain URL of the Web App if you have set one up. Otherwise, it displays the Traffic Manager profile URL (for example, `contoso.trafficmgr.com`). Both the direct domain name of the Web App and the Traffic Manager URL are visible on the Web App's Configure page under the **Domain Names** section.
* Your custom domain names work as expected, but in addition to adding them to your Web Apps, you must also configure your DNS map to point to the Traffic Manager URL. For information on how to set up a custom domain for an Azure Web App,  see [Configuring a custom domain name for an Azure web site](app-service-web-tutorial-custom-domain.md).
* You can only add Web Apps that are in standard or premium mode to an Azure Traffic Manager profile.

## Next Steps
For a conceptual and technical overview of Azure Traffic Manager, see [Traffic Manager Overview](../traffic-manager/traffic-manager-overview.md).

For more information about using Traffic Manager with Web Apps, see the blog posts
[Using Azure Traffic Manager with Azure Web Sites](http://blogs.msdn.com/b/waws/archive/2014/03/18/using-windows-azure-traffic-manager-with-waws.aspx) and [Azure Traffic Manager can now integrate with Azure Web Sites](https://azure.microsoft.com/blog/2014/03/27/azure-traffic-manager-can-now-integrate-with-azure-web-sites/).

