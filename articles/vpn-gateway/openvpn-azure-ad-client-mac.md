---
title: 'Configure Azure VPN Client - Microsoft Entra authentication - macOS'
description: 'Learn how to configure a macOS VPN client to connect to a virtual network using VPN Gateway Point-to-Site and Microsoft Entra authentication.'
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 04/07/2023
ms.author: cherylmc

---
# Configure the Azure VPN Client - Microsoft Entra authentication - macOS

This article helps you configure a VPN client for a computer running macOS 10.15 and later to connect to a virtual network using Point-to-Site VPN and Microsoft Entra authentication. Before you can connect and authenticate using Microsoft Entra ID, you must first configure your Microsoft Entra tenant. For more information, see [Configure a Microsoft Entra tenant](openvpn-azure-ad-tenant.md). For more information about Point-to-Site connections, see [About Point-to-Site connections](point-to-site-about.md).

> [!NOTE]
> * Microsoft Entra authentication is supported only for OpenVPN® protocol connections and requires the Azure VPN Client.
> * The Azure VPN client for macOS is currently not available in France and China due to local regulations and requirements.
>

For every computer that you want to connect to a VNet using a Point-to-Site VPN connection, you need to do the following:

* Download the Azure VPN Client to the computer.
* Configure a client profile that contains the VPN settings. 

If you want to configure multiple computers, you can create a client profile on one computer, export it, and then import it to other computers.

## Prerequisites

Before you can connect and authenticate using Microsoft Entra ID, you must first configure your Microsoft Entra tenant. For more information, see [Configure a Microsoft Entra tenant](openvpn-azure-ad-tenant.md).

## Download the Azure VPN Client

1. Download the [Azure VPN Client](https://apps.apple.com/us/app/azure-vpn-client/id1553936137) from the Apple Store.
1. Install the client on your computer.

## Generate VPN client profile configuration files

1. To generate the VPN client profile configuration package, see [Working with P2S VPN client profile files](about-vpn-profile-download.md).
1. Download and extract the VPN client profile configuration files.

## Import VPN client profile configuration files

1. On the Azure VPN Client page, select **Import**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-1.png" alt-text="Screenshot of Azure VPN Client import selection.":::
1. Navigate to the profile file that you want to import, select it, then click **Open**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-2.png" alt-text="Screenshot of Azure VPN Client import clicking open.":::
1. View the connection profile information. Change the **Certificate Information** value to show **DigiCert Global Root G2**, rather than the default or blank, then click **Save**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-3.png" alt-text="Screenshot of Azure VPN Client saving the imported profile settings.":::
1. In the VPN connections pane, select the connection profile that you saved. Then, click **Connect**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-4.png" alt-text="Screenshot of Azure VPN Client clicking Connect.":::
1. Once connected, the status will change to **Connected**. To disconnect from the session, click **Disconnect**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-5.png" alt-text="Screenshot of Azure VPN Client connected status and disconnect button.":::

## To create a connection manually

1. Open the Azure VPN Client. Select **Add** to create a new connection.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/add-1.png" alt-text="Screenshot of Azure VPN Client selecting Add.":::

1. On the **Azure VPN Client** page, you can configure the profile settings. Change the **Certificate Information** value to show **DigiCert Global Root G2**, rather than the default or blank, then click **Save**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/add-2.png" alt-text="Screenshot of Azure VPN Client profile settings.":::

   Configure the following settings:

   * **Connection Name:** The name by which you want to refer to the connection profile.
   * **VPN Server:** This name is the name that you want to use to refer to the server. The name you choose here does not need to be the formal name of a server.
   * **Server Validation**
     * **Certificate Information:** The certificate CA.
     * **Server Secret:** The server secret.
   * **Client Authentication**
     * **Authentication Type:** Microsoft Entra ID
     * **Tenant:** Name of the tenant.
     * **Issuer:** Name of the issuer.
1. After filling in the fields, click **Save**.
1. In the VPN connections pane, select the connection profile that you configured. Then, click **Connect**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/add-3.png" alt-text="Screenshot of Azure VPN Client connecting.":::
1. Using your credentials, sign in to connect.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/add-4.png" alt-text="Screenshot of Azure VPN Client sign in to connect.":::
1. Once connected, you will see the **Connected** status. When you want to disconnect, click **Disconnect** to disconnect the connection.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/add-5.png" alt-text="Screenshot of Azure VPN Client connected and disconnect button.":::

## To remove a VPN connection profile

You can remove the VPN connection profile from your computer.

1. Navigate to the Azure VPN Client.
1. Select the VPN connection that you want to remove, click the dropdown, and select **Remove**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/remove-1.png" alt-text="Screenshot of remove.":::
1. On the **Remove VPN connection?** box, click **Remove**.
   :::image type="content" source="media/openvpn-azure-ad-client-mac/remove-2.png" alt-text="Screenshot of removing.":::

## Optional Azure VPN Client configuration settings

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other additional settings. For a description of the available optional settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## Next steps

For more information, see [Create a Microsoft Entra tenant for P2S Open VPN connections that use Microsoft Entra authentication](openvpn-azure-ad-tenant.md).
