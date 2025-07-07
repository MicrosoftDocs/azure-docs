---
ms.date: 04/04/2025
ms.topic: include
ms.custom: ignite-2024
---

### Get cache host name, port, and access keys from the Azure portal

To connect to your Azure Redis cache, the cache client needs the cache host name, ports, and keys. Some clients might refer to these items by slightly different names. Follow these instructions to get the cache host name, ports, and keys from the [Azure portal](https://portal.azure.com).

- Get the host name from the cache **Overview** page. The host name is of the form `<cachename>.redis.cache.windows.net`.

- Select the link next to **Ports** to get the ports. Enterprise and Enterprise Flash tier caches use port `10000`. Basic, Standard, and Premium tier caches use either port `6380` for Transport Layer Security (TLS) connections or port `6379` for non-TLS connections.

- To get the access keys, select **Show access keys**.

  :::image type="content" source="media/redis-cache-access-keys/redis-cache-hostname-ports.png" alt-text="Screenshot showing Azure Redis cache properties.":::

  The **CacheKeys** pane displays the keys.
 
  :::image type="content" source="media/redis-cache-access-keys/redis-cache-keys-pane.png" alt-text="Screenshot showing Azure Redis cache access keys pane.":::

  You can also select **Authentication** under **Settings** in the left navigation menu, and then select the **Access keys** tab.

  :::image type="content" source="media/redis-cache-access-keys/redis-cache-keys.png" alt-text="Screenshot showing Azure Redis cache access keys.":::
