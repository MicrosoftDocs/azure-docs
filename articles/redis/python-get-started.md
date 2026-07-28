---
title: "Quickstart: Create a Python app with Azure Managed Redis"
description: In this quickstart, you learn how to create a Python app that uses Azure Managed Redis.
ms.date: 01/09/2026
ms.topic: quickstart
ms.custom:
- mode-api
- devx-track-python
- ignite-2024
- build-2025
appliesto:
- ✅ Azure Managed Redis
ms.devlang: python
ai-usage: ai-assisted
---

# Quickstart: Create a Python app with Azure Managed Redis

In this article, you learn how to use an Azure Managed Redis cache with the Python language and connect using Microsoft Entra ID.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
- Install [Python 3.7+](https://www.python.org/downloads/) language environment
- Add these imports from  to your project and to your development environment
  - `redis` - The Redis Python client
  - `redis-entraid` - Redis Microsoft Entra ID authentication extension
  - `azure-identity` - Azure authentication library

## Create an Azure Managed Redis instance

First, create a cache. You can create a cache using Azure Managed Redis or Azure Cache for Redis using the Azure portal. In this Quickstart, we use Azure Managed Redis.

When you create the cache, Microsoft Entra ID is enabled by default making it secure from the start. Your cache must also use a public endpoint for this QuickStart.

To create a cache with the portal, follow one of these procedures:

- [Azure Managed Redis](quickstart-create-managed-redis.md)
- [Azure Cache for Redis](/azure/azure-cache-for-redis/quickstart-create-redis)

Optionally, you can create a cache using Azure CLI, PowerShell, whichever you prefer.

## Code to connect to a Redis cache

In the first part of the code sample, set your connection to the cache. 

- Ports for Azure Managed Redis and Enterprise caches: 10000
- Ports for Azure Cache for Redis instances: 6380

```python
import redis
from azure.identity import DefaultAzureCredential
from redis_entraid.cred_provider import create_from_default_azure_credential

redis_host = "<host-url>"
redis_port = 10000  # Managed Redis default port

credential_provider = create_from_default_azure_credential(
    ("https://redis.azure.com/.default",),
)

r = redis.Redis(
    host=redis_host,
    port=redis_port,
    ssl=True,
    decode_responses=True,
    credential_provider=credential_provider
)

```

Before you can run this code, you must add yourself as a Redis user to the cache.

You must also authorize your connection to Azure from the command line using the Azure command line or Azure developer command line (azd).

You should also [add users or a System principal to your cache](entra-for-authentication.md#add-users-or-system-principal-to-your-cache). Add anyone who might run the program as a user on the Redis cache.

The result looks like this:

```console
PING: True
GET: Hello from Azure Managed Redis!

```

Here, you can see this code sample in its entirety. The code contains some error checking omitted from the earlier code explanations for simplicity. The final step is closing the connection to the cache.

```python
import redis
from azure.identity import DefaultAzureCredential
from redis_entraid.cred_provider import create_from_default_azure_credential

redis_host = "<host-url>"
redis_port = 10000  # Managed Redis default port

credential_provider = create_from_default_azure_credential(
    ("https://redis.azure.com/.default",),
)

try:
    r = redis.Redis(
        host=redis_host,
        port=redis_port,
        ssl=True,
        decode_responses=True,
        credential_provider=credential_provider,
        socket_timeout=10,
        socket_connect_timeout=10
    )

    print("PING:", r.ping())
    r.set("Message", "Hello from Azure Managed Redis!")
    print("GET:", r.get("Message"))

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'r' in locals():
        r.close()

```

<!-- Clean up resources include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Redis Extension for connecting using Microsoft Entra ID](https://github.com/redis/redis-py-entraid)
- [redis-py guide](https://redis.io/docs/latest/develop/clients/redis-py/)
