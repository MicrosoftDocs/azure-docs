---
title: Provision an account with continuous backup and point in time restore in Azure Cosmos DB
description: Learn how to provision an account with continuous backup and point in time restore using Azure portal, PowerShell, CLI and Resource Manager templates.
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 07/29/2021
ms.author: govindk
ms.reviewer: sngun
ms.custom: devx-track-azurepowershell

---

# Provision an Azure Cosmos DB account with continuous backup and point in time restore 
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

Azure Cosmos DB's point-in-time restore feature helps you to recover from an accidental change within a container, to restore a deleted account, database, or a container or to restore into any region (where backups existed). The continuous backup mode allows you to do restore to any point of time within the last 30 days.

This article explains how to provision an account with continuous backup and point in time restore using [Azure portal](#provision-portal), [PowerShell](#provision-powershell), [CLI](#provision-cli) and [Resource Manager templates](#provision-arm-template).

> [!NOTE]
> You can provision continuous backup mode account only if the following conditions are true:
>
> * If the account is of type SQL API or API for MongoDB.
> * If the account has a single write region.
> * If the account isn't enabled with customer managed keys(CMK).

## <a id="provision-portal"></a>Provision using Azure portal

When creating a new Azure Cosmos DB account, in the **Backup policy** tab, choose **continuous** mode to enable the point in time restore functionality for the new account. With the point-in-time restore, data is restored to a new account, currently you can't restore to an existing account.

:::image type="content" source="./media/provision-account-continuous-backup/configure-continuous-backup-portal.png" alt-text="Provision an Azure Cosmos DB account with continuous backup configuration." border="true" lightbox="./media/provision-account-continuous-backup/configure-continuous-backup-portal.png":::

## <a id="provision-powershell"></a>Provision using Azure PowerShell

Before provisioning the account, install the [latest version of Azure PowerShell](/powershell/azure/install-az-ps?view=azps-6.2.1&preserve-view=true) or version higher than 6.2.0. Next connect to your Azure account and select the required subscription with the following commands:

1. Sign into Azure using the following command:

   ```azurepowershell
   Connect-AzAccount
   ```

1. Select a specific subscription with the following command:

   ```azurepowershell
   Select-AzSubscription -Subscription <SubscriptionName>
   ```

#### <a id="provision-powershell-sql-api"></a>SQL API account

To provision an account with continuous backup, add an argument `-BackupPolicyType Continuous` along with the regular provisioning command.

The following cmdlet is an example of a single region write account *Pitracct* with continuous backup policy created in *West US* region under *MyRG* resource group:

```azurepowershell

New-AzCosmosDBAccount `
  -ResourceGroupName "MyRG" `
  -Location "West US" `
  -BackupPolicyType Continuous `
  -Name "pitracct" `
  -ApiKind "Sql"
   	  
```

#### <a id="provision-powershell-mongodb-api"></a>API for MongoDB

The following cmdlet is an example of continuous backup account *Pitracct* created in *West US* region under *MyRG* resource group:

```azurepowershell

New-AzCosmosDBAccount `
  -ResourceGroupName "MyRG" `
  -Location "West US" `
  -BackupPolicyType Continuous `
  -Name "Pitracct" `
  -ApiKind "MongoDB" `
  -ServerVersion "3.6"

```

## <a id="provision-cli"></a>Provision using Azure CLI

Before provisioning the account, install Azure CLI with the following steps:

1. Install the latest version of Azure CLI

   * Install the latest version of [Azure CLI](/cli/azure/install-azure-cli) or version higher than 2.26.0
   * If you have already installed CLI, run `az upgrade` command to update to the latest version. This command will only work with CLI version higher than 2.11. If you have an earlier version, use the above link to install the latest version.

1. Sign in and select your subscription

   * Sign into your Azure account with `az login` command.
   * Select the required subscription using `az account set -s <subscriptionguid>` command.

### <a id="provision-cli-sql-api"></a>SQL API account

To provision a SQL API account with continuous backup, an extra argument `--backup-policy-type Continuous` should be passed along with the regular provisioning command. The following command is an example of a single region write account named *Pitracct* with continuous backup policy created in the *West US* region under *MyRG* resource group:

```azurecli-interactive

az cosmosdb create \
  --name Pitracct \
  --resource-group MyRG \
  --backup-policy-type Continuous \
  --default-consistency-level Session \
  --locations regionName="West US"

```

### <a id="provision-cli-mongo-api"></a>API for MongoDB

The following command shows an example of a single region write account named *Pitracct* with continuous backup policy created the *West US* region under *MyRG* resource group:

```azurecli-interactive

az cosmosdb create \
  --name Pitracct \
  --kind MongoDB \
  --resource-group MyRG \
  --server-version "3.6" \
  --backup-policy-type Continuous \
  --default-consistency-level Session \
  --locations regionName="West US"

```

## <a id="provision-arm-template"></a>Provision using Resource Manager template

You can use Azure Resource Manager templates to deploy an Azure Cosmos DB account with continuous mode. When defining the template to provision an account, include the `backupPolicy` parameter as shown in the following example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "ademo-pitr1",
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2016-03-31",
      "location": "West US",
      "properties": {
        "locations": [
          {
            "locationName": "West US"
          }
        ],
        "backupPolicy": {
          "type": "Continuous"
        },
        "databaseAccountOfferType": "Standard"
      }
    }
  ]
}
```

Next deploy the template by using Azure PowerShell or CLI. The following example shows how to deploy the template with a CLI command:

```azurecli-interactive
az group deployment create -g <ResourceGroup> --template-file <ProvisionTemplateFilePath>
```

## Next steps

* [Restore a live or deleted Azure Cosmos DB account](restore-account-continuous-backup.md)
* [How to migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
* [Continuous backup mode resource model.](continuous-backup-restore-resource-model.md)
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.