---
title: Advanced Request Throttling with Azure API Management
description: Learn how to create and apply flexible quota and rate limiting policies by using Azure API Management.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 05/15/2025
ms.author: danlep

#customer intent: As an API provider, I want to create and apply quota and rate limiting so that I can protect my APIs from abuse and/or create value for different API product tiers.
---

# Advanced request throttling with Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The ability to throttle incoming requests is a key role of Azure API Management. API Management enables API providers to protect their APIs from abuse and create value for different API product tiers by controlling either the rate of requests or the total requests/data transferred. This article describes how to create and apply quota and rate limiting. 

## Rate limits and quotas

Rate limits and quotas are used for different purposes.

### Rate limits

Rate limits are usually used to protect against short and intense volume bursts. For example, if you know your backend service has a bottleneck at its database when call volumes are high, you can set a `rate-limit-by-key` policy to disallow high call volumes.

[!INCLUDE [api-management-rate-limit-accuracy](../../includes/api-management-rate-limit-accuracy.md)]


### Quotas

Quotas are usually used to control call rates over a longer period of time. For example, they can set the total number of calls that a particular subscriber can make within a given month. If you monetize your API, you can also set quotas differently for tier-based subscriptions. For example, a Basic tier subscription might be able to make no more than 10,000 calls per month, but a Premium tier might be able to make 100,000,000 calls each month.

In API Management, rate limits are typically propagated faster across the nodes to protect against spikes. In contrast, usage quota information is used over a longer term, so its implementation is different.

[!INCLUDE [api-management-quota-accuracy](../../includes/api-management-quota-accuracy.md)]


## Product-based throttling

API providers can use rate throttling capabilities that are scoped to a particular subscription to apply limits on the developers who have signed up to use their API. However, this type of throttling doesn't help, for example, with throttling individual end users of the API. It's possible for a single user of the developer's application to consume the entire quota and prevent other customers of the developer from being able to use the application. Also, several customers who generate a high volume of requests might limit access to occasional users.

## Custom key-based throttling

> [!NOTE]
> The `rate-limit-by-key` and `quota-by-key` policies aren't available in the Consumption tier of Azure API Management.  

The [rate-limit-by-key](rate-limit-by-key-policy.md) and [quota-by-key](quota-by-key-policy.md) policies provide a more flexible solution to traffic control. These policies enable you to define expressions to identify the keys that are used to track traffic usage. This technique is illustrated in the following examples. 

### IP address throttling

The following policies restrict a single client IP address to only 10 calls every minute and enforce a total of 1,000,000 calls and 10,000 kilobytes of bandwidth per month:

```xml
<rate-limit-by-key  calls="10"
          renewal-period="60"
          counter-key="@(context.Request.IpAddress)" />

<quota-by-key calls="1000000"
          bandwidth="10000"
          renewal-period="2629800"
          counter-key="@(context.Request.IpAddress)" />
```

If all clients on the internet used a unique IP address, this might be an effective way of limiting usage by user. However, it's likely that multiple users are sharing a single public IP address because they access the internet via a NAT device. Still, for APIs that allow unauthenticated access, using `IpAddress` might be the best option.

### User identity throttling

If an end user is authenticated, you can generate a throttling key based on information that uniquely identifies the user:

```xml
<rate-limit-by-key calls="10"
    renewal-period="60"
    counter-key="@(context.Request.Headers.GetValueOrDefault("Authorization","").AsJwt()?.Subject)" />
```

This example shows how to extract the Authorization header, convert it to a `JWT` object, and use the subject of the token to identify the user. It then uses that value as the rate limiting key. If the user identity is stored in the `JWT` as one of the other claims, that value can be used instead.

### Combined policies

Although user-based throttling policies provide more control than subscription-based throttling policies, there is still value in combining both capabilities. For monetized APIs, throttling by product subscription key ([Limit call rate by subscription](rate-limit-policy.md) and [Set usage quota by subscription](quota-policy.md)) is a great way to implement fees that are based on usage levels. The finer-grained control of being able to throttle by user is complementary and prevents one user's behavior from degrading the experience of another. 

### Client-driven throttling

When the throttling key is defined via a [policy expression](./api-management-policy-expressions.md), the API provider chooses how the throttling is scoped. However, a developer might want to control how they rate-limit their own customers. The API provider can enable this type of control by introducing a custom header to allow the developer's client application to communicate the key to the API:

```xml
<rate-limit-by-key calls="100"
          renewal-period="60"
          counter-key="@(request.Headers.GetValueOrDefault("Rate-Key",""))"/>
```

This technique enables the developer's client application to determine how to create the rate limiting key. The client developers could create their own rate tiers by allocating sets of keys to users and rotating the key usage.

## Considerations for multiple regions or gateways

Rate limiting policies like `rate-limit`, `rate-limit-by-key`, `azure-openai-token-limit`, and `llm-token-limit` use counters at the level of the API Management gateway. Therefore, in [multi-region deployments](api-management-howto-deploy-multi-region.md) of API Management, each regional gateway has a separate counter, and rate limits are enforced separately for each region. Similarly, in API Management instances with [workspaces](workspaces-overview.md), limits are enforced separately for each workspace gateway. 

Quota policies like `quota` and `quota-by-key` are global, which means that a single counter is used at the level of the API Management instance. 

## Summary

API Management provides rate and quota throttling to protect and add value to your API service. Throttling policies that have custom scoping rules provide finer-grained control over those policies to enable your customers to build even better applications. The examples in this article demonstrate the use of these policies by creating rate limiting keys with client IP addresses, user identity, and client-generated values. You can, however, use many other parts of the message, such as user agent, URL path fragments, and message size.

## Related content

* [Rate limit and quota policies](api-management-policies.md#rate-limiting-and-quotas)
