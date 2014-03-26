<properties linkid="manage-linux-common-tasks-lampstack" urlDisplayName="Install LAMP stack" pageTitle="Install the LAMP stack on a Linux virtual machine" metaKeywords="" description="Learn how to install the LAMP stack on a Linux virtual machine (VM) in Azure. You can install on Ubuntu or CentOS." metaCanonical="" services="virtual-machines" documentationCenter="" title="Install the LAMP Stack on a Linux virtual machine in Azure" authors="" solutions="" manager="" editor="" />




#Install the LAMP Stack on a Linux virtual machine in Azure

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
- `libapache2-mod-auth-mysql`
- `libapache2-mod-php5`
- `php5-xsl`
- `php5-gd`
- `php-pear`

You can run this as a single `apt-get install` command:

	apt-get install apache2 mysql-server php5 php5-mysql libapache2-mod-auth-mysql libapache2-mod-php5 php5-xsl php5-gd php-pear


##Installing On CentOS

You will need the following packages installed:

- `httpd`
- `mysql`
- `mysql-server`
- `php`
- `php-mysql`

You can run this as a single `yum install` command:

	yum install httpd mysql mysql-server php-php-mysql


Setting Up
----------

1. Set up **Apache**.

	1. You will need to restart the Apache Web Server. Run the following command:

			sudo /etc/init.d/apache2 restart
	2. Check to see that the installation is running. Point your browser to: [http://localhost](http://localhost). It should read "It works!".

2. Set up **MySQL**.
	1. Set the root password for mysql by running the following command
	
			mysqladmin -u root -p password yourpassword

	2. Log into the console using the `mysql` or a variety of MySQL clients.

3. Set up **PHP**.

	1. Enable the Apache PHP Module by running the following command:

			sudo a2enmod php5

	2. Relaunch Apache by running the following command:

			sudo service apache2 restart


##Further Reading

There are many resources for setting up a LAMP stack on Ubuntu.

- [https://help.ubuntu.com/community/ApacheMySQLPHP](https://help.ubuntu.com/community/ApacheMySQLPHP)
- [http://fedorasolved.org/server-solutions/lamp-stack](http://fedorasolved.org/server-solutions/lamp-stack)
