---
title: Gateway traffic migration notice
description: Article provides notice to users about the migration of Azure SQL Database gateway IP addresses
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: sqldbrb=1 
ms.topic: conceptual
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: vanto
ms.date: 07/01/2019
---
# Azure SQL Database traffic migration to newer Gateways
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

As Azure infrastructure improves, Microsoft will periodically refresh hardware to ensure we provide the best possible customer experience. In the coming months, we plan to add gateways built on newer hardware generations, migrate traffic to them, and eventually decommission gateways built on older hardware in some regions.  

Customers will be notified via email and in the Azure portal well in advance of any change to gateways available in each region. The most up-to-date information will be maintained in the [Azure SQL Database gateway IP addresses](connectivity-architecture.md#gateway-ip-addresses) table.


## What to do you do if you're affected

We recommend that you allow outbound traffic to IP addresses for all the [gateway IP addresses](connectivity-architecture.md#gateway-ip-addresses) in the region on TCP port 1433, and port range 11000-11999. This recommendation is applicable to clients connecting from on-premises and also those connecting via Service Endpoints. For more information on port ranges, see [Connection policy](connectivity-architecture.md#connection-policy).

Connections made from applications using Microsoft JDBC Driver below version 4.0 might fail certificate validation. Lower versions of Microsoft JDBC rely on Common Name (CN) in the Subject field of the certificate. The mitigation is to ensure that the hostNameInCertificate property is set to *.database.windows.net. For more information on how to set the hostNameInCertificate property, see [Connecting with Encryption](/sql/connect/jdbc/connecting-with-ssl-encryption).

If the above mitigation doesn't work, file a support request for SQL Database or SQL Managed Instance using the following URL: https://aka.ms/getazuresupport

## August 3, 2020 Update

Additional gateways are being added on August 3, 2020 in the following regions:

- Australia East 
- Canada Central
- North Europe 
- West US 2

This new set of gateways could change the public IP address to which DNS will resolve for your current and newly created Azure SQL Databases in these regions. The zone redundant configuration requires access to all the SQL Gateways in a region. For more information on the zone redundant configuration [click here](high-availability-sla.md#zone-redundant-configuration).


## October 14, 2019 Update

The first round of traffic migration to newer gateways  is scheduled for **October 14, 2019** in the following regions:

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

The traffic migration will change the public IP address that DNS resolves for your database in Azure SQL Database.
You will be impacted if you have:

- Hard coded the IP address for any particular gateway in your on-premises firewall
- Any subnets using Microsoft.SQL as a Service Endpoint but cannot communicate with the gateway IP addresses

You will not be impacted if you have:

- Redirection as the connection policy
- Connections to SQL Database from inside Azure and using Service Tags
- Connections made using supported versions of JDBC Driver for SQL Server will see no impact. For supported JDBC versions, see [Download Microsoft JDBC Driver for SQL Server](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server).


## Next steps

- Find out more about [Azure SQL Connectivity Architecture](connectivity-architecture.md)
