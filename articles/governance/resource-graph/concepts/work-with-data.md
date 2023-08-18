---
title: Work with large data sets
description: Understand how to get, format, page, and skip records in large data sets while working with Azure Resource Graph.
author: davidsmatlak
ms.date: 11/04/2022
ms.topic: conceptual
ms.author: davidsmatlak
ms.custom: devx-track-csharp
---
# Working with large Azure resource data sets

Azure Resource Graph is designed for working with and getting information about resources in your
Azure environment. Resource Graph makes getting this data fast, even when querying thousands of
records. Resource Graph has several options for working with these large data sets.

For guidance on working with queries at a high frequency, see
[Guidance for throttled requests](./guidance-for-throttled-requests.md).

## Data set result size

By default, Resource Graph limits any query to returning only **1000** records. This control protects
both the user and the service from unintentional queries that would result in large data sets. This
event most often happens as a customer is experimenting with queries to find and filter resources in
the way that suits their particular needs. This control is different than using the
[top](/azure/kusto/query/topoperator) or [limit](/azure/kusto/query/limitoperator) Azure Data
Explorer language operators to limit the results.

> [!NOTE]
> When using **First**, it's recommended to order the results by at least one column with `asc` or
> `desc`. Without sorting, the results returned are random and not repeatable.

The default limit can be overridden through all methods of interacting with Resource Graph. The
following examples show how to change the data set size limit to _200_:

```azurecli-interactive
az graph query -q "Resources | project name | order by name asc" --first 200 --output table
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | project name | order by name asc" -First 200
```

In the [REST API](/rest/api/azureresourcegraph/resourcegraph(2021-03-01)/resources/resources), the
control is **$top** and is part of **QueryRequestOptions**.

The control that is _most restrictive_ will win. For example, if your query uses the **top** or
**limit** operators and would result in more records than **First**, the maximum records returned
would be equal to **First**. Likewise, if **top** or **limit** is smaller than **First**, the record
set returned would be the smaller value configured by **top** or **limit**.

The **First** parameter has a maximum allowed value of _1000_.

## CSV export result size limitation

When using the comma-separated value (CSV) export functionality of Azure Resource Graph Explorer, the
result set is limited to 55,000 records. This is a platform limit that cannot be overridden by filing an Azure support ticket.

To download CSV results from the Azure portal, browse to the Azure Resource Graph Explorer and run a
query. On the toolbar, click **Download as CSV**.

## Skipping records

The next option for working with large data sets is the **Skip** control. This control allows your
query to jump over or skip the defined number of records before returning the results. **Skip** is
useful for queries that sort results in a meaningful way where the intent is to get at records
somewhere in the middle of the result set. If the results needed are at the end of the returned data
set, it's more efficient to use a different sort configuration and retrieve the results from the top
of the data set instead.

> [!NOTE]
> When using **Skip**, it's recommended to order the results by at least one column with `asc` or
> `desc`. Without sorting, the results returned are random and not repeatable. If `limit` or `take`
> are used in the query, **Skip** is ignored.

The following examples show how to skip the first _10_ records a query would result in, instead
starting the returned result set with the 11th record:

```azurecli
az graph query -q "Resources | project name | order by name asc" --skip 10 --output table
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | project name | order by name asc" -Skip 10
```

In the [REST API](/rest/api/azureresourcegraph/resourcegraph(2021-03-01)/resources/resources), the
control is **$skip** and is part of **QueryRequestOptions**.

## Paging results

When it's necessary to break a result set into smaller sets of records for processing or because a
result set would exceed the maximum allowed value of _1000_ returned records, use paging. The
[REST API](/rest/api/azureresourcegraph/resourcegraph(2021-03-01)/resources/resources)
**QueryResponse** provides values to indicate of a results set has been broken up:
**resultTruncated** and **$skipToken**. **resultTruncated** is a Boolean value that informs the
consumer if there are more records not returned in the response. This condition can also be
identified when the **count** property is less than the **totalRecords** property. **totalRecords**
defines how many records that match the query.

**resultTruncated** is **true** when there are less resources available than a query is requesting or when paging is disabled or when paging is not possible because:

- The query contains a `limit` or `sample`/`take` operator.
- **All** output columns are either `dynamic` or `null` type.

When **resultTruncated** is **true**, the **$skipToken** property isn't set.

The following examples show how to **skip** the first 3,000 records and return the **first** 1,000
records after those records skipped with Azure CLI and Azure PowerShell:

```azurecli
az graph query -q "Resources | project id, name | order by id asc" --first 1000 --skip 3000
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | project id, name | order by id asc" -First 1000 -Skip 3000
```

> [!IMPORTANT]
> The response won't include the **$skipToken** if:
> - The query contains a `limit` or `sample`/`take` operator.
> - **All** output columns are either `dynamic` or `null` type.

For an example, see
[Next page query](/rest/api/azureresourcegraph/resourcegraph(2021-03-01)/resources/resources#next-page-query)
in the REST API docs.

## Formatting results

Results of a Resource Graph query are provided in two formats, _Table_ and _ObjectArray_. The format
is configured with the **resultFormat** parameter as part of the request options. The _Table_ format
is the default value for **resultFormat**.

Results from Azure CLI are provided in JSON by default. Results in Azure PowerShell are a
**PSResourceGraphResponse** object, but they can quickly be converted to JSON using the
`ConvertTo-Json` cmdlet on the **Data** property. For other SDKs, the query results can be
configured to output the _ObjectArray_ format.

### Format - Table

The default format, _Table_, returns results in a JSON format designed to highlight the column
design and row values of the properties returned by the query. This format closely resembles data as
defined in a structured table or spreadsheet with the columns identified first and then each row
representing data aligned to those columns.

Here's a sample of a query result with the _Table_ formatting:

```json
{
    "totalRecords": 47,
    "count": 1,
    "data": {
        "columns": [{
                "name": "name",
                "type": "string"
            },
            {
                "name": "type",
                "type": "string"
            },
            {
                "name": "location",
                "type": "string"
            },
            {
                "name": "subscriptionId",
                "type": "string"
            }
        ],
        "rows": [
            [
                "veryscaryvm2-nsg",
                "microsoft.network/networksecuritygroups",
                "eastus",
                "11111111-1111-1111-1111-111111111111"
            ]
        ]
    },
    "facets": [],
    "resultTruncated": "true"
}
```

### Format - ObjectArray

The _ObjectArray_ format also returns results in a JSON format. However, this design aligns to the
key/value pair relationship common in JSON where the column and the row data are matched in array
groups.

Here's a sample of a query result with the _ObjectArray_ formatting:

```json
{
    "totalRecords": 47,
    "count": 1,
    "data": [{
        "name": "veryscaryvm2-nsg",
        "type": "microsoft.network/networksecuritygroups",
        "location": "eastus",
        "subscriptionId": "11111111-1111-1111-1111-111111111111"
    }],
    "facets": [],
    "resultTruncated": "true"
}
```

Here are some examples of setting **resultFormat** to use the _ObjectArray_ format:

```csharp
var requestOptions = new QueryRequestOptions( resultFormat: ResultFormat.ObjectArray);
var request = new QueryRequest(subscriptions, "Resources | limit 1", options: requestOptions);
```

```python
request_options = QueryRequestOptions(
    result_format=ResultFormat.object_array
)
request = QueryRequest(query="Resources | limit 1", subscriptions=subs_list, options=request_options)
response = client.resources(request)
```

## Next steps

- See the language in use in [Starter queries](../samples/starter.md).
- See advanced uses in [Advanced queries](../samples/advanced.md).
- Learn more about how to [explore resources](explore-resources.md).
