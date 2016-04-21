<properties
	pageTitle="Create Docker hosts in Azure"
	description="Describes use of docker-machine to create docker hosts in Azure."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="squillace"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="virtual-machines-linux"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-linux"
	ms.workload="infrastructure-services"
	ms.date="04/20/2016"
	ms.author="rasquill"/>

# Create docker hosts in Azure

[Docker](https://www.docker.com/) is one of the most popular virtualization approaches that uses [Linux containers](http://en.wikipedia.org/wiki/LXC) rather than virtual machines as a way of isolating application data and computing on shared resources. This topic when and how to use `docker-machine` to create new Linux VMs in Azure enabled as a docker host for your Linux containers.

## Comparing docker-machine and the Azure Docker VM Extension

The main difference between the open source `docker-machine` client and the new [resource manager Azure driver](https://docs.docker.com/machine/drivers/azure/) and the [Docker VM Extension](virtual-machines-linux-dockerextension.md) is in deployment and management.

1. `docker-machine` is outside of the Azure deployment system, so resources it creates or modifies are known only to `docker-machine`.
2. The Docker VM extension is a formal part of the Azure deployment system, and as such can be controlled, described in Azure templates, tagged for various purposes, and so on as part of the Azure infrastructure.

As a result, if you know and love using `docker-machine`, you'll feel comfortable continuing to use that. If you would like to use the Azure resource manager deployment system, templates, you can use the Docker VM extension. You can choose the tool that suits your needs.


## Create VMs with docker-machine

Create docker host VMs in Azure with the `docker-machine create` command using the `azure` driver argument for the driver option (`-d`) and following the prompts. The following example relies upon the default values, but it does open port 80 on the VM to the internet to test with an nginx container. Type `docker-machine create --driver azure` to see the options and their default values. (Note that if you have two-factor authentication enabled, you will be prompted to authenticate using the second factor.)

```bash
docker-machine create -d azure \
--azure-ssh-user ops \
--azure-subscription-id <Your AZURE_SUBSCRIPTION_ID> \
--azure-resource-group machine \
--azure-location eastus \
--azure-open-port 80 \
machine
Creating CA: /Users/user/.docker/machine/certs/ca.pem
Creating client certificate: /Users/user/.docker/machine/certs/cert.pem
Running pre-create checks...
(machine) Microsoft Azure: To sign in, use a web browser to open the page https://aka.ms/devicelogin. Enter the code <code> to authenticate.
(machine) Completed machine pre-create checks.
Creating machine...
(machine) Querying existing resource group.  name="machine"
(machine) Creating resource group.  name="machine" location="eastus"
(machine) Configuring availability set.  name="docker-machine"
(machine) Configuring network security group.  name="machine-firewall" location="eastus"
(machine) Querying if virtual network already exists.  name="docker-machine-vnet" location="eastus"
(machine) Configuring subnet.  name="docker-machine" vnet="docker-machine-vnet" cidr="192.168.0.0/16"
(machine) Creating public IP address.  name="machine-ip" static=false
(machine) Creating network interface.  name="machine-nic"
(machine) Creating storage account.  name="vhdsolksdjalkjlmgyg6" location="eastus"
(machine) Creating virtual machine.  name="machine" location="eastus" size="Standard_A2" username="ops" osImage="canonical:UbuntuServer:15.10:latest"
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with ubuntu(systemd)...
Installing Docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env machine
```

Now, type `docker-machine env <VM name>` to point the docker environment variables at the newly created VM, and list the machines:

```bash
docker-machine ls
NAME      ACTIVE   DRIVER   STATE     URL                        SWARM   DOCKER    ERRORS
machine   *        azure    Running   tcp://191.237.46.90:2376           v1.11.0
```

## Run a container

Now you can run a simple web server to test whether all works correctly.

```bash
docker run -d -p 80:80 nginx
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

And check to see the running container:

![Running ngnix container](./media/virtual-machines-linux-docker-machine/nginxsuccess.png)

## Next steps

If you're interested, you can try out the Azure [Docker VM Extension](virtual-machines-linux-dockerextension.md) to do the same thing. 

