---
title: Configure an ILB listener for availability groups (Classic)
description: This tutorial uses resources created with the classic deployment model, and it creates an Always On availability group listener in for a SQL Server VM in Azure that uses an internal load balancer.
services: virtual-machines-windows
documentationcenter: na
author: MikeRayMSFT
manager: craigg
editor: ''
tags: azure-service-management

ms.assetid: 291288a0-740b-4cfa-af62-053218beba77j
ms.service: virtual-machines-sql

ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 05/02/2017
ms.author: mikeray
ms.custom: "seo-lt-2019"

---
# Configure an ILB listener for availability groups on Azure SQL Server VMs
> [!div class="op_single_selector"]
> * [Internal listener](../classic/ps-sql-int-listener.md)
> * [External listener](../classic/ps-sql-ext-listener.md)
>
>

## Overview

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Azure Resource Manager and classic](../../../azure-resource-manager/management/deployment-models.md). This article covers the use of the classic deployment model. We recommend that most new deployments use the Resource Manager model.

To configure a listener for an Always On availability group in the Resource Manager model, see [Configure a load balancer for an Always On availability group in Azure](../../../azure-sql/virtual-machines/windows/availability-group-load-balancer-portal-configure.md).

Your availability group can contain replicas that are on-premises only or Azure only, or that span both on-premises and Azure for hybrid configurations. Azure replicas can reside within the same region or across multiple regions that use multiple virtual networks. The procedures in this article assume that you have already [configured an availability group](../classic/portal-sql-alwayson-availability-groups.md) but have not yet configured a listener.

## Guidelines and limitations for internal listeners
The use of an internal load balancer (ILB) with an availability group listener in Azure is subject to the following guidelines:

* The availability group listener is supported on Windows Server 2008 R2, Windows Server 2012, and Windows Server 2012 R2.
* Only one internal availability group listener is supported for each cloud service, because the listener is configured to the ILB, and there is only one ILB for each cloud service. However, it is possible to create multiple external listeners. For more information, see [Configure an external listener for Always On availability groups in Azure](../classic/ps-sql-ext-listener.md).

## Determine the accessibility of the listener
[!INCLUDE [ag-listener-accessibility](../../../../includes/virtual-machines-ag-listener-determine-accessibility.md)]

