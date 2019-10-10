---
title: Tutorial - Deploy LAMP on a Linux virtual machine in Azure | Microsoft Docs
description: In this tutorial, you learn how to install the LAMP stack on a Linux virtual machine in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid: 6c12603a-e391-4d3e-acce-442dd7ebb2fe
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 01/30/2019
ms.author: cynthn

#Customer intent: As an IT administrator, I want to learn how to install the LAMP stack so that I can quickly prepare a Linux VM to run web applications.
---

# Tutorial: Install a LAMP web server on a Linux virtual machine in Azure

This article walks you through how to deploy an Apache web server, MySQL, and PHP (the LAMP stack) on an Ubuntu VM in Azure. If you prefer the NGINX web server, see the [LEMP stack](tutorial-lemp-stack.md) tutorial. To see the LAMP server in action, you can optionally install and configure a WordPress site. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create an Ubuntu VM (the 'L' in the LAMP stack)
> * Open port 80 for web traffic
> * Install Apache, MySQL, and PHP
> * Verify installation and configuration
> * Install WordPress on the LAMP server

This setup is for quick tests or proof of concept. For more on the LAMP stack, including recommendations for a production environment, see the [Ubuntu documentation](https://help.ubuntu.com/community/ApacheMySQLPHP).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

[!INCLUDE [virtual-machines-linux-tutorial-stack-intro.md](../../../includes/virtual-machines-linux-tutorial-stack-intro.md)]

## Install Apache, MySQL, and PHP

Run the following command to update Ubuntu package sources and install Apache, MySQL, and PHP. Note the caret (^) at the end of the command, which is part of the `lamp-server^` package name. 


```bash
sudo apt update && sudo apt install lamp-server^
```

You are prompted to install the packages and other dependencies. This process installs the minimum required PHP extensions needed to use PHP with MySQL.  

## Verify installation and configuration


### Verify Apache

Check the version of Apache with the following command:
```bash
apache2 -v
```

With Apache installed, and port 80 open to your VM, the web server can now be accessed from the internet. To view the Apache2 Ubuntu Default Page, open a web browser, and enter the public IP address of the VM. Use the public IP address you used to SSH to the VM:

![Apache default page][3]


### Verify and secure MySQL

Check the version of MySQL with the following command (note the capital `V` parameter):

```bash
mysql -V
```

To help secure the installation of MySQL, including setting a root password, run the `mysql_secure_installation` script. 

```bash
sudo mysql_secure_installation
```

You can optionally set up the Validate Password Plugin (recommended). Then, set a password for the MySQL root user, and configure the remaining security settings for your environment. We recommend that you answer "Y" (yes) to all questions.

If you want to try MySQL features (create a MySQL database, add users, or change configuration settings), login to MySQL. This step is not required to complete this tutorial.

```bash
sudo mysql -u root -p
```

When done, exit the mysql prompt by typing `\q`.

### Verify PHP

Check the version of PHP with the following command:

```bash
php -v
```

If you want to test further, create a quick PHP info page to view in a browser. The following command creates the PHP info page:

```bash
sudo sh -c 'echo "<?php phpinfo(); ?>" > /var/www/html/info.php'
```

Now you can check the PHP info page you created. Open a browser and go to `http://yourPublicIPAddress/info.php`. Substitute the public IP address of your VM. It should look similar to this image.

![PHP info page][2]

[!INCLUDE [virtual-machines-linux-tutorial-wordpress.md](../../../includes/virtual-machines-linux-tutorial-wordpress.md)]

## Next steps

In this tutorial, you deployed a LAMP server in Azure. You learned how to:

> [!div class="checklist"]
> * Create an Ubuntu VM
> * Open port 80 for web traffic
> * Install Apache, MySQL, and PHP
> * Verify installation and configuration
> * Install WordPress on the LAMP server

Advance to the next tutorial to learn how to secure web servers with SSL certificates.

> [!div class="nextstepaction"]
> [Secure web server with SSL](tutorial-secure-web-server.md)

[2]: ./media/tutorial-lamp-stack/phpsuccesspage.png
[3]: ./media/tutorial-lamp-stack/apachesuccesspage.png
