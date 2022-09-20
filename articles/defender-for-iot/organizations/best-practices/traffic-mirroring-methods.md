---
title: Traffic mirroring methods - Microsoft Defender for IoT
description: This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---

# Traffic mirroring methods for OT monitoring

This article introduces the supported traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.

To see only relevant information for traffic analysis, you'll need to connect Defender for IoT to a mirroring port on a switch or a TAP that includes only industrial ICS and SCADA traffic.

> [!NOTE]
> SPAN and RSPAN are Cisco terminology. Other brands of switches have similar functionality but might use different terminology.
>

## Choose a mirroring method

Use the following table to help you choose a mirroring method for your OT network monitoring:

|Method  |Use when ...  |
|---------|---------|
|Switch SPAN port     |   Mirrors local traffic from interfaces on the switch to a different interface on the same switch. <br><br>Use when: <br>- Your switch supports port mirroring <br>- Port mirroring is disabled by default      |
|Remote SPAN (RSPAN)     |         |
|Active or passive aggregation (TAP)     |         |
|ERSPAN     |         |
|ESXi vSwitch     |         |
|Hyper-V vSwitch     |         |




## Next steps

After you've [understood your own network's OT architecture](understand-network-architecture.md) and [planned out your deployment](plan-network-monitoring.md), learn more about sample connectivity methods and active or passive monitoring.

For more information, see:

- [Sample OT network connectivity models](sample-connectivity-models.md)
