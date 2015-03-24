<properties 
   pageTitle="Scheduling a Runbook"
   description="Scheduling a Runbook"
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
   ms.date="03/16/2014"
   ms.author="bwren" />

# Scheduling a Runbook

To schedule a runbook in Azure Automation to start at a specified time, you link it to one or more schedules. A schedule can be configured to either run one time or recurring every specified number of hours or days. A runbook can be linked to multiple schedules, and a schedule can have multiple runbooks linked to it.

## Creating a Schedule

You can either create a new schedule with the Azure Management Portal or with Windows PowerShell. You also have the option of creating a new schedule when you link a runbook to a schedule using the Azure Management Portal.

### To create a new Schedule with the Azure Management Portal

1. In the Azure Management Portal, select Automation and then then click the name of an automation account.

1. Select the Assets tab.

1. At the bottom of the window, click Add Setting.

1. Click Add Schedule.

1. Type a Name and optionally a Description for the new schedule.

1. Select whether the schedule will run One Time, Hourly, or Daily.

1. Specify a Start Time and the other options depending on the type of schedule that you selected.

### To create a new Schedule with Windows PowerShell

You can use the [New-AzureAutomationSchedule](http://aka.ms/runbookauthor/newazureschedule) cmdlet to create a new schedule in Azure Automation. You must specify the start time for the schedule and whether it should run one time, hourly, or daily.

The following sample commands show how to create a new schedule that runs each day at 3:30 PM starting on January 20, 2015.

	$automationAccountName = "MyAutomationAccount"
	$scheduleName = "Sample-DailySchedule"
	New-AzureAutomationSchedule –AutomationAccountName $automationAccountName –Name $scheduleName –StartTime "1/20/2015 15:30:00" –DayInterval 1

## Linking a Schedule to a Runbook

A runbook can be linked to multiple schedules, and a schedule can have multiple runbooks linked to it. If a runbook has parameters, then you can provide values for them. You must provide values for any mandatory parameters.

### To link a schedule to a runbook with the Azure Management Portal

1. In the Azure Management Portal, select Automation and then then click the name of an automation account.

1. Select the Runbooks tab.

1. Click on the name of the runbook to schedule.

1. Click the Schedule tab.

1. If the runbook is currently linked to a schedule,.

1. Click Link at the bottom of the window. Then either click Link to a New Schedule and follow the dialog box to create a new schedule, or click Link to an Existing Schedule and select a schedule that has already been created.

1. If the runbook has parameters, you will be prompted for their values.

### To link a schedule to a runbook with Windows PowerShell

You can use the [Register-AzureAutomationScheduledRunbook](http://aka.ms/runbookauthor/registerazurescheduledrunbook) to link a schedule to a runbook. You can specify values for the runbook’s parameters with the Parameters parameter. See [Starting a Runbook](https://msdn.microsoft.com/library/azure/dn643628.aspx) for more information on specifying parameter values.

The following sample commands show how to link a schedule to a runbook with parameters.

	$automationAccountName = "MyAutomationAccount"
	$runbookName = "Test-Runbook"
	$scheduleName = "Sample-DailySchedule"
	$params = @{"FirstName"="Joe";"LastName"="Smith";"RepeatCount"=2;"Show"=$true}
	Register-AzureAutomationScheduledRunbook –AutomationAccountName $automationAccountName –Name $runbookName –ScheduleName $scheduleName –Parameters $params

## Disabling a Schedule

When you disable a schedule, any runbooks linked to it will no longer run on that schedule. You can manually disable a schedule or set an expiration time for Hourly and Daily schedules when you create them. When the expiration time is reached, the schedule will be disabled.

### To disable a schedule with the Azure Management Portal

You can disable a schedule in the Azure Management Portal from the Schedule Details page for the schedule.

1. In the Azure Management Portal, select Automation and then then click the name of an automation account.

1. Select the Assets tab.

1. Click the name of a schedule.

### To disable a schedule with Windows PowerShell

You can use the [Set-AzureAutomationSchedule](http://aka.ms/runbookauthor/setazureschedule) cmdlet to change the properties of an existing schedule. To disable the schedule, specify false for the IsEnabled parameter.

The following sample commands show how to disable a schedule.

	$automationAccountName = "MyAutomationAccount"
	$scheduleName = "Sample-DailySchedule"
	Set-AzureAutomationSchedule –AutomationAccountName $automationAccountName –Name $scheduleName –IsEnabled $false

