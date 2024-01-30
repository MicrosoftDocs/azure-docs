---
title: Delete resource group and resources
description: Describes how to delete resource groups and resources. It describes how Azure Resource Manager orders the deletion of resources when a deleting a resource group. It describes the response codes and how Resource Manager handles them to determine if the deletion succeeded. 
ms.topic: conceptual
ms.date: 09/27/2023
ms.custom: seodec18, devx-track-arm-template
content_well_notification: 
  - AI-contribution
---

# Azure Resource Manager resource group and resource deletion

This article shows how to delete resource groups and resources. It describes how Azure Resource Manager orders the deletion of resources when you delete a resource group.

## How order of deletion is determined

When you delete a resource group, Resource Manager determines the order to delete resources. It uses the following order:

1. All the child (nested) resources are deleted.

2. Resources that manage other resources are deleted next. A resource can have the `managedBy` property set to indicate that a different resource manages it. When this property is set, the resource that manages the other resource is deleted before the other resources.

3. The remaining resources are deleted after the previous two categories.

After the order is determined, Resource Manager issues a DELETE operation for each resource. It waits for any dependencies to finish before proceeding.

For synchronous operations, the expected successful response codes are:

* 200
* 204
* 404

For asynchronous operations, the expected successful response is 202. Resource Manager tracks the location header or the azure-async operation header to determine the status of the asynchronous delete operation.
  
### Deletion errors

When a delete operation returns an error, Resource Manager retries the DELETE call. Retries happen for the 5xx, 429 and 408 status codes. By default, the time period for retry is 15 minutes.

## After deletion

Resource Manager issues a GET call on each resource that it tried to delete. The response of this GET call is expected to be 404. When Resource Manager gets a 404, it considers the deletion to have completed successfully. Resource Manager removes the resource from its cache.

However, if the GET call on the resource returns a 200 or 201, Resource Manager recreates the resource.

If the GET operation returns an error, Resource Manager retries the GET for the following error code:

* Less than 100
* 408
* 429
* Greater than 500

For other error codes, Resource Manager fails the deletion of the resource.

> [!IMPORTANT]
> Resource Group deletion is irreversible.

## Delete resource group

Use one of the following methods to delete the resource group.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name ExampleResourceGroup
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --name ExampleResourceGroup
```

# [Portal](#tab/azure-portal)

1. In the [portal](https://portal.azure.com), select the resource group you want to delete.

1. Select **Delete resource group**.

   :::image type="content" source="./media/delete-resource-group/delete-group.png" alt-text="Screenshot of the Delete resource group button in the Azure portal.":::

1. To confirm the deletion, type the name of the resource group

# [Python](#tab/azure-python)

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

rg_result = resource_client.resource_groups.begin_delete("exampleGroup")
```

---

## Delete resource

Use one of the following methods to delete a resource.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResource `
  -ResourceGroupName ExampleResourceGroup `
  -ResourceName ExampleVM `
  -ResourceType Microsoft.Compute/virtualMachines
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az resource delete \
  --resource-group ExampleResourceGroup \
  --name ExampleVM \
  --resource-type "Microsoft.Compute/virtualMachines"
```

# [Portal](#tab/azure-portal)

1. In the [portal](https://portal.azure.com), select the resource you want to delete.

1. Select **Delete**. The following screenshot shows the management options for a virtual machine.

   :::image type="content" source="./media/delete-resource-group/delete-resource.png" alt-text="Screenshot of the Delete button for a virtual machine in the Azure portal.":::

1. When prompted, confirm the deletion.

# [Python](#tab/azure-python)

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_client.resources.begin_delete_by_id(
    "/subscriptions/{}/resourceGroups/{}/providers/{}/{}".format(
        subscription_id,
        "exampleGroup",
        "Microsoft.Compute",
        "virtualMachines/exampleVM"
    ),
    "2022-11-01"
)
```

---

## Required access and deletion failures

To delete a resource group, you need access to the delete action for the **Microsoft.Resources/subscriptions/resourceGroups** resource.

> [!IMPORTANT]
> The only permission required to delete a resource group is permission to the delete action for deleting resource groups.  You do **not** need permission to delete individual resources within that resource group.  Additionally, delete actions that are specified in **notActions** for a roleAssignment are superseded by the resource group delete action.  This is consistent with the scope hierarchy in the Azure role-based access control model.

For a list of operations, see [Azure resource provider operations](../../role-based-access-control/resource-provider-operations.md). For a list of built-in roles, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

If you have the required access, but the delete request fails, it may be because there's a [lock on the resources or resource group](lock-resources.md). Even if you didn't manually lock a resource group, [a related service may have automatically locked it](lock-resources.md#managed-applications-and-locks). Or, the deletion can fail if the resources are connected to resources in other resource groups that aren't being deleted. For example, you can't delete a virtual network with subnets that are still in use by a virtual machine.

## Can I recover a deleted resource group?

No, you can't recover a deleted resource group. However, you might be able to resore some recently deleted resources.

Some resource types support *soft delete*. You might have to configure soft delete before you can use it. For information about enabling soft delete, see:

* [Azure Key Vault soft-delete overview](../../key-vault/general/soft-delete-overview.md)
* [Azure Storage - Soft delete for containers](../../storage/blobs/soft-delete-container-overview.md)
* [Azure Storage - Soft delete for blobs](../../storage/blobs/soft-delete-blob-overview.md)
* [Soft delete for Azure Backup](../../backup/backup-azure-security-feature-cloud.md)
* [Soft delete for SQL server in Azure VM and SAP HANA in Azure VM workloads](../../backup/soft-delete-sql-saphana-in-azure-vm.md)
* [Soft delete for virtual machines](../..//backup/soft-delete-virtual-machines.md)

To restore deleted resources, see:

* [Recover deleted Azure AI services resources](../../ai-services/manage-resources.md)
* [Microsoft Entra - Recover from deletions](../../active-directory/architecture/recover-from-deletions.md)

You can also [open an Azure support case](../../azure-portal/supportability/how-to-create-azure-support-request.md). Provide as much detail as you can about the deleted resources, including their resource IDs, types, and resource names. Request that the support engineer check if the resources can be restored.

> [!NOTE]
> Recovery of deleted resources is not possible under all circumstances. A support engineer will investigate your scenario and advise you whether it's possible.

## Next steps

* To understand Resource Manager concepts, see [Azure Resource Manager overview](overview.md).
* For deletion commands, see [PowerShell](/powershell/module/az.resources/Remove-AzResourceGroup), [Azure CLI](/cli/azure/group#az-group-delete), and [REST API](/rest/api/resources/resourcegroups/delete).
