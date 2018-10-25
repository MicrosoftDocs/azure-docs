---
title: Learn how to manage consistency in Azure Cosmos DB
description: Learn how to manage consistency in Azure Cosmos DB
services: cosmos-db
author: christopheranderson

ms.service: cosmos-db
ms.topic: sample
ms.date: 10/17/2018
ms.author: chrande
---

# Manage consistency

## Configure the default consistency level

### CLI

```bash
# create with a default consistency
az cosmosdb create --name <name of Cosmos DB Account> --resource-group <resource group name> --default-consistency-level Strong

# update an existing account's default consistency
az cosmosdb update --name <name of Cosmos DB Account> --resource-group <resource group name> --default-consistency-level BoundedStaleness
```

### PowerShell

This example below creates a new Cosmos DB account with multi-master enabled in East US and West US regions setting the default consistency policy as Bounded Staleness with a max staleness interval of 10 seconds and maximum number of stale requests tolerated at 200.

```azurepowershell-interactive
$locations = @(@{"locationName"="East US"; "failoverPriority"=0},
             @{"locationName"="West US"; "failoverPriority"=1})

$iprangefilter = ""

$consistencyPolicy = @{"defaultConsistencyLevel"="BoundedStaleness";
                       "maxIntervalInSeconds"= "10";
                       "maxStalenessPrefix"="200"}

$CosmosDBProperties = @{"databaseAccountOfferType"="Standard";
                        "locations"=$locations;
                        "consistencyPolicy"=$consistencyPolicy;
                        "ipRangeFilter"=$iprangefilter;
                        "enableMultipleWriteLocations"="true"}

New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" `
  -ApiVersion "2015-04-08" `
  -ResourceGroupName "myResourceGroup" `
  -Location "East US" `
  -Name "myCosmosDbAccount" `
  -Properties $CosmosDBProperties
```

### Portal

To view or modify the default consistency level, sign in to Azure portal. Find your Cosmos DB Account an open the **Default consistency** pane. From there, choose the level of consistency you'd like as the new default, then click save.

![Picture of the consistency menu in the Azure portal](./media/how-to-manage-consistency/consistency-settings.png)

## Override the default consistency level

### <a id="override-default-consistency-dotnet">.NET</a>

```csharp
// Override consistency at the client level
ConsistencyPolicy consistencyPolicy = new ConsistencyPolicy
    {
        DefaultConsistencyLevel = ConsistencyLevel.BoundedStaleness,
        MaxStalenessIntervalInSeconds = 5,
        MaxStalenessPrefix = 100
    };
documentClient = new DocumentClient(new Uri(endpoint), authKey, connectionPolicy, consistencyPolicy);

// Override consistency at the request level via request options
RequestOptions requestOptions = new RequestOptions { ConsistencyLevel = ConsistencyLevel.Strong };

var response = await client.CreateDocumentAsync(collectionUri, document, requestOptions);
```

### <a id="override-default-consistency-java-async">Java Async</a>

```java

```

### <a id="override-default-consistency-java-sync">Java Sync</a>

```java

```

### <a id="override-default-consistency-javascript">Node.js/JavaScript/TypeScript</a>

```javascript
// Override consistency at the client level
const client = new CosmosClient({
  /* other config... */
  consistencyLevel: ConsistencyLevel.Strong
});

// Override consistency at the request level via request options
const { body } = await item.read({ consistencyLevel: ConsistencyLevel.Eventual });
```

### <a id="override-default-consistency-python">Python</a>

```python

```

## Utilize session tokens

### <a id="utilize-session-tokens-dotnet">.NET</a>

### <a id="utilize-session-tokens-java-async">Java Async</a>

### <a id="utilize-session-tokens-java-sync">Java Sync</a>

### <a id="utilize-session-tokens-javascript">Node.js/JavaScript/TypeScript</a>

```javascript
// Get session token from response
const { headers, item } = await container.items.create({ id: "meaningful-id" });
const sessionToken = headers["x-ms-session-token"];

// Immediately or later, you can use that sessionToken from the header to resume that session.
const { body } = await item.read({ sessionToken });
```

### <a id="utilize-session-tokens-python">Python</a>

## Monitor Probabilistically Bounded Staleness (PBS) metric

To view the PBS metric, go to your Cosmos DB Account in the Azure portal, and then open the **Metrics** pane. From there, click the **Consistency** tab and look at the graph named "**Probability of strongly consistent reads based on your workload (see PBS)**".

![Picture of the PBS graph in the Azure portal](./media/how-to-manage-consistency/pbs-metric.png)

You must use the Cosmos DB metrics menu to see this metric. It will not show up in the Azure Monitoring metrics experience.
