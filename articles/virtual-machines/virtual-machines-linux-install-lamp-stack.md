<properties
	pageTitle="Install the LAMP stack on a Linux virtual machine | Microsoft Azure"
	description="Learn how to install the LAMP stack on a Linux virtual machine (VM) in Azure."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="szarkos"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/29/2015"
	ms.author="szark"/>



#Install the LAMP Stack on a Linux virtual machine in Azure

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]


A LAMP stack consists of the following different elements:

- **L**inux - Operating System
- **A**pache - Web Server
- **M**ySQL - Database Server
- **P**HP - Programming Language


##Installing on Ubuntu

You will need the following packages installed:

- `apache2`
- `mysql-server`
- `php5`
- `php5-mysql`

After running `apt-get update` to update the local list of packages, you can then install these packages with a single `apt-get install` command:

	# sudo apt-get update
	# sudo apt-get install apache2 mysql-server php5 php5-mysql

After running the above command you will be prompted to install these packages and a number of other dependencies.  Press 'y' and then 'Enter' to continue, and follow any other prompts to set an administrative password for MySQL.

This will install the minimum required PHP extensions needed to use PHP with MySQL. Run the following command to see other PHP extensions that are available as packages:

	# apt-cache search php5


##Installing on CentOS & Oracle Linux

You will need the following packages installed:

- `httpd`
- `mysql`
- `mysql-server`
- `php`
- `php-mysql`

You can install these packages with a single `yum install` command:

	# sudo yum install httpd mysql mysql-server php php-mysql

After running the above command you will be prompted to install these packages and a number of other dependencies.  Press 'y' and then 'Enter' to continue.

This will install the minimum required PHP extensions needed to use PHP with MySQL. Run the following command to see other PHP extensions that are available as packages:

	# yum search php


## Installing on SUSE Linux Enterprise Server

You will need the following packages installed:

- apache2
- mysql
- apache2-mod_php53
- php53-mysql

You can install these packages with a single `zypper install` command:

	# sudo zypper install apache2 mysql apache2-mod_php53 php53-mysql

After running the above command you will be prompted to install these packages and a number of other dependencies.  Press 'y' and then 'Enter' to continue.

This will install the minimum required PHP extensions needed to use PHP with MySQL. Run the following command to see other PHP extensions that are available as packages:

	# zypper search php


Setting Up
----------

1. Set up **Apache**

	- Run the following command to ensure the Apache web server is started:

		- Ubuntu & SLES: `sudo service apache2 restart`

		- CentOS & Oracle: `sudo service httpd restart`

	- Apache listens on port 80 by default. You may need to open an endpoint to access your Apache server remotely.  Please see the documentation on [configuring endpoints](virtual-machines-windows-classic-setup-endpoints.md) for more detailed instructions.

	- You can now check to see that Apache is running and serving content. Point your browser to `http://[MYSERVICE].cloudapp.net`, where **[MYSERVICE]** is the name of the cloud service in which your virtual machine resides. On some distributions you may be greeted by a default web page that simply states "It works!". On others you may see a more complete web page with links to additional documentation and content for configuring the Apache server.

2. Set up **MySQL**

	- Note that this step is not necessary on Ubuntu, which prompts you for a MySQL `root` password when the mysql-server package was installed.

	- On other distributions, set the root password for MySQL by running the following command:

			# mysqladmin -u root -p password yourpassword

	- You can then manage MySQL using the `mysql` or `mysqladmin` utilities.


##Further Reading

Suppose you want to automate these steps to deploy applications to remote Linux virtual machines? You can do this using the Linux CustomScript extension. See [Deploy a LAMP app using the Azure CustomScript Extension for Linux](virtual-machines-linux-classic-lamp-script.md).

There are many other resources for setting up a LAMP stack on Ubuntu.

- [https://help.ubuntu.com/community/ApacheMySQLPHP](https://help.ubuntu.com/community/ApacheMySQLPHP)
 