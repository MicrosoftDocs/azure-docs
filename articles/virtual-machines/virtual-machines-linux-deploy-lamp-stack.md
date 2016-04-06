<properties
	pageTitle="Deploy LAMP on a Linux virtual machine | Microsoft Azure"
	description="Learn how to install the LAMP stack on a Linux VM"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="jluk"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/06/2016"
	ms.author="jluk"/>

This article will walk you through how to install an Apache web server, MySQL, and PHP on your existing Linux VM from the command line. This specific stack of Linux, Apache web server, MySQL, and PHP is commonly referred to as LAMP. 
This is a stack of open source software that enables a server to host dynamic websites and web apps. Linux acts as the operating system with the Apache web server, while website data gets stored in a MySQL database and dynamic content gets processed by PHP.


#Prerequisites

You will need an Azure account with an existing Linux VM running on Azure Compute. If you need help creating a Linux VM you can head [here to learn how to create a Linux VM] (https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-quick-create-cli/). 
Next, you will need to SSH into the Linux VM. If you need help with creating an SSH key you can head [here to learn how to create an SSH key on Linux/Mac] (https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-mac-create-ssh-keys/).
If you have an SSH key already, go ahead and SSH into your Linux VM with `ssh username@uniqueDNS -p 22`.


#Install LAMP on your Linux VM

Now that you are working within your Linux VM, we will walk through installing Apache, MySQL, and PHP. There are multiple flavors of Linux, below are corresponding instructions for Debian/Ubuntu installation.

##Installing on Ubuntu

This document was tested on Ubuntu 14.04.

You will need the following packages installed: `apache2`, `mysql-server`, `php5`, and `php5-mysql`. You can install these by directly grabbing these packages or using Tasksel. Instructions for both options are listed below.
Before installing you will need to download and update package lists.

    user@ubuntu$ sudo apt-get update
    
###Individual Packages
A single command installs all the above packages with the `apt-get install` command:

	user@ubuntu$ sudo apt-get install apache2 mysql-server php5 php5-mysql

###Using Tasksel
Alternatively you can download Tasksel, a Debian/Ubuntu tool that installs multiple related packages as a coordinated "task" onto your system.

    user@ubuntu$ sudo apt-get install tasksel
    user@ubuntu$ sudo tasksel install lamp-server

After running the either of the above options you will be prompted to install these packages and a number of other dependencies. Press 'y' and then 'Enter' to continue, and follow any other prompts to set an administrative password for MySQL. This will install the minimum required PHP extensions needed to use PHP with MySQL. 

IMG

Run the following command to see other PHP extensions that are available as packages:

	user@ubuntu$ apt-cache search php5


#Test LAMP on your new server

You should now be able to check what version of Apache, MySQL, and PHP you have through the command line by typing `apache2 -v`, `mysql -v`, or `php -v`.

If you would like to test further, you can create a quick PHP info page to view in a browser. Create a new file with Nano text editor with this command:

    user@ubuntu$ sudo nano /var/www/html/info.php

Within the GNU Nano text editor, add the following lines:

    <?php
    phpinfo();
    ?>

Then save and exit the text editor (Note: ^ is equivalent to Ctrl).

Restart Apache with this command so all new installs will take effect.

    user@ubuntu$ sudo service apache2 restart

Now you can check the PHP info page you just created in your browser by going to http://youruniqueDNS/info.php. You can find your unique DNS to your Linux VM from the Azure Portal. Below is an image of where it is located.

IMG

Once you have navigated to http://youruniqueDNS/info.php, it should look similar to this.

IMG

Apache listens to port 80 by default, as a result you may need to open an endpoint to access your Apache server remotely. You can check your Apache2 installation by viewing the Apache2 Ubuntu Default Page by going to you http://youruniqueDNS/. You should see something like this.

IMG

Congratulations, you have just setup a LAMP stack on your Azure VM!

#Next Steps

Suppose you want to automate these steps to deploy applications to remote Linux virtual machines? You can do this using the Linux CustomScript extension. See [Deploy a LAMP app using the Azure CustomScript Extension for Linux](virtual-machines-linux-classic-lamp-script.md).

There are many other resources for setting up a LAMP stack on Ubuntu.

- [https://help.ubuntu.com/community/ApacheMySQLPHP](https://help.ubuntu.com/community/ApacheMySQLPHP)
