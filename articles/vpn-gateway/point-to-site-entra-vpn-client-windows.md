---
title: 'Configure Azure VPN Client - Microsoft Entra ID authentication - Microsoft-registered App ID - Windows'
description: Learn how to configure the Azure VPN Client to connect to a virtual network using VPN Gateway point-to-site VPN, OpenVPN protocol connections, and Microsoft Entra ID authentication from a Windows computer. This article applies to P2S gateways configured with the Microsoft-registered App ID.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 02/10/2025
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

[!INCLUDE [Download Azure VPN Client](../../includes/vpn-gateway-download-vpn-client.md)]

## <a name="generate"></a>Extract client profile configuration files

To configure your Azure VPN Client profile, you must first download the VPN client profile configuration package from the Azure P2S gateway. This package is specific to the configured VPN gateway and contains the necessary settings to configure the VPN client. If you used the P2S server configuration steps as mentioned in the [Prerequisites](#prerequisites) section, you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files. If you need to generate configuration files, see [Download the VPN client profile configuration package](point-to-site-entra-gateway.md#download).

After you obtain the VPN client profile configuration package, extract the zip file. The zip file contains the **AzureVPN** folder. The **AzureVPN** folder contains the **azurevpnconfig_aad.xml** file or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. If you don't see **azurevpnconfig_aad.xml** or **azurevpnconfig.xml**, or you don't have an **AzureVPN** folder, verify that your VPN gateway is configured to use the OpenVPN tunnel type and that Azure Active Directory (Microsoft Entra ID) authentication is selected.

## <a name="modify"></a>Modify profile configuration files

[!INCLUDE [custom audience steps](../../includes/vpn-gateway-entra-vpn-client-custom.md)]

## <a name="import"></a>Import client profile configuration settings

> [!NOTE]
> [!INCLUDE [Entra VPN client note](../../includes/vpn-gateway-entra-vpn-client-note.md)]

> [!INCLUDE [Import settings](../../includes/vpn-gateway-vwan-azure-vpn-client-entra-windows.md)]

## Optional client configuration settings

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other settings. For more information, see [Azure VPN Client - optional settings](azure-vpn-client-optional-configurations.md).

## Azure VPN Client version information

For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).
  
## Next steps

[About point-to-site connections](point-to-site-about.md).
