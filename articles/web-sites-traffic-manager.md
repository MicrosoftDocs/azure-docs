<properties linkid="web-sites-traffic-manager" urlDisplayName="Controlling Windows Azure Web Sites Traffic with Windows Azure Traffic Manager" pageTitle="Controlling Windows Azure Web Sites Traffic with Windows Azure Traffic Manager" metaKeywords="Windows Azure Web Sites, Traffic Manager, request routing, round robin, failover, performance" description="This article provides summary information for Windows Azure Traffic Manager as it relates to Windows Azure Web Sites." metaCanonical="" services="web-sites" documentationCenter="" title="Controlling Windows Azure Web Sites Traffic with Windows Azure Traffic Manager" authors="timamm"  solutions="" writer="timamm" manager="paulettm" editor="mollybos"  />

# Controlling Windows Azure Web Sites Traffic with Windows Azure Traffic Manager

> [WACOM.NOTE] This article provides summary information for Windows Azure Traffic Manager as it relates to Windows Azure Web Sites. More information about Traffic Manager itself can be found by visiting the links at the end of this article.

## Introduction
You can use Windows Azure Traffic Manager to control how requests from web clients are distributed to Windows Azure Web Sites. When Windows Azure web site endpoints are added to a Windows Azure Traffic Manager profile, Windows Azure Traffic Manager keeps track of the status of your web sites (running, stopped or deleted) so that it can decide which of those endpoints should receive traffic.

## Load Balancing Methods
Windows Azure Traffic Manager uses three different load balancing methods. These are described  in the following list as they pertain to Windows Azure Web Sites. 

* **Failover**: If you have web site clones in different regions, you can use this method to configure one web site to service all web client traffic, and configure another web site in a different region to service that traffic in case the first web site becomes unavailable. 
	
* **Round Robin**: If you have web site clones in different regions, you can use this method to distribute traffic equally across the web sites in different regions. 
	
* **Performance**: The Performance method distributes traffic based on the shortest round trip time to clients. The Performance method can be used for web sites within the same region or in different regions. 

For detailed information about load balancing in Windows Azure Traffic Manager, see [About Traffic Manager Load Balancing Methods](http://msdn.microsoft.com/en-us/library/windowsazure/dn339010.aspx).

## Windows Azure Web Sites and Traffic Manager Profiles 
To configure to control web site traffic, you create a profile in Windows Azure Traffic Manager that uses one of the three load balancing methods described previously, and then add the endpoints (in this case, web sites) for which you want to control traffic to the profile. Your web site status (running, stopped or deleted) is regularly communicated to the profile so that Windows Azure Traffic Manager can direct traffic accordingly.

When using Windows Azure Traffic Manager with Windows Azure, keep in mind the following points:

* For web site-only deployments within the same region, Windows Azure Web Sites already provides failover and round-robin functionality without regard to web site mode.

* For deployments in the same region that use Windows Azure Web Sites in conjunction with another Windows Azure cloud service, you can combine both types of endpoints to enable hybrid scenarios.

* You can only specify one web site endpoint per region in a profile. When you select a web site as an endpoint for one region, the remaining web sites in that region become unavailable for selection for that profile.

* The Web site endpoints that you specify in a Windows Azure Traffic Manager profile will appear under the **Domain Names** section on the Configure page for the web sites in the profile, but will not be configurable there.

* After you add a web site to a profile, the **Site URL** on the Dashboard of the web site's portal page will display the custom domain URL of the web site if you have set one up. Otherwise, it will display the Traffic Manager profile URL (for example, `contoso.trafficmgr.com`). Both the direct domain name of the web site and the Traffic Manager URL will be visible on the web site's Configure page under the **Domain Names** section.

* Your custom domain names will work as expected, but in addition to adding them to your web sites, you must also configure your DNS map to point to the Traffic Manager URL. For information on how to set up a custom domain for a Windows Azure web site,  see [Configuring a custom domain name for a Windows Azure web site](https://www.windowsazure.com/en-us/documentation/articles/web-sites-custom-domain-name/).

* You can only add web sites that are in Standard mode to a Windows Azure Traffic Manager profile.

## Next Steps

For a conceptual and technical overview of Windows Azure Traffic Manager, see [Traffic Manager Overview](http://msdn.microsoft.com/en-us/library/windowsazure/hh744833.aspx). 

For information on how to configure Windows Azure Traffic Manager, including for Windows Azure Web Sites use, see [Traffic Manager Configuration Tasks](http://msdn.microsoft.com/en-us/library/windowsazure/hh744830.aspx).

For detailed information about load balancing in Windows Azure Traffic Manager, see [About Traffic Manager Load Balancing Methods](http://msdn.microsoft.com/en-us/library/windowsazure/dn339010.aspx).

