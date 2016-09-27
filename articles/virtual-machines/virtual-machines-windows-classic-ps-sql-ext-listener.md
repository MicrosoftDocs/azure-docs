<properties
	pageTitle="Configure an external Listener for Always On Availability Groups | Microsoft Azure"
	description="This tutorial walks you through steps of creating an Always On Availability Group Listener in Azure that is externally accessible by using the public Virtual IP address of the associated cloud service."
	services="virtual-machines-windows"
	documentationCenter="na"
	authors="MikeRayMSFT"
	manager="jhubbard"
	editor=""
	tags="azure-service-management" />
<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="07/12/2016"
	ms.author="MikeRayMSFT" />

# Configure an external listener for Always On Availability Groups in Azure

> [AZURE.SELECTOR]
- [Internal Listener](virtual-machines-windows-classic-ps-sql-int-listener.md)
- [External Listener](virtual-machines-windows-classic-ps-sql-ext-listener.md)

This topic shows you how to configure a listener for an Always On Availability Group that is externally accessible on the internet. This is made possible by associating the cloud service's **public Virtual IP (VIP)** address with the listener.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]


Your Availability Group can contain replicas that are on-premises only, Azure only, or span both on-premises and Azure for hybrid configurations. Azure replicas can reside within the same region or across multiple regions using multiple virtual networks (VNets). The steps below assume you have already [configured an availability group](virtual-machines-windows-classic-portal-sql-alwayson-availability-groups.md) but have not configured a listener.

## Guidelines and limitations for external listeners

Note the following guidelines about the availability group listener in Azure when you are deploying using the cloud service pubic VIP address:

- The availability group listener is supported on Windows Server 2008 R2, Windows Server 2012, and Windows Server 2012 R2.

- The client application must reside on a different cloud service than the one that contains your availability group VMs. Azure does not support direct server return with client and server in the same cloud service.

- By default, the steps in this article show how to configure one listener to use the cloud service Virtual IP (VIP) address. However, it is possible to reserve and create multiple VIP addresses for your cloud service. This enables you to use the steps in this article to create multiple listeners that are each associated with a different VIP. For information on how to create multiple VIP addresses, see [Multiple VIPs per cloud service](../load-balancer/load-balancer-multivip.md).

- If you are creating a listener for a hybrid environment, the on-premises network must have connectivity to the public Internet in addition to the site-to-site VPN with the Azure virtual network. When in the Azure subnet, the availability group listener is reachable only by the public IP address of the respective cloud service.

- It is not supported to create an external listener in the same cloud service where you also have an internal listener using the Internal Load Balancer (ILB).

## Determine the accessibility of the listener

[AZURE.INCLUDE [ag-listener-accessibility](../../includes/virtual-machines-ag-listener-determine-accessibility.md)]

This article focuses on creating a listener that uses **external load balancing**. If you want a listener that is private to your virtual network, see the version of this article that provides steps for setting up an [listener with ILB](virtual-machines-windows-classic-ps-sql-int-listener.md)

## Create load-balanced VM endpoints with direct server return

External load balancing uses the virtual the public Virtual IP address of the cloud service that hosts your VMs. So you do not need to create or configure the load balancer in this case.

[AZURE.INCLUDE [load-balanced-endpoints](../../includes/virtual-machines-ag-listener-load-balanced-endpoints.md)]

1. Copy the PowerShell script below into a text editor and set the variable values to suit your environment (defaults have been provided for some parameters). Note that if your availability group spans Azure regions, you must run the script once in each datacenter for the cloud service and nodes that reside in that datacenter.

		# Define variables
		$ServiceName = "<MyCloudService>" # the name of the cloud service that contains the availability group nodes
		$AGNodes = "<VM1>","<VM2>","<VM3>" # all availability group nodes containing replicas in the same cloud service, separated by commas

		# Configure a load balanced endpoint for each node in $AGNodes, with direct server return enabled
		ForEach ($node in $AGNodes)
		{
		    Get-AzureVM -ServiceName $ServiceName -Name $node | Add-AzureEndpoint -Name "ListenerEndpoint" -Protocol "TCP" -PublicPort 1433 -LocalPort 1433 -LBSetName "ListenerEndpointLB" -ProbePort 59999 -ProbeProtocol "TCP" -DirectServerReturn $true | Update-AzureVM
		}

1. Once you have set the variables, copy the script from the text editor into your Azure PowerShell session to run it. If the prompt still shows >>, type ENTER again to make sure the script starts running.

