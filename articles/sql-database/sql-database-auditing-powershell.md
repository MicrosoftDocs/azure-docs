---
title: 'PowerShell: Manage Azure SQL Database Auditing | Microsoft Docs'
description: Configure Azure SQL Database auditing with PowerShell to track database events and write them to an audit log in your Azure Storage account.
services: sql-database
documentationcenter: ''
author: ronitr
manager: jhubbard
editor: giladm

ms.assetid: 89c2a155-c2fb-4b67-bc19-9b4e03c6d3bc
ms.service: sql-database
ms.custom: secure and protect
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/05/2016
ms.author: ronitr; giladm

---
# Configure and manage SQL database auditing using PowerShell

The following section describes how to configure and manage auditing using PowerShell. To configure and manage auditing using the Azure portal, see [Configure auditing in the Azure portal](sql-database-auditing-portal.md). To configure and manage auditing using the REST API, see [Configure auditing with the REST API](sql-database-auditing-rest.md).

For an overview of auditing, see [SQL Database auditing](sql-database-auditing.md).

## PowerShell cmdlets

   * [Get-AzureRMSqlDatabaseAuditingPolicy][101]
   * [Get-AzureRMSqlServerAuditingPolicy][102]
   * [Remove-AzureRMSqlDatabaseAuditing][103]
   * [Remove-AzureRMSqlServerAuditing][104]
   * [Set-AzureRMSqlDatabaseAuditingPolicy][105]
   * [Set-AzureRMSqlServerAuditingPolicy][106]
   * [Use-AzureRMSqlServerAuditingPolicy][107]

## Next steps

* To configure and manage auditing using the Azure portal, see [Configure database auditing in the Azure portal](sql-database-auditing-portal.md). 
* To configure and manage auditing using PowerShell, see [Configure database auditing with the REST API](sql-database-auditing-rest.md).
* For an overview of auditing, see [Database auditing](sql-database-auditing.md).


[101]: https://msdn.microsoft.com/en-us/library/azure/mt603731(v=azure.200).aspx
[102]: https://msdn.microsoft.com/en-us/library/azure/mt619329(v=azure.200).aspx
[103]: https://msdn.microsoft.com/en-us/library/azure/mt603796(v=azure.200).aspx
[104]: https://msdn.microsoft.com/en-us/library/azure/mt603574(v=azure.200).aspx
[105]: https://msdn.microsoft.com/en-us/library/azure/mt603531(v=azure.200).aspx
[106]: https://msdn.microsoft.com/en-us/library/azure/mt603794(v=azure.200).aspx
[107]: https://msdn.microsoft.com/en-us/library/azure/mt619353(v=azure.200).aspx
