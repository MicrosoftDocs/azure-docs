---
title: Troubleshoot Azure Automation feature deployment issues
description: This article tells how to troubleshoot and resolve issues that arise when deploying Azure Automation features.
services: automation
ms.date: 02/11/2021
ms.topic: troubleshooting
---

# Troubleshoot feature deployment issues

You might receive error messages when you deploy the Azure Automation Update Management feature or the Change Tracking and Inventory feature on your VMs. This article describes the errors that might occur and how to resolve them.

## Known issues

### <a name="node-rename"></a>Scenario: Renaming a registered node requires unregister or register again

#### Issue

A node is registered to Azure Automation, and then the operating system computer name is changed. Reports from the node continue to appear with the original name.

#### Cause

Renaming registered nodes doesn't update the node name in Azure Automation.

#### Resolution

Unregister the node from Azure Automation State Configuration, and then register it again. Reports published to the service before that time will no longer be available.

### <a name="resigning-cert"></a>Scenario: Re-signing certificates via HTTPS proxy isn't supported

#### Issue

When you connect through a proxy that terminates HTTPS traffic and then re-encrypts the traffic using a new certificate, the service doesn't allow the connection.

#### Cause

Azure Automation doesn't support re-signing certificates used to encrypt traffic.

#### Resolution

There's currently no workaround for this issue.

## General errors

### <a name="missing-write-permissions"></a>Scenario: Feature deployment fails with the message "The solution cannot be enabled"

#### Issue

You receive one of the following messages when you attempt to enable a feature on a VM:

```error
The solution cannot be enabled due to missing permissions for the virtual machine or deployments
```

```error
The solution cannot be enabled on this VM because the permission to read the workspace is missing
```

#### Cause

This error is caused by incorrect or missing permissions on the VM or workspace, or for the user.

#### Resolution

Ensure that you have correct [feature deployment permissions](../automation-role-based-access-control.md#feature-setup-permissions), and then try to deploy the feature again. If you receive the error message `The solution cannot be enabled on this VM because the permission to read the workspace is missing`, see the following [troubleshooting information](update-management.md#failed-to-enable-error).

### <a name="diagnostic-logging"></a>Scenario: Feature deployment fails with the message "Failed to configure automation account for diagnostic logging"

#### Issue

You receive the following message when you attempt to enable a feature on a VM:

```error
Failed to configure automation account for diagnostic logging
```

#### Cause

This error can be caused if the pricing tier doesn't match the subscription's billing model. For more information, see [Monitoring usage and estimated costs in Azure Monitor](../../azure-monitor//usage-estimated-costs.md).

#### Resolution

Create your Log Analytics workspace manually, and repeat the feature deployment process to select the workspace created.

### <a name="computer-group-query-format-error"></a>Scenario: ComputerGroupQueryFormatError

#### Issue

This error code means that the saved search computer group query used to target the feature isn't formatted correctly. 

#### Cause

You might have altered the query, or the system might have altered it.

#### Resolution

You can delete the query for the feature and then enable the feature again, which re-creates the query. The query can be found in your workspace under **Saved searches**. The name of the query is **MicrosoftDefaultComputerGroup**, and the category of the query is the name of the associated feature. If multiple features are enabled, the **MicrosoftDefaultComputerGroup** query shows multiple times under **Saved searches**.

### <a name="policy-violation"></a>Scenario: PolicyViolation

#### Issue

This error code indicates that the deployment failed due to violation of one or more Azure Policy assignments.

#### Cause 

An Azure Policy assignment is blocking the operation from completing.

#### Resolution

To successfully deploy the feature, you must consider altering the indicated policy definition. Because there are many different types of policy definitions that can be defined, the changes required depend on the policy definition that's violated. For example, if a policy definition is assigned to a resource group that denies permission to change the contents of some contained resources, you might choose one of these fixes:

* Remove the policy assignment altogether.
* Try to enable the feature for a different resource group.
* Retarget the policy assignment to a specific resource, for example, an Automation account.
* Revise the set of resources that the policy definition is configured to deny.

Check the notifications in the upper-right corner of the Azure portal, or go to the resource group that contains your Automation account and select **Deployments** under **Settings** to view the failed deployment. To learn more about Azure Policy, see [Overview of Azure Policy](../../governance/policy/overview.md?toc=%2fazure%2fautomation%2ftoc.json).

### <a name="unlink"></a>Scenario: Errors trying to unlink a workspace

#### Issue

You receive the following error message when you try to unlink a workspace:

```error
The link cannot be updated or deleted because it is linked to Update Management and/or ChangeTracking Solutions.
```

#### Cause

This error occurs when you still have features active in your Log Analytics workspace that depend on your Automation account and Log Analytics workspace being linked.

### Resolution

Remove the resources for the following features from your workspace if you're using them:

* Update Management
* Change Tracking and Inventory
* Start/Stop VMs during off-hours

After you remove the feature resources, you can unlink your workspace. It's important to clean up any existing artifacts from these  features from your workspace and your Automation account:

* For Update Management, remove **Update Deployments (Schedules)** from your Automation account.
* For Start/Stop VMs during off-hours, remove any locks on feature components in your Automation account under **Settings** > **Locks**. For more information, see [Remove the feature](../automation-solution-vm-management-remove.md).

## <a name="mma-extension-failures"></a>Log Analytics for Windows extension failures

[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)] 

An installation of the Log Analytics agent for Windows extension can fail for a variety of reasons. The following section describes feature deployment issues that can cause failures during deployment of the Log Analytics agent for Windows extension.

>[!NOTE]
>Log Analytics agent for Windows is the name used currently in Azure Automation for the Microsoft Monitoring Agent (MMA).

### <a name="webclient-exception"></a>Scenario: An exception occurred during a WebClient request

The Log Analytics for Windows extension on the VM is unable to communicate with external resources and the deployment fails.

#### Issue

The following are examples of error messages that are returned:

```error
Please verify the VM has a running VM agent, and can establish outbound connections to Azure storage.
```

```error
'Manifest download error from https://<endpoint>/<endpointId>/Microsoft.EnterpriseCloud.Monitoring_MicrosoftMonitoringAgent_australiaeast_manifest.xml. Error: UnknownError. An exception occurred during a WebClient request.
```

#### Cause

Some potential causes of this error are:

* A proxy configured in the VM only allows specific ports.
* A firewall setting has blocked access to the required ports and addresses.

#### Resolution

Ensure that you have the proper ports and addresses open for communication. For a list of ports and addresses, see [Planning your network](../automation-hybrid-runbook-worker.md#network-planning).

### <a name="transient-environment-issue"></a>Scenario: Install failed because of transient environment issues

The installation of the Log Analytics for Windows extension failed during deployment because of another installation or action blocking the installation.

#### Issue

The following are examples of error messages that might be returned:

```error
The Microsoft Monitoring Agent failed to install on this machine. Please try to uninstall and reinstall the extension. If the issue persists, please contact support.
```

```error
'Install failed for plugin (name: Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent, version 1.0.11081.4) with exception Command C:\Packages\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\1.0.11081.4\MMAExtensionInstall.exe of Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent has exited with Exit code: 1618'
```

```error
'Install failed for plugin (name: Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent, version 1.0.11081.2) with exception Command C:\Packages\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\1.0.11081.2\MMAExtensionInstall.exe of Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent has exited with Exit code: 1601'
```

#### Cause

Some potential causes of this error are:

* Another installation is in progress.
* The system is triggered to reboot during template deployment.

#### Resolution

This error is transient in nature. Retry the deployment to install the extension.

### <a name="installation-timeout"></a>Scenario: Installation timeout

The installation of the Log Analytics for Windows extension didn't complete because of a timeout.

#### Issue

The following is an example of an error message that might be returned:

```error
Install failed for plugin (name: Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent, version 1.0.11081.4) with exception Command C:\Packages\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\1.0.11081.4\MMAExtensionInstall.exe of Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent has exited with Exit code: 15614
```

#### Cause

This type of error occurs because the VM is under a heavy load during installation.

### Resolution

Try to install the Log Analytics agent for Windows extension when the VM is under a lower load.

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.