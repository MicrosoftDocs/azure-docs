---
title: Connect to a Windows Server VM | Microsoft Docs
description: Learn how to connect and log on to a Windows VM using the Azure portal and the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: ef62b02e-bf35-468d-b4c3-71b63fe7f409
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 09/13/2018
ms.author: cynthn

---
# How to connect and log on to an Azure virtual machine running Windows
You'll use the **Connect** button in the Azure portal to start a Remote Desktop (RDP) session from a Windows desktop. First you connect to the virtual machine, and then you log on.

To connect to a Windows VM from a Mac, you will need to install an RDP client for Mac such as [Microsoft Remote Desktop](https://itunes.apple.com/app/microsoft-remote-desktop/id715768417).

## Connect to the virtual machine
1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com/).
2. On the left menu, select **Virtual Machines**.
3. Select the virtual machine from the list.
4. On the top of the page for the virtual machine, select **Connect**.
2. On the **Connect to virtual machine** page, select the appropriate options and select **Download RDP file**.
2. Open the downloaded RDP file and select **Connect** when prompted. 
2. You will get a warning that the .rdp file is from an unknown publisher. This is expected. In the **Remote Desktop Connection** window, select **Connect** to continue.
   
    ![Screenshot of a warning about an unknown publisher.](./media/connect-logon/rdp-warn.png)
3. In the **Windows Security** window, select **More choices** and then **Use a different account**. Enter the credentials for an account on the virtual machine and then select **OK**.
   
     **Local account**: This is usually the local account user name and password that you specified when you created the virtual machine. In this case, the domain is the name of the virtual machine and it is entered as *vmname*&#92;*username*.  
   
    **Domain joined VM**: If the VM belongs to a domain, enter the user name in the format *Domain*&#92;*Username*. The account also needs to either be in the Administrators group or have been granted remote access privileges to the VM.
   
    **Domain controller**: If the VM is a domain controller, enter the user name and password of a domain administrator account for that domain.
4. Select **Yes** to verify the identity of the virtual machine and finish logging on.
   
   ![Screenshot showing a message abut verifying the identity of the VM.](./media/connect-logon/cert-warning.png)


   > [!TIP]
   > If the **Connect** button in the portal is grayed-out and you are not connected to Azure via an [Express Route](../../expressroute/expressroute-introduction.md) or [Site-to-Site VPN](../../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) connection, you will need to create and assign your VM a public IP address before you can use RDP. For more information, see [Public IP addresses in Azure](../../virtual-network/virtual-network-ip-addresses-overview-arm.md).
   > 
   > 


## Next steps
If you have difficulty connecting, see [Troubleshoot Remote Desktop connections](troubleshoot-rdp-connection.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

