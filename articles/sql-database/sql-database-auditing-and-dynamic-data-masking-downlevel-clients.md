---
title: Table Auditing, TDS redirection, and IP endpoints for Azure SQL Database | Microsoft Docs
description: Learn about auditing, TDS redirection and IP endpoint changes when implementing table auditing in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: ronitr
ms.author: ronitr
ms.reviewer: vanto
manager: craigg
ms.date: 04/01/2018
---
# SQL Database -  Downlevel clients support and IP endpoint changes for Table Auditing

> [!IMPORTANT]
> This document applies only to Table Auditing, which is **now deprecated**.<br>
> Please use the new [Blob Auditing](sql-database-auditing.md) method, which **does not** require downlevel client connection string modifications. Additional info on Blob Auditing can be found in [Get started with SQL database auditing](sql-database-auditing.md).

[Database Auditing](sql-database-auditing.md) works automatically with SQL clients that support TDS redirection. Note that redirection does not apply when using the Blob Auditing method.

## <a id="subheading-1"></a>Downlevel clients support
Any client which implements TDS 7.4 should also support redirection. Exceptions to this include JDBC 4.0 in which the redirection feature is not fully supported and Tedious for Node.JS in which redirection was not implemented.

For "Downlevel clients", i.e. which support TDS version 7.3 and below - the server FQDN in the connection string should be modified:

Original server FQDN in the connection string: <*server name*>.database.windows.net

Modified server FQDN in the connection string: <*server name*>.database.**secure**.windows.net

A partial list of "Downlevel clients" includes:

* .NET 4.0 and below,
* ODBC 10.0 and below.
* JDBC (while JDBC does support TDS 7.4, the TDS redirection feature is not fully supported)
* Tedious (for Node.JS)

**Remark:** The above server FDQN modification may be useful also for applying a SQL Server Level Auditing policy without a need for a configuration step in each database (Temporary mitigation).

## <a id="subheading-2"></a>IP endpoint changes when enabling Auditing
Please note that when you enable Table Auditing, the IP endpoint of your database will change. If you have strict firewall settings, please update those firewall settings accordingly.

The new database IP endpoint will depend on the database region:

| Database Region | Possible IP endpoints |
| --- | --- |
| China North |139.217.29.176, 139.217.28.254 |
| China East |42.159.245.65, 42.159.246.245 |
| Australia East |104.210.91.32, 40.126.244.159, 191.239.64.60, 40.126.255.94 |
| Australia Southeast |191.239.184.223, 40.127.85.81, 191.239.161.83, 40.127.81.130 |
| Brazil South |104.41.44.161, 104.41.62.230, 23.97.99.54, 104.41.59.191 |
| Central US |104.43.255.70, 40.83.14.7, 23.99.128.244, 40.83.15.176 |
| Central US EUAP |52.180.178.16, 52.180.176.190 |
| East Asia |23.99.125.133, 13.75.40.42, 23.97.71.138, 13.94.43.245 |
| East US 2 |104.209.141.31, 104.208.238.177, 191.237.131.51, 104.208.235.50 |
| East US |23.96.107.223, 104.41.150.122, 23.96.38.170, 104.41.146.44 |
| East US EUAP |52.225.190.86, 52.225.191.187 |
| Central India |104.211.98.219, 104.211.103.71 |
| South India |104.211.227.102, 104.211.225.157 |
| West India |104.211.161.152, 104.211.162.21 |
| Japan East |104.41.179.1, 40.115.253.81, 23.102.64.207, 40.115.250.196 |
| Japan West |104.214.140.140, 104.214.146.31, 191.233.32.34, 104.214.146.198 |
| North Central US |191.236.155.178, 23.96.192.130, 23.96.177.169, 23.96.193.231 |
| North Europe |104.41.209.221, 40.85.139.245, 137.116.251.66, 40.85.142.176 |
| South Central US |191.238.184.128, 40.84.190.84, 23.102.160.153, 40.84.186.66 |
| Southeast Asia |104.215.198.156, 13.76.252.200, 23.97.51.109, 13.76.252.113 |
| West Europe |104.40.230.120, 13.80.23.64, 137.117.171.161, 13.80.8.37, 104.47.167.215, 40.118.56.193, 104.40.176.73, 40.118.56.20 |
| West US |191.236.123.146, 138.91.163.240, 168.62.194.148, 23.99.6.91 |
| West US 2 |13.66.224.156, 13.66.227.8 |
| West Central US |52.161.29.186, 52.161.27.213 |
| Canada Central |13.88.248.106, 13.88.248.110 |
| Canada East |40.86.227.82, 40.86.225.194 |
| UK North |13.87.101.18, 13.87.100.232 |
| UK South 2 |13.87.32.202, 13.87.32.226 |
