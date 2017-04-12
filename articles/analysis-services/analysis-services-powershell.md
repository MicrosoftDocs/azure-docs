---
title: Manage Azure Analysis Services with PowerShell | Microsoft Docs
description: Azure Analysis Services management with PowerShell.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: erikre
editor: 

ms.assetid: 
ms.service: analysis-services
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/28/2017
ms.author: owend

---

# Manage Azure Analysis Services with PowerShell

This article describes PowerShell cmdlets used to perform Azure Analysis Services server and database management tasks. 

Server management tasks such as creating or deleting a server, suspending or resuming server operations, or changing the service level (tier) use Azure Resource Manager (AzureRM) cmdlets. Other tasks for managing databases such as adding or removing role members, processing, or partitioning use the same cmdlets in the [SQLASCMDLETS](https://msdn.microsoft.com/library/hh758425.aspx) module as SQL Server Analysis Services.

## Permissions
Most PowerShell tasks require you have Admin privileges on the Analysis Services server you are managing. Scheduled PowerShell tasks are unattended operations. The account running the scheduler must have Admin privileges on the Analysis Services server. 

For server operations using AzureRm cmdlets, your account or the account running scheduler must also belong to the Owner role for the resource in [Azure Role-Based Access Control (RBAC)](../active-directory/role-based-access-control-what-is.md). 

## Server operations 
Azure Analysis Services cmdlets are included in the [AzureRM.AnalysisServices](https://www.powershellgallery.com/packages/AzureRM.AnalysisServices) component module. To install AzureRM cmdlet modules, see [Azure Resource Manager cmdlets](https://docs.microsoft.com/powershell/resourcemanager/) in the PowerShell Gallery.

|Cmdlet|Description| 
|------------|-----------------| 
|[Get-AzureRmAnalysisServicesServer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.analysisservices/v3.0.0/get-azurermanalysisservicesserver)|Gets details of a server instance.|  
|[New-AzureRmAnalysisServicesServer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.analysisservices/v3.0.0/new-azurermanalysisservicesserver)|Creates a new server instance.|
|[Remove-AzureRmAnalysisServicesServer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.analysisservices/v3.0.0/remove-azurermanalysisservicesserver)|Removes a server instance.|  
|[Suspend-AzureRmAnalysisServicesServe](https://docs.microsoft.com/powershell/resourcemanager/azurerm.analysisservices/v3.0.0/suspend-azurermanalysisservicesserver)|Suspends a server instance.| 
|[Resume-AzureRmAnalysisServicesServer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.analysisservices/v3.0.0/resume-azurermanalysisservicesserver)|Resumes a server instance.|  
|[Set-AzureRmAnalysisServicesServer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.analysisservices/v3.0.0/set-azurermanalysisservicesserver)|Modifies a server instance.|   
|[Test-AzureRmAnalysisServicesServer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.analysisservices/v3.0.0/test-azurermanalysisservicesserver)|Tests the existence of a server  instance.| 

## Database operations
Azure Analysis Services database operations use the same [SQLASCMDLETS](https://msdn.microsoft.com/library/hh758425.aspx) module as SQL Server Analysis Services. However, not all cmdlets are supported for Azure Analysis Services Preview. 

The SQLASCMDLETS module provides task-specific database management cmdlets as well as the general purpose Invoke-ASCmd cmdlet that accepts a Tabular Model Scripting Language (TMSL) query or script. The following cmdlets in the SQLASCMDLETS module are supported for Azure Analysis Services Preview.
  
|Cmdlet|Description|
|------------|-----------------| 
|[Add-RoleMember](https://msdn.microsoft.com/library/hh510167.aspx)|Add a member to a database role.| 
|[Remove-RoleMember](https://msdn.microsoft.com/library/hh510173.aspx)|Remove a member from a database role.|   
|[Invoke-ASCmd](https://msdn.microsoft.com/library/hh479579.aspx)|Execute a TMSL script.|
|[Invoke-ProcessASDatabase](https://msdn.microsoft.com/library/mt651773.aspx)|Process a database.|  
|[Invoke-ProcessPartition](https://msdn.microsoft.com/library/hh510164.aspx)|Process a partition.| 
|[Invoke-ProcessTable](https://msdn.microsoft.com/library/mt651774.aspx)|Process a table.|  
|[Merge-Partition](https://msdn.microsoft.com/library/hh479576.aspx)|Merge a partition.|  
  

## Related information
* [PowerShell scripting in Analysis Services](https://msdn.microsoft.com/library/hh213141.aspx).
* [Tabular Model Programming for Compatibility Level 1200](https://msdn.microsoft.com/library/mt712541.aspx)