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
	ms.date="03/24/2015" 
	ms.author="kathydav"/>

# How to Reset a Password or SSH for Linux Virtual Machines #

If you can't connect to a Linux virtual machine because of a forgotten password, an incorrect Secure Shell (SSH) key, or a problem with the SSH configuration, use the VMAccessForLinux extension to reset the password or SSH key or fix the SSH configuration. 

## Requirements

- Microsoft Azure Linux Agent version 2.0.5 or later. Most Linux images in the Virtual Machine gallery include version 2.0.5. To find out which version is installed, run **waagent -version**. To update the agent, follow the instructions in the [Azure Linux Agent User Guide].
- Azure Cross-Platform Command-Line Interface (CLI). For details on setting up the Cross-Platform CLI, see [Install and Configure the Azure Cross-Platform Command-Line Interface](xplat-cli.md).
- Azure PowerShell. You'll use commands in the Set-AzureVMExtension cmdlet to automatically load and configure the VMAccessForLinux extension. For details on setting up Azure PowerShell, see [How to install and configure Azure PowerShell].
- A new password or set of SSH keys, if you want to reset either one. You don't need these if you want to reset the SSH configuration. 

### No installation needed

The VMAccess extension doesn't need to be installed before you can use it. As long as the Linux Agent is installed on the virtual machine, the extension is loaded automatically when you run an Azure PowerShell command that uses the **Set-AzureVMExtension** cmdlet. 

## Use the Cross-Platform CLI

With the Cross-Platform CLI, you will be able to use the **azure** command from your command-line interface (Bash, Terminal, Command prompt) to access commands. Run **azure vm extension set –help** for detailed extension usage.

With the Cross-Platform CLI, you can do the following tasks:

+ [Reset the password](#pwresetcli)
+ [Reset the SSH key](#sshkeyresetcli)
+ [Reset the password and the SSH key](#resetbothcli)
+ [Create a new sudo user account](#createnewsudocli)
+ [Reset the SSH configuration](#sshconfigresetcli)
+ [Delete a user](#deletecli)
+ [Display the status of the VMAccess extension](#statuscli)

### <a name="pwresetcli"></a>Reset the password 

Step 1: Create a file named PrivateConf.json with these contents, substituting for the placeholder values.

	{
	"username":"currentusername",
	"password":"newpassword",
	"expiration":"2016-01-01",
	}

Step 2: Run this command, substituting the name of your virtual machine for "vmname".

	azure vm extension set vmname VMAccessForLinux Microsoft.OSTCExtensions 1.* –-private-config-path PrivateConf.json

### <a name="sshkeyresetcli"></a>Reset the SSH key

Step 1: Create a file named PrivateConf.json with these contents, substituting for the placeholder values.

	{
	"username":"currentusername",
	"ssh_key":"contentofsshkey",	
	}

Step 2: Run this command, substituting the name of your virtual machine for "vmname".

	azure vm extension set vmname VMAccessForLinux Microsoft.OSTCExtensions 1.* --private-config-path PrivateConf.json

### <a name="resetbothcli"></a>Reset the password and the SSH key

Step 1: Create a file named PrivateConf.json with these contents, substituting for the placeholder values.

	{
	"username":"currentusername",
	"ssh_key":"contentofsshkey",
	"password":"newpassword",
	}

Step 2: Run this command, substituting the name of your virtual machine for "vmname".

	azure vm extension set vmname VMAccessForLinux Microsoft.OSTCExtensions 1.* --private-config-path PrivateConf.json

### <a name="createnewsudocli"></a>Create a new sudo user account

If you forget your user name, you can use VMAccess to create a new one with the sudo authority. In this case, the existing user name and password will not be modified.

To create a new sudo user with password access, use the script in [Reset the password](#pwresetcli) and specify the new user name.

To create a new sudo user with SSH key access, use the script in [Reset the SSH key](#sshkeyresetcli) and specify the new user name.

You can also use [Reset the password and the SSH key](#resetbothcli) to create a new user with both password and SSH key access.

### <a name="sshconfigresetcli"></a>Reset the SSH configuration

If the SSH configuration is in an undesired state, you might also lose access to the VM. You can use the VMAccess extension to reset the configuration to its default state. To do so, you just need to set the “reset_ssh” key to “True”. The extension will restart the SSH server, open the SSH port on your VM, and reset the SSH configuration to default values. The user account (name, password or SSH keys) will not be changed. 

> [AZURE.NOTE] The SSH configuration file that gets reset is located at /etc/ssh/sshd_config.

Step 1: Create a file named PrivateConf.json with this content.

	{
	"reset_ssh":"True",
	}

Step 2: Run this command, substituting the name of your virtual machine for "vmname". 

	azure vm extension set vmname VMAccessForLinux Microsoft.OSTCExtensions 1.* --private-config-path PrivateConf.json

### <a name="deletecli"></a>Delete a user

If you want to delete a user account without logging into to the VM directly, you can use this script.

Step 1: Create a file named PrivateConf.json with this content, substituting for the placeholder value.

	{
	"remove_user":"usernametoremove",
	}

Step 2: Run this command, substituting the name of your virtual machine for "vmname".

	azure vm extension set vmname VMAccessForLinux Microsoft.OSTCExtensions 1.* --private-config-path PrivateConf.json

### <a name="statuscli"></a>Display the status of the VMAccess extension

To display the status of the VMAccess extension, run this command.

	azure vm extension get


## Use Azure PowerShell

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
+ [Display the status of the VMAccess extension](#status)

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


### <a name="status"></a>Display the status of the VMAccess extension

To display the status of the VMAccess extension, run this command.

	$vm.GuestAgentStatus


## Additional resources

[Azure VM Extensions and Features] []

[Connect to an Azure virtual machine with RDP or SSH] []


<!--Link references-->
[Azure Linux Agent User Guide]: virtual-machines-linux-agent-user-guide.md
[How to install and configure Azure PowerShell]: install-configure-powershell.md
[Azure VM Extensions and Features]: http://msdn.microsoft.com/library/azure/dn606311.aspx
[Connect to an Azure virtual machine with RDP or SSH]: http://msdn.microsoft.com/library/azure/dn535788.aspx





