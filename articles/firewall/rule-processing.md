---
title: Azure Firewall rule processing logic
description: Learn about Azure Firewall rule processing logic
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 9/27/2018
ms.author: victorh
---

# Azure Firewall rule processing logic
Azure Firewall has NAT rules, network rules, and applications rules. The rules are processed according to the rule type.


## Network rules and applications rules 
Network rules are applied first, then application rules. The rules are terminating. So if a match is found in network rules, then application rules are not processed.  If there is no network rule match, and if the packet protocol is HTTP/HTTPS, the packet is then evaluated by the application rules. If still no match is found, then the packet is evaluated against the infrastructure rule collection. If there is still no match, then the packet is denied by default.

## NAT rules
Inbound connectivity can be enabled by configuring Destination Network Address Translation (DNAT) as described in [Tutorial: Filter inbound traffic with Azure Firewall DNAT using the Azure portal](tutorial-firewall-dnat.md). DNAT rules are applied first. If a match is found, an implicit corresponding network rule to allow the translated traffic is added. You can override this behavior by explicitly adding a network rule collection with deny rules that match the translated traffic. No application rules are applied for these connections.


## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).