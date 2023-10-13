---
title: How to create a storage mover resource
description: Learn how to create a top-level Azure Storage Mover resource
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 09/07/2022
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed
EDIT PASS: not started

!########################################################
-->

# Create an Azure Storage Mover resource

A Storage Mover is a top-level resource and is deployed into an Azure resource group. Storage Mover agents are registered with a storage mover. The storage mover also holds migration projects and everything you need to define and monitor the migration of your individual sources to their targets in Azure.

In this article, you'll learn how to deploy a storage mover to your resource group.

## Prerequisites

You should read the *[Planning for a storage mover deployment](deployment-planning.md)* article before continuing with your first deployment. The article shares best practices for selecting an Azure region for your storage mover, the number of storage mover resources you should consider creating and more useful insights.

Before deploying a storage mover resource, make sure you have the appropriate permissions in your selected subscription and resource group.

If there has never been a storage mover deployed in this subscription and you are not a subscription owner, review the section *[Getting your subscription ready](deployment-planning.md#getting-your-subscription-ready)* in the planning guide mentioned before.

To deploy a storage mover into a resource group, you must be a member of the *Contributor* or *Owner* [RBAC (Role Based Access Control)](../role-based-access-control/overview.md) role for the selected resource group. The section *[Permissions](deployment-planning.md#permissions)* in the planning guide has a table outlining the permissions you need for various migration scenarios.

## Deploy a storage mover resource

### [Azure portal](#tab/portal)

   1. Navigate to the **Create a resource** link in the [Azure portal](https://portal.azure.com).

       :::image type="content" source="media/resource-create/portal-new-resource.png" alt-text="An image showing the Azure portal landing page with two indicators raising attention to the Create a resource links" lightbox="media/resource-create/portal-new-resource-large.png":::

   1. Search for *Azure Storage Mover*. When you identify the correct search result, select the **Create** button. A wizard to create a storage mover resource opens.

   1. Creating a storage mover requires you to decide on a subscription, a resource group, a region, and a name. The *[Planning for an Azure Storage Mover deployment](deployment-planning.md)* article shares best practices. Refer to the [resource naming convention](../azure-resource-manager/management/resource-name-rules.md#microsoftstoragesync) to choose a supported name.

### [PowerShell](#tab/powershell)

Creating a storage mover requires you to decide on a subscription, a resource group, a region, and a name. The *[Planning for an Azure Storage Mover deployment](deployment-planning.md)* article shares best practices. Refer to the [resource naming convention](../azure-resource-manager/management/resource-name-rules.md#microsoftstoragesync) to choose a supported name.

The `New-AzStorageMover` cmdlet is used to create new storage mover resource in a resource group. If you haven't yet installed the `Az.StorageMover` module:

```powershell
## Ensure you are running the latest version of PowerShell 7
$PSVersionTable.PSVersion

## Your local execution policy must be set to at least remote signed or less restrictive
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

## If you don't have the general Az PowerShell module, install it first
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force

## Lastly, the Az.StorageMover module is not installed by default and must be manually requested.
Install-Module -Name Az.StorageMover -Scope CurrentUser -Repository PSGallery -Force

```

The [Install Azure PowerShell](/powershell/azure/install-azure-powershell) article has more details.

To deploy a storage mover resource, you'll need to supply values for the required `-Name`, `-ResourceGroupName`, and `-Region` parameters. The `-Description` parameter is optional.

```powershell
      
## Set variables
$subscriptionID     = "Your subscription ID"
$resourceGroupName  = "Your resource group name"
$storageMoverName   = "Your storage mover name"
$description        = "Optional, up to 1024 characters"

## Log into Azure with your Azure credentials
Connect-AzAccount -SubscriptionId $subscriptionID

## If this is the first storage mover resource deployed in this subscription:
## You need to manually register the resource provider namespaces Microsoft.StorageMover and Microsoft.HybridCompute with your subscription. 
## This only needs to be done once per subscription. You must have at least Contributor permissions (RBAC role) on the subscription.
Register-AzResourceProvider -ProviderNamespace Microsoft.StorageMover
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute

## The value for the Azure region of your resource stems from an enum. 
## To find the correct Location value for your selected Azure region, run:
## Get-AzLocation | select displayname,location

## Create a storage mover resource
New-AzStorageMover `
    -Name $storageMoverName `
    -ResourceGroupName $resourceGroupName `
    -Location "Your Location value"

```

### [CLI](#tab/CLI)

Make sure that you have the most up to date version of Azure CLI. 

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

Creates a top-level Storage Mover resource using Azure CLI. 

```bash
az storage-mover create --name
                        --resource-group
                        [--description]
                        [--location]
                        [--tags]
```

Note that `--resource-group`, `--description`, `--location`, and `--tags` are required parameters. 

---

## Next steps

Advance to one of the next articles to learn how to deploy a Storage Mover agent or create a migration project.
> [!div class="nextstepaction"]
> [Deploy a migration agent](agent-deploy.md)

> [!div class="nextstepaction"]
> [Create a migration project](project-manage.md)
