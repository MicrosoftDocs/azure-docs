---
title: DNS alias for Azure SQL Database | Microsoft Docs
description: Your applications can connect to an alias for the name of your Azure SQL Database server. Meanwhile, you can change the SQL Database the alias points to anytime, to facilitate testing and so on.
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang:
ms.topic: conceptual
author: DhruvMsft 
ms.author: dmalik
ms.reviewer: genemi,ayolubek
manager: craigg
ms.date: 02/05/2018
---
# DNS alias for Azure SQL Database

Azure SQL Database has a Domain Name System (DNS) server. PowerShell and REST APIs accept [calls to create and manage DNS aliases](#anchor-powershell-code-62x) for your SQL Database server name.

A *DNS alias* can be used in place of the Azure SQL Database server name. Client programs can use the alias in their connection strings. The DNS alias provides a translation layer that can redirect your client programs to different servers. This layer spares you the difficulties of having to find and edit all the clients and their connection strings.

Common uses for a DNS alias include the following cases:

- Create an easy to remember name for an Azure SQL Server.
- During initial development, your alias can refer to a test SQL Database server. When the application goes live, you can modify the alias to refer to the production server. The transition from test to production does not require any modification to the configurations several clients that connect to the database server.
- Suppose the only database in your application is moved to another SQL Database server. Here you can modify the alias without having to modify the configurations of several clients.

#### Domain Name System (DNS) of the Internet

The Internet relies on the DNS. The DNS translates your friendly names into the name of your Azure SQL Database server.

## Scenarios with one DNS alias

Suppose you need to switch your system to a new Azure SQL Database server. In the past you needed to find and update every connection string in every client program. But now, if the connection strings use a DNS alias, only an alias property must be updated.

The DNS alias feature of Azure SQL Database can help in the following scenarios:

#### Test to production

When you start developing the client programs, have them use a DNS alias in their connection strings. You make the properties of the alias point to a test version of your Azure SQL Database server.

Later when the new system goes live in production, you can update the properties of the alias to point to the production SQL Database server. No change to the client programs is necessary.

#### Cross-region support

A disaster recovery might shift your SQL Database server to a different geographic region. For a system than was using a DNS alias, the need to find and update all the connection strings for all clients can be avoided. Instead, you can update an alias to refer to the new SQL Database server that now hosts your database.




## Properties of a DNS alias

The following properties apply to each DNS alias for your SQL Database server:

- *Unique name:* Each alias name you create is unique across all Azure SQL Database servers, just as server names are.

- *Server is required:* A DNS alias cannot be created unless it references exactly one server, and the server must already exist. An updated alias must always reference exactly one existing server.
    - When you drop a SQL Database server, the Azure system also drops all DNS aliases that refer to the server.

- *Not bound to any region:* DNS aliases are not bound to a region. Any DNS aliases can be updated to refer to an Azure SQL Database server that resides in any geographic region.
    - However, when updating an alias to refer to another server, both servers must exist in the same Azure *subscription*.

- *Permissions:* To manage a DNS alias, the user must have *Server Contributor* permissions, or higher. For more information, see [Get started with Role-Based Access Control in the Azure portal](../role-based-access-control/overview.md).





## Manage your DNS aliases

Both REST APIs and PowerShell cmdlets are available to enable you to programmatically manage your DNS aliases.

#### REST APIs for managing your DNS aliases

<!-- TODO
??2 "soon" in the following live sentence, is not the best situation.
TODO update this subsection very soon after REST API docu goes live.
Dev = Magda Bojarska
Comment as of:  2018-01-26
-->

The documentation for the REST APIs is available near the following web location:
- [Azure SQL Database REST API](https://docs.microsoft.com/rest/api/sql/)

Also, the REST APIs can be seen in GitHub at:
- [Azure SQL Database server, DNS alias REST APIs](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/sql/resource-manager/Microsoft.Sql/preview/2017-03-01-preview/serverDnsAliases.json)

<a name="anchor-powershell-code-62x"/>

#### PowerShell for managing your DNS aliases

PowerShell cmdlets are available that call the REST APIs.

A code example of PowerShell cmdlets being used to manage DNS aliases is documented at:
- [PowerShell for DNS Alias to Azure SQL Database](dns-alias-powershell.md)


The cmdlets used in the code example are the following:
- [New-AzureRMSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/AzureRM.Sql/New-AzureRmSqlServerDnsAlias?view=azurermps-5.1.1): Creates a new DNS alias in the Azure SQL Database service system. The alias refers to Azure SQL Database server 1.
- [Get-AzureRMSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/AzureRM.Sql/Get-AzureRmSqlServerDnsAlias?view=azurermps-5.1.1): Get and list all the DNS aliases that are assigned to SQL DB server 1.
- [Set-AzureRMSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/AzureRM.Sql/Set-AzureRmSqlServerDnsAlias?view=azurermps-5.1.1): Modifies the server name that the alias is configured to refer to, from server 1 to SQL DB server 2.
- [Remove-AzureRMSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/AzureRM.Sql/Remove-AzureRmSqlServerDnsAlias?view=azurermps-5.1.1): Remove the DNS alias from SQL DB server 2, by using the name of the alias.


The preceding cmdlets were added to the **AzureRM.Sql** module starting with module version 5.1.1.




## Limitations during preview

Presently, a DNS alias has the following limitations:

- *Delay of up to 2 minutes:* It takes up to 2 minutes for a DNS alias to be updated or removed.
    - Regardless of any brief delay, the alias immediately stops referring client connections to the legacy server.

- *DNS lookup:* For now, the only authoritative way to check what server a given DNS alias refers to is by performing a [DNS lookup](https://docs.microsoft.com/windows-server/administration/windows-commands/nslookup).

- *[Table auditing is not supported](sql-database-auditing-and-dynamic-data-masking-downlevel-clients.md):* You cannot use a DNS alias on an Azure SQL Database server that has *table auditing* enabled on a database.
    - Table auditing is deprecated.
    - We recommend that you move to [Blob Auditing](sql-database-auditing.md).




## Related resources

- [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md), including disaster recovery.



## Next steps

- [PowerShell for DNS Alias to Azure SQL Database](dns-alias-powershell.md)

