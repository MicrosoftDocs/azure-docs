---
title: How to enable the Private access profile
description: Learn how to enable the Private access traffic forwarding profile for Microsoft Entra Private Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/01/2023
ms.service: network-access
ms.custom: 
---

# How to enable the Private access profile

The **Private access profile** looks at traffic going to your organization's private, internal applications and sites. Your [Quick access groups](how-to-configure-quick-access.md) define the apps and sites that make up your Private access profile.

Quick access groups are similar to the M365 traffic policies, except the IP addresses and FQDNs in the M365 profile are predefined. Quick access groups allow you to create your own collection of fully qualified domain names (FQDN), IP addresses, and IP address ranges. Just like with the M365 profile, you can also apply a Conditional Access policy or assign the profile to specific remote network.

## Private access traffic forwarding profile

To enable the Private access traffic forwarding profile, you must first configure Quick access. Quick access includes the IP addresses, IP ranges, and fully qualified domain names (FQDN) for the private applications and destinations you want to include in the policy. For more information, see [Configure Quick access](how-to-configure-quick-access.md).

> [!IMPORTANT]
> At this time, remote networks can't be assigned and Conditional Access policies can't be applied to the Private access traffic forwarding profile.

Because remote networks can't be assigned to the Private access traffic forwarding profile, you must install the Global Secure Access client on your end-user devices. For more information, see [How to install the Windows client](how-to-install-windows-client.md).

## Next steps

- [Configure Quick access](how-to-configure-quick-access.md)
- [Learn about traffic forwarding](concept-traffic-forwarding.md)