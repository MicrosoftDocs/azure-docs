---
title: Global Secure Access (preview) remote network connectivity
description: Learn how remote network connectivity in Global Secure Access (preview) allows users to connect to your corporate network from a remote location, such as a branch office.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: overview
ms.date: 07/27/2023
ms.service: network-access
ms.custom: 
---

# Understand remote network connectivity

Global Secure Access (preview) supports two connectivity options: installing a client on end-user device and configuring a remote network, for example a branch location with a physical router. Remote network connectivity streamlines how your end-users and guests connect from a remote network without needing to install the Global Secure Access Client.

This article describes the key concepts of remote network connectivity along with common scenarios where it may be useful.

## What is a remote network? 

Remote networks are remote locations or networks that require internet connectivity. For example, many organizations have a central headquarters and branch office locations in different geographic areas. These branch offices need access to corporate data and services. They need a secure way to talk to the data center, headquarters, and remote workers. The security of remote networks is crucial for many types of organizations.

Remote networks, such as a branch location, are typically connected to the corporate network through a dedicated Wide Area Network (WAN) or a Virtual Private Network (VPN) connection. Employees in the branch location connect to the network using customer premises equipment (CPE).

## Current challenges of remote network security 

**Bandwidth requirements have grown** – The number of devices requiring Internet access has increased exponentially. Traditional networks are difficult to scale. With the advent of Software as a Service (SaaS) applications like Microsoft 365, there are ever-growing demands of low latency and jitter-less communication that traditional technologies like Wide Area Network (WAN) and Multi-Protocol Label Switching (MPLS) struggle with. 

**IT teams are expensive** – Typically, firewalls are placed on physical devices on-premises, which requires an IT team for setup and maintenance. Maintaining an IT team at every branch location is expensive. 

**Evolving threats** – Malicious actors are finding new avenues to attack the devices at the edge of networks. Edge devices in branch offices or even home offices are often the most vulnerable point of attack.

## How does Global Secure Access remote network connectivity work? 

To connect a remote network to Global Secure Access, you set up an Internet Protocol Security (IPSec) tunnel between your on-premises equipment and the Global Secure Access endpoint. Traffic that you specify is routed through the IPSec tunnel to the nearest Global Secure Access endpoint. You can apply security policies in the Microsoft Entra admin center.

Global Secure Access remote network connectivity provides a secure solution between a remote network and the
Global Secure Access service. It doesn't provide a secure connection between one remote network and another.
To learn more about secure remote network-to-remote network connectivity, see the [Azure Virtual WAN documentation](/azure/virtual-wan/).
 
## Why remote network connectivity may be important for you? 
Maintaining security of a corporate network is increasingly difficult in a world of remote work and distributed teams. Security Service Edge (SSE) promises a world of security where customers can access their corporate resources from anywhere in the world without needing to back haul their traffic to headquarters.

## Common remote network connectivity scenarios

### I don’t want to install clients on thousands of devices on-premises. 
Generally, SSE is enforced by installing a client on a device. The client creates a tunnel to the nearest SSE endpoint and routes all Internet traffic through it. SSE solutions inspect the traffic and enforce security policies. If your users aren't mobile and based in a physical branch location, then remote network connectivity for that branch location removes the pain of installing a client on every device. You can connect the entire branch location by creating an IPSec tunnel between the core router of the branch office and the Global Secure Access endpoint.

### I can't install clients on all the devices my organization owns.
Sometimes, clients can't be installed on all devices. Global Secure Access currently provides clients for Windows. But what about Linux, mainframes, cameras, printers and other types of devices that are on premises and sending traffic to the Internet? This traffic still needs to be monitored and secured. When you connect a remote network, you can set policies for all traffic from that location regardless of the device where it originated.

### I have guests on my network who don't have the client installed.  
Guest devices on your network may not have the client installed. To ensure that those devices adhere to your network security policies, you need their traffic routed through the Global Secure Access endpoint. Remote network connectivity solves this problem. No clients need to be installed on guest devices. All outgoing traffic from the remote network is going through security evaluation by default.  

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps
- [List all remote networks](how-to-list-remote-networks.md)
- [Manage remote networks](how-to-manage-remote-networks.md)
