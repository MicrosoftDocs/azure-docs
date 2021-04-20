---
title: Troubleshoot Azure Automation Update Management issues
description: This article tells how to troubleshoot and resolve issues with Azure Automation Update Management.
services: automation
ms.subservice: update-management
ms.date: 04/16/2021
ms.topic: troubleshooting
---

# Troubleshoot Update Management issues

This article discusses issues that you might run into when deploying the Update Management feature on your machines. There's an agent troubleshooter for the Hybrid Runbook Worker agent to determine the underlying problem. To learn more about the troubleshooter, see [Troubleshoot Windows update agent issues](update-agent-issues.md) and [Troubleshoot Linux update agent issues](update-agent-issues-linux.md). For other feature deployment issues, see [Troubleshoot feature deployment issues](onboarding.md).

>[!NOTE]
>If you run into problems when deploying Update Management on a Windows machine, open the Windows Event Viewer, and check the **Operations Manager** event log under **Application and Services Logs** on the local machine. Look for events with event ID 4502 and event details that contain `Microsoft.EnterpriseManagement.HealthService.AzureAutomation.HybridAgent`.

## <a name="updates-linux-installed-different"></a>Scenario: Linux updates shown as pending and those installed vary

### Issue

For your Linux machine, Update Management shows specific updates available under classification **Security** and **Others**. But when an update schedule is run on the machine, for example to install only updates matching the **Security** classification, the updates installed are different from or a subset of the updates shown earlier matching that classification.

### Cause

When an assessment of OS updates pending for your Linux machine is done, [Open Vulnerability and Assessment Language](https://oval.mitre.org/) (OVAL) files provided by the Linux distro vendor is used by Update Management for classification. Categorization is done for Linux updates as **Security** or **Others**, based on the OVAL files which states updates addressing security issues or vulnerabilities. But when the update schedule is run, it executes on the Linux machine using the appropriate package manager like YUM, APT or ZYPPER to install them. The package manager for the Linux distro may have a different mechanism to classify updates, where the results may differ from the ones obtained from OVAL files by Update Management.

### Resolution

You can manually check the Linux machine, the applicable updates, and their classification per the distro's package manager. To understand which updates are classified as **Security** by your package manager, run the following commands.

For YUM, the following command returns a non-zero list of updates categorized as **Security** by Red Hat. Note that in the case of CentOS, it always returns an empty list and no security classification occurs.

```bash
sudo yum -q --security check-update
```

For ZYPPER, the following command returns a non-zero list of updates categorized as **Security** by SUSE.

```bash
sudo LANG=en_US.UTF8 zypper --non-interactive patch --category security --dry-run
```

For APT, the following command returns a non-zero list of updates categorized as **Security** by Canonical for Ubuntu Linux distros.

```bash
sudo grep security /etc/apt/sources.list > /tmp/oms-update-security.list LANG=en_US.UTF8 sudo apt-get -s dist-upgrade -oDir::Etc::Sourcelist=/tmp/oms-update-security.list
```

From this list you then run the command `grep ^Inst` to get all the pending security updates.

## <a name="failed-to-enable-error"></a>Scenario: You receive the error "Failed to enable the Update solution"

### Issue

When you try to enable Update Management in your Automation account, you get the following error:

```error
Error details: Failed to enable the Update solution
```

### Cause

This error can occur for the following reasons:

* The network firewall requirements for the Log Analytics agent might not be configured correctly. This situation can cause the agent to fail when resolving the DNS URLs.

* Update Management targeting is misconfigured and the machine isn't receiving updates as expected.

* You might also notice that the machine shows a status of `Non-compliant` under **Compliance**. At the same time, **Agent Desktop Analytics** reports the agent as `Disconnected`.

### Resolution

* Run the troubleshooter for [Windows](update-agent-issues.md#troubleshoot-offline) or [Linux](update-agent-issues-linux.md#troubleshoot-offline), depending on the OS.

* Go to [Network configuration](../automation-hybrid-runbook-worker.md#network-planning) to learn about which addresses and ports must be allowed for Update Management to work.  

* Check for scope configuration problems. [Scope configuration](../update-management/scope-configuration.md) determines which machines are configured for Update Management. If your machine is showing up in your workspace but not in Update Management, you must set the scope configuration to target the machines. To learn about the scope configuration, see [Enable machines in the workspace](../update-management/enable-from-automation-account.md#enable-machines-in-the-workspace).

* Remove the worker configuration by following the steps in [Remove the Hybrid Runbook Worker from an on-premises Windows computer](../automation-windows-hrw-install.md#remove-windows-hybrid-runbook-worker) or [Remove the Hybrid Runbook Worker from an on-premises Linux computer](../automation-linux-hrw-install.md#remove-linux-hybrid-runbook-worker).

## Scenario: Superseded update indicated as missing in Update Management

### Issue

Old updates are appearing for an Automation account as missing even though they've been superseded. A superseded update is one that you don't have to install because a later update that corrects the same vulnerability is available. Update Management ignores the superseded update and makes it not applicable in favor of the superseding update. For information about a related issue, see [Update is superseded](/windows/deployment/update/windows-update-troubleshooting#the-update-is-not-applicable-to-your-computer).

### Cause

Superseded updates aren't declined in Windows Server Update Services (WSUS) so that they can be considered not applicable.

### Resolution

When a superseded update becomes 100 percent not applicable, you should change the approval state of that update to `Declined` in WSUS. To change approval state for all your updates:

1. In the Automation account, select **Update Management** to view machine status. See [View update assessments](../update-management/view-update-assessments.md).

2. Check the superseded update to make sure that it's 100 percent not applicable.

3. On the WSUS server the machines report to, [decline the update](/windows-server/administration/windows-server-update-services/manage/updates-operations#declining-updates).

4. Select **Computers** and, in the **Compliance** column, force a rescan for compliance. See [Manage updates for VMs](../update-management/manage-updates-for-vm.md).

5. Repeat the steps above for other superseded updates.

6. For Windows Server Update Services (WSUS), clean all superseded updates to refresh the infrastructure using the WSUS [Server cleanup Wizard](/windows-server/administration/windows-server-update-services/manage/the-server-cleanup-wizard).

7. Repeat this procedure regularly to correct the display issue and minimize the amount of disk space used for update management.

## <a name="nologs"></a>Scenario: Machines don't show up in the portal under Update Management

### Issue

Your machines have the following symptoms:

* Your machine shows `Not configured` from the Update Management view of a VM.

* Your machines are missing from the Update Management view of your Azure Automation account.

* You have machines that show as `Not assessed` under **Compliance**. However, you see heartbeat data in Azure Monitor logs for the Hybrid Runbook Worker but not for Update Management.

### Cause

This issue can be caused by local configuration issues or by improperly configured scope configuration. Possible specific causes are:

* You might have to re-register and reinstall the Hybrid Runbook Worker.

* You might have defined a quota in your workspace that's been reached and that's preventing further data storage.

### Resolution

1. Run the troubleshooter for [Windows](update-agent-issues.md#troubleshoot-offline) or [Linux](update-agent-issues-linux.md#troubleshoot-offline), depending on the OS.

2. Make sure that your machine is reporting to the correct workspace. For guidance on how to verify this aspect, see [Verify agent connectivity to Azure Monitor](../../azure-monitor/agents/agent-windows.md#verify-agent-connectivity-to-azure-monitor). Also make sure that this workspace is linked to your Azure Automation account. To confirm, go to your Automation account and select **Linked workspace** under **Related Resources**.

3. Make sure that the machines show up in the Log Analytics workspace linked to your Automation account. Run the following query in the Log Analytics workspace.

   ```kusto
   Heartbeat
   | summarize by Computer, Solutions
   ```

    If you don't see your machine in the query results, it hasn't recently checked in. There's probably a local configuration issue and you should [reinstall the agent](../../azure-monitor/vm/quick-collect-windows-computer.md#install-the-agent-for-windows).

    If your machine is listed in the query results, verify under the **Solutions** property that **updates** is listed. This verifies it is registered with Update Management. If it is not, check for scope configuration problems. The [scope configuration](../update-management/scope-configuration.md) determines which machines are configured for Update Management. To configure the scope configuration for the target the machine, see [Enable machines in the workspace](../update-management/enable-from-automation-account.md#enable-machines-in-the-workspace).

4. In your workspace, run this query.

   ```kusto
   Operation
   | where OperationCategory == 'Data Collection Status'
   | sort by TimeGenerated desc
   ```

   If you get a `Data collection stopped due to daily limit of free data reached. Ingestion status = OverQuota` result, the quota defined on your workspace has been reached, which has stopped data from being saved. In your workspace, go to **data volume management** under **Usage and estimated costs**, and change or remove the quota.

5. If your issue is still unresolved, follow the steps in [Deploy a Windows Hybrid Runbook Worker](../automation-windows-hrw-install.md) to reinstall the Hybrid Worker for Windows. For Linux, follow the steps in [Deploy a Linux Hybrid Runbook Worker](../automation-linux-hrw-install.md).

## <a name="rp-register"></a>Scenario: Unable to register Automation resource provider for subscriptions

### Issue

When you work with feature deployments in your Automation account, the following error occurs:

```error
Error details: Unable to register Automation Resource Provider for subscriptions
```

### Cause

The Automation resource provider isn't registered in the subscription.

### Resolution

To register the Automation resource provider, follow these steps in the Azure portal.

1. In the Azure service list at the bottom of the portal, select **All services**, and then select **Subscriptions** in the General service group.

2. Select your subscription.

3. Under **Settings**, select **Resource Providers**.

4. From the list of resource providers, verify that the Microsoft.Automation resource provider is registered.

5. If it's not listed, register the Microsoft.Automation provider by following the steps at [Resolve errors for resource provider registration](../../azure-resource-manager/templates/error-register-resource-provider.md).

## <a name="scheduled-update-missed-machines"></a>Scenario: Scheduled update did not patch some machines

### Issue

Machines included in an update preview don't all appear in the list of machines patched during a scheduled run, or VMs for selected scopes of a dynamic group are not showing up in the update preview list in the portal.

The update preview list consists of all machines retrieved by an [Azure Resource Graph](../../governance/resource-graph/overview.md) query for the selected scopes. The scopes are filtered for machines that have a system Hybrid Runbook Worker installed and for which you have access permissions.

### Cause

This issue can have one of the following causes:

* The subscriptions defined in the scope in a dynamic query aren't configured for the registered Automation resource provider.

* The machines weren't available or didn't have appropriate tags when the schedule executed.

* You don't have the correct access on the selected scopes.

* The Azure Resource Graph query doesn't retrieve the expected machines.

* The system Hybrid Runbook Worker isn't installed on the machines.

### Resolution

#### Subscriptions not configured for registered Automation resource provider

If your subscription isn't configured for the Automation resource provider, you can't query or fetch information on machines in that subscription. Use the following steps to verify the registration for the subscription.

1. In the [Azure portal](../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal), access the Azure service list.

2. Select **All services**, and then select **Subscriptions** in the General service group.

3. Find the subscription defined in the scope for your deployment.

4. Under **Settings**, choose **Resource Providers**.

5. Verify that the Microsoft.Automation resource provider is registered.

6. If it's not listed, register the Microsoft.Automation provider by following the steps at [Resolve errors for resource provider registration](../../azure-resource-manager/templates/error-register-resource-provider.md).

#### Machines not available or not tagged correctly when schedule executed

Use the following procedure if your subscription is configured for the Automation resource provider, but running the update schedule with the specified [dynamic groups](../update-management/configure-groups.md) missed some machines.

1. In the Azure portal, open the Automation account and select **Update Management**.

2. Check [Update Management history](../update-management/deploy-updates.md#view-results-of-a-completed-update-deployment) to determine the exact time when the update deployment was run.

3. For machines that you suspect to have been missed by Update Management, use Azure Resource Graph (ARG) to [locate machine changes](../../governance/resource-graph/how-to/get-resource-changes.md#find-detected-change-events-and-view-change-details).

4. Search for changes over a considerable period, such as one day, before the update deployment was run.

5. Check the search results for any systemic changes, such as delete or update changes, to the machines in this period. These changes can alter machine status or tags so that machines aren't selected in the machine list when updates are deployed.

6. Adjust the machines and resource settings as necessary to correct for machine status or tag issues.

7. Rerun the update schedule to ensure that deployment with the specified dynamic groups includes all machines.

#### Incorrect access on selected scopes

The Azure portal only displays machines for which you have write access in a given scope. If you don't have the correct access for a scope, see [Tutorial: Grant a user access to Azure resources using the Azure portal](../../role-based-access-control/quickstart-assign-role-user-portal.md).

#### Resource Graph query doesn't return expected machines

Follow the steps below to find out if your queries are working correctly.

1. Run an Azure Resource Graph query formatted as shown below in the Resource Graph explorer blade in Azure portal. If you are new to Azure Resource Graph, see this [quickstart](../../governance/resource-graph/first-query-portal.md) to learn how to work with Resource Graph explorer. This query mimics the filters you selected when you created the dynamic group in Update Management. See [Use dynamic groups with Update Management](../update-management/configure-groups.md).

    ```kusto
    where (subscriptionId in~ ("<subscriptionId1>", "<subscriptionId2>") and type =~ "microsoft.compute/virtualmachines" and properties.storageProfile.osDisk.osType == "<Windows/Linux>" and resourceGroup in~ ("<resourceGroupName1>","<resourceGroupName2>") and location in~ ("<location1>","<location2>") )
    | project id, location, name, tags = todynamic(tolower(tostring(tags)))
    | where  (tags[tolower("<tagKey1>")] =~ "<tagValue1>" and tags[tolower("<tagKey2>")] =~ "<tagValue2>") // use this if "All" option selected for tags
    | where  (tags[tolower("<tagKey1>")] =~ "<tagValue1>" or tags[tolower("<tagKey2>")] =~ "<tagValue2>") // use this if "Any" option selected for tags
    | project id, location, name, tags
    ```

   Here is an example:

    ```kusto
    where (subscriptionId in~ ("20780d0a-b422-4213-979b-6c919c91ace1", "af52d412-a347-4bc6-8cb7-4780fbb00490") and type =~ "microsoft.compute/virtualmachines" and properties.storageProfile.osDisk.osType == "Windows" and resourceGroup in~ ("testRG","withinvnet-2020-01-06-10-global-resources-southindia") and location in~ ("australiacentral","australiacentral2","brazilsouth") )
    | project id, location, name, tags = todynamic(tolower(tostring(tags)))
    | where  (tags[tolower("ms-resource-usage")] =~ "azure-cloud-shell" and tags[tolower("temp")] =~ "temp")
    | project id, location, name, tags
    ```

2. Check to see if the machines you're looking for are listed in the query results.

3. If the machines aren't listed, there is probably an issue with the filter selected in the dynamic group. Adjust the group configuration as needed.

#### Hybrid Runbook Worker not installed on machines

Machines do appear in Azure Resource Graph query results, but still don't show up in the dynamic group preview. In this case, the machines might not be designated as system Hybrid Runbook workers and thus can't run Azure Automation and Update Management jobs. To ensure that the machines you're expecting to see are set up as system Hybrid Runbook Workers:

1. In the Azure portal, go to the Automation account for a machine that is not appearing correctly.

2. Select **Hybrid worker groups** under **Process Automation**.

3. Select the **System hybrid worker groups** tab.

4. Validate that the hybrid worker is present for that machine.

5. If the machine is not set up as a system Hybrid Runbook Worker, review the methods to enable the machine under the [Enable Update Management](../update-management/overview.md#enable-update-management) section of the Update Management Overview article. The method to enable is based on the environment the machine is running in.

6. Repeat the steps above for all machines that have not been displaying in the preview.

## <a name="components-enabled-not-working"></a>Scenario: Update Management components enabled, while VM continues to show as being configured

### Issue

You continue to see the following message on a VM 15 minutes after deployment begins:

```error
The components for the 'Update Management' solution have been enabled, and now this virtual machine is being configured. Please be patient, as this can sometimes take up to 15 minutes.
```

### Cause

This error can occur for the following reasons:

* Communication with the Automation account is being blocked.

* There is a duplicate computer name with different source computer IDs. This scenario occurs when a VM with a particular computer name is created in different resource groups and is reporting to the same Logistics Agent workspace in the subscription.

* The VM image being deployed might come from a cloned machine that wasn't prepared with System Preparation (sysprep) with the Log Analytics agent for Windows installed.

### Resolution

To help in determining the exact problem with the VM, run the following query in the Log Analytics workspace that's linked to your Automation account.

```
Update
| where Computer contains "fillInMachineName"
| project TimeGenerated, Computer, SourceComputerId, Title, UpdateState 
```

#### Communication with Automation account blocked

Go to [Network planning](../update-management/overview.md#ports) to learn about which addresses and ports must be allowed for Update Management to work.

#### Duplicate computer name

Rename your VMs to ensure unique names in their environment.

#### Deployed image from cloned machine

If you're using a cloned image, different computer names have the same source computer ID. In this case:

1. In your Log Analytics workspace, remove the VM from the saved search for the `MicrosoftDefaultScopeConfig-Updates` scope configuration if it's shown. Saved searches can be found under **General** in your workspace.

2. Run the following cmdlet.

    ```azurepowershell-interactive
    Remove-Item -Path "HKLM:\software\microsoft\hybridrunbookworker" -Recurse -Force
    ```

3. Run `Restart-Service HealthService` to restart the health service. This operation recreates the key and generates a new UUID.

4. If this approach doesn't work, run sysprep on the image first and then install the Log Analytics agent for Windows.

## <a name="multi-tenant"></a>Scenario: You receive a linked subscription error when you create an update deployment for machines in another Azure tenant

### Issue

You encounter the following error when you try to create an update deployment for machines in another Azure tenant:

```error
The client has permission to perform action 'Microsoft.Compute/virtualMachines/write' on scope '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroupName/providers/Microsoft.Automation/automationAccounts/automationAccountName/softwareUpdateConfigurations/updateDeploymentName', however the current tenant '00000000-0000-0000-0000-000000000000' is not authorized to access linked subscription '00000000-0000-0000-0000-000000000000'.
```

### Cause

This error occurs when you create an update deployment that has Azure VMs in another tenant that's included in an update deployment.

### Resolution

Use the following workaround to get these items scheduled. You can use the [New-AzAutomationSchedule](/powershell/module/az.automation/new-azautomationschedule) cmdlet with the `ForUpdateConfiguration` parameter to create a schedule. Then, use the [New-AzAutomationSoftwareUpdateConfiguration](/powershell/module/Az.Automation/New-AzAutomationSoftwareUpdateConfiguration) cmdlet and pass the machines in the other tenant to the `NonAzureComputer` parameter. The following example shows how to do this:

```azurepowershell-interactive
$nonAzurecomputers = @("server-01", "server-02")

$startTime = ([DateTime]::Now).AddMinutes(10)

$s = New-AzAutomationSchedule -ResourceGroupName mygroup -AutomationAccountName myaccount -Name myupdateconfig -Description test-OneTime -OneTime -StartTime $startTime -ForUpdateConfiguration

New-AzAutomationSoftwareUpdateConfiguration  -ResourceGroupName $rg -AutomationAccountName $aa -Schedule $s -Windows -AzureVMResourceId $azureVMIdsW -NonAzureComputer $nonAzurecomputers -Duration (New-TimeSpan -Hours 2) -IncludedUpdateClassification Security,UpdateRollup -ExcludedKbNumber KB01,KB02 -IncludedKbNumber KB100
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

A machine shows a `Failed to start` status. When you view the specific details for the machine, you see the following error:

```error
Failed to start the runbook. Check the parameters passed. RunbookName Patch-MicrosoftOMSComputer. Exception You have requested to create a runbook job on a hybrid worker group that does not exist.
```

### Cause

This error can occur for one of the following reasons:

* The machine doesn't exist anymore.
* The machine is turned off and unreachable.
* The machine has a network connectivity issue, and therefore the hybrid worker on the machine is unreachable.
* There was an update to the Log Analytics agent that changed the source computer ID.
* Your update run was throttled if you hit the limit of 200 concurrent jobs in an Automation account. Each deployment is considered a job, and each machine in an update deployment counts as a job. Any other automation job or update deployment currently running in your Automation account counts toward the concurrent job limit.

### Resolution

When applicable, use [dynamic groups](../update-management/configure-groups.md) for your update deployments. In addition, you can take the following steps.

1. Verify that your machine or server meets the [requirements](../update-management/overview.md#system-requirements).
2. Verify connectivity to the Hybrid Runbook Worker using the Hybrid Runbook Worker agent troubleshooter. To learn more about the troubleshooter, see [Troubleshoot update agent issues](update-agent-issues.md).

## <a name="updates-nodeployment"></a>Scenario: Updates are installed without a deployment

### Issue

When you enroll a Windows machine in Update Management, you see updates installed without a deployment.

### Cause

On Windows, updates are installed automatically as soon as they're available. This behavior can cause confusion if you didn't schedule an update to be deployed to the machine.

### Resolution

The  `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU` registry key defaults to a setting of 4: `auto download and install`.

For Update Management clients, we recommend setting this key to 3: `auto download but do not auto install`.

For more information, see [Configuring Automatic Updates](/windows/deployment/update/waas-wu-settings#configure-automatic-updates).

## <a name="machine-already-registered"></a>Scenario: Machine is already registered to a different account

### Issue

You receive the following error message:

```error
Unable to Register Machine for Patch Management, Registration Failed with Exception System.InvalidOperationException: {"Message":"Machine is already registered to a different account."}
```

### Cause

The machine has already been deployed to another workspace for Update Management.

### Resolution

1. Follow the steps under [Machines don't show up in the portal under Update Management](#nologs) to make sure the machine is reporting to the correct workspace.
2. Clean up artifacts on the machine by [deleting the hybrid runbook group](../automation-windows-hrw-install.md#remove-a-hybrid-worker-group), and then try again.

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

To understand why this occurred during an update run after it starts successfully, [check the job output](../update-management/deploy-updates.md#view-results-of-a-completed-update-deployment) from the affected machine in the run. You might find specific error messages from your machines that you can research and take action on.  

Edit any failing scheduled update deployments, and increase the maintenance window.

For more information on maintenance windows, see [Install updates](../update-management/deploy-updates.md#schedule-an-update-deployment).

## <a name="hresult"></a>Scenario: Machine shows as "Not assessed" and shows an HRESULT exception

### Issue

* You have machines that show as `Not assessed` under **Compliance**, and you see an exception message below them.
* You see an HRESULT error code in the portal.

### Cause

The Update Agent (Windows Update Agent on Windows; the package manager for a Linux distribution) isn't configured correctly. Update Management relies on the machine's Update Agent to provide the updates that are needed, the status of the patch, and the results of deployed patches. Without this information, Update Management can't properly report on the patches that are needed or installed.

### Resolution

Try to perform updates locally on the machine. If this operation fails, it typically means that there's an update agent configuration error.

This problem is frequently caused by network configuration and firewall issues. Use the following checks to correct the issue.

* For Linux, check the appropriate documentation to make sure you can reach the network endpoint of your package repository.

* For Windows, check your agent configuration as listed in [Updates aren't downloading from the intranet endpoint (WSUS/SCCM)](/windows/deployment/update/windows-update-troubleshooting#updates-arent-downloading-from-the-intranet-endpoint-wsussccm).

  * If the machines are configured for Windows Update, make sure that you can reach the endpoints described in [Issues related to HTTP/proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy).
  * If the machines are configured for Windows Server Update Services (WSUS), make sure that you can reach the WSUS server configured by the [WUServer registry key](/windows/deployment/update/waas-wu-settings).

If you see an HRESULT, double-click the exception displayed in red to see the entire exception message. Review the following table for potential resolutions or recommended actions.

|Exception  |Resolution or action  |
|---------|---------|
|`Exception from HRESULT: 0x……C`     | Search the relevant error code in [Windows update error code list](https://support.microsoft.com/help/938205/windows-update-error-code-list) to find additional details about the cause of the exception.        |
|`0x8024402C`</br>`0x8024401C`</br>`0x8024402F`      | These indicate network connectivity issues. Make sure your machine has network connectivity to Update Management. See the [network planning](../update-management/overview.md#ports) section for a list of required ports and addresses.        |
|`0x8024001E`| The update operation didn't complete because the service or system was shutting down.|
|`0x8024002E`| Windows Update service is disabled.|
|`0x8024402C`     | If you're using a WSUS server, make sure the registry values for `WUServer` and `WUStatusServer` under the  `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate` registry key specify the correct WSUS server.        |
|`0x80072EE2`|There's a network connectivity issue or an issue in talking to a configured WSUS server. Check WSUS settings and make sure the service is accessible from the client.|
|`The service cannot be started, either because it is disabled or because it has no enabled devices associated with it. (Exception from HRESULT: 0x80070422)`     | Make sure the Windows Update service (wuauserv) is running and not disabled.        |
|`0x80070005`| An access denied error can be caused by any one of the following:<br> Infected computer<br> Windows Update settings not configured correctly<br> File permission error with %WinDir%\SoftwareDistribution folder<br> Insufficient disk space on the system drive (C:).
|Any other generic exception     | Run a search on the internet for possible resolutions, and work with your local IT support.         |

Reviewing the **%Windir%\Windowsupdate.log** file can also help you determine possible causes. For more information about how to read the log, see [How to read the Windowsupdate.log file](https://support.microsoft.com/help/902093/how-to-read-the-windowsupdate-log-file).

You can also download and run the [Windows Update troubleshooter](https://support.microsoft.com/help/4027322/windows-update-troubleshooter) to check for any issues with Windows Update on the machine.

> [!NOTE]
> The [Windows Update troubleshooter](https://support.microsoft.com/help/4027322/windows-update-troubleshooter) documentation indicates that it's for use on Windows clients, but it also works on Windows Server.

## Scenario: Update run returns Failed status (Linux)

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

If failures occur during an update run after it starts successfully, [check the job output](../update-management/deploy-updates.md#view-results-of-a-completed-update-deployment) from the affected machine in the run. You might find specific error messages from your machines that you can research and take action on. Update Management requires the package manager to be healthy for successful update deployments.

If specific patches, packages, or updates are seen immediately before the job fails, you can try [excluding](../update-management/deploy-updates.md#schedule-an-update-deployment) these items from the next update deployment. To gather log information from Windows Update, see [Windows Update log files](/windows/deployment/update/windows-update-logs).

If you can't resolve a patching issue, make a copy of the **/var/opt/microsoft/omsagent/run/automationworker/omsupdatemgmt.log** file and preserve it for troubleshooting purposes before the next update deployment starts.

## Patches aren't installed

### Machines don't install updates

Try running updates directly on the machine. If the machine can't apply the updates, consult the [list of potential errors in the troubleshooting guide](#hresult).

If updates run locally, try removing and reinstalling the agent on the machine by following the guidance at [Remove a VM from Update Management](../update-management/remove-vms.md).

### I know updates are available, but they don't show as available on my machines

This often happens if machines are configured to get updates from WSUS or Microsoft Endpoint Configuration Manager but WSUS and Configuration Manager haven't approved the updates.

You can check to see if the machines are configured for WSUS and SCCM by cross-referencing the `UseWUServer` registry key to the registry keys in the [Configuring Automatic Updates by Editing the Registry section of this article](https://support.microsoft.com/help/328010/how-to-configure-automatic-updates-by-using-group-policy-or-registry-s).

If updates aren't approved in WSUS, they're not installed. You can check for unapproved updates in Log Analytics by running the following query.

  ```kusto
  Update | where UpdateState == "Needed" and ApprovalSource == "WSUS" and Approved == "False" | summarize max(TimeGenerated) by Computer, KBID, Title
  ```

### Updates show as installed, but I can't find them on my machine

Updates are often superseded by other updates. For more information, see [Update is superseded](/windows/deployment/update/windows-update-troubleshooting#the-update-is-not-applicable-to-your-computer) in the Windows Update Troubleshooting guide.

### Installing updates by classification on Linux

Deploying updates to Linux by classification ("Critical and security updates") has important caveats, especially for CentOS. These limitations are documented on the [Update Management overview page](../update-management/overview.md#linux).

### KB2267602 is consistently missing

KB2267602 is the [Windows Defender definition update](https://www.microsoft.com/wdsi/definitions). It's updated daily.

## Next steps

If you don't see your problem or can't resolve your issue, try one of the following channels for additional support.

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
