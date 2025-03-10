---
title: 'Configure Azure VPN Client - Microsoft Entra ID authentication - Windows'
titleSuffix: Azure Virtual WAN
description: Learn how to use Virtual WAN User VPN (point-to-site) to connect to your virtual network using Microsoft Entra ID authentication and the Azure VPN Client.
services: virtual-wan
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/07/2025
ms.author: cherylmc

#Audience and custom App ID values are not sensitive data. Please do not remove. They are required for the configuration.
---

# Configure the Azure VPN Client – Microsoft Entra ID authentication – Windows

This article helps you configure the Azure VPN Client on a Windows computer to connect to a virtual network using a Virtual WAN User VPN (point-to-site) and Microsoft Entra ID authentication. The Azure VPN Client is supported with Windows FIPS mode by using the [KB4577063](https://support.microsoft.com/help/4577063/windows-10-update-kb4577063) hotfix.

> [!NOTE]
> Microsoft Entra ID authentication is supported only for OpenVPN® protocol connections.

## Before you begin

Verify that you are on the correct article. The following table shows the configuration articles available for Azure Virtual WAN point-to-site (P2S) VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [P2S client configuration articles](../../includes/virtual-wan-vpn-client-install-articles.md)]

## Prerequisites

This article assumes that you've already performed the following prerequisites:

* You configured a virtual WAN according to the steps in the [Configure a User VPN (P2S) gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) article. Your User VPN configuration must use Microsoft Entra ID (Azure Active Directory) authentication and the OpenVPN tunnel type.
* You generated and downloaded the VPN client configuration files. For steps to generate a VPN client profile configuration package, see [Download global and hub profiles](global-hub-profile.md).

## Workflow

This article continues on from the [Configure a User VPN (P2S) gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) steps. This article helps you:

1. Download and install the Azure VPN Client for Windows.
1. Extract the VPN client profile configuration files.
1. Update the profile configuration files with a custom audience value (if applicable).
1. Import the client profile settings to the VPN client.
1. Create a connection and connect to Azure.

## <a name="download"></a>Download the Azure VPN Client

[!INCLUDE [Download Azure VPN Client](../../includes/vpn-gateway-download-vpn-client.md)]

## <a name="generate"></a>Extract client profile configuration files

To configure your Azure VPN Client profile, you must first download the VPN client profile configuration package from the Azure P2S gateway. This package is specific to the configured VPN gateway and contains the necessary settings to configure the VPN client. If you used the P2S server configuration steps as mentioned in the [Prerequisites](#prerequisites) section, you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files.

After you obtain the VPN client profile configuration package, extract the zip file. The zip file contains the **AzureVPN** folder. The **AzureVPN** folder contains the **azurevpnconfig_aad.xml** file or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. If you don't see **azurevpnconfig_aad.xml** or **azurevpnconfig.xml**, or you don't have an **AzureVPN** folder, verify that your VPN gateway is configured to use the OpenVPN tunnel type and that Azure Active Directory (Microsoft Entra ID) authentication is selected.

## <a name="modify"></a>Modify profile configuration files

[!INCLUDE [custom audience steps](../../includes/vpn-gateway-entra-vpn-client-custom.md)]

## <a name="import"></a>Import client profile configuration settings

> [!NOTE]
> [!INCLUDE [Entra VPN client note](../../includes/vpn-gateway-entra-vpn-client-note.md)]

> [!INCLUDE [Import settings](../../includes/vpn-gateway-vwan-azure-vpn-client-entra-windows.md)]

## Optional client configuration settings

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other settings. For more information, see [Configure Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## Azure VPN Client version information

For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).

## Next steps

For more information about Microsoft-registered Azure VPN Client, see [Configure P2S User VPN for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).
