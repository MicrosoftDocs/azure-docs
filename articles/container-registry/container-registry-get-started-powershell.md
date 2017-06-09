---
title: Azure container registry repositories | Microsoft Docs
description: How to use Azure Container Registry repositories for Docker images
services: container-registry
documentationcenter: ''
author: cristy
manager: balans
editor: dlepow


ms.service: container-registry
ms.devlang: na
ms.topic: how-to-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/30/2017
ms.author: cristyg

---

# Create a private Docker container registry using the Azure PowerShell
Use commands in [Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/overview) to create a container registry and manage its settings from your Windows computer. You can also create and manage container registries using the [Azure portal](container-registry-get-started-portal.md), the [Azure CLI](container-registry-get-started-azure-cli.md), or programmatically with the Container Registry [REST API](https://go.microsoft.com/fwlink/p/?linkid=834376).


* For background and concepts, see [the overview](container-registry-intro.md)
* For a full list of supported cmdlets, see [Azure Container Registry Management Cmdlets](https://docs.microsoft.com/en-us/powershell/module/azurerm.containerregistry/).


## Prerequisites
* **Azure PowerShell**: To install and get started with Azure PowerShell, see the [installation instructions](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps). Log in to your Azure subscription by running `Login-AzureRMAccount`. For more information, see [Get started with Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/get-started-azurep).
* **Resource group**: Create a [resource group](../azure-resource-manager/resource-group-overview.md#resource-groups) before creating a container registry, or use an existing resource group. Make sure the resource group is in a location where the Container Registry service is [available](https://azure.microsoft.com/regions/services/). To create a resource group using Azure PowerShell, see [the PowerShell reference](https://docs.microsoft.com/en-us/powershell/azure/get-started-azureps#create-a-resource-group).
* **Storage account** (optional): Create a standard Azure [storage account](../storage/storage-introduction.md) to back the container registry in the same location. If you don't specify a storage account when creating a registry with `New-AzureRMContainerRegistry`, the command creates one for you. To create a storage account using PowerShell, see [the PowerShell reference](https://docs.microsoft.com/en-us/powershell/module/azure/new-azurestorageaccount). Currently Premium Storage is not supported.
* **Service principal** (optional): When you create a registry with PowerShell, by default it is not set up for access. Depending on your needs, you can assign an existing Azure Active Directory service principal to a registry or create and assign a new one. Alternatively, you can enable the registry's admin user account. See the sections later in this article. For more information about registry access, see [Authenticate with the container registry](container-registry-authentication.md).

## Create a container registry
Run the `New-AzureRMContainerRegistry` command to create a container registry.

> [!TIP]
> When you create a registry, specify a globally unique top-level domain name, containing only letters and numbers. The registry name in the examples is `MyRegistry`, but substitute a unique name of your own.
>
>

The following command uses the minimal parameters to create container registry `MyRegistry` in the resource group `MyResourceGroup` in the South Central US location:

```PowerShell
$Registry = New-AzureRMContainerRegistry -ResourceGroupName "MyResourceGroup" -Name "MyRegistry"
```

* `-StorageAccountName` is optional. If not specified, a storage account is created with a name consisting of the registry name and a timestamp in the specified resource group.

## Assign a service principal
Use PowerShell commands to assign an Azure Active Directory [service principal](../azure-resource-manager/resource-group-authenticate-service-principal.md) to a registry. The service principal in these examples is assigned the Owner role, but you can assign [other roles](../active-directory/role-based-access-control-configure.md) if you want.

### Create a service principal
In the following command, a new service principal is created. Specify a strong password with the `-Password` parameter.

```PowerShell
$ServicePrincipal = New-AzureRMADServicePrincipal -DisplayName ApplicationDisplayName -Password "MyPassword"
```

### Assign a new or existing service principal
You can assign a new or an existing service principal to a registry. To assign it Owner role access to the registry, run a command similar to the following example:

```PowerShell
New-AzureRMRoleAssignment -RoleDefinitionName Owner -ServicePrincipalName $ServicePrincipal.ApplicationId -Scope $Registry.Id
```

##Sign in to the registry with the service principal
After assigning the service principal to the registry, you can sign in using the following command:

```PowerShell
docker login -u $ServicePrincipal.ApplicationId -p myPassword
```

## Manage admin credentials
An admin account is automatically created for each container registry and is disabled by default. The following examples show PowerShell commands to manage the admin credentials for your container registry.

### Obtain admin user credentials
```PowerShell
Get-AzureRMContainerRegistryCredential -ResourceGroupName "MyResourceGroup" -Name "MyRegistry"
```

### Enable admin user for an existing registry
```PowerShell
Update-AzureRMContainerRegistry -ResourceGroupName "MyResourceGroup" -Name "MyRegistry" -EnableAdminUser
```

### Disable admin user for an existing registry
```PowerShell
Update-AzureRMContainerRegistry -ResourceGroupName "MyResourceGroup" -Name "MyRegistry" -DisableAdminUser
```

## Next steps
* [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md)
