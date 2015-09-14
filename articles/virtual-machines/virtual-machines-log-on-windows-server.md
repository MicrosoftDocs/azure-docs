<properties
	pageTitle="Log on to a virtual machine running Windows Server"
	description="Learn to use the Azure portal to log on to a virtual machine running Windows Server."
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor="tysonn"
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/14/2015"
	ms.author="kathydav"/>


# How to Log on to a virtual machine running Windows Server#

You'll use the **Connect** button in the Azure portal to start a Remote Desktop session. (Want to connect to a Linux VM? See [How to log on to a virtual machine running Linux](virtual-machines-linux-how-to-log-on.md).)

## How to log on

Here's a walkthrough of the steps in this tutorial.

[AZURE.VIDEO logging-on-to-vm-running-windows-server-on-azure]

1. If you haven't already done so, sign in to the [Azure portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select the appropriate virtual machine.

3. On the command bar, click **Connect**.

	![Log on to the virtual machine](./media/virtual-machines-log-on-win-server/connectwindows.png)

[AZURE.INCLUDE [virtual-machines-log-on-win-server](../../includes/virtual-machines-log-on-win-server.md)]

## Troubleshooting tips

Here are a few things to try quickly:

For problems with the Remote Desktop connection, try resetting the configuration from the portal. From the virtual machine dashboard, under **Quick Glance**, click **Reset remote configuration**.

For problems with your password, try resetting it from the portal. From the virtual machine dashboard, under **Quick Glance**, click **Reset password**.

If those don't work, you'll need to do more extensive troubleshooting. For instructions, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-troubleshoot-remote-desktop-connections.md).
