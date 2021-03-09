---
title: Start/Stop VMs overview
description: This article describes the Start/Stop VMs version two feature, which starts or stops Azure Resource Manager and classic VMs on a schedule.
ms.topic: article
ms.date: 03/02/2021
---

# Start/Stop VMs overview

The Start/Stop VMs during off-hours V2 feature start or stops enabled Azure VMs. It starts or stops Azure virtual machines on user-defined schedules, provides insights through [Azure Application Insights](../../azure-monitor/app/app-insights-overview.md), and send optional notifications by using [action groups](../../azure-monitor/alerts/action-groups.md). The feature can be enabled on both Azure Resource Manager VMs and classic VMs for most scenarios.

This version of Start/Stop VMs provides a decentralized low-cost automation option for users who want to optimize their VM costs. You can use the feature to:

- Schedule VMs to start and stop across multiple subscriptions.
- Auto Update to the latest version without having to manually redeploy.

## About Start/Stop VMs

Start/Stop VMs has been redesigned where it does not depend on Azure Automation or Azure Monitor Logs. This version relies on [Azure Functions](../../azure-functions/functions-overview.md) to handle the VM start and stop execution. A HTTP trigger endpoint function is created to support the schedule and sequence scenarios included with the feature, as shown in the following table.

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

* Scheduled - To configure the scheduled start and stop, you can use the two Logic Apps **ststv2_vms_Scheduled_start** and **ststv2_vms_Scheduled_stop**.

* Sequenced - To configure the sequenced start and stop, you can use the two Logic Apps **ststv2_vms_Sequenced_start** and **ststv2_vms_Sequenced_stop**. 

* AutoStop - To configure the auto-stop functionality, you can use the **ststv2_vms_AutoStop** Logic App.

If you need additional schedules, you can duplicate one of the Logic Apps using the **Clone** option in the Azure portal.

All telemetry data, that is trace logs from the function app execution, is sent to your connected Application Insights instance. You can view the telemetry data in Application Insights from a set of visualizations and send email notifications as a result of the actions performed on the VMs. 

## Prerequisites

* Your account has been granted the [Contributor] permission in the subscription.
* 