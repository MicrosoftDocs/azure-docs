---
title: Start/Stop VMs overview
description: This article describes the Start/Stop VMs version two feature, which starts or stops Azure Resource Manager and classic VMs on a schedule.
ms.topic: article
ms.date: 03/10/2021
---

# Start/Stop VMs overview

The Start/Stop VMs during off-hours V2 feature start or stops enabled Azure virtual machines (VMs). It starts or stops Azure VMs on user-defined schedules, provides insights through [Azure Application Insights](../../azure-monitor/app/app-insights-overview.md), and send optional notifications by using [action groups](../../azure-monitor/alerts/action-groups.md). The feature can be enabled on both Azure Resource Manager VMs and classic VMs for most scenarios.

This version of Start/Stop VMs provides a decentralized low-cost automation option for users who want to optimize their VM costs. You can use this feature to schedule VMs to start and stop across multiple subscriptions.

## Overview

Start/Stop VMs has been redesigned where it does not depend on Azure Automation or Azure Monitor Logs. This version relies on [Azure Functions](../../azure-functions/functions-overview.md) to handle the VM start and stop execution.

An HTTP trigger endpoint function is created to support the schedule and sequence scenarios included with the feature, as shown in the following table.

|Name |Trigger |Description |
|-----|--------|------------|
|AlertAvailabilityTest |Timer ||
|AutoStop |HTTP ||
|AutoStopAvailabilityTest |Timer ||
|AutoStopVM |HTTP ||
|CreateAutoStopAlertExecutor |Queue ||
|Scheduled |HTTP ||
|ScheduledAvailabilityTest |Timer ||
|VirtualMachineRequestExecutor |Queue ||
|VirtualMachineRequestOrchestrator |Queue ||

For example, **Scheduled** HTTP trigger function is used to handle schedule and sequence scenarios. Similarly, **AutoStop** HTTP trigger function handles the auto-stop scenario.

The queue-based trigger functions are required in support of this feature. All timer-based triggers are used to perform the availability test and to monitor the health of the system.

 [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) is used to configure and manage the start and stop schedules for the VM take action by calling the function using JSON payload. By default, during initial deployment it creates a total of five Logic Apps for the following scenarios:

- Scheduled - To configure the scheduled start and stop, you can use the two Logic Apps **ststv2_vms_Scheduled_start** and **ststv2_vms_Scheduled_stop**.

- Sequenced - To configure the sequenced start and stop, you can use the two Logic Apps **ststv2_vms_Sequenced_start** and **ststv2_vms_Sequenced_stop**.

- AutoStop - To configure the auto-stop functionality, you can use the **ststv2_vms_AutoStop** Logic App.

If you need additional schedules, you can duplicate one of the Logic Apps included using the **Clone** option in the Azure portal.

All telemetry data, that is trace logs from the function app execution, is sent to your connected Application Insights instance. You can view the telemetry data in Application Insights from a set of visualizations and send email notifications as a result of the actions performed on the VMs.

### New releases

 When a new version of Start/Stop VMs is released, your instance is auto-updated without having to manually redeploy.

## Supported scenarios and options

Start/Stop VMs supports the following scenarios:

* Scheduled start/stop

   Start and stop actions are based on a schedule you specify against Azure Resource Manager and classic VMs.

* Sequenced start/stop

   Start and stop actions are based on a schedule targeting VMs with pre-defined sequencing tags. Only two specifically named tags are supported - **sequencestart** and **sequencestop**.

   > [!NOTE]
   > This scenario only supports Azure Resource Manager VMs.

* AutoStop

   This functionality is only used for performing a stop action against both Azure Resource Manager and classic VMs based on its CPU utilization.

   It can also be a scheduled-based *take action*, which creates alerts on VMs and based on the condition, the alert is triggered to perform the stop action.

### Action assignment

Each Start/Stop action supports assignment to a subscription, resource group, or a list of VMs. See the following below for further details.

#### Subscription

Scoping to a subscription can be used when you need to perform the start and stop action on all the VMs in an entire subscription, and you can select multiple subscriptions if required.  

You can also specify a list of VMs to exclude and it will ignore them from the action. You can also use wildcard characters to specify all the names that simultaneously can be ignored.

#### Resource group

Scoping to a resource group can be used when you need to perform the start and stop action on all the VMs by specifying one or more resource group names, and across one or more subscriptions.

You can also specify a list of VMs to exclude and it will ignore them from the action. You can also use wildcard characters to specify all the names that simultaneously can be ignored.

#### VMList

Specifying a list of VMs can be used when you need to perform the start and stop action on a specific set of virtual machines, and across multiple subscriptions. This option does not support specifying a list of VMs to exclude.

## Prerequisites

- You must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

- Your account has been granted the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) permission in the subscription.

- An Azure Storage account, which is required by Functions. Start/Stop VMs also uses this Storage account for two purposes:

    1. Uses Azure Table Storage to store the execution operation metadata (that is, the start/stop VM action).

    1. Uses Azure Queue Storage to support the Azure Functions queue-based triggers.

- Start/Stop VMs is available in all Azure global regions that are listed in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=functions) page for Azure Functions. For the Azure Government cloud, it is only available in the US Government Virginia region.