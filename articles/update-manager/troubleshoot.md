---
title: Troubleshoot Known Issues with Azure Update Manager
description: This article provides details on known issues and how to troubleshoot any problems with Azure Update Manager.
ms.service: azure-update-manager
ms.date: 02/17/2025
ms.topic: troubleshooting-known-issue
author: habibaum
ms.author: v-uhabiba
ms.custom: sfi-image-nochange
# Customer intent: As a system administrator who manages virtual machines, I want to troubleshoot issues with Azure Update Manager so that I can ensure successful patching and compliance for my deployed resources.
---

# Troubleshoot known issues with Azure Update Manager

This article describes the errors that might occur when you deploy or use Azure Update Manager, how to resolve them, and the known issues and limitations of scheduled patching.

## General troubleshooting

The following troubleshooting information applies to the Azure virtual machines (VMs) related to the patch extension on Windows and Linux machines.

### [Azure virtual machines](#tab/azure-machines)

#### Linux VM

To verify if the Azure VM agent is running and triggered appropriate actions on the machine, and to verify the sequence number for the automatic patching request, check the agent log in `/var/log/waagent.log`. Every automatic patching request has a unique sequence number associated with it on the machine. Look for a log similar to `2021-01-20T16:57:00.607529Z INFO ExtHandler`.

The package directory for the extension is `/var/lib/waagent/Microsoft.CPlat.Core.LinuxPatchExtension-<version>`. The `/status` subfolder has a `<sequence number>.status` file. It includes a brief description of the actions performed during a single automatic patching request and the status. It also includes a short list of errors that occurred during updates.

To review the logs related to all actions that the extension performed, go to `/var/log/azure/Microsoft.CPlat.Core.LinuxPatchExtension/`. This folder includes the following log files of interest:

- `<seq number>.core.log`: This file contains information related to the patch actions. The information includes patches assessed and installed on the machine, along with any problems encountered in the process.
- `<Date and Time>_<Handler action>.ext.log`: A wrapper above the patch action is used to manage the extension and invoke a specific patch operation. This log contains information about the wrapper. For automatic patching, the `<Date and Time>_Enable.ext.log` file has information on whether the specific patch operation was invoked.

#### Windows VM

To verify if the VM agent is running and triggered appropriate actions on the machine, and to verify the sequence number for the automatic patching request, check the agent log in `C:\WindowsAzure\Logs\AggregateStatus`. The package directory for the extension is `C:\Packages\Plugins\Microsoft.CPlat.Core.WindowsPatchExtension<version>`.

To review the logs related to all actions that the extension performed, go to `C:\WindowsAzure\Logs\Plugins\Microsoft.CPlat.Core.WindowsPatchExtension<version>`. This folder includes the following log files of interest:

- `WindowsUpdateExtension.log`: This file contains information related to the patch actions. The information includes patches assessed and installed on the machine, along with any problems encountered in the process.
- `CommandExecution.log`: A wrapper above the patch action is used to manage the extension and invoke a specific patch operation. This log contains information about the wrapper. For automatic patching, the log has information on whether the specific patch operation was invoked.

### [Azure Arc-enabled servers](#tab/azure-arc)

For Azure Arc-enabled servers, see [Troubleshoot VM extensions](/azure/azure-arc/servers/troubleshoot-vm-extensions) for general troubleshooting steps.

To review the logs related to all actions that the extension performed, on Windows, go to `C:\ProgramData\GuestConfig\extension_logs\Microsoft.SoftwareUpdateManagement.WindowsOsUpdateExtension`. This folder includes the following log files of interest:

- `WindowsUpdateExtension.log`: This file contains information related to the patch actions. The information includes the patches assessed and installed on the machine, along with any problems encountered in the process.
- `cmd_execution_<numeric>_stdout.txt`: A wrapper above the patch action is used to manage the extension and invoke a specific patch operation. This log contains information about the wrapper. For automatic patching, the log has information on whether the specific patch operation was invoked.
- `cmd_execution_<numeric>_stderr.txt`.

---

## Periodic assessment isn't set correctly

### Issue

Periodic assessment isn't getting set correctly during resource creation for specialized, migrated, and restored VMs.

### Cause

The design of the current modification policy is affecting the assessment. After resource creation, the policy shows these resources as non-compliant on the compliance dashboard.

### Resolution

Run a remediation task for newly created resources. For more information, see [Remediate non-compliant resources with Azure Policy](../governance/policy/how-to/remediate-resources.md).

## Prerequisite for scheduled patching isn't set correctly

### Issue

When you're using the **Schedule recurring updates using Azure Update Manager** and **Set prerequisite for Scheduling recurring updates on Azure virtual machines** policies during resource creation for specialized, generalized, migrated, and restored VMs:

- The prerequisite for scheduled patching isn't set correctly.
- Schedules aren't attached.

### Cause

The design of the **Deploy If Not Exists** policy is affecting the scheduled patching. After resource creation, the policy shows these resources as non-compliant on the compliance dashboard.

### Resolution

Run a remediation task for newly created resources. For more information, see [Remediate non-compliant resources with Azure Policy](../governance/policy/how-to/remediate-resources.md).

## Policy remediation tasks are failing for images

### Issue

Policy remediation tasks are failing for gallery images and for images with encrypted disks. There are remediation failures for VMs that have a reference to a gallery image in the VM mode. The managed identity requires read permission to the gallery image, and it's currently not part of the Virtual Machine Contributor role.

:::image type="content" source="./media/troubleshoot/policy-remediation-failure-error.png" alt-text="Screenshot that shows the error code for the policy remediation failure. " lightbox="./media/troubleshoot/policy-remediation-failure-error.png":::

### Cause

The Virtual Machine Contributor role doesn't have enough permissions.

### Resolution

For all new assignments, a recent change grants the Contributor role to the created managed identity for remediation tasks.

If you're experiencing a failure of remediation tasks for any previous assignments, we recommend that you manually grant the contributor role to the managed identity by following the steps in [Grant permissions to the managed identity through defined roles](../governance/policy/how-to/remediate-resources.md#grant-permissions-to-the-managed-identity-through-defined-roles).

In scenarios where the Contributor role doesn't work when the linked resources (gallery image or disk) are in another resource group or subscription, manually provide the managed identity with the right roles and permissions on the scope to unblock remediations. Follow the steps in [Grant permissions to the managed identity through defined roles](../governance/policy/how-to/remediate-resources.md#grant-permissions-to-the-managed-identity-through-defined-roles).

## You can't generate periodic assessment for Azure Arc-enabled servers

### Issue

The subscriptions in which the Azure Arc-enabled servers are onboarded aren't producing assessment data.

### Cause

The subscriptions aren't registered to the correct resource provider.

### Resolution

Ensure that the Azure Arc-enabled server subscriptions are registered to the Microsoft.Compute resource provider so that the periodic assessment data is generated periodically as expected. [Learn more](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

## Maintenance configuration isn't applied when you move a VM

### Issue

When you move a VM to another subscription or resource group, the scheduled maintenance configuration associated with the VM isn't running.

### Cause

Maintenance configurations don't currently support the moving of assigned resources across resource groups or subscriptions.

### Resolution

As a workaround, use the following steps for the resource that you want to move.

If you're using a `static` scope:

1. Remove the resource assignment.
1. Move the resource to a different resource group or subscription.
1. Re-create the resource assignment.

If you're using a `dynamic` scope:

1. Initiate or wait for the next scheduled run. This action prompts the system to completely remove the assignment so that you can proceed with the next steps.
1. Move the resource to a different resource group or subscription.
1. Re-create the resource assignment.

If you miss any of the steps, move the resource to the previous resource group or subscription ID, and then retry the steps.

> [!NOTE]
> If the resource group is deleted, re-create it with the same name. If the subscription ID is deleted, contact the support team for mitigation.

## You can't change patch orchestration from automatic to manual

### Issue

You want to ensure that the Windows Update client won't install patches on your Windows Server instance, so you want to set the patch setting to manual. But you can't change the patch orchestration to manual updates by using **Change update settings**.

### Cause

The Azure machine has the patch orchestration option as `AutomaticByOS/Windows` automatic updates.

### Resolution

If you don't want Azure to orchestrate any patch installation or you aren't using custom patching solutions, you can change the patch orchestration option to **Customer Managed Schedules (Preview)** (or `AutomaticByPlatform` and `ByPassPlatformSafetyChecksOnUserSchedule`) and not associate a schedule or maintenance configuration to the machine. This setting ensures that no patching is performed on the machine until you change it explicitly.

:::image type="content" source="./media/troubleshoot/known-issue-update-settings-failed.png" alt-text="Screenshot that shows a notification of failed update settings.":::

## Machine is not assessed and shows an HRESULT exception

### Issue

You have machines that appear as **Not assessed** under **Compliance**, and you see an exception message below them. Or, you see an `HRESULT` error code in the portal.

### Cause

The update agent (Windows Update Agent on Windows and the package manager for a Linux distribution) isn't configured correctly. Update Manager relies on the machine's update agent to provide the necessary updates, the status of the patch, and the results of deployed patches. Without this information, Update Manager can't properly report on the patches that are needed or installed.

### Resolution

Try to perform updates locally on the machine. If this operation fails, it typically means that there's a configuration error for the update agent. To correct the issue:

- For Linux, check the appropriate documentation to make sure that you can reach the network endpoint of your package repository.
- For Windows, check your agent configuration as described in [Updates aren't downloading from the intranet endpoint (WSUS or Configuration Manager)](/troubleshoot/windows-client/installing-updates-features-roles/windows-update-issues-troubleshooting#updates-arent-downloading-from-the-intranet-endpoint-wsus-or-configuration-manager):

  - If the machines are configured for Windows Update, make sure that you can reach the endpoints described in [Issues related to HTTP/proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy).
  - If the machines are configured for Windows Server Update Services (WSUS), make sure that you can reach the WSUS server configured by the [WUServer registry key](/windows/deployment/update/waas-wu-settings).

If you see an `HRESULT` error code, double-click the exception displayed in red to see the entire exception message. Review the following table for potential resolutions or recommended actions.  

|Exception  |Resolution or action  |
|---------|---------|
|`Exception from HRESULT: 0x……C`     | Search the relevant error code in the [Windows Update error code list](https://support.microsoft.com/help/938205/windows-update-error-code-list) to find more information about the cause of the exception.        |
|`0x8024402C`</br>`0x8024401C`</br>`0x8024402F`      | This exception indicates network connectivity problems. Make sure that your machine has network connectivity to Update Manager. For a list of required ports and addresses, see [Network planning](prerequisites.md#network-planning).        |
|`0x8024001E`| The update operation didn't finish because the service or system was shutting down. Retry the operation.|
|`0x8024002E`| The Windows Update service is disabled. Enable the service.|
|`0x8024402C`     | If you're using a WSUS server, make sure that the registry values for `WUServer` and `WUStatusServer` under the `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate` registry key specify the correct WSUS server.        |
|`0x80072EE2`|There's a network connectivity problem or a problem in communicating with a configured WSUS server. Check the WSUS settings and make sure that the service is accessible from the client.|
|`The service cannot be started, either because it is disabled or because it has no enabled devices associated with it. (Exception from HRESULT: 0x80070422)`     | Make sure that the Windows Update service (`wuauserv`) is running and not disabled.        |
|`0x80070005`| Any of the following problems can cause an "access denied" error:<br> - Infected computer.<br> - Windows Update settings not configured correctly.<br> - File permission error with the `%WinDir%\SoftwareDistribution` folder.<br> - Insufficient disk space on the system drive (drive C). |
|Any other generic exception     | Run a search on the internet for possible resolutions, and work with your local IT support.         |

Reviewing the `%Windir%\Windowsupdate.log` file can also help you determine possible causes. For more information about how to read the log, see [Windows Update log files](https://support.microsoft.com/help/902093/how-to-read-the-windowsupdate-log-file).

You can also download and run the [Windows Update troubleshooter](https://support.microsoft.com/help/4027322/windows-update-troubleshooter) to check for any problems with Windows Update on the machine. The troubleshooter works on both Windows clients and Windows Server.

## You get an internal execution error

### Issue

Update Manager fails to patch the VM and produces an internal execution error. The operation doesn't return a response and might be incomplete.

### Cause

This issue might occur because of a temporary problem or communication failure between Update Manager and the VM. Common causes include:

- A temporary platform or back-end service issue.
- An unresponsive or outdated Azure VM agent.
- A VM under heavy load or rebooting during the operation.
- A network or connectivity issue.

### Resolution

- Retry the update after a few minutes.
- Ensure that the VM agent is healthy and up to date.
- If the agent status shows **Not Ready**, try rebooting the VM.
- Check VM resource usage (CPU, memory, disk). Reboot if needed.
- Verify network connectivity to Azure services.
- Review logs on the VM and Update Manager for more details.

## Scheduled patching isn't working

For a concurrent or conflicting schedule, only one schedule is triggered. The other schedule is triggered after the first schedule is finished.

If a machine is newly created, the schedule might have 15 minutes of trigger delay in the case of Azure VMs.

### You get a ShutdownOrUnresponsive error

#### Issue

Scheduled patching doesn't install the patches on the VMs and gives a `ShutdownOrUnresponsive` error.

#### Cause

A known limitation can cause schedules triggered on machines deleted and re-created with the same resource ID within 8 hours to fail with this error.

#### Resolution

The problem doesn't occur after the 8-hour period.

### You can't apply patches for shut-down machines

#### Issue

Patches aren't getting applied for the machines that are in a shutdown state. You might also see that machines are losing their associated maintenance configurations or schedules.

#### Cause

The machines are in a shutdown state.

#### Resolution

Ensure that your machines are turned on at least 15 minutes before the scheduled update. For more information, see [Shut-down machines](/azure/virtual-machines/maintenance-configurations#shut-down-machines).

### Update history inaccurately shows that you exceeded the maintenance window

#### Issue

When you view an update deployment in **Update History**, the property **Failed with Maintenance window exceeded** shows **true** even though enough time was left for execution. In this case, one of the following problems is possible:

- No updates are shown.
- One or more updates are in a **Pending** state.
- Reboot status is **Required**, but a reboot wasn't attempted even when the reboot setting was `IfRequired` or `Always`.

#### Cause

During an update deployment, maintenance window utilization is checked at multiple steps. Ten minutes of the maintenance window are reserved for reboot at any point.

Before the deployment gets a list of missing updates or downloads or installs an update, it checks to verify that enough time remains in the maintenance window:

- All updates except Windows service pack: 15 minutes + 10 minutes for reboot, for a total of 25 minutes.
- Windows service pack updates: 20 minutes + 10 minutes for reboot, for a total of 30 minutes.

If the deployment doesn't have enough time left, it skips the scan, download, and installation of updates. The deployment run then checks if a reboot is needed and if 10 minutes remain in the maintenance window. If so, the deployment triggers a reboot. Otherwise, the reboot is skipped.

In such cases, the status is updated to **Failed**, and the **Maintenance window exceeded** property is updated to **true**. For cases where the time left is less than 25 minutes, updates aren't scanned or attempted for installation.

To find more information, review the logs in the file path provided in the error message of the deployment run.

#### Resolution

Set a longer time range for maximum duration when you're triggering an [on-demand update deployment](deploy-updates.md).

### Windows/Linux OS update extension isn't installed

#### Issue

You can't perform patching on Azure Arc-enabled machines.

#### Cause

The Windows/Linux OS update extension must be successfully installed on Azure Arc-enabled machines to perform on-demand assessments, patching, and scheduled patching.

#### Resolution

Trigger an on-demand assessment or patching to install the extension on the machine. You can also attach the machine to a maintenance configuration schedule, which will install the extension when patching is performed according to the schedule.

If the extension is already present on an Azure Arc-enabled machine but the extension status isn't **Succeeded**, [remove the extension](/azure/azure-arc/servers/manage-vm-extensions-portal#remove-extensions) and then trigger an on-demand operation to reinstall it.

### Windows/Linux patch update extension isn't installed

#### Issue

You can't perform patching on Azure VMs.

#### Cause

The Windows/Linux patch update extension must be successfully installed on Azure machines to perform on-demand assessment or patching, scheduled patching, and periodic assessments.

#### Resolution

Trigger an on-demand assessment or patching to install the extension on the machine. You can also attach the machine to a maintenance configuration schedule, which will install the extension when patching is performed according to the schedule.

If the extension is already present on the machine but the extension status isn't **Succeeded**, remove the extension and then trigger an on-demand operation to reinstall it.

### Extension check fails

#### Issue

The check for ensuring that the [AllowExtensionOperations](/dotnet/api/microsoft.azure.management.compute.models.osprofile.allowextensionoperations) property is set correctly fails.

#### Cause

The `AllowExtensionOperations` property is set to `false` in the machine's `OSProfile` interface.

#### Resolution

To allow extensions to work properly, set the property to `true`.

### Sudo privileges aren't present

#### Issue

You might see the following exception:

```
EXCEPTION: Exception('Unable to invoke sudo successfully. Output: root is not in the sudoers file. This incident will be reported. False ',)
```

#### Cause

Sudo privileges aren't granted to the extensions for assessment or patching operations on Linux machines.

Update Manager requires a high level of permissions due to the many components that might be updated with Update Manager (including kernel drivers and OS security patching). The Update Manager extensions use the `root` account for operations.

#### Resolution

Grant sudo privileges to ensure that assessment or patching operations succeed. You need to add the root account to the `/etc/sudoers` file:

1. Open the `sudoers` file for editing:

   ```bash
   sudo visudo
   ```

2. Add the following entry to the end of `sudoers` file:

   ```bash
   root ALL=(ALL) ALL
   ```

3. Save and close the editor by using the <kbd>Ctrl+X</kbd> keyboard shortcut. If you're using the *vi* editor, you can type `:wq` and then select the <kbd>Enter</kbd> key.

### Proxy is configured

#### Issue

A proxy blocks access to endpoints that are required for assessment or patching operations to succeed.

#### Cause

A proxy is configured on your Windows or Linux machines.

#### Resolution

For Windows, see [Issues related to HTTP/Proxy](/troubleshoot/windows-client/installing-updates-features-roles/windows-update-issues-troubleshooting#issues-related-to-httpproxy).

For Linux, ensure that proxy setup doesn't block access to repositories that are required for downloading and installing updates.

### TLS 1.2 check fails

#### Issue

The check for ensuring that you're using TLS 1.2 fails.

#### Cause

You're using TLS 1.0 or TLS 1.1. These versions are deprecated.

#### Resolution

Use TLS 1.2 or later.

For Windows, see [Protocols in TLS/SSL (Schannel SSP)](/windows/win32/secauthn/protocols-in-tls-ssl--schannel-ssp-).

For Linux, run the following command to see the supported versions of TLS for your distribution: `nmap --script ssl-enum-ciphers -p 443 www.azure.com`.

### HTTPS connection check fails

#### Issue

The check for ensuring the availability of an HTTPS connection fails.

#### Cause

An HTTPS connection isn't available. This connection is required to download and install updates from the necessary endpoints for each operating system.

#### Resolution

Allow an HTTPS connection from your machine.

### MsftLinuxPatchAutoAssess service isn't running or times out

#### Issue

Periodic assessments aren't working on your Linux machines.

#### Cause

The [MsftLinuxPatchAutoAssess](https://github.com/Azure/LinuxPatchExtension) service is required for successful periodic assessments.

#### Resolution

Ensure that the `LinuxPatchExtension` status is `succeeded` for the machine. Reboot the machine to check if the issue is resolved.

### Linux repositories aren't accessible

#### Issue

Updates are downloaded from configured public or private repositories for each Linux distribution. The machine can't connect to these repositories to download or assess the updates.

#### Cause

Network security rules can block important connections.

#### Resolution

Ensure that network security rules don't hinder your machine's connections to required repositories for update operations.

## Related content

- To learn more about Update Manager, see the [overview](overview.md).
- To view logged results from all your machines, see [Access Azure Update Manager operations data using Azure Resource Graph](query-logs.md).
