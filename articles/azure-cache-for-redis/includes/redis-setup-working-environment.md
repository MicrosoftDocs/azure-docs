---
ms.topic: include
ms.date: 01/15/2025
---


The following steps show you how to set up the working environment for the Java app. You can choose to authenticate with Azure Cache for Redis using Microsoft Entra ID (recommended) or access keys.

### [Microsoft Entra ID authentication (recommended)](#tab/entraid)

::: zone pivot="azure-managed-redis"

```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export USER_NAME=<user-name>
export REDIS_CACHE_PORT=10000
```

::: zone-end

::: zone pivot="azure-cache-redis"


```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export USER_NAME=<user-name>
export REDIS_CACHE_PORT=6380
```

::: zone-end


Replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name. To get the host name and ports for your cache, select **Overview** from the **Resource** menu. The host name is of the form `<DNS name>.redis.cache.windows.net`.

  :::image type="content" source="media/redis-cache-access-keys/redis-cache-hostname-ports.png" alt-text="Screenshot showing Azure Cache for Redis properties.":::

- `<user-name>`: Object ID of your managed identity or service principal.

  You can get the user name by using the following steps:

  1. In the Azure portal, navigate to your Azure Cache for Redis instance.
  1. On the navigation pane, select **Data Access Configuration**.
  1. On the **Redis Users** tab, find the **Username** column.

     :::image type="content" source="media/cache-java-get-started/user-name.png" alt-text="Screenshot of the Azure portal that shows the Azure Cache for Redis Data Access Configuration page with the Redis Users tab and a Username value highlighted." lightbox="media/cache-java-get-started/user-name.png":::

### [Access key authentication](#tab/accesskey)

::: zone pivot="azure-managed-redis"

```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export REDIS_CACHE_KEY=<your-primary-access-key>
export REDIS_CACHE_PORT=10000
```

::: zone-end

::: zone pivot="azure-cache-redis"

```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export REDIS_CACHE_KEY=<your-primary-access-key>
export REDIS_CACHE_PORT=6380
```

::: zone-end

Replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name.  To get the host name and ports for your cache, select **Overview** from the **Resource** menu. The host name is of the form `<DNS name>.redis.cache.windows.net`.

  :::image type="content" source="media/redis-cache-access-keys/redis-cache-hostname-ports.png" alt-text="Screenshot showing Azure Cache for Redis properties.":::

- `<your-primary-access-key>`: The primary access key. To get the access keys, select **Authentication** from the **Resource** menu. Then, select the **Access keys** tab.

  :::image type="content" source="media/redis-cache-access-keys/redis-cache-keys.png" alt-text="Screenshot showing Azure Cache for Redis access keys.":::

---
