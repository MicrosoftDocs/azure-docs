---
title: Troubleshoot extension-based Hybrid Runbook Worker issues in Azure Automation 
description: This article tells how to troubleshoot and resolve issues that arise with Azure Automation extension-based Hybrid Runbook Workers.
services: automation
ms.date: 04/26/2023
ms.topic: troubleshooting 
ms.custom:
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
  - For windows: you can find the troubleshooter at `C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\<version>\bin\troubleshooter\TroubleShootWindowsExtension.ps1`
  - For Linux: you can find the troubleshooter at `/var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux-<version>/Troubleshooter/LinuxTroubleshooter.py`

- For Linux machines, the Hybrid worker extension creates a `hweautomation` user and starts the Hybrid worker under the user. Check whether the user `hweautomation` is set up with the correct permissions. If your runbook is trying to access any local resources, ensure that the `hweautomation` has the correct permissions to the local resources.

- Check whether the hybrid worker process is running.
   - For Windows: check the `Hybrid Worker Service` service.
   - For Linux: check the `hwd.` service.

- Collect logs:
  - For Windows: Run the log collector tool in </br>`C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\<version>\bin\troubleshooter\PullLogs.ps1` </br>
  Logs are in `C:\HybridWorkerExtensionLogs`.
  - For Linux: Logs are in folders </br>`/var/log/azure/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux` and `/home/hweautomation`.

### Scenario: Job failed to start as the Hybrid Worker was not available when the scheduled job started

#### Issue
Job fails to start on a Hybrid Worker and you see the following error:

*Failed to start, as hybrid worker was not available when scheduled job started, the hybrid worker was last active at mm/dd/yyyy*.

#### Cause
This error can occur due to the following reasons:
- The machines doesn't exist anymore.
- The machine is turned off and is unreachable.
- The machine has a network connectivity issue.
- The Hybrid Runbook Worker extension has been uninstalled from the machine.

