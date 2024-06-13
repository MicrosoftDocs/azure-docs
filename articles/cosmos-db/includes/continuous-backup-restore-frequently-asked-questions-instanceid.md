---
  author: kanshiG
  ms.author: govindk
  ms.reviewer: mjbrown
  ms.service: cosmos-db
  ms.topic: include
  ms.date: 04/19/2023
---

At any point in time, an Azure Cosmos DB account's `accountName` property is globally unique while it's alive. After the account is deleted, it's possible to create another account with the same name. If that happens, `accountName` is no longer enough to identify an instance of an account.

The instance ID, or `instanceId`, is a property of an instance of an account. It's used to disambiguate across multiple accounts (live and deleted) if they have same name for restore. You can get the instance ID by running either of these commands:

```azurepowershell-interactive
Get-AzCosmosDBRestorableDatabaseAccount
```

```azurecli-interactive
az cosmosdb restorable-database-account
```

> [!NOTE]
> The name attribute value denotes the instance ID.
