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

## Define DNS servers

1. On your sensor console, select **System settings**> **Network monitoring** and under **Active Discovery**, select **Reverse DNS Lookup**.

1. Use the **Schedule Reverse Lookup** options to define your scan as in fixed intervals, per hour, or at a specific time.

    If you select **By specific times**, use a 24-hour clock, such as **14:30** for **2:30 PM**. Select the **+** button on the side to add additional, specific times that you want the lookup to run.

1. Select **Add DNS Server**, and then populate your fields as needed to define the following fields:

    - **DNS server address**, which is the DNS server IP address
    - **DNS server port**
    - **Number of labels**, which is the number of domain labels you want to display. To get this value, resolve the network IP address to device FQDNs. You can enter up to 30 characters in this field.
    - **Subnets**, which is the subnets that you want to the DNS server to query

1. Toggle on the **Enabled** option at the top to start the reverse lookup query as scheduled, and then select **Save** to finish the configuration.

## Test the DNS configuration

Use a test device to verify that the reverse DNS lookup settings you'd defined work as expected.

1. On your sensor console, select **System settings**> **Network monitoring** and under **Active Discovery**, select **Reverse DNS Lookup**.

1. Make sure that the **Enabled** toggle is selected.

1. Select **Test**.

1. In the **DSN reverse lookup test for server** dialog, enter an address in the **Lookup Address** and then select **Test**.

## Next steps

Learn more about active monitoring options. For more information, see:

- [Configure active monitoring for OT networks](configure-active-monitoring.md)
- [Configure Windows Endpoint monitoring](configure-windows-endpoint-monitoring.md)