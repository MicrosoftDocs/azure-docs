---
title: High availability ports overview in Azure | Microsoft Docs
description: Learn about high availability ports load balancing on an internal load balancer. 
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

# High availability ports overview

Azure Load Balancer Standard helps you load balance TCP and UDP flows on all ports simultaneously, when you are using an internal Load Balancer. 

>[!NOTE]
> The high availability (HA) ports feature is available with Load Balancer Standard, and is currently in preview. During preview, the feature might not have the same level of availability and reliability as features that are in the general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Sign up for the Load Balancer Standard preview to use HA ports with Load Balancer Standard resources. Follow the instructions for sign-up to Load Balancer [Standard preview](https://aka.ms/lbpreview#preview-sign-up) as well.

An HA ports rule is a variant of a load balancing rule, configured on an internal Load Balancer Standard. You can simplify your use of Load Balancer by providing a single rule to load balance all TCP and UDP flows arriving on all ports of an internal Load Balancer Standard. The load balancing decision is made per flow. This is based on the following five-tuple connection: Source IP Address, Source Port, Destination IP Address, Destination Port, and Protocol.

The HA ports feature helps you with critical scenarios, such as high availability and scale for network virtual appliances (NVA) inside virtual networks. It can also help when a large number of ports must be load balanced. 

The HA ports feature is configured when you set the front-end and back-end ports to **0**, and the protocol to **All**. The internal Load Balancer resource then balances all TCP and UDP flows, regardless of port number.

## Why use HA ports?

### <a name="nva"></a>Network virtual appliances

You can use NVAs for securing your Azure workload from multiple types of security threats. When NVAs are used in these scenarios, they must be reliable and highly available, and they must scale out for demand.

You can achieve these goals simply by adding NVA instances to the back-end pool of the Azure internal Load Balancer, and configuring an HA ports Load Balancer rule.

HA ports provide several advantages for NVA HA scenarios:
- Fast failover to healthy instances, with per-instance health probes
- Higher performance with scale-out to *n*-active instances
- *N*-active and active-passive scenarios
- Eliminating the need for complex solutions like Apache ZooKeeper nodes for monitoring appliances

The following diagram presents a hub-and-spoke virtual network deployment. The spokes force-tunnel their traffic to the hub virtual network and through the NVA, before leaving the trusted space. The NVAs are behind an internal Load Balancer Standard with an HA ports configuration. All traffic can be processed and forwarded accordingly.

![Diagram of hub-and-spoke virtual network, with NVAs deployed in HA mode](./media/load-balancer-ha-ports-overview/nvaha.png)

>[!NOTE]
> If you are using NVAs, confirm with the respective provider how to best use HA ports, and which scenarios are supported.

### Load balancing large numbers of ports

You can also use HA ports for applications that require load balancing of large numbers of ports. You can simplify these scenarios by using an internal [Load Balancer Standard](https://aka.ms/lbpreview) with HA ports. A single load balancing rule replaces multiple individual load balancing rules, one for every port.

## Region availability

The HA ports feature is available in the [same regions as Load Balancer Standard](https://aka.ms/lbpreview#region-availability).  

## Preview sign-up

To participate in the preview of the HA ports feature in Load Balancer Standard, register your subscription to gain access. You can use either Azure CLI 2.0 or PowerShell.

>[!NOTE]
>To use this feature, you must also sign up for Load Balancer [Standard preview](https://aka.ms/lbpreview#preview-sign-up), in addition to the HA ports feature. Registration can take up to an hour.

### Sign up by using Azure CLI 2.0

1. Register the feature with the provider:
    ```cli
    az feature register --name AllowILBAllPortsRule --namespace Microsoft.Network
    ```
    
2. The preceding operation can take up to 10 minutes to complete. You can check the status of the operation with the following command:

    ```cli
    az feature show --name AllowILBAllPortsRule --namespace Microsoft.Network
    ```
    
    The operation is successful when the feature registration state returns **Registered**, as shown here:
   
    ```json
    {
       "id": "/subscriptions/foo/providers/Microsoft.Features/providers/Microsoft.Network/features/AllowLBPreview",
       "name": "Microsoft.Network/AllowILBAllPortsRule",
       "properties": {
          "state": "Registered"
       },
       "type": "Microsoft.Features/providers/features"
    }
    ```
    
3. Complete the preview sign-up by re-registering your subscription with the resource provider:

    ```cli
    az provider register --namespace Microsoft.Network
    ```
    
### Sign up by using PowerShell

1. Register the feature with the provider:
    ```powershell
    Register-AzureRmProviderFeature -FeatureName AllowILBAllPortsRule -ProviderNamespace Microsoft.Network
    ```
    
2. The preceding operation can take up to 10 minutes to complete. You can check the status of the operation with the following command:

    ```powershell
    Get-AzureRmProviderFeature -FeatureName AllowILBAllPortsRule -ProviderNamespace Microsoft.Network
    ```
    The operation is successful when the feature registration state returns **Registered**, as shown here:
   
    ```
    FeatureName          ProviderName      RegistrationState
    -----------          ------------      -----------------
    AllowILBAllPortsRule Microsoft.Network Registered
    ```
    
3. Complete the preview sign-up by re-registering your subscription with the resource provider:

    ```powershell
    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
    ```


## Limitations

The following are the supported configurations or exceptions for the HA ports feature:

- A single front-end IP configuration can have a single DSR load balancer rule with HA ports, or it can have a single non-DSR load balancer rule with HA ports. It cannot have both.
- A single network interface IP configuration can only have one non-DSR load balancer rule with HA ports. You can't configure any other rules for this ipconfig.
- A single network interface IP configuration can have one or more DSR load balancer rules with HA ports, provided all of their respective front-end IP configurations are unique.
- If all of the load balancing rules are HA ports (DSR only), two (or more) Load Balancer rules pointing to the same back-end pool can co-exist. The same is true if all of the rules are non-HA ports (DSR and non-DSR). If there is a combination of HA ports and non-HA ports rules, however, two such load balancing rules can't co-exist.
- The HA ports feature is not available for IPv6.
- Flow symmetry for NVA scenarios is supported with a single NIC only. See the description and diagram for [network virtual appliances](#nva). 



## Next steps

- [Configure HA ports on an internal Load Balancer Standard](load-balancer-configure-ha-ports.md)
- [Learn about Load Balancer Standard preview](https://aka.ms/lbpreview)

