---
title: Introduction to Azure Managed Instance for Apache Cassandra
description: Learn about Azure Managed Instance for Apache Cassandra. Built by the Azure Cosmos DB team, this service manages deployment and scaling of native open source instances of Apache Cassandra in Azure. 
author: TheovanKraay
ms.author: thvankra
ms.service: cassandra-managed-instance
ms.topic: overview
ms.date: 01/18/2021

---

# Welcome to Azure Managed Instance for Apache Cassandra

The service provides automated deployment and scaling operations for managed open source Apache Cassandra datacenters, accelerating hybrid scenarios and reducing ongoing maintenance. Delivered by the Azure Cosmos DB team, this service will also have deep integration and data movement capabilities with [Azure Cosmos DB Cassandra API](https://docs.microsoft.com/azure/cosmos-db/cassandra-introduction) upon it's general release.

:::image type="content" source="./media/introduction/icon.gif" alt-text="Azure Managed Instance for Apache Cassandra is a managed service for Apache Cassandra." border="false":::
<!-- ![Azure Managed Instance for Apache Cassandra is a managed service for Apache Cassandra.](./media/introduction/icon.gif) -->

## Key Benefits

### Hybrid Deployments

You can use the service to easily inject managed instances of Apache Cassandra datacenters (deployed automatically as VM scale sets), into your existing Azure VNET, or even connect to your on-premises Apache Cassandra cluster via [Azure ExpressRoute](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/expressroute).

- Simplified deployment (once hybrid connectivity is established through gossip protocol).
- Hosted metrics in [Prometheus](https://prometheus.io/docs/introduction/overview/) to monitor activity across your cluster.

### Simplified Scaling

Azure Managed Instance for Apache Cassandra provides a scaling orchestrator which simplifies the process of adding and commissioning new nodes to a data center and establishing their proper operation within any Apache Cassandra cluster ring.


### Managed and cost-effective

The services provides management operations for the following common Apache Cassandra tasks:

- Provisioning a cluster
- Provisioning a datacenter
- Scaling a datacenter
- Deleting a datacenter
- Initiate a repair action on a keyspace
- Changing configuration of a datacenter
- Setting up backups
- Maintaining audit logs

Our flexible, on-demand, instance-based pricing model (with no licensing fees) allows you to adjust to your specific workloads needs, by defining number of cores, VM SKU, and memory/disk space.

## Next steps

Get started with with one of our quickstarts:

- [Get started](quickstart.md)
