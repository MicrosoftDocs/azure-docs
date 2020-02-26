---
title: Troubleshoot errors with Azure Update Management
description: Learn how to troubleshoot and resolve issues with the Update Management solution in Azure.
services: automation
author: mgoedtel
ms.author: magoedte
ms.date: 05/31/2019
ms.topic: conceptual
ms.service: automation
manager: carmonm
---
# Troubleshooting issues with Update Management

This article discusses solutions to issues that you might encounter when you use Update Management.

There's an agent troubleshooter for the Hybrid Worker agent to determine the underlying problem. To learn more about the troubleshooter, see [Troubleshoot update agent issues](update-agent-issues.md). For all other issues, use the following troubleshooting guidance.

If you encounter issues while you're trying to onboard the solution on a virtual machine (VM), check the **Operations Manager** log under **Application and Services Logs** on the local machine for events with event ID 4502 and event details that contain **Microsoft.EnterpriseManagement.HealthService.AzureAutomation.HybridAgent**.

The following section highlights specific error messages and possible resolutions for each. For other onboarding issues see [Troubleshoot solution onboarding](onboarding.md).

## <a name="nologs"></a>Scenario: Machines don't show up in the portal under Update Management

### Issue

You experience the following symptoms:

* Your machine shows **Not configured** from the Update Management view of a VM.

* Your machines are missing from the Update Management view of your Azure Automation account.

* You have machines that show as **Not Assessed** under **Compliance**. However, you see heartbeat data in Azure Monitor logs for the Hybrid Runbook Worker but not for Update Management.

### Cause

This issue can be caused by local configuration issues or by improperly configured scope configuration.

You might have to reregister and reinstall the Hybrid Runbook Worker.

You might have defined a quota in your workspace that's been reached and that's preventing further data storage.

### Resolution

* Run the troubleshooter for [Windows](update-agent-issues.md#troubleshoot-offline) or [Linux](update-agent-issues-linux.md#troubleshoot-offline), depending on the OS.

* Make sure your machine is reporting to the correct workspace. For guidance on how to verify this aspect, see [Verify agent connectivity to Log Analytics](../../azure-monitor/platform/agent-windows.md#verify-agent-connectivity-to-log-analytics). Also make sure this workspace is linked to your Azure Automation account. To confirm, go to your Automation account and select **Linked workspace** under **Related Resources**.

* Make sure the machines show up in your Log Analytics workspace. Run the following query in the Log Analytics workspace that's linked to your Automation account:

  ```loganalytics
  Heartbeat
  | summarize by Computer, Solutions
  ```
  If you don't see your machine in the query results, it hasn't recently checked in, which means there's probably a local configuration issue and you should [reinstall the agent](../../azure-monitor/learn/quick-collect-windows-computer.md#install-the-agent-for-windows). If your machine shows up in the query results, you need to verify the scope configuration specified in the next bulleted item in this list.

* Check for scope configuration problems. [Scope configuration](../automation-onboard-solutions-from-automation-account.md#scope-configuration) determines which machines get configured for the solution. If your machine is showing up in your workspace but not in the **Update Management** portal, you'll need to configure the scope configuration to target the machines. To learn how to do this, see [Onboard machines in the workspace](../automation-onboard-solutions-from-automation-account.md#onboard-machines-in-the-workspace).

* In your workspace, run the following query:

  ```loganalytics
  Operation
  | where OperationCategory == 'Data Collection Status'
  | sort by TimeGenerated desc
  ```
  If you get a `Data collection stopped due to daily limit of free data reached. Ingestion status = OverQuota` result, there's a quota defined on your workspace that's been reached and that has stopped data from being saved. In your workspace, go to **Usage and estimated costs** > **data volume management** and check your quota or remove it.

* If these steps don't resolve your problem, follow the steps at [Deploy a Windows Hybrid Runbook Worker](../automation-windows-hrw-install.md) to reinstall the Hybrid Worker for Windows. Or, for Linux, [deploy a Linux Hybrid Runbook Worker](../automation-linux-hrw-install.md).

## <a name="rp-register"></a>Scenario: Unable to register Automation Resource Provider for subscriptions

### Issue

When you work with solutions in your Automation account, you encounter the following error:

```error
Error details: Unable to register Automation Resource Provider for subscriptions:
```

### Cause

The Automation Resource Provider isn't registered in the subscription.

### Resolution

To register the Automation Resource Provider, follow these steps in the Azure portal:

1. In the Azure service list at the bottom of the portal, select **All services**, and then select **Subscriptions** in the General service group.
2. Select your subscription.
3. Under **Settings**, select **Resource Providers**.
4. From the list of resource providers, verify that the **Microsoft.Automation** resource provider is registered.
5. If it's not listed, register the **Microsoft.Automation** provider by following the steps at [Resolve errors for resource provider registration](/azure/azure-resource-manager/resource-manager-register-provider-errors).

## <a name="components-enabled-not-working"></a>Scenario: The components for the Update Management solution have been enabled, and now this virtual machine is being configured

### Issue

You continue to see the following message on a virtual machine 15 minutes after onboarding:

```error
The components for the 'Update Management' solution have been enabled, and now this virtual machine is being configured. Please be patient, as this can sometimes take up to 15 minutes.
```

### Cause

This error can occur for the following reasons:

- Communication with the Automation account is being blocked.
- The VM being onboarded might have come from a cloned machine that wasn't sysprepped with the Microsoft Monitoring Agent (MMA) installed.

### Resolution

1. Go to [Network planning](../automation-hybrid-runbook-worker.md#network-planning) to learn about which addresses and ports must be allowed for Update Management to work.
2. If you're using a cloned image:
   1. In your Log Analytics workspace, remove the VM from the saved search for the `MicrosoftDefaultScopeConfig-Updates` scope configuration if it's shown. Saved searches can be found under **General** in your workspace.
   2. Run `Remove-Item -Path "HKLM:\software\microsoft\hybridrunbookworker" -Recurse -Force`.
   3. Run `Restart-Service HealthService` to restart the `HealthService`. This recreates the key and generates a new UUID.
   4. If this approach doesn't work, run sysprep on the image first and then install the MMA.

## <a name="multi-tenant"></a>Scenario: You receive a linked subscription error when you create an update deployment for machines in another Azure tenant

### Issue

You encounter the following error when you try to create an update deployment for machines in another Azure tenant:

```error
The client has permission to perform action 'Microsoft.Compute/virtualMachines/write' on scope '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroupName/providers/Microsoft.Automation/automationAccounts/automationAccountName/softwareUpdateConfigurations/updateDeploymentName', however the current tenant '00000000-0000-0000-0000-000000000000' is not authorized to access linked subscription '00000000-0000-0000-0000-000000000000'.
```

### Cause

This error occurs when you create an update deployment that has Azure VMs in another tenant that's included in an update deployment.

### Resolution

Use the following workaround to get these items scheduled. You can use the [New-AzureRmAutomationSchedule](/powershell/module/azurerm.automation/new-azurermautomationschedule) cmdlet with the `-ForUpdate` switch to create a schedule. Then, use the [New-AzureRmAutomationSoftwareUpdateConfiguration](/powershell/module/azurerm.automation/new-azurermautomationsoftwareupdateconfiguration
) cmdlet and pass the machines in the other tenant to the `-NonAzureComputer` parameter. The following example shows how to do this:

```azurepowershell-interactive
$nonAzurecomputers = @("server-01", "server-02")

$startTime = ([DateTime]::Now).AddMinutes(10)

$s = New-AzureRmAutomationSchedule -ResourceGroupName mygroup -AutomationAccountName myaccount -Name myupdateconfig -Description test-OneTime -OneTime -StartTime $startTime -ForUpdate

New-AzureRmAutomationSoftwareUpdateConfiguration  -ResourceGroupName $rg -AutomationAccountName $aa -Schedule $s -Windows -AzureVMResourceId $azureVMIdsW -NonAzureComputer $nonAzurecomputers -Duration (New-TimeSpan -Hours 2) -IncludedUpdateClassification Security,UpdateRollup -ExcludedKbNumber KB01,KB02 -IncludedKbNumber KB100
```

## <a name="node-reboots"></a>Scenario: Unexplained reboots

### Issue

Even though you've set the **Reboot Control** option to **Never Reboot**, machines are still rebooting after updates are installed.

### Cause

Windows Update can be modified by several registry keys, any of which can modify reboot behavior.

### Resolution

Review the registry keys listed under [Configuring Automatic Updates by editing the registry](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry) and [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) to make sure your machines are configured properly.

## <a name="failed-to-start"></a>Scenario: Machine shows "Failed to start" in an update deployment

### Issue

A machine shows a **Failed to start** status. When you view the specific details for the machine, you see the following error:

```error
Failed to start the runbook. Check the parameters passed. RunbookName Patch-MicrosoftOMSComputer. Exception You have requested to create a runbook job on a hybrid worker group that does not exist.
```

### Cause

This error can occur for one of the following reasons:

* The machine doesn’t exist anymore.
* The machine is turned off and unreachable.
* The machine has a network connectivity issue, and therefore the hybrid worker on the machine is unreachable.
* There was an update to the MMA that changed the SourceComputerId.
* Your update run was throttled if you hit the limit of 2,000 concurrent jobs in an Automation account. Each deployment is considered a job, and each machine in an update deployment counts as a job. Any other automation job or update deployment currently running in your Automation account counts toward the concurrent job limit.

### Resolution

When applicable, use [dynamic groups](../automation-update-management-groups.md) for your update deployments. Additionally:

* Verify that the machine still exists and is reachable. If it doesn't exist, edit your deployment and remove the machine.
* See the [network planning](../automation-update-management.md#ports) section for a list of ports and addresses that are required for Update Management, and then verify that your machine meets these requirements.
* Run the following query in Log Analytics to find machines in your environment whose `SourceComputerId` has changed. Look for computers that have the same `Computer` value but a different `SourceComputerId` value. 

   ```loganalytics
   Heartbeat | where TimeGenerated > ago(30d) | distinct SourceComputerId, Computer, ComputerIP
   ```
   After you find affected machines, edit the update deployments that target those machines, and then remove and re-add them so that `SourceComputerId` reflects the correct value.

## <a name="updates-nodeployment"></a>Scenario: Updates are installed without a deployment

### Issue

When you enroll a Windows machine in Update Management, you see updates installed without a deployment.

### Cause

On Windows, updates are installed automatically as soon as they're available. This behavior can cause confusion if you didn't schedule an update to be deployed to the machine.

### Resolution

The  `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU` registry key defaults to a setting of 4: **auto download and install**.

For Update Management clients, we recommend setting this key to 3: **auto download but do not auto install**.

For more information, see [Configuring Automatic Updates](https://docs.microsoft.com/windows/deployment/update/waas-wu-settings#configure-automatic-updates).

## <a name="machine-already-registered"></a>Scenario: Machine is already registered to a different account

### Issue

You receive the following error message:

```error
Unable to Register Machine for Patch Management, Registration Failed with Exception System.InvalidOperationException: {"Message":"Machine is already registered to a different account."}
```

### Cause

The machine has already been onboarded to another workspace for Update Management.

### Resolution

1. Follow the steps under [Machines don't show up in the portal under Update Management](#nologs) to make sure the machine is reporting to the correct workspace.
2. Clean up old artifacts on the machine by [deleting the hybrid runbook group](../automation-hybrid-runbook-worker.md#remove-a-hybrid-worker-group), and then try again.

## <a name="machine-unable-to-communicate"></a>Scenario: Machine can't communicate with the service

### Issue

You receive one of the following error messages:

```error
Unable to Register Machine for Patch Management, Registration Failed with Exception System.Net.Http.HttpRequestException: An error occurred while sending the request. ---> System.Net.WebException: The underlying connection was closed: An unexpected error occurred on a receive. ---> System.ComponentModel.Win32Exception: The client and server can't communicate, because they do not possess a common algorithm
```

```error
Unable to Register Machine for Patch Management, Registration Failed with Exception Newtonsoft.Json.JsonReaderException: Error parsing positive infinity value.
```

```error
The certificate presented by the service <wsid>.oms.opinsights.azure.com was not issued by a certificate authority used for Microsoft services. Contact your network administrator to see if they are running a proxy that intercepts TLS/SSL communication.
```

```error
Access is denied. (Exception form HRESULT: 0x80070005(E_ACCESSDENIED))
```

### Cause

A proxy, gateway, or firewall might be blocking network communication. 

### Resolution

Review your networking and make sure appropriate ports and addresses are allowed. See [network requirements](../automation-hybrid-runbook-worker.md#network-planning) for a list of ports and addresses that are required by Update Management and Hybrid Runbook Workers.

## <a name="unable-to-create-selfsigned-cert"></a>Scenario: Unable to create self-signed certificate

### Issue

You receive one of the following error messages:

```error
Unable to Register Machine for Patch Management, Registration Failed with Exception AgentService.HybridRegistration. PowerShell.Certificates.CertificateCreationException: Failed to create a self-signed certificate. ---> System.UnauthorizedAccessException: Access is denied.
```

### Cause

The Hybrid Runbook Worker couldn't generate a self-signed certificate.

### Resolution

Verify that the system account has read access to the **C:\ProgramData\Microsoft\Crypto\RSA** folder, and try again.

## <a name="mw-exceeded"></a>Scenario: The scheduled update failed with a MaintenanceWindowExceeded error

### Issue

The default maintenance window for updates is 120 minutes. You can increase the maintenance window to a maximum of 6 hours, or 360 minutes.

### Resolution

Edit any failing scheduled update deployments, and increase the maintenance window.

For more information on maintenance windows, see [Install updates](../automation-tutorial-update-management.md#schedule-an-update-deployment).

## <a name="hresult"></a>Scenario: Machine shows as "Not assessed" and shows an HResult exception

### Issue

* You have machines that show as **Not Assessed** under **Compliance**, and you see an exception message below it.
* You have machines that show as not assessed.
* You see an HRESULT error code in the portal.

### Cause

The Update Agent (Windows Update Agent on Windows; the package manager for a Linux distribution) isn't configured correctly. Update Management relies on the machine's Update Agent to provide the updates that are needed, the status of the patch, and the results of deployed patches. Without this information, Update Management can't properly report on the patches that are needed or installed.

### Resolution

Try to perform updates locally on the machine. If this fails, it typically means there's a configuration error with the update agent.

This problem is frequently caused by network configuration and firewall issues. Try the following:

* For Linux, check the appropriate documentation to make sure you can reach the network endpoint of your package repository.
* For Windows, check your agent configuration as listed in [Updates aren't downloading from the intranet endpoint (WSUS/SCCM)](/windows/deployment/update/windows-update-troubleshooting#updates-arent-downloading-from-the-intranet-endpoint-wsussccm).
  * If the machines are configured for Windows Update, make sure you can reach the endpoints described in [Issues related to HTTP/proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy).
  * If the machines are configured for Windows Server Update Services (WSUS), make sure you can reach the WSUS server configured by the [WUServer registry key](/windows/deployment/update/waas-wu-settings).

If you see an HRESULT, double-click the exception displayed in red to see the entire exception message. Review the following table for potential solutions or recommended actions:

|Exception  |Resolution or action  |
|---------|---------|
|`Exception from HRESULT: 0x……C`     | Search the relevant error code in [Windows update error code list](https://support.microsoft.com/help/938205/windows-update-error-code-list) to find additional details about the cause of the exception.        |
|`0x8024402C`</br>`0x8024401C`</br>`0x8024402F`      | These indicate network connectivity issues. Make sure your machine has network connectivity to Update Management. See the [network planning](../automation-update-management.md#ports) section for a list of required ports and addresses.        |
|`0x8024001E`| The update operation didn't complete because the service or system was shutting down.|
|`0x8024002E`| Windows Update service is disabled.|
|`0x8024402C`     | If you're using a WSUS server, make sure the registry values for `WUServer` and `WUStatusServer` under the  `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate` registry key specify the correct WSUS server.        |
|`0x80072EE2`|There's a network connectivity issue or an issue in talking to a configured WSUS server. Check WSUS settings and make sure the service is accessible from the client.|
|`The service cannot be started, either because it is disabled or because it has no enabled devices associated with it. (Exception from HRESULT: 0x80070422)`     | Make sure the Windows Update service (wuauserv) is running and not disabled.        |
|`0x80070005`| An access denied error can be caused by any one of the following:<br> Infected computer<br> Windows Update settings not configured correctly<br> File permission error with %WinDir%\SoftwareDistribution folder<br> Insufficient disk space on the system drive (C:).
|Any other generic exception     | Run a search on the internet for  possible solutions, and work with your local IT support.         |

Reviewing the %Windir%\Windowsupdate.log file can also help you determine possible causes. For more information about how to read the log, see [How to read the Windowsupdate.log file](https://support.microsoft.com/en-ca/help/902093/how-to-read-the-windowsupdate-log-file).

You can also download and run the [Windows Update troubleshooter](https://support.microsoft.com/help/4027322/windows-update-troubleshooter) to check for any issues with Windows Update on the machine.

> [!NOTE]
> The [Windows Update troubleshooter](https://support.microsoft.com/help/4027322/windows-update-troubleshooter) documentation indicates that it's for use on Windows clients, but it also works on Windows Server.

## Scenario: Update run returns "Failed" status (Linux)

### Issue

An update run starts but encounters errors during the run.

### Cause

Possible causes:

* Package manager is unhealthy.
* Update Agent (WUA for Windows, distro-specific package manager for Linux) is misconfigured.
* Specific packages are interfering with cloud-based patching.
* The machine is unreachable.
* Updates had dependencies that weren't resolved.

### Resolution

If failures occur during an update run after it starts successfully, [check the job output](../manage-update-multi.md#view-results-of-an-update-deployment) from the affected machine in the run. You might find specific error messages from your machines that you can research and take action on. Update Management requires the package manager to be healthy for successful update deployments.

If specific patches, packages, or updates are seen immediately before the job fails, you can try [excluding](../automation-tutorial-update-management.md#schedule-an-update-deployment) those from the next update deployment. To gather log info from Windows Update, see [Windows Update log files](/windows/deployment/update/windows-update-logs).

If you can't resolve a patching issue, make a copy of the following log file and preserve it for troubleshooting purposes *before* the next update deployment starts:

```bash
/var/opt/microsoft/omsagent/run/automationworker/omsupdatemgmt.log
```

## Patches aren't installed

### Machines don't install updates

* Try running updates directly on the machine. If the machine can't apply the updates, consult the [list of potential errors in the troubleshooting guide](https://docs.microsoft.com/azure/automation/troubleshoot/update-management#hresult).
* If updates run locally, try removing and reinstalling the agent on the machine by following the guidance at [Remove a VM from Update Management](https://docs.microsoft.com/azure/automation/automation-onboard-solutions-from-browse#clean-up-resources).

### I know updates are available, but they don't show as available on my machines

* This often happens if machines are configured to get updates from WSUS or Microsoft Endpoint Configuration Manager but WSUS and Configuration Manager haven't approved the updates.
* You can check whether the machines are configured for WSUS and SCCM by [cross-referencing the UseWUServer registry key to the registry keys in the "Configuring Automatic Updates by Editing the Registry" section of this article](https://support.microsoft.com/help/328010/how-to-configure-automatic-updates-by-using-group-policy-or-registry-s).
* If updates aren't approved in WSUS, they won't be installed. You can check for unapproved updates in Log Analytics by running the following query:

  ```loganalytics
  Update | where UpdateState == "Needed" and ApprovalSource == "WSUS" and Approved == "False" | summarize max(TimeGenerated) by Computer, KBID, Title
  ```

### Updates show as installed, but I can't find them on my machine

* Updates are often superseded by other updates. For more information, see [Update is superseded](https://docs.microsoft.com/windows/deployment/update/windows-update-troubleshooting#the-update-is-not-applicable-to-your-computer) in the Windows Update Troubleshooting guide.

### Installing updates by classification on Linux

* Deploying updates to Linux by classification ("Critical and security updates") has important caveats, especially for CentOS. These limitations are documented on the [Update Management overview page](https://docs.microsoft.com/azure/automation/automation-update-management#linux-2).

### KB2267602 is consistently missing

* KB2267602 is the [Windows Defender definition update](https://www.microsoft.com/wdsi/definitions). It's updated daily.

## Next steps

If you didn't see your problem or can't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
