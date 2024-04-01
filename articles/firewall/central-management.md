---
title: Azure Firewall central management
description: Learn about Azure Firewall Manager central management
author: vhorne
ms.service: firewall
services: firewall
ms.topic: conceptual
ms.date: 07/13/2020
ms.author: victorh
---

# Azure Firewall central management

If you manage multiple firewalls, you know that continuously changing firewall rules make it difficult to keep them in sync. Central IT teams need a way to define base firewall policies and enforce them across multiple business units. At the same time, DevOps teams want to create their own local derived firewall policies for better agility.

Azure Firewall Manager can help solve these problems.


## Azure Firewall Manager

Azure Firewall Manager is a network security management service that provides central security policy and route management for cloud-based security perimeters. It makes it easy for Enterprise IT teams to centrally define network and application level rules for traffic filtering across multiple Azure Firewall instances. You can span different Azure regions and subscriptions in hub and spoke architectures for traffic governance and protection. It also provides DevOps better agility with derived local firewall security policies that are implemented across organizations.

### Firewall policy

A Firewall policy is an Azure resource that contains NAT, network, and application rule collections and Threat Intelligence settings. It's a global resource that can be used across multiple Azure Firewall instances in *Secured Virtual Hubs* and *Hub Virtual Networks*. New policies can be created from scratch or inherited from existing policies. Inheritance allows DevOps to create local firewall policies on top of organization mandated base policy. Policies work across regions and subscriptions.
 
You can create Firewall Policy and associations with Azure Firewall Manager. However, you can also create and manage a policy using REST API, templates, Azure PowerShell, and CLI. Once you create a policy, you can  associate it with a firewall in a virtual WAN hub making it a *Secured Virtual Hub* and/or a firewall in a virtual network making it *Hub Virtual Network*.

### Pricing

Policies are billed based on firewall associations. A policy with zero or one firewall association is free of charge. A policy with multiple firewall associations is billed at a fixed rate. For more information, see [Azure Firewall Manager Pricing](https://azure.microsoft.com/pricing/details/firewall-manager/).

## Azure Firewall Management partners

The following leading third-party solutions support Azure Firewall central management using standard Azure REST APIs. Each of these solutions has its own unique characteristics and features:

- [AlgoSec CloudFlow](https://www.algosec.com/azure/) 
- [Barracuda Cloud Security Guardian](https://app.barracuda.com/products/cloudsecurityguardian/for_azure)
- [Tufin Orca](https://www.tufin.com/products/tufin-orca)


## Next steps

For more information about Azure Firewall Manager, see [What is Azure Firewall Manager?](../firewall-manager/overview.md)
