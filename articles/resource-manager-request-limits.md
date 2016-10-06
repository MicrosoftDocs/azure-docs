<properties
   pageTitle="Azure Resource Manager request limits | Microsoft Azure"
   description="Describes how to use throttling with Azure Resource Manager requests when subscription limits have been reached."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/05/2016"
   ms.author="tomfitz"/>

# Throttling Resource Manager requests

For each subscription, Resource Manager limits read requests to 15,000 per hour and write requests to 1,200 per hour. If your application or script reaches these limits, you need to throttle your requests. This topic shows you how to determine the remaining requests you have before reaching the limit, and how to respond when you have reached the limit.

When you reach the limit, you receive the HTTP status code **429 Too many requests**.

## Remaining requests

You can determine the number of remaining requests by examining response headers. Each request includes values for the number of remaining read and write requests. The following table describes the response headers you can examine for those values:

| Response header | Description |
| --------------- | ----------- |
| x-ms-ratelimit-remaining-subscription-reads | Subscription reads |
| x-ms-ratelimit-remaining-subscription-writes | Subscription writes |
| x-ms-ratelimit-remaining-tenant-reads | Tenant reads |
| x-ms-ratelimit-remaining-tenant-writes | Tenant writes |
| x-ms-ratelimit-remaining-subscription-resource-requests | Resource type requests. This header value is only returned if a service has overridden the default limit. Resource Manager adds this value instead of the subscription reads or writes. |
| x-ms-ratelimit-remaining-subscription-resource-entities-read | Resource type collection requests. This header value is only returned if a service has overridden the default limit. This value provides the number of remaining collection requests (list resources). |
| x-ms-ratelimit-remaining-tenant-resource-requests | Tenant resource type requests. This header is only added for requests at tenant level, and only if a service has overridden the default limit. Resource Manager adds this value instead of the tenant reads or writes. |
| x-ms-ratelimit-remaining-tenant-resource-entities-read | Tenant resource type collection requests. This header is only added for requests at tenant level, and only if a service has overridden the default limit.  |

## Waiting before sending next request

When you reach the limit, Resource Manager returns a **Retry-After** value in the header. This value specifies the number of seconds your application should wait before sending the next request. If you send a request before the retry value has elapsed, your request is not proccessed and a new retry value is returned.