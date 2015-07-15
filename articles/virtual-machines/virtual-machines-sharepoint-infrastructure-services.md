<properties
	pageTitle="SharePoint Farms Hosted in Azure Infrastructure Services"
	description="Find the key articles that describe how to set up a dev/test or production SharePoint 2013 farm in Microsoft Azure infrastructure services."
	documentationCenter=""
	services="virtual-machines"
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows-sharepoint"
	ms.devlang="na"
	ms.topic="index-page"
	ms.date="07/07/2015"
	ms.author="josephd"/>

# SharePoint farms hosted in Azure infrastructure services

Set up your first or next dev/test or production SharePoint farm in Microsoft Azure infrastructure services, where you can take advantage of ease of configuration and the ability to quickly expand the farm to include new capacity or optimization of key functionality.

## Basic SharePoint dev/test farm

For virtual machines created in Service Management, use the [SharePoint Server Farm](virtual-machines-sharepoint-farm-azure-preview.md) feature of the Azure preview portal to create a basic dev/test farm for an Internet-facing SharePoint website.

The automatically created environment consists of three servers for a domain controller, a SQL server, and the SharePoint server in a cloud-only Azure virtual network.

To create a similar configuration with virtual machines created in Resource Manager, use a template. See [Deploy a three-server SharePoint farm](virtual-machines-workload-template-sharepoint.md#deploy-a-three-server-sharepoint-farm).

## High-availability SharePoint dev/test farm

For virtual machines created in Service Management, use the [SharePoint Server Farm](virtual-machines-sharepoint-farm-azure-preview.md) feature of the Azure preview portal to create a high-availability SharePoint dev/test farm for an Internet-facing SharePoint website.

The automatically created environment consists of nine servers in a cloud-only Azure virtual network: two for domain controllers, three for a SQL server cluster, two application-tier SharePoint servers, and two web-tier SharePoint servers.

To create a similar configuration with virtual machines created in Resource Manager, use a template. See [Deploy a nine-server SharePoint farm](virtual-machines-workload-template-sharepoint.md#deploy-a-nine-server-sharepoint-farm).

## Hybrid cloud dev/test farm

With the [SharePoint intranet farm in a hybrid cloud dev/test environment](../virtual-network/virtual-networks-setup-sharepoint-hybrid-cloud-testing.md), you create a simulated hybrid cloud configuration that hosts a simple, two-tier SharePoint farm, which you can use to test an intranet SharePoint farm hosted in Azure from your location on the Internet.

This configuration uses virtual machines created in Service Management.

## High-availability, intranet SharePoint production farm

With the deployment of [SharePoint 2013 with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-workload-intranet-sharepoint-overview.md), you build out a production-ready, high-availability, intranet SharePoint Server 2013 farm in Azure.

This configuration uses virtual machines created in Service Management.

## Additional resources

[SharePoint Server on Azure Virtual Machines](https://msdn.microsoft.com/library/dn275955.aspx)

[Planning for SharePoint 2013 on Azure Infrastructure Services](https://msdn.microsoft.com/library/dn275958.aspx)

[Microsoft Azure Architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx)
