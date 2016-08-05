<properties
	pageTitle="Troubleshoot Remote Desktop connection to an Azure VM | Microsoft Azure"
	description="Troubleshoot Remote Desktop connection errors for a Windows VM. Get quick mitigation steps, help by error message and detailed network troubleshooting."
	keywords="Remote desktop error,remote desktop connection error,cannot connect to VM,remote desktop troubleshooting, unable to connect to azure vm, cannot rdp to azure vm"
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
	ms.date="06/14/2016"
	ms.author="iainfou"/>

# Troubleshoot Remote Desktop connections to an Azure virtual machine running Windows

The Remote Desktop Protocol (RDP) connection to your Windows-based Azure virtual machine (VM) can fail for various reasons. The issue can be with the Remote Desktop service on the VM, the network connection, or the Remote Desktop client on your host computer. This article guides you through some of the most common methods to resolve RDP connection issues. You can also read [more detailed RDP troubleshooting concepts and steps](virtual-machines-windows-detailed-troubleshoot-rdp.md) if your issue isn't listed here or you still can't connect to your VM via RDP.

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.

<a id="quickfixrdp"></a>

## Troubleshoot VMs created by using the Resource Manager deployment model

After each troubleshooting step, try reconnecting to the VM.

> [AZURE.TIP] If the 'Connect' button in the portal is greyed out and you are not connected to Azure via an [Express Route](../expressroute/expressroute-introduction.md) or [Site-to-Site VPN](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md) connection, you need to create and assign your VM a public IP address before you can use RDP. You can read more about [public IP addresses in Azure](../virtual-network/virtual-network-ip-addresses-overview-arm.md).

- Reset remote access by using PowerShell.
	- If you haven't already, [install and configure the latest Azure PowerShell](../powershell-install-configure.md).

	- Reset your RDP connection by using either of the following PowerShell commands. Replace the `myRG`, `myVM`, `myVMAccessExtension`, and location with values that are relevant to your setup.

	```
	Set-AzureRmVMExtension -ResourceGroupName "myRG" -VMName "myVM" `
		-Name "myVMAccessExtension" -ExtensionType "VMAccessAgent" `
		-Publisher "Microsoft.Compute" -typeHandlerVersion "2.0" `
		-Location Westus
	```
	OR

  	```
	Set-AzureRmVMAccessExtension -ResourceGroupName "myRG" `
		-VMName "myVM" -Name "myVMAccess" -Location Westus
	```

	> [AZURE.NOTE] In the preceding examples, `myVMAccessExtension` or `MyVMAccess` is a name that you specify for the new extension that will be installed as part of the process. Often this is simply set to the name of the VM. If you have previously worked with the VMAccessAgent, you can get the name of the existing extension by using `Get-AzureRmVM -ResourceGroupName "myRG" -Name "myVM"` to check the properties of the VM. Then look under the 'Extensions' section of the output. Since only one VMAccessAgent can exist on a VM, you also need to add the `-ForceReRun` parameter when using `Set-AzureRmVMExtension` to force the agent to be re-registered.

- Restart your VM to address other startup issues. Select **Browse** > **Virtual machines** > *your VM* > **Restart**.

- [Redeploy VM to a new Azure node](virtual-machines-windows-redeploy-to-new-node.md).

	Note that after this operation finishes, ephemeral disk data will be lost and dynamic IP addresses that are associated with the virtual machine will be updated.
	
- Verify your [Network Security Group rules](../virtual-network/virtual-networks-nsg.md) allow RDP traffic (TCP port 3389).

- Review your VM's console log or screenshot to correct boot problems. Select **Browse** > **Virtual machines** > *your Windows virtual machine* > **Support + Troubleshooting** > **Boot diagnostics**.

- [Reset your VM's password](virtual-machines-windows-reset-rdp.md).

- If you are still encountering RDP issues, you can [open a support request](https://azure.microsoft.com/support/options/) or read [more detailed RDP troubleshooting concepts and steps](virtual-machines-windows-detailed-troubleshoot-rdp.md).


## Troubleshoot VMs created by using the Classic deployment model

After each troubleshooting step, try reconnecting to the VM.

- Reset the Remote Desktop service from the [Azure portal](https://portal.azure.com). Select **Browse** > **Virtual machines (classic)** > *your VM* > **Reset Remote...**.

- Restart your VM to address other startup issues. Select **Browse** > **Virtual machines (classic)** > *your VM* > **Restart**.

- [Redeploy VM to a new Azure node](virtual-machines-windows-redeploy-to-new-node.md).

	Note that after this operation finishes, ephemeral disk data will be lost and dynamic IP addresses that are associated with the virtual machine will be updated.
	
- Verify your [Cloud Services endpoint allow RDP traffic](../cloud-services/cloud-services-role-enable-remote-desktop.md).

- Review your VM’s console log or screenshot to correct boot problems. Select **Browse** > **Virtual machines (classic**) > *your VM* > **Settings** > **Boot diagnostics**.

- Check your VM's Resource Health for any platform issues. Select **Browse** > **Virtual machines (classic)** > *your VM* > **Settings** > **Check Health**.

- [Reset your VM's password](virtual-machines-windows-reset-rdp.md).

- If you are still encountering RDP issues, you can [open a support request](https://azure.microsoft.com/support/options/) or read [more detailed RDP troubleshooting concepts and steps](virtual-machines-windows-detailed-troubleshoot-rdp.md).


## Troubleshoot specific Remote Desktop connection errors

You may receive a specific error when trying to connect to your VM via RDP. The following are the most common error messages you'll see:

- [The remote session was disconnected because there are no Remote Desktop License Servers available to provide a license](#rdplicense).

- [Remote Desktop can't find the computer "name"](#rdpname).

- [An authentication error has occurred. The Local Security Authority cannot be contacted](#rdpauth).

- [Windows Security error: Your credentials did not work](#wincred).

- [This computer can't connect to the remote computer](#rdpconnect).

<a id="rdplicense"></a>
### The remote session was disconnected because there are no Remote Desktop License Servers available to provide a license.

Cause: The 120-day licensing grace period for the Remote Desktop Server role has expired and you need to install licenses.

As a workaround, save a local copy of the RDP file from the portal and run this command at a PowerShell command prompt to connect. This will disable licensing for just that connection:

		mstsc <File name>.RDP /admin

If you don't actually need more than two simultaneous Remote Desktop connections to the VM, you can use Server Manager to remove the Remote Desktop Server role.

For more information, see the blog post [Azure VM fails with "No Remote Desktop License Servers available"](http://blogs.msdn.com/b/wats/archive/2014/01/21/rdp-to-azure-vm-fails-with-quot-no-remote-desktop-license-servers-available-quot.aspx).

<a id="rdpname"></a>
### Remote Desktop can't find the computer "name".

Cause: The Remote Desktop client on your computer can't resolve the name of the computer in the settings of the RDP file.

Possible solutions:

- If you're on an organization's intranet, make sure that your computer has access to the proxy server and can send HTTPS traffic to it.

- If you're using a locally stored RDP file, try using the one that's generated by the portal. This will ensure that you have the correct DNS name for the virtual machine, or the cloud service and the endpoint port of the VM. Here is a sample RDP file generated by the portal:

		full address:s:tailspin-azdatatier.cloudapp.net:55919
		prompt for credentials:i:1

The address portion of this RDP file has:
- The fully qualified domain name of the cloud service that contains the VM ("tailspin-azdatatier.cloudapp.net" in this example).

- The external TCP port of the endpoint for Remote Desktop traffic (55919).

<a id="rdpauth"></a>
### An authentication error has occurred. The Local Security Authority cannot be contacted.

Cause: The target VM can't locate the security authority in the user name portion of your credentials.

When your user name is in the form *SecurityAuthority*\\*UserName* (example: CORP\User1), the *SecurityAuthority* portion is either the VM's computer name (for the local security authority) or an Active Directory domain name.

Possible solutions:

- If the account is local to the VM, make sure that the VM name is spelled correctly.

- If the account is on an Active Directory domain, check the spelling of the domain name.

- If it is an Active Directory domain account and the domain name is spelled correctly, verify that a domain controller is available in that domain. It's a common issue in Azure virtual networks that contain domain controllers that a domain controller is unavailable because it hasn't been started As a workaround, you can use a local administrator account instead of a domain account.

<a id="wincred"></a>
### Windows Security error: Your credentials did not work.

Cause: The target VM can't validate your account name and password.

A Windows-based computer can validate the credentials of either a local account or a domain account.

- For local accounts, use the *ComputerName*\\*UserName* syntax (example: SQL1\Admin4798).
- For domain accounts, use the *DomainName*\\*UserName* syntax (example: CONTOSO\peterodman).

If you have promoted your VM to a domain controller in a new Active Directory forest, the local administrator account that you signed in with is converted to an equivalent account with the same password in the new forest and domain. The local account is then deleted.

For example, if you signed in with the local account DC1\DCAdmin, and then promoted the virtual machine as a domain controller in a new forest for the corp.contoso.com domain, the DC1\DCAdmin local account gets deleted and a new domain account (CORP\DCAdmin) is created with the same password.

Make sure that the account name is a name that the virtual machine can verify as a valid account, and that the password is correct.

If you need to change the password of the local administrator account, see [How to reset a password or the Remote Desktop service for Windows virtual machines](virtual-machines-windows-reset-rdp.md).

<a id="rdpconnect"></a>
### This computer can't connect to the remote computer.

Cause: The account that's used to connect does not have Remote Desktop sign-in rights.

Every Windows computer has a Remote Desktop users local group, which contains the accounts and groups that can sign into it remotely. Members of the local administrators group also have access, even though those accounts are not listed in the Remote Desktop users local group. For domain-joined machines, the local administrators group also contains the domain administrators for the domain.

Make sure that the account you're using to connect with has Remote Desktop sign-in rights. As a workaround, use a domain or local administrator account to connect over Remote Desktop. Then use the Microsoft Management Console snap-in (**System Tools > Local Users and Groups > Groups > Remote Desktop Users**) to add the desired account to the Remote Desktop users local group.

## Troubleshoot generic Remote Desktop errors

If none of these errors occurred and you still can't connect to the VM via Remote Desktop, read the detailed [troubleshooting guide for Remote Desktop](virtual-machines-windows-detailed-troubleshoot-rdp.md).


## Additional resources

[Azure IaaS (Windows) diagnostics package](https://home.diagnostics.support.microsoft.com/SelfHelp?knowledgebaseArticleFilter=2976864)

[How to reset a password or the Remote Desktop service for Windows virtual machines](virtual-machines-windows-reset-rdp.md)

[How to install and configure Azure PowerShell](../powershell-install-configure.md)

[Troubleshoot Secure Shell connections to a Linux-based Azure virtual machine](virtual-machines-linux-troubleshoot-ssh-connection.md)

[Troubleshoot access to an application running on an Azure virtual machine](virtual-machines-linux-troubleshoot-app-connection.md)
