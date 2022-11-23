---
title: 'Download global (WAN-level) or hub User VPN client configuration profiles'
titleSuffix: Azure Virtual WAN
description: Learn about how to generate and download global and hub-level User VPN client configuration profiles.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 08/08/2022
ms.author: cherylmc
---

# Download global and hub VPN profiles for User VPN clients

Azure Virtual WAN offers two types of connection profiles for User VPN clients: global profiles and hub profiles. The type of profile you choose depends on whether you want the VPN client to connect to a geographically load-balanced WAN-level profile (global profile), or you want to restrict the VPN client to connect only to a certain hub (hub profile). This article helps you generate VPN client configuration files for both types of profiles.

## <a name="global"></a>Global profiles

The global profile associated with a User VPN configuration points to a Global Traffic Manager. The Global Traffic Manager includes all active User VPN hubs that are using that User VPN configuration. However, you can choose to exclude hubs from the Global Traffic Manager if necessary. A user connected to the global profile is directed to the hub that's closest to the user's geographic location. This is especially useful if you have users that travel between multiple locations frequently.

For example, a User VPN Configuration is associated with two different hubs for the same virtual WAN, one in West US and one in Southeast Asia. If a user connects to the global profile associated with the User VPN configuration, they'll connect to the closest Virtual WAN hub based on their location.

> [!IMPORTANT]
> If a point-to-site VPN configuration used for a global profile is configured to authenticate users using the RADIUS protocol, make sure "Use Remote/On-premises RADIUS server" is turned on for all point-to-site VPN gateways using that configuration. Additionally, ensure your RADIUS server is configured to accept authentication requests from the RADIUS proxy IP addresses of **all** point-to-site VPN gateways using this VPN configuration.

### Download a global VPN profile

To generate and download VPN client profile configuration files, use the following steps:

1. Go to the **Virtual WAN**.
1. In the left pane, select **User VPN configurations**.
1. On the **User VPN configurations** page you'll see all of the User VPN configurations that you've created for your virtual WAN. In the **Hub** column, you'll see the hubs that are associated to each User VPN configuration. Click the **>** to expand and view the hub names.

   :::image type="content" source="./media/global-hub-profile/expand.png" alt-text="Screenshot that shows hubs list expanded." lightbox="./media/global-hub-profile/expand.png":::

