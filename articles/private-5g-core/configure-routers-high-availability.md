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

For a Highly Available Azure Private 5G Core deployment, you need to deploy a gateway router (strictly, a Layer 3 capable device – either a router or an L3 switch (router/switch hybrid)) in between the Azure Stack Edge cluster and:

- the RAN equipment in the access network
- the data networks.
 
This how-to guide describes the configuration required on your routers to support an HA deployment.

## Access network router

Configure routers in the access network with the following static routes. The IP addresses defined in the access network are described in [private mobile network prerequisites](/azure/private-5g-core/complete-private-mobile-network-prerequisites).

|Destination  |Prefix length   |Next hop  |Priority (lower values are more preferred)  |
|---------|---------|---------|---------|
|Virtual N2 | 32 |One of the IP addresses defined in the access network as vNIC addresses on the AMFs’ interfaces to the local access subnet. | 10 |
|Virtual N2 | 32 |The other IP address defined in the access network as vNIC addresses on the AMFs’ interfaces to the local access subnet. | 10 |
|Virtual N3 | 32 |The preferred IP address defined in the access network as one of the vNIC addresses on the UPFs’ interfaces to the local access subnet.* | 10 |
|Virtual N3 | 32 |The non-preferred IP address defined in the access network as one of the vNIC addresses on the UPFs’ interfaces to the local access subnet.* | 20 |

*See the [Gateway router](#gateway-router) section for how to view the preferred and non-preferred IP addresses.

## Data network router

If network address translation (NAT) is not enabled, configure the routers in each data network with the following static routes. As for user plane traffic in the access network, one of the static routes is preferred to the other so that, in normal operation, all data network traffic uses the same route. Each data network supports a single subnet.

|Destination  |Prefix length   |Next hop  |Priority (lower values are more preferred)  |
|---------|---------|---------|---------|
|All UE subnets | Variable |DN preferred vNIC (vNIC addresses on the UPFs’ interfaces to the DN).| 10        |
|All UE subnets | Variable |DN preferred vNIC (vNIC addresses on the UPFs’ interfaces to the DN).| 20        |

## Gateway router

To determine how to configure the static routes on the gateway routers, navigate to your **Packet Core Control Plane** resource in the Azure portal. Under **Settings**, select **Router configuration**. This shows the N2S1 and N3 virtual addresses, the IP prefix for all UE pools for each data network and the next hops and relative priorities.

## Bi-directional Forwarding Detection (BFD)

The access and data network routers must have the following BFD sessions configured:

- Two BFD sessions between the access network router and the pair of AMF vNIC addresses.
- Two BFD sessions between the access network router and the pair of UPF vNIC addresses in the access network.
- Two BFD sessions per data network between the data network router and the pair of UPF vNIC addresses in that data network.

BFD sessions on the access data network routers should be configured to use a polling interval of 200 ms. The maximum tolerable packet loss should be set to 3 packets (this is the default on most routers).

The routers should rapidly detect the failure of an Azure Stack Edge device through a BFD session going down and immediately redirect all traffic to the other Azure Stack Edge device. With the recommended settings, BFD should be able to detect failure in about 600 ms, ensuring that traffic should be restored in less than 1.5 seconds.

## Next steps

Your network should now be ready to support a Highly Available AP5GC deployment. The next step is to collect the information you'll need to deploy your private network.

- [Collect the required information to deploy a private mobile network](./collect-required-information-for-private-mobile-network.md)
