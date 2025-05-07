---
title: Troubleshoot common errors for Azure Resource Graph
description: Learn how to troubleshoot issues with the various SDKs while querying Azure resources with Azure Resource Graph.
ms.date: 07/11/2024
ms.topic: troubleshooting
---

# Troubleshoot errors using Azure Resource Graph

You might run into errors when querying Azure resources with Azure Resource Graph. This article describes various errors that might occur and how to resolve them.

## Finding error details

Most errors are the result of an issue while running a query with Azure Resource Graph. When a query fails, the SDK provides details about the failed query. This information indicates the issue so that it can be fixed and a later query succeeds.

## General errors

### Scenario: Throttled requests

#### Issue

Customers making large or frequent resource queries have requests throttled.

#### Cause

Azure Resource Graph allocates a quota number for each user based on a time window. For example, a user can send at most 15 queries within every 5-second window without being throttled. The quota value is determined by many factors and is subject to change. For more information, see [Throttling in Azure Resource Graph](../overview.md#throttling).

#### Resolution

There are several methods of dealing with throttled requests:

- [Grouping queries](../concepts/guidance-for-throttled-requests.md#grouping-queries)
- [Staggering queries](../concepts/guidance-for-throttled-requests.md#staggering-queries)
- [Query in Parallel](../concepts/guidance-for-throttled-requests.md#query-in-parallel)
- [Pagination](../concepts/guidance-for-throttled-requests.md#pagination)

### Scenario: Too many subscriptions

#### Issue

Customers with access to more than 1,000 subscriptions, including cross-tenant subscriptions with [Azure Lighthouse](/azure/lighthouse/overview), can't fetch data across all subscriptions in a single call to Azure Resource Graph.

#### Cause

Azure CLI and PowerShell forward only the first 1,000 subscriptions to Azure Resource Graph. The REST API for Azure Resource Graph accepts a maximum number of subscriptions to perform the query on.

#### Resolution

Batch requests for the query with a subset of subscriptions to stay under the 1,000 subscription limit. The solution is using the **Subscription** parameter in PowerShell.

```azurepowershell-interactive
# Replace this query with your own
$query = 'Resources | project type'

# Fetch the full array of subscription IDs
$subscriptions = Get-AzSubscription
$subscriptionIds = $subscriptions.Id

# Create a counter, set the batch size, and prepare a variable for the results
$counter = [PSCustomObject] @{ Value = 0 }
$batchSize = 1000
$response = @()

# Group the subscriptions into batches
$subscriptionsBatch = $subscriptionIds | Group -Property { [math]::Floor($counter.Value++ / $batchSize) }

# Run the query for each batch
foreach ($batch in $subscriptionsBatch){ $response += Search-AzGraph -Query $query -Subscription $batch.Group }

# View the completed results of the query on all subscriptions
$response
```

### Scenario: Unsupported Content-Type REST header

#### Issue

Customers querying the Azure Resource Graph REST API get a _500_ (Internal Server Error) response returned.

#### Cause

The Azure Resource Graph REST API only supports a `Content-Type` of `application/json`. Some REST tools or agents default to `text/plain`, which is unsupported by the REST API.

#### Resolution

Validate that the tool or agent you're using to query Azure Resource Graph has the REST API header `Content-Type` configured for `application/json`.

### Scenario: No read permission to all subscriptions in list

#### Issue

Customers that explicitly pass a list of subscriptions with an Azure Resource Graph query get a _403_ (Forbidden) response.

#### Cause

If the customer doesn't have read permission to all the provided subscriptions, the request is denied because of lack of appropriate security rights.

#### Resolution

Include at least one subscription in the subscription list that the customer running the query has at least read access to. For more information, see [Permissions in Azure Resource Graph](../overview.md#permissions-in-azure-resource-graph).

### Scenario: Azure Resource Graph fields not being updated immediately

#### Issue

There are specific fields, when using Azure Resource Graph, that are updated at a slower cadence. These fields will converge to true values over time, provided there are no updates in between. 

##### List of fields affected

> [!IMPORTANT]
> - This concept is not limited to specific properties. The following list are examples that you might find delayed, but eventually become updated.
> - There are certain cases where VM states are updated asynchronously, which means that the current state does not match the "goal state" (desired state set by customers). However, these VM fields will converge over time.

- properties.extended.instanceView.osName
- properties.extended.instanceView.osVersion
- properties.extended.instanceView.computerName

#### Cause

Some fields are coming from agent blobs that don't have notification coverage, therefore updates to these fields are delayed.

#### Resolution

These fields update at a slower cadence today, but will converge to true values over time, provided there are no updates in between.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
- Connect with [@AzureSupport](https://x.com/azuresupport) - the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
- If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
