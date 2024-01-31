---
title: Project Flash - Facilitate holistic Azure Virtual Machine availability monitoring
description: This article covers important concepts for facilitating holistic monitoring of Azure virtual machine availability using the features of Project Flash.
ms.service: virtual-machines
ms.author: tomcassidy
author: tomvcassidy
ms.custom: subject-monitoring
ms.date: 01/31/2024
ms.topic: conceptual
---

# Project Flash - Facilitate holistic Azure Virtual Machine availability monitoring

Flash is the internal name for a project dedicated to building a robust, reliable, and rapid mechanism for customers to monitor virtual machine (VM) health.

This article covers how to facilitate the holistic monitoring of Azure Virtual Machine availability. For a general overview of Flash solutions, see the [Flash overview](flash-overview.md).

For documentation specific to the other solutions offered by Flash, choose from the following articles:
* [Use Azure Resource Graph to monitor Azure Virtual Machine availability](flash-azure-resource-graph.md)
* [Use Event Grid system topics to monitor Azure Virtual Machine availability](flash-event-grid-system-topic.md)
* [Use Azure Monitor to monitor Azure Virtual Machine availability](flash-azure-monitor.md)
* [Use Azure Resource Health to monitor Azure Virtual Machine availability](flash-azure-resource-health.md)

### Facilitating holistic VM availability monitoring

For a holistic approach to monitoring VM availability, including scenarios of routine maintenance, live migration, service healing, and VM degradation, we recommend you utilize both [scheduled events](../virtual-machines/windows/scheduled-event-service.md) (SE) and Flash health events.

Scheduled events are designed to offer an early warning, giving up to 15-minute advance notice prior to maintenance activities. This lead time enables you to make informed decisions regarding upcoming downtime, allowing you to either avoid or prepare for it. You have the flexibility to either acknowledge these events or delay actions during this 15-minute period, depending on your readiness for the upcoming maintenance.

On the other hand, Flash Health events are focused on real-time tracking of ongoing and completed availability disruptions, including VM degradation. This feature empowers you to effectively monitor and manage downtime, supporting automated mitigation, investigations, and post-mortem analysis.

To get started on your observability journey, you can explore the suite of Azure products to which we emit high-quality VM availability data. These products include [resource health](../service-health/resource-health-overview.md), [activity logs](../azure-monitor/essentials/activity-log.md?tabs=powershell), [Azure resource graph](../governance/resource-graph/samples/samples-by-table.md?tabs=azure-cli#healthresources), [Azure monitor metrics](../virtual-machines/monitor-vm-reference.md) and [Azure Event Grid system topic](../event-grid/event-schema-health-resources.md?tabs=event-grid-event-schema).

## Next steps

To learn more about the solutions offered, proceed to corresponding solution article:
* [Use Azure Resource Graph to monitor Azure Virtual Machine availability](flash-azure-resource-graph.md)
* [Use Event Grid system topics to monitor Azure Virtual Machine availability](flash-event-grid-system-topic.md)
* [Use Azure Monitor to monitor Azure Virtual Machine availability](flash-azure-monitor.md)
* [Use Azure Resource Health to monitor Azure Virtual Machine availability](flash-azure-resource-health.md)

For a general overview of how to monitor Azure Virtual Machines, see [Monitor Azure virtual machines](monitor-vm.md) and the [Monitoring Azure virtual machines reference](monitor-vm-reference.md).