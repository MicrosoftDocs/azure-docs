<properties 
	pageTitle="Use root privileges on Linux virtual machines in Azure" 
	description="Learn how to use root privileges on a Linux virtual machine in Azure." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="szarkos" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/16/2015" 
	ms.author="szark"/>




# Using root privileges on Linux virtual machines in Azure

By default, the `root` user is disabled on Linux virtual machines in Azure. Users can run commands with elevated privileges by using the `sudo` command. However, the experience may vary depending on how the system was provisioned.

1. **SSH key and password OR password only** - the virtual machine was provisioned with either a certificate (`.CER` file) or SSH key as well as a password, or just a user name and password. In this case `sudo` will prompt for the user's password before executing the command.

2. **SSH key only** - the virtual machine was provisioned with a certificate (`.cer` or `.pem` file) or SSH key, but no password.  In this case `sudo` **will not** prompt for the user's password before executing the command.


## SSH Key and Password, or Password Only

Log into the Linux virtual machine using SSH key or password authentication, then run commands using `sudo`, for example:

	# sudo <command>
	[sudo] password for azureuser:

In this case the user will be prompted for a password. After entering the password `sudo` will run the command with `root` privileges.

You can also enable passwordless sudo by editing the `/etc/sudoers.d/waagent` file, for example:

	#/etc/sudoers.d/waagent
	azureuser (ALL) = (ALL) NOPASSWD: ALL

This change will allow for passwordless sudo by the azureuser user.

## SSH Key Only

Log into the Linux virtual machine using SSH key authentication, then run commands using `sudo`, for example:

	# sudo <command>

In this case the user will **not** be prompted for a password. After pressing `<enter>`, `sudo` will run the command with `root` privileges.

