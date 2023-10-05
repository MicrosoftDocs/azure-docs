---
title: Advanced request throttling with Azure API Management
description: Learn how to create and apply flexible quota and rate limiting policies with Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow
manager: erikre
editor: ''

ms.assetid: fc813a65-7793-4c17-8bb9-e387838193ae
ms.service: api-management
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/03/2018
ms.author: danlep

---
# Advanced request throttling with Azure API Management
Being able to throttle incoming requests is a key role of Azure API Management. Either by controlling the rate of requests or the total requests/data transferred, API Management allows API providers to protect their APIs from abuse and create value for different API product tiers.

## Rate limits and quotas
Rate limits and quotas are used for different purposes.

### Rate limits
Rate limits are usually used to protect against short and intense volume bursts. For example, if you know your backend service has a bottleneck at its database with a high call volume, you could set a `rate-limit-by-key` policy to not allow high call volume by using this setting.

[!INCLUDE [api-management-rate-limit-accuracy](../../includes/api-management-rate-limit-accuracy.md)]


### Quotas
Quotas are usually used for controlling call rates over a longer period of time. For example, they can set the total number of calls that a particular subscriber can make within a given month. For monetizing your API, quotas can also be set differently for tier-based subscriptions. For example, a Basic tier subscription might be able to make no more than 10,000 calls a month but a Premium tier could go up to 100,000,000 calls each month.

Within Azure API Management, rate limits are typically propagated faster across the nodes to protect against spikes. In contrast, usage quota information is used over a longer term and hence its implementation is different.

[!INCLUDE [api-management-quota-accuracy](../../includes/api-management-quota-accuracy.md)]


## Product-based throttling
Rate throttling capabilities that are scoped to a particular subscription are useful for the API provider to apply limits on the developers who have signed up to use their API. However, it does not help, for example, in throttling individual end users of the API. It is possible for a single user of the developer's application to consume the entire quota and then prevent other customers of the developer from being able to use the application. Also, several customers who might generate a high volume of requests may limit access to occasional users.

## Custom key-based throttling

> [!NOTE]
> The `rate-limit-by-key` and `quota-by-key` policies are not available when in the Consumption tier of Azure API Management. 

The [rate-limit-by-key](rate-limit-by-key-policy.md) and [quota-by-key](quota-by-key-policy.md) policies provide a more flexible solution to traffic control. These policies allow you to define expressions to identify the keys that are used to track traffic usage. The way this works is easiest illustrated with an example. 

## IP address throttling
The following policies restrict a single client IP address to only 10 calls every minute, with a total of 1,000,000 calls and 10,000 kilobytes of bandwidth per month. 

```xml
<rate-limit-by-key  calls="10"
          renewal-period="60"
          counter-key="@(context.Request.IpAddress)" />

<quota-by-key calls="1000000"
          bandwidth="10000"
          renewal-period="2629800"
          counter-key="@(context.Request.IpAddress)" />
```

If all clients on the Internet used a unique IP address, this might be an effective way of limiting usage by user. However, it is likely that multiple users are sharing a single public IP address due to them accessing the Internet via a NAT device. Despite this, for APIs that allow unauthenticated access the `IpAddress` might be the best option.

## User identity throttling
If an end user is authenticated, then a throttling key can be generated based on information that uniquely identifies that user.

```xml
<rate-limit-by-key calls="10"
    renewal-period="60"
    counter-key="@(context.Request.Headers.GetValueOrDefault("Authorization","").AsJwt()?.Subject)" />
```

This example shows how to extract the Authorization header, convert it to `JWT` object and use the subject of the token to identify the user and use that as the rate limiting key. If the user identity is stored in the `JWT` as one of the other claims, then that value could be used in its place.

## Combined policies
Although the user-based throttling policies provide more control than the subscription-based throttling policies, there is still value combining both capabilities. Throttling by product subscription key ([Limit call rate by subscription](rate-limit-policy.md) and [Set usage quota by subscription](quota-policy.md)) is a great way to enable monetizing of an API by charging based on usage levels. The finer grained control of being able to throttle by user is complementary and prevents one user's behavior from degrading the experience of another. 

## Client driven throttling
When the throttling key is defined using a [policy expression](./api-management-policy-expressions.md), then it is the API provider that is choosing how the throttling is scoped. However, a developer might want to control how they rate limit their own customers. This could be enabled by the API provider by introducing a custom header to allow the developer's client application to communicate the key to the API.

```xml
<rate-limit-by-key calls="100"
          renewal-period="60"
          counter-key="@(request.Headers.GetValueOrDefault("Rate-Key",""))"/>
```

This enables the developer's client application to choose how they want to create the rate limiting key. The client developers could create their own rate tiers by allocating sets of keys to users and rotating the key usage.

## Summary
Azure API Management provides rate and quota throttling to both protect and add value to your API service. The new throttling policies with custom scoping rules allow you finer grained control over those policies to enable your customers to build even better applications. The examples in this article demonstrate the use of these new policies by manufacturing rate limiting keys with client IP addresses, user identity, and client generated values. However, there are many other parts of the message that could be used such as user agent, URL path fragments, message size.

## Next steps
Please give us your feedback as a GitHub issue for this topic. It would be great to hear about other potential key values that have been a logical choice in your scenarios.
