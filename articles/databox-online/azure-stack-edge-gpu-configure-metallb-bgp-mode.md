---
title: Configure MetalLB via BGP on Azure Stack Edge
description: Describes how to configure MetalLB via Border Gateway Protocol for load balancing on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 09/24/2021
ms.author: alkohli
---
# Configure load balancing on your Azure Stack Edge

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to configure load balancing on your Azure Stack Edge device using MetalLB via Border Gateway Protocol (BGP). 

## About MetalLB

There are multiple networking components such as Calico, MetalLB, and Core DNS that are installed on your Azure Stack Edge device. If you connect to the PowerShell interface of the device, you can see these components running on your Kubernetes cluster.

MetalLB hooks into your Kubernetes cluster, and provides a network load-balancer implementation. MetalLB assigns an external IP address to a service and then makes an announcement to the external network that the IP “lives” in the cluster. MetalLB uses standard routing protocols to achieve this: ARP, NDP, or BGP. In BGP mode, all machines in the cluster establish BGP peering sessions with nearby routers that you control, and tell those routers how to forward traffic to the service IPs. 

For more information, see 
[BGP mode for MetalL](https://metallb.universe.tf/configuration/#bgp-configuratioN).

## MetalLB on Azure Stack Edge

MetalLB with the Border Gateway Protocol (BGP) is not the default networking mode for the Kubernetes cluster running on your device. To configure MetalLB via BGP, you designate the top-of-rack (ToR) switch as the load balancer and set up peer sessions. 

MetalLB in BGP mode can be configured to achieve low failover times if you are using 2-node devices . This configuration is more involved than the standard configuration as you may not have access to the top-of-rack switch.

## Configure MetalLB

You can configure MetalLB in BGP mode by connecting to the PowerShell interface of the device and then running specific cmdlets.

### Prerequisites

Before you begin, make sure that:
- One port on the device has compute enabled. This creates a virtual switch on that port. To enable compute, in the local UI for your device, go to 
- You have available IPs in the same subnet as that of the port that you enabled compute on your device. 

### Configuration

For a basic configuration featuring one BGP router and one IP address range, you need 4 pieces of information:

- The router IP address that MetalLB should connect to,
- The router’s Autonomous System Number (ASN). BGP requires that routes are announced with an ASN both for the router as well as the peer.
- The ASN MetalLB should use. ASNs are 16 bit numbers between 1 and 65534 and 32 bit numbers between 131072 and 4294967294.
- An IP address range expressed as a CIDR prefix. The IP address range that you provide is the range of available IPs in the same subnet as the port that you enabled for compute.

1. Connect to the [PowerShell interface of the device]().
1. Run the `Get-HcsExternalVirtualSwitch` cmdlet to get the name of the external virtual switch that you'll use for BGP mode.

    ```powershell
    Get-HcsExternalVirtualSwitch
    ```
1. Run the `Set-HcsBGPPeer` cmdlet to establish a BGP peer session.

    ```powershell
    Set-HcsBGPPeer -PeerAddress <IP address in the subnet that you enabled compute network> -PeerAsn <Random number 1> -SelfAsn <Random number 2> -SwitchName <Name of virtual switch that you enabled for compute> -HoldTimeInSeconds <Optional hold time in seconds> 
    ```
1. Once you have established the session, run the `Get-HcsBGPPeers` cmdlet to get the peer sessions that exist on a virtual switch.

    ```powershell
    Get-HcsBGPPeers -SwitchName <Name of virtual switch that you enabled for compute>
    ```
1. Run the `Remove-HcsBGPPeer` cmdlet to remove the peer session. 



## Next steps

- Learn more about [Networking on Kubernetes cluster on your Azure Stack Edge device](azure-stack-edge-gpu-kubernetes-networking.md).