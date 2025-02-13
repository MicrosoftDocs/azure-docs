---
title: 'Configure P2S VPN clients - certificate authentication - Azure VPN Client - Linux'
titleSuffix: Azure VPN Gateway
description: Learn how to configure a Linux client to connect to Azure using a point-to-site connection, Open VPN, and the Azure VPN Client for Linux.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 09/06/2024
ms.author: cherylmc
---

# Configure Azure VPN Client – Certificate authentication OpenVPN – Linux (Preview)

This article helps you connect to your Azure virtual network (VNet) from the Azure VPN Client for Linux using VPN Gateway point-to-site (P2S) **Certificate authentication**. The Azure VPN Client for Linux requires the OpenVPN tunnel type.

[!INCLUDE [Supported versions](../../includes/vpn-gateway-azure-vpn-client-linux-supported-releases.md)]

## Before you begin

Verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* The VPN gateway is configured for point-to-site certificate authentication and the OpenVPN tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](point-to-site-certificate-gateway.md) for steps.
* VPN client profile configuration files have been generated and are available. See [Generate VPN client profile configuration files](point-to-site-certificate-gateway.md#profile-files) for steps.

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-azure-vpn-client-certificate-linux.md)]

## Next steps

For additional steps, return to the [Create a VPN Gateway P2S VPN connection](point-to-site-certificate-gateway.md) article.
