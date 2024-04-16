---
title: "Connector: Azure Modeling and Simulation Workbench"
description: Overview of how the Azure Modeling and Simulation Workbench implements connectors.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
#Customer intent: As a Modeling and Simulation Workbench user, I want to understand the connector component.
---

# Connector: Azure Modeling and Simulation Workbench

Connectors are used to define and configure the network access between an organization's on-premises or cloud environment into the Azure Modeling and Simulation Workbench chamber. The connector supports protocols established through VPN, Azure Express Route, or network Access Control Lists.

## VPN or Azure Express Route

For organizations who have an Azure network setup to manage access for their employees, they can have strict controls of the virtual network subnet addresses used for connecting into the chamber. At creation time of the connector, the Chamber Admin or Workbench Owner can connect a virtual network subnet with VPN gateway or ExpressRoute gateway to establish a secure connection from your on-premises network to the chamber. The subnet selection should be a non gateway subnet within the same virtual network with the gateway subnet for VPN gateway or ExpressRoute gateway.

## Allowlisted Public IP addresses

For those organizations who don't have an Azure network setup, or prefer to use the public network, they can configure their connector to allow access to the chamber via allowlisted Public IP addresses. The connector object allows the allowed IP list to be configured at creation time or added or removed dynamically after the connector object is created.

## Next steps

- [Data pipeline](./concept-data-pipeline.md)
