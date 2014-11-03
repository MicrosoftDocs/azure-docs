<properties title="How to Use VMAccess for Linux Virtual Machines" pageTitle="How to Use VMAccess for Linux Virtual Machines" description="How to use the VMAccess extension for Linux to reset passwords, SSH keys, and SSH configurations" metaKeywords="" services="" solutions="" documentationCenter="" authors="ningk, kathydav" manager="timlt" videoId="" scriptId="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="10/30/2014" ms.author="kathydav" />

#How to Use VMAccess for Linux Virtual Machines#

The VMAccess extension for Linux resets the password, SSH key, or the SSH configurations, so you can regain access to a Linux virtual machine. 


##Requirements

- Microsoft Azure Linux Agent version 2.0.5 or later. Most Linux images in the Virtual Machine gallery include version 2.0.5. To find out which version is installed, run `waagent -version`. To update the agent, follow the instructions in the [Azure Linux Agent User Guide].

- The Azure PowerShell module. The module includes the **Set-AzureVMExtension**  cmdlet, which you'll run commands with to use the **VMAccessForLinux** extension. For details on setting up the module, see [How to install and configure Azure PowerShell].

- A new password or SSH keys you want to use to with the VM.

##No installation needed

VMAccess doesn't need to be installed before you can use it. As long as the Linux Agent and the Azure module are installed, the extension is loaded automatically when you run a command that calls the **Set-AzureVMExtension** cmdlet. 

##Use the extension to reset a password, SSH key or configuration, or add a user

You'll use the **Set-AzureVMExtension** cmdlet to make any of the changes that VMAccess lets you make. In all cases, start by using the cloud service name and virtual machine name to get the virtual machine object and store it in a variable.   

Open Azure PowerShell and type the following at the command prompt. Be sure to replace the MyServiceName and MyVMName placeholders with the actual names:

	C:\PS &gt; $vm = Get-AzureVM -ServiceName 'MyServiceName' -Name 'MyVMName'

Then, you can do the following tasks:

+ [Reset the password]
+ [Reset an SSH key]
+ [Reset the password and the SSH key]
+ [Reset the SSH configuration]

### Reset the password
Type the user name and password and store them in variables, then create a single variable to store the values so the next commands can use them.

	C:\PS>$UserName = "CurrentName"
	C:\PS>$Password = "NewPassword"
	C:\PS>$PrivateConfig = '{"username":"' + $UserName + '", "password": "' +  $Password + '"}' 

Store the name, publisher and version number in variables: 

	C:\PS>ExtensionName = 'VMAccessForLinux'
	C:\PS>$Publisher = 'Microsoft.OSTCExtensions'
	C:\PS>$Version =  '1.0'

With all the required values stored in variables, run the following command:

	C:\PS>Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

> [WACOM.NOTE] If you want to reset the password or SSH key for an existing user account, be sure to type the exact user name. If you type a different name, the VMAccess extension creates a new user account and assigns the password to that account.

### Reset an SSH key

Type the user name and the path of your new public SSH key and store them in variables:

	C:\PS>$UserName = "CurrentName"
	C:\PS>$cert = Get-Content "CertPath"
	C:\PS>$PrivateConfig = '{"username":"' + $UserName + '", "ssh_key":"' + $cert + '"}'

Run the following commands:

	C:\PS>$ExtensionName = 'VMAccessForLinux'
	C:\PS>$Publisher = 'Microsoft.OSTCExtensions'
	C:\PS>$Version =  '1.0'
	C:\PS>Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM


### Reset the password and the SSH key

For the current user, type a new password and the path of the new certificate with the SSH public key, and store them in variables: 

	C:\PS>$UserName = "CurrentName"	
	C:\PS>$Password = "NewPassword"
	C:\PS>$cert = Get-Content "CertPath"
	C:\PS>$PrivateConfig = '{"username":"' + $UserName + '", "password": "' +  $Password + '", "ssh_key":"' + $cert + '"}' 

Run the following commands:

	C:\PS>$ExtensionName = 'VMAccessForLinux'
	C:\PS>$Publisher = 'Microsoft.OSTCExtensions'
	C:\PS>$Version =  '1.0'
	C:\PS>Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

### Reset the SSH configuration

Errors in SSH configuration can prevent you from accessing the VM. You can fix this by resetting the configuration to its default. This removes all the new access parameters in the configuration (user name, password, or SSH key). This doesn't change the password or SSH keys of the user account. The extension restarts the SSH server, opens the SSH port on your VM, and resets the SSH configuration to default.  

Set the flag that indicates you want to reset the configuration and store it in a variable: 
	
	C:\PS>$PrivateConfig = '{"reset_ssh": "True"}' 

Run the following commands:

	C:\PS>$ExtensionName = 'VMAccessForLinux'
	C:\PS>$Publisher = 'Microsoft.OSTCExtensions'
	C:\PS>$Version =  '1.0'
	C:\PS>Set-AzureVMExtension -ExtensionName $ExtensionName -VM  $vm -Publisher $Publisher -Version $Version -PrivateConfiguration $PrivateConfig | Update-AzureVM

> [WACOM.NOTE] The SSH configuration file is located at /etc/ssh/sshd_config.

## Troubleshooting

When you use the **Set-AzureVMExtension** cmdlet, you might get this error: “Provision Guest Agent must be enabled on the VM object before setting IaaS VM Access Extension”. 

This can happen if you used the Management Portal to create the Linux VM, because the value of the guest agent property  might not be set to “True”. To fix this, run the following commands:

	C:\PS>$vm = Get-AzureVM -ServiceName ‘MyServiceName’ -Name ‘MyVMName’`

	C:\PS>$vm.GetInstance().ProvisionGuestAgent = $true`

#Additional resources
[Azure VM Extensions and Features] []


<!--Link references-->
[Azure Linux Agent User Guide]: ../virtual-machines-linux-agent-user-guide
[How to install and configure Azure PowerShell]: ../install-configure-powershell
[Azure VM Extensions and Features]: http://msdn.microsoft.com/en-us/library/azure/dn606311.aspx


