---
title: Track network activity with the event timeline in Microsoft Defender for IoT
description: Track network activity in the event timeline.
ms.date: 02/01/2022
ms.topic: how-to
---

# Track network activity with the event timeline

Activity detected by your Microsoft Defender for IoT sensors is recorded in the event timeline. Activity includes alerts and alert management actions, network events, and user operations such as user sign in or user deletion.

The event timeline provides a chronological view of all the events that took place in the network. Use the timeline during investigations, to understand and analyze the chain of events that preceded and followed an attack or incident.

The Event Timeline presents a timeline of the activity detected on your network by the Defender for IoT sensors, including:

## Permissions

Administrator or Security Analyst permissions are required to perform the procedures described in this article.

## View the event timeline

1. Sign in to the sensor console, and select **Event Timeline** on the left.

1. Review the events and [filter the events](#filter-events) as needed.

1. Select an event row to view the event details in a pane on the right, where you can also filter to view events of related devices.

1. Toggle **User Operations** to hide or show user events.

## Filter events

1. Select **Add filter** to specify the events shown.

    Select the **Type** to filter the events shown using a number of settings:

    - **Date**: Search for events in a specific date range.
    - **Device group**: Filter specific devices by group as defined in the device map.
    - **Event severity**: Show **Alerts Only**, **Alerts and Notices**, or **All Events**.
    - **Exclude devices**: Search for devices you want to exclude.
    - **Include devices**: Search for devices you want to include.
    - **Exclude Event Types**: Search for specific event types to exclude.
    - **Include Event Types**: Search for specific event types to include.
    - **Keywords**: Search for specific keywords.

Select filter **Type** to use any of the following options to filter the devices shown:

|Type|Description|
|---|---|
|**Date**|Search for events in a specific date range.|
|**Device group**|Filter specific devices by group as defined in the device map.|
|**Event severity**|Show **Alerts Only**, **Alerts and Notices**, or **All Events**.|
|**Exclude devices**|Search for devices you want to exclude.|
|**Include devices**|Search for devices you want to include.|
|**Exclude Event Types**|Search for specific event types to exclude.|
|**Include Event Types**|Search for specific event types to include.|
|**Keywords**|Search for specific keywords.|

1. Select **Apply** to set the filter.

## Export the event timeline to CSV

You can export the event timeline to a CSV file, the exported data will be according to any filters applied to your view when exporting.

**To export the event timeline**:

On the **Event timeline** page, select **Export** to export the event timeline to a CSV file.
 
## Create an event

In addition to viewing the events that the sensor has detected, you can manually add events to the timeline. This process is useful if an external system event impacts your network, and you want to record it on the timeline.

1. Select **Create Event**.

1. In the **Create Event** dialog, add the following event details:
    
    - **Type**. Specify the event type (Info, Notice, or Alert).
    
    - **Timestamp**. Set the date and time of the event.
    
    - **Device**. Select the device the event should be connected with.
    
    - **Description**. Provide a description of the event.

1. Select **Save** to add the event to the timeline.

## Maximum event capacity

The maximum number of events shown in the timeline is dependent on [the hardware profile](ot-appliance-sizing.md) selected during sensor installation.
Each profile has a maximum capacity of events.
For more information on event timeline capacity for each hardware profile, see here (or add here?)

The event timeline is not time limited, but once the maximum event capacity is reached, the oldest events will be rolled over and deprecated.

## Next steps

For more information, see:

[View alerts](how-to-view-alerts.md). [View details and remediate a specific alert](how-to-view-alerts.md#view-details-and-remediate-a-specific-alert)

[Audit user activity](track-user-activity.md)

[Analyze programming details and changes](how-to-analyze-programming-details-changes.md)