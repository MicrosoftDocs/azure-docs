<properties
   pageTitle="Docker and Compose on a virtual machine | Microsoft Azure"
   description="Quick introduction to working with Compose and Docker on Linux virtual machines in Azure"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""
   tags="azure-service-management"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="03/02/2016"
   ms.author="danlep"/>

# Get Started with Docker and Compose to define and run a multi-container application on an Azure virtual machine

Get started using Docker and [Compose](http://github.com/docker/compose) to define and run a complex application on a Linux virtual machine in Azure. With Compose (the successor to *Fig*), you use a simple text file to define an application consisting of multiple Docker containers. Then you spin up your application in a single command which does everything to get it running on the VM. 

As an example, this article shows you how to quickly set up a WordPress blog with a backend MariaDB SQL database, but you can also use Compose to set up more complex applications.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-wordpress-mysql).


If you're new to Docker and containers, see the [Docker high level whiteboard](https://azure.microsoft.com/documentation/videos/docker-high-level-whiteboard/).

## Step 1: Set up a Linux VM as a Docker host

You can use a variety of Azure procedures and available images in the Azure Markeplace to create a Linux VM and set it up as a Docker host. For example, see [Using the Docker VM Extension from the Azure Command-Line Interface](virtual-machines-linux-classic-cli-use-docker.md) for a quick procedure to create an Ubuntu VM with the Docker VM extension. When you use the Docker VM extension, your VM is automatically set up as a Docker host. The example in that article shows you how to use the the [Azure command-line interface for Mac, Linux, and Windows](../xplat-cli-install.md) (the Azure CLI) in Service Management mode to create the VM.

## Step 2: Install Compose

After the Linux VM is running with Docker, connect to it from your client computer using SSH. If you need to, install [Compose](https://github.com/docker/compose/blob/882dc673ce84b0b29cd59b6815cb93f74a6c4134/docs/install.md) by running the following two commands.

>[AZURE.TIP] If you used the Docker VM extension to create your VM, Compose is already installed for you. Skip these commands and go to Step 3. You only need to install Compose if you installed Docker on the VM yourself.

```
$ curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

$ chmod +x /usr/local/bin/docker-compose
```
>[AZURE.NOTE]If you get a "Permission denied" error, your /usr/local/bin directory on the VM probably isn't writable and you'll need to install Compose as the superuser. Run `sudo -i`, then the two commands above, then `exit`.

To test your installation of Compose, run the following command.

```
$ docker-compose --version
```

You will see output similar to `docker-compose 1.5.1`.


## Step 3: Create a docker-compose.yml configuration file

Next you'll create a `docker-compose.yml` file, which is just a text configuration file, to define the Docker containers to run on the VM.  The file specifies the image to run on each container (or it could be a build from a Dockerfile), necessary environment variables and dependencies, ports, links between containers, and so on. For details on yml file syntax, see [docker-compose.yml reference](http://docs.docker.com/compose/yml/).

Create a working directory on your VM, and use your favorite text editor to create `docker-compose.yml`. To try a simple example, copy the following text to the file. This configuration uses images from the [DockerHub Registry](https://registry.hub.docker.com/_/wordpress/) to install WordPress (the open source blogging and content management system) and a linked backend MariaDB SQL database.

 ```
 wordpress:
  image: wordpress
  links:
    - db:mysql
  ports:
    - 8080:80

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
wordpress_wordpr   /entrypoint.sh     Up                 0.0.0.0:8080->80
ess_1              apache2-for ...                       /tcp
```

You can now connect to WordPress directly on the VM by browsing to `http://localhost:8080`. If you want to connect to the VM over the Internet, first configure an HTTP endpoint on the VM that maps public port 80 to private port 8080. For example, if you created the VM using the classic deployment model, run the following Azure CLI command:

```
$ azure vm endpoint create <machine-name> 80 8080

```

If you try connecting to `http://<cloudservicename>.cloudapp.net`, you should now see the WordPress start screen, where you can complete the installation and get started with the application.

![WordPress start screen][wordpress_start]


## Next steps

* Go to the [Docker VM extension user guide](https://github.com/Azure/azure-docker-extension/blob/master/README.md) for more options to configure Docker and Compose in your Docker VM.
* Check out the [Compose CLI reference](http://docs.docker.com/compose/reference/) and [user guide](http://docs.docker.com/compose/) for more examples of building and deploying multi-container apps.
* Use an Azure Resource Manager template, either your own or one contributed from the [community](https://azure.microsoft.com/documentation/templates/), to deploy an Azure VM with Docker and an application set up with Compose. For example, the [Deploy a WordPress blog with Docker](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-wordpress-mysql) template uses Docker and Compose to quickly deploy WordPress with a MySQL backend on an Ubuntu VM.
* Try integrating Docker Compose with a [Docker Swarm](virtual-machines-linux-docker-swarm.md) cluster. See
[Using Swarm with Compose](https://docs.docker.com/compose/swarm/) for scenarios.

<!--Image references-->

[wordpress_start]: ./media/virtual-machines-linux-docker-compose-quickstart/WordPress.png
