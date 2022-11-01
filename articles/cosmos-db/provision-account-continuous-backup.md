---
title: Provision an account with continuous backup and point in time restore in Azure Cosmos DB
description: Learn how to provision an account with continuous backup and point in time restore using Azure portal, PowerShell, CLI and Resource Manager templates.
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 08/24/2022
ms.author: govindk
ms.reviewer: mjbrown
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli

---

# Provision an Azure Cosmos DB account with continuous backup and point in time restore

[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

Azure Cosmos DB's point-in-time restore feature helps you to recover from an accidental change within a container, restore a deleted resource, or restore into any region where backups existed. The continuous backup mode allows you to restore to any point of time within the last 30 or 7 days. How far back you can go in time depends on the tier of the continuous mode for the account.

This article explains how to provision an account with continuous backup and point in time restore using [Azure portal](#provision-portal), [PowerShell](#provision-powershell), [CLI](#provision-cli) and [Resource Manager templates](#provision-arm-template).

> [!IMPORTANT]
> Support for 7-day continous backup in both provisioning and migration scenarios is still in preview. Please use PowerShell and Azure CLI to migrate or provision an account with continous backup configured at the 7-day tier.

> [!NOTE]
> You can provision continuous backup mode account only if the following conditions are true:
>
> * If the account is of type SQL API or API for MongoDB.
> * If the account is of type Table API or Gremlin API.
> * If the account has a single write region.

## <a id="provision-portal"></a>Provision using Azure portal

When creating a new Azure Cosmos DB account, in the **Backup policy** tab, choose **continuous** mode to enable the point in time restore functionality for the new account. With the point-in-time restore, data is restored to a new account, currently you can't restore to an existing account.

:::image type="content" source="./media/provision-account-continuous-backup/provision-account-continuous-mode.png" alt-text="Provision an Azure Cosmos DB account with continuous backup configuration." border="true" lightbox="./media/provision-account-continuous-backup/provision-account-continuous-mode.png":::

Table API and Gremlin API are in preview and can be provisioned with PowerShell and Azure CLI.

## <a id="provision-powershell"></a>Provision using Azure PowerShell

For PowerShell and CLI commands, the tier value is optional, if it isn't already provided. If not provided the account backup will be retained for 30 days. The tiers are represented by the values ``Continuous7Days`` or ``Continuous30Days``.

1. Install the latest version of Azure PowerShell

    * Before provisioning the account, install any version of Azure PowerShell higher than 6.2.0. For more information about the latest version of Azure PowerShell, see [latest version of Azure PowerShell](/powershell/azure/install-az-ps?view=azps-6.2.1&preserve-view=true).
    * For provisioning the ``Continuous7Days`` tier, you'll need to install the preview version of the module by running ``Install-Module -Name Az.CosmosDB -AllowPrerelease``.  

1. Next connect to your Azure account and select the required subscription with the following commands:

    1. Sign into Azure using the following command:

        ```azurepowershell
        Connect-AzAccount
        ```

    2. Select a specific subscription with the following command:

        ```azurepowershell
        Select-AzSubscription -Subscription <SubscriptionName>
        ```

### <a id="provision-powershell-sql-api"></a>SQL API account

To provision an account with continuous backup, add the argument `-BackupPolicyType Continuous` along with the regular provisioning command.

The following cmdlet assumes a single region write account, *Pitracct*, in the in *West US* region in the *MyRG* resource group. The account has continuous backup policy enabled. Continuous backup is configured at the ``Continuous7days`` tier:

```azurepowershell
New-AzCosmosDBAccount `
  -ResourceGroupName "MyRG" `
  -Location "West US" `
  -BackupPolicyType Continuous `
  -ContinuousTier Continuous7Days `
  -Name "pitracct" `
  -ApiKind "Sql"
```

### <a id="provision-powershell-mongodb-api"></a>API for MongoDB

The following cmdlet is an example of continuous backup account configured with the ``Continuous30days`` tier:

```azurepowershell
New-AzCosmosDBAccount `
  -ResourceGroupName "MyRG" `
  -Location "West US" `
  -BackupPolicyType Continuous `
  -ContinuousTier Continuous30Days `
  -Name "Pitracct" `
  -ApiKind "MongoDB" `
  -ServerVersion "3.6"
```

### <a id="provision-powershell-table-api"></a>Table API account

To provision an account with continuous backup, add an argument `-BackupPolicyType Continuous` along with the regular provisioning command.

The following cmdlet is an example of continuous backup policy with the ``Continuous7days`` tier:

```azurepowershell
New-AzCosmosDBAccount `
  -ResourceGroupName "MyRG" `
  -Location "West US" `
  -BackupPolicyType Continuous `
  -ContinuousTier Continuous7Days `
  -Name "pitracct" `
  -ApiKind "Table"
```

### <a id="provision-powershell-graph-api"></a>Gremlin API account

To provision an account with continuous backup, add an argument `-BackupPolicyType Continuous` along with the regular provisioning command.

The following cmdlet is an example of an account  with continuous backup policy configured with the ``Continuous30days`` tier:

```azurepowershell
New-AzCosmosDBAccount `
  -ResourceGroupName "MyRG" `
  -Location "West US" `
  -BackupPolicyType Continuous `
  -ContinuousTier Continuous30Days `
  -Name "pitracct" `
  -ApiKind "Gremlin" 
```

## <a id="provision-cli"></a>Provision using Azure CLI

For PowerShell and CLI commands tier value is optional, if it isn't provided – the account backup will be retained for 30 days. The tiers are represented by ``Continuous7Days`` or ``Continuous30Days``.

Before provisioning the account, install Azure CLI with the following steps:

1. Install the latest version of Azure CLI

   * Install a version of the Azure CLI higher than 2.26.0. For more information about the latest version of the Azure CLI, see [Azure CLI](/cli/azure/install-azure-cli).
   * If you have already installed CLI, run ``az upgrade`` command to update to the latest version. This command will only work with CLI version higher than 2.11. If you have an earlier version, use the above link to install the latest version.
   * For provisioning the ``Continuous7Days`` tier, you'll need to install the preview version of the extension by ``az extension update --name cosmosdb-preview``

2. Sign in and select your subscription

   * Sign into your Azure account with ``az login`` command.
   * Select the required subscription using ``az account set -s <subscriptionguid>`` command.

### <a id="provision-cli-sql-api"></a>SQL API account

To provision a SQL API account with continuous backup, an extra argument `--backup-policy-type Continuous` should be passed along with the regular provisioning command. The following command is an example of a single region write account named *Pitracct* with continuous backup policy and  ``Continuous7days`` tier:

```azurecli-interactive

az cosmosdb create \
  --name Pitracct \
  --resource-group MyRG \
  --backup-policy-type Continuous \
  --continuous-tier "Continuous7Days" \
  --default-consistency-level Session \
  --locations regionName="West US"

```

### <a id="provision-cli-mongo-api"></a>API for MongoDB

The following command shows an example of a single region write account named *Pitracct* with continuous backup policy and ``Continuous30days`` tier:

```azurecli-interactive
az cosmosdb create \
  --name Pitracct \
  --kind MongoDB \
  --resource-group MyRG \
  --server-version "3.6" \
  --backup-policy-type Continuous \
  --continuous-tier "Continuous30Days" \
  --default-consistency-level Session \
  --locations regionName="West US"
```

### <a id="provision-cli-table-api"></a>Table API account

The following command shows an example of a single region write account named *Pitracct* with continuous backup policy and ``Continuous30days`` tier:

```azurecli-interactive
az cosmosdb create \
  --name Pitracct \
  --kind GlobalDocumentDB  \
  --resource-group MyRG \
  --capabilities EnableTable \ 
  --backup-policy-type Continuous \
  --continuous-tier "Continuous30Days" \
  --default-consistency-level Session \
  --locations regionName="West US"
```

### <a id="provision-cli-graph-api"></a>Gremlin API account

The following command shows an example of a single region write account named *Pitracct* with continuous backup policy and ``Continuous7days`` tier created in  *West US* region under *MyRG* resource group:

```azurecli-interactive
az cosmosdb create \
  --name Pitracct \
  --kind GlobalDocumentDB  \
  --resource-group MyRG \
  --capabilities EnableGremlin \ 
  --backup-policy-type Continuous \
  --continuous-tier "Continuous7Days" \
  --default-consistency-level Session \
  --locations regionName="West US"
```

## <a id="provision-arm-template"></a>Provision using Resource Manager template

You can use Azure Resource Manager templates to deploy an Azure Cosmos DB account with continuous mode. When defining the template to provision an account, include the `backupPolicy` and tier parameter as shown in the following example, tier can be ``Continuous7Days`` or ``Continuous30Days`` :

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
        "backupPolicy":{
        "type":"Continuous", 
        "continuousModeProperties":{
        "tier":"Continuous7Days"
        }
        } 
        "databaseAccountOfferType": "Standard"
        }
        ]
        }

```

Next, deploy the template by using Azure PowerShell or CLI. The following example shows how to deploy the template with a CLI command:

```azurecli-interactive
az deployment group create -g <ResourceGroup> --template-file <ProvisionTemplateFilePath>
```

## Next steps

* [Restore a live or deleted Azure Cosmos DB account](restore-account-continuous-backup.md)
* [How to migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
* [Continuous backup mode resource model.](continuous-backup-restore-resource-model.md)
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
