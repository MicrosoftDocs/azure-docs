---
ms.date: 05/18/2025
ms.topic: include
ms.custom:
  - build-2025
---


The following steps show you how to set up the working environment for the Java app. 


::: zone pivot="azure-managed-redis"

```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export REDIS_CACHE_PORT=10000
```

::: zone-end

::: zone pivot="azure-cache-redis"

```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export REDIS_CACHE_PORT=6380
```

::: zone-end

Replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name. To get the host name and ports for your cache, select **Overview** from the **Resource** menu. The host name is of the form `<DNS name>.redis.cache.windows.net`.

  :::image type="content" source="media/redis-cache-access-keys/redis-cache-hostname-ports.png" alt-text="Screenshot showing Azure Cache for Redis properties.":::

- `<your-client-id>`: The application (client) ID of your Azure AD application registration.
- `<your-client-secret>`: The client secret of your Azure AD application registration.  
- `<your-tenant-id>`: Your Azure Active Directory tenant ID.

  > [!NOTE]
  > The above example uses client secret authentication. You can also configure the `redis-authx-entraid` library to use other authentication methods such as managed identity or client certificate by modifying the `EntraIDTokenAuthConfigBuilder` configuration in your code.

---
