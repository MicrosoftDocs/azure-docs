---
title: Use Docker Compose on a Linux VM in Azure | Microsoft Docs
description: How to use Docker and Compose on Linux virtual machines with the Azure CLI
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 02ab8cf9-318d-4a28-9d0c-4a31dccc2a84
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 12/18/2017
ms.author: cynthn

---
# Get started with Docker and Compose to define and run a multi-container application in Azure
With [Compose](http://github.com/docker/compose), you use a simple text file to define an application consisting of multiple Docker containers. You then spin up your application in a single command that does everything to deploy your defined environment. As an example, this article shows you how to quickly set up a WordPress blog with a backend MariaDB SQL database on an Ubuntu VM. You can also use Compose to set up more complex applications.


## Set up a Linux VM as a Docker host
You can use various Azure procedures and available images or Resource Manager templates in the Azure Marketplace to create a Linux VM and set it up as a Docker host. For example, see [Using the Docker VM Extension to deploy your environment](dockerextension.md) to quickly create an Ubuntu VM with the Azure Docker VM extension by using a [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu). 

When you use the Docker VM extension, your VM is automatically set up as a Docker host and Compose is already installed.


### Create Docker host with Azure CLI
Install the latest [Azure CLI](/cli/azure/install-az-cli2) and log in to an Azure account using [az login](/cli/azure/reference-index#az_login).

First, create a resource group for your Docker environment with [az group create](/cli/azure/group#az_group_create). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli
az group create --name myResourceGroup --location eastus
```

Next, deploy a VM with [az group deployment create](/cli/azure/group/deployment#az_group_deployment_create) that includes the Azure Docker VM extension from [this Azure Resource Manager template on GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu). When prompted, provide your own unique values for *newStorageAccountName*, *adminUsername*, *adminPassword*, and *dnsNameForPublicIP*:

```azurecli
az group deployment create --resource-group myResourceGroup \
    --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/docker-simple-on-ubuntu/azuredeploy.json
```

It takes a few minutes for the deployment to finish.


## Verify that Compose is installed
To view details of your VM, including the DNS name, use [az vm show](/cli/azure/vm#az_vm_show):

```azurecli
az vm show \
    --resource-group myResourceGroup \
    --name myDockerVM \
    --show-details \
    --query [fqdns] \
    --output tsv
```

SSH to your new Docker host. Provide your own username and DNS name from the preceding steps:

```bash
ssh azureuser@mypublicdns.eastus.cloudapp.azure.com
```

To check that Compose is installed on the VM, run the following command:

```bash
docker-compose --version
```

You see output similar to *docker-compose 1.6.2, build 4d72027*.

> [!TIP]
> If you used another method to create a Docker host and need to install Compose yourself, see the [Compose documentation](https://github.com/docker/compose/blob/882dc673ce84b0b29cd59b6815cb93f74a6c4134/docs/install.md).


## Create a docker-compose.yml configuration file
Next you create a `docker-compose.yml` file, which is just a text configuration file, to define the Docker containers to run on the VM. The file specifies the image to run on each container (or it could be a build from a Dockerfile), necessary environment variables and dependencies, ports, and the links between containers. For details on yml file syntax, see [Compose file reference](https://docs.docker.com/compose/compose-file/).

Create a *docker-compose.yml* file. Use your favorite text editor to add some data to the file. The following example creates the file with a prompt for `sensible-editor` to pick an editor that you wish to use:

```bash
sensible-editor docker-compose.yml
```

Paste the following example into your Docker Compose file. This configuration uses images from the [DockerHub Registry](https://registry.hub.docker.com/_/wordpress/) to install WordPress (the open source blogging and content management system) and a linked backend MariaDB SQL database. Enter your own *MYSQL_ROOT_PASSWORD* as follows:

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

## Start the containers with Compose
In the same directory as your *docker-compose.yml* file, run the following command (depending on your environment, you might need to run `docker-compose` using `sudo`):

```bash
docker-compose up -d
```

This command starts the Docker containers specified in *docker-compose.yml*. It takes a minute or two for this step to complete. You see output similar to the following example:

```bash
Creating wordpress_db_1...
Creating wordpress_wordpress_1...
...
```

> [!NOTE]
> Be sure to use the **-d** option on start-up so that the containers run in the background continuously.


To verify that the containers are up, type `docker-compose ps`. You should see something like:

```bash
        Name                       Command               State         Ports
-----------------------------------------------------------------------------------
azureuser_db_1          docker-entrypoint.sh mysqld      Up      3306/tcp
azureuser_wordpress_1   docker-entrypoint.sh apach ...   Up      0.0.0.0:80->80/tcp
```

You can now connect to WordPress directly on the VM on port 80. Open a web browser and enter the DNS name of your VM (such as `http://mypublicdns.eastus.cloudapp.azure.com`). You should now see the WordPress start screen, where you can complete the installation and get started with the application.

![WordPress start screen][wordpress_start]

## Next steps
* Go to the [Docker VM extension user guide](https://github.com/Azure/azure-docker-extension/blob/master/README.md) for more options to configure Docker and Compose in your Docker VM. For example, one option is to put the Compose yml file (converted to JSON) directly in the configuration of the Docker VM extension.
* Check out the [Compose command-line reference](http://docs.docker.com/compose/reference/) and [user guide](http://docs.docker.com/compose/) for more examples of building and deploying multi-container apps.
* Use an Azure Resource Manager template, either your own or one contributed from the [community](https://azure.microsoft.com/documentation/templates/), to deploy an Azure VM with Docker and an application set up with Compose. For example, the [Deploy a WordPress blog with Docker](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-wordpress-mysql) template uses Docker and Compose to quickly deploy WordPress with a MySQL backend on an Ubuntu VM.
* Try integrating Docker Compose with a Docker Swarm cluster. See
  [Using Compose with Swarm](https://docs.docker.com/compose/swarm/) for scenarios.

<!--Image references-->

[wordpress_start]: media/docker-compose-quickstart/WordPress.png
