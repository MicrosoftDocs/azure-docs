---
title: Create a resource instance network rule for Azure Storage
description: Configure the Azure Storage firewall to accept requests from resource instances.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Create a resource instance network rule for Azure Storage

You can enable traffic from specific Azure resource instances by creating a *resource instance network rule*. 

Resource instance network rules can be combined with other network rules to control traffic to your storage account. To learn more, see [Azure Storage firewall and virtual network rules](storage-network-security.md).

## Create a resource instance network rule

### [Portal](#tab/azure-portal)

You can add or remove resource instance network rules in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Locate your storage account and display the account overview.

3. In the service menu, under **Security + networking**, select **Networking**.

4. Verify that you've chosen to enable public network access from selected virtual networks and IP addresses.

5. Scroll down to the **Resource instances** section. In the **Resource type** dropdown list, select the resource type for your resource instance.

6. In the **Instance name** dropdown list, select the resource instance. You can also choose to include all resource instances in the current tenant, subscription, or resource group.

7. Select **Save** to apply your changes. The resource instance appears in the **Resource instances** section of the network settings page.

To remove the resource instance, select the delete icon (:::image type="icon" source="media/storage-network-security/delete-icon.png":::) next to the resource instance.

### [PowerShell](#tab/azure-powershell)

You can use PowerShell commands to add or remove resource instance network rules.

#### Grant access

Add a network rule that grants access from a resource instance:

```powershell
$resourceId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myDataFactory"
$tenantId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

Add-AzStorageAccountNetworkRule -ResourceGroupName $resourceGroupName -Name $accountName -TenantId $tenantId -ResourceId $resourceId

```

Specify multiple resource instances at once by modifying the network rule set:

```powershell
$resourceId1 = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myDataFactory"
$resourceId2 = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Sql/servers/mySQLServer"
$tenantId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

Update-AzStorageAccountNetworkRuleSet -ResourceGroupName $resourceGroupName -Name $accountName -ResourceAccessRule (@{ResourceId=$resourceId1;TenantId=$tenantId},@{ResourceId=$resourceId2;TenantId=$tenantId}) 
```

#### Remove access

Remove a network rule that grants access from a resource instance:

```powershell
$resourceId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myDataFactory"
$tenantId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

Remove-AzStorageAccountNetworkRule -ResourceGroupName $resourceGroupName -Name $accountName -TenantId $tenantId -ResourceId $resourceId  
```

Remove all network rules that grant access from resource instances:

```powershell
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

Update-AzStorageAccountNetworkRuleSet -ResourceGroupName $resourceGroupName -Name $accountName -ResourceAccessRule @()  
```

#### View a list of allowed resource instances

View a complete list of resource instances that have access to the storage account:

```powershell
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

$rule = Get-AzStorageAccountNetworkRuleSet -ResourceGroupName $resourceGroupName -Name $accountName
$rule.ResourceAccessRules 
```

### [Azure CLI](#tab/azure-cli)

You can use Azure CLI commands to add or remove resource instance network rules.

#### Grant access

Add a network rule that grants access from a resource instance:

```azurecli
az storage account network-rule add \
    --resource-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Synapse/workspaces/testworkspace \
    --tenant-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    -g myResourceGroup \
    --account-name mystorageaccount
```

#### Remove access

Remove a network rule that grants access from a resource instance:

```azurecli
az storage account network-rule remove \
    --resource-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Synapse/workspaces/testworkspace \
    --tenant-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    -g myResourceGroup \
    --account-name mystorageaccount
```

#### View a list of allowed resource instances

View a complete list of resource instances that have access to the storage account:

```azurecli
az storage account network-rule list \
    -g myResourceGroup \
    --account-name mystorageaccount
```

---

## See also

- [Azure Storage firewall and virtual network rules](storage-network-security.md)
