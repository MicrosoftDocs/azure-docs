---
title: Recover or purge deleted Azure AI services resources
titleSuffix: Azure AI services
description: This article provides instructions on how to recover or purge an already-deleted Azure AI services resource.
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.topic: how-to
ms.date: 10/5/2023
ms.author: eur
---

# Recover or purge deleted Azure AI services resources

This article provides instructions on how to recover or purge an Azure AI services resource that is already deleted. 

Once you delete a resource, you won't be able to create another one with the same name for 48 hours. To create a resource with the same name, you will need to purge the deleted resource.

> [!NOTE]
> The instructions in this article are applicable to both a multi-service resource and a single-service resource. A multi-service resource enables access to multiple Azure AI services using a single key and endpoint. On the other hand, a single-service resource enables access to just that specific Azure AI service for which the resource was created.

## Recover a deleted resource

The following prerequisites must be met before you can recover a deleted resource:

* The resource to be recovered must have been deleted within the past 48 hours.
* The resource to be recovered must not have been purged already. A purged resource cannot be recovered.
* Before you attempt to recover a deleted resource, make sure that the resource group for that account exists. If the resource group was deleted, you must recreate it. Recovering a resource group is not possible. For more information, see [Manage resource groups](../azure-resource-manager/management/manage-resource-groups-portal.md).
* If the deleted resource used customer-managed keys with Azure Key Vault and the key vault has also been deleted, then you must restore the key vault before you restore the Azure AI services resource. For more information, see [Azure Key Vault recovery management](../key-vault/general/key-vault-recovery.md).
* If the deleted resource used a customer-managed storage and storage account has also been deleted, you must restore the storage account before you restore the Azure AI services resource. For instructions, see [Recover a deleted storage account](../storage/common/storage-account-recover.md).

To recover a deleted Azure AI services resource, use the following commands. Where applicable, replace:

* `{subscriptionID}` with your Azure subscription ID
* `{resourceGroup}` with your resource group
* `{resourceName}` with your resource name
* `{location}` with the location of your resource


# [Azure portal](#tab/azure-portal)

If you need to recover a deleted resource, navigate to the hub of the Azure AI services API type and select "Manage deleted resources" from the menu. For example, if you would like to recover an "Anomaly detector" resource, search for "Anomaly detector" in the search bar and select the service. Then select **Manage deleted resources**.

Select the subscription in the dropdown list to locate the deleted resource you would like to recover. Select one or more of the deleted resources and select **Recover**. 

:::image type="content" source="media/managing-deleted-resource.png" alt-text="A screenshot showing deleted resources you can recover." lightbox="media/managing-deleted-resource.png":::

> [!NOTE] 
> It can take a couple of minutes for your deleted resource(s) to recover and show up in the list of the resources. Select the **Refresh** button in the menu to update the list of resources.

# [Rest API](#tab/rest-api)

Use the following `PUT` command:

```rest-api
https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroup}/providers/Microsoft.CognitiveServices/accounts/{resourceName}?Api-Version=2021-04-30
```

In the request body, use the following JSON format:

```json
{ 
  "location": "{location}", 
   "properties": { 
        "restore": true 
    } 
} 
```

# [PowerShell](#tab/powershell)

Use the following command to restore the resource: 

```powershell
New-AzResource -Location {location} -Properties @{restore=$true} -ResourceId /subscriptions/{subscriptionID}/resourceGroups/{resourceGroup}/providers/Microsoft.CognitiveServices/accounts/{resourceName}   -ApiVersion 2021-04-30 
```

If you need to find the name of your deleted resources, you can get a list of deleted resource names with the following command: 

```powershell
Get-AzResource -ResourceId /subscriptions/{subscriptionId}/providers/Microsoft.CognitiveServices/deletedAccounts -ApiVersion 2021-04-30 
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az resource create --subscription {subscriptionID} -g {resourceGroup} -n {resourceName} --location {location} --namespace Microsoft.CognitiveServices --resource-type accounts --properties "{\"restore\": true}"
```

---

## Purge a deleted resource 

Your subscription must have `Microsoft.CognitiveServices/locations/resourceGroups/deletedAccounts/delete` permissions to purge resources, such as [Cognitive Services Contributor](../role-based-access-control/built-in-roles.md#cognitive-services-contributor) or [Contributor](../role-based-access-control/built-in-roles.md#contributor). 

When using `Contributor` to purge a resource the role must be assigned at the subscription level. If the role assignment is only present at the resource or resource group level you will be unable to access the purge functionality.

To purge a deleted Azure AI services resource, use the following commands. Where applicable, replace:

* `{subscriptionID}` with your Azure subscription ID
* `{resourceGroup}` with your resource group
* `{resourceName}` with your resource name
* `{location}` with the location of your resource

> [!NOTE]
> Once a resource is purged, it is permanently deleted and cannot be restored. You will lose all data and keys associated with the resource.


# [Azure portal](#tab/azure-portal)

If you need to purge a deleted resource, the steps are similar to recovering a deleted resource.

1. Navigate to the hub of the Azure AI services API type of your deleted resource. For example, if you would like to purge an "Anomaly detector" resource, search for "Anomaly detector" in the search bar and select the service. Then select **Manage deleted resources** from the menu.

1. Select the subscription in the dropdown list to locate the deleted resource you would like to purge.

1. Select one or more deleted resources and select **Purge**. Purging will permanently delete an Azure AI services resource. 

    :::image type="content" source="media/managing-deleted-resource.png" alt-text="A screenshot showing a list of resources that can be purged." lightbox="media/managing-deleted-resource.png":::


# [Rest API](#tab/rest-api)

Use the following `DELETE` command:

```rest-api
https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.CognitiveServices/locations/{location}/resourceGroups/{resourceGroup}/deletedAccounts/{resourceName}?Api-Version=2021-04-30`
```

# [PowerShell](#tab/powershell)

```powershell
Remove-AzResource -ResourceId /subscriptions/{subscriptionID}/providers/Microsoft.CognitiveServices/locations/{location}/resourceGroups/{resourceGroup}/deletedAccounts/{resourceName}  -ApiVersion 2021-04-30
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az resource delete --ids /subscriptions/{subscriptionId}/providers/Microsoft.CognitiveServices/locations/{location}/resourceGroups/{resourceGroup}/deletedAccounts/{resourceName}
```

---


## See also
* [Create a multi-service resource](multi-service-resource.md)
* [Create a new resource using an ARM template](create-account-resource-manager-template.md)
