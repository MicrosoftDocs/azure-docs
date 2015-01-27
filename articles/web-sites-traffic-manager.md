<properties pageTitle="Controlling Azure Websites Traffic with Azure Traffic Manager" description="This article provides summary information for  Azure Traffic Manager as it relates to Azure Websites." services="web-sites" documentationCenter="" authors="cephalin" writer="cephalin" manager="wpickett" editor="mollybos"/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/24/2014" ms.author="cephalin"/>

# Controlling Azure Websites Traffic with Azure Traffic Manager

> [AZURE.NOTE] This article provides summary information for Microsoft Azure Traffic Manager as it relates to Azure Websites. More information about Azure Traffic Manager itself can be found by visiting the links at the end of this article.

## Introduction
You can use Azure Traffic Manager to control how requests from web clients are distributed to Azure Websites. When Azure website endpoints are added to a Azure Traffic Manager profile, Azure Traffic Manager keeps track of the status of your websites (running, stopped or deleted) so that it can decide which of those endpoints should receive traffic.

## Load Balancing Methods
Azure Traffic Manager uses three different load balancing methods. These are described  in the following list as they pertain to Azure Websites. 

* **Failover**: If you have website clones in different regions, you can use this method to configure one website to service all web client traffic, and configure another website in a different region to service that traffic in case the first website becomes unavailable. 
	
* **Round Robin**: If you have website clones in different regions, you can use this method to distribute traffic equally across the websites in different regions. 
	
* **Performance**: The Performance method distributes traffic based on the shortest round trip time to clients. The Performance method can be used for websites within the same region or in different regions. 

For detailed information about load balancing in Azure Traffic Manager, see [About Traffic Manager Load Balancing Methods](http://msdn.microsoft.com/en-us/library/windowsazure/dn339010.aspx).

##Azure Websites and Traffic Manager Profiles 
To configure to control website traffic, you create a profile in Azure Traffic Manager that uses one of the three load balancing methods described previously, and then add the endpoints (in this case, websites) for which you want to control traffic to the profile. Your website status (running, stopped or deleted) is regularly communicated to the profile so that Azure Traffic Manager can direct traffic accordingly.

When using Azure Traffic Manager with Azure, keep in mind the following points:

* For website-only deployments within the same region, Azure Websites already provides failover and round-robin functionality without regard to website mode.

* For deployments in the same region that use Azure Websites in conjunction with another Azure cloud service, you can combine both types of endpoints to enable hybrid scenarios.

* You can only specify one website endpoint per region in a profile. When you select a website as an endpoint for one region, the remaining websites in that region become unavailable for selection for that profile.

* The Website endpoints that you specify in a Azure Traffic Manager profile will appear under the **Domain Names** section on the Configure page for the websites in the profile, but will not be configurable there.

* After you add a website to a profile, the **Site URL** on the Dashboard of the website's portal page will display the custom domain URL of the website if you have set one up. Otherwise, it will display the Traffic Manager profile URL (for example, `contoso.trafficmgr.com`). Both the direct domain name of the website and the Traffic Manager URL will be visible on the website's Configure page under the **Domain Names** section.

* Your custom domain names will work as expected, but in addition to adding them to your websites, you must also configure your DNS map to point to the Traffic Manager URL. For information on how to set up a custom domain for a Azure website,  see [Configuring a custom domain name for an Azure web site](https://www.windowsazure.com/en-us/documentation/articles/web-sites-custom-domain-name/).

* You can only add websites that are in Standard mode to a Azure Traffic Manager profile.

## Next Steps

For a conceptual and technical overview of Azure Traffic Manager, see [Traffic Manager Overview](http://msdn.microsoft.com/en-us/library/windowsazure/hh744833.aspx). 

For information on how to configure Azure Traffic Manager, including for Azure Websites use, see [Traffic Manager Configuration Tasks](http://msdn.microsoft.com/en-us/library/windowsazure/hh744830.aspx).

For detailed information about load balancing in Azure Traffic Manager, see [About Traffic Manager Load Balancing Methods](http://msdn.microsoft.com/en-us/library/windowsazure/dn339010.aspx).

For more information about using Traffic Manager with Azure Websites, see the blog posts 
[Using Azure Traffic Manager with Azure Web Sites](http://blogs.msdn.com/b/waws/archive/2014/03/18/using-windows-azure-traffic-manager-with-waws.aspx) and [Azure Traffic Manager can now integrate with Azure Web sites](http://azure.microsoft.com/blog/2014/03/27/azure-traffic-manager-can-now-integrate-with-azure-web-sites/).
