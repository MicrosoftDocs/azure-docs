---
title: DHCP and DNS in Azure VMware Solution description
description: Azure VMware Solution DHCP and DNS description.
ms.topic: include
ms.service: azure-vmware
ms.date: 05/28/2021
author: suzizuber
ms.author: v-szuber
---

<!-- Used in tutorial-network-checklist.md and configure-dhcp-azure-vmware-solution.md -->

Applications and workloads running in a private cloud environment require name resolution and DHCP services for lookup and IP address assignments. A proper DHCP and DNS infrastructure are required to provide these services. You can configure a virtual machine to provide these services in your private cloud environment.  

Use the DHCP service built-in to NSX or use a local DHCP server in the private cloud instead of routing broadcast DHCP traffic over the WAN back to on-premises.
