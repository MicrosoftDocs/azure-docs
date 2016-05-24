<properties 
	pageTitle="Line of business application Phase 4 | Microsoft Azure" 
	description="Create the web servers and load your line of business application on them in Phase 4 of the line of business application in Azure." 
	documentationCenter=""
	services="virtual-machines-windows" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""
	tags="azure-resource-manager"/>

<tags 
	ms.service="virtual-machines-windows" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-windows" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/01/2016" 
	ms.author="josephd"/>

# Line of Business Application Workload Phase 4: Configure web servers

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

In this phase of deploying a high availability line of business application in Azure infrastructure services, you build out the web servers and load your line of business application on them.

You must complete this phase before moving on to [Phase 5](virtual-machines-windows-ps-lob-ph5.md). See [Deploy a high-availability line of business application in Azure](virtual-machines-windows-lob-overview.md) for all of the phases.

## Create the web server virtual machines in Azure

There are two web server virtual machines, on which you can deploy ASP.NET applications or older applications that can be hosted by Internet Information Services (IIS) 8 in Windows Server 2012 R2.

First, you configure internal load balancing so that Azure distributes the client traffic to the line of business application evenly among the two web servers. This requires you to specify an internal load balancing instance consisting of a name and its own IP address, assigned from the subnet address space that you assigned to your Azure virtual network. 

> [AZURE.NOTE] The following command sets use Azure PowerShell 1.0 and later. For more information, see [Azure PowerShell 1.0](https://azure.microsoft.com/blog/azps-1-0/).

Specify the values for the variables, removing the < and > characters. Note that the following Azure PowerShell command sets use values from the following tables:

- Table M, for your virtual machines
- Table V, for your virtual network settings
- Table S, for your subnet
- Table ST, for your storage accounts
- Table A, for your availability sets

Recall that you defined Table M in [Phase 2](virtual-machines-windows-ps-lob-ph2.md) and Tables V, S, ST, and A in [Phase 1](virtual-machines-windows-ps-lob-ph1.md).

When you have supplied all the proper values, run the resulting block at the Azure PowerShell command prompt.

	# Set up key variables
	$rgName="<resource group name>"
	$locName="<Azure location of your resource group>"
	$vnetName="<Table V – Item 1 – Value column>"
	$privIP="<available IP address on the subnet>"
	$vnet=Get-AzureRMVirtualNetwork -Name $vnetName -ResourceGroupName $rgName

	$frontendIP=New-AzureRMLoadBalancerFrontendIpConfig -Name WebServers-LBFE -PrivateIPAddress $privIP -SubnetId $vnet.Subnets[1].Id
	$beAddressPool=New-AzureRMLoadBalancerBackendAddressPoolConfig -Name WebServers-LBBE

	# This example assumes unsecured (HTTP-based) web traffic to the web servers.
	$healthProbe=New-AzureRMLoadBalancerProbeConfig -Name WebServersProbe -Protocol "TCP" -Port 80 -IntervalInSeconds 15 -ProbeCount 2
	$lbrule=New-AzureRMLoadBalancerRuleConfig -Name "WebTraffic" -FrontendIpConfiguration $frontendIP -BackendAddressPool $beAddressPool -Probe $healthProbe -Protocol "TCP" -FrontendPort 80 -BackendPort 80
	New-AzureRMLoadBalancer -ResourceGroupName $rgName -Name "WebServersInAzure" -Location $locName -LoadBalancingRule $lbrule -BackendAddressPool $beAddressPool -Probe $healthProbe -FrontendIpConfiguration $frontendIP

Next, add a DNS address record to your organization's internal DNS infrastructure that resolves the fully qualified domain name of the line of business application (such as lobapp.corp.contoso.com) to the IP address assigned to the internal load balancer (the value of $privIP in the preceding Azure PowerShell command block).

Next, use the following block of PowerShell commands to create the virtual machines for the two web servers. 

When you have supplied all the proper values, run the resulting block at the Azure PowerShell prompt.

	# Set up key variables
	$rgName="<resource group name>"
	$locName="<Azure location of your resource group>"
	$webLB=Get-AzureRMLoadBalancer -ResourceGroupName $rgName -Name "WebServersInAzure"	
	
	# Use the standard storage account
	$saName="<Table ST – Item 2 – Storage account name column>"

	$vnetName="<Table V – Item 1 – Value column>"
	$beSubnetName="<Table S - Item 2 - Name column>"
	$avName="<Table A – Item 3 – Availability set name column>"
	$vnet=Get-AzureRMVirtualNetwork -Name $vnetName -ResourceGroupName $rgName
	$backendSubnet=Get-AzureRMVirtualNetworkSubnetConfig -Name $beSubnetName -VirtualNetwork $vnet
	
	# Create the first web server virtual machine
	$vmName="<Table M – Item 6 - Virtual machine name column>"
	$vmSize="<Table M – Item 6 - Minimum size column>"
	$nic=New-AzureRMNetworkInterface -Name ($vmName + "-NIC") -ResourceGroupName $rgName -Location $locName -Subnet $backendSubnet -LoadBalancerBackendAddressPool $webLB.BackendAddressPools[0]
	$avSet=Get-AzureRMAvailabilitySet -Name $avName –ResourceGroupName $rgName 
	$vm=New-AzureRMVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the first web server." 
	$vm=Set-AzureRMVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureRMVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm=Add-AzureRMVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureRMVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureRMVM -ResourceGroupName $rgName -Location $locName -VM $vm
	
	# Create the second web server virtual machine
	$vmName="<Table M – Item 7 - Virtual machine name column>"
	$vmSize="<Table M – Item 7 - Minimum size column>"
	$nic=New-AzureRMNetworkInterface -Name ($vmName + "-NIC") -ResourceGroupName $rgName -Location $locName -Subnet $backendSubnet -LoadBalancerBackendAddressPool $webLB.BackendAddressPools[0]
	$vm=New-AzureRMVMConfig -VMName $vmName -VMSize $vmSize -AvailabilitySetId $avset.Id
	$cred=Get-Credential -Message "Type the name and password of the local administrator account for the second SQL Server computer." 
	$vm=Set-AzureRMVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm=Set-AzureRMVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm=Add-AzureRMVMNetworkInterface -VM $vm -Id $nic.Id
	$storageAcc=Get-AzureRMStorageAccount -ResourceGroupName $rgName -Name $saName
	$osDiskUri=$storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/" + $vmName + "-OSDisk.vhd"
	$vm=Set-AzureRMVMOSDisk -VM $vm -Name "OSDisk" -VhdUri $osDiskUri -CreateOption fromImage
	New-AzureRMVM -ResourceGroupName $rgName -Location $locName -VM $vm

> [AZURE.NOTE] Because these virtual machines are for an intranet application, they are not assigned a public IP address or a DNS domain name label and exposed to the Internet. However, this also means that you cannot connect to them from the Azure portal. The **Connect** button will be unavailable when you view the properties of the virtual machine.

Use the remote desktop client of your choice and create a remote desktop connection to each web server virtual machine. Use its intranet DNS or computer name and the credentials of the local administrator account.

Next, for each web server virtual machine, join them to the appropriate Active Directory domain with these commands at the Windows PowerShell prompt.

	$domName="<Active Directory domain name to join, such as corp.contoso.com>"
	Add-Computer -DomainName $domName
	Restart-Computer

Note that you must supply domain account credentials after entering the **Add-Computer** command.

After they restart, reconnect to them using an account that has local administrator privileges.

Next, for each web server, install and configure IIS.

1. Run Server Manager, and then click **Add roles and features**.
2. On the Before you begin page, click **Next**.
3. On the Select installation type page, click **Next**.
4. On the Select destination server page, click **Next**.
5. On the Server roles page, click **Web Server (IIS)** in the list of **Roles**.
6. When prompted, click **Add Features**, and then click **Next**.
7. On the Select features page, click **Next**.
8. On the Web Server (IIS) page, click **Next**.
9. On the Select role services page, select or clear the check boxes for the services you need for your LOB application, and then click **Next**.
10.On the Confirm installation selections page, click **Install**.

## Deploy your line of business application on the web server virtual machines

From a computer on your on-premises network:

1.	Add the files for your line of business application to the two web servers.
2.	Create the databases for your line of business application on the SQL Server cluster.
3.	Test access to your line of business application and its functionality.

This diagram is the configuration resulting from the successful completion of this phase.

![](./media/virtual-machines-windows-ps-lob-ph4/workload-lobapp-phase4.png)

## Next Step

- Use [Phase 5](virtual-machines-windows-ps-lob-ph5.md) to complete the configuration of this workload.
