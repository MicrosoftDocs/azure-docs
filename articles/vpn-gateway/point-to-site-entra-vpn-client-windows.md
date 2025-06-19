---
title: 'Configure Azure VPN Client - Microsoft Entra ID authentication - Microsoft-registered App ID - Windows'
description: Learn how to configure the Azure VPN Client to connect to a virtual network using VPN Gateway point-to-site VPN, OpenVPN protocol connections, and Microsoft Entra ID authentication from a Windows computer. This article applies to P2S gateways configured with the Microsoft-registered App ID.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 03/20/2025
ms.author: cherylmc

#Audience and custom App ID values are not sensitive data. Please do not remove. They are required for the configuration.

---

# Configure Azure VPN Client – Microsoft Entra ID authentication – Windows

This article helps you configure the Azure VPN Client on a Windows computer to connect to a virtual network using a VPN Gateway point-to-site (P2S) VPN and Microsoft Entra ID authentication. For more information about point-to-site connections, see [About point-to-site connections](point-to-site-about.md). The Azure VPN Client is supported with Windows FIPS mode by using the [KB4577063](https://support.microsoft.com/help/4577063/windows-10-update-kb4577063) hotfix.

## Prerequisites

Configure your VPN gateway for point-to-site VPN connections that specify Microsoft Entra ID authentication. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

## Workflow

This article continues on from the [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) steps. This article helps you:

1. Download and install the Azure VPN Client for Windows.
1. Extract the VPN client profile configuration files.
1. Update the profile configuration files with a custom audience value (if applicable).
1. Import the client profile settings to the VPN client.
1. Create a connection and connect to Azure.

## <a name="download"></a>Download the Azure VPN Client

The features and settings that are available for the Azure VPN Client are dependent on the version of the client that you're using. For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).

[!INCLUDE [Download Azure VPN Client](../../includes/vpn-gateway-download-vpn-client.md)]

## <a name="generate"></a>Extract client profile configuration files

To configure your Azure VPN Client profile, you must first download the VPN client profile configuration package from the Azure P2S gateway. This package is specific to the configured VPN gateway and contains the necessary settings to configure the VPN client. If you used the P2S server configuration steps as mentioned in the [Prerequisites](#prerequisites) section, you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files. If you need to generate configuration files, see [Download the VPN client profile configuration package](point-to-site-entra-gateway.md#download).

After you obtain the VPN client profile configuration package, extract the zip file. The zip file contains the **AzureVPN** folder. The **AzureVPN** folder contains the **azurevpnconfig_aad.xml** file or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. If you don't see **azurevpnconfig_aad.xml** or **azurevpnconfig.xml**, or you don't have an **AzureVPN** folder, verify that your VPN gateway is configured to use the OpenVPN tunnel type and that Azure Active Directory (Microsoft Entra ID) authentication is selected.

## <a name="modify"></a>Modify profile configuration files

[!INCLUDE [custom audience steps](../../includes/vpn-gateway-entra-vpn-client-custom.md)]

## <a name="import"></a>Configure the Azure VPN Client and connect

> [!NOTE]
> [!INCLUDE [Entra VPN client note](../../includes/vpn-gateway-entra-vpn-client-note.md)]

> [!INCLUDE [Import settings](../../includes/vpn-gateway-vwan-azure-vpn-client-entra-windows.md)]

## Working with connections

### <a name="autoconnect"></a>Connect automatically

You can configure your connection to connect automatically with Always-on.

1. On the home page for your VPN client, select **VPN Settings**. If you see the switch apps dialogue box, select **Yes**.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/vpn-settings.png" alt-text="Screenshot of the VPN home page with VPN Settings selected." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/vpn-settings.png":::

1. If the profile that you want to configure is connected, disconnect the connection, then highlight the profile and select the **Connect automatically** check box.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/automatic.png" alt-text="Screenshot of the Settings window, with the Connect automatically box checked." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/automatic.png":::

1. Select **Connect** to initiate the VPN connection.

### <a name="diagnose"></a>Diagnose connection issues

#### Prerequisites check

If your Azure VPN Client is version 4.0.0.0 or later, you can run a prerequisites check to verify that your computer has the necessary items configured and installed in order to successfully connect. To view the version number of an installed Azure VPN Client, launch the client and select **Help**.

1. Click the **...** at the bottom of the Azure VPN Client page and select **Prerequisites**.
1. On the **Test Application Prerequisites** page, select **Run Prerequisites Test**.
1. Fix any issues and try connecting again. For more information, see [Azure VPN Client prerequisites check](azure-vpn-client-prerequisites-check.md).

#### Diagnostics tool

1. Select the **...** next to the VPN connection that you want to diagnose to reveal the menu. Then select **Diagnose**.
1. On the **Connection Properties** page, select **Run Diagnostics**. If asked, sign in with your credentials, then view the results.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/diagnose.png" alt-text="Screenshot of the ellipsis and Diagnose selected." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/diagnose.png":::

## Configure custom settings: DNS and routing

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other settings. For more information, see [Azure VPN Client - optional settings](azure-vpn-client-optional-configurations.md).
  
## Next steps

[About point-to-site connections](point-to-site-about.md).
