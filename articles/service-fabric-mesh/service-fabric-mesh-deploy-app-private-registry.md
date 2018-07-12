---
title: Deploy an application to Service Fabric Mesh on Azure | Microsoft Docs
description: Learn how to deploy an app that uses a private container registry to Service Fabric Mesh using the Azure CLI.
services: service-fabric
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

# Deploy an Azure Service Fabric Mesh app that uses a private container image registry

Learn how to deploy an an Azure Service Fabric Mesh app that uses a private container image registry.

## Prerequisites

Before you begin:

* If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### Set up Service Fabric Mesh CLI

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can use the Azure Cloud Shell, or a local installation of the Azure CLI, to complete these steps. If you choose to install and use the CLI locally, install Azure CLI version 2.0.35 or later. Run `az --version` to see your version. To install or upgrade to the latest version of the CLI, see [Install Azure CLI 2.0][azure-cli-install].

Next, remove any previous installation of the Azure Service Fabric Mesh CLI module:

```azurecli
az extension remove --name mesh
```

Install the Azure Service Fabric Mesh CLI extension module. For the preview, Azure Service Fabric Mesh CLI is written as an extension to Azure CLI.

```azurecli
az extension add --source https://meshcli.blob.core.windows.net/cli/mesh-0.8.0-py2.py3-none-any.whl
```

## Log in to Azure

Log in to Azure and set the active subscription:

```azurecli-interactive
az login
az account set --subscription "<subscriptionName>"
```

## Create a container registry and push image to it

Create an Azure Container Registry by following the instructions in [Create a private Docker registry in Azure with the Azure CLI](../container-registry/container-registry-get-started-azure-cli.md). Perform the steps up to the [List container images](../container-registry/container-registry-get-started-azure-cli.md#list-container-images) step. Then, `aci-helloworld:v1` should be present in the private container registry.

## Retrieve credentials for the registry

In order to deploy a container instance from the registry that was created, credentials must be provided during the deployment. Production scenarios should use a [service principal for container registry access](../container-registry/container-registry-auth-service-principal.md). For this article, enable the admin user on your registry with the following command:

```azurecli-interactive
az acr update --name <acrName> --admin-enabled true
```

Get the registry server name, user name, and password by using the following commands:

```azurecli-interactive
az acr list --resource-group <resourceGroupName> --query "[].{acrLoginServer:loginServer}" --output table
az acr credential show --name <acrName> --query username
az acr credential show --name <acrName> --query "passwords[0].value"
```

## Deploy the template

Create the application and related resources using the following command, and provide the credentials from the previous step.

The password parameter in the template is a string. It will be displayed on the screen, and in the deployment status, in clear-text.

```azurecli-interactive
az mesh deployment create --resource-group <resourceGroupName> --template-uri https://seabreezequickstart.blob.core.windows.net/templates/private-registry/sbz_rp.linux.json
```

After a brief delay, your command should return with `"provisioningState": "Succeeded"`. Once it does, get the public IP address by querying for the network resources created in this deployment.

## Obtain public IP address and connect to it

The network resource name for this example is `privateRegistryExampleNetwork`. You can get information about it, including the public IP address, with following command:

```azurecli-interactive
az mesh network show --resource-group <resourceGroupName> --name privateRegistryExampleNetwork
```

Get the `publicIpAddress` property and connect to it using a browser. It should display a web page with a welcome message.

## Delete the resources

To conserve resources, delete the resources frequently. To delete resources created for this example, delete the resource group in which they were deployed:

```azurecli-interactive
az group delete --resource-group <resourceGroupName> 
```

## Example JSON templates [jtw] Find a place for this & explain what's interesting about it.

Linux: [https://seabreezequickstart.blob.core.windows.net/templates/private-registry/sbz_rp.linux.json](https://seabreezequickstart.blob.core.windows.net/templates/private-registry/sbz_rp.linux.json)


## Next steps

For more information, see [Service Fabric resources](service-fabric-mesh-service-fabric-resources.md)
See the [example JSON template for Linux](https://seabreezequickstart.blob.core.windows.net/templates/private-registry/sbz_rp.linux.json)
