---
title: Autoscale in Microsoft Azure
description: "Autoscale in Microsoft Azure"
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.subservice: autoscale
ms.topic: conceptual
ms.date: 08/01/2022
ms.reviewer: 

---

# Overview of autoscale in Microsoft Azure

This article describes Microsoft Azure autoscale and its benefits.

Azure autoscale supports many resource types. For more information about supported resources, see [autoscale supported resources](#supported-services-for-autoscale).

> [!NOTE]
> [Availability sets](/archive/blogs/kaevans/autoscaling-azurevirtual-machines) are an older scaling feature for virtual machines with limited support. We recommend migrating to [virtual machine scale sets](../../virtual-machine-scale-sets/overview.md) for faster and more reliable autoscale support.

## What is autoscale

Autoscale is a service that allows you to automatically add and remove resources according to the load on your application.

When your application experiences higher load, autoscale adds resources to handle the increased load. When load is low, autoscale reduces the number of resources, lowering your costs. You can scale your application based on metrics like CPU usage, queue length, and available memory, or based on a schedule. Metrics and schedules are set up in rules. The rules include a minimum level of resources that you need to run your application, and a maximum level of resources that won't be exceeded.

For example, scale out your application by adding VMs when the average CPU usage per VM is above 70%. Scale it back in removing VMs when CPU usage drops to 40%.

:::image type="content" source="./media/autoscale-overview/AutoscaleConcept.png" alt-text="A diagram that shows scaling out by adding virtual machine instances.":::

When the conditions in the rules are met, one or more autoscale actions are triggered, adding or removing VMs. In addition, you can perform other actions like sending email  notifications, or webhooks to trigger processes in other systems.

## Scaling out and scaling up

Autoscale scales in and out, which is an increase, or decrease of the number of resource instances. Scaling in and out is also called horizontal scaling. For example, for a virtual machine scale set, scaling out means adding more virtual machines. Scaling in means removing virtual machines. Horizontal scaling is flexible in a cloud situation as it allows you to run a large number of VMs to handle load.

In contrast, scaling up and down, or vertical scaling, keeps the number of resources constant, but gives those resources more capacity in terms of memory, CPU speed, disk space and network. Vertical scaling is limited by the availability of larger hardware, which eventually reaches an upper limit. Hardware size availability varies in Azure by region. Vertical scaling may also require a restart of the virtual machine during the scaling process.

:::image type="content" source="./media/autoscale-overview/vertical-scaling.png" alt-text="A diagram that shows scaling up by adding CPU and memory to a virtual machine.":::

When the conditions in the rules are met, one or more autoscale actions are triggered, adding or removing VMs. In addition, you can perform other actions like sending email  notifications, or webhooks to trigger processes in other systems.

### Predictive autoscale (preview)

[Predictive autoscale](./autoscale-predictive.md) uses machine learning to help manage and scale Azure virtual machine scale sets with cyclical workload patterns. It forecasts the overall CPU load on your virtual machine scale set, based on historical CPU usage patterns. The scale set can then be scaled out in time to meet the predicted demand.

## Autoscale setup

You can set up autoscale via:

* [Azure portal](autoscale-get-started.md)
* [PowerShell](../powershell-samples.md#create-and-manage-autoscale-settings)
* [Cross-platform Command Line Interface (CLI)](../cli-samples.md#autoscale)
* [Azure Monitor REST API](/rest/api/monitor/autoscalesettings)

## Architecture

The following diagram shows the autoscale architecture.  

 ![Autoscale Flow Diagram](./media/autoscale-overview/Autoscale_Overview_v4.png)

### Resource metrics

Resources generate metrics that are used in autoscale rules to trigger scale events. Virtual machine scale sets use telemetry data from Azure diagnostics agents to generate metrics. Telemetry for Web apps and Cloud services comes directly from the Azure Infrastructure. Some commonly used metrics include CPU usage, memory usage, thread counts, queue length, and disk usage. See [Autoscale Common Metrics](autoscale-common-metrics.md) for a list of available metrics.

### Custom metrics

Use your own custom metrics that your application generates. Configure your application to send metrics to [Application Insights](../app/app-insights-overview.md) so you can use those metrics decide when to scale.

### Time

Set up schedule-based rules to trigger scale events. Use schedule-based rules when you see time patterns in your load, and want to scale before an anticipated change in load occurs.

### Rules

Rules define the conditions needed to trigger a scale event, the direction of the scaling, and the amount to scale by. Rules can be:

* Metric-based  
Trigger based on a metric value, for example when CPU usage is above 50%.
* Time-based  
Trigger based on a schedule, for example, every Saturday at 8am. 

You can combine multiple rules using different metrics, for example CPU usage and queue length.  
Autoscale scales out if *any* of the rules are met, whereas autoscale scales in only if *all* the rules are met.
In terms of logic operators, the OR operator is used when scaling out with multiple rules. The AND operator is used when scaling in with multiple rules.

### Actions and automation

Rules can trigger one or more actions. Actions include:

* Scale - Scale resources in or out.
* Email - Send an email to the subscription admins, co-admins, and/or any other email address.
* Webhooks - Call webhooks to trigger multiple complex actions inside or outside Azure. In Azure, you can:
  * Start an [Azure Automation runbook](../../automation/overview.md).
  * Call an [Azure Function](../../azure-functions/functions-overview.md).
  * Trigger an [Azure Logic App](../../logic-apps/logic-apps-overview.md).

## Autoscale settings

Autoscale settings contain the autoscale configuration. The setting including scale conditions that define rules, limits, and schedules and notifications. Define one or more scale conditions in the settings, and one notification setup.

Autoscale uses the following terminology and structure. The UI and JSON

| UI               | JSON/CLI     | Description                                                                                                                                                                                                                                                                   |
|------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Scale conditions | profiles     | A collection of rules, instance limits and schedules, based on a metric or time. You can define one or more scale conditions or profiles.                                                                                                                                                                                             |
| Rules            | rules        | A set of time or metric-based conditions that trigger a scale action. You can define one or more rules for both scale-in and scale-out actions.                                                                                                                                                                                                         |
| Instance limits  | capacity     | Each scale condition or profile defines th default, max, and min number of instances that can run under that profile.                                                                                                                                                                                                                                    |
| Schedule         | recurrence   | Indicates when autoscale should put this scale condition or profile into effect. You can have multiple scale conditions, which allow you to handle different and overlapping requirements. For example, you can have different scale conditions for different times of day, or days of the week. |
| Notify           | notification | Defines the notifications to send when an autoscale event occurs. Autoscale can notify one or more email addresses or make a call one or more webhooks. You can configure multiple webhooks in the JSON but only one in the UI.                                 |

![Azure autoscale setting, profile, and rule structure](./media/autoscale-overview/azure-resource-manager-rule-structure-3.png)

The full list of configurable fields and descriptions is available in the [Autoscale REST API](/rest/api/monitor/autoscalesettings).

For code examples, see

* [Tutorial: Automatically scale a virtual machine scale set with an Azure template](https://learn.microsoft.com/azure/virtual-machine-scale-sets/tutorial-autoscale-template)
* [Tutorial: Automatically scale a virtual machine scale set with the Azure CLI](https://learn.microsoft.com/azure/virtual-machine-scale-sets/tutorial-autoscale-cli)
* [Tutorial: Automatically scale a virtual machine scale set with an Azure template](https://learn.microsoft.com/azure/virtual-machine-scale-sets/tutorial-autoscale-powershell)
## Horizontal vs vertical scaling

Autoscale scales horizontally, which is an increase, or decrease of the number of resource instances. For example, in a virtual machine scale set, scaling out means adding more virtual machines Scaling in means removing virtual machines. Horizontal scaling is flexible in a cloud situation as it allows you to run a large number of VMs to handle load.

In contrast, vertical scaling, keeps the same number of resources constant, but gives them more capacity in terms of memory, CPU speed, disk space and network. Adding or removing capacity in vertical scaling is known as scaling or down. Vertical scaling is limited by the availability of larger hardware, which eventually reaches an upper limit. Hardware size availability varies in Azure by region. Vertical scaling may also require a restart of the virtual machine during the scaling process.

## Supported services for autoscale

The following services are supported by autoscale:

| Service | Schema & Documentation |
| --- | --- |
| Azure Virtual machines scale sets |[Overview of autoscale with Azure virtual machine scale sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md) |
| Web apps |[Scaling Web Apps](autoscale-get-started.md) |
| Azure API Management service|[Automatically scale an Azure API Management instance](../../api-management/api-management-howto-autoscale.md)
| Azure Data Explorer Clusters|[Manage Azure Data Explorer clusters scaling to accommodate changing demand](/azure/data-explorer/manage-cluster-horizontal-scaling)|
| Azure Stream Analytics | [Autoscale streaming units (Preview)](../../stream-analytics/stream-analytics-autoscale.md) |
| Azure Machine Learning Workspace | [Autoscale an online endpoint](../../machine-learning/how-to-autoscale-endpoints.md) |

## Next steps

To learn more about autoscale, see the following resources:

* [Azure Monitor autoscale common metrics](autoscale-common-metrics.md)
* [Use autoscale actions to send email and webhook alert notifications](autoscale-webhook-email.md)
* [Tutorial: Automatically scale a virtual machine scale set with an Azure template](https://learn.microsoft.com/azure/virtual-machine-scale-sets/tutorial-autoscale-template)
* [Tutorial: Automatically scale a virtual machine scale set with the Azure CLI](https://learn.microsoft.com/azure/virtual-machine-scale-sets/tutorial-autoscale-cli)
* [Tutorial: Automatically scale a virtual machine scale set with an Azure template](https://learn.microsoft.com/azure/virtual-machine-scale-sets/tutorial-autoscale-powershell)
* [Autoscale CLI reference](https://learn.microsoft.com/cli/azure/monitor/autoscale?view=azure-cli-latest)
* [ARM template resource definition](https://learn.microsoft.com/azure/templates/microsoft.insights/autoscalesettings)
* [PowerShell Az.Monitor Reference](https://learn.microsoft.com/powershell/module/az.monitor/#monitor)
* [REST API reference. Autoscale Settings](https://learn.microsoft.com/rest/api/monitor/autoscale-settings).