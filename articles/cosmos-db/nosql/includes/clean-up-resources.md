---
title: include file
description: include file
services: cosmos-db
author: seesharprun
ms.service: cosmos-db
ms.topic: include
ms.date: 11/07/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: include file, ignite-2022
---

When you no longer need the API for NoSQL account, you can delete the corresponding resource group.

### [Portal](#tab/azure-portal)

1. Navigate to the resource group you previously created in the Azure portal.

    > [!TIP]
    > In this quickstart, we recommended the name ``msdocs-cosmos-quickstart-rg``.
1. Select **Delete resource group**.

   :::image type="content" source="../media/delete-account-portal/delete-resource-group-option.png" lightbox="../media/delete-account-portal/delete-resource-group-option.png" alt-text="Screenshot of the Delete resource group option in the navigation bar for a resource group.":::

1. On the **Are you sure you want to delete** dialog, enter the name of the resource group, and then select **Delete**.

   :::image type="content" source="../media/delete-account-portal/delete-confirmation.png" lightbox="../media/delete-account-portal/delete-confirmation.png" alt-text="Screenshot of the delete confirmation page for a resource group.":::

### [Azure CLI](#tab/azure-cli)

Use the [``az group delete``](/cli/azure/group#az-group-delete) command to delete the resource group.

```azurecli-interactive
az group delete --name $resourceGroupName
```

### [PowerShell](#tab/azure-powershell)

Use the [``Remove-AzResourceGroup``](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to delete the resource group.

```azurepowershell-interactive
$parameters = @{
    Name = $RESOURCE_GROUP_NAME
}
Remove-AzResourceGroup @parameters
```

---
