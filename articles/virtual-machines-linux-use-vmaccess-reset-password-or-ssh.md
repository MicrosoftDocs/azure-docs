<properties title="" pageTitle="How to Use VMAccess for Linux Virtual Machines" description="How to use the VMAccess extension for Linux to reset passwords, SSH keys, and SSH configurations" metaKeywords="" services="virtual-machines" solutions="" documentationCenter="" authors="KBDAzure" manager="timlt" videoId="" scriptId="" editor=""/>

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="10/30/2014" ms.author="kathydav" />

#How to Reset a Password or SSH for Linux Virtual Machines#

If you can't connect to a Linux VM because of a forgotten password, SSH key, or a problem with the SSH configuration, use the VMAccessforLinux extension to reset the password, SSH key, or the SSH configuration. 


##Requirements

- Microsoft Azure Linux Agent version 2.0.5 or later. Most Linux images in the Virtual Machine gallery include version 2.0.5. To find out which version is installed, run `waagent -version`. To update the agent, follow the instructions in the [Azure Linux Agent User Guide].

- The Azure PowerShell module. The module includes the **Set-AzureVMExtension**  cmdlet, which you'll run commands with to use the **VMAccessForLinux** extension. For details on setting up the module, see [How to install and configure Azure PowerShell].

- A new password or SSH keys, if you want to reset either one. You don't need those if you want to fix the SSH configuration. 

##No installation needed

VMAccess doesn't need to be installed before you can use it. As long as the Linux Agent and the Azure module are installed, the extension is loaded automatically when you run a command that calls the **Set-AzureVMExtension** cmdlet. 

##Use the extension to reset a password, SSH key or configuration, or add a user

You'll use the **Set-AzureVMExtension** cmdlet to make any of the changes that VMAccess lets you make. In all cases, start by using the cloud service name and virtual machine name to get the virtual machine object and store it in a variable.   

Open Azure PowerShell and type the following at the command prompt. Be sure to replace the MyServiceName and MyVMName placeholders with the actual names:

	PS C:\> $vm = Get-AzureVM -ServiceName 'MyServiceName' -Name 'MyVMName'

Then, you can do the following tasks:

+ [Reset the password](#password)
+ [Reset an SSH key](#SSHkey)
+ [Reset the password and the SSH key](#both)
+ [Reset the SSH configuration](#config)

### <a name="password"></a>Reset the password
Type the user name and password and store them in variables, then create a single variable to store the values so the next commands can use them.

	PS C:\> $UserName = "CurrentName"
	PS C:\> $Password = "NewPassword"
	PS C:\> $PrivateConfig = '{"username":"' + $UserName + '", "password": "' +  $Password + '"}' 

Store the name, publisher and version number in variables: 

	PS C:\> ExtensionName = 'VMAccessForLinux'
	PS C:\> $Publisher = 'Microsoft.OSTCExtensions'
	PS C:\> $Version =  '1.0'

With all the required values stored in variables, run the following command:

	PS C:\> Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

> [AZURE.NOTE] If you want to reset the password or SSH key for an existing user account, be sure to type the exact user name. If you type a different name, the VMAccess extension creates a new user account and assigns the password to that account.

### <a name="SSHkey"></a>Reset an SSH key

Type the user name and the path of your new public SSH key and store them in variables:

	PS C:\> $UserName = "CurrentName"
	PS C:\> $cert = Get-Content "CertPath"
	PS C:\> $PrivateConfig = '{"username":"' + $UserName + '", "ssh_key":"' + $cert + '"}'

Run the following commands:

	PS C:\> $ExtensionName = 'VMAccessForLinux'
	PS C:\> $Publisher = 'Microsoft.OSTCExtensions'
	PS C:\> $Version =  '1.0'
	PS C:\> Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM


### <a name="both"></a>Reset the password and the SSH key

For the current user, type a new password and the path of the new certificate with the SSH public key, and store them in variables: 

	PS C:\> $UserName = "CurrentName"	
	PS C:\> $Password = "NewPassword"
	PS C:\> $cert = Get-Content "CertPath"
	PS C:\> $PrivateConfig = '{"username":"' + $UserName + '", "password": "' +  $Password + '", "ssh_key":"' + $cert + '"}' 

Run the following commands:

	PS C:\> $ExtensionName = 'VMAccessForLinux'
	PS C:\> $Publisher = 'Microsoft.OSTCExtensions'
	PS C:\> $Version =  '1.0'
	PS C:\> Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

###  <a name="config"></a>Reset the SSH configuration

Errors in SSH configuration can prevent you from accessing the VM. You can fix this by resetting the configuration to its default. This removes all the new access parameters in the configuration (user name, password, or SSH key). This doesn't change the password or SSH keys of the user account. The extension restarts the SSH server, opens the SSH port on your VM, and resets the SSH configuration to default.  

Set the flag that indicates you want to reset the configuration and store it in a variable: 
	
	PS C:\> $PrivateConfig = '{"reset_ssh": "True"}' 

Run the following commands:

	PS C:\> $ExtensionName = 'VMAccessForLinux'
	PS C:\> $Publisher = 'Microsoft.OSTCExtensions'
	PS C:\> $Version =  '1.0'
	PS C:\> Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

> [AZURE.NOTE] The SSH configuration file is located at /etc/ssh/sshd_config.

## Troubleshooting

When you use the **Set-AzureVMExtension** cmdlet, you might get this error: “Provision Guest Agent must be enabled on the VM object before setting IaaS VM Access Extension”. 

This can happen if you used the Management Portal to create the Linux VM, because the value of the guest agent property  might not be set to “True”. To fix this, run the following commands:

	PS C:\> $vm = Get-AzureVM -ServiceName 'MyServiceName' -Name 'MyVMName'

	PS C:\> $vm.GetInstance().ProvisionGuestAgent = $true

#Additional resources
[Azure VM Extensions and Features] []

[Connect to an Azure virtual machine with RDP or SSH] []


<!--Link references-->
[Azure Linux Agent User Guide]: ../virtual-machines-linux-agent-user-guide
[How to install and configure Azure PowerShell]: ../install-configure-powershell
[Azure VM Extensions and Features]: http://msdn.microsoft.com/en-us/library/azure/dn606311.aspx
[Connect to an Azure virtual machine with RDP or SSH]: http://msdn.microsoft.com/en-us/library/azure/dn535788.aspx

