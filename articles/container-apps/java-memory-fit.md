---
title: How to use memory efficiently for Java apps in Azure Container Apps
description: Optimization of default configurations to enhance Java application performance and efficiency.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: ignite-2024, devx-track-azurecli, devx-track-extended-java
ms.topic: conceptual
ms.date: 02/03/2025
ms.author: cshoe
---

# Use memory efficiently for Java apps in Azure Container Apps (preview)

The Java Virtual Machine (JVM) uses memory conservatively as it assumes OS memory must be shared among multiple applications. However, your container app can optimize memory usage and make the maximum amount of memory possible available to your application. This memory optimization is known as Java automatic memory fitting. When memory fitting is enabled, Java application performance is typically improved between 10% and 20% without any code changes.

Azure Container Apps provides automatic memory fitting under the following circumstances:

- A single Java application is running in a container.
- Your application is deployed from source code or a JAR file.

Automatic memory fitting is enabled by default, but you can disable manually.

## Disable memory fitting

Automatic memory fitting is helpful in most scenarios, but it might not be ideal for all situations. You can disable memory fitting manually or automatically.

### Manual disable

To disable memory fitting when you create your container app, set the environment variable `BP_JVM_FIT` to `false`.

The following examples show you how to use disable memory fitting with the `create`, `up`, and `update` commands.

# [create](#tab/create)

```azurecli
az containerapp create \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --image <CONTAINER_IMAGE_LOCATION> \
  --environment <ENVIRONMENT_NAME> \
  --env-vars BP_JVM_FIT="false" 
```

# [up](#tab/up)

```azurecli
az containerapp up \ 
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --image <CONTAINER_IMAGE_LOCATION> \
  --environment <ENVIRONMENT_NAME> \
  --env-vars BP_JVM_FIT="false" 
```

# [update](#tab/update)

```azurecli
az containerapp update \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --image <CONTAINER_IMAGE_LOCATION>  \
  --set-env-vars BP_JVM_FIT="false" 
```

> [!NOTE]
> The container app restarts when you run the `update` command.

---

To verify that memory fitting is disabled, check your logs for the following message:

> Disabling jvm memory fitting, reason: manually disabled

### Automatic disable

Memory fitting is automatically disabled when any of the following conditions are met:

- **Limited container memory**: Container memory is less than 1 GB.

- **Explicitly set memory options**: When one or more memory settings are specified in environment variables through `JAVA_TOOL_OPTIONS`. Memory setting options include the following values:

    - `-XX:MaxRAMPercentage`
    - `-XX:MinRAMPercentage`
    - `-XX:InitialRAMPercentage`
    - `-XX:MaxMetaspaceSize`
    - `-XX:MetaspaceSize`
    - `-XX:ReservedCodeCacheSize`
    - `-XX:MaxDirectMemorySize`
    - `-Xmx`
    - `-Xms`
    - `-Xss`

    For example, memory fitting is automatically disabled if you specify the maximum heap size in an environment variable like shown the following example:

    ```azurecli
    az containerapp update \
      --name <CONTAINER_APP_NAME> \
      --resource-group <RESOURCE_GROUP> \
      --image <CONTAINER_IMAGE_LOCATION>  \
      --set-env-vars JAVA_TOOL_OPTIONS="-Xmx512m" 
    ```

    With memory fitting disabled, you see the following message output to the log:

    > Disabling jvm memory fitting, reason: use settings specified in
    > JAVA_TOOL_OPTIONS=-Xmx512m instead
    > Picked up JAVA_TOOL_OPTIONS: -Xmx512m

- **Small non-heap memory size**: Rare cases when the calculated size of heap or nonheap size is too small (less than 200 MB).

## Verify memory fit is enabled

Inspect your [log stream](log-streaming.md) during start-up for a message that references *Calculated JVM Memory Configuration*.

Here's an example message output during start-up.

> Calculated JVM Memory Configuration: -XX:MaxDirectMemorySize=10M
> -Xmx1498277K -XX:MaxMetaspaceSize=86874K -XX:ReservedCodeCacheSize=240M
> -Xss1M (Total Memory: 2G, Thread Count: 250,
> Loaded Class Count: 12924, Headroom: 0%)
>
> Picked up JAVA_TOOL_OPTIONS: -XX:MaxDirectMemorySize=10M
> -Xmx1498277K -XX:MaxMetaspaceSize=86874K
> -XX:ReservedCodeCacheSize=240M -Xss1M

## Runtime configuration

You can set environment variables to affect the memory fitting behavior.

| Variable | Unit | Example | Description |
|--|--|--|--|
| `BPL_JVM_HEAD_ROOM` | Percentage | `BPL_JVM_HEAD_ROOM=5` | Leave memory space for the system based on the given percentage. |
| `BPL_JVM_THREAD_COUNT` | Number | `BPL_JVM_THREAD_COUNT=200` | The estimated maximum number of threads. |
| `BPL_JVM_CLASS_ADJUSTMENT` | Number<br> Percentage | `BPL_JVM_CLASS_ADJUSTMENT=10000`<br>`BPL_JVM_CLASS_ADJUSTMENT="10%"` | Adjust JVM class count by explicit value or percentage. |

> [!NOTE]
> Changing these variables does not disable automatic memory fitting.

## Out of memory warning

If you decide to configure the memory settings yourself, you run the risk of encountering an out-of-memory warning.

Here are some possible reasons of why your container could run out of memory:

- Heap memory is greater than the total available memory.

- Nonheap memory is greater than the total available memory.

- Heap + nonheap memory is greater than the total available memory.

If your container runs out  of memory, then you encounter the following warning:

> OOM Warning: heap memory 1200M is greater than 1G available for allocation (-Xmx1200M)

## Next steps

> [!div class="nextstepaction"]
> [Monitor logs with Log Analytics](log-monitoring.md)
