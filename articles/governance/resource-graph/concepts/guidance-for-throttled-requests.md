---
title: Guidance for throttled requests
description: Learn to group, stagger, paginate, and query in parallel to avoid requests being throttled by Azure Resource Graph.
ms.date: 05/20/2020
ms.topic: conceptual
---
# Guidance for throttled requests in Azure Resource Graph

When creating programmatic and frequent use of Azure Resource Graph data, consideration should be
made for how throttling impacts the results of the queries. Changing the way data is requested can
help you and your organization avoid being throttled and maintain the flow of timely data about your
Azure resources.

This article covers four areas and patterns related to the creation of queries in Azure Resource
Graph:

- Understand throttling headers
- Grouping queries
- Staggering queries
- The impact of pagination

## Understand throttling headers

Azure Resource Graph allocates a quota number for each user based on a time window. For example, a
user can send at most 15 queries within every 5-second window without being throttled. The quota
value is determined by many factors and is subject to change.

In every query response, Azure Resource Graph adds two throttling headers:

- `x-ms-user-quota-remaining` (int): The remaining resource quota for the user. This value maps to
  query count.
- `x-ms-user-quota-resets-after` (hh:mm:ss): The time duration until a user's quota consumption is
  reset.

To illustrate how the headers work, let's look at a query response that has the header and values of
`x-ms-user-quota-remaining: 10` and `x-ms-user-quota-resets-after: 00:00:03`.

- Within the next 3 seconds, at most 10 queries may be submitted without being throttled.
- In 3 seconds, the values of `x-ms-user-quota-remaining` and `x-ms-user-quota-resets-after` will be
  reset to `15` and `00:00:05` respectively.

To see an example of using the headers to _backoff_ on query requests, see the sample in
[Query in Parallel](#query-in-parallel).

## Grouping queries

Grouping queries by the subscription, resource group, or individual resource is more efficient than
parallelizing queries. The quota cost of a larger query is often less than the quota cost of many
small and targeted queries. The group size is recommended to be less than _300_.

- Example of a poorly optimized approach

  ```csharp
  // NOT RECOMMENDED
  var header = /* your request header */
  var subscriptionIds = /* A big list of subscriptionIds */

  foreach (var subscriptionId in subscriptionIds)
  {
      var userQueryRequest = new QueryRequest(
          subscriptions: new[] { subscriptionId },
          query: "Resoures | project name, type");

      var azureOperationResponse = await this.resourceGraphClient
          .ResourcesWithHttpMessagesAsync(userQueryRequest, header)
          .ConfigureAwait(false);

  // ...
  }
  ```

- Example #1 of an optimized grouping approach

  ```csharp
  // RECOMMENDED
  var header = /* your request header */
  var subscriptionIds = /* A big list of subscriptionIds */

  const int groupSize = 100;
  for (var i = 0; i <= subscriptionIds.Count / groupSize; ++i)
  {
      var currSubscriptionGroup = subscriptionIds.Skip(i * groupSize).Take(groupSize).ToList();
      var userQueryRequest = new QueryRequest(
          subscriptions: currSubscriptionGroup,
          query: "Resources | project name, type");

      var azureOperationResponse = await this.resourceGraphClient
          .ResourcesWithHttpMessagesAsync(userQueryRequest, header)
          .ConfigureAwait(false);

    // ...
  }
  ```

- Example #2 of an optimized grouping approach for getting multiple resources in one query

  ```kusto
  Resources | where id in~ ({resourceIdGroup}) | project name, type
  ```

  ```csharp
  // RECOMMENDED
  var header = /* your request header */
  var resourceIds = /* A big list of resourceIds */

  const int groupSize = 100;
  for (var i = 0; i <= resourceIds.Count / groupSize; ++i)
  {
      var resourceIdGroup = string.Join(",",
          resourceIds.Skip(i * groupSize).Take(groupSize).Select(id => string.Format("'{0}'", id)));
      var userQueryRequest = new QueryRequest(
          subscriptions: subscriptionList,
          query: $"Resources | where id in~ ({resourceIdGroup}) | project name, type");

      var azureOperationResponse = await this.resourceGraphClient
          .ResourcesWithHttpMessagesAsync(userQueryRequest, header)
          .ConfigureAwait(false);

    // ...
  }
  ```

## Staggering queries

Because of the way throttling is enforced, we recommend queries to be staggered. That is, instead of
sending 60 queries at the same time, stagger the queries into four 5-second windows:

- Non-staggered query schedule

  | Query Count         | 60  | 0    | 0     | 0     |
  |---------------------|-----|------|-------|-------|
  | Time Interval (sec) | 0-5 | 5-10 | 10-15 | 15-20 |

- Staggered query schedule

  | Query Count         | 15  | 15   | 15    | 15    |
  |---------------------|-----|------|-------|-------|
  | Time Interval (sec) | 0-5 | 5-10 | 10-15 | 15-20 |

Below is an example of respecting throttling headers when querying Azure Resource Graph:

```csharp
while (/* Need to query more? */)
{
    var userQueryRequest = /* ... */
    // Send post request to Azure Resource Graph
    var azureOperationResponse = await this.resourceGraphClient
        .ResourcesWithHttpMessagesAsync(userQueryRequest, header)
        .ConfigureAwait(false);

    var responseHeaders = azureOperationResponse.response.Headers;
    int remainingQuota = /* read and parse x-ms-user-quota-remaining from responseHeaders */
    TimeSpan resetAfter = /* read and parse x-ms-user-quota-resets-after from responseHeaders */
    if (remainingQuota == 0)
    {
        // Need to wait until new quota is allocated
        await Task.Delay(resetAfter).ConfigureAwait(false);
    }
}
```

### Query in Parallel

Even though grouping is recommended over parallelization, there are times where queries can't be
easily grouped. In these cases, you may want to query Azure Resource Graph by sending multiple
queries in a parallel fashion. Below is an example of how to _backoff_ based on throttling headers
in such scenarios:

```csharp
IEnumerable<IEnumerable<string>> queryGroup = /* Groups of queries  */
// Run groups in parallel.
await Task.WhenAll(queryGroup.Select(ExecuteQueries)).ConfigureAwait(false);

async Task ExecuteQueries(IEnumerable<string> queries)
{
    foreach (var query in queries)
    {
        var userQueryRequest = new QueryRequest(
            subscriptions: subscriptionList,
            query: query);
        // Send post request to Azure Resource Graph.
        var azureOperationResponse = await this.resourceGraphClient
            .ResourcesWithHttpMessagesAsync(userQueryRequest, header)
            .ConfigureAwait(false);
        
        var responseHeaders = azureOperationResponse.response.Headers;
        int remainingQuota = /* read and parse x-ms-user-quota-remaining from responseHeaders */
        TimeSpan resetAfter = /* read and parse x-ms-user-quota-resets-after from responseHeaders */
        if (remainingQuota == 0)
        {
            // Delay by a random period to avoid bursting when the quota is reset.
            var delay = (new Random()).Next(1, 5) * resetAfter;
            await Task.Delay(delay).ConfigureAwait(false);
        }
    }
}
```

## Pagination

Since Azure Resource Graph returns at most 1000 entries in a single query response, you may need to
[paginate](./work-with-data.md#paging-results) your queries to get the complete dataset you're
looking for. However, some Azure Resource Graph clients handle pagination differently than others.

- C# SDK

  When using ResourceGraph SDK, you need to handle pagination by passing the skip token being
  returned from the previous query response to the next paginated query. This design means you need
  to collect results from all paginated calls and combine them together at the end. In this case,
  each paginated query you send takes one query quota:

  ```csharp
  var results = new List<object>();
  var queryRequest = new QueryRequest(
      subscriptions: new[] { mySubscriptionId },
      query: "Resources | project id, name, type | top 5000");
  var azureOperationResponse = await this.resourceGraphClient
      .ResourcesWithHttpMessagesAsync(queryRequest, header)
      .ConfigureAwait(false);
  while (!string.Empty(azureOperationResponse.Body.SkipToken))
  {
      queryRequest.SkipToken = azureOperationResponse.Body.SkipToken;
      // Each post call to ResourceGraph consumes one query quota
      var azureOperationResponse = await this.resourceGraphClient
          .ResourcesWithHttpMessagesAsync(queryRequest, header)
          .ConfigureAwait(false);
      results.Add(azureOperationResponse.Body.Data.Rows);

      // Inspect throttling headers in query response and delay the next call if needed.
  }
  ```

- Azure CLI / Azure PowerShell

  When using either Azure CLI or Azure PowerShell, queries to Azure Resource Graph are automatically
  paginated to fetch at most 5000 entries. The query results return a combined list of entries from
  all paginated calls. In this case, depending on the number of entries in the query result, a
  single paginated query may consume more than one query quota. For example, in the example below, a
  single run of the query may consume up to five query quota:

  ```azurecli-interactive
  az graph query -q 'Resources | project id, name, type' --first 5000
  ```

  ```azurepowershell-interactive
  Search-AzGraph -Query 'Resources | project id, name, type' -First 5000
  ```

## Still get throttled?

If you're getting throttled after exercising the above recommendations, contact the team at
[resourcegraphsupport@microsoft.com](mailto:resourcegraphsupport@microsoft.com).

Provide these details:

- Your specific use-case and business driver needs for a higher throttling limit.
- How many resources do you have access to? How many of the are returned from a single query?
- What types of resources are you interested in?
- What's your query pattern? X queries per Y seconds, and so on.

## Next steps

- See the language in use in [Starter queries](../samples/starter.md).
- See advanced uses in [Advanced queries](../samples/advanced.md).
- Learn more about how to [explore resources](explore-resources.md).