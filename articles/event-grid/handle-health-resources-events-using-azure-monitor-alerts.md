---
title: Handle Health Resources events using Azure Monitor alerts
description: This article describes how to handle Health Resources events using Azure Monitor alerts.
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 05/21/2024
author: robece
ms.author: robece
---

# Subscribe to Health Resources events and send them to Azure monitor alerts (Preview)

[Health Resources system topic](event-schema-health-resources.md) in Azure Event Grid provides accurate, reliable, and comprehensive information on health of your Azure resources such as single instance virtual machines (VMs), Virtual Machine Scale Set VMS, and Virtual Machine Scale Sets. This feature enables a deeper understanding of the diverse service issues impacting your resources. You can now set up Azure Monitor alerts to notify you when your workload is impacted.

## Prerequisites

- Create a Health Resources system topic by following instructions from [Subscribe to Azure Resource Notifications - Health Resources events](subscribe-to-resource-notifications-health-resources-events.md). 
- Learn about the event types supported by the system topic and their properties by reading through the [Health Resources events in Azure Event Grid](event-schema-health-resources.md#event-types) article.
    - [Properties for the AvailabilityStatusChanged event](event-schema-health-resources.md#properties-for-the-availabilitystatuschanged-event)
    - [Properties for the ResourceAnnotated event](event-schema-health-resources.md#properties-for-the-resourceannotated-event)
- To learn about Azure Monitor alerts, see [How to send events to Azure monitor alerts](handler-azure-monitor-alerts.md).

## Create and configure the event subscription

1. Navigate to the Event Grid system topic you created as part of the prerequisites. 
1. Select **+ Event Subscription** on the command bar. 

    :::image type="content" source="./media/handle-health-resources-events-using-azure-monitor-alerts/create-event-subscription-button.png" alt-text="Screenshot that shows the System Topic page with Create Subscription button selected.":::
1. Enter a **name** for event subscription.
1. For **Event Schema**, select the event schema as **Cloud Events Schema v1.0**. It's the only schema type that the Azure Monitor alerts destination supports.
1. Select the **Topic Type** to `microsoft resourcenotifications healthresources`.
1. For **Event Types**, select the event types that you're interested in. In this case, select the two event types offered for consumption: `AvailabilityStatusChanged` and `ResourceAnnotated`.
1. For **Endpoint Type**, select **Azure Monitor Alert** as a destination.
1. Select **Configure an endpoint** link.
1. On the **Select Monitor Alert Configuration** page, follow these steps.
    1. Select the alert **severity**.
    1. [Optional] Select the **action group**. See [Create an action group in the Azure portal](../azure-monitor/alerts/action-groups.md).
    1. Enter a **description** for the alert.
    1. Select **Confirm Selection**.    
1. Now, on the **Create Event Subscription** page, select **Create** to create the event subscription. For detailed steps, see [subscribe to events through portal](subscribe-through-portal.md).

    :::image type="content" source="./media/handle-health-resources-events-using-azure-monitor-alerts/create-event-subscription-page.png" alt-text="Screenshot that shows the Create Event Subscription page.":::


## Azure Monitor alerts

In Azure monitor alerts, the Event Grid alerts appear as shown in the following image.

**Sample Event Grid alert for `AvailabilityStatusChanged`**:

:::image type="content" source="./media/handle-health-resources-events-using-azure-monitor-alerts/availability-status-changed-alert.png" alt-text="Screenshot that shows the sample Availability Status Changed alert in Azure Monitor.":::

**Sample Event Grid alert for `ResourceAnnotated`**:

:::image type="content" source="./media/handle-health-resources-events-using-azure-monitor-alerts/resource-annotated-alert.png" alt-text="Screenshot that shows the sample Resource Annotated alert in Azure Monitor.":::

## Event Filters
The event filter enables users to receive alerts for a specific resource group, specific transitions (when the availability state changes), or specific annotations (see [Resource Health virtual machine Health Annotations](../service-health/resource-health-vm-annotation.md) for the full list of annotations). Users can use this feature to customize their alerts based on their specific monitoring needs.


1. Select the **Filters** tab to provide subject filtering and advanced filtering. For example, to filter for events from resources in a specific resource group, follow these steps:
    1. Select **Enable subject filtering**.
    1. In the **Subject Filters** section, for **Subject begins with**, provide the value of the resource group in this format: `/subscriptions/{subscription-id}/resourceGroups/{resourceGroup-id}`.
    
        :::image type="content" source="./media/handle-health-resources-events-using-azure-monitor-alerts/filters.png" alt-text="Screenshot that shows the filters in the event subscription.":::        
    1. Alternately, filter for a specific resource by specifying the resource name in the **Subject ends with** parameter within the advanced filters introduced in the next step.
2.	For advanced filtering, navigate to the **Filters** tab of the event subscription and select **Advanced filters**. For detailed instructions, see [Event filtering for Azure Event Grid](event-filtering.md#advanced-filtering). 

    For example, to get alerted when VMs go down, set a filter to look for VM availability transitions that go from `Available` to `Unavailable`. It's done by creating the following conditions: 

    - `Available` is in the key `data.resourceInfo.properties.availabilityState` and
    - `Unavailable` is in `data.resourceInfo.properties.availabilityState`
    
        :::image type="content" source="./media/handle-health-resources-events-using-azure-monitor-alerts/advanced-filters.png" alt-text="Screenshot that shows the advanced filters in the event subscription." lightbox="./media/handle-health-resources-events-using-azure-monitor-alerts/advanced-filters.png":::     

  
## Sample JSON events

### Sample ResourceAnnotated event

Here's a sample `ResourceAnnotated` event. Notice that the `type` is set to `Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated`.

```json
{
    "id": "sample-id",
    "source": "/subscriptions/sample-subscription",
    "specversion": "1.0",
    "type": "Microsoft.ResourceNotifications.HealthResources.ResourceAnnotated",
    "subject": "/subscriptions/sample-subscription/resourceGroups/sample-rg/providers/Microsoft.Compute/virtualMachines/sample-machine",
    "time": "2024-02-22T01:39:48.3385828Z",
    "data": {
        "resourceInfo": {
            "id": "/subscriptions/sample-subscription/resourceGroups/sample-rg/providers/Microsoft.Compute/virtualMachines/sample-machine/providers/Microsoft.ResourceHealth/resourceAnnotations/current",
            "name": "current",
            "type": "Microsoft.ResourceHealth/resourceAnnotations",
            "properties": {
                "targetResourceId": "/subscriptions/sample-subscription/resourceGroups/sample-rg/providers/Microsoft.Compute/virtualMachines/sample-machine",
                "targetResourceType": "Microsoft.Compute/virtualMachines",
                "occurredTime": "2024-02-22T01:39:48.3385828Z",
                "annotationName": "VirtualMachineRebootInitiatedByControlPlane",
                "reason": "Rebooted by user",
                "summary": "The Virtual Machine is undergoing a reboot as requested by an authorized user or process from within the Virtual machine. No other action is required at this time. ",
                "context": "Customer Initiated",
                "category": "Not Applicable",
                "impactType": "Informational"
            }
        },
        "operationalInfo": {
            "resourceEventTime": "2024-02-22T01:39:48.3385828+00:00"
        },
        "apiVersion": "2022-08-01"
    }
}
```

### Sample AvailabilityStatusChanged event

Here's a sample `AvailabilityStatusChanged` event. Notice that the `type` is set to `Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged`.

```json
{
    "id": "sample-id",
    "source": "/subscriptions/sample-subscription",
    "specversion": "1.0",
    "type": "Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged",
    "subject": "/subscriptions/sample-subscription/resourceGroups/sample-rg/providers/Microsoft.Compute/virtualMachines/sample-machine",
    "time": "2024-02-22T01:40:17.6532683Z",
    "data": {
        "resourceInfo": {
            "id": "/subscriptions/sample-subscription/resourceGroups/sample-rg/providers/Microsoft.Compute/virtualMachines/sample-machinee/providers/Microsoft.ResourceHealth/availabilityStatuses/current",
            "name": "current",
            "type": "Microsoft.ResourceHealth/availabilityStatuses",
            "properties": {
                "targetResourceId": "/subscriptions/sample-subscription/resourceGroups/sample-rg/providers/Microsoft.Compute/virtualMachines/sample-machine",
                "targetResourceType": "Microsoft.Compute/virtualMachines",
                "occurredTime": "2024-02-22T01:39:50.177Z",
                "previousAvailabilityState": "Available",
                "availabilityState": "Unavailable"
            }
        },
        "operationalInfo": {
            "resourceEventTime": "2024-02-22T01:39:50.177+00:00"
        },
        "apiVersion": "2023-12-01"
    }
}

```


## Next steps

See the following articles:

- [Azure Monitor alerts](../azure-monitor/alerts/alerts-overview.md)
- [Manage Azure Monitor alert rules](../azure-monitor/alerts/alerts-manage-alert-rules.md)
- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
- [Concepts](concepts.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
