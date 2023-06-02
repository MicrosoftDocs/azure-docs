---
title: What is security servie edge?
description: Learn about security service edge and how it relates to Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: overview
ms.date: 06/02/2023
ms.service: network-access
ms.custom: 
---

# What is security service edge?

The way people work has changed. Instead of working in traditional offices, people now work from nearly anywhere. The network perimeter for the modern workforce has created a need for a new category of networking that provides control and visibility to users and devices both inside and outside of a traditional office. This new category of networking is called Security Service Edge (SSE). Microsoft's SSE solution is called Global Secure Access and it includes two services: Microsoft Entra Private Access and Microsoft Entra Internet Access.

## Challenges of the traditional network

Administrators need a way to apply consistent access controls, secure resources, and gain visibility into network traffic. Users need to be more efficient while securely accessing the resources they need to do their jobs. Many organizations have stitched together several solutions to solve these challenges, but this approach can be complex, expensive to manage, and difficult to maintain. 

![Diagram of the traditional network traffic flow.](media/overview-what-is-global-secure-access/traditional-network-traffic.png)

In the previous diagram, remote workers use VPN to connect to the corporate network. It's common for users to bypass the controls that IT has in place, putting themselves and the organization at risk. Risky users with compromised credentials can move laterally across the corporate network, expanding the attack surface. 

Deploying a Security Service Edge solution can help organizations simplify their network and security architecture, reduce costs, and improve the user experience. Admins can manage access to apps and resources with confidence. Users don't have to rely on the complexities of a traditional VPN. With the services included in Global Secure Access, the secure corporate network is extended to individual users and devices regardless of their physical location.

## Key components of Security Service Edge

Microsoft Entra Private Access and Microsoft Entra Internet Access - the two products that make up Global Secure Access - include multiple components traditionally found in a Security Service Edge solution. These components are:

- **Identity-driven:** Access is granted based on the identity of users and devices.
- **Cloud-native:** Both infrastructure and security solutions are cloud-delivered.
- **Globally distributed:** Users are secured no matter where they work.

### Secure web gateway

A secure web gateway (SWG) is a web security service that filters unauthorized traffic from accessing a specific network. The goal of an SWG is to zero in on threats before they penetrate a virtual perimeter. 

### Cloud access security broker

A cloud access security broker (CASB) is a SaaS application that acts as a security checkpoint between on-premises networks and cloud-based applications to enforce data security policies. A CASB protects corporate data through a combination of prevention, monitoring, and mitigation techniques. It can also identify malicious behavior and warn administrators about compliance violations.

### Firewall as a service

Firewall as a service (FWaaS) moves firewall protection to the cloud instead of the traditional network perimeter. This shift enables organizations to securely connect a remote, mobile workforce to the corporate network, while still enforcing consistent security policies that reach beyond the organization’s geographic footprint.

### Centralized and unified management

A modern SSE platform allows IT administrators to manage these key components through a centralized and unified management platform. Managing your network and its security frees IT team members to focus their energy in other more pressing areas and boosts the user experience for the organization’s hybrid workforce.

### Zero trust principles

Zero Trust Network Access (ZTNA) is the result of applying Zero Trust principles to networking technologies and concepts. ZTNA operates on a framework in which trust is never implicit and access is granted on a need-to-know, least-privileged bases across all users, devices, and applications. Users are authenticated, authorized, and continuously validated before being granted access to company private applications and data.

## Next steps

- [Learn about Global Secure Access](overview-what-is-global-secure-access.md)
- [Get started with Global Secure Access](how-to-get-started-with-global-secure-access.md)
