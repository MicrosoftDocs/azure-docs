---
title: Azure Automation FAQ | Microsoft Docs
description: Answers to frequently asked questions about Azure Automation.
services: automation
ms.subservice: 
ms.topic: conceptual
author: mgoedtel
ms.author: magoedte
ms.date: 02/25/2020

---

# Azure Automation frequently asked questions

This Microsoft FAQ is a list of commonly asked questions about Azure Automation. If you have any additional questions about its capabilities, go to the discussion forum and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly and easily.

>[!NOTE]
>This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [Introducing the new Azure PowerShell Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-3.5.0). For Az module installation instructions on your Hybrid Runbook Worker, see [Install the Azure PowerShell Module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.5.0). For your Automation account, you can update your modules to the latest version using [How to update Azure PowerShell modules in Azure Automation](automation-update-azure-modules.md).

## Update Management solution

### Can I prevent unexpected OS-level upgrades?

On some Linux variants, such as Red Hat Enterprise Linux, OS-level upgrades might occur through packages. This might lead to Update Management runs in which the OS version number changes. Because Update Management uses the same methods to update packages that an administrator uses locally on a Linux machine, this behavior is intentional.

To avoid updating the OS version through Update Management deployments, use the **Exclusion** feature.

In Red Hat Enterprise Linux, the package name to exclude is `redhat-release-server.x86_64`.

### Why aren't critical/security updates applied?

When you deploy updates to a Linux machine, you can select update classifications. This option filters the updates that meet the specified criteria. This filter is applied locally on the machine when the update is deployed.

Because Update Management performs update enrichment in the cloud, yyou can flag some updates in Update Management as having a security impact, even though the local machine doesn't have that information. If you apply critical updates to a Linux machine, there might be updates that aren't marked as having a security impact on that machine and therefore aren't applied. However, Update Management might still report that machine as noncompliant because it has additional information about the relevant update.

Deploying updates by update classification doesn't work on RTM versions of CentOS. To properly deploy updates for CentOS, select all classifications to make sure updates are applied. For SUSE, selecting ONLY **Other updates** as the classification can cause some additional security updates to be installed if security updates related to zypper (package manager) or its dependencies are required first. This behavior is a limitation of zypper. In some cases, you might be required to rerun the update deployment and then verify the deployment through the update log.

### Can I deploy updates across Azure tenants?

If you have machines that need patching in another Azure tenant reporting to Update Management, you must use a following workaround to get them scheduled. You can use the [New-AzAutomationSchedule](https://docs.microsoft.com/powershell/module/Az.Automation/New-AzAutomationSchedule?view=azps-3.7.0) cmdlet with the `ForUpdateConfiguration` parameter specified to create a schedule. You can use the [New-AzAutomationSoftwareUpdateConfiguration](https://docs.microsoft.com/powershell/module/Az.Automation/New-AzAutomationSoftwareUpdateConfiguration?view=azps-3.7.0) cmdlet and pass the machines in the other tenant to the `NonAzureComputer` parameter. The following example shows how to do this.

```azurepowershell-interactive
$nonAzurecomputers = @("server-01", "server-02")

$startTime = ([DateTime]::Now).AddMinutes(10)

$sched = New-AzAutomationSchedule -ResourceGroupName mygroup -AutomationAccountName myaccount -Name myupdateconfig -Description test-OneTime -OneTime -StartTime $startTime -ForUpdateConfiguration

New-AzAutomationSoftwareUpdateConfiguration  -ResourceGroupName $rg -AutomationAccountName <automationAccountName> -Schedule $sched -Windows -NonAzureComputer $nonAzurecomputers -Duration (New-TimeSpan -Hours 2) -IncludedUpdateClassification Security,UpdateRollup -ExcludedKbNumber KB01,KB02 -IncludedKbNumber KB100
```

## Next steps

If your question isn't answered here, you can refer to the following sources for additional questions and answers.

- [Azure Automation](https://social.msdn.microsoft.com/Forums/home?forum=azureautomation&filter=alltypes&sort=lastpostdesc)
- [Feedback forum](https://feedback.azure.com/forums/905242-update-management)