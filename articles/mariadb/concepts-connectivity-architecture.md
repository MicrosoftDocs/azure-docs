---
title: Connectivity architecture - Azure Database for MariaDB
description: Describes the connectivity architecture for your Azure Database for MariaDB server.
author: Bashar-MSFT
ms.author: bahusse
ms.service: mariadb
ms.topic: conceptual
ms.date: 2/11/2021
---

# Connectivity architecture in Azure Database for MariaDB
This article explains the Azure Database for MariaDB connectivity architecture as well as how the traffic is directed to your Azure Database for MariaDB instance from clients both within and outside Azure.

## Connectivity architecture

Connection to your Azure Database for MariaDB is established through a gateway that is responsible for routing incoming connections to the physical location of your server in our clusters. The following diagram illustrates the traffic flow.

![Overview of the connectivity architecture](./media/concepts-connectivity-architecture/connectivity-architecture-overview-proxy.png)


As client connects to the database, the connection string to the server resolves to the gateway IP address. The gateway listens on the IP address on port 3306. Inside the database cluster, traffic is forwarded to appropriate Azure Database for MariaDB. Therefore, in order to connect to your server, such as from corporate networks, it is necessary to open up the **client-side firewall to allow outbound traffic to be able to reach our gateways**. Below you can find a complete list of the IP addresses used by our gateways per region.

## Azure Database for MariaDB gateway IP addresses

The gateway service is hosted on group of stateless compute nodes sitting behind an IP address, which your client would reach first when trying to connect to an Azure Database for MariaDB server. 

As part of ongoing service maintenance, we will periodically refresh compute hardware hosting the gateways to ensure we provide the most secure and performant experience. When the gateway hardware is refreshed, a new ring of the compute nodes is built out first. This new ring serves the traffic for all the newly created Azure Database for MariaDB servers and it will have a different IP address from older gateway rings in the same region to differentiate the traffic. Once the new ring is fully functional, the older gateway hardware serving existing servers are planned for decommissioning. Before decommissioning a gateway hardware, customers running their servers and connecting to older gateway rings will be notified via email and in the Azure portal, three months in advance before decommissioning. The decommissioning of gateways can impact the connectivity to your servers if 

* You hard code the gateway IP addresses in the connection string of your application. It is **not recommended**. You should use fully qualified domain name (FQDN) of your server in the format <servername>.mariadb.database.azure.com, in the connection string for your application. 
* You do not update the newer gateway IP addresses in the client-side firewall to allow outbound traffic to be able to reach our new gateway rings.

The following table lists the gateway IP addresses of the Azure Database for MariaDB gateway for all data regions. The most up-to-date information of the gateway IP addresses for each region is maintained in the table below. In the table below, the columns represent following:

* **Gateway IP addresses:** This column lists the current IP addresses of the gateways hosted on the latest generation of hardware. If you are provisioning a new server, we recommend that you open the client-side firewall to allow outbound traffic for the IP addresses listed in this column.
* **Gateway IP addresses (decommissioning):** This column lists the IP addresses of the gateways hosted on an older generation of hardware that is being decommissioned right now. If you are provisioning a new server, you can ignore these IP addresses. If you have an existing server, continue to retain the outbound rule for the firewall for these IP addresses as we have not decommissioned it yet. If you drop the firewall rules for these IP addresses, you may get connectivity errors. Instead, you are expected to proactively add the new IP addresses listed in Gateway IP addresses column to the outbound firewall rule as soon as you receive the notification for decommissioning. This will ensure when your server is migrated to latest gateway hardware, there is no interruptions in connectivity to your server.
* **Gateway IP addresses (decommissioned):** This columns lists the IP addresses of the gateway rings, which are decommissioned and are no longer in operations. You can safely remove these IP addresses from your outbound firewall rule. 


