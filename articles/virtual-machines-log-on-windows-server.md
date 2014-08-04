<properties linkid="manage-windows-howto-logon" urlDisplayName="Log on to a VM" pageTitle="Log on to a virtual machine running Windows Server" metaKeywords="Azure logging on vm, vm portal" description="Learn how to log on to a virtual machine running Windows Server 2008 R2 by using the Azure Management Portal." metaCanonical="" services="virtual-machines" documentationCenter="" title="How to Log on to a Virtual Machine Running Windows Server" authors="kathydav" solutions="" manager="jeffreyg" editor="tysonn" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-windows" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="kathydav" />




#How to Log on to a Virtual Machine Running Windows Server#

For a virtual machine that is running the Windows Server operating system, you use the Connect button in the Management Portal to start a Remote Desktop Connection. 

>[WACOM.NOTE] For requirements and troubleshooting tips, see [Connect to an Azure virtual machine with RDP or SSH](http://go.microsoft.com/fwlink/p/?LinkId=398294).

1. If you have not already done so, sign in to the [Azure Management Portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select the appropriate virtual machine.

3. On the command bar, click **Connect**.

	![Log on to the virtual machine](./media/virtual-machines-log-on-windows-server/connectwindows.png)

4. Click **Open** to use the Remote Desktop Protocol file that was automatically created for the virtual machine.
	
5. Click **Connect** to proceed with the connection process.

	![Continue with connecting](./media/virtual-machines-log-on-windows-server/connectpublisher.png)

6. Type the user name and password of the administrative account on the virtual machine, and then click **OK**.
	
	
7. Click **Yes** to verify the identity of the virtual machine.

	![Verify the identity of the machine](./media/virtual-machines-log-on-windows-server/connectverify.png)

	You can now work with the virtual machine just as you would with any other server.

	>[WACOM.NOTE] For requirements and troubleshooting tips, see [Connect to a Windows Azure virtual machine with RDP or SSH](http://go.microsoft.com/fwlink/p/?LinkId=398294).
