---
title: Use an external cache in Azure API Management | Microsoft Docs
description: Learn how to configure and use an external Redis-compatible cache in Azure API Management. Using an external cache gives you more control and flexibility than the built-in cache.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 05/19/2022
ms.author: danlep

---

# Use an external Redis-compatible cache in Azure API Management

In addition to utilizing the built-in cache, Azure API Management allows for caching responses in an external Redis-compatible cache, such as Azure Cache for Redis.

Using an external cache allows you to overcome a few limitations of the built-in cache:

* Avoid having your cache periodically cleared during API Management updates
* Have more control over your cache configuration
* Cache more data than your API Management tier allows
* Use caching with the Consumption tier of API Management
* Enable caching in the [API Management self-hosted gateway](self-hosted-gateway-overview.md)

For more detailed information about caching, see [API Management caching policies](api-management-caching-policies.md) and  [Custom caching in Azure API Management](api-management-sample-cache-by-key.md).

![Bring your own cache to APIM](media/api-management-howto-cache-external/overview.png)

What you'll learn:

> [!div class="checklist"]
> * Add an external cache in API Management

## Prerequisites

To complete this tutorial, you need to:

+ [Create an Azure API Management instance](get-started-create-service-instance.md)
+ Understand [caching in Azure API Management](api-management-howto-cache.md)

## <a name="create-cache"> </a> Create Azure Cache for Redis

This section explains how to create an Azure Cache for Redis in Azure. If you already have an Azure Cache for Redis, or another Redis-compatible cache within or outside of Azure, you can <a href="#add-external-cache">skip</a> to the next section.

[!INCLUDE [redis-cache-create](../azure-cache-for-redis/includes/redis-cache-create.md)]

## <a name="create-cache"> </a> Deploy Redis cache to Kubernetes

For a self-hosted gateway, caching requires an external cache. For caching to be effective, a self-hosted gateway and the cache it relies on must be located close to each other to minimize lookup and store latencies. Deploying a Redis cache into the same Kubernetes cluster or in a separate cluster nearby are the best options. Learn how to [deploy Redis cache to a Kubernetes cluster](https://github.com/kubernetes/examples/tree/master/guestbook).

## <a name="add-external-cache"> </a>Add an external cache

Follow the steps below to add an external Redis-compatible cache in Azure API Management. You can limit the cache to a specific gateway in your API Management instance.

![Screenshot that shows how to add an external Azure Cache for Redis in Azure API Management.](media/api-management-howto-cache-external/add-external-cache.png)

### Use from setting

The **Use from** setting in the configuration specifies the location of your API Management instance that will use the cache. Select one of the following:

* The Azure region where the API Management instance is hosted (or one of the configured locations, if you have a [multi-region](api-management-howto-deploy-multi-region.md) deployment)

* A self-hosted gateway location 

* **Default**, to configure the cache as the default for all gateway locations in the API Management instance

    A cache used for **Default** will be overridden by a cache used for a specific matching region or location.

    For example, consider an API Management instance that's hosted in the East US, Southeast Asia, and West Europe regions. There are two caches configured, one for **Default** and one for **Southeast Asia**. In this example, API Management in **Southeast Asia** will use its own cache, while the other two regions will use the **Default** cache entry.

> [!NOTE]
> You can configure the same external cache for more than one API Management instance. The API Management instances can be in the same or different regions. When sharing the cache for more than one instance, you must select **Default** in the **Use from** setting. 

### Add an Azure Cache for Redis from the same subscription

1. Browse to your API Management instance in the Azure portal.
2. Select the **External cache** tab from the menu on the left.
3. Select the **+ Add** button.
4. Select your cache in the **Cache instance** dropdown field.
5. Select **Default** or specify the desired region in the [**Use from**](#use-from-setting) dropdown field.
6. Select **Save**.

### Add a Redis-compatible cache hosted outside of the current Azure subscription or Azure in general

1. Browse to your API Management instance in the Azure portal.
2. Select the **External cache** tab from the menu on the left.
3. Select the **+ Add** button.
4. Select **Custom** in the **Cache instance** dropdown field.
5. Select **Default** or specify the desired region in the [**Use from**](#use-from-setting) dropdown field.
6. Provide your Azure Cache for Redis (or Redis-compatible cache) connection string in the **Connection string** field.
7. Select **Save**.

### Add a Redis cache to a self-hosted gateway

1. Browse to your API Management instance in the Azure portal.
2. Select the **External cache** tab from the menu on the left.
3. Select the **+ Add** button.
4. Select **Custom** in the **Cache instance** dropdown field.
5. Specify the desired self-hosted gateway location or **Default** in the [**Use from**](#use-from-setting) dropdown field.
6. Provide your Redis cache connection string in the **Connection string** field.
7. Select **Save**.

## Use the external cache

After adding a Redis-compatible cache, configure [caching policies](api-management-caching-policies.md) to enable response caching, or caching of values by key, in the external cache.

For a detailed example, see [Add caching to improve performance in Azure API Management](api-management-howto-cache.md).

## <a name="next-steps"> </a>Next steps

* For more information about caching policies, see [Caching policies][Caching policies] in the [API Management policy reference][API Management policy reference].
* To cache items by key using policy expressions, see [Custom caching in Azure API Management](api-management-sample-cache-by-key.md).

[API Management policy reference]: ./api-management-policies.md
[Caching policies]: ./api-management-caching-policies.md
