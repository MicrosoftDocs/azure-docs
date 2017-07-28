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
ms.date: 07/28/2017
ms.author: danlep

---
# Install a LAMP web server on an Azure VM
This article walks you through how to deploy an Apache web server, MySQL, and PHP (the LAMP stack) on an Ubuntu VM in Azure. In this tutorial you learn how to:

> [!div class="checklist"]
> * Open port 80 for web traffic
> * Install Apache, MySQL, and PHP
> * Verify installation and configuration
> * Install WordPress on the LAMP stack


For more on the LAMP stack, including recommendations for a production environment, see the [Ubuntu documentation](https://help.ubuntu.com/community/ApacheMySQLPHP).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [virtual-machines-linux-tutorial-stack-intro.md](../../../includes/virtual-machines-linux-tutorial-stack-intro.md)]

## Install Apache, MySQL, and PHP

Run the following commands to update Ubuntu package sources and install Apache, MySQL, and PHP. 


```bash
sudo apt update
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql
```



> [!TIP]
> You can alternatively install Apache, MySQL, and PHP on Ubuntu using `sudo apt-get install lampserver^` (including the caret (^) character at the end).
>



You are prompted to install these packages and other dependencies. When prompted, set a root password for MySQL, and then [Enter] to continue. Follow the remaining prompts. This process installs the minimum required PHP extensions needed to use PHP with MySQL. 

![MySQL root password page][1]

## Verify installation and configuration


### Apache

Check the version of Apache with the following command:
```bash
apache2 -v
```

With Apache installed, and port 80 open to your VM, the web server can now be accessed from the internet. To view the Apache2 Ubuntu Default Page, open a web browser, and enter the public IP address of the VM. Use the public IP address you used to SSH to the VM:

![Apache default page][3]


### MySQL

Check the version of MySQL with the following command (note the capital `V` parameter):

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

Enter your password, and at the mysql prompt type:

```sql
CREATE DATABASE myfirstdatabase;
```
If you no longer need the database, delete it:

```sql
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

```bash
sudo sh -c 'echo "<?php phpinfo(); ?>" > /var/www/html/info.php'
```

Restart Apache with the following command so the installation takes effect:

```bash
sudo service apache2 restart
```

Now you can check the PHP info page you created. Open a browser and go to `http://yourPublicIPAddress/info.php`. Substitute the public IP address of your VM. It should look similar to this image.

![PHP info page][2]


## Install WordPress

If you want to try your LAMP stack, install a sample app. The following steps install the WordPress platform to create websites and blogs. This setup is for proof of concept. For more information and settings for production installation, see the [WordPress documentation](https://codex.wordpress.org/Main_Page).



### Install the WordPress package

Run the following command:

```bash
sudo apt install wordpress
```

### Configure WordPress

Configure WordPress to use MySQL and PHP. Open a text editor (nano in this example) and create the file `/etc/wordpress/config-localhost.php`:

```bash
sudo nano /etc/wordpress/config-localhost.php
```
Copy the following lines to the file, substituting your database password for *yourPassword* (leave other values unchanged). Then save the file.

```php
<?php
define('DB_NAME', 'wordpress');
define('DB_USER', 'wordpress');
define('DB_PASSWORD', 'yourPassword');
define('DB_HOST', 'localhost');
define('WP_CONTENT_DIR', '/usr/share/wordpress/wp-content');
?>
```

Create a text file `wordpress.sql` with the following commands to create the WordPress database. Substitute your database password for *yourPassword*:

```sql
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

After the command completes, delete the file `wordpress.sql`.

Move the WordPress installation to the Apache document root:

```bash
sudo ln -s /usr/share/wordpress /var/www/html/wordpress

sudo mv /etc/wordpress/config-localhost.php /etc/wordpress/config-default.php
```

Restart Apache:

```bash
sudo service apache2 restart
```

Now you can complete the Wordpress setup and start using the platform. Open a browser and go to `http://yourPublicIPAddress/wordpress`. Substitute the public IP address of your VM. It should look similar to this image.

![WordPress installation page][4]

## Next steps

In this tutorial, you deployed a LAMP server in Azure. You learned how to:

> [!div class="checklist"]
> * Open port 80 for web traffic
> * Install Apache, MySQL, and PHP
> * Verify installation and configuration
> * Install WordPress on the LAMP stack

Advance to the next tutorial to learn about ....

[1]: ./media/tutorial-lamp-stack/configmysqlpassword-small.png
[2]: ./media/tutorial-lamp-stack/phpsuccesspage.png
[3]: ./media/tutorial-lamp-stack/apachesuccesspage.png
[4]: ./media/tutorial-lamp-stack/wordpressstartpage.png