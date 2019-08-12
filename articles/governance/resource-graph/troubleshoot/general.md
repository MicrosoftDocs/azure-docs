---
title: Troubleshoot common errors
description: Learn how to troubleshoot issues querying Azure resources with Azure Resource Graph.
author: DCtheGeek
ms.author: dacoulte
ms.date: 07/24/2019
ms.topic: troubleshooting
ms.service: resource-graph
manager: carmonm
---
# Troubleshoot errors using Azure Resource Graph

You may run into errors when querying Azure resources with Azure Resource Graph. This article
describes various errors that may occur and how to resolve them.

## Finding error details

Most errors are the result of an issue while running a query with Azure Resource Graph. When a query
fails, the SDK provides details about the failed query. This information indicates the issue so that
it can be fixed and a later query succeeds.

## General errors

### <a name="toomanysubscription"></a>Scenario: Too many subscriptions

#### Issue

Customers with access to more than 1000 subscriptions, including cross-tenant subscriptions with [Azure Lighthouse](../../../lighthouse/overview.md),
can't fetch data across all subscriptions in a single call to Azure Resource Graph.

#### Cause

Azure CLI and PowerShell forward only the first 1000 subscriptions to Azure Resource Graph. The REST
API for Azure Resource Graph accepts a maximum number of subscriptions to perform the query on.

#### Resolution

Batch requests for the query with a subset of subscriptions to stay under the 1000 subscription
limit. The solution is using the **Subscription** parameter in PowerShell.

```azurepowershell-interactive
# Replace this query with your own
$query = 'project type'

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

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following
channels for more support:

- Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
- Connect with [@AzureSupport](https://twitter.com/azuresupport) – the official Microsoft Azure
  account for improving customer experience by connecting the Azure community to the right
  resources: answers, support, and experts.
- If you need more help, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/)
  and select **Get Support**.