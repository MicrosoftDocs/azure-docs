---
title: Project Flash - Advancing Azure Virtual Machine availability monitoring
description: This article covers important concepts for monitoring Azure virtual machine availability using the features of Project Flash.
ms.service: virtual-machines
ms.author: tomcassidy
author: tomvcassidy
ms.custom: subject-monitoring
ms.date: 01/31/2024
ms.topic: conceptual
---

# Project Flash - Advancing Azure Virtual Machine availability monitoring

Flash, as the project is internally known, derives its name from our steadfast commitment to building a robust, reliable, and rapid mechanism for customers to monitor virtual machine (VM) health. Our primary objective is to ensure customers can reliably access actionable and precise telemetry, promptly receive alerts on changes, and periodically monitor data at scale. We also place strong emphasis on developing a centralized and coherent experience that customers can conveniently use to meet their unique observability requirements. It's our mission to ensure you can:

- **Consume accurate and actionable data** on VM availability disruptions (for example, VM reboots and restarts, application freezes due to network driver updates, and 30-second host OS updates), along with precise failure details (for example, platform versus user-initiated, reboot versus freeze, planned versus unplanned).
- **Analyze and alert on trends in VM availability** for quick debugging and month-over-month reporting.
- **Periodically monitor data at scale** and build custom dashboards to stay updated on the latest availability states of all resources.
- **Receive automated root cause analyses (RCAs)** detailing impacted VMs, downtime cause and duration, consequent fixes, and similar—all to enable targeted investigations and post-mortem analyses.
- **Receive instantaneous notifications** on critical changes in VM availability to quickly trigger remediation actions and prevent end-user impact.
- **Dynamically tailor and automate platform recovery policies** , based on ever-changing workload sensitivities and failover needs.

## Flash solutions

The Flash initiative is dedicated to developing solutions over the years that cater to the diverse monitoring needs of our customers. To help you determine the most suitable Flash monitoring solution(s) for your specific requirements, refer to the following table:

| **Solution** | **Description** |
| --- | --- |
| Azure Resource Graph (General Availability) | For investigations at scale, centralized resource repository and history lookup, large customers want to periodically consume resource availability telemetry across all their workloads, at once, using Azure Resource Graph (ARG). |
| Event Grid system topic (Public Preview) | To trigger time-sensitive and critical mitigations (redeploy, restart VM actions) for prevention of end-user impact, customers (for example, Pearl Abyss, Krafton) want to receive alerts within seconds of critical changes in resource availability via Event Handlers in Event Grid. |
| Azure Monitor (Public Preview) | To track trends, aggregate platform metrics (CPU, disk etc.), and set up precise threshold-based alerts, customers want to consume an out-of-box VM Availability metric via Azure Monitor. |
| Resource Health (General Availability) | To perform instantaneous and convenient Portal UI health checks per-resource customers can quickly view the RHC blade on the portal. They can also access a 30-day historical view of health checks for that resource for quick and easy troubleshooting. |

## Holistic VM availability monitoring

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