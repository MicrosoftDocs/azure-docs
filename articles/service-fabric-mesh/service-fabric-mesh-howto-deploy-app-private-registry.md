---
title: Deploy a Service Fabric Mesh app from a private container image registry to Azure Service Fabric Mesh | Microsoft Docs
description: Learn how to deploy an app from a private container image registry to Service Fabric Mesh using the Azure CLI.
services: service-fabric-mesh
documentationcenter: .net
author: rwike77
manager: jeconnoc
editor: ''
ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: azure-cli
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/20/2018
ms.author: ryanwi
ms.custom: mvc, devcenter
---

# Deploy a Service Fabric Mesh app from a private container image registry

This article shows how to deploy an Azure Service Fabric Mesh app that uses a private container image registry.

## Prerequisites

### Set up Service Fabric Mesh CLI

Use a local installation of the Azure CLI to complete this task. Install Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).

## Install Docker

#### Windows 10

Download and install the latest version of [Docker Community Edition for Windows][download-docker] to support the containerized Service Fabric apps used by Service Fabric Mesh.

During installation, select **Use Windows containers instead of Linux containers** when asked. 

If Hyper-V is not enabled on your machine, Docker's installer will offer to enable it. Click **OK** to do so if prompted.

#### Windows Server 2016

If you don't have the Hyper-V role enabled, open PowerShell as an administrator and run the following command to enable Hyper-V, and then restart your computer. For more information, see [Docker Enterprise Edition for Windows Server][download-docker-server].

```powershell
Install-WindowsFeature -Name Hyper-V -IncludeManagementTools
```

Restart your computer.

Open PowerShell as an administrator and run the following commands to install Docker:

```powershell
Install-Module DockerMsftProvider -Force
Install-Package Docker -ProviderName DockerMsftProvider -Force
Install-WindowsFeature Containers
```

## Sign in to Azure

Sign in to Azure and set the active subscription.

```azurecli-interactive
az login
az account set --subscription "<subscriptionName>"
```

## Create a container registry and push an image to it

Use the following steps to create an Azure Container Registry.

### Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed. Use the following command to create a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

### Create a container registry

Create an Azure container registry (ACR) instance using the `az acr create` command. The registry name must be unique within Azure and contain 5-50 alphanumeric characters. In the following example, the name *myContainerRegistry007* is used. If you get an error that the registry name is in use, choose a different name. Use that name everywhere `<acrName>` appears in these instructions.

```azurecli
az acr create --resource-group myResourceGroup --name myContainerRegistry007 --sku Basic
```

When the registry is created, you'll see output similar to the following:

