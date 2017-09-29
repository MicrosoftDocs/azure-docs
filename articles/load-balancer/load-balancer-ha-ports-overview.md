---
title: High Availability Ports Overview in Azure | Microsoft Docs
description: Learn about high availability ports load balancing on an internal load balancer 
services: load-balancer
documentationcenter: na
author: rdhillon
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 46b152c5-6a27-4bfc-bea3-05de9ce06a57
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/26/2017
ms.author: kumud
---

# High Availability Ports overview (Preview)

The Standard SKU of Azure Load Balancer introduces high availability (HA) ports - a capability to distribute traffic from all ports, and for all supported protocols. While configuring an Internal Load Balancer, users can configure an HA Ports rule that can set the frontend and backend ports to **0** and protocol to **all**, and thus allow all the traffic to flow through the Internal Load Balancer.

>[!NOTE]
> High Availability Ports feature is currently in Preview. During preview, the feature may not have the same level of availability and reliability as features that are in general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The load balancing algorithm still remains the same and the destination is selected based in the five touples <Source IP Address, Source Port, Destination IP Address, Destination Port, Protocol>. But this configuration allows for a single LB rule to process all available traffic, and reduces configuration complexity as well as any limits imposed by the maximum number of Load Balancing rules that one can add.

One of the critical scenarios HA ports enables is the high availability deployment of the Network Virtual Appliances in Azure virtual networks. In addition, another common scenario that HA ports enables is load balancing for a range of ports. 

## Why use high HA ports

Azure customers rely heavily on the network virtual appliances (NVAs) for securing their workloads from multiple types of security threats. In addition, the NVAs must be reliable and highly available.  

HA ports reduce the complexity of NVA HA scenario by eliminating the need for more complex solutions like zookeeper, and increases the reliability by quicker failover and scale-out options. You can now achieve NVA HA by adding NVAs in the backend pool of the Azure internal Load Balancer, and then configuring the HA port Load Balancer rule.

The following example presents a hub-and-spoke virtual network deployment, with the spokes force tunneling their traffic to the hub virtual network and via the NVA before leaving the trusted space. The NVAs are behind an Internal Load Balancer with HA Ports configuration, thus can process all the traffic and forward accordingly. 

![ha ports example](./media/load-balancer-ha-ports-overview/nvaha.png)

Figure 1 - Hub-and-spoke virtual network with NVAs deployed in HA mode


## Region availability

HA ports is currently available in the following regions:
- East US 2
- Central US
- North Europe
- West Central US
- West Europe
- Southeast Asia 

## Preview sign-up

To participate in the Preview of the HA ports feature in Load Balancer Standard SKU, register your subscription to gain access using either PowerShell or Azure CLI 2.0.

- Sign up using PowerShell

    ```powershell
    Register-AzureRmProviderFeature -FeatureName AllowILBAllPortsRule -ProviderNamespace Microsoft.Network
    ```

- Sign up using Azure CLI 2.0

    ```cli
    az feature register --name AllowILBAllPortsRule --namespace Microsoft.Network 
    ```
## Caveats

Following are the supported configurations or exceptions for HA Ports:

- A single frontend ipConfiguration can have a single DSR Load Balancer rule with HA ports (all ports), or it can have a single non-DSR load balancer rule with HA ports (all ports). It cannot have both.
- A single Network Interface IP configuration can only have one non-DSR load balancer rule with HA ports. No other rules can be configured for this ipconfig.
- A single Network Interface IP configuration can have one or more DSR load balancer rules with HA ports, provided all of their respective frontend ip configurations are unique.
- Two (or more) Load Balancer rules pointing to the same backend pool can co-exist if all of the load balancing rules are HA port (DSR only), or, all of the rules are non-HA port (DSR & non-DSR). Two such LB rules cannot co-exist if there is a combination of HA port and non-HA Port rules.
- HA port on IPv6-enabled tenant is not available.


## Next Steps

[Configure HA Ports on an Internal Load balancer](load-balancer-configure-ha-ports.md)

