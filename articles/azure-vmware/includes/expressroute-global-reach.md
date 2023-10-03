---
title: Azure VMware Solution networking and connectivity
description: Azure VMware Solution networking and connectivity description.
ms.topic: include
ms.service: azure-vmware
ms.date: 09/24/2022
author: suzizuber
ms.author: v-szuber
---

<!-- Used in articles\azure-vmware\introduction.md and articles\azure-vmware\concepts-networking.md 

articles\azure-vmware\includes\azure-vmware-solution-networking-description.md

-->

[ExpressRoute Global Reach](../../expressroute/expressroute-global-reach.md) is used to connect private clouds to on-premises environments. It connects circuits directly at the Microsoft Enterprise Edge (MSEE) level. The connection requires a virtual network (vNet) with an ExpressRoute circuit to on-premises in your subscription.  The reason is that vNet gateways (ExpressRoute Gateways) can't transit traffic, which means you can attach two circuits to the same gateway, but it won't send the traffic from one circuit to the other.

Each Azure VMware Solution environment is its own ExpressRoute region (its own virtual MSEE device), which lets you connect Global Reach to the 'local' peering location.  It allows you to connect multiple Azure VMware Solution instances in one region to the same peering location. 

>[!NOTE]
>For locations where ExpressRoute Global Reach isn't enabled, for example, because of local regulations, you have to build a routing solution using Azure IaaS VMs. For some examples, see [Azure Cloud Adoption Framework - Network topology and connectivity for Azure VMware Solution](/azure/cloud-adoption-framework/scenarios/azure-vmware/eslz-network-topology-connectivity).
