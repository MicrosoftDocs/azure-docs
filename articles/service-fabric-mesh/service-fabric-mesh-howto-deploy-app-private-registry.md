---
title: Deploy app from a private registry to Azure Service Fabric Mesh | Microsoft Docs
description: Learn how to deploy an app that uses a private container registry to Service Fabric Mesh using the Azure CLI.
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
ms.date: 07/16/2018
ms.author: ryanwi
ms.custom: mvc, devcenter
---

# Deploy a Service Fabric Mesh app from a private container image registry

This article shows how to deploy an Azure Service Fabric Mesh app that uses a private container image registry.

## Prerequisites

### Set up Service Fabric Mesh CLI 
You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this task. Install Azure Service Fabric Mesh CLI extension module by following these [instructions](service-fabric-mesh-howto-setup-cli.md).

### Install Docker

Install Docker to support the containerized Service Fabric apps used by Service Fabric Mesh.

### Windows 10

Download and install the latest version of [Docker Community Edition for Windows][download-docker]. 

During the installation, select **Use Windows containers instead of Linux containers** when asked. You'll need to then sign out and sign back in. After logging back in, if you did not previously enable Hyper-V, you may be prompted to enable Hyper-V. Enable Hyper-V and then restart your computer.

After your computer has restarted, Docker will prompt you to enable the **Containers** feature, enable it and restart your computer.

### Windows Server 2016

Use the following PowerShell commands to install Docker. For more information, see [Docker Enterprise Edition for Windows Server][download-docker-server].

```powershell
Install-Module DockerMsftProvider -Force
Install-Package Docker -ProviderName DockerMsftProvider -Force
Install-WindowsFeature Containers
```

Restart your computer.

## Sign in to Azure

Sign in to Azure and set the active subscription:

```azurecli-interactive
az login
az account set --subscription "<subscriptionName>"
```

## Create a container registry and push an image to it

Create an Azure Container Registry by following the instructions in [Create a private Docker registry in Azure with the Azure CLI](../container-registry/container-registry-get-started-azure-cli.md). Perform the steps up to the [Log in to ACR](../container-registry/container-registry-get-started-azure-cli.md#log-in-to-acr) step. 

### Push image to ACR

To push an image to an Azure Container registry, you must first have an image. If you don't yet have any local container images, run the following command to pull an existing image from Docker Hub.

```bash
docker pull seabreeze/azure-mesh-helloworld:1.1-alpine
```

Before you can push an image to your registry, you must tag it with the fully qualified name of your ACR login server. Run the following command to obtain the full login server name of the ACR instance.

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

Tag the image using the [docker tag][docker-tag] command. Replace `<acrLoginServer>` with the login server name of your ACR instance.

```bash
docker tag seabreeze/azure-mesh-helloworld:1.1-alpine <acrLoginServer>/azure-mesh-helloworld:1.1-alpine
```
### List container images

The following example lists the repositories in a registry:

```azurecli
az acr repository list --name <acrName> --output table
```

Output:

```bash
Result
----------------
azure-mesh-helloworld
```

The following example lists the tags on the **azure-mesh-helloworld** repository.

```azurecli
az acr repository show-tags --name <acrName> --repository azure-mesh-helloworld --output table
```

Output:

```bash
Result
--------
1.1-alpine
```
The preceding output confirms the presence of `azure-mesh-helloworld:1.1-alpine` in the private container registry.

## Retrieve credentials for the registry

In order to deploy a container instance from the registry that was created, credentials must be provided during the deployment. Enable the admin user on your registry with the following command:

```azurecli-interactive
az acr update --name <acrName> --admin-enabled true
```

Get the registry server name, user name, and password by using the following commands:

```azurecli-interactive
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
az acr credential show --name <acrName> --query username
az acr credential show --name <acrName> --query "passwords[0].value"
```

The values provided by preceding commands are referenced as `<acrLoginServer>`, `<acrUserName>`, and `<acrPassword>` in the following command.


## Deploy the template

Create the application and related resources using the following command, and provide the credentials from the previous step.

The `registry-password` parameter in the template is a `securestring`. It will not be displayed in the deployment status and `az mesh service show` commands. Ensure that it is correctly specified in the following command.

```azurecli-interactive
az mesh deployment create --resource-group myResourceGroup --template-uri https://sfmeshsamples.blob.core.windows.net/templates/helloworld/mesh_rp.private_registry.linux.json --parameters "{\"location\": {\"value\": \"eastus\"}, \"registry-server\": {\"value\": \"<acrLoginServer>\"}, \"registry-username\": {\"value\": \"<acrUserName>\"}, \"registry-password\": {\"value\": \"<acrPassword>\"}}" 
```

In a few minutes, your command should return with:

`helloWorldPrivateRegistryApp has been deployed successfully on helloWorldPrivateRegistryNetwork with public ip address <IP Address>` 

## Open the application
Once the application successfully deploys, get the public IP address for the service endpoint, and open it on a browser. It displays a web page with Service Fabric Mesh logo.

The deployment command returns the public IP address of the service endpoint. Optionally, You can also query the network resource to find the public IP address of the service endpoint. 
 
The network resource name for this application is `helloWorldPrivateRegistryNetwork`, fetch information about it using the following command. 

```azurecli-interactive
az mesh network show --resource-group myResourceGroup --name helloWorldPrivateRegistryNetwork
```

## Delete the resources

To conserve the limited resources assigned for the preview program, delete the resources frequently. To delete resources related to this example, delete the resource group in which they were deployed.

```azurecli-interactive
az group delete --resource-group myResourceGroup 
```

## Next steps
- View the Hello World sample application on [GitHub](https://github.com/Azure-Samples/service-fabric-mesh/tree/master/src/helloworld).
- To learn more about Service Fabric Resource Model, see [Service Fabric Mesh Resource Model](service-fabric-mesh-service-fabric-resources.md).
- To learn more about Service Fabric Mesh, read the [Service Fabric Mesh overview](service-fabric-mesh-overview.md).

[download-docker-server]: https://docs.docker.com/install/windows/docker-ee/
[download-docker]: https://store.docker.com/editions/community/docker-ce-desktop-windows
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/