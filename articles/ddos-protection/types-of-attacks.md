---
title: 'Types of attacks Azure DDoS Protection mitigates' 
description: Learn what types of attacks Azure DDoS Protection protects against.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: conceptual
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 10/12/2022
ms.author: abell
---
# Types of attacks Azure DDoS Protection mitigates

Azure DDoS Protection can mitigate the following types of attacks:

- **Volumetric attacks**: These attacks flood the network layer with a substantial amount of seemingly legitimate traffic. They include UDP floods, amplification floods, and other spoofed-packet floods. DDoS Protection mitigates these potential multi-gigabyte attacks by absorbing and scrubbing them, with Azure's global network scale, automatically.
- **Protocol attacks**: These attacks render a target inaccessible, by exploiting a weakness in the layer 3 and layer 4 protocol stack. They include SYN flood attacks, reflection attacks, and other protocol attacks. DDoS Protection mitigates these attacks, differentiating between malicious and legitimate traffic, by interacting with the client, and blocking malicious traffic. 
- **Resource (application) layer attacks**: These attacks target web application packets, to disrupt the transmission of data between hosts. They include HTTP protocol violations, SQL injection, cross-site scripting, and other layer 7 attacks. Use a Web Application Firewall, such as the Azure [Application Gateway web application firewall](../web-application-firewall/ag/ag-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json), as well as DDoS Protection to provide defense against these attacks. There are also third-party web application firewall offerings available in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?page=1&search=web%20application%20firewall).

## Azure DDoS Protection

Azure DDoS Protection protects resources in a virtual network including public IP addresses associated with virtual machines, load balancers, and application gateways. When coupled with the Application Gateway web application firewall, or a third-party web application firewall deployed in a virtual network with a public IP, Azure DDoS Protection can provide full layer 3 to layer 7 mitigation capability.

## Next steps

* [Components of a DDoS response strategy](ddos-response-strategy.md).
