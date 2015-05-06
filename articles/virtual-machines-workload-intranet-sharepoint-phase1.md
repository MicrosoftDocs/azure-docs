<properties 
	pageTitle="SharePoint Intranet Farm Workload Phase 1: Configure Azure" 
	description="In this first phase of deploying an intranet-only SharePoint 2013 farm with SQL Server AlwaysOn Availability Groups in Azure infrastructure services, you create the Azure virtual network and other Azure infrastructure elements." 
	documentationCenter=""
	services="virtual-machines" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/05/2015" 
	ms.author="josephd"/>

# SharePoint Intranet Farm Workload Phase 1: Configure Azure

In this phase of deploying an intranet-only SharePoint 2013 farm with SQL Server AlwaysOn Availability Groups in Azure infrastructure services, you build out the Azure networking and storage infrastructure. You must complete this phase before moving on to [Phase 2](virtual-machines-workload-intranet-sharepoint-phase2.md). See [Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-workload-intranet-sharepoint-overview.md) for all of the phases.

Azure must be provisioned with these basic network components:

- A cross-premises virtual network with one subnet
- Three Azure cloud services
- One Azure storage account to store VHD disk images and extra data disks

## Before you begin

Before you begin configuring Azure components, fill in the following tables. To assist you in the procedures for configuring Azure, print this section and write down the needed information or copy this section to a document and fill it in.

For the settings of the virtual network (VNet), fill in Table V. 

Item | Configuration element | Description | Value 
--- | --- | --- | --- 
1. | VNet name | A name to assign to the Azure Virtual Network (example SPFarmNet). | __________________
2. | VNet location | The Azure datacenter that will contain the virtual network. | __________________
3. | Local network name | A name to assign to your organization network. | __________________
4. | VPN device IP address | The public IPv4 address of your VPN device's interface on the Internet. Work with your IT department to determine this address. | __________________
5. | VNet address space | The address space (defined in a single private address prefix) for the virtual network. Work with your IT department to determine this address space. | __________________
6. | First final DNS server | The fourth possible IP address for the address space of the subnet of the virtual network (see Table S). Work with your IT department to determine these addresses. | __________________
7. | Second final DNS server | The fifth possible IP address for the address space of the subnet of the virtual network (see Table S). Work with your IT department to determine these addresses. | __________________

**Table V: Cross-premises virtual network configuration**

Fill in Table S for the subnet of this solution. Give the subnet a friendly name, a single IP address space based on the Virtual Network address space, and a descriptive purpose. The address space should be in Classless Interdomain Routing (CIDR) format, also known as network prefix format. An example is 10.24.64.0/20. Work with your IT department to determine this address space from the virtual network address space.

Item | Subnet name | Subnet address space | Purpose 
--- | --- | --- | --- 
1. | _______________ | _____________________________ | _________________________

**Table S: Subnets in the virtual network**

> [AZURE.NOTE] This pre-defined architecture uses a single subnet for simplicity. If you want to overlay a set of traffic filters to emulate subnet isolation, you can use Azure [Network Security Groups](https://msdn.microsoft.com/library/azure/dn848316.aspx).

For the two on-premises DNS servers that you want to use when initially setting up the domain controllers in your virtual network, fill in Table D. Give each DNS server a friendly name and a single IP address. This friendly name does not need to match the host name or computer name of the DNS server. Note that two blank entries are listed, but you can add more. Work with your IT department to determine this list. 

Item | DNS server friendly name | DNS server IP address 
--- | --- | ---
1. | ___________________________ | ___________________________
2. | ___________________________ | ___________________________ 

**Table D: On-premises DNS servers**

To route packets from the cross-premises network to your organization network across the site-to-site VPN connection, you must configure the virtual network with a local network that contains a list of the address spaces (in CIDR notation) for all of the reachable locations on your organization's on-premises network. The list of address spaces that define your local network must not include or overlap with the address space used for other virtual networks or other local networks. In other words, the address spaces for configured virtual networks and local networks must be unique.

For the set of local network address spaces, fill in Table L. Note that three blank entries are listed but you will typically need more. Work with your IT department to determine this list of address spaces.

Item | Local network address space 
--- | ---
1. | ___________________________________
2. | ___________________________________
3. | ___________________________________

**Table L: Address prefixes for the local network**

To create the virtual network with the settings from Tables V, S, D, and L, use the instructions in [Create a Cross-Premises Virtual Network Using Configuration Tables](virtual-machines-workload-deploy-vnet-config-tables.md). 

> [AZURE.NOTE] This procedure steps you through creating a virtual network that uses a site-to-site VPN connection. For information about using ExpressRoute for your site-to-site connection, see [ExpressRoute Technical Overview](http://msdn.microsoft.com/en-us/library/dn606309.aspx).

After creating the Azure virtual network, the Azure Management Portal will determine the following:

- The public IPv4 address of the Azure VPN gateway for your virtual network
- The Internet Protocol security (IPsec) pre-shared key for the site-to-site VPN connection

To see these in the Azure Management Portal after you create the virtual network, click **Networks**, click the name of the virtual network, and then click the **Dashboard** menu option.

Next, you’ll configure the virtual network gateway to create a secure site-to-site VPN connection. See [Configure the Virtual Network Gateway in the Management Portal](http://msdn.microsoft.com/library/jj156210.aspx) for the instructions. 

Next, create the site-to-site VPN connection between the new virtual network and an on-premises VPN device. For the details, see [Configure a Virtual Network Gateway in the Management Portal](http://msdn.microsoft.com/library/jj156210.aspx) for the instructions.

Next, ensure that the address space of the virtual network is reachable from your on-premises network. This is usually done by adding a route corresponding to the virtual network address space to your VPN device and then advertising that route to the rest of the routing infrastructure of your organization network. Work with your IT department to determine how to do this.

Next, use the instructions in [How to install and configure Azure PowerShell](install-configure-powershell.md) to install Azure PowerShell on your local computer. Open an Azure PowerShell command prompt.

First, select the correct Azure subscription with these commands. Replace everything within the quotes, including the < and > characters, with the correct names.

	$subscr="<Subscription name>"
	Select-AzureSubscription -SubscriptionName $subscr –Current

You can get the subscription name from the **SubscriptionName** property of the output of the **Get-AzureSubscription** command.

Next, create the three cloud services needed for this SharePoint farm. Fill out Table C. 

Item | Purpose | Cloud service name 
--- | --- | ---
1. | Domain controllers | ___________________________
2. | SQL servers | ___________________________
3. | SharePoint servers | ___________________________

**Table C: Cloud service names**

You must pick a unique name for each cloud service. *The cloud service name can contain only letters, numbers, and hyphens. The first and last character in the field must be a letter or number.* 

For example, you could name the first cloud service DCs-*UniqueSequence*, in which *UniqueSequence* is an abbreviation of your organization. For example, if your organization is named Tailspin Toys, you could name the cloud service DCs-Tailspin.

You can test for the uniqueness of the name with the following Azure PowerShell command on your local computer.

	Test-AzureName -Service <Proposed cloud service name>

If this command returns "False", your proposed name is unique. Then, create the cloud service with the following.

	New-AzureService -Service <Unique cloud service name> -Location "<Table V – Item 2 – Value column>"

Record the actual name of each newly-created cloud service in Table C.

Next, create a storage account for the SharePoint farm. *You must pick a unique name that contains only lowercase letters and numbers.* You can test for the uniqueness of the storage account name with the following Azure PowerShell command.

	Test-AzureName -Storage <Proposed storage account name>

If this command returns "False", your proposed name is unique. Then, create the storage account and set the subscription to use it with these commands.

	$staccount="<Unique storage account name>"
	New-AzureStorageAccount -StorageAccountName $staccount -Location "<Table V – Item 2 – Value column>"
	Set-AzureSubscription -SubscriptionName $subscr -CurrentStorageAccountName $staccount

Next, define the names of four availability sets. Fill out Table A. 

Item | Purpose | Availability set name 
--- | --- | --- 
1. | Domain controllers | ___________________________
2. | SQL servers | ___________________________
3. | SharePoint application servers | ___________________________
4. | SharePoint front-end web servers | ___________________________

**Table A: Availability set names**

You will need these names when you create the virtual machines in phases 2, 3, and 4.

This is the configuration resulting from the successful completion of this phase.

![](./media/virtual-machines-workload-intranet-sharepoint-phase1/workload-spsqlao_01.png)

## Next Step

To continue with the configuration of this workload, go to [Phase 2: Configure Domain Controllers](virtual-machines-workload-intranet-sharepoint-phase2.md).

## Additional Resources

[Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-workload-intranet-sharepoint-overview.md)

[SharePoint farms hosted in Azure infrastructure services](virtual-machines-sharepoint-infrastructure-services.md)

[SharePoint with SQL Server AlwaysOn Infographic](http://go.microsoft.com/fwlink/?LinkId=394788)

[Microsoft Azure Architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx)
