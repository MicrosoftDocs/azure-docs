<properties 
	pageTitle="Controlling Azure web app traffic with Azure Traffic Manager" 
	description="This article provides summary information for  Azure Traffic Manager as it relates to Azure web apps." 
	services="app-service\web" 
	documentationCenter="" 
	authors="cephalin" 
	writer="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/24/2015" 
	ms.author="cephalin"/>

# Controlling Azure web app traffic with Azure Traffic Manager

> [AZURE.NOTE] This article provides summary information for Microsoft Azure Traffic Manager as it relates to Azure App Service Web Apps. More information about Azure Traffic Manager itself can be found by visiting the links at the end of this article.

## Introduction
You can use Azure Traffic Manager to control how requests from web clients are distributed to web apps in Azure App Service. When web app endpoints are added to a Azure Traffic Manager profile, Azure Traffic Manager keeps track of the status of your web apps (running, stopped or deleted) so that it can decide which of those endpoints should receive traffic.

## Load Balancing Methods
Azure Traffic Manager uses three different load balancing methods. These are described  in the following list as they pertain to Azure web apps. 

* **Failover**: If you have web app clones in different regions, you can use this method to configure one web app to service all web client traffic, and configure another web app in a different region to service that traffic in case the first web app becomes unavailable. 
	
* **Round Robin**: If you have web app clones in different regions, you can use this method to distribute traffic equally across the web apps in different regions. 
	
* **Performance**: The Performance method distributes traffic based on the shortest round trip time to clients. The Performance method can be used for web apps within the same region or in different regions. 

For detailed information about load balancing in Azure Traffic Manager, see [About Traffic Manager Load Balancing Methods](http://msdn.microsoft.com/library/windowsazure/dn339010.aspx).

##Web Apps and Traffic Manager Profiles 
To configure the control of web app traffic, you create a profile in Azure Traffic Manager that uses one of the three load balancing methods described previously, and then add the endpoints (in this case, web apps) for which you want to control traffic to the profile. Your web app status (running, stopped or deleted) is regularly communicated to the profile so that Azure Traffic Manager can direct traffic accordingly.

When using Azure Traffic Manager with Azure, keep in mind the following points:

* For web app only deployments within the same region, Web Apps already provides failover and round-robin functionality without regard to web app mode.

* For deployments in the same region that use Web Apps in conjunction with another Azure cloud service, you can combine both types of endpoints to enable hybrid scenarios.

* You can only specify one web app endpoint per region in a profile. When you select a web app as an endpoint for one region, the remaining web apps in that region become unavailable for selection for that profile.

* The web app endpoints that you specify in a Azure Traffic Manager profile will appear under the **Domain Names** section on the Configure page for the web app in the profile, but will not be configurable there.

* After you add a web app to a profile, the **Site URL** on the Dashboard of the web app's portal page will display the custom domain URL of the web app if you have set one up. Otherwise, it will display the Traffic Manager profile URL (for example, `contoso.trafficmgr.com`). Both the direct domain name of the web app and the Traffic Manager URL will be visible on the web app's Configure page under the **Domain Names** section.

* Your custom domain names will work as expected, but in addition to adding them to your web apps, you must also configure your DNS map to point to the Traffic Manager URL. For information on how to set up a custom domain for a Azure web app,  see [Configuring a custom domain name for an Azure web site](web-sites-custom-domain-name.md).

* You can only add web apps that are in standard mode to a Azure Traffic Manager profile.

## Next Steps

For a conceptual and technical overview of Azure Traffic Manager, see [Traffic Manager Overview](http://msdn.microsoft.com/library/windowsazure/hh744833.aspx). 

For information on how to configure Azure Traffic Manager, including for Web Apps use, see [Traffic Manager Configuration Tasks](http://msdn.microsoft.com/library/windowsazure/hh744830.aspx).

For detailed information about load balancing in Azure Traffic Manager, see [About Traffic Manager Load Balancing Methods](http://msdn.microsoft.com/library/windowsazure/dn339010.aspx).

For more information about using Traffic Manager with Web Apps, see the blog posts 
[Using Azure Traffic Manager with Azure Web Sites](http://blogs.msdn.com/b/waws/archive/2014/03/18/using-windows-azure-traffic-manager-with-waws.aspx) and [Azure Traffic Manager can now integrate with Azure Web Sites](http://azure.microsoft.com/blog/2014/03/27/azure-traffic-manager-can-now-integrate-with-azure-web-sites/).
