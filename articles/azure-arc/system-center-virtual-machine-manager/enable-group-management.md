---
title:  Enable guest management
description: The article provides information about how to enable guest management and includes supported environments and prerequisites. 
ms.date: 11/15/2023
ms.topic: conceptual
ms.services: azure-arc
ms.subservice: azure-arc-scvmm
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
keywords: "VMM, Arc, Azure"
---


# Enable guest management

The article provides information about how to enable guest management and includes supported environments and prerequisites.

## Supported environments

- **VMM version**: VMs managed by VMM 2019 UR5 or later and VMM 2022 UR1 or later.

- **Host version OS version**: VMs running on Windows Server 2016, 2019, 2022, Azure Stack HCI 21H2 and Azure Stack HCI 22H2.  

- **Guest OS version**: Windows Server 2012 R2, 2016, 2019, 2022, Windows 10, and Windows 11.

- Linux OS versions aren’t supported.

## Prerequisites

Ensure the following prerequisites:

- VM is running in a supported environment.
- VM can connect through the firewall to communicate over the internet.
- [These URLs](/azure/azure-arc/servers/network-requirements#urls) aren’t blocked.
- The VM is powered on, and the resource bridge has network connectivity to the host running the VM.

## To Enable guest management

To enable guest management, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com/), search for SCVMM VM and select it.
2. Select **Configuration**.
3. Select **Enable guest management** and provide the administrator username and password to enable guest management.
4. Select **Apply**.