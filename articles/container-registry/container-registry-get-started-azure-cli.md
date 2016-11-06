---
title: Create a container registry with the CLI | Microsoft Docs
description: Get started creating and managing Azure container registries with the Azure CLI 2.0 Preview
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: dlepow
tags: ''
keywords: ''

ms.assetid: 29e20d75-bf39-4f7d-815f-a2e47209be7d
ms.service: container-registry
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/02/2016
ms.author: stevelas
---
# Create a container registry using the Azure CLI
Use Azure Command-Line Interface (CLI) commands to create a container registry and manage its settings from your Linux, Mac, or Windows computer. You can also work with container registries using the [Azure portal](container-registry-get-started-portal.md) or programmatically with the Container Registry APIs.

* For help on Container Registry CLI commands (**az acr** commands), pass the `-h` parameter to any command.
* For background and concepts, see [What is Azure Container Registry?](container-registry-intro.md)
* To get started with Docker images in your registry, see [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md).

> [!NOTE]
> Container Registry is currently in private preview.
> 
> 

## Prerequisites
* **Container Registry private preview** - See the [instructions](container-registry-get-access.md) to register your Azure subscription and request access.
* **Azure CLI 2.0 Preview** - To install and get started with the **az acr** commands, see the [installation instructions](container-registry-get-started-azure-cli-install.md). *For private preview, the az acr commands are only available by running a Docker image of the Azure CLI 2.0 Preview.*
* **Resource group** - Create a new resource group before creating a container registry, or use an existing resource group. Make sure the resource group is in a location where the Container Registry service is available. *For private preview, the service is available in the South Central US region.* To create a resource group using the CLI 2.0 Preview, see [the CLI 2.0 Preview samples](https://github.com/Azure/azure-cli-samples/tree/master/arm). 
* **Storage account** (optional) - Create a storage account to back the container registry in the same resource group. If you don't specify a storage account when creating a registry with **az acr create**, the command creates one for you. To create a storage account using the CLI 2.0 Preview, see [the CLI 2.0 Preview samples](https://github.com/Azure/azure-cli-samples/tree/master/storage).
* **Service principal** (optional) - For private preview, we recommend using an Azure Active Directory [service principal](https://azure.microsoft.com/documentation/articles/active-directory-application-objects/) to access the registry. After creating a registry, you can create and assign a service principal, or assign an existing service principal.  

## Create a container registry
Run the **az acr create** command to create a container registry. 

> [!TIP]
> When you create a registry, specify a globally unique top-level domain name, such as an organizational name, containing only letters and numbers. The registry name in the examples is **myRegistry**, but substitute a unique name of your own. 
> 
> 

The following command uses the minimal parameters to create container registry **myRegistry** in the resource group **myResourceGroup** in the South Central US location:

```
az acr create -n myRegistry -g myResourceGroup -l southcentralus
```

* `--storage-account-name` or `-s` is optional. If not specified, a storage account is created with a random name in the specified resource group.

The command returns output similar to the following. 

```
{
  "adminUserEnabled": false,
  "creationDate": "2016-11-02T19:02:53.112519+00:00",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/Microsoft.ContainerRegistry/registries/myregistry",
  "location": "southcentralus",
  "loginServer": "myregistry-exp.azurecr.io",
  "name": "myregistry",
  "storageAccount": {
    "accessKey": null,
    "name": "xxxxxxxxxxxxxxxxxxxxxxxxx"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```
Take special note:

* **id** - Identifier for the registry in your subscription, which you need if you want to assign a service principal. 
* **loginServer** - The fully qualified name you specify to [login to the registry](container-registry-authentication.md). In this example, the name is **myregistry-exp.azurecr.io** (all lowercase; the **-exp** in the prefix is required for private preview).

## Assign a service principal
When you create a registry with the CLI, by default it is not set up for access. To allow access to the registry, it is recommended to assign an Azure Active Directory service principal. For more information about registry access, see [Authenticate with the container registry](container-registry-authenticate.md). 

### Create a service principal and assign access to the registry
In the following command, a new service principal is assigned Owner role access to the registry identifier passed with the `--scopes` parameter. Specify a strong password with the `--password` parameter.

```
az ad sp create-for-rbac --scopes /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/Microsoft.ContainerRegistry/registries/myregistry --role Owner --password myPassword
```



### Assign an existing service principal
If you already have a service principal and want to assign it Owner role access to the registry, run a command similar to the following. You pass the service principal tenant ID using the `--assignee` parameter:

```
az role assignment create --scope /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/Microsoft.ContainerRegistry/registries/myregistry --role Owner --assignee myTenantId
```



## Manage admin credentials
An admin account is automatically created for each container registry and is disabled by default. The admin account is intended only as a stopgap, mainly for Azure portal users to test login to a newly created registry. It is not recommended to share the admin account with other users. For Container Registry preview, use of a service principal is recommended. 

The following examples show **az acr** CLI commands to manage the admin credentials for your container registry.

### Obtain admin user credentials
```
az acr credential show -n myRegistry
```

### Enable admin user for an existing registry
```
az acr update -n myRegistry --enable-admin
```

### Disable admin user for an existing registry
```
az acr update -n myRegistry --disable-admin
```

## List images and tags
Container Registry doesn't currently support **docker search**, nor is there a graphical UI to list images and tags.

However, use the **az acr** CLI commands to query the list of images and tags.

### List repositories
The following example lists the repositories in a registry, in JSON (JavaScript Object Notation) format:

```
az acr repository list -n myRegistry -o json
```

### List tags
The following example lists the tags on the **samples/nginx** repository, in JSON format:

```
az acr repository show-tags -n myRegistry --repository samples/nginx -o json
```

## Next steps
* [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md)

## Additional docs
* [Create a container registry using the Azure portal](container-registry-get-started-portal.md)
* [Login to a container registry](container-registry-authentication.md) 
* [Install the Azure CLI for Container Registry preview](./container-registry-get-started-azure-cli-install.md)

