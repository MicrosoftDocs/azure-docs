---
title: Troubleshoot Starting and Stopping VMs - Azure Automation
description: This article provides information on troubleshooting Starting and Stopping VMs in Azure Automation.
services: automation
ms.service: automation
ms.subservice: process-automation
author: mgoedtel
ms.author: magoedte
ms.date: 04/04/2019
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot the Start/Stop VMs during off hours solution

## <a name="deployment-failure"></a>Scenario: The Start/Stop VM solution fails to properly deploy

### Issue

When deploying the [Start/Stop VMs during off hours solution](../automation-solution-vm-management.md), you receive one of the following errors:

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

Deployments may fail because of one of the following reasons:

1. There is already an Automation Account with the same name in the region selected.
2. A policy is in place that disallows the deployment of the Start/Stop VMs solution.
3. The `Microsoft.OperationsManagement`, `Microsoft.Insights`, or `Microsoft.Automation` resource types are not registered.
4. Your Log Analytics workspace has a lock on it.
5. You have an outdated version of AzureRM modules or the Start/Stop solution.

### Resolution

Review the following list for potential solutions to your problem or places to look:

1. Automation accounts need to be unique within an Azure region, even if they are in different resource groups. Check your existing Automation Accounts in the target region.
2. An existing policy prevents a resource that is required for the Start/Stop VM solution to be deployed. Go to your policy assignments in the Azure portal and check whether you have a policy assignment that disallows the deployment of this resource. To learn more about this, see [RequestDisallowedByPolicy](../../azure-resource-manager/templates/error-policy-requestdisallowedbypolicy.md).
3. In order to deploy the Start/Stop VM solution, your subscription needs to be registered to the following Azure resource namespaces:
    * `Microsoft.OperationsManagement`
    * `Microsoft.Insights`
    * `Microsoft.Automation`

   See, [Resolve errors for resource provider registration](../../azure-resource-manager/templates/error-register-resource-provider.md) to learn more about errors when registering providers.
4. If you have a lock on your Log Analytics workspace, go to your workspace in the Azure portal and remove any locks on the resource.
5. If the resolutions above do not solve your issue, follow the instructions under [Update the Solution](../automation-solution-vm-management.md#update-the-solution) to re-deploy the Start/Stop solution.

## <a name="all-vms-fail-to-startstop"></a>Scenario: All VMs fail to start/stop

### Issue

You've configured the Start/Stop VM solution but it doesn't start or stop all the VMs configured.

### Cause

This error can be caused by one of the following reasons:

1. A schedule isn't configured correctly
2. The RunAs account may not be configured correctly
3. A runbook may have run into errors
4. The VMs may have been excluded

### Resolution

Review the following list for potential solutions to your problem or places to look:

* Check that you've properly configured a schedule for the Start/Stop VM solution. To learn how to configure a schedule, see the [Schedules](../automation-schedules.md) article.

* Check the [job streams](../automation-runbook-execution.md#viewing-job-status-from-the-azure-portal) to look for any errors. In the portal, go to your Automation Account and select **Jobs** under **Process Automation**. From the **Jobs** page look for jobs from one of the following runbooks:

  * AutoStop_CreateAlert_Child
  * AutoStop_CreateAlert_Parent
  * AutoStop_Disable
  * AutoStop_VM_Child
  * ScheduledStartStop_Base_Classic
  * ScheduledStartStop_Child_Classic
  * ScheduledStartStop_Child
  * ScheduledStartStop_Parent
  * SequencedStartStop_Parent

* Verify your [RunAs Account](../manage-runas-account.md) has proper permissions to the VMs you're trying to start or stop. To learn how to check the permissions on a resource, see [Quickstart: View roles assigned to a user using the Azure portal](../../role-based-access-control/check-access.md). You'll need to provide the Application Id for the service principal used by the Run As Account. You can retrieve this value by going to your Automation Account in the Azure portal, selecting **Run as accounts** under **Account Settings** and clicking the appropriate Run As Account.

* VMs may not be started or stopped if they're being explicitly excluded. Excluded VMs at set in the **External_ExcludeVMNames** variable in the Automation Account the solution is deployed to. The following example, shows how you can query that value with PowerShell.

  ```powershell-interactive
  Get-AzureRmAutomationVariable -Name External_ExcludeVMNames -AutomationAccountName <automationAccountName> -ResourceGroupName <resourceGroupName> | Select-Object Value
  ```

## <a name="some-vms-fail-to-startstop"></a>Scenario: Some of my VMs fail to start or stop

### Issue

You've configured the Start/Stop VM solution but it doesn't start or stop some of the VMs configured.

### Cause

This error can be caused by one of the following reasons:

1. If using the sequence scenario, a tag could be missing or incorrect
2. The VM may be excluded
3. The RunAs account may not have enough permissions on the VM
4. The VM could have something that stopped it from starting or stopping

### Resolution

Review the following list for potential solutions to your problem or places to look:

* When using the [sequence scenario](../automation-solution-vm-management.md#scenario-2-startstop-vms-in-sequence-by-using-tags) of the Start/Stop VM during off hours solution, you must make sure each VM you want to start or stop has the proper tag. Make sure the VMs that you want to start have the `sequencestart` tag and the VMs you want to stop have the `sequencestop` tag. Both tags require a positive integer value. You can use a query similar to the following example to look for all the VMs with the tags and their values.

  ```powershell-interactive
  Get-AzureRmResource | ? {$_.Tags.Keys -contains "SequenceStart" -or $_.Tags.Keys -contains "SequenceStop"} | ft Name,Tags
  ```

* VMs may not be started or stopped if they're being explicitly excluded. Excluded VMs at set in the **External_ExcludeVMNames** variable in the Automation Account the solution is deployed to. The following example, shows how you can query that value with PowerShell.

  ```powershell-interactive
  Get-AzureRmAutomationVariable -Name External_ExcludeVMNames -AutomationAccountName <automationAccountName> -ResourceGroupName <resourceGroupName> | Select-Object Value
  ```

* To start and stop VMs, the RunAs account for the Automation account must have appropriate permissions to the VM. To learn how to check the permissions on a resource, see [Quickstart: View roles assigned to a user using the Azure portal](../../role-based-access-control/check-access.md). You'll need to provide the Application Id for the service principal used by the Run As Account. You can retrieve this value by going to your Automation Account in the Azure portal, selecting **Run as accounts** under **Account Settings** and clicking the appropriate Run As Account.

* If the VM is having a problem starting or deallocating, this behavior can be caused by an issue on the VM itself. Some examples or potential problems are, an update is being applied when trying to shutdown, a service hangs, and more). Navigate to your VM resource and check the **Activity Logs** to see if there are any errors in the logs. You may also attempt to log into the VM to see if there are any errors in the Event logs. To learn more about troubleshooting your VM, see [Troubleshooting Azure virtual machines](../../virtual-machines/troubleshooting/index.md)

* Check the [job streams](../automation-runbook-execution.md#viewing-job-status-from-the-azure-portal) to look for any errors. In the portal, go to your Automation Account and select **Jobs** under **Process Automation**.

## <a name="custom-runbook"></a>Scenario: My custom runbook fails to start or stop my VMs

### Issue

You've authored a custom runbook or downloaded one from the PowerShell Gallery and it isn't working properly.

### Cause

The cause for the failure could be one of many things. Go to your Automation Account in the Azure portal and select **Jobs** under **Process Automation**. From the **Jobs** page, look for jobs from your runbook to view any job failures.

### Resolution

It's recommended to use the [Start/Stop VMs during off hours solution](../automation-solution-vm-management.md) to start and stop VMs in Azure Automation. This solution is authored by Microsoft. Custom runbooks are not supported by Microsoft. You might find a solution for your custom runbook by visiting the [runbook troubleshooting](runbooks.md) article. This article provides general guidance and troubleshooting for runbooks of all types. Check the [job streams](../automation-runbook-execution.md#viewing-job-status-from-the-azure-portal) to look for any errors. In the portal, go to your Automation Account and select **Jobs** under **Process Automation**.

## <a name="dont-start-stop-in-sequence"></a>Scenario: VMs don't start or stop in the correct sequence

### Issue

The VMs that you've configured in the solution don't start or stop in the correct sequence.

### Cause

This is caused by incorrect tagging on the VMs.

### Resolution

Take the following steps to ensure that the solution is configured correctly.

1. Ensure all VMs to be started or stopped have a `sequencestart` or `sequencestop` tag, depending on your situation. These tags need a positive integer as the value. VMs are processed in ascending order based on this value.
2. Make sure the resource groups for the VMs to be started or stopped are in the `External_Start_ResourceGroupNames` or `External_Stop_ResourceGroupNames` variables, depending on your situation.
3. Test your changes by executing the `SequencedStartStop_Parent` runbook with the WHATIF parameter set to True to preview your changes.

For more detailed and additional instructions on how to use the solution to start and stop VMs in sequence, see [Start/Stop VMs in sequence](../automation-solution-vm-management.md#scenario-2-startstop-vms-in-sequence-by-using-tags).

## <a name="403"></a>Scenario: Start/Stop VM job fails with 403 forbidden status

### Issue

You find jobs that failed with a `403 forbidden` error for the Start/Stop VMs during off hours solution runbooks.

### Cause

This issue can be caused by an improperly configured or expired Run As Account. It may also be because of inadequate permissions to the VM resources by the Automation Accounts Run As Account.

### Resolution

To check your Run As account is properly configured, go to your Automation Account in the Azure portal and select **Run as accounts** under **Account Settings**. Here you will see the status of your run as accounts, if a Run As Account is improperly configured or expired the status will show this.

If your Run As account is [misconfigured](../manage-runas-account.md#misconfiguration), you should delete and recreate your Run As Account.

If the certificate is expired for your Run As Account, follow the steps listed at [Self-signed certificate renewal](../manage-runas-account.md#cert-renewal) to renew the certificate.

The issue may be caused by missing permissions. To learn how to check the permissions on a resource, see [Quickstart: View roles assigned to a user using the Azure portal](../../role-based-access-control/check-access.md). You'll need to provide the Application Id for the service principal used by the Run As Account. You can retrieve this value by going to your Automation Account in the Azure portal, selecting **Run as accounts** under **Account Settings** and clicking the appropriate Run As Account.

## <a name="other"></a>Scenario: My problem isn't listed above

### Issue

You experience an issue or unexpected result when using the Start/Stop VMs during off-hours solution that isn't listed on this page.

### Cause

Many times errors can be caused by using an old and outdated version of the solution.

> [!NOTE]
> The Start/Stop VMs during off-hours solution has been tested with the Azure modules that are imported into your Automation Account when you deploy the solution. The solution does currently not work with newer versions of the Azure module. This only affects the Automation Account that you use to run the Start/Stop VMs during off-hours solution. You can still use newer versions of the Azure module in your other Automation Accounts, as described in [How to update Azure PowerShell modules in Azure Automation](../automation-update-azure-modules.md)

### Resolution

To resolve many errors, it's recommended to remove and update the solution. To learn how to update the solution, see [Update the Start/Stop VMs during off hours solution](../automation-solution-vm-management.md#update-the-solution). Additionally, you can check the [job streams](../automation-runbook-execution.md#viewing-job-status-from-the-azure-portal) to look for any errors. In the portal, go to your Automation Account and select **Jobs** under **Process Automation**.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
