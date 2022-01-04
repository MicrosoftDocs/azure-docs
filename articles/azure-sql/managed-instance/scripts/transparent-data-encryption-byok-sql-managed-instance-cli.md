---
title: "Azure CLI example: Enable BYOK TDE - Azure SQL Managed Instance"
description: "Learn how to configure an Azure SQL Managed Instance to start using BYOK Transparent Data Encryption (TDE) for encryption-at-rest using PowerShell."
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: azurecli
ms.topic: conceptual
author: MladjoA
ms.author: mlandzic
ms.reviewer: vanto 
ms.date: 12/23/2021
---

# Manage Transparent Data Encryption in a Managed Instance using your own key from Azure Key Vault

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqlmi.md)]

This Azure CLI script example configures Transparent Data Encryption (TDE) with customer-managed key for Azure SQL Managed Instance, using a key from Azure Key Vault. This is often referred to as a Bring Your Own Key scenario for TDE. To learn more about the TDE with customer-managed key, see [TDE Bring Your Own Key to Azure SQL](../../../azure-sql/database/transparent-data-encryption-byok-overview.md).

This sample requires an existing Managed Instance, see [Use Azure CLI to create an Azure SQL Managed Instance](create-configure-managed-instance-cli.md).

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

### Sign in to Azure

For this script, use Azure CLI locally as it takes too long to run in Cloud Shell. Use the following script to sign in using a specific subscription. [!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
subscription="<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

For more information, see [set active subscription](/cli/azure/account#az_account_set) or [log in interactively](/cli/azure/reference-index#az_login)

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/transparent-data-encryption/setup-tde-byok-sqlmi.sh" range="4-41":::

### Clean up resources

Use the following command to remove the resource group and all resources associated with it using the [az group delete](/cli/azure/vm/extension#az_vm_extension_set) command- unless you have additional needs for these resources. Some of these resources may take a while to create, as well as to delete.

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql db](/cli/azure/sql/db) | Database commands. |
| [az sql failover-group](/cli/azure/sql/failover-group) | Failover group commands. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../../azure-sql/database/az-cli-script-samples-content-guide.md).
