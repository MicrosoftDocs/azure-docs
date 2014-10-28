<properties urlDisplayName="Use root privileges" pageTitle="Use root privileges on Linux virtual machines in Azure" metaKeywords="" description="Learn how to use root privileges on a Linux virtual machine in Azure." metaCanonical="" services="virtual-machines" documentationCenter="" title="Using root privileges on Linux virtual machines in Azure" authors="timlt" solutions="" manager="timlt" editor="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="timlt" />




#Using root privileges on Linux virtual machines in Azure

Users can run commands with elevated privileges on a Linux virtual machine using the `sudo` command. However, the experience may vary depending on how the system was provisioned.

1. **SSH key and password or password only** - the virtual machine was provisioned with either a certificate (`.CER` file) as well as a password, or just a user name and password. In this case `sudo` will prompt for the user's password before executing the command.

2. **SSH key only** - the virtual machine was provisioned with a certificate (`.cer` or `.pem` file), but no password.  In this case `sudo` **will not** prompt for the user's password before executing the command.


##SSH Key and Password, or Password Only

Log into the Linux virtual machine using SSH key or password authentication, then run commands using `sudo`, for example:

	# sudo <command>
	[sudo] password for azureuser:

In this case the user will be prompted for a password. After entering the password `sudo` will run the command with `root` privileges.


##SSH Key Only

Log into the Linux virtual machine using SSH key authentication, then run commands using `sudo`, for example:

	# sudo <command>

In this case the user will **not** be prompted for a password. After pressing `<enter>`, `sudo` will run the command with `root` privileges.

