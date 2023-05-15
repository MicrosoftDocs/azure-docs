---
title: How to define quick access ranges
description: Learn how to define quick access ranges for Entra Global Secure Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 05/15/2023
ms.service: network-access
ms.custom: 

---
# How to define quick access ranges for Global Secure Access

With Microsoft Entra Global Secure Access, you can define specific websites or IP addresses to include in the traffic for Microsoft Entra Private Access. After setting up Quick access ranges, you can specify which Quick access ranges are allowed for a particular branch. You must set up the Quick Access ranges before setting up any traffic forwarding rules.

Your organizations employees can access the apps and sites that you add to a Quick access group from their My Apps page.

## Prerequisites

To define Quick Access ranges, you must have:

- An Azure AD Premium P1/P2 license.
- A role with **Global Administrator** access.

## How to define Quick Access ranges

1. Sign into the Microsoft Entra admin center using one of the defined roles.
1. Go to **Global secure access** > **Applications** > **Enterprise applications** > **Quick access**.
1. Provide a name for the Quick Access group.
1. Select a Connector Group from the list.
	- Connectors must be set up before creating Quick access groups.
	- With Connectors, you can isolate apps per network and connector.
1. Select **+ Add quick access range**.
1. In the **Create forwarding rule** panel that opens, select a **Destination type**: You can choose an IP address, a fully qualified domain name, an IP address range (CIDR), or an IP address range (IP to IP). Depending on what you select, the subsequent field changes accordingly.
1. Enter the appropriate detail (fully qualified domain name, IP address, or IP address range).
1. Enter the port. 

## Next steps

- [Learn about traffic management profiles](how-to-configure-traffic-forwarding.md)
