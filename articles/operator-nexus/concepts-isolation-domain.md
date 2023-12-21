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