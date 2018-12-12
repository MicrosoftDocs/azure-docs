---
title: Troubleshoot errors with Update Management
description: Learn how to troubleshoot issues with Update Management
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 12/05/2018
ms.topic: conceptual
ms.service: automation
manager: carmonm
---
# Troubleshooting issues with Update Management

This article discusses solutions to resolve issues that you may run across when using Update Management.

There is an agent troubleshooter for Hybrid Worker agent to determine the underlying problem. To learn more about the troubleshooter, see [Troubleshoot update agent issues](update-agent-issues.md). For all other issues, see the detailed information below about possible issues.

## General

### <a name="components-enabled-not-working"></a>Scenario: The components for the 'Update Management' solution have been enabled, and now this virtual machine is being configured

#### Issue

You continue to see the following message on a virtual machine 15 minutes after onboarding:

```
The components for the 'Update Management' solution have been enabled, and now this virtual machine is being configured. Please be patient, as this can sometimes take up to 15 minutes.
```

#### Cause

This error can be caused by the following reasons:

1. Communication back to the Automation Account is being blocked.
2. The VM being onboarded may have come from a cloned machine that wasn't sysprepped with the Microsoft Monitoring Agent installed.

#### Resolution

1. Visit, [Network planning](../automation-hybrid-runbook-worker.md#network-planning) to learn about which addresses and ports need to be allowed for Update Management to work.
2. If using a cloned image, sysprep the image first and install the MMA agent after the fact.

### <a name="multi-tenant"></a>Scenario: You receive a linked subscription error when creating an update deployment for machines in another Azure tenant.

#### Issue

You receive the following error when trying to create an update deployment for machines in another Azure tenant:

```
The client has permission to perform action 'Microsoft.Compute/virtualMachines/write' on scope '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroupName/providers/Microsoft.Automation/automationAccounts/automationAccountName/softwareUpdateConfigurations/updateDeploymentName', however the current tenant '00000000-0000-0000-0000-000000000000' is not authorized to access linked subscription '00000000-0000-0000-0000-000000000000'.
```

#### Cause

This error occurs when you create an update deployment that has Azure virtual machines in another tenant included in an update deployment.

#### Resolution

You'll need to use the following workaround to get them scheduled. You can use the [New-AzureRmAutomationSchedule](/powershell/module/azurerm.automation/new-azurermautomationschedule?view=azurermps-6.13.0) cmdlet with the switch `-ForUpdate` to create a schedule, and use the [New-AzureRmAutomationSoftwareUpdateConfiguration](/powershell/module/azurerm.automation/new-azurermautomationsoftwareupdateconfiguration?view=azurermps-6.13.0
) cmdlet and pass the machines in the other tenant to the `-NonAzureComputer` parameter. The following example shows an example on how to do this:

```azurepowershell-interactive
$nonAzurecomputers = @("server-01", "server-02")

$startTime = ([DateTime]::Now).AddMinutes(10)

$s = New-AzureRmAutomationSchedule -ResourceGroupName mygroup -AutomationAccountName myaccount -Name myupdateconfig -Description test-OneTime -OneTime -StartTime $startTime -ForUpdate

New-AzureRmAutomationSoftwareUpdateConfiguration  -ResourceGroupName $rg -AutomationAccountName $aa -Schedule $s -Windows -AzureVMResourceId $azureVMIdsW -NonAzureComputer $nonAzurecomputers -Duration (New-TimeSpan -Hours 2) -IncludedUpdateClassification Security,UpdateRollup -ExcludedKbNumber KB01,KB02 -IncludedKbNumber KB100
```

## Windows

If you encounter issues while attempting to onboard the solution on a virtual machine, check the **Operations Manager** event log under **Application and Services Logs** on the local machine for events with event ID **4502** and event message containing **Microsoft.EnterpriseManagement.HealthService.AzureAutomation.HybridAgent**.

The following section highlights specific error messages and a possible resolution for each. For other onboarding issues see, [troubleshoot solution onboarding](onboarding.md).

### <a name="machine-already-registered"></a>Scenario: Machine is already registered to a different account

#### Issue

You receive the following error message:

```
Unable to Register Machine for Patch Management, Registration Failed with Exception System.InvalidOperationException: {"Message":"Machine is already registered to a different account."}
```

#### Cause

The machine is already onboarded to another workspace for Update Management.

#### Resolution

Perform cleanup of old artifacts on the machine by [deleting the hybrid runbook group](../automation-hybrid-runbook-worker.md#remove-a-hybrid-worker-group) and try again.

### <a name="machine-unable-to-communicate"></a>Scenario: Machine is unable to communicate with the service

#### Issue

You receive one of the following error messages:

```
Unable to Register Machine for Patch Management, Registration Failed with Exception System.Net.Http.HttpRequestException: An error occurred while sending the request. ---> System.Net.WebException: The underlying connection was closed: An unexpected error occurred on a receive. ---> System.ComponentModel.Win32Exception: The client and server can't communicate, because they do not possess a common algorithm
```

```
Unable to Register Machine for Patch Management, Registration Failed with Exception Newtonsoft.Json.JsonReaderException: Error parsing positive infinity value.
```

```
The certificate presented by the service <wsid>.oms.opinsights.azure.com was not issued by a certificate authority used for Microsoft services. Contact your network administrator to see if they are running a proxy that intercepts TLS/SSL communication.
```

#### Cause

There may be a proxy, gateway, or firewall blocking network communication.

#### Resolution

Review your networking and ensure appropriate ports and addresses are allowed. See [network requirements](../automation-hybrid-runbook-worker.md#network-planning), for a list of ports and addresses that are required by Update Management and Hybrid Runbook Workers.

### <a name="unable-to-create-selfsigned-cert"></a>Scenario: Unable to create self-signed certificate

#### Issue

You receive one of the following error messages:

```
Unable to Register Machine for Patch Management, Registration Failed with Exception AgentService.HybridRegistration. PowerShell.Certificates.CertificateCreationException: Failed to create a self-signed certificate. ---> System.UnauthorizedAccessException: Access is denied.
```

#### Cause

The Hybrid Runbook Worker wasn't able to generate a self-signed certificate

#### Resolution

Verify system account has read access to folder **C:\ProgramData\Microsoft\Crypto\RSA** and try again.

### <a name="nologs"></a>Scenario: Update Management data not showing in Log Analytics for a machine

#### Issue

You have machines that show as **Not Assessed** under **Compliance**, but you see heartbeat data in Log Analytics for the Hybrid Runbook Worker but not Update Management.

#### Cause

The Hybrid Runbook Worker may need to be re-registered and reinstalled.

#### Resolution

Follow the steps at [Deploy a Windows Hybrid Runbook Worker](../automation-windows-hrw-install.md) to reinstall the Hybrid Worker.

### <a name="hresult"></a>Scenario: Machine shows as Not assessed and shows an HResult exception

#### Issue

You have machines that show as **Not Assessed** under **Compliance**, and you see an exception message below it.

#### Cause

Windows update is not configured correctly in the machine.

#### Resolution

Double-click on the exception displayed in red to see the entire exception message. Review the following table for potential solutions or actions to take:

|Exception  |Resolution or Action  |
|---------|---------|
|`Exception from HRESULT: 0x……C`     | Search the relevant error code in [Windows update error code list](https://support.microsoft.com/help/938205/windows-update-error-code-list) to find additional details on the cause of the exception.        |
|`0x8024402C` or `0x8024401C`     | These errors are network connectivity issues. Make sure that your machine has the proper network connectivity to Update Management. See the section on [network planning](../automation-update-management.md#ports) for a list of ports and addresses that are required.        |
|`0x8024402C`     | If you are using a WSUS server, make sure the registry values for `WUServer` and `WUStatusServer` under the registry key `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate` have the correct WSUS server.        |
|`The service cannot be started, either because it is disabled or because it has no enabled devices associated with it. (Exception from HRESULT: 0x80070422)`     | Make sure the Windows Update service (wuauserv) is running and is not disabled.        |
|Any other generic exception     | Do a search the internet for the possible solutions and work with your local IT support.         |

## Linux

### Scenario: Update run fails to start

#### Issue

An update runs fail to start on a Linux machine.

#### Cause

The Linux Hybrid Worker is unhealthy.

#### Resolution

Make a copy of the following log file and preserve it for troubleshooting purposes:

```
/var/opt/microsoft/omsagent/run/automationworker/worker.log
```

### Scenario: Update run starts, but encounters errors

#### Issue

An update run starts, but encounters errors during the run.

#### Cause

Possible causes could be:

* Package manager is unhealthy
* Specific packages may interfere with cloud based patching
* Other reasons

#### Resolution

If failures occur during an update run after it starts successfully on Linux, check the job output from the affected machine in the run. You may find specific error messages from your machine's package manager that you can research and take action on. Update Management requires the package manager to be healthy for successful update deployments.

In some cases, package updates can interfere with Update Management preventing an update deployment from completing. If you see that, you'll have to either exclude these packages from future update runs or install them manually yourself.

If you can't resolve a patching issue, make a copy of the following log file and preserve it **before** the next update deployment starts for troubleshooting purposes:

```
/var/opt/microsoft/omsagent/run/automationworker/omsupdatemgmt.log
```

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.