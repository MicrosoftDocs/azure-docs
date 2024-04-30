---
title: Connectivity architecture - Azure Database for MySQL
description: Describes the connectivity architecture for your Azure Database for MySQL server.
ms.service: mysql
ms.subservice: single-server
author: code-sidd 
ms.author: sisawant
ms.topic: conceptual
ms.date: 06/20/2022
---

# Connectivity architecture in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This article explains the Azure Database for MySQL connectivity architecture and how the traffic is directed to your Azure Database for MySQL instance from clients both within and outside Azure.

## Connectivity architecture
Connection to your Azure Database for MySQL is established through a gateway that is responsible for routing incoming connections to the physical location of your server in our clusters. The following diagram illustrates the traffic flow.

:::image type="content" source="./media/concepts-connectivity-architecture/connectivity-architecture-overview-proxy.png" alt-text="Overview of the connectivity architecture":::

As client connects to the database, the connection string to the server resolves to the gateway IP address. The gateway listens on the IP address on port 3306. Inside the database cluster, traffic is forwarded to appropriate Azure Database for MySQL. Therefore, in order to connect to your server, such as from corporate networks, it's necessary to open up the **client-side firewall to allow outbound traffic to be able to reach our gateways**. Below you can find a complete list of the IP addresses used by our gateways per region.

## Azure Database for MySQL gateway IP addresses

The gateway service is hosted on group of stateless compute nodes sitting behind an IP address, which your client would reach first when trying to connect to an Azure Database for MySQL server. 

As part of ongoing service maintenance, we'll periodically refresh compute hardware hosting the gateways to ensure we provide the most secure and performant experience. When the gateway hardware is refreshed, a new ring of the compute nodes is built out first. This new ring serves the traffic for all the newly created Azure Database for MySQL servers and it will have a different IP address from older gateway rings in the same region to differentiate the traffic. Once the new ring is fully functional, the older gateway hardware serving existing servers are planned for decommissioning. Before decommissioning a gateway hardware, customers running their servers and connecting to older gateway rings will be notified via email and in the Azure portal. The decommissioning of gateways can impact the connectivity to your servers if 

* You hard code the gateway IP addresses in the connection string of your application. It is **not recommended**. You should use fully qualified domain name (FQDN) of your server in the format `<servername>.mysql.database.azure.com`, in the connection string for your application. 
* You don't update the newer gateway IP addresses in the client-side firewall to allow outbound traffic to be able to reach our new gateway rings.

> [!IMPORTANT]
> If customer connectivity stack needs to connect directly to gateway instead of **recommended DNS name approach**, or allow-list gateway in the firewall rules for connections to\from customer infrastructure, we **strongly encourage** customers to use Gateway IP address **subnets** versus hardcoding static IP in order to not be impacted by this activity in a region that may cause IP to change within the subnet range. 


The following table lists the gateway IP addresses of the Azure Database for MySQL gateway for all data regions. The most up-to-date information of the gateway IP addresses for each region is maintained in the table below. In the table below, the columns represent following:

* **Gateway IP address subnets:** This column lists the IP address subnets of the gateway rings located in the particular region. As we retire older gateway hardware, we recommend that you open the client-side firewall to allow outbound traffic for the IP address subnets in the region you're operating.
* **Gateway IP addresses**: Periodically, individual **Gateway IP addresses** will be retired and traffic will be migrated to corresponding **Gateway IP address subnets**.

We strongly encourage customers to move away from relying on any individual Gateway IP address (since these will be retired in the future). Instead allow network traffic to reach both the individual Gateway IP addresses and Gateway IP address subnets in a region.

