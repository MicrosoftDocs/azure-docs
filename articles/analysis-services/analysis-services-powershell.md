---
title: Manage Azure Analysis Services with PowerShell | Microsoft Docs
description: Azure Analysis Services management with PowerShell.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: reference
ms.date: 06/25/2018
ms.author: owend
ms.reviewer: minewiskan

---

# Manage Azure Analysis Services with PowerShell

This article describes PowerShell cmdlets used to perform Azure Analysis Services server and database management tasks. 

Server management tasks such as creating or deleting a server, suspending or resuming server operations, or changing the service level (tier) use Azure Resource Manager (resource) cmdlets and Analysis Services (server) cmdlets. Other tasks for managing databases such as adding or removing role members, processing, or partitioning use cmdlets included in the same SqlServer module as SQL Server Analysis Services.

## Permissions
Most PowerShell tasks require you have Admin privileges on the Analysis Services server you are managing. Scheduled PowerShell tasks are unattended operations. The account or service principle running the scheduler must have Admin privileges on the Analysis Services server. 

For server operations using AzureRm cmdlets, your account or the account running scheduler must also belong to the Owner role for the resource in [Azure Role-Based Access Control (RBAC)](../role-based-access-control/overview.md). 

## Resource management operations 
Module - [AzureRM.AnalysisServices](https://www.powershellgallery.com/packages/AzureRM.AnalysisServices)

|Cmdlet|Description| 
|------------|-----------------| 
|[Get-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/get-azurermanalysisservicesserver)|Gets details of a server instance.|  
|[New-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/new-azurermanalysisservicesserver)|Creates a server instance.|   
|[New-AzureRmAnalysisServicesFirewallConfig](/powershell/module/azurerm.analysisservices/new-azurermanalysisservicesfirewallconfig)|Creates a new Analysis Services firewall config.|   
|[New-AzureRmAnalysisServicesFirewallRule](/powershell/module/azurerm.analysisservices/new-azurermanalysisservicesfirewallrule)|Creates a new Analysis Services firewall rule.|   
|[Remove-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/remove-azurermanalysisservicesserver)|Removes a server instance.|  
|[Resume-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/resume-azurermanalysisservicesserver)|Resumes a server instance.|  
|[Suspend-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/suspend-azurermanalysisservicesserver)|Suspends a server instance.| 
|[Set-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/set-azurermanalysisservicesserver)|Modifies a server instance.|   
|[Test-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/test-azurermanalysisservicesserver)|Tests the existence of a server  instance.| 

## Server management operations

Module - [Azure.AnalysisServices](https://www.powershellgallery.com/packages/Azure.AnalysisServices)

|Cmdlet|Description| 
|------------|-----------------| 
|[Add-AzureAnalysisServicesAccount](/powershell/module/azure.analysisservices/add-azureanalysisservicesaccount)|Adds an authenticated account to use for Azure Analysis Services server cmdlet requests.| 
|[Export-AzureAnalysisServicesInstance](/powershell/module/azurerm.analysisservices/export-azureanalysisservicesinstancelog)|Exports a log from an instance of Analysis Services server in the currently logged in Environment as specified in Add-AzureAnalysisServicesAccount command|  
|[Restart-AzureAnalysisServicesInstance](/powershell/module/azurerm.analysisservices/restart-azureanalysisservicesinstance)|Restarts an instance of Analysis Services server in the currently logged in environment; specified in Add-AzureAnalysisServicesAccount command.|  
|[Sync-AzureAnalysisServicesInstance](/powershell/module/azurerm.analysisservices/restart-azureanalysisservicesinstance)|Synchronizes a specified database on the specified instance of Analysis Services server to all the query scaleout instances in the currently logged in Environment as specified in Add-AzureAnalysisServicesAccount command|  

## Database operations

Azure Analysis Services database operations use the same [SqlServer module](https://www.powershellgallery.com/packages/SqlServer) as SQL Server Analysis Services. However, not all cmdlets are supported for Azure Analysis Services. To learn more see, [SQL Server PowerShell](https://docs.microsoft.com/sql/powershell/sql-server-powershell).

The SqlServer module provides task-specific database management cmdlets as well as the general-purpose Invoke-ASCmd cmdlet that accepts a Tabular Model Scripting Language (TMSL) query or script. The following cmdlets in the SqlServer module are supported for Azure Analysis Services.

  
|Cmdlet|Description|
|------------|-----------------| 
|[Add-RoleMember](https://docs.microsoft.com/powershell/module/sqlserver/Add-RoleMember)|Add a member to a database role.| 
|[Backup-ASDatabase](https://docs.microsoft.com/powershell/module/sqlserver/backup-asdatabase)|Backup an Analysis Services database.|  
|[Remove-RoleMember](https://docs.microsoft.com/powershell/module/sqlserver/remove-rolemember)|Remove a member from a database role.|   
|[Invoke-ASCmd](https://docs.microsoft.com/powershell/module/sqlserver/invoke-ascmd)|Execute a TMSL script.|
|[Invoke-ProcessASDatabase](https://docs.microsoft.com/powershell/module/sqlserver/invoke-processasdatabase)|Process a database.|  
|[Invoke-ProcessPartition](https://docs.microsoft.com/powershell/module/sqlserver/invoke-processpartition)|Process a partition.| 
|[Invoke-ProcessTable](https://docs.microsoft.com/powershell/module/sqlserver/invoke-processtable)|Process a table.|  
|[Merge-Partition](https://docs.microsoft.com/powershell/module/sqlserver/merge-partition)|Merge a partition.|  
|[Restore-ASDatabase](https://docs.microsoft.com/powershell/module/sqlserver/restore-asdatabase)|Restore an Analysis Services database.| 
  

## Related information

* [Download SQL Server PowerShell Module](https://docs.microsoft.com/sql/ssms/download-sql-server-ps-module)   
* [Download SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)   
* [SqlServer module in PowerShell Gallery](https://www.powershellgallery.com/packages/SqlServer)    
* [Tabular Model Programming for Compatibility Level 1200 and higher](https://msdn.microsoft.com/library/mt712541.aspx)
