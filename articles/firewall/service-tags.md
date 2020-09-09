---
title: Overview of Azure Firewall service tags
description: A service tag represents a group of IP address prefixes to help minimize complexity for security rule creation.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 11/19/2019
ms.author: victorh
---

# Azure Firewall service tags

A service tag represents a group of IP address prefixes to help minimize complexity for security rule creation. You cannot create your own service tag, nor specify which IP addresses are included within a tag. Microsoft manages the address prefixes encompassed by the service tag, and automatically updates the service tag as addresses change.

Azure Firewall service tags can be used in the network rules destination field. You can use them in place of specific IP addresses.

## Supported service tags

See [Security groups](../virtual-network/security-overview.md#service-tags) for a list of service tags that are available for use in Azure firewall network rules.

## Next steps

To learn more about Azure Firewall rules, see [Azure Firewall rule processing logic](rule-processing.md).