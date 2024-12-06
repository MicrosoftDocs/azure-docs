---
title: "Connectors: Azure Modeling and Simulation Workbench"
description: Connector implementation in Azure Modeling and Simulation Workbench.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: azure-modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023

#Customer intent: As a Modeling and Simulation Workbench user, I want to understand the component.
---
# Connectors in Azure Modeling and Simulation Workbench

Connectors define the network access method between users and the Azure Modeling and Simulation Workbench chamber. Connectors support connectivity through allowlisted public IPs, VPN, or Azure ExpressRoute. A chamber can have only one connector configured at a time. Connectors also configure copy-paste functionality for all workload VMs in the chamber. Connector types are immutable and once created can't be changed to another access model. Connectors are part of the Idle mode setting that reduce cost.

## Public IP access via allowlist

The Workbench can be built to allow users to connect directly from the internet, allowing flexible, open access. When a Public IP Connection is built, connections are permitted using an allowlist. The allowlist uses CIDR (Classless Interdomain Routing) notation to conveniently manage access from large network ranges, such as conference centers or corporate exit nodes. Only IPs listed in the allowlist are able to make connections to its associated chamber.

## Private Azure networking

A connector can be created for private network access from Azure virtual networks. This method is best suited where a private or controlled connection is required. Azure ExpressRoutes provide a dedicated connection from an on-premises infrastructure to an Azure data center and can be peered to the Workbench. With a VPN gateway, the Workbench can use a private network with extra encryption layers.

### VPN

A VPN connector can be created which deploys infrastructure specifically for VPN access. The VPN connector is required if the chamber is accessed through a point-to-site or site-to-site VPN.

### Azure ExpressRoute

[Azure ExpressRoute](/azure/expressroute/expressroute-introduction) provides secure, dedicated, encrypted connectivity from on-premises to an Azure landing zone. A Workbench Owner must create a connector expressly for ExpressRoute, providing the necessary virtual network, supporting network infrastructure, and peer the appropriate vnets.

## Resources

* [Create a public connector](./how-to-guide-public-network.md)
* [Create a private network connector](./how-to-guide-private-network.md)
