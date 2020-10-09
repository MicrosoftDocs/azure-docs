---
title: Azure VMWare Solution networking and connectivity
description: Azure VMWare Solution networking and connectivity description.
ms.topic: include
ms.date: 09/28/2020
---

<!-- Used in introduction.md and concepts-networking.md -->

Azure VMware Solution offers a private cloud environment accessible from on-premises and Azure-based environments or resources. Services such as Azure ExpressRoute and VPN connections deliver the connectivity. These services require specific network address ranges and firewall ports for enabling the services.

When deploying a private cloud, private networks for management, provisioning, and vMotion get created. Use these private networks to access vCenter and NSX-T Manager and virtual machine vMotion or deployment.  ExpressRoute Global Reach is used to connect private clouds to on-premises environments. The connection requires a virtual network with an ExpressRoute circuit in your subscription.



>[!NOTE]
>Access to the internet and Azure services are provisioned and provided to consume VMs on production networks when deploying a private cloud.  By default, internet access is disabled for new private clouds and, at any time, can be enabled or disabled.