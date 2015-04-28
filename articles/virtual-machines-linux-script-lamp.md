<properties
	pageTitle="Deploy a Linux application using the Azure CustomScript Extension"
	description="Learn how to use the Azure CustomScript extension to deploy applications on Linux virtual machines."
	editor="tysonn"
	manager="timlt"
	documentationCenter=""
	services="virtual-machines"
	authors="gbowerman"/>

<tags
	ms.service="virtual-machines"
	ms.workload="multiple"
	ms.tgt_pltfrm="linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="2/23/2015"
	ms.author="guybo"/>

#Deploy a LAMP app using the Azure CustomScript Extension for Linux#

The Azure CustomScript extension for Linux provides a way to customize your virtual machines (VMs) by running arbitrary code written in any scripting language supported by the VM (e.g. Python, Bash etc.). This provides a very flexible way to automate application deployment to multiple machines.

You can deploy the CustomScript extension using the Azure Portal, PowerShell, or the Azure Cross Platform Command Line Interface (xplat-cli).

In this example we'll walk through deploying a simple LAMP application to Ubuntu using the xplat-cli.

## Prerequisites

For this walk-through, create two Azure VMs running Ubuntu 14.04. I'll call them *script-vm* and *lamp-vm* here. Use unique names when you try this. One will be for running the CLI commands and one is to deploy the LAMP app to.

You also need an Azure Storage account and key to access it (you can get this from the Azure portal).

If you need help creating Linux VMs on Azure refer to [Create a Virtual Machine Running Linux](virtual-machines-linux-tutorial.md).

Though the specific install commands will assume Ubuntu, you can adapt the general steps for any supported distro.

The *script-vm* VM needs to have xplat-cli installed, with a working connection to Azure. For help with this refer to [Install and Configure the Azure Cross-Platform Command-Line Interface](xplat-cli.md).

## Uploading a script

In this example the CustomScript extension will execute a script on a remote VM to install the LAMP stack and create a PHP page. In order to access the script from anywhere we'll upload it as an Azure blob.

**The script**

This script installs a LAMP stack to Ubuntu (including setting up a silent install of MySQL), writes a simple PHP file and starts Apache:

	#!/bin/bash
	# set up a silent install of MySQL
	dbpass="mySQLPassw0rd"

	export DEBIAN_FRONTEND=noninteractive
	echo mysql-server-5.6 mysql-server/root_password password $dbpass | debconf-set-selections
	echo mysql-server-5.6 mysql-server/root_password_again password $dbpass | debconf-set-selections

	# install the LAMP stack
	apt-get -y install apache2 mysql-server php5 php5-mysql  

	# write some PHP
	echo \<center\>\<h1\>My Demo App\</h1\>\<br/\>\</center\> > /var/www/html/phpinfo.php
	echo \<\?php phpinfo\(\)\; \?\> >> /var/www/html/phpinfo.php

	# restart Apache
	apachectl restart

**Upload**

Save the script as a text file, for example *lamp_install.sh*, and then upload it to Azure storage. You can do this easily with xplat-cli. The following example uploads the file to a storage container named "scripts". Note: If the container doesn't exist you'll need to create it first.

    azure storage blob upload -a <yourStorageAccountName> -k <yourStorageKey> --container scripts ./install_lamp.sh

Also create a JSON file which describes how to download the script from Azure storage. Save this as *public_config.json* (replacing "mystorage" with the name of your storage account):

    {"fileUris":["https://mystorage.blob.core.windows.net/scripts/install_lamp.sh"], "commandToExecute":"sh install_lamp.sh" }


## Deploying the extension

Now we're ready to deploy the Linux CustomScript extension to the remote VM using the xplat-cli:

    azure vm extension set -c "./public_config.json" lamp-vm CustomScriptForLinux Microsoft.OSTCExtensions 1.*

This will download and execute the *lamp_install.sh* script on the VM called *lamp-vm*.

Since the app includes a web server remember to open an HTTP listening port on the remote VM:

    azure vm endpoint create -n Apache -o tcp lamp-vm 80 80

## Monitoring and troubleshooting

You can check on the progress of the custom script execution by looking at the log file on the remote VM. SSH to *lamp-vm* and tail the log file:

    cd /var/log/azure/Microsoft.OSTCExtensions.CustomScriptForLinux/1.3.0.0/
    tail -f extension.log

Once the CustomScript extension has finished executing you can browse to the PHP page you created, which in this example would be: *http://lamp-vm.cloudapp.net/phpinfo.php*.

## Additional Resources

You can use the same basic steps to deploy more complex apps. In this example the install script was saved as a public blob in Azure Storage. A more secure option would be to store the install script as a secure blob with a [Secure Access Signature](https://msdn.microsoft.com/library/azure/ee395415.aspx) (SAS).

Here are some additional resources for xplat-cli, Linux and the CustomScript extension:

[Automate Linux VM Customization Tasks Using CustomScript Extension](http://azure.microsoft.com/blog/2014/08/20/automate-linux-vm-customization-tasks-using-customscript-extension/)

[Azure Linux Extensions (GitHub)](https://github.com/Azure/azure-linux-extensions)

[Linux and Open-Source Computing on Azure](virtual-machines-linux-opensource.md)
