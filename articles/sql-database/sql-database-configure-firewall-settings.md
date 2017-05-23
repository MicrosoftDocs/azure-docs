---
title: 'Azure portal: Azure SQL Database server-level firewall rules | Microsoft Docs'
description: Learn how to configure server-level firewall rules for IP addresses that access Azure SQL server using the Azure portal.
services: sql-database
documentationcenter: ''
author: BYHAM
manager: jhubbard
editor: ''

ms.assetid: c3b206b5-af6e-41af-8306-db12ecfc1b5d
ms.service: sql-database
ms.custom: authentication and authorization
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/21/2017
ms.author: rickbyh

---
# Create and manage Azure SQL Database server-level firewall rules using the Azure portal

Server-level firewall rules enable administrators to access a SQL Database server from a specified IP address or range of IP addresses. You can also use server-level firewall rules for users when you have many databases that have the same access requirements, and you don't want to spend time configuring each database individually. Microsoft recommends using database-level firewall rules whenever possible, to enhance security and to make your database more portable. For an overview of SQL Database firewalls, see [Overview of SQL Database firewall rules](sql-database-firewall-configure.md).

> [!Note]
> For information about portable databases in the context of business continuity, see [Authentication requirements for disaster recovery](sql-database-geo-replication-security-config.md).
>

[!INCLUDE [Create SQL Database firewall rule](../../includes/sql-database-create-new-server-firewall-portal.md)]

## Manage existing server-level firewall rules through the Azure portal
Repeat the steps to manage the server-level firewall rules.

* To add the current computer, click Add client IP.
* To add additional IP addresses, type in the Rule Name, Start IP Address, and End IP Address.
* To modify an existing rule, click any of the fields in the rule and modify.
* To delete an existing rule, hover over the rule until the X appears at the end of the row. Click X to remove the rule.

Click **Save** to save the changes.

## Next steps

- For a tutorial provisioning and connecting to a server using server-level firewalls, see [Tutorial: Provision and access an Azure SQL database using the Azure portal and SQL Server Management Studio](sql-database-get-started.md).
- For a tutorial with SQL Server authentication and database-level firewalls, see [SQL authentication and authorization](sql-database-control-access-sql-authentication-get-started.md)
- For help in connecting to an Azure SQL database from open source or third-party applications, see [Client quick-start code samples to SQL Database](https://msdn.microsoft.com/library/azure/ee336282.aspx).
- To understand how to create additional users who can connect to databases, see [SQL Database Authentication and Authorization: Granting Access](https://msdn.microsoft.com/library/azure/ee336235.aspx).

## Additional resources
* [Securing your database](sql-database-security-overview.md)   
* [Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589)   



