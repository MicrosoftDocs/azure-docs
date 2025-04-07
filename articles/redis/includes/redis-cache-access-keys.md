---
ms.date: 08/16/2024
ms.topic: include
ms.custom: ignite-2024
---

### Retrieve host name, ports, and access keys from the Azure portal

To connect your Azure Cache for Redis server, the cache client needs the host name, ports, and a key for the cache. Some clients might refer to these items by slightly different names. You can get the host name, ports, and keys from the [Azure portal](https://portal.azure.com).

- To get the host name and ports for your cache, select **Overview** from the **Resource** menu. The host name is of the form `<DNS name>.redis.cache.windows.net`.

  :::image type="content" source="media/redis-cache-access-keys/redis-cache-hostname-ports.png" alt-text="Screenshot showing Azure Cache for Redis properties.":::

- To get the access keys, select **Authentication** from the **Resource** menu. Then, select the **Access keys** tab.

  :::image type="content" source="media/redis-cache-access-keys/redis-cache-keys.png" alt-text="Screenshot showing Azure Cache for Redis access keys.":::
