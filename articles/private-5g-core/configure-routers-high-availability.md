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

In a Highly Available Azure Private 5G Core deployment, the Azure Kubernetes Service (AKS) cluster runs on a two-node cluster of ASE devices. The ASE devices are deployed in an active / standby configuration, with the backup ASE rapidly taking over service in the event of a failure. Incoming traffic uses a virtual IP address which is routed to the active ASE's virtual network interface card (vNIC). Bidirectional Forwarding Detection (BFD) is used to detect failures.

This requires you to deploy a gateway router between the ASE cluster and:

- the RAN equipment in the access network
- the data networks.

The routers should rapidly detect the failure of an ASE device through a BFD session going down and immediately redirect all traffic to the other ASE. With the recommended settings, BFD should be able to detect failure in about one second, ensuring that traffic should be restored in less than 2.5 seconds. User plane state is replicated across the two ASEs to ensure the backup can take over immediately.

:::image type="content" source="media/ha-summary.png" alt-text="Diagram showing the routing configuration in a highly available deployment.":::

This how-to guide describes the configuration required on your router or routers to support an HA deployment. The gateway router for the access network and the gateway router for the data networks may be the same device or separate devices.

## Prerequisites

- Complete all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md) and [Commission the AKS cluster](commission-cluster.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.

## Collect router configuration values

To determine how to configure the static routes on the gateway routers, navigate to your **Packet Core Control Plane** resource in the Azure portal. Under **Settings**, select **Router configuration**. This shows the N2S1 and N3 virtual IP addresses, the IP prefix for all UE pools for each data network and the next hops and relative priorities.

## Configure the access network router

Configure the router in the access network with the following static routes. The IP addresses defined in the access network are described in [private mobile network prerequisites](/azure/private-5g-core/complete-private-mobile-network-prerequisites).

|Destination  |Prefix length   |Next hop  |Priority (lower values are more preferred)  |
|---------|---------|---------|---------|
|Virtual N2 | 32 |One of the IP addresses defined in the access network as vNIC addresses on the AMFs’ interfaces to the local access subnet. | 10 |
|Virtual N2 | 32 |The other IP address defined in the access network as vNIC addresses on the AMFs’ interfaces to the local access subnet. | 10 |
|Virtual N3 | 32 |The preferred IP address defined in the access network as one of the vNIC addresses on the UPFs’ interfaces to the local access subnet. | 10 |
|Virtual N3 | 32 |The non-preferred IP address defined in the access network as one of the vNIC addresses on the UPFs’ interfaces to the local access subnet. | 20 |

### Configure BFD on the access network router

The access network router must be configured with the following BFD sessions:

- Two BFD sessions between the access network router and the pair of AMF vNIC addresses.
- Two BFD sessions between the access network router and the pair of UPF vNIC addresses in the access network.

BFD sessions on the access data network routers should be configured to use a polling interval of 330 ms. The maximum tolerable packet loss should be set to 3 packets (this is the default on most routers).

## Configure the data network routers

If network address translation (NAT) is not enabled, configure the routers in each data network with the following static routes. For user plane traffic in the access network, one of the static routes is preferred to the other so that, in normal operation, all data network traffic uses the same route. Each data network supports a single subnet.

|Destination  |Prefix length   |Next hop  |Priority (lower values are more preferred)  |
|---------|---------|---------|---------|
|All UE subnets | Variable |DN preferred vNIC (vNIC addresses on the UPFs’ interfaces to the DN).| 10        |
|All UE subnets | Variable |DN preferred vNIC (vNIC addresses on the UPFs’ interfaces to the DN).| 20        |

### Configure BFD on the data network routers

Each data network router must be configured with two BFD sessions between the data network router and the pair of UPF vNIC addresses in that data network.

## Next steps

Your network should now be ready to support a Highly Available AP5GC deployment. The next step is to collect the information you'll need to deploy your private network.

- [Collect the required information to deploy a private mobile network](./collect-required-information-for-private-mobile-network.md)
