<properties
	pageTitle="Hybrid cloud test environments in Azure | Microsoft Azure"
	description="Find the articles that describe how to build dev/test or proof-of-concept IT pro environments for your Azure-based hybrid cloud."
	documentationCenter=""
	services="virtual-machines"
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/09/2015"
	ms.author="josephd"/>

# Azure hybrid cloud test environments

For dev/test or a proof-of-concept, hybrid cloud test environments use your local Internet connection and one of your public IP addresses and step you through setting up a functioning, cross-premises Azure Virtual Network (VNet). When you are finished, you can develop and test applications, experiment with simplified IT workloads, and gauge the performance of a site-to-site virtual private network (VPN) connection relative to your location on the Internet.

> [AZURE.NOTE] These articles currently create virtual machines, virtual networks, and other resources in Service Management.

## Hybrid cloud base configuration

The [hybrid cloud base configuration](../virtual-network/virtual-networks-setup-hybrid-cloud-environment-testing.md) consists of:

- A simplified on-premises network with four virtual machines (a domain controller, an application server, a client computer, and a VPN device running Windows Server and Routing and Remote Access)
- An Azure virtual network with a replica domain controller
- A site-to-site VPN connection

## SharePoint intranet farm in a hybrid cloud

The [SharePoint intranet farm in a hybrid cloud test environment](../virtual-network/virtual-networks-setup-sharepoint-hybrid-cloud-testing.md) adds a SQL Server 2014 server and a SharePoint Server 2013 server to the hybrid cloud base configuration. This creates a two-tier SharePoint farm that you can access from the client computer on the simplified on-premises network.

## Web-based line-of-business (LOB) application in a hybrid cloud

The [web-based LOB application in a hybrid cloud test environment](../virtual-network/virtual-networks-setup-lobapp-hybrid-cloud-testing.md) adds a SQL Server 2014 server and an Internet Information Services (IIS) server to the hybrid cloud base configuration. This creates the infrastructure in which you can deploy and test a tiered, web-based LOB application.

## Office 365 Directory Synchronization (DirSync) server in a hybrid cloud

The [Office 365 DirSync server in a hybrid cloud test environment](../virtual-network/virtual-networks-setup-dirsync-hybrid-cloud-testing.md) adds a DirSync server to the hybrid cloud base configuration and demonstrates Office 365 DirSync with password synchronization to a trial Office 365 subscription.

## Simulated hybrid cloud test environment

For organizations and individuals for which a direct Internet connection and public IP address are not readily available, the [simulated hybrid cloud test environment](../virtual-network/virtual-networks-setup-simulated-hybrid-cloud-environment-testing.md) builds out the simplified on-premises network in a separate Azure Virtual Network and then connects the two virtual networks with a VNet-to-VNet VPN connection.


## Additional resources

[SharePoint farms hosted in Azure Infrastructure Services](virtual-machines-sharepoint-infrastructure-services.md)

[PDF of the 3-D Line-of-Business Applications architecture blueprint](http://download.microsoft.com/download/2/C/8/2C8EB75F-AC45-4A79-8A63-C1800C098792/MS_Arch_LOB_App_3D_pdf.pdf)

[Deploy Office 365 Directory Synchronization (DirSync) in Microsoft Azure](https://technet.microsoft.com/library/dn635310.aspx)

[Azure Infrastructure Services implementation guidelines](virtual-machines-infrastructure-services-implementation-guidelines.md)
