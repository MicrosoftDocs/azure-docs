---
title: include
author: batamig
ms.date: 01/22/2023
ms.topic: include
---

## Validate traffic mirroring

After configuring traffic mirroring, make an attempt to receive a sample of recorded traffic (PCAP file) from the switch SPAN or mirror port. 

A sample PCAP file sample will help you:

- Validate the switch configuration
- Confirm that the traffic going through your switch is relevant for monitoring
- Identify the bandwidth and an estimated number of devices detected by the switch

1. Use a network protocol analyzer application, such as [Wireshark](https://www.wireshark.org/), to record a sample PCAP file for a few minutes. For example, connect a laptop to a port where you've configured traffic monitoring.

1. Check that *Unicast packets* are present in the recording traffic. Unicast traffic is traffic sent from address to another. 

    If most of the traffic is ARP messages, your traffic mirroring configuration isn't correct.

1. Verify that your OT protocols are present in the analyzed traffic.

    For example:

    :::image type="content" source="../media/how-to-set-up-your-network/wireshark-validation.png" alt-text="Screenshot of Wireshark validation.":::