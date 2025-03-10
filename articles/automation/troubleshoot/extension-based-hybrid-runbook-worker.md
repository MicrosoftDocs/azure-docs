---
title: Troubleshoot extension-based Hybrid Runbook Worker issues in Azure Automation 
description: This article tells how to troubleshoot and resolve issues that arise with Azure Automation extension-based Hybrid Runbook Workers.
services: automation
ms.date: 08/26/2024
ms.topic: troubleshooting 
ms.custom:
---

# Troubleshoot VM extension-based Hybrid Runbook Worker issues in Automation

This article provides information on troubleshooting and resolving issues with Azure Automation extension-based Hybrid Runbook Workers. For troubleshooting agent-based workers, see [Troubleshoot agent-based Hybrid Runbook Worker issues in Automation](./hybrid-runbook-worker.md). For general information, see [Hybrid Runbook Worker overview](../automation-hybrid-runbook-worker.md).

## General checklist

To help troubleshoot issues with extension-based Hybrid Runbook Workers:

- Check the OS is supported, and the prerequisites have been met. See [Prerequisites](../extension-based-hybrid-runbook-worker-install.md#prerequisites).

- Check whether the system-assigned managed identity is enabled on the VM. Azure VMs and Arc enabled Azure Machines should be enabled with a system-assigned managed identity.

- Check whether the extension is enabled with the right settings. Setting file should have right `AutomationAccountURL`. Cross-check the URL with Automation account property - `AutomationHybridServiceUrl`.  
  - For Windows, you can find the settings file here:
   > [!TIP] 
   > Replace `*` in the below path with the specific version that is installed if you know it.
    ```
    C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\*\RuntimeSettings
    ```
  - For Linux, you can find the settings file here:
    ```
    /var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux/
    ```

- Check the error message shown in the Hybrid worker extension status/Detailed Status. It contains error message(s) and respective recommendation(s) to fix the issue.

- Run the troubleshooter tool on the VM and it generates an output file. Open the output file and verify the errors identified by the troubleshooter tool.
  - For Windows, you can find the troubleshooter here:
   > [!TIP] 
   > Replace `*` in the below path with the specific version that is installed if you know it.
    ```
    C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\*\bin\troubleshooter\TroubleShootWindowsExtension.ps1
    ```
  - For Linux, you can find the troubleshooter here:
   > [!TIP] 
   > Replace `*` in the below path with the specific version that is installed if you know it.
    ```
    /var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux-*/Troubleshooter/LinuxTroubleshooter.py
    ```

- For Linux machines, the Hybrid worker extension creates a `hweautomation` user and starts the Hybrid worker under the user. Check whether the user `hweautomation` is set up with the correct permissions. If your runbook is trying to access any local resources, ensure that the `hweautomation` has the correct permissions to the local resources.

- Check whether the hybrid worker process is running.
   - For Windows, check the `Hybrid Worker Service` (***HybridWorkerService***) service.
   - For Linux, check the `hwd` service.

- Collect logs:
  - For Windows, run the log collector tool located here:
   > [!TIP] 
   > Replace `*` in the below path with the specific version that is installed if you know it.
    ```
    C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\*\bin\troubleshooter\PullLogs.ps1
    ```
    Logs will be located here: 
    ```
    C:\HybridWorkerExtensionLogs
    ```
  - For Linux: Logs are in the following folders:
    ```
    /var/log/azure/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux
    ```
    and
    ```
    /home/hweautomation
    ```

### Scenario: Runbooks go into a suspended state on a Hybrid Runbook Worker when using a custom account on a server with User Account Control (UAC) enabled

#### Issue
Jobs fail and go into a suspended state on the Hybrid Runbook Worker. The Microsoft-SMA event logs indicate
`Win32 Process Exited with code [2148734720]` and a corresponding error in Application log when the runbook tries to execute is `.NET Runtime version : 4.0.30319.0` indicating that the application couldn't be started.

#### Cause
When a system has UAC/LUA in place, permissions must be granted directly and not through any group membership and when user has to elevate permissions, the jobs begin to fail.

#### Resolution
For Custom user on the Hybrid Runbook Worker, update the permissions in the following folders:

| Folder |Permissions |
|--- | --- |
| `C:\ProgramData\AzureConnectedMachineAgent\Tokens` | Read |
| `C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows` | Read and Execute |


### Scenario: Job failed to start as the Hybrid Worker wasn't available when the scheduled job started

#### Issue
Job fails to start on a Hybrid Worker, and you see the following error:

*Failed to start, as hybrid worker wasn't available when scheduled job started, the hybrid worker was last active at mm/dd/yyyy*.

#### Cause
This error can occur due to the following reasons:
- The machines don't exist anymore.
- The machine is turned off and is unreachable.
- The machine has a network connectivity issue.
- The Hybrid Runbook Worker extension has been uninstalled from the machine.

#### Resolution
- Ensure that the machine exists, and Hybrid Runbook Worker extension is installed on it. The Hybrid Worker should be healthy and should give a heartbeat. Troubleshoot any network issues by checking the Microsoft-SMA event logs on the Workers in the Hybrid Runbook Worker Group that tried to run this job. 
- You can also monitor [HybridWorkerPing](/azure/azure-monitor/essentials/metrics-supported#microsoftautomationautomationaccounts) metric that provides the number of pings from a Hybrid Worker and can help to check ping-related issues. 

### Scenario: Job was suspended as it exceeded the job limit for a Hybrid Worker

#### Issue
Job gets suspended with the following error message:

*Job was suspended as it exceeded the job limit for a Hybrid Worker. Add more Hybrid Workers to the Hybrid Worker group to overcome this issue.*

#### Cause
Jobs might get suspended due to any of the following reasons:
- Each active Hybrid Worker in the group will poll for jobs every 30 seconds to see if any jobs are available. The Worker picks jobs on a first-come, first-serve basis. Depending on when a job was pushed, whichever Hybrid Worker within the Hybrid Worker Group pings the Automation service first picks up the job. A single hybrid worker can generally pick up four jobs per ping (that is, every 30 seconds). If your rate of pushing jobs is higher than four per 30 seconds and no other Worker picks up the job, the job might get suspended. 
- Hybrid Worker might not be polling as expected every 30 seconds. This could happen if the Worker isn't healthy or there are network issues.  

#### Resolution
- If the job limit for a Hybrid Worker exceeds four jobs per 30 seconds, you can add more Hybrid Workers to the Hybrid Worker group for high availability and load balancing. You can also schedule jobs so they do not exceed the limit of four jobs per 30 seconds. The processing time of the jobs queue depends on the Hybrid worker hardware profile and load. Ensure that the Hybrid Worker is healthy and gives a heartbeat. 
- Troubleshoot any network issues by checking the Microsoft-SMA event logs on the Workers in the Hybrid Runbook Worker Group that tried to run this job. 
- You can also monitor the [HybridWorkerPing](/azure/azure-monitor/essentials/metrics-supported#microsoftautomationautomationaccounts) metric that provides the number of pings from a Hybrid Worker and can help to check ping-related issues. 

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
Non-Azure machines must have the Arc connected machine agent installed on it, before deploying it as an extension-based Hybrid Runbook worker. To install the `AzureConnectedMachineAgent`, see [connect hybrid machines to Azure from the Azure portal](/azure/azure-arc/servers/onboard-portal)
for Arc-enabled servers or [Manage VMware virtual machines Azure Arc](/azure/azure-arc/vmware-vsphere/manage-vmware-vms-in-azure#enable-guest-management) to enable guest management for Arc-enabled VMware VM. 
 

### Scenario: Hybrid Worker deployment fails due to System assigned identity not enabled

### Issue
You are deploying an extension-based Hybrid Runbook Worker on a VM, and it fails with error: *Invalid Authorization Token*.

### Cause
User-assigned managed identity of the VM is enabled, but system-assigned managed identity isn't enabled. 

### Resolution
Follow the steps listed below:

1. [Enable](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-vm) System-assigned managed identity of the VM. 
2. [Delete](../extension-based-hybrid-runbook-worker-install.md#delete-a-hybrid-runbook-worker) the Hybrid Worker extension installed on the VM. 
3. Reinstall the Hybrid Worker extension on the VM. 


### Scenario: Installation process of Hybrid Worker extension on Windows VM gets stuck

### Issue
You have installed Hybrid Worker extension on a Windows VM from the Portal, but don't get a notification that the process has completed successfully.

### Cause
Sometimes the installation process might get stuck.

### Resolution
Follow the steps mentioned below to install Hybrid Worker extension again: 

1. Open PowerShell console.

1. **Remove the registry key**, if present: `HKLM:\Software\Microsoft\Azure\HybridWorker`

   1. PowerShell code to remove the registry key along with any subkeys and values under it.:  
   
      ```powershell
      Get-Item HKLM:\Software\Microsoft\Azure\HybridWorker | Remove-Item -Recurse
      ```
      
1. **Remove the registry key**, if present: `HKLM:\Software\Microsoft\HybridRunbookWorkerV2`

   1. PowerShell code to remove the registry key along with any subkeys and values under it.:  
   
      ```powershell
      Get-Item HKLM:\Software\Microsoft\HybridRunbookWorkerV2 | Remove-Item -Recurse
      ```
1. Navigate to the Hybrid Worker extension installation folder:

   > [!TIP] 
   > Replace `*` in the below command with the specific version that is installed if you know it.
   ```powershell
   cd "C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\*"
   ```
1. **Install** the Hybrid Worker extension: 

   ```powershell
   .\bin\install.ps1
   ``` 
1. **Enable** the Hybrid Worker extension: 

   ```powershell
   .\bin\enable.ps1
   ```

### Scenario: Uninstallation process of Hybrid Worker extension on Windows VM gets stuck

#### Issue
You have installed a Hybrid Worker extension on a Windows VM from the portal, but don't get a notification that the process has completed successfully. 

#### Cause
Sometimes the uninstallation process might get stuck.

#### Resolution
1. Open PowerShell console.

1. Navigate to the Hybrid Worker extension installation folder:

   > [!TIP] 
   > Replace `*` in the below command with the specific version that is installed if you know it.
   ```powershell
   cd "C:\Packages\Plugins\Microsoft.Azure.Automation.HybridWorker.HybridWorkerForWindows\*"
   ```
1. **Disable** the Hybrid Worker extension: 

   ```powershell
   .\bin\disable.cmd
   ```
1. **Uninstall** the Hybrid Worker extension:

   ```powershell
   .\bin\uninstall.ps1
   ```
1. **Remove registry key**, if present: `HKLM:\Software\Microsoft\Azure\HybridWorker`

   1. PowerShell code to remove the registry key along with any subkeys and values under it.:
   
      ```powershell
      Get-Item HKLM:\Software\Microsoft\Azure\HybridWorker | Remove-Item -Recurse
      ```
      
1. **Remove the registry key**, if present: `HKLM:\Software\Microsoft\HybridRunbookWorkerV2`

   1. PowerShell code to remove the registry key along with any subkeys and values under it.:
   
      ```powershell
      Get-Item HKLM:\Software\Microsoft\HybridRunbookWorkerV2 | Remove-Item -Recurse
      ```


### Scenario: Installation process of Hybrid Worker extension on Linux VM gets stuck

#### Issue
You have installed a Hybrid Worker extension on a Linux VM from the portal, but don't get a notification that the process has completed successfully.

#### Cause
Sometimes the uninstallation process might get stuck.

#### Resolution
1. **Delete** the `state` folder: 
   ```bash
   rm -r /home/hweautomation/state
   ```
1. Navigate to the Hybrid Worker extension installation folder:
   > [!TIP] 
   > Replace `*` in the below command with the specific version that is installed if you know it.
   ```bash
   cd /var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux-*/
   ```
   
1. **Delete** the mrseq file:
   ```bash
   rm mrseq
   ```
1. **Install** the Hybrid Worker Extension:
   ```bash
   ./extension_shim.sh -c ./HWExtensionHandlers.py -i
   ```

1. **Enable** the Hybrid Worker extension:
   ```bash
   ./extension_shim.sh -c ./HWExtensionHandlers.py -e
   ```

### Scenario: Uninstallation process of Hybrid Worker extension on Linux VM gets stuck

#### Issue
You have uninstalled Hybrid Worker extension on a Linux VM from the portal, but don't get a notification that the process has completed successfully.

#### Cause
Sometimes the uninstallation process might get stuck. 

#### Resolution
Follow the steps mentioned below to completely uninstall Hybrid Worker extension: 

1. Navigate to the Hybrid Worker Extension installation folder:
   > [!TIP] 
   > Replace `*` in the below command with the specific version that is installed if you know it.
   ```bash
   cd /var/lib/waagent/Microsoft.Azure.Automation.HybridWorker.HybridWorkerForLinux-*/
   ```
1. **Disable** the Hybrid Worker extension:
   ```bash
   ./extension_shim.sh -c ./HWExtensionHandlers.py -d
   ```
1. **Uninstall** the Hybrid Worker extension:
   ```bash
   ./extension_shim.sh -c ./HWExtensionHandlers.py -u
   ```
 
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

```
Connect-AzAccount : No certificate was found in the certificate store with thumbprint 0000000000000000000000000000000000000000
At line:3 char:1
+ Connect-AzAccount -ServicePrincipal -Tenant $Conn.TenantID -Appl ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : CloseError: (:) [Connect-AzAccount],ArgumentException
    + FullyQualifiedErrorId : Microsoft.Azure.Commands.Profile.ConnectAzAccountCommand
```

#### Cause

This error occurs when you attempt to use a Run As account in a runbook that runs on a Hybrid Runbook Worker where the Run As account certificate isn't present. Hybrid Runbook Workers don't have the certificate asset locally by default. The Run As account requires this asset to operate properly.

#### Resolution

If your Hybrid Runbook Worker is an Azure VM, you can use [runbook authentication with managed identities](../automation-hrw-run-runbooks.md#runbook-auth-managed-identities) instead. This scenario simplifies authentication by allowing you to authenticate to Azure resources using the managed identity of the Azure VM instead of the Run As account. When the Hybrid Runbook Worker is an on-premises machine, you need to install the Run As account certificate on the machine. To learn how to install the certificate, see the steps to run the PowerShell runbook **Export-RunAsCertificateToHybridWorker** in [Run runbooks on a Hybrid Runbook Worker](../automation-hrw-run-runbooks.md).


### Scenario: Microsoft Azure VMs automatically dropped from a hybrid worker group

#### Issue

You can't see the Hybrid Runbook Worker or VMs when the worker machine has been turned off for a long time.

#### Cause

The Hybrid Runbook Worker machine hasn't pinged Azure Automation for more than 30 days. As a result, Automation has purged the Hybrid Runbook Worker group or the System Worker group. 

#### Resolution

Start the worker machine, and then re-register it with Azure Automation. For instructions on how to install the runbook environment and connect to Azure Automation, see [Deploy a Windows Hybrid Runbook Worker](../automation-windows-hrw-install.md).


### Scenario: Hybrid Runbook Worker job execution on Azure Arc-enabled Windows server that uses a custom credential is unexpectedly suspended

#### Issue

Runbook jobs executed from an Azure Arc-enabled server that use a custom credential suddenly begin to go into a suspended state.

#### Cause

This is caused by a known issue where folder permissions are removed when the Azure Connected Machine agent is updated. The folder permissions on `C:\ProgramData\AzureConnectedMachineAgent\Tokens` are removed when the Azure Connected Machine agent is updated.

#### Resolution

The current resolution is to reapply the folder permissions to `C:\ProgramData\AzureConnectedMachineAgent\Tokens` when the Azure Connected Machine agent is updated. See [Permissions for Hybrid worker credentials](../extension-based-hybrid-runbook-worker-install.md#permissions-for-hybrid-worker-credentials).


## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://x.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
