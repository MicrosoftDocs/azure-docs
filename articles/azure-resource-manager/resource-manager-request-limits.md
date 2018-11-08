---
title: Azure Resource Manager request limits | Microsoft Docs
description: Describes how to use throttling with Azure Resource Manager requests when subscription limits have been reached.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac

ms.assetid: e1047233-b8e4-4232-8919-3268d93a3824
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/17/2018
ms.author: tomfitz

---
# Throttling Resource Manager requests
For each Azure subscription and tenant, Resource Manager allows up to 12,000 read requests per hour and 1,200 write requests per hour. These limits are scoped to the principal ID making the requests and the subscription ID or tenant ID. If your requests come from more than one principal ID, your limit across the subscription or tenant is greater than 12,000 and 1,200 per hour.

Requests are applied to either your subscription or your tenant. Subscription requests are ones the involve passing your subscription ID, such as retrieving the resource groups in your subscription. Tenant requests don't include your subscription ID, such as retrieving valid Azure locations.

These limits apply to each Azure Resource Manager instance. There are multiple instances in every Azure region, and Azure Resource Manager is deployed to all Azure regions.  So, in practice, limits are effectively much higher than these limits, as user requests are usually serviced by many different instances.

If your application or script reaches these limits, you need to throttle your requests. This article shows you how to determine the remaining requests you have before reaching the limit, and how to respond when you have reached the limit.

When you reach the limit, you receive the HTTP status code **429 Too many requests**.

## Remaining requests
You can determine the number of remaining requests by examining response headers. Each request includes values for the number of remaining read and write requests. The following table describes the response headers you can examine for those values:

| Response header | Description |
| --- | --- |
| x-ms-ratelimit-remaining-subscription-reads |Subscription scoped reads remaining. This value is returned on read operations. |
| x-ms-ratelimit-remaining-subscription-writes |Subscription scoped writes remaining. This value is returned on write operations. |
| x-ms-ratelimit-remaining-tenant-reads |Tenant scoped reads remaining |
| x-ms-ratelimit-remaining-tenant-writes |Tenant scoped writes remaining |
| x-ms-ratelimit-remaining-subscription-resource-requests |Subscription scoped resource type requests remaining.<br /><br />This header value is only returned if a service has overridden the default limit. Resource Manager adds this value instead of the subscription reads or writes. |
| x-ms-ratelimit-remaining-subscription-resource-entities-read |Subscription scoped resource type collection requests remaining.<br /><br />This header value is only returned if a service has overridden the default limit. This value provides the number of remaining collection requests (list resources). |
| x-ms-ratelimit-remaining-tenant-resource-requests |Tenant scoped resource type requests remaining.<br /><br />This header is only added for requests at tenant level, and only if a service has overridden the default limit. Resource Manager adds this value instead of the tenant reads or writes. |
| x-ms-ratelimit-remaining-tenant-resource-entities-read |Tenant scoped resource type collection requests remaining.<br /><br />This header is only added for requests at tenant level, and only if a service has overridden the default limit. |

## Retrieving the header values
Retrieving these header values in your code or script is no different than retrieving any header value. 

For example, in **C#**, you retrieve the header value from an **HttpWebResponse** object named **response** with the following code:

```cs
response.Headers.GetValues("x-ms-ratelimit-remaining-subscription-reads").GetValue(0)
```

In **PowerShell**, you retrieve the header value from an Invoke-WebRequest operation.

```powershell
$r = Invoke-WebRequest -Uri https://management.azure.com/subscriptions/{guid}/resourcegroups?api-version=2016-09-01 -Method GET -Headers $authHeaders
$r.Headers["x-ms-ratelimit-remaining-subscription-reads"]
```

For a complete PowerShell example, see [Check Resource Manager Limits for a Subscription](https://github.com/Microsoft/csa-misc-utils/tree/master/psh-GetArmLimitsViaAPI).

If you want to see the remaining requests for debugging, you can provide the **-Debug** parameter on your **PowerShell** cmdlet.

```powershell
Get-AzureRmResourceGroup -Debug
```

Which returns many values, including the following response value:

```powershell
DEBUG: ============================ HTTP RESPONSE ============================

Status Code:
OK

Headers:
Pragma                        : no-cache
x-ms-ratelimit-remaining-subscription-reads: 14999
```

To get write limits, use a write operation: 

```powershell
New-AzureRmResourceGroup -Name myresourcegroup -Location westus -Debug
```

Which returns many values, including the following values:

```powershell
DEBUG: ============================ HTTP RESPONSE ============================

Status Code:
Created

Headers:
Pragma                        : no-cache
x-ms-ratelimit-remaining-subscription-writes: 1199
```

In **Azure CLI**, you retrieve the header value by using the more verbose option.

```azurecli
az group list --verbose --debug
```

Which returns many values, including the following values:

```azurecli
msrest.http_logger : Response status: 200
msrest.http_logger : Response headers:
msrest.http_logger :     'Cache-Control': 'no-cache'
msrest.http_logger :     'Pragma': 'no-cache'
msrest.http_logger :     'Content-Type': 'application/json; charset=utf-8'
msrest.http_logger :     'Content-Encoding': 'gzip'
msrest.http_logger :     'Expires': '-1'
msrest.http_logger :     'Vary': 'Accept-Encoding'
msrest.http_logger :     'x-ms-ratelimit-remaining-subscription-reads': '14998'
```

To get write limits, use a write operation: 

```azurecli
az group create -n myresourcegroup --location westus --verbose --debug
```

Which returns many values, including the following values:

```azurecli
msrest.http_logger : Response status: 201
msrest.http_logger : Response headers:
msrest.http_logger :     'Cache-Control': 'no-cache'
msrest.http_logger :     'Pragma': 'no-cache'
msrest.http_logger :     'Content-Length': '163'
msrest.http_logger :     'Content-Type': 'application/json; charset=utf-8'
msrest.http_logger :     'Expires': '-1'
msrest.http_logger :     'x-ms-ratelimit-remaining-subscription-writes': '1199'
```

## Waiting before sending next request
When you reach the request limit, Resource Manager returns the **429** HTTP status code and a **Retry-After** value in the header. The **Retry-After** value specifies the number of seconds your application should wait (or sleep) before sending the next request. If you send a request before the retry value has elapsed, your request isn't processed and a new retry value is returned.

## Next steps

* For a complete PowerShell example, see [Check Resource Manager Limits for a Subscription](https://github.com/Microsoft/csa-misc-utils/tree/master/psh-GetArmLimitsViaAPI).
* For more information about limits and quotas, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
* To learn about handling asynchronous REST requests, see [Track asynchronous Azure operations](resource-manager-async-operations.md).
