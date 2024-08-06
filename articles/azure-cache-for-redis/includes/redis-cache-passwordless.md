---
ms.service: cache
ms.topic: include
ms.date: 07/03/2024
ms.author: franlanglois
author: flang-msft
---

### Retrieve host name from the Azure portal

To connect your Azure Cache for Redis server, the cache client needs the host name and port for the cache. Some clients might refer to these items by slightly different names. You can get the host name, ports, and keys from the [Azure portal](https://portal.azure.com).

- To get the host name and ports for your cache, select **Overview** from the Resource menu. The host name is of the form `<DNS-name>.redis.cache.windows.net`.

  ![Azure Cache for Redis properties](media/redis-cache-access-keys/redis-cache-hostname-ports.png)
