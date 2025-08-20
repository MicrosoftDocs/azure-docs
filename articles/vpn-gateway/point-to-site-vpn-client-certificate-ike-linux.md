---
title: 'Configure P2S VPN clients - certificate authentication IKEv2 - Linux'
titleSuffix: Azure VPN Gateway
description: Learn how to configure an Ubuntu Linux strongSwan VPN client solution for VPN Gateway P2S configurations that use certificate authentication.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 02/12/2025
ms.author: cherylmc
# Customer intent: "As a network administrator using Ubuntu Linux, I want to configure a strongSwan VPN client for Azure's P2S connections with certificate authentication, so that I can securely connect to the Azure virtual network."
---

# Configure strongSwan VPN for P2S certificate authentication IKEv2 connections - Linux

This article helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) VPN and **Certificate authentication** from an Ubuntu Linux client using strongSwan.

## Before you begin

Before beginning, verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* The VPN gateway is configured for point-to-site certificate authentication and the IKEv2 tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](point-to-site-certificate-gateway.md) for steps.
* VPN client profile configuration files have been generated and are available. See [Generate VPN client profile configuration files](point-to-site-certificate-gateway.md#profile-files) for steps.

[!INCLUDE [Connection](../../includes/vpn-gateway-vwan-client-certificate-linux-ike.md)]

## Next steps

For more steps, return to the [P2S Azure portal](point-to-site-certificate-gateway.md) article.
