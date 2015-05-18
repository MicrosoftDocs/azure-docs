<properties 
	pageTitle="Azure Infrastructure Services Implementation Guidelines" 
	description="Learn about the key design and implementation guidelines for deploying an IT workload in Azure infrastructure services." 
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

# Azure Infrastructure Services Implementation Guidelines
 
These guidelines focus on the key design decisions and tasks to determine the variety of resources that are involved in most Azure infrastructure services implementations.

Azure is an excellent platform to implement proof-of-concept configuration, since it requires very little investment to test a particular approach to implementation of solutions. However, you must be able to distinguish the easy practices for a proof-of-concept from the more difficult, detailed practices for a fully functional, production-ready implementation of an IT workload.

This guidance identifies many areas for which planning are key to the success of an IT infrastructure or workload in Azure. In addition, it helps the implementation of solutions on the Azure platform by providing an order to the creation of the necessary resources. Although there is some flexibility, Microsoft recommends that you apply this order to your planning and decision-making.

1.	Naming conventions
2.	Subscriptions and accounts
3.	Storage
4.	Virtual networks
5.	Cloud services
6.	Availability Sets
7.	Virtual machines

Establishing a good naming convention, as well as following a specific, systematic order to create the resources in Azure immensely reduces administrative burden and increases the chances of success for any implementation project.

> [AZURE.NOTE] Affinity groups are not described as their use has been deprecated. For more information, see [About Regional VNets and Affinity Groups](https://msdn.microsoft.com/library/azure/jj156085.aspx).

## 1. Naming Conventions

A good naming convention should be in place before creating anything in Azure. A naming convention ensures that all the resources have a predictable name, which helps lower the administrative burden associated with management of those resources.

You may choose to follow a specific set of naming conventions defined for your entire organization, or for a specific Azure subscription or account. Although it is easy for individuals within organizations to establish implicit rules when working with Azure resources, when a team needs to work on a project on Azure, that model does not scale well. 

You should agree upon the set of naming conventions up front. There are some considerations regarding naming conventions that cut across the sets of rules that make up those conventions.

### Affixes

When creating certain resources, Azure will use some defaults to simplify management of the resources associated to these resources. For example, when creating the first virtual machine for a new cloud service, the Azure Management Portal will attempt to use the virtual machine’s name for the name of a new cloud service for the virtual machine.

Therefore, it is beneficial to identify types of resources that need an affix to identify that type. In addition, clearly specify whether the affix will be at:

- The beginning of the name (prefix)
- The end of the name (suffix)

For instance, here are two possible names for a cloud service the hosts a calculation engine:

- Svc-CalculationEngine (prefix)
- CalculationEngine-Svc (suffix)

Affixes can refer to different aspects that describe the particular resources. The following table shows some examples typically used.

Aspect | Examples | Notes
--- | --- | ---
Environment | dev, stg, prod | Depending on the purpose and name of each environment.
Location | usw (West US), use (East US 2) | Depending on the region of the datacenter or the region of the organization.
Azure component, service, or product | Svc for cloud service, VNet for virtual network | Depending on the product for which the resource provides support.
Role | sql, ora, sp, iis | Depending on the role of the VM.
Instance | 01, 02, 03, etc. | For resources that may have more than one instance. For example, load balanced web servers in a cloud service.
		
When establishing your naming conventions, make sure that they clearly state which affixes to use for each type of resource, and in which position (prefix vs suffix).

### Dates

Many times, it is important to determine the date of creation from the name of a resource. Microsoft recommends the YYYYMMDD date format. This format ensures that not only the full date is recorded, but also that two resources whose names differ only on the date will be sorted alphabetically and chronologically at the same time.

### Naming Resources
You should define each type of resource in the naming convention, which should have rules that define how to assign names to each resource created. These rules should apply to all types of resources, for instance:

- Subscriptions
- Accounts
- Storage accounts
- Virtual networks
- Subnets
- Availability Sets
- Cloud Services
- Virtual Machines
- Endpoints
- Network Security Groups
- Roles

Names should be as descriptive as possible, to ensure that the name can provide enough information to determine to which resource it refers.

### Computer Names

When administrators create a virtual machine, Microsoft Azure will require them to provide a virtual machine name. Microsoft Azure will use the virtual machine name as the Azure virtual machine resource name. Azure will use the same name as the computer name for the operating system installed in the virtual machine. However, these names may not always be the same. 

In cases in which a virtual machine is created from a .VHD file that already contains an operating system, the virtual machine name in Microsoft Azure may differ from the virtual machine’s OS computer name. This situation may add a degree of difficulty to virtual machine management and we discourage it. Always ensure that the Azure virtual machine resource name is the same name as the computer name as assigned to the operating system of that virtual machine.

We recommend that the Azure Virtual Machine name be the same as the underlying OS computer name. Because of this, follow the NetBIOS naming rules as described in [Microsoft NetBIOS Computer Naming Conventions](https://support.microsoft.com/kb/188997/).

### Storage Account Names

Storage accounts have special rules governing their names. You can only use lowercase letters and numbers and the assigned name, concatenated to the service (blob, table, or queue) and the default domain (core.windows.net) should render a globally valid, unique DNS name. For instance, if the storage account is called mystorageaccount, the following resulting URLs should be valid, unique DNS names:

- mystorageaccount.blob.core.windows.net
- mystorageaccount.table.core.windows.net
- mystorageaccount.queue.core.windows.net

In addition, storage accounts may take advantage of containers. These must adhere to the naming conventions as described in [Naming and Referencing Containers, Blobs, and Metadata](https://msdn.microsoft.com/library/azure/dd135715.aspx).

### Azure Building Block names

Azure Building Blocks are application level services that Azure offers, typically to those applications taking advantage of PaaS features, although IaaS resources may leverage some, like Azure SQL, Traffic Manager, and others.

These services rely on an array of artifacts that are created and registered in Azure. These also need to be considered in your naming conventions.

### Implementation guidelines recap for naming conventions

Decision: 

- What are your naming conventions for Azure resources? 

Task: 

- Define the naming conventions in terms of affixes, hierarchy, string values, and other policies for Azure resources.

## 2. Subscriptions and accounts

In order to work with Azure, you need one or more Azure subscriptions. Resources, like cloud services or virtual machines, exist in the context of those subscriptions.

- Enterprise customers typically have an Enterprise Enrollment, which is the top-most resource in the hierarchy, and is associated to one or more accounts. 
- For consumers and customers without an Enterprise Enrollment, the top-most resource is the Account.
- Subscriptions are associated to accounts, and there can be one or more subscriptions per account. Azure records billing information at the subscription level.

Due to the limit of two hierarchy levels on the Account/Subscription relationship, it is important to align the naming convention of accounts and subscriptions to the billing needs. For instance, if a global company uses Azure, they may choose to have one account per region, and have subscriptions managed at the region level.

![](./media/virtual-machines-infrastructure-services-implementation-guidelines/sub01.png)
  
For instance, you might use this structure.

![](./media/virtual-machines-infrastructure-services-implementation-guidelines/sub02.png)
  
Following the same example, if a region decides to have more than one subscription associated to a particular group, then the naming convention should incorporate a way to encode the extra on either the account or the subscription name. This organization allows massaging billing data to generate the new levels of hierarchy during billing reports.

![](./media/virtual-machines-infrastructure-services-implementation-guidelines/sub03.png)

The organization could look like this.

![](./media/virtual-machines-infrastructure-services-implementation-guidelines/sub04.png)
 
Microsoft provides detailed billing via a downloadable file, for a single account or for all accounts in an enterprise agreement. You can process this file, for example, using Excel. This process would ingest the data, partition the resources that encode more than one level of the hierarchy into separate columns, and use a pivot table or PowerPivot to provide dynamic reporting capabilities.

### Implementation guidelines recap for subscriptions and accounts

Decision: 

- What set of subscriptions and accounts do you need to host your IT workload or infrastructure?

Task: 

- Create the set of subscriptions and accounts using your naming convention.

## 3. Storage

Storage is an integral part of any Azure solution, since not only does it provide application level services, but it is also part of the infrastructure supporting virtual machines. 
 
There are two types of storage available from Azure. Standard storage gives you access to Blob storage, Table storage, Queue storage, and File storage. Premium storage is designed for high-performance applications, such as SQL Servers in an AlwaysOn cluster, and currently supports Azure Virtual Machine disks only.

Storage accounts are bound to scalability targets. See [Microsoft Azure Subscription and Service Limits, Quotas, and Constraints](azure-subscription-service-limits.md#storage-limits) to become familiar with current Azure storage limits. Also see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md).

Azure creates virtual machines with an operating system disk, a temporary disk, and zero or more optional data disks. The operating system disk and data disks are Azure blobs, whereas the temporary disk is backed by storage local to the node where the machine lives. This makes the temporary disk unfit for data that must persist during a system recycle, since the machine may silently be migrated from one node to another, losing any data in that disk. Do not store anything on the temporary drive.

Operating system disks and data disks have a maximum size of 1023 GB since the maximum size of a blob is 1024 GB and that must contain the metadata (footer) of the VHD file (a GB is 10243 bytes). You can implement disk striping in Windows to surpass this limit.

### Striped Disks
Besides providing the ability to create disks larger than 1023 GB, in many instances, using striping for data disks will enhance performance by allowing multiple blobs to back the storage for a single volume. This parallelizes the I/O required to write and read data from a single disk. 

Azure imposes limits on the amount of data disks and bandwidth available, depending on the virtual machine size. For the details, see [Virtual Machine and Cloud Service Sizes for Azure](https://msdn.microsoft.com/library/azure/dn197896.aspx).

If you are using disk striping for Azure data disks, consider the following guidelines:

- Data disks should always be the maximum size (1023 GB)
- Attach the maximum data disks allowed for the virtual machine size
- Use Storage Spaces Configuration
- Use Storage Striping Configuration
- Avoid using Azure data disk caching options (caching policy = None)

For more information, see [Storage Spaces - Designing for Performance](http://social.technet.microsoft.com/wiki/contents/articles/15200.storage-spaces-designing-for-performance.aspx).

### Multiple Storage Accounts

Using multiple storage accounts to back the disks associated with many virtual machines ensures that the aggregated I/O of those disks is well below the scalability targets for each one of those storage accounts. 

Microsoft recommends that you start with the deployment of one virtual machine per storage account.

### Storage layout design

In order to implement these strategies to implement the disk subsystem of the virtual machines with good performance, an IT workload or infrastructure will typically take advantage of many storage accounts. These will host many VHD blobs. In some instances, more than one blob is associated to one single volume in a virtual machine.

This situation can add complexity to the management tasks. Designing a sound strategy for storage, including appropriate naming for the underlying disks and associated VHD blobs is key.

### Implementation guidelines recap for storage

Decisions: 

- Do you need disk striping to create disks larger than 500 TB?
- Do you need disk striping to achieve optimal performance for your workload?
- What set of storage accounts do you need to host your IT workload or infrastructure?

Task: 

- Create the set of storage accounts using your naming convention. You can use the Azure Preview Portal, the Azure Management Portal, or the **New-AzureStorageAccount** PowerShell cmdlet.

## 4. Cloud Services

Cloud services are a fundamental building block in Azure, both for PaaS and IaaS services.
For PaaS, cloud services represent an association of roles whose instances can communicate among each other. Cloud services are associated to a public virtual IP (VIP) address and a load balancer, which takes incoming traffic from the Internet and load balances it to the roles configured to receive that traffic.

In the case of IaaS, cloud services offer similar functionality, although in most cases, the load balancer functionality is used to forward traffic to specific TCP or UDP ports from the Internet to the many virtual machines within that cloud service.

Cloud service names are especially important in IaaS because Azure uses them as part of the default naming convention for disks. The cloud service name can contain only letters, numbers, and hyphens. The first and last character in the field must be a letter or number.

Microsoft Azure exposes the cloud service names, since they are associated to the VIP, in the domain “cloudapp.net”. For better user experience of the application, a vanity name should be configured as needed to replace the fully qualified cloud service name. This is typically done with a CNAME record in your public DNS that maps the public DNS name of your resource (for example, www.contoso.com) to the DNS name of the cloud service hosting the resource (for example, the cloud service hosting the web servers for www.contoso.com).

In addition, the naming convention used for cloud services may need to tolerate exceptions because the cloud service names must be unique among all other Microsoft Azure cloud services, regardless of the Microsoft Azure tenant.

Azure subscriptions can support a maximum of 200 cloud services.

### Implementation guidelines recap for cloud services

Decision: 

- What set of cloud services do you need to host your IT workload or infrastructure? 

Task: 

- Create the set of cloud services using your naming convention. You can use the Azure Management Portal or the **New-AzureService** PowerShell cmdlet.

## 5. Virtual Networks

The next logical step is to create the virtual networks necessary to support the communications across the virtual machines in the solution. Although it is possible to host multiple virtual machines of an IT workload within just a cloud service, virtual networks are recommended.

Virtual networks are a container for virtual machines for which you can also specify subnets, custom addressing, and DNS configuration options. Virtual machines within the same virtual network can communicate directly with other computers within the same virtual network, regardless of which cloud service they are a member. Within the virtual network, this communication remains private, without the need for the communication to go through the public endpoints. This communication can occur via IP address, or by name, using a DNS server installed in the virtual network, or on premises, if the virtual machine is connected to the corporate network.

### Site Connectivity
If on-premises users and computers do not require ongoing connectivity to virtual machines in an Azure virtual network, create a cloud-only virtual network. 

![](./media/virtual-machines-infrastructure-services-implementation-guidelines/vnet01.png) 
 
This is typically for Internet-facing workloads, such as an Internet-based web server. You can manage these virtual machines using Remote Desktop connections, remote PowerShell sessions, Secure Shell (SSH) connections, and point-to-site VPN connections.

Because they do not connect to your on-premises network, cloud-only virtual networks can use any portion of the private IP address space.

If on-premises users and computers require ongoing connectivity to virtual machines in an Azure virtual network, create a cross-premises virtual network and connect it to your on-premises network with an ExpressRoute or site-to-site VPN connection.

![](./media/virtual-machines-infrastructure-services-implementation-guidelines/vnet02.png)
 
In this configuration, the Azure virtual network is essentially a cloud-based extension of your on-premises network.

Because they connect to your on-premises network, cross-premises virtual networks must use a portion of the address space used by your organization that is unique and the routing infrastructure must support routing traffic to that portion by forwarding it to your on-premises VPN device. 

To allow packets to travel from your cross-premises virtual network to your on-premises network, you must configure the set of relevant on-premises address prefixes as part of the Local Network definition for the virtual network. Depending on the address space of the virtual network and the set of relevant on-premises locations, there can be many address prefixes in the Local Network.

You can convert a cloud-only virtual network to a cross-premises virtual network, but it will most likely require you to renumber your virtual network address space, your subnets, and the virtual machines that use static Azure-assigned IP addresses, known as Dynamic IPs (DIPs). Therefore, carefully consider the type of virtual networks you need (cloud-only versus cross-premises) before you create them.

### Subnets
Subnets allow you to organize resources that are related, either logically (e.g. one subnet for virtual machines associated to the same application), or physically (e.g. one subnet per cloud service), or to employ subnet isolation techniques for added security.

For cross-premises virtual networks, you should design subnets with the same conventions that you use for on-premises resources, keeping in mind that **Azure always uses the first three IP addresses of the address space for each subnet**. To determine the number of addresses needed for the subnet, count the number of virtual machines that you need now, estimate for future growth, and then use the following table to determine the size of the subnet.
 
Number of virtual machines needed | Number of host bits needed | Size of the subnet 
--- | --- | --- 
1–3 | 3 | /29
4–11	 | 4 | /28
12–27 | 5 | /27
28–59 | 6 | /26
60–123 | 7 | /25

> [AZURE.NOTE] For normal on-premises subnets, the maximum number of host addresses for a subnet with n host bits is 2<sup>n</sup> – 2. For an Azure subnet, the maximum number of host addresses for a subnet with n host bits is 2<sup>n</sup> – 5 (2 plus 3 for the addresses that Azure uses on each subnet).

If you choose a subnet size that is too small, you will have to renumber and redeploy the virtual machines in the subnet.

### Implementation guidelines recap for virtual networks

Decisions: 

- What type of virtual network do you need to host your IT workload or infrastructure (cloud-only or cross-premises)?
- For cross-premises virtual networks, how much address space do you need to host the subnets and virtual machines now and for reasonable expansion in the future?

Tasks:

- Define the address space for the virtual network.
- Define the set of subnets and the address space for each.
- For cross-premises virtual networks, define the set of local network address spaces for the on-premises locations that the virtual machines in the virtual network need to reach.
- Create the virtual network using your naming convention. You can use the Azure Preview Portal or the Azure Management Portal.

## 6. Availability Sets

In Azure PaaS, cloud services contain one or more roles that execute application code. Roles can have one or more virtual machine instances that the fabric automatically provisions. At any given time, Azure may update the instances in these roles, but because they are part of the same role, Azure knows not to update all at the same time to prevent a service outage for the role.

In Azure IaaS, the concept of role is not significant, since each IaaS virtual machine represents a role with a single instance. In order to hint Azure not to bring down two or more associated machines at the same time (e.g. for OS updates of the node where they reside), the concept of availability sets was introduced. An availability set tells Azure not to bring down all the machines in the same availability set at the same time to prevent a service outage. The virtual machine members of an availability set have a 99.95% uptime service level agreement. 

Availability sets must be part of the high-availability planning of the solution. An availability set is defined as the set of virtual machines within a single cloud service that have the same availability set name. You can create availability sets after you create cloud services.

### Implementation guidelines recap for availability sets

Decision: 

- How many availability sets do you need for the various roles and tiers in your IT workload or infrastructure?

Task: 

- Define the set of availability sets using your naming convention. You can associate a virtual machine to an availability set when you create the virtual machines or you can associate a virtual machine to an availability set after the virtual machine has been created.

## 7. Virtual Machines

In Azure PaaS, Azure manages virtual machines and their associated disks. You must create and name cloud services and roles, and then Azure will create instances associated to those roles. In the case of Azure IaaS, it is up to you to provide names for the cloud services, virtual machines, and associated disks.

To reduce administrative burden, the Azure Management Portal will use the computer name as a suggestion for the default name for the associated cloud service (in the case the customer chooses to create a new cloud service as part of the virtual machine creation wizard).

In addition, Azure names disks and their supporting VHD blobs using a combination of the cloud service name, the computer name, and the creation date.

In general, the number of disks will be much greater than the amount of virtual machines. You should be careful when manipulating virtual machines to prevent orphaning disks. Also, disks can be deleted without deleting the supporting blob. If this is the case, the blob will remain in the storage account until manually deleted.

### Implementation guidelines recap for virtual machines

Decision: 

- How many virtual machines do you need to provide for the IT workload or infrastructure?

Tasks: 

- Define each virtual machine name using your naming convention.
- Create your virtual machines with the Azure Preview Portal, the Azure Management Portal, or the **New-AzureVM** PowerShell cmdlet.

## Example of an IT workload: The Contoso financial analysis engine

The Contoso Corporation has developed a next-generation financial analysis engine with leading-edge proprietary algorithms to aid in futures market trading. They want to make this engine available to its customers as a set of servers in Azure, which consist of:

- Two (and eventually more) IIS-based web servers running custom web services in a web tier
- Two (and eventually more) IIS-based application servers that perform the calculations in an application tier
- A SQL Server 2014 cluster with AlwaysOn Availability Groups (two SQL Servers and a majority node witness) that stores historical and ongoing calculation data in a database tier
- Two Active Directory domain controllers for a self-contained forest and domain in the authentication tier, which is required by SQL Server clustering
- All of the servers are located on two subnets; a front end subnet for the web servers and a back end subnet for the application servers, a SQL server 2014 cluster, and domain controllers

![](./media/virtual-machines-infrastructure-services-implementation-guidelines/example-tiers.png)
 
Incoming secure web traffic from the Contoso clients on the Internet needs to be load-balanced among the web servers. Calculation request traffic in the form of HTTP requests from the web servers needs to be balanced among the application servers. Additionally, the engine must be designed for high-availability.

The resulting design must incorporate:

- A Contoso Azure subscription and account
- Storage accounts
- A virtual network with two subnets
- A set of cloud services
- Availability Sets for the sets of servers with a similar role
- Virtual machines

All of the above will follow these Contoso naming conventions:

- Contoso uses [IT workload]-[location]-[Azure resource] as a prefix. For this example, "azfae" (Azure Financial Analysis Engine) is the IT workload name and "use" (East US 2) is the location, because most of Contoso's initial customers are on the East Coast of the United States.
- Storage accounts use contosoazfaeusesa[description] Note that contoso was added to the prefix to provide uniqueness and storage account names do not support the use of hyphens.
- Cloud services use contoso-azfae-use-cs-[description] Note that ccontoso was added to the prefix to provide uniqueness.
- Virtual networks use AZFAE-USE-VN[number].
- Availability sets use azfae-use-as-[role].
- Virtual machine names use azfae-use-vm-[vmname].

### Azure subscriptions and accounts

Contoso is using their Enterprise subscription, named Contoso Enterprise Subscription, to provide billing for this IT workload.

### Storage accounts

Contoso determined that they needed two storage accounts:

- **contosoazfaeusesawebapp** for the standard storage of the Web servers, application servers, and domain controlles and their extra data disks
- **contosoazfaeusesasqlclust** for the premium storage of the SQL Server cluster servers and their extra data disks

Contoso created the two storage accounts with these PowerShell commands:

	New-AzureStorageAccount -StorageAccountName "contosoazfaeusesawebapp" -Location "East US 2"
	New-AzureStorageAccount -StorageAccountName "contosoazfaeusesasqlclust" -Location "East US 2" -Type Premium_LRS

### A virtual network with subnets

Because the virtual network does not need ongoing connectivity to the Contoso on-premises network, Contoso decided on a cloud-only virtual network.

They created a cloud-only virtual network with the following settings using the Azure Preview Portal:

- Name: AZFAE-USE-VN01
- Location: East US 2
- Virtual network address space: 10.0.0.0/8
- First subnet:
	- Name: FrontEnd
	- Address space: 10.0.1.0/24
- Second subnet:
	- Name: BackEnd
	- Address space: 10.0.2.0/24

### Cloud services

Contoso decided on two cloud services:

- **contoso-azfae-use-cs-frontend** for the front-end Web servers
- **contoso-azfae-use-cs-backend** for the back-end application servers, SQL server cluster servers, and domain controllers

Contoso created the cloud services with these PowerShell commands:

	New-AzureService -Service "contoso-azfae-use-cs-frontend" -Location "East US 2"
	New-AzureService -Service "contoso-azfae-use-cs-backend" -Location "East US 2"

### Availability Sets

To maintain high availability of all four tiers of their financial analysis engine, Contoso decided on four availability sets:

- **azfae-use-as-dc** for the domain controllers
- **azfae-use-as-web** for the Web servers
- **azfae-use-as-app** for the application servers
- **azfae-use-as-sql** for the servers in the SQL Server cluster

These availability sets will be created along with the virtual machines.

### Virtual machines

Contoso decided on the following names for their Azure virtual machines:

- **azfae-use-vm-dc01** for the first domain controller
- **azfae-use-vm-dc02** for the second domain controller
- **azfae-use-vm-web01** for the first Web server
- **azfae-use-vm-web02** for the second Web server
- **azfae-use-vm-app01** for the first application server
- **azfae-use-vm-app02** for the second application server
- **azfae-use-vm-sql01** for the first SQL server in the SQL Server cluster
- **azfae-use-vm-sql02** for the second SQL server in the SQL Server cluster
- **azfae-use-vm-sqlmn01** for the majority node witness in the SQL Server cluster

Here is the resulting configuration.

![](./media/virtual-machines-infrastructure-services-implementation-guidelines/example-config.png)
 
This configuration incorporates:

- A cloud-only virtual network with two subnets (FrontEnd and BackEnd)
- Two cloud services
- Two storage accounts
- Four availability sets, one for each tier of the financial analysis engine
- The virtual machines for the four tiers
- An external load balanced set for HTTPS-based web traffic from the Internet to the web servers
- An internal load balanced set for unencrypted web traffic from the web servers to the application servers

These Azure PowerShell commands create the virtual machines in this configuration for the previously created storage accounts, cloud services, and virtual network.

	#Specify the storage account for the web and application servers
	Set-AzureSubscription –SubscriptionName "Contoso Enterprise Subscription" -CurrentStorageAccountName "contosoazfaeusesawebapp"
	
	#Specify the cloud service name for the web servers
	$ServiceName="contoso-azfae-use-cs-frontend"
	
	#Get the image string for the latest version of the Windows Server 2012 R2 Datacenter image in the gallery
	$image= Get-AzureVMImage | where { $_.ImageFamily -eq "Windows Server 2012 R2 Datacenter" } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1
	
	#Create the first web server
	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the first web server."
	$vm1=New-AzureVMConfig -Name azfae-use-vm-web01 -InstanceSize large -ImageName $image -AvailabilitySetName azfae-use-as-web
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password 
	$vm1 | Set-AzureSubnet -SubnetNames FrontEnd
	$vm1 | Add-AzureEndpoint -Name Web1 -Protocol tcp -LocalPort 443 -PublicPort 443 -LBSetName "WebSet" -DefaultProbe
	New-AzureVM –ServiceName $ServiceName -VMs $vm1 -VNetName AZFAE-USE-VN01
	
	#Create the second web server 
	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the second web server."
	$vm1=New-AzureVMConfig -Name azfae-use-vm-web02 -InstanceSize Large -ImageName $image -AvailabilitySetName azfae-use-as-web
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password 
	$vm1 | Set-AzureSubnet -SubnetNames FrontEnd
	$vm1 | Add-AzureEndpoint -Name Web2 -Protocol tcp -LocalPort 443 -PublicPort 443 -LBSetName "WebSet" -DefaultProbe
	New-AzureVM –ServiceName $ServiceName -VMs $vm1 -VNetName AZFAE-USE-VN01
	
	#Specify the cloud service name for the application, SQL server, and authentication tiers
	$ServiceName="contoso-azfae-use-cs-backend"
	
	#Create the first domain controller server
	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the first domain controller server."
	$vm1=New-AzureVMConfig -Name azfae-use-vm-dc01 -InstanceSize Small -ImageName $image -AvailabilitySetName azfae-use-as-dc
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password 
	$vm1 | Set-AzureSubnet -SubnetNames BackEnd
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB 100 -DiskLabel AppFiles –LUN 0 -HostCaching None
	New-AzureVM –ServiceName $ServiceName -VMs $vm1 -VNetName AZFAE-USE-VN01
	
	#Create the second domain controller server
	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the second domain controller server."
	$vm1=New-AzureVMConfig -Name azfae-use-vm-dc02 -InstanceSize Small -ImageName $image -AvailabilitySetName azfae-use-as-dc
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password 
	$vm1 | Set-AzureSubnet -SubnetNames BackEnd
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB 100 -DiskLabel AppFiles –LUN 0 -HostCaching None
	New-	AzureVM –ServiceName $ServiceName -VMs $vm1 -VNetName AZFAE-USE-VN01
	
	#Create an internal load balancer instance for the application server tier 
	Add-AzureInternalLoadBalancer -ServiceName $ServiceName -InternalLoadBalancerName "AppTierILB" –SubnetName BackEnd –StaticVNetIPAddress 10.0.2.100
	
	#Create the first application server
	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the first application server."
	$vm1=New-AzureVMConfig -Name azfae-use-vm-app01 -InstanceSize Large -ImageName $image -AvailabilitySetName azfae-use-as-app
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password 
	$vm1 | Set-AzureSubnet -SubnetNames BackEnd
	$vm1 | Add-AzureEndpoint -Name App1 -Protocol tcp -LocalPort 80 -PublicPort 80 -LBSetName "AppSet" -InternalLoadBalancerName "AppTierILB" -DefaultProbe
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB 500 -DiskLabel AppFiles –LUN 0 -HostCaching None
	New-	AzureVM –ServiceName $ServiceName -VMs $vm1 -VNetName AZFAE-USE-VN01
	
	#Create the second application server 
	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the second application server."
	$vm1=New-AzureVMConfig -Name azfae-use-vm-app02 -InstanceSize Large -ImageName $image -AvailabilitySetName azfae-use-as-app
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password 
	$vm1 | Add-AzureEndpoint -Name App2 -Protocol tcp -LocalPort 80 -PublicPort 80 -LBSetName "AppSet" -InternalLoadBalancerName "AppTierILB" -DefaultProbe
	$vm1 | Set-AzureSubnet -SubnetNames BackEnd
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB 500 -DiskLabel AppFiles –LUN 0 -HostCaching None
	New-AzureVM –ServiceName $ServiceName -VMs $vm1 -VNetName AZFAE-USE-VN01
	
	#Specify the premium storage account for the SQL Server cluster
	Set-AzureSubscription –SubscriptionName "Contoso Enterprise Subscription" -CurrentStorageAccountName "contosoazfaeusesasqlclust"
	
	#Create the majority node witness server for the SQL Server cluster
	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the majority node witness server."
	$vm1=New-AzureVMConfig -Name azfae-use-vm-sqlmn01 -InstanceSize Medium -ImageName $image -AvailabilitySetName azfae-use-as-sql
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password 
	$vm1 | Set-AzureSubnet -SubnetNames BackEnd
	New-AzureVM –ServiceName $ServiceName -VMs $vm1 -VNetName AZFAE-USE-VN01
	
	#Change the image string for the latest version of the SQL Server 2014 image in the gallery
	$image= Get-AzureVMImage | where { $_.ImageFamily -eq "SQL Server 2014 RTM Standard on Windows Server 2012 R2" } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1
	
	#Create the first SQL Server
	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the first SQL Server."
	$vm1=New-AzureVMConfig -Name azfae-use-vm-sql01 -InstanceSize A5 -ImageName $image  -AvailabilitySetName azfae-use-as-sql
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password
	$vm1 | Set-AzureSubnet -SubnetNames BackEnd
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB 1000 -DiskLabel SQLFiles –LUN 0 -HostCaching None
	New-AzureVM –ServiceName $ServiceName -VMs $vm1 -VNetName AZFAE-USE-VN01
	
	#Create the second SQL Server
	$cred1=Get-Credential –Message "Type the name and password of the local administrator account for the second SQL Server."
	$vm1=New-AzureVMConfig -Name azfae-use-vm-sql02 -InstanceSize A5 -ImageName $image  -AvailabilitySetName azfae-use-as-sql
	$vm1 | Add-AzureProvisioningConfig -AdminUsername $cred1.GetNetworkCredential().Username -Password $cred1.GetNetworkCredential().Password
	$vm1 | Set-AzureSubnet -SubnetNames BackEnd
	$vm1 | Add-AzureDataDisk -CreateNew -DiskSizeInGB 1000 -DiskLabel SQLFiles –LUN 0 -HostCaching None
	New-AzureVM –ServiceName $ServiceName -VMs $vm1 -VNetName AZFAE-USE-VN01

## Additional Resources

[Microsoft Azure Subscription and Service Limits, Quotas, and Constraints](azure-subscription-service-limits.md#storage-limits)

[Virtual Machine and Cloud Service Sizes for Azure](https://msdn.microsoft.com/library/azure/dn197896.aspx)

[Azure Storage Scalability and Performance Targets](storage-scalability-targets.md)
