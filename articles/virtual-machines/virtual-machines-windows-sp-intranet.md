<properties
	pageTitle="SharePoint Server 2013 farm in Azure | Microsoft Azure"
	description="Learn the value of a SharePoint Server 2013 farm in Azure, set up a test environment, and deploy a high-availability configuration."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="Windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/17/2015"
	ms.author="josephd"/>

# Azure Infrastructure Services Workload: Intranet SharePoint farm

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

Set up your first or next SharePoint farm in Microsoft Azure and take advantage of ease of configuration and the ability to quickly expand the farm to include new capacity or optimization of key functionality. Many SharePoint farms grow from a standard, highly-available, three-tier configuration to a farm with possibly a dozen or more servers optimized for performance or separate roles, such as distributed caching or search.

With the virtual machines and virtual network features of Azure infrastructure services, you can quickly deploy and run a SharePoint farm that is transparently connected to your on-premises network. For example, you can set up the following:

![](./media/virtual-machines-windows-sp-intranet/workload-spsqlao.png)

Because the Azure virtual network is an extension of your on-premises network with all of the correct naming and traffic routing in place, your users will access it in the same way as if it were located in an on-premises datacenter.

This configuration allows you to easily expand the SharePoint farm by adding new Azure virtual machines in which the ongoing costs of both hardware and maintenance are lower than running an equivalent farm in your datacenter.

Hosting an intranet SharePoint farm in Azure infrastructure services is an example of a line of business application. For an overview, see the [Line of Business Applications architecture blueprint](http://msdn.microsoft.com/dn630664).

Your next step is to set up a dev/test intranet SharePoint farm hosted in Azure.

> [AZURE.NOTE] Microsoft has released the SharePoint Server 2016 IT Preview. To make this preview easy to install and test, you can use an Azure virtual machine gallery image with SharePoint Server 2016 IT Preview and its prerequisites pre-installed. For more information, see [Test the SharePoint Server 2016 IT Preview in Azure](https://azure.microsoft.com/blog/test-sharepoint-server-2016-it-preview-4/).

## Create a dev/test intranet SharePoint farm hosted in Azure

You have two choices for creating a dev/test environment for a SharePoint farm hosted in Azure:

- Cloud-only virtual network
- Cross-premises virtual network

You can create these dev/test environments for free with your [Visual Studio subscription](https://azure.microsoft.com/pricing/member-offers/msdn-benefits/) or an [Azure Trial Subscription](https://azure.microsoft.com/pricing/free-trial/).

### Cloud-only virtual network

A cloud-only virtual network is not connected to an on-premises network. If you just want to quickly create a basic or high-availability SharePoint farm, see [Create SharePoint server farms](virtual-machines-windows-sharepoint-farm.md). The following example shows the basic SharePoint farm configuration.

![](./media/virtual-machines-windows-sp-intranet/Non-HAFarm.png)

### Cross-premises virtual network

A cross-premises virtual network is connected to an on-premises network with a site-to-site VPN or ExpressRoute connection. If you want to create a dev/test environment that mimics the final configuration and experiment with accessing the SharePoint server and performing remote administration over a VPN connection, see [Set up a SharePoint intranet farm in a hybrid cloud for testing](../virtual-network/virtual-networks-setup-sharepoint-hybrid-cloud-testing.md).

![](./media/virtual-machines-windows-sp-intranet/CreateSPFarmHybridCloud.png)

Your next step is to create a high-availability intranet SharePoint farm in Azure.

## Deploy an intranet SharePoint farm hosted in Azure

The baseline, representative configuration for a functional, high-availability intranet SharePoint farm is the following:

![](./media/virtual-machines-windows-sp-intranet/workload-spsqlao.png)

This consists of:

- An intranet SharePoint farm with two servers at the web, application, and database tiers.
- A SQL Server AlwaysOn Availability Groups configuration with two SQL servers and a majority node computer in a cluster.
- Two replica domain controllers of an on-premises Active Directory domain.

To see this configuration as an infographic, see [SharePoint with SQL Server AlwaysOn](http://go.microsoft.com/fwlink/?LinkId=394788).

To deploy this configuration, use the following process:

- Phase 1: Configure Azure.

	Use Azure PowerShell to create a storage account, availability sets, and a cross-premises virtual network. For the detailed configuration steps, see [Phase 1](virtual-machines-windows-ps-sp-intranet-ph1.md).

- Phase 2: Configure the domain controllers.

	Configure two Active Directory replica domain controllers and DNS settings for the virtual network. For the detailed configuration steps, see [Phase 2](virtual-machines-windows-ps-sp-intranet-ph2.md).

- Phase 3: Configure the SQL Server infrastructure.  

	Prepare the SQL Server virtual machines for use with SharePoint and create the SQL Server cluster. For the detailed configuration steps, see [Phase 3](virtual-machines-windows-ps-sp-intranet-ph3.md).

- Phase 4: Configure the SharePoint servers.

	Configure the four SharePoint virtual machines for a new SharePoint farm. For the detailed configuration, see [Phase 4](virtual-machines-windows-ps-sp-intranet-ph4.md).

- Phase 5: Create an AlwaysOn Availability Group.

	Prepare the SharePoint databases, create an AlwaysOn Availability Group, and then add the SharePoint databases to it. For the detailed configuration steps, see [Phase 5](virtual-machines-windows-ps-sp-intranet-ph5.md).

Once configured, you can expand this SharePoint farm with guidance from [Microsoft Azure architectures for SharePoint 2013](http://technet.microsoft.com/library/dn635309.aspx).

## Next step

- Get an [overview](virtual-machines-windows-sp-intranet-overview.md) of the production workload before diving into the configuration.

