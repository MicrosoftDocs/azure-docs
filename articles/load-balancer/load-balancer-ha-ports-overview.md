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

Azure Load Balancer Standard introduces a new ability to load balance TCP and UDP flows on all ports simultaneously when using an internal Load Balancer. 

>[!NOTE]
> High Availability Ports feature is available with Load Balancer Standard and currently in preview. During preview, the feature may not have the same level of availability and reliability as features that are in general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). It is necessary to sign up for the Load Balancer Standard Preview to use HA Ports with Load Balancer Standard resources. Follow the instructions for sign-up in addition to Load Balancer [Standard Preview](https://aka.ms/lbpreview#preview-sign-up) as well.

An HA Ports rule is a variant of a load balancing rule configured on an internal Load Balancer Standard.  Scenarios are simplified by providing a single LB rule to load balance all TCP and UDP flows arriving on all ports of an internal Load Balancer Standard frontend. The load balancing decision is made per flow based on the five-tuple of Source IP Address, Source Port, Destination IP Address, Destination Port, and Protocol.

HA Ports enables critical scenarios such as high availability and scale for Network Virtual Appliances (NVA) inside virtual networks as well as other scenarios where a large number of ports must be load balanced. 

HA Ports is configured by setting the frontend and backend ports to **0** and protocol to **All**.  The internal Load Balancer resource  now balances all TCP and UDP flows irrespective of port number.

## Why use HA ports

### <a name="nva"></a>Network Virtual Appliances

You can use network virtual appliances (NVA) for securing your Azure workload from multiple types of security threats. When NVA are used in these scenarios, they must be reliable, highly available, and scale-out for demand.

You can achieve these goals in your scenario by simply adding NVA instances to the backend pool of the Azure internal Load Balancer and configuring an HA Ports Load Balancer rule.

HA Ports provide several advantages for NVA HA scenarios:
- fast fail over to healthy instances with per instance health probes
- higher performance with scale-out to n-active instances
- n-active and active-passive scenarios
- eliminating the need for complex solutions like Zookeeper nodes for monitoring appliances

The following example presents a hub-and-spoke virtual network deployment, with the spokes force tunneling their traffic to the hub virtual network and through the NVA before leaving the trusted space. The NVAs are behind an internal Load Balancer Standard with HA Ports configuration.  All traffic can be processed and forward accordingly. 

![ha ports example](./media/load-balancer-ha-ports-overview/nvaha.png)

Figure 1 - Hub-and-spoke virtual network with NVAs deployed in HA mode

If you are using Network Virtual Appliances, please confirm with the respective provider how to best use HA Ports and which scenarios are supported.

### Load balancing large numbers of ports

You can also use HA Ports for application scenarios which require load balanicng of large numbers of ports. These scenarios can be simplified using an internal [Load Balancer Standard](https://aka.ms/lbpreview) with HA Ports where a single load balancing rule replaces multiple individual load balancing rules, one for every port.

## Region availability

HA ports is available in the [same regions as Load Balancer Standard](https://aka.ms/lbpreview#region-availability).  

## Preview sign-up

To participate in the Preview of the HA ports feature in Load Balancer Standard, register your subscription to gain access using either Azure CLI 2.0 or PowerShell.  Follow these three steps:

>[!NOTE]
>To use this feature, you must also sign-up for Load Balancer [Standard Preview](https://aka.ms/lbpreview#preview-sign-up) in addition to HA Ports. Registration of the HA Ports or Load Balancer Standard previews may take up to an hour.

### Sign up using Azure CLI 2.0

1. Register the feature with the provider
    ```cli
    az feature register --name AllowILBAllPortsRule --namespace Microsoft.Network
    ```
    
2. The preceding operation can take up to 10 minutes to complete.  You can check the status of the operation with the following command:

    ```cli
    az feature show --name AllowILBAllPortsRule --namespace Microsoft.Network
    ```
    
    Please proceed to step 3 when the feature registration state returns 'Registered' as shown below:
   
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
    
3. Please complete the preview sign-up by re-registering your subscription with the resource provider:

    ```cli
    az provider register --namespace Microsoft.Network
    ```
    
### Sign up using PowerShell

1. Register the feature with the provider
    ```powershell
    Register-AzureRmProviderFeature -FeatureName AllowILBAllPortsRule -ProviderNamespace Microsoft.Network
    ```
    
2. The preceding operation can take up to 10 minutes to complete.  You can check the status of the operation with the following command:

    ```powershell
    Get-AzureRmProviderFeature -FeatureName AllowILBAllPortsRule -ProviderNamespace Microsoft.Network
    ```
    Please proceed to step 3 when the feature registration state returns 'Registered' as shown below:
   
    ```
    FeatureName          ProviderName      RegistrationState
    -----------          ------------      -----------------
    AllowILBAllPortsRule Microsoft.Network Registered
    ```
    
3. Please complete the preview sign-up by re-registering your subscription with the resource provider:

    ```powershell
    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
    ```


## Limitations

Following are the supported configurations or exceptions for HA Ports:

- A single frontend IP Configuration can have a single DSR Load Balancer rule with HA Ports, or it can have a single non-DSR load balancer rule with HA Ports. It cannot have both.
- A single Network Interface IP configuration can only have one non-DSR load balancer rule with HA Ports. No other rules can be configured for this ipconfig.
- A single Network Interface IP configuration can have one or more DSR load balancer rules with HA Ports, provided all of their respective frontend IP configurations are unique.
- If all of the load balancing rules are HA Ports (DSR only), or, all of the rules are non-HA Ports (DSR & non-DSR), two (or more) Load Balancer rules pointing to the same backend pool can co-exist. Two such load balancing rules cannot co-exist if there is a combination of HA Ports and non-HA Ports rules.
- HA Ports is not available for IPv6.
- Flow symmetry for NVA scenarios is supported with single NIC only. See description and diagram for [Network Virtual Appliances](#nva). 



## Next steps

- [Configure HA Ports on an internal Load Balancer Standard](load-balancer-configure-ha-ports.md)
- [Learn about Load Balancer Standard preview](https://aka.ms/lbpreview)

