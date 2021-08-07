---
title: Azure SQL Database Connectivity Architecture 
description: This document explains the Azure SQL Database connectivity architecture for database connections from within Azure or from outside of Azure.
services: sql-database
ms.service: sql-database
ms.subservice: connect
ms.custom: fasttrack-edit, sqldbrb=1 
titleSuffix: Azure SQL Database and Azure Synapse Analytics
ms.devlang: 
ms.topic: conceptual
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: mathoma, vanto
ms.date: 01/25/2021
---
# Azure SQL Database and Azure Synapse Analytics connectivity architecture
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]

This article explains architecture of various components that direct network traffic to a server in Azure SQL Database or Azure Synapse Analytics. It also explains different connection policies and how it impacts clients connecting from within Azure and clients connecting from outside of Azure.

> [!IMPORTANT]
> This article does *not* apply to **Azure SQL Managed Instance**. Refer to [Connectivity architecture for a managed instance](../managed-instance/connectivity-architecture-overview.md).

## Connectivity architecture

The following diagram provides a high-level overview of the connectivity architecture.

![Diagram that shows a high-level overview of the connectivity architecture.](./media/connectivity-architecture/connectivity-overview.png)

The following steps describe how a connection is established to Azure SQL Database:

- Clients connect to the gateway, that has a public IP address and listens on port 1433.
- The gateway, depending on the effective connection policy, redirects or proxies the traffic to the right database cluster.
- Inside the database cluster traffic is forwarded to the appropriate database.

## Connection policy

Servers in SQL Database and Azure Synapse support the following three options for the server's connection policy setting:

- **Redirect (recommended):** Clients establish connections directly to the node hosting the database, leading to reduced latency and improved throughput. For connections to use this mode, clients need to:
  - Allow outbound communication from the client to all Azure SQL IP addresses in the region on ports in the range of 11000 to 11999. Use the Service Tags for SQL to make this easier to manage.  
  - Allow outbound communication from the client to Azure SQL Database gateway IP addresses on port 1433.

- **Proxy:** In this mode, all connections are proxied via the Azure SQL Database gateways, leading to increased latency and reduced throughput. For connections to use this mode, clients need to allow outbound communication from the client to Azure SQL Database gateway IP addresses on port 1433.

- **Default:** This is the connection policy in effect on all servers after creation unless you explicitly alter the connection policy to either `Proxy` or `Redirect`. The default policy is`Redirect` for all client connections originating inside of Azure (for example, from an Azure Virtual Machine) and `Proxy`for all client connections originating outside (for example, connections from your local workstation).

We highly recommend the `Redirect` connection policy over the `Proxy` connection policy for the lowest latency and highest throughput. However, you will need to meet the additional requirements for allowing network traffic as outlined above. If the client is an Azure Virtual Machine you can accomplish this using Network Security Groups (NSG) with [service tags](../../virtual-network/network-security-groups-overview.md#service-tags). If the client is connecting from a workstation on-premises then you may need to work with your network admin to allow network traffic through your corporate firewall.

## Connectivity from within Azure

If you are connecting from within Azure your connections have a connection policy of `Redirect` by default. A policy of `Redirect` means that after the TCP session is established to Azure SQL Database, the client session is then redirected to the right database cluster with a change to the destination virtual IP from that of the Azure SQL Database gateway to that of the cluster. Thereafter, all subsequent packets flow directly to the cluster, bypassing the Azure SQL Database gateway. The following diagram illustrates this traffic flow.

![architecture overview](./media/connectivity-architecture/connectivity-azure.png)

## Connectivity from outside of Azure

If you are connecting from outside Azure, your connections have a connection policy of `Proxy` by default. A policy of `Proxy` means that the TCP session is established via the Azure SQL Database gateway and all subsequent packets flow via the gateway. The following diagram illustrates this traffic flow.

![Diagram that shows how the TCP session is established via the Azure SQL Database gateway and all subsequent packets flow via the gateway.](./media/connectivity-architecture/connectivity-onprem.png)

> [!IMPORTANT]
> Additionally open TCP ports 1434 and 14000-14999 to enable [Connecting with DAC](/sql/database-engine/configure-windows/diagnostic-connection-for-database-administrators#connecting-with-dac)

## Gateway IP addresses

The table below lists the individual Gateway IP addresses and also Gateway IP address ranges per region.

Periodically, we will retire Gateways using old hardware and migrate the traffic to new Gateways as per the process outlined at [Azure SQL Database traffic migration to newer Gateways](gateway-migration.md). We strongly encourage customers to use the **Gateway IP address subnets** in order to not be impacted by this activity in a region.

> [!IMPORTANT]
> Logins for SQL Database or Azure Synapse can land on **any of the Gateways in a region**. For consistent connectivity to SQL Database or Azure Synapse,  allow network traffic to and from **ALL** Gateway IP addresses and Gateway IP address subnets for the region.

| Region name          | Gateway IP addresses | Gateway IP address subnets |
| --- | --- | --- |
| Australia Central    | 20.36.105.0, 20.36.104.6, 20.36.104.7 | 20.36.105.32/29 |
| Australia Central 2   | 20.36.113.0, 20.36.112.6 | 20.36.113.32/29 |
| Australia East       | 13.75.149.87, 40.79.161.1, 13.70.112.9 | 13.70.112.32/29, 40.79.160.32/29, 40.79.168.32/29 |
| Australia Southeast | 191.239.192.109, 13.73.109.251, 13.77.48.10, 13.77.49.32 | 13.77.49.32/29 |
| Brazil South         | 191.233.200.14, 191.234.144.16, 191.234.152.3 | 191.233.200.32/29, 191.234.144.32/29 |
| Canada Central       | 40.85.224.249, 52.246.152.0, 20.38.144.1 | 13.71.168.32/29, 20.38.144.32/29, 52.246.152.32/29 |
| Canada East          | 40.86.226.166, 52.242.30.154, 40.69.105.9 , 40.69.105.10 | 40.69.105.32/29|
| Central US           | 13.67.215.62, 52.182.137.15, 104.208.21.1, 13.89.169.20 | 104.208.21.192/29, 13.89.168.192/29, 52.182.136.192/29 |
| China East           | 139.219.130.35 |  52.130.112.136/29 |
| China East 2         | 40.73.82.1 | 52.130.120.88/29 | 
| China North          | 139.219.15.17      | 52.130.128.88/29 |
| China North 2        | 40.73.50.0         | 52.130.40.64/29 |
| East Asia            | 52.175.33.150, 13.75.32.4, 13.75.32.14 | 13.75.32.192/29, 13.75.33.192/29 |
| East US              | 40.121.158.30, 40.79.153.12, 40.78.225.32 | 20.42.65.64/29, 20.42.73.0/29, 52.168.116.64/29 |
| East US 2            | 40.79.84.180, 52.177.185.181, 52.167.104.0,  191.239.224.107, 104.208.150.3,  40.70.144.193 | 104.208.150.192/29, 40.70.144.192/29, 52.167.104.192/29 |
| France Central       | 40.79.137.0, 40.79.129.1, 40.79.137.8, 40.79.145.12 | 40.79.136.32/29, 40.79.144.32/29 |
| France South         | 40.79.177.0, 40.79.177.10 ,40.79.177.12 | 40.79.176.40/29, 40.79.177.32/29 |
| Germany West Central | 51.116.240.0, 51.116.248.0, 51.116.152.0 | 51.116.152.32/29, 51.116.240.32/29, 51.116.248.32/29 |
| Central India        | 104.211.96.159, 104.211.86.30 , 104.211.86.31, 40.80.48.32, 20.192.96.32  | 104.211.86.32/29, 20.192.96.32/29 |
| South India          | 104.211.224.146    | 40.78.192.32/29, 40.78.193.32/29 |
| West India           | 104.211.160.80, 104.211.144.4 | 104.211.144.32/29, 104.211.145.32/29 |
| Japan East           | 13.78.61.196, 40.79.184.8, 13.78.106.224, 40.79.192.5, 13.78.104.32, 40.79.184.32 | 13.78.104.32/29, 40.79.184.32/29, 40.79.192.32/29 |
| Japan West           | 104.214.148.156, 40.74.100.192, 40.74.97.10 | 40.74.96.32/29 |
| Korea Central        | 52.231.32.42, 52.231.17.22 ,52.231.17.23, 20.44.24.32, 20.194.64.33 | 20.194.64.32/29,20.44.24.32/29, 52.231.16.32/29 |
| Korea South          | 52.231.200.86, 52.231.151.96 |  |
| North Central US     | 23.96.178.199, 23.98.55.75, 52.162.104.33, 52.162.105.9 | 52.162.105.192/29 |
| North Europe         | 40.113.93.91, 52.138.224.1, 13.74.104.113 | 13.69.233.136/29, 13.74.105.192/29, 52.138.229.72/29 |
| Norway East          | 51.120.96.0, 51.120.96.33, 51.120.104.32, 51.120.208.32 | 51.120.96.32/29 |
| Norway West          | 51.120.216.0       | 51.120.217.32/29 |
| South Africa North   | 102.133.152.0, 102.133.120.2, 102.133.152.32 | 102.133.120.32/29, 102.133.152.32/29, 102.133.248.32/29|
| South Africa West    | 102.133.24.0       | 102.133.25.32/29 |
| South Central US     | 13.66.62.124, 104.214.16.32, 20.45.121.1, 20.49.88.1 | 20.45.121.32/29, 20.49.88.32/29, 20.49.89.32/29, 40.124.64.136/29 |
| South East Asia      | 104.43.15.0, 40.78.232.3, 13.67.16.193 | 13.67.16.192/29, 23.98.80.192/29, 40.78.232.192/29|
| Switzerland North    | 51.107.56.0, 51.107.57.0 | 51.107.56.32/29 |
| Switzerland West     | 51.107.152.0, 51.107.153.0 | 51.107.153.32/29 |
| UAE Central          | 20.37.72.64        | 20.37.72.96/29, 20.37.73.96/29 |
| UAE North            | 65.52.248.0        | 40.120.72.32/29, 65.52.248.32/29 |
| UK South             | 51.140.184.11, 51.105.64.0, 51.140.144.36, 51.105.72.32 | 51.105.64.32/29, 51.105.72.32/29, 51.140.144.32/29 |
| UK West              | 51.141.8.11, 51.140.208.96, 51.140.208.97 | 51.140.208.96/29, 51.140.209.32/29 |
| West Central US      | 13.78.145.25, 13.78.248.43, 13.71.193.32, 13.71.193.33 | 13.71.193.32/29 |
| West Europe          | 40.68.37.158, 104.40.168.105, 52.236.184.163  | 104.40.169.32/29, 13.69.112.168/29, 52.236.184.32/29 |
| West US              | 104.42.238.205, 13.86.216.196   | 13.86.217.224/29 |
| West US 2            | 13.66.226.202, 40.78.240.8, 40.78.248.10  | 13.66.136.192/29, 40.78.240.192/29, 40.78.248.192/29 |
| West US 3            | 20.150.168.0, 20.150.184.2   | 20.150.168.32/29, 20.150.176.32/29, 20.150.184.32/29 |
|                      |                    |                    |

## Next steps

- For information on how to change the Azure SQL Database connection policy for a server, see [conn-policy](/cli/azure/sql/server/conn-policy).
- For information about Azure SQL Database connection behavior for clients that use ADO.NET 4.5 or a later version, see [Ports beyond 1433 for ADO.NET 4.5](adonet-v12-develop-direct-route-ports.md).
- For general application development overview information, see [SQL Database Application Development Overview](develop-overview.md).
