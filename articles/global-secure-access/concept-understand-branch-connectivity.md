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


Global Secure Access supports two types of connectivity options -  
Install an agent (or client) that runs on corporate devices and connects to our service edge 
A Customer Premises Equipment (CPE) connects the branch office to our service edge 

## What is a branch office? 
Branches are remote locations or networks that require internet connectivity. For example, banks have a headquarter but they also have branch offices that are closer to their customers. These branch offices need access to corporate data and services. As a result, they need a secure way to talk to the data center, headquarters, or their remote workers. Hence, the security of branch becomes very crucial for organizations like yours. 

## Current challenges of branch security 

1. **Bandwidth requirements have grown** – The number of devices requiring internet has increased exponentially. Traditional networks are difficult to scale up. With the advent of SaaS applications like M365, there is an ever-growing demand of low latency and jitter-less communication that traditional technology like WAN and MPLS struggle with. 
1. **IT teams are expensive** – Typically, firewalls are placed on physical devices on-premise which requires an IT team for setup and maintenance. Maintaining an IT team at every branch location is very expensive. 
1. **Evolving threats** – Malicious actors are finding new avenues to attack the devices at edge which are most vulnerable. 
1. **No holistic solution for network and security** – SD-WAN is definitely a step up from legacy WAN, but these SD-WAN appliances are not designed to meet all security requirements. As a result, enterprises have to manage a patchwork of network and security offerings from multiple vendors.  

## How does Global Secure Access branch connectivity works? 

It's simple. Set up an IPSec tunnel between your on-premise equipment and our service endpoint. This will route the traffic you specified to flow over the IPSec tunnel over to us where we can apply the security policies defined by your organization before sending it to the destination to fetch the resource. 

> [!NOTE]
> Global Secure Access branch connectivity provide secure solution between a branch office to
> Global Secure Access service. It does not yet provide a secure connectivity between one branch 
> to another. We recommend using Azure virtual WAN for this. 
 
## Why branch connectivity may be important for you? 
SASE (Secure Access Service Edge) promises a world of security where customers can access their corporate resources from anywhere in the world without the need backhaul their traffic to the HQ. So, it begs a question – why is branch security important? The answer is simple - corpnet exists today and will continue to exist for quite some time.  

Below are some common scenarios for which you may want to prefer branch connectivity over an agent-based solution: 

### I don’t want to install agents on thousands of devices on-prem. 
Generally, SASE is enforced by installing an agent on a device. Read about this here- <insert link to Global Secure Access client doc>. This agent creates a tunnel to nearest deployed service and routes all traffic to internet through it. Thus, SASE vendors like Microsoft inspect the traffic and enforce security policies. But what if the you do not want to go through the pain of installing the agents on thousands of devices on-prem? That’s where branch connectivity makes life simpler for the organizations. Simply create an IPSec tunnel between the core router of the branch office and our service deployed at the edge. We will acquire the traffic you specify and apply security policies over it. 

### I cannot install agents on all the devices my organization owns 
Sometime, agents cannot be installed on all devices on-prem. We have agents for Windows, Android, iOS and Mac. But what about Linux, mainframes, cameras, printers and other types of devices that are on-prem and sending the traffic to internet? This traffic still needs to be monitored and secured. 

### I have guests coming on my network who do not have the agents installed.  
The guests coming to your network may not have agent installed on their mobile phones or laptops. But they may still use your wi-fi. How to ensure that those devices adhere to your network security policies? Branch connectivity solves this. No additional agents need to be installed on guests’ devices. All outgoing traffic from the branch is going through security evaluation by default.  

## Next steps
<!-- Add a context sentence for the following links -->
- [Configure branch Office locations](how-to-configure-branch-office-locations.md)
