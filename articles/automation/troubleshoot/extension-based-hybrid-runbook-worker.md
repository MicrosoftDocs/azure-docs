---
title: Troubleshoot extension-based Hybrid Runbook Worker issues in Azure Automation 
description: This article tells how to troubleshoot and resolve issues that arise with Azure Automation extension-based Hybrid Runbook Workers.
services: automation
ms.date: 09/28/2021
ms.topic: troubleshooting 
ms.custom: devx-track-azurepowershell
---

# Troubleshoot VM extension-based Hybrid Runbook Worker issues in Automation

This article provides information on troubleshooting and resolving issues with Azure Automation extension-based Hybrid Runbook Workers. For troubleshooting agent-based workers, see [Troubleshoot agent-based Hybrid Runbook Worker issues in Automation](./hybrid-runbook-worker.md). For general information, see [Hybrid Runbook Worker overview](../automation-hybrid-runbook-worker.md).

## General checklist

To help troubleshoot issues with extension-based Hybrid Runbook Workers:

- Check the OS is supported and the prerequisites have been met. See [Prerequisites](../extension-based-hybrid-runbook-worker-install.md#prerequisites).

- Check whether the system-assigned managed identity is enabled on the VM. Azure VMs and Arc enabled Azure Machines should be enabled with a system-assigned managed identity.

- Check whether the extension is enabled with the right settings. Setting file should have right `AutomationAccountURL`. Cross-check the URL with Automation account property - `AutomationHybridServiceUrl`.  
  - For windows: you can find the settings file at `C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\<version>\RuntimeSettings`.
  - For Linux: you can find the settings file at `/var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux/`.

- Check the error message shown in the Hybrid worker extension status/Detailed Status. It contains error message(s) and respective recommendation(s) to fix the issue.

- Run the troubleshooter tool on the VM and it will generate an output file. Open the output file and verify the errors identified by the troubleshooter tool.
  - For windows: you can find the troubleshooter at `C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\<version>\bin\troubleshooter\TroubleShootWindowsExtension.ps1`.
  - For Linux: you can find the troubleshooter at `/var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux/troubleshootLinuxExtension.py`.

- For Linux machines, the Hybrid worker extension creates a `hweautomation` user and starts the Hybrid worker under the user. Check whether the user `hweautomation` is set up with the correct permissions. If your runbook is trying to access any local resources, ensure that the `hweautomation` has the correct permissions to the local resources.

- Check whether the hybrid worker process is running.
   - For Windows: check the `Hybrid Worker Service` service.
   - For Linux: check the `hwd.` service.

- Run the log collector tool and review the collected logs.
   - For Windows: the logs are located at `C:\HybridWorkerExtensionLogs`. The tool is at `C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\<version>\bin\troubleshooter\PullLogs.ps1`. The extension log is `HybridWorkerExtensionHandler.log`. The worker log is `SME.log`.
   - For Linux: the logs are located at `/home/nxautomation/run`. The tool is at `/var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux/logcollector.py`. The worker log is `worker.log`. The extension registration log is `register_log`. The extension startup log is `startup_log`. The extension log is `extension_out`.

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
