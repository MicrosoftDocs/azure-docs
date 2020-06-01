---
title: DNS alias
description: Your applications can connect to an alias for the name of the server for Azure SQL Database. Meanwhile, you can change the SQL Database the alias points to anytime, to facilitate testing and so on.
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: seo-lt-2019 sqldbrb=1
ms.devlang:
ms.topic: conceptual
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: genemi, jrasnick, vanto
ms.date: 06/26/2019
---
# DNS alias for Azure SQL Database
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]

Azure SQL Database has a Domain Name System (DNS) server. PowerShell and REST APIs accept [calls to create and manage DNS aliases](#anchor-powershell-code-62x) for your [logical SQL server](logical-servers.md) name.

A *DNS alias* can be used in place of the server name. Client programs can use the alias in their connection strings. The DNS alias provides a translation layer that can redirect your client programs to different servers. This layer spares you the difficulties of having to find and edit all the clients and their connection strings.

Common uses for a DNS alias include the following cases:

- Create an easy to remember name for a server.
- During initial development, your alias can refer to a test server. When the application goes live, you can modify the alias to refer to the production server. The transition from test to production does not require any modification to the configurations several clients that connect to the server.
- Suppose the only database in your application is moved to another server. You can modify the alias without having to modify the configurations of several clients.
- During a regional outage you use geo-restore to recover your database in a different server and region. You can modify your existing alias to point to the new server so that the existing client application could re-connect to it.

## Domain Name System (DNS) of the Internet

The Internet relies on the DNS. The DNS translates your friendly names into the name of your server.

## Scenarios with one DNS alias

Suppose you need to switch your system to a new server. In the past you needed to find and update every connection string in every client program. But now, if the connection strings use a DNS alias, only an alias property must be updated.

The DNS alias feature of Azure SQL Database can help in the following scenarios:

### Test to production

When you start developing the client programs, have them use a DNS alias in their connection strings. You make the properties of the alias point to a test version of your server.

Later when the new system goes live in production, you can update the properties of the alias to point to the production server. No change to the client programs is necessary.

### Cross-region support

A disaster recovery might shift your server to a different geographic region. For a system that was using a DNS alias, the need to find and update all the connection strings for all clients can be avoided. Instead, you can update an alias to refer to the new server that now hosts your Azure SQL Database.

## Properties of a DNS alias

The following properties apply to each DNS alias for your server:

- *Unique name:* Each alias name you create is unique across all servers, just as server names are.
- *Server is required:* A DNS alias cannot be created unless it references exactly one server, and the server must already exist. An updated alias must always reference exactly one existing server.
  - When you drop a server, the Azure system also drops all DNS aliases that refer to the server.
- *Not bound to any region:* DNS aliases are not bound to a region. Any DNS aliases can be updated to refer to a server that resides in any geographic region.
  - However, when updating an alias to refer to another server, both servers must exist in the same Azure *subscription*.
- *Permissions:* To manage a DNS alias, the user must have *Server Contributor* permissions, or higher. For more information, see [Get started with Role-Based Access Control in the Azure portal](../../role-based-access-control/overview.md).

## Manage your DNS aliases

Both REST APIs and PowerShell cmdlets are available to enable you to programmatically manage your DNS aliases.

### REST APIs for managing your DNS aliases

The documentation for the REST APIs is available near the following web location:

- [Azure SQL Database REST API](https://docs.microsoft.com/rest/api/sql/)

Also, the REST APIs can be seen in GitHub at:

- [Azure SQL Database DNS alias REST APIs](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/sql/resource-manager/Microsoft.Sql/preview/2017-03-01-preview/serverDnsAliases.json)

<a name="anchor-powershell-code-62x"></a>

### PowerShell for managing your DNS aliases

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

PowerShell cmdlets are available that call the REST APIs.

A code example of PowerShell cmdlets being used to manage DNS aliases is documented at:

- [PowerShell for DNS Alias to Azure SQL Database](dns-alias-powershell-create.md)

The cmdlets used in the code example are the following:

- [New-AzSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/az.Sql/New-azSqlServerDnsAlias): Creates a new DNS alias in the Azure SQL Database service system. The alias refers to server 1.
- [Get-AzSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/az.Sql/Get-azSqlServerDnsAlias): Get and list all the DNS aliases that are assigned to server 1.
- [Set-AzSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/az.Sql/Set-azSqlServerDnsAlias): Modifies the server name that the alias is configured to refer to, from server 1 to server 2.
- [Remove-AzSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/az.Sql/Remove-azSqlServerDnsAlias): Remove the DNS alias from server 2, by using the name of the alias.

## Limitations during preview

Presently, a DNS alias has the following limitations:

- *Delay of up to 2 minutes:* It takes up to 2 minutes for a DNS alias to be updated or removed.
  - Regardless of any brief delay, the alias immediately stops referring client connections to the legacy server.
- *DNS lookup:* For now, the only authoritative way to check what server a given DNS alias refers to is by performing a [DNS lookup](https://docs.microsoft.com/windows-server/administration/windows-commands/nslookup).
- _Table auditing is not supported:_ You cannot use a DNS alias on a server that has *table auditing* enabled on a database.
  - Table auditing is deprecated.
  - We recommend that you move to [Blob Auditing](../../azure-sql/database/auditing-overview.md).

## Related resources

- [Overview of business continuity with Azure SQL Database](business-continuity-high-availability-disaster-recover-hadr-overview.md), including disaster recovery.

## Next steps

- [PowerShell for DNS Alias to Azure SQL Database](dns-alias-powershell-create.md)