| **Region name** |**Current Gateway IP address**|  **Gateway IP address subnets** |
|:----------------|:-----------------------------|:--------------------------------|
| Australia Central  |  20.36.105.32     | 20.36.105.32/29, 20.53.48.96/27 | 
| Australia Central2  | 20.36.113.32   | 20.36.113.32/29, 20.53.56.32/27 |
| Australia East     | 13.70.112.32    | 13.70.112.32/29, 40.79.160.32/29, 40.79.168.32/29, 40.79.160.32/29, 20.53.46.128/27 |
| Australia South East  |13.77.49.33 |13.77.49.32/29, 104.46.179.160/27|
| Brazil South | 191.233.201.8, 191.233.200.16 | 191.234.153.32/27, 191.234.152.32/27, 191.234.157.136/29, 191.233.200.32/29, 191.234.144.32/29, 191.234.142.160/27|
|Brazil Southeast|191.233.48.2|191.233.48.32/29, 191.233.15.160/27|
| Canada Central  | 13.71.168.32| 13.71.168.32/29, 20.38.144.32/29, 52.246.152.32/29, 20.48.196.32/27|
| Canada East   |40.69.105.32 | 40.69.105.32/29, 52.139.106.192/27 |
| Central US  | 52.182.136.37, 52.182.136.38 | 104.208.21.192/29, 13.89.168.192/29, 52.182.136.192/29, 20.40.228.128/27|
| China East  |      52.130.112.139             |     52.130.112.136/29, 52.130.13.96/27|
| China East 2   |   40.73.82.1, 52.130.120.89       | 52.130.120.88/29, 52.130.7.0/27|
| China North   | 52.130.128.89| 52.130.128.88/29, 40.72.77.128/27 |
| China North 2  |40.73.50.0 |	52.130.40.64/29, 52.130.21.160/27|
| East Asia  |13.75.33.20, 13.75.33.21  | 20.205.77.176/29, 20.205.83.224/29, 20.205.77.200/29, 13.75.32.192/29, 13.75.33.192/29, 20.195.72.32/27|
| East US  | 	40.71.8.203, 40.71.83.113|20.42.65.64/29, 20.42.73.0/29, 52.168.116.64/29, 20.62.132.160/27|
| East US 2  |52.167.105.38, 40.70.144.38| 104.208.150.192/29, 40.70.144.192/29, 52.167.104.192/29, 20.62.58.128/27|
| France Central |40.79.129.1  | 40.79.128.32/29, 40.79.136.32/29, 40.79.144.32/29, 20.43.47.192/27 |
| France South  |40.79.176.40 |	40.79.176.40/29, 40.79.177.32/29, 52.136.185.0/27|
| Germany North| 51.116.56.0| 51.116.57.32/29, 51.116.54.96/27|
| Germany West Central  | 51.116.152.0 | 51.116.152.32/29, 51.116.240.32/29, 51.116.248.32/29, 51.116.149.32/27|
| Central India | 20.192.96.33 | 40.80.48.32/29, 104.211.86.32/29, 20.192.96.32/29, 20.192.43.160/27|
| South India   | 40.78.192.32| 40.78.192.32/29, 40.78.193.32/29, 52.172.113.96/27|
| West India     | 104.211.144.32|	104.211.144.32/29, 104.211.145.32/29, 52.136.53.160/27|
| Japan East  | 40.79.184.8, 40.79.192.23| 13.78.104.32/29, 40.79.184.32/29, 40.79.192.32/29, 20.191.165.160/27 |
| Japan West  |40.74.96.6| 20.18.179.192/29, 40.74.96.32/29, 20.189.225.160/27 |
| Jio India Central| 20.192.233.32|20.192.233.32/29, 20.192.48.32/27|
| Jio India West|20.193.200.32|20.193.200.32/29, 20.192.167.224/27|
| Korea Central  | 52.231.17.13  | 20.194.64.32/29, 20.44.24.32/29, 52.231.16.32/29, 20.194.73.64/27|
| Korea South   |52.231.145.3| 52.231.151.96/27, 52.231.151.88/29, 52.231.145.0/29, 52.147.112.160/27 |
| North Central US | 52.162.104.35, 52.162.104.36 | 52.162.105.200/29, 20.125.171.192/29, 52.162.105.192/29, 20.49.119.32/27|
| North Europe  |52.138.224.6, 52.138.224.7 |13.69.233.136/29, 13.74.105.192/29, 52.138.229.72/29, 52.146.133.128/27 |
|Norway East|51.120.96.0|51.120.208.32/29, 51.120.104.32/29, 51.120.96.32/29, 51.120.232.192/27|
|Norway West|51.120.216.0|51.120.217.32/29, 51.13.136.224/27|
| South Africa North    | 102.133.152.0 | 102.133.120.32/29, 102.133.152.32/29, 102.133.248.32/29, 102.133.221.224/27 |
| South Africa West     |102.133.24.0 | 102.133.25.32/29, 102.37.80.96/27|
| South Central US  | 20.45.120.0 |20.45.121.32/29, 20.49.88.32/29, 20.49.89.32/29, 40.124.64.136/29, 20.65.132.160/27|
| South East Asia | 23.98.80.12, 40.78.233.2|13.67.16.192/29, 23.98.80.192/29, 40.78.232.192/29, 20.195.65.32/27 |
| Sweden Central|51.12.96.32|51.12.96.32/29, 51.12.232.32/29, 51.12.224.32/29, 51.12.46.32/27|
| Sweden South|51.12.200.32|51.12.201.32/29, 51.12.200.32/29, 51.12.198.32/27|
| Switzerland North  |51.107.56.0 |51.107.56.32/29, 51.103.203.192/29, 20.208.19.192/29, 51.107.242.32/27|
| Switzerland West  | 51.107.152.0| 51.107.153.32/29, 51.107.250.64/27|
| UAE Central     | 20.37.72.64| 20.37.72.96/29, 20.37.73.96/29, 20.37.71.64/27 |
| UAE North    |65.52.248.0 |20.38.152.24/29, 40.120.72.32/29, 65.52.248.32/29, 20.38.143.64/27 |
| UK South  | 51.105.64.0|51.105.64.32/29, 51.105.72.32/29, 51.140.144.32/29, 51.143.209.224/27|
| UK West |51.140.208.98 |51.140.208.96/29, 51.140.209.32/29, 20.58.66.128/27 |
| West Central US   |13.71.193.34 | 13.71.193.32/29, 20.69.0.32/27 |
| West Europe  | 13.69.105.208,104.40.169.187|104.40.169.32/29, 13.69.112.168/29, 52.236.184.32/29, 20.61.99.192/27|
| West US |13.86.216.212, 13.86.217.212 |20.168.163.192/29, 13.86.217.224/29, 20.66.3.64/27|
| West US 2  | 13.66.136.192 | 13.66.136.192/29, 40.78.240.192/29, 40.78.248.192/29, 20.51.9.128/27|
| West US 3  |20.150.184.2   | 20.150.168.32/29, 20.150.176.32/29, 20.150.184.32/29, 20.150.241.128/27 |



## Connection redirection

Azure Database for MySQL supports an extra connection policy, **redirection** that helps to reduce network latency between client applications and MySQL servers. With redirection, and after the initial TCP session is established to the Azure Database for MySQL server, the server returns the backend address of the node hosting the MySQL server to the client. Thereafter, all subsequent packets flow directly to the server, bypassing the gateway. As packets flow directly to the server, latency and throughput have improved performance.

This feature is supported in Azure Database for MySQL servers with engine versions 5.7, and 8.0.

Support for redirection is available in the PHP [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) extension, developed by Microsoft, and is available on [PECL](https://pecl.php.net/package/mysqlnd_azure). See the [configuring redirection](./how-to-redirection.md) article for more information on how to use redirection in your applications.


> [!IMPORTANT]
> Support for redirection in the PHP [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) extension is currently in preview.

## Frequently asked questions

### What you need to know about this planned maintenance?
This is a DNS change only, which makes it transparent to clients. While the IP address for FQDN is changed in the DNS server, the local DNS cache is refreshed within 5 minutes, and it's automatically done by the operating systems. After the local DNS refresh, all the new connections will connect to the new IP address, all existing connections will remain connected to the old IP address with no interruption until the old IP addresses are fully decommissioned. The old IP address will roughly take three to four weeks before getting decommissioned; therefore, it should have no effect on the client applications.

### What are we decommissioning?
Only Gateway nodes are decommissioned. When users connect to their servers, the first stop of the connection is to gateway node, before connection is forwarded to server. We're decommissioning old gateway rings (not tenant rings where the server is running) refer to the [connectivity architecture](#connectivity-architecture) for more clarification.

### How can you validate if your connections are going to old gateway nodes or new gateway nodes?
Ping your server's FQDN, for example  ``ping xxx.mysql.database.azure.com``. If the returned IP address is one of the IPs listed under Gateway IP addresses (decommissioning) in the document above, it means your connection is going through the old gateway. Contrarily, if the returned Ip-address is one of the IPs listed under Gateway IP addresses, it means your connection is going through the new gateway.

You may also test by [PSPing](/sysinternals/downloads/psping) or TCPPing the database server from your client application with port 3306 and ensure that return IP address isn't one of the decommissioning IP addresses

### How do I know when the maintenance is over and will I get another notification when old IP addresses are decommissioned?
You receive an email to inform you when we start the maintenance work. The maintenance can take up to one month depending on the number of servers we need to migrate in al regions. Prepare your client to connect to the database server using the FQDN or using the new IP address from the table above. 

### What do I do if my client applications are still connecting to old gateway server?
This indicates that your applications connect to server using static IP address instead of FQDN. Review connection strings and connection pooling setting, AKS setting, or even in the source code.

### Is there any impact for my application connections?
This maintenance is just a DNS change, so it's transparent to the client. Once the DNS cache is refreshed in the client (automatically done by operation system), all the new connections connect to the new IP address and all the existing connections will still work fine until the old IP address fully get decommissioned, which happens several weeks later. And the retry logic isn't required for this case, but it's good to see the application have retry logic configured. Use FQDN to connect to the database server  in your application connection string. This maintenance operation won't drop the existing connections. It only makes the new connection requests go to new gateway ring.

### Can I request for a specific time window for the maintenance? 
As the migration should be transparent and no impact to customer's connectivity, we expect there will be no issue for most users. Review your application proactively and ensure that you either use FQDN to connect to the database server or enable list the new 'Gateway IP addresses' in your application connection string.

### I'm using private link, will my connections get affected?
No, this is a gateway hardware decommission and have no relation to private link or private IP addresses, it will only affect public IP addresses mentioned under the decommissioning IP addresses.



## Next steps
* [Create and manage Azure Database for MySQL firewall rules using the Azure portal](./how-to-manage-firewall-using-portal.md)
* [Create and manage Azure Database for MySQL firewall rules using Azure CLI](./how-to-manage-firewall-using-cli.md)
* [Configure redirection with Azure Database for MySQL](./how-to-redirection.md)
