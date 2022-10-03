---
title: Traffic mirroring methods - Microsoft Defender for IoT
description: This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.
ms.date: 06/02/2022
ms.topic: conceptual
---

# Traffic mirroring methods for OT monitoring

This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.

To see only relevant information for traffic analysis, you need to connect Defender for IoT to a mirroring port on a switch or a TAP that includes only industrial ICS and SCADA traffic.

For example:

:::image type="content" source="../media/how-to-set-up-your-network/switch.jpg" alt-text="Use this switch for your setup." border="false":::

You can monitor switch traffic using a switch SPAN port, by report SPAN (RSPAN), or active and passive aggregation TAP. Use the following tabs to learn more about each method.

> [!NOTE]
> SPAN and RSPAN are Cisco terminology. Other brands of switches have similar functionality but might use different terminology.
>

## Switch SPAN port

A switch port analyzer mirrors local traffic from interfaces on the switch to interface on the same switch. Considerations for switch SPAN ports include:

- Verify that the relevant switch supports the port mirroring function.

- The mirroring option is disabled by default.

- We recommend that you configure all of the switch's ports, even if no data is connected to them. Otherwise, a rogue device might be connected to an unmonitored port, and it wouldn't be alerted on the sensor.

- On OT networks that utilize broadcast or multicast messaging, configure the switch to mirror only RX (Receive) transmissions. Otherwise, multicast messages will be repeated for as many active ports, and the bandwidth is multiplied.

For example, use the following configurations to set up a switch SPAN port for a Cisco 2960 switch with 24 ports running IOS.

> [!NOTE]
> The configuration samples below are intended only as guidance and not as instructions. Mirror ports on other Cisco operating systems and other switch brands are configured differently.

**On a SPAN port configuration terminal**:

```cli
Cisco2960# configure terminal
Cisco2960(config)# monitor session 1 source interface fastehernet 0/2 - 23 rx
Cisco2960(config)# monitor session 1 destination interface fastethernet 0/24
Cisco2960(config)# end
Cisco2960# show monitor 1
Cisco2960# running-copy startup-config
```

**In the configuration user interface**

1. Enter global configuration mode.
1. Configure first 23 ports as session source (mirror only RX packets).
1. Configure port 24 to be a session destination.
1. Return to privileged EXEC mode.
1. Verify the port mirroring configuration.
1. Save the configuration.

### Monitoring multiple VLANs

Defender for IoT allows monitoring VLANs configured in your network without any extra configuration, as long as the network switch is configured to send VLAN tags to Defender for IoT.

For example, the following commands must be configured on a Cisco switch to support monitoring VLANs in Defender for IoT:

**Monitor session**: This command is responsible for the process of sending VLANs to the SPAN port.

```cli
monitor session 1 source interface Gi1/2
monitor session 1 filter packet type good Rx
monitor session 1 destination interface fastEthernet1/1 encapsulation dot1q
```

**Monitor Trunk Port F.E. Gi1/1**: VLANs are configured on the trunk port.

```cli
interface GigabitEthernet1/1
switchport trunk encapsulation dot1q
switchport mode trunk
```

## Remote SPAN (RSPAN)

A remote SPAN (RSPAN) session mirrors traffic from multiple distributed source ports into a dedicated remote VLAN. The data in the VLAN is then delivered through trunked ports across multiple switches to a specific switch that contains the physical destination port. This port connects to the Defender for IoT platform.

Consider the following when configuring RSPAN:

- RSPAN is an advanced feature that requires a special VLAN to carry the traffic that SPAN monitors between switches. Make sure that your switch supports RSPAN.
- The mirroring option is disabled by default.
- The remote VLAN must be allowed on the trunked port between the source and destination switches.
- All switches that connect the same RSPAN session must be from the same vendor.
- Make sure that the trunk port that's sharing the remote VLAN between the switches isn't defined as a mirror session source port.
- The remote VLAN increases the bandwidth on the trunked port by the size of the mirrored session's bandwidth. Verify that the switch's trunk port supports the increased bandwidth.

The following diagram shows an example of a remote VLAN architecture:

:::image type="content" source="../media/how-to-set-up-your-network/remote-vlan.jpg" alt-text="Diagram of remote VLAN." border="false":::

For example, use the following steps to set up an RSPAN for a Cisco 2960 switch with 24 ports running IOS.

**To configure the source switch**:

1. Enter global configuration mode.

1. Create a dedicated VLAN.

1. Identify the VLAN as the RSPAN VLAN.

1. Return to "configure terminal" mode.

1. Configure all 24 ports as session sources.

1. Configure the RSPAN VLAN to be the session destination.

1. Return to privileged EXEC mode.

1. Verify the port mirroring configuration.

**To configure the destination switch**:

1. Enter global configuration mode.

1. Configure the RSPAN VLAN to be the session source.

1. Configure physical port 24 to be the session destination.

1. Return to privileged EXEC mode.

1. Verify the port mirroring configuration.

1. Save the configuration.

## Active and passive aggregation (TAP)

An active or passive aggregation TAP is installed inline to the network cable and duplicates both RX and TX to the monitoring sensor.

The terminal access point (TAP) is a hardware device that allows network traffic to flow from port A to port B, and from port B to port A, without interruption. It creates an exact copy of both sides of the traffic flow, continuously, without compromising network integrity. Some TAPs aggregate transmit and receive traffic by using switch settings if desired. If aggregation isn't supported, each TAP uses two sensor ports to monitor send and receive traffic.

The advantages of TAPs include:

- TAPs are hardware-based and can't be compromised
- TAPs pass all traffic, even damaged messages, which the switches often drop
- TAPs aren't processor sensitive, so packet timing is exact where switches handle the mirror function as a low-priority task that can affect the timing of the mirrored packets

For forensic purposes, a TAP is the best device.

TAP aggregators can also be used for port monitoring. These devices are processor-based and aren't as intrinsically secure as hardware TAPs, and therefore might not reflect exact packet timing.

The following diagram shows an example of a network setup with an active and passive TAP:

:::image type="content" source="../media/how-to-set-up-your-network/active-passive-tap-v2.png" alt-text="Diagram of active and passive TAPs." border="false":::

### Common TAP models

The following TAP models have been tested for compatibility with Defender for IoT. Other vendors and models might also be compatible.

- **Garland P1GCCAS**

    When using a Garland TAP, make sure jumpers are set as follows:

    :::image type="content" source="../media/how-to-set-up-your-network/jumper-setup-v2.jpg" alt-text="Screenshot of US Robotics switch.":::

- **IXIA TPA2-CU3**

    :::image type="content" source="../media/how-to-set-up-your-network/ixia-tpa2-cu3-v2.png" alt-text="Screenshot of IXIA TPA2-CU3." border="false":::

- **US Robotics USR 4503**

    When using a US Robotics TAP, make sure **Aggregation mode** is active.


## Next steps

After you've [understood your own network's OT architecture](understand-network-architecture.md) and [planned out your deployment](plan-network-monitoring.md), learn more about sample connectivity methods and active or passive monitoring.

For more information, see:

- [Sample OT network connectivity models](sample-connectivity-models.md)
