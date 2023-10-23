---
title: What is Azure IoT Layered Network Management?
# titleSuffix: Azure IoT Layered Network Management
description: Learn about Azure IoT Layered Network Management.
author: PatAltimore
ms.author: patricka
ms.topic: concept-article
ms.date: 10/17/2023

#CustomerIntent: As an operator, I want understand how to use Azure IoT Layered Network Management to secure my devices.
---

# What is Azure IoT Layered Network Management?

Layered Network Management, formerly known as E4IN, is a Kubernetes-based solution that provides secure communication between devices and the cloud through **isolated network environments** based on the ISA-95/Purdue Network architecture. This solution is deployed and managed as a component of Alice Springs on Arc-enabled Kubernetes clusters.  

Layered Network Management provides several benefits including:

* Kubernetes-based configuration and compatibility with IP and NIC mapping for crossing levels
* Connecting devices in isolated networks at scale to [Azure Arc](https://learn.microsoft.com/en-us/azure/azure-arc/) for application life cycle management and configuration of previously isolated resources remotely from a single Azure control plane
* Security and governance across network levels for devices and services with URL allow lists and connection auditing for deterministic network configurations  
* Kubernetes observability tooling for previously isolated devices and applications across levels
* Default compatibility with all Alice Springs service connections 

![image](LNM_overview.png)

## Terminology

| Term | Definition |
|---|---|
| E4IN | Edge for Isolated Networks. This project name is deprecated and replaced with **Layered Network Management** |
| ISA-95 | Enterprise-Control system integration standard published by the International Society of Automation (ISA) |
|Purdue Enterprise Reference Architecture (PERA) | Purdue Enterprise Reference Architecture (PERA) is a 1990s reference model for enterprise architecture, developed by Theodore J. Williams and members of the Industry-Purdue University Consortium for Computer Integrated Manufacturing |
| Kubernetes Custom Resources (CR) | From [Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/): A custom resource is an extension of the Kubernetes API that is not necessarily available in a default Kubernetes installation. It represents a customization of a particular Kubernetes installation. |
| Kubernetes Custom Resource Definition (CRD) | From [Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions): Defining a CRD object creates a new custom resource with a name and a schema |
| AKS EE | [AKS Edge Essentials](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-overview), a Microsoft-supported Kubernetes platform. |

## Isolated Network Environment for deploying Layered Network Management

There are several ways to try the Layered Network Management and experience its capability to bridge the connection between cluster in isolated network and service on Azure. The following network environments and clusters scenarios are examples for trying the Layered Network Management.

- **A simplified virtually machine and network** - This scenario uses an [Azure AKS](https://learn.microsoft.com/en-us/azure/aks/) cluster and an Azure Linux VM. You need an Azure subscription and with the following resources:
  - An [AKS cluster](https://azure.microsoft.com/en-us/products/kubernetes-service) (L4/5). 
  - An [Azure Linux VM](https://azure.microsoft.com/en-us/products/virtual-machines) (L3). 
- **A simplified physically isolated network** - Requires three physical devices (IoT/PC/server) and a wireless access point.
  1. The wireless access point is used for setting up a local network and **does not** provide internet access.
  2. Level 4 cluster - A single node cluster hosted on a dual NIC physical machine, connects to internet and the local network.
  3. Level 3 cluster - Another single node cluster hosted on a physical machine. This device (cluster) only connects to the local network.
  4. DNS server - A DNS server setup in the local network. It provides custom domain name resolution and point the network request to the IP of level 4 cluster.
- **ISA-95 network in real-world** - We encourage you to try deploying Layered Network Management to a real ISA-95 network, or a pre-production environment. Please engage with the Layered Network Management core team for further discussion on this approach.

## Key features and roadmap

Layered Network Management supports the Alice Spring components functioning in an isolated network environment. The following table summarizes supported or planned features and integration.

| Layered Network Management features | Status |
|------------------------------------------------------------------------------------------|:---:|
|Forward TLS traffic|Supported|
|Traffic Auditing - Basic: Source/destination IP addresses and header values|Supported|
|Allow list management through Kubernetes Custom Resource|Supported|
|Installation: Integrated install experience of Layered Network Management and other Alice Spring components|Supported|
|Reverse Proxy for OSI Layer4 (TCP)|Supported|
|Support East-West traffic forwarding for Alice Spring components (manual setup)|Public Preview|
|Installation: Layered Network Management deployed as an Arc extension|Public Preview|
|Traffic Auditing - Basic: Send a copy of the traffic (encrypted) to a configured application|Post Public Preview|
|Azure Arc portal experience for Layered Network Management|Post Public Preview|
|Forward Proxy for OSI Layer7 (HTTP, HTTPS / MQTT over WebSockets)|Post Public Preview|
|TLS terminating proxy for OSI Layer7 (HTTPS / MQTT over Websockets)|Post Public Preview|

<br />

| Integration with Arc and Alice Spring | Status |
|---|:----:|
|Azure Arc foundation|Supported|
|Arc-enabled Kubernetes|Supported|
|Arc-enabled Server|Public preview|
|Alice Spring deployment|Public preview|
|MQTT broker|Public Preview|
|MQTT bridge|Public Preview|
|Azure Monitor|Public Preview|


## Next steps

Follow the [quickstart to deploy and try Layered Network Management in a test environment](./deploy-e4in-to-aks).

Or the following for more detail:
- [Setup an Isolated Networks Environment](./setup-isolated-network)
- [Arc-enable AKS EE in Isolated Networks](/docs/e4in/arc-enable-aks-ee)

## Related content

TODO: Add your next step link(s)


<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->