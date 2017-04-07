---
title: Use the Azure Docker VM extension with the Azure CLI 1.0 | Microsoft Docs
description: Learn how to use the Docker VM extension to quickly and securely deploy a Docker environment in Azure using Resource Manager templates.
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/09/2017
ms.author: iainfou

---
# Create a Docker environment in Azure using the Docker VM extension with the Azure CLI 1.0
Docker is a popular container management and imaging platform that allows you to quickly work with containers on Linux (and Windows as well). In Azure, there are various ways you can deploy Docker according to your needs. This article focuses on using the Docker VM extension and Azure Resource Manager templates. 

For more information about the different deployment methods, including using Docker Machine and Azure Container Services, see the following articles:

* To quickly prototype an app, you can create a single Docker host using [Docker Machine](docker-machine.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* For larger, more stable environments, you can use the Azure Docker VM extension, which also supports [Docker Compose](https://docs.docker.com/compose/overview/) to generate consistent container deployments. This article details using the Azure Docker VM extension.
* To build production-ready, scalable environments that provide additional scheduling and management tools, you can deploy a [Docker Swarm cluster on Azure Container Services](../../container-service/container-service-deployment.md).

## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](#azure-docker-vm-extension-overview) – our CLI for the classic and resource management deployment models (this article)
- [Azure CLI 2.0](dockerextension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) - our next generation CLI for the resource management deployment model 

## Azure Docker VM extension overview
The Azure Docker VM extension installs and configures the Docker daemon, Docker client, and Docker Compose in your Linux virtual machine (VM). By using the Azure Docker VM extension, you have more control and features than simply using Docker Machine or creating the Docker host yourself. These additional features, such as [Docker Compose](https://docs.docker.com/compose/overview/), make the Azure Docker VM extension suited for more robust developer or production environments.

Azure Resource Manager templates define the entire structure of your environment. Templates allow you to create and configure resources such as the Docker host VMs, storage, Role-Based Access Controls (RBAC), and diagnostics. You can reuse these templates to create additional deployments in a consistent manner. For more information about Azure Resource Manager and templates, see [Resource Manager overview](../../azure-resource-manager/resource-group-overview.md). 

## Deploy a template with the Azure Docker VM extension
Let's use an existing quickstart template to create an Ubuntu VM that uses the Azure Docker VM extension to install and configure the Docker host. You can view the template here: [Simple deployment of an Ubuntu VM with Docker](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu). 

You need the [latest Azure CLI](../../cli-install-nodejs.md) installed and logged in using the Resource Manager mode as follows:

```azurecli
azure config mode arm
```

Deploy the template using the Azure CLI, specifying the template URI. The following example creates a resource group named `myResourceGroup` in the `WestUS` location. Use your own resource group name and location as follows:

```azurecli
azure group create --name myResourceGroup --location "West US" \
  --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/docker-simple-on-ubuntu/azuredeploy.json
```

Answer the prompts to name your storage account, provide a username and password, and provide a DNS name. The output is similar to the following example:

```azurecli
info:    Executing command group create
+ Getting resource group myResourceGroup
+ Updating resource group myResourceGroup
info:    Updated resource group myResourceGroup
info:    Supply values for the following parameters
newStorageAccountName: mystorageaccount
adminUsername: ops
adminPassword: P@ssword!
dnsNameForPublicIP: mypublicip
+ Initializing template configurations and parameters
+ Creating a deployment
info:    Created template deployment "azuredeploy"
data:    Id:                  /subscriptions/guid/resourceGroups/myResourceGroup
data:    Name:                myResourceGroup
data:    Location:            westus
data:    Provisioning State:  Succeeded
data:    Tags: null
data:
info:    group create command OK
```

The Azure CLI returns you to the prompt after only a few seconds, but your Docker host is still being created and configured by the Azure Docker VM extension. It takes a few minutes for the deployment to finish. You can view details about the Docker host status using the `azure vm show` command.

The following example checks the status of the VM named `myDockerVM` (the default name from the template - don't change this name) in the resource group named `myResourceGroup`. Enter the name of the resource group you created in the preceding step:

```azurecli
azure vm show -g myResourceGroup -n myDockerVM
```

The output of the `azure vm show` command is similar to the following example:

```azurecli
info:    Executing command vm show
+ Looking up the VM "myDockerVM"
+ Looking up the NIC "myVMNicD"
+ Looking up the public ip "myPublicIPD"
data:    Id                              :/subscriptions/guid/resourceGroups/myresourcegroup/providers/Microsoft.Compute/virtualMachines/MyDockerVM
data:    ProvisioningState               :Succeeded
data:    Name                            :MyDockerVM
data:    Location                        :westus
data:    Type                            :Microsoft.Compute/virtualMachines
[...]
data:
data:    Network Profile:
data:      Network Interfaces:
data:        Network Interface #1:
data:          Primary                   :true
data:          MAC Address               :00-0D-3A-33-D3-95
data:          Provisioning State        :Succeeded
data:          Name                      :myVMNicD
data:          Location                  :westus
data:            Public IP address       :13.91.107.235
data:            FQDN                    :mypublicip.westus.cloudapp.azure.com]
data:
data:    Diagnostics Instance View:
info:    vm show command OK
```

Near the top of the output, you see the `ProvisioningState` of the VM. When this displays `Succeeded`, the deployment has finished and you can SSH to the VM.

Towards the end of the output, `FQDN` displays the fully qualified domain name of your Docker host. This FQDN is what you use to SSH to your Docker host in the remaining steps.

## Deploy your first nginx container
Once the deployment has finished, SSH to your new Docker host from your local computer. Enter your own username and FQDN as follows:

```bash
ssh ops@mypublicip.westus.cloudapp.azure.com
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

To see your container in action, open up a web browser and enter the FQDN name of your Docker host:

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
    "typeHandlerVersion": "1.1",
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

* [Use Docker Machine with the Azure driver](docker-machine.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)  
* [Get Started with Docker and Compose to define and run a multi-container application on an Azure virtual machine](docker-compose-quickstart.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
* [Deploy an Azure Container Service cluster](../../container-service/container-service-deployment.md)

