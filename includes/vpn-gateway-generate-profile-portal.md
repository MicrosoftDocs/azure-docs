---
author: cherylmc
ms.service: vpn-gateway
ms.topic: include
ms.date: 03/20/2024
ms.author: cherylmc
---

1. In the Azure portal, go to the virtual network gateway for the virtual network to which you want to connect.
1. On the virtual network gateway page, select **Point-to-site configuration** to open the Point-to-site configuration page.
1. At the top of the **Point-to-site configuration** page, select **Download VPN client**. This doesn't download VPN client software, it generates the configuration package used to configure VPN clients. It takes a few minutes for the client configuration package to generate. During this time, you might not see any indications until the packet generates.

   :::image type="content" source="./media/vpn-gateway-generate-profile-portal/download-configuration.png" alt-text="Screenshot of Point-to-site configuration page." lightbox="./media/vpn-gateway-generate-profile-portal/download-configuration.png":::

1. Once the configuration package is generated, your browser indicates that a client configuration zip file is available. It's named the same name as your gateway.
1. Unzip the file to view the folders. You'll use some, or all, of these files to configure your VPN client. The files that are generated correspond to the authentication and tunnel type settings that you configured on the P2S server.
