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

There are two methods to installing LAMP covered in this article:
1. Create a new Linux VM with LAMP pre-installed
2. Manually Install LAMP on Existing Linux VM

The first method will allow you to get to building your actual application as fast possible, the second allows for more customization if you need it.

#Create a new Linux VM with LAMP pre-installed

For this method you will need an Azure account, the Azure CLI, and to log into your account using `azure login`.
Start by creating a new resource group to hold the VM with LAMP on it, you will specify a name and location for it.

    $ azure group create uniqueResourceGroup westus
    info:    Executing command group create
    info:    Getting resource group uniqueResourceGroup
    info:    Creating resource group uniqueResourceGroup
    info:    Created resource group uniqueResourceGroup
    data:    Id:                  /subscriptions/d1231ed5-5c92-4509-9a21-b8ae8172b186/resourceGroups/uniqueResourceGroup
    data:    Name:                uniqueResourceGroup
    data:    Location:            westus
    data:    Provisioning State:  Succeeded
    data:    Tags: null
    data:
    info:    group create command OK

To create the VM itself, you can use an already written Azure extension template found [here on GitHub] (https://github.com/Azure/azure-quickstart-templates/tree/master/lamp-app).

    $ azure group deployment create --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/lamp-app/azuredeploy.json uniqueResourceGroup2 uniqueLampName2

You should see a response prompting some more inputs:

    info:    Executing command group deployment create
    info:    Supply values for the following parameters
    storageAccountNamePrefix: lampprefix
    location: westus
    adminUsername: someUsername
    adminPassword: somePassword
    mySqlPassword: somePassword
    dnsLabelPrefix: azlamptest
    info:    Initializing template configurations and parameters
    info:    Creating a deployment
    info:    Created template deployment "uniqueLampName"
    info:    Waiting for deployment to complete
    data:    DeploymentName     : uniqueLampName
    data:    ResourceGroupName  : uniqueResourceGroup
    data:    ProvisioningState  : Succeeded
    data:    Timestamp          :
    data:    Mode               : Incremental
    data:    CorrelationId      : d51bbf3c-88f1-4cf3-a8b3-942c6925f381
    data:    TemplateLink       : https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/lamp-app/azuredeploy.json
    data:    ContentVersion     : 1.0.0.0
    data:    DeploymentParameters :
    data:    Name                      Type          Value
    data:    ------------------------  ------------  -----------
    data:    storageAccountNamePrefix  String        lampprefix
    data:    location                  String        westus
    data:    adminUsername             String        someUsername
    data:    adminPassword             SecureString  undefined
    data:    mySqlPassword             SecureString  undefined
    data:    dnsLabelPrefix            String        azlamptest
    data:    ubuntuOSVersion           String        14.04.2-LTS
    info:    group deployment create command OK

You have now created a Linux VM with LAMP already installed on it. If you wish, you can verify the install by jumping down to [Verify LAMP Successfully Installed].

#Manually Install LAMP on Existing Linux VM

##Prerequisites

You will need an Azure account with an existing Linux VM running on Azure Compute. If you need help creating a Linux VM you can head [here to learn how to create a Linux VM] (https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-quick-create-cli/). 
Next, you will need to SSH into the Linux VM. If you need help with creating an SSH key you can head [here to learn how to create an SSH key on Linux/Mac] (https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-mac-create-ssh-keys/).
If you have an SSH key already, go ahead and SSH into your Linux VM with `ssh username@uniqueDNS -p 22`.


##Install LAMP on existing Linux VM

Now that you are working within your Linux VM, we will walk through installing Apache, MySQL, and PHP. There are multiple flavors of Linux, below are corresponding instructions for Debian/Ubuntu installation.

###Installing on Ubuntu

This document was tested on Ubuntu 14.04.

You will need the following packages installed: `apache2`, `mysql-server`, `php5`, and `php5-mysql`. You can install these by directly grabbing these packages or using Tasksel. Instructions for both options are listed below.
Before installing you will need to download and update package lists.

    user@ubuntu$ sudo apt-get update
    
####Individual Packages
A single command installs all the above packages with the `apt-get install` command:

	user@ubuntu$ sudo apt-get install apache2 mysql-server php5 php5-mysql

####Using Tasksel
Alternatively you can download Tasksel, a Debian/Ubuntu tool that installs multiple related packages as a coordinated "task" onto your system.

    user@ubuntu$ sudo apt-get install tasksel
    user@ubuntu$ sudo tasksel install lamp-server

After running the either of the above options you will be prompted to install these packages and a number of other dependencies. Press 'y' and then 'Enter' to continue, and follow any other prompts to set an administrative password for MySQL. This will install the minimum required PHP extensions needed to use PHP with MySQL. 

![][./media/virtual-machines-linux-deploy-lamp-stack/configmysqlpassword.png]

Run the following command to see other PHP extensions that are available as packages:

	user@ubuntu$ apt-cache search php5


##Create info.php document

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

#Verify LAMP Successfully Installed

Now you can check the PHP info page you just created in your browser by going to http://youruniqueDNS/info.php. You can find your unique DNS to your Linux VM from the Azure Portal. Below is an image of where it is located.

![][./media/virtual-machines-linux-deploy-lamp-stack/finddnsibizaportal.png]

Once you have navigated to http://youruniqueDNS/info.php, it should look similar to this.

![][./media/virtual-machines-linux-deploy-lamp-stack/phpsuccesspage.png]

Apache listens to port 80 by default, as a result you may need to open an endpoint to access your Apache server remotely. You can check your Apache2 installation by viewing the Apache2 Ubuntu Default Page by going to you http://youruniqueDNS/. You should see something like this.

![][./media/virtual-machines-linux-deploy-lamp-stack/apachesuccesspage.png]

Congratulations, you have just setup a LAMP stack on your Azure VM!

#Next Steps

There are many other resources for setting up a LAMP stack on Ubuntu.

- [https://help.ubuntu.com/community/ApacheMySQLPHP](https://help.ubuntu.com/community/ApacheMySQLPHP)
