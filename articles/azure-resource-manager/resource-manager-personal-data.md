---
title: Azure Resource Manager personal data | Microsoft Docs
description: Learn how to manage personal data associated with Azure Resource Manager operations.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 05/14/2018
ms.author: tomfitz

---
# Manage personal data associated with Azure Resource Manager

To avoid exposing sensitive information, delete any personal information you may have provided in deployments, resource groups, or tags. Azure Resource Manager provides operations that let you manage personal data you may have provided in deployments, resource groups, or tags.

[!INCLUDE [Handle personal data](../../includes/gdpr-intro-sentence.md)]

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Delete personal data in deployment history

For deployments, Resource Manager retains parameter values and status messages in the deployment history. These values persist until you delete the deployment from the history. To see if you have provided personal data in these values, list the deployments. If you find personal data, delete the deployments from the history.

To list **deployments** in the history, use:

* [List By Resource Group](/rest/api/resources/deployments/listbyresourcegroup)
* [Get-AzResourceGroupDeployment](/powershell/module/az.resources/Get-AzResourceGroupDeployment)
* [az group deployment list](/cli/azure/group/deployment#az-group-deployment-list)

To delete **deployments** from the history, use:

* [Delete](/rest/api/resources/deployments/delete)
* [Remove-AzResourceGroupDeployment](/powershell/module/az.resources/Remove-AzResourceGroupDeployment)
* [az group deployment delete](/cli/azure/group/deployment#az-group-deployment-delete)

## Delete personal data in resource group names

The name of the resource group persists until you delete the resource group. To see if you have provided personal data in the names, list the resource groups. If you find personal data, [move the resources](resource-group-move-resources.md) to a new resource group, and delete the resource group with personal data in the name.

To list **resource groups**, use:

* [List](/rest/api/resources/resourcegroups/list)
* [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup)
* [az group list](/cli/azure/group#az-group-list)

To delete **resource groups**, use:

* [Delete](/rest/api/resources/resourcegroups/delete)
* [Remove-AzResourceGroup](/powershell/module/az.resources/Remove-AzResourceGroup)
* [az group delete](/cli/azure/group#az-group-delete)

## Delete personal data in tags

Tags names and values persist until you delete or modify the tag. To see if you have provided personal data in the tags, list the tags. If you find personal data, delete the tags.

To list **tags**, use:

* [List](/rest/api/resources/tags/list)
* [Get-AzTag](/powershell/module/az.resources/Get-AzTag)
* [az tag list](/cli/azure/tag#az-tag-list)

To delete **tags**, use:

* [Delete](/rest/api/resources/tags/delete)
* [Remove-AzTag](/powershell/module/az.resources/Remove-AzTag)
* [az tag delete](/cli/azure/tag#az-tag-delete)

## Next steps
* For an overview of Azure Resource Manager, see the [What is Resource Manager?](resource-group-overview.md)