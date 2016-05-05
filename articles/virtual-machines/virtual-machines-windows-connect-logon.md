<properties
	pageTitle="Connect to a Windows Server VM | Microsoft Azure"
	description="Learn how to connect and log on to a Windows VM using the Azure portal and the Resource Manager deployment model."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="05/05/2016"
	ms.author="cynthn"/>

# How to connect and log on to an Azure virtual machine running Windows 


Use the **Connect** button in the Azure portal to start a Remote Desktop (RDP) session to your Windows VM. First you connect to the virtual machine, then you log on.

## Connect to the virtual machine

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com/).

2.	On the Hub menu, click **Virtual Machines**.

3.	Select the virtual machine from the list.

4. On the blade for the virtual machine, click **Connect**.

	![Screenshot of the Azure portal showing how to connect to your VM.](./media/virtual-machines-windows-connect-logon/connect.png)

## Log on to the virtual machine

[AZURE.INCLUDE [virtual-machines-log-on-win-server](../../includes/virtual-machines-log-on-win-server.md)]


## Next steps

If you run into trouble when you try to connect, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-windows-troubleshoot-rdp-connection.md). This article walks you through diagnosing and resolving common problems.
