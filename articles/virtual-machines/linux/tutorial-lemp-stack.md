---
title: Tutorial - Deploy LEMP on a Linux virtual machine in Azure | Microsoft Docs
description: In this tutorial, you learn how to install the LEMP stack on a Linux virtual machine in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: dlepow
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 11/27/2017
ms.author: danlep

#Customer intent: As an IT administrator, I want to learn how to install the LEMP stack so that I can quickly prepare a Linux VM to run web applications.
---

# Tutorial: Install a LEMP web server on a Linux virtual machine in Azure

This article walks you through how to deploy an NGINX web server, MySQL, and PHP (the LEMP stack) on an Ubuntu VM in Azure. The LEMP stack is an alternative to the popular [LAMP stack](tutorial-lamp-stack.md), which you can also install in Azure. To see the LEMP server in action, you can optionally install and configure a WordPress site. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create an Ubuntu VM (the 'L' in the LEMP stack)
> * Open port 80 for web traffic
> * Install NGINX, MySQL, and PHP
> * Verify installation and configuration
> * Install WordPress on the LEMP server

This setup is for quick tests or proof of concept.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

[!INCLUDE [virtual-machines-linux-tutorial-stack-intro.md](../../../includes/virtual-machines-linux-tutorial-stack-intro.md)]

## Install NGINX, MySQL, and PHP

Run the following command to update Ubuntu package sources and install NGINX, MySQL, and PHP. 

```bash
sudo apt update && sudo apt install nginx mysql-server php-mysql php php-fpm
```

You are prompted to install the packages and other dependencies. When prompted, set a root password for MySQL, and then [Enter] to continue. Follow the remaining prompts. This process installs the minimum required PHP extensions needed to use PHP with MySQL. 

![MySQL root password page][1]

## Verify installation and configuration


### NGINX

Check the version of NGINX with the following command:
```bash
nginx -v
```

With NGINX installed, and port 80 open to your VM, the web server can now be accessed from the internet. To view the NGINX welcome page, open a web browser, and enter the public IP address of the VM. Use the public IP address you used to SSH to the VM:

![NGINX default page][3]


### MySQL

Check the version of MySQL with the following command (note the capital `V` parameter):

```bash
mysql -V
```

To help secure the installation of MySQL, run the `mysql_secure_installation` script. If you are only setting up a temporary server, you can skip this step. 

```bash
mysql_secure_installation
```

Enter a root password for MySQL, and configure the security settings for your environment.

If you want to try MySQL features (create a MySQL database, add users, or change configuration settings), login to MySQL. This step is not required to complete this tutorial. 


```bash
mysql -u root -p
```

When done, exit the mysql prompt by typing `\q`.

### PHP

Check the version of PHP with the following command:

```bash
php -v
```

Configure NGINX to use the PHP FastCGI Process Manager (PHP-FPM). Run the following commands to back up the original NGINX server block config file and then edit the original file in an editor of your choice:

```bash
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default_backup

sudo sensible-editor /etc/nginx/sites-available/default
```

In the editor, replace the contents of `/etc/nginx/sites-available/default` with the following. See the comments for explanation of the settings. Substitute the public IP address of your VM for *yourPublicIPAddress*, and leave the remaining settings. Then save the file.

```
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    # Homepage of website is index.php
    index index.php;

    server_name yourPublicIPAddress;

    location / {
        try_files $uri $uri/ =404;
    }

    # Include FastCGI configuration for NGINX
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.0-fpm.sock;
    }
}
```

Check the NGINX configuration for syntax errors:

```bash
sudo nginx -t
```

If the syntax is correct, restart NGINX with the following command:

```bash
sudo service nginx restart
```

If you want to test further, create a quick PHP info page to view in a browser. The following command creates the PHP info page:

```bash
sudo sh -c 'echo "<?php phpinfo(); ?>" > /var/www/html/info.php'
```



Now you can check the PHP info page you created. Open a browser and go to `http://yourPublicIPAddress/info.php`. Substitute the public IP address of your VM. It should look similar to this image.

![PHP info page][2]


[!INCLUDE [virtual-machines-linux-tutorial-wordpress.md](../../../includes/virtual-machines-linux-tutorial-wordpress.md)]

## Next steps

In this tutorial, you deployed a LEMP server in Azure. You learned how to:

> [!div class="checklist"]
> * Create an Ubuntu VM
> * Open port 80 for web traffic
> * Install NGINX, MySQL, and PHP
> * Verify installation and configuration
> * Install WordPress on the LEMP stack

Advance to the next tutorial to learn how to secure web servers with SSL certificates.

> [!div class="nextstepaction"]
> [Secure web server with SSL](tutorial-secure-web-server.md)

[1]: ./media/tutorial-lemp-stack/configmysqlpassword-small.png
[2]: ./media/tutorial-lemp-stack/phpsuccesspage.png
[3]: ./media/tutorial-lemp-stack/nginx.png
