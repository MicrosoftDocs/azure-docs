---


ms.service: cache
ms.topic: include
ms.date: 08/16/2024

ms.topic: include
---

### Get the host name

To connect to your Azure Cache for Redis server, the cache client needs the cache's host name and other information. Some clients might refer to the items by using slightly different names. You can get the host name in the [Azure portal](https://portal.azure.com).

1. In the Azure portal, go to your cache.
1. On the service menu, select **Overview**.
1. Under **Essentials**, for **Host name**, select the **Copy** icon to copy the host name value. The host name value has the form `<DNS name>.redis.cache.windows.net`.

:::image type="content" source="media/redis-cache-access-keys/redis-cache-hostname-ports.png" alt-text="Screenshot showing Azure Cache for Redis properties with the host name highlighted.":::
