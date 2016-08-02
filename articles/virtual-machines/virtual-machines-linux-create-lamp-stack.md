<properties
	pageTitle="Deploy LAMP on a Linux virtual machine | Microsoft Azure"
	description="Learn how to install the LAMP stack on a Linux VM"
	services="virtual-machines-linux"
	documentationCenter="virtual-machines"
	authors="jluk"
	manager="squillace"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="NA"
	ms.topic="article"
	ms.date="06/07/2016"
	ms.author="jluk"/>

# Deploy LAMP Stack on Azure
This article will walk you through how to deploy an Apache web server, MySQL, and PHP (the LAMP stack) on Azure. You will need an Azure Account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)) and the [Azure CLI](../xplat-cli-install.md) that is [connected to your Azure account](../xplat-cli-connect.md).

There are two methods for installing LAMP covered in this article:

## Quick Command Summary

1) Deploy LAMP on new VM

```
# One command to create a resource group holding a VM with LAMP already on it
$ azure group create -n uniqueResourceGroup -l westus --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/lamp-app/azuredeploy.json
```

2) Deploy LAMP on existing VM

```
# Two commands: one updates packages, the other installs Apache, MySQL, and PHP
user@ubuntu$ sudo apt-get update
user@ubuntu$ sudo apt-get install apache2 mysql-server php5 php5-mysql
```

## Deploy LAMP on new VM Walkthrough

You can start by creating a new [resource group](../resource-group-overview.md) that will contain the VM:

    $ azure group create uniqueResourceGroup westus
    info:    Executing command group create
    info:    Getting resource group uniqueResourceGroup
    info:    Creating resource group uniqueResourceGroup
    info:    Created resource group uniqueResourceGroup
    data:    Id:                  /subscriptions/########-####-####-####-############/resourceGroups/uniqueResourceGroup
    data:    Name:                uniqueResourceGroup
    data:    Location:            westus
    data:    Provisioning State:  Succeeded
    data:    Tags: null
    data:
    info:    group create command OK

To create the VM itself, you can use an already written Azure Resource Manager template found [here on GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/lamp-app).

    $ azure group deployment create --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/lamp-app/azuredeploy.json uniqueResourceGroup uniqueLampName

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

## Deploy LAMP on existing VM Walkthrough

If you need help creating a Linux VM you can head [here to learn how to create a Linux VM] (./virtual-machines-linux-quick-create-cli.md). 
Next, you will need to SSH into the Linux VM. If you need help with creating an SSH key you can head [here to learn how to create an SSH key on Linux/Mac] (./virtual-machines-linux-mac-create-ssh-keys.md).
If you have an SSH key already, go ahead and SSH into your Linux VM with `ssh username@uniqueDNS`.

Now that you are working within your Linux VM, we will walk through installing the LAMP stack on Debian-based distributions. The exact commands might differ for other Linux distros.

#### Installing on Debian/Ubuntu

You will need the following packages installed: `apache2`, `mysql-server`, `php5`, and `php5-mysql`. You can install these by directly grabbing these packages or using Tasksel. Instructions for both options are listed below.
Before installing you will need to download and update package lists.

    user@ubuntu$ sudo apt-get update
    
##### Individual Packages
Using apt-get:

	user@ubuntu$ sudo apt-get install apache2 mysql-server php5 php5-mysql

##### Using Tasksel
Alternatively you can download Tasksel, a Debian/Ubuntu tool that installs multiple related packages as a coordinated "task" onto your system.

    user@ubuntu$ sudo apt-get install tasksel
    user@ubuntu$ sudo tasksel install lamp-server

After running the either of the above options you will be prompted to install these packages and a number of other dependencies. Press 'y' and then 'Enter' to continue, and follow any other prompts to set an administrative password for MySQL. This will install the minimum required PHP extensions needed to use PHP with MySQL. 

![][1]

Run the following command to see other PHP extensions that are available as packages:

	user@ubuntu$ apt-cache search php5


#### Create info.php document

You should now be able to check what version of Apache, MySQL, and PHP you have through the command line by typing `apache2 -v`, `mysql -v`, or `php -v`.

If you would like to test further, you can create a quick PHP info page to view in a browser. Create a new file with Nano text editor with this command:

    user@ubuntu$ sudo nano /var/www/html/info.php

Within the GNU Nano text editor, add the following lines:

    <?php
    phpinfo();
    ?>

Then save and exit the text editor.

Restart Apache with this command so all new installs will take effect.

    user@ubuntu$ sudo service apache2 restart

## Verify LAMP Successfully Installed

Now you can check the PHP info page you just created in your browser by going to http://youruniqueDNS/info.php, it should look similar to this.

![][2]

You can check your Apache installation by viewing the Apache2 Ubuntu Default Page by going to you http://youruniqueDNS/. You should see something like this.

![][3]

Congratulations, you have just setup a LAMP stack on your Azure VM!

## Next Steps

Check out the Ubuntu documentation on the LAMP stack:

- [https://help.ubuntu.com/community/ApacheMySQLPHP](https://help.ubuntu.com/community/ApacheMySQLPHP)

[1]: ./media/virtual-machines-linux-deploy-lamp-stack/configmysqlpassword-small.png
[2]: ./media/virtual-machines-linux-deploy-lamp-stack/phpsuccesspage.png
[3]: ./media/virtual-machines-linux-deploy-lamp-stack/apachesuccesspage.png
