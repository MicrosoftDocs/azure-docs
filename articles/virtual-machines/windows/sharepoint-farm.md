---
title: Create SharePoint server farms in Azure | Microsoft Docs
description: Quickly create a new SharePoint 2013 or SharePoint 2016 farm in Azure using the Azure portal marketplace.
services: virtual-machines-windows
documentationcenter: ''
author: JoeDavies-MSFT
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 89b124da-019d-4179-86dd-ad418d05a4f2
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 09/30/2016
ms.author: josephd
ms.custom: H1Hack27Feb2017

---
# Create SharePoint server farms using the Azure portal marketplace

[!INCLUDE [learn-about-deployment-models](../../../includes/learn-about-deployment-models-rm-include.md)]

## SharePoint 2013 farms
With the Microsoft Azure portal marketplace, you can quickly create pre-configured SharePoint Server 2013 farms. This can save you a lot of time when you need a basic or high-availability SharePoint farm for a dev/test environment or if you are evaluating SharePoint Server 2013 as a collaboration solution for your organization.

> [!NOTE]
> The **SharePoint Server Farm** item in the Azure Marketplace of the Azure portal has been removed. It has been replaced with the **SharePoint 2013 non-HA Farm** and **SharePoint 2013 HA Farm** items.
>
>

The basic SharePoint farm consists of three virtual machines in this configuration.

![sharepointfarm](./media/sharepoint-farm/Non-HAFarm.png)

You can use this farm configuration for a simplified setup for SharePoint app development or your first-time evaluation of SharePoint 2013.

To create the basic (three-server) SharePoint farm:

1. Click [here](https://azure.microsoft.com/marketplace/partners/sharepoint2013/sharepoint2013farmsharepoint2013-nonha/).
2. Click **Deploy**.
3. On the **SharePoint 2013 non-HA Farm** pane, click **Create**.
4. Specify settings on the steps of the **Create SharePoint 2013 non-HA Farm** pane, and then click **Create**.

The high-availability SharePoint farm consists of nine virtual machines in this configuration.

![sharepointfarm](./media/sharepoint-farm/HAFarm.png)

You can use this farm configuration to test higher client loads, high availability of the external SharePoint site, and SQL Server AlwaysOn Availability Groups for a SharePoint farm. You can also use this configuration for SharePoint app development in a high-availability environment.

To create the high-availability (nine-server) SharePoint farm:

1. Click [here](https://azure.microsoft.com/marketplace/partners/sharepoint2013/sharepoint2013farmsharepoint2013-ha/).
2. Click **Deploy**.
3. On the **SharePoint 2013 HA Farm** pane, click **Create**.
4. Specify settings on the seven steps of the **Create SharePoint 2013 HA Farm** pane, and then click **Create**.

> [!NOTE]
> You cannot create the **SharePoint 2013 non-HA Farm** or **SharePoint 2013 HA Farm** with an Azure Free Trial.
>
>

The Azure portal creates both of these farms in a cloud-only virtual network with an Internet-facing web presence. There is no site-to-site VPN or ExpressRoute connection back to your organization network.

> [!NOTE]
> When you create the basic or high-availability SharePoint farms using the Azure portal, you cannot specify an existing resource group. To work around this limitation, create these farms with Azure PowerShell. For more information, see [Create SharePoint 2013 dev/test farms with Azure PowerShell](https://technet.microsoft.com/library/mt743093.aspx#powershell).
>
>

## SharePoint 2016 farms
See [this article](https://technet.microsoft.com/library/mt723354.aspx) for the instructions to build the following single-server SharePoint Server 2016 farm.

![sharepointfarm](./media/sharepoint-farm/SP2016Farm.png)

## Managing the SharePoint farms
You can administer the servers of these farms through Remote Desktop connections. For more information, see [Log on to the virtual machine](quick-create-portal.md#connect-to-virtual-machine).

From the Central Administration SharePoint site, you can configure My sites, SharePoint applications, and other functionality. For more information, see [Configure SharePoint](http://technet.microsoft.com/library/ee836142.aspx).

## Next steps
* Discover additional [SharePoint configurations](https://technet.microsoft.com/library/dn635309.aspx) in Azure infrastructure services.
