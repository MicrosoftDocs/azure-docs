---
title: Track network activity with the event timeline in Microsoft Defender for IoT
description: Track network activity in the event timeline.
ms.date: 02/01/2022
ms.topic: how-to
---

# Track network activity with the event timeline

Activity that your Microsoft Defender for IoT sensors detect is recorded in the event timeline. Activity includes alerts and alert management actions, network events, and user operations such as user sign in or user deletion.

The event timeline provides a chronological view of all the events that took place in the network. Use the timeline during investigations, to understand and analyze the chain of events that preceded and followed an attack or incident. 

The Event Timeline presents a timeline of the activity detected on your network by the Defender for IoT sensors, including: 

## Permissions

You need to have Administrator or Security Analyst permissions to perform the procedures described in this article.

## View the event timeline

1. Sign in to the sensor console, and select **Event Timeline** on the left.
1. Review the events and filter as needed.
1. Select an event row to view the event details in a pane on the right, where you can also filter to view events of related devices.
1. Toggle **User Operations** to hide or show user events.


1. Select **Add filter** to specify the events shown.
    In the filter **Type**, you can filter the events shown using a number of settings:
    - **Date**: Search for events in a specific date range.
    - **Device group**: Filter specific devices by group as defined in the device map.
    - **Event severity**: Show **Alerts Only**, **Alerts and Notices**, or **All Events**.
    - **Exclude devices**: Search for devices you want to exclude.
    - **Include devices**: Search for devices you want to include.
    - **Exclude Event Types**: Search for specific event types to exclude.
    - **Include Event Types**: Search for specific event types to include.
    - **Keywords**: Search for specific keywords.
1. Select **Apply* to set the filter.
1. Select **Export** to export the event timeline to a CSV file.
 
## Create an event

In addition to viewing the events that the sensor has detected, you can manually add events to the timeline. This process is useful if an external system event impacts your network, and you want to record it on the timeline.

1. Select **Create Event**.
1. In the **Create Event** dialog, specify the event **Type** (Info, Notice, or Alert) 
1. Set a **timestamp** for the event, the **device** it should be connected with, and provide a **description**.
1. Select **Save** to add the event to the timeline.

## Hardware capacity

The maximum number of events shown is dependent on the hardware profile selected during sensor installation. (Xref to install your software where you select the HW profile, and also the catalog).

For more information on event timeline capacity for each hardware profile, see here (or add here?)

The event timeline is not time limited, but once the capacity is reached, the oldest events will be rolled over and deprecated.

## Next steps

For more information, see: 

[View alerts](how-to-view-alerts.md). [View details and remediate a specific alert](how-to-view-alerts.md#view-details-and-remediate-a-specific-alert)

[Audit user activity](track-user-activity.md)

[Analyze programming details and changes](how-to-analyze-programming-details-changes.md)


