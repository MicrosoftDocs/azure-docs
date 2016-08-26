<properties 
   pageTitle="Scheduling a runbook in Azure Automation"
   description="Describes how to create a schedule in Azure Automation so that you can automatically start a runbook at a particular time or on a recurring schedule."
   services="automation"
   documentationCenter=""
   authors="mgoedtel"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/12/2016"
   ms.author="bwren" />

# Scheduling a runbook in Azure Automation

To schedule a runbook in Azure Automation to start at a specified time, you link it to one or more schedules. A schedule can be configured to either run once or on a reoccurring hourly or daily schedule for runbooks in the Azure classic portal and for runbooks in the Azure portal,  you can additionally schedule them for weekly, monthly, specific days of the week or days of the month, or a particular day of the month.  A runbook can be linked to multiple schedules, and a schedule can have multiple runbooks linked to it.


## Creating a schedule

You can create a new schedule for runbooks in the Azure portal, in the classic portal, or with Windows PowerShell. You also have the option of creating a new schedule when you link a runbook to a schedule using the Azure classic or Azure portal.

>[AZURE.NOTE] When you associate a schedule with a runbook, Automation stores the current versions of the modules in your account and links them to that schedule.  This means that if you had a module with version 1.0 in your account when you created a schedule and then update the module to version 2.0, the schedule will continue to use 1.0.  In order to use the updated module version, you must create a new schedule. 

### To create a new schedule in the Azure classic portal

1. In the Azure classic portal, select Automation and then then select the name of an automation account.
1. Select the **Assets** tab.
1. At the bottom of the window, click **Add Setting**.
1. Click **Add Schedule**.
1. Type a **Name** and optionally a **Description** for the new schedule.your schedule will run **One Time**, **Hourly**, or **Daily**.
1. Specify a **Start Time** and other options depending on the type of schedule that you selected.

### To create a new schedule in the Azure portal

1. In the Azure portal, from your automation account, click the **Assets** tile to open the **Assets** blade.
2. Click the **Schedules** tile to open the **Schedules** blade.
3. Click **Add a schedule** at the top of the blade.
4. On the **New schedule** blade, type a **Name** and optionally a **Description** for the new schedule.
5. Select whether the schedule will run one time, or on a reoccurring schedule by selecting **Once** or **Recurrence**.  If you select **Once** specify a **Start time** and then click **Create**.  If you select **Recurrence**, specify a **Start time** and the frequency for how often you want the runbook to repeat - by **hour**, **day**, **week**, or by **month**.  If you select **week** or **month** from the drop-down list, the **Recurrence option** will appear in the blade and upon selection, the **Recurrence option** blade will be presented and you can select the day of week if you selected **week**.  If you selected **month**, you can choose by **week days** or specific days of the month on the calendar and finally, do you want to run it on the last day of the month or not and then click **OK**.   

### To create a new schedule with Windows PowerShell

