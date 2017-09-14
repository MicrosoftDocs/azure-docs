---
title: How DDoS Protection Service works | Microsoft Docs
description: Learn about the Azure DDoS Protection service integrates with the Azure platform.
services: virtual-network
documentationcenter: na
author: kumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/10/2017
ms.author: kumud

---
# How DDoS Protection Service works

Azure DDoS Protection integrates with the Azure platform providing advanced intelligence, to auto-configure and auto-tune your DDoS Protection settings. DDoS Protection uses its unique insight to your services configuration and resource health to make intelligent mitigation decisions. 

![DDoS functionality](./media/ddos-how-works/ddos-how-works-fig1.png)

DDoS Protection includes these characteristics:

- Understands your resources and resource configuration
- Virtual network builds a profile of normal traffic
- Profile adjusts as traffic changes over time
- Protection policies define protection limits
- No user definition is required
- Mitigation is performed when protection policies are exceeded

## Traffic baseline creation

When a virtual network is enabled for DDoS Protection through Azure Resource Manager, the DDoS Protection service enumerates all protected resources on that virtual network. Similarly, as you deploy new protected resource types on the virtual network, they are added to the DDoS Protection service. The DDoS Protection service starts to develop a traffic baseline for the protected resources attached to the virtual network. The traffic baseline learns normal traffic bandwidth for each protected resource for every hour and day of the week. This baseline is used as the source of a DDoS policy that is installed for a protected resource. 

## Traffic monitoring and the DDoS SDN 

Microsoft’s DDoS SDN monitors actual traffic utilization and constantly compares it against the thresholds defined in the DDoS Policy. When that traffic threshold is exceeded, then DDoS mitigation is initiated. When traffic goes below the threshold, the mitigation is removed.

## DDoS mitigation

During mitigation, traffic towards the protected resource is redirected through one or more Azure regional DDoS SDNs that exist across the globe. As traffic passes through the DDoS SDN, several checks are performed. These checks generally perform the following function:

- Ensure packets conform to Internet specifications and are not malformed.
- Interact with the client to determine if it is potentially a spoofed packet (e.g: SYN Auth or SYN Cookie or by dropping a packet for the source to retransmit it).
- Rate-limit packets if no other enforcement method can be performed.

The DDoS SDN blocks attack traffic and forward remaining traffic to intended destination.

## Types of DDoS attacks

Azure DDoS Protection secures against many types of attacks. DDoS Protection can mitigate the following types of attacks.

### Volumetric attacks

These attacks flood the network layer with substantial amount of seemingly legitimate traffic. Attack types include, but are not limited to, ICMP floods, UDP floods, amplification flood and more.

### Protocol attacks

Also, known as state exhaustion attacks target the connection state tables in firewalls, web application servers, and other infrastructure components. Includes but not limited to, SYN flood attacks, reflection attacks, and other protocol attacks.

### Application layer attacks

Use Azure DDoS Protection service in combination with [Application Gateway](https://azure.microsoft.com/services/application-gateway/) WAF SKU to achieve complete protection both at the network layer and application layer.

## Next steps

- Learn more about [DDoS Protection](ddos-protection-overview.md).
- Learn more about [DDoS Protection telemetry](ddos-protection-telemetry.md).
- Review [Frequently Asked Questions](ddos-protection-faq.md) about DDoS Protection.