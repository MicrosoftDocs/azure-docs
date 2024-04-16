---
title: Configure routers for a Highly Available (HA) deployment
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to configure your routers for a Highly Available (HA) Azure Private 5G Core deployment
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 04/30/2024
ms.custom: template-how-to 
---

# Configure routers for a Highly Available (HA) deployment

For a Highly Available Azure Private 5G Core deployment, you will need to deploy a gateway router (strictly, a Layer 3 capable device – either a router or an L3 switch (router/switch hybrid)) in between the ASE cluster and:

- the RAN equipment in the access network
- the data network(s).
 
This how-to guide describes the configuration required on your routers to support an HA deployment.

### Access network router

Configure routers in the access network with the following static routes.

|Destination  |Prefix length   |Next hop  |Priority (lower values are more preferred)  |
|---------|---------|---------|---------|
|Virtual N2 | 32 |One of the IP addresses defined in the Access Network section above as vNIC addresses on the AMFs’ interfaces to the local access subnet. | 10 |
|Virtual N2 | 32 |The other IP address defined in the Access Network section above as vNIC addresses on the AMFs’ interfaces to the local access subnet. | 10 |
|Virtual N3 | 32 |The preferred IP address defined in the Access Network section above as one of the vNIC addresses on the UPFs’ interfaces to the local access subnet.* | 10 |
|Virtual N3 | 32 |The non-preferred IP address defined in the Access Network section above as one of the vNIC addresses on the UPFs’ interfaces to the local access subnet.* | 20 |

*See the [Gateway router](#gateway-router) section for how to view the preferred and non-preferred IP addresses.

### Data network router

If network address translation (NAT) is not enabled, configure the routers in each data network with the following static routes. Note that, as for user plane traffic in the access network, one of the static routes is preferred to the other so that, in normal operation, all data network traffic uses the same route. Each data network supports a single subnet.

|Destination  |Prefix length   |Next hop  |Priority (lower values are more preferred)  |
|---------|---------|---------|---------|
|All UE subnets | Variable |DN preferred vNIC (vNIC addresses on the UPFs’ interfaces to the DN).| 10        |
|All UE subnets | Variable |DN preferred vNIC (vNIC addresses on the UPFs’ interfaces to the DN).| 20        |

### Gateway router

To determine how to configure the static routes on the gateway routers, navigate to your **Packet Core Control Plane** resource in the Azure portal. Under **Settings**, select **Router configuration**. The router configuration will give the N2S1 and N3 virtual addresses, as well as the IP prefix for all UE pools for each data network. Each of these destinations will come with their next hops and relative priorities.

### Bi-directional Forwarding Detection (BFD)

The access and data network routers must have the following BFD sessions configured:

- Two BFD sessions between the access network router and the pair of AMF vNIC addresses.
- Two BFD sessions between the access network router and the pair of UPF vNIC addresses in the access network.
- Two BFD sessions per DN between the DN router and the pair of UPF vNIC addresses in that DN.

BFD sessions on the access data network routers should be configured to use a polling interval of 200ms. The maximum tolerable packet loss should be set to 3 packets (this is the default on most routers).

The purpose of the BFD sessions is that the router(s) will rapidly detect the failure of an ASE through a BFD session going down and will immediately redirect all traffic to the other ASE.  With the recommended settings, BFD will be able to detect failure in about 600ms; this will ensure that traffic should be restored in less than 1.5 seconds.

## Next steps

Your network should now be ready to support a Highly Available AP5GC deployment. The next step is to collect the information you'll need to deploy your private network.

- [Collect the required information to deploy a private mobile network](./collect-required-information-for-private-mobile-network.md)
