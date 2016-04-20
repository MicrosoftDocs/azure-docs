<properties
	pageTitle="Create Docker hosts in Azure"
	description="Describes use of docker-machine and the Docker VM Extension to create docker hosts in Azure."
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

[Docker](https://www.docker.com/) is one of the most popular virtualization approaches that uses [Linux containers](http://en.wikipedia.org/wiki/LXC) rather than virtual machines as a way of isolating application data and computing on shared resources. This topic discusses using both `docker-machine` and the [Azure Docker VM extension](https://github.com/Azure/azure-docker-extension/blob/master/README.md) to create new Linux VMs in Azure enabled as a docker host for your Linux containers.

## Comparing docker-machine and the DockerVMExtension

The main difference between the open source `docker-machine` client and the Docker VM Extension is in deployment and management. `docker-machine` is a manual tool that makes it easy to create, examine, and destroy docker hosts whether they're local or in the cloud. However, because `docker-machine` is outside of the Azure deployment system, the Azure resource manager deployment model does not know about any VM that `docker-machine` has created.

The Docker VM Extension creates new docker hosts as part of the Azure resource management system, and thus can be used from Azure templates as part of a larger deployment system. 

## Create VMs with docker-machine

Create docker host VMs in Azure with the `docker-machine create` command using the `azure` driver argument for the driver option (`-d`) and following the prompts. Your experience should look something like the following.

```bash
docker-machine create -d azure \ 
--azure-subscription-id \
--azure-ssh-user ops \
--azure-resource-group ahmetsmachine \
--azure-location eastus \
ahmetsmachine
Running pre-create checks...
(ahmetsmachine) Microsoft Azure: To sign in, use a web browser to open the page https://aka.ms/devicelogin. Enter the code to authenticate.
(ahmetsmachine) Completed machine pre-create checks.
Creating machine...
(ahmetsmachine) Querying existing resource group... name="ahmetsmachine"
(ahmetsmachine) Creating resource group... location="eastus" name="ahmetsmachine"
(ahmetsmachine) Creating availability set... name="docker-machine"
(ahmetsmachine) Creating network security group... name="ahmetsmachine-firewall" location="eastus"
(ahmetsmachine) Querying if virtual network already exists... name="docker-machine-vnet" location="eastus"
(ahmetsmachine) Creating subnet... cidr="" name="docker-machine" vnet="docker-machine-vnet"
(ahmetsmachine) Creating public IP address... name="ahmetsmachine-ip"
(ahmetsmachine) Creating network interface... name="ahmetsmachine-nic"
(ahmetsmachine) Creating storage account "" in eastus
(ahmetsmachine) Creating Virtual Machine... name="ahmetsmachine" location="eastus" size="Standard_A2" username="ops" osImage="canonical:UbuntuServer:14.04.3-LTS:latest"
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with ubuntu(upstart)...
Installing Docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env ahmetsmachine
```

## Create VMs with the Docker VM Extension

The main way to use the Docker VM Extension to create a docker host in Azure is to use an Azure resource manager template. (You can deploy a template either from the Azure CLI or in the Azure portal; the following example uses the Azure CLI.)

```bash
azure group create \
--name dockerextensiontemplate \
-l eastus \
--template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json
```
