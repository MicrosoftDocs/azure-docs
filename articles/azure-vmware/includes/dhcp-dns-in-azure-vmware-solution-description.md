---
title: DHCP and DNS in Azure VMware Solution description
description: Azure VMware Solution DHCP and DNS description.
ms.topic: include
ms.service: azure-vmware
ms.date: 4/11/2023
author: suzizuber
ms.author: v-szuber
---

<!-- Used in tutorial-network-checklist.md and configure-dhcp-azure-vmware-solution.md -->

Applications and workloads running in a private cloud environment require name resolution and DHCP services for lookup and IP address assignments. A proper DHCP and DNS infrastructure are required to provide these services. You can configure a virtual machine to provide these services in your private cloud environment.  

Use the DHCP service built-in to NSX-T Data Center or use a local DHCP server in the private cloud instead of routing broadcast DHCP traffic over the WAN back to on-premises.

> [!IMPORTANT]
> If you advertise a default route to the Azure VMware Solution, then you must allow the DNS forwarder to reach the configured DNS servers and they must support public name resolution.
