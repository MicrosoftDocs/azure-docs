---
title: (DEPRECATED) Using ACR with an Azure DC/OS cluster
description: Use an Azure Container Registry with a DC/OS cluster in Azure Container Service
services: container-service
author: julienstroheker
manager: dcaro

ms.service: container-service
ms.topic: tutorial
ms.date: 03/23/2017
ms.author: juliens
ms.custom: mvc

---
# (DEPRECATED) Use ACR with a DC/OS cluster to deploy your application

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

In this article, we explore how to use Azure Container Registry with a DC/OS cluster. Using ACR allows you to privately store and manage container images. This tutorial covers the following tasks:

> [!div class="checklist"]
> * Deploy Azure Container Registry (if needed)
> * Configure ACR authentication on a DC/OS cluster
> * Uploaded an image to the Azure Container Registry
> * Run a container image from the Azure Container Registry

You need an ACS DC/OS cluster to complete the steps in this tutorial. If needed, [this script sample](./../kubernetes/scripts/container-service-cli-deploy-dcos.md) can create one for you.

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Deploy Azure Container Registry

If needed, create an Azure Container registry with the [az acr create](/cli/azure/acr#az-acr-create) command. 

The following example creates a registry with a randomly generate name. The registry is also configured with an admin account using the `--admin-enabled` argument.

```azurecli-interactive
az acr create --resource-group myResourceGroup --name myContainerRegistry$RANDOM --sku Basic
```

Once the registry has been created, the Azure CLI outputs data similar to the following. Take note of the `name` and `loginServer`, these are used in later steps.

```output
{
  "adminUserEnabled": false,
  "creationDate": "2017-06-06T03:40:56.511597+00:00",
  "id": "/subscriptions/f2799821-a08a-434e-9128-454ec4348b10/resourcegroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry23489",
  "location": "eastus",
  "loginServer": "mycontainerregistry23489.azurecr.io",
  "name": "myContainerRegistry23489",
  "provisioningState": "Succeeded",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "storageAccount": {
    "name": "mycontainerregistr034017"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

Get the container registry credentials using the [az acr credential show](/cli/azure/acr/credential) command. Substitute the `--name` with the one noted in the last step. Take note of one password, it is needed in a later step.

```azurecli-interactive
az acr credential show --name myContainerRegistry23489
```

For more information on Azure Container Registry, see [Introduction to private Docker container registries](../../container-registry/container-registry-intro.md). 

## Manage ACR authentication

The conventional way to push and pull image from a private registry is to first authenticate with the registry. To do so, you would use the `docker login` command on any client that needs to access the private registry. Because a DC/OS cluster can contain many nodes, all of which need to be authenticated with the ACR, it is helpful to automate this process across each node. 

### Create shared storage

This process uses an Azure file share that has been mounted on each node in the cluster. If you have not already set up shared storage, see [Setup a file share inside a DC/OS cluster](container-service-dcos-fileshare.md).

### Configure ACR authentication

First, get the FQDN of the DC/OS master and store it in a variable.

```azurecli-interactive
FQDN=$(az acs list --resource-group myResourceGroup --query "[0].masterProfile.fqdn" --output tsv)
```

Create an SSH connection with the master (or the first master) of your DC/OS-based cluster. Update the user name if a non-default value was used when creating the cluster.

```console
ssh azureuser@$FQDN
```

Run the following command to login to the Azure Container Registry. Replace the `--username` with the name of the container registry, and the `--password` with one of the provided passwords. Replace the last argument *mycontainerregistry.azurecr.io* in the example with the loginServer name of the container registry. 

This command stores the authentication values locally under the `~/.docker` path.

```console
docker -H tcp://localhost:2375 login --username=myContainerRegistry23489 --password=//=ls++q/m+w+pQDb/xCi0OhD=2c/hST mycontainerregistry.azurecr.io
```

Create a compressed file that contains the container registry authentication values.

```console
tar czf docker.tar.gz .docker
```

Copy this file to the cluster shared storage. This step makes the file available on all nodes of the DC/OS cluster.

```console
cp docker.tar.gz /mnt/share/dcosshare
```

## Upload image to ACR

Now from a development machine, or any other system with Docker installed, create an image and upload it to the Azure Container Registry.

Create a container from the Ubuntu image.

```console
docker run ubuntu --name base-image
```

Now capture the container into a new image. The image name needs to include the `loginServer` name of the container registry with a format of `loginServer/imageName`.

```console
docker -H tcp://localhost:2375 commit base-image mycontainerregistry30678.azurecr.io/dcos-demo
```

Login into the Azure Container Registry. Replace the name with the loginServer name, the --username with the name of the container registry, and the --password with one of the provided passwords.

```console
docker login --username=myContainerRegistry23489 --password=//=ls++q/m+w+pQDb/xCi0OhD=2c/hST mycontainerregistry2675.azurecr.io
```

Finally, upload the image to the ACR registry. This example uploads an image named dcos-demo.

```console
docker push mycontainerregistry30678.azurecr.io/dcos-demo
```

## Run an image from ACR

To use an image from the ACR registry, create a file names *acrDemo.json* and copy the following text into it. Replace the image name with the container registry loginServer name and image name, for example `loginServer/imageName`. Take note of the `uris` property. This property holds the location of the container registry authentication file, which in this case is the Azure file share that is mounted on each node in the DC/OS cluster.

```json
{
  "id": "myapp",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "mycontainerregistry30678.azurecr.io/dcos-demo",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp",
          "name": "80",
          "labels": null
        }
      ],
      "forcePullImage":true
    }
  },
  "instances": 3,
  "cpus": 0.1,
  "mem": 65,
  "healthChecks": [{
      "protocol": "HTTP",
      "path": "/",
      "portIndex": 0,
      "timeoutSeconds": 10,
      "gracePeriodSeconds": 10,
      "intervalSeconds": 2,
      "maxConsecutiveFailures": 10
  }],
  "uris":  [
       "file:///mnt/share/dcosshare/docker.tar.gz"
   ]
}
```

Deploy the application with the DC/OC CLI.

```console
dcos marathon app add acrDemo.json
```

## Next steps

In this tutorial you have configure DC/OS to use Azure Container Registry including the following tasks:

> [!div class="checklist"]
> * Deploy Azure Container Registry (if needed)
> * Configure ACR authentication on a DC/OS cluster
> * Uploaded an image to the Azure Container Registry
> * Run a container image from the Azure Container Registry
