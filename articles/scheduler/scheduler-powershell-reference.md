---
title: PowerShell cmdlets reference
description: Learn about PowerShell cmdlets for Azure Scheduler.
services: scheduler
ms.service: scheduler
author: derek1ee
ms.author: deli
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 02/15/2022
---

# PowerShell cmdlets reference for Azure Scheduler

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) has replaced Azure Scheduler, which is fully deprecated since January 31, 2022. 
> Please migrate your Azure Scheduler jobs by recreating them as workflows in Azure Logic Apps following the steps in this article. 
> Azure Scheduler is longer available in the Azure portal. The [Azure Scheduler REST API](/rest/api/scheduler) and 
> [Azure Scheduler PowerShell cmdlets](scheduler-powershell-reference.md) no longer work.

To author scripts for creating and managing Scheduler jobs and job collections, you can use PowerShell cmdlets. This article lists the major PowerShell cmdlets for Azure Scheduler with links to their reference articles. To install Azure PowerShell for your Azure subscription, see [How to install and configure Azure PowerShell](/powershell/azure/). For more information about [Azure Resource Manager cmdlets](/powershell/azure/), 
see [Using Azure PowerShell with Azure Resource Manager](../azure-resource-manager/management/manage-resources-powershell.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

| Cmdlet | Description |
|--------|-------------|
| [Disable-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/disable-azurermschedulerjobcollection) |Disables a job collection. |
| [Enable-AzureRmSchedulerJobCollection](/powershell/module/azurerm.scheduler/enable-azurermschedulerjobcollection) |Enables a job collection. |
| [Get-AzSchedulerJob](/powershell/module/azurerm.scheduler/get-azurermschedulerjob) |Gets Scheduler jobs. |
| [Get-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/get-azurermschedulerjobcollection) |Gets job collections. |
| [Get-AzSchedulerJobHistory](/powershell/module/azurerm.scheduler/get-azurermschedulerjobhistory) |Gets job history. |
| [New-AzSchedulerHttpJob](/powershell/module/azurerm.scheduler/new-azurermschedulerhttpjob) |Creates an HTTP job. |
| [New-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/new-azurermschedulerjobcollection) |Creates a job collection. |
| [New-AzSchedulerServiceBusQueueJob](/powershell/module/azurerm.scheduler/new-azurermschedulerservicebusqueuejob) | Creates a Service Bus queue job. |
| [New-AzSchedulerServiceBusTopicJob](/powershell/module/azurerm.scheduler/new-azurermschedulerservicebustopicjob) |Creates a Service Bus topic job. |
| [New-AzSchedulerStorageQueueJob](/powershell/module/azurerm.scheduler/new-azurermschedulerstoragequeuejob) |Creates a Storage queue job. |
| [Remove-AzSchedulerJob](/powershell/module/azurerm.scheduler/remove-azurermschedulerjob) |Removes a Scheduler job. |
| [Remove-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/remove-azurermschedulerjobcollection) |Removes a job collection. |
| [Set-AzSchedulerHttpJob](/powershell/module/azurerm.scheduler/set-azurermschedulerhttpjob) |Modifies a Scheduler HTTP job. |
| [Set-AzSchedulerJobCollection](/powershell/module/azurerm.scheduler/set-azurermschedulerjobcollection) |Modifies a job collection. |
| [Set-AzSchedulerServiceBusQueueJob](/powershell/module/azurerm.scheduler/set-azurermschedulerservicebusqueuejob) |Modifies a Service Bus queue job. |
| [Set-AzSchedulerServiceBusTopicJob](/powershell/module/azurerm.scheduler/set-azurermschedulerservicebustopicjob) |Modifies a Service Bus topic job. |
| [Set-AzSchedulerStorageQueueJob](/powershell/module/azurerm.scheduler/set-azurermschedulerstoragequeuejob) |Modifies a Storage queue job. |
||| 

For more details, you can run any of these cmdlets: 

```text
Get-Help <cmdlet name> -Detailed
Get-Help <cmdlet name> -Examples
Get-Help <cmdlet name> -Full
```

## Next steps

* [Azure Scheduler concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)
* [Azure Scheduler limits, defaults, and error codes](scheduler-limits-defaults-errors.md)
* [Azure Scheduler REST API reference](/rest/api/scheduler)