---
title: How to Update Your VPN Client Profile
titleSuffix: Azure VPN Gateway
description: Learn about updating your point-to-site VPN client profile.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: tutorial
ms.date: 06/04/2026
ms.author: cherylmc
# Customer intent: "I want to understand how to update my VPN client profile when Azure VPN Gateway requires migration of its root certificate or if I have made changes to my VPN configuration so I can maintain connectivity for my Point-to-Site VPN connections."
---
# How to update a P2S VPN client profile

This article helps you generate, distribute, and install an updated VPN client profile for Point-to-Site (P2S) connections. These instructions are necessary when you make changes to your gateway configuration, or when your gateway requires migration of its root certificate. For more information about gateway root certificate migration, see [About gateway root certificate migration](point-to-site-about-gateway-certificate-migration.md). This article applies to both Azure VPN Gateway and Virtual WAN.

## General workflow

1. **Generate** a new VPN client profile for each affected gateway. 
2. **Distribute** the updated profile to all end users who connect via Point-to-Site VPN.
3. **Install** the new profile on each client device.
4. **Verify** connectivity.

## Generate a new VPN client profile

Select the tab that matches your gateway type.

### [VPN Gateway](#tab/vpn-gateway)
 
1. In the Azure portal, go to your virtual network gateway resource.
2. In the left pane, under **Settings**, select **Point-to-site configuration**.
3. On the **Point-to-site configuration** page, at the top of the page, select **Download VPN client**.
4. Save the downloaded ZIP file to your local machine. This ZIP file contains the updated client profile for all supported VPN client types.
5. Extract the ZIP file to a local directory. The extracted folder will contain the necessary files.

### [Virtual WAN](#tab/virtual-wan)

Virtual WAN has both global and hub specific User VPN profiles for P2S connections. The global profile contains root certificate information that applies to all hubs in the Virtual WAN, while the hub-specific profile contains connection information unique to that hub.

The type of profile you choose depends on whether you want the VPN client to connect to a geographically load-balanced WAN-level profile (global profile), or you want to restrict the VPN client to connect only to a certain hub (hub profile). When you generate a new profile package, you can either generate a new global profile that applies to all specified hubs, or generate a new hub-specific profile for an individual hub. 

For more information, see [Download global and hub VPN profiles for User VPN clients](../virtual-wan/global-hub-profile.md).

---

## Distribute and install the updated profile

After generating the new profile, distribute it to all end users and install the new client profiles and all server certificates on their client devices.

The installation steps depend on the authentication method, tunnel type, client OS, and VPN client software in use. For detailed installation instructions for your specific configuration:

- For Entra or Certificate based authentication, see the table in [Configure Azure VPN Client for P2S certificate authentication connections - Windows](point-to-site-vpn-client-certificate-windows-azure-vpn-client.md#before-you-begin).
- For RADIUS based authentication, see the dropdown labeled "VPN Client Configuration" in [this segment](point-to-site-radius-gateway.md) of the documentation.

> [!NOTE]
> If a connection profile for this gateway already exists on the client device, you need to add the new configuration to the client.

## Verify connectivity

After installing the updated profile on a client device:

1. Establish a P2S VPN connection using the updated profile.
2. Verify end-to-end connectivity with Azure resources.

If the connection fails:

- Confirm that you downloaded the new profile after receiving notice that the updated profile is available.
- Verify that the new profile configuration file and all necessary root certificates were imported for your client type.
- Troubleshoot using the [Azure VPN troubleshooting documentation](/troubleshoot/azure/vpn-gateway/welcome-vpn-gateway)
- If issues persist, create an [Azure support request](https://azure.microsoft.com/support/).

## Validate all clients are updated

After distributing the updated profile, monitor your gateway to confirm all clients have been updated. Ensure that all client profiles are updated well in advance of the scheduled migration. 

## Known issues

The Azure VPN Client for Linux does not have a supported update method at this time. If you are using the Azure VPN Client on Linux, there is currently no supported migration path for updating the client profile during a certificate migration. Monitor this page for updates.

## Next steps

- [What's new in Azure VPN Gateway](whats-new.md)
- [What's new in Azure Virtual WAN](../virtual-wan/whats-new.md)