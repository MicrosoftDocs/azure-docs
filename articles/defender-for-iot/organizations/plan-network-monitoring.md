---
title: OT network monitoring best practices for Microsoft Defender for IoT
description: Learn about best practices for planning your OT network monitoring with Microsoft Defender for IoT.
ms.topic: conceptual
ms.date: 03/27/2022
---

# Best practices for planning your OT network monitoring

This article reviews best practices that we recommend following when planning your OT network monitoring with Microsoft Defender for IoT.

Review these best practices when planning your network. For more information, see [Quickstart: Get started with Defender for IoT](getting-started.md) and [About Microsoft Defender for IoT network setup](how-to-set-up-your-network.md).

## Understand your network architecture

When planning your network monitoring, you must understand your system network architecture and how it will need to connect to Defender for IoT. Also, understand where each of your system elements falls in the Purdue Reference model for Industrial Control System (ICS) OT network segmentation.

Defender for IoT network sensors receive traffic from multiple sources, either by switch mirror ports (SPAN ports) or network TAPs. The network sensor's management port connects to the business, corporate, or sensor management network for network management from the Azure portal or an on-premises management system.

For example:

:::image type="content" source="media/how-to-set-up-your-network/switch-with-port-mirroring.png" alt-text="Diagram of a managed switch with port mirroring." border="false" :::

### Purdue reference model and Defender for IoT

The Purdue Reference Model is a model for Industrial Control System (ICS)/OT network segmentation that defines six layers, components and relevant security controls for those networks.

Each device type in your OT network falls in a specific level of the Purdue model. The following image shows how devices in your network spread across the Purdue model and connect to Defender for IoT services.

:::image type="content" source="media/how-to-set-up-your-network/purdue-model.png" alt-text="Diagram of the Purdue model." border="false" lightbox="media/how-to-set-up-your-network/purdue-model.png":::

The following table describes each level of the Purdue model when applied to Defender for IoT devices:

|Name  |Description  |
|---------|---------|
|**Level 0**: Cell and area     |   Level 0 consists of a wide variety of sensors, actuators, and devices involved in the basic manufacturing process. These devices perform the basic functions of the industrial automation and control system, such as: <br><br>- Driving a motor<br>- Measuring variables<br>- Setting an output<br>- Performing key functions, such as painting, welding, and bending      |
| **Level 1**: Process control     | Level 1 consists of embedded controllers that control and manipulate the manufacturing process whose key function is to communicate with the Level 0 devices. In discrete manufacturing, those devices are programmable logic controllers (PLCs) or remote telemetry units (RTUs). In process manufacturing, the basic controller is called a distributed control system (DCS).        |
|**Level 2**: Supervisory     |  Level 2 represents the systems and functions associated with the runtime supervision and operation of an area of a production facility. These usually include the following: <br><br>- Operator interfaces or human-machine interfaces (HMIs) <br>- Alarms or alerting systems <br> - Process historian and batch management systems <br>- Control room workstations <br><br>These systems communicate with the PLCs and RTUs in Level 1. In some cases, they communicate or share data with the site or enterprise (Level 4 and Level 5) systems and applications. These systems are primarily based on standard computing equipment and operating systems (Unix or Microsoft Windows).       |
|**Levels 3 and 3.5**: Site-level and industrial perimeter network     | The site level represents the highest level of industrial automation and control systems. The systems and applications that exist at this level manage site-wide industrial automation and control functions. Levels 0 through 3 are considered critical to site operations. The systems and functions that exist at this level might include the following: <br><br>- Production reporting (for example, cycle times, quality index, predictive maintenance) <br>- Plant historian <br>- Detailed production scheduling<br>- Site-level operations management <br>-0 Device and material management <br>- Patch launch server <br>- File server <br>- Industrial domain, Active Directory, terminal server <br><br>These systems communicate with the production zone and share data with the enterprise (Level 4 and Level 5) systems and applications.          |
|**Levels 4 and 5**: Business and enterprise networks     |  Level 4 and Level 5 represent the site or enterprise network where the centralized IT systems and functions exist. The IT organization directly manages the services, systems, and applications at these levels.       |

## Plan your sensor connections

We recommend that Defender for IoT monitors traffic from Purdue layers 1 and 2. For some architectures, if OT traffic exists on layer 3, Defender for IoT will also monitor layer 3 traffic.

While you're reviewing your site architecture to determine whether or not to monitor a specific switch, considering the following questions:

- What is the cost/benefit versus the importance of monitoring this switch?
- If a switch is unmanaged, can you monitor the traffic from a higher-level switch? If the ICS architecture is a [ring topology](#sample-ring-topology), only one switch in the ring needs monitoring.
- What is the security or operational risk in the network?
- Can you monitor the switch's VLAN? Is the VLAN visible in another switch that you can monitor?

Review your OT and ICS network diagram together with your site engineers to define the best place to connect to Defender for IoT, and where you can get the most relevant traffic for monitoring.  We recommend that you meet with the local network and operational teams to clarify expectations. Create lists of the following data about your network:

- Known devices
- Estimated number of devices
- Vendors and industrial protocols
- Switch models and whether they support port mirroring
- Switch managers, including external resources
- OT networks on your site

For more information, see [Sample: Multi-layer, multi-tenant network](#sample-multi-layer-multi-tenant-network) and [More questions for planning your network connections](#more-questions-for-planning-your-network-connections).


## Multi-sensor deployments

The following table lists best practices when deploying multiple Defender for IoT sensors:

| **Number** | **Meters** | **Dependency** | **Number of sensors** |
|--|--|--|--|
| The maximum distance between switches | 80 meters | Prepared Ethernet cable | More than 1 |
| Number of OT networks | More than 1 | No physical connectivity | More than 1 |
| Number of switches | Can use RSPAN configuration | Up to eight switches with local span close to the sensor by cabling distance | More than 1 |

## Traffic mirroring

To see only relevant information for traffic analysis, you need to connect the Defender for IoT platform to a mirroring port on a switch or a TAP that includes only industrial ICS and SCADA traffic.

For example:

:::image type="content" source="media/how-to-set-up-your-network/switch.jpg" alt-text="Use this switch for your setup.":::

You can monitor switch traffic using a switch SPAN port, by report SPAN (RSPAN), or active and passive aggregation TAP. Use the following tabs to learn more about each method.

> [!NOTE]
> SPAN and RSPAN are Cisco terminology. Other brands of switches have similar functionality but might use different terminology.
>

# [Switch SPAN port](#tab/switch-span-port)

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

1. Enter global configuration mode
1. Configure first 23 ports as session source (mirror only RX packets)
1. Configure port 24 to be a session destination
1. Return to privileged EXEC mode
1. Verify the port mirroring configuration
1. Save the configuration

#### Monitoring multiple VLANs

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

# [Remote SPAN (RSPAN)](#tab/rspan)

A remote SPAN (RSPAN) session mirrors traffic from multiple distributed source ports into a dedicated remote VLAN. The data in the VLAN is then delivered through trunked ports across multiple switches to a specific switch that contains the physical destination port. This port connects to the Defender for IoT platform.

Consider the following when configuring RSPAN:

- RSPAN is an advanced feature that requires a special VLAN to carry the traffic that SPAN monitors between switches. Make sure that your switch supports RSPAN.
- The mirroring option is disabled by default.
- The remote VLAN must be allowed on the trunked port between the source and destination switches.
- All switches that connect the same RSPAN session must be from the same vendor.
- Make sure that the trunk port that's sharing the remote VLAN between the switches isn't defined as a mirror session source port.
- The remote VLAN increases the bandwidth on the trunked port by the size of the mirrored session's bandwidth. Verify that the switch's trunk port supports the increased bandwidth.

The following diagram shows an example of a remote VLAN architecture:

:::image type="content" source="media/how-to-set-up-your-network/remote-vlan.jpg" alt-text="Diagram of remote VLAN.":::

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

# [Active and passive aggregation (TAP)](#tab/TAP)

An active or passive aggregation TAP is installed inline to the network cable and duplicates both RX and TX to the monitoring sensor.

The terminal access point (TAP) is a hardware device that allows network traffic to flow from port A to port B, and from port B to port A, without interruption. It creates an exact copy of both sides of the traffic flow, continuously, without compromising network integrity. Some TAPs aggregate transmit and receive traffic by using switch settings if desired. If aggregation isn't supported, each TAP uses two sensor ports to monitor send and receive traffic.

The advantages of TAPs include:

- TAPs are hardware-based and can't be compromised
- TAPs pass all traffic, even damaged messages, which the switches often drop
- TAPs aren't processor sensitive, so packet timing is exact where switches handle the mirror function as a low-priority task that can affect the timing of the mirrored packets

For forensic purposes, a TAP is the best device.

TAP aggregators can also be used for port monitoring. These devices are processor-based and aren't as intrinsically secure as hardware TAPs, and therefore might not reflect exact packet timing.

The following diagram shows an example of a network setup with an active and passive TAP:

:::image type="content" source="media/how-to-set-up-your-network/active-passive-tap-v2.png" alt-text="Diagram of active and passive TAPs.":::

#### Common TAP models

The following TAP models have been tested for compatibility with Defender for IoT. Other vendors and models might also be compatible.

- **Garland P1GCCAS**

    :::image type="content" source="media/how-to-set-up-your-network/garland-p1gccas-v2.png" alt-text="Screenshot of Garland P1GCCAS." border="false":::

    When using a Garland TAP, make sure jumpers are set as follows:

    :::image type="content" source="media/how-to-set-up-your-network/jumper-setup-v2.jpg" alt-text="Screenshot of US Robotics switch.":::

- **IXIA TPA2-CU3**

    :::image type="content" source="media/how-to-set-up-your-network/ixia-tpa2-cu3-v2.png" alt-text="Screenshot of IXIA TPA2-CU3." border="false":::

- **US Robotics USR 4503**

    :::image type="content" source="media/how-to-set-up-your-network/us-robotics-usr-4503-v2.png" alt-text="Screenshot of US Robotics USR 4503.":::

    When using a US Robotics TAP, make sure **Aggregation mode** is active.

---

## Sample connectivity models

This section provides sample network models for Defender for IoT sensor connections.

### Sample: Ring topology

The following diagram shows an example of a ring network topology, in which each switch or node connects to exactly two other switches, forming a single continuous pathway for the traffic.

:::image type="content" source="media/how-to-set-up-your-network/ring-topology.png" alt-text="Diagram of the ring topology.":::

### Sample: Linear bus and star topology

In a star network, every host is connected to a central hub. In its simplest form, one central hub acts as a conduit to transmit messages. In the following example, lower switches aren't monitored, and traffic that remains local to these switches won't be seen. Devices might be identified based on ARP messages, but connection information will be missing.

:::image type="content" source="media/how-to-set-up-your-network/linear-bus-star-topology.png" alt-text="Diagram of the linear bus and star topology.":::

### Sample: Multi-layer, multi-tenant network

The following diagram is a general abstraction of a multilayer, multitenant network, with an expansive cybersecurity ecosystem typically operated by an SOC and MSSP.

Typically, NTA sensors are deployed in layers 0 to 3 of the OSI model.

:::image type="content" source="media/how-to-set-up-your-network/osi-model.png" alt-text="Diagram of the OSI model." lightbox="media/how-to-set-up-your-network/osi-model.png":::


## More questions for planning your network connections

This section lists more, common questions to consider when planning your network connections to Defender for IoT:

- What are the overall goals of the implementation? Are a complete inventory and accurate network map important?

- Are there multiple or redundant networks in the ICS? Are all the networks being monitored?

- Are there communications between the ICS and the enterprise (business) network? Are these communications being monitored?

- Are VLANs configured in the network design?

- How is maintenance of the ICS performed, with fixed or transient devices?

- Where are firewalls installed in the monitored networks?

- Is there any routing in the monitored networks?

- What OT protocols are active on the monitored networks?

- If we connect to this switch, will we see communication between the HMI and the PLCs?

- What is the physical distance between the ICS switches and the enterprise firewall?

- Can unmanaged switches be replaced with managed switches, or is the use of network TAPs an option?

- Is there any serial communication in the network? If yes, show it on the network diagram.

- If the Defender for IoT appliance should be connected to that switch, is there physical available rack space in that cabinet?

## Next steps

For more information, see:

- [Welcome to Microsoft Defender for IoT for organizations](overview.md)
- [Quickstart: Get started with Defender for IoT](getting-started.md)
- [About Microsoft Defender for IoT network setup](how-to-set-up-your-network.md)