This article focuses on creating a listener that uses an ILB. If you need an public or external listener, see the version of this article that discusses setting up an [external listener](../classic/ps-sql-ext-listener.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

## Create load-balanced VM endpoints with direct server return
You first create an ILB by running the script later in this section.

Create a load-balanced endpoint for each VM that hosts an Azure replica. If you have replicas in multiple regions, each replica for that region must be in the same cloud service in the same Azure virtual network. Creating availability group replicas that span multiple Azure regions requires configuring multiple virtual networks. For more information on configuring cross virtual network connectivity, see [Configure virtual network to virtual network connectivity](../../../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md).

1. In the Azure portal, go to each VM that hosts a replica to view the details.

2. Click the **Endpoints** tab for each VM.

3. Verify that the **Name** and **Public Port** of the listener endpoint that you want to use are not already in use. In the example in this section, the name is *MyEndpoint*, and the port is *1433*.

4. On your local client, download and install the latest [PowerShell module](https://azure.microsoft.com/downloads/).

5. Start Azure PowerShell.  
    A new PowerShell session opens, with the Azure administrative modules loaded.

6. Run `Get-AzurePublishSettingsFile`. This cmdlet directs you to a browser to download a publish settings file to a local directory. You might be prompted for your sign-in credentials for your Azure subscription.

7. Run the following `Import-AzurePublishSettingsFile` command with the path of the publish settings file that you downloaded:

        Import-AzurePublishSettingsFile -PublishSettingsFile <PublishSettingsFilePath>

    After the publish settings file is imported, you can manage your Azure subscription in the PowerShell session.

8. For *ILB*, assign a static IP address. Examine the current virtual network configuration by running the following command:

        (Get-AzureVNetConfig).XMLConfiguration
9. Note the *Subnet* name for the subnet that contains the VMs that host the replicas. This name is used in the $SubnetName parameter in the script.

10. Note the *VirtualNetworkSite* name and the starting *AddressPrefix* for the subnet that contains the VMs that host the replicas. Look for an available IP address by passing both values to the `Test-AzureStaticVNetIP` command and by examining the *AvailableAddresses*. For example, if the virtual network is named *MyVNet* and has a subnet address range that starts at *172.16.0.128*, the following command would list available addresses:

        (Test-AzureStaticVNetIP -VNetName "MyVNet"-IPAddress 172.16.0.128).AvailableAddresses
11. Select one of the available addresses, and use it in the $ILBStaticIP parameter of the script in the next step.

12. Copy the following PowerShell script to a text editor, and set the variable values to suit your environment. Defaults have been provided for some parameters.  

    Existing deployments that use affinity groups cannot add an ILB. For more information about ILB requirements, see [Internal load balancer overview](../../../load-balancer/load-balancer-internal-overview.md).

    Also, if your availability group spans Azure regions, you must run the script once in each datacenter for the cloud service and nodes that reside in that datacenter.

        # Define variables
        $ServiceName = "<MyCloudService>" # the name of the cloud service that contains the availability group nodes
        $AGNodes = "<VM1>","<VM2>","<VM3>" # all availability group nodes containing replicas in the same cloud service, separated by commas
        $SubnetName = "<MySubnetName>" # subnet name that the replicas use in the virtual network
        $ILBStaticIP = "<MyILBStaticIPAddress>" # static IP address for the ILB in the subnet
        $ILBName = "AGListenerLB" # customize the ILB name or use this default value

        # Create the ILB
        Add-AzureInternalLoadBalancer -InternalLoadBalancerName $ILBName -SubnetName $SubnetName -ServiceName $ServiceName -StaticVNetIPAddress $ILBStaticIP

        # Configure a load-balanced endpoint for each node in $AGNodes by using ILB
        ForEach ($node in $AGNodes)
        {
            Get-AzureVM -ServiceName $ServiceName -Name $node | Add-AzureEndpoint -Name "ListenerEndpoint" -LBSetName "ListenerEndpointLB" -Protocol tcp -LocalPort 1433 -PublicPort 1433 -ProbePort 59999 -ProbeProtocol tcp -ProbeIntervalInSeconds 10 -InternalLoadBalancerName $ILBName -DirectServerReturn $true | Update-AzureVM
        }

13. After you have set the variables, copy the script from the text editor to your PowerShell session to run it. If the prompt still shows **>>**, press Enter again to make sure the script starts running.

## Verify that KB2854082 is installed if necessary
[!INCLUDE [kb2854082](../../../../includes/virtual-machines-ag-listener-kb2854082.md)]

## Open the firewall ports in availability group nodes
[!INCLUDE [firewall](../../../../includes/virtual-machines-ag-listener-open-firewall.md)]

## Create the availability group listener

Create the availability group listener in two steps. First, create the client access point cluster resource and configure  dependencies. Second, configure the cluster resources in PowerShell.

### Create the client access point and configure the cluster dependencies
[!INCLUDE [firewall](../../../../includes/virtual-machines-ag-listener-create-listener.md)]

### Configure the cluster resources in PowerShell
1. For ILB, you must use the IP address of the ILB that was created earlier. To obtain this IP address in PowerShell, use the following script:

        # Define variables
        $ServiceName="<MyServiceName>" # the name of the cloud service that contains the AG nodes
        (Get-AzureInternalLoadBalancer -ServiceName $ServiceName).IPAddress

2. On one of the VMs, copy the PowerShell script for your operating system to a text editor, and then set the variables to the values you noted earlier.

    For Windows Server 2012 or later, use the following script:

        # Define variables
        $ClusterNetworkName = "<MyClusterNetworkName>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
        $IPResourceName = "<IPResourceName>" # the IP address resource name
        $ILBIP = "<X.X.X.X>" # the IP address of the ILB

        Import-Module FailoverClusters

        Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"="59999";"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}

    For Windows Server 2008 R2, use the following script:

        # Define variables
        $ClusterNetworkName = "<MyClusterNetworkName>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
        $IPResourceName = "<IPResourceName>" # the IP address resource name
        $ILBIP = "<X.X.X.X>" # the IP address of the ILB

        Import-Module FailoverClusters

        cluster res $IPResourceName /priv enabledhcp=0 address=$ILBIP probeport=59999  subnetmask=255.255.255.255

3. After you have set the variables, open an elevated Windows PowerShell window, paste the script from the text editor into your PowerShell session to run it. If the prompt still shows **>>**, Press Enter again to make sure that the script starts running.

4. Repeat the preceding steps for each VM.  
    This script configures the IP address resource with the IP address of the cloud service and sets other parameters, such as the probe port. When the IP address resource is brought online, it can respond to the polling on the probe port from the load-balanced endpoint that you created earlier.

## Bring the listener online
[!INCLUDE [Bring-Listener-Online](../../../../includes/virtual-machines-ag-listener-bring-online.md)]

## Follow-up items
[!INCLUDE [Follow-up](../../../../includes/virtual-machines-ag-listener-follow-up.md)]

## Test the availability group listener (within the same virtual network)
[!INCLUDE [Test-Listener-Within-VNET](../../../../includes/virtual-machines-ag-listener-test.md)]

## Next steps
[!INCLUDE [Listener-Next-Steps](../../../../includes/virtual-machines-ag-listener-next-steps.md)]
