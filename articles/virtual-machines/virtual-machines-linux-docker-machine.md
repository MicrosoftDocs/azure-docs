<properties
	pageTitle="Create Docker hosts in Azure with Docker Machine | Microsoft Azure"
	description="Describes use of Docker Machine to create docker hosts in Azure."
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
	ms.date="07/22/2016"
	ms.author="rasquill"/>

# Use Docker Machine with the Azure driver

[Docker](https://www.docker.com/) is one of the most popular virtualization approaches that uses Linux containers rather than virtual machines as a way of isolating application data and computing on shared resources. This topic describes when and how to use [Docker Machine](https://docs.docker.com/machine/) (the `docker-machine` command) to create new Linux VMs in Azure enabled as a docker host for your Linux containers.


## Create VMs with Docker Machine

Create docker host VMs in Azure with the `docker-machine create` command using the `azure` driver argument for the driver option (`-d`) and any other arguments. 

The following example relies upon the default values, but it does open port 80 on the VM to the internet to test with an nginx container, makes `ops` the logon user for SSH, and calls the new VM `machine`. 

Type `docker-machine create --driver azure` to see the options and their default values; you can also read the [Docker Azure Driver documentation](https://docs.docker.com/machine/drivers/azure/). (Note that if you have two-factor authentication enabled, you will be prompted to authenticate using the second factor.)

```bash
docker-machine create -d azure \
  --azure-ssh-user ops \
  --azure-subscription-id <Your AZURE_SUBSCRIPTION_ID> \
  --azure-open-port 80 \
  machine
```

The output should look something like this, depending upon whether you have two-factor authentication configured in your account.

```
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

## Configure your docker shell

Now, type `docker-machine env <VM name>` to see what you need to do to configure the shell. 

```bash
docker-machine env machine
```

That prints the environment information, which looks something like this. Note the IP address has been assigned, which you'll need to test the VM.

```
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://191.237.46.90:2376"
export DOCKER_CERT_PATH="/Users/rasquill/.docker/machine/machines/machine"
export DOCKER_MACHINE_NAME="machine"
# Run this command to configure your shell:
# eval $(docker-machine env machine)
```

You can either run the suggested configuration command, or you can set the environment variables yourself. 

## Run a container

Now you can run a simple web server to test whether all works correctly. Here we use a standard nginx image, specify that it should listen on port 80, and that if the VM restarts the container should restart as well (`--restart=always`). 

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

And check to see the running container, type `docker-machine ip <VM name>` to find the IP address (if you forgot from the `env` command):

![Running ngnix container](./media/virtual-machines-linux-docker-machine/nginxsuccess.png)

## Next steps

If you're interested, you can try out the Azure [Docker VM Extension](virtual-machines-linux-dockerextension.md) to do the same operation using the Azure CLI or Azure resource manager templates. 

For more examples of working with Docker, see [Working with Docker](https://github.com/Microsoft/HealthClinic.biz/wiki/Working-with-Docker) from the [HealthClinic.biz](https://github.com/Microsoft/HealthClinic.biz) 2015 Connect [demo](https://blogs.msdn.microsoft.com/visualstudio/2015/12/08/connectdemos-2015-healthclinic-biz/). For more quickstarts from the HealthClinic.biz demo, see [Azure Developer Tools Quickstarts](https://github.com/Microsoft/HealthClinic.biz/wiki/Azure-Developer-Tools-Quickstarts).

