---
title: How to expose the Azure Cosmos DB Trigger logs
description: Learn how to expose the Azure Cosmos DB Trigger logs to your Azure Functions logging pipeline
author: ealsur
ms.service: cosmos-db
ms.topic: sample
ms.date: 4/30/2019
ms.author: maquaran
---

# Exposing the Azure Cosmos DB Trigger logs

This article describes how you can configure your Azure Functions environment to send the internal Azure Cosmos DB Trigger logs to your configured [monitoring solution](../azure-functions/functions-monitoring.md).

## Included logs

The Azure Cosmos DB Trigger uses the [Change Feed Processor Library](./change-feed-processor.md) internally, and the library generates a set of health logs that can be used to monitor internal operations for [troubleshooting purposes](./troubleshoot-changefeed-functions.md).

The health logs describe how the Azure Cosmos DB Trigger behaves when attempting operations during load-balancing scenarios or initialization.

## Enabling logs

To enable the logs, you need to locate your `host.json` file in your Azure Functions project or Azure Functions App and follow the [documented steps](./azure-functions/functions-monitoring.md#log-configuration-in-hostjson) to enable traces for `Host.Triggers.CosmosDB` like so:

```js
{
  "version": "2.0",
  "logging": {
    "fileLoggingMode": "always",
    "logLevel": {
      "Host.Triggers.CosmosDB": "Trace"
    }
  }
}
```

Once deployed, you'll start seeing the logs as part of your traces in your configured logging provider under the *Category* `Host.Triggers.CosmosDB`.

## Next steps

* [Enable monitoring](./azure-functions/functions-monitoring.md) in your Azure Functions applications.
* Check our [troubleshooting guide](./troubleshoot-changefeed-functions.md) for common issues.