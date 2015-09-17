<properties
	pageTitle="Log on to a Windows Server VM | Microsoft Azure"
	description="Learn how to log on to a Windows Server VM using the Azure preview portal and the Resource Manager deployment model."
	services="virtual-machines"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/15/2015"
	ms.author="cynthn"/>

# How to log on to a virtual machine running Windows Server 

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article covers logging on to a Windows VM using Resource Manager deployment model. You can also create a resource with the [classic deployment model](virtual-machines-log-on-windows-server.md).

You'll use the **Connect** button in the Azure preview portal to start a Remote Desktop session. First you'll connect to the virtual machine, then you'll log on.

## Connect to the virtual machine

1. If you haven't already done so, sign in to the [Azure preview portal](https://portal.azure.com/).

2.	On the Hub menu, click **Browse**.  

3.	On the search blade, scroll down and click **Virtual Machines**.

	![Search for virtual machines](./media/virtual-machines-log-on-windows-server-preview/search-blade-preview-portal.png)

4.	Select the virtual machine from the list.

5. On the blade for the virtual machine, click **Connect**.

	![Connect to the virtual machine](./media/virtual-machines-log-on-windows-server-preview/preview-portal-connect.png)

## Log on to the virtual machine

[AZURE.INCLUDE [virtual-machines-log-on-win-server](../../includes/virtual-machines-log-on-win-server.md)]

## Troubleshooting

If the tips about logging on don't help or aren't what you need, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-troubleshoot-remote-desktop-connections.md). This article walks you through diagnosing and resolving common problems.
