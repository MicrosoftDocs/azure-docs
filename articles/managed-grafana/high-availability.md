---
title: Azure Managed Grafana service reliability 
description: Learn about service reliability and availability options provided by Azure Managed Grafana
author: maud-lv 
ms.author: malev 
ms.service: azure-managed-grafana
ms.topic: conceptual
ms.date: 5/14/2024
ms.custom: references_regions, engagement-fy23
---

# Azure Managed Grafana service reliability

This article provides information on availability zone support, disaster recovery and availability of Azure Managed Grafana for workspaces in the Standard plan. The Essential plan (preview) doesn't offer the same reliability and isn't recommended for use in production.

An Azure Managed Grafana workspace in the Standard tier is hosted on a dedicated set of virtual machines (VMs). By default, two VMs are deployed to provide redundancy. Each VM runs a Grafana server. A network load balancer distributes browser requests amongst the Grafana servers. On the backend, the Grafana servers are connected to a common database that stores the configuration and other persistent data for an entire Azure Managed Grafana workspace.

:::image type="content" source="media/service-reliability/diagram.png" alt-text="Diagram of the Azure Managed Grafana Standard tier workspace setup.":::

The load balancer always keeps track of which Grafana servers are available. In a dual-server setup, if it detects that one server is down, the load balancer starts sending all requests to the remaining server. That server should be able to pick up the browser sessions previously served by the other one based on information saved in the shared database. In the meantime, the Azure Managed Grafana service will work to repair the unhealthy server or bring up a new one.

Microsoft is not providing or setting up disaster recovery for this service. In case of a region level outage, service will experience downtime and users can set up additional workspaces in other regions for disaster recovery purposes.

## Zone redundancy

The network load balancer, VMs and database that underpin an Azure Managed Grafana workspace are located in a region based on system resource availability, and could end up being in a same Azure datacenter.

### With zone redundancy enabled

When the zone redundancy option is enabled, VMs are spread across [availability zones](../reliability/availability-zones-overview.md). Other resources such as network load balancer and database are also configured for availability zones.

In a zone-wide outage, no user action is required. An impacted Azure Managed Grafana workspace will rebalance itself to take advantage of the healthy zone automatically. The Azure Managed Grafana service will attempt to heal the affected workspaces during zone recovery.

> [!NOTE]
> Zone redundancy can only be enabled when creating the Azure Managed Grafana workspace, and can't be modified subsequently. The zone redundancy option comes with an additional cost. Go to [Azure Managed Grafana pricing](https://azure.microsoft.com/pricing/details/managed-grafana/) for details.

### With zone redundancy disabled

Zone redundancy is disabled in the Azure Managed Grafana Standard tier by default. In this scenario, virtual machines are created as single-region resources and should not be expected to survive zone-downs scenarios as they can go down at same time.

## Supported regions

Zone redundancy support is enabled in the following regions:

| Americas         | Europe            | Africa            | Asia Pacific      |
|------------------|-------------------|-------------------|-------------------|
| East US          | North Europe      |                   | Australia East    |
| South Central US |                   |                   | East Asia         |
| West US 3        |                   |                   |                   |

For a complete list of regions where Azure Managed Grafana is available, see [Products available by region - Azure Managed Grafana](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=managed-grafana&regions=all)

## Next steps

> [!div class="nextstepaction"]
> [Enable zone redundancy](./how-to-enable-zone-redundancy.md)
