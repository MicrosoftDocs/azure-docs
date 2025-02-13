---
author: cherylmc
ms.author: cherylmc
ms.date: 02/10/2025
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: include
---
VPN Gateway now supports a new Microsoft-registered App ID and corresponding Audience values for the latest versions of the Azure VPN Client. When you configure a P2S VPN gateway using the new Audience values, you skip the Azure VPN Client app manual registration process for your Microsoft Entra tenant. The App ID is already created and your tenant is automatically able to use it with no extra registration steps. This process is more secure than manually registering the Azure VPN Client because you don't need to authorize the app or assign permissions via the Global administrator role.

Previously, you were required to manually register (integrate) the Azure VPN Client app with your Microsoft Entra tenant. Registering the client app creates an App ID representing the identity of the Azure VPN Client application and requires authorization using the Global Administrator role. To better understand the difference between the types of application objects, see [How and why applications are added to Microsoft Entra ID](/entra/identity-platform/how-applications-are-added).

When possible, we recommend that you configure new P2S gateways using the Microsoft-registered Azure VPN client App ID and its corresponding Audience values, instead of manually registering the Azure VPN Client app with your tenant. If you have a previously configured Azure VPN gateway that uses Microsoft Entra ID authentication, you can update the gateway and clients to take advantage of the new Microsoft-registered App ID. Updating the P2S gateway with the new Audience value is required if you want Linux clients to connect. The Azure VPN Client for Linux isn't backward compatible with the older Audience values.

If you have an existing P2S gateway that you want to update to use a new Audience value, see [Change Audience for a P2S VPN gateway](../articles/vpn-gateway/point-to-site-entra-gateway-update.md). If you want to create or modify a custom Audience value, see [Create a custom audience app ID for P2S VPN](../articles/vpn-gateway/point-to-site-entra-register-custom-app.md). If you want to configure or restrict access to P2S based on users and groups, see [Scenario: Configure P2S VPN access based on users and groups](../articles/vpn-gateway/point-to-site-entra-users-access.md).

**Considerations**

* A P2S VPN gateway can only support one Audience value. It can't support multiple Audience values simultaneously.

* The Azure VPN Client for Linux isn't backward compatible with P2S gateways configured to use the older Audience values that align with the manually registered app. However, the Azure VPN Client for Linux does support Custom Audience values.

* [!INCLUDE [Supported versions](vpn-gateway-azure-vpn-client-linux-supported-releases.md)]

* The latest versions of the Azure VPN Clients for macOS and Windows are backward compatible with P2S gateways configured to use the older Audience values that align with the manually registered app. These clients also support Custom Audience values.

**Azure VPN Client Audience values**

The following table shows the versions of the Azure VPN Client that are supported for each App ID and the corresponding available Audience values.

[!INCLUDE [About the Microsoft-registered Azure VPN Client](vpn-gateway-entra-audience-values.md)]