#### Resolution
- Ensure that the machine exists, and Hybrid Runbook Worker extension is installed on it. The Hybrid Worker should be healthy and should give a heartbeat. Troubleshoot any network issues by checking the Microsoft-SMA event logs on the Workers in the Hybrid Runbook Worker Group that tried to run this job. 
- You can also monitor [HybridWorkerPing](../../azure-monitor/essentials/metrics-supported.md#microsoftautomationautomationaccounts) metric that provides the number of pings from a Hybrid Worker and can help to check ping-related issues. 

### Scenario: Job was suspended as it exceeded the job limit for a Hybrid Worker

#### Issue
Job gets suspended with the following error message:

*Job was suspended as it exceeded the job limit for a Hybrid Worker. Add more Hybrid Workers to the Hybrid Worker group to overcome this issue.*

#### Cause
Jobs might get suspended due to any of the following reasons:
- Each active Hybrid Worker in the group will poll for jobs every 30 seconds to see if any jobs are available. The Worker picks jobs on a first-come, first-serve basis. Depending on when a job was pushed, whichever Hybrid Worker within the Hybrid Worker Group pings the Automation service first picks up the job. A single hybrid worker can generally pick up four jobs per ping (that is, every 30 seconds). If your rate of pushing jobs is higher than four per 30 seconds and no other Worker picks up the job, the job might get suspended. 
- Hybrid Worker might not be polling as expected every 30 seconds. This could happen if the Worker is not healthy or there are network issues.  

#### Resolution
- If the job limit for a Hybrid Worker exceeds four jobs per 30 seconds, you can add more Hybrid Workers to the Hybrid Worker group for high availability and load balancing. You can also schedule jobs so they do not exceed the limit of four jobs per 30 seconds. The processing time of the jobs queue depends on the Hybrid worker hardware profile and load. Ensure that the Hybrid Worker is healthy and gives a heartbeat. 
- Troubleshoot any network issues by checking the Microsoft-SMA event logs on the Workers in the Hybrid Runbook Worker Group that tried to run this job. 
- You can also monitor the [HybridWorkerPing](../../azure-monitor/essentials/metrics-supported.md#microsoftautomationautomationaccounts) metric that provides the number of pings from a Hybrid Worker and can help to check ping-related issues. 

### Scenario: Hybrid Worker deployment fails with Private Link error

#### Issue

You are deploying an extension-based Hybrid Runbook Worker on a VM and it fails with error: *Authentication failed for private links*.

#### Cause
The virtual network of the VM is different from the private endpoint of Azure Automation account, **or** they are not connected.  

#### Resolution
Ensure that the private end point of Azure Automation account is connected to the same Virtual Network, to which the VM is connected. Follow the steps mentioned in [Planning based on your network](../how-to/private-link-security.md#planning-based-on-your-network) to connect to a private endpoint. Also [set public network access flags](../how-to/private-link-security.md#set-public-network-access-flags) to configure an Automation account to deny all public configuration and allow only connections through private endpoints. For more information on how to configure DNS settings for private endpoints, see [DNS configuration](../how-to/private-link-security.md#dns-configuration)

### Scenario: Hybrid Worker deployment fails when the provided Hybrid Worker group does not exist

#### Issue
You are deploying an extension-based Hybrid Runbook Worker on a VM and it fails with error: *Account/Group specified does not exist*.

#### Cause
The Hybrid Runbook Worker group to which the Hybrid Worker is to be deployed is already deleted. 

#### Resolution
Ensure that you create the Hybrid Runbook Worker group and add the VM as a Hybrid Worker in that group. Follow  the steps mentioned in [create a Hybrid Runbook Worker group](../extension-based-hybrid-runbook-worker-install.md#create-hybrid-worker-group) using the Azure portal.

### Scenario: Hybrid Worker deployment fails when system-assigned managed identity is not enabled on the VM

### Issue
You are deploying an extension-based Hybrid Runbook Worker on a VM and it fails with error:  
*Unable to retrieve IMDS identity endpoint for non-Azure VM. Ensure that the Azure connected machine agent is installed and System-assigned identity is enabled.*

### Cause
You are deploying the extension-based Hybrid Worker on a non-Azure VM that does not have Arc connected machine agent installed on it. 

### Resolution
Non-Azure machines must have the Arc connected machine agent installed on it, before deploying it as an extension-based Hybrid Runbook worker. To install the `AzureConnectedMachineAgent`, see [connect hybrid machines to Azure from the Azure portal](../../azure-arc/servers/onboard-portal.md)
for Arc-enabled servers or [Manage VMware virtual machines Azure Arc](../../azure-arc/vmware-vsphere/manage-vmware-vms-in-azure.md#enable-guest-management) to enable guest management for Arc-enabled VMware VM. 
 

### Scenario: Hybrid Worker deployment fails due to System assigned identity not enabled

### Issue
You are deploying an extension-based Hybrid Runbook Worker on a VM, and it fails with error: *Invalid Authorization Token*.

### Cause
User-assigned managed identity of the VM is enabled, but system-assigned managed identity is not enabled. 

### Resolution
Follow the steps listed below:

1. [Enable](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-vm) System-assigned managed identity of the VM. 
2. [Delete](../extension-based-hybrid-runbook-worker-install.md#delete-a-hybrid-runbook-worker) the Hybrid Worker extension installed on the VM. 
3. Re-install the Hybrid Worker extension on the VM. 


### Scenario: Installation process of Hybrid Worker extension on Windows VM gets stuck

### Issue
You have installed Hybrid Worker extension on a Windows VM from the Portal, but don't get a notification that the process has completed successfully.

### Cause
Sometimes the installation process might get stuck.

### Resolution
Follow the steps mentioned below to install Hybrid Worker extension again: 

1. Open PowerShell console 
1. Remove registry entry, if present: *HKLM:/Software/Microsoft/Azure/HybridWorker*
1. Remove the registry entry, if present: *HKLM:/Software/Microsoft/HybridRunbookWorkerV2* 
1. Go to Hybrid Worker extension installation folder
   Cd "C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\<version>" 
1. Install Hybrid Worker extension: `.\bin\install.ps1` 
1. Enable Hybrid Worker extension: `.\bin\enable.ps1`

### Scenario: Uninstallation process of Hybrid Worker extension on Windows VM gets stuck

#### Issue
You have installed a Hybrid Worker extension on a Windows VM from the portal, but don't get a notification that the process has completed successfully. 

#### Cause
Sometimes the uninstallation process might get stuck.

#### Resolution
1. Open PowerShell console 
1. Go to Hybrid Worker extension installation folder 
   Cd "C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\<version\>" 
1. Disable Hybrid Worker extension: `.\bin\disable.cmd`
1. Uninstall Hybrid Worker extension: `.\bin\uninstall.ps1`
1. Remove registry entry, if present: *HKLM:/Software/Microsoft/Azure/HybridWorker* 
1. Remove the registry entry, if present: *HKLM:/Software/Microsoft/HybridRunbookWorkerV2*


### Scenario: Installation process of Hybrid Worker extension on Linux VM gets stuck

#### Issue
You have installed a Hybrid Worker extension on a Linux VM from the portal, but don't get a notification that the process has completed successfully.

#### Cause
Sometimes the uninstallation process might get stuck.

#### Resolution
1. Go to folder: `rm -r /home/hweautomation/state`
1. Go to Hybrid Worker extension installation folder */var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux-\<version\>/*
1. Go to above folder and run command `rm mrseq`
1. Install Hybrid Worker Extension: *"installCommand": "./extension_shim.sh -c ./HWExtensionHandlers.py -i"*
1. Enable Hybrid Worker extension: *"enableCommand": "./extension_shim.sh -c ./HWExtensionHandlers.py -e"*

### Scenario: Uninstallation process of Hybrid Worker extension on Linux VM gets stuck

#### Issue
You have uninstalled Hybrid Worker extension on a Linux VM from the portal, but don't get a notification that the process has completed successfully.

#### Cause
Sometimes the uninstallation process might get stuck. 

#### Resolution
Follow the steps mentioned below to completely uninstall Hybrid Worker extension: 

1. Go to Hybrid Worker Extension installation folder:  
  */var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux-\<version\>/*
1. Disable the extension: `"disableCommand": "./extension_shim.sh -c ./HWExtensionHandlers.py -d" `
1. Uninstall the extension: `"uninstallCommand": "./extension_shim.sh -c ./HWExtensionHandlers.py -u"`
 
### Scenario: Runbook execution fails

#### Issue

Runbook execution fails, and you receive the following error message:

`The job action 'Activate' cannot be run, because the process stopped unexpectedly. The job action was attempted three times.`

Your runbook is suspended shortly after it attempts to execute three times. There are conditions that can interrupt the runbook from completing. The related error message might not include any additional information.

#### Cause

The following are possible causes:

* The runbooks can't authenticate with local resources.
* The hybrid worker is behind a proxy or firewall.
* The computer configured to run the Hybrid Runbook Worker doesn't meet the minimum hardware requirements.

#### Resolution

Verify that the computer has outbound access to **\*.azure-automation.net** on port 443.

Computers running the Hybrid Runbook Worker should meet the minimum hardware requirements before the worker is configured to host this feature. Runbooks and the background process they use might cause the system to be overused and cause runbook job delays or timeouts.

Confirm the computer to run the Hybrid Runbook Worker feature meets the minimum hardware requirements. If it does, monitor CPU and memory use to determine any correlation between the performance of Hybrid Runbook Worker processes and Windows. Any memory or CPU pressure can indicate the need to upgrade resources. You can also select a different compute resource that supports the minimum requirements and scale when workload demands indicate an increase is necessary.

Check the **Microsoft-SMA** event log for a corresponding event with the description `Win32 Process Exited with code [4294967295]`. The cause of this error is that you haven't configured authentication in your runbooks or specified the Run As credentials for the Hybrid Runbook Worker group. Review runbook permissions in [Running runbooks on a Hybrid Runbook Worker](../automation-hrw-run-runbooks.md) to confirm that you've correctly configured authentication for your runbooks.


### Scenario: No certificate was found in the certificate store on the Hybrid Runbook Worker

#### Issue

A runbook running on a Hybrid Runbook Worker fails with the following error message:

`Connect-AzAccount : No certificate was found in the certificate store with thumbprint 0000000000000000000000000000000000000000`  
`At line:3 char:1`  
`+ Connect-AzAccount -ServicePrincipal -Tenant $Conn.TenantID -Appl ...`  
`+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`  
`    + CategoryInfo          : CloseError: (:) [Connect-AzAccount],ArgumentException`  
`    + FullyQualifiedErrorId : Microsoft.Azure.Commands.Profile.ConnectAzAccountCommand`

#### Cause

This error occurs when you attempt to use a Run As account in a runbook that runs on a Hybrid Runbook Worker where the Run As account certificate isn't present. Hybrid Runbook Workers don't have the certificate asset locally by default. The Run As account requires this asset to operate properly.

#### Resolution

If your Hybrid Runbook Worker is an Azure VM, you can use [runbook authentication with managed identities](../automation-hrw-run-runbooks.md#runbook-auth-managed-identities) instead. This scenario simplifies authentication by allowing you to authenticate to Azure resources using the managed identity of the Azure VM instead of the Run As account. When the Hybrid Runbook Worker is an on-premises machine, you need to install the Run As account certificate on the machine. To learn how to install the certificate, see the steps to run the PowerShell runbook **Export-RunAsCertificateToHybridWorker** in [Run runbooks on a Hybrid Runbook Worker](../automation-hrw-run-runbooks.md).


### Scenario: Set-AzStorageBlobContent fails on a Hybrid Runbook Worker 

#### Issue

Runbook fails when it tries to execute `Set-AzStorageBlobContent`, and you receive the following error message:

`Set-AzStorageBlobContent : Failed to open file xxxxxxxxxxxxxxxx: Illegal characters in path`

#### Cause

 This error is caused by the long file name behavior of calls to `[System.IO.Path]::GetFullPath()`, which adds UNC paths.

#### Resolution

As a workaround, you can create a configuration file named `OrchestratorSandbox.exe.config` with the following content:

```azurecli
<configuration>
  <runtime>
    <AppContextSwitchOverrides value="Switch.System.IO.UseLegacyPathHandling=false" />
  </runtime>
</configuration>
```

Place this file in the same folder as the executable file `OrchestratorSandbox.exe`. For example,

`%ProgramFiles%\Microsoft Monitoring Agent\Agent\AzureAutomation\7.3.702.0\HybridAgent`


### Scenario: Microsoft Azure VMs automatically dropped from a hybrid worker group

#### Issue

You can't see the Hybrid Runbook Worker or VMs when the worker machine has been turned off for a long time.

#### Cause

The Hybrid Runbook Worker machine hasn't pinged Azure Automation for more than 30 days. As a result, Automation has purged the Hybrid Runbook Worker group or the System Worker group. 

#### Resolution

Start the worker machine, and then re-register it with Azure Automation. For instructions on how to install the runbook environment and connect to Azure Automation, see [Deploy a Windows Hybrid Runbook Worker](../automation-windows-hrw-install.md).

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
