<properties services="virtual-machines" title="How to Log on to a Virtual Machine Running Windows Server" authors="cynthn" solutions="" manager="timlt" editor="tysonn" />

4. Clicking **Connect** creates and downloads a Remote Desktop Protocol file (.rdp file). Click **Open** to use this file.

5. In the Remote Desktop window, click **Connect** to continue.

	![Screenshot of a warning about an Unknown Publisher.](./media/virtual-machines-log-on-win-server/connectpublisher.png)

6. In the Windows Security window, type the credentials for an account on the virtual machine and then click **OK**.

 	Usually the credentials are the local account user name and password that you specified when you created the virtual machine. In this case, the domain is the name of the virtual machine and it is entered as *vmname*&#92;*username*.  
	
	If the virtual machine belongs to a domain in your organization, make sure that the user name includes the name of the domain in the format *Domain*&#92;*Username*. The account also needs to either be in the Administrators group or have been granted remote access privileges to the VM.
	
	If the virtual machine is a domain controller, type the user name and password of a domain administrator account for that domain.

7.	Click **Yes** to verify the identity of the virtual machine and finish logging on.

	![Screenshot showing a message abut verifying the identity of the VM.](./media/virtual-machines-log-on-win-server/connectverify.png)
