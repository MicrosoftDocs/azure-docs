<properties 
   pageTitle="Configure Failover Load Balancing"
   description="This article will help you configure failover load balancing in Traffic Manager"
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

# Configure Failover Load Balancing

Often an organization wants to provide reliability for its services. It does this by providing backup services in case their primary service goes down. A common pattern for service failover is to provide a set of identical services and send traffic to a primary service, while maintaining a configured list of one or more backup services. You can configure this type of backup with Azure cloud services and websites by following the procedures below.

Note that Azure Websites already provides failover load balancing functionality for websites within a datacenter (also known as a region), regardless of the website mode. Traffic Manager allows you to specify failover load balancing for websites in different datacenters.

## To configure failover load balancing:

1. In the Management Portal, in the left pane, click the **Traffic Manager** icon to open the Traffic Manager pane. If you have not yet created your Traffic Manager profile, see [Manage Traffic Manager Profiles](traffic-manager-manage-profiles.md) for steps to create a basic Traffic Manager profile.
2. On the Traffic Manager pane in the Management Portal, locate the Traffic Manager profile that contains the settings that you want to modify, and then click the arrow to the right of the profile name. This will open the settings page for the profile.
3. On your profile page, click **Endpoints** at the top of the page and verify that the both cloud services and websites (endpoints) that you want to include in your configuration are present. For steps to add or remove endpoints, see [Manage Endpoints in Traffic Manager](traffic-manager-endpoints.md).
4. On your profile page, click **Configure** at the top to open the configuration page.
5. For **Load Balancing Method Settings**, verify that the load balancing method is **Failover**. If it is not, click **Failover** from the dropdown list.
6. For **Failover Priority List**, adjust the failover order for your endpoints. When you select the **Failover** load balancing method, the order of the selected endpoints matters. The primary endpoint is on top. Use the up and down arrows to change the order as needed. For information about how to set the failover priority by using Windows PowerShell, see [Set-AzureTrafficManagerProfile](http://go.microsoft.com/fwlink/p/?LinkId=400880).
7. Verify that the **Monitoring Settings** are configured appropriately. Monitoring ensures that endpoints that are offline are not sent traffic. In order to monitor endpoints, you must specify a path and filename. Note that a forward slash “/“ is a valid entry for the relative path and implies that the file is in the root directory (default). For more information about monitoring, see [Traffic Manager Monitoring](traffic-manager-monitoring.md).
8. After you complete your configuration changes, click **Save** at the bottom of the page.
9. Test the changes in your configuration. See [Testing Traffic Manager Settings](traffic-manager-testing-settings.md) for more information.
10. Once your Traffic Manager profile is setup and working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name. For more information about how to do this, see [Point a Company Internet Domain to a Traffic Manager Domain](traffic-manager-point-internet-domain.md).

## See Also

[About Traffic Manager Load Balancing Methods](traffic-manager-load-balancing-methods.md)

[Traffic Manager Configuration Tasks](https://msdn.microsoft.com/library/azure/hh744830.aspx)

[Traffic Manager Overview](traffic-manmager-overview.md)

[Cloud Services](http://go.microsoft.com/fwlink/?LinkId=314074)

[Websites](http://go.microsoft.com/fwlink/p/?LinkId=393327)

[Operations on Traffic Manager (REST API Reference)](http://go.microsoft.com/fwlink/?LinkId=313584)

[Azure Traffic Manager Cmdlets](http://go.microsoft.com/fwlink/p/?LinkId=400769)