1. In the following example, you see multiple rows with hubs that use the same User VPN Configuration. In a global profile, when hubs use the same User VPN Configuration, you can click any hub row that has the User VPN Configuration you want. The profile files that you generate from this page align to the User VPN Configuration, not a particular hub. If you want to limit your VPN users to connect to only one hub (you don't want to use a global profile), use the [Hub profile](#hub) steps instead.

   :::image type="content" source="./media/global-hub-profile/wan-level-global.png" alt-text="Screenshot that shows selections for downloading a global profile." lightbox="./media/global-hub-profile/wan-level-global.png":::

   In the example, we selected the line with Hub2, but selecting Hub3 or Hub1 would generate the same profile configuration files. However, if we selected the line with Hub6, the profile configuration files would be different because Hub6 uses a different User VPN Configuration.

   Click a line containing the **User VPN Configuration** you want to use. This highlights the entire line. Then, click **Download virtual WAN user VPN profile**.

1. On the **Download virtual WAN user VPN** page, select **EAPTLS**, then click **Generate and download profile**. A profile package (zip file) containing VPN client configuration settings is generated and downloads to your computer. The contents of the package depend on the hubs and the authentication and tunnel type choices for the configuration that you selected.

   :::image type="content" source="./media/global-hub-profile/generate-download.png" alt-text="Screenshot the authentication type and generate and download profile." lightbox="./media/global-hub-profile/generate-download.png":::

### Include or exclude a hub from a global profile

By default, every hub that uses the same User VPN Configuration is included in the global VPN profile that you generate and download. However, you can choose to exclude a hub from the global VPN profile. If you do, the VPN client won't be load balanced to connect to that hub's gateway.

1. To check if a hub is included in the global VPN profile, go to the **Virtual WAN**.
1. On the **Overview** page, select **Hubs**.
1. On the **Hubs** page, click the hub.
1. On the **Virtual Hub** page, in the left pane, select **User VPN (Point to site)**.
1. On the **User VPN (Point-to-site)** page, see **Gateway attachment state** to determine if this hub is included in the global VPN profile. If the state is **attached**, the hub is included. If the state is **detached**, the hub isn't included.

   :::image type="content" source="./media/global-hub-profile/include-exclude.png" alt-text="Screenshot that shows the attachment state of a gateway."lightbox="./media/global-hub-profile/include-exclude.png":::

1. To include or exclude (attach or detach) the hub from the global VPN profile, select **Include/Exclude Gateway from Global Profile**.

1. On the **Include/Exclude** page, make one of the following choices.

   * Click **Exclude** if you want to remove this hub's gateway from the Virtual WAN global User VPN profile. Users who are using the hub profile will still be able to connect to this hub's gateway. Users who are using this global profile won't be able to connect to this hub's gateway.

   * Click **Include** if you want to include this hub's gateway in the Virtual WAN global User VPN profile. Users who are using this global profile will be able to connect to this hub's gateway.

### Global profile best practices

#### Add multiple server validation certificates

This section pertains connections using the OpenVPN tunnel type and the Azure VPN Client version 2.1963.44.0 or higher.

When you configure a hub P2S gateway, Azure assigns an internal certificate to the gateway. This is different than the root certificate information that you specify when you want to use Certificate Authentication as your authentication method. The internal certificate that is assigned to the hub is used for all authentication types. This value is represented in the profile configuration files that you generate as *servervalidation/cert/hash*. The VPN client uses this value as part of the connection process.

If you have multiple hubs in different geographic regions, each hub may use a different Azure-level server validation certificate. However, the global profile only contains the server validation certificate hash value for 1 of the hubs. This means that if the certificate for that hub isn't working properly for any reason, the client doesn't have the necessary server validation certificate hash value for the other hubs.

As a best practice, we recommend that you update your VPN client profile configuration file to include the certificate hash value of all the hubs that are attached to the global profile, and then configure the Azure VPN Client using the updated file.

1. To view the server validation certificate hash for each hub, generate and download the [hub profile](#hub) files for each of the hubs that are part of the global profile. Use a text editor to view profile information contained in the **azurevpnconfig.xml** file. This file is typically found in the **AzureVPN** folder. Note the server validation certificate hash for each hub.

1. Generate and download the [global profile](#global) files. Use a text editor to open the **azurevpnconfig.xml** file.

1. Using the following xml example, configure the global profile file to include the server validation certificate hashes from the hubs that you want to include. Configure the Azure VPN Client using the edited profile configuration file.

   ```xml
     </protocolconfig>
     <serverlist>
       <ServerEntry>
         <displayname
           i:nil="true" />
         <fqdn>wan.kycyz81dpw483xnf3fg62v24f.vpn.azure.com</fqdn>
       </ServerEntry>
     </serverlist>
     <servervalidation>
       <cert>
         <hash>A8985D3A65E5E5C4B2D7D66D40C6DD2FB19C5436</hash>
         <issuer
           i:nil="true" />
       </cert>
       <cert>
         <hash>59470697201baejC4B2D7D66D40C6DD2FB19C5436</hash>
         <issuer
           i:nil="true" />
       </cert>
       <cert>
         <hash>cab20a7f63f00f2bae76202gdfe36db3a03a9cb9</hash>
         <issuer
           i:nil="true" />
       </cert>
   ```

## <a name="hub"></a>Hub profiles

Use this type of profile when you want VPN users to be able to connect only to a single specified hub. The files you generate and download at the hub-level contain different settings than the files you generate and download at the WAN-level [global profile](#global).

### Download a hub VPN profile

To generate and download VPN client profile configuration files, use the following steps:

1. Go to the **virtual hub**.
1. In the left pane, select **User VPN (Point to site)**.
1. Select **Download virtual Hub User VPN profile**.

   :::image type="content" source="./media/global-hub-profile/hub-profile.png" alt-text="Screenshot that shows how to download a hub profile." lightbox="./media/global-hub-profile/hub-profile.png":::

1. On the download page, select **EAPTLS**, then **Generate and download profile**. A profile package (zip file) containing the client configuration settings is generated and downloads to your computer. The contents of the package depend on the hub and the authentication and tunnel type choices for your configuration.

## Next steps

For more information about User VPNs, see [Create User VPN point-to-site connections](virtual-wan-point-to-site-portal.md).
