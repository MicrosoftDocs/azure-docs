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

### <a name=" "></a>Scenario: All VMs fail to start/stop

#### Issue

You have configured the Start/Stop VM solution but it does not start/stop all the VMs configured.

#### Cause

This error can be caused by one of the following reasons:

1. A schedule is not configured correctly
2. The RunAs account may not be configured correctly
3. There may additional problems

#### Resolution

In the portal go to your Automation Account and select **Jobs** under **Process Automation**. From the **Jobs** page look for jobs from one of the following runbooks:

* AutoStop_CreateAlert_Child
* AutoStop_CreateAlert_Parent
* AutoStop_Disable
* AutoStop_VM_Child
* ScheduledStartStop_Base_Classic
* ScheduledStartStop_Child_Classic
* ScheduledStartStop_Child
* ScheduledStartStop_Parent
* SequencedStartStop_Parent

Verify your [RunAs Account](../manage-runas-account.md)

Check the [job streams]()

Explain how to check job streams
For scheduled start/stop: Explain how to review schedules
Provide link to Run As certificate TSG

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/)
* Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
