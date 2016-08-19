<properties
	pageTitle="Advanced request throttling with Azure API Management"
	description="Learn how to create and apply flexible quota and rate limiting policies with Azure API Management."
	services="api-management"
	documentationCenter=""
	authors="darrelmiller"
	manager=""
	editor=""/>

<tags
	ms.service="api-management"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="na"
	ms.date="08/09/2016"
	ms.author="darrmi"/>


# Advanced request throttling with Azure API Management

Being able to throttle incoming requests is a key role of Azure API Management. Either by controlling the rate of requests or the total requests/data transferred, API Management allows API providers to protect their APIs from abuse and create value for different API product tiers.

## Product based throttling
To date, the rate throttling capabilities have been limited to being scoped to a particular Product subscription (essentially a key), defined in the API Management publisher portal. This is useful for the API provider to apply limits on the developers who have signed up to use their API, however, it does not help, for example, in throttling individual end-users of the API. It is possible that for single user of the developer's application to consume the entire quota and then prevent other customers of the developer from being able to use the application. Also, several customers who might generate a high volume of requests may limit access to occasional users.

## Custom key based throttling
The new [rate-limit-by-key](https://msdn.microsoft.com/library/azure/dn894078.aspx#LimitCallRateByKey) and [quota-by-key](https://msdn.microsoft.com/library/azure/dn894078.aspx#SetUsageQuotaByKey) policies provide a significantly more flexible solution to traffic control. These new policies allow you to define expressions to identify the keys that will be used to track traffic usage. The way this works is easiest illustrated with an example. 

## IP Address throttling
The following policies restrict a single client IP address to only 10 calls every minute, with a total of 1,000,000 calls and 10,000 kilobytes of bandwidth per month. 

    <rate-limit-by-key  calls="10"
              renewal-period="60"
              counter-key="@(context.Request.IpAddress)" />

    <quota-by-key calls="1000000"
              bandwidth="10000"
              renewal-period="2629800"
              counter-key="@(context.Request.IpAddress)" />

If all clients on the Internet used a unique IP address, this might be an effective way of limiting usage by user. However, it is quite likely that multiple users will sharing a single public IP address due to them accessing the Internet via a NAT device. Despite this, for APIs that allow unauthenticated access the `IpAddress` might be the best option.

## User identity throttling
If an end user is authenticated then a throttling key can be generated based on information that uniquely identifies an that user.

    <rate-limit-by-key calls="10"
        renewal-period="60"
        counter-key="@(context.Request.Headers.GetValueOrDefault("Authorization","").AsJwt()?.Subject)" />

In this example we extract the Authorization header, convert it to `JWT` object and use the subject of the token to identify the user and use that as the rate limiting key. If the user identity is stored in the `JWT` as one of the other claims then that value could be used in its place.

## Combined policies
Although the new throttling policies provide more control than the existing throttling policies, there is still value combining both capabilities. Throttling by product subscription key ([Limit call rate by subscription](https://msdn.microsoft.com/library/azure/dn894078.aspx#LimitCallRate) and [Set usage quota by subscription](https://msdn.microsoft.com/library/azure/dn894078.aspx#SetUsageQuota)) is a great way to enable monetizing of an API by charging based on usage levels. The finer grained control of being able to throttle by user is complementary and prevents one user's behavior from degrading the experience of another. 

## Client driven throttling
When the throttling key is defined using a [policy expression](https://msdn.microsoft.com/library/azure/dn910913.aspx), then it is the API provider that is choosing how the throttling is scoped. However, a developer might want to control how they rate limit their own customers. This could be enabled by the API provider by introducing a custom header to allow the developer's client application to communicate the key to the API.

    <rate-limit-by-key calls="100"
              renewal-period="60"
              counter-key="@(request.Headers.GetValueOrDefault("Rate-Key",""))"/>

This enables the developer's client application to choose how they want to create the rate limiting key. With a little bit of ingenuity a client developer could create their own rate tiers by allocating sets of keys to users and rotating the key usage.

## Summary
Azure API Management provides rate and quote throttling to both protect and add value to your API service. The new throttling policies with custom scoping rules allow you finer grained control over those policies to enable your customers to build even better applications. The examples in this article demonstrate the use of these new policies by manufacturing rate limiting keys with client IP addresses, user identity, and client generated values. However, there are many other parts of the message that could be used such as user agent, URL path fragments, message size.

## Next steps
Please give us your feedback in the Disqus thread for this topic. It would be great to hear about other potential key values that have been a logical choice in your scenarios.

## Watch a video overview of these policies
For more information on the [rate-limit-by-key](https://msdn.microsoft.com/library/azure/dn894078.aspx#LimitCallRateByKey) and [quota-by-key](https://msdn.microsoft.com/library/azure/dn894078.aspx#SetUsageQuotaByKey) policies covered in this article, please watch the following video.

> [AZURE.VIDEO advanced-request-throttling-with-azure-api-management]
