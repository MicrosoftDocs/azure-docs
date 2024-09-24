---



ms.topic: include
ms.date: 08/16/2024

ms.topic: include
---

### Get the host name, ports, and access key

To connect to your Azure Cache for Redis server, the cache client needs the cache's host name, ports, and an access key. Some clients might refer to these items by using slightly different names. You can get the host name, ports, and keys in the [Azure portal](https://portal.azure.com).

- To get an access key for your cache:

   1. In the Azure portal, go to your cache.
   1. On the service menu, under **Settings**, select **Authentication**.
   1. On the **Authentication** pane, select the **Access keys** tab.
   1. To copy the value for an access key, select the **Copy** icon in the key field.
  
  ![Screenshot that shows how to find and copy an access key for an instance of Azure Cache for Redis.](media/redis-cache-access-keys/redis-cache-keys.png)

- To get the host name and ports for your cache:

   1. In the Azure portal, go to your cache.
   1. On the service menu, select **Overview**.
   1. Under **Essentials**, for **Host name**, select the **Copy** icon to copy the host name value. The host name value has the form `<DNS name>.redis.cache.windows.net`.
   1. For **Ports**, select the **Copy** icon to copy the port values.

  ![Screenshot that shows how to find and copy the host name and ports for an instance of Azure Cache for Redis.](media/redis-cache-access-keys/redis-cache-hostname-ports.png)
