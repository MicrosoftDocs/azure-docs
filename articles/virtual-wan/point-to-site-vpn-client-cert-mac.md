---
title: 'Configure P2S User VPN native VPN client - certificate authentication - macOS'
description: Learn how to configure the VPN client for Virtual WAN User VPN configurations that use certificate authentication and IKEv2. This article applies to macOS.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 02/04/2025
ms.author: cherylmc
---

# Configure P2S User VPN clients: certificate authentication - native VPN client - macOS

If your point-to-site (P2S) User VPN gateway is configured to use IKEv2 and certificate authentication, you can connect to your virtual network using the native VPN client that's part of your macOS operating system. This article walks you through the steps to configure the native VPN client and connect to your virtual network.

## Prerequisites

This article assumes that you've already performed the following prerequisites:

* You completed the necessary configuration steps in the [Tutorial: Create a P2S User VPN connection using Azure Virtual WAN](virtual-wan-point-to-site-portal.md).
* You generated and downloaded the VPN client configuration files. The VPN client configuration files that you generate are specific to the Virtual WAN User VPN profile that you download.

   Virtual WAN has two different types of configuration profiles: WAN-level (global), and hub-level. For more information, see [Download global and hub VPN profiles](global-hub-profile.md). If there are any changes to the P2S VPN configuration after you generate the files, or you change to a different profile type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect.
* You have acquired the necessary certificates. You can either [generate client certificates](certificates-point-to-site.md), or acquire the appropriate client certificates necessary for authentication. Make sure you have both the client certificate and the root server certificate information.

### Connection requirements

To connect to Azure using the native VPN client software and certificate authentication, each connecting client requires the following items:

* The client must have a client certificate that's installed locally.
* The client must be running a supported version of macOS.

### Workflow

The workflow for this article is as follows:

1. Generate client certificates if you haven't already done so.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Install certificates.
1. Configure the native VPN client that's already installed your OS.
1. Connect to Azure.

## Generate certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

For information about working with certificates, see [Generate and export certificates](certificates-point-to-site.md).

[!INCLUDE [Configure macOS](../../includes/vpn-gateway-vwan-native-certificate.md)]

## Next steps

Follow up with any additional server or connection settings. See [Tutorial: Create a P2S User VPN connection using Azure Virtual WAN](virtual-wan-point-to-site-portal.md).
