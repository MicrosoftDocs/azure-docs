<properties 
   pageTitle="Scheduling a runbook in Azure Automation"
   description="Describes how to create a schedule in Azure Automation so that you can automatically start a runbook at a particular time or on a recurring schedule."
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
   ms.date="03/30/2015"
   ms.author="bwren" />

# Scheduling a runbook in Azure Automation

To schedule a runbook in Azure Automation to start at a specified time, you link it to one or more schedules. A schedule can be configured to either run one time or recurring every specified number of hours or days. A runbook can be linked to multiple schedules, and a schedule can have multiple runbooks linked to it.

## Creating a schedule

You can either create a new schedule with the Azure Management Portal or with Windows PowerShell. You also have the option of creating a new schedule when you link a runbook to a schedule using the Azure Management Portal.

### To create a new schedule with the Azure Management Portal

1. In the Azure Management Portal, select Automation and then then click the name of an automation account.
1. Select the **Assets** tab.
1. At the bottom of the window, click **Add Setting**.
1. Click **Add Schedule**.
1. Type a **Name** and optionally a **Description** for the new schedule.
1. Select whether the schedule will run **One Time**, **Hourly**, or **Daily**.
1. Specify a **Start Time** and other options depending on the type of schedule that you selected.

### To create a new schedule with Windows PowerShell

You can use the [New-AzureAutomationSchedule](http://msdn.microsoft.com/library/azure/dn690271.aspx) cmdlet to create a new schedule in Azure Automation. You must specify the start time for the schedule and whether it should run one time, hourly, or daily.

The following sample commands show how to create a new schedule that runs each day at 3:30 PM starting on January 20, 2015.

	$automationAccountName = "MyAutomationAccount"
	$scheduleName = "Sample-DailySchedule"
	New-AzureAutomationSchedule –AutomationAccountName $automationAccountName –Name $scheduleName –StartTime "1/20/2015 15:30:00" –DayInterval 1

## Linking a schedule to a runbook

A runbook can be linked to multiple schedules, and a schedule can have multiple runbooks linked to it. If a runbook has parameters, then you can provide values for them. You must provide values for any mandatory parameters and may provide values for any optional parameters.  These values will be used each time the runbook is started by this schedule.  You can attach the same runbook to another schedule and specify different parameter values.

### To link a schedule to a runbook with the Azure Management Portal

1. In the Azure Management Portal, select **Automation** and then then click the name of an automation account.
1. Select the **Runbooks** tab.
1. Click on the name of the runbook to schedule.
1. Click the **Schedule** tab.
2. If the runbook is not currently linked to a schedule, then you will be given the option to **Link to a New Schedule** or **Link to an Existing Schedule**.  If the runbook is currently linked to a schedule, click **Link** at the bottom of the window to access these options.
1. If the runbook has parameters, you will be prompted for their values.  

### To link a schedule to a runbook with Windows PowerShell

You can use the [Register-AzureAutomationScheduledRunbook](http://msdn.microsoft.com/library/azure/dn690265.aspx) to link a schedule to a runbook. You can specify values for the runbook’s parameters with the Parameters parameter. See [Starting a Runbook in Azure Automation](automation-starting-a-runbook.md) for more information on specifying parameter values.

The following sample commands show how to link a schedule to a runbook with parameters.

	$automationAccountName = "MyAutomationAccount"
	$runbookName = "Test-Runbook"
	$scheduleName = "Sample-DailySchedule"
	$params = @{"FirstName"="Joe";"LastName"="Smith";"RepeatCount"=2;"Show"=$true}
	Register-AzureAutomationScheduledRunbook –AutomationAccountName $automationAccountName –Name $runbookName –ScheduleName $scheduleName –Parameters $params

## Disabling a schedule

When you disable a schedule, any runbooks linked to it will no longer run on that schedule. You can manually disable a schedule or set an expiration time for Hourly and Daily schedules when you create them. When the expiration time is reached, the schedule will be disabled.

### To disable a schedule with the Azure Management Portal

You can disable a schedule in the Azure Management Portal from the Schedule Details page for the schedule.

1. In the Azure Management Portal, select Automation and then then click the name of an automation account.
1. Select the Assets tab.
1. Click the name of a schedule to open its detail page.
2. Change **Enabled** to **No**.

### To disable a schedule with Windows PowerShell

You can use the [Set-AzureAutomationSchedule](http://msdn.microsoft.com/library/azure/dn690270.aspx) cmdlet to change the properties of an existing schedule. To disable the schedule, specify **false** for the **IsEnabled** parameter.

The following sample commands show how to disable a schedule.

	$automationAccountName = "MyAutomationAccount"
	$scheduleName = "Sample-DailySchedule"
	Set-AzureAutomationSchedule –AutomationAccountName $automationAccountName –Name $scheduleName –IsEnabled $false

## Related articles

- [Schedule Assets in Azure Automation](http://msdn.microsoft.com/library/azure/dn940016.aspx)
- [Starting a Runbook in Azure Automation](automation-starting-a-runbook.md)