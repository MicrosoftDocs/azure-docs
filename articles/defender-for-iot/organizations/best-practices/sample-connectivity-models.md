---
title: Sample OT  network connectivity models - Microsoft Defender for IoT
description: This article describes sample connectivity methods for Microsoft Defender for IoT OT sensor connections.
ms.date: 11/08/2022
ms.topic: install-set-up-deploy
---

# Sample OT network connectivity models

This article provides sample network models for Microsoft Defender for IoT sensor connections.

## Sample: Ring topology

The following diagram shows an example of a ring network topology, in which each switch or node connects to exactly two other switches, forming a single continuous pathway for the traffic.

:::image type="content" source="../media/how-to-set-up-your-network/ring-topology.png" alt-text="Diagram of the ring topology." border="false" lightbox="../media/how-to-set-up-your-network/ring-topology.png":::

## Sample: Linear bus and star topology

In a star network, every host is connected to a central hub. In its simplest form, one central hub acts as a conduit to transmit messages. In the following example, lower switches aren't monitored, and traffic that remains local to these switches won't be seen. Devices might be identified based on ARP messages, but connection information will be missing.

:::image type="content" source="../media/how-to-set-up-your-network/linear-bus-star-topology.png" alt-text="Diagram of the linear bus and star topology." border="false" lightbox="../media/how-to-set-up-your-network/linear-bus-star-topology.png":::

## Sample: Multi-layer, multi-tenant network

The following diagram is a general abstraction of a multilayer, multitenant network, with an expansive cybersecurity ecosystem typically operated by an SOC and MSSP.

Typically, NTA sensors are deployed in layers 0 to 3 of the OSI model.

:::image type="content" source="../media/how-to-set-up-your-network/osi-model.png" alt-text="Diagram of the OSI model." lightbox="../media/how-to-set-up-your-network/osi-model.png" border="false":::

## Next steps

After you've [understood your own network's OT architecture](understand-network-architecture.md) and [planned out your deployment](plan-network-monitoring.md), learn more about methods for traffic mirroring and passive or active monitoring.

For more information, see:

- [Traffic mirroring methods for OT monitoring](traffic-mirroring-methods.md)
