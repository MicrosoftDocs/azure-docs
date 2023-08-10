---
title: DNS names and connection strings - Azure Cosmos DB for PostgreSQL
description: Connection strings and DNS names for the nodes.
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 06/04/2023
---

# Node DNS names in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

When an Azure Cosmos DB for PostgreSQL [cluster](./concepts-cluster.md) is provisioned, every node is assigned its own [fully qualified domain name (FQDN)](https://wikipedia.org/wiki/Fully_qualified_domain_name). This FQDN is used to connect to each node provided proper [network security](./concepts-security-overview.md) was set up to grant access. The FQDN is used in the Postgres connection string whether private or public access is used. 

## Domain names in Azure Cosmos DB for PostgreSQL

All node domain names in Azure Cosmos DB for PostgreSQL are created in postgres.cosmos.azure.com domain. A node's FQDN is created in the following format

```
<node-qualifier>-<cluster-name>.<uniqueID>.postgres.cosmos.azure.com
```

where `node-qualifier` can be 'c' for coordinator or 'w0', 'w1', etc. for worker nodes; `cluster-name` is the name for the cluster you selected during cluster provisioning; `uniqueID` is a randomly generated globally unique 14-character identifier.

For instance: c-mycluster.12345678901234.postgres.cosmos.azure.com.

This FQDN is resolved into a public IP for each node in the cluster. If [public access](./concepts-firewall-rules.md) is enabled on the cluster, this FQDN is used in the Postgres connection string to connect to a node. 

When you enable [private access](./concepts-private-access.md) on the cluster, Azure creates a private DNS zone for each cluster. FQDN for each node with a private endpoint is created in this private DNS zone in addition to its primary FQDN. FQDN in this private DNS zone uses the following format

```
<node-qualifier>-<cluster-name>.<uniqueID>.privatelink.postgres.cosmos.azure.com
```

where `node-qualifier` can be 'c' for coordinator or 'w0', 'w1', etc. for worker nodes; `cluster-name` is the name for the cluster you selected during cluster provisioning; `uniqueID` is a randomly generated globally unique 14-character identifier.

For instance: c-mycluster.12345678901234.privatelink.postgres.cosmos.azure.com.

`node-qualifier`-`cluster-name`.`uniqueID`.postgres.cosmos.azure.com FQDN can be used from within a virtual network (VNet) environment too. If DNS name resolution is performed from within a VNet, FQDN resolves into a private IP assigned to a node via a private endpoint. If DNS name resolution is done from the public Internet, FQDN resolves into a public IP assigned to that node.

It's important to use only FQDN to access a node as assigned public IP addresses may change during normal operations such as an HA failover or compute scaling operation.

> [!IMPORTANT]
>
> Azure Cosmos DB for PostgreSQL clusters created before June 6th, 2023 use the following legacy domain name and FQDN format:
>
> Primary FQDN format: `node-qualifier`.`cluster-name`.postgres.database.azure.com 
> FQDN in a private DNS zone: `node-qualifier`.privatelink.`cluster-name`.postgres.database.azure.com
>
> where `node-qualifier` is 'c' for coordinator and 'w0', 'w1', etc. for worker nodes and 
> `cluster-name` is the name for the cluster you selected during cluster provisioning.

## Next steps

* See guidance on how to [connect to a cluster with psql](./quickstart-connect-psql.md).
* Review [public and private access fundamentals](./concepts-security-overview.md).
