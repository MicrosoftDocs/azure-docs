---
title: Error handling in Azure Automation graphical runbooks
description: This article describes how to implement error handling logic in Azure Automation graphical runbooks.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 03/16/2018
ms.topic: conceptual
manager: carmonm
---

# Error handling in Azure Automation graphical runbooks

A key runbook design principal to consider is identifying different issues that a runbook might experience. These issues can include success, expected error states, and unexpected error conditions.

Runbooks should include error handling. To validate the output of an activity or handle an error with graphical runbooks, you could use a Windows PowerShell code activity, define conditional logic on the output link of the activity, or apply another method.          

Often, if there is a non-terminating error that occurs with a runbook activity, any activity that follows is processed regardless of the error. The error is likely to generate an exception, but the next activity is still allowed to run. This is the way that PowerShell is designed to handle errors.    

The types of PowerShell errors that can occur during execution are terminating or non-terminating. The differences between terminating and non-terminating errors are as follows:

* **Terminating error**: A serious error during execution that halts the command (or script execution) completely. Examples include non-existent cmdlets, syntax errors that prevent a cmdlet from running, or other fatal errors.

* **Non-terminating error**: A non-serious error that allows execution to continue despite the failure. Examples include operational errors such as file not found errors and permissions problems.

Azure Automation graphical runbooks have been improved with the capability to include error handling. You can now turn exceptions into non-terminating errors and create error links between activities. This process allows a runbook author to catch errors and manage realized or unexpected conditions.  

## When to use error handling

Whenever there is a critical activity that throws an error or exception, it's important to prevent the next activity in your runbook from processing and to handle the error appropriately. This is especially critical when your runbooks are supporting a business or service operations process.

For each activity that can produce an error, the runbook author can add an error link pointing to any other activity. The destination activity can be of any type, including code activities, invoking a cmdlet, invoking another runbook, and so on.

In addition, the destination activity can also have outgoing links. These links can be regular links or error links. This means the runbook author can implement complex error-handling logic without resorting to a code activity. The recommended practice is to create a dedicated error-handling runbook with common functionality, but it's not mandatory. Error-handling logic in a PowerShell code activity it isn't the only option.  

For example, consider a runbook that tries to start a VM and install an application on it. If the VM doesn't start correctly, it performs two actions:

1. It sends a notification about this problem.
2. It starts another runbook that automatically provisions a new VM instead.

One solution is to have an error link pointing to an activity that handles step one. For example, you could connect the **Write-Warning** cmdlet to an activity for step two, such as the **Start-AzureRmAutomationRunbook** cmdlet.

You could also generalize this behavior for use in many runbooks by putting these two activities in a separate error handling runbook and following the guidance suggested earlier. Before calling this error-handling runbook, you could construct a custom message from the data in the original runbook, and then pass it as a parameter to the error-handling runbook.

## How to use error handling

Each activity has a configuration setting that turns exceptions into non-terminating errors. By default, this setting is disabled. We recommend that you enable this setting on any activity where you want to handle errors.  

By enabling this configuration, you are assuring that both terminating and non-terminating errors in the activity are handled as non-terminating errors, and can be handled with an error link.  

After configuring this setting, you create an activity that handles the error. If an activity produces any error, then the outgoing error links are followed, and the regular links are not, even if the activity produces regular output as well.<br><br> ![Automation runbook error link example](media/automation-runbook-graphical-error-handling/error-link-example.png)

In the following example, a runbook retrieves a variable that contains the computer name of a virtual machine. It then attempts to start the virtual machine with the next activity.<br><br> ![Automation runbook error-handling example](media/automation-runbook-graphical-error-handling/runbook-example-error-handling.png)<br><br>      

The **Get-AutomationVariable** activity and **Start-AzureRmVm** are configured to convert exceptions to errors. If there are problems getting the variable or starting the VM, then errors are generated.<br><br> ![Automation runbook error-handling activity settings](media/automation-runbook-graphical-error-handling/activity-blade-convertexception-option.png)

Error links flow from these activities to a single **error management** activity (a code activity). This activity is configured with a simple PowerShell expression that uses the *Throw* keyword to stop processing, along with *$Error.Exception.Message* to get the message that describes the current exception.<br><br> ![Automation runbook error-handling code example](media/automation-runbook-graphical-error-handling/runbook-example-error-handling-code.png)


## Next steps

* To learn more about links and link types in graphical runbooks, see [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md#links-and-workflow).

* To learn more about runbook execution, how to monitor runbook jobs, and other technical details, see [Track a runbook job](automation-runbook-execution.md).

