---
author: cherylmc
ms.author: cherylmc
ms.date: 05/09/2024
ms.service: vpn-gateway
ms.topic: include

---
VPN Gateway now supports a new Microsoft-registered App ID and corresponding Audience values for the latest versions of the Azure VPN Client. When you configure a P2S VPN gateway using the new Microsoft-registered App ID and corresponding Audience values, you skip the Azure VPN Client app manual registration process for your tenant. The App ID is already created and your tenant is automatically able to use it with no extra registration steps. This process is more secure than manually registering the Azure VPN Client because you don't need to authorize the app or assign permissions via the Global administrator role.

Previously, you were required to manually register (or integrate) the Azure VPN Client app with your Microsoft Entra tenant. Registering the client app creates an App ID representing the identity of the Azure VPN Client application and requires authorization using the Global Administrator role. To better understand the difference between the types of application objects, see [How and why applications are added to Microsoft Entra ID](https://learn.microsoft.com/entra/identity-platform/how-applications-are-added).

When possible, we recommend that you configure new P2S gateways using the Microsoft-registered Azure VPN client process and corresponding Audience values, instead of manually registering the Azure VPN Client app with your tenant.

If you have a previously configured Azure VPN gateway that uses Microsoft Entra ID authentication, you can update the gateway and clients to take advantage of the new Microsoft-registered App ID. If you want to use the new Azure VPN Client for Linux, your gateway must be configured to use the new Audience values that align with the Microsoft-registered App ID.

Considerations and limitations:

* A P2S VPN gateway can only support one Audience value. It can't support multiple Audience values simultaneously.

* At this time, the newer Microsoft-registered App ID doesn't support as many Audience values as the older, manually registered app. If you need an Audience value for anything other than Azure Public or Custom, use the older manually registered method and values.

* The Azure VPN Client for Linux isn't backward compatible with P2S gateways configured to use the older Audience values that align with the manually registered app. However, the Linux client does support Custom.

* The latest version of the Azure VPN Client for both Windows and macOS are backward compatible if you're using a previously configured P2S gateway for Microsoft Entra ID authentication.

The following table shows the versions of the Azure VPN Client that are supported for each App ID and the corresponding available Audience values.

|App ID | Supported Audience value| Supported clients|
|---|---|---|
|Microsoft-registered (Preview)| - Azure Public: `c632b3df-fb67-4d84-bdcf-b95ad541b5c8` |- Linux<br>- Windows<br>- macOS |
|Manually registered | - Azure Public: `41b23e61-6c1e-4545-b367-cd054e0ed4b4`<br>- Azure Government: `51bb15d4-3a4f-4ebf-9dca-40096fe32426`<br>- Azure Germany: `538ee9e6-310a-468d-afef-ea97365856a9`<br>- Microsoft Azure operated by 21Vianet: `49f817b6-84ae-4cc0-928c-73f27289b3aa` | - Windows<br> - macOS|
|Custom | `<custom-app-id>` | - Linux<br>- Windows<br> - macOS |