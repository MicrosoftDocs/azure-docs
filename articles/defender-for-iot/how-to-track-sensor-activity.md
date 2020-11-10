---
title: Track sensor activity
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/10/2020
ms.topic: article
ms.service: azure
---

#

## Event timeline

The Event Timeline presents a timeline of activity detected on your network, including:

  - Alerts and alert management actions

  - Network Events (informational)

  - User operations such as user login and user deletion

The Event Timeline provides an immediate view of all the events that took place in the network according in chronological order. This allows understanding and analyses of the chain of events that preceded and followed an attack or incident, which assists in the investigation and forensics.

> [!NOTE] 
> **Administrators** and **Security Analysts** may perform the procedures described in this section.

**To view the event logs:**

1. From the side menu, select **Event Timeline**.

   :::image type="content" source="media/how-to-track-sensor-activity/image197.png" alt-text="Event Timeline":::

In addition to presenting the events detected by the sensor, you can manually add events to the timeline. This is useful in case the event took place in some external system, but it has impact on your network, and it is important to record it and present it as a part of the event timeline.

**To add the events manually:**

1. Select :::image type="content" source="media/how-to-track-sensor-activity/image198.png" alt-text="Create Event"::: to add an event manually.

   :::image type="content" source="media/how-to-track-sensor-activity/image199.png" alt-text="Add Event":::

**To export the event log info into a CSV file:**

1.  Select :::image type="content" source="media/how-to-track-sensor-activity/image200.png" alt-text="Export":::.

## Filtering event data

Filter the timeline to display assets and events of interest to you.

**To filter the timeline:**

1. Select :::image type="content" source="media/how-to-track-sensor-activity/image201.png" alt-text="Advanced Filters":::.

   :::image type="content" source="media/how-to-track-sensor-activity/image202.png" alt-text="Events Advanced Filters":::

2. Set event filter(s), as follows:

   - **Include Address:** Display specific events assets.

   - **Exclude Address:** Hide specific events assets.

   - **Include Event Types:** Display specific events types.

   - **Exclude Event Types:** Hide specific events types.

   - **Asset Group:** Select an asset group, as it was defined in the **Asset Map**. Only the events of this group are presented.

3. Select **Clear All** to clear all the selected filters.

4. Search by Alerts Only, Alerts and Notices or All Events.

    :::image type="content" source="media/how-to-track-sensor-activity/image203.png" alt-text="Alerts Only":::

5.  Select :::image type="content" source="media/how-to-track-sensor-activity/image204.png" alt-text="Date"::: to choose a specific date. Choose a day, hour and minute. Events from the selected time frame are shown.

    :::image type="content" source="media/how-to-track-sensor-activity/image205.png" alt-text="Select Date":::

6.  Select :::image type="content" source="media/how-to-track-sensor-activity/image206.png" alt-text="User Operations":::to include or exclude user operation events.

7.  Select the down arrow **V** to view more information about the event:

    - Select the related alerts (if any) to display a detailed description of the alert.

    - Select the asset to display the asset on the map.

    - Select the **Filter events by related assets** in order to filter by related assets.

    - Select :::image type="content" source="https://www.wireshark.org/" alt-text="PCAP file](media/how-to-track-sensor-activity/image207.png)to download the PCAP file (if exists) that contains a packet capture of the whole network at a specific time. The PCAP file contains very technical information that can help engineers determine exactly where the event was and what is happening there. You can analyze the PCAP file with a network protocol analyzer such as [<span class="underline">Wireshark</span>":::, a free application.