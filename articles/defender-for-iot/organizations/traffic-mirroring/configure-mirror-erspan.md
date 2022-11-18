---
title: Configure traffic mirroring with an encapsulated remote switched port analyzer (ERSPAN) - Microsoft Defender for IoT
description: This article describes traffic mirroring with ERSPAN for monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---

# Configure traffic mirroring with an encapsulated remote switched port analyzer (ERSPAN)

Use an encapsulated remote switched port analyzer (ERSPAN) to mirror input interfaces over an IP network to your OT sensor's monitoring interface, when securing remote networks with Defender for IoT.

The sensor's monitoring interface is a promiscuous interface and does not have a specifically allocated IP address. When ERSPAN support is configured, traffic payloads that are ERSPAN encapsulated with GRE tunnel encapsulation will be analyzed by the sensor.

Use ERSPAN encapsulation when there is a need to extend monitored traffic across Layer 3 domains. ERSPAN is a Cisco proprietary feature and is available only on specific routers and switches. For more information, see the [Cisco documentation](https://learningnetwork.cisco.com/s/article/span-rspan-erspan).


> [!NOTE]
> This article provides high-level guidance for configuring traffic mirroring with ERSPAN. Specific implementation details will vary depending on your equiptment vendor.
>

## ERSPAN architecture

ERSPAN sessions include a source session and a destination session configured on different switches. Between the source and destination switches, traffic is encapsulated in GRE, and can be routed over layer 3 networks.

For example:

:::image type="content" source="../media/traffic-mirroring/erspan.png" alt-text="Diagram of traffic mirrored from an air-gapped or industrial network to an OT network sensor using ERSPAN." border="false":::

ERSPAN transports mirrored traffic over an IP network using the following process:

1. A source router encapsulates the traffic and sends the packet over the network.
1. At the destination router, the packet is de-capsulated and sent to the destination interface.

ERSPAN source options include elements such as:

- Ethernet ports and port channels
- VLANs; all supported interfaces in the VLAN are ERSPAN sources
- Fabric port channels
- Satellite ports and host interface port channels

> [!TIP]
> When configuring ERSPAN, we recommend using your receiving router as the generic routing encapsulation (GRE) tunnel destination.
>

## Configure ERSPAN on your OT network sensor

Newly installed OT network sensors have ERSPAN and GRE header stripping turned off by default. To turn on support for ERSPAN, you'll need to configure your ERSPAN interfaces and then enable the RCDCAP component to restart your monitoring processes.

ERSPAN support is configured in the **Select erspan monitor interfaces** screen, which appears during your first software installation on the appliance. For example:

:::image type="content" source="../media/tutorial-install-components/erspan-monitor.png" alt-text="Screenshot of the select erspan monitor screen.":::

To access this screen later on, sign in to your sensor via SSH as the *cyberx_host* user and run the following command:

```console
sudo dpkg-reconfigure iot-sensor
```

The installation wizard starts to run, and you can select the interfaces you want to receive ERSPAN traffic.

Complete the wizard to apply your changes.

For more information, see [Install OT monitoring software](../how-to-install-software.md#install-ot-monitoring-software).
## Sample configuration on a Cisco switch

The following code shows a sample `ifconfig` output for ERSPAN configured on a Cisco switch:

```cli
monitor session 1 type erspan-source
description ERSPAN to D4IoT
erspan-id 32                              # required, # between 1-1023
vrf default                               # required
destination ip 172.1.2.3                  # IP address of destination
source interface port-channel1 both       # Port(s) to be sniffed
filter vlan 1                             # limit VLAN(s) (optional)
no shut                                   # enable

monitor erspan origin ip-address 172.1.2.1 global
```

## Next steps

For more information, see:

- [Traffic mirroring methods for OT monitoring](../best-practices/traffic-mirroring-methods.md)
- [Prepare your OT network for Microsoft Defender for IoT](../how-to-set-up-your-network.md)
