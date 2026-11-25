---
title: 'Configure a VPN client for P2S Microsoft Entra ID authentication connections'
titleSuffix: Azure VPN Gateway
description: Learn how to configure the Azure VPN Client for Windows and macOS with Microsoft Entra ID authentication, and review the Linux client retirement guidance.
author: duongau
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 08/31/2026
ms.author: duau
ms.custom:
  - linux-related-content
  - sfi-image-nochange
zone_pivot_groups: vpn-client-os-desktop

# Audience and custom App ID values aren't sensitive data. Don't remove them. They're required for the configuration.

# Customer intent: "As a network administrator, I want to configure the Azure VPN Client with Microsoft Entra ID authentication, so that I can securely connect to virtual networks via point-to-site VPN."
---

# Configure a VPN client for P2S Microsoft Entra ID authentication connections

This article helps you configure the Azure VPN Client to connect to a virtual network using a VPN Gateway point-to-site (P2S) VPN and Microsoft Entra ID authentication. Microsoft Entra ID authentication requires the OpenVPN® protocol and the Azure VPN Client. Select Windows or macOS for configuration steps, or Linux for retirement and migration guidance. For more information about point-to-site connections, see [About point-to-site connections](point-to-site-about.md).

The steps in this article apply to Microsoft Entra ID authentication by using the Microsoft-registered Azure VPN Client app with associated App ID and Audience values. This article doesn't apply to the older, manually registered Azure VPN Client app for your tenant. For more information, see [About point-to-site VPN - Microsoft Entra ID authentication](point-to-site-about.md#entra-id).

## Prerequisites

Configure your VPN gateway for point-to-site VPN connections that specify Microsoft Entra ID authentication. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

::: zone pivot="windows"

The Azure VPN Client supports Windows FIPS mode by using the [KB4577063](https://support.microsoft.com/help/4577063/windows-10-update-kb4577063) hotfix.

[!INCLUDE [Supported Windows versions](../../includes/vpn-gateway-vwan-azure-vpn-client-windows-supported.md)]

## Windows workflow

This article continues on from the [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) steps. This section helps you:

1. Download and install the Azure VPN Client for Windows.
1. Extract the VPN client profile configuration files.
1. Update the profile configuration files with a custom audience value (if applicable).
1. Import the client profile settings to the VPN client.
1. Create a connection and connect to Azure.

## <a name="download"></a>Download the Azure VPN Client for Windows

The features and settings that are available for the Azure VPN Client are dependent on the version of the client that you're using. For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).

[!INCLUDE [Download Azure VPN Client](../../includes/vpn-gateway-download-vpn-client.md)]

## <a name="generate"></a>Extract Windows client profile configuration files

To configure your Azure VPN Client profile, you must first download the VPN client profile configuration package from the Azure P2S gateway. This package is specific to the configured VPN gateway and contains the necessary settings to configure the VPN client. If you used the P2S server configuration steps as mentioned in the [Prerequisites](#prerequisites) section, you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files. If you need to generate configuration files, see [Download the VPN client profile configuration package](point-to-site-entra-gateway.md#download).

After you obtain the VPN client profile configuration package, extract the zip file. The zip file contains the **AzureVPN** folder. The **AzureVPN** folder contains the **azurevpnconfig_aad.xml** file or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. If you don't see **azurevpnconfig_aad.xml** or **azurevpnconfig.xml**, or you don't have an **AzureVPN** folder, verify that your VPN gateway is configured to use the OpenVPN tunnel type and that Azure Active Directory (Microsoft Entra ID) authentication is selected.

## <a name="modify"></a>Modify Windows profile configuration files

[!INCLUDE [custom audience steps](../../includes/vpn-gateway-entra-vpn-client-custom.md)]

## <a name="import"></a>Configure the Azure VPN Client for Windows and connect

> [!NOTE]
> [!INCLUDE [Entra VPN client note](../../includes/vpn-gateway-entra-vpn-client-note.md)]

[!INCLUDE [Import settings](../../includes/vpn-gateway-vwan-azure-vpn-client-entra-windows.md)]

## Work with Windows connections

### <a name="autoconnect"></a>Connect automatically

You can configure your connection to connect automatically with Always-on.

1. On the home page for your VPN client, select **VPN Settings**. If you see the switch apps dialog box, select **Yes**.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/vpn-settings.png" alt-text="Screenshot of the VPN home page with VPN Settings selected." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/vpn-settings.png":::

1. If the profile that you want to configure is connected, disconnect the connection, then highlight the profile and select the **Connect automatically** check box.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/automatic.png" alt-text="Screenshot of the Settings window, with the Connect automatically box checked." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/automatic.png":::

1. Select **Connect** to initiate the VPN connection.

### <a name="diagnose"></a>Diagnose connection issues

#### Prerequisites check

If your Azure VPN Client is version 4.0.0.0 or later, you can run a prerequisites check to verify that your computer has the necessary items configured and installed to successfully connect. To view the version number of an installed Azure VPN Client, launch the client and select **Help**.

1. Select the **...** at the bottom of the Azure VPN Client page, and then select **Prerequisites**.
1. On the **Test Application Prerequisites** page, select **Run Prerequisites Test**.
1. Fix any issues and try connecting again. For more information, see [Azure VPN Client prerequisites check](azure-vpn-client-prerequisites-check.md).

#### Diagnostics tool

1. Select the **...** next to the VPN connection that you want to diagnose to reveal the menu. Then select **Diagnose**.
1. On the **Connection Properties** page, select **Run Diagnostics**. If asked, sign in with your credentials, then view the results.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/diagnose.png" alt-text="Screenshot of the ellipsis and Diagnose selected." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/diagnose.png":::

## Configure Windows custom settings: DNS and routing

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other settings. For more information, see [Azure VPN Client - optional settings](azure-vpn-client-optional-configurations.md).

## Configure Device SSO for Windows

Device Single Sign On (SSO) allows users to sign in to their devices once and use that authentication while using the Azure VPN Client. For steps, see [Configure Device SSO for Windows - Azure VPN Client – Microsoft Entra ID authentication](point-to-site-entra-vpn-client-windows-device-sso.md).

::: zone-end

::: zone pivot="macos"

Microsoft Entra ID authentication only supports OpenVPN protocol connections and requires the Azure VPN Client. The Azure VPN client for macOS isn't available in France and China due to local regulations and requirements.

[!INCLUDE [Supported OS, processors, Rosetta software](../../includes/vpn-gateway-vwan-macos-prerequisites-vpn-client-include.md)]

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-entra-vpn-client-mac.md)]

## Optional macOS client configuration settings

You can configure the Azure VPN Client with optional settings, such as additional DNS servers, custom DNS, forced tunneling, and custom routes. For a description of the available settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

::: zone-end

::: zone pivot="linux"

[!INCLUDE [Linux retirement](../../includes/vpn-gateway-azure-vpn-client-linux-retirement.md)]

Microsoft Entra ID authentication on Linux was available only through the retired Azure VPN Client for Linux. The supported OpenVPN and strongSwan alternatives don't support Microsoft Entra ID authentication with Azure VPN Gateway P2S connections.

To continue using Linux, change the gateway to a supported authentication method and migrate to a supported client. For available options and migration steps, see [Migrate from the Azure VPN Client for Linux](azure-vpn-client-linux-retirement.md).

If Microsoft Entra ID authentication is required, use the Azure VPN Client for [Windows](?pivots=windows) or [macOS](?pivots=macos).

::: zone-end

## Next steps

* For more information about VPN Gateway, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).
* For more information about point-to-site connections, see [About point-to-site connections](point-to-site-about.md).