| **Region name** | **Gateway IP addresses** |**Gateway IP addresses (decommissioning)** | **Gateway IP addresses (decommissioned)** |
|:----------------|:-------------------------|:-------------------------------------------|:------------------------------------------|
| Australia Central| 20.36.105.0  | | |
| Australia Central2	 | 20.36.113.0  | | |
| Australia East | 13.75.149.87, 40.79.161.1	 |  | |
| Australia South East |191.239.192.109, 13.73.109.251	 |  | |
| Brazil South |191.233.201.8, 191.233.200.16	 |  | 104.41.11.5|
| Canada Central |40.85.224.249	 | | |
| Canada East | 40.86.226.166	 | | |
| Central US | 23.99.160.139, 52.182.136.37, 52.182.136.38 | 13.67.215.62 | |
| China East | 139.219.130.35	 | | |
| China East 2 | 40.73.82.1	 | | |
| China North | 139.219.15.17	 | | |
| China North 2 | 40.73.50.0	 | | |
| East Asia | 191.234.2.139, 52.175.33.150, 13.75.33.20, 13.75.33.21	 | | |
| East US |40.71.8.203, 40.71.83.113 |40.121.158.30|191.238.6.43 |
| East US 2 | 40.70.144.38, 52.167.105.38  | 52.177.185.181 | |
| France Central | 40.79.137.0, 40.79.129.1	 | | |
| France South | 40.79.177.0	 | | |
| Germany Central | 51.4.144.100	 | | |
| Germany North East | 51.5.144.179	 | | |
| India Central | 104.211.96.159	 | | |
| India South | 104.211.224.146	 | | |
| India West | 104.211.160.80	 | | |
| Japan East | 40.79.192.23, 40.79.184.8 | 13.78.61.196 | |
| Japan West | 191.238.68.11, 40.74.96.6, 40.74.96.7	 | 104.214.148.156 | |
| Korea Central | 52.231.17.13	 | 52.231.32.42 | |
| Korea South | 52.231.145.3	 | 52.231.200.86 | |
| North Central US | 52.162.104.35, 52.162.104.36	 | 23.96.178.199 | |
| North Europe | 52.138.224.6, 52.138.224.7	 | 40.113.93.91 |191.235.193.75 |
| South Africa North  | 102.133.152.0	 | | |
| South Africa West	| 102.133.24.0	 | | |
| South Central US |104.214.16.39, 20.45.120.0  |13.66.62.124  |23.98.162.75 |
| South East Asia | 40.78.233.2, 23.98.80.12	 | 104.43.15.0 | |
| UAE Central | 20.37.72.64	 | | |
| UAE North | 65.52.248.0	 | | |
| UK South | 51.140.184.11	 | | |
| UK West | 51.141.8.11	 | | |
| West Central US | 13.78.145.25	 | | |
| West Europe |13.69.105.208, 104.40.169.187 | 40.68.37.158 | 191.237.232.75 |
| West US |13.86.216.212, 13.86.217.212 |104.42.238.205  | 23.99.34.75|
| West US 2 | 13.66.226.202	 | | |
||||

## Connection redirection

Azure Database for MariaDB supports an additional connection policy, **redirection**, that helps to reduce network latency between client applications and MariaDB servers. With this feature, after the initial TCP session is established to the Azure Database for MariaDB server, the server returns the backend address of the node hosting the MariaDB server to the client. Thereafter, all subsequent packets flow directly to the server, bypassing the gateway. As packets flow directly to the server, latency and throughput have improved performance.

This feature is supported in Azure Database for MariaDB servers with engine versions 10.2 and 10.3.

Support for redirection is available in the PHP [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) extension, developed by Microsoft, and is available on [PECL](https://pecl.php.net/package/mysqlnd_azure). See the [configuring redirection](./howto-redirection.md) article for more information on how to use redirection in your applications.

> [!IMPORTANT]
> Support for redirection in the PHP [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) extension is currently in preview.

## Next steps

* [Create and manage Azure Database for MariaDB firewall rules using the Azure portal](./howto-manage-firewall-portal.md)
* [Create and manage Azure Database for MariaDB firewall rules using Azure CLI](./howto-manage-firewall-cli.md)
