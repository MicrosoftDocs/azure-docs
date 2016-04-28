<properties
   pageTitle="Learn about different deployment methods for Docker on Azure | Microsoft Azure"
   description="Article description that will be displayed on landing pages and in most search results"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="iainfoulds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="04/27/2016"
   ms.author="iainfou"/>

# Deployment methods for Docker on Azure

Docker is a popular container management and imaging platform that allows you to quickly work with containers on Linux. Within Azure, you have the flexibility to deploy Azure in a few different manners depending on your needs. This article explores the three most common deployment scenarios along with use cases for each.


## Docker Machine for small development needs

If you are wanting to quickly prototype an application or spin up a small test environment, Docker Machine provides a driver that connects to your Azure subscription. This allows you to easily create a Docker host running on Azure and manage it using native Docker tools from your local machine.

### Quick steps for using Docker Machine:

```
docker-machine create -d azure \
  --azure-ssh-user ops \
  --azure-subscription-id <Your AZURE_SUBSCRIPTION_ID> \
  --azure-open-port 80 \
  myDockerHost
```

Check the suggested environmental variables to connect to your new Docker host with `docker-machine env myDockerHost` and if desired, set them as suggested with `eval $(docker-machine env myDockerHost)`

Now let's try spinning up an nginx container on our new Docker host:

```
docker run -d -p 80:80 nginx
```

Open up a web browser to see your container in action (if you need the IP address again, use `docker-machine ip myDockerHost`). You can also view the running containers on the host with `docker ps`.

More detailed walkthrough on using Docker Machine - [Use Docker Machine with the Azure driver](./virtual-machines-linux-docker-machine.md)


## Azure Docker VM Extension for template deployments

The Azure Docker VM Extension installs Docker in your Linux host VM and configures it for you, quickly providing a Docker host for you to access that can then re-deployed in a consistent fashion. Using the Azure Docker VM Extension is well suited for a more robust developer or production environments as you have some additional controls over simply using Docker Machine.

Using Azure Resource Manager, you can create and deploy templates that define the entire structure of your environment, such as the Docker hosts, storage, Role Based Access Controls (RBAC), diagnostics, etc. You can [read more about Resource Manager](../resource-group-overview.md) and templates to better understand some of the benefits. The advantage of using Resource Manager templates over simply using Docker Machine is that you can define out additional Docker hosts, storage, access controls, etc. and be able to reproduce the deployments as needed in the future. 

### Quick steps for using the Docker VM Extension:

We'll use an existing quick-start template to show how to deploy an Ubuntu VM which has the Docker VM Extension installed. You can view the template here: [Simple deployment of an Ubuntu VM with Docker](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu)

We deploy our template using the Azure CLI, specifying a name for our new resource group (here `myDockerResourceGroup`) along with the template URI:

```
azure group create --name myDockerResourceGroup --location "West US" \
  --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/docker-simple-on-ubuntu/azuredeploy.json \
```

Answer the prompts for naming your storage account, DNS name, username, etc. and then give it a few minutes to finish the deployment. Once finished, SSH to your new Docker host and then try to spin up an nginx container:

```
docker run -d -p 80:80 nginx
```
Open up a web browser and enter the DNS name you specified during deployment to see your container in action. You can also view the running containers on the host with `docker ps`.

If you want to use your local Docker tools to manage your deployed hosts, configure the certificates appropriately.

For reference, you can use your own existing Resource Manager templates and add the Docker VM Extension by adding the following to your JSON definition file:

```
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "[concat(variables('vmName'), '/DockerExtension'))]",
  "apiVersion": "2015-05-01-preview",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
  ],
  "properties": {
    "publisher": "Microsoft.Azure.Extensions",
    "type": "DockerExtension",
    "typeHandlerVersion": "1.1",
    "autoUpgradeMinorVersion": true,
    "settings": {},
    "protectedSettings": {}
  }
}
```

More detailed walkthrough on using Resource Manager templates - [Azure Resource Manager overview](../resource-group-overview.md)


## Azure Container Services for production-ready, scalable deployments

Docker Swarm can be used as part of an Azure Container Services (ACS) deployment which provides for a more distributed and fault tolerant Docker environment, including load balancers, scale sets, and multiple Docker agents servicing your applications. Using ACS is more suited for larger, scalable apps needing a production-ready environment.

### Quick steps for using Docker Swarm on Azure Container Services:

Again, we'll use an existing quick-start template to show how to deploy a Docker Swarm cluster on ACS. You can view the template here: [Azure Container Service with Docker Swarm](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-swarm).

Create our deployment in to a new resource group, here named `myACSDockerSwarm`:

```
azure group create --name myDockerResourceGroup --location "West US" \
  --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-acs-swarm/azuredeploy.json \
```
Answer the prompts for DNS name and SSH key, and then give it a few minutes to finish the deployment after the Azure CLI reports back as being successful before trying to connect.

Now let's set up a SSH tunnel to our new Swarm endpoint and then configure a DOCKER_HOST variable to allow us to use our local Docker tools:

```
ssh -L 2375:localhost:2375 -N azureuser@acsswarm.westus.cloudapp.azure.com -p 2200
export DOCKER_HOST=:2375
```

So now, once more, let's try spinning up an nginx container running within our ACS deployment:

```
docker run -d -p 80:80 nginx
```

Open up a web browser and enter the DNS of the Swarm agents to see your container in action. You can also view the running containers on the host with `docker ps`.

More detailed walkthrough on using Docker Swarm on Azure Container Services - [Deploy an Azure Container Service cluster](../container-service/container-service-deployment.md)



## Next steps

Read more detailed steps for the different deployment options:
  1. [Use Docker Machine with the Azure driver](./virtual-machines-linux-docker-machine.md)
  2. [Using the Docker VM Extension from the Azure Command-line Interface (Azure CLI)](./virtual-machines-linux-classic-cli-use-docker.md)
  3. [Deploy an Azure Container Service cluster](./container-service/container-service-deployment.md)
