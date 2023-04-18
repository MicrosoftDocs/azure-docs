---
title: resource() expression in Azure Monitor log query | Microsoft Docs
description: The resource expression is used in a resource-centric Azure Monitor log query to retrieve data from multiple resources.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/06/2022

---

# resource() expression in Azure Monitor log query

The `resource` expression is used in a Azure Monitor query [scoped to a resource](scope.md#query-scope) to retrieve data from other resources. 


## Syntax

`resource(`*Identifier*`)`

## Arguments

- *Identifier*: Resource ID of a resource.

| Identifier | Description | Example
|:---|:---|:---|
| Resource | Includes data for the resource. | resource("/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcesgroups/myresourcegroup/providers/microsoft.compute/virtualmachines/myvm") |
| Resource Group or Subscription | Includes data for the resource and all resources that it contains.  | resource("/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcesgroups/myresourcegroup) |


## Notes

* You must have read access to the resource.


## Examples

```Kusto
union (Heartbeat),(resource("/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcesgroups/myresourcegroup/providers/microsoft.compute/virtualmachines/myvm").Heartbeat) | summarize count() by _ResourceId, TenantId
```
```Kusto
union (Heartbeat),(resource("/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcesgroups/myresourcegroup).Heartbeat) | summarize count() by _ResourceId, TenantId
```


## Next steps

- See [Log query scope and time range in Azure Monitor Log Analytics](scope.md) for details on a query scope.
- Access full documentation for the [Kusto query language](/azure/kusto/query/).
