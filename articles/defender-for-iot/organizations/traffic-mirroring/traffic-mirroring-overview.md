---
title: Traffic mirroring overview - Microsoft Defender for IoT
description: This article serves as an overview for configuring traffic mirroring for Microsoft Defender for IoT.
ms.date: 07/04/2023
ms.topic: conceptual
---

# Traffic mirroring overview

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT and provides an overview of the procedures for configuring traffic mirroring in your network.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Network level deployment highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

## Prerequisites

Before you configure traffic mirroring, make sure that you've decided on your sensor locations and the traffic mirroring method.

### Sensor location

Identify the best location to place the sensor in the network, to monitor the network traffic and provide the best discovery and security value possible. The location should give the sensor access to the following three important types of network traffic:

| Type | Description|
|---|---|
|Layer 2 (L2) Traffic | L2 traffic, which includes protocols such as ARP and DHCP, is a critical indicator of the sensor's placement.  Accessing L2 traffic also means that the sensor can gather precise and valuable data about the network's devices. When a sensor is correctly positioned, it accurately captures the MAC addresses of devices. This vital information provides vendor indicators, which enhances the sensor's ability to classify devices. |
| OT Protocols | OT protocols are essential for extracting detailed information about devices within the network. These protocols provide crucial data that leads to accurate device classification. By analyzing OT protocol traffic, the sensor can gather comprehensive details about each device, such as its model, firmware version, and other relevant characteristics. This level of detail is necessary for maintaining an accurate and up-to-date inventory of all devices, which is crucial for network management and security. |
| Inner Subnet Communication | OT networks devices communicate within a subnet, and the information found within the inner subnet communication ensures the quality of the data collected by the sensors. Sensors are placed where they have access to the inner subnet communication in order to monitor device interactions, which often include critical data. By capturing these data packets, the sensors build a detailed and accurate picture of the network.|

For more information, see [placing OT sensors in your network](../best-practices/understand-network-architecture.md#placing-ot-sensors-in-your-network).

### Traffic mirroring methods

There are three types of traffic mirroring methods each designed for specific usage scenarios. Choose the best method based on the usage and size of your network.

|Mirroring type| Switched Port Analyzer (SPAN) | Remote SPAN (RSPAN)  | Encapsulated Remote SPAN (ERSPAN) |
|---|---|---|---|
|**Usage Scenario** | Ideal for monitoring and analyzing traffic within a single switch or a small network segment.|Suitable for larger networks or scenarios where traffic needs to be monitored across different network segments.|Ideal for monitoring traffic over diverse or geographically dispersed networks, including remote sites.|
|**Description**| SPAN is a local traffic mirroring technique used within a single switch or a switch stack. It allows network administrators to duplicate traffic from specified source ports or VLANs to a destination port where the monitoring device, such as a network sensor or analyzer, is connected. |RSPAN extends the capabilities of SPAN by allowing traffic to be mirrored across multiple switches. It's designed for environments where monitoring needs to occur over different switches or switch stacks. |ERSPAN takes RSPAN a step further by encapsulating mirrored traffic in Generic Routing Encapsulation (GRE) packets. This method enables traffic mirroring across different network segments or even across the internet. |
|**Mirroring set up** | - **Source Ports/VLANs**: Configure the switch to mirror traffic from selected ports or VLANs.<br>  - **Destination Port**: The mirrored traffic is sent to a designated port on the same switch. This port is connected to your monitoring device.|- **Source Ports/VLANs**: Traffic is mirrored from specified source ports or VLANs on a source switch.<br> - **RSPAN VLAN**: The mirrored traffic is sent to a special RSPAN VLAN that spans multiple switches. <br> - **Destination Port**: The traffic is then extracted from this RSPAN VLAN at a designated port on a remote switch where the monitoring device is connected.| - **Source Ports/VLANs**: Similar to SPAN and RSPAN, traffic is mirrored from specified source ports or VLANs.<br> - **Encapsulation**: The mirrored traffic is encapsulated in GRE packets, which can then be routed across IP networks. <br> - **Destination Port**: The encapsulated traffic is sent to a monitoring device connected to a destination port where the GRE packets are decapsulated and analyzed.|
| **Benefits** | - Simplicity: Easy to configure and manage. <br> - Low Latency: Since it’s confined to a single switch, it introduces minimal delay.|- Extended Coverage: Allows for monitoring across multiple switches.<br> - Flexibility: Can be used to monitor traffic from different parts of the network. | - Broad Coverage: Enables monitoring across different IP networks and locations. <br> - Flexibility: Can be used in scenarios where traffic needs to be monitored over long distances or through complex network paths.|
| **Limitations** | Local Scope: Limited to monitoring within the same switch, which might not be sufficient for larger networks.|Network Load: Potentially increases the load on the network due to the RSPAN VLAN traffic.| |

When selecting a mirroring method, also consider the following factors:

|Factors| Description |
|---|---|
|Network Size and Layout | - SPAN is suitable for local monitoring. <br>- RSPAN for larger, multi-switch environments <br> - ERSPAN for geographically dispersed or complex networks.|
|Traffic Volume | Ensure that the chosen method can handle the volume of traffic without introducing significant latency or network load.|
|Monitoring Needs| Determine if traffic is captured locally or across different network segments and choose the appropriate method.|

## Traffic mirroring processes

Use one of the following procedures to configure traffic mirroring in your network:

**SPAN ports**:

- [Configure mirroring with a switch SPAN port](configure-mirror-span.md)
- [Configure traffic mirroring with a Remote SPAN (RSPAN) port](configure-mirror-rspan.md)
- [Update a sensor's monitoring interfaces (configure ERSPAN)](../how-to-manage-individual-sensors.md#update-a-sensors-monitoring-interfaces-configure-erspan)

**Virtual switches**:

- [Configure traffic mirroring with a ESXi vSwitch](configure-mirror-esxi.md)
- [Configure traffic mirroring with a Hyper-V vSwitch](configure-mirror-hyper-v.md)

Defender for IoT also supports traffic mirroring with TAP configurations. For more information, see [Active or passive aggregation (TAP)](../best-practices/traffic-mirroring-methods.md#active-or-passive-aggregation-tap).

## Next steps

> [!div class="step-by-step"]
> [Network sensor mirroring set up >>](set-up-traffic-mirroring.md)