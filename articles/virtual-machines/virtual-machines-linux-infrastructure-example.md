<properties
	pageTitle="Example Infrastructure Walkthrough | Microsoft Azure"
	description="Learn about the key design and implementation guidelines for deploying an example infrastructure in Azure."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/24/2016"
	ms.author="iainfou"/>

# Example Azure infrastructure walkthrough

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-intro](../../includes/virtual-machines-linux-infrastructure-guidelines-intro.md)] 

This article walks through building out an example application infrastructure. We'll detail designing an infrastructure for a simple on-line store that brings together all of the guidelines and decisions around naming conventions, availability sets, virtual networks and load balancers, and actually deploying your virtual machines (VMs).


## Example workload

Adventure Works Cycles wants to build an on-line store application in Azure that consists of:

- Two nginx servers running the client front-end in a web tier
- Two nginx servers processing data and orders in an application tier
- Two MongoDB servers part of a sharded cluster for storing product data and orders in a database tier
- Two Active Directory domain controllers for customer accounts and suppliers in an authentication tier
- All of the servers are located in two subnets:
	- a front end subnet for the web servers 
	- a back end subnet for the application servers, MongoDB cluster, and domain controllers

![Diagram of different tiers for application infrastructure](./media/virtual-machines-common-infrastructure-service-guidelines/example-tiers.png)

Incoming secure web traffic needs to be load-balanced among the web servers as customers browse the on-line store. Order processing traffic in the form of HTTP requests from the web servers needs to be balanced among the application servers. Additionally, the infrastructure must be designed for high availability.

The resulting design must incorporate:

- An Azure subscription and account
- A single resource group
- Storage accounts
- A virtual network with two subnets
- Availability sets for the VMs with a similar role
- Virtual machines

All of the above will follow these naming conventions:

- Adventure Works Cycles uses **[IT workload]-[location]-[Azure resource]** as a prefix
	- For this example, "**azos**" (Azure On-line Store) is the IT workload name and "**use**" (East US 2) is the location
- Storage accounts use adventureazosusesa**[description]**
	- Note that 'adventure' was added to the prefix to provide uniqueness, and storage account names do not support the use of hyphens.
- Virtual networks use AZOS-USE-VN**[number]**
- Availability sets use azos-use-as-**[role]**
- Virtual machine names use azos-use-vm-**[vmname]**


## Azure subscriptions and accounts

Adventure Works Cycles is using their Enterprise subscription, named Adventure Works Enterprise Subscription, to provide billing for this IT workload.


## Storage accounts

Adventure Works Cycles determined that they needed two storage accounts:

- **adventureazosusesawebapp** for the standard storage of the web servers, application servers, and domain controllers and their data disks.
- **adventureazosusesadbclust** for the Premium storage of the MongoDB sharded cluster servers and their data disks.


## Virtual network and subnets

Because the virtual network does not need ongoing connectivity to the Adventure Work Cycles on-premises network, they decided on a cloud-only virtual network.

They created a cloud-only virtual network with the following settings using the Azure portal:

- Name: AZOS-USE-VN01
- Location: East US 2
- Virtual network address space: 10.0.0.0/8
- First subnet:
	- Name: FrontEnd
	- Address space: 10.0.1.0/24
- Second subnet:
	- Name: BackEnd
	- Address space: 10.0.2.0/24


## Availability sets

To maintain high availability of all four tiers of their on-line store, Adventure Works Cycles decided on four availability sets:

- **azos-use-as-web** for the web servers
- **azos-use-as-app** for the application servers
- **azos-use-as-db** for the servers in the MongoDB sharded cluster
- **azos-use-as-dc** for the domain controllers


## Virtual machines

Adventure Works Cycles decided on the following names for their Azure VMs:

- **azos-use-vm-web01** for the first web server
- **azos-use-vm-web02** for the second web server
- **azos-use-vm-app01** for the first application server
- **azos-use-vm-app02** for the second application server
- **azos-use-vm-db01** for the first MongoDB server in the cluster
- **azos-use-vm-db02** for the second MongoDB server in the cluster
- **azos-use-vm-dc01** for the first domain controller
- **azos-use-vm-dc02** for the second domain controller

Here is the resulting configuration.

![Final application infrastructure deployed in Azure](./media/virtual-machines-common-infrastructure-service-guidelines/example-config.png)

This configuration incorporates:

- A cloud-only virtual network with two subnets (FrontEnd and BackEnd)
- Two storage accounts
- Four availability sets, one for each tier of the on-line store
- The virtual machines for the four tiers
- An external load balanced set for HTTPS-based web traffic from the Internet to the web servers
- An internal load balanced set for unencrypted web traffic from the web servers to the application servers
- A single resource group


## Next steps

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-next-steps](../../includes/virtual-machines-linux-infrastructure-guidelines-next-steps.md)] 