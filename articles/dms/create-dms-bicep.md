---
title: Create instance of DMS (Bicep)
description: Learn how to create Database Migration Service by using Bicep.
author: abhims14
ms.author: abhishekum
ms.date: 03/21/2022
ms.service: dms
ms.topic: quickstart
ms.custom:
  - subject-armqs
  - mode-arm
  - devx-track-bicep
  - sql-migration-content
---

# Quickstart: Create instance of Azure Database Migration Service using Bicep

Use Bicep to deploy an instance of the Azure Database Migration Service.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-database-migration-simple-deploy/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.datamigration/azure-database-migration-simple-deploy/main.bicep":::

Three Azure resources are defined in the Bicep file:

- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): Creates the virtual network.
- [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates the subnet.
- [Microsoft.DataMigration/services](/azure/templates/microsoft.datamigration/services): Deploys an instance of the Azure Database Migration Service.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters serviceName=<service-name> vnetName=<vnet-name> subnetName=<subnet-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -serviceName "<service-name>" -vnetName "<vnet-name>" -subnetName "<subnet-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<service-name\>** with the name of the new migration service. Replace **\<vnet-name\>** with the name of the new virtual network. Replace **\<subnet-name\>** with the name of the new subnet associated with the virtual network.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

For other ways to deploy Azure Database Migration Service, see [Azure portal](quickstart-create-data-migration-service-portal.md).

To learn more, see [an overview of Azure Database Migration Service](dms-overview.md).
