<properties 
   pageTitle="Configure Performance traffic routing method | Microsoft Azure"
   description="This article will help you configure performance traffic routing method in Traffic Manager"
   services="traffic-manager"
   documentationCenter=""
   authors="joaoma"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/17/2016"
   ms.author="joaoma" />

# Configure Performance traffic routing method

In order to route traffic for cloud services and websites (endpoints) that are located in different datacenters across the globe (also known as regions), you can direct incoming traffic to the endpoint with the lowest latency from the requesting client. Typically, the datacenter with the lowest latency corresponds to the closest in geographic distance. The Performance traffic routing method will allow you to distribute based on lowest latency, but cannot take into account real-time changes in network configuration or load. For more information on the different traffic routing methods that Azure Traffic Manager provides, see [About Traffic Manager traffic routing Methods](traffic-manager-routing-methods.md).

## Route traffic based on lowest latency across a set of endpoints:

1. In the Azure classic portal, in the left pane, click the **Traffic Manager** icon to open the Traffic Manager pane. If you have not yet created your Traffic Manager profile, see [Manage Traffic Manager Profiles](traffic-manager-manage-profiles.md) for the steps to create a basic Traffic Manager profile.
2. In the Azure classic portal, on the Traffic Manager pane, locate the Traffic Manager profile that contains the settings that you want to modify, and then click the arrow to the right of the profile name. This will open the settings page for the profile.
3. On the page for your profile, click **Endpoints** at the top of the page and verify that the service endpoints that you want to include in your configuration are present. For steps to add or remove endpoints from your profile, see [Manage Endpoints in Traffic Manager](traffic-manager-endpoints.md).
4. On the page for your profile, click **Configure** at the top to open the configuration page.
5. For **traffic routing method settings**, verify that the traffic routing method is **Performance*. If it’s not, click **Performance** in the dropdown list.
6. Verify that the **Monitoring Settings** are configured appropriately. Monitoring ensures that endpoints that are offline are not sent traffic. In order to monitor endpoints, you must specify a path and filename. Note that a forward slash “/“ is a valid entry for the relative path and implies that the file is in the root directory (default). For more information about monitoring, see [About Traffic Manager Monitoring](traffic-manager-monitoring.md).
7. After you complete your configuration changes, click **Save** at the bottom of the page.
8. Test the changes in your configuration. For more information, see [Testing Traffic Manager Settings](traffic-manager-testing-settings.md).
9. Once your Traffic Manager profile is setup and working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name. For more information about how to do this, see [Point a Company Internet Domain to a Traffic Manager Domain](traffic-manager-point-internet-domain.md).

## Next steps


[Point a company Internet domain to a Traffic Manager domain](traffic-manager-point-internet-domain.md)

[Traffic Manager routing methods](traffic-manager-routing-methods.md)

[Configure failover routing method](traffic-manager-configure-failover-routing-method.md)

[Configure round robin routing method](traffic-manager-configure-round-robin-routing-method.md)

[Troubleshooting Traffic Manager degraded state](traffic-manager-troubleshooting-degraded.md)

[Traffic Manager - Disable, enable or delete a profile](disable-enable-or-delete-a-profile.md)

[Traffic Manager - Disable or enable an endpoint](disable-or-enable-an-endpoint.md)
 
