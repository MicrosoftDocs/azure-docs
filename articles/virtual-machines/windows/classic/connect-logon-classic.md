---
title: Log on to a classic Azure VM | Microsoft Docs
description: Use the Azure portal to log on to a Windows virtual machine created with the classic deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-service-management
ROBOTS: NOINDEX

ms.assetid: 3c1239ed-07dc-48b8-8b3d-dc8c5f0ab20e
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 05/30/2017
ms.author: cynthn

---
# Log on to a Windows virtual machine using the Azure portal
In the Azure portal, you use the **Connect** button to start a Remote Desktop session and log on to a Windows VM.

Do you want to connect to a Linux VM? See [How to log on to a virtual machine running Linux](../../linux/mac-create-ssh-keys.md).

<!--
Deleting, but not 100% sure
Learn how to [perform these steps using new Azure portal](../connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
-->

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. For information about how to log on to a VM using the Resource Manager model, see [here](../connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
> [!INCLUDE [virtual-machines-common-classic-createportal](../../../../includes/virtual-machines-classic-portal.md)]

## Connect to the virtual machine
1. Sign in to the Azure portal.
2. Click on the virtual machine that you want to access. The name is listed in the **All resources** pane.

    ![Virtual-machine-locations](./media/connect-logon/azureportaldashboard.png)

1. Click the **Connect** button on the virtual machine properties page. 
2. In the **Connect to virtual machine** page, keep select the appropriate options and click **Download RDP file**.
2. Open the downloaded RDP file and click **Connect** when prompted. 
2. You get a warning that the `.rdp` file is from an unknown publisher. This is normal. In the Remote Desktop window, click **Connect** to continue.
   
    ![Screenshot of a warning about an unknown publisher.](./media/connect-logon/rdp-warn.png)
3. In the **Windows Security** window, select **More choices** and then **Use a different account**. Type the credentials for an account on the virtual machine and then click **OK**.
   
     **Local account** - this is usually the local account user name and password that you specified when you created the virtual machine. In this case, the domain is the name of the virtual machine and it is entered as *vmname*&#92;*username*.  
   
    **Domain joined VM** - if the VM belongs to a domain, enter the user name in the format *Domain*&#92;*Username*. The account also needs to either be in the Administrators group or have been granted remote access privileges to the VM.
   
    **Domain controller** - if the VM is a domain controller, type the user name and password of a domain administrator account for that domain.
4. Click **Yes** to verify the identity of the virtual machine and finish logging on.
   
   ![Screenshot showing a message abut verifying the identity of the VM.](./media/connect-logon/cert-warning.png)

## Next steps
* If the **Connect** button is inactive or you are having other problems with the Remote Desktop connection, try resetting the configuration. click **Reset remote access** from the virtual machine dashboard.

    ![Reset-remote-access](./media/connect-logon/virtualmachine_dashboard_reset_remote_access.png)

* For problems with your password, try resetting it. Click **Reset password** along the left edge of virtual machine dashboard, under **Support + Troubleshooting**.

    ![Reset-password](./media/connect-logon/virtualmachine_dashboard_reset_password.png)

If those tips don't work or aren't what you need, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](../troubleshoot-rdp-connection.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). This article walks you through diagnosing and resolving common problems.
