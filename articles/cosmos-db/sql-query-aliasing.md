---
title: Aliasing in Azure Cosmos DB
description: Learn about aliasing values in Azure Cosmos DB SQL queries
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/20/2019
ms.author: mjbrown

---
# Aliasing in Azure Cosmos DB

You can explicitly alias values in queries. If a query has two properties with the same name, use aliasing to rename one or both of the properties so they're disambiguated in the projected result.

## Examples

The AS keyword used for aliasing is optional, as shown in the following example when projecting the second value as `NameInfo`:

```sql
    SELECT 
           { "state": f.address.state, "city": f.address.city } AS AddressInfo,
           { "name": f.id } NameInfo
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "AddressInfo": {
        "state": "WA",
        "city": "Seattle"
      },
      "NameInfo": {
        "name": "AndersenFamily"
      }
    }]
```

## Next steps

- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [SELECT clause](sql-query-select.md)
- [FROM clause](sql-query-from.md)
