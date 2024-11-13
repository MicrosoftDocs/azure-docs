---
title: Deployment guide for deploying an OT network sensor - Microsoft Defender for IoT
description: A quick guide for the correct placement and mirroring of the OT sensor in your network for Microsoft Defender for IoT.
ms.topic: install-set-up-deploy
ms.date: 10/30/2024
---

# Network sensor mirroring set up

This guide provides a step-by-step approach to successfully deploying your network sensor deployment, and ensuring comprehensive network monitoring and security. The five deployment steps are as follows:

1. Network architecture review
1. Sensor location
1. Traffic Mirroring Methods
1. Deploy the sensors
1. Post-deployment validation

Follow these guidelines to optimize your sensor performance and achieve accurate and reliable network data collection.

## Network architecture review

Before the sensor can be applied to the network, it's crucial to review the network architecture. These steps include:

- Review the network diagram. For more information, see [review architecture](/best-practices/understand-network-architecture.md) or [create a network diagram](/best-practices/plan-prepare-deploy.md#create-a-network-diagram).

- Estimate the total number of devices to be monitored. For more information, see [calculate devices in your network](/best-practices/plan-prepare-deploy.md#calculate-devices-in-your-network).

- Identify VLANs that contain OT networks. For more information, see [customize a VLAN name](../how-to-control-what-traffic-is-monitored.md#customize-a-vlan-name).

- Determine which OT protocols need to be monitored (Profinet, S7, Modbus etc..). For more information see [supported protocols](concept-supported-protocols.md).

## Choose Sensor locations and the traffic mirroring method

Using the 
By selecting the appropriate mirroring method, you ensure that your network sensor captures the necessary Layer 2 (L2) traffic, and provides high-quality data for accurate inventory and traffic analysis.

For more information, see [traffic mirroring process](traffic-mirroring/traffic-mirroring-overview.md#traffic-mirroring-processes).

## Validate the sensor location

After deciding on a potential location for the sensor, users should validate the presence of L2 and OT protocols. It's recommended to use tools like Wireshark to verify these protocols at the potential sensor location. For example:

:::image type="content" source="media/guide/deployment-guide-analyzer.png" alt-text="Screenshot of the wireshark program used to confirm and validate OT sensor set up and network protocols communicating with the newly deployed OT sensor":::

Wireshark displays the list of protocols identified by the sensor and the amount of data being monitored, thereby validating the location of your sensor. If protocols don't appear or don't detect any data, this indicates that the sensor is incorrectly placed or set up in the network. For example:

:::image type="content" source="media/guide/deployment-guide-protocols.png" alt-text="Screenshot of the wireshark program protocol output used to confirm and validate OT sensor set up and network protocols communicating with the newly deployed OT sensor":::

This step is crucial to ensure effective monitoring of OT networks.  For more information, see Theo is there a link for this?

After validating the sensor and mirroring method, install the sensors. For more information see [install software on OT sensors](ot-deploy/install-software-ot-sensor.md).

## Post deployment validation

It's essential to validate the monitoring interfaces and activate them. We recommend using the Deployment tool in the sensor system setting to monitor the networks being monitored by the sensor.  

:::image type="content" source="media/guide/deployment-guide-post-deployment-system-settings.png" alt-text="Screenshot of the OT sensor systems settings screen, highlighting the Deployment box to be used to help validate the post OT sensor deployment.":::

Key steps include:

- Verify that the number of devices in the inventory is reasonable.

- Check the type classification for devices listed in the inventory.

- Confirm the visibility of OT protocol names on the device's inventory.

- Ensure L2 protocols are monitored by identifying MAC addresses in the inventory.

If information doesn't appear, review the SPAN configuration and recheck the deployment tool in the sensor which provides visibility of the subnets monitored and the status of the OT protocols, for example:

:::image type="content" source="media/guide/deployment-guide-post-deployment-analyze.png" alt-text="Screenshot of the OT sensor Analyze feature screen used to help validate the post OT sensor deployment.":::
