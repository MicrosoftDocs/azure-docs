---
title: 'Configure P2S VPN clients - certificate authentication - iOS OpenVPN client'
titleSuffix: Azure VPN Gateway
description: Learn how to configure the VPN client for VPN Gateway P2S configurations that use certificate authentication. This article applies to iOS OpenVPN client.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 06/18/2024
ms.author: cherylmc
---

# Configure point-to-site VPN clients: certificate authentication - iOS OpenVPN client

This article helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) and **Certificate authentication** on iOS using an OpenVPN client.

## Before you begin

Before you begin configuring your client, verify that you're on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You created and configured your VPN gateway for point-to-site certificate authentication and the OpenVPN tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](point-to-site-certificate-gateway.md) for steps.
* You generated and downloaded the VPN client configuration files. See [Generate VPN client profile configuration files](point-to-site-certificate-gateway.md#profile-files) for steps.
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

### Connection requirements

To connect to Azure using the OpenVPN client using certificate authentication, each connecting client requires the following items:

* The Open VPN Client software must be installed and configured on each client.
* The client must have a client certificate that's installed locally.

### Workflow

The workflow for this article is:

1. Install the OpenVPN client.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the OpenVPN client.
1. Connect to Azure.

## Generate client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

For information about working with certificates, see [Point-to site: Generate certificates - Linux](vpn-gateway-certificates-point-to-site.md).

## Configure the OpenVPN client

The following example uses **OpenVPN Connect** from the App Store.

[!INCLUDE [OpenVPN iOS](../../includes/vpn-gateway-vwan-config-openvpn-ios.md)]


## Next steps

Follow up with any additional server or connection settings. See [Point-to-site configuration steps](point-to-site-certificate-gateway.md).