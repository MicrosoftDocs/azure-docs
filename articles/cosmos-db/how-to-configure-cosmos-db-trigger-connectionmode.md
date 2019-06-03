---
title: Azure Cosmos DB Trigger connection mode
description: Learn how to configure the Azure Cosmos DB Trigger connection mode
author: ealsur
ms.service: cosmos-db
ms.topic: sample
ms.date: 06/03/2019
ms.author: maquaran
---

# How to configure the Connection Mode used by Azure Cosmos DB Trigger

This article describes how you can configure the Connection Mode used by the Azure Cosmos DB Trigger to connect to your Azure Cosmos account.

## Why is the Connection Mode important?

Our [performance tips](./performance-tips.md#networking) explain in detail the effect of the different Connection Modes. By default, **Gateway** is used to establish all connections on the Azure Cosmos DB Trigger. It might not be the best option for performance-driven scenarios.

## Changing the Connection Mode and Protocol

To change the default Connection Mode and Protocol used by the Azure Cosmos DB Trigger (and all the [Azure Cosmos DB bindings](../azure-functions/functions-bindings-cosmosdb-v2.md#output)), you need to locate the `host.json` file in your Azure Functions project or Azure Functions App and manually add the following [extra setting](../azure-functions/functions-bindings-cosmosdb-v2.md#hostjson-settings):

```js
{
  "cosmosDB": {
    "connectionMode": "Direct",
    "protocol": "Tcp"
  }
}
```

Where `connectionMode` must have the desired Connection Mode (Direct or Gateway) and `protocol` the desired Connection Protocol (Tcp or Https). 

If your Azure Functions project is working with Azure Functions V1 runtime, the configuration has a slight name difference:

```js
{
  "documentDB": {
    "connectionMode": "Direct",
    "protocol": "Tcp"
  }
}
```

## Next steps

* [Connection limits in Azure Functions](../azure-functions/manage-connections.md#connection-limit)
* [Azure Cosmos DB performance tips](./performance-tips.md)
