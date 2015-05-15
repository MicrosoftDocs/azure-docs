<properties 
	pageTitle="Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure" 
	description="You can deploy SharePoint with SQL Server AlwaysOn Availability Groups in Azure in five phases." 
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

# Deploying SharePoint with SQL Server AlwaysOn Availability Groups in Azure

This topic contains links to the step-by-step instructions for deploying an intranet-only SharePoint 2013 farm with SQL Server AlwaysOn Availability Groups in Azure infrastructure services. The farm contains these computers:

- Two SharePoint web servers
- Two SharePoint application servers
- Two database servers
- One cluster majority node server
- Two domain controllers

This is the configuration, with placeholder names for each server.

![](./media/virtual-machines-workload-intranet-sharepoint-overview/workload-spsqlao_05.png) 
 
Two machines for each role ensure high availability. All of the virtual machines are in a single region. Each group of virtual machines for a specific role is in their own availability set. 

You deploy this configuration in the following phases:

- [Phase 1: Configure Azure](virtual-machines-workload-intranet-sharepoint-phase1.md). Create a storage account, cloud services, and a cross-premises virtual network.
- [Phase 2: Configure Domain Controllers](virtual-machines-workload-intranet-sharepoint-phase2.md). Create and configure replica Active Directory Domain Services (AD DS) domain controllers.
- [Phase 3: Configure SQL Server Infrastructure](virtual-machines-workload-intranet-sharepoint-phase3.md). Create and configure the SQL Server virtual machines, prepare them for use with SharePoint, and create the cluster.
- [Phase 4: Configure SharePoint Servers](virtual-machines-workload-intranet-sharepoint-phase4.md). Create and configure the four SharePoint virtual machines.
- [Phase 5: Create the Availability Group and add the SharePoint databases](virtual-machines-workload-intranet-sharepoint-phase5.md). Prepare databases and create a SQL Server AlwaysOn Availability Group.

This deployment of SharePoint with SQL Server AlwaysOn is designed to accompany the [SharePoint with SQL Server AlwaysOn Infographic](http://go.microsoft.com/fwlink/?LinkId=394788) and incorporate the latest recommendations.

This configuration is a prescriptive, phase-by-phase guide for a pre-defined architecture to create a functional, highly-available intranet SharePoint farm in Azure infrastructure services. For additional architectural guidance on implementing SharePoint 2013 in Azure, see [Microsoft Azure Architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx). 

Keep the following in mind:

- If you are an experienced SharePoint implementer, please feel free to adapt the instructions in Phases 3 through 5 and build the farm that best suits your needs. 
- If you already have an existing Azure hybrid cloud implementation, feel free to adapt or skip the instructions in Phases 1 and 2 to host the new SharePoint farm on the appropriate subnet.
- All of the servers are located on a single subnet in the Azure virtual network. If you want to provide additional security equivalent to subnet isolation, you can use [Network Security Groups](https://msdn.microsoft.com/library/azure/dn848316.aspx).

To build a dev/test environment or a proof-of-concept of this configuration, see [Set up a SharePoint intranet farm in a hybrid cloud for testing](virtual-networks-setup-sharepoint-hybrid-cloud-testing.md).

For additional information about SharePoint with SQL Server AlwaysOn Availability Groups, see [Configure SQL Server 2012 AlwaysOn Availability Groups for SharePoint 2013](https://technet.microsoft.com/library/jj715261.aspx).

## Next Step

To start the configuration of this workload, go to [Phase 1: Configure Azure](virtual-machines-workload-intranet-sharepoint-phase1.md).


## Additional Resources

[SharePoint with SQL Server AlwaysOn Infographic](http://go.microsoft.com/fwlink/?LinkId=394788)

[Microsoft Azure Architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx)

[SharePoint farms hosted in Azure infrastructure services](virtual-machines-sharepoint-infrastructure-services.md)
