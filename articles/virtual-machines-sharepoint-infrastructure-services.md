<properties 
	pageTitle="SharePoint farms hosted in Azure infrastructure services" 
	description="Get to the key topics that describe how to set up a dev/test or production SharePoint 2013 farm in Azure infrastructure services." 
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
	ms.date="04/06/2015" 
	ms.author="josephd"/>

# SharePoint farms hosted in Azure infrastructure services

Set up your first or next dev/test or production SharePoint farm in Microsoft Azure infrastructure services, where you can take advantage of ease of configuration and the ability to quickly expand the farm to include new capacity or optimization of key functionality. 

## Basic SharePoint dev/test farm 

You can use the [SharePoint Server Farm](virtual-machines-sharepoint-farm-azure-preview.md) template in the Azure Preview Portal to create a basic dev/test farm for an Internet-facing SharePoint web site.

The automatically-created environment consists of three servers for a domain controller, a SQL server, and the SharePoint server in a cloud-only Azure Virtual Network.

## Highly-available SharePoint dev/test farm

You can also use the [SharePoint Server Farm](virtual-machines-sharepoint-farm-azure-preview.md) template in the Azure Preview Portal to create a high-availability SharePoint dev/test farm for an Internet-facing SharePoint web site.

The automatically-created environment consisting of nine servers in a cloud-only Azure Virtual Network: two for domain controllers, three for a SQL server cluster, two application tier SharePoint servers, and two web tier SharePoint servers.

## Hybrid cloud dev/test farm

With the [SharePoint intranet farm in a hybrid cloud dev/test environment](virtual-networks-setup-sharepoint-hybrid-cloud-testing.md), you create a simulated hybrid cloud configuration that hosts a simple, two-tier SharePoint farm, which you can use to test an intranet SharePoint farm hosted in Azure from your location on the Internet.

## Highly-available, intranet SharePoint production farm

With [Deploying SharePoint 2013 with SQL Server AlwaysOn Availability Groups in Azure](virtual-machines-workload-intranet-sharepoint-overview.md), you build out a production-ready, highly-available, intranet SharePoint Server 2013 farm in Azure.

## Additional Resources

[SharePoint Server on Azure Infrastructure Services](https://msdn.microsoft.com/library/dn275955.aspx)

[Planning for SharePoint 2013 on Azure Infrastructure Services](https://msdn.microsoft.com/library/dn275958.aspx)

[Microsoft Azure Architectures for SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx)