```json
{
  "adminUserEnabled": false,
  "creationDate": "2017-09-08T22:32:13.175925+00:00",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry007",
  "location": "eastus",
  "loginServer": "myContainerRegistry007.azurecr.io",
  "name": "myContainerRegistry007",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

### Push the image to Azure Container Registry

To push an image to an Azure container registry (ACR), you must first have a container image. If you don't yet have any local container images, run the following command to pull the an image from Docker Hub (you may need to switch Docker to work with Linux images by right-clicking the docker icon and selecting **Switch to Linux containers**).

```bash
docker pull seabreeze/azure-mesh-helloworld:1.1-alpine
```

Before you can push an image to your registry, you must tag it with the fully qualified name of your ACR login server.

Run the following command to get the full login server name of your ACR instance.

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

The full login server name that is returned will be referred to as `<acrLoginServer>` throughout the rest of this article.

Now tag your docker image using the [docker tag][docker-tag] command. In the command below, replace `<acrLoginServer>` with the login server name reported by the command above. The following example tags the seabreeze/azure-mesh-helloworld:1.1-alpine image. If you are using a different image, substitute the image name in the following command.

```bash
docker tag seabreeze/azure-mesh-helloworld:1.1-alpine <acrLoginServer>/seabreeze/azure-mesh-helloworld:1.1-alpine
```

For example: `docker tag seabreeze/azure-mesh-helloworld:1.1-alpine myContainerRegistry007.azurecr.io/seabreeze/azure-mesh-helloworld:1.1-alpine`

Log in to the Azure Container Registry.

```bash
az acr login -n <acrName>
```

For example: `az acr login -n myContainerRegistry007`

Push the image to the azure container registry with the following command:

```bash
docker push <acrLoginServer>/seabreeze/azure-mesh-helloworld:1.1-alpine
```

For example: `docker push myContainerRegistry007.azurecr.io/seabreeze/azure-mesh-helloworld:1.1-alpine`

### List container images

The following example lists the repositories in a registry. The examples that follow assume you are using the azure-mesh-helloworld:1.1-alpine image. If you are using a different image, substitute its name where the azure-mesh-helloworld image is used.

```azurecli
az acr repository list --name <acrName> --output table
```
For example: `az acr repository list --name myContainerRegistry007 --output table`

Output:

```bash
Result
-------------------------------
seabreeze/azure-mesh-helloworld
```

The following example lists the tags on the **azure-mesh-helloworld** repository.

```azurecli
az acr repository show-tags --name <acrName> --repository seabreeze/azure-mesh-helloworld --output table
```

For example: `az acr repository show-tags --name myContainerRegistry007 --repository seabreeze/azure-mesh-helloworld --output table`

Output:

```bash
Result
--------
1.1-alpine
```

The preceding output confirms the presence of `azure-mesh-helloworld:1.1-alpine` in the private container registry.

## Retrieve credentials for the registry

> [!IMPORTANT]
> Enabling the admin user on an Azure container registry is not recommended for production scenarios. It is done here to keep this demonstration brief. For production scenarios, use a [service principal](https://docs.microsoft.com/azure/container-registry/container-registry-auth-service-principal) for both user and system authentication in production scenarios.

In order to deploy a container instance from the registry that was created, you must provide credentials during the deployment. Enable the admin user on your registry with the following command:

```azurecli-interactive
az acr update --name <acrName> --admin-enabled true
```

For example: `az acr update --name myContainerRegistry007 --admin-enabled true`

Get the registry server name, user name, and password by using the following commands:

```azurecli-interactive
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
az acr credential show --name <acrName> --query username
az acr credential show --name <acrName> --query "passwords[0].value"
```

The values provided by preceding commands are referenced as `<acrLoginServer>`, `<acrUserName>`, and `<acrPassword>` below.

## Deploy the template

Create the application and related resources using the following command, and provide the credentials from the previous step.

The `registry-password` parameter in the template is a secure string. It will not be displayed in the deployment status and `az mesh service show` commands.

If you're using a Bash console, run the following:

```azurecli-interactive
az mesh deployment create --resource-group myResourceGroup --template-uri https://sfmeshsamples.blob.core.windows.net/templates/helloworld/mesh_rp.private_registry.linux.json --parameters "{\"location\": {\"value\": \"eastus\"}, \"registry-server\": {\"value\": \"<acrLoginServer>\"}, \"registry-username\": {\"value\": \"<acrUserName>\"}, \"registry-password\": {\"value\": \"<acrPassword>\"}}"
```

If you're using a PowerShell console, run the following:

```azurecli-interactive
az mesh deployment create --resource-group myResourceGroup --template-uri https://sfmeshsamples.blob.core.windows.net/templates/helloworld/mesh_rp.private_registry.linux.json --parameters "{'location': {'value': 'eastus'}, 'registry-server': {'value': '<acrLoginServer>'}, 'registry-username': {'value': '<acrUserName>'}, 'registry-password': {'value': '<acrPassword>'}}"
```

In a few minutes, you should see:

`helloWorldPrivateRegistryApp has been deployed successfully on helloWorldPrivateRegistryNetwork with public ip address <IP Address>`

## Open the application

Once the application successfully deploys, get the public IP address for the service endpoint, and open it on a browser. It displays a web page with Service Fabric Mesh logo.

The deployment command returns the public IP address of the service endpoint. Optionally, You can also query the network resource to find the public IP address of the service endpoint. 
 
The network resource name for this application is `helloWorldPrivateRegistryNetwork`, fetch information about it using the following command. 

```azurecli-interactive
az mesh network show --resource-group myResourceGroup --name helloWorldPrivateRegistryNetwork
```

## Delete the resources

Frequently delete the resources you are no longer using in Azure. To delete the resources related to this example, delete the resource group in which they were deployed (which deletes everything associated with the resource group) with the following command:

```azurecli-interactive
az group delete --resource-group myResourceGroup
```

If you switched Docker to work with Linux images for this exercise, and need to go back to working with Windows images, right-click the docker icon and select **Switch to Windows containers**

## Next steps

- View the Hello World sample application on [GitHub](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/helloworld).
- To learn more about Service Fabric Resource Model, see [Service Fabric Mesh Resource Model](service-fabric-mesh-service-fabric-resources.md).
- To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).

[download-docker-server]: https://docs.docker.com/install/windows/docker-ee/
[download-docker]: https://store.docker.com/editions/community/docker-ce-desktop-windows
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/