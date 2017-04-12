---
title: Reset Linux VM password and SSH key from the CLI | Microsoft Docs
description: How to use the VMAccess extension from the Azure Command-Line Interface (CLI) to reset a Linux VM password or SSH key, fix the SSH configuration, and check disk consistency
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: d975eb70-5ff1-40d1-a634-8dd2646dcd17
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 11/16/2016
ms.author: cynthn

---
# How to reset a Linux VM password or SSH key, fix the SSH configuration, and check disk consistency using the VMAccess extension
If you can't connect to a Linux virtual machine on Azure because of a forgotten password, an incorrect Secure Shell (SSH) key, or a problem with the SSH configuration, use the VMAccessForLinux extension with the Azure CLI to reset the password or SSH key, fix the SSH configuration, and check disk consistency. 

> [!IMPORTANT] 
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. Learn how to [perform these steps using the Resource Manager model](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess).

With the Azure CLI, you use the **azure vm extension set** command from your command-line interface (Bash, Terminal, Command prompt) to access commands. Run **azure help vm extension set** for detailed extension usage.

With the Azure CLI, you can do the following tasks:

* [Reset the password](#pwresetcli)
* [Reset the SSH key](#sshkeyresetcli)
* [Reset the password and the SSH key](#resetbothcli)
* [Create a new sudo user account](#createnewsudocli)
* [Reset the SSH configuration](#sshconfigresetcli)
* [Delete a user](#deletecli)
* [Display the status of the VMAccess extension](#statuscli)
* [Check consistency of added disks](#checkdisk)
* [Repair added disks on your Linux VM](#repairdisk)

## Prerequisites
You will need to do the following:

* You will need to [install the Azure CLI](../../../cli-install-nodejs.md) and [connect to your subscription](../../../xplat-cli-connect.md) to use Azure resources associated with your account.
* Set the correct mode for the classic deployment model by typing the following at the command prompt:
	``` 
        azure config mode asm
	```
* Have a new password or set of SSH keys, if you want to reset either one. You don't need these if you want to reset the SSH configuration.

## <a name="pwresetcli"></a>Reset the password
1. Create a file on your local computer named PrivateConf.json with these lines. Replace **myUserName** and **myP@ssW0rd** with your own user name and password and set your own date for expiration.

	```   
        {
        "username":"myUserName",
        "password":"myP@ssW0rd",
        "expiration":"2020-01-01"
        }
	```
		
2. Run this command, substituting the name of your virtual machine for **myVM**.

	```   
        azure vm extension set myVM VMAccessForLinux Microsoft.OSTCExtensions 1.* –-private-config-path PrivateConf.json
	```

## <a name="sshkeyresetcli"></a>Reset the SSH key
1. Create a file named PrivateConf.json with these contents. Replace the **myUserName** and **mySSHKey** values with your own information.

	```   
        {
        "username":"myUserName",
        "ssh_key":"mySSHKey"
        }
	```
2. Run this command, substituting the name of your virtual machine for **myVM**.
   
        azure vm extension set myVM VMAccessForLinux Microsoft.OSTCExtensions 1.* --private-config-path PrivateConf.json

## <a name="resetbothcli"></a>Reset both the password and the SSH key
1. Create a file named PrivateConf.json with these contents. Replace the **myUserName**, **mySSHKey** and **myP@ssW0rd** values with your own information.

	``` 
        {
        "username":"myUserName",
        "ssh_key":"mySSHKey",
        "password":"myP@ssW0rd"
        }
	```

2. Run this command, substituting the name of your virtual machine for **myVM**.

	```   
        azure vm extension set MyVM VMAccessForLinux Microsoft.OSTCExtensions 1.* --private-config-path PrivateConf.json
	```

## <a name="createnewsudocli"></a>Create a new sudo user account

If you forget your user name, you can use VMAccess to create a new one with the sudo authority. In this case, the existing user name and password will not be modified.

To create a new sudo user with password access, use the script in [Reset the password](#pwresetcli) and specify the new user name.

To create a new sudo user with SSH key access, use the script in [Reset the SSH key](#sshkeyresetcli) and specify the new user name.

You can also use [Reset the password and the SSH key](#resetbothcli) to create a new user with both password and SSH key access.

## <a name="sshconfigresetcli"></a>Reset the SSH configuration
If the SSH configuration is in an undesired state, you might also lose access to the VM. You can use the VMAccess extension to reset the configuration to its default state. To do so, you just need to set the “reset_ssh” key to “True”. The extension will restart the SSH server, open the SSH port on your VM, and reset the SSH configuration to default values. The user account (name, password or SSH keys) will not be changed.

> [!NOTE]
> The SSH configuration file that gets reset is located at /etc/ssh/sshd_config.
> 
> 

1. Create a file named PrivateConf.json with this content.

	```   
        {
        "reset_ssh":"True"
        }
	```

2. Run this command, substituting the name of your virtual machine for **myVM**. 

	```   
		azure vm extension set myVM VMAccessForLinux Microsoft.OSTCExtensions 1.* --private-config-path PrivateConf.json
	```

## <a name="deletecli"></a>Delete a user
If you want to delete a user account without logging into to the VM directly, you can use this script.

1. Create a file named PrivateConf.json with this content, substituting the user name to remove for **removeUserName**. 

	```   
        {
        "remove_user":"removeUserName"
        }
	```

2. Run this command, substituting the name of your virtual machine for **myVM**. 

	```   
        azure vm extension set myVM VMAccessForLinux Microsoft.OSTCExtensions 1.* --private-config-path PrivateConf.json
	```

## <a name="statuscli"></a>Display the status of the VMAccess extension
To display the status of the VMAccess extension, run this command.

```
        azure vm extension get
```

## <a name='checkdisk'></a>Check consistency of added disks
To run fsck on all disks in your Linux virtual machine, you will need to do the following:

1. Create a file named PublicConf.json with this content. Check Disk takes a boolean for whether to check disks attached to your virtual machine or not. 

	```   
        {   
        "check_disk": "true"
        }
	```

2. Run this command to execute, substituting the name of your virtual machine for **myVM**.

	```   
        azure vm extension set myVM VMAccessForLinux Microsoft.OSTCExtensions 1.* --public-config-path PublicConf.json 
	```

## <a name='repairdisk'></a>Repair disks
To repair disks that are not mounting or have mount configuration errors, use the VMAccess extension to reset the mount configuration on your Linux virtual machine. Substituting the name of your disk for **myDisk**.

1. Create a file named PublicConf.json with this content. 

	```   
        {
        "repair_disk":"true",
        "disk_name":"myDisk"
        }
	```

2. Run this command to execute, substituting the name of your virtual machine for **myVM**.

	```   
        azure vm extension set myVM VMAccessForLinux Microsoft.OSTCExtensions 1.* --public-config-path PublicConf.json
	```

## Next steps
* If you want to use Azure PowerShell cmdlets or Azure Resource Manager templates to reset the password or SSH key, fix the SSH configuration, and check disk consistency, see the [VMAccess extension documentation on GitHub](https://github.com/Azure/azure-linux-extensions/tree/master/VMAccess). 
* You can also use the [Azure portal](https://portal.azure.com) to reset the password or SSH key of a Linux VM deployed in the classic deployment model. You can't currently use the portal do to this for a Linux VM deployed in the Resource Manager deployment model.
* See [About virtual machine extensions and features](../extensions-features.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more about using VM extensions for Azure virtual machines.

