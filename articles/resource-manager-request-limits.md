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
| x-ms-ratelimit-remaining-subscription-reads | Subscription reads remaining |
| x-ms-ratelimit-remaining-subscription-writes | Subscription writes remaining |
| x-ms-ratelimit-remaining-tenant-reads | Tenant reads remaining |
| x-ms-ratelimit-remaining-tenant-writes | Tenant writes remaining |
| x-ms-ratelimit-remaining-subscription-resource-requests | Resource type requests remaining.<br /><br />This header value is only returned if a service has overridden the default limit. Resource Manager adds this value instead of the subscription reads or writes. |
| x-ms-ratelimit-remaining-subscription-resource-entities-read | Resource type collection requests remaining.<br /><br />This header value is only returned if a service has overridden the default limit. This value provides the number of remaining collection requests (list resources). |
| x-ms-ratelimit-remaining-tenant-resource-requests | Tenant resource type requests remaining.<br /><br />This header is only added for requests at tenant level, and only if a service has overridden the default limit. Resource Manager adds this value instead of the tenant reads or writes. |
| x-ms-ratelimit-remaining-tenant-resource-entities-read | Tenant resource type collection requests remaining.<br /><br />This header is only added for requests at tenant level, and only if a service has overridden the default limit.  |

You can retrieve the header in your code or script. For example, in C#, you retrieve the header value from an **HttpWebResponse** object named **response** with the following code:

    response.Headers.GetValues("x-ms-ratelimit-remaining-subscription-reads").GetValue(0)

In PowerShell, you retrieve the header value from an Invoke-WebRequest operation.

    $r = Invoke-WebRequest -Uri https://management.azure.com/subscriptions/{guid}/resourcegroups?api-version=2016-09-01 -Method GET -Headers $authHeaders
    $r.Headers["x-ms-ratelimit-remaining-subscription-reads"]
    
Or, if just want to see the remaining requests for debugging, you can provide the **-Debug** parameter on your PowerShell operation.

    Get-AzureRmResourceGroup -Debug
    
Which returns a lot of information, including the following:

    ...
    DEBUG: ============================ HTTP RESPONSE ============================

    Status Code:
    OK

    Headers:
    Pragma                        : no-cache
    x-ms-ratelimit-remaining-subscription-reads: 14999
    ...

In Azure CLI, you retrieve the header value by using the more verbose option.

    azure group list -vv --json

Which returns a lot of information, including the following:

    ...
    silly: returnObject
    {
      "statusCode": 200,
      "header": {
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "content-type": "application/json; charset=utf-8",
        "expires": "-1",
        "x-ms-ratelimit-remaining-subscription-reads": "14998",
        ...

## Waiting before sending next request

When you reach the request limit, Resource Manager returns the **429** HTTP status code and a **Retry-After** value in the header. The **Retry-After** value specifies the number of seconds your application should wait (or sleep) before sending the next request. If you send a request before the retry value has elapsed, your request is not processed and a new retry value is returned.
