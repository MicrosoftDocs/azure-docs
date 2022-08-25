---
title: Track sensor activity in Defender for IoT
description: Track sensor activity in the event timeline.
ms.date: 02/01/2022
ms.topic: how-to
---

# Track sensor activity

Activity that your sensor detects is recorded in the event timeline. Activity includes alerts and alert actions, network events, and user operations such as user sign in or user deletion.

The event timeline provides a chronological view of events. Use the timeline during investigations, to understand and analyze the chain of events that preceded and followed an attack or incident. 

## Before you start

You need to have Administrator or Security Analyst permissions to perform the procedures described in this article.

## View the event timeline

1. In Defender for IoT, select **Event Timeline**.
1. Review the events and filter as needed.
1. Toggle **User Operations** to hide or show user events.
1. Select **Add filter** to specify the events shown.
1. In **Type** filter the events shown using a number of settings:
    - **Event severity**: Show **Alerts Only**, **Alerts and Notices**, or **All Events**.
    - **Device group**: Filter on specific devices defined in the device map.
    - **Include devices**: Search for devices you want to include.
    - **Exclude devices**: Search for devices you want to exclude.
    - **Keywords**: Search for specific keywords.
    - **Include Event Types**: Search for specific event types to include.
    - **Exclude Event Types**: Search for specific event types to exclude.
    - **Date**: Search for events in a specific date range.
1. Select **Apply* to set the filter.
1. Select **Export** to export the event timeline to a CSV file.
 
## Add an event

In addition to viewing the events that the sensor has detected, you can manually add events to the timeline. This process is useful if an external system event impacts your network, and you want to record it on the timeline.

1. Select **Create Event**.
1. In the **Create Event** dialog, specify the event type (Info, Notice, or Alert) 
1. Set a timestamp for the event, the device it should be connected with, and provide a description.
1. Select **Save** to add the event to the timeline.



## Next steps

For more information, see [View alerts](how-to-view-alerts.md).
