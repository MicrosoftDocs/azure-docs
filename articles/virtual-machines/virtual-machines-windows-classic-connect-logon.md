---
title: Log on to a classic Azure VM | Microsoft Docs
description: Use the Azure classic portal to log on to a Windows virtual machine created with the classic deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: tysonn
tags: azure-service-management

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 07/28/2016
ms.author: cynthn

---
# Log on to a Windows virtual machine using the Azure classic portal
In the Azure classic portal, you use the **Connect** button to start a Remote Desktop session and log on to a Windows VM.

Do you want to connect to a Linux VM? See [How to log on to a virtual machine running Linux](virtual-machines-linux-mac-create-ssh-keys.md).

Learn how to [perform these steps using new Azure portal](virtual-machines-windows-connect-logon.md).

[!INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

For information about how to log on to a VM using the Resource Manager model, see [here](virtual-machines-windows-connect-logon.md).

## Video walkthrough
Here's a video walkthrough of the steps in this tutorial. It also covers endpoints and public and private ports used for connecting to a Windows VM in Azure.

[!VIDEO https://channel9.msdn.com/Blogs/Azure-Documentation-Shorts/Logging-On-To-VM-Running-Windows-Server-on-Azure/player]



## Connect to the virtual machine
1. Sign in to the Azure classic portal.
2. Click **Virtual Machines**, and then select the virtual machine.
3. On the command bar at the bottom of the page, click **Connect**.
   
    ![Log on to the virtual machine](./media/virtual-machines-windows-classic-connect-logon/connectwindows.png)

> [!TIP]
> If the **Connect** button isn't available, see the troubleshooting tips at the end of this article.
> 
> 

## Log on to the virtual machine
[!INCLUDE [virtual-machines-log-on-win-server](../../includes/virtual-machines-log-on-win-server.md)]

## Next steps
* If the **Connect** button is inactive or you are having other problems with the Remote Desktop connection, try resetting the configuration. From the virtual machine dashboard, under **Quick Glance**, click **Reset remote configuration**.
* For problems with your password, try resetting it. From the virtual machine dashboard, under **Quick Glance**, click **Reset password**.

If those tips don't work or aren't what you need, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-windows-troubleshoot-rdp-connection.md). This article walks you through diagnosing and resolving common problems.

