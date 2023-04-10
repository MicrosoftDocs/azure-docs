---
title: Understand branch connectivity
description: Learn about branch connectivity in Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: overview
ms.date: 04/10/2023
ms.service: network-access
ms.custom: 
---

# Understand branch connectivity
Global Secure Access supports two connectivity options. The first is to install a client on each device. The second is to configure equipment, such as a router, in a branch office. Equipment in a branch office is also referred to as Customer Premises Equipment (CPE).

## What is a branch office? 
Branches are remote locations or networks that require internet connectivity. For example, many organizations have a headquarters and also have branch office locations in different geographic areas. These branch offices need access to corporate data and services. They need a secure way to talk to the data center, headquarters, and remote workers. Hence, the security of branch offices is crucial for organizations.

## Current challenges of branch security 

1. **Bandwidth requirements have grown** – The number of devices requiring Internet access has increased exponentially. Traditional networks are difficult to scale. With the advent of Software as a Service (SaaS) applications like Microsoft 365, there are ever-growing demands of low latency and jitter-less communication that traditional technologies like Wide Area Network (WAN) and Multi-Protocol Label Switching (MPLS) struggle with. 
1. **IT teams are expensive** – Typically, firewalls are placed on physical devices on-premise which requires an IT team for setup and maintenance. Maintaining an IT team at every branch location is expensive. 
1. **Evolving threats** – Malicious actors are finding new avenues to attack the devices at the edge of networks. These edge devices are often the most vulnerable point of attack.
1. **No holistic solution for network and security** – Software Defined Wide Area Network (SD-WAN) is definitely a step up from legacy WAN, but these SD-WAN appliances are not designed to meet all security requirements. As a result, enterprises have to manage a patchwork of network and security offerings from multiple vendors.  

## How does Global Secure Access branch connectivity work? 
To connect a branch office to Global Secure Access you set up an Internet Protocol Security (IPSec) tunnel between your on-premise equipment and the Microsoft service endpoint. Traffic that you specific is routed through the IPSec tunnel to the Microsoft cloud. You apply security policies in the Microsoft Entra admin portal.

> [!NOTE]
> Global Secure Access branch connectivity provides a secure solution between a branch office and the
> Global Secure Access service. It does not provide a secure connection between one branch and another.
> To learn more about secure branch to branch connectivity, see the [Azure Virtual WAN documentation](../virtual-wan/index.md).
 
## Why branch connectivity may be important for you? 
Maintaining security of a corporate network is increasingly difficult in a world of remote work and distributed teams. Secure Access Service Edge (SASE) promises a world of security where customers can access their corporate resources from anywhere in the world without needing to back haul their traffic to a headquarters. Global Secure Access is the Microsoft solution for SASE.

Some common scenarios where branch connectivity should be considered? 

### I don’t want to install clients on thousands of devices on-prem. 
Generally, SASE is enforced by installing a client on a device. The client creates a tunnel to the nearest Global Secure Access endpoint and routes all Internet traffic through it. SASE solutions inspect the traffic and enforce security policies. If your users are not mobile and based in a physical branch office location then branch connectivity removes the pain of installing a client on every device. You can connect the entire branch location by creating an IPSec tunnel between the core router of the branch office and the Global Secure Access endpoint.

### I cannot install clients on all the devices my organization owns.
Sometimes, clients cannot be installed on all devices. Global Secure Access provides clients for Windows, Android, iOS and Mac. But what about Linux, mainframes, cameras, printers and other types of devices that are on premises and sending traffic to the Internet? This traffic still needs to be monitored and secured. When you connect a branch location you can set policies for all traffic from that location regardless of the device where it originated.

### I have guests on my network who do not have the client installed.  
The guest devices on your network may not have the client installed. To ensure that those devices adhere to your network security policies you need their traffic routed through the Global Secure Access endpoint. Branch connectivity solves this problem. No additional clients need to be installed on guest devices. All outgoing traffic from the branch is going through security evaluation by default.  

## Next steps
- [Configure branch Office locations](how-to-configure-branch-office-locations.md)
