---
title: About Gateway Root Certificate Migration and P2S User VPN Profile Updates
titleSuffix: Azure Virtual WAN
description: Learn about certificate migration for VPN gateways and how it affects point-to-site User VPN client connection profiles.
author: duongau
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 06/08/2026
ms.author: duau
# Customer intent: "I want to understand more about root certificate migration for Azure Virtual WAN and how it impacts my point-to-site VPN client profiles, so I can be prepared to take necessary actions to maintain connectivity."
---
# About gateway root certificate migration and P2S User VPN profile updates

Azure periodically rotates the root certificates that Virtual WAN VPN gateways use for point-to-site (P2S) User VPN connections. **Root certificate migration** (also called *root certificate rotation*) is the scheduled process of transitioning a VPN gateway from an old root certificate to a new one. Microsoft provides advance notice before each migration.

> [!IMPORTANT]
> This change affects all P2S User VPN clients, not just clients that use certificate authentication.

During a migration, the Virtual WAN VPN gateway updates its server certificate to one that's signed by the new root certificate. The gateway has both the old and new certificates attached for a transition period. On the migration deadline date, the old certificate is removed and only the new certificate is valid for client connections.

To maintain connectivity, you must [generate and redistribute](../vpn-gateway/point-to-site-user-vpn-profile-update.md) updated P2S User VPN client profiles so that clients have the new root certificate information. After the migration deadline, clients with profiles that contain only the old certificate information can't connect.

The following FAQ sections help you determine whether you're affected, what actions to take, and where to find instructions for updating P2S User VPN client profiles.

## FAQ

[!INCLUDE [Gateway Certificate migration FAQ](../../includes/vpn-gateway-server-certificate-migration-faq.md)]

## Next steps

[How to update P2S User VPN client profiles](../vpn-gateway/point-to-site-user-vpn-profile-update.md)
