---
title: Configure Traffic Manager routing methods | Microsoft Docs
description: This article explains how to configures different routing methods in Traffic Manager
services: traffic-manager
documentationcenter: ''
author: sdwheeler
manager: carmonm
editor: ''

ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/18/2016
ms.author: sewhee

---
<!-- repub for nofollow -->

# Configure Traffic Manager routing methods
Azure Traffic Manager provides three routing methods that control how traffic is routed to available service endpoints. The traffic-routing method is applied to each DNS query received to determine which endpoint should be returned in the DNS response.

There are three traffic routing methods available in Traffic Manager:

* **Priority:** Select 'Priority' when you want to use a primary service endpoint and provide backups in case the primary is unavailable.
* **Weighted:** Select 'Weighted' when you want to distribute traffic across a set of endpoints, either evenly or according to weights, which you define.
* **Performance:** Select 'Performance' when you have endpoints in different geographic locations and you want end users to use the "closest" endpoint in terms of the lowest network latency.

## Configure Priority routing method
Regardless of the website mode, Azure Websites already provide failover functionality for websites within a datacenter (also known as a region). Traffic Manager provides failover for websites in different datacenters.

A common pattern for service failover is to send traffic to a primary service and provide a set of identical backup services for failover. The following steps explain how to configure this prioritized failover with Azure cloud services and websites:

1. In the Azure classic portal, in the left pane, click the **Traffic Manager** icon to open the Traffic Manager pane.
2. On the Traffic Manager pane in the Azure classic portal, locate the Traffic Manager profile that contains the settings that you want to modify. To open the profile settings page, click the arrow to the right of the profile name.
3. On your profile page, click **Endpoints** at the top of the page. Verify that both the cloud services and websites that you want to include in your configuration are present.
4. Click **Configure** at the top to open the configuration page.
5. For **traffic routing method settings**, verify that the traffic routing method is **Failover**. If it is not, click **Failover** from the dropdown list.
6. For **Failover Priority List**, adjust the failover order for your endpoints. When you select the **Failover** traffic routing method, the order of the selected endpoints matters. The primary endpoint is on top. Use the up and down arrows to change the order as needed. For information about how to set the failover priority by using Windows PowerShell, see [Set-AzureTrafficManagerProfile](http://go.microsoft.com/fwlink/p/?LinkId=400880).
7. Verify that the **Monitoring Settings** are configured appropriately. Monitoring ensures that endpoints that are offline are not sent traffic. To monitor endpoints, you must specify a path and filename. A forward slash "/" is a valid entry for the relative path and implies that the file is in the root directory (default).
8. After you complete your configuration changes, click **Save** at the bottom of the page.
9. Test the changes in your configuration.
10. Once your Traffic Manager profile is working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name.

## Configure weighted routing method
A common traffic routing method pattern is to provide a set of identical endpoints, which include cloud services and websites, and send traffic to each in a round-robin fashion. The following steps outline how to configure this type of traffic routing method.

> [!NOTE]
> Azure Websites already provide round-robin load balancing functionality for websites within a datacenter (also known as a region). Traffic Manager allows you to specify round-robin traffic routing method for websites in different datacenters.
> 
> 

1. In the Azure classic portal, in the left pane, click the **Traffic Manager** icon to open the Traffic Manager pane.
2. In the Traffic Manager pane, locate the Traffic Manager profile that contains the settings that you want to modify. To open the profile settings page, click the arrow to the right of the profile name.
3. On the page for your profile, click **Endpoints** at the top of the page and verify that the service endpoints that you want to include in your configuration are present.
4. On your profile page, click **Configure** at the top to open the configuration page.
5. For **traffic routing method Settings**, verify that the traffic routing method is **Round Robin**. If it is not, click **Round Robin** in the dropdown list.
6. Verify that the **Monitoring Settings** are configured appropriately. Monitoring ensures that endpoints that are offline are not sent traffic. To monitor endpoints, you must specify a path and filename. A forward slash "/" is a valid entry for the relative path and implies that the file is in the root directory (default).
7. After you complete your configuration changes, click **Save** at the bottom of the page.
8. Test the changes in your configuration.
9. Once your Traffic Manager profile is working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name.

## Configure Performance traffic routing method
The Performance traffic routing method allows you to direct traffic to the endpoint with the lowest latency from the client's network. Typically, the datacenter with the lowest latency is the closest in geographic distance. This traffic routing method cannot account for real-time changes in network configuration or load.

1. In the Azure classic portal, in the left pane, click the **Traffic Manager** icon to open the Traffic Manager pane.
2. In the Traffic Manager pane, locate the Traffic Manager profile that contains the settings that you want to modify. To open the profile settings page, click the arrow to the right of the profile name.
3. On the page for your profile, click **Endpoints** at the top of the page and verify that the service endpoints that you want to include in your configuration are present.
4. On the page for your profile, click **Configure** at the top to open the configuration page.
5. For **traffic routing method settings**, verify that the traffic routing method is **Performance*. If it's not, click **Performance** in the dropdown list.
6. Verify that the **Monitoring Settings** are configured appropriately. Monitoring ensures that endpoints that are offline are not sent traffic. To monitor endpoints, you must specify a path and filename. A forward slash "/" is a valid entry for the relative path and implies that the file is in the root directory (default).
7. After you complete your configuration changes, click **Save** at the bottom of the page.
8. Test the changes in your configuration.
9. Once your Traffic Manager profile is working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name.

## Next steps
* [Manage Traffic Manager Profiles](traffic-manager-manage-profiles.md)
* [Traffic Manager routing methods](traffic-manager-routing-methods.md)
* [Testing Traffic Manager Settings](traffic-manager-testing-settings.md)
* [Point a company Internet domain to a Traffic Manager domain](traffic-manager-point-internet-domain.md)
* [Manage Traffic Manager endpoints](traffic-manager-manage-endpoints.md)
* [Troubleshooting Traffic Manager degraded state](traffic-manager-troubleshooting-degraded.md)

