---
title: High availability in Azure Managed Grafana Preview
description: Learn about high availability options provided by Azure Managed Grafana Preview
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: conceptual
ms.date: 6/18/2022 
---

# High availability in Azure Managed Grafana Preview

An Azure Managed Grafana Preview instance in the Standard tier is hosted on a dedicated set of virtual machines (VMs). By default, two VMs are deployed to provide redundancy. Each VM runs a Grafana server. A network load balancer distributes browser requests amongst the Grafana servers. On the backend, the Grafana servers are connected to a shared database that stores the configuration and other persistent data for an entire Managed Grafana instance.

:::image type="content" source="media/high-availability/high-availability.png" alt-text="Diagram of the Managed Grafana Standard tier instance setup.":::

The load balancer always keeps track of which Grafana servers are available. In a dual-server setup, if it detects that one server is down, the load balancer starts sending all requests to the remaining server. That server should be able to pick up the browser sessions previously served by the other one based on information saved in the shared database. In the meantime, the Managed Grafana service will work to repair the unhealthy server or bring up a new one.

## Zone redundancy

Normally the network load balancer, VMs and database that underpin a Managed Grafana instance are located within one Azure datacenter. The Managed Grafana Standard tier supports *zone redundancy*, which provides protection against zonal outages. When the zone redundancy option is selected, the VMs are spread across [availability zones](../availability-zones/az-overview.md#availability-zones) and other resources with availability zone enabled.

> [!NOTE]
> Zone redundancy can only be enabled when creating the Managed Grafana instance, and can't be modified subsequently. There's also an additional charge for using the zone redundancy option. Go to [Azure Managed Grafana pricing](https://azure.microsoft.com/pricing/details/managed-grafana/) for details.

In a zone-wide outage, no user action is required. An impacted Managed Grafana instance will rebalance itself to take advantage of the healthy zone automatically. The Managed Grafana service will attempt to heal the affected instances during zone recovery.

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure Managed Grafana Preview instance](./quickstart-managed-grafana-portal.md)