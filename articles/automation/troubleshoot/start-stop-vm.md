---
title: Troubleshooting Starting and Stopping VMs with Azure Automation
description: This article provides information on troubleshooting Starting and Stopping VMs in Azure Automation
services: automation
ms.service: automation
ms.subservice: process-automation
author: georgewallace
ms.author: gwallace
ms.date: 01/23/2019
ms.topic: conceptual
manager: carmonm
---
# Troubleshoot Start / Stop VMs

### <a name="cant-deploy-solution"></a>Scenario: I can't deploy the Start/Stop VMs during off-hours solution

#### Issue

#### Cause

#### Resolution

### <a name="all-vms-fail-to-startstop"></a>Scenario: All VMs fail to start/stop

#### Issue

You've configured the Start/Stop VM solution but it doesn't start/stop all the VMs configured.

#### Cause

This error can be caused by one of the following reasons:

1. A schedule isn't configured correctly
2. The RunAs account may not be configured correctly
3. The runbook may have run into errors

#### Resolution

Review the following list for potential solutions to your problem or places to look:

* Check that you've properly configured a schedule for the Start/Stop VM solution. To learn how to configure a schedule, see the [Schedules](../automation-schedules.md) article.

* Check the job streams for the runbooks to look for any errors. In the portal, go to your Automation Account and select **Jobs** under **Process Automation**. From the **Jobs** page look for jobs from one of the following runbooks:

  * AutoStop_CreateAlert_Child
  * AutoStop_CreateAlert_Parent
  * AutoStop_Disable
  * AutoStop_VM_Child
  * ScheduledStartStop_Base_Classic
  * ScheduledStartStop_Child_Classic
  * ScheduledStartStop_Child
  * ScheduledStartStop_Parent
  * SequencedStartStop_Parent

* Verify your [RunAs Account](../manage-runas-account.md) has proper permissions to the VMs you're trying to start or stop. To learn more about the permissions needed see, [Role Based Access Control with Azure Automation](../automation-role-based-access-control.md).

### <a name="custom-runbook"></a>Scenario: My custom runbook fails to start or stop my VMs

#### Issue

You've authored a custom runbook or downloaded one from the gallery and it isn't properly working.

#### Cause

The cause for the failure could be one of many things. Go to your Automation Account in the Azure portal and select **Jobs** under **Process Automation**. From the **Jobs** page, look for jobs from your runbook to view any job failures.

#### Resolution

It's recommended to use the [Start/Stop VMs during off hours solution](../automation-solution-vm-management.md) to start and stop VMs in Azure Automation. This solution is authored by Microsoft. Custom runbooks are not supported by Microsoft. You might find a solution for your custom runbook by visiting the [runbook troubleshooting](runbooks.md) article. This article provides general guidance and troubleshooting for runbooks of all types.

### <a name="other"></a>Scenario: My problem isn't listed above

#### Issue

You experience an issue or unexpected result when using the Start/Stop VMs during off hours solution that isn't listed on this page.

#### Cause

Many times this can be caused by using an old and outdated version of the solution.

#### Resolution

To resolve many errors, it's recommended to remove and update the solution. To learn how to do this, see [Update the Start/Stop VMs during off hours solution](../automation-solution-vm-management.md#update-the-solution).

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
