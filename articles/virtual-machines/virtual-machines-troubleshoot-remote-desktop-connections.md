<properties
	pageTitle="Troubleshoot Remote Desktop connection on a Windows VM | Microsoft Azure"
	description="Troubleshoot Remote Desktop or RDP connections to an Azure virtual machine running Windows."
	services="virtual-machines"
	documentationCenter=""
	authors="dsk-2015"
	manager="timlt"
	editor=""
	tags="top-support-issue,azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/16/2015"
	ms.author="dkshir"/>

# Troubleshoot Remote Desktop connections to an Azure virtual machine running Windows

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article covers troubleshooting a virtual machine created with the classic deployment model or the Resource Manager deployment model.

There can be various reasons for Remote Desktop (RDP) to fail connecting to your Azure virtual machine running Windows. This article will help you find out the causes and correct them.

> [AZURE.NOTE] This article only applies to Azure virtual machines running Windows. For troubleshooting connections to Azure virtual machines running Linux, see [this article](virtual-machines-troubleshoot-ssh-connections.md).

## Contact Azure Customer Support

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](http://azure.microsoft.com/support/forums/).

Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click on **Get Support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](http://azure.microsoft.com/support/faq/).


## Basic steps

These basic steps can help resolve most of the Remote Desktop connection failures:

- Reset Remote Desktop service from the [Azure portal](https://portal.azure.com). Click **Browse all** > **Virtual machines (classic)** > your Windows virtual machine > **Reset Remote Access**.

![Reset Remote Access](./media/virtual-machines-troubleshoot-remote-desktop-connections/Portal-RDP-Reset-Windows.png)

- [Restart the virtual machine](https://msdn.microsoft.com/library/azure/dn763934.aspx).

- [Resize the virtual machine](https://msdn.microsoft.com/library/dn168976.aspx).


## Run the Azure IaaS Diagnostics package on Windows

If you are troubleshooting from a computer running Windows 8, Windows 8.1, Windows Server 2012, or Windows Server 2012 R2, you can try running the [Azure IaaS (Windows) diagnostics package](http://support.microsoft.com/kb/2976864). This package can address many of the common problems with the Remote Desktop.

1.	Click **Microsoft Azure IaaS (Windows) diagnostics package** on the [Support diagnostics page](https://home.diagnostics.support.microsoft.com/SelfHelp?knowledgebaseArticleFilter=2976864). Click **Create** for a new diagnostics session. You can either **Share** this session with a different target computer or **Download** it on your local machine.
2.	**Run** the session, **Accept** the Microsoft license agreement and **Start** the diagnostic tool.
3.	Authenticate your Azure subscription in the pop-up window and follow along with the prompts.
4.	On the **Which of the following issues are you experiencing with your Azure VM?** page, select the **RDP connectivity to an Azure VM (Reboot Required)** issue.

If the Azure IaaS diagnostics package could not execute or was not helpful, then continue to the next section to fix the problem based on the error that you get from the Remote Desktop client.


## Common RDP errors

The following are the most common errors you might encounter when trying to Remote Desktop to your Azure virtual machine:

1. [Remote Desktop connection error: The remote session was disconnected because there are no Remote Desktop License Servers available to provide a license](#rdplicense).

2. [Remote Desktop connection error: Remote Desktop can't find the computer "name"](#rdpname).

3. [Remote Desktop connection error: An authentication error has occurred. The Local Security Authority cannot be contacted](#rdpauth).

4. [Windows Security error: Your credentials did not work](#wincred).

5. [Remote Desktop connection error: This computer can't connect to the remote computer](#rdpconnect).

<a id="rdplicense"></a>
### Remote Desktop connection error: The remote session was disconnected because there are no Remote Desktop License Servers available to provide a license.

Cause: The 120-day licensing grace period for the Remote Desktop Server role has expired and you need to install licenses.

As a workaround, save a local copy of the RDP file from the Azure portal and run this command at a Windows PowerShell command prompt to connect.

		mstsc <File name>.RDP /admin

This will disable licensing for only that connection.

If you don't actually need more than two simultaneous Remote Desktop connections to the virtual machine, you can use Server Manager to remove the Remote Desktop Server role.

Also see the [Azure VM fails with "No Remote Desktop License Servers available"](http://blogs.msdn.com/b/wats/archive/2014/01/21/rdp-to-azure-vm-fails-with-quot-no-remote-desktop-license-servers-available-quot.aspx) blog post.

<a id="rdpname"></a>
### Remote Desktop connection error: Remote Desktop can't find the computer "name".

Cause: The Remote Desktop client on your computer could not resolve the name of the computer in the settings of the RDP file.

Possible solutions:

- If you are on an organization intranet, make sure that your computer has access to the proxy server and can send HTTPS traffic to it.
- If you are using a locally stored RDP file, try using the one generated by the Azure portal. This will ensure you have the correct DNS name for the virtual machine or the cloud service and the endpoint port of the virtual machine. Here is a sample RDP file generated by the Azure portal:

		full address:s:tailspin-azdatatier.cloudapp.net:55919
		prompt for credentials:i:1

The address portion in this RDP file has the fully qualified domain name of the cloud service containing the VM (tailspin-azdatatier.cloudapp.net in this example) and the external TCP port of the endpoint for Remote Desktop traffic (55919).

<a id="rdpauth"></a>
### Remote Desktop connection error: An authentication error has occurred. The Local Security Authority cannot be contacted.

Cause: The target VM could not locate the security authority in the user name portion of your credentials.

When your user name is of the form *SecurityAuthority*\\*UserName* (example: CORP\User1), the *SecurityAuthority* portion is either the virtual machine's computer name (for the local security authority) or an Active Directory domain name.

Possible solutions:

- If your user account is local to the VM, check if the VM name is spelled correctly.
- If the account is on Active Directory domain, check the spelling of the domain name.
- If it is an Active Directory domain account and the domain name is spelled correctly, verify that a domain controller is available in that domain. This can be a common issue in an Azure virtual network that contains domain controllers, in which a domain controller computer is not started. As a workaround, you can use a local administrator account instead of a domain account.

<a id="wincred"></a>
### Windows Security error: Your credentials did not work.

Cause: The target VM could not validate your account name and password.

A Windows-based computer can validate the credentials of either a local account or a domain account.

- For local accounts, use the *ComputerName*\\*UserName* syntax (example: SQL1\Admin4798).
- For domain accounts, use the *DomainName*\\*UserName* syntax (example: CONTOSO\johndoe).

If you have promoted your virtual machine to a domain controller in a new Active Directory forest, the local administrator account that you logged in with, is also converted to an equivalent account with the same password in the new forest and domain. The local administrator account is then deleted. For example, if you logged in with the local administrator account DC1\DCAdmin and promoted the virtual machine as a domain controller in a new forest for the corp.contoso.com domain, the DC1\DCAdmin local account gets deleted and a new domain account (CORP\DCAdmin) is created with the same password.

Make sure that the account name is a name that the virtual machine can verify as a valid account, and that the password is correct.

If you need to change the password of the local administrator account, see [How to reset a password or the Remote Desktop service for Windows virtual machines](virtual-machines-windows-reset-password.md).

<a id="rdpconnect"></a>
### Remote Desktop connection error: This computer can't connect to the remote computer.

Cause: The account used to connect does not have Remote Desktop logon rights.

Every Windows computer has a Remote Desktop Users local group, which contains the accounts and groups that can log on it remotely. Members of the local Administrators group also have access, even though those accounts are not listed in the Remote Desktop Users local group. For domain-joined machines, the local Administrators group also contains the domain administrators for the domain.

Make sure that the account you are using to connect has Remote Desktop logon rights. As a workaround, use a domain or local administrator account to connect over Remote Desktop and then use Computer Management snap-in (**System Tools > Local Users and Groups > Groups > Remote Desktop Users**) to add the desired account to the Remote Desktop Users local group.


## Detailed troubleshooting

If none of these errors occurred and you still could not connect to the VM via Remote Desktop, read [this article](virtual-machines-rdp-detailed-troubleshoot.md) to figure out other causes.


## Additional resources

[Azure IaaS (Windows) diagnostics package](https://home.diagnostics.support.microsoft.com/SelfHelp?knowledgebaseArticleFilter=2976864)

[How to reset a password or the Remote Desktop service for Windows virtual machines](virtual-machines-windows-reset-password.md)

[How to install and configure Azure PowerShell](../install-configure-powershell.md)

[Troubleshoot Secure Shell (SSH) connections to a Linux-based Azure virtual machine](virtual-machines-troubleshoot-ssh-connections.md)

[Troubleshoot access to an application running on an Azure virtual machine](virtual-machines-troubleshoot-access-application.md)
