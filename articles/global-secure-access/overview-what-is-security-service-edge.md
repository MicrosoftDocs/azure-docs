---
title: What is Security Service Edge (SSE)?
description: Learn how Security Service Edge (SSE) provides control and visibility to users and devices both inside and outside of a traditional office.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: overview
ms.date: 04/04/2023
ms.service: network-access
ms.custom: 
---

# What is Security Service Edge (SSE)?

The way people work has changed. Instead of working in traditional offices, people now work from nearly anywhere. This new paradigm in modern work has taken on various names. Gartner originally came up with the term Secure Access Service Edge (SASE). Forrester then came up with a similar term called Security Service Edge (SSE). You will also hear people refer to Network as a Service (NaaS) and Zero Trust Network Access (ZTNA). 

## Understand SASE, SSE, and modern networking

A new category of computing has emerged as the modern workforce has moved to working both inside and outside of traditional offices. Gartner calls this new category Secure Access Service Edge (SASE) and Forrester divides the concept further with a term called Security Service Edge (SSE). Another term to describe this concept is a Network as a Service (NaaS). Microsoft calls this new area Global Secure Access.

Whatever you call it, think of the new category of networking as a solution that extends a traditional corporate network down to individual users and devices regardless of their physical location in the world. In other words, the network your organization controls and monitors is extended down to individual devices and users regardless of whether they are working in a traditional office or a coffee shop on the other side of the world. The diagrams show the traditional line of control and the modern line of control for network traffic.

:::image type="content" source="./media/overview-what-is-global-secure-access/traditional_network_traffic.svg" alt-text="Diagram showing the traditional line of control for network traffic." border="false" lightbox="./media/overview-what-is-global-secure-access/traditional_network_traffic.svg":::

:::image type="content" source="./media/overview-what-is-global-secure-access/modern_network_traffic.svg" alt-text="Diagram showing the modern line of control for network traffic." border="false" lightbox="./media/overview-what-is-global-secure-access/modern_network_traffic.svg":::

## Understand Secure Access Service Edge (SASE)

** !!!BEGIN EDITORIAL NOTE!!! **

**THIS CONTENT CAME FROM EXISTING MARKETING PAGE, KEEP OR REWRITE? CHECK WITH ALEX AND ABDI**: https://www.microsoft.com/en-us/security/business/security-101/what-is-sase 

** !!!END EDITORIAL NOTE!!! **

Secure access service edge, often abbreviated (SASE), is a security framework that converges software-defined wide area networking (SD-WAN) and Zero Trust security solutions into a converged cloud-delivered platform that securely connects users, systems, endpoints, and remote networks to apps and resources.

SASE has four main traits:

**Identity-driven:** Access is granted based on the identity of users and devices.

**Cloud-native:** Both infrastructure and security solutions are cloud-delivered.

**Supports all edges:** Every physical, digital, and logical edge is protected.

**Globally distributed:** Users are secured no matter where they work.

The main goal of SASE architecture is to provide a seamless user experience, optimized connectivity, and comprehensive security in a way that supports the dynamic secure access needs of digital enterprises. Instead of "backhauling" traffic to traditional data centers or private networks for security inspections, SASE enables devices and remote systems to seamlessly access apps and resources wherever they are—and at any time.

## Key components of SASE
SASE can be broken down into six essential elements.

**Software-defined wide area network (SD-WAN)** - A software-defined wide area network is an overlay architecture that uses routing or switching software to create virtual connections between endpoints—both physical and logical. SD-WANs provide near-unlimited paths for user traffic, which optimizes the user experience, and allows for powerful flexibility in encryption and policy management.

**Secure web gateway (SWG)** - A secure web gateway is a web security service that filters unauthorized traffic from accessing a particular network. The goal of an SWG is to zero in on threats before they penetrate a virtual perimeter. An SWG accomplishes this by combining technologies like malicious code detection, malware elimination, and URL filtering.

**Cloud access security broker (CASB)** - A cloud access security broker is a SaaS application that acts as a security checkpoint between on-premises networks and cloud-based applications and enforces data security policies. A CASB protects corporate data through a combination of prevention, monitoring, and mitigation techniques. It can also identify malicious behavior and warn administrators about compliance violations.

**Firewall as a service (FWaaS)** - Firewall as a service moves firewall protection to the cloud instead of the traditional network perimeter. This enables organizations to securely connect a remote, mobile workforce to the corporate network, while still enforcing consistent security policies that reach beyond the organization’s geographic footprint.

**Zero Trust Network Access (ZTNA)** - Zero Trust Network Access is a set of consolidated, cloud-based technologies that operates on a framework in which trust is never implicit and access is granted on a need-to-know, least-privileged basis across all users, devices, and applications. In this model, all users must be authenticated, authorized, and continuously validated before being granted access to company private applications and data. ZTNA eliminates the poor user experience, operational complexities, costs, and risk of a traditional VPN.

**Centralized and unified management** - A modern SASE platform allows IT administrators to manage SD-WAN, SWG, CASB, FWaaS, and ZTNA through centralized and unified management across networking and security. This frees IT team members to focus their energy in other more pressing areas and boosts the user experience for the organization’s hybrid workforce.

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
