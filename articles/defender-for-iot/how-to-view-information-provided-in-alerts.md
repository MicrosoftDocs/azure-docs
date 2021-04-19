---
title: About alert messages
description: Select an alert from the Alerts window to review details.
ms.date: 3/21/2021
ms.topic: how-to
---

# About alert messages

Select an alert from the **Alerts** window to review alert details. Details include the following information:

- Alert metadata

- Information about traffic, devices, and the event

- Links to connected devices in the device map

- Comments defined by security analysts and administrators

- Recommendations for investigating the event

## Alert metadata

Alert details include the following alert metadata:

  - Alert ID

  - Policy engine that triggered the alert

  - Date and time that the alert was triggered

:::image type="content" source="media/how-to-work-with-alerts-sensor/internet-connectivity-detection-unauthorized.png" alt-text="Unauthorized internet connectivity detected.":::

## Information about devices, traffic, and the event

The alert message provides information about:

  - The detected devices.

  - The traffic detected between the devices, such as protocols and function codes.

  - Insights into the implications of the event.

You can use this information when deciding how to manage the alert event.

## Links to connected devices in the device map

To learn more about devices connected to the detected devices, you can select a device image in the alert and view connected devices in the map.

:::image type="content" source="media/how-to-work-with-alerts-sensor/rcp-operation-failed.png" alt-text="RCP operation failed.":::

:::image type="content" source="media/how-to-work-with-alerts-sensor/devices-screen-populated.png" alt-text="Devices screenshot.":::

The map filters to the device that you selected, and other devices connected to it. The map also displays the **Quick Properties** dialog box for the devices detected in the alerts.

## Comments defined by security analysts and administrators 

Alerts might include a list of predefined comments. For example, comments can be instructions for mitigation actions to take, or names of individuals to contact about the event.

When you're managing an alert event, you can choose the comment or comments that best reflect the event status or the steps you've taken to investigate the alert.

Selected comments are saved in the alert message. Working with comments enhances communication between individuals and teams during the investigation of an alert event. As a result, comments can accelerate incident response time.

An administrator or security analyst predefines comments. Selected comments are not forwarded to partner systems defined in the forwarding rules.

After you review the information in an alert, you can carry out various forensic steps to guide you in managing the alert event. For example:

- Analyze recent device activity (data-mining report). 

- Analyze other events that occurred at the same time (event timeline). 

- Analyze comprehensive event traffic (PCAP file).

## PCAP files

In some cases, you can access a PCAP file from the alert message. This might be useful if you want more detailed information about the associated network traffic.

To download a PCAP file, select :::image type="content" source="media/how-to-work-with-alerts-sensor/download-pcap.png" alt-text="Download icon."::: at the upper right of the **Alert details** dialog box.

## Recommendations for investigating an event 

The **Recommendation** area of an alert displays information that might help you better understand an event. Review this information before managing the alert event or taking action on the device or the network.

## See also

[Accelerate Alert workflows](how-to-accelerate-alert-incident-response.md)

[Manage the alert event](how-to-manage-the-alert-event.md)
