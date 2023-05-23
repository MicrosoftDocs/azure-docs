---
title: What is Global Secure Access?
description: Learn how Global Secure Access provides control and visibility to users and devices both inside and outside of a traditional office.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: overview
ms.date: 04/18/2023
ms.service: network-access
ms.custom: 
---

# What Global Secure Access?

The way people work has changed. Instead of working in traditional offices, people now work from nearly anywhere. The network perimeter for the modern workforce has created a need for a new category of networking that provides control and visibility to users and devices both inside and outside of a traditional office. This new category of networking is called Security Service Edge (SSE). Microsoft's SSE solution is called Global Secure Access and it includes two services: Microsoft Entra Private Access and Microsoft Entra Internet Access.

## Challenges of the traditional network

Administrators need a way to apply consistent access controls, secure resources, and gain visibility into network traffic. Users need to be more efficient while securely accessing the resources they need to do their jobs. Many organizations have stitched together several solutions to solve these challenges, but this approach can be complex, expensive to manage, and difficult to secure.

![Diagram of the traditional network traffic flow.](media/overview-what-is-global-secure-access/traditional-network-traffic.png)

In the previous diagram remote workers use VPN to connect to the corporate network. It's common for users to bypass the controls that IT has in place, putting themselves and the organization at risk. Risky users with compromised credentials can move laterally across the corporate network, expanding the attack surface. 

The next diagram illustrates how Microsoft Entra Private Access and Microsoft Entra Internet Access create a new path for employees to access corporate resources. Through Global Secure Access, employees can access resources from corporate headquarters, a branch location, or from their home office. The process checks their identity, applies Conditional Access policies, and connects them to the appropriate resource. 

![Diagram of the new network traffic flow with Global Secure Access.](media/overview-what-is-global-secure-access/global-secure-access-traffic.png)

Deploying a Security Service Edge solution can help organizations simplify their network and security architecture, reduce costs, and improve the user experience. Admins can manage access to apps and resources with confidence. Users don't have to rely on the complexities of a traditional VPN. With the services included in Global Secure Access, the traditional corporate network is extended down to individual users and devices regardless of their physical location.

## Key components of Global Secure Access

Microsoft Entra Private Access and Internet Access - the two services that make up Global Secure Access - include several key concepts traditionally found in a Security Service Edge solution. These components are based on the following principles:

- **Identity-driven:** Access is granted based on the identity of users and devices.
- **Cloud-native:** Both infrastructure and security solutions are cloud-delivered.
- **Globally distributed:** Users are secured no matter where they work.

### Secure web gateway

A secure web gateway (SWG) is a web security service that filters unauthorized traffic from accessing a specific network. The goal of an SWG is to zero in on threats before they penetrate a virtual perimeter. An SWG combines technologies like malicious code detection, malware elimination, and URL filtering to prevent unauthorized traffic from accessing your network.

With Microsoft Entra Private Access and Internet Access you can enable [traffic forwarding profiles](concept-traffic-forwarding.md) that acquires and routes traffic according to your policies and destinations.

### Cloud access security broker

A cloud access security broker (CASB) is a SaaS application that acts as a security checkpoint between on-premises networks and cloud-based applications to enforce data security policies. A CASB protects corporate data through a combination of prevention, monitoring, and mitigation techniques. It can also identify malicious behavior and warn administrators about compliance violations.

The CASB security checkpoint for Microsoft Entra Private Access and Internet Access comes from establishing an Azure Active Directory Application Proxy connector group, which further manages the traffic that can access your apps.

### Firewall as a service

Firewall as a service (FWaaS) moves firewall protection to the cloud instead of the traditional network perimeter. This shift enables organizations to securely connect a remote, mobile workforce to the corporate network, while still enforcing consistent security policies that reach beyond the organization’s geographic footprint.

Microsoft Entra Private Access and Internet Access....

### Centralized and unified management

A modern SSE platform allows IT administrators to these key components through centralized and unified management across networking and security. This frees IT team members to focus their energy in other more pressing areas and boosts the user experience for the organization’s hybrid workforce.

The features of Global Secure Access are all accessed from the Microsoft Entra admin center. With this centralized experience you can set up your branch and client connectivity, manage your traffic profiles, set up Conditional Access policies, and view network and usage logs.

:::image type="content" source="./media/overview-what-is-global-secure-access/global-secure-access-diagram.png" alt-text="Diagram showing the traditional line of control for network traffic." border="false" lightbox="./media/overview-what-is-global-secure-access/global-secure-access-diagram-extended.png":::

### Zero trust principles

Global Secure Access is built upon the core principles of Zero Trust to use least privilege, verify explicitly, and assume breach. Zero Trust Network Access (ZTNA) is the result of applying Zero Trust principles to networking technologies and concepts. ZTNA operates on a framework in which trust is never implicit and access is granted on a need-to-know, least-privileged bases across all users, devices, and applications. Users are authenticated, authorized, and continuously validated before being granted access to company private applications and data.

## Microsoft Entra Private Access

Microsoft Entra Private Access provides your users - whether in an office or working remotely - secured access to your private, corporate resources. Microsoft Entra Private Access uses a least-privilege access model instead of providing implicit trust and open access to all apps and resources.

Azure Active Directory Application Proxy already provides access to private apps without needing a VPN. Microsoft Entra Private Access builds on those capabilities and extends access to any private resource, port, and protocol.

You can require multi-factor authentication without modifying the resource, instead using Conditional Access to enforce the policy. Microsoft Entra Private Access reduces operational complexity and cost by replacing traditional VPNs. The service also offers per-app adaptive access based on Conditional Access policies.

## Microsoft Entra Internet Access

With Microsoft Entra Internet Access you can protect users whether they're accessing Microsoft 365 services or exploring the web. Conditional Access policies are used to protect against malicious or non-compliant internet traffic. 

For Microsoft 365 environments, Microsoft Entra Internet Access enables best-in-class security and visibility, along with fast and seamless access to Microsoft 365 apps. With a devoted traffic forwarding policy for Microsoft 365, your users will be more productive wherever they work.

## What is Global Secure Access?

Microsoft Entra provides two products that encompass the Security Service Edge (SSE) solution. The first is called Microsoft Entra Private Access and the second is called Microsoft Entra Internet Access. In the Microsoft Entra admin center these products show up under the left hand navigation in an area called generally Global Secure Access. Think of Global Secure Access as the area of the Microsoft Entra portal for SSE. It provides modern network access control for users and devices.

The industry term for these solutions is Security Service Edge (SSE). To learn more about SSE, see [What is Security Service Edge (SSE)?](overview-what-is-security-service-edge.md).

## Understanding the products in Global Secure Access
Global Secure Access includes Microsoft Entra Private Access and Microsoft Entra Internet Access. The table outlines
which product is required for each feature in this article. To learn more about Microsoft Entra Private Access, see
[What is Microsoft Entra Private Access?](overview-what-is-private-access.md). To learn more about Microsoft Entra
Internet Access, see [What is Microsoft Entra Internet Access?](overview-what-is-internet-access.md). The features that make up Microsoft Entra Internet Access show up throughout the Global Secure Access section of the Microsoft Entra admin center. The industry term for these solutions is Security Service Edge (SSE). 

|               |Private Access - Standard|Private Access - Premium|Internet Access - Standard|Internet Access - Premium|
|---------------|--------------------------------|-------|---------------------------------|-------|
| **Feature A** | X                              |       | X                               |       |
| **Feature B** |                                | X     |                                 |       |
| **Feature C** | X                              |       | X                               |       |
| **Feature D** |                                | X     |                                 | X     |

## Next steps
<!-- Add a context sentence for the following links -->
- [Get started with Global Secure Access](how-to-get-started-with-global-secure-access.md)
