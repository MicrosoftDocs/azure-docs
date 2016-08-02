<properties
	pageTitle="Create SharePoint server farms | Microsoft Azure"
	description="Quickly create a new SharePoint 2013 or SharePoint 2016 farm in Azure."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="JoeDavies-MSFT"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/19/2016"
	ms.author="josephd"/>

# Create SharePoint server farms

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic model.

## SharePoint 2013 farms

With the Microsoft Azure portal marketplace, you can quickly create pre-configured SharePoint Server 2013 farms. This can save you a lot of time when you need a basic or high-availability SharePoint farm for a development and testing environment or if you are evaluating SharePoint Server 2013 as a collaboration solution for your organization.

> [AZURE.NOTE] The **SharePoint Server Farm** item in the Azure Marketplace of the Azure portal has been removed. It has been replaced with the **SharePoint 2013 non-HA Farm** and **SharePoint 2013 HA Farm** items.

The basic SharePoint farm consists of three virtual machines in this configuration.

![sharepointfarm](./media/virtual-machines-windows-sharepoint-farm/Non-HAFarm.png)

You can use this farm configuration for a simplified setup for SharePoint app development or your first-time evaluation of SharePoint 2013.

To create the basic (three-server) SharePoint farm:

1. Click [here](https://azure.microsoft.com/marketplace/partners/sharepoint2013/sharepoint2013farmsharepoint2013-nonha/).
2. Click **Deploy**.
3. On the **SharePoint 2013 non-HA Farm** pane, click **Create**.
4. Specify settings on the seven steps of the **Create SharePoint 2013 non-HA Farm** pane, and then click **Create**.

The high-availability SharePoint farm consists of nine virtual machines in this configuration.

![sharepointfarm](./media/virtual-machines-windows-sharepoint-farm/HAFarm.png)

You can use this farm configuration to test higher client loads, high availability of the external SharePoint site, and SQL Server Always On for a SharePoint farm. You can also use this configuration for SharePoint app development in a high-availability environment.

To create the high-availability (nine-server) SharePoint farm:

1. Click [here](https://azure.microsoft.com/marketplace/partners/sharepoint2013/sharepoint2013farmsharepoint2013-ha/).
2. Click **Deploy**.
3. On the **SharePoint 2013 HA Farm** pane, click **Create**.
4. Specify settings on the seven steps of the **Create SharePoint 2013 HA Farm** pane, and then click **Create**.

> [AZURE.NOTE] You cannot create the **SharePoint 2013 non-HA Farm** or **SharePoint 2013 HA Farm** with an Azure Free Trial.

The Azure portal creates both of these farms in a cloud-only virtual network with an Internet-facing web presence. There is no site-to-site VPN or ExpressRoute connection back to your organization network.

## SharePoint 2016 farms

See [this topic](https://technet.microsoft.com/library/mt723354.aspx) for instructions on how to build the following single-server SharePoint 2016 farm.

![sharepointfarm](./media/virtual-machines-windows-sharepoint-farm/SP2016Farm.png)

## Managing the SharePoint farms

You can administer the servers of these farms through Remote Desktop connections. For more information, see [Log on to the virtual machine](virtual-machines-windows-hero-tutorial.md#log-on-to-the-virtual-machine).

From the Central Administration SharePoint site, you can configure My sites, SharePoint applications, and other functionality. For more information, see [Configure SharePoint 2013](http://technet.microsoft.com/library/ee836142.aspx).

## Next steps

- Discover additional [SharePoint 2013](https://technet.microsoft.com/library/dn635309.aspx) configurations in Azure infrastructure services.
