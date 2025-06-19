---
title: 'Configure P2S VPN clients - certificate authentication - Azure VPN Client - Linux'
titleSuffix: Azure Virtual WAN
description: Learn how to configure a Linux client to connect to Azure using a User VPN point-to-site connection, Open VPN, and the Azure VPN Client for Linux.
author: cherylmc
ms.service: azure-virtual-wan
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 02/06/2025
ms.author: cherylmc
---

# Configure Azure VPN Client – P2S User VPN certificate authentication – Linux (Preview)

This article helps you connect to your Azure virtual network (VNet) using the Azure VPN Client for Linux. These instructions apply to User VPN point-to-site (P2S) and **Certificate authentication** connections. The Azure VPN Client for Linux requires the **OpenVPN** tunnel type.

The VPN client configuration files that you generate are specific to the P2S User VPN gateway configuration. If there are changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect.

[!INCLUDE [Linux versions](../../includes/vpn-gateway-azure-vpn-client-linux-supported-releases.md)]

## Before you begin

Verify that you are on the correct article. The following table shows the configuration articles available for Azure Virtual WAN P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [P2S client configuration articles](../../includes/virtual-wan-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You configured a virtual WAN according to the steps in the [Create User VPN point-to-site connections](virtual-wan-point-to-site-portal.md) article. Your User VPN configuration must use certificate authentication and the OpenVPN tunnel type.
* You generated and downloaded the VPN client configuration files. For steps to generate a VPN client profile configuration package, see [Generate VPN client configuration files](virtual-wan-point-to-site-portal.md#p2sconfig).
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-azure-vpn-client-certificate-linux.md)]

## Next steps

For additional steps, return to the [Create a Virtual WAN P2S User VPN connection](virtual-wan-point-to-site-portal.md) article.
