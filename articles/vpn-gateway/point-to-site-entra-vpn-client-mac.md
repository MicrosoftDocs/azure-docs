---
title: 'Configure P2S Azure VPN Client - Microsoft Entra ID authentication - macOS'
description: Learn how to configure macOS client computers to connect to Azure using the Azure VPN Client. These steps are for gateways configured to use Microsoft Entra ID authentication with the Microsoft-registered Azure VPN Client App ID and corresponding Audience.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: howto
ms.date: 05/09/2024
ms.author: cherylmc
---

# Configure the Azure VPN Client - Microsoft Entra ID authentication - macOS (Preview)

This article helps you configure your macOS client computer to connect to an Azure virtual network using a VPN Gatway point-to-site(P2S) connection. These steps apply to Azure VPN gatways configured for Microsofte Entra ID authentication using the Microsoft-registered Azure VPN Client App ID. Microsoft Entra authentication is supported only for OpenVPN® protocol connections and requires the Azure VPN Client. The Azure VPN client for macOS is currently not available in France and China due to local regulations and requirements.

[!INCLUDE [Note - applies to Microsoft-registered App ID](../../includes/vpn-gateway-entra-registered-app-openvpn-note.md)]

## Prerequisites

* Configure your VPN gateway for point-to-site VPN connections that specify Microsoft Entra ID authentication. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).
* If your device is running MacOS M1 or MacOS M2, you must install Rosetta software if it's not already installed. See [If you need to install Rosetta on your Mac](https://support.apple.com/en-us/HT211861).

## Workflow

This article continues on from the [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) steps. This article helps you:

1. Download and install the Azure VPN Client for macOS.
1. Extract the VPN client profile configuration files.
1. Import the client profile settings to the VPN client.
1. Create a connection and connect to Azure.

## Download the Azure VPN Client

1. Download the latest [Azure VPN Client](https://apps.apple.com/us/app/azure-vpn-client/id1553936137) from the Apple Store.
1. Install the client on your computer.

## <a name="generate"></a>Extract client profile configuration files

To configure your Azure VPN Client profile, you download a VPN client profile configuration package from the Azure P2S gateway. This package contains the necessary settings to configure the VPN client.

If you used the P2S server configuration steps as mentioned in the [Prerequisites](#prerequisites) section, you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files. If you need to generate configuration files, see [Download the VPN client profile configuration package](point-to-site-entra-gateway.md#download-the-vpn-client-profile-configuration-package).

After you obtain the VPN client profile configuration package, extract the files.

## Import VPN client profile configuration files

> [!NOTE]
> [!INCLUDE [Entra VPN client note](../../includes/vpn-gateway-entra-vpn-client-note.md)]

1. On the Azure VPN Client page, select **Import**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-1.png" alt-text="Screenshot of Azure VPN Client import selection.":::
1. Navigate to the folder containing the  file that you want to import, select it, then click **Open**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-2.png" alt-text="Screenshot of Azure VPN Client import clicking open.":::
1. View the connection profile information. Change the **Certificate Information** value to show **DigiCert Global Root G2**, rather than the default or blank, then click **Save**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-3.png" alt-text="Screenshot of Azure VPN Client saving the imported profile settings.":::
1. In the VPN connections pane, select the connection profile that you saved. Then, click **Connect**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-4.png" alt-text="Screenshot of Azure VPN Client clicking Connect.":::
1. Once connected, the status changes to **Connected**. To disconnect from the session, click **Disconnect**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/import-5.png" alt-text="Screenshot of Azure VPN Client connected status and disconnect button.":::

## To create a connection manually

1. Open the Azure VPN Client. Select **Add** to create a new connection.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/add-1.png" alt-text="Screenshot of Azure VPN Client selecting Add.":::

1. On the **Azure VPN Client** page, you can configure the profile settings. Change the **Certificate Information** value to show **DigiCert Global Root G2**, rather than the default or blank, then click **Save**.

   :::image type="content" source="media/openvpn-azure-ad-client-mac/add-2.png" alt-text="Screenshot of Azure VPN Client profile settings.":::

   Configure the following settings:

   * **Connection Name:** The name by which you want to refer to the connection profile.
   * **VPN Server:** This name is the name that you want to use to refer to the server. The name you choose here doesn't need to be the formal name of a server.
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
1. Once connected, you'll see the **Connected** status. When you want to disconnect, click **Disconnect** to disconnect the connection.

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
