---
title: Azure Managed Grafana service reliability 
description: Learn about service reliability and availability options provided by Azure Managed Grafana for workspaces in the Standard plan.
author: maud-lv 
ms.author: malev 
ms.service: azure-managed-grafana
ms.topic: concept-article
ms.date: 05/18/2025
ms.custom: references_regions, engagement-fy23
#customer intent: As an IT professional who uses Azure Managed Grafana, I want to understand the service reliability features of the Standard plan. 
---

# Azure Managed Grafana service reliability

This article provides information on availability zone support, disaster recovery, and availability of Azure Managed Grafana for workspaces in the Standard plan. The Essential plan (preview) doesn't offer the same reliability options. We don't recommend that plan for production.

An Azure Managed Grafana workspace in the Standard tier is hosted on a dedicated set of virtual machines. By default, two virtual machines are deployed to provide redundancy. Each virtual machine runs a Grafana server. A network load balancer distributes browser requests among the Grafana servers. On the backend, the Grafana servers are connected to a common database that stores the configuration and other persistent data for an entire Azure Managed Grafana workspace.

:::image type="content" source="media/service-reliability/diagram.png" alt-text="Diagram of the Azure Managed Grafana Standard tier workspace setup.":::

The load balancer keeps track of which Grafana servers are available. In a dual-server setup, if it detects that one server is down, the load balancer sends all requests to the remaining server. That server should be able to pick up the browser sessions previously served by the other one based on information saved in the shared database. In the meantime, the Azure Managed Grafana service works to repair the unhealthy server or bring up a new one.

Microsoft doesn't provide or set up disaster recovery for this service. If there's a region level outage, the service experiences downtime. You can set up workspaces in other regions for disaster recovery purposes.

## Zone redundancy

The network load balancer, virtual machines, and database that underpin an Azure Managed Grafana workspace are located in a region based on system resource availability. These resources could end up being in a same Azure datacenter.

### With zone redundancy enabled

When the zone redundancy option is enabled, virtual machines are spread across [availability zones](/azure/reliability/availability-zones-overview). Other resources, such as the network load balancer and database, are also configured for availability zones.

In a zone-wide outage, no user action is required. An impacted Azure Managed Grafana workspace rebalances itself to take advantage of the healthy zone automatically. The Azure Managed Grafana service attempts to heal the affected workspaces during zone recovery.

> [!NOTE]
> You can enable zone redundancy only when you create the Azure Managed Grafana workspace. You can't modify it later. The zone redundancy option comes at an extra cost. See [Azure Managed Grafana pricing](https://azure.microsoft.com/pricing/details/managed-grafana/).

### With zone redundancy disabled

Zone redundancy is disabled in the Azure Managed Grafana Standard tier by default. In this scenario, virtual machines are created as single-region resources. Because the virtual machines can go down at the same time, they shouldn't be expected to survive zone-downs scenarios.

## Supported regions

Zone redundancy support is enabled in the following regions:

| Americas         | Europe            | Africa            | Asia Pacific      |
|------------------|-------------------|-------------------|-------------------|
| East US          | North Europe      |                   | Australia East    |
| South Central US |                   |                   | East Asia         |
| West US 3        |                   |                   |                   |

For regions where Azure Managed Grafana is available, see [Products available by region - Azure Managed Grafana](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=managed-grafana&regions=all).

## Next step

> [!div class="nextstepaction"]
> [Enable zone redundancy](./how-to-enable-zone-redundancy.md)
