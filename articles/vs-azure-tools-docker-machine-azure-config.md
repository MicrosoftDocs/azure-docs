<properties
   pageTitle="Create Docker hosts in Azure with Docker Machine | Microsoft Azure"
   description="Describes use of Docker Machine to create docker hosts in Azure."
   services="azure-container-service"
   documentationCenter="na"
   authors="allclark"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="06/08/2016"
   ms.author="allclark;stevelas" />

# Create Docker Hosts in Azure with Docker-Machine

Running [Docker](https://www.docker.com/) containers requires a host VM running the docker daemon.
This topic describes how to use the [docker-machine](https://docs.docker.com/machine/) command
to create new Linux VMs, configured with the Docker daemon, running in Azure. 

**Note:** 
- *This article depends on docker-machine version 0.7.0 or greater*
- *Windows Containers will be supported through docker-machine in the near future*

## Create VMs with Docker Machine

Create docker host VMs in Azure with the `docker-machine create` command using the `azure` driver. 

The Azure driver will need your subscription ID. You can use the [Azure CLI](xplat-cli-install.md)
or the [Azure Portal](https://portal.azure.com) to retrieve your Azure Subscription. 

**Using the Azure Portal**
- Select Subscriptions from the left navigation page, and copy to subscription id.

**Using the Azure CLI**
- Type ```azure account list``` and copy the subscription id.

Type `docker-machine create --driver azure` to see the options and their default values.
You can also see the [Docker Azure Driver documentation](https://docs.docker.com/machine/drivers/azure/) for more info. 

The following example relies upon the default values, but it does optionally open port 80 on the VM for internet access. 

```
docker-machine create -d azure --azure-subscription-id <Your AZURE_SUBSCRIPTION_ID> --azure-open-port 80 mydockerhost
```

## Choose a docker host with docker-machine
Once you have an entry in docker-machine for your host, you can set the default host when running docker commands.
##Using PowerShell

```powershell
docker-machine env MyDockerHost | Invoke-Expression 
```

##Using Bash

```bash
eval $(docker-machine env MyDockerHost)
```

You can now run docker commands against the specified host

```
docker ps
docker info
```

## Run a container

With a host configured, you can now run a simple web server to test whether your host was configured correctly.
Here we use a standard nginx image, specify that it should listen on port 80, and that if the host VM restarts, the container will restart as well (`--restart=always`). 

```bash
docker run -d -p 80:80 --restart=always nginx
```

The output should look something like the following:

```
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
efd26ecc9548: Pull complete
a3ed95caeb02: Pull complete
83f52fbfa5f8: Pull complete
fa664caa1402: Pull complete
Digest: sha256:12127e07a75bda1022fbd4ea231f5527a1899aad4679e3940482db3b57383b1d
Status: Downloaded newer image for nginx:latest
25942c35d86fe43c688d0c03ad478f14cc9c16913b0e1c2971cb32eb4d0ab721
```

## Test the container

Examine running containers using `docker ps`:

```bash
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                         NAMES
d5b78f27b335        nginx               "nginx -g 'daemon off"   5 minutes ago       Up 5 minutes        0.0.0.0:80->80/tcp, 443/tcp   goofy_mahavira
```

And check to see the running container, type `docker-machine ip <VM name>` to find the IP address to enter in the browser:

```
PS C:\> docker-machine ip MyDockerHost
191.237.46.90
```

![Running ngnix container](./media/vs-azure-tools-docker-machine-azure-config/nginxsuccess.png)

##Summary
With docker-machine you can easily provision docker hosts in Azure for your individual docker host validations.
For production hosting of containers, see the [Azure Container Service](http://aka.ms/AzureContainerService)

To develop .NET Core Applications with Visual Studio, see [Docker Tools for Visual Studio](http://aka.ms/DockerToolsForVS)