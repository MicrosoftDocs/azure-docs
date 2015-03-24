<properties 
   pageTitle="Schedules"
   description="Schedules"
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/16/2015"
   ms.author="bwren" />

# Schedules

Automation Schedules are used to schedule runbooks to run automatically.  This could be either a single date and time for the runbook to run once.  Or it could be a recurring schedule to start the runbook multiple times.  Schedules are typically not accessed from runbooks.

## Windows PowerShell Cmdlets

The cmdlets in the following table are used to create and manage variables with Windows PowerShell in Azure Automation. They ship as part of the [Azure PowerShell module](http://aka.ms/runbookauthor/azurepowershell).

|Cmdlets|Description|
|:---|:---|
|[Get-AzureAutomationSchedule](http://aka.ms/runbookauthor/getazureschedule)|Retrieves a schedule.|
|[New-AzureAutomationSchedule](http://aka.ms/runbookauthor/newazureschedule)|Creates a new schedule.|
|[Remove-AzureAutomationSchedule](http://aka.ms/runbookauthor/removeazureschedule)|Removes a schedule.|
|[Set-AzureAutomationSchedule](http://aka.ms/runbookauthor/setazureschedule)|Sets the properties for an existing schedule.|
|[Get-AzureAutomationScheduledRunbook](http://aka.ms/runbookauthor/getazurescheduledrunbook)|Retrieves scheduled runbooks.|
|[Register-AzureAutomationScheduledRunbook](http://aka.ms/runbookauthor/registerazurescheduledrunbook)|Associates a runbook with a schedule.|
|[Unregister-AzureAutomationScheduledRunbook](http://aka.ms/runbookauthor/unregisterazurescheduledrunbook)|Dissociates a runbook from a schedule.|

## Creating a new Schedule

### To create a new schedule with the management portal

1. Select the **Automation** workspace.

1. At the top of the window, click **Assets**.

1. At the bottom of the window, click **Add Setting**.

1. Click **Add Schedule**.

1. Type a name for the variable in the **Name** box.

1. Click the right arrow.

1. Select **One Time**, **hourly** or **Daily**.

1. Select a **Start Time**.

1. For **Hourly** or **Daily** schedules, perform the following steps:

	1. If the schedule should not run indefinitely, select **Schedule Expires On** and specify an expiration date and time.

	1. In the **Recur Every** box, select the number of days the schedule should recur.

1. Click the check mark to save the variable.

### To create a new schedule with Windows PowerShell

The [New-AzureAutomationSchedule](http://aka.ms/runbookauthor/newazureschedule) cmdlet creates a new schedule and sets the value for an existing schedule.  The following sample Windows PowerShell commands create a new schedule called My Daily Schedule that starts on tomorrow at noon and fires every day one year:

	$automationAccountName = "MyAutomationAccount"
	$scheduleName = "My Daily Schedule"
	$startTime = (Get-Date).Date.AddDays(1).AddHours(12)
	$expiryTime = $startTime.AddYears(1)
	
	New-AzureAutomationSchedule –AutomationAccountName $automationAccountName –Name $scheduleName –StartTime $startTime –ExpiryTime $expiryTime –DayInterval 1


## See Also

[Automation Assets](../automation-assets)
