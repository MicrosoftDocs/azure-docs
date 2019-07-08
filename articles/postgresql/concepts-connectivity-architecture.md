---
title: Connectivity architecture in Azure Database for PostgreSQL
description: Describes the connectivity architecture for your Azure Database for PostgreSQL server.
author: kummanish
ms.author: manishku
ms.service: postgresql
ms.topic: conceptual
ms.date: 05/23/2019
---

# Connectivity architecture in Azure Database for PostgreSQL
This article explains the Azure Database for PostgreSQL connectivity architecture as well as how the traffic is directed to your Azure Database for PostgreSQL database instance from clients both within and outside Azure.

## Connectivity architecture
Connection to your Azure Database for PostgreSQL is established through a gateway that is responsible for routing incoming connections to the physical location of your server in our clusters. The following diagram illustrates the traffic flow.

![Overview of the connectivity architecture](./media/concepts-connectivity-architecture/connectivity-architecture-overview-proxy.png)

As client connect to the database, they get a connection string which connects to the gateway. This gateway has a public IP address that listens to port 5432. Inside the database clusterz traffic is forwarded to appropriate Azure Database for PostgreSQL. Therefore, in order to connect to your server, such as from corporate networks, it is necessary to open up the client side firewall to allow outbound traffic to be able to reach our gateways. Below you can find a complete list of the IP addresses used by our gateways per region.

## Azure Database for PostgreSQL gateway IP addresses
The following table lists the primary and secondary IPs of the Azure Database for PostgreSQL gateway for all data regions. The primary IP address is the current IP address of the gateway and the second IP address is a failover IP address in case of failure of the primary. As mentioned, customers should allow outbound to both the IP addresses. The second IP address does not listen in on any services until it is activated by Azure Database for PostgreSQL to accept connections.

| **Region Name** | **Primary IP Address** | **Secondary IP Address** |
|:----------------|:-------------|:------------------------|
| Australia East | 13.75.149.87 | 40.79.161.1 |
| Australia South East | 191.239.192.109 | 13.73.109.251 |
| Brazil South | 104.41.11.5 | |
| Canada Central | 40.85.224.249 | |
| Canada East | 40.86.226.166 | |
| Central US | 23.99.160.139 | 13.67.215.62 |
| China East 1 | 139.219.130.35 | |
| China East 2 | 40.73.82.1 | |
| China North 1 | 139.219.15.17 | |
| China North 2 | 40.73.50.0 | |
| East Asia | 191.234.2.139 | 52.175.33.150 |
| East US 1 | 191.238.6.43 | 40.121.158.30 |
| East US 2 | 191.239.224.107 | 40.79.84.180 * |
| France Central | 40.79.137.0 | 40.79.129.1 |
| Germany Central | 51.4.144.100 | |
| India Central | 104.211.96.159 | |
| India South | 104.211.224.146 | |
| India West | 104.211.160.80 | |
| Japan East | 191.237.240.43 | 13.78.61.196 |
| Japan West | 191.238.68.11 | 104.214.148.156 |
| Korea Central | 52.231.32.42 | |
| Korea South | 52.231.200.86 |  |
| North Central US | 23.98.55.75 | 23.96.178.199 |
| North Europe | 191.235.193.75 | 40.113.93.91 |
| South Central US | 23.98.162.75 | 13.66.62.124 |
| South East Asia | 23.100.117.95 | 104.43.15.0 |
| UK South | 51.140.184.11 | |
| UK West | 51.141.8.11| |
| West Europe | 191.237.232.75 | 40.68.37.158 |
| West US 1 | 23.99.34.75 | 104.42.238.205 |
| West US 2 | 13.66.226.202 | |
||||

> [!NOTE]
> *East US 2* has also a tertiary IP address of `52.167.104.0`.

## Next steps

* [Create and manage Azure Database for PostgreSQL firewall rules using the Azure portal](./howto-manage-firewall-using-portal.md)
* [Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI](./howto-manage-firewall-using-cli.md)
