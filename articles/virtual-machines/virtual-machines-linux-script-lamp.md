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
	ms.date="02/23/2015"
	ms.author="guybo"/>

#Deploy a LAMP app using the Azure CustomScript Extension for Linux#

The Microsoft Azure CustomScript Extension for Linux provides a way to customize your virtual machines (VMs) by running arbitrary code written in any scripting language supported by the VM (for example, Python, and Bash). This provides a very flexible way to automate application deployment to multiple machines.

You can deploy the CustomScript Extension using the Azure Portal, Windows PowerShell, or the Azure Command-Line Interface (Azure CLI).

In this article we'll deploy a simple LAMP application to Ubuntu using the Azure CLI.

## Prerequisites

For the next example, first create two Azure VMs running Ubuntu 14.04. The VMs are called *script-vm* and *lamp-vm*. Use unique names when you create the VMs. One is used to run the CLI commands and one is used to deploy the LAMP app.

You also need an Azure Storage account and a key to access it (you can get this from the Azure Portal).

If you need help creating Linux VMs on Azure refer to [Create a Virtual Machine Running Linux](virtual-machines-linux-tutorial.md).

The install commands assume Ubuntu, but you can adapt the installation for any supported Linux distro.

The script-vm VM needs to have Azure CLI installed, with a working connection to Azure. For help with this refer to [Install and Configure the Azure Command-Line Interface](../xplat-cli.md).

## Upload a script

In this example the CustomScript Extension runs a script on a remote VM to install the LAMP stack and create a PHP page. In order to access the script from anywhere we'll upload it as an Azure blob.

### Script overview

The next script example installs a LAMP stack to Ubuntu (including setting up a silent install of MySQL), writes a simple PHP file, and starts Apache.

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

### Upload script

Save the script as a text file, for example *lamp_install.sh*, and then upload it to Azure Storage. You can do this easily with Azure CLI. The following example uploads the file to a storage container named "scripts". If the container doesn't exist you'll need to create it first.

    azure storage blob upload -a <yourStorageAccountName> -k <yourStorageKey> --container scripts ./install_lamp.sh

Also create a JSON file that describes how to download the script from Azure Storage. Save this as *public_config.json* (replacing "mystorage" with the name of your storage account):

    {"fileUris":["https://mystorage.blob.core.windows.net/scripts/install_lamp.sh"], "commandToExecute":"sh install_lamp.sh" }


## Deploy the extension

Now you can use the next command to deploy the Linux CustomScript Extension to the remote VM using the Azure CLI.

    azure vm extension set -c "./public_config.json" lamp-vm CustomScriptForLinux Microsoft.OSTCExtensions 1.*

The previous command downloads and runs the *lamp_install.sh* script on the VM called *lamp-vm*.

Since the app includes a web server, remember to open an HTTP listening port on the remote VM with the next command.

    azure vm endpoint create -n Apache -o tcp lamp-vm 80 80

## Monitoring and troubleshooting

You can check on how well the custom script runs by looking at the log file on the remote VM. SSH to *lamp-vm* and tail the log file with the next command.

    cd /var/log/azure/Microsoft.OSTCExtensions.CustomScriptForLinux/1.3.0.0/
    tail -f extension.log

After you run the CustomScript Extension, you can browse to the PHP page you created for information. The PHP page for the example in this article is *http://lamp-vm.cloudapp.net/phpinfo.php*.

## Additional resources

You can use the same basic steps to deploy more complex apps. In this example the install script was saved as a public blob in Azure Storage. A more secure option would be to store the install script as a secure blob with a [Secure Access Signature](https://msdn.microsoft.com/library/azure/ee395415.aspx) (SAS).

Additional resources for Azure CLI, Linux and the CustomScript Extension are listed next.

[Automate Linux VM Customization Tasks Using CustomScript Extension](http://azure.microsoft.com/blog/2014/08/20/automate-linux-vm-customization-tasks-using-customscript-extension/)

[Azure Linux Extensions (GitHub)](https://github.com/Azure/azure-linux-extensions)

[Linux and Open-Source Computing on Azure](virtual-machines-linux-opensource.md)
