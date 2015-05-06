<properties 
   pageTitle="Gettting started with Internal load balancer | Microsoft Azure "
   description="Configure Internal Load balancer and how to implement them for Virtual Machines and Cloud deployments"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/01/2015"
   ms.author="joaoma" />

# Configure an internal load balancer set 

Azure Internal Load Balancing (ILB) provides load balancing between virtual machines that reside inside of a cloud service or a virtual network with a regional scope. For information about the use and configuration of virtual networks with a regional scope, see [Regional Virtual Networks](regional-virtual-networks.md) in the Azure blog. Existing virtual networks that have been configured for an affinity group cannot use ILB.



## Creating a load balancer set for Virtual Machines

To create an Azure internal load-balanced set and the servers that will send their traffic to it, you must do the following:

1. Create an ILB instance that will be the endpoint of incoming traffic to be load balanced across the servers of a load-balanced set.

1. Add endpoints corresponding to the virtual machines that will be receiving the incoming traffic.

1. Configure the servers that will be sending the traffic to be load balanced to send their traffic to the virtual IP address (VIP) of the ILB instance.

### Step 1: Create an ILB instance

For an existing cloud service or a cloud service deployed under a regional virtual network, you can create and ILB instance with the following Windows PowerShell commands:

	$svc="<Cloud Service Name>"
	$ilb="<Name of your ILB instance>"
	$subnet="<Name of the subnet within your virtual network-optional>"
	$IP="<The IPv4 address to use on the subnet-optional>"
	
	Add-AzureInternalLoadBalancer -ServiceName $svc -InternalLoadBalancerName $ilb –SubnetName $subnet –StaticVNetIPAddress $IP


To use these commands, fill in the values and remove the < and >. Here is an example:

	$svc="WebCloud-NY"
	$ilb="SQL-BE"
	$subnet="Farm1"
	$IP="192.168.98.10"
	Add-AzureInternalLoadBalancer -ServiceName $svc -InternalLoadBalancerName $ilb –SubnetName $subnet –StaticVNetIPAddress $IP


### Step 2: Add endpoints to the ILB instance

For existing virtual machines, you can add endpoints to the ILB instance with the following commands:

	$svc="<Cloud service name>"
	$vmname="<Name of the VM>"
	$epname="<Name of the endpoint>"
	$prot="tcp" or "udp"
	$locport=<local port number>
	$pubport=<public port number>
	$ilb="<Name of your ILB instance>"
	Get-AzureVM –ServiceName $svc –Name $vmname | Add-AzureEndpoint -Name $epname -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM

To use these commands, fill in the values and remove the < and >.

Note that this use of the [Add-AzureEndpoint](https://msdn.microsoft.com/library/dn495300.aspx) Windows PowerShell cmdlet uses the DefaultProbe parameter set. For more information on additional parameter sets, see [Add-AzureEndpoint](https://msdn.microsoft.com/library/dn495300.aspx).

Here is an example:

	$svc="AZ-LOB1"
	$vmname="SQL-LOBAZ1"
	$epname="SQL1"
	$prot="tcp"
	$locport=1433
	$pubport=1433
	$ilb="SQL ILB"
	Get-AzureVM –ServiceName $svc –Name $vmname | Add-AzureEndpoint -Name $epname -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM


### Step 3: Configure your servers to send their traffic to the new ILB endpoint

You must configure the servers whose traffic is going to be load balanced to use the new IP address (the VIP) of the ILB instance. This is the address on which the ILB instance is listening. In most cases, you just need to add or modify a DNS record for the VIP of the ILB instance.

If you specified the IP address during the creation of the ILB instance, you already have the VIP. Otherwise, you can see the VIP from the following commands:

	$svc="<Cloud Service Name>"
	Get-AzureService -ServiceName $svc | Get-AzureInternalLoadBalancer



To use these commands, fill in the values and remove the < and >. Here is an example:

	$svc="WebCloud-NY"
	Get-AzureService -ServiceName $svc | Get-AzureInternalLoadBalancer


From the display of the Get-AzureInternalLoadBalancer command, note the IP address and make the necessary changes to your servers or DNS records to ensure that traffic gets sent to the VIP.

## End-to-end examples of internal load balancing

To step you through the end-to end process of creating a load-balanced set for two example configurations, see the following sections.

### An Internet-facing, multi-tier application

The Contoso Corporation wants to provide load balancing between a set of Internet-facing web servers and a set of database servers. Both sets of servers are hosted in a single Azure cloud service. Web server traffic to TCP port 1433 must be distributed among three virtual machines in the database tier. Figure 1 shows the configuration.

![Internal load-balanced set for the database tier](./media/load-balancer-internal-getstarted/IC736321.png)

Figure 1: Example of an Internet-facing, multi-tier application

The configuration consists of the following:

- The existing cloud service hosting the virtual machines is named Contoso-PartnerSite.

- The three existing database servers are named PARTNER-SQL-1, PARTNER-SQL-2, and PARTNER-SQL-3.

- Web servers in the web tier connect to the database servers in the database tier using the DNS name partner-sql.external.contoso.com.

The following commands configure a new ILB instance named PARTNER-DBTIER and add endpoints to the virtual machines corresponding to the three database servers:

	$svc="Contoso-PartnerSite"
	$ilb="PARTNER-DBTIER"
	Add-AzureInternalLoadBalancer -ServiceName $svc -InternalLoadBalancerName $ilb

	$prot="tcp"
	$locport=1433
	$pubport=1433
	$epname="DBTIER1"
	$vmname="PARTNER-SQL-1"
	Get-AzureVM –ServiceName $svc –Name $vmname | Add-AzureEndpoint -Name $epname -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM

	$epname="DBTIER2"
	$vmname="PARTNER-SQL-2"
	Get-AzureVM –ServiceName $svc –Name $vmname | Add-AzureEndpoint -Name $epname -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM

	$epname="DBTIER3"
	$vmname="PARTNER-SQL-3"
	Get-AzureVM –ServiceName $svc –Name $vmname | Add-AzureEndpoint -Name $epname -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM

Next, Contoso determined the VIP of the PARTNER-DBTIER ILB instance with the following command:

	Get-AzureService -ServiceName $svc | Get-AzureInternalLoadBalancer

From the display of this command, Contoso noted the VIP address of 100.64.65.211 and configured the DNS Address (A) record for the name partner-sql.external.contoso.com to use this new address.

### An LOB application hosted in Azure

The Contoso Corporation wants to host a line-of-business (LOB) application on a set of web servers in Azure. Client traffic to TCP port 80 must be load-balanced among three virtual machines running in a cross-premises virtual network. Figure 2 shows the configuration.

![Internal load balancing for an LOB application](./media/load-balancer-internal-getstarted/IC744148.png)

Figure 2: Example of an LOB application hosted in Azure

The configuration consists of the following:

- The existing cloud service hosting the virtual machines is named Contoso-Legal.

- The subnet on which the LOB servers are located is named LOB-LEGAL and Contoso has chosen the address 198.168.99.145 as the VIP address for the internal load balancer.

- The three existing LOB servers are named LEGAL-1, LEGAL-2, and LEGAL-3.

- Intranet web clients connect to them using the DNS name legalnet.corp.contoso.com.

The following commands create an ILB instance named LEGAL-ILB and add endpoints to the virtual machines corresponding to the three LOB servers:


	$svc="Contoso-Legal"
	$ilb="LEGAL-ILB"
	$subnet="LOB-LEGAL"
	$IP="198.168.99.145"
	Add-AzureInternalLoadBalancer –ServiceName $svc -InternalLoadBalancerName $ilb –SubnetName $subnet –StaticVNetIPAddress $IP

	$prot="tcp"
	$locport=80
	$pubport=80
	$epname="LOB1"
	$vmname="LEGAL-1"
	Get-AzureVM –ServiceName $svc –Name $vmname | Add-AzureEndpoint -Name $epname -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM

	$epname="LOB2"
	$vmname="LEGAL2"
	Get-AzureVM –ServiceName $svc –Name $vmname | Add-AzureEndpoint -Name $epname -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM

	$epname="LOB3"
	$vmname="LEGAL3"
	Get-AzureVM –ServiceName $svc –Name $vmname | Add-AzureEndpoint -Name $epname -Protocol $prot -LocalPort $locport -PublicPort $pubport –DefaultProbe -InternalLoadBalancerName $ilb | Update-AzureVM


Next, Contoso configured the DNS A record for the legalnet.corp.contoso.com name to use 198.168.99.145.

## Add a Virtual Machine to ILB

To add a virtual machine to an ILB instance as it is created, you can use the New-AzureInternalLoadBalancerConfig and New-AzureVMConfig cmdlets.

Here is an example:

	$svc="AZ-LOB1"
	$ilb="LOB-ILB"
	$vnet="LOBNet_Azure"
	$subnet="LOBServers"
	$vmname="LOB-WEB1"
	$adminuser="Lando"
	$adminpw="Platform327"
	$regionname="North Central US"

	$myilbconfig=New-AzureInternalLoadBalancerConfig -InternalLoadBalancerName $ilb -SubnetName $subnet
	$images = Get-AzureVMImage
	New-AzureVMConfig -Name $vmname -InstanceSize Small -ImageName $images[50].ImageName | Add-AzureProvisioningConfig -Windows -AdminUsername $adminuser -Password $adminpw | New-AzureVM -ServiceName $svc -InternalLoadBalancerConfig $myilbconfig -Location $regionname –VNetName $vnet

## Configuring ILB for Cloud Services 


ILB is supported for both Virtual machines and Cloud Services
An ILB endpoint created in a Cloud Service that is outside a Regional Virtual Network will be accessible only within the Cloud Service.

The ILB configuration has to be set during the creation of the first deployment in the Cloud Service, as shown in the cmdlet sample below.

### Create a local ILB Object
	$myilbconfig = New-AzureInternalLoadBalancerConfig -InternalLoadBalancerName "MyILB" 

### Add Internal Load Balancer for a new service

	New-AzureVMConfig -Name "Instance1" -InstanceSize Small -ImageName <imagename> | Add-AzureProvisioningConfig -Windows -AdminUsername <username> -Password <password> | New-AzureVM -ServiceName "Website2" -InternalLoadBalancerConfig $myilbconfig -Location "West US"



## Removing ILB configuration

To remove a virtual machine as an endpoint from an ILB instance, use the following commands:

	$svc="<Cloud service name>"
	$vmname="<Name of the VM>"
	$epname="<Name of the endpoint>"
	Get-AzureVM -ServiceName $svc -Name $vmname | Remove-AzureEndpoint -Name $epname | Update-AzureVM

To use these commands, fill in the values, removing the < and >.

Here is an example:

	$svc="AZ-LOB1"
	$vmname="SQL-LOBAZ1"
	$epname="SQL1"
	Get-AzureVM -ServiceName $svc -Name $vmname | Remove-AzureEndpoint -Name $epname | Update-AzureVM

To remove an ILB instance from a cloud service, use the following commands:

	$svc="<Cloud service name>"
	Remove-AzureInternalLoadBalancer -ServiceName $svc

To use these commands, fill in the value and remove the < and >.

Here is an example:

	$svc="AZ-LOB1"
	Remove-AzureInternalLoadBalancer -ServiceName $svc


## Additional information about ILB cmdlets


To obtain additional information about ILB cmdlets, run the following commands at an Azure Windows PowerShell prompt:

- Get-help New-AzureInternalLoadBalancerConfig -full

- Get-help Add-AzureInternalLoadBalancer -full

- Get-help Get-AzureInternalLoadbalancer -full

- Get-help Remove-AzureInternalLoadBalancer -full

## See Also

[Configure a Load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)

