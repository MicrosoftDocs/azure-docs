---
title: Azure Functions trigger for Cosmos DB connection policy
description: Learn how to configure the connection policy used by Azure Functions trigger for Cosmos DB
author: ealsur
ms.service: cosmos-db
ms.topic: how-to
ms.date: 07/17/2019
ms.author: maquaran
---

# How to configure the connection policy used by Azure Functions trigger for Cosmos DB

This article describes how you can configure the connection policy when using the Azure Functions trigger for Cosmos DB to connect to your Azure Cosmos account.

## Why is the connection policy important?

There are two connection modes - Direct mode and Gateway mode. To learn more about these connection modes, see the [performance tips](./performance-tips.md#networking) article. By default, **Gateway** is used to establish all connections on the Azure Functions trigger for Cosmos DB. However, it might not be the best option for performance-driven scenarios.

## Changing the connection mode and protocol

There are two key configuration settings available to configure the client connection policy – the **connection mode** and the **connection protocol**. You can change the default connection mode and protocol used by the Azure Functions trigger for Cosmos DB and all the [Azure Cosmos DB bindings](../azure-functions/functions-bindings-cosmosdb-v2-output.md)). To change the default settings, you need to locate the `host.json` file in your Azure Functions project or Azure Functions App and add the following [extra setting](../azure-functions/functions-bindings-cosmosdb-v2-output.md#hostjson-settings):

```js
{
  "cosmosDB": {
    "connectionMode": "Direct",
    "protocol": "Tcp"
  }
}
```

Where `connectionMode` must have the desired connection mode (Direct or Gateway) and `protocol` the desired connection protocol (Tcp or Https). 

If your Azure Functions project is working with Azure Functions V1 runtime, the configuration has a slight name difference, you should use `documentDB` instead of `cosmosDB`:

```js
{
  "documentDB": {
    "connectionMode": "Direct",
    "protocol": "Tcp"
  }
}
```

> [!NOTE]
> When working with Azure Functions Consumption Plan Hosting plan, each instance has a limit in the amount of Socket Connections that it can maintain. When working with Direct / TCP mode, by design more connections are created and can hit the [Consumption Plan limit](../azure-functions/manage-connections.md#connection-limit), in which case you can either use Gateway mode or run your Azure Functions in [App Service Mode](../azure-functions/functions-scale.md#app-service-plan).

## Next steps

* [Connection limits in Azure Functions](../azure-functions/manage-connections.md#connection-limit)
* [Azure Cosmos DB performance tips](./performance-tips.md)
* [Code samples](https://github.com/ealsur/serverless-recipes/tree/master/connectionmode)
