---
title: Connectivity architecture - Azure Database for PostgreSQL - Single Server
description: Describes the connectivity architecture of your Azure Database for PostgreSQL - Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: gennadyk 
author: code-sidd
ms.date: 03/09/2023
---

# Connectivity architecture in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This article explains the Azure Database for PostgreSQL connectivity architecture as well as how the traffic is directed to your Azure Database for PostgreSQL database instance from clients both within and outside Azure.

## Connectivity architecture

Connection to your Azure Database for PostgreSQL is established through a gateway that is responsible for routing incoming connections to the physical location of your server in our clusters. The following diagram illustrates the traffic flow.

:::image type="content" source="./media/concepts-connectivity-architecture/connectivity-architecture-overview-proxy.png" alt-text="Overview of the connectivity architecture":::

As client connects to the database, the connection string to the server resolves to the gateway IP address. The gateway listens on the IP address on port 5432. Inside the database cluster, traffic is forwarded to appropriate Azure Database for PostgreSQL. Therefore, in order to connect to your server, such as from corporate networks, it's necessary to open up the **client-side firewall to allow outbound traffic to be able to reach our gateways**. Below you can find a complete list of the IP addresses used by our gateways per region.

## Azure Database for PostgreSQL gateway IP addresses

The gateway service is hosted on group of stateless compute nodes located behind an IP address. This is an address your client would reach first when trying to connect to an Azure Database for PostgreSQL server.

**As part of ongoing service maintenance, we'll periodically refresh compute hardware hosting the gateways to ensure we provide the most secure and performant connectivity experience.**  When the gateway hardware is refreshed, a new ring of the compute nodes is built out first. This new ring serves the traffic for all the newly created Azure Database for PostgreSQL servers and it has a different IP address from older gateway rings in the same region to differentiate the traffic. The older gateway hardware continues serving existing servers but are planned for decommissioning in future. Before decommissioning a gateway hardware, customers running their servers and connecting to older gateway rings are notified via email and in the Azure portal, three months in advance before decommissioning. The decommissioning of gateways can impact the connectivity to your servers if

* You hard code the gateway IP addresses in the connection string of your application. It is **not recommended**.You should use fully qualified domain name (FQDN) of your server in the format `<servername>.postgres.database.azure.com`, in the connection string for your application. 
* You don't update the newer gateway IP addresses in the client-side firewall to allow outbound traffic to be able to reach our new gateway rings. 

> [!IMPORTANT]
> We strongly encourage customers to use the Gateway IP address **subnets** in order to not be impacted by this activity in a region.

The following table lists the gateway IP addresses of the Azure Database for PostgreSQL gateway for all data regions. The most up-to-date information of the gateway IP addresses for each region is maintained in the table below. In the table below, the columns represent following:

* **Gateway IP addresses:** This column lists the current IP addresses of the gateways. As hardware is refreshed we'll remove these and  recommend that  you open the client-side firewall to allow outbound traffic for the IP address subnets listed in the next column.
* **Gateway IP address subnets:** This column lists the IP address subnets of the gateway rings located in the particular region. As we retire older gateway hardware, we recommend that you open the client-side firewall to allow outbound traffic for the IP address subnets in the region you are operating.

| **Region name** | **Gateway IP addresses**  | **Gateway IP address subnets** |
|:----------------|:-------------------------|:------------------------------------------|
| Australia Central|   | 20.36.105.32/29 |
| Australia Central2     | | 20.36.113.32/29 |
| Australia East |     |  13.70.112.32/29, 40.79.160.32/29, 40.79.168.32/29 |
| Australia South East |  |13.77.49.32/29  |
| Brazil South |191.233.201.8, 191.233.200.16     | 191.233.200.32/29, 191.234.144.32/29|
| Canada Central |40.85.224.249, 52.228.35.221     | 	13.71.168.32/29, 20.38.144.32/29, 52.246.152.32/29|
| Canada East |   | 40.69.105.32/29 |
| Central US | 23.99.160.139, 52.182.136.37, 52.182.136.38 | 104.208.21.192/29, 13.89.168.192/29, 52.182.136.192/29|
| China East            |  139.219.130.35            |      52.130.112.136/29  |
| China East 2          |  40.73.82.1, 52.130.120.89     | 52.130.120.88/29|
| China East 3          |  52.131.155.192        | 52.130.128.88/29|
| China North | 139.219.15.17     | 52.130.128.88/29 |
| China North 2 | 40.73.50.0     | 	52.130.40.64/29|
| China North 3 | 52.131.27.192     | 13.75.32.192/29, 13.75.33.192/29 |
| East Asia | 13.75.33.20, 52.175.33.150, 13.75.33.20, 13.75.33.21     | 13.75.32.192/29, 13.75.33.192/29|
| East US |40.71.8.203, 40.71.83.113 |20.42.65.64/29, 20.42.73.0/29, 52.168.116.64/29|
| East US 2 | 40.70.144.38, 52.167.105.38  |104.208.150.192/29, 40.70.144.192/29, 52.167.104.192/29|
| France Central | 40.79.137.0, 40.79.129.1     | 40.79.136.32/29, 40.79.144.32/29 |
| France South | 40.79.177.0     | 	40.79.176.40/29, 40.79.177.32/29|
| Germany West Central | 51.116.152.0 | 51.116.152.32/29, 51.116.240.32/29, 51.116.248.32/29|
| India Central || 104.211.86.32/29, 20.192.96.32/29|
| India South |    | 40.78.192.32/29, 40.78.193.32/29|
| India West |    | 	104.211.144.32/29, 104.211.145.32/29 |
| Japan East | 40.79.192.23, 40.79.184.8 | 13.78.104.32/29, 40.79.184.32/29, 40.79.192.32/29 |
| Japan West |  | 40.74.96.32/29 |
| Korea Central | 52.231.17.13     | 20.194.64.32/29,20.44.24.32/29, 52.231.16.32/29 |
| Korea South | 52.231.145.3     |  |
| North Central US | 52.162.104.35, 52.162.104.36     | 52.162.105.192/29|
| North Europe | 52.138.224.6, 52.138.224.7    |13.69.233.136/29, 13.74.105.192/29, 52.138.229.72/29 |
| South Africa North  | 102.133.152.0     | 102.133.120.32/29, 102.133.152.32/29, 102.133.248.32/29 |
| South Africa West    | 102.133.24.0     | 102.133.25.32/29|
| South Central US |104.214.16.39, 20.45.120.0  |20.45.121.32/29, 20.49.88.32/29, 20.49.89.32/29, 40.124.64.136/29|
| South East Asia | 40.78.233.2, 23.98.80.12     | 13.67.16.192/29, 23.98.80.192/29, 40.78.232.192/29 |
| Switzerland North | 51.107.56.0 |51.107.56.32/29, 51.103.203.192/29, 20.208.19.192/29, 51.107.242.32/27|
| Switzerland West | 51.107.152.0| 51.107.153.32/29|
| UAE Central | 20.37.72.64     | 20.37.72.96/29, 20.37.73.96/29 |
| UAE North | 65.52.248.0     | 40.120.72.32/29, 65.52.248.32/29 |
| UK South | 51.140.184.11, 51.140.144.32, 51.105.64.0     |51.105.64.32/29, 51.105.72.32/29, 51.140.144.32/29 |
| UK West |  | 51.140.208.96/29, 51.140.209.32/29 |
| West Central US |    | 13.71.193.32/29 |
| West Europe |13.69.105.208, 104.40.169.187 | 104.40.169.32/29, 13.69.112.168/29, 52.236.184.32/29|
| West US |13.86.216.212, 13.86.217.212 |13.86.217.224/29|
| West US 2 | 13.66.226.202, 13.66.136.192,13.66.136.195     | 13.66.136.192/29, 40.78.240.192/29, 40.78.248.192/29|
| West US 3 | 20.150.184.2     | 20.150.168.32/29, 20.150.176.32/29, 20.150.184.32/29 |

## Frequently asked questions

### What you need to know about this planned maintenance?

This is a DNS change only,  which makes it transparent to clients. While the IP address for FQDN is changed in the DNS server, the local DNS cache is refreshed within 5 minutes, and it is automatically done by the operating systems. After the local DNS refresh, all the new connections will connect to the new IP address, all existing connections will remain connected to the old IP address with no interruption until the old IP addresses are fully decommissioned. The old IP address takes roughly three to four weeks before getting decommissioned; therefore, it should have no effect on the client applications.

### What are we decommissioning?

Only Gateway nodes are decommissioned. When users connect to their servers, the first stop of the connection is to gateway node, before connection is forwarded to server. We are decommissioning old gateway rings (not tenant rings where the server is running) refer to the [connectivity architecture](#connectivity-architecture) for more clarification.

### How can you validate if your connections are going to old gateway nodes or new gateway nodes?

Ping your server's FQDN, for example  ``ping xxx.postgres.database.azure.com``. If the returned IP address is one of the IPs listed under Gateway IP addresses (decommissioning) in the document above, it means your connection is going through the old gateway. On the contrary, if the returned Ip-address is one of the IPs listed under Gateway IP addresses, it means your connection is going through the new gateway.

You may also test by [PSPing](/sysinternals/downloads/psping) or TCPPing the database server from your client application with port 5432 and ensure that return IP address isn't one of the decommissioning IP addresses

### How do I know when the maintenance is over and will I get another notification when old IP addresses are decommissioned?

You  receive an email to inform you when we start the maintenance work. The maintenance can take up to one month depending on the number of servers we need to migrate in al regions. Please prepare your client to connect to the database server using the FQDN or using the new IP address from the table above.

### What do I do if my client applications are still connecting to old gateway server?

This indicates that your applications connect to server using static IP address instead of FQDN. Review connection strings and connection pooling setting, AKS setting, or even in the source code.

### Is there any impact for my application connections?

This maintenance is just a DNS change, so it is transparent to the client. Once the DNS cache is refreshed in the client (automatically done by operation system), all the new connections  connect to the new IP address and all the existing connections will still be working fine until the old IP address gets fully decommissioned, which is several weeks later. And the retry logic is not required for this case, but it is good to see the application have retry logic configured.  Either use FQDN to connect to the database server  in your application connection string.
This maintenance operation will not drop the existing connections. It only makes the new connection requests go to new gateway ring.

### Can I request for a specific time window for the maintenance? 

As the migration should be transparent and no impact to customer's connectivity, we expect there will be no issue for majority of users. Review your application proactively and ensure that you either use FQDN to connect to the database server or enable list the new 'Gateway IP addresses' in your application connection string.

### I'm using private link, will my connections get affected?

No, this is a gateway hardware decommission and have no relation to private link or private IP addresses, it will only affect public IP addresses mentioned under the decommissioning IP addresses.


## Next steps

* [Create and manage Azure Database for PostgreSQL firewall rules using the Azure portal](./how-to-manage-firewall-using-portal.md)
* [Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI](quickstart-create-server-database-azure-cli.md#configure-a-server-based-firewall-rule)
