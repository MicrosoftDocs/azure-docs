---
title: What is Azure IoT Layered Network Management (preview)?
description: Learn about Azure IoT Layered Network Management (preview).
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 10/22/2024

#CustomerIntent: As an operator, I want understand how to use Azure IoT Layered Network Management to secure my devices.
ms.service: azure-iot-operations
---

# What is Azure IoT Layered Network Management (preview)?

Azure IoT Layered Network Management (preview) service is a component that facilitates the connection between Azure and clusters in isolated network environment. In industrial scenarios, the isolated network follows the *[ISA-95](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa95)/[Purdue Network architecture](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture)*. The Layered Network Management (preview) service can route the network traffic from a non-internet facing layer through an internet facing layer and then to Azure. You have to deploy the Layered Network Management and configure it properly for your network environment before deploying the Azure IoT Operations on Arc-enabled Kubernetes clusters. Review the network architecture of your solution and use the Layered Network Management service if it's applicable and necessary for your scenarios. If you integrated other mechanisms of controlling internet access for the isolated network, you should compare the functionality with Layered Network Management service and choose the one that fits your needs the best. Layered Network Management is an optional component and it's not a dependency for any feature of Azure IoT Operations service.

> [!IMPORTANT]
> The network environments outlined in Layered Network Management documentation are examples for testing the Layered Network Management. It's not a recommendation of how you build your network and cluster topology for productional usage.
>
> Although network isolation is a security topic, the Layered Network Management service isn't designed for increasing the security of your solution. It's designed for maintaining the security level of your original design as much as possible while enabling the connection to Azure Arc.

Layered Network Management (preview) provides several benefits including:

* Kubernetes-based configuration and compatibility with IP and NIC mapping for crossing levels
* Ability to connect devices in isolated networks at scale to [Azure Arc](/azure/azure-arc/) for application lifecycle management and configuration of previously isolated resources remotely from a single Azure control plane
* Security and governance across network levels for devices and services with URL allowlists and connection auditing for deterministic network configurations
* Kubernetes observability tooling for previously isolated devices and applications across levels
* Default compatibility with all Azure IoT Operations service connections

:::image type="content" source="./media/concept-layered-network/layered-network-management-overview.png" alt-text="Diagram of Layered Network Management." lightbox="./media/concept-layered-network/layered-network-management-overview.png":::

## Isolated network environment for deploying Layered Network Management (preview)

There are several ways to configure Layered Network Management (preview) to bridge the connection between clusters in the isolated network and services on Azure. The following lists example network environments and cluster scenarios for Layered Network Management.

- **A simplified virtual machine and network** - This scenario uses an [Azure AKS](/azure/aks/) cluster and an Azure Linux VM. You need an Azure subscription the following resources:
  - An [AKS cluster](/azure/aks/concepts-clusters-workloads) for layer 4 and 5.
  - An [Azure Linux VM](/azure/virtual-machines/) for layer 3. 
- **A simplified physically isolated network** - Requires at least two physical devices (IoT/PC/server) and a wireless access point. This setup simulates a simple two-layer network (level 3 and level 4). Level 3 is the isolated cluster and is the target for deploying the Azure IoT Operations.
  - The wireless access point is used for setting up a local network and **doesn't** provide internet access.
  - Level 4 cluster - A single node cluster hosted on a dual NIC physical machine, connects to internet and the local network. Layered Network Management should be deployed to this cluster.
  - Level 3 cluster - Another single node cluster hosted on a physical machine. This device cluster only connects to the local network.
  - Custom DNS - A DNS server setup in the local network or CoreDNS configuration on the level 3 cluster. It provides custom domain name resolution and points the network request to the IP of level 4 cluster.
- **ISA-95 network** - You should try deploying Layered Network Management to an ISA-95 network or a preproduction environment.

## Key features

Layered Network Management supports the Azure IoT Operations components in an isolated network environment. The following table summarizes supported features and integration:

| Layered Network Management features | Status |
|------------------------------------------------------------------------------------------|:---:|
|Forward TLS traffic|Public preview|
|Traffic Auditing - Basic: Source/destination IP addresses and header values|Public preview|
|Allowlist management through [Kubernetes Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)|Public preview|
|Installation: Integrated install experience of Layered Network Management and other Azure IoT Operations components|Public preview|
|Reverse Proxy for OSI Layer 4 (TCP)|Public preview|
|Support East-West traffic forwarding for Azure IoT Operations components - manual setup |Public Preview|
|Installation: Layered Network Management deployed as an Arc extension|Public Preview|

## Next steps

- Learn [How does Azure IoT Operations work in layered network?](concept-iot-operations-in-layered-network.md)
- [Set up Layered Network Management in a simplified virtual machine and network environment](howto-deploy-aks-layered-network.md) to try an example with Azure virtual resources. It's the quickest way to see how Layered Network Management works without having to set up physical machines and Purdue Network.
