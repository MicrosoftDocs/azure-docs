---
title: DNS Alias
titleSuffix: Azure Synapse Analytics
description: Your applications can connect to an alias for the name of the logical server. You can change alias anytime, to facilitate testing and so on.
author: joannapea
ms.author: joanpo
ms.reviewer: rsetlem, wiassaf
ms.date: 05/29/2026
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: concept-article
---
# DNS alias for standalone dedicated SQL pools (formerly SQL DW)

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

For standalone dedicated SQL pools that aren't in a Synapse workspace, you can configure a custom Domain Name System (DNS) server. PowerShell and REST APIs accept [calls to create and manage DNS aliases](#anchor-powershell-code-62x) for your [logical SQL server](../sql/logical-servers.md) name.

Only standalone dedicated SQL pools (formerly DW) support the Azure SQL logical server DNS alias. For dedicated SQL pools in Azure Synapse workspaces, the DNS alias isn't currently supported. [What's the difference?](https://aka.ms/dedicatedSQLpooldiff)

Use a *DNS alias* in place of the server name. Client programs can use the alias in their connection strings. The DNS alias provides a translation layer that can redirect your client programs to different servers. This layer spares you the difficulties of having to find and edit all the clients and their connection strings.

Common uses for a DNS alias include the following cases:

- Create an easy-to-remember name for a server.
- During initial development, your alias can refer to a test server. When the application goes live, you can modify the alias to refer to the production server. The transition from test to production doesn't require any modification to the clients that connect to the server.
- Suppose the only database in your application is moved to another server. You can modify the alias without having to modify the configurations of several clients.

## Domain Name System (DNS) of the Internet

The Internet relies on the DNS. The DNS translates your friendly names into the name of your server.

## Scenarios with one DNS alias

Suppose you need to switch your system to a new server. In the past, you needed to find and update every connection string in every client program. But now, if the connection strings use a DNS alias, you only need to update an alias property.

The DNS alias feature can help in the following scenarios:

### Test to production

When you start developing the client programs, have them use a DNS alias in their connection strings. You make the properties of the alias point to a test version of your server.

Later when the new system goes live in production, you can update the properties of the alias to point to the production server. No change to the client programs is necessary.

### Cross-region support

A disaster recovery might shift your server to a different geographic region. For a system that was using a DNS alias, the need to find and update all the connection strings for all clients can be avoided. Instead, you can update an alias to refer to the new server that now hosts your dedicated SQL pool.

## Properties of a DNS alias

The following properties apply to each DNS alias for your server:

- *Unique name:* Each alias name you create is unique across all servers, just as server names are.
- *Server is required:* A DNS alias can't be created unless it references exactly one server, and the server must already exist. An updated alias must always reference exactly one existing server.
  - When you drop a server, the Azure system also drops all DNS aliases that refer to the server.
- *Not bound to any region:* DNS aliases aren't bound to a region. You can update any DNS alias to refer to a server that resides in any geographic region.
- *Permissions:* To manage a DNS alias, you must have *Server Contributor* permissions, or higher. For more information, see [Get started with Azure role-based access control in the Azure portal](/azure/role-based-access-control/overview).

## Manage your DNS aliases

Use REST APIs or PowerShell cmdlets to programmatically manage your DNS aliases.

### Use REST APIs to manage DNS aliases

For more information on the REST APIs, see [Azure SQL Database REST API](/rest/api/sql/server-dns-aliases).

<a name="anchor-powershell-code-62x"></a>

### Use PowerShell to manage DNS aliases

PowerShell cmdlets are available that call the REST APIs. For PowerShell samples, see: [PowerShell for DNS Alias to Azure SQL Database](dns-alias-powershell-create.md).

The cmdlets used in the code example are the following:

- [New-AzSqlServerDnsAlias](/powershell/module/az.Sql/New-azSqlServerDnsAlias): Creates a new DNS alias in the Azure SQL Database service system. The alias refers to server 1.
- [Get-AzSqlServerDnsAlias](/powershell/module/az.Sql/Get-azSqlServerDnsAlias): Gets and lists all the DNS aliases that are assigned to server 1.
- [Set-AzSqlServerDnsAlias](/powershell/module/az.Sql/Set-azSqlServerDnsAlias): Modifies the server name that the alias is configured to refer to, from server 1 to server 2.
- [Remove-AzSqlServerDnsAlias](/powershell/module/az.Sql/Remove-azSqlServerDnsAlias): Removes the DNS alias from server 2, by using the name of the alias.

> [!NOTE]
> This article uses the Azure Az PowerShell module, which is the recommended PowerShell module for interacting with Azure. To get started with the Az PowerShell module, see [Install Azure PowerShell](/powershell/azure/install-az-ps). To learn how to migrate to the Az PowerShell module, see [Migrate Azure PowerShell from AzureRM to Az](/powershell/azure/migrate-from-azurerm-to-az).

> [!IMPORTANT]
> The PowerShell Azure Resource Manager (AzureRM) module was deprecated on February 29, 2024. All future development should use the Az.Sql module. Users are advised to migrate from AzureRM to the Az PowerShell module to ensure continued support and updates. The AzureRM module is no longer maintained or supported. The arguments for the commands in the Az PowerShell module and in the AzureRM modules are substantially identical. For more about their compatibility, see [Introducing the new Az PowerShell module](/powershell/azure/new-azureps-module-az).

## Limitations

Currently, a DNS alias has the following limitations:

- *Delay of up to 2 minutes:* It takes up to 2 minutes for a DNS alias to be updated or removed.
  - Regardless of any brief delay, the alias immediately stops referring client connections to the legacy server.
- *DNS lookup:* For now, the only authoritative way to check what server a given DNS alias refers to is by performing a [DNS lookup](/windows-server/administration/windows-commands/nslookup).
- DNS alias is subject to [naming restrictions](/azure/azure-resource-manager/management/resource-name-rules).

## Related content

- [Server DNS Aliases API](/rest/api/sql/server-dns-aliases)
- [PowerShell for DNS Alias to Azure SQL Database](dns-alias-powershell-create.md)
