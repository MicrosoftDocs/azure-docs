---
author: cherylmc
ms.author: cherylmc
ms.date: 04/10/2024
ms.service: vpn-gateway
ms.topic: include

#This include is used in multiple articles, both for Virtual WAN and VPN Gateway. Before modifying, verify that any changes apply to all articles that use this include.
---
Microsoft released an authorized first-party Microsoft Entra application (first-party App ID) for the Azure VPN Client. Previously, Microsoft Entra ID authentication was only available for P2S VPN gateways using a third-party App ID. When you use a first-party Application ID (App ID), you don't need to authorize the Azure VPN client application, as you would with a third-party application. The App ID (Audience) value is different for first-party and third-party applications and isn't interchangeable. To better understand the difference between the two types of application objects, see [How and why applications are added to Microsoft Entra ID](https://learn.microsoft.com/entra/identity-platform/how-applications-are-added).

VPN Gateway doesn't simultaneously support both Microsoft Entra ID authentication with third-party App ID, and Microsoft Entra ID authentication with first-party App ID: the two mechanisms are mutually exclusive. The VPN gateway supports only a single App ID: it can be either a third-party App ID, or a first-party App ID.

The version of the Azure VPN Client that connects is specific to either first-party, or third-party App ID. This means that a point-to-site VPN that's configured to use Microsoft Entra ID authentication can be configured either to support first-party App ID VPN clients, or third-party App ID VPN clients. But not both.

If you've already configured point-to-site and specified Microsoft Entra ID authentication, you're likely using third-party App ID with your current Azure VPN Clients and therefore can only use versions of the Azure VPN Client that support third-party App ID. The Azure VPN Client for Linux can't connect to the third-party App ID configuration.

When using the Azure VPN client first-party App ID, consider the following:

* The Azure VPN client for Linux is a newly released client and supports only first-party application App ID (not third-party).

* At this time, the Azure VPN client for Linux is the only version of the Azure VPN client that supports the first-party App ID. An annoucement will be made when we release versions that support first-party App ID for other operating systems.

* Azure Government, Azure Germany, and Azure operated by China 21Vianet aren't currently supported for first-party App ID.

* The first-party App ID (Audience) value for the Azure VPN Client is different than the value you use for a third-party App ID.

* Custom Audience is supported.