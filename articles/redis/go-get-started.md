---
title: Use Azure Cache for Redis with Go
description: In this quickstart, you learn how to create a Go app that uses Azure Cache for Redis.
ms.date: 05/18/2025
ms.topic: quickstart
ms.custom:
  - mode-api
  - devx-track-go
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Cache for Redis
ms.devlang: golang
zone_pivot_groups: redis-type
---

# Quickstart: Use Azure Redis with Go

In this article, you learn how to use a Azure Redis cache with the Go language.

<!-- ## Skip to the code on GitHub

If you want to skip straight to the code, see the [Go quickstart](https://github.com/Azure-Samples/azure-redis-cache-go-quickstart/) on GitHub.

We are breaking the connection to this. -->

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Go](https://go.dev/doc/install) (preferably version 1.13 or above)
- [Git](https://git-scm.com/downloads)
- An HTTP client such [curl](https://curl.se/)

## Create an Azure Managed Redis instance

First you must create a cache. You can create a cache using Azure Managed Redis or Azure Cache for Redis using the Azure portal.

When you create the cache you should create it with both Access keys enabled. Microsoft Entra ID is enabled by default. Your cache must also public endpoint for this Quickstart.
- [Azure Managed Redis](includes/managed-redis-create.md)
- [Azure Cache for Redis](/azure/azure-cache-for-redis/quickstart-create-redis)

Optionally, you can create a cache using Azure CLI, PowerShell, or any means that you prefer.

[!INCLUDE [managed-redis-create](includes/managed-redis-create.md)]

## Code to connect to a AMR Cache

<!-- similar to python code. Use very basic defaultcredential with Redis extension-->

## Code to test a connection

<!--  similar to P -->

## Code set a key, get a key

<!-- simple set key, get value  -->

<!-- clean up resources include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

[Create a simple ASP.NET web app that uses an Azure Cache for Redis.](web-app-cache-howto.md)
<!-- Link to Redis Extension for connecting -->
<!-- Link to any Redis code sample on their site that are germane -->