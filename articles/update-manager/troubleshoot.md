---
title: Troubleshoot known issues with Azure Update Manager
description: This article provides details on known issues and how to troubleshoot any problems with Azure Update Manager.
ms.service: azure-update-manager
ms.date: 11/11/2024
ms.topic: troubleshooting
ms.author: sudhirsneha
author: SnehaSudhirG
---

# Troubleshoot issues with Azure Update Manager

This article describes the errors that might occur when you deploy or use Azure Update Manager, how to resolve them, and the known issues and limitations of scheduled patching.  

## General troubleshooting

The following troubleshooting steps apply to the Azure virtual machines (VMs) related to the patch extension on Windows and Linux machines.


#### [Azure Virtual Machines](#tab/azure-machines)

##### Azure Linux VM

To verify if the Microsoft Azure Virtual Machine agent (VM agent) is running and has triggered appropriate actions on the machine and the sequence number for the autopatching request, check the agent log for more information in `/var/log/waagent.log`. Every autopatching request has a unique sequence number associated with it on the machine. Look for a log similar to `2021-01-20T16:57:00.607529Z INFO ExtHandler`.

The package directory for the extension is `/var/lib/waagent/Microsoft.CPlat.Core.Edp.LinuxPatchExtension-<version>`. The `/status` subfolder has a `<sequence number>.status` file. It includes a brief description of the actions performed during a single autopatching request and the status. It also includes a short list of errors that occurred while applying updates.

To review the logs related to all actions performed by the extension, check for more information in `/var/log/azure/Microsoft.CPlat.Core.LinuxPatchExtension/`. It includes the following two log files of interest:

* `<seq number>.core.log`: Contains information related to the patch actions. This information includes patches assessed and installed on the machine and any problems encountered in the process.
* `<Date and Time>_<Handler action>.ext.log`: There's a wrapper above the patch action, which is used to manage the extension and invoke specific patch operation. This log contains information about the wrapper. For autopatching, the log `<Date and Time>_Enable.ext.log` has information on whether the specific patch operation was invoked.

##### Azure Windows VM

To verify if the VM agent is running and has triggered appropriate actions on the machine and the sequence number for the autopatching request, check the agent log for more information in `C:\WindowsAzure\Logs\AggregateStatus`. The package directory for the extension is `C:\Packages\Plugins\Microsoft.CPlat.Core.WindowsPatchExtension<version>`.

To review the logs related to all actions performed by the extension, check for more information in `C:\WindowsAzure\Logs\Plugins\Microsoft.CPlat.Core.WindowsPatchExtension<version>`. It includes the following two log files of interest:

* `WindowsUpdateExtension.log`: Contains information related to the patch actions. This information includes patches assessed and installed on the machine and any problems encountered in the process.
* `CommandExecution.log`: There's a wrapper above the patch action, which is used to manage the extension and invoke specific patch operation. This log contains information about the wrapper. For autopatching, the log has information on whether the specific patch operation was invoked.

#### [Arc-enabled Servers](#tab/azure-arc)


For Azure Arc-enabled servers, see [Troubleshoot VM extensions](/azure/azure-arc/servers/troubleshoot-vm-extensions) for general troubleshooting steps.

To review the logs related to all actions performed by the extension, on Windows, check for more information in `C:\ProgramData\GuestConfig\extension_Logs\Microsoft.SoftwareUpdateManagement\WindowsOsUpdateExtension`. It includes the following two log files of interest:

* `WindowsUpdateExtension.log`: Contains information related to the patch actions. This information includes the patches assessed and installed on the machine and any problems encountered in the process.
* `cmd_execution_<numeric>_stdout.txt`: There's a wrapper above the patch action. It's used to manage the extension and invoke specific patch operation. This log contains information about the wrapper. For autopatching, the log has information on whether the specific patch operation was invoked.
* `cmd_execution_<numeric>_stderr.txt`

---

## Periodic assessment isn't getting set correctly when the periodic assessment policy is used during create for specialized, migrated, and restored VMs

### Cause
Periodic assessment isn't getting set correctly during create for specialized, migrated, and restored VMs because of the way the current modify policy is designed. Post-creation, the policy will show these resources as non-compliant on the compliance dashboard.

### Resolution

Run a remediation task post create to remediate newly created resources. For more information see, [Remediate non-compliant resources with Azure Policy](../governance/policy/how-to/remediate-resources.md).


## The prerequisite for scheduled patching isn't set correctly and schedules aren't attached when utilizing specific policies during create for specialized, generalized, migrated and restored VMs


### Cause

The prerequisite for scheduled patching and attaching schedules isn't being set correctly when utilizing the **Schedule recurring updates using Azure Update Manager** and **Set prerequisite for Scheduling recurring updates on Azure virtual machines** policies during create for specialized, generalized, migrated, and restored VMs because of the way the current *Deploy If Not Exists policy* is designed. Post-creation, the policy will show these resources as non-compliant on the compliance dashboard.

### Resolution

Run a remediation task post create to remediate newly created resources. For more information see, [Remediate non-compliant resources with Azure Policy](../governance/policy/how-to/remediate-resources.md).


## Policy remediation tasks are failing for gallery images and for images with encrypted disks

### Issue
There are remediation failures for VMs which have a reference to the gallery image in the Virtual Machine mode. This is because it requires the read permission to the gallery image and it's currently not part of the Virtual Machine Contributor role.

  :::image type="content" source="./media/troubleshoot/policy-remediation-failure-error.png" alt-text="Screenshot that shows the error code for the policy remediation failure. " lightbox="./media/troubleshoot/policy-remediation-failure-error.png":::

### Cause
The Virtual Machine Contributor role doesn’t have enough permissions.

### Resolution
-	For all the new assignments, a recent change is introduced to provide **Contributor** role to the managed identity created during policy assignment for remediation.  Going forward, this will be assigned for any new assignments.
-	For any previous assignments if you're experiencing failure of remediation tasks, we recommend that you manually assign the contributor role to the managed identity by following the steps listed under [Grant permissions to the managed identity through defined roles](../governance/policy/how-to/remediate-resources.md)
-	Also, in scenarios where the Contributor role doesn’t work when the linked resources (gallery image or disk) is in another resource group or subscription, manually provide the managed identity with the right roles and permissions on the scope to unblock remediations by following the steps in [Grant permissions to the managed identity through defined roles](../governance/policy/how-to/remediate-resources.md).


### Unable to generate periodic assessment for Arc-enabled servers

#### Issue

The subscriptions in which the Arc-enabled servers are onboarded aren't producing assessment data.

#### Resolution
Ensure that the Arc servers subscriptions are registered to Microsoft.Compute resource provider so that the periodic assessment data is generated periodically as expected. [Learn more](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider)

### Maintenance configuration isn't applied when VM is moved to a different subscription or resource group

#### Issue

When a VM is moved to another subscription or resource group, the scheduled maintenance configuration associated to the VM isn't running.

#### Resolution

Maintenance configurations do not currently support the moving of assigned resources across resource groups or subscriptions. As a workaround, use the following steps for the resource that you want to move. **As a prerequisite, first remove the assignment before following the steps.** 

If you're using a `static` scope:

1. Move the resource to a different resource group or subscription.
1. Re-create the resource assignment.

If you're using a `dynamic` scope:

1. Initiate or wait for the next scheduled run. This action prompts the system to completely remove the assignment, so you can proceed with the next steps.
1. Move the resource to a different resource group or subscription.
1. Re-create the resource assignment.

If any of the steps are missed, please move the resource to the previous resource group or subscription ID and reattempt the steps.

> [!NOTE]
> If the resource group is deleted, recreate it with the same name. If the subscription ID is deleted, reach out to the support team for mitigation.

### Unable to change the patch orchestration option to manual updates from automatic updates

#### Issue

You want to ensure that the Windows Update client won't install patches on your Windows Server so you want to set the patch setting to Manual. The Azure machine has the patch orchestration option as `AutomaticByOS/Windows` automatic updates and you're unable to change the patch orchestration to Manual Updates by using **Change update settings**.

#### Resolution

If you don't want any patch installation to be orchestrated by Azure or aren't using custom patching solutions, you can change the patch orchestration option to **Customer Managed Schedules (Preview)** or `AutomaticByPlatform` and `ByPassPlatformSafetyChecksOnUserSchedule` and not associate a schedule/maintenance configuration to the machine. This setting ensures that no patching is performed on the machine until you change it explicitly. For more information, see **Scenario 2** in [User scenarios](prerequsite-for-schedule-patching.md#user-scenarios).

:::image type="content" source="./media/troubleshoot/known-issue-update-settings-failed.png" alt-text="Screenshot that shows a notification of failed update settings.":::

### Machine shows as "Not assessed" and shows an HRESULT exception

#### Issue

* You have machines that show as `Not assessed` under **Compliance**, and you see an exception message below them.
* You see an `HRESULT` error code in the portal.

#### Cause

The Update Agent (Windows Update Agent on Windows and the package manager for a Linux distribution) isn't configured correctly. Update Manager relies on the machine's Update Agent to provide the updates that are needed, the status of the patch, and the results of deployed patches. Without this information, Update Manager can't properly report on the patches that are needed or installed.

#### Resolution

Try to perform updates locally on the machine. If this operation fails, it typically means that there's an Update Agent configuration error.

This issue is frequently caused by network configuration and firewall problems. Use the following checks to correct the issue:

* For Linux, check the appropriate documentation to make sure you can reach the network endpoint of your package repository.
* For Windows, check your agent configuration as described in [Updates aren't downloading from the intranet endpoint (WSUS/SCCM)](/windows/deployment/update/windows-update-troubleshooting#updates-arent-downloading-from-the-intranet-endpoint-wsussccm).

  * If the machines are configured for Windows Update, make sure that you can reach the endpoints described in [Issues related to HTTP/proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy).
  * If the machines are configured for Windows Server Update Services (WSUS), make sure that you can reach the WSUS server configured by the [WUServer registry key](/windows/deployment/update/waas-wu-settings).

If you see an `HRESULT` error code, double-click the exception displayed in red to see the entire exception message. Review the following table for potential resolutions or recommended actions.

|Exception  |Resolution or action  |
|---------|---------|
|`Exception from HRESULT: 0x……C`     | Search the relevant error code in the [Windows Update error code list](https://support.microsoft.com/help/938205/windows-update-error-code-list) to find more information about the cause of the exception.        |
|`0x8024402C`</br>`0x8024401C`</br>`0x8024402F`      | Indicates network connectivity problems. Make sure your machine has network connectivity to Update Management. For a list of required ports and addresses, see the [Network planning](prerequisites.md#network-planning) section.        |
|`0x8024001E`| The update operation didn't finish because the service or system was shutting down.|
|`0x8024002E`| Windows Update service is disabled.|
|`0x8024402C`     | If you're using a WSUS server, make sure the registry values for `WUServer` and `WUStatusServer` under the `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate` registry key specify the correct WSUS server.        |
|`0x80072EE2`|There's a network connectivity problem or a problem in talking to a configured WSUS server. Check WSUS settings and make sure the service is accessible from the client.|
|`The service cannot be started, either because it is disabled or because it has no enabled devices associated with it. (Exception from HRESULT: 0x80070422)`     | Make sure the Windows Update service (`wuauserv`) is running and not disabled.        |
|`0x80070005`| An access denied error can be caused by any one of the following problems:<br> - Infected computer.<br> - Windows Update settings not configured correctly.<br> - File permission error with the `%WinDir%\SoftwareDistribution` folder.<br> - Insufficient disk space on the system drive (drive C).
|Any other generic exception     | Run a search on the internet for possible resolutions and work with your local IT support.         |

Reviewing the `%Windir%\Windowsupdate.log` file can also help you determine possible causes. For more information about how to read the log, see [Read the Windowsupdate.log file](https://support.microsoft.com/help/902093/how-to-read-the-windowsupdate-log-file).

You can also download and run the [Windows Update troubleshooter](https://support.microsoft.com/help/4027322/windows-update-troubleshooter) to check for any problems with Windows Update on the machine.

> [!NOTE]
> The [Windows Update troubleshooter](https://support.microsoft.com/help/4027322/windows-update-troubleshooter) documentation indicates that it's for use on Windows clients, but it also works on Windows Server.


## Known issues in scheduled patching

- For a concurrent or conflicting schedule, only one schedule is triggered. The other schedule is triggered after the first schedule is finished.
- If a machine is newly created, the schedule might have 15 minutes of schedule trigger delay in the case of Azure VMs.

### Scheduled patching fails with error 'ShutdownOrUnresponsive'

#### Issue

Scheduled patching hasn't installed the patches on the VMs and gives an error as 'ShutdownOrUnresponsive'.

#### Resolution
Schedules triggered on machines deleted and recreated with the same resource ID within 8 hours may fail with ShutdownOrUnresponsive error due to a known limitation.

### Unable to apply patches for the shutdown machines

#### Issue

Patches aren't getting applied for the machines that are in shutdown state. You might also see that machines are losing their associated maintenance configurations or schedules.

#### Cause

The machines are in a shutdown state.

#### Resolution

Ensure your machines are turned on at least 15 minutes before the scheduled update. For more information, see [Shut down machines](/azure/virtual-machines/maintenance-configurations#shut-down-machines).

### Patch run failed with Maintenance window exceeded property showing true even if time remained

#### Issue

When you view an update deployment in **Update History**, the property **Failed with Maintenance window exceeded** shows **true** even though enough time was left for execution. In this case, one of the following problems is possible:

* No updates are shown.
* One or more updates are in a **Pending** state.
* Reboot status is **Required**, but a reboot wasn't attempted even when the reboot setting passed was `IfRequired` or `Always`.

#### Cause

During an update deployment, Maintenance window utilization is checked at multiple steps. Ten minutes of the Maintenance window are reserved for reboot at any point. Before the deployment gets a list of missing updates or downloads or installs any update (except Windows service pack updates), it checks to verify if there are 15 minutes + 10 minutes for reboot (that is, 25 minutes left in the Maintenance window).

For Windows service pack updates, the deployment checks for 20 minutes + 10 minutes for reboot (that is, 30 minutes). If the deployment doesn't have the sufficient time left, it skips the scan/download/installation of updates. The deployment run then checks if a reboot is needed and if 10 minutes are left in the Maintenance window. If there are, the deployment triggers a reboot. Otherwise, the reboot is skipped.

In such cases, the status is updated to **Failed**, and the **Maintenance window exceeded** property is updated to **true**. For cases where the time left is less than 25 minutes, updates aren't scanned or attempted for installation.

To find more information, review the logs in the file path provided in the error message of the deployment run.

#### Resolution

Set a longer time range for maximum duration when you're triggering an [on-demand update deployment](deploy-updates.md) to help avoid the problem.


### Windows/Linux OS update extension isn't installed

#### Issue

The Windows/Linux OS Update extension must be successfully installed on Arc machines to perform on-demand assessments, patching, and scheduled patching.

#### Resolution

Trigger an on-demand assessment or patching to install the extension on the machine. You can also attach the machine to a maintenance configuration schedule which will install the extension when patching is performed as per the schedule. 

If the extension is already present on an Arc machine but the extension status is not **Succeeded**, ensure that you [remove the extension](/azure/azure-arc/servers/manage-vm-extensions-portal#remove-extensions) and trigger an on-demand operation so that it is installed again.

### Windows/Linux patch update extension isn't installed

#### Issue
The Windows/Linux patch update extension must be successfully installed on Azure machines to perform on-demand assessment or patching, scheduled patching and for periodic assessments.

#### Resolution
Trigger an on-demand assessment or patching to install the extension on the machine. You can also attach the machine to a maintenance configuration schedule which will install the extension when patching is performed as per the schedule. 

If the extension is already present on the machine but the extension status is not **Succeeded**, trigger an on-demand operation which will install it again. 

### Allow Extension Operations check failed

#### Issue

The property [AllowExtensionOperations](/dotnet/api/microsoft.azure.management.compute.models.osprofile.allowextensionoperations) is set to false in the machine OSProfile.

#### Resolution
The property should be set to true to allow extensions to work properly. 

### Sudo privileges not present

#### Issue

Sudo privileges are not granted to the extensions for assessment or patching operations on Linux machines.

#### Resolution
Grant sudo privileges to ensure assessment or patching operations succeed. 

### Proxy is configured

#### Issue

Proxy is configured on Windows or Linux machines that may block access to endpoints required for assessment or patching operations to succeed. 

#### Resolution

For Windows, see [issues related to proxy](/troubleshoot/windows-client/installing-updates-features-roles/windows-update-issues-troubleshooting#issues-related-to-httpproxy). 

For Linux, ensure proxy setup doesn't block access to repositories that are required for downloading and installing updates.

### TLS 1.2 Check Failed 

#### Issue

TLS 1.0 and TLS 1.1 are deprecated.

#### Resolution

Use TLS 1.2 or higher.
 
For Windows, see [Protocols in TLS/SSL Schannel SSP](/windows/win32/secauthn/protocols-in-tls-ssl--schannel-ssp-).

For Linux, execute the following command to see the supported versions of TLS for your distro.
`nmap --script ssl-enum-ciphers -p 443 www.azure.com`

### HTTPS connection check failed

#### Issue

HTTPS connection is not available which is required to download and install updates from required endpoints for each operating system. 

#### Resolution

Allow HTTPS connection from your machine. 

### MsftLinuxPatchAutoAssess service is not running, or Time is not active 

#### Issue

[MsftLinuxPatchAutoAssess](https://github.com/Azure/LinuxPatchExtension) is required for successful periodic assessments on Linux machines. 

#### Resolution

Ensure that the LinuxPatchExtension status is succeeded for the machine. Reboot the machine to check if the issue is resolved.

### Linux repositories aren't accessible

#### Issue

The updates are downloaded from configured public or private repositories for each Linux distro. The machine is unable to connect to these repositories to download or assess the updates. 

#### Resolution

Ensure that network security rules don’t hinder connection to required repositories for update operations. 

## Next steps

* To learn more about Update Manager, see the [Overview](overview.md).
* To view logged results from all your machines, see [Querying logs and results from Update Manager](query-logs.md).