## Verify that KB2854082 is installed if necessary

[AZURE.INCLUDE [kb2854082](../../includes/virtual-machines-ag-listener-kb2854082.md)]

## Open the firewall ports in availability group nodes

[AZURE.INCLUDE [firewall](../../includes/virtual-machines-ag-listener-open-firewall.md)]

## Create the availability group listener

[AZURE.INCLUDE [firewall](../../includes/virtual-machines-ag-listener-create-listener.md)]

1. For external load balancing, you must obtain the public virtual IP address of the cloud service that contains your replicas. Log into the Azure classic portal. Navigate to the cloud service that contains your availability group VM. Open the **Dashboard** view.

3. Note the address shown under **Public Virtual IP (VIP) Address**. If your solution spans VNets, repeat this step for each cloud service that contains a VM that hosts a replica.

4. On one of the VMs, copy the PowerShell script below into a text editor and set the variables to the values you noted earlier.

		# Define variables
		$ClusterNetworkName = "<ClusterNetworkName>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
		$IPResourceName = "<IPResourceName>" # the IP Address resource name
		$CloudServiceIP = "<X.X.X.X>" # Public Virtual IP (VIP) address of your cloud service

		Import-Module FailoverClusters

		# If you are using Windows Server 2012 or higher, use the Get-Cluster Resource command. If you are using Windows Server 2008 R2, use the cluster res command. Both commands are commented out. Choose the one applicable to your environment and remove the # at the beginning of the line to convert the comment to an executable line of code.

		# Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$CloudServiceIP";"ProbePort"="59999";"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"OverrideAddressMatch"=1;"EnableDhcp"=0}
		# cluster res $IPResourceName /priv enabledhcp=0 overrideaddressmatch=1 address=$CloudServiceIP probeport=59999  subnetmask=255.255.255.255


1. Once you have set the variables, open an elevated Windows PowerShell window, then copy the script from the text editor and paste into your Azure PowerShell session to run it. If the prompt still shows >>, type ENTER again to make sure the script starts running.

1. Repeat this on each VM. This script configures the IP Address resource with the IP address of the cloud service and sets other parameters like the probe port. When the IP Address resource is brought online, it can then respond to the polling on the probe port from the load-balanced endpoint created earlier in this tutorial.

## Bring the listener online

[AZURE.INCLUDE [Bring-Listener-Online](../../includes/virtual-machines-ag-listener-bring-online.md)]

## Follow-up items

[AZURE.INCLUDE [Follow-up](../../includes/virtual-machines-ag-listener-follow-up.md)]

## Test the availability group listener (within the same VNet)

[AZURE.INCLUDE [Test-Listener-Within-VNET](../../includes/virtual-machines-ag-listener-test.md)]

## Test the availability group listener (over the internet)

In order to access the listener from outside the virtual network, you must be using external/public load balancing (described in this topic) rather than ILB, which is only accesible within the same VNet. In the connection string, you specify the cloud service name. For example, if you had a cloud service with the name *mycloudservice*, the sqlcmd statement would be as follows:

	sqlcmd -S "mycloudservice.cloudapp.net,<EndpointPort>" -d "<DatabaseName>" -U "<LoginId>" -P "<Password>"  -Q "select @@servername, db_name()" -l 15

Unlike the previous example, SQL authentication must be used, because the caller cannot use windows authentication over the internet. For more information, see [Always On Availability Group in Azure VM: Client Connectivity Scenarios](http://blogs.msdn.com/b/sqlcat/archive/2014/02/03/alwayson-availability-group-in-windows-azure-vm-client-connectivity-scenarios.aspx). When using SQL authentication, make sure that you create the same login on both replicas. For more information about troubleshooting logins with Availability Groups, see [How to map logins or use contained SQL database user to connect to other replicas and map to availability databases](http://blogs.msdn.com/b/alwaysonpro/archive/2014/02/19/how-to-map-logins-or-use-contained-sql-database-user-to-connect-to-other-replicas-and-map-to-availability-databases.aspx).

If the Always On replicas are in different subnets, clients must specify **MultisubnetFailover=True** in the connection string. This results in parallel connection attempts to replicas in the different subnets. Note that this scenario includes a cross-region Always On Availability Group deployment.

## Next steps

[AZURE.INCLUDE [Listener-Next-Steps](../../includes/virtual-machines-ag-listener-next-steps.md)]
