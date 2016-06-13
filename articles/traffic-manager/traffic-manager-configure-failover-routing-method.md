<properties 
   pageTitle="Configure Traffic Manager failover traffic routing method | Microsoft Azure"
   description="This article will help you configure failover traffic routing method in Traffic Manager"
   services="traffic-manager"
   documentationCenter=""
   authors="joaoma"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/10/2016"
   ms.author="joaoma" />

# Configure Failover routing method

Often an organization wants to provide reliability for its services. It does this by providing backup services in case their primary service goes down. A common pattern for service failover is to provide a set of identical services and send traffic to a primary service, while maintaining a configured list of one or more backup services. You can configure this type of backup with Azure cloud services and websites by following the procedures below.

Note that Azure Websites already provides failover traffic routing method functionality for websites within a datacenter (also known as a region), regardless of the website mode. Traffic Manager allows you to specify failover traffic routing method for websites in different datacenters.

## To configure failover traffic routing method:

1. In the Azure classic portal, in the left pane, click the **Traffic Manager** icon to open the Traffic Manager pane. If you have not yet created your Traffic Manager profile, see [Manage Traffic Manager Profiles](traffic-manager-manage-profiles.md) for steps to create a basic Traffic Manager profile.
2. On the Traffic Manager pane in the Azure classic portal, locate the Traffic Manager profile that contains the settings that you want to modify, and then click the arrow to the right of the profile name. This will open the settings page for the profile.
3. On your profile page, click **Endpoints** at the top of the page and verify that the both cloud services and websites (endpoints) that you want to include in your configuration are present. For steps to add or remove endpoints, see [Manage Endpoints in Traffic Manager](traffic-manager-endpoints.md).
4. On your profile page, click **Configure** at the top to open the configuration page.
5. For **traffic routing method settings**, verify that the traffic routing method is **Failover**. If it is not, click **Failover** from the dropdown list.
6. For **Failover Priority List**, adjust the failover order for your endpoints. When you select the **Failover** traffic routing method, the order of the selected endpoints matters. The primary endpoint is on top. Use the up and down arrows to change the order as needed. For information about how to set the failover priority by using Windows PowerShell, see [Set-AzureTrafficManagerProfile](http://go.microsoft.com/fwlink/p/?LinkId=400880).
7. Verify that the **Monitoring Settings** are configured appropriately. Monitoring ensures that endpoints that are offline are not sent traffic. In order to monitor endpoints, you must specify a path and filename. Note that a forward slash “/“ is a valid entry for the relative path and implies that the file is in the root directory (default). For more information about monitoring, see [Traffic Manager Monitoring](traffic-manager-monitoring.md).
8. After you complete your configuration changes, click **Save** at the bottom of the page.
9. Test the changes in your configuration. See [Testing Traffic Manager Settings](traffic-manager-testing-settings.md) for more information.
10. Once your Traffic Manager profile is setup and working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name. For more information about how to do this, see [Point a company Internet domain to a Traffic Manager domain](traffic-manager-point-internet-domain.md).

## Next steps

[Point a company Internet domain to a Traffic Manager domain](traffic-manager-point-internet-domain.md)

[Traffic Manager routing methods](traffic-manager-routing-methods.md)

[Configure round robin routing method](traffic-manager-configure-round-robin-routing-method.md)

[Configure performance routing method](traffic-manager-configure-performance-routing-method.md)

[Troubleshooting Traffic Manager degraded state](traffic-manager-troubleshooting-degraded.md)

[Traffic Manager - Disable, enable or delete a profile](disable-enable-or-delete-a-profile.md)

[Traffic Manager - Disable or enable an endpoint](disable-or-enable-an-endpoint.md)

 