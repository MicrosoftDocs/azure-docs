---
title: Use ARM template to configure continuous backup and point in time restore in Azure Cosmos DB.
description: Learn how to provision an account with continuous backup and restore data using Azure Resource Manager Templates.
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 02/01/2021
ms.author: govindk
ms.reviewer: sngun

---

# Configure and manage continuous backup and point in time restore (Preview) - using Azure Resource Manager templates
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Cosmos DB's point-in-time restore feature(Preview) helps you to recover from an accidental change within a container, to restore a deleted account, database, or a container or to restore into any region (where backups existed). The continuous backup mode allows you to do restore to any point of time within the last 30 days.

This article describes how to provision an account with continuous backup and restore data using Azure Resource Manager Templates.

## <a id="provision"></a>Provision an account with continuous backup

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

## <a id="restore"></a>Restore using the Resource Manager template

You can also restore an account using Resource Manager template. When defining the template include the following parameters:

* Set the `createMode` parameter to *Restore*
* Define the `restoreParameters`, notice that the `restoreSource` value is extracted from the output of the `az cosmosdb restorable-database-account list` command for your source account. The Instance ID attribute for your account name is used to do the restore.
* Set the `restoreMode` parameter to *PointInTime* and configure the `restoreTimestampInUtc` value.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "vinhpitrarmrestore-kal3",
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2016-03-31",
      "location": "West US",
      "properties": {
        "locations": [
          {
            "locationName": "West US"
          }
        ],
        "databaseAccountOfferType": "Standard",
        "createMode": "Restore",
        "restoreParameters": {
            "restoreSource": "/subscriptions/2296c272-5d55-40d9-bc05-4d56dc2d7588/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/6a18ecb8-88c2-4005-8dce-07b44b9741df",
            "restoreMode": "PointInTime",
            "restoreTimestampInUtc": "6/24/2020 4:01:48 AM"
        }
      }
    }
  ]
}
```

Next deploy the template by using Azure PowerShell or CLI. The following example shows how to deploy the template with a CLI command:  

```azurecli-interactive
az group deployment create -g <ResourceGroup> --template-file <RestoreTemplateFilePath> 
```

## Next steps

* Configure and manage continuous backup using [Azure CLI](continuous-backup-restore-command-line.md), [PowerShell](continuous-backup-restore-command-line.md), or [Azure portal](continuous-backup-restore-portal.md).
* [Resource model of continuous backup mode](continuous-backup-restore-resource-model.md)
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.