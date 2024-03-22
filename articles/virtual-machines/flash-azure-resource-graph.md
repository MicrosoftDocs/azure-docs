---
title: Project Flash - Use Azure Resource Graph to monitor Azure Virtual Machine availability
description: This article covers important concepts for monitoring Azure virtual machine availability using Azure Resource Graph.
ms.service: virtual-machines
ms.author: tomcassidy
author: tomvcassidy
ms.custom: subject-monitoring
ms.date: 01/31/2024
ms.topic: conceptual
---

# Project Flash - Use Azure Resource Graph to monitor Azure Virtual Machine availability

Azure Resource Graph is one solution offered by Flash. Flash is the internal name for a project dedicated to building a robust, reliable, and rapid mechanism for customers to monitor virtual machine (VM) health.

This article covers the use of Azure Resource Graph to monitor Azure Virtual Machine availability. For a general overview of Flash solutions, see the [Flash overview](flash-overview.md).

For documentation specific to the other solutions offered by Flash, choose from the following articles:
* [Use Event Grid system topics to monitor Azure Virtual Machine availability](flash-event-grid-system-topic.md)
* [Use Azure Monitor to monitor Azure Virtual Machine availability](flash-azure-monitor.md)
* [Use Azure Resource Health to monitor Azure Virtual Machine availability](flash-azure-resource-health.md)

## Azure Resource Graph - HealthResources

This feature is currently generally available. It's useful for conducting large-scale investigations. It offers a highly user-friendly experience for [information retrieval](../governance/resource-graph/samples/samples-by-table.md) with its use of [kusto query language](../governance/resource-graph/concepts/query-language.md) (KQL). It can also serve as a central hub for resource information and allows easy retrieval of historical data.

In addition to already flowing [VM availability states](../service-health/resource-health-overview.md#health-status), we published [VM availability annotations](../service-health/resource-health-vm-annotation.md) to [Azure Resource Graph](../governance/resource-graph/overview.md) (ARG) for detailed failure attribution and downtime analysis, along with enabling a 14-day [change tracking](../governance/resource-graph/how-to/get-resource-changes.md?tabs=azure-cli) mechanism to trace historical changes in VM availability for quick debugging. With these new additions, we're excited to announce the general availability of VM availability information in the HealthResources dataset in ARG! With this offering users can:

- Efficiently query the latest snapshot of VM availability across all Azure subscriptions at once and at low latencies for periodic and fleetwide monitoring.
- Accurately assess the impact to fleetwide business SLAs and quickly trigger decisive mitigation actions, in response to disruptions and type of failure signature.
- Set up custom dashboards to supervise the comprehensive health of applications by [joining VM availability information](../governance/resource-graph/concepts/work-with-data.md) with [resource metadata present in ARG](../governance/resource-graph/samples/samples-by-table.md?tabs=azure-cli).
- Track relevant changes in VM availability across a rolling 14-day window, by using the [change-tracking mechanism](../governance/resource-graph/how-to/get-resource-changes.md?tabs=azure-cli) for conducting detailed investigations.

### Sample queries

- [Azure Resource Graph sample queries for Azure Service Health - Azure Service Health | Microsoft Learn](../service-health/resource-graph-samples.md#resource-health)
- [VM availability information in Azure Resource Graph - Azure Virtual Machines | Microsoft Learn](resource-graph-availability.md)
- [List of sample Azure Resource Graph queries by table - Azure Resource Graph | Microsoft Learn](../governance/resource-graph/samples/samples-by-table.md?tabs=azure-cli#healthresources)

### Get started

Users can query ARG via [PowerShell](../governance/resource-graph/first-query-powershell.md), [REST API](../governance/resource-graph/first-query-rest-api.md), [Azure CLI](../governance/resource-graph/first-query-azurecli.md), or even the [Azure portal](https://portal.azure.com/). The following steps detail how data can be accessed from Azure portal.

1. Once on the Azure portal, navigate to Resource Graph Explorer.

   :::image type="content" source="media/flash/resource-graph-explorer-landing-page.png" alt-text="Screenshot of the Azure Resource Graph Explorer landing page on the Azure portal." lightbox="media/flash/resource-graph-explorer-landing-page.png" :::

1. Select the Table tab and (single) click on the HealthResources table to retrieve the latest snapshot of VM availability information (availability state and health annotations).

   :::image type="content" source="media/flash/health-resources-table.png" alt-text="Screenshot of an Azure Resource Graph Explorer Window depicting the latest VM availability states and VM availability annotations in the Health Resources table." lightbox="media/flash/health-resources-table.png" :::

There are two types of events populated in the HealthResources table:

   :::image type="content" source="media/flash/health-resources-table-events.png" alt-text="Snapshot of the type of events in the Health Resources table, as shown in Resource Graph Explorer on the Azure portal." lightbox="media/flash/health-resources-table-events.png" :::

- resourcehealth/availabilitystatuses

This event denotes the latest availability status of a VM, based on the health checks performed by the underlying Azure platform. The availability states we currently emit for VMs are:

- Available: The VM is up and running as expected.
- Unavailable: We detected disruptions to the normal functioning of the VM, and therefore, applications won't run as expected.
- Unknown: The platform is unable to accurately detect the health of the VM. Users can usually check back in a few minutes for an updated state.

To poll the latest VM availability state, refer to the properties field, which contains the following details:

### Sample
```
{
 "targetResourceType": "Microsoft.Compute/virtualMachines",
 "previousAvailabilityState": "Available",
 "targetResourceId": "/subscriptions//resourceGroups//providers/Microsoft.Compute/virtualMachines/",
 "occurredTime": "2022-10-11T11:13:59.9570000Z",
 "availabilityState": "Unavailable"
 }
```

### Property description

| **Property** | **Description** | **[Corresponding resource health category (RHC)](../azure-monitor/essentials/activity-log-schema.md#resource-health-category)** |
| - | - | - |
| targetResourceType | Type of resource for which health data is flowing | resourceType |
| targetResourceId | Resource ID | resourceId |
| occurredTime | Timestamp when the platform emits the latest availability state | eventTimestamp |
| previousAvailabilityState | Previous availability state of the VM | previousHealthStatus |
| availabilityState | Current availability state of the VM | currentHealthStatus |

See the [HealthResources section of the samples queries documentation](../governance/resource-graph/samples/samples-by-table.md?tabs=azure-cli#healthresources) for a list of starter queries to further explore this data.

- resourcehealth/resourceannotations (NEWLY ADDED)

This event contextualizes any changes to VM availability, by detailing necessary failure attributes to help users investigate and mitigate the disruption as needed. [See the full list of VM availability annotations](../service-health/resource-health-vm-annotation.md) emitted by the platform.
 These annotations can be broadly classified into three buckets:

- Downtime Annotations: These annotations are emitted when the platform detects VM availability transitioning to Unavailable. (For example, during unexpected host crashes, rebootful repair operations).
- Informational Annotations: These annotations are emitted during control plane activities with no impact to VM availability. (Such as VM allocation/Stop/Delete/Start). Usually, no further customer action is required in response.
- Degraded Annotations: These annotations are emitted when VM availability is detected to be at risk. (For example, when [failure prediction models](https://azure.microsoft.com/blog/advancing-failure-prediction-and-mitigation-introducing-narya) predict a degraded hardware component that can cause the VM to reboot at any given time). We strongly urge users to redeploy by the deadline specified in the annotation message, to avoid any unanticipated loss of data or downtime. You may receive an alert in Azure virtual machine scale sets Resource Health or Activity log in one of the following scenarios:
   - VMs in the Azure virtual machine scale sets are in the process of being stopped, deallocated, deleted, or started.
   - You performed scaling in or out operations on the virtual machine scale sets.
   - The alert indicates that the aggregated platform health of [the virtual machine scale sets is in a transient state of "Degraded."](/troubleshoot/azure/virtual-machine-scale-sets/resource-health-degraded-state)

To poll the associated VM availability annotations for a resource, if any, refer to the properties field, which contains the following details:

### Sample
```
{
 "targetResourceType": "Microsoft.Compute/virtualMachines", "targetResourceId": "/subscriptions//resourceGroups//providers/Microsoft.Compute/virtualMachines/",
 "annotationName": "VirtualMachineHostRebootedForRepair",
 "occurredTime": "2022-09-25T20:21:37.5280000Z",
 "category": "Unplanned",
 "summary": "We're sorry, your virtual machine isn't available because an unexpected failure on the host server. Azure has begun the auto-recovery process and is currently rebooting the host server. No further action is required from you at this time. The virtual machine will be back online after the reboot completes.",
 "context": "Platform Initiated",
 "reason": "Unexpected host failure"
 }
```

### Property description

| **Property** | **Description** | **[Corresponding RHC](../azure-monitor/essentials/activity-log-schema.md#resource-health-category)** |
| - | - | - |
| targetResourceType | Type of resource for which health data is flowing | resourceType |
| targetResourceId | Resource ID | resourceId |
| occurredTime | Timestamp when the latest availability state is emitted by the platform | eventTimestamp |
| annotationName | Name of the Annotation emitted | eventName |
| reason | Brief overview of the availability impact observed by the customer | title |
| category | Denotes whether the platform activity that triggered the annotation was either planned maintenance or unplanned repair. This field isn't applicable to customer/VM-initiated events. Possible values: Planned, Unplanned, Not Applicable, Null | category |
| context | Denotes whether the activity that triggered the annotation was due to an authorized user or process (customer-initiated), the Azure platform (platform-initiated), or activity in the guest OS that resulted in availability impact (VM initiated). Possible values: Platform-initiated, User-initiated, VM-initiated, Not Applicable, Null | context |
| summary | Statement detailing the cause for annotation emission, along with remediation steps that users can take | summary |

See the [HealthResources section of the samples queries documentation](../governance/resource-graph/samples/samples-by-table.md?tabs=azure-cli#healthresources) for a list of starter queries to further explore this data.

We have multiple enhancements planned for the annotation metadata that is surfaced in the HealthResources dataset. These enrichments give users access to richer failure attributes to decisively prepare a response to a disruption. In parallel, we aim to extend the duration of historical lookback to a minimum of 30 days so users can comprehensively track past changes in VM availability.

## Next steps

To learn more about the solutions offered, proceed to corresponding solution article:
* [Use Event Grid system topics to monitor Azure Virtual Machine availability](flash-event-grid-system-topic.md)
* [Use Azure Monitor to monitor Azure Virtual Machine availability](flash-azure-monitor.md)
* [Use Azure Resource Health to monitor Azure Virtual Machine availability](flash-azure-resource-health.md)

For a general overview of how to monitor Azure Virtual Machines, see [Monitor Azure virtual machines](monitor-vm.md) and the [Monitoring Azure virtual machines reference](monitor-vm-reference.md).