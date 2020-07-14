---
title: Update your Azure Databricks route tables and firewalls with new MySQL IPs
description: Learn how to update your Azure Databricks route tables and firewalls with new MySQL IP addresses. 
services: azure-databricks
author: mamccrea 
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: azure-databricks
ms.workload: big-data
ms.topic: conceptual
ms.date: 06/02/2020
---

# Update your Azure Databricks route tables and firewalls with new MySQL IPs

All IP addresses of your Azure Database for MySQL, used as your Azure Databricks metastore, are changing. Update your Azure Databricks route tables or firewalls with new MySQL IPs before June 30, 2020 to avoid disruption.

An Azure Databricks workspace deployed in your own virtual network has a [route table](https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/udr#--metastore-artifact-blob-storage-log-blob-storage-and-event-hub-endpoint-ip-addresses) attached. The route table may directly contain an Azure Databricks metastore IP address or route to a firewall or proxy appliance that may be whitelisting the address.

## Recommended actions

To avoid disruption to your service, review and apply these actions before June 30, 2020.

* Check if your route table is affected by a change in the Azure MySQL IP Address update.

* Use the table in the following section to look up the new IP addresses. For each region, there could be multiple IP addresses used as primary and secondary IPs of the Azure Database for MySQL gateways. The primary IP address is the current IP address of the gateway and the second IP addresses are failover IP addresses in case of failure of the primary. To ensure service health, you should allow outbound to all the IP addresses. If you use an [external metastore](https://docs.microsoft.com/azure/databricks/data/metastores/external-hive-metastore), please make sure that a valid IP as per Azure MySQL notifications is being routed or whitelisted.

* Update the route table, firewall, or proxy appliance with the new IPs.

## Updated MySQL IP addresses

The following table includes all IP addresses that must be whitelisted. IP addresses in **bold** are the new IP addresses. 

| Region name          | Gateway IP addresses                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| Australia Central    | 20.36.105.0                                                                                                |
| Australia Central 2  | 20.36.113.0                                                                                                |
| Australia East       | 13.75.149.87<br><br>40.79.161.1                                                                            |
| Australia South East | 191.239.192.109<br><br>13.73.109.251                                                                       |
| Brazil South         | 104.41.11.5 <br><br> 191.233.201.8 <br><br> **191.233.200.16**                                             |
| Canada Central       | 40.85.224.249                                                                                              |
| Canada East          | 40.86.226.166                                                                                              |
| Central US           | 23.99.160.139<br><br>13.67.215.62<br><br>**52.182.136.37**<br><br>**52.182.136.38**                        |
| China East           | 139.219.130.35                                                                                             |
| China East 2         | 40.73.82.1                                                                                                 |
| China North          | 139.219.15.17                                                                                              |
| China North 2        | 40.73.50.0                                                                                                 |
| East Asia            | 191.234.2.139<br><br>52.175.33.150<br><br>**13.75.33.20**<br><br>**13.75.33.21**                           |
| East US              | 40.121.158.30<br>191.238.6.43                                                                              |
| East US 2            | 40.79.84.180<br><br>191.239.224.107<br><br>52.177.185.181<br><br>**40.70.144.38**<br><br>**52.167.105.38** |
| France Central       | 40.79.137.0<br><br>40.79.129.1                                                                             |
| Germany Central      | 51.4.144.100                                                                                               |
| Germany North East   | 51.5.144.179                                                                                               |
| India Central        | 104.211.96.159                                                                                             |
| India South          | 104.211.224.146                                                                                            |
| India West           | 104.211.160.80                                                                                             |
| Japan East           | 13.78.61.196<br><br>191.237.240.43                                                                         |
| Japan West           | 104.214.148.156<br><br>191.238.68.11<br><br>**40.74.96.6**<br><br>**40.74.96.7**                           |
| Korea Central        | 52.231.32.42                                                                                               |
| Korea South          | 52.231.200.86                                                                                              |
| North Central US     | 23.96.178.199<br><br>23.98.55.75<br><br>**52.162.104.35**<br><br>**52.162.104.36**                         |
| North Europe         | 40.113.93.91<br><br>191.235.193.75<br><br>**52.138.224.6**<br><br>**52.138.224.7**                         |
| South Africa North   | 102.133.152.0                                                                                              |
| South Africa West    | 102.133.24.0                                                                                               |
| South Central US     | 13.66.62.124<br><br>23.98.162.75<br><br>**104.214.16.39**<br><br>**20.45.120.0**                           |
| South East Asia      | 104.43.15.0<br><br>23.100.117.95<br><br>**40.78.233.2**<br><br>**23.98.80.12**                             |
| UAE Central          | 20.37.72.64                                                                                                |
| UAE North            | 65.52.248.0                                                                                                |
| UK South             | 51.140.184.11                                                                                              |
| UK West              | 51.141.8.11                                                                                                |
| West Central US      | 13.78.145.25                                                                                               |
| West Europe          | 40.68.37.158<br><br>191.237.232.75<br><br>**13.69.105.208**                                                |
| West US              | 104.42.238.205<br><br>23.99.34.75                                                                          |
| West US 2            | 13.66.226.202                                                                                              |

## Next steps

* [Deploy Azure Databricks in your Azure virtual network (VNet injection)](https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject)
* [External Apache Hive metastore](https://docs.microsoft.com/azure/databricks/data/metastores/external-hive-metastore)
