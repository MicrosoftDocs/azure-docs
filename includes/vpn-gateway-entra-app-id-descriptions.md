---
author: cherylmc
ms.author: cherylmc
ms.date: 04/10/2024
ms.service: vpn-gateway
ms.topic: include

---
Microsoft released an authorized first-party Microsoft Entra application (first-party App ID) for the Azure VPN Client. Previously, Microsoft Entra ID authentication was only available for P2S VPN gateways using a third-party App ID or a custom App ID. When you use a first-party Application ID (App ID), you don't need to authorize the Azure VPN Client application, as you would with a third-party or custom application. To better understand the difference between the two types of application objects, see [How and why applications are added to Microsoft Entra ID](https://learn.microsoft.com/entra/identity-platform/how-applications-are-added).

A VPN gateway supports only a single App ID: it can be a third-party App ID, a custom App ID, or a first-party App ID. The App ID (Audience) value is different for each. The version of the Azure VPN Client that connects is specific to the App ID. As you can see in the following table, not all clients are available for each type of App ID. When Azure VPN Client versions for additional operating systems are released for first-party App IDs, announcements will be made.

|App ID | Supported Audience value| VPN Client|
|---|---|---|
|First-party App ID | - Azure Public: `c632b3df-fb67-4d84-bdcf-b95ad541b5c8` |- Azure VPN Client for Linux |
| Third-party App ID | - Azure Public: `41b23e61-6c1e-4545-b367-cd054e0ed4b4`<br>- Azure Government: `51bb15d4-3a4f-4ebf-9dca-40096fe32426`<br>- Azure Germany: `538ee9e6-310a-468d-afef-ea97365856a9`<br>- Microsoft Azure operated by 21Vianet: `49f817b6-84ae-4cc0-928c-73f27289b3aa` | - Azure VPN Client for Windows<br> - Azure VPN Client for macOS|
|Custom App ID | `<custom-app-id>` | - Azure VPN Client for Linux<br>- Azure VPN Client for Windows<br> - Azure VPN Client for macOS |

If you've already configured point-to-site and specified Microsoft Entra ID authentication, you're likely using third-party App ID with your current Azure VPN Clients and can therefore only use versions of the Azure VPN Client that support third-party App ID. The Azure VPN Client for Linux can't connect to the third-party App ID configuration.