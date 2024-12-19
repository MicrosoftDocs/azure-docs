---
ms.topic: include
ms.date: 12/19/2024
---


The following steps show you how to set up the working environment for the Java app. You can choose to authenticate with Azure Cache for Redis using Microsoft Entra ID(recommended) or access keys.

### [Microsoft Entra ID Authentication (recommended)](#tab/entraid)

```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export USER_NAME=<user-name>
```

Replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name, obtained from the *Properties* section of your Azure Cache for Redis resource in the Azure portal.
- `<user-name>`: Object ID of your managed identity or service principal.
  - You can get the user name by using the following steps:

    1. In the Azure portal, navigate to your Azure Cache for Redis instance.
    1. On the navigation pane, select **Data Access Configuration**.
    1. On the **Redis Users** tab, find the **Username** column.

       :::image type="content" source="media/cache-java-get-started/user-name.png" alt-text="Screenshot of the Azure portal that shows the Azure Cache for Redis Data Access Configuration page with the Redis Users tab and a Username value highlighted." lightbox="media/cache-java-get-started/user-name.png":::

### [Access Key Authentication](#tab/accesskey)

```bash
export REDIS_CACHE_HOSTNAME=<your-host-name>.redis.cache.windows.net
export REDIS_CACHE_KEY=<your-primary-access-key>
```

Replace the placeholders with the following values:

- `<your-host-name>`: The DNS host name, obtained from the *Properties* section of your Azure Cache for Redis resource in the Azure portal.
- `<your-primary-access-key>`: The primary access key, obtained from the *Access keys* section of your Azure Cache for Redis resource in the Azure portal.

---