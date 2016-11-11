---
title: Docker and Compose on a virtual machine | Microsoft Docs
description: Quick introduction to working with Compose and Docker on Linux virtual machines in Azure
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 02ab8cf9-318d-4a28-9d0c-4a31dccc2a84
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 09/22/2016
ms.author: iainfou

---
# Get Started with Docker and Compose to define and run a multi-container application on an Azure virtual machine
Get started using Docker and [Compose](http://github.com/docker/compose) to define and run a complex application on a Linux virtual machine in Azure. With Compose, you use a simple text file to define an application consisting of multiple Docker containers. You then spin up your application in a single command that does everything to deploy your defined environment. 

As an example, this article shows you how to quickly set up a WordPress blog with a backend MariaDB SQL database on an Ubuntu VM. You can also use Compose to set up more complex applications.

## Step 1: Set up a Linux VM as a Docker host
You can use various Azure procedures and available images or Resource Manager templates in the Azure Marketplace to create a Linux VM and set it up as a Docker host. For example, see [Using the Docker VM Extension to deploy your environment](virtual-machines-linux-dockerextension.md) to quickly create an Ubuntu VM with the Azure Docker VM extension by using a [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu). 

When you use the Docker VM extension, your VM is automatically set up as a Docker host and Compose is already installed. The example in that article shows you how to use the [Azure command-line interface for Mac, Linux, and Windows](../xplat-cli-install.md) (the Azure CLI) in Resource Manager mode to create the VM.

The basic command from the preceding document creates a resource group named `myResourceGroup` in the `West US` location and deploys a VM with the Azure Docker VM extension installed:

```azurecli
azure group create --name myResourceGroup --location "West US" \
  --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/docker-simple-on-ubuntu/azuredeploy.json
```

## Step 2: Verify that Compose is installed
Once the deployment is finished, SSH to your new Docker host using the DNS name you provided during deployment. You can use `azure vm show -g myDockerResourceGroup -n myDockerVM` to view details of your VM, including the DNS name.

To check that Compose is installed on the VM, run the following command:

```bash
docker-compose --version
```

You see output similar to `docker-compose 1.6.2, build 4d72027`.

> [!TIP]
> If you used another method to create a Docker host and need to install Compose yourself, see the [Compose documentation](https://github.com/docker/compose/blob/882dc673ce84b0b29cd59b6815cb93f74a6c4134/docs/install.md).
> 
> 

## Step 3: Create a docker-compose.yml configuration file
Next you create a `docker-compose.yml` file, which is just a text configuration file, to define the Docker containers to run on the VM. The file specifies the image to run on each container (or it could be a build from a Dockerfile), necessary environment variables and dependencies, ports, and the links between containers. For details on yml file syntax, see [Compose file reference](http://docs.docker.com/compose/yml/).

Create the `docker-compose.yml` file as follows:

```bash
touch docker-compose.yml
```

Use your favorite text editor to add some data to the file. The following example uses the `vi` editor:

```bash
vi docker-compose.yml
```

Paste the following example into your text file. This configuration uses images from the [DockerHub Registry](https://registry.hub.docker.com/_/wordpress/) to install WordPress (the open source blogging and content management system) and a linked backend MariaDB SQL database. Enter your own `MYSQL_ROOT_PASSWORD` as follows:

```sh
wordpress:
  image: wordpress
  links:
    - db:mysql
  ports:
    - 80:80

db:
  image: mariadb
  environment:
    MYSQL_ROOT_PASSWORD: <your password>
```

## Step 4: Start the containers with Compose
In the same directory as your `docker-compose.yml` file, run the following command (depending on your environment, you might need to run `docker-compose` using `sudo`.):

```bash
docker-compose up -d

```

This command starts the Docker containers specified in `docker-compose.yml`. It takes a minute or two for this step to complete. You see output similar to the following example:

```bash
Creating wordpress_db_1...
Creating wordpress_wordpress_1...
...
```

> [!NOTE]
> Be sure to use the **-d** option on start-up so that the containers run in the background continuously.
> 
> 

To verify that the containers are up, type `docker-compose ps`. You should see something like:

```bash
Name             Command             State              Ports
-------------------------------------------------------------------------
wordpress_db_1     /docker-           Up                 3306/tcp
             entrypoint.sh
             mysqld
wordpress_wordpr   /entrypoint.sh     Up                 0.0.0.0:80->80
ess_1              apache2-for ...                       /tcp
```

You can now connect to WordPress directly on the VM on port 80. Open a web browser and enter the DNS name of your VM (such as `http://myresourcegroup.westus.cloudapp.azure.com`). You should now see the WordPress start screen, where you can complete the installation and get started with the application.

![WordPress start screen][wordpress_start]

## Next steps
* Go to the [Docker VM extension user guide](https://github.com/Azure/azure-docker-extension/blob/master/README.md) for more options to configure Docker and Compose in your Docker VM. For example, one option is to put the Compose yml file (converted to JSON) directly in the configuration of the Docker VM extension.
* Check out the [Compose command-line reference](http://docs.docker.com/compose/reference/) and [user guide](http://docs.docker.com/compose/) for more examples of building and deploying multi-container apps.
* Use an Azure Resource Manager template, either your own or one contributed from the [community](https://azure.microsoft.com/documentation/templates/), to deploy an Azure VM with Docker and an application set up with Compose. For example, the [Deploy a WordPress blog with Docker](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-wordpress-mysql) template uses Docker and Compose to quickly deploy WordPress with a MySQL backend on an Ubuntu VM.
* Try integrating Docker Compose with a [Docker Swarm](virtual-machines-linux-docker-swarm.md) cluster. See
  [Using Compose with Swarm](https://docs.docker.com/compose/swarm/) for scenarios.

<!--Image references-->

[wordpress_start]: ./media/virtual-machines-linux-docker-compose-quickstart/WordPress.png
