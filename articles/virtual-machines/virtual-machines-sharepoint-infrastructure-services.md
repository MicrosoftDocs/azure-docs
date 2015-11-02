<properties
	pageTitle="SharePoint Server 2013 farms in Azure | Microsoft Azure"
	description="Find the articles that describe how to set up a dev/test environment or a production SharePoint Server 2013 farm in Microsoft Azure."
	documentationCenter=""
	services="virtual-machines"
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="Windows"
	ms.devlang="na"
	ms.topic="index-page"
	ms.date="10/20/2015"
	ms.author="josephd"/>

# SharePoint farms hosted in Azure infrastructure services

[AZURE.INCLUDE [learn-about-deployment-models-both-include](../../includes/learn-about-deployment-models-both-include.md)]

Set up your first or next dev/test or production SharePoint farm in Microsoft Azure infrastructure services, where you can take advantage of ease of configuration and the ability to quickly expand the farm to include new capacity or optimization of key functionality.

> [AZURE.NOTE] Microsoft has released the SharePoint Server 2016 IT Preview. To make this preview easy to install and test, you can use an Azure virtual machine gallery image with SharePoint Server 2016 IT Preview and its prerequisites pre-installed. For more information, see [Test the SharePoint Server 2016 IT Preview in Azure](http://azure.microsoft.com/blog/test-sharepoint-server-2016-it-preview-4/).

## Basic SharePoint dev/test farm

For virtual machines created using the Resource Manager deployment model, see the [SharePoint 2013 non-HA Farm](https://azure.microsoft.com/marketplace/partners/sharepoint2013/sharepoint2013farmsharepoint2013-nonha/) item in the Azure Marketplace of the Azure Preview portal. This creates a basic dev/test farm for an Internet-facing SharePoint website.

You can also use an Azure Resource Manager template. See [Deploy a three-server SharePoint farm](virtual-machines-workload-template-sharepoint.md#deploy-a-three-server-sharepoint-farm).

The automatically-created environment consists of three servers for a domain controller, a SQL server, and the SharePoint server in a cloud-only Azure virtual network.

To create a similar configuration with the classic deployment model, use the [SharePoint Server Farm](virtual-machines-sharepoint-farm-azure-preview.md) item in the Azure Marketplace of the Azure Preview portal.


## High-availability SharePoint dev/test farm

For virtual machines created using the Resource Manager deployment model, see the [SharePoint 2013 HA Farm](https://azure.microsoft.com/marketplace/partners/sharepoint2013/sharepoint2013farmsharepoint2013-ha/) item in the Azure Marketplace of the Azure Preview portal. This creates a highly-available farm for an Internet-facing SharePoint website.

You can also use an Azure Resource Manager template. See [Deploy a nine-server SharePoint farm](virtual-machines-workload-template-sharepoint.md#deploy-a-nine-server-sharepoint-farm).

The automatically-created environment consists of nine servers in a cloud-only Azure virtual network: two for domain controllers, three for a SQL server cluster, two application-tier SharePoint servers, and two web-tier SharePoint servers.

To create a similar configuration with the classic deployment model, use the [SharePoint Server Farm](virtual-machines-sharepoint-farm-azure-preview.md) item in the Azure Marketplace of the Azure Preview portal.


## Hybrid cloud dev/test farm

With the [SharePoint intranet farm in a hybrid cloud dev/test environment](../virtual-network/virtual-networks-setup-sharepoint-hybrid-cloud-testing.md), you create a simulated hybrid cloud configuration that hosts a simple, two-tier SharePoint farm, which you can use to test an intranet SharePoint farm hosted in Azure from your location on the Internet.

This configuration uses classic virtual machines.

## High-availability, intranet SharePoint production farm

With the deployment of [SharePoint 2013 with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-workload-intranet-sharepoint-overview.md), you build out a production-ready, high-availability, intranet SharePoint Server 2013 farm in Azure.

This configuration uses classic virtual machines.

## Additional resources

[Microsoft Azure Architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx)

[Internet Sites in Microsoft Azure using SharePoint Server 2013](https://technet.microsoft.com/library/dn635307.aspx)

[SharePoint Server 2013 Disaster Recovery in Microsoft Azure](https://technet.microsoft.com/library/dn635313.aspx)

[Using Microsoft Azure Active Directory for SharePoint 2013 authentication](https://technet.microsoft.com/library/dn635311.aspx)

[Deploy Office 365 Directory Synchronization (DirSync) in Microsoft Azure](https://technet.microsoft.com/library/dn635310.aspx)
