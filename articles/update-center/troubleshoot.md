---
title: Troubleshoot known issues with update management center (preview)
description: The article provides details on the known issues and troubleshooting any problems with update management center (preview).
ms.service: update-management-center
ms.date: 04/21/2022
ms.topic: conceptual
ms.author: sudhirsneha
author: SnehaSudhirG
---

# Troubleshoot issues with update management center (preview)

This article describes the errors that might occur when you deploy or use update management center (preview) and how to resolve them.  

## General troubleshooting

The following troubleshooting steps apply to the Azure VMs related to the patch extension on Windows and Linux machines.   

### Azure Linux VM

To verify if the Microsoft Azure Virtual Machine Agent (VM Agent) is running, has triggered appropriate actions on the machine, and the sequence number for the AutoPatching request, check the agent log for more details in `/var/log/waagent.log`. Every AutoPatching request has a unique sequence number associated with it on the machine. Look for a log similar to: `2021-01-20T16:57:00.607529Z INFO ExtHandler`.

The package directory for the extension is `/var/lib/waagent/Microsoft.CPlat.Core.Edp.LinuxPatchExtension-<version>` and in the `/status` subfolder is a `<sequence number>.status` file, which includes a brief description of the actions performed during a single AutoPatching request, and the status. It also includes a short list of errors that occurred while applying updates. 

To review the logs related to all actions performed by the extension, check for more details in `/var/log/azure/Microsoft.CPlat.Core.Edp.LinuxPatchExtension/`. It includes the following two log files of interest:

* `<seq number>.core.log`: Contains details related to the patch actions, such as the patches assessed and installed on the machine, and any issues encountered in the process.
* `<Date and Time>_<Handler action>.ext.log`: There is a wrapper above the patch action, which is used to manage the extension and invoke specific patch operation. This log contains details about the wrapper. For AutoPatching, the `<Date and Time>_Enable.ext.log` has details on whether the specific patch operation was invoked.

### Azure Windows VM 

To verify if the Microsoft Azure Virtual Machine Agent (VM Agent) is running, has triggered appropriate actions on the machine, and the sequence number for the AutoPatching request, check the agent log for more details in `C:\WindowsAzure\Logs\AggregateStatus`. The package directory for the extension is `C:\Packages\Plugins\Microsoft.CPlat.Core.WindowsPatchExtension<version>`.

To review the logs related to all actions performed by the extension, check for more details in `C:\WindowsAzure\Logs\Plugins\Microsoft.CPlat.Core.WindowsPatchExtension<version>`. It includes the following two log files of interest:

* `WindowsUpdateExtension.log`: Contains details related to the patch actions, such as the patches assessed and installed on the machine, and any issues encountered in the process.
* `CommandExecution.log`: There is a wrapper above the patch action, which is used to manage the extension and invoke specific patch operation. This log contains details about the wrapper. For AutoPatching, the log has details on whether the specific patch operation was invoked.

### Arc-enabled servers

For Arc-enabled servers, review the [troubleshoot VM extensions](../azure-arc/servers/troubleshoot-vm-extensions.md) article for general troubleshooting steps.

To review the logs related to all actions performed by the extension, on Windows check for more details in `C:\ProgramData\GuestConfig\extension_Logs\Microsoft.SoftwareUpdateManagement\WindowsOsUpdateExtension`. It includes the following two log files of interest:

* `WindowsUpdateExtension.log`: Contains details related to the patch actions, such as the patches assessed and installed on the machine, and any issues encountered in the process.
* `cmd_execution_<numeric>_stdout.txt`: There is a wrapper above the patch action, which is used to manage the extension and invoke specific patch operation. This log contains details about the wrapper. For AutoPatching, the log has details on whether the specific patch operation was invoked.
* `cmd_excution_<numeric>_stderr.txt`

## Known issues

### Scenario: Patch run failed with Maintenance window exceeded property showing true even if time remained

#### Issue

When you view an update deployment in **Update History**, the property **Failed with Maintenance window exceeded** shows **true** even though enough time was left for execution. In this case, the one of the following is possible:

* No updates are shown.
* One or more updates are in a **Pending** state.
* Reboot status is **Required**, but a reboot was not attempted even when the reboot setting passed was `IfRequired` or `Always`.

#### Cause

During an update deployment, it checks for maintenance window utilization at multiple steps. Ten minutes of the maintenance window is reserved for reboot at any point. Before getting a list of missing updates or downloading/installing any update (except Windows service pack updates), it checks to verify if there are 15 minutes + 10 minutes for reboot (that is, 25 mins left in the maintenance window). 
For  Windows service pack updates, we check for 20 minutes + 10 minutes for reboot (that is, 30 minutes). If the deployment doesn't have the sufficient left, it skips the scan/download/install of updates. The deployment run then checks if a reboot is needed and if there is ten minutes left in the maintenance window. If there is, the deployment triggers a reboot, otherwise the reboot is skipped. In such cases, the status is updated to **Failed**, and the Maintenance window exceeded property is updated to ***true**. For cases where the time left is less than 25 minutes, updates are not scanned or attempted for installation. 

More details can be found by reviewing the logs in the file path provided in the error message of the deployment run.

#### Resolution

Setting a longer time range for maximum duration when triggering an [on-demand update deployment](deploy-updates.md) helps avoid the problem.

## Next steps

* To learn more about Azure Update management center (preview), see the [Overview](overview.md).
* To view logged results from all your machines, see [Querying logs and results from update management center (preview)](query-logs.md).