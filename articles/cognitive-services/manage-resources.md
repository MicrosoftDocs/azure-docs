---
title: Recover deleted Cognitive Services resource
titleSuffix: Azure Cognitive Services
description: This article provides instructions on how to recover an already-deleted Cognitive Services resource.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: how-to
ms.date: 07/02/2021
ms.author: aahi
---

# Recover deleted Cognitive Services resources

This article provides instructions on how to recover a Cognitive Services resource that is already deleted. The article also provides instructions on how to purge a deleted resource.

> [!NOTE]
> The instructions in this article are applicable to both a multi-service resource and a single-service resource. A multi-service resource enables access to multiple cognitive services using a single key and endpoint. On the other hand, a single-service resource enables access to just that specific cognitive service for which the resource was created.

## Prerequisites

* The resource to be recovered must have been deleted within the past 48 hours.
* The resource to be recovered must not have been purged already. A purged resource cannot be recovered.
* Before you attempt to recover a deleted resource, make sure that the resource group for that account exists. If the resource group was deleted, you must recreate it. Recovering a resource group is not possible. For more information, see [Manage resource groups](../azure-resource-manager/management/manage-resource-groups-portal.md).
* If the deleted resource used customer-managed keys with Azure Key Vault and the key vault has also been deleted, then you must restore the key vault before you restore the Cognitive Services resource. For more information, see [Azure Key Vault recovery management](../key-vault/general/key-vault-recovery.md).
* If the deleted resource used a customer-managed storage and storage account has also been deleted, you must restore the storage account before you restore the Cognitive Services resource. For instructions, see [Recover a deleted storage account](../storage/common/storage-account-recover.md).

Your subscription must have `Microsoft.CognitiveServices/locations/resourceGroups/deletedAccounts/delete` permissions to purge resources, such as [Cognitive Services Contributor](../role-based-access-control/built-in-roles.md#cognitive-services-contributor) or [Contributor](../role-based-access-control/built-in-roles.md#contributor). 

## Recover a deleted resource 

To recover a deleted cognitive service resource, use the following commands. Where applicable, replace:

* `{subscriptionID}` with your Azure subscription ID
* `{resourceGroup}` with your resource group
* `{resourceName}` with your resource name
* `{location}` with the location of your resource


# [Azure portal](#tab/azure-portal)

If you need to recover a deleted resource, navigate to the hub of the cognitive services API type and select "Manage deleted resources" from the menu. For example, if you would like to recover an "Anomaly detector" resource, search for "Anomaly detector" in the search bar and select the service to get to the "Anomaly detector" hub which lists deleted resources.

:::image type="content" source="media/recovery-deleted-resource.png" alt-text="A screenshot showing the Anomaly detector hub, which lets you recover deleted resources." lightbox="media/recovery-deleted-resource.png":::

Select the subscription in the dropdown list to locate the deleted resource you would like to recover. Select one or more of the deleted resources and click **Recover**. 

:::image type="content" source="media/managing-deleted-resource.png" alt-text="A screenshot showing deleted resources you can recover." lightbox="media/managing-deleted-resource.png":::

> [!NOTE] 
> It can take a couple of minutes for your deleted resource(s) to recover and show up in the list of the resources. Click on the **Refresh** button in the menu to update the list of resources.

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

Once you delete a resource, you won't be able to create another one with the same name for 48 hours. To create a resource with the same name, you will need to purge the deleted resource.

To purge a deleted cognitive service resource, use the following commands. Where applicable, replace:

* `{subscriptionID}` with your Azure subscription ID
* `{resourceGroup}` with your resource group
* `{resourceName}` with your resource name
* `{location}` with the location of your resource

> [!NOTE]
> Once a resource is purged, it is permanently deleted and cannot be restored. You will lose all data and keys associated with the resource.


# [Azure portal](#tab/azure-portal)

If you need to purge a deleted resource, the steps are similar to recovering a deleted resource.

Navigate to the hub of the cognitive services API type of your deleted resource. For example, if you would like to purge an "Anomaly detector" resource, search for "Anomaly detector" in the search bar. Select the service to get to the "Anomaly detector" hub which lists deleted resources.

Select **Manage deleted resources** from the menu. 

:::image type="content" source="media/recovery-deleted-resource.png" alt-text="A screenshot showing the Anomaly detector hub, which lets you purge deleted resources." lightbox="media/recovery-deleted-resource.png":::

Select the subscription in the dropdown list to locate the deleted resource you would like to purge.
Select one or more deleted resources and click **Purge**.
Purging will permanently delete a Cognitive Services resource. 

:::image type="content" source="media/managing-deleted-resource.png" alt-text="A screenshot showing a list of resources that can be purged." lightbox="media/managing-deleted-resource.png":::


# [Rest API](#tab/rest-api)

Use the following `DELETE` command:

```rest-api
https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.CognitiveServices/locations/{location}/resourceGroups/{resourceGroup}/deletedAccounts/{resourceName}?Api-Version=2021-04-30`
```

# [PowerShell](#tab/powershell)

```powershell
Remove-AzResource -ResourceId /subscriptions/{subscriptionID}/providers/Microsoft.CognitiveServices/locations/{location}/resourceGroups/{resourceGroup}/deletedAccounts/{resourceName}  -ApiVersion 2021-04-30`
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az resource delete --ids /subscriptions/{subscriptionId}/providers/Microsoft.CognitiveServices/locations/{location}/resourceGroups/{resourceGroup}/deletedAccounts/{resourceName}
```

---


## See also
* [Create a new resource using the Azure portal](cognitive-services-apis-create-account.md)
* [Create a new resource using the Azure CLI](cognitive-services-apis-create-account-cli.md)
* [Create a new resource using the client library](cognitive-services-apis-create-account-client-library.md)
* [Create a new resource using an ARM template](create-account-resource-manager-template.md)