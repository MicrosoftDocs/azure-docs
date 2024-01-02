---
title: Configure reverse DNS lookup for OT active monitoring - Microsoft Defender for IoT
description: This article describes how to configure reverse DNS lookup for active monitoring with Microsoft Defender for IoT.
ms.date: 06/02/2022
ms.topic: how-to
---

# Configure DNS servers for reverse lookup resolution for OT monitoring

This procedure describes how to enhance device data enrichment in Microsoft Defender for IoT by configuring multiple DNS servers to carryout reverse lookups.

Use reverse DNS lookup to resolve host names or FQDNs associated with the IP addresses detected in network subnets. For example, if a sensor discovers an IP address, it might query multiple DNS servers to resolve the host name. Host names appear in the Defender for IoT device inventory, device map, and reports.

All CIDR formats are supported.

## Prerequisites

Before performing the procedures in this article, you must have:

- An OT network sensor [installed](ot-deploy/install-software-ot-sensor.md), [configured, and activated](ot-deploy/activate-deploy-sensor.md).

- Access to your OT network sensor as an **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- Completed the prerequisites outlined in [Configure active monitoring for OT networks](configure-active-monitoring.md), and confirmed that active monitoring is right for your network.


## Define DNS servers

1. On your sensor console, select **System settings** > **Network monitoring** and under **Active Discovery**, select **Reverse DNS Lookup**.

1. Use the **Schedule Reverse Lookup** options to define your scan as in fixed intervals, per hour, or at a specific time.

    If you select **By specific times**, use a 24-hour clock, such as **14:30** for **2:30 PM**. Select the **+** button on the side to add additional, specific times that you want the lookup to run.

1. Select **Add DNS Server**, and then populate your fields as needed to define the following fields:

    - **DNS server address**, which is the DNS server IP address
    - **DNS server port**
    - **Number of labels**, which is the number of domain labels you want to display. To get this value, resolve the network IP address to device FQDNs. You can enter up to 30 characters in this field.
    - **Subnets**, which is the subnets that you want the DNS server to query

1. Toggle on the **Enabled** option at the top to start the reverse lookup query as scheduled, and then select **Save** to finish the configuration.

## Test the DNS configuration

Use a test device to verify that the reverse DNS lookup settings you'd defined work as expected.

1. On your sensor console, select **System settings** > **Network monitoring** and under **Active Discovery**, select **Reverse DNS Lookup**.

1. Make sure that the **Enabled** toggle is selected.

1. Select **Test**.

1. In the **DNS reverse lookup test for server** dialog, enter an address in the **Lookup Address** and then select **Test**.

## Next steps

For more information, see:

- [View your device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [View your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
