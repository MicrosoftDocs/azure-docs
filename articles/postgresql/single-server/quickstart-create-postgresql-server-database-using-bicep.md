---
title: 'Quickstart: Create an Azure Database for PostgreSQL - Bicep'
description: In this quickstart, learn how to create an Azure Database for PostgreSQL single server using Bicep.
ms.service: postgresql
ms.subservice: single-server
ms.topic: quickstart
ms.author: jroth
author: rothja
ms.custom: subject-armqs, mode-arm
ms.date: 06/24/2022
---

# Quickstart: Use Bicep to create an Azure Database for PostgreSQL - single server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Azure Database for PostgreSQL is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. In this quickstart, you use Bicep to create an Azure Database for PostgreSQL - single server in Azure CLI or PowerShell.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

You'll need an Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

# [CLI](#tab/CLI)

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

* If you want to run the code locally, [Azure CLI](/cli/azure/).

# [PowerShell](#tab/PowerShell)

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

* If you want to run the code locally, [Azure PowerShell](/powershell/azure/).

---

## Review the Bicep file

You create an Azure Database for PostgreSQL server with a configured set of compute and storage resources. To learn more, see [Pricing tiers in Azure Database for PostgreSQL - Single Server](concepts-pricing-tiers.md). You create the server within an [Azure resource group](../../azure-resource-manager/management/overview.md).

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/managed-postgresql-with-vnet/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.dbforpostgresql/managed-postgresql-with-vnet/main.bicep":::

The Bicep file defines five Azure resources:

* [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
* [**Microsoft.Network/virtualNetworks/subnets**](/azure/templates/microsoft.network/virtualnetworks/subnets)
* [**Microsoft.DBforPostgreSQL/servers**](/azure/templates/microsoft.dbforpostgresql/servers)
* [**Microsoft.DBforPostgreSQL/servers/virtualNetworkRules**](/azure/templates/microsoft.dbforpostgresql/servers/virtualnetworkrules)
* [**Microsoft.DBforPostgreSQL/servers/firewallRules**](/azure/templates/microsoft.dbforpostgresql/servers/firewallrules)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters serverName=<server-name> administratorLogin=<admin-login>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -serverName "<server-name>" -administratorLogin "<admin-login>"
    ```

    ---

    > [!NOTE]
    > Replace **\<server-name\>** with the name of the server for Azure database for PostgreSQL. Replace **\<admin-login\>** with the database administrator name, which has a minimum length of one character. You'll also be prompted to enter **administratorLoginPassword**, which has a minimum length of eight characters.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When it's no longer needed, delete the resource group, which deletes the resources in the resource group.

# [CLI](#tab/CLI)

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

For a step-by-step tutorial that guides you through the process of creating a Bicep file, see:

> [!div class="nextstepaction"]
> [Quickstart: Create Bicep files with Visual Studio Code](../../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md)
