---
title: Understand branch connectivity with Global Secure Access
description: Learn about branch connectivity in Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: overview
ms.date: 05/30/2023
ms.service: network-access
ms.custom: 
---

# Understand branch connectivity

Global Secure Access supports two connectivity options: installing a client on end-user device and configuring customer premises equipment (CPE), such as a router, in a branch office. Branch office connectivity streamlines how your end-users and guests connect from a branch office.

This article describes the key concepts of branch connectivity along with common scenarios where it may be useful.

## What is a branch office? 

Branches are remote locations or networks that require internet connectivity. For example, many organizations have a central headquarters and branch office locations in different geographic areas. These branch offices need access to corporate data and services. They need a secure way to talk to the data center, headquarters, and remote workers. The security of branch offices is crucial for many types of organizations.

Branch offices are typically connected to the corporate network through a dedicated Wide Area Network (WAN) or a Virtual Private Network (VPN) connection. Employees in the branch connect to the network using customer premises equipment (CPE).

## Current challenges of branch security 

**Bandwidth requirements have grown** – The number of devices requiring Internet access has increased exponentially. Traditional networks are difficult to scale. With the advent of Software as a Service (SaaS) applications like Microsoft 365, there are ever-growing demands of low latency and jitter-less communication that traditional technologies like Wide Area Network (WAN) and Multi-Protocol Label Switching (MPLS) struggle with. 

**IT teams are expensive** – Typically, firewalls are placed on physical devices on-premises, which requires an IT team for setup and maintenance. Maintaining an IT team at every branch location is expensive. 

**Evolving threats** – Malicious actors are finding new avenues to attack the devices at the edge of networks. Edge devices in branch offices or even home offices are often the most vulnerable point of attack.

## How does Global Secure Access branch connectivity work? 

To connect a branch office to Global Secure Access, you set up an Internet Protocol Security (IPSec) tunnel between your on-premises equipment and the Global Secure Access endpoint. Traffic that you specify is routed through the IPSec tunnel to the Microsoft cloud. You can apply security policies in the Microsoft Entra admin center.

> [!NOTE]
> Global Secure Access branch connectivity provides a secure solution between a branch office and the
> Global Secure Access service. It does not provide a secure connection between one branch and another.
> To learn more about secure branch-to-branch connectivity, see the [Azure Virtual WAN documentation](../virtual-wan/index.yml).
 
## Why branch connectivity may be important for you? 
Maintaining security of a corporate network is increasingly difficult in a world of remote work and distributed teams. Security Service Edge (SSE) promises a world of security where customers can access their corporate resources from anywhere in the world without needing to back haul their traffic to headquarters. Global Secure Access is the Microsoft solution for SSE.

## Common branch connectivity scenarios

### I don’t want to install clients on thousands of devices on-premises. 
Generally, SSE is enforced by installing a client on a device. The client creates a tunnel to the nearest SSE endpoint and routes all Internet traffic through it. SSE solutions inspect the traffic and enforce security policies. If your users aren't mobile and based in a physical branch office location, then branch connectivity removes the pain of installing a client on every device. You can connect the entire branch location by creating an IPSec tunnel between the core router of the branch office and the Global Secure Access endpoint.

### I can't install clients on all the devices my organization owns.
Sometimes, clients can't be installed on all devices. Global Secure Access currently provides clients for Windows. But what about Linux, mainframes, cameras, printers and other types of devices that are on premises and sending traffic to the Internet? This traffic still needs to be monitored and secured. When you connect a branch location, you can set policies for all traffic from that location regardless of the device where it originated.

### I have guests on my network who don't have the client installed.  
The guest devices on your network may not have the client installed. To ensure that those devices adhere to your network security policies, you need their traffic routed through the Global Secure Access endpoint. Branch connectivity solves this problem. No more clients need to be installed on guest devices. All outgoing traffic from the branch is going through security evaluation by default.  

## Next steps
- [List all branch office locations](how-to-list-branch-locations.md)
- [Manage branch locations](how-to-manage-branch-locations.md)