You can use the [New-AzureAutomationSchedule](http://msdn.microsoft.com/library/azure/dn690271.aspx) cmdlet to create a new schedule in Azure Automation for classic runbooks, or [New-AzureRmAutomationSchedule](https://msdn.microsoft.com/library/mt603577.aspx) cmdlet for runbooks in the Azure portal. You must specify the start time for the schedule and the frequency it should run.

The following sample commands show how to create a new schedule that runs each day at 3:30 PM starting on January 20, 2015 with an Azure Service Management cmdlet.

	$automationAccountName = "MyAutomationAccount"
	$scheduleName = "Sample-DailySchedule"
	New-AzureAutomationSchedule –AutomationAccountName $automationAccountName –Name `
    $scheduleName –StartTime "1/20/2016 15:30:00" –DayInterval 1

The following sample commands shows how to create a schedule for the 15th and 30th of every month using an Azure Resource Manager cmdlet.

    $automationAccountName = "MyAutomationAccount"
	$scheduleName = "Sample-MonthlyDaysOfMonthSchedule"
    New-AzureRMAutomationSchedule –AutomationAccountName $automationAccountName –Name `
    $scheduleName -StartTime "7/01/2016 15:30:00" -MonthInterval 1 `
    -DaysOfMonth Fifteenth,Thirtieth -ResourceGroupName "ResourceGroup01"
    

## Linking a schedule to a runbook

A runbook can be linked to multiple schedules, and a schedule can have multiple runbooks linked to it. If a runbook has parameters, then you can provide values for them. You must provide values for any mandatory parameters and may provide values for any optional parameters.  These values will be used each time the runbook is started by this schedule.  You can attach the same runbook to another schedule and specify different parameter values.


### To link a schedule to a runbook with the Azure classic portal

1. In the Azure classic portal, select **Automation** and then then click the name of an automation account.
2. Select the **Runbooks** tab.
3. Click on the name of the runbook to schedule.
4. Click the **Schedule** tab.
5. If the runbook is not currently linked to a schedule, then you will be given the option to **Link to a New Schedule** or **Link to an Existing Schedule**.  If the runbook is currently linked to a schedule, click **Link** at the bottom of the window to access these options.
6. If the runbook has parameters, you will be prompted for their values.  

### To link a schedule to a runbook with the Azure portal

1. In the Azure portal, from your automation account, click the **Runbooks** tile to open the **Runbooks** blade.
2. Click on the name of the runbook to schedule.
3. If the runbook is not currently linked to a schedule, then you will be given the option to create a new schedule or link to an existing schedule.  
4. If the runbook has parameters, you can select the option **Modify run settings (Default:Azure)** and the **Parameters** blade is presented where you can enter the information accordingly.  

### To link a schedule to a runbook with Windows PowerShell

You can use the [Register-AzureAutomationScheduledRunbook](http://msdn.microsoft.com/library/azure/dn690265.aspx) to link a schedule to a classic runbook or [Register-AzureRmAutomationScheduledRunbook](https://msdn.microsoft.com/library/mt603575.aspx) cmdlet for runbooks in the Azure portal.  You can specify values for the runbook’s parameters with the Parameters parameter. See [Starting a Runbook in Azure Automation](automation-starting-a-runbook.md) for more information on specifying parameter values.

The following sample commands show how to link a schedule using an Azure Service Management cmdlet with parameters.

	$automationAccountName = "MyAutomationAccount"
	$runbookName = "Test-Runbook"
	$scheduleName = "Sample-DailySchedule"
	$params = @{"FirstName"="Joe";"LastName"="Smith";"RepeatCount"=2;"Show"=$true}
	Register-AzureAutomationScheduledRunbook –AutomationAccountName $automationAccountName `
    –Name $runbookName –ScheduleName $scheduleName –Parameters $params

The following sample commands show how to link a schedule to a runbook using an Azure Resource Manager cmdlet with parameters.

    $automationAccountName = "MyAutomationAccount"
	$runbookName = "Test-Runbook"
	$scheduleName = "Sample-DailySchedule"
	$params = @{"FirstName"="Joe";"LastName"="Smith";"RepeatCount"=2;"Show"=$true}
	Register-AzureRmAutomationScheduledRunbook –AutomationAccountName $automationAccountName `
    –Name $runbookName –ScheduleName $scheduleName –Parameters $params `
    -ResourceGroupName "ResourceGroup01"

## Disabling a schedule

When you disable a schedule, any runbooks linked to it will no longer run on that schedule. You can manually disable a schedule or set an expiration time for schedules with a frequency when you create them. When the expiration time is reached, the schedule will be disabled.

### To disable a schedule from the Azure classic portal

You can disable a schedule in the Azure classic portal from the Schedule Details page for the schedule.

1. In the Azure classic portal, select Automation and then then click the name of an automation account.
1. Select the Assets tab.
1. Click the name of a schedule to open its detail page.
2. Change **Enabled** to **No**.

### To disable a schedule from the Azure portal

1. In the Azure portal, from your automation account, click the **Assets** tile to open the **Assets** blade.
2. Click the **Schedules** tile to open the **Schedules** blade.
2. Click the name of a schedule to open the details blade.
3. Change **Enabled** to **No**.

### To disable a schedule with Windows PowerShell

You can use the [Set-AzureAutomationSchedule](http://msdn.microsoft.com/library/azure/dn690270.aspx) cmdlet to change the properties of an existing schedule for a classic runbook or [Set-AzureRmAutomationSchedule](https://msdn.microsoft.com/library/mt603566.aspx) cmdlet for runbooks in the Azure portal. To disable the schedule, specify **false** for the **IsEnabled** parameter.

The following sample commands show how to disable a schedule using the Azure Service Management cmdlet.

	$automationAccountName = "MyAutomationAccount"
	$scheduleName = "Sample-DailySchedule"
	Set-AzureAutomationSchedule –AutomationAccountName $automationAccountName `
    –Name $scheduleName –IsEnabled $false

The following sample commands show how to disable a schedule for a runbook using an Azure Resource Manager cmdlet.

	$automationAccountName = "MyAutomationAccount"
	$scheduleName = "Sample-MonthlyDaysOfMonthSchedule"
	Set-AzureRmAutomationSchedule –AutomationAccountName $automationAccountName `
    –Name $scheduleName –IsEnabled $false -ResourceGroupName "ResourceGroup01"


## Next steps

- To learn more about working with schedules, see [Schedule Assets in Azure Automation](http://msdn.microsoft.com/library/azure/dn940016.aspx)
- To get started with runbooks in Azure Automation, see [Starting a Runbook in Azure Automation](automation-starting-a-runbook.md) 