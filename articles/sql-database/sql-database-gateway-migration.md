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
ms.date: 06/12/2019
---
# Azure SQL Database traffic migration to newer Gateways

The majority of regions currently have [two IP Gateway addresses](sql-database-connectivity-architecture.md#azure-sql-database-gateway-ip-addresses) for Azure SQL Database. Your SQL Database server typically resolves to the IP address of the default Gateway, and can be confirmed by running a nslookup command as follows:

`nslookup <ServerName>.database.windows.net`

Here is a sample result you would see:

<pre>
>nslookup mydbsrv.database.windows.net
Server:  DNSAnycast1.corp.microsoft.com
Address:  10.50.10.50

Non-authoritative answer:
Name:    westus1-a.control.database.windows.net
<b>Address:  104.42.238.205</b>
Aliases:  mydbsrv.database.windows.net
</pre>

## Gateway migration

As our Azure infrastructure improves, Microsoft will periodically refresh hardware to ensure we provide the best possible customer experience. We continue to build additional Gateways based on newer hardware generation. In the coming months, our plan is to add Gateways built on newer hardware generations, and retire the older Gateways in some regions.

When this change happens, we'll stop accepting traffic on the IP address for the [default Gateway](sql-database-connectivity-architecture.md#azure-sql-database-gateway-ip-addresses) beginning October 1, 2019. All new traffic will be routed to the IP addresses associated with **alternate Gateways** listed in each region. Regions with no alternate Gateways aren't impacted. However, as we add Gateways in the future, we'll update the list of IP addresses for those regions.

## Impact of this change

This change won't impact any in-flight transactions or availability for your database. We'll gradually move traffic from the default Gateway to alternate Gateways without impacting any existing connections that may still be using the default Gateway. Any new connections will be serviced by one of the alternate Gateways.

Any attempts to directly connect to the IP addresses for default Gateway after  October 1, 2019 are expected to fail. For example, connections may fail if you have firewall rules on-premises that depend on an IP address of the default Gateway. Connections may also fail if you're using a custom DNS server that resolves to the default Gateway.

You can expect this error message to be returned when a connection is attempted:

`A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible. Verify that the instance name is correct and that SQL Server is configured to allow remote connections.`

In cases where your application is built using the following providers, the above error message applies:
- Net SqlClient Data Provider for .Net version 3.5 or lower
- OLEDB with provider sqloledb and sqlncli
- SQL Server ODBC driver

you can expect to see the following error related to SSL certificate validation:

`A connection was successfully established with the server, but then an error occurred during the pre-login handshake. (provider: SSL Provider, error: 0 - The certificate's CN name does not match the passed value.)`

## What to do you do if you're affected

We recommend that you allow outbound traffic to IP addresses for all the [alternate Gateways](sql-database-connectivity-architecture.md#azure-sql-database-gateway-ip-addresses) on TCP port 1433 and port range 11000-11999 in your firewall device. For more information on port ranges, see [Connection policy](sql-database-connectivity-architecture.md#connection-policy).

Similarly, ensure that your DNS records are updated to include IP addresses for the alternate Gateways.

For applications using certificate-based authentication, ensure it's allowing traffic to IP addresses for all Gateways in a region. Additionally, ensure your application reads both the Common Name (CN) and Subject Alternate Name (SAN) entries from the certificate as outlined in the requirements [here](/sql/connect/jdbc/understanding-ssl-support#validating-server-ssl-certificate).

If none of the above mitigations work, file a support request for SQL Database using the following URL: https://aka.ms/getazuresupport

## Next steps

- Find out more about [Azure SQL Connectivity Architecture](sql-database-connectivity-architecture.md)