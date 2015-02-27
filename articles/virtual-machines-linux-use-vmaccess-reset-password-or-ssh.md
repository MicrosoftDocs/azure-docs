<properties 
	pageTitle="How to Use VMAccess for Linux Virtual Machines" 
	description="How to use the VMAccess extension for Linux to reset passwords and SSH keys, to resent SSH configurations, and delete Linux users" 
	services="virtual-machines" 
	documentationCenter="" 
	authors="KBDAzure" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/17/2015" 
	ms.author="kathydav"/>

# How to Reset a Password or SSH for Linux Virtual Machines #

If you can't connect to a Linux virtual machine because of a forgotten password, an incorrect Secure Shell (SSH) key, or a problem with the SSH configuration, use the VMAccessForLinux extension to reset the password or SSH key or fix the SSH configuration. 

## Requirements

- Microsoft Azure Linux Agent version 2.0.5 or later. Most Linux images in the Virtual Machine gallery include version 2.0.5. To find out which version is installed, run `waagent -version`. To update the agent, follow the instructions in the [Azure Linux Agent User Guide].
- Azure PowerShell. You'll use commands in the **Set-AzureVMExtension** cmdlet to automatically load and configure the **VMAccessForLinux** extension. For details on setting up Azure PowerShell, see [How to install and configure Azure PowerShell].
- A new password or set of SSH keys, if you want to reset either one. You don't need these if you want to reset the SSH configuration. 

## No installation needed

The VMAccess extension doesn't need to be installed before you can use it. As long as the Linux Agent is installed on the virtual machine, the extension is loaded automatically when you run an Azure PowerShell command that uses the **Set-AzureVMExtension** cmdlet. 

## Use the extension to reset a password, SSH key, or the SSH configuration, or to delete a user

You'll use the **Set-AzureVMExtension** cmdlet to make any of the changes that VMAccess lets you make. In all cases, start by using the cloud service name and virtual machine name to get the virtual machine object and store it in a variable. 

Fill in the cloud service and virtual machine names, and then run the following commands at an administrator-level Azure PowerShell command prompt. Replace everything within the quotes, including the < and > characters.

	$CSName = "<cloud service name>"
	$VMName = "<virtual machine name>"
	$vm = Get-AzureVM -ServiceName $CSName -Name $VMName

If you don't know the cloud service and virtual machine name, run **Get-AzureVM** to display that information for all the VMs in your current subscription.


> [AZURE.NOTE] The command lines that begin with $ are setting PowerShell variables that later get used in PowerShell commands.

If you created the virtual machine with the Azure Management Portal, run the following additional command:

	$vm.GetInstance().ProvisionGuestAgent = $true

This command will prevent the “Provision Guest Agent must be enabled on the VM object before setting IaaS VM Access Extension” error when running the Set-AzureVMExtension command in the following sections. 

Then, you can do the following tasks:

+ [Reset the password](#password)
+ [Reset an SSH key](#SSHkey)
+ [Reset the password and the SSH key](#both)
+ [Reset the SSH configuration](#config)
+ [Delete a user](#delete)

### <a name="password"></a>Reset the password

Fill in the current Linux user name and the new password, and then run these commands.

	$UserName = "<current Linux account name>"
	$Password = "<new password>"
	$PrivateConfig = '{"username":"' + $UserName + '", "password": "' +  $Password + '"}' 
	$ExtensionName = "VMAccessForLinux"
	$Publisher = "Microsoft.OSTCExtensions"
	$Version =  "1.*"
	Set-AzureVMExtension -ExtensionName $ExtensionName -VM $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

> [AZURE.NOTE] If you want to reset the password or SSH key for an existing user account, be sure to type the exact user name. If you type a different name, the VMAccess extension creates a new user account and assigns the password to that account.


### <a name="SSHKey"></a>Reset an SSH key

Fill in the current Linux user name and the path to the certificate containing the SSH keys, and then run these commands.

	$UserName = "<current Linux user name>"
	$Cert = Get-Content "<certificate path>"
	$PrivateConfig = '{"username":"' + $UserName + '", "ssh_key":"' + $cert + '"}'
	$ExtensionName = "VMAccessForLinux"
	$Publisher = "Microsoft.OSTCExtensions"
	$Version =  "1.*"
	Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

### <a name="both"></a>Reset the password and the SSH key

Fill in the current Linux user name, the new password, and the path to the certificate containing the SSH keys, and then run these commands.

	$UserName = "<current Linux user name>"
	$Password = "<new password>"
	$Cert = Get-Content "<certificate path>"
	$PrivateConfig = '{"username":"' + $UserName + '", "password": "' +  $Password + '", "ssh_key":"' + $cert + '"}' 
	$ExtensionName = "VMAccessForLinux"
	$Publisher = "Microsoft.OSTCExtensions"
	$Version =  "1.*"
	Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

### <a name="config"></a>Reset the SSH configuration

Errors in SSH configuration can prevent you from accessing the virtual machine. You can fix this by resetting the SSH configuration to its default state. This removes all the new access parameters in the configuration, such as user name, password, and the SSH key, but this doesn't change the password or SSH keys of the user account. The extension restarts the SSH server, opens the SSH port on your virtual machine, and resets the SSH configuration to default. 

Run these commands.

	$PrivateConfig = '{"reset_ssh": "True"}' 
	$ExtensionName = "VMAccessForLinux"
	$Publisher = "Microsoft.OSTCExtensions"
	$Version = "1.*"
	Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

> [AZURE.NOTE] The SSH configuration file is located at /etc/ssh/sshd_config.

### <a name="delete"></a> Delete a user

Fill in the Linux user name to delete, and then run these commands.

	$UserName = "<Linux user name to delete>"
	$PrivateConfig = "{"remove_user": "' + $UserName + '"}"
	$ExtensionName = "VMAccessForLinux"
	$Publisher = "Microsoft.OSTCExtensions"
	$Version = "1.*"
	Set-AzureVMExtension -ExtensionName $ExtensionName -VM $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

## Additional resources

[Azure VM Extensions and Features] []

[Connect to an Azure virtual machine with RDP or SSH] []


<!--Link references-->
[Azure Linux Agent User Guide]: ../virtual-machines-linux-agent-user-guide
[How to install and configure Azure PowerShell]: ../install-configure-powershell
[Azure VM Extensions and Features]: http://msdn.microsoft.com/library/azure/dn606311.aspx
[Connect to an Azure virtual machine with RDP or SSH]: http://msdn.microsoft.com/library/azure/dn535788.aspx





