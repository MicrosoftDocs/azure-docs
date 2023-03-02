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
# Configure load balancing with MetalLB on your Azure Stack Edge

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to configure load balancing on your Azure Stack Edge device using MetalLB via Border Gateway Protocol (BGP). 

## About MetalLB and load balancing

MetalLB is a load-balancer implementation for bare metal Kubernetes clusters. MetalLB serves two functions: it assigns IP addresses to the Kubernetes load balancer services from a configured pool of IP addresses and then announces the IP to the external network. MetalLB achieves these functions through standard routing protocols such as Address Resolution Protocol (ARP), Neighbor Discovery Protocol (NDP), or Border Gateway Protocol (BGP). 

For more information, see [BGP mode for MetalLB](https://metallb.universe.tf/configuration/#bgp-configuratioN).

## MetalLB on Azure Stack Edge

There are multiple networking components such as Calico, MetalLB, and Core DNS installed on your Azure Stack Edge device. MetalLB hooks into the Kubernetes cluster running on your Azure Stack Edge device, and allows you to create Kubernetes services of type `LoadBalancer` in the cluster.

In BGP mode, all machines in the cluster establish BGP peering sessions with nearby routers that you control, and tell those routers how to forward traffic to the service IPs.MetalLB with the Border Gateway Protocol (BGP) is not the default networking mode for the Kubernetes cluster running on your device. To configure MetalLB via BGP, you designate the top-of-rack (ToR) switch as the load balancer and set up peer sessions. 

MetalLB in BGP mode can be configured to achieve low failover times if you are using 2-node devices. This configuration is more involved than the standard configuration as you may not have access to the top-of-rack switch.

## Configure MetalLB

You can configure MetalLB in BGP mode by connecting to the PowerShell interface of the device and then running specific cmdlets.

### Prerequisites

Before you begin, make sure that:
- Compute is enabled on one port of the device. This creates a virtual switch on that port. 
    - To enable compute, in the local UI for your device, go to **Advanced networking** page and select a port on which you want to enable compute. 
    - In the **Network settings** page, enable the port for compute. **Apply** the settings.
- You have available IPs in the same subnet the port that you enabled for compute on your device. 

### Configuration

For a basic configuration for MetalLB using BGP session, you need the following information:

- The peer IP address that MetalLB should connect to.
- The peer's Autonomous System Number (ASN). BGP requires that routes are announced with an ASN for peer sessions.
- The ASN MetalLB should use. ASNs are 16-bit numbers between 1 and 65534 and 32-bit numbers between 131072 and 4294967294.

> [!IMPORTANT]
> For MetalLB to work in BGP mode, peers must be specified. If no BGP peers are specified, MetalLB will work in default layer 2 mode. For more information, see [Layer 2 mode in MetalLB](https://metallb.universe.tf/concepts/layer2/). 


Follow these steps to configure MetalLB in BGP mode:

1. [Connect to the PowerShell interface](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface) of the device.
 
1. Run the `Get-HcsExternalVirtualSwitch` cmdlet to get the name of the external virtual switch that you'll use for BGP mode. This virtual switch is created when you enabled the port for compute.

    ```powershell
    Get-HcsExternalVirtualSwitch
    ```
1. Run the `Set-HcsBGPPeer` cmdlet to establish a BGP peer session.

    ```powershell
    Set-HcsBGPPeer -PeerAddress <IP address of the port that you enabled for compute> -PeerAsn <ASN for the peer> -SelfAsn <Your ASN> -SwitchName <Name of virtual switch on the port enabled for compute> -HoldTimeInSeconds <Optional hold time in seconds> 
    ```
1. Once you have established the session, run the `Get-HcsBGPPeers` cmdlet to get the peer sessions that exist on a virtual switch.

    ```powershell
    Get-HcsBGPPeers -SwitchName <Name of virtual switch that you enabled for compute>
    ```
1. Run the `Remove-HcsBGPPeer` cmdlet to remove the peer session. 

    ```powershell
    Remove-HcsBGPPeer -PeerAddress <IP address of the port that you enabled for compute> -SwitchName <Name of virtual switch on the port enabled for compute>
    ```
1. Run the `Get-HcsBGPPeers` to verify that the peer session is removed.

Here is an example output: 

```powershell
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

Try the new cross-platform PowerShell https://aka.ms/pscore6

PS C:\WINDOWS\system32> $Name = "dbe-1csphq2.microsoftdatabox.com"
PS C:\WINDOWS\system32> Set-Item WSMan:\localhost\Client\TrustedHosts $Name -Concatenate -Force
PS C:\WINDOWS\system32> $sessOptions = New-PSSessionOption -SkipCACheck -SkipCNCheck -SkipRevocationCheck
PS C:\WINDOWS\system32> Enter-PSSession -ComputerName $Name -Credential ~\EdgeUser -ConfigurationName Minishell -UseSSL -SessionOption $sessOptions
WARNING: The Windows PowerShell interface of your device is intended to
be used only for the initial network configuration. Please
engage Microsoft Support if you need to access this interface
to troubleshoot any potential issues you may be experiencing.
Changes made through this interface without involving Microsoft
Support could result in an unsupported configuration.
[dbe-1csphq2.microsoftdatabox.com]: PS>Get-HcsExternalVirtualSwitch

Name                          : vSwitch1
InterfaceAlias                : {Port2}
EnableIov                     : False
MacAddressPools               :
IPAddressPools                : {}
BGPPeers                      :
ConfigurationSource           : Dsc
EnabledForCompute             : False
EnabledForStorage             : False
EnabledForMgmt                : True
SupportsAcceleratedNetworking : False
DbeDhcpHostVnicName           : 3cb2d0ae-6a7b-44cc-8a5d-8eac2d1c0436
VirtualNetworks               : {}
EnableEmbeddedTeaming         : True
Vnics                         : {}
Type                          : External

Name                          : vSwitch2
InterfaceAlias                : {Port3, Port4}
EnableIov                     : False
MacAddressPools               :
IPAddressPools                : {}
BGPPeers                      :
ConfigurationSource           : Dsc
EnabledForCompute             : False
EnabledForStorage             : True
EnabledForMgmt                : False
SupportsAcceleratedNetworking : False
DbeDhcpHostVnicName           : 8dd480c0-8f22-42b1-8621-d2a43f70690d
VirtualNetworks               : {}
EnableEmbeddedTeaming         : True
Vnics                         : {}
Type                          : External

[dbe-1csphq2.microsoftdatabox.com]: PS>Set-HcsBGPPeer -PeerAddress 10.126.77.125 -PeerAsn 64512 -SelfAsn 64513 -SwitchName vSwitch1 -HoldTimeInSeconds 15
[dbe-1csphq2.microsoftdatabox.com]: PS>Get-HcsBGPPeers -SwitchName vSwitch1

PeerAddress   PeerAsn SelfAsn HoldTime
-----------   ------- ------- --------
10.126.77.125 64512   64513         15

[dbe-1csphq2.microsoftdatabox.com]: PS>Remove-HcsBGPPeer -PeerAddress 10.126.77.125 -SwitchName vSwitch1
[dbe-1csphq2.microsoftdatabox.com]: PS>Get-HcsBGPPeers -SwitchName vSwitch1
[dbe-1csphq2.microsoftdatabox.com]: PS>
```

## Next steps

- Learn more about [Networking on Kubernetes cluster on your Azure Stack Edge device](azure-stack-edge-gpu-kubernetes-networking.md).