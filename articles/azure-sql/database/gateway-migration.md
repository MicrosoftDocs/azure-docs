---
title: Gateway traffic migration notice
description: Article provides notice to users about the migration of Azure SQL Database gateway IP addresses
services: sql-database
ms.service: sql-db-mi
ms.subservice: service
ms.custom: sqldbrb=1 
ms.topic: conceptual
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: vanto
ms.date: 07/01/2019
---
# Azure SQL Database traffic migration to newer Gateways
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

As Azure infrastructure improves, Microsoft will periodically refresh hardware to ensure we provide the best possible customer experience. In the coming months, we plan to add gateways built on newer hardware generations, migrate traffic to them, and eventually decommission gateways built on older hardware in some regions.  

Customers will be notified via service health notifications well in advance of any change to gateways available in each region. Customers can [use the Azure portal to set up activity log alerts](../../service-health/alerts-activity-log-service-notifications-portal.md).

The most up-to-date information will be maintained in the [Azure SQL Database gateway IP addresses](connectivity-architecture.md#gateway-ip-addresses) table.

## Status updates

# [In progress](#tab/in-progress-ip)

## April 2021
New SQL Gateways are being added to the following regions:
- Norway East: 51.120.96.33
- South East Asia: 13.67.16.193
- South Africa North: 102.133.152.32
- Korea South: 52.231.151.96
- North Central: US 52.162.105.9
- Australia South East: 13.77.49.32 

These SQL Gateways shall start accepting customer traffic on 5 April 2021.

## March 2021
The following SQL Gateways in multiple regions are in the process of being deactivated:

- Brazil South: 104.41.11.5
- East Asia: 191.234.2.139
- East US: 191.238.6.43
- Japan East: 191.237.240.43
- Japan West: 191.238.68.11
- North Europe: 191.235.193.75
- South Central US: 23.98.162.75
- Southeast Asia: 23.100.117.95
- West Europe: 191.237.232.75
- West US: 23.99.34.75

No customer impact is anticipated since these Gateways (running on older hardware) are not routing any customer traffic. The IP addresses for these Gateways shall be deactivated on 15th March 2021.

## February 2021
New SQL Gateways are being added to the following regions:

- Central US: 13.89.169.20

These SQL Gateways shall start accepting customer traffic on 28 February 2021.

## January 2021
New SQL Gateways are being added to the following regions:

- Australia Central: 20.36.104.6 , 20.36.104.7 
- Australia Central 2:	20.36.112.6 
- Brazil South: 191.234.144.16 ,191.234.152.3 
- Canada East: 40.69.105.9 ,40.69.105.10
- India Central: 104.211.86.30 , 104.211.86.31 
- East Asia: 13.75.32.14 
- France Central: 40.79.137.8, 40.79.145.12 
- France South: 40.79.177.10 ,40.79.177.12
- Korea Central: 52.231.17.22 ,52.231.17.23
- India West: 104.211.144.4

These SQL Gateways shall start accepting customer traffic on 31 January 2021.

# [Completed](#tab/completed-ip)
The following gateway migrations are complete: 

### October 2020

New SQL Gateways are being added to the following regions:

- Germany West Central: 51.116.240.0, 51.116.248.0

These SQL Gateways shall start accepting customer traffic on 12 October 2020. 

### September 2020
New SQL Gateways are being added to the following regions. These SQL Gateways shall start accepting customer traffic on **15 September 2020**:

- Australia Southeast: 13.77.48.10
- Canada East: 40.86.226.166, 52.242.30.154
- UK South: 51.140.184.11, 51.105.64.0

Existing SQL Gateways will start accepting traffic in the following regions. These SQL Gateways shall start accepting customer traffic on **15 September 2020** :

- Australia Southeast: 191.239.192.109 and 13.73.109.251
- Central US: 13.67.215.62, 52.182.137.15, 23.99.160.139, 104.208.16.96, and 104.208.21.1
- East Asia: 191.234.2.139, 52.175.33.150, and 13.75.32.4
- East US: 40.121.158.30, 40.79.153.12, 191.238.6.43, and 40.78.225.32
- East US 2: 40.79.84.180, 52.177.185.181, 52.167.104.0, 191.239.224.107, and 104.208.150.3
- France Central: 40.79.137.0 and 40.79.129.1
- Japan West: 104.214.148.156, 40.74.100.192, 191.238.68.11, and 40.74.97.10
- North Central US: 23.96.178.199, 23.98.55.75, and 52.162.104.33
- Southeast Asia: 104.43.15.0, 23.100.117.95, and 40.78.232.3
- West US: 104.42.238.205, 23.99.34.75, and 13.86.216.196

New SQL Gateways are being added to the following regions. These SQL Gateways shall start accepting customer traffic on **10 September 2020**:

- West Central US: 13.78.248.43 
- South Africa North: 102.133.120.2  

New SQL Gateways are being added to the following regions. These SQL Gateways shall start accepting customer traffic on **1 September 2020**:

- North Europe: 13.74.104.113 
- West US2: 40.78.248.10 
- West Europe: 52.236.184.163 
- South Central US: 20.45.121.1, 20.49.88.1 

Existing SQL Gateways will start accepting traffic in the following regions. These SQL Gateways shall start accepting customer traffic on **1 September 2020**:
- Japan East: 40.79.184.8, 40.79.192.5


### August 2020

New SQL Gateways are being added to the following regions:

- Australia East: 13.70.112.9
- Canada Central: 52.246.152.0, 20.38.144.1 
- West US 2: 40.78.240.8

These SQL Gateways shall start accepting customer traffic on 10 August 2020. 

### October 2019
- Brazil South
- West US
- West Europe
- East US
- Central US
- South East Asia
- South Central US
- North Europe
- North Central US
- Japan West
- Japan East
- East US 2
- East Asia

---

## Impact of this change

Traffic migration may change the public IP address that DNS resolves for your database in Azure SQL Database.
You may be impacted if you:

- Hard coded the IP address for any particular gateway in your on-premises firewall
- Have any subnets using Microsoft.SQL as a Service Endpoint but cannot communicate with the gateway IP addresses
- Use the [zone redundant configuration for general purpose tier](high-availability-sla.md#general-purpose-service-tier-zone-redundant-availability-preview)
- Use the [zone redundant configuration for premium & business critical tiers](high-availability-sla.md#premium-and-business-critical-service-tier-zone-redundant-availability)

You will not be impacted if you have:
 
- Redirection as the connection policy
- Connections to SQL Database from inside Azure and using Service Tags
- Connections made using supported versions of JDBC Driver for SQL Server will see no impact. For supported JDBC versions, see [Download Microsoft JDBC Driver for SQL Server](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server).

## What to do you do if you're affected

We recommend that you allow outbound traffic to IP addresses for all the [gateway IP addresses](connectivity-architecture.md#gateway-ip-addresses) in the region on TCP port 1433, and port range 11000-11999. This recommendation is applicable to clients connecting from on-premises and also those connecting via Service Endpoints. For more information on port ranges, see [Connection policy](connectivity-architecture.md#connection-policy).

Connections made from applications using Microsoft JDBC Driver below version 4.0 might fail certificate validation. Lower versions of Microsoft JDBC rely on Common Name (CN) in the Subject field of the certificate. The mitigation is to ensure that the hostNameInCertificate property is set to *.database.windows.net. For more information on how to set the hostNameInCertificate property, see [Connecting with Encryption](/sql/connect/jdbc/connecting-with-ssl-encryption).

If the above mitigation doesn't work, file a support request for SQL Database or SQL Managed Instance using the following URL: https://aka.ms/getazuresupport

## Next steps

- Find out more about [Azure SQL Connectivity Architecture](connectivity-architecture.md)