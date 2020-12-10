---
title: Track sensor activity
description: Event Timeline presents a timeline of activity detected on your network, including alerts and alert management actions, network events and user operations such as user sign-in and user deletion.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/10/2020
ms.topic: article
ms.service: azure
---

# Track sensor activity

## Event timeline

The Event Timeline presents a timeline of activity detected by your sensor, for example:

  - Alerts and alert management actions

  - Network Events

  - User operations such as user sign-in and user deletion

The Event Timeline provides a view of events that took place in the network according in chronological order. The Event Timeline allows understanding and analyses of the chain of events that preceded and followed an attack or incident, which assists in the investigation and forensics.

> [!NOTE]
> **Administrators** and **Security Analysts** may perform the procedures described in this section.

**To view the event logs:**

1. From the side menu, select **Event Timeline**.

   :::image type="content" source="media/how-to-track-sensor-activity/image197.png" alt-text="Event Timeline":::

In addition to presenting the events detected by the sensor, you can manually add events to the timeline. This process is useful in case the event took place in some external system, but it has impact on your network, and it is important to record it and present it as a part of the event timeline.

**To add the events manually:**

1. Select **Create Event** to add an event manually.

**To export the event log info into a CSV file:**

1. Select **Export**.

## Filter event timeline

Filter the timeline to display assets and events of interest to you.

**To filter the timeline:**

1. Select **Advanced Filters**.

   :::image type="content" source="media/how-to-track-sensor-activity/image202.png" alt-text="Events Advanced Filters":::

2. Set event filter(s), as follows:

   - **Include Address:** Display specific events assets.

   - **Exclude Address:** Hide specific events assets.

   - **Include Event Types:** Display specific events types.

   - **Exclude Event Types:** Hide specific events types.

   - **Asset Group:** Select an asset group, as it was defined in the **Asset Map**. Only the events of this group are presented.

3. Select **Clear All** to clear all the selected filters.

4. Search by Alerts Only, Alerts and Notices, or All Events.

5. Select **Select Date** to choose a specific date. Choose a day, hour, and minute. Events from the selected time frame are shown.

6.  Select **User Operations** to include or exclude user operation events.

7.  Select the down arrow **V** to view more information about the event:

    - Select the related alerts (if any) to display a detailed description of the alert.

    - Select the asset to display the asset on the map.

    - Select the **Filter events by related assets** in order to filter by related assets.

    - Select **PCAP File** to download the PCAP file (if exists) that contains a packet capture of the whole network at a specific time. The PCAP file contains technical information that can help engineers determine exactly where the event was and what is happening there. You can analyze the PCAP file with a network protocol analyzer such as Wireshark, a free application.

## See also

[View alerts](how-to-view-alerts.md)
[About Defender for IoT console users](how-to-create-and-manage-users.md)
