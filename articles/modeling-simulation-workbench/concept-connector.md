---
title: Azure Modeling and Simulation Workbench connector
description: Overview of how the Azure Modeling and Simulation Workbench implements connectors.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
#Customer intent: As a Modeling and Simulation Workbench user, I want to understand the connector component.
---

# Azure Modeling and Simulation Workbench connector

Connectors are used to define and configure the network access between an organization's on-premises or cloud environment into the Azure Modeling and Simulation Workbench chamber. The connector supports protocols established through VPN, Azure Express Route, or network Access Control Lists.

## VNet

For organizations who have an Azure network setup to manage access for their employees, they can have strict controls of the VNet and Subnet addresses used for connecting into the chamber. At creation time of the connector, the Workbench Owner (Subscription Owner) can connect a virtual network with VPN gateway and/or ExpressRoute gateway to establish a secure connection from your on-premises network to the chamber. The VNet selection can be dynamically configured to disconnect or connect to a different virtual network.

## Network Access Control Lists

For those organizations who don't have an Azure network setup, or prefer to use the public network, they can configure their connector to allow access to the chamber via Network Access Control Lists (ACLs). The connector object allows the allowed IP list to be configured at creation time or added or removed dynamically after the connector object is created.

## Next steps

- [What's next - Data Pipeline](./concept-datapipeline.md)

Choose an article to know more:

- [Workbench](./concept-workbench.md)

- [Chamber](./concept-chamber.md)
