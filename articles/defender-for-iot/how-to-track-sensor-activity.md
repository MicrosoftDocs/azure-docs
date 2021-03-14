---
title: Track sensor activity
description: The event timeline presents a timeline of activity detected on your network, including alerts and alert management actions, network events, and user operations such as user sign-in and user deletion.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/10/2020
ms.topic: article
ms.service: azure
---

# Track sensor activity

## Event timeline

The event timeline presents a timeline of activity that your sensor has detected. For example:

  - Alerts and alert management actions

  - Network events

  - User operations such as user sign-in and user deletion

The event timeline provides a chronological view of events that happened in the network. The event timeline allows understanding and analyses of the chain of events that preceded and followed an attack or incident, which assists in the investigation and forensics.

> [!NOTE]
> *Administrators* and *security analysts* can perform the procedures described in this section.

To view the event logs:

- From the side menu, select **Event Timeline**.

   :::image type="content" source="media/how-to-track-sensor-activity/event-timeline.png" alt-text="View your events on the event timeline.":::

In addition to viewing the events that the sensor has detected, you can manually add events to the timeline. This process is useful if the event happened in an external system but has an impact on your network, and it's important to record the event and present it as a part of the timeline.

To add events manually:

- Select **Create Event**.

To export event log information into a CSV file:

- Select **Export**.

## Filter the event timeline

Filter the timeline to display devices and events of interest to you.

To filter the timeline:

1. Select **Advanced Filters**.

   :::image type="content" source="media/how-to-track-sensor-activity/advance-filters.png" alt-text="Use the Events Advanced Filters window to filter your events.":::

2. Set event filters, as follows:

   - **Include Address**: Display events for specific devices.

   - **Exclude Address**: Hide events for specific devices.

   - **Include Event Types**: Display specific events types.

   - **Exclude Event Types**: Hide specific events types.

   - **Device Group**: Select a device group, as it was defined in the device map. Only the events from this group are presented.

3. Select **Clear All** to clear all the selected filters.

4. Search by **Alerts Only**, **Alerts and Notices**, or **All Events**.

5. Select **Select Date** to choose a specific date. Choose a day, hour, and minute. Events from the selected time frame are shown.

6.  Select **User Operations** to include or exclude user operation events.

7.  Select the arrow (**V**) to view more information about the event:

    - Select the related alerts (if any) to display a detailed description of the alert.

    - Select the device to display the device on the map.

    - Select **Filter events by related devices** if you want to filter by related devices.

    - Select **PCAP File** to download the PCAP file (if it exists) that contains a packet capture of the whole network at a specific time. 
    
      The PCAP file contains technical information that can help network engineers determine the exact parameters of the event. You can analyze the PCAP file with a network protocol analyzer such as Wireshark, an open-source application.

## See also

[View alerts](how-to-view-alerts.md)
