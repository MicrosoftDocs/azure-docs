<properties
	pageTitle="Deploy a SharePoint Server 2013 farm | Microsoft Azure"
	description="Deploy a high-availability SharePoint Server 2013 farm using SQL Server AlwaysOn Availability Groups in Azure in five phases."
	documentationCenter=""
	services="virtual-machines"
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows-sharepoint"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/22/2015"
	ms.author="josephd"/>

# Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure

This topic contains links to the step-by-step instructions for deploying an intranet-only SharePoint 2013 farm with SQL Server AlwaysOn Availability Groups with Azure Service Management. The farm contains these computers:

- Two SharePoint web servers
- Two SharePoint application servers
- Two database servers
- One cluster majority node server
- Two domain controllers

This is the configuration, with placeholder names for each server:

![](./media/virtual-machines-workload-intranet-sharepoint-overview/workload-spsqlao_05.png)

Two machines for each role ensure high availability. All of the virtual machines are in a single region. Each group of virtual machines for a specific role is in its own availability set.

You deploy this configuration in the following phases:

- [Phase 1: Configure Azure](virtual-machines-workload-intranet-sharepoint-phase1.md). Create a storage account, cloud services, and a cross-premises virtual network.
- [Phase 2: Configure domain controllers](virtual-machines-workload-intranet-sharepoint-phase2.md). Create and configure replica Active Directory Domain Services (AD DS) domain controllers.
- [Phase 3: Configure SQL Server infrastructure](virtual-machines-workload-intranet-sharepoint-phase3.md). Create and configure the SQL Server virtual machines, prepare them for use with SharePoint, and create the cluster.
- [Phase 4: Configure SharePoint servers](virtual-machines-workload-intranet-sharepoint-phase4.md). Create and configure the four SharePoint virtual machines.
- [Phase 5: Create the availability group and add the SharePoint databases](virtual-machines-workload-intranet-sharepoint-phase5.md). Prepare databases and create a SQL Server AlwaysOn availability group.

This deployment of SharePoint with SQL Server AlwaysOn is designed to accompany the [SharePoint with SQL Server AlwaysOn infographic](http://go.microsoft.com/fwlink/?LinkId=394788) and incorporate the latest recommendations.

This configuration is a prescriptive, phase-by-phase guide for a predefined architecture to create a functional, highly available intranet SharePoint farm in Azure infrastructure services. For additional architectural guidance on implementing SharePoint 2013 in Azure, see [Microsoft Azure architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx).

Keep the following in mind:

- If you are an experienced SharePoint implementer, please feel free to adapt the instructions in phases 3 through 5 and build the farm that best suits your needs.
- If you already have an existing Azure hybrid cloud implementation, feel free to adapt or skip the instructions in phases 1 and 2 to host the new SharePoint farm on the appropriate subnet.
- All of the servers are located on a single subnet in the Azure virtual network. If you want to provide additional security equivalent to subnet isolation, you can use [network security groups](virtual-networks-nsg.md).

To build a dev/test environment or a proof-of-concept of this configuration, see [Set up a SharePoint intranet farm in a hybrid cloud for testing](../virtual-network/virtual-networks-setup-sharepoint-hybrid-cloud-testing.md).

For additional information about SharePoint with SQL Server AlwaysOn Availability Groups, see [Configure SQL Server 2012 AlwaysOn Availability Groups for SharePoint 2013](https://technet.microsoft.com/library/jj715261.aspx).

## Next step

To start the configuration of this workload, go to [Phase 1: Configure Azure](virtual-machines-workload-intranet-sharepoint-phase1.md).


## Additional resources

[SharePoint with SQL Server AlwaysOn infographic](http://go.microsoft.com/fwlink/?LinkId=394788)

[Microsoft Azure architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx)

[SharePoint farms hosted in Azure infrastructure services](virtual-machines-sharepoint-infrastructure-services.md)

[Azure infrastructure services implementation guidelines](virtual-machines-infrastructure-services-implementation-guidelines.md)

[Azure Infrastructure Services Workload: High-availability line of business application](virtual-machines-workload-high-availability-lob-application.md)
