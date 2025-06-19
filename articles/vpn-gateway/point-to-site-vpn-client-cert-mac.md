---
title: 'Configure P2S VPN clients - certificate authentication - macOS native client'
titleSuffix: Azure VPN Gateway
description: Learn how to configure the VPN client for VPN Gateway P2S configurations that use certificate authentication. This article applies to macOS native client.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 01/30/2025
ms.author: cherylmc
---

# Configure P2S VPN clients: certificate authentication - native VPN client - macOS

If your point-to-site (P2S) VPN gateway is configured to use IKEv2 and certificate authentication, you can connect to your virtual network using the native VPN client that's part of your macOS operating system. This article walks you through the steps to configure the native VPN client and connect to your virtual network.

## Before you begin

Before you begin configuring your client, verify that you're on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You created and configured your VPN gateway for point-to-site certificate authentication and the OpenVPN tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](point-to-site-certificate-gateway.md) for steps.
* You generated and downloaded the VPN client configuration files. See [Generate VPN client profile configuration files](point-to-site-certificate-gateway.md#profile-files) for steps.
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.
* Your VPN gateway must be using a SKU other than the **Basic SKU**.

### Workflow

The workflow for this article is as follows:

1. Generate client certificates if you haven't already done so.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Install certificates.
1. Configure the native VPN client that's already installed your OS.
1. Connect to Azure.

## Generate certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

For information about working with certificates, see [Generate and export certificates](vpn-gateway-certificates-point-to-site.md).

[!INCLUDE [Configure macOS](../../includes/vpn-gateway-vwan-native-certificate.md)]

## Next steps

Follow up with any additional server or connection settings. See [Point-to-site configuration steps](point-to-site-certificate-gateway.md).