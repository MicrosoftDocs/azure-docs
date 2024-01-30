---
title: Configure mirroring with a switch SPAN port - Microsoft Defender for IoT
description: This article describes how to configure a SPAN port for traffic mirroring when monitoring OT networks with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: install-set-up-deploy
---

# Configure mirroring with a switch SPAN port

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Network level deployment highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

Configure a SPAN port on your switch to mirror local traffic from interfaces on the switch to a different interface on the same switch.

This article provides sample configuration processes and procedures for configuring a SPAN port, using either the Cisco CLI or GUI, for a Cisco 2960 switch with 24 ports running IOS.

> [!IMPORTANT]
> This article is intended only as sample guidance and not as instructions. Mirror ports on other Cisco operating systems and other switch brands are configured differently. For more information, see your switch documentation.

## Prerequisites

Before you start, make sure that you understand your plan for network monitoring with Defender for IoT, and the SPAN ports you want to configure.

For more information, see [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md).

## Sample CLI SPAN port configuration (Cisco 2960)

The following commands show a sample process for configuring a SPAN port on a Cisco 2960 via CLI:

```cli
Cisco2960# configure terminal
Cisco2960(config)# monitor session 1 source interface fastehernet 0/2 - 23 rx
Cisco2960(config)# monitor session 1 destination interface fastethernet 0/24
Cisco2960(config)# end
Cisco2960# show monitor 1
Cisco2960# running-copy startup-config
```

## Sample GUI SPAN port configuration (Cisco 2960)

This procedure describes the high-level steps for configuring a SPAN port on a Cisco 2960 via the GUI. For more information, see the relevant Cisco documentation.

From the switch's configuration GUI:

1. Enter the global configuration mode.
1. Configure the first 23 ports as a session source, mirroring only RX packets.
1. Configure port 24 to be a session destination.
1. Return to privileged EXEC mode.
1. Verify the port mirroring configuration.
1. Save the configuration.

## Sample CLI SPAN port configuration with multiple VLANs (Cisco 2960)

Defender for IoT can monitor multiple VLANs configured in your network without any extra configuration, as long as the network switch is configured to send VLAN tags to Defender for IoT.

For example, the following commands must be configured on a Cisco switch to support monitoring VLANs in Defender for IoT:

**Monitor session**: The following commands configure your switch to send VLANs to the SPAN port.

```cli
monitor session 1 source interface Gi1/2
monitor session 1 filter packet type good Rx
monitor session 1 destination interface fastEthernet1/1 encapsulation dot1q
```

**Monitor Trunk Port F.E. Gi1/1**: The following commands configure your switch to support VLANs configured on the trunk port:

```cli
interface GigabitEthernet1/1
switchport trunk encapsulation dot1q
switchport mode trunk
```

[!INCLUDE [validate-traffic-mirroring](../includes/validate-traffic-mirroring.md)]

## Deploy with unidirectional gateways/data diodes

You might deploy Defender for IoT with unidirectional gateways, also known as data diodes. Data diodes provide a secure way to monitor networks as they only allow data to flow in one direction. This means data can be monitored without compromising the security of the network, as data cannot be sent back in the opposite direction. Examples of data diode solutions are [Waterfall](https://waterfall-security.com), [Owl Cyber Defense](https://owlcyberdefense.com/products/data-diode-products/), or [Hirschmann](https://hirschmann.com/en/Hirschmann_Produkte/Hirschmann-News/Rail_Data_Diode/index.phtml).

If unidirectional gateways are needed, we recommend deploying your data diodes on the SPAN traffic going to the sensor monitoring port. For example, use a data diode to monitor traffic from a sensitive system, such as an industrial control system, while keeping the system completely isolated from the monitoring system. 

Place your OT sensors outside the electronic perimeter and have them receive traffic from the diode. In this scenario, you’ll be able to manage your Defender for IoT sensors from the cloud, keeping them automatically updated with the latest threat intelligence packages. 

## Next steps

> [!div class="step-by-step"]
> [« Onboard OT sensors to Defender for IoT](../onboard-sensors.md)

> [!div class="step-by-step"]
> [Provision OT sensors for cloud management »](../ot-deploy/provision-cloud-management.md)

