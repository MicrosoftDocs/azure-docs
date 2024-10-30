---
title: 'Configure P2S Azure VPN Client - Microsoft Entra ID authentication - macOS'
description: Learn how to configure macOS client computers to connect to Azure using the Azure VPN Client. These steps are for gateways configured to use Microsoft Entra ID authentication.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 10/15/2024
ms.author: cherylmc
---

# Configure Azure VPN Client – Microsoft Entra ID authentication – macOS

This article helps you configure your macOS client computer to connect to an Azure virtual network using a VPN Gateway point-to-site (P2S) connection. These steps apply to Azure VPN gateways configured for Microsoft Entra ID authentication. Microsoft Entra ID authentication only supports OpenVPN® protocol connections and requires the Azure VPN Client. The Azure VPN client for macOS is currently not available in France and China due to local regulations and requirements.

## Prerequisites

Make sure you have the following prerequisites before you proceed with the steps in this article:

* Configure your VPN gateway for point-to-site VPN connections that specify Microsoft Entra ID authentication. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

[!INCLUDE [Supported OS, processors, Rosetta software](../../includes/vpn-gateway-vwan-macos-prerequisites-vpn-client-include.md)]

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

If you used the P2S server configuration steps as mentioned in the [Prerequisites](#prerequisites) section, you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files. If you need to generate configuration files, see [Download the VPN client profile configuration package](point-to-site-entra-gateway.md#download).

When you generate and download a VPN client profile configuration package, all the necessary configuration settings for VPN clients are contained in a VPN client profile configuration zip file. The VPN client profile configuration files are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect.

Locate and unzip the VPN client profile configuration package you generated and downloaded (listed in the [Prerequisites](#prerequisites)). Open the **AzureVPN** folder. In this folder, you'll see either the **azurevpnconfig_aad.xml** file or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. The .xml file contains the settings you use to configure the VPN client profile.

## <a name="modify"></a>Modify profile configuration files

If your P2S configuration uses a custom audience with your Microsoft-registered App ID, you might receive popups each time you connect that require you to enter your credentials again and complete authentication. Retrying authentication usually resolves the issue. This happens because the VPN client profile needs both the custom audience ID and the Microsoft application ID. To prevent this, modify your profile configuration .xml file to include both the custom application ID and the Microsoft application ID.

[!INCLUDE [custom audience steps](../../includes/vpn-gateway-entra-vpn-client-custom.md)]

## Import VPN client profile configuration files

> [!NOTE]
> [!INCLUDE [Entra VPN client note](../../includes/vpn-gateway-entra-vpn-client-note.md)]

1. On the Azure VPN Client page, select **Import**.

1. Navigate to the folder containing the file that you want to import, select it, then click **Open**.

1. On this screen, notice the connection values are populated using the values in the imported VPN client configuration file.

   * Verify that the **Certificate Information** value shows **DigiCert Global Root G2**, rather than the default or blank. Adjust the value if necessary.
   * Notice the Client Authentication values align with the values that were used to configure the VPN gateway for Microsoft Entra ID authentication. The Audience value in this example aligns with the Microsoft-registered App ID for Azure Public. If your P2S gateway is configured for a different Audience value, this field must reflect that value.

   :::image type="content" source="media/point-to-site-entra-vpn-client-mac/values.png" alt-text="Screenshot of Azure VPN Client saving the imported profile settings." lightbox="media/point-to-site-entra-vpn-client-mac/values.png":::

1. Click **Save** to save the connection profile configuration.
1. In the VPN connections pane, select the connection profile that you saved. Then, click **Connect**.
1. Once connected, the status changes to **Connected**. To disconnect from the session, click **Disconnect**.

## Create a connection manually

1. Open the Azure VPN Client. At the bottom of the client, select **Add** to create a new connection.

1. On the **Azure VPN Client** page, you can configure the profile settings. Change the **Certificate Information** value to show **DigiCert Global Root G2**, rather than the default or blank, then click **Save**.

   Configure the following settings:

   * **Connection Name:** The name by which you want to refer to the connection profile.
   * **VPN Server:** This name is the name that you want to use to refer to the server. The name you choose here doesn't need to be the formal name of a server.
   * **Server Validation**
     * **Certificate Information:** DigiCert Global Root G2
     * **Server Secret:** The server secret.
   * **Client Authentication**
     * **Authentication Type:** Microsoft Entra ID
     * **Tenant:** Name of the tenant.
     * **Audience:** The Audience value must match the value that your P2S gateway is configured to use.
     * **Issuer:** Name of the issuer.
1. After filling in the fields, click **Save**.
1. In the VPN connections pane, select the connection profile that you configured. Then, click **Connect**.

## Remove a VPN connection profile

You can remove the VPN connection profile from your computer.

1. Open the Azure VPN Client.
1. Select the VPN connection that you want to remove, then click **Remove**.

## Optional Azure VPN Client configuration settings

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other additional settings. For a description of the available optional settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## Next steps

For more information, see [Configure P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).
