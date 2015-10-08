<properties services="virtual-machines" title="How to Log on to a Virtual Machine Running Windows Server" authors="KBDAzure" solutions="" manager="timlt" editor="tysonn" />

4. Clicking **Connect** creates and downloads a Remote Desktop Protocol file (.rdp file). Click **Open** to use this file.

5. In the Remote Desktop window, click **Connect** to continue.

	![Continue with connecting](./media/virtual-machines-log-on-win-server/connectpublisher.png)

6. In the Windows Security window, type the credentials for an administrative account on the virtual machine, and then click **OK**.

 	>[AZURE.TIP] In most cases, you'll use the user name and password that was specified when the virtual machine was created. Check the user name to make sure it has the correct domain information:
	>
	>- If the virtual machine belongs to a domain at your organization, make sure the user name includes the name of that domain.
	>- If the virtual machine doesn't belong to a domain, either remove any domain information by starting the line with '\' or use the VM name as the domain name. For example, `\MyUserName` or `MyTestVM\MyUserName`.
	>- If the virtual machine is a domain controller, type the user name and password of a domain administrator account for that domain.

7.	Click **Yes** to verify the identity of the virtual machine and finish logging on.

	![Verify the identity of the machine](./media/virtual-machines-log-on-win-server/connectverify.png)
