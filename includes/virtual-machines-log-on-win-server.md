---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 05/09/2018
 ms.author: cynthn
 ms.custom: include file
---


1. Click the **Connect** button on the virtual machine properties page. 
2. In the **Connect to virtual machine** page, keep select the appropriate options and click **Download RDP file**.
2. Open the downloaded RDP file and click **Connect** when prompted. 
2. You get a warning that the `.rdp` file is from an unknown publisher. This is normal. In the Remote Desktop window, click **Connect** to continue.
   
    ![Screenshot of a warning about an unknown publisher.](./media/virtual-machines-log-on-win-server/rdp-warn.png)
3. In the **Windows Security** window, select **More choices** and then **Use a different account**. Type the credentials for an account on the virtual machine and then click **OK**.
   
     **Local account** - this is usually the local account user name and password that you specified when you created the virtual machine. In this case, the domain is the name of the virtual machine and it is entered as *vmname*&#92;*username*.  
   
    **Domain joined VM** - if the VM belongs to a domain, enter the user name in the format *Domain*&#92;*Username*. The account also needs to either be in the Administrators group or have been granted remote access privileges to the VM.
   
    **Domain controller** - if the VM is a domain controller, type the user name and password of a domain administrator account for that domain.
4. Click **Yes** to verify the identity of the virtual machine and finish logging on.
   
   ![Screenshot showing a message abut verifying the identity of the VM.](./media/virtual-machines-log-on-win-server/cert-warning.png)

