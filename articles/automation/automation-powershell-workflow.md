---
title: Learning PowerShell Workflow for Azure Automation
description: This article is intended as a quick lesson for authors familiar with PowerShell to understand the specific differences between PowerShell and PowerShell Workflow and concepts applicable to Automation runbooks.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 12/14/2018
ms.topic: conceptual
manager: carmonm
---
# Learning key Windows PowerShell Workflow concepts for Automation runbooks

Runbooks in Azure Automation are implemented as Windows PowerShell Workflows.  A Windows PowerShell Workflow is similar to a Windows PowerShell script but has some significant differences that can be confusing to a new user.  While this article is intended to help you write runbooks using PowerShell workflow, we recommend you write runbooks using PowerShell unless you need checkpoints.  There are several syntax differences when authoring PowerShell Workflow runbooks and these differences require a bit more work to write effective workflows.

A workflow is a sequence of programmed, connected steps that perform long-running tasks or require the coordination of multiple steps across multiple devices or managed nodes. The benefits of a workflow over a normal script include the ability to simultaneously perform an action against multiple devices and the ability to automatically recover from failures. A Windows PowerShell Workflow is a Windows PowerShell script that uses Windows Workflow Foundation. While the workflow is written with Windows PowerShell syntax and launched by Windows PowerShell, it is processed by Windows Workflow Foundation.

For complete details on the topics in this article, see [Getting Started with Windows PowerShell Workflow](https://technet.microsoft.com/library/jj134242.aspx).

## Basic structure of a workflow

The first step to converting a PowerShell script to a PowerShell workflow is enclosing it with the **Workflow** keyword.  A workflow starts with the **Workflow** keyword followed by the body of the script enclosed in braces. The name of the workflow follows the **Workflow** keyword as shown in the following syntax:

```powershell
Workflow Test-Workflow
{
    <Commands>
}
```

The name of the workflow must match the name of the Automation runbook. If the runbook is being imported, then the filename must match the workflow name and must end in *.ps1*.

To add parameters to the workflow, use the **Param** keyword just as you would to a script.

## Code changes

PowerShell workflow code looks almost identical to PowerShell script code except for a few significant changes.  The following sections describe changes that you need to make to a PowerShell script for it to run in a workflow.

### Activities

An activity is a specific task in a workflow. Just as a script is composed of one or more commands, a workflow is composed of one or more activities that are carried out in a sequence. Windows PowerShell Workflow automatically converts many of the Windows PowerShell cmdlets to activities when it runs a workflow. When you specify one of these cmdlets in your runbook, the corresponding activity is run by Windows Workflow Foundation. For those cmdlets without a corresponding activity, Windows PowerShell Workflow automatically runs the cmdlet within an [InlineScript](#inlinescript) activity. There is a set of cmdlets that are excluded and cannot be used in a workflow unless you explicitly include them in an InlineScript block. For further details on these concepts, see [Using Activities in Script Workflows](https://technet.microsoft.com/library/jj574194.aspx).

Workflow activities share a set of common parameters to configure their operation. For details about the workflow common parameters, see [about_WorkflowCommonParameters](https://technet.microsoft.com/library/jj129719.aspx).

### Positional parameters

You can't use positional parameters with activities and cmdlets in a workflow.  All this means is that you must use parameter names.

For example, consider the following code that gets all running services.

```azurepowershell-interactive
Get-Service | Where-Object {$_.Status -eq "Running"}
```

If you try to run this same code in a workflow, you receive a message like "Parameter set cannot be resolved using the specified named parameters."  To correct this, provide the parameter name as in the following.

```powershell
Workflow Get-RunningServices
{
    Get-Service | Where-Object -FilterScript {$_.Status -eq "Running"}
}
```

### Deserialized objects

Objects in workflows are deserialized.  This means that their properties are still available, but not their methods.  For example, consider the following PowerShell code that stops a service using the Stop method of the Service object.

```azurepowershell-interactive
$Service = Get-Service -Name MyService
$Service.Stop()
```

If you try to run this in a workflow, you receive an error saying "Method invocation is not supported in a Windows PowerShell Workflow."

One option is to wrap these two lines of code in an [InlineScript](#inlinescript) block in which case $Service would be a service object within the block.

```powershell
Workflow Stop-Service
{
    InlineScript {
        $Service = Get-Service -Name MyService
        $Service.Stop()
    }
}
```

Another option is to use another cmdlet that performs the same functionality as the method, if one is available.  In our sample, the Stop-Service cmdlet provides the same functionality as the Stop method, and you could use the following for a workflow.

```powershell
Workflow Stop-MyService
{
    $Service = Get-Service -Name MyService
    Stop-Service -Name $Service.Name
}
```

## InlineScript

The **InlineScript** activity is useful when you need to run one or more commands as traditional PowerShell script instead of PowerShell workflow.  While commands in a workflow are sent to Windows Workflow Foundation for processing, commands in an InlineScript block are processed by Windows PowerShell.

InlineScript uses the following syntax shown below.

```powershell
InlineScript
{
    <Script Block>
} <Common Parameters>
```

You can return output from an InlineScript by assigning the output to a variable. The following example stops a service and then outputs the service name.

```powershell
Workflow Stop-MyService
{
    $Output = InlineScript {
        $Service = Get-Service -Name MyService
        $Service.Stop()
        $Service
    }

    $Output.Name
}
```

You can pass values into an InlineScript block, but you must use **$Using** scope modifier.  The following example is identical to the previous example except that the service name is provided by a variable.

```powershell
Workflow Stop-MyService
{
    $ServiceName = "MyService"

    $Output = InlineScript {
        $Service = Get-Service -Name $Using:ServiceName
        $Service.Stop()
        $Service
    }

    $Output.Name
}
```

While InlineScript activities may be critical in certain workflows, they do not support workflow constructs and should only be used when necessary for the following reasons:

* You cannot use [checkpoints](#checkpoints) inside an InlineScript block. If a failure occurs within the block, it must be resumed from the beginning of the block.
* You cannot use [parallel execution](#parallel-processing) inside an InlineScriptBlock.
* InlineScript affects scalability of the workflow since it holds the Windows PowerShell session for the entire length of the InlineScript block.

For more information on using InlineScript, see [Running Windows PowerShell Commands in a Workflow](https://technet.microsoft.com/library/jj574197.aspx) and [about_InlineScript](https://technet.microsoft.com/library/jj649082.aspx).

## Parallel processing

One advantage of Windows PowerShell Workflows is the ability to perform a set of commands in parallel instead of sequentially as with a typical script.

You can use the **Parallel** keyword to create a script block with multiple commands that run concurrently. This uses the following syntax shown below. In this case, Activity1 and Activity2 starts at the same time. Activity3 starts only after both Activity1 and Activity2 have completed.

```powershell
Parallel
{
    <Activity1>
    <Activity2>
}
<Activity3>
```

For example, consider the following PowerShell commands that copy multiple files to a network destination.  These commands are run sequentially so that one file must finish copying before the next is started.

```azurepowershell-interactive
Copy-Item -Path C:\LocalPath\File1.txt -Destination \\NetworkPath\File1.txt
Copy-Item -Path C:\LocalPath\File2.txt -Destination \\NetworkPath\File2.txt
Copy-Item -Path C:\LocalPath\File3.txt -Destination \\NetworkPath\File3.txt
```

The following workflow runs these same commands in parallel so that they all start copying at the same time.  Only after they are all copied is the completion message displayed.

```powershell
Workflow Copy-Files
{
    Parallel
    {
        Copy-Item -Path "C:\LocalPath\File1.txt" -Destination "\\NetworkPath"
        Copy-Item -Path "C:\LocalPath\File2.txt" -Destination "\\NetworkPath"
        Copy-Item -Path "C:\LocalPath\File3.txt" -Destination "\\NetworkPath"
    }

    Write-Output "Files copied."
}
```

You can use the **ForEach -Parallel** construct to process commands for each item in a collection concurrently. The items in the collection are processed in parallel while the commands in the script block run sequentially. This uses the following syntax shown below. In this case, Activity1 starts at the same time for all items in the collection. For each item, Activity2 starts after Activity1 is complete. Activity3 starts only after both Activity1 and Activity2 have completed for all items. We use the `ThrottleLimit` parameter to limit the parallelism. Too high of a `ThrottleLimit` can cause problems. The ideal value for the `ThrottleLimit` parameter depends on many factors in your environment. You should try start with a low value and try different increasing values until you find one that works for your specific circumstance.

```powershell
ForEach -Parallel -ThrottleLimit 10 ($<item> in $<collection>)
{
    <Activity1>
    <Activity2>
}
<Activity3>
```

The following example is similar to the previous example copying files in parallel.  In this case, a message is displayed for each file after it copies.  Only after they are all completely copied is the final completion message displayed.

```powershell
Workflow Copy-Files
{
    $files = @("C:\LocalPath\File1.txt","C:\LocalPath\File2.txt","C:\LocalPath\File3.txt")

    ForEach -Parallel -ThrottleLimit 10 ($File in $Files)
    {
        Copy-Item -Path $File -Destination \\NetworkPath
        Write-Output "$File copied."
    }

    Write-Output "All files copied."
}
```

> [!NOTE]
> We do not recommend running child runbooks in parallel since this has been shown to give unreliable results. The output from the child runbook sometimes does not show up, and settings in one child runbook can affect the other parallel child runbooks. Variables such as $VerbosePreference, $WarningPreference, and others may not be propagated to the child runbooks. And if the child runbook changes these values, they may not be properly restored after invocation.

## Checkpoints

A *checkpoint* is a snapshot of the current state of the workflow that includes the current value for variables and any output generated to that point. If a workflow ends in error or is suspended, then the next time it is run it will start from its last checkpoint instead of the start of the workflow.  You can set a checkpoint in a workflow with the **Checkpoint-Workflow** activity. Azure Automation has a feature called [fair share](automation-runbook-execution.md#fair-share), where any runbook that runs for 3 hours is unloaded to allow other runbooks to run. Eventually, the unloaded runbook will be reloaded, and when it is, it will resume execution from the last checkpoint taken in the runbook. In order to guarantee that the runbook will eventually complete, you must add checkpoints at intervals that run for less than 3 hours. If during each run a new checkpoint is added, and if the runbook gets evicted after 3 hours due to an error, then the runbook will be resumed indefinitely.

In the following sample code, an exception occurs after Activity2 causing the workflow to end. When the workflow is run again, it starts by running Activity2 since this was just after the last checkpoint set.

```powershell
<Activity1>
Checkpoint-Workflow
<Activity2>
<Exception>
<Activity3>
```

You should set checkpoints in a workflow after activities that may be prone to exception and should not be repeated if the workflow is resumed. For example, your workflow may create a virtual machine. You could set a checkpoint both before and after the commands to create the virtual machine. If the creation fails, then the commands would be repeated if the workflow is started again. If the workflow fails after the creation succeeds, then the virtual machine will not be created again when the workflow is resumed.

The following example copies multiple files to a network location and sets a checkpoint after each file.  If the network location is lost, then the workflow ends in error.  When it is started again, it will resume at the last checkpoint meaning that only the files that have already been copied are skipped.

```powershell
Workflow Copy-Files
{
    $files = @("C:\LocalPath\File1.txt","C:\LocalPath\File2.txt","C:\LocalPath\File3.txt")

    ForEach ($File in $Files)
    {
        Copy-Item -Path $File -Destination \\NetworkPath
        Write-Output "$File copied."
        Checkpoint-Workflow
    }

    Write-Output "All files copied."
}
```

Because username credentials are not persisted after you call the [Suspend-Workflow](https://technet.microsoft.com/library/jj733586.aspx) activity or after the last checkpoint, you need to set the credentials to null and then retrieve them again from the asset store after **Suspend-Workflow** or checkpoint is called.  Otherwise, you may receive the following error message: *The workflow job cannot be resumed, either because persistence data could not be saved completely, or saved persistence data has been corrupted. You must restart the workflow.*

The following same code demonstrates how to handle this in your PowerShell Workflow runbooks.

```powershell
workflow CreateTestVms
{
    $Cred = Get-AzureAutomationCredential -Name "MyCredential"
    $null = Connect-AzureRmAccount -Credential $Cred

    $VmsToCreate = Get-AzureAutomationVariable -Name "VmsToCreate"

    foreach ($VmName in $VmsToCreate)
        {
        # Do work first to create the VM (code not shown)

        # Now add the VM
        New-AzureRmVm -VM $Vm -Location "WestUs" -ResourceGroupName "ResourceGroup01"

        # Checkpoint so that VM creation is not repeated if workflow suspends
        $Cred = $null
        Checkpoint-Workflow
        $Cred = Get-AzureAutomationCredential -Name "MyCredential"
        $null = Connect-AzureRmAccount -Credential $Cred
        }
}
```

> [!IMPORTANT]
> **Add-AzureRmAccount** is now an alias for **Connect-AzureRMAccount**. When searching your library items, if you do not see **Connect-AzureRMAccount**, you can use **Add-AzureRmAccount**, or you can update your modules in your Automation Account.

This is not required if you are authenticating using a Run As account configured with a service principal.

For more information about checkpoints, see [Adding Checkpoints to a Script Workflow](https://technet.microsoft.com/library/jj574114.aspx).

## Next steps

* To get started with PowerShell workflow runbooks, see [My first PowerShell workflow runbook](automation-first-runbook-textual.md)

