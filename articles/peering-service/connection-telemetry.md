---
title: Azure Peering Service Preview connection telemetry
description: Learn about Microsoft Azure Peering Service connection telemetry
services: peering-service
author: derekolo
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 11/04/2019
ms.author: derekol
---
# Peering Service Preview connection telemetry

Connection telemetry provides insights collected for the connectivity between the customer's location and the Microsoft network. Customers can obtain telemetry for Azure Peering Service connection by registering the connection in the Azure portal. This feature provides prefix security and insights into the network latency.

> [!IMPORTANT]
> Peering Service is currently in public preview.
> This preview version is provided without a service level agreement. We don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Preview scope

Connection telemetry is composed of the following scopes:

### Latency measurement

 Latency is measured from the client to the Microsoft edge PoP for the registered prefixes.

### Route prefix monitoring and protection

Routing paths are monitored for any suspicious activity that's then captured in event logs. For instance, event logs are created for some of these factors:

- Prefix hijacks
- Prefix withdrawal
- Route leaks

## Next steps

- To learn about Peering Service connection, see [Peering Service connection](connection.md).
- To onboard a Peering Service connection, see [Onboarding a Peering Service model](onboarding-model.md).
- To measure telemetry, see [Measure connection telemetry](measure-connection-telemetry.md).
