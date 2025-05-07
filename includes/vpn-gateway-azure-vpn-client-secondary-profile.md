---
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: include
ms.author: cherylmc
ms.date: 03/20/2025
---

The Azure VPN Client provides high availability for client profiles. Adding a secondary client profile gives the client a more resilient way to access the VPN. If there's a region outage or failure to connect to the primary VPN client profile, the Azure VPN Client autoconnects to the secondary client profile without causing any disruptions. This feature requires the Azure VPN Client version **2.2124.51.0** or later. 

For this example, we'll add a secondary profile to an already existing profile. If the client can't connect to VNet1, it will automatically connect to Contoso without causing disruptions.

1. Add another VPN client profile to the Azure VPN Client. For this example, we imported a VPN client profile file and added a connection to **Contoso**.
1. Next, go to the **VNet1** profile and click "**...**", then **Configure**.
1. From the **Secondary Profile** dropdown, select the profile for **Contoso**. Then, **Save** your settings.

   :::image type="content" source="./media/vpn-gateway-azure-vpn-client-secondary-profile/azure-vpn-client.png" alt-text="Screenshot showing Azure VPN client profile configuration page with secondary profile." lightbox="./media/vpn-gateway-azure-vpn-client-secondary-profile/secondary-profile.png":::