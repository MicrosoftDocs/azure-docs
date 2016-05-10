<properties
	pageTitle="Azure Example Infrastructure Walkthrough"
	description="Learn about the key design and implementation guidelines for deploying an example infrastructure in Azure."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="vlivech"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/05/2016"
	ms.author="v-livech"/>

# Azure Example Infrastructure Walkthrough

This guidance identifies many areas for which planning is vital to the success of an IT workload in Azure. In addition, planning provides an order to the creation of the necessary resources. Although there is some flexibility, we recommend that you apply the order in this article to your planning and decision-making.




## Example of an IT workload: The Contoso financial analysis engine

The Contoso Corporation has developed a next-generation financial analysis engine with leading-edge proprietary algorithms to aid in futures market trading. They want to make this engine available to its customers as a set of servers in Azure, which consist of:

- Two (and eventually more) IIS-based web servers running custom web services in a web tier
- Two (and eventually more) IIS-based application servers that perform the calculations in an application tier
- A SQL Server 2014 cluster with AlwaysOn availability groups (two SQL Servers and a majority node witness) that stores historical and ongoing calculation data in a database tier
- Two Active Directory domain controllers for a self-contained forest and domain in the authentication tier, which is required by SQL Server clustering
- All of the servers are located on two subnets; a front end subnet for the web servers and a back end subnet for the application servers, a SQL Server 2014 cluster, and domain controllers

![](./media/virtual-machines-common-infrastructure-service-guidelines/example-tiers.png)

Incoming secure web traffic from the Contoso clients on the Internet needs to be load-balanced among the web servers. Calculation request traffic in the form of HTTP requests from the web servers needs to be balanced among the application servers. Additionally, the engine must be designed for high availability.

The resulting design must incorporate:

- A Contoso Azure subscription and account
- Storage accounts
- A virtual network with two subnets
- Availability sets for the sets of servers with a similar role
- Virtual machines
- A single resource group

All of the above will follow these Contoso naming conventions:

- Contoso uses [IT workload]-[location]-[Azure resource] as a prefix. For this example, "azfae" (Azure Financial Analysis Engine) is the IT workload name and "use" (East US 2) is the location, because most of Contoso's initial customers are on the East Coast of the United States.
- Storage accounts use contosoazfaeusesa[description] Note that contoso was added to the prefix to provide uniqueness, and storage account names do not support the use of hyphens.
- Virtual networks use AZFAE-USE-VN[number].
- Availability sets use azfae-use-as-[role].
- Virtual machine names use azfae-use-vm-[vmname].

## Azure subscriptions and accounts

Contoso is using their Enterprise subscription, named Contoso Enterprise Subscription, to provide billing for this IT workload.

## Storage accounts

Contoso determined that they needed two storage accounts:

- **contosoazfaeusesawebapp** for the standard storage of the web servers, application servers, and domain controlles and their extra data disks
- **contosoazfaeusesasqlclust** for the premium storage of the SQL Server cluster servers and their extra data disks

## A virtual network with subnets

Because the virtual network does not need ongoing connectivity to the Contoso on-premises network, Contoso decided on a cloud-only virtual network.

They created a cloud-only virtual network with the following settings using the Azure portal:

- Name: AZFAE-USE-VN01
- Location: East US 2
- Virtual network address space: 10.0.0.0/8
- First subnet:
	- Name: FrontEnd
	- Address space: 10.0.1.0/24
- Second subnet:
	- Name: BackEnd
	- Address space: 10.0.2.0/24

## Availability sets

To maintain high availability of all four tiers of their financial analysis engine, Contoso decided on four availability sets:

- **azfae-use-as-dc** for the domain controllers
- **azfae-use-as-web** for the web servers
- **azfae-use-as-app** for the application servers
- **azfae-use-as-sql** for the servers in the SQL Server cluster

These availability sets will be created along with the virtual machines.

## Virtual machines

Contoso decided on the following names for their Azure virtual machines:

- **azfae-use-vm-dc01** for the first domain controller
- **azfae-use-vm-dc02** for the second domain controller
- **azfae-use-vm-web01** for the first web server
- **azfae-use-vm-web02** for the second web server
- **azfae-use-vm-app01** for the first application server
- **azfae-use-vm-app02** for the second application server
- **azfae-use-vm-sql01** for the first SQL Server in the SQL Server cluster
- **azfae-use-vm-sql02** for the second SQL Server in the SQL Server cluster
- **azfae-use-vm-sqlmn01** for the majority node witness in the SQL Server cluster

Here is the resulting configuration.

![](./media/virtual-machines-common-infrastructure-service-guidelines/example-config.png)

This configuration incorporates:

- A cloud-only virtual network with two subnets (FrontEnd and BackEnd)
- Two storage accounts
- Four availability sets, one for each tier of the financial analysis engine
- The virtual machines for the four tiers
- An external load balanced set for HTTPS-based web traffic from the Internet to the web servers
- An internal load balanced set for unencrypted web traffic from the web servers to the application servers
- A single resource group

## Next steps

Now that you have read about Azure Availability Sets you can read up on the guidelines for other Azure services.

* [Azure Cloud Services Infrastructure Guidelines](virtual-machines-linux-infrastructure-cloud-services-guidelines.md)
* [Azure Subscription and Accounts Guidelines](virtual-machines-linux-infrastructure-subscription-accounts-guidelines.md)
* [Azure Infrastructure Naming Guidelines](virtual-machines-linux-infrastructure-naming-guidelines.md)
* [Azure Virtual Machines Guidelines](virtual-machines-linux-infrastructure-virtual-machine-guidelines.md)
* [Azure Networking Infrastructure Guidelines](virtual-machines-linux-infrastructure-networking-guidelines.md)
* [Azure Storage Solutions Infrastructure Guidelines](virtual-machines-linux-infrastructure-storage-solutions-guidelines.md)
* [Azure Example Infrastructure Walkthrough](virtual-machines-linux-infrastructure-example.md)

Once you have reviewed the guidelines documents you can move over to the [Azure Concepts section](virtual-machines-linux-azure-overview.md) to start building your new infrastructure on Azure.
