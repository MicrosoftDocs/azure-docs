---
title: Configure an ILB Listener for Always On Availability Groups | Microsoft Docs
description: This tutorial uses resources created with  the classic deployment model, and creates an Always On Availability Group Listener in Azure using an Internal Load Balancer (ILB).
services: virtual-machines-windows
documentationcenter: na
author: MikeRayMSFT
manager: jhubbard
editor: ''
tags: azure-service-management

ms.assetid: 291288a0-740b-4cfa-af62-053218beba77
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: infrastructure-services
ms.date: 08/19/2016
ms.author: MikeRayMSFT

---
# Configure an ILB listener for Always On Availability Groups in Azure
> [!div class="op_single_selector"]
> * [Internal Listener](virtual-machines-windows-classic-ps-sql-int-listener.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
> * [External Listener](virtual-machines-windows-classic-ps-sql-ext-listener.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
> 
> 

## Overview
This topic shows you how to configure a listener for an Always On Availability Group by using an **Internal Load Balancer (ILB)**.

> [!IMPORTANT] 
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../articles/azure-resource-manager/resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model.

To configure an ILB listener for an Always On availability group in Resource Manager model, see [Configure an internal load balancer for an Always On availability group in Azure](virtual-machines-windows-portal-sql-alwayson-int-listener.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

Your Availability Group can contain replicas that are on-premises only, Azure only, or span both on-premises and Azure for hybrid configurations. Azure replicas can reside within the same region or across multiple regions using multiple virtual networks (VNets). The steps below assume you have already [configured an availability group](virtual-machines-windows-classic-portal-sql-alwayson-availability-groups.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json) but have not configured a listener.

## Guidelines and limitations for internal listeners
Note the following guidelines on the availability group listener in Azure using ILB:

* The availability group listener is supported on Windows Server 2008 R2, Windows Server 2012, and Windows Server 2012 R2.
* Only one internal availability group listener is supported per cloud service, because the listener is configured to the ILB, and there is only one ILB per cloud service. However, it is possible to create multiple external listeners. For more information, see [Configure an external listener for Always On Availability Groups in Azure](virtual-machines-windows-classic-ps-sql-ext-listener.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).
* It is not supported to create an internal listener in the same cloud service where you also have an external listener using the cloud service's public VIP.

## Determine the accessibility of the listener
[!INCLUDE [ag-listener-accessibility](../../includes/virtual-machines-ag-listener-determine-accessibility.md)]

This article focuses on creating a listener that uses an **Internal Load Balancer (ILB)**. If you need an public/external listener, see the version of this article that provides steps for setting up an [external listener](virtual-machines-windows-classic-ps-sql-ext-listener.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)

## Create load-balanced VM endpoints with direct server return
For ILB, you must first create the internal load balancer. This is done in the script below.

[!INCLUDE [load-balanced-endpoints](../../includes/virtual-machines-ag-listener-load-balanced-endpoints.md)]

1. For **ILB**, you should assign a static IP address. First, examine the current VNet configuration by running the following command:
   
        (Get-AzureVNetConfig).XMLConfiguration
2. Note the **Subnet** name for the subnet that contains the VMs that host the replicas. This will be used in the **$SubnetName** parameter in the script.
3. Then note the **VirtualNetworkSite** name and the starting **AddressPrefix** for the subnet that contains the VMs that host the replicas. Look for an available IP Address by passing both values to the **Test-AzureStaticVNetIP** command and examining the **AvailableAddresses**. For example, if the VNet was named *MyVNet* and had a subnet address range that started at *172.16.0.128*, the following command would list available addresses:
   
        (Test-AzureStaticVNetIP -VNetName "MyVNet"-IPAddress 172.16.0.128).AvailableAddresses
4. Choose one of the available addresses and use it in the **$ILBStaticIP** parameter of the following script.
5. Copy the PowerShell script below into a text editor and set the variable values to suit your environment (note that defaults have been provided for some parameters). Note that existing deployments that use affinity groups cannot add ILB. For more information on ILB requirements, see [Internal Load Balancer](../load-balancer/load-balancer-internal-overview.md). Also, if your availability group spans Azure regions, you must run the script once in each datacenter for the cloud service and nodes that reside in that datacenter.
   
        # Define variables
        $ServiceName = "<MyCloudService>" # the name of the cloud service that contains the availability group nodes
        $AGNodes = "<VM1>","<VM2>","<VM3>" # all availability group nodes containing replicas in the same cloud service, separated by commas
        $SubnetName = "<MySubnetName>" # subnet name that the replicas use in the VNet
        $ILBStaticIP = "<MyILBStaticIPAddress>" # static IP address for the ILB in the subnet
        $ILBName = "AGListenerLB" # customize the ILB name or use this default value
   
        # Create the ILB
        Add-AzureInternalLoadBalancer -InternalLoadBalancerName $ILBName -SubnetName $SubnetName -ServiceName $ServiceName -StaticVNetIPAddress $ILBStaticIP
   
        # Configure a load balanced endpoint for each node in $AGNodes using ILB
        ForEach ($node in $AGNodes)
        {
            Get-AzureVM -ServiceName $ServiceName -Name $node | Add-AzureEndpoint -Name "ListenerEndpoint" -LBSetName "ListenerEndpointLB" -Protocol tcp -LocalPort 1433 -PublicPort 1433 -ProbePort 59999 -ProbeProtocol tcp -ProbeIntervalInSeconds 10 -InternalLoadBalancerName $ILBName -DirectServerReturn $true | Update-AzureVM
        }
6. Once you have set the variables, copy the script from the text editor into your Azure PowerShell session to run it. If the prompt still shows >>, type ENTER again to make sure the script starts running.Note

> [!NOTE]
> The Azure classic portal does not support the Internal Load Balancer at this time, so you will not see either the ILB or the endpoints in the Azure classic portal. However, **Get-AzureEndpoint** returns an internal IP address if the Load Balancer is running on it. Otherwise, it returns null.
> 
> 

## Verify that KB2854082 is installed if necessary
[!INCLUDE [kb2854082](../../includes/virtual-machines-ag-listener-kb2854082.md)]

## Open the firewall ports in availability group nodes
[!INCLUDE [firewall](../../includes/virtual-machines-ag-listener-open-firewall.md)]

## Create the availability group listener
[!INCLUDE [firewall](../../includes/virtual-machines-ag-listener-create-listener.md)]

1. For ILB, you must use the IP address of the Internal Load Balancer (ILB) created earlier. Use the following script to obtain this IP Address in PowerShell.
   
        # Define variables
        $ServiceName="<MyServiceName>" # the name of the cloud service that contains the AG nodes
        (Get-AzureInternalLoadBalancer -ServiceName $ServiceName).IPAddress
2. On one of the VMs, copy the PowerShell script for your operating system into a text editor and set the variables to the values you noted earlier.
   
    For Windows Server 2012 or higher use the following script:
   
        # Define variables
        $ClusterNetworkName = "<MyClusterNetworkName>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
        $IPResourceName = "<IPResourceName>" # the IP Address resource name
        $ILBIP = “<X.X.X.X>” # the IP Address of the Internal Load Balancer (ILB)
   
        Import-Module FailoverClusters
   
        Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"="59999";"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}
   
    For Windows Server 2008 R2 use the following script:
   
        # Define variables
        $ClusterNetworkName = "<MyClusterNetworkName>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
        $IPResourceName = "<IPResourceName>" # the IP Address resource name
        $ILBIP = “<X.X.X.X>” # the IP Address of the Internal Load Balancer (ILB)
   
        Import-Module FailoverClusters
   
        cluster res $IPResourceName /priv enabledhcp=0 address=$ILBIP probeport=59999  subnetmask=255.255.255.255
3. Once you have set the variables, open an elevated Windows PowerShell window, then copy the script from the text editor and paste into your Azure PowerShell session to run it. If the prompt still shows >>, type ENTER again to make sure the script starts running.
4. Repeat this on each VM. This script configures the IP Address resource with the IP address of the cloud service and sets other parameters like the probe port. When the IP Address resource is brought online, it can then respond to the polling on the probe port from the load-balanced endpoint created earlier in this tutorial.

## Bring the listener online
[!INCLUDE [Bring-Listener-Online](../../includes/virtual-machines-ag-listener-bring-online.md)]

## Follow-up items
[!INCLUDE [Follow-up](../../includes/virtual-machines-ag-listener-follow-up.md)]

## Test the availability group listener (within the same VNet)
[!INCLUDE [Test-Listener-Within-VNET](../../includes/virtual-machines-ag-listener-test.md)]

## Next steps
[!INCLUDE [Listener-Next-Steps](../../includes/virtual-machines-ag-listener-next-steps.md)]

