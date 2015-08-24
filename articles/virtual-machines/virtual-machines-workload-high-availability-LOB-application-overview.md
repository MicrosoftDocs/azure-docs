<properties 
	pageTitle="Deploy a line of business application | Microsoft Azure" 
	description="Deploy a web-based, highly-available, line of business application with SQL Server AlwaysOn Availability Groups in Azure in five phases." 
	documentationCenter=""
	services="virtual-machines" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""
	tags="azure-resource-manager"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/11/2015" 
	ms.author="josephd"/>

# Deploy a high-availability line of business application in Azure

This article contains links to the step-by-step instructions for deploying a high-availability, intranet-only, web-based line of business application with SQL Server AlwaysOn Availability Groups in Azure infrastructure services. The application is hosted on these computers:

- Two web servers
- Two database servers
- One cluster majority node server
- Two domain controllers

This is the configuration, with placeholder names for each server.

![](./media/virtual-machines-workload-high-availability-LOB-application-overview/workload-lobapp-phase4.png) 
 
At least two machines for each role ensure high availability. All of the virtual machines are in a single Azure location (also known as a region). Each group of virtual machines for a specific role is in their own availability set. 

You deploy this configuration in the following phases:

- [Phase 1: Configure Azure](virtual-machines-workload-high-availability-LOB-application-phase1.md). Create storage accounts, availability sets, and a cross-premises virtual network.
- [Phase 2: Configure domain controllers](virtual-machines-workload-high-availability-LOB-application-phase2.md). Create and configure replica Active Directory Domain Services (AD DS) domain controllers.
- [Phase 3: Configure SQL Server infrastructure](virtual-machines-workload-high-availability-LOB-application-phase3.md). Create and configure the virtual machines running SQL Server, create the cluster, and enable SQL Server AlwaysOn Availability Groups.
- [Phase 4: Configure web servers](virtual-machines-workload-high-availability-LOB-application-phase4.md). Create and configure the two web server virtual machines.
- [Phase 5: Add the application databases to a SQL Server AlwaysOn Availability Group](virtual-machines-workload-high-availability-LOB-application-phase5.md). Prepare the line of business application databases and add them to a SQL Server AlwaysOn Availability Group.

This deployment is designed to accompany the [Line of Business Applications architecture blueprint](http://msdn.microsoft.com/dn630664) and incorporate the latest recommendations.

This is a prescriptive, pre-defined architecture. Keep the following in mind:

- If you are an experienced web-based, line of business application implementer, please feel free to adapt the instructions in Phases 3 through 5 and build the application infrastructure that best suits your needs. 
- If you already have an existing Azure hybrid cloud implementation, please feel free to adapt or skip the instructions in Phases 1 and 2 to host the virtual machines for the new application on the appropriate subnet.
- All of the servers are located on a single subnet in the Azure virtual network. If you want to provide additional security equivalent to subnet isolation, you can use [Network Security Groups](../virtual-networks/virtual-networks-nsg.md).

To build a dev/test environment or a proof-of-concept of this configuration, see [Set up a web-based LOB application in a hybrid cloud for testing](../virtual-network/virtual-networks-setup-lobapp-hybrid-cloud-testing.md).

For additional information about designing IT workloads for Azure, see [Azure infrastructure services implementation guidelines](virtual-machines-infrastructure-services-implementation-guidelines.md).

## Next step

To start the configuration of this workload, go to [Phase 1: Configure Azure](virtual-machines-workload-high-availability-LOB-application-phase1.md).

## Additional resources

[Line of Business Applications architecture blueprint](http://msdn.microsoft.com/dn630664)

[Set up a web-based LOB application in a hybrid cloud for testing](../virtual-network/virtual-networks-setup-lobapp-hybrid-cloud-testing.md)

[Azure infrastructure services implementation guidelines](virtual-machines-infrastructure-services-implementation-guidelines.md)

[Azure Infrastructure Services Workload: SharePoint Server 2013 farm](virtual-machines-workload-intranet-sharepoint-farm.md)