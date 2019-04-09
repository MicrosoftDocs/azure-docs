---
title: PowerShell cmdlets reference - Azure Scheduler
description: Learn about PowerShell cmdlets for Azure Scheduler
services: scheduler
ms.service: scheduler
author: derek1ee
ms.author: deli
ms.reviewer: klam
ms.assetid: 9a26c457-d7a1-4e4a-bc79-f26592155218
ms.topic: article
ms.date: 08/18/2016
---

# PowerShell cmdlets reference for Azure Scheduler

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
> is replacing Azure Scheduler, which is being retired. 
> To schedule jobs, [try Azure Logic Apps instead](../scheduler/migrate-from-scheduler-to-logic-apps.md). 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To author scripts for creating and 
managing Scheduler jobs and job collections, 
you can use PowerShell cmdlets. This article lists 
the major [PowerShell cmdlets for Azure Scheduler](/powershell/module/azurerm.scheduler) 
with links to their reference articles. 
To install Azure PowerShell for your Azure subscription, 
see [How to install and configure Azure PowerShell](/powershell/azure/overview). 
For more information about [Azure Resource Manager cmdlets](/powershell/azure/overview), 
see [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).

| Cmdlet | Description |
|--------|-------------|
| [Disable-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/disable-azrmschedulerjobcollection) |Disables a job collection. |
| [Enable-AzureRmSchedulerJobCollection](/powershell/module/azurerm.scheduler/enable-azrmschedulerjobcollection) |Enables a job collection. |
| [Get-AzSchedulerJob](/powershell/module/azurerm.scheduler/get-azrmschedulerjob) |Gets Scheduler jobs. |
| [Get-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/get-azrmschedulerjobcollection) |Gets job collections. |
| [Get-AzSchedulerJobHistory](/powershell/module/azurerm.scheduler/get-azrmschedulerjobhistory) |Gets job history. |
| [New-AzSchedulerHttpJob](/powershell/module/azurerm.scheduler/new-azrmschedulerhttpjob) |Creates an HTTP job. |
| [New-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/new-azrmschedulerjobcollection) |Creates a job collection. |
| [New-AzSchedulerServiceBusQueueJob](/powershell/module/azurerm.scheduler/new-azrmschedulerservicebusqueuejob) | Creates a Service Bus queue job. |
| [New-AzSchedulerServiceBusTopicJob](/powershell/module/azurerm.scheduler/new-azrmschedulerservicebustopicjob) |Creates a Service Bus topic job. |
| [New-AzSchedulerStorageQueueJob](/powershell/module/azurerm.scheduler/new-azrmschedulerstoragequeuejob) |Creates a Storage queue job. |
| [Remove-AzSchedulerJob](/powershell/module/azurerm.scheduler/remove-azrmschedulerjob) |Removes a Scheduler job. |
| [Remove-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/remove-azrmschedulerjobcollection) |Removes a job collection. |
| [Set-AzSchedulerHttpJob](/powershell/module/azurerm.scheduler/set-azrmschedulerhttpjob) |Modifies a Scheduler HTTP job. |
| [Set-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/set-azrmschedulerjobcollection) |Modifies a job collection. |
| [Set-AzSchedulerServiceBusQueueJob](/powershell/module/azurerm.scheduler/set-azrmschedulerservicebusqueuejob) |Modifies a Service Bus queue job. |
| [Set-AzSchedulerServiceBusTopicJob](/powershell/module/azurerm.scheduler/set-azrmschedulerservicebustopicjob) |Modifies a Service Bus topic job. |
| [Set-AzSchedulerStorageQueueJob](/powershell/module/azurerm.scheduler/set-azrmschedulerstoragequeuejob) |Modifies a Storage queue job. |
||| 

For more details, you can run any of these cmdlets: 

```
Get-Help <cmdlet name> -Detailed
Get-Help <cmdlet name> -Examples
Get-Help <cmdlet name> -Full
```

## See also

* [What is Azure Scheduler?](scheduler-intro.md)
* [Concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)
* [Create and schedule your first job - Azure portal](scheduler-get-started-portal.md)
* [Azure Scheduler REST API reference](https://msdn.microsoft.com/library/mt629143)
