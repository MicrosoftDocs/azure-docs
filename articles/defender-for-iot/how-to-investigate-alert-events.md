---
title: Investigate alert events
description: After reviewing the information provided in an alert, you can carry out various forensic steps to guide you in managing the alert event.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/23/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Investigate Alert Events

After reviewing the information provided in an alert, you can carry out various forensic steps to guide you in managing the alert event. For example,

  - Analyze recent asset activity (Data Mining Report). See [Data Mining Reports](./data-mining-reports.md) for details.

  - Analyze other events that occurred at the same time (Event Timeline) See [Event Timeline](./event-timeline.md) for details.

  - Analyze comprehensive event traffic (PCAP file)

## PCAP files

In some cases, a PCAP file can be accessed from the alert message. This may be more useful if you wanted more detailed information about the associated network traffic.

To download a PCAP file, select :::image type="content" source="media/how-to-work-with-alerts-sensor/image168.png" alt-text="download"::: at the upper right of the Alert details dialog box.

:::image type="content" source="media/how-to-work-with-alerts-sensor/image169.png" alt-text="Device is Suspected":::

:::image type="content" source="media/how-to-work-with-alerts-sensor/image170.png" alt-text="CyberX XSense":::

## Recommendations for investigating the event 

Information that may help you better understand the alert event is displayed in the **Manage this Event** section. Review this information before managing the alert event or taking action on the asset or the network.
