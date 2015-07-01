<properties
   pageTitle="Azure Resource Manager support for Load Balancer Preview | Microsoft Azure "
   description="Using powershell for Load Balancer with Azure Resource Manager (ARM) in preview. Using templates for load balancer"
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
   ms.date="05/27/2015"
   ms.author="joaoma" />


# Azure Resource Manager Support for Load Balancer - Preview

Azure Resource Manager (ARM) is the new management framework for services in Azure. Azure Load Balancer can now be managed using Azure Resource Manager-based APIs and tools. To learn more about Azure Resource Manager, see [Using Resource groups to manage your Azure resources](azure-preview-portal-using-resource-groups.md).

>[AZURE.NOTE] ARM support for Load Balancer is currently in Preview, including REST API, Azure PowerShell, Azure CLI and .NET SDK.

##Concepts

With ARM, Azure Load Balancer contains the following child resources:

- Front end IP configuration – a Load balancer can include one or more front end IP addresses, otherwise known as a virtual IPs (VIPs). These IP addresses serve as ingress for the traffic.

- Backend address pool – these are IP addresses associated with the virtual machine Network Interface Card (NIC) to which load will be distributed.

- Load balancing rules – a rule property maps a given front end IP and port combination to a set of back end IP addresses and port combination. With a single definition of a load balancer resource, you can define multiple load balancing rules, each rule reflecting a combination of a front end IP and port and back end IP and port associated with VMs.

- Probes – probes enable you to keep track of the health of VM instances. If a health probe fails, the VM instance will be taken out of rotation automatically.

- Inbound NAT rules – NAT rules defining the inbound traffic flowing through the front end IP and distributed to the back end IP.


![](https://acomdpsstorage.blob.core.windows.net/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/resource-groups-networking/20150429054039/figure5.png)



##Quickstart templates
Azure Resource Manager allows you to provision your applications using a declarative template. In a single template, you can deploy multiple services along with their dependencies. You use the same template to repeatedly deploy your application during every stage of the application lifecycle

Templates include Virtual Machines, Virtual Networks, Availability Sets, Network Interfaces (NICs), Storage Accounts, Load Balancers, Network Security Groups, and Public IPs. With templates you can create everything you need for a complex application using a simple file that you can check-in and collaborate on.

[Learn more about templates](http://go.microsoft.com/fwlink/?LinkId=544798)

[Learn more about Network Resources](../resource-groups-networking)

Templates using Azure Load Balancer can be found in a [GitHub repository](https://github.com/Azure/azure-quickstart-templates) hosting a set of community generated templates

Examples of templates:

- [2 VMs in a Load Balancer and load balancing rules](http://go.microsoft.com/fwlink/?LinkId=544799)

- [2 VMs in a VNET with an Internal Load Balancer and Load Balancer rules](http://go.microsoft.com/fwlink/?LinkId=544800)

- [2 VMs in a Load Balancer and configure NAT rules on the LB](http://go.microsoft.com/fwlink/?LinkId=544801)


## Setting up Azure Load Balancer with a PowerShell or CLI

With Azure Resource manager, load balancer implementation will rely in adding all components which will be part of the load balancer solution. 


The following example explains how to create a load balancer using powershell for ARM:

### Step 1 

Create a resource group where all the network objects will be together:

	$ResourceGroupName =<name of your resource group>
	$Location = < Region to create the resource group>

	New-AzureResourceGroup -Name $ResourceGroupName -Location $Location

When adding values it will look like this:
	
	$ResourceGroupName = "lbresourcegroup"
	$Location = "West US"

	New-AzureResourceGroup -Name $ResourceGroupName -Location $Location

### Step 2

After resource group is created, we have to create the network objects which will make the load balancer:


Create a subnet:

	$subnet = New-AzureVirtualNetworkSubnetConfig -Name ('subnet' + $ResourceGroupName) -AddressPrefix "10.0.0.0/24";


Add the subnet to a new virtual network:

	$vnet = New-AzureVirtualNetwork -Name ('vnet' + $ResourceGroupName) -ResourceGroupName $ResourceGroupName -Location $Location -AddressPrefix "10.0.0.0/16" -DnsServer "10.1.1.1" -Subnet $subnet;

Gets the subnet id object from ARM and assigns to a variable $subnetid. This will be used later to create a network interface (NIC) resource: 

	$subnetId = $vnet.subnets[0].Id;

Create a public IP: 
	$pubip = New-AzurePublicIpAddress -Name ('pubip' + 
	$ResourceGroupName) -ResourceGroupName $ResourceGroupName -Location $Location -AllocationMethod Dynamic -DomainNameLabel ('pubip' + $ResourceGroupName);
Creates a new Public IP address and assigns to variable $pubip

	$pubipId = $pubip.Id;
Assigns a public IP id value to variable $pubipId which will be used to create a network interface resource.

	$pubiplb = New-AzurePublicIpAddress -Name ('pubiplb' + $ResourceGroupName) -ResourceGroupName $ResourceGroupName -Location $Location -AllocationMethod Dynamic -DomainNameLabel ('pubiplb' + $ResourceGroupName);
Creates a public IP label which you will be able to access the public IP using a domain name label. 

	$pubiplbId = $pubiplb.Id;
Assigns the public IP label ID to a variable $pubiplbID

After creating the basic network objects
Write-Host "Creating network interfaces"
$nic = New-AzureNetworkInterface -Name ('nic' + $ResourceGroupName) -ResourceGroupName $ResourceGroupName -Location $Location -SubnetId $subnetId -PublicIpAddressId $pubip.Id;
$nic = Get-AzureNetworkInterface -Name ('nic' + $ResourceGroupName) -ResourceGroupName $ResourceGroupName;
$nicId = $nic.Id;


[Azure Networking Cmdlets](https://msdn.microsoft.com/library/azure/mt163510.aspx) can be used to create a Load Balancer. Get started with ARM cmdlets and REST APIs

- [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md)

- [Using the Azure CLI with Azure Resource Management](../xplat-cli-azure-resource-manager)

- [Load Balancer REST APIs](https://msdn.microsoft.com/library/azure/mt163651.aspx)


## See Also

[Configure a Load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
