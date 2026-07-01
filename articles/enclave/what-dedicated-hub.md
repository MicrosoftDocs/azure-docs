---
title: What are dedicated hubs?
description: Learn how dedicated hubs provide customer-reserved hub capacity for Azure Enclave communities.
author: aserfass-msft
ms.author: aserfass
ms.topic: overview
ms.date: 06/30/2026
---

# What are dedicated hubs?

Dedicated hubs let an Azure Enclave community use customer-reserved hub capacity instead of pooled regional Azure Virtual WAN hub capacity. In simple terms, pooled hubs allow customers in a region to share hub capacity, whereas dedicated hubs can be reserved for one customer's own use. Dedicated hubs improve network isolation for customers who need stronger separation at the community hub layer.

Dedicated hubs don't change [transit hubs](./what-transit-hub.md). Transit hubs still provide secure connectivity between a community and external private networks. Dedicated hubs control whether the community uses reserved hub capacity or pooled regional hub capacity for the community's platform-managed hub resources.

## How dedicated hubs work

Azure Enclave uses platform-managed hub resources to support community networking, governance, and monitoring. Without dedicated hubs, a community can use pooled regional hub capacity provided by the service. With dedicated hubs, a customer can reserve dedicated hub capacity for communities that require stronger network isolation.

Dedicated hubs are community child resources. In Azure Resource Manager, dedicated hubs use the resource type `Microsoft.Mission/communities/dedicatedHubs`.

## Dedicated hub designation

A dedicated hub can use a designation to describe how the hub capacity is allocated:

- `Pooled` - The community uses pooled regional hub capacity managed by Azure Enclave.
- `Reserved` - The community uses customer-reserved dedicated hub capacity.

Use `Reserved` when your organization requires dedicated hub capacity for stronger network isolation.

## When to use dedicated hubs

Consider dedicated hubs when:

- Your organization requires stronger hub-level network isolation than pooled regional capacity provides.
- Your governance model requires customer-reserved platform-managed hub capacity.
- You need to separate community hub capacity for regulated or sensitive workloads.

## Related content

- [What is a community?](./what-community.md)
- [What is Azure Enclave?](./what-azure-enclave.md)
- [What is a transit hub?](./what-transit-hub.md)