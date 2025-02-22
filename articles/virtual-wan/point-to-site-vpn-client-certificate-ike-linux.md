---
title: 'Configure User VPN clients - certificate authentication IKEv2 - Linux'
titleSuffix: Azure Virtual WAN
description: Learn how to configure an Ubuntu Linux strongSwan VPN client solution for User VPN Configurations that use certificate authentication.
author: cherylmc
ms.service: azure-virtual-wan
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 02/06/2025
ms.author: cherylmc
---

# Configure strongSwan VPN for User VPN P2S certificate authentication IKEv2 connections - Linux

This article helps you connect to your Azure virtual network (VNet) using Virtual WAN User VPN point-to-site (P2S) VPN and **Certificate authentication** from an Ubuntu Linux client using strongSwan.

## Before you begin

Verify that you are on the correct article. The following table shows the configuration articles available for Azure Virtual WAN P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [P2S client configuration articles](../../includes/virtual-wan-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you completed the following prerequisites:

* You configured a virtual WAN according to the steps in the [Create a User VPN point-to-site connection](virtual-wan-point-to-site-portal.md) article. Your User VPN configuration must use certificate authentication and the IKEv2 tunnel type.
* You generated and downloaded the VPN client configuration files. For steps to generate a VPN client profile configuration package, see [Generate VPN client configuration files](virtual-wan-point-to-site-portal.md#download).
* You have permissions to either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

[!INCLUDE [Connection](../../includes/vpn-gateway-vwan-client-certificate-linux-ike.md)]

## Next steps

For additional steps, return to the [Create a Virtual WAN P2S User VPN connection](virtual-wan-point-to-site-portal.md) article.