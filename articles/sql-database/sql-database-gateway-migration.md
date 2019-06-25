---
title: Gateway migration notice for Azure SQL Database from Gen2 to Gen3 | Microsoft Docs
description: Article provides notice to users about the migration of Azure SQL Database Gateways IP addresses
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.topic: conceptual
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: vanto
manager: craigg
ms.date: 07/01/2019
---
# Azure SQL Database traffic migration to newer Gateways

As Azure infrastructure improves, Microsoft will periodically refresh hardware to ensure we provide the best possible customer experience. In the coming months, we plan to add Gateways built on newer hardware generations, and decommission Gateways built on older hardware in some regions.  

Customers will be notified via email and in the Azure portal well in advance of any change to Gateways available in each region. The most up-to-date information will be maintained in the [Azure SQL Database gateway IP addresses](sql-database-connectivity-architecture.md#azure-sql-database-gateway-ip-addresses) table.

## Impact of this change

The first round of Gateway decommissioning is scheduled for September 1, 2019 in the following regions:

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

The Decommissioned IP Address will stop accepting traffic and any new connection attempts will be routed to one of the Gateways in the region.

Where you won't see impact of this change:

- Customers using redirection as their connection policy won't see any impact.
- Connections to SQL Database from inside Azure and using Service Tags won't be impacted.
- Connections made using supported versions of JDBC Driver for SQL Server will see no impact. For supported JDBC versions, see [Download Microsoft JDBC Driver for SQL Server](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server).

## What to do you do if you're affected

We recommend that you allow outbound traffic to IP addresses for all the [Azure SQL Database gateway IP addresses](sql-database-connectivity-architecture.md#azure-sql-database-gateway-ip-addresses) in the region on TCP port 1433, and port range 11000-11999 in your firewall device. For more information on port ranges, see [Connection policy](sql-database-connectivity-architecture.md#connection-policy).

Connections made from applications using Microsoft JDBC Driver below version 4.0 might fail certificate validation. Lower versions of Microsoft JDBC rely on Common Name (CN) in the Subject field of the certificate. The mitigation is to ensure that the hostNameInCertificate property is set to *.database.windows.net. For more information on how to set the hostNameInCertificate property, see [Connecting with SSL Encryption](/sql/connect/jdbc/connecting-with-ssl-encryption).

If the above mitigation doesn't work, file a support request for SQL Database using the following URL: https://aka.ms/getazuresupport

## Next steps

- Find out more about [Azure SQL Connectivity Architecture](sql-database-connectivity-architecture.md)