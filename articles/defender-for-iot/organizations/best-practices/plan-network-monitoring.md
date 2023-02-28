---
title: Plan your sensor connections for OT monitoring - Microsoft Defender for IoT
description: Learn about best practices for planning your OT network monitoring with Microsoft Defender for IoT.
ms.topic: best-practice
ms.date: 06/02/2022
---

# Plan your sensor connections for OT monitoring

After you've [understood your network's OT architecture and how the Purdue module applies](understand-network-architecture.md), start planning your sensor connections in a Microsoft Defender for IoT deployment.


## Sensor placement considerations

We recommend that Defender for IoT monitors traffic from Purdue layers 1 and 2. For some architectures, if OT traffic exists on layer 3, Defender for IoT will also monitor layer 3 traffic.

Review your OT and ICS network diagram together with your site engineers to define the best place to connect to Defender for IoT, and where you can get the most relevant traffic for monitoring.  We recommend that you meet with the local network and operational teams to clarify expectations. Create lists of the following data about your network:

- Known devices
- Estimated number of devices
- Vendors and industrial protocols
- Switch models and whether they support port mirroring
- Switch managers, including external resources
- OT networks on your site

## Multi-sensor deployments

The following table lists best practices when deploying multiple Defender for IoT sensors:

| **Number** | **Meters** | **Dependency** | **Number of sensors** |
|--|--|--|--|
| The maximum distance between switches | 80 meters | Prepared Ethernet cable | More than 1 |
| Number of OT networks | More than 1 | No physical connectivity | More than 1 |
| Number of switches | Can use RSPAN configuration | Up to eight switches with local span close to the sensor by cabling distance | More than 1 |


## Questions for planning your network connections

While you're reviewing your site architecture to determine whether or not to monitor a specific switch, considering the following questions:

- What is the cost/benefit versus the importance of monitoring this switch?

- If a switch is unmanaged, can you monitor the traffic from a higher-level switch? If the ICS architecture is a [ring topology](sample-connectivity-models.md#sample-ring-topology), only one switch in the ring needs monitoring.

- What is the security or operational risk in the network?

- Can you monitor the switch's VLAN? Is the VLAN visible in another switch that you can monitor?

Other common questions to consider when planning your network connections to Defender for IoT include:

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

After you've understood your own network's OT architecture and planned out your deployment, learn more about methods for traffic mirroring and passive or active monitoring, and browse sample connectivity methods.

For more information, see:

- [Traffic mirroring methods for OT monitoring](traffic-mirroring-methods.md)
- [Sample OT network connectivity models](sample-connectivity-models.md)

