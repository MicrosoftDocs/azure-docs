---
title: Troubleshoot Azure Automation Start/Stop VMs during off-hours issues
description: This article tells how to troubleshoot and resolve issues arising during the use of the Start/Stop VMs during off-hours feature.
services: automation
ms.subservice: process-automation
ms.date: 03/16/2023
ms.topic: troubleshooting
ms.custom: engagement-fy23
---

# Troubleshoot Start/Stop VMs during off-hours issues

> [!NOTE]
> Start/Stop VM during off-hours version 1 is unavailable in the marketplace now as it will retire by 30 September 2023. We recommend you start using [version 2](../../azure-functions/start-stop-vms/overview.md), which is now generally available. The new version offers all existing capabilities and provides new features, such as multi-subscription support from a single Start/Stop instance. If you have the version 1 solution already deployed, you can still use the feature, and we will provide support until 30 September 2023. The details of the announcement will be shared soon. 

This article provides information on troubleshooting and resolving issues that arise when you deploy the Azure Automation Start/Stop VMs during off-hours feature on your VMs. 

## <a name="deployment-failure"></a>Scenario: Start/Stop VMs during off-hours fails to properly deploy

### Issue

When you deploy [Start/Stop VMs during off-hours](../automation-solution-vm-management.md), you receive one of the following errors:

```error
Account already exists in another resourcegroup in a subscription. ResourceGroupName: [MyResourceGroup].
```

```error
Resource 'StartStop_VM_Notification' was disallowed by policy. Policy identifiers: '[{\\\"policyAssignment\\\":{\\\"name\\\":\\\"[MyPolicyName]".
```

```error
The subscription is not registered to use namespace 'Microsoft.OperationsManagement'.
```

```error
The subscription is not registered to use namespace 'Microsoft.Insights'.
```

```error
The scope '/subscriptions/000000000000-0000-0000-0000-00000000/resourcegroups/<ResourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<WorkspaceName>/views/StartStopVMView' cannot perform write operation because following scope(s) are locked: '/subscriptions/000000000000-0000-0000-0000-00000000/resourceGroups/<ResourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<WorkspaceName>/views/StartStopVMView'. Please remove the lock and try again
```

```error
A parameter cannot be found that matches parameter name 'TagName'
```

```error
Start-AzureRmVm : Run Login-AzureRmAccount to login
```

### Cause

Deployments can fail because of one of the following reasons:

- There's already an Automation account with the same name in the region selected.
- A policy disallows the deployment of Start/Stop VMs during off-hours.
- The `Microsoft.OperationsManagement`, `Microsoft.Insights`, or `Microsoft.Automation` resource type isn't registered.
- Your Log Analytics workspace is locked.
- You have an outdated version of the AzureRM modules or the Start/Stop VMs during off-hours feature.

### Resolution

Review the following fixes for potential resolutions:

* Automation accounts need to be unique within an Azure region, even if they're in different resource groups. Check your existing Automation accounts in the target region.
* An existing policy prevents a resource that's required for Start/Stop VMs during off-hours to be deployed. Go to your policy assignments in the Azure portal, and check whether you have a policy assignment that disallows the deployment of this resource. To learn more, see [RequestDisallowedByPolicy error](../../azure-resource-manager/templates/error-policy-requestdisallowedbypolicy.md).
* To deploy Start/Stop VMs during off-hours, your subscription needs to be registered to the following Azure resource namespaces:

    * `Microsoft.OperationsManagement`
    * `Microsoft.Insights`
    * `Microsoft.Automation`

   To learn more about errors when you register providers, see [Resolve errors for resource provider registration](../../azure-resource-manager/templates/error-register-resource-provider.md).
* If you have a lock on your Log Analytics workspace, go to your workspace in the Azure portal and remove any locks on the resource.

## <a name="all-vms-fail-to-startstop"></a>Scenario: All VMs fail to start or stop

### Issue

You've configured Start/Stop VMs during off-hours, but it doesn't start or stop all the VMs.

### Cause

This error can be caused by one of the following reasons:

- A schedule isn't configured correctly.
- The Run As account might not be configured correctly.
- A runbook might have run into errors.
- The VMs might have been excluded.

### Resolution

Review the following list for potential resolutions:

* Check that you've properly configured a schedule for Start/Stop VMs during off-hours. To learn how to configure a schedule, see [Schedules](../shared-resources/schedules.md).

* Check the [job streams](../automation-runbook-execution.md#job-statuses) to look for any errors. Look for jobs from one of the following runbooks:

  * **AutoStop_CreateAlert_Child**
  * **AutoStop_CreateAlert_Parent**
  * **AutoStop_Disable**
  * **AutoStop_VM_Child**
  * **ScheduledStartStop_Base_Classic**
  * **ScheduledStartStop_Child_Classic**
  * **ScheduledStartStop_Child**
  * **ScheduledStartStop_Parent**
  * **SequencedStartStop_Parent**

* To learn how to check the permissions on a resource, see [Quickstart: View roles assigned to a user using the Azure portal](../../role-based-access-control/check-access.md). You'll need to provide the application ID for the service principal used by the Run As account. You can retrieve this value by going to your Automation account in the Azure portal. Select **Run as accounts** under **Account Settings**, and select the appropriate Run As account.

* VMs might not be started or stopped if they're being explicitly excluded. Excluded VMs are set in the `External_ExcludeVMNames` variable in the Automation account to which the feature is deployed. The following example shows how you can query that value with PowerShell.

  ```powershell-interactive
  Get-AzAutomationVariable -Name External_ExcludeVMNames -AutomationAccountName <automationAccountName> -ResourceGroupName <resourceGroupName> | Select-Object Value
  ```

## <a name="some-vms-fail-to-startstop"></a>Scenario: Some of my VMs fail to start or stop

### Issue

You've configured Start/Stop VMs during off-hours, but it doesn't start or stop some of the VMs configured.

### Cause

This error can be caused by one of the following reasons:

- In the sequence scenario, a tag might be missing or incorrect.
- The VM might be excluded.
- The Run As account might not have enough permissions on the VM.
- The VM can have an issue that stopped it from starting or stopping.

### Resolution

Review the following list for potential resolutions:

* When you use the [sequence scenario](../automation-solution-vm-management.md) of Start/Stop VMs during off-hours, you must make sure that each VM you want to start or stop has the proper tag. Make sure the VMs that you want to start have the `sequencestart` tag and the VMs you want to stop have the `sequencestop` tag. Both tags require a positive integer value. You can use a query similar to the following example to look for all the VMs with the tags and their values.

  ```powershell-interactive
  Get-AzResource | ? {$_.Tags.Keys -contains "SequenceStart" -or $_.Tags.Keys -contains "SequenceStop"} | ft Name,Tags
  ```

* VMs might not be started or stopped if they're being explicitly excluded. Excluded VMs are set in the `External_ExcludeVMNames` variable in the Automation account to which the feature is deployed. The following example shows how you can query that value with PowerShell.

  ```powershell-interactive
  Get-AzAutomationVariable -Name External_ExcludeVMNames -AutomationAccountName <automationAccountName> -ResourceGroupName <resourceGroupName> | Select-Object Value
  ```

* To start and stop VMs, the Run As account for the Automation account must have appropriate permissions to the VM. To learn how to check the permissions on a resource, see [Quickstart: View roles assigned to a user using the Azure portal](../../role-based-access-control/check-access.md). You'll need to provide the application ID for the service principal used by the Run As account. You can retrieve this value by going to your Automation account in the Azure portal. Select **Run as accounts** under **Account Settings** and select the appropriate Run As account.
* If the VM is having a problem starting or deallocating, there might be an issue on the VM itself. Examples are an update that's being applied when the VM is trying to shut down, a service that hangs, and more. Go to your VM resource, and check **Activity Logs** to see if there are any errors in the logs. You might also attempt to log in to the VM to see if there are any errors in the event logs. To learn more about troubleshooting your VM, see [Troubleshooting Azure virtual machines](/troubleshoot/azure/virtual-machines/welcome-virtual-machines).
* Check the [job streams](../automation-runbook-execution.md#job-statuses) to look for any errors. In the portal, go to your Automation account and select **Jobs** under **Process Automation**.

## <a name="custom-runbook"></a>Scenario: My custom runbook fails to start or stop my VMs

### Issue

You've authored a custom runbook or downloaded one from the PowerShell Gallery, and it isn't working properly.

### Cause

There can be many causes for the failure. Go to your Automation account in the Azure portal, and select **Jobs** under **Process Automation**. From the **Jobs** page, look for jobs from your runbook to view any job failures.

### Resolution

We recommend that you:

* Use [Start/Stop VMs during off-hours](../automation-solution-vm-management.md) to start and stop VMs in Azure Automation. 
* Be aware that Microsoft doesn't support custom runbooks. You might find a resolution for your custom runbook in [Troubleshoot runbook issues](runbooks.md). Check the [job streams](../automation-runbook-execution.md#job-statuses) to look for any errors. 

## <a name="dont-start-stop-in-sequence"></a>Scenario: VMs don't start or stop in the correct sequence

### Issue

The VMs that you've enabled for the feature don't start or stop in the correct sequence.

### Cause

This issue is caused by incorrect tagging on the VMs.

### Resolution

Follow these steps to ensure that the feature is enabled correctly:

1. Ensure that all VMs to be started or stopped have a `sequencestart` or `sequencestop` tag, depending on your situation. These tags need a positive integer as the value. VMs are processed in ascending order based on this value.
1. Make sure that the resource groups for the VMs to be started or stopped are in the `External_Start_ResourceGroupNames` or `External_Stop_ResourceGroupNames` variables, depending on your situation.
1. Test your changes by executing the **SequencedStartStop_Parent** runbook with the `WHATIF` parameter set to True to preview your changes.

## <a name="403"></a>Scenario: Start/Stop VMs during off-hours job fails with 403 forbidden error

### Issue

You find jobs that failed with a `403 forbidden` error for Start/Stop VMs during off-hours runbooks.

### Cause

This issue can be caused by an improperly configured or expired Run As account. It might also be because of inadequate permissions to the VM resources by the Run As account.

### Resolution

To verify that your Run As account is properly configured, go to your Automation account in the Azure portal and select **Run as accounts** under **Account Settings**. If a Run As account is improperly configured or expired, the status shows the condition.

If your Run As account is misconfigured, delete and re-create your Run As account.

If there are missing permissions, see [Quickstart: View roles assigned to a user using the Azure portal](../../role-based-access-control/check-access.md). You must provide the application ID for the service principal used by the Run As account. You can retrieve this value by going to your Automation account in the Azure portal. Select **Run as accounts** under **Account Settings**, and select the appropriate Run As account.

## <a name="other"></a>Scenario: My problem isn't listed here

### Issue

You experience an issue or unexpected result when you use Start/Stop VMs during off-hours that isn't listed on this page.

### Cause

Many times errors can be caused by using an old and outdated version of the feature.

> [!NOTE]
> The Start/Stop VMs during off-hours feature has been tested with the Azure modules that are imported into your Automation account when you deploy the feature on VMs. The feature currently doesn't work with newer versions of the Azure module. This restriction only affects the Automation account that you use to run Start/Stop VMs during off-hours. You can still use newer versions of the Azure module in your other Automation accounts, as described in [Update Azure PowerShell modules](../automation-update-azure-modules.md).

### Resolution

You can check the [job streams](../automation-runbook-execution.md#job-statuses) to look for any errors. 

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
