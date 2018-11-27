---
title: Use an external cache in Azure API Management | Microsoft Docs
description: Learn how to configure and use an external cache in Azure API Management.
services: api-management
documentationcenter: ''
author: mikebudzynski
manager: erikre
editor: ''

ms.assetid: 740f6a27-8323-474d-ade2-828ae0c75e7a
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 11/27/2018
ms.author: apimpm

---

# Use an external Redis cache in Azure API Management

Azure API Management allows for caching responses in an external Redis cache, aside from the built-in cache.

Using an external cache allows to overcome a few limitations of the built-in cache. It is especially beneficial if you would like to:

* Avoid having your cache periodically cleared during API Management updates
* Have more control over your cache configuration
* Cache more data than your API Management tier allows to
* Use caching with the Consumption tier of API Management

For more detailed information about caching, see [API Management caching policies](api-management-caching-policies.md) and  [Custom caching in Azure API Management](api-management-sample-cache-by-key.md).

![Bring your own cache to APIM](media/api-management-howto-byoc/overview.png)

What you'll learn:

> [!div class="checklist"]
> * Add an external cache in API Management

## Availability

> [!NOTE]
> This feature is currently available only in the **Consumption** tier of Azure API Management.

## Prerequisites

To complete this tutorial, you need to:

+ [Create an Azure API Management instance](get-started-create-service-instance.md)
+ Understand [caching in Azure API Management](api-management-howto-cache.md)

## <a name="create-cache"> </a> Create Azure Redis Cache

This section explains how to create a Redis cache in Azure. If you already have a Redis cache, within or outside of Azure, you can <a href="#add-external-cache">skip</a> to the next section.

[!INCLUDE [redis-cache-create](../../includes/redis-cache-create.md)]

## <a name="add-external-cache"> </a>Add an external cache in API Management

Follow the steps below to add any external Redis cache in Azure API Management.

![Bring your own cache to APIM](media/api-management-howto-byoc/add-external-cache.png)

> [!NOTE]
> The **Used from** setting specifies which API Management regional deployment will communicate with the configured cache in case of a multi-regional deployment of API Management. The value **Default** will be overridden by a regional value.
>
> For example, if API Management is hosted in the East US, Southeast Asia and West Europe regions and there are two cache entries, one for **Default** and one for **Southeast Asia**, API Management in **Southeast Asia** will use its own cache, while the other two regions will use the **Default** cache entry.

### Add an Azure Redis Cache from the same subscription

1. Browse to your API Management instance in the Azure portal.
2. Select the **External cache** tab from the menu on the left.
3. Click the **+ Add** button.
4. Select your cache in the **Cache instance** dropdown field.
5. Select **Default** or specify the desired region in the **Used from** dropdown field.
6. Click **Save**.

### Add a Redis cache hosted outside of the current Azure subscription or Azure in general

1. Browse to your API Management instance in the Azure portal.
2. Select the **External cache** tab from the menu on the left.
3. Click the **+ Add** button.
4. Select **Custom** in the **Cache instance** dropdown field.
5. Select **Default** or specify the desired region in the **Used from** dropdown field.
6. Provide your Redis cache connection string in the **Connection string** field.
7. Click **Save**.

## Use the external cache

Once the external cache is configured in Azure API Management, it can be used through caching policies. See [Add caching to improve performance in Azure API Management](api-management-howto-cache.md) for detailed steps.

## <a name="next-steps"> </a>Next steps
* For more information about caching policies, see [Caching policies][Caching policies] in the [API Management policy reference][API Management policy reference].
* For information on caching items by key using policy expressions, see [Custom caching in Azure API Management](api-management-sample-cache-by-key.md).

[API Management policy reference]: https://msdn.microsoft.com/library/azure/dn894081.aspx
[Caching policies]: https://msdn.microsoft.com/library/azure/dn894086.aspx