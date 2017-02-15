---
title: Protecting the cloud boundary in Azure | Microsoft Docs
description: Explains and compares the different methods available for protecting applications and components running in Azure as part of a hybrid system from unauthorized intrusion.
services: ''
documentationcenter: na
author: telmosampaio
manager: christb
editor: ''
tags: ''

ms.assetid: 879e0dcb-0485-4388-a10b-9a84e64c0055
ms.service: guidance
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/23/2016
ms.author: telmosampaio

---
# Protecting the cloud boundary in Azure

[!INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

An on-premises network can be connected to a virtual network in Azure by using an Azure VPN gateway. The network boundary between these two environments can expose areas of weakness in terms of security, and it is necessary to protect this boundary to block unauthorized requests. Similar protection is required for applications running on VMs in Azure that are exposed to the public Internet.

The patterns & practices group has created a set of reference architectures to address these scenarios. Each reference architecture demonstrates one approach to protecting the network boundary, and includes:

* Recommendations and best practices.
* Considerations for availability, security, scalability, and manageability.
* An Azure Resource Manager template that you can modify and deploy. 

## Using a DMZ between Azure and on-premises datacenters

This architecture shows how to create a DMZ (also known as a perimeter network) to filter traffic between Azure and your on-premises network. The DMZ consists of a set of network virtual appliances (NVAs) that can perform tasks such as acting as a firewall, inspecting network packets, and denying access to suspicious requests. These NVAs are implemented as Azure VMs.  

![[0]][0]

For detailed information about this architecture, see [Implementing a secure hybrid network architecture in Azure][secure-hybrid-network-architecture].

## Using a DMZ between Azure and the Internet

This architecture builds on the previous one, but adds a second DMZ to filter traffic between Azure and the Internet.

![[1]][1]


For detailed information about this architecture, see  [Implementing a DMZ between Azure and the Internet][dmz-azure-internet].

## Next steps
The resources below explain how to implement the architectures described in this article.

* [Implementing a secure hybrid network architecture in Azure][secure-hybrid-network-architecture]
* [Implementing a DMZ between Azure and the Internet][dmz-azure-internet]

<!-- Links -->
[0]: ./media/security/figure1.png "Secure hybrid network architecture with on-premises access"
[1]: ./media/security/figure2.png "Secure hybrid network architecture with Internet access"
[secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[implementing-aad]: ./guidance-identity-aad.md
[dmz-azure-internet]: ./guidance-iaas-ra-secure-vnet-dmz.md 
