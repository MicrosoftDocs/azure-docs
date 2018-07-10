---
title: Deploy an application to Service Fabric Mesh on Azure | Microsoft Docs
description: Learn how to deploy an application that uses a private container registry to Service Fabric Mesh using the Azure CLI.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric-mesh
ms.devlang: azure-cli
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/26/2018
ms.author: ryanwi
ms.custom: mvc, devcenter
---

# Deploy an application that uses a private container image registry

This example shows how to deploy an application that uses private container image registry. 

## Example JSON templates

Linux: [https://seabreezequickstart.blob.core.windows.net/templates/private-registry/sbz_rp.linux.json](https://seabreezequickstart.blob.core.windows.net/templates/private-registry/sbz_rp.linux.json)

## Setup Service Fabric Mesh CLI
[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete these steps. If you choose to install and use the CLI locally, you must install the Azure CLI version 2.0.35 or later. Run `az --version` to find the version. To install or upgrade to the latest version of the CLI, see [Install Azure CLI 2.0][azure-cli-install]. 

Install the Azure Service Fabric Mesh CLI extension module. For the preview, Azure Service Fabric Mesh CLI is written as an extension to Azure CLI.

```azurecli-interactive
az extension add --source https://meshcli.blob.core.windows.net/cli/mesh-0.8.0-py2.py3-none-any.whl
```

## Log in to Azure

Log in to Azure and set your subscription.

```azurecli-interactive
az login
az account set --subscription "<subscriptionName>"
```
## Create a container registry and push image to it
Create Azure Container Registry by following [this](/azure/container-registry/container-registry-get-started-azure-cli) guide. Perform the steps up to ["List container images"](/azure/container-registry/container-registry-get-started-azure-cli#list-container-images) step. At this time, `aci-helloworld:v1` should be present in this private container registry.

## Retrieve credentials for the registry
In order to deploy a container instance from the registry that was created, credentials must be provided during the deployment. The production scenarios should use a [service principal for container registry access](/azure/container-registry/container-registry-auth-service-principal), but to keep this quickstart brief, enable the admin user on your registry with the following command:

```azurecli-interactive
az acr update --name <acrName> --admin-enabled true
```
Once admin access is enabled, get the registry server name, user name, and password using the following commands.

```azurecli-interactive
az acr list --resource-group <resourceGroupName> --query "[].{acrLoginServer:loginServer}" --output table
az acr credential show --name <acrName> --query username
az acr credential show --name <acrName> --query "passwords[0].value"
```

## Deploy the template

Create the application and related resources using the following command and provide the credentials from the previous step. 

The password parameter in the template is of `string` type for ease of use. It will be displayed on the screen in clear-text and in the deployment status.

```azurecli-interactive
az mesh deployment create --resource-group <resourceGroupName> --template-uri https://seabreezequickstart.blob.core.windows.net/templates/private-registry/sbz_rp.linux.json
  
```

In a minute or so, your command should return with `"provisioningState": "Succeeded"`. Once it does, get the public IP address by querying for the network resources created in this deployment.

## Obtain public IP address and connect to it

The network resource name for this example is `privateRegistryExampleNetwork`, fetch information about it using the following command.

```azurecli-interactive
az mesh network show --resource-group <resourceGroupName> --name privateRegistryExampleNetwork
```

Get the `publicIpAddress` property and connect to it using a browser. It should display a web page with a welcome message.

## Delete the resources

To conserve the limited resources assigned for the preview program, delete the resources frequently. To delete resources related to this example, delete the resource group in which they were deployed.

```azurecli-interactive
az group delete --resource-group <resourceGroupName> 
```

## Next steps

For more information, see [Service Fabric resources](service-fabric-mesh-service-fabric-resources.md)