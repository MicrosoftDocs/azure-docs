---
title: Manage Azure Analysis Services with PowerShell | Microsoft Docs
description: Describes Azure Analysis Services PowerShell cmdlets for common administrative tasks such as creating servers, suspending operations, or changing service level.
author: minewiskan
ms.service: analysis-services
ms.topic: conceptual
ms.date: 04/27/2021
ms.author: owend
ms.reviewer: minewiskan

---

# Manage Azure Analysis Services with PowerShell

This article describes PowerShell cmdlets used to perform Azure Analysis Services server and database management tasks. 

Server resource management tasks like creating or deleting a server, suspending or resuming server operations, or changing the service level (tier) use Azure Analysis Services cmdlets. Other tasks for managing databases like adding or removing role members, processing, or partitioning use cmdlets included in the same SqlServer module as SQL Server Analysis Services.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Permissions

Most PowerShell tasks require you have Admin privileges on the Analysis Services server you are managing. Scheduled PowerShell tasks are unattended operations. The account or service principal running the scheduler must have Admin privileges on the Analysis Services server. 

For server operations using Azure PowerShell cmdlets, your account or the account running scheduler must also belong to the Owner role for the resource in [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). 

## Resource and server operations 

Install module - [Az.AnalysisServices](https://www.powershellgallery.com/packages/Az.AnalysisServices)   
Documentation - [Az.AnalysisServices reference](/powershell/module/az.analysisservices)

## Database operations

Azure Analysis Services database operations use the same SqlServer module as SQL Server Analysis Services. However, not all cmdlets are supported for Azure Analysis Services. 

The SqlServer module provides task-specific database management cmdlets as well as the general-purpose Invoke-ASCmd cmdlet that accepts a Tabular Model Scripting Language (TMSL) query or script. The following cmdlets in the SqlServer module are supported for Azure Analysis Services.

Install module - [SqlServer](https://www.powershellgallery.com/packages/SqlServer)   
Documentation - [SqlServer reference](/powershell/module/sqlserver)

### Supported cmdlets

|Cmdlet|Description|
|------------|-----------------| 
|[Add-RoleMember](/powershell/module/sqlserver/Add-RoleMember)|Add a member to a database role.| 
|[Backup-ASDatabase](/powershell/module/sqlserver/backup-asdatabase)|Backup an Analysis Services database.|  
|[Remove-RoleMember](/powershell/module/sqlserver/remove-rolemember)|Remove a member from a database role.|   
|[Invoke-ASCmd](/powershell/module/sqlserver/invoke-ascmd)|Execute a TMSL script.|
|[Invoke-ProcessASDatabase](/powershell/module/sqlserver/invoke-processasdatabase)|Process a database.|  
|[Invoke-ProcessPartition](/powershell/module/sqlserver/invoke-processpartition)|Process a partition.| 
|[Invoke-ProcessTable](/powershell/module/sqlserver/invoke-processtable)|Process a table.|  
|[Merge-Partition](/powershell/module/sqlserver/merge-partition)|Merge a partition.|  
|[Restore-ASDatabase](/powershell/module/sqlserver/restore-asdatabase)|Restore an Analysis Services database.| 
  

## Related information

* [SQL Server PowerShell](/sql/powershell/sql-server-powershell)      
* [Download SQL Server PowerShell Module](/sql/ssms/download-sql-server-ps-module)   
* [Download SSMS](/sql/ssms/download-sql-server-management-studio-ssms)   
* [SqlServer module in PowerShell Gallery](https://www.powershellgallery.com/packages/SqlServer)    
* [Tabular Model Programming for Compatibility Level 1200 and higher](/analysis-services/tabular-model-programming-compatibility-level-1200/tabular-model-programming-for-compatibility-level-1200)