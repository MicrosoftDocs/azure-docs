---
title: Autoscale in Azure Monitor
description: This article describes the autoscale feature in Azure Monitor and its benefits.
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.subservice: autoscale
ms.topic: conceptual
ms.date: 03/08/2023
ms.reviewer:
---

# Overview of autoscale in Azure

This article describes the autoscale feature in Azure Monitor and its benefits.

Autoscale supports many resource types. For more information about supported resources, see [Autoscale supported resources](#supported-services-for-autoscale).

> [!NOTE]
> [Availability sets](/archive/blogs/kaevans/autoscaling-azurevirtual-machines) are an older scaling feature for virtual machines with limited support. We recommend migrating to [Azure Virtual Machine Scale Sets](../../virtual-machine-scale-sets/overview.md) for faster and more reliable autoscale support.

## What is autoscale?

Autoscale is a service that you can use to automatically add and remove resources according to the load on your application.

When your application experiences higher load, autoscale adds resources to handle the increased load. When load is low, autoscale reduces the number of resources, which lowers your costs. You can scale your application based on metrics like CPU usage, queue length, and available memory. You can also scale based on a schedule. Metrics and schedules are set up in rules. The rules include a minimum level of resources that you need to run your application and a maximum level of resources that won't be exceeded.

For example, scale out your application by adding VMs when the average CPU usage per VM is above 70%. Scale it back by removing VMs when CPU usage drops to 40%.

:::image type="content" source="./media/autoscale-overview/AutoscaleConcept.png" lightbox="./media/autoscale-overview/AutoscaleConcept.png" alt-text="A diagram that shows scaling out by adding virtual machine instances.":::

When the conditions in the rules are met, one or more autoscale actions are triggered, adding or removing VMs. You can also perform other actions like sending email, notifications, or webhooks to trigger processes in other systems.

## Horizontal vs. vertical scaling

Autoscale scales in and out, or horizontally. Scaling horizontally is an increase or decrease of the number of resource instances. For example, for a virtual machine scale set, scaling out means adding more virtual machines. Scaling in means removing virtual machines. Horizontal scaling is flexible in a cloud situation because you can use it to run a large number of VMs to handle load.

In contrast, scaling up and down, or vertical scaling, keeps the same number of resource instances constant but gives them more capacity in terms of memory, CPU speed, disk space, and network. Vertical scaling is limited by the availability of larger hardware, which eventually reaches an upper limit. Hardware size availability varies in Azure by region. Vertical scaling might also require a restart of the VM during the scaling process. Autoscale does not support vertical scaling.

:::image type="content" source="./media/autoscale-overview/vertical-scaling.png" lightbox="./media/autoscale-overview/vertical-scaling.png" alt-text="A diagram that shows scaling up by adding CPU and memory to a virtual machine.":::

When the conditions in the rules are met, one or more autoscale actions are triggered, adding or removing VMs. You can also perform other actions like sending email, notifications, or webhooks to trigger processes in other systems.

### Predictive autoscale

[Predictive autoscale](./autoscale-predictive.md) uses machine learning to help manage and scale virtual machine scale sets with cyclical workload patterns. It forecasts the overall CPU load on your virtual machine scale set, based on historical CPU usage patterns. The scale set can then be scaled out in time to meet the predicted demand.

## Autoscale setup

You can set up autoscale via:

* [Azure portal](autoscale-get-started.md)
* [PowerShell](../powershell-samples.md#create-and-manage-autoscale-settings)
* [Cross-platform command-line interface (CLI)](../cli-samples.md#autoscale)
* [Azure Monitor REST API](/rest/api/monitor/autoscalesettings)

## Architecture

The following diagram shows the autoscale architecture.

 :::image type="content" source="./media/autoscale-overview/Autoscale_Overview_v4.png" lightbox="./media/autoscale-overview/Autoscale_Overview_v4.png" alt-text="Diagram that shows autoscale flow.":::

### Resource metrics

Resources generate metrics that are used in autoscale rules to trigger scale events. Virtual machine scale sets use telemetry data from Azure diagnostics agents to generate metrics. Telemetry for the Web Apps feature of Azure App Service and Azure Cloud Services comes directly from the Azure infrastructure. Some commonly used metrics include CPU usage, memory usage, thread counts, queue length, and disk usage. For a list of available metrics, see [Autoscale Common Metrics](autoscale-common-metrics.md).

### Custom metrics

Use your own custom metrics that your application generates. Configure your application to send metrics to [Application Insights](../app/app-insights-overview.md) so that you can use those metrics to decide when to scale.

### Time

Set up schedule-based rules to trigger scale events. Use schedule-based rules when you see time patterns in your load and want to scale before an anticipated change in load occurs.

### Rules

Rules define the conditions needed to trigger a scale event, the direction of the scaling, and the amount to scale by. Combine multiple rules by using different metrics like CPU usage and queue length. Define up to 10 rules per profile.

Rules can be:

* **Metric-based**: Trigger based on a metric value, for example, when CPU usage is above 50%.
* **Time-based**: Trigger based on a schedule, for example, every Saturday at 8 AM.

Autoscale scales out if *any* of the rules are met. Autoscale scales in only if *all* the rules are met.
In terms of logic operators, the OR operator is used for scaling out with multiple rules. The AND operator is used for scaling in with multiple rules.

### Actions and automation

Rules can trigger one or more actions. Actions include:

* **Scale**: Scale resources in or out.
* **Email**: Send an email to the subscription admins, co-admins, and/or any other email address.
* **Webhooks**: Call webhooks to trigger multiple complex actions inside or outside Azure. In Azure, you can:
  * Start an [Azure Automation runbook](../../automation/overview.md).
  * Call an [Azure function](../../azure-functions/functions-overview.md).
  * Trigger an [Azure logic app](../../logic-apps/logic-apps-overview.md).

## Autoscale settings

Autoscale settings contain the autoscale configuration. The setting includes scale conditions that define rules, limits, and schedules and notifications. Define one or more scale conditions in the settings and one notification setup.

Autoscale uses the following terminology and structure.

| UI               | JSON/CLI     | Description                                                                                                                                                                                                                                                                   |
|------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Scale conditions | profiles     | A collection of rules, instance limits, and schedules based on a metric or time. You can define one or more scale conditions or profiles. Define up to 20 profiles per autoscale setting.                                                                                                                                                                                            |
| Rules            | rules        | A set of conditions based on time or metrics that triggers a scale action. You can define one or more rules for both scale-in and scale-out actions. Define up to a total of 10 rules per profile.                                                                                                                                                                                                         |
| Instance limits  | capacity     | Each scale condition or profile defines the default, maximum, and minimum number of instances that can run under that profile.                                                                                                                                                                                                                                    |
| Schedule         | recurrence   | Indicates when autoscale should put this scale condition or profile into effect. You can have multiple scale conditions, which allow you to handle different and overlapping requirements. For example, you can have different scale conditions for different times of day or days of the week. |
| Notify           | notification | Defines the notifications to send when an autoscale event occurs. Autoscale can notify one or more email addresses or make a call by using one or more webhooks. You can configure multiple webhooks in the JSON but only one in the UI.                               |

:::image type="content" source="./media/autoscale-overview/azure-resource-manager-rule-structure-3.png" lightbox="./media/autoscale-overview/azure-resource-manager-rule-structure-3.png" alt-text="Diagram that shows Azure autoscale setting, profile, and rule structure.":::

The full list of configurable fields and descriptions is available in the [Autoscale REST API](/rest/api/monitor/autoscalesettings).

For code examples, see:

* [Tutorial: Automatically scale a virtual machine scale set with the Azure CLI](../../virtual-machine-scale-sets/tutorial-autoscale-cli.md)
* [Tutorial: Automatically scale a virtual machine scale set with an Azure template](../../virtual-machine-scale-sets/tutorial-autoscale-powershell.md)

## Supported services for autoscale

Autoscale supports the following services.

| Service                                           | Schema and documentation                                                                                                                           |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Azure Virtual Machines Scale Sets                 | [Overview of autoscale with Azure Virtual Machine Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview.md) |
| Web Apps feature of Azure App Service                                         | [Scaling Web Apps](autoscale-get-started.md)                                                                                                     |
| Azure API Management service                      | [Automatically scale an Azure API Management instance](../../api-management/api-management-howto-autoscale.md)                                   |
| Azure Data Explorer clusters                      | [Manage Azure Data Explorer clusters scaling to accommodate changing demand](/azure/data-explorer/manage-cluster-horizontal-scaling)             |
| Azure Stream Analytics                            | [Autoscale streaming units (preview)](../../stream-analytics/stream-analytics-autoscale.md)                                                      |
| Azure SignalR Service (Premium tier)              | [Automatically scale units of an Azure SignalR service](../../azure-signalr/signalr-howto-scale-autoscale.md)                                                      |
| Azure Machine Learning workspace                  | [Autoscale an online endpoint](../../machine-learning/how-to-autoscale-endpoints.md)                                                             |
| Azure Spring Apps                                 | [Set up autoscale for applications](../../spring-apps/how-to-setup-autoscale.md)                                                                 |
| Azure Media Services                                    | [Autoscaling in Media Services](/azure/media-services/latest/release-notes#autoscaling)                                                          |
| Azure Service Bus                                       | [Automatically update messaging units of an Azure Service Bus namespace](../../service-bus-messaging/automate-update-messaging-units.md)         |
| Azure Logic Apps - Integration service environment (ISE) | [Add ISE capacity](../../logic-apps/ise-manage-integration-service-environment.md#add-ise-capacity)                                              |

## Next steps

To learn more about autoscale, see the following resources:

* [Azure Monitor autoscale common metrics](autoscale-common-metrics.md)
* [Use autoscale actions to send email and webhook alert notifications](autoscale-webhook-email.md)
* [Tutorial: Automatically scale a virtual machine scale set with the Azure CLI](../../virtual-machine-scale-sets/tutorial-autoscale-cli.md)
* [Tutorial: Automatically scale a virtual machine scale set with Azure PowerShell](../../virtual-machine-scale-sets/tutorial-autoscale-powershell.md)
* [Autoscale CLI reference](/cli/azure/monitor/autoscale)
* [ARM template resource definition](/azure/templates/microsoft.insights/autoscalesettings)
* [PowerShell Az.Monitor reference](/powershell/module/az.monitor/#monitor)
* [REST API reference: Autoscale settings](/rest/api/monitor/autoscale-settings)