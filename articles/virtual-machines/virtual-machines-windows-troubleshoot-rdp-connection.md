<properties
	pageTitle="Troubleshoot Remote Desktop connection to an Azure VM | Microsoft Azure"
	description="Troubleshoot Remote Desktop connection errors for a Windows VM. Get quick mitigation steps, help by error message and detailed network troubleshooting."
	keywords="Remote desktop error,remote desktop connection error,cannot connect to VM,remote desktop troubleshooting"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="top-support-issue,azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="support-article"
	ms.date="04/12/2016"
	ms.author="iainfou"/>

# Troubleshoot Remote Desktop connections to an Azure virtual machine running Windows

The Remote Desktop (RDP) connection to your Windows-based Azure virtual machine can fail due to various reasons. The issue can be with the Remote Desktop service on the VM, the network connection, or the Remote Desktop client on your host computer. This article will help you find out the causes and correct them.  

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

This article applies to Azure virtual machines running Windows. For Azure virtual machines running Linux, see [Troubleshoot SSH connection to an Azure VM](virtual-machines-linux-troubleshoot-ssh-connection.md).

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and click on **Get Support**.


<a id="quickfixrdp"></a>
## Fix common Remote Desktop errors

This section lists quick fix steps for common Remote Desktop connection issues.

### Virtual machines created using classic deployment model

These steps may resolve most Remote Desktop connection failures in Azure virtual machines created using the classic deployment model. After each step, try reconnecting to the VM.

- Reset Remote Desktop service from the [Azure portal](https://portal.azure.com) to fix startup issues with the RDP server.<br>
	Click **Browse** > **Virtual machines (classic)** > your Windows virtual machine > **Reset Remote...**.

- Restart the Virtual Machine to address other startup issues.<br>
	Click **Browse** > **Virtual machines (classic)** > your Windows virtual machine > **Restart**.

- Resize the VM to fix any host issues.<br>
	Click **Browse** > **Virtual machines (classic)** > your Windows virtual machine > **Settings** > **Size**. For detailed steps, see [Resize the virtual machine](https://msdn.microsoft.com/library/dn168976.aspx).

- Review your VM’s console log or screenshot to correct boot problems.<br>
	Click **Browse** > **Virtual machines (classic**) > your Windows virtual machine > **Settings** > **Boot diagnostics**.

- Check VM's Resource Health for any platform issues.<br>
	Click **Browse** > **Virtual machines (classic)** > your Windows virtual machine > **Settings** > **Check Health**.

### Virtual machines created using Resource Manager deployment model

These steps may resolve most Remote Desktop connection failures in Azure virtual machines created using the Resource Manager deployment model. After each step, try reconnecting to the VM.

- _Reset Remote Access_ using Powershell<br>
	a. If you haven't already, [install Azure PowerShell and connect to your Azure subscription](../powershell-install-configure.md) using the Azure AD method. Note that you do not need to switch to Resource Manager mode in the new Azure PowerShell versions 1.0.x.

	b. Reset your RDP connection, by using either of the following Azure PowerShell commands. Replace the `myRG`, `myVM`, `myVMAccessExtension` and location with values relevant to your setup.

	```
	Set-AzureRmVMExtension -ResourceGroupName "myRG" -VMName "myVM" -Name "myVMAccessExtension" -ExtensionType "VMAccessAgent" -Publisher "Microsoft.Compute" -typeHandlerVersion "2.0" -Location Westus
	```
	OR<br>

  ```
  Set-AzureRmVMAccessExtension -ResourceGroupName "myRG" -VMName "myVM" -Name "myVMAccess" -Location Westus
  ```

- Restart the Virtual Machine to address other startup issues.<br>
	Click **Browse** > **Virtual machines** > your Windows virtual machine > **Restart**.

- Resize the VM to fix any host issues.<br>
	Click **Browse** > **Virtual machines** > your Windows virtual machine > **Settings** > **Size**.

- Review your VM's console log or screenshot to correct boot problems.<br>
	Click **Browse** > **Virtual machines** > your Windows virtual machine > **Settings** > **Boot diagnostics**.


Proceed to the next section if the above steps did not resolve your Remote Desktop connection failures.

## Troubleshoot specific Remote Desktop connection errors

The following are the most common errors you might see when trying to Remote Desktop to your Azure virtual machine:

1. [Remote Desktop connection error: The remote session was disconnected because there are no Remote Desktop License Servers available to provide a license](#rdplicense).

2. [Remote Desktop connection error: Remote Desktop can't find the computer "name"](#rdpname).

3. [Remote Desktop connection error: An authentication error has occurred. The Local Security Authority cannot be contacted](#rdpauth).

4. [Windows Security error: Your credentials did not work](#wincred).

5. [Remote Desktop connection error: This computer can't connect to the remote computer](#rdpconnect).

<a id="rdplicense"></a>
### Remote Desktop connection error: The remote session was disconnected because there are no Remote Desktop License Servers available to provide a license.

Cause: The 120-day licensing grace period for the Remote Desktop Server role has expired and you need to install licenses.

As a workaround, save a local copy of the RDP file from the portal and run this command at a Windows PowerShell command prompt to connect. This will disable licensing for just that connection.

		mstsc <File name>.RDP /admin

If you don't actually need more than two simultaneous Remote Desktop connections to the VM, you can use Server Manager to remove the Remote Desktop Server role.

Also see the [Azure VM fails with "No Remote Desktop License Servers available"](http://blogs.msdn.com/b/wats/archive/2014/01/21/rdp-to-azure-vm-fails-with-quot-no-remote-desktop-license-servers-available-quot.aspx) blog post.

<a id="rdpname"></a>
### Remote Desktop connection error: Remote Desktop can't find the computer "name".

Cause: The Remote Desktop client on your computer could not resolve the name of the computer in the settings of the RDP file.

Possible solutions:

- If you are on an organization's intranet, make sure that your computer has access to the proxy server and can send HTTPS traffic to it.
- If you are using a locally stored RDP file, try using the one generated by the portal. This will ensure you have the correct DNS name for the virtual machine or the cloud service and the endpoint port of the virtual machine. Here is a sample RDP file generated by the portal:

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

If you have promoted your VM to a domain controller in a new Active Directory forest, the local administrator account that you logged in with, is also converted to an equivalent account with the same password in the new forest and domain. The local account is then deleted. For example, if you logged in with the local account DC1\DCAdmin and promoted the virtual machine as a domain controller in a new forest for the corp.contoso.com domain, the DC1\DCAdmin local account gets deleted and a new domain account (CORP\DCAdmin) is created with the same password.

Make sure that the account name is a name that the virtual machine can verify as a valid account, and that the password is correct.

If you need to change the password of the local administrator account, see [How to reset a password or the Remote Desktop service for Windows virtual machines](virtual-machines-windows-reset-rdp.md).

<a id="rdpconnect"></a>
### Remote Desktop connection error: This computer can't connect to the remote computer.

Cause: The account used to connect does not have Remote Desktop logon rights.

Every Windows computer has a Remote Desktop Users local group, which contains the accounts and groups that can log on it remotely. Members of the local Administrators group also have access, even though those accounts are not listed in the Remote Desktop Users local group. For domain-joined machines, the local Administrators group also contains the domain administrators for the domain.

Make sure that the account you are using to connect has Remote Desktop logon rights. As a workaround, use a domain or local administrator account to connect over Remote Desktop and then use Computer Management snap-in (**System Tools > Local Users and Groups > Groups > Remote Desktop Users**) to add the desired account to the Remote Desktop Users local group.

## Troubleshooting generic Remote Desktop errors

If none of these errors occurred and you still could not connect to the VM via Remote Desktop, read [the detailed troubleshooting guide for Remote Desktop](virtual-machines-windows-detailed-troubleshoot-rdp.md).


## Additional resources

[Azure IaaS (Windows) diagnostics package](https://home.diagnostics.support.microsoft.com/SelfHelp?knowledgebaseArticleFilter=2976864)

[How to reset a password or the Remote Desktop service for Windows virtual machines](virtual-machines-windows-reset-rdp.md)

[How to install and configure Azure PowerShell](../powershell-install-configure.md)

[Troubleshoot Secure Shell (SSH) connections to a Linux-based Azure virtual machine](virtual-machines-linux-troubleshoot-ssh-connection.md)

[Troubleshoot access to an application running on an Azure virtual machine](virtual-machines-linux-troubleshoot-app-connection.md)
