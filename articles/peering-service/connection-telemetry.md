---
title: Azure Peering Service (Preview) connection telemetry
description: Learn about Microsoft Azure Peering Service connection telemetry
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 11/04/2019
ms.author: v-meravi
---
# Peering Service (Preview) connection telemetry

Connection telemetry provides insights collected for the connectivity between the customer's location and the Microsoft network. Customers can obtain telemetry for Peering Service connection by registering the connection into the Azure portal. This feature provides prefix security, and insights into the network latency.

> [!IMPORTANT]
> "Peering Service” is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Preview Scope

Connection telemetry is composed of the following scopes:  

**Latency measurement**

Measures latency from the client to the Microsoft Edge PoP for the registered prefixes.

**Route (Prefix) monitoring and protection** 

Monitors routing path for any suspicious activity and captures the same in the event logs. For instance, event logs are created for some of the factors specified below: 

- Prefix hijacks

- Prefix withdrawal

- Route leak

## Next steps

To learn about Peering Service connection, see [Peering Service connection](connection.md).

To onboard Peering Service connection, see [Onboarding Peering Service model](onboarding-model.md).

To measure telemetry, see [Measure connection telemetry](measure-connection-telemetry.md).
