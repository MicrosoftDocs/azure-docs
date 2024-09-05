---
title: 'Configure P2S VPN clients - certificate authentication -OpenVPN - Linux'
titleSuffix: Azure VPN Gateway
description: Learn how to configure a Linux VPN client solution for VPN Gateway P2S configurations that use certificate authentication and an OpenVPN client.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 06/24/2024
ms.author: cherylmc
---

# Configure OpenVPN client for P2S certificate authentication connections - Linux

This article helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) and **Certificate authentication** from Linux using an OpenVPN client.

## Before you begin

Verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You created and configured your VPN gateway for point-to-site certificate authentication and the OpenVPN tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md) for steps.
* You generated and downloaded the VPN client configuration files. See [Generate VPN client profile configuration files](vpn-gateway-howto-point-to-site-resource-manager-portal.md#profile-files) for steps.
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

### Connection requirements

To connect to Azure using the OpenVPN client using certificate authentication, each connecting client requires the following items:

* The Open VPN Client software must be installed and configured on each client.
* The client must have the correct certificates installed locally.

### Workflow

The workflow for this article is:

1. Install the OpenVPN client.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the OpenVPN client.
1. Connect to Azure.

### About certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

The OpenVPN client in this article uses certificates exported with a *.pfx* format. You can export a client certificate easily to this format using the Windows instructions. See [Export a client certificate - pfx](vpn-gateway-certificates-point-to-site.md#clientexport). If you don't have a Windows computer, as a workaround, you can use a small Windows VM to export certificates to the needed *.pfx* format. At this time, the [OpenSSL](point-to-site-certificates-linux-openssl.md) Linux instructions we provide only result in the *.pem* format.

## <a name="openvpn"></a>Configuration steps

This section helps you configure Linux clients for certificate authentication that uses the OpenVPN tunnel type. To connect to Azure, download the OpenVPN client and configure the connection profile.

[!INCLUDE [Configuration steps for OpenVPN Linux](../../includes/vpn-gateway-config-openvpn-linux.md)]

## Next steps

For additional steps, return to the [P2S Azure portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md) article.
