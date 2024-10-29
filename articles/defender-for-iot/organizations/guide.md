---
title: Deployment guide for network sensor deployment - Microsoft Defender for IoT
description: A quick guide for the correct placement and mirroring of the OT sensor in your network for Microsoft Defender for IoT.
ms.topic: install-set-up-deploy
ms.date: 10/15/2024
---

# Deployment guide for the network sensor - WHERE SHOULD THIS BE PLACED IN THE TOC

This guide provides a step-by-step approach to successfully deploying your network sensor deployment, and ensuring comprehensive network monitoring and security. The five deployment steps are as follows:

1. Network architecture review
1. Sensor location
1. Traffic Mirroring Methods
1. Deploy the sensors
1. Post-deployment validation

Follow these guidelines to optimize your sensor performance and achieve accurate and reliable network data collection.

## Network architecture review

Before the sensor can be applied to the network, it's crucial to review the network architecture. These steps include:

- Review the network diagram. For more information, see [review architecture](best-practices/understand-network-architecture.md) or [create a network diagram](best-practices/plan-prepare-deploy.md#create-a-network-diagram).

- Estimate the total number of devices to be monitored. For more information, see [calculate devices in your network](best-practices/plan-prepare-deploy.md#calculate-devices-in-your-network).

- Identify VLANs that contain OT networks. For more information, see [customize a VLAN name](how-to-control-what-traffic-is-monitored#customize-a-vlan-name).

- Determine which OT protocols need to be monitored (Profinet, S7, Modbus etc..). For more information see [supported protocols](concept-supported-protocols.md).

## Sensor location

Identify the best location to place the sensor in the network, to monitor the network traffic and provide the best discovery and security value possible. The location should give the sensor access to the following three important types of network traffic:

| Type | Description|
|---|---|
|Layer 2 (L2) Traffic | L2 traffic, which includes protocols such as ARP and DHCP, is a critical indicator of the sensor's placement.  Accessing L2 traffic also means that the sensor can gather precise and valuable data about the network's devices. When a sensor is correctly positioned, it accurately captures the MAC addresses of devices. This vital information provides vendor indicators, which enhances the sensor's ability to classify devices. |
| OT Protocols | OT protocols are essential for extracting detailed information about devices within the network. These protocols provide crucial data that leads to high classification coverage <!-- accurate device classification.-->. By analyzing OT protocol traffic, the sensor can gather comprehensive details about each device, such as its model, firmware version, and other relevant characteristics. This level of detail is necessary for maintaining an accurate and up-to-date inventory of all devices, which is crucial for network management and security. |
| Inner Subnet Communication | OT networks devices communicate within a subnet, and the information found within the inner subnet communication ensures the quality of the data collected by the sensors. Sensors are placed where they have access to the inner subnet communication in order to monitor device interactions, which often include critical data. By capturing these data packets, the sensors build a detailed and accurate picture of the network.|

For more information, see [placing OT sensors in your network](best-practices/understand-network-architecture.md#placing-ot-sensors-in-your-network).

**Validation of the sensor location**

After deciding on a potential location for the sensor, users should validate the presence of L2 and OT protocols. It's recommended to use tools like Wireshark to verify these protocols at the potential sensor location. For example:

:::image type="content" source="media/guide/deployment-guide-analyzer.png" alt-text="Screenshot of the wireshark program used to confirm and validate OT sensor set up and network protocols communicating with the newly deployed OT sensor":::

Wireshark displays the list of protocols identified by the sensor and the amount of data being monitored, thereby validating the location of your sensor. If protocols don't appear or don't detect any data, this indicates that the sensor is incorrectly placed or set up in the network. For example:

:::image type="content" source="media/guide/deployment-guide-protocols.png" alt-text="Screenshot of the wireshark program protocol output used to confirm and validate OT sensor set up and network protocols communicating with the newly deployed OT sensor":::

This step is crucial to ensure effective monitoring of OT networks.  For more information, see Theo is there a link for this?

## Traffic Mirroring Methods

There are three types of traffic mirroring methods each designed for specific usage scenarios. Choose the best method based on the usage and size of your network.

|Mirroring type| Switched Port Analyzer (SPAN) | Remote SPAN (RSPAN)  | Encapsulated Remote SPAN (ERSPAN) |
|---|---|---|---|
|**Usage Scenario** | Ideal for monitoring and analyzing traffic within a single switch or a small network segment.|Suitable for larger networks or scenarios where traffic needs to be monitored across different network segments.|Ideal for monitoring traffic over diverse or geographically dispersed networks, including remote sites.|
|**Description**| SPAN is a local traffic mirroring technique used within a single switch or a switch stack. It allows network administrators to duplicate traffic from specified source ports or VLANs to a destination port where the monitoring device, such as a network sensor or analyzer, is connected. |RSPAN extends the capabilities of SPAN by allowing traffic to be mirrored across multiple switches. It's designed for environments where monitoring needs to occur over different switches or switch stacks. |ERSPAN takes RSPAN a step further by encapsulating mirrored traffic in Generic Routing Encapsulation (GRE) packets. This method enables traffic mirroring across different network segments or even across the internet. |
|**Mirroring set up** | - **Source Ports/VLANs**: Configure the switch to mirror traffic from selected ports or VLANs.<br>  - **Destination Port**: The mirrored traffic is sent to a designated port on the same switch. This port is connected to your monitoring device.|- **Source Ports/VLANs**: Traffic is mirrored from specified source ports or VLANs on a source switch.<br> - **RSPAN VLAN**: The mirrored traffic is sent to a special RSPAN VLAN that spans multiple switches. <br> - **Destination Port**: The traffic is then extracted from this RSPAN VLAN at a designated port on a remote switch where the monitoring device is connected.| - **Source Ports/VLANs**: Similar to SPAN and RSPAN, traffic is mirrored from specified source ports or VLANs.<br> - **Encapsulation**: The mirrored traffic is encapsulated in GRE packets, which can then be routed across IP networks. <!-- where does the encaplusation occur?? --> <br> - **Destination Port**: The encapsulated traffic is sent to a monitoring device connected to a destination port where the GRE packets are decapsulated and analyzed.|
| **Benefits** | - Simplicity: Easy to configure and manage. <br> - Low Latency: Since it’s confined to a single switch, it introduces minimal delay.|- Extended Coverage: Allows for monitoring across multiple switches.<br> - Flexibility: Can be used to monitor traffic from different parts of the network. | - Broad Coverage: Enables monitoring across different IP networks and locations. <br> - Flexibility: Can be used in scenarios where traffic needs to be monitored over long distances or through complex network paths.|
| **Limitations** | Local Scope: Limited to monitoring within the same switch, which might not be sufficient for larger networks.|Network Load: Potentially increases the load on the network due to the RSPAN VLAN traffic.| |

**Select mirroring method**

When selecting a mirroring method, consider the following factors:

|Factors| Description |
|---|---|
|Network Size and Layout | - SPAN is suitable for local monitoring. <br>- RSPAN for larger, multi-switch environments <br> - ERSPAN for geographically dispersed or complex networks.|
|Traffic Volume | Ensure that the chosen method can handle the volume of traffic without introducing significant latency or network load.|
|Monitoring Needs| Determine if traffic is captured locally or across different network segments and choose the appropriate method.|

By selecting the appropriate mirroring method, you ensure that your network sensor captures the necessary Layer 2 (L2) traffic, and provides high-quality data for accurate inventory and traffic analysis.

For more information, see [traffic mirroring process](traffic-mirroring/traffic-mirroring-overview.md#traffic-mirroring-processes).

## Deploy the sensors

After choosing the sensor location and mirroring method, install the sensors. For more information see [install software on OT sensors](/ot-deploy/install-software-ot-sensor.md/).

## Post deployment validation

It's essential to validate the monitoring interfaces and activate them. We recommend using the Deployment tool in the sensor system setting to monitor the networks <!-- or network data?? Theo -->being sent to the sensor.  

:::image type="content" source="media/guide/deployment-guide-post-deployment-system-settings.png" alt-text="Screenshot of the OT sensor systems settings screen, highlighting the Deployment box to be used to help validate the post OT sensor deployment.":::

Key steps include:

- Verify that the number of devices in the inventory is reasonable.  For more information, see 

- Check the type classification for devices listed in the inventory. For more information, see 

- Confirm the visibility of OT protocol names on the device's inventory. For more information, see 

- Ensure L2 protocols are monitored by identifying MAC addresses in the inventory. For more information, see 

If information doesn't appear, review the SPAN configuration and recheck the deployment tool in the sensor which provides visibility of the subnets monitored and the status of the OT protocols, for example:

:::image type="content" source="media/guide/deployment-guide-post-deployment-analyze.png" alt-text="Screenshot of the OT sensor Analyze feature screen used to help validate the post OT sensor deployment.":::

## Network diagram examples

This needs an introduction or further descriptions.<!--Theo-->

### L2 traffic

:::image type="content" source="media/guide/deployment-guide-network-diagram-l2-traffic.png" alt-text="Diagram to demonstrate the components set up of the L2 traffic monitoring setup.":::

### Cross L2 traffic

:::image type="content" source="media/guide/deployment-guide-network-diagram-cross-l2-traffic.png" alt-text="Diagram to demonstrate the components set up of the cross L2 traffic monitoring setup.":::

### Cross L3 traffic

:::image type="content" source="media/guide/deployment-guide-network-diagram-cross-l3-traffic.png" alt-text="Diagram to demonstrate the components set up of the cross L3 traffic monitoring setup.":::
