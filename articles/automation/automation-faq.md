---
title: Azure Automation FAQ | Microsoft Docs
description: This article gives answers to frequently asked questions about Azure Automation.
services: automation
ms.subservice: 
ms.topic: conceptual
ms.date: 08/25/2021
ms.custom: devx-track-azurepowershell
---

# Azure Automation frequently asked questions

This Microsoft FAQ is a list of commonly asked questions about Azure Automation. If you have any other questions about its capabilities, go to the discussion forum and post your questions. When a question is frequently asked, we add it to this article so that it's found quickly and easily.

## Update Management

### Can I prevent unexpected OS-level upgrades?

On some Linux variants, such as Red Hat Enterprise Linux, OS-level upgrades might occur through packages. This might lead to Update Management runs in which the OS version number changes. Because Update Management uses the same methods to update packages that an administrator uses locally on a Linux machine, this behavior is intentional.

To avoid updating the OS version through Update Management deployments, use the **Exclusion** feature.

In Red Hat Enterprise Linux, the package name to exclude is `redhat-release-server.x86_64`.

### Why aren't critical/security updates applied?

When you deploy updates to a Linux machine, you can select update classifications. This option filters the updates that meet the specified criteria. This filter is applied locally on the machine when the update is deployed.

Because Update Management performs update enrichment in the cloud, you can flag some updates in Update Management as having a security impact, even though the local machine doesn't have that information. If you apply critical updates to a Linux machine, there might be updates that aren't marked as having a security impact on that machine and therefore aren't applied. However, Update Management might still report that machine as noncompliant because it has additional information about the relevant update.

Deploying updates by update classification doesn't work on RTM versions of CentOS. To properly deploy updates for CentOS, select all classifications to make sure updates are applied. For SUSE, selecting ONLY **Other updates** as the classification can install some other security updates if they're related to zypper (package manager) or its dependencies are required first. This behavior is a limitation of zypper. In some cases, you might be required to rerun the update deployment and then verify the deployment through the update log.

### Can I deploy updates across Azure tenants?

If you have machines that need patching in another Azure tenant reporting to Update Management, you must use a following workaround to get them scheduled. You can use the [New-AzAutomationSchedule](/powershell/module/Az.Automation/New-AzAutomationSchedule) cmdlet with the `ForUpdateConfiguration` parameter specified to create a schedule. You can use the [New-AzAutomationSoftwareUpdateConfiguration](/powershell/module/Az.Automation/New-AzAutomationSoftwareUpdateConfiguration) cmdlet and pass the machines in the other tenant to the `NonAzureComputer` parameter. The following example shows how to do this.

```azurepowershell-interactive
$nonAzurecomputers = @("server-01", "server-02")

$startTime = ([DateTime]::Now).AddMinutes(10)

$sched = New-AzAutomationSchedule -ResourceGroupName mygroup -AutomationAccountName myaccount -Name myupdateconfig -Description test-OneTime -OneTime -StartTime $startTime -ForUpdateConfiguration

New-AzAutomationSoftwareUpdateConfiguration  -ResourceGroupName $rg -AutomationAccountName <automationAccountName> -Schedule $sched -Windows -NonAzureComputer $nonAzurecomputers -Duration (New-TimeSpan -Hours 2) -IncludedUpdateClassification Security,UpdateRollup -ExcludedKbNumber KB01,KB02 -IncludedKbNumber KB100
```

## Which Python 3 version is supported in Azure Automation?

See [Python runbooks](automation-runbook-types.md#python-runbooks).

### Can Python 2 and Python 3 runbooks run in same Automation account?

Yes, there's no limitation for using Python 2 and Python 3 runbooks in same Automation account.  

### What is the plan for migrating existing Python 2 runbooks and packages to Python 3?

Azure Automation doesn't plan to migrate Python 2 runbooks and packages to Python 3. You'll have to do this migration yourself. Existing and new Python 2 runbooks and packages will continue to work.

## What are the packages supported by default in Python 3 environment?

Azure package 4.0.0. For more information, see [Manage Python 3 packages](python-3-packages.md).

### What if I run a Python 3 runbook that references a Python 2 package or the other way around?

Python 2 and Python 3 have different execution environments. While a Python 2 runbook is running, only Python 2 packages can be imported and similar for Python 3.

### How do I differentiate between Python 2 and Python 3 runbooks and packages?

Python 3 is a new runbook definition, which distinguishes between Python 2 and Python 3 runbooks. Similarly, another package kind is introduced for Python 3 packages.

## How does a Hybrid Runbook Worker know which version of Python to run when both Python2 and Python3 are installed?

See [Multiple Python versions](automation-runbook-types.md#multiple-python-versions).

### How does a Hybrid Runbook Worker locate the Python interpreter?

Locating the Python module is controlled by environment variables as explained earlier.

### Is Python 3 supported in Source Control?

No. Source Control isn't currently supported for Python 3. By default, Python runbooks are synced as Python 2 runbooks.

## How can a runbook author know what Python packages are available in an Azure sandbox?

See [Identify available packages in sandbox](python-3-packages.md#identify-available-packages-in-sandbox).

## How can a runbook author set which version of a package module to be used if there are multiple modules?

See [Manage Python 3 packages](python-3-packages.md).

## Next steps

If your question isn't answered here, you can refer to the following sources for more questions and answers.

- [Azure Automation](/answers/topics/azure-automation.html)
- [Feedback forum](https://feedback.azure.com/forums/905242-update-management)
