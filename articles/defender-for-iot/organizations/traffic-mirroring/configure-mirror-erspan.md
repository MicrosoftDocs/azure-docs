---
title: Configure traffic mirroring with an encapsulated remote switched port analyzer (ERSPAN) - Microsoft Defender for IoT
description: This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---

# Configure traffic mirroring with an encapsulated remote switched port analyzer (ERSPAN)

When preparing your network for OT traffic monitoring with Defender for IoT, you can configure traffic mirroring using an encapsulated remote switched port analyzer (ERSPAN).

Use this method when TBD.

This article provides high-level guidance for configuring traffic mirroring with ERSPAN. Specific implementation details will vary depending on your equiptment vendor.


## ERSPAN architecture

ERSPAN sessions include a source session and a destination session configured on different switches. Between the source and destination switches, traffic is encapsulated in generic routing encapsulation (GRE), and can be routed over layer 3 networks.

For example:


ERSPAN transports mirrored traffic over an IP network using the following process:

1. A source router encapsulates the traffic and sends the packet over the network.
1. At the destination router, the packet is de-capsulated and sent to the destination interface.

ERSPAN source options include elements such as:

- Ethernet ports and port channels
- VLANs; all supported interfaces in the VLAN are ERSPAN sources
- Fabric port channels
- Satellite ports and host interface port channels

## Configure ERSPAN on your OT network sensor

Newly installed OT network sensors have ERSPAN and GRE header stripping turned off by default.

**To turn on support for ERSPAN on your OT sensor**:

1. Sign in to your sensor via SSH. <!--which user?-->

1. Run the following command to open the `network.properties` for editing:

    ```cli
    sudo nano /var/cyberx/properties/network.properties
    ```
1. Modify the `monitor_erspan_interfaces` value with the interfaces that you want to monitor using ERSPAN. You do *not* need to run the `interfaces-apply` command as the update is automatically applied.

1. Restart monitoring processes on your sensor. Run:

    ```
    sudo cyberx-xsense-components-enable -n "rcdcap"
    ```

1. To verify your updates: 

Enabling ERSPAN support requires setting up the erspan interfaces and enabling the rcdcap component: 

Login by SSH  

Edit interfaces in network.properties 

 

 


All passive traffic dissectors will restart. 

Verifying your configuration 

In ifconfig you will see a new interface with erspan. 

This renames and clones the original interface. The empty one shown is empty. 

Example configuration (Cisco Switch) 

Note: Use your receiving router as the GRE tunnel's destination and mirror the input interface to your D4IoT sensor's monitor interface. 


Note: The sensor monitoring interface does not have an allocated IP address. When ERSPAN support is enabled for the sensor interface, GRE headers will be stripped from the monitored traffic. 
## Sample configuration on a Cisco switch

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