<properties
   pageTitle="Docker and Compose on a virtual machine | Microsoft Azure"
   description="Quick introduction to working with Compose and Docker on Linux virtual machines in Azure"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="06/10/2016"
   ms.author="danlep"/>

# Get Started with Docker and Compose to define and run a multi-container application on an Azure virtual machine

Get started using Docker and [Compose](http://github.com/docker/compose) to define and run a complex application on a Linux virtual machine in Azure. With Compose (the successor to *Fig*), you use a simple text file to define an application consisting of multiple Docker containers. Then you spin up your application in a single command which does everything to get it running on the VM. 

As an example, this article shows you how to quickly set up a WordPress blog with a backend MariaDB SQL database on an Ubuntu VM, but you can also use Compose to set up more complex applications.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Learn how to [perform these steps using the Resource Manager model](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-wordpress-mysql).

If you're new to Docker and containers, see the [Docker high level whiteboard](https://azure.microsoft.com/documentation/videos/docker-high-level-whiteboard/).

## Step 1: Set up a Linux VM as a Docker host

You can use a variety of Azure procedures and available images or Resource Manager templates in the Azure Markeplace to create a Linux VM and set it up as a Docker host. For example, see [Using the Docker VM Extension to deploy your environment](virtual-machines-linux-dockerextension.md) for a quick procedure to create an Ubuntu VM with the Azure Docker VM extension by using a [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu). When you use the Docker VM extension, your VM is automatically set up as a Docker host and Compose is already installed. The example in that article shows you how to use the the [Azure command-line interface for Mac, Linux, and Windows](../xplat-cli-install.md) (the Azure CLI) in Resource Manager mode to create the VM.

## Step 2: Verify that Compose is installed

After the Linux VM is running with Docker, connect to it from your client computer using SSH.

To test your installation of Compose on the VM, run the following command.

```
$ docker-compose --version
```

You will see output similar to `docker-compose 1.6.2, build 4d72027`.

>[AZURE.TIP] If you used another method to create a Docker host and need to install Compose yourself, see the [Compose documentation](https://github.com/docker/compose/blob/882dc673ce84b0b29cd59b6815cb93f74a6c4134/docs/install.md).


## Step 3: Create a docker-compose.yml configuration file

Next you'll create a `docker-compose.yml` file, which is just a text configuration file, to define the Docker containers to run on the VM. The file specifies the image to run on each container (or it could be a build from a Dockerfile), necessary environment variables and dependencies, ports, links between containers, and so on. For details on yml file syntax, see [Compose file reference](http://docs.docker.com/compose/yml/).

Create a working directory on your VM, and use your favorite text editor to create `docker-compose.yml`. To try a simple example for a proof of concept, copy the following text to the file. This configuration uses images from the [DockerHub Registry](https://registry.hub.docker.com/_/wordpress/) to install WordPress (the open source blogging and content management system) and a linked backend MariaDB SQL database.

 ```
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

In the working directory on your VM, simply run the following command. (Depending on your environment, you might need to run  `docker-compose` using `sudo`.)

```
$ docker-compose up -d

```

This starts the Docker containers specified in `docker-compose.yml`. You'll see output similar to:

```
Creating wordpress_db_1...
Creating wordpress_wordpress_1...
```

>[AZURE.NOTE] Be sure to use the **-d** option on start-up so that the containers run in the background continuously.

To verify that the containers are up, type `docker-compose ps`. You should see something like:

```
Name             Command             State              Ports
-------------------------------------------------------------------------
wordpress_db_1     /docker-           Up                 3306/tcp
             entrypoint.sh
             mysqld
wordpress_wordpr   /entrypoint.sh     Up                 0.0.0.0:80->80
ess_1              apache2-for ...                       /tcp
```

You can now connect to WordPress directly on the VM on port 80. If you used a Resource Manager template to create the VM, try connecting to `http://<dnsname>.<region>.cloudapp.azure.com` or, if you created the VM using the classic deployment model, try connecting to `http://<cloudservicename>.cloudapp.net`. You should now see the WordPress start screen, where you can complete the installation and get started with the application.

![WordPress start screen][wordpress_start]


## Next steps

* Go to the [Docker VM extension user guide](https://github.com/Azure/azure-docker-extension/blob/master/README.md) for more options to configure Docker and Compose in your Docker VM. For example, one option is to put the Compose yml file (converted to JSON) directly in the configuration of the Docker VM extension.
* Check out the [Compose command-line reference](http://docs.docker.com/compose/reference/) and [user guide](http://docs.docker.com/compose/) for more examples of building and deploying multi-container apps.
* Use an Azure Resource Manager template, either your own or one contributed from the [community](https://azure.microsoft.com/documentation/templates/), to deploy an Azure VM with Docker and an application set up with Compose. For example, the [Deploy a WordPress blog with Docker](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-wordpress-mysql) template uses Docker and Compose to quickly deploy WordPress with a MySQL backend on an Ubuntu VM.
* Try integrating Docker Compose with a [Docker Swarm](virtual-machines-linux-docker-swarm.md) cluster. See
[Using Compose with Swarm](https://docs.docker.com/compose/swarm/) for scenarios.

<!--Image references-->

[wordpress_start]: ./media/virtual-machines-linux-docker-compose-quickstart/WordPress.png
