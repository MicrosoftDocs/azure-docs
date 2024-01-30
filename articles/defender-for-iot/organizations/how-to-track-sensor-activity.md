---
title: Track network and sensor activity with the event timeline in Microsoft Defender for IoT
description: Track network and sensor activity in the event timeline.
ms.date: 02/27/2023
ms.topic: how-to
---

# Track network and sensor activity with the event timeline

Activity detected by your Microsoft Defender for IoT sensors is recorded in the event timeline. Activity includes alerts and alert management actions, network events, and user operations such as user sign-in or user deletion.

The OT sensor's event timeline provides a chronological view and context of all network activity, to help determine the cause and effect of incidents. The timeline view makes it easy to extract information from network events, and more efficiently analyze alerts and events observed on the network. With the ability to store vast amounts of data, the event timeline view can be a valuable resource for security teams to perform investigations and gain a deeper understanding of network activity.

Use the event timeline during investigations, to understand and analyze the chain of events that preceded and followed an attack or incident. The centralized view of multiple security-related events on the same timeline helps to identify patterns and correlations, and enable security teams to quickly assess the impact of incidents and respond accordingly.

For more information, see:

- [View events on the timeline](#view-the-event-timeline)
- [Audit user activity](track-user-activity.md)
- [View and manage alerts](how-to-view-alerts.md#view-details-and-remediate-a-specific-alert)
- [Analyze programming details and changes](how-to-analyze-programming-details-changes.md)

## Permissions

Before you perform the procedures described in this article, make sure that you have access to an OT sensor as an **Admin** or **Security Analyst** role. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## View the event timeline

1. Sign in to the sensor console, and select **Event Timeline** from the left menu.

1. Review and [filter the events](#filter-events-on-the-timeline) as needed.

1. Select an event row to view the event details in a pane on the right, where you can also filter to view events of related devices.
The **User Operations** filter is on by default, you can select to hide or show user events as needed.

    For example:

    :::image type="content" source="media/track-sensor-activity/event-timeline-view-events.png" alt-text="Screenshot of events on the event timeline." lightbox="media/track-sensor-activity/event-timeline-view-events.png":::

You can also view the event timeline of a specific device from the **Device inventory**.

**To view the event timeline of a specific device**:

1. In the sensor console, go to **Device inventory**.

1. Select the specific device to open the device details pane, and then select **View full details** to open the device properties page.

1. Select the **Event timeline** tab to view all events associated with this device, and [filter the events](#filter-events-on-the-timeline) as needed.

    For example:

    :::image type="content" source="media/track-sensor-activity/device-properties-page-event-timeline.png" alt-text="Screenshot of event timeline tab in device properties page." lightbox="media/track-sensor-activity/device-properties-page-event-timeline.png":::

## Filter events on the timeline

1. On the event timeline page, select **Add filter** to specify the events shown.

1. Select the filter **Type**. Use any of the following options to filter the devices shown:

    |Type|Description|
    |---|---|
    |**User operations**|This filter is on by default, choose to show or hide user operation events.|
    |**Date**|Search for events in a specific date range.|
    |**Device group**|Filter specific devices by group as defined in the device map.|
    |**Event severity**|Show **Alerts Only**, **Alerts and Notices**, or **All Events**.|
    |**Exclude devices**|Search for and filter devices you want to exclude.|
    |**Include devices**|Search for and filter devices you want to include.|
    |**Exclude Event Types**|Search for and filter specific event types to exclude.|
    |**Include Event Types**|Search for and filter  specific event types to include.|
    |**Keywords**|Filter events by specific keywords.|

1. Select **Apply** to set the filter.

## Export the event timeline to CSV

You can export the event timeline to a CSV file, the exported data is according to any filters applied when exporting.

**To export the event timeline**:

On the **Event timeline** page, select **Export** from the top menu to export the event timeline to a CSV file.
 
## Create an event

In addition to viewing the events that the sensor has detected, you can manually add events to the timeline. This process is useful if an external system event impacts your network, and you want to record it on the timeline.

1. On the **Event timeline** page, select **Create Event**.

1. In the **Create Event** dialog, add the following event details:
    
    - **Type**. Specify the event type (Info, Notice, or Alert).
    
    - **Timestamp**. Set the date and time of the event.
    
    - **Device**. Select the device the event should be connected with.
    
    - **Description**. Provide a description of the event.

1. Select **Save** to add the event to the timeline.

For example:

:::image type="content" source="media/track-sensor-activity/create-new-event.png" alt-text="Screenshot of creating a new event in the timeline." lightbox="media/track-sensor-activity/create-new-event.png":::

## Event timeline capacity

The amount of data that can be stored in the event timeline depends on various factors, such as the size of the network, the frequency of events, and the storage capacity of your sensor. The data stored in the event timeline can include information about network traffic, security events, and other relevant data points.

The maximum number of events shown in the event timeline is dependent on [the hardware profile](ot-appliance-sizing.md) selected during sensor installation. Each hardware profile has a maximum capacity of events. For more information on the maximum event capacity for each hardware profile, see [OT event timeline retention](references-data-retention.md#ot-event-timeline-retention).

## Next steps

For more information, see:

- [Audit user activity](track-user-activity.md)
- [View details and remediate a specific alert](how-to-view-alerts.md#view-details-and-remediate-a-specific-alert)
- [Analyze programming details and changes](how-to-analyze-programming-details-changes.md)
