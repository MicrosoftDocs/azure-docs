---
title: Azure Operator Nexus Isolation Domain
description: Overview of Isolation Domain for Azure Operator Nexus.
author: lnyswonger
ms.author: lnyswonger
ms.reviewer: jdasari
ms.date: 12/21/2023
ms.service: azure-operator-nexus
ms.topic: conceptual
---

# Isolation Domain overview
Isolation domain resources in the NFA service are crucial for establishing both Layer-2 and Layer-3 connectivity among network functions. These resources facilitate efficient communication within and between racks, enhancing the functionality of network functions.

* **Layer-2 Isolation Domain:** This feature enables layer-2 networking within and between server racks. It allows workloads on servers to use a separate layer-2 network for direct connectivity at layer 2 and higher levels.

* **Layer-3 Isolation Domain with Internal Networks:** This domain allows workloads to connect with the network fabric and share layer-3 routing information, facilitating internal network communications.

* **Layer-3 Isolation Domain with External Network:** This setup enables workloads to interact with the network fabric and exchange layer-3 routing details with the external network of the operator.

## Key benefits
* **Northbound Network Integration:** Seamlessly connect with customer routers using BGP peering sessions to establish an external network, ensuring robust northbound connectivity.

* **Southbound Network Integration:** Effectively create internal networks to facilitate southbound connectivity with telco workloads, enhancing communication and data flow.

* **API-Driven Configuration:** Utilize an API-driven approach for unified layer 2 and layer 3 configuration, optimizing both North-South and East-West traffic management for efficiency and control.

* **Isolation Domain Integrity:** Ensure complete separation of service packets in individual isolation domains. This means services in one domain remain entirely invisible to workloads in another, maintaining strict isolation on the same Nexus Network Fabric and enhancing tenant security.

* **Flexible Workload Topology:** Adapt and evolve your network's virtual topology as needed. The platform allows for the dynamic addition or removal of workload networks, providing the flexibility to tailor network structures to evolving requirements.