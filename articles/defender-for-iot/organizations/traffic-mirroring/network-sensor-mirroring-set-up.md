---
title: Deployment guide for deploying an OT network sensor - Microsoft Defender for IoT
description: A quick guide for the correct placement and mirroring of the OT sensor in your network for Microsoft Defender for IoT.
ms.topic: install-set-up-deploy
ms.date: 10/30/2024
---

# Network sensor mirroring set up

This article provides a step-by-step approach to successfully deploying your network sensor, and ensuring the correct traffic mirroring and security are chosen. The five deployment steps are as follows:

1. Network architecture review
1. Sensor location
1. Traffic Mirroring Methods
1. Deploy the sensors
1. Post-deployment validation

Follow these guidelines to optimize your sensor performance and achieve accurate and reliable network data collection.

## Review the network architecture

Before you deploy the sensor to the network, it's crucial to review the network architecture. These steps include:

- Review the network diagram. For more information, see [review architecture](../best-practices/understand-network-architecture.md) or [create a network diagram](../best-practices/plan-prepare-deploy.md#create-a-network-diagram).

- Estimate the total number of devices to be monitored. For more information, see [calculate devices in your network](../best-practices/plan-prepare-deploy.md#calculate-devices-in-your-network).

- Identify VLANs that contain OT networks. For more information, see [customize a VLAN name](../how-to-control-what-traffic-is-monitored.md#customize-a-vlan-name).

- Determine which OT protocols need to be monitored (Profinet, S7, Modbus etc..). For more information, see [supported protocols](../concept-supported-protocols.md).

## Selecting sensor locations and traffic mirroring method

Based on the network architecture and the chosen mirroring method, select the best locations for your network sensors ensuring that they capture the necessary Layer 2 (L2) traffic.

Complile a list all of the locations to place the sensors.<!-- should we write this about 1 sensor or a bunch of sensors? Theo -->

For more information, see [identifying interesting traffic points](../best-practices/understand-network-architecture.md#identifying-interesting-traffic-points).

## Validate the sensor location

After deciding on a potential location for the sensor, users should validate the presence of L2 <!-- traffic - theo -->and OT protocols. It's recommended to use tools like Wireshark to verify these protocols at the potential sensor location. For example:

:::image type="content" source="media/guide/deployment-guide-analyzer.png" alt-text="Screenshot of the wireshark program used to confirm and validate OT sensor set up and network protocols communicating with the newly deployed OT sensor":::

Wireshark displays the list of protocols identified by the sensor and the amount of data being monitored, thereby validating the location of your sensor. If protocols don't appear or don't detect any data, this indicates that the sensor is incorrectly placed or set up in the network. For example:

:::image type="content" source="media/guide/deployment-guide-protocols.png" alt-text="Screenshot of the wireshark program protocol output used to confirm and validate OT sensor set up and network protocols communicating with the newly deployed OT sensor":::

This step is crucial to ensure effective monitoring of your OT networks.  For more information, see [is this a good example](configure-mirror-span.md#validate-traffic-mirroring)....<!-- Theo is there a link for this? -->

## Deploy your sensor

After validating the sensor and mirroring method, deploy the sensors. For more information see [install software on OT sensors](../ot-deploy/install-software-ot-sensor.md).

## Validate after deployment

It's essential to validate the monitoring interfaces and activate them. We recommend using the Deployment tool in the sensor system setting to monitor the networks being monitored by the sensor.

:::image type="content" source="media/guide/deployment-guide-post-deployment-system-settings.png" alt-text="Screenshot of the OT sensor systems settings screen, highlighting the Deployment box to be used to help validate the post OT sensor deployment.":::

To validate your sensor:

1. Verify that the number of devices in the inventory is reasonable.

1. Check the type classification for devices listed in the inventory.

1. Confirm the visibility of OT protocol names on the device's inventory.

1. Ensure L2 protocols are monitored by identifying MAC addresses in the inventory.

If information doesn't appear, review the SPAN configuration and recheck the deployment tool in the sensor which provides visibility of the subnets monitored and the status of the OT protocols, for example:

:::image type="content" source="media/guide/deployment-guide-post-deployment-analyze.png" alt-text="Screenshot of the OT sensor Analyze feature screen used to help validate the post OT sensor deployment.":::
