---
title: Configure mirroring with a switch SPAN port - Microsoft Defender for IoT
description: This article describes how to configure a SPAN port for traffic mirroring when monitoring OT networks with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---

# Configure mirroring with a switch SPAN port

A SPAN port on your switch mirrors local traffic from interfaces on the switch to a different interface on the same switch.

This article provides a sample configuration procedure for configuring a SPAN port for a Cisco 2960 switch, with 24 ports running IOS.

> [!IMPORTANT]
> This article is intended only as guidance and not as instructions. Mirror ports on other Cisco operating systems and other switch brands are configured differently.

## Best practices for configuring a SPAN port

When configuring a SPAN port, we recommend that you configure all of the switch's ports, even if no data is connected to them. If you don't, a rogue device might be connected to an unmonitored port, and it wouldn't be alerted on the sensor.

On OT networks that utilize broadcast or multicast messaging, configure the switch to mirror only RX (Receive) transmissions. Otherwise, multicast messages will be repeated for as many active ports, and the bandwidth is multiplied.


## Configure a SPAN port with a configuration terminal

To configure a SPAN port using a configuration terminal, run:

```cli
Cisco2960# configure terminal
Cisco2960(config)# monitor session 1 source interface fastehernet 0/2 - 23 rx
Cisco2960(config)# monitor session 1 destination interface fastethernet 0/24
Cisco2960(config)# end
Cisco2960# show monitor 1
Cisco2960# running-copy startup-config
```

## Configure a SPAN port from the user interface

From the switch's configuration user interface:

1. Enter the global configuration mode.
1. Configure the first 23 ports as a session source, mirroring only RX packets.
1. Configure port 24 to be a session destination.
1. Return to privileged EXEC mode.
1. Verify the port mirroring configuration.
1. Save the configuration.

## Monitor multiple VLANs

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

## Next steps

For more information, see:

- [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md)
- [Prepare your OT network for Microsoft Defender for IoT](../how-to-set-up-your-network.md)