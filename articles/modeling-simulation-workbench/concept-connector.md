---
title: "Connectors in Azure Modeling and Simulation Workbench"
description: Overview of how the Azure Modeling and Simulation Workbench implements connectors.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023

#Customer intent: As a Modeling and Simulation Workbench user, I want to understand the Connector component.
---
# Connectors in Azure Modeling and Simulation Workbench

Connectors define the network access method between users and the Azure Modeling and Simulation Workbench Chamber. Connectors support connectivity through allowlisted public IPs, VPN, or Azure ExpressRoute.  A Chamber can have only one Connector configured at a time.  Connectors also configure copy-paste functionality into Chamber VMs. Connector types are immutable and once created cannot be changed to another access model. Connectors are part of the Idle mode setting to reduce cost.

## Public IP access via allowlist

For organizations who don't have an existing Azure network or prefer to access Chambers without establishing a VPN, a Connector can be created to allow access to the Chamber via allowlisted public IP addresses. The allowlist uses CIDR notation to more conveniently manage access from large network ranges. Only IPs listed in the allowlist are able to make connections to its associated Chamber.

## Private Azure networking

A Connector can be created for private network access from Azure virtual networks. This method is best suited for organizations which have a private, dedicated ExpressRoute connection to an Azure data center; have existing network presence in Azure; have security monitoring or compliance requirements provided by other Azure services; or will use point-to-site or site-to-site VPN connectivity to the Modeling and Simulation Workbench.

### VPN

A VPN Connector can be created which deploys infrastructure specifically for VPN access. The VPN Connector is required if the Chamber will be accessed through a point-to-site or site-to-site VPN.

### Azure ExpressRoute

[Azure ExpressRoute](/azure/expressroute/expressroute-introduction) provides secure, dedicated, encrypted connectivity from on-premise to an Azure landing zone. A Workbench Owner must create a Connector expressly for ExpressRoute, providing the necessary virtual network, supporting network infrastructure and peer the appropriate vnets.

## Next steps

- [Create a Connector](./how-to-guide-set-up-networking.md)
