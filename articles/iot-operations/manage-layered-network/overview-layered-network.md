---
title: What is Azure IoT Layered Network Management?
# titleSuffix: Azure IoT Layered Network Management
description: Learn about Azure IoT Layered Network Management.
author: PatAltimore
ms.author: patricka
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 10/24/2023

#CustomerIntent: As an operator, I want understand how to use Azure IoT Layered Network Management to secure my devices.
---

# What is Azure IoT Layered Network Management?

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT Layered Network Management service is a component that facilitates the connection between Azure and clusters in isolated network environment. In industrial scenarios, the isolated network follows the *[ISA-95](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa95)/[Purdue Network architecture](http://www.pera.net/)*. The Layered Network Management service can route the network traffic from a non-internet facing layer through an internet facing layer and then to Azure. This service is deployed and managed as a component of Azure IoT Operations Preview on Arc-enabled Kubernetes clusters. Review the network architecture of your solution and use the Layered Network Management service if it's applicable and necessary for your scenarios. If you have already integrated other mechanism of controlling internet access for the isolated network, you should compare the functionality with Layered Network Management service and choose the one that fits your needs the best. Layered Network Management is an optional component and it's not a dependency for any feature of Azure IoT Operations Preview.

> [!IMPORTANT]
> The network environments outlined in Layered Network Management documentation are examples for testing the Layered Network Management. It's not a recommendation of how you build your network and cluster topology for productional usage.
>
> Although network isolation is a security topic, the Layered Network Management service isn't designed for increasing the security of your solution. It's designed for maintaining the security level of your original design as much as possible while enabling the connection to Azure Arc.

Layered Network Management provides several benefits including:

* Kubernetes-based configuration and compatibility with IP and NIC mapping for crossing levels
* Ability to connect devices in isolated networks at scale to [Azure Arc](/azure/azure-arc/) for application lifecycle management and configuration of previously isolated resources remotely from a single Azure control plane
* Security and governance across network levels for devices and services with URL allowlists and connection auditing for deterministic network configurations
* Kubernetes observability tooling for previously isolated devices and applications across levels
* Default compatibility with all Azure IoT Operations service connections

:::image type="content" source="./media/concept-layered-network/layered-network-management-overview.png" alt-text="Diagram of Layered Network Management." lightbox="./media/concept-layered-network/layered-network-management-overview.png":::

## Isolated network environment for deploying Layered Network Management

There are several ways to configure Layered Network Management to bridge the connection between clusters in the isolated network and services on Azure. The following lists example network environments and cluster scenarios for Layered Network Management.

- **A simplified virtual machine and network** - This scenario uses an [Azure AKS](/azure/aks/) cluster and an Azure Linux VM. You need an Azure subscription the following resources:
  - An [AKS cluster](/azure/aks/concepts-clusters-workloads) for layer 4 and 5.
  - An [Azure Linux VM](/azure/virtual-machines/) for layer 3. 
- **A simplified physically isolated network** - Requires three physical devices (IoT/PC/server) and a wireless access point.
  - The wireless access point is used for setting up a local network and **doesn't** provide internet access.
  - Level 4 cluster - A single node cluster hosted on a dual NIC physical machine, connects to internet and the local network.
  - Level 3 cluster - Another single node cluster hosted on a physical machine. This device cluster only connects to the local network.
  - DNS server - A DNS server setup in the local network. It provides custom domain name resolution and point the network request to the IP of level 4 cluster.
- **ISA-95 network** - You should try deploying Layered Network Management to an ISA-95 network or a preproduction environment.

## Key features

Layered Network Management supports the Azure IoT Operations components in an isolated network environment. The following table summarizes supported features and integration:

| Layered Network Management features | Status |
|------------------------------------------------------------------------------------------|:---:|
|Forward TLS traffic|Public preview|
|Traffic Auditing - Basic: Source/destination IP addresses and header values|Public preview|
|Allowlist management through [Kubernetes Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)|Public preview|
|Installation: Integrated install experience of Layered Network Management and other Azure IoT Operations components|Public preview|
|Reverse Proxy for OSI Layer4 (TCP)|Public preview|
|Support East-West traffic forwarding for Azure IoT Operations components - manual setup |Public Preview|
|Installation: Layered Network Management deployed as an Arc extension|Public Preview|

## Next steps
- [Setup Layered Network Management in a simplified virtual machine and network environment](howto-deploy-aks-layered-network.md)
