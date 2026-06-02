---
title: 'Configure an Always-On VPN device tunnel for macOS'
titleSuffix: Azure VPN Gateway
description: Learn how to configure an Always On VPN device tunnel for your VPN gateway on macOS.
author: flapinski
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 02/02/2026
ms.author: flapinski

# Customer intent: As a network administrator, I want to configure an Always On VPN device tunnel, so that I can maintain persistent, secure connections for remote users without manual intervention.
---
# Configure an Always On VPN device tunnel for macOS

[!INCLUDE [intro](../../includes/vpn-gateway-vwan-always-on-intro.md)]

This article helps you configure an Always On VPN device tunnel for macOS. For information about configuring a device tunnel, see [Configure an Always On VPN device tunnel](vpn-gateway-howto-always-on-device-tunnel.md).

## Prerequisites
Note the following prerequisites for Always On VPN device tunnels on macOS:
 - The Azure VPN Client for macOS must be [version 3.0.100](azure-vpn-client-versions.md) or later.
 - Always On must be configured per profile - there's no default Always On profile.
 - Only one profile can have Always On enabled at a time.
 - Always On can only be enabled when the VPN connection is disconnected.
 - Disconnecting an Always On profile disables the Always On feature for that profile.

## Configure the gateway
Always On VPN device tunnels are supported for all authentication types for the Azure VPN Client for macOS.

This includes [certificate authentication](point-to-site-certificate-gateway.md) and [Microsoft Entra ID Authentication](point-to-site-entra-gateway.md).

## Configure a device tunnel

[!INCLUDE [device configuration](../../includes/vpn-gateway-vwan-always-on-device-macos.md)]

## To remove a profile

Use the following steps:
1. Open the Azure VPN Client for Mac.
1. Disconnect the connection, and clear the **Connect automatically** check box (this can also be managed in settings).

     :::image type="content" source="./media/point-to-site-macos-always-on/settings.png" alt-text="Diagram of user settings in Azure VPN Client." lightbox="./media/point-to-site-macos-always-on/settings.png":::
1. Open the '...' menu next to the profile name, and select **Remove**

## Next steps

To troubleshoot any connection issues that might occur, see [Azure point-to-site connection problems](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
