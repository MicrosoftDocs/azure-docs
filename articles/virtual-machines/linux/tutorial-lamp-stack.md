---
title: Deploy LAMP on a Linux virtual machine in Azure | Microsoft Docs
description: Tutorial - Install the LAMP stack on a Linux VM in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 6c12603a-e391-4d3e-acce-442dd7ebb2fe
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 07/27/2017
ms.author: danlep

---
# Install a LAMP web server on an Azure VM
This article walks you through how to deploy an Apache web server, MySQL, and PHP (the LAMP stack) on an Ubuntu VM in Azure. In this tutorial you learn how to:

> [!div class="checklist"]
> * 
> * 
> * 
> * 
> * 

For more on the LAMP stack, including recommendations for a production environment, see the [Ubuntu documentation](https://help.ubuntu.com/community/ApacheMySQLPHP).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Before you begin

To complete the example in this tutorial, you must have an existing Ubuntu Linux virtual machine (the 'L' in the LAMP stack). If needed, this [script sample](../scripts/virtual-machines-linux-cli-sample-create-vm-quick-create.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed. 


## Open port 80 for web traffic 

By default only SSH connections are allowed into Linux VMs deployed in Azure. Because this VM is going to be a web server, you need to open port 80 from the internet. Use the [az vm open-port](/cli/azure/vm#open-port) command to open the desired port.  
 
```azurecli-interactive 
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```
## SSH into your VM


If you don't already know the public IP address of your VM, run the [az network public-ip list](/cli/azure/network/public-ip#list) command:


```azurecli-interactive
az network public-ip list --resource-group myResourceGroup --query [].ipAddress
```

Use the following command to create an SSH session with the virtual machine. Substitute the correct public IP address of your virtual machine. In this example, the IP address is *40.68.254.142*.

```bash
ssh 40.68.254.142
```

## Install Apache, MySQL, and PHP

Run the following commands to update Ubuntu package sources and install Apache, MySQL, and PHP. (If you want to install a LAMP web server on another Linux distribution, use a supported package manager to install Apache, MySQL, and PHP.)


```bash
sudo apt update
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql
```



> [!TIP]
> You can alternatively install Apache, MySQL, and PHP on Ubuntu using `sudo apt-get install lampserver^` (including the caret (^) character at the end).
>



You are prompted to install these packages and other dependencies. When prompted, set a root password for MySQL, and then [Enter] to continue. Follow the remaining prompts. This process installs the minimum required PHP extensions needed to use PHP with MySQL. 

![][1]

## Verify the installation


### Apache

Check the version of Apache with the following command:
```bash
apache2 -v
```

With Apache installed, and port 80 open to your VM, the web server can now be accessed from the internet. To view the Apache2 Ubuntu Default Page, open a web browser, and enter the public IP address of the VM. Use the public IP address you used to SSH to the VM:

![][3]


### MySQL

Check the version of MySQL with the following command (note the capital `V` paramenter):

```bash
msql -V
```

We recommend running the following script to help secure the installation of MySQL:

```bash
mysql_secure_installation
```

Enter your MySQL root password, and configure the security settings for your environment.

To test that you can create a database, login to the database:

```bash
mysql -u root -p
```

Enter your password, and at the myql prompt type:

```mysql
CREATE DATABASE myfirstdatabase;
```
If you no longer need the database, delete it:

```mysql
DROP DATABASE myfirstdatabase;
```
To exit the mysql prompt, type:

```mysql
\q
```

### PHP

Check the version of PHP with the following command:

```bash
php -v
```
If you want to test further, create a quick PHP info page to view in a browser. The following command creates the PHP info page:

```
sudo sh -c 'echo "<?php phpinfo(); ?>" > /var/www/html/info.php'
```

Restart Apache with the following command so the installation takes effect:

```bash
sudo service apache2 restart
```

Now you can check the PHP info page you created. Open a browser and go to `http://yourPublicIPAddress/info.php`. Substitute the public IP address of your VM. It should look similar to this image.

![][2]


## Install WordPress

If you want to test your LAMP stack, you can install the WordPress platform to create websites and blogs. Here are brief steps. For more information and steps for production installion, see the [Ubuntu documenation](https://help.ubuntu.com/lts/serverguide/wordpress.html).



### Install the WordPress package

Run the following command:

```bash
sudo apt install wordpress
```

### Configure WordPress

Open a text editor and create the file `/etc/wordpress/config-localhost.php`:

```bash
sudo nano /etc/wordpress/config-localhost.php
```
Copy the following lines to the file, substituting your database password (leave other values unchanged):

```
<?php
define('DB_NAME', 'wordpress');
define('DB_USER', 'wordpress');
define('DB_PASSWORD', 'yourPassword');
define('DB_HOST', 'localhost');
define('WP_CONTENT_DIR', '/usr/share/wordpress/wp-content');
?>
```

Create a temporary text file `wordpress.sql` with the following commands to create the WordPress database. Substitute your database password:

```
CREATE DATABASE wordpress;
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER
ON wordpress.*
TO wordpress@localhost
IDENTIFIED BY 'yourPassword';
FLUSH PRIVILEGES;
```

Run the following command to create the database:

```bash
cat wordpress.sql | sudo mysql --defaults-extra-file=/etc/mysql/debian.cnf
```

Move the WordPress installation to the Apache document root:

```bash
sudo ln -s /usr/share/wordpress /var/www/html/wordpress

sudo mv /etc/wordpress/config-localhost.php /etc/wordpress/config-default.php
```

Restart Apache:

```
sudo service apache2 restart
```
Now you can continue the Wordpress installation. Open a browser and go to `http://yourPublicIPAddress/wordpress`. Substitute the public IP address of your VM. It should look similar to this image.

## Next steps


[1]: ./media/tutorial-lamp-stack/configmysqlpassword-small.png
[2]: ./media/tutorial-lamp-stack/phpsuccesspage.png
[3]: ./media/tutorial-lamp-stack/apachesuccesspage.png
