<properties services="virtual-machines" title="How to Log on to a Virtual Machine Running Windows Server" authors="KBDAzure" solutions="" manager="timlt" editor="tysonn" />

4. Clicking **Connect** creates and downloads a Remote Desktop Protocol file (.rdp file). Click **Open** to use this file.

5. In the Remote Desktop window, click **Connect** to continue.

	![Continue with connecting](./media/virtual-machines-log-on-win-server/connectpublisher.png)

6. In the Windows Security window, type the credentials for an account on the virtual machine and then click **OK**.

 	In most cases, the local account user name and password that you specified when you created the virtual machine. In this case, the domain is the vmanme and should be entered as *vmname*\*username*.  
	
	If the virtual machine belongs to a domain at your organization, make sure the user name includes the name of that domain in the format *Domain*\*Username*. The account will also need to either be in the Admnistrators group or have been granted remote access privledges to the VM.
	
	If the virtual machine is a domain controller, type the user name and password of a domain administrator account for that domain.

7.	Click **Yes** to verify the identity of the virtual machine and finish logging on.

	![Verify the identity of the machine](./media/virtual-machines-log-on-win-server/connectverify.png)
