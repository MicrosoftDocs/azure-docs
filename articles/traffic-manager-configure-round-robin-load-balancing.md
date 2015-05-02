<properties
   pageTitle="Configure Traffic Manager round robin load balancing"
   description="This article will help you configure round robin load balancing for your Traffic Manager endpoints."
   services="traffic-manager"
   documentationCenter=""
   authors="cherylmc"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/27/2015"
   ms.author="cherylmc" />

# Configure Round Robin Load Balancing

A common load balancing pattern is to provide a set of identical endpoints, which include cloud services and websites, and send traffic to each in a round-robin fashion. The steps below outline how to configure Traffic Manager in order to perform this type of load balancing. For more information on the different load balancing methods, see [About Traffic Manager Load Balancing Methods](traffic-manager-load-balancing-methods.md).

>[AZURE.NOTE] Azure Websites already provides round-robin load balancing functionality for websites within a datacenter (also known as a region). Traffic Manager allows you to specify round-robin load balancing for websites in different datacenters.

## Load balance traffic equally (round robin) across a set of endpoints:

1. In the Management Portal, in the left pane, click the **Traffic Manager** icon to open the Traffic Manager pane. If you have not yet created your Traffic Manager profile, see [Manage Traffic Manager Profiles](traffic-manager-manage-profiles.md) for steps to create a basic Traffic Manager profile.
2. In the Management Portal, on the Traffic Manager pane, locate the Traffic Manager profile that contains the settings that you want to modify, and then click the arrow to the right of the profile name. This will open the settings page for the profile.
3. On the page for your profile, click **Endpoints** at the top of the page and verify that the service endpoints that you want to include in your configuration are present. For steps to add or remove endpoints, see [Manage Endpoints in Traffic Manager](traffic-manager-endpoints.md).
4. On your profile page, click **Configure** at the top to open the configuration page.
5. For **Load Balancing Method Settings**, verify that the load balancing method is **Round Robin**. If it is not, click **Round Robin** in the dropdown list.
6. Verify that the **Monitoring Settings** are configured appropriately. Monitoring ensures that endpoints that are offline are not sent traffic. In order to monitor endpoints, you must specify a path and filename. Note that a forward slash “/“ is a valid entry for the relative path and implies that the file is in the root directory (default). For more information about monitoring, see [About Traffic Manager Monitoring](traffic-manager-about-monitoring.md).
7. After you complete your configuration changes, click **Save** at the bottom of the page.
8. Test the changes in your configuration. For more information, see [Testing Traffic Manager Settings](traffic-manager-testing-settings.md).
9. Once your Traffic Manager profile is setup and working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name. For more information about how to do this, see [Point a Company Internet Domain to a Traffic Manager Domain](traffic-manager-point-internet-domain.md).

## See Also

[About Traffic Manager Load Balancing Methods](traffic-manager-load-balancing-methods.md)

[Traffic Manager Configuration Tasks](https://msdn.microsoft.com/library/azure/hh744830.aspx)

[Traffic Manager Overview](traffic-manmager-overview.md)

[Cloud Services](http://go.microsoft.com/fwlink/?LinkId=314074)

[Websites](http://go.microsoft.com/fwlink/p/?LinkId=393327)

[Operations on Traffic Manager (REST API Reference)](http://go.microsoft.com/fwlink/?LinkId=313584)

[Azure Traffic Manager Cmdlets](http://go.microsoft.com/fwlink/p/?LinkId=400769)
