---
title: Work with large data sets
description: Understand how to get and control large data sets while working with Azure Resource Graph.
author: DCtheGeek
ms.author: dacoulte
ms.date: 04/01/2019
ms.topic: conceptual
ms.service: resource-graph
manager: carmonm
---
# Working with large Azure resource data sets

Azure Resource Graph is designed for working with and getting information about resources in your
Azure environment. Resource Graph makes getting this data fast, even when querying thousands of
records. Resource Graph has several options for working with these large data sets.

For guidance on working with queries at a high frequency, see [Guidance for throttled requests](./guidance-for-throttled-requests.md).

## Data set result size

By default, Resource Graph limits any query to returning only **100** records. This control
protects both the user and the service from unintentional queries that would result in large data
sets. This event most often happens as a customer is experimenting with queries to find and filter
resources in the way that suits their particular needs. This control is different than using the
[top](/azure/kusto/query/topoperator) or [limit](/azure/kusto/query/limitoperator) Azure Data
Explorer language operators to limit the results.

> [!NOTE]
> When using **First**, it's recommended to order the results by at least one column with `asc` or
> `desc`. Without sorting, the results returned are random and not repeatable.

The default limit can be overridden through all methods of interacting with Resource Graph. The
following examples show how to change the data set size limit to _200_:

```azurecli-interactive
az graph query -q "project name | order by name asc" --first 200 --output table
```

```azurepowershell-interactive
Search-AzGraph -Query "project name | order by name asc" -First 200
```

In the [REST API](/rest/api/azureresourcegraph/resources/resources), the control is **$top** and is
part of **QueryRequestOptions**.

The control that is _most restrictive_ will win. For example, if your query uses the **top** or
**limit** operators and would result in more records than **First**, the maximum records returned
would be equal to **First**. Likewise, if **top** or **limit** is smaller than **First**, the
record set returned would be the smaller value configured by **top** or **limit**.

**First** currently has a maximum allowed value of _5000_.

## Skipping records

The next option for working with large data sets is the **Skip** control. This control allows your
query to jump over or skip the defined number of records before returning the results. **Skip** is
useful for queries that sort results in a meaningful way where the intent is to get at records
somewhere in the middle of the result set. If the results needed are at the end of the returned
data set, it's more efficient to use a different sort configuration and retrieve the results from
the top of the data set instead.

> [!NOTE]
> When using **Skip**, it's recommended to order the results by at least one column with `asc` or
> `desc`. Without sorting, the results returned are random and not repeatable.

The following examples show how to skip the first _10_ records a query would result in, instead
starting the returned result set with the 11th record:

```azurecli-interactive
az graph query -q "project name | order by name asc" --skip 10 --output table
```

```azurepowershell-interactive
Search-AzGraph -Query "project name | order by name asc" -Skip 10
```

In the [REST API](/rest/api/azureresourcegraph/resources/resources), the control is **$skip** and is
part of **QueryRequestOptions**.

## Paging results

When it's necessary to break a result set into smaller sets of records for processing or because a
result set would exceed the maximum allowed value of _1000_ returned records, use paging. The [REST
API](/rest/api/azureresourcegraph/resources/resources) **QueryResponse** provides values to
indicate of a results set has been broken up: **resultTruncated** and **$skipToken**.
**resultTruncated** is a boolean value that informs the consumer if there are additional records
not returned in the response. This condition can also be identified when the **count** property is
less than the **totalRecords** property. **totalRecords** defines how many records that match the
query.

When **resultTruncated** is **true**, the **$skipToken** property is set in the response. This
value is used with the same query and subscription values to get the next set of records that
matched the query.

The following examples show how to **skip** the first 3000 records and return the **first** 1000
records after those skipped with Azure CLI and Azure PowerShell:

```azurecli-interactive
az graph query -q "project id, name | order by id asc" --first 1000 --skip 3000
```

```azurepowershell-interactive
Search-AzGraph -Query "project id, name | order by id asc" -First 1000 -Skip 3000
```

> [!IMPORTANT]
> The query must **project** the **id** field in order for pagination to work. If it's missing from
> the query, the response won't include the **$skipToken**.

For an example, see [Next page query](/rest/api/azureresourcegraph/resources/resources#next-page-query)
in the REST API docs.

## Next steps

- See the language in use in [Starter queries](../samples/starter.md).
- See advanced uses in [Advanced queries](../samples/advanced.md).
- Learn to [explore resources](explore-resources.md).