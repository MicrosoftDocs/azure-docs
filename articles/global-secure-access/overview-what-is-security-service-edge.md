---
title: What is Security Service Edge (SSE)?
description: Learn how Security Service Edge (SSE) provides control and visibility to users and devices both inside and outside of a traditional office.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: overview
ms.date: 05/23/2023
ms.service: network-access
ms.custom: 
---

# What is Security Service Edge (SSE)?

The way people work has changed. Instead of working in traditional offices, people now work from nearly anywhere. The network perimeter for the modern workforce has created a need for a new category of networking that provides control and visibility to users and devices both inside and outside of a traditional office. This new category of networking is called Security Service Edge (SSE). Microsoft's SSE solution is called Global Secure Access and it includes two services: Microsoft Entra Private Access and Microsoft Entra Internet Access.

Administrators need a way to apply consistent access controls, secure resources, and gain visibility into network traffic. Users need to be more efficient while securely accessing the resources they need to do their jobs. Many organizations have stitched together several solutions to solve these challenges, but this approach can be complex and expensive to manage.

Deploying a Security Service Edge solution can help organizations simplify their network and security architecture, reduce costs, and improve the user experience. Admins can manage access to apps and resources with confidence. Users don't have to rely on the complexities of a traditional VPN. With the services included in Global Secure Access, the traditional corporate network is extended down to individual users and devices regardless of their physical location in the world.

:::image type="content" source="./media/overview-what-is-global-secure-access/traditional_network_traffic.svg" alt-text="Diagram showing the traditional line of control for network traffic." border="false" lightbox="./media/overview-what-is-global-secure-access/traditional_network_traffic.svg":::

:::image type="content" source="./media/overview-what-is-global-secure-access/modern_network_traffic.svg" alt-text="Diagram showing the modern line of control for network traffic." border="false" lightbox="./media/overview-what-is-global-secure-access/modern_network_traffic.svg":::

## Zero trust principles

Global Secure Access is built upon the core principles Zero Trust to use least privilege, verify explicitly, and assume breach. Zero Trust Network Access (ZTNA) is the result of applying Zero Trust principles to networking technologies and concepts. ZTNA operates on a framework in which trust is never implicit and access is granted on a need-to-know, least-privileged bases across all users, devices, and applications. Users are authenticated, authorized, and continuously validated before being granted access to company private applications and data.

## Key components of Global Secure Access

Microsoft Entra Private Access and Internet Access - the two services that make up Global Secure Access - include several key concepts traditionally found in a Security Service Edge solution. Each of these components is incorporated into the following traits:

- **Identity-driven:** Access is granted based on the identity of users and devices.
- **Cloud-native:** Both infrastructure and security solutions are cloud-delivered.
- **Globally distributed:** Users are secured no matter where they work.

### Secure web gateway

A secure web gateway (SWG) is a web security service that filters unauthorized traffic from accessing a specific network. The goal of an SWG is to zero in on threats before they penetrate a virtual perimeter. An SWG combines technologies like malicious code detection, malware elimination, and URL filtering to prevent unauthorized traffic from accessing your network.

Microsoft Entra Private Access and Internet Access include traffic profiles that you can enable to specify what incoming traffic can access your network. 

### Cloud access security broker

A cloud access security broker (CASB) is a SaaS application that acts as a security checkpoint between on-premises networks and cloud-based applications to enforce data security policies. A CASB protects corporate data through a combination of prevention, monitoring, and mitigation techniques. It can also identify malicious behavior and warn administrators about compliance violations.

The CASB security checkpoint for Microsoft Entra Private Access and Internet Access comes from establishing an Azure Active Directory Application Proxy connector group, which further manages the traffic that can access your apps.

### Firewall as a service

Firewall as a service (FWaaS) moves firewall protection to the cloud instead of the traditional network perimeter. This shift enables organizations to securely connect a remote, mobile workforce to the corporate network, while still enforcing consistent security policies that reach beyond the organization’s geographic footprint.

Microsoft Entra Private Access and Internet Access....

### Centralized and unified management

A modern SSE platform allows IT administrators to these key components through centralized and unified management across networking and security. This frees IT team members to focus their energy in other more pressing areas and boosts the user experience for the organization’s hybrid workforce.

The features of Global Secure Access are all accessed from the Microsoft Entra admin center. With this centralized experience you can set up your branch and client connectivity, manage your traffic profiles, and view your logs and reports.



## Benefits of SASE
SASE platforms offer significant advantages over traditional on-premises network options. Here are some of the primary reasons organizations may want to switch to a SASE framework:

**Reduced IT costs and complexity** - Legacy network security models rely on a patchwork of solutions to secure the network perimeter. SASE reduces the number of solutions necessary to secure applications and services—saving on IT costs and simplifying administration.

**Greater agility and scalability** - Because SASE is cloud delivered, both the network and security framework are completely scalable. As your enterprise grows, so can the system, making accelerating digital transformation truly possible.

**Built to sustain hybrid work** - Where traditional hub-and-spoke networks struggle to handle the bandwidth necessary to keep remote employees productive, SASE maintains enterprise-level security for all users, regardless of how or where they work.

**Boosts user experience** - SASE optimizes security for users by intelligently managing security exchanges in real time. This reduces latency as users try to connect to cloud applications and services and reduces the organization’s attack surface.

**Improved security** - In the SASE framework, SWG, DLP, ZTNA, and other threat intelligence technologies converge to provide remote workers with secure access to company resources while reducing the risk of lateral movement in the network. In SASE, all connections are inspected and secured, and threat protection policies are clearly defined up front—no question.

## Learn more about proactive Zero Trust security
Security service edge (SSE) is a standalone subset of SASE that focuses exclusively on cloud security services. SSE delivers secure access to the internet by way of a protected web gateway, safeguards SaaS and cloud apps via a CASB, and secures remote access to private apps through ZTNA. SASE also features these components, but expands to include SD-WAN, WAN optimization, and quality of service (QoS) elements.

## How to get started with SASE
Successful SASE implementation requires in-depth planning and preparation, as well as continuous monitoring and optimization. Here is some advice for how to plan for and implement phased SASE deployment.

1. **Define SASE goals and requirements** - Identify the problems in your organization that could be addressed through SASE—as well as expected business outcomes. Once you know why SASE is essential, clarify which technologies can fill the gaps in your organization’s current infrastructure.

1. **Select your SD-WAN backbone** - Choose an SD-WAN to provide networking functionality, then layer an SSE provider to create a comprehensive SASE solution. Integration is key.

1. **Incorporate Zero Trust solutions** - Access control should be governed by identity. Complete SASE deployment by selecting a suite of cloud-native technologies with Zero Trust at their core to keep your data as safe as possible.

1. **Test and troubleshoot** - Before going live with a SASE deployment, test SASE functionality in a staging environment and experiment with how your multicloud security stack integrates with the SD-WAN and other tools.

1. **Optimize your SASE setup** - As your organization grows and priorities evolve, look for new opportunities for continued and adaptive SASE implementation. Every organization’s path to mature SASE architecture is unique. Phasing implementation helps ensure you can move forward with confidence each step of the way.

## SASE solutions for businesses
Every organization that wants to provide comprehensive threat and data protection, accelerate its digital transformation, and facilitate a remote or hybrid workforce should urgently consider adopting a SASE framework.

To get the best results, evaluate your current environment and identify pressing gaps you need to address. Then, identify solutions that allow you to leverage your current technology investments by integrating with current tools that already adhere to Zero Trust principles.

## Next steps
<!-- Add a context sentence for the following links -->
- [Get started with Global Secure Access](how-to-get-started-with-global-secure-access.md)
