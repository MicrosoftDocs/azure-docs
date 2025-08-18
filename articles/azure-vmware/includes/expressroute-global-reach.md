---
title: Azure VMware Solution networking and connectivity
description: Azure VMware Solution networking and connectivity description.
ms.topic: include
ms.service: azure-vmware
ms.date: 01/04/2024
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23
# Customer intent: "As a network administrator, I want to connect Azure VMware Solution environments to on-premises networks using ExpressRoute Global Reach, so that I can ensure efficient and secure data transfer between my private clouds and local infrastructure."
---

<!-- Used in articles\azure-vmware\introduction.md and articles\azure-vmware\concepts-networking.md 

articles\azure-vmware\includes\azure-vmware-solution-networking-description.md

-->

[ExpressRoute Global Reach](../../expressroute/expressroute-global-reach.md) is used to connect private clouds to on-premises environments. It connects circuits directly at the Microsoft Edge level. The connection requires a virtual network (vNet) with an ExpressRoute circuit to on-premises in your subscription.  The reason is that vNet gateways (ExpressRoute Gateways) can't transit traffic, which means you can attach two circuits to the same gateway, but it doesn't send the traffic from one circuit to the other.

Each Azure VMware Solution environment is its own ExpressRoute region (its own virtual MSEE device), which lets you connect Global Reach to the 'local' peering location.  It allows you to connect multiple Azure VMware Solution instances in one region to the same peering location. 

>[!NOTE]
>For locations where ExpressRoute Global Reach isn't enabled, for example, because of local regulations, you have to build a routing solution using Azure IaaS VMs. For some examples, see [Azure Cloud Adoption Framework - Network topology and connectivity for Azure VMware Solution](/azure/cloud-adoption-framework/scenarios/azure-vmware/eslz-network-topology-connectivity).
