---
title: 'Configure a VPN client for P2S RADIUS: other authentication methods'
titleSuffix: Azure VPN Gateway
description: Learn how to configure a VPN client for point-to-site VPN configurations that use RADIUS authentication for methods other than certificate or password.
ms.service: vpn-gateway
ms.topic: how-to
author: cherylmc
ms.author: cherylmc 
ms.date: 05/11/2022
---
# Configure a VPN client for point-to-site: RADIUS - other methods and protocols

To connect to a virtual network over point-to-site (P2S), you need to configure the client device that you'll connect from. This article helps you create and install the VPN client configuration for RADIUS authentication that uses methods other than certificate or password authentication.

When you're using RADIUS authentication, there are multiple authentication instructions: [certificate authentication](point-to-site-vpn-client-configuration-radius-certificate.md), [password authentication](point-to-site-vpn-client-configuration-radius-password.md). and [other authentication methods and protocols](point-to-site-vpn-client-configuration-radius-other.md). The VPN client configuration is different for each type of authentication. To configure a VPN client, you use client configuration files that contain the required settings.

>[!NOTE]
> [!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]
>

## Workflow

The configuration workflow for P2S RADIUS authentication is as follows:

1. [Set up the Azure VPN gateway for P2S connectivity](point-to-site-how-to-radius-ps.md).

1. [Set up your RADIUS server for authentication](point-to-site-how-to-radius-ps.md#radius).

1. **Obtain the VPN client configuration for the authentication option of your choice and use it to set up the VPN client** (this article).

1. [Complete your P2S configuration and connect](point-to-site-how-to-radius-ps.md).

>[!IMPORTANT]
>If there are any changes to the point-to-site VPN configuration after you generate the VPN client configuration profile, such as the VPN protocol type or authentication type, you must generate and install a new VPN client configuration on your users' devices.
>

To use a different authentication type (for example, OTP), or to use a different authentication protocol (such as PEAP-MSCHAPv2 instead of EAP-MSCHAPv2), you must create your own VPN client configuration profile. If you have Point to Site VPN configured with RADIUS and OpenVPN, currently PAP is only authentication method supported between the gateway and RADIUS server. To create the profile, you need information such as the virtual network gateway IP address, tunnel type, and split-tunnel routes. You can get this information by using the following steps.

## Generate VPN client configuration files

You can generate the VPN client configuration files by using the Azure portal, or by using Azure PowerShell.

### Azure portal

1. Navigate to the virtual network gateway.
1. Click **Point-to-Site configuration**.
1. Click **Download VPN client**.
1. Select the client and fill out any information that is requested.
1. Click **Download** to generate the .zip file.
1. The .zip file will download, typically to your Downloads folder.

### Azure PowerShell

Use the [Get-AzVpnClientConfiguration](/powershell/module/az.network/get-azvpnclientconfiguration) cmdlet to generate the VPN client configuration for EapMSChapv2.

## View the files and configure the VPN client

Unzip the VpnClientConfiguration.zip file and look for the **GenericDevice** folder. Ignore the folders that contain the Windows installers for 64-bit and 32-bit architectures.

The **GenericDevice** folder contains an XML file called **VpnSettings**. This file contains all the required information:

* **VpnServer**: FQDN of the Azure VPN gateway. This is the address that the client connects to.
* **VpnType**: Tunnel type that you use to connect.
* **Routes**: Routes that you have to configure in your profile so that only traffic that's bound for the Azure virtual network is sent over the P2S tunnel.

The **GenericDevice** folder also contains a .cer file called **VpnServerRoot**. This file contains the root certificate that's required to validate the Azure VPN gateway during P2S connection setup. Install the certificate on all devices that will connect to the Azure virtual network.

Use the settings in the files to configure your VPN client.

## Next steps

Return to the article to [complete your P2S configuration](point-to-site-how-to-radius-ps.md).

For P2S troubleshooting information, see [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
