<properties
   pageTitle="Get Started with Docker and Compose on an Azure Virtual Machines"
   description="Quick introduction to working with Compose and Docker on Azure"
   services="virtual-machines"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="05/07/2015"
   ms.author="danlep"/>

# Get Started with Docker and Compose on an Azure Virtual Machine


You can quickly get started using [Compose](http://github.com/docker/compose) (the successor to *Fig*) to define and run complex applications with Docker on a Linux virtual machine in Azure. With Compose, you define a multi-container application in a single file, then spin your application up in a single command which does everything to get it running on the VM.




## Create an Azure VM with the Docker VM extension and install Compose

You can use a variety of Azure procedures and available images in the Azure Markeplace to create an Azure VM and install Docker and Compose on it. For example, see [Using the Docker VM Extension from the Azure Command-Line Interface](virtual-machines-docker-with-xplat-cli) for a quick procedure to create an Ubuntu VM with the Docker VM extension using the Azure command-line interface for Mac, Linux, and Windows (the Azure CLI). The example in that article uses the CLI in Service Management (**asm**) mode.


After the Ubuntu VM is running with Docker, connect to it using SSH and then install [Compose](https://github.com/docker/compose/blob/882dc673ce84b0b29cd59b6815cb93f74a6c4134/docs/install.md) by running two commands:

```
curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose
```
>[AZURE.NOTE]If you get a "Permission denied" error, your /usr/local/bin directory probably isn't writable and you'll need to install Compose as the superuser. Run `sudo -i`, then the two commands above, then `exit`.

To test your installation of Compose, run

```
docker-compose --version
```

You will see output similar to
```
docker-compose 1.2.0
```


## Create a docker-compose.yml configuration file

Compose uses a text configuration file called `docker-compose.yml` to define the containers that will run on the VM.  The file specifies the image to run on each container (or it could be a build from a Dockerfile), necessary environment variables and dependencies, ports, links between containers, and so on. For details on yml file syntax, see [docker-compose.yml reference](http://docs.docker.com/compose/yml/).

Create a working directory on your VM, and use your favorite text editor to create `docker-compose.yml`. To try a simple example, copy the following text to the file. This configuration installs WordPress (the open source blogging and content management system) and a linked backend MariaDB SQL database using images from the [DockerHub Registry](https://registry.hub.docker.com/_/wordpress/).

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

## Start the containers with Compose

In your working directory simply run

```
docker-compose up -d

```

to start the Docker containers specified in `docker-compose.yml`. You'll see output similar to:

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

You can now connect to WordPress directly on the VM by browsing to `http://localhost:8080`. If you want to connect to the VM over the Internet, first configure an HTTP endpoint on the VM that maps public port 80 to private port 8080. For example, run the following Azure CLI command:

```
azure vm endpoint create <machine-name> 80 8080

```

You should now see the WordPress start screen, where you can complete the installation.

![WordPress start screen][wordpress_start]




## Next steps

* Check out the [Compose command reference](http://docs.docker.com/compose/cli/) and [user guide](http://docs.docker.com/compose/) for more examples of building and deploying multi-container apps.
* Try integrating Docker Compose with a [Docker Swarm](virtual-machines-docker-swarm.md) cluster. See
[Docker Compose/Swarm integration](https://github.com/docker/compose/blob/master/SWARM.md) for scenarios.
* Use an Azure Resource Manager template, either your own or one contributed from the [community](http://azure.microsoft.com/documentation/templates/), to deploy an Azure VM with Docker and an application set up with Compose. For example, the [Ubuntu VM with Docker and three containers template](http://azure.microsoft.com/documentation/templates/docker-simple-on-ubuntu/) helps you quickly deploy three services from images in the [DockerHub Registry](https://registry.hub.docker.com/).

<!--Image references-->

[wordpress_start]: ./media/virtual-machines-docker-compose-quickstart/WordPress.png
 