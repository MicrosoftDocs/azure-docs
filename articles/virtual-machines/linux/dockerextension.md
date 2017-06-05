---
title: Use the Azure Docker VM extension | Microsoft Docs
description: Learn how to use the Docker VM extension to quickly and securely deploy a Docker environment in Azure using Resource Manager templates and the Azure CLI 2.0
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''

ms.assetid: 936d67d7-6921-4275-bf11-1e0115e66b7f
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/11/2017
ms.author: iainfou

---
# Create a Docker environment in Azure using the Docker VM extension
Docker is a popular container management and imaging platform that allows you to quickly work with containers on Linux. In Azure, there are various ways you can deploy Docker according to your needs. This article focuses on using the Docker VM extension and Azure Resource Manager templates with the Azure CLI 2.0. You can also perform these steps with the [Azure CLI 1.0](dockerextension-nodejs.md).

## Azure Docker VM extension overview
The Azure Docker VM extension installs and configures the Docker daemon, Docker client, and Docker Compose in your Linux virtual machine (VM). By using the Azure Docker VM extension, you have more control and features than simply using Docker Machine or creating the Docker host yourself. These additional features, such as [Docker Compose](https://docs.docker.com/compose/overview/), make the Azure Docker VM extension suited for more robust developer or production environments.

For more information about the different deployment methods, including using Docker Machine and Azure Container Services, see the following articles:

* To quickly prototype an app, you can create a single Docker host using [Docker Machine](docker-machine.md).
* To build production-ready, scalable environments that provide additional scheduling and management tools, you can deploy a [Docker Swarm cluster on Azure Container Services](../../container-service/container-service-deployment.md).

## Deploy a template with the Azure Docker VM extension
Let's use an existing quickstart template to create an Ubuntu VM that uses the Azure Docker VM extension to install and configure the Docker host. You can view the template here: [Simple deployment of an Ubuntu VM with Docker](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu). You need the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/#login).

First, create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named *myResourceGroup* in the *westus* location:

```azurecli
az group create --name myResourceGroup --location westus
```

Next, deploy a VM with [az group deployment create](/cli/azure/group/deployment#create) that includes the Azure Docker VM extension from [this Azure Resource Manager template on GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu). Provide your own values for *newStorageAccountName*, *adminUsername*, *adminPassword*, and *dnsNameForPublicIP* as follows:

```azurecli
az group deployment create --resource-group myResourceGroup \
  --parameters '{"newStorageAccountName": {"value": "mystorageaccount"},
    "adminUsername": {"value": "azureuser"},
    "adminPassword": {"value": "P@ssw0rd!"},
    "dnsNameForPublicIP": {"value": "mypublicdns"}}' \
  --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/docker-simple-on-ubuntu/azuredeploy.json
```

It takes a few minutes for the deployment to finish. Once the deployment is finished, [move to next step](#deploy-your-first-nginx-container) to SSH to your VM. 

Optionally, to instead return control to the prompt and let the deployment continue in the background, add the `--no-wait` flag to the preceding command. This process allows you to perform other work in the CLI while the deployment continues for a few minutes. 

You can then view details about the Docker host status with [az vm show](/cli/azure/vm#show). The following example checks the status of the VM named *myDockerVM* (the default name from the template - don't change this name) in the resource group named *myResourceGroup*:

```azurecli
az vm show \
    --resource-group myResourceGroup \
    --name myDockerVM \
    --query [provisioningState] \
    --output tsv
```

When this command returns *Succeeded*, the deployment has finished and you can SSH to the VM in the following step.

## Deploy your first nginx container
To view details of your VM, including the DNS name, use `az vm show -g myResourceGroup -n myDockerVM -d --query [fqdns] -o tsv`. SSH to your new Docker host from your local computer as follows:

```bash
ssh azureuser@mypublicdns.westus.cloudapp.azure.com
```

Once logged in to the Docker host, let's run an nginx container:

```bash
sudo docker run -d -p 80:80 nginx
```

The output is similar to the following example as the nginx image is downloaded and a container started:

```bash
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
efd26ecc9548: Pull complete
a3ed95caeb02: Pull complete
a48df1751a97: Pull complete
8ddc2d7beb91: Pull complete
Digest: sha256:2ca2638e55319b7bc0c7d028209ea69b1368e95b01383e66dfe7e4f43780926d
Status: Downloaded newer image for nginx:latest
b6ed109fb743a762ff21a4606dd38d3e5d35aff43fa7f12e8d4ed1d920b0cd74
```

Check the status of the containers running on your Docker host as follows:

```bash
sudo docker ps
```

The output is similar to the following example, showing that the nginx container is running and TCP ports 80 and 443 and being forwarded:

```bash
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS              PORTS                         NAMES
b6ed109fb743        nginx               "nginx -g 'daemon off"   About a minute ago   Up About a minute   0.0.0.0:80->80/tcp, 443/tcp   adoring_payne
```

To see your container in action, open up a web browser and enter the DNS name of your Docker host:

![Running ngnix container](./media/dockerextension/nginxrunning.png)

## Azure Docker VM extension template reference
The previous example uses an existing quickstart template. You can also deploy the Azure Docker VM extension with your own Resource Manager templates. To do so, add the following to your Resource Manager templates, defining the `vmName` of your VM appropriately:

```json
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
    "typeHandlerVersion": "1.*",
    "autoUpgradeMinorVersion": true,
    "settings": {},
    "protectedSettings": {}
  }
}
```

You can find more detailed walkthrough on using Resource Manager templates by reading [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).

## Next steps
You may wish to [configure the Docker daemon TCP port](https://docs.docker.com/engine/reference/commandline/dockerd/#/bind-docker-to-another-hostport-or-a-unix-socket), understand [Docker security](https://docs.docker.com/engine/security/security/), or deploy containers using [Docker Compose](https://docs.docker.com/compose/overview/). For more information on the Azure Docker VM Extension itself, see the [GitHub project](https://github.com/Azure/azure-docker-extension/).

Read more information about the additional Docker deployment options in Azure:

* [Use Docker Machine with the Azure driver](docker-machine.md)  
* [Get Started with Docker and Compose to define and run a multi-container application on an Azure virtual machine](docker-compose-quickstart.md).
* [Deploy an Azure Container Service cluster](../../container-service/container-service-deployment.md)

