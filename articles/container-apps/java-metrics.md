---
title: How to enable Java metrics for Java apps in Azure Container Apps
description: Optimization of default configurations to enhance Java application performance and efficiency.
services: container-apps
author: 
ms.service: container-apps
ms.custom: 
ms.topic: 
ms.date: 
ms.author: 
---

# Java metrics for Java apps in Azure Container Apps

Azure Container Apps collect list of Java metrics

|Category|Title  | Description | Metric ID |Unit  |
|---------|---------|---------|---------|---------|
| Java | jvm.memory.total.used | Total amount of memory used by heap or non-heap (in bytes) | JvmMemoryTotalUsed | bytes |
| Java | jvm.memory.total.committed |  |  | bytes |
| Java | jvm.memory.total.limit |  |  | bytes |
| Java | jvm.memory.used |  |  | bytes |
| Java | jvm.memory.committed |  |  | bytes |
| Java | jvm.memory.limit |  |  | bytes |
| Java | jvm.buffer.memory.usage |  |  | bytes |
| Java | jvm.buffer.memory.committed |  |  | bytes |
| Java | jvm.buffer.memory.limit |  |  | bytes |
| Java | jvm.gc.count |  |  | n/a |
| Java | jvm.gc.duration |  |  | seconds |
| Java | jvm.thread.count |  |  | n/a |



## Disable memory fitting

Automatic memory fitting is helpful in most scenarios, but it might not be ideal for all situations. You can disable memory fitting manually or automatically.

### Manual disable

To disable memory fitting when you create your container app, set the environment variable `BP_JVM_FIT` to `false`.

The following examples show you how to use disable memory fitting with the `create`, `up`, and `update` commands.

# [create](#tab/create)

```azurecli-interactive
az containerapp create \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --image <CONTAINER_IMAGE_LOCATION> \
  --enable-java-metrics
```

# [up](#tab/up)

```azurecli-interactive
az containerapp up \ 
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --image <CONTAINER_IMAGE_LOCATION> \
  --environment <ENVIRONMENT_NAME> \
  --env-vars BP_JVM_FIT="false" 
```

# [update](#tab/update)

```azurecli-interactive
az containerapp update \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --image <CONTAINER_IMAGE_LOCATION>  \
  --set-env-vars BP_JVM_FIT="false" 
```

> [!NOTE]
> The container app restarts when you run the `update` command.

## Next steps

> [!div class="nextstepaction"]
> [Monitor logs with Log Analytics](log-monitoring.md)
