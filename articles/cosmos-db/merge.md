---
title: Merge in Azure Cosmos DB (preview)
description: Learn more about the merge capability in Azure Cosmos DB
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.reviewer: dech
ms.date: 05/09/2022
---

# Merge in Azure Cosmos DB (preview)
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

Azure Cosmos DB merge (preview) allows you to reduce the number of physical partitions used for your container. With merge, containers that are fragmented in throughput or storage can have their physical partitions reworked. If a container's throughput has been scaled up and needs to be scaled back down, merge can help resolve throughput fragmentation issues. If a large quantity of data is removed from a container, merge can help clear out unused or empty partitions, effectively resolving storage fragmentation problems. 

## Getting started

To get started using merge, enroll in the preview by filing a support ticket in the [Azure portal](https://portal.azure.com). 

### Merging physical partitions

#### [PowerShell](#tab/azure-powershell)

```azurepowershell
Invoke-AzCosmosDbSqlContainerPartitionMerge `
    -ResourceGroupName "<resource-group-name>" `
    -AccountName "<cosmos-account-name>" `
    -DatabaseName "<cosmos-database-name>" `
    -ContainerName "<cosmos-container-name>"
```

#### [Azure CLI](#tab/azure-cli)

```azurecli
az cosmosdb sql container merge \
    --resource-group '<resource-group-name>' \
    --account-name '<cosmos-account-name>' \
    --database-name '<cosmos-database-name>' \
    --container-name '<cosmos-container-name>'
```

---

## Limitations

### Account resources and configuration

* Merge is only available for single-region write accounts. Multi-region write account support isn't available.
* Accounts using merge functionality can't also use these features:
  * [Point-in-time restore](continuous-backup-restore-introduction.md)
  * [Customer-managed keys](how-to-setup-cmk.md)
  * [Analytical store](analytical-store-introduction.md)
* Containers using merge functionality must have their throughput provisioned at the container level. Database-shared throughput support isn't available.

### SDK requirements

Accounts with the merge feature enabled are supported only in the latest preview version of the .NET v3 SDK. When the feature is enabled on your account, you must only use the supported SDK using the account.

Find the latest preview version the supported SDK:

| SDK | Supported versions | Package manager link |
| --- | --- | --- |
| **.NET SDK v3** | *>= 3.17.0-preview* | <https://www.nuget.org/packages/Microsoft.Azure.Cosmos/> |

Support for other SDKs is planned for the future.

> [!TIP]
> You should ensure that your application has been updated to use a compatible SDK version prior to enrolling in the preview. If you're using the legacy .NET V2 SDK, follow the [.NET SDK v3 migration guide](sql/migrate-dotnet-v3.md). 

### Unsupported connectors

If you enroll in the preview, the following connectors will fail.

* Azure Data Factory
* Azure Stream Analytics
* Logic Apps
* Azure Functions
* Azure Search

Support for these connectors is planned for the future.

## Next steps

* Learn more about [using Azure CLI with Azure Cosmos DB.](/cli/azure/azure-cli-reference-for-cosmos-db.md)
* Learn more about [using Azure PowerShell with Azure Cosmos DB.](/powershell/module/az.cosmosdb/)
* Learn more about [partitioning in Azure Cosmos DB.](partitioning-overview.md)
