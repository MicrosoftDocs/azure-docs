---
title: Project Flash - Use Azure Event Grid to monitor Azure Virtual Machine availability
description: This article covers important concepts for monitoring Azure virtual machine availability using Azure Event Grid system topics.
ms.service: virtual-machines
ms.author: tomcassidy
author: tomvcassidy
ms.custom: subject-monitoring
ms.date: 01/31/2024
ms.topic: conceptual
---

# Project Flash - Use Azure Event Grid to monitor Azure Virtual Machine availability

Azure Event Grid is one solution offered by Flash. Flash is the internal name for a project dedicated to building a robust, reliable, and rapid mechanism for customers to monitor virtual machine (VM) health.

This article covers the use of Azure Event Grid system topics to monitor Azure Virtual Machine availability. For a general overview of Flash solutions, see the [Flash overview](flash-overview.md).

For documentation specific to the other solutions offered by Flash, choose from the following articles:
* [Use Azure Monitor to monitor Azure Virtual Machine availability](flash-azure-monitor.md)
* [Use Azure Resource Health to monitor Azure Virtual Machine availability](flash-azure-resource-health.md)
* [Use Azure Resource Graph to monitor Azure Virtual Machine availability](flash-azure-resource-graph.md)

## Azure Event Grid system topic - HealthResources

To ensure seamless operation of business-critical applications, it's crucial to have real time awareness of any event that might adversely impact VM availability. This awareness enables you to swiftly take remedial actions to shield end-users from any disruption. To support you in your daily operations, we're delighted to announce the public preview of the [HealthResources Event Grid system topic](../event-grid/event-schema-health-resources.md?tabs=event-grid-event-schema) with newly added [VM availability annotations](../service-health/resource-health-vm-annotation.md)!

This system topic provides in-depth VM [health data](../event-grid/event-schema-health-resources.md?tabs=event-grid-event-schema#event-types), giving you immediate insights into changes in VM availability states along with the necessary context. You can receive events on single-instance VMs and [Virtual Machine Scale Set](../virtual-machine-scale-sets/overview.md) VMs for the Azure subscription for which this topic was created. Data is published to this topic by [Azure Resource Notifications](../event-grid/event-schema-resource-notifications.md) (ARN), our state-of-the-art publisher-subscriber service, equipped with robust Role-Based Access Control (RBAC) and advanced filtering capabilities. This empowers you to effortlessly subscribe to an Event Grid system topic and seamlessly direct relevant events utilizing the [advanced filtering](../event-grid/event-filtering.md) capabilities provided by Event Grid, to downstream tools in real-time. This enables you to respond and mitigate issues instantly.

### Get started

- Step 1: Users start by [creating a system](../event-grid/create-view-manage-system-topics.md#create-a-system-topic)topic within the Azure subscription for which they want to receive notifications.
- Step 2: Users then proceed to [create an event subscription](../event-grid/subscribe-through-portal.md#create-event-subscriptions) within the system topic in Step 1. During this step, they specify the [endpoint](../event-grid/event-handlers.md) (such as, Event Hubs) to which the events are routed. Users can also configure event filters to narrow down the scope of delivered events.

As you start subscribing to events from the HealthResources system topic, consider the following best practices:

- Choose an appropriate [destination or event handler](../event-grid/event-handlers.md) based on the anticipated scale and size of events.
- For fan-in scenarios where notifications from multiple system topics need to be consolidated, [event hubs](../event-grid/handler-event-hubs.md) are highly recommended as a destination. This practice is especially useful for real-time processing scenarios to maintain data freshness and for periodic processing for analytics, with configurable retention periods.

We have plans to transition the preview into a fully fledged general availability feature. As part of the preview, we emit events scoped to changes in VM availability states with the following sample [schema](../event-grid/event-schema.md):

### Sample
```
{
 "id": "4c70abbc-4aeb-4cac-b0eb-ccf06c7cd102",
 "topic": "/subscriptions/,
 "subject": "/subscriptions//resourceGroups//providers/Microsoft.Compute/virtualMachines//providers/Microsoft.ResourceHealth/AvailabilityStatuses/current",
 "data": {
 "resourceInfo": {
 "id":"/subscriptions//resourceGroups//providers/Microsoft.Compute/virtualMachines//providers/Microsoft.ResourceHealth/AvailabilityStatuses/current",
 "properties": {
 "targetResourceId":"/subscriptions//resourceGroups//providers/Microsoft.Compute/virtualMachines/"
 "targetResourceType": "Microsoft.Compute/virtualMachines",
 "occurredTime": "2022-09-25T20:21:37.5280000Z"
 "previousAvailabilityState": "Available",
 "availabilityState": "Unavailable"
 }
 },
 "apiVersion": "2020-09-01"
 },
 "eventType": "Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusesChanged",
 "dataVersion": "1",
 "metadataVersion": "1",
 "eventTime": "2022-09-25T20:21:37.5280000Z"
 }
```

The properties field is fully consistent with the `microsoft.resourcehealth/availabilitystatuses` event in ARG. The Event Grid solution offers near-real-time alerting capabilities on the data present in ARG.

## Next steps

To learn more about the solutions offered, proceed to corresponding solution article:
* [Use Azure Monitor to monitor Azure Virtual Machine availability](flash-azure-monitor.md)
* [Use Azure Resource Health to monitor Azure Virtual Machine availability](flash-azure-resource-health.md)
* [Use Azure Resource Graph to monitor Azure Virtual Machine availability](flash-azure-resource-graph.md)

For a general overview of how to monitor Azure Virtual Machines, see [Monitor Azure virtual machines](monitor-vm.md) and the [Monitoring Azure virtual machines reference](monitor-vm-reference.md).