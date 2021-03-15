---
title: Start/Stop VMs (preview) overview
description: This article describes version two of the Start/Stop VMs (preview) feature, which starts or stops Azure Resource Manager and classic VMs on a schedule.
ms.topic: conceptual
ms.service: azure-functions
ms.subservice: 
ms.date: 03/12/2021
---

# Start/Stop VMs (preview) overview

The Start/Stop VMs (preview) feature starts or stops enabled Azure virtual machines (VMs) across multiple subscriptions. It starts or stops Azure VMs on user-defined schedules, provides insights through [Azure Application Insights](../../azure-monitor/app/app-insights-overview.md), and send optional notifications by using [action groups](../../azure-monitor/alerts/action-groups.md). The feature can be enabled on both Azure Resource Manager VMs and classic VMs for most scenarios.

This new version of Start/Stop VMs (preview) provides a decentralized low-cost automation option for customers who want to optimize their VM costs. It offers all of the same functionality as the [original version](../../automation/automation-solution-vm-management.md) available with Azure Automation, but it is designed to take advantage of newer technology in Azure.

## Overview

Start/Stop VMs (preview) is redesigned and it doesn't depend on Azure Automation or Azure Monitor Logs, as required by the [previous version](../../automation/automation-solution-vm-management.md). This version relies on [Azure Functions](../../azure-functions/functions-overview.md) to handle the VM start and stop execution.

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

For example, **Scheduled** HTTP trigger function is used to handle schedule and sequence scenarios. Similarly, **AutoStop** HTTP trigger function handles the auto stop scenario.

The queue-based trigger functions are required in support of this feature. All timer-based triggers are used to perform the availability test and to monitor the health of the system.

 [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) is used to configure and manage the start and stop schedules for the VM take action by calling the function using JSON payload. By default, during initial deployment it creates a total of five Logic Apps for the following scenarios:

- Scheduled - Start and stop actions are based on a schedule you specify against Azure Resource Manager and classic VMs.**ststv2_vms_Scheduled_start** and **ststv2_vms_Scheduled_stop** configure the scheduled start and stop.

- Sequenced - Start and stop actions are based on a schedule targeting VMs with pre-defined sequencing tags. Only two named tags are supported - **sequencestart** and **sequencestop**. **ststv2_vms_Sequenced_start** and **ststv2_vms_Sequenced_stop** configure the sequenced start and stop.

    > [!NOTE]
    > This scenario only supports Azure Resource Manager VMs.

- AutoStop - This functionality is only used for performing a stop action against both Azure Resource Manager and classic VMs based on its CPU utilization. It can also be a scheduled-based *take action*, which creates alerts on VMs and based on the condition, the alert is triggered to perform the stop action.**ststv2_vms_AutoStop** configures the auto stop functionality.

Each Start/Stop action supports assignment of one or more subscriptions, resource groups, or a list of VMs.

All telemetry data, that is trace logs from the function app execution, is sent to your connected Application Insights instance. You can view the telemetry data stored in Application Insights from a set of pre-defined visualizations presented in a shared [Azure dashboard](../../azure-portal/azure-portal-dashboards.md).

:::image type="content" source="media/overview/shared-dashboard-example.png" alt-text="Start/Stop VMs shared status dashboard":::

Email notifications are also sent as a result of the actions performed on the VMs.

## New releases

 When a new version of Start/Stop VMs (preview) is released, your instance is auto-updated without having to manually redeploy.

## Supported scoping options

### Subscription

Scoping to a subscription can be used when you need to perform the start and stop action on all the VMs in an entire subscription, and you can select multiple subscriptions if necessary.  

You can also specify a list of VMs to exclude and it will ignore them from the action. You can also use wildcard characters to specify all the names that simultaneously can be ignored.

### Resource group

Scoping to a resource group can be used when you need to perform the start and stop action on all the VMs by specifying one or more resource group names, and across one or more subscriptions.

You can also specify a list of VMs to exclude and it will ignore them from the action. You can also use wildcard characters to specify all the names that simultaneously can be ignored.

### VMList

Specifying a list of VMs can be used when you need to perform the start and stop action on a specific set of virtual machines, and across multiple subscriptions. This option does not support specifying a list of VMs to exclude.

## Prerequisites

- You must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

- Your account has been granted the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) permission in the subscription, and in the resource group specified to support the storage account, Application Insights instance, and Start/Stop VM resources in Azure Logic Apps and Azure Functions.

- An Azure Storage account, which is required by Functions. Start/Stop VMs also use this Storage account for two purposes:

    * Uses Azure Table Storage to store the execution operation metadata (that is, the start/stop VM action).

    * Uses Azure Queue Storage to support the Azure Functions queue-based triggers.

- Start/Stop VMs (preview) is available in all Azure global regions that are listed in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=functions) page for Azure Functions. For the Azure Government cloud, it is only available in the US Government Virginia region.

- You have an Application Insights instance.

   You can create an Application Insights instance when you enable Start/Stop VMs, or you can let the onboarding experience create a one in the specified resource group in your subscription. Application Insights supports a [workspace-based Application Insights instance](../../azure-monitor/app/create-workspace-resource.md).

## Next steps

To enable the feature on VMs in your environment, see [Enable Start/Stop VMs](enable.md) (preview).