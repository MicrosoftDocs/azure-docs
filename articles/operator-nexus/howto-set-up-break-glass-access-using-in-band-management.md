---
title: How to set up Break-Glass access using In-Band management in Azure Operator Nexus Network Fabric
description: Learn how to How to set up Break-Glass access using In-Band management 
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/24/2025
ms.custom: template-how-to
---

# Break-Glass access using In-Band management

In the Nexus Network Fabric (NNF), there is an out-of-band management network where most Fabric devices are connected to management switches via management ports (Ma1). The only exceptions are the Terminal Server and Aggregation Management Switches.
To address the potential single point of failure posed by the management switch, Microsoft team has provided the In-band Management Break Glass Access feature. 

## In-Band management break glass access
The In-band management break glass access feature provides a backup mechanism for the operations team to access Arista devices in the event of a primary management path failure. This feature allows operators to SSH into Arista devices using the loopback IP over the control plane VLAN / In-band management VRF, ensuring continuity of device management.

### Primary and backup paths

•	**Primary path:** The default method for accessing Arista devices is via the MA1 interface, which is used for management operations under normal conditions.

•	**Backup path:** In cases where the primary path is unavailable, the break glass access allows operators to SSH to the device using the loopback IP over the control plane VLAN / In-band management VRF.

The in-band management path is applicable only to devices configured and participating in BGP, excluding management switches and Network Packet Brokers (NPB). NPB does not support routing, and it is recommended against creating complex workarounds to enable such capability. The in-band management path relies on BGP because it provides dynamic routing, redundancy and resilience, ensuring that management traffic can be reliably routed through the network.

To support in-band management, a new loopback interface (lo6) is created on network devices. The addresses of these loopback interfaces will be advertised to the Provider Edge (PE) via the INFRA-MGMT VRF from the Customer Edge (CE). Customer IP addresses will be advertised to the Top of Rack (ToR) switches from the CEs via the default VRF.

## How to use Break-Glass access using Inband management

- Use the assigned IPv4 and IPv6 addresses to access the loopback interfaces on CE and ToR devices.

- Ensure that the inband management path works with devices configured and participating in BGP.

- Define and use trusted source IP prefixes for both IPv4 and IPv6 to enhance security and management.

> [!Note]
> For new deployments, provide a list of trusted IP prefixes or use default resources created by the system. <br> For existing deployments, ensure configurations are in place during upgrades and use PATCH operations to update the network Fabric.
