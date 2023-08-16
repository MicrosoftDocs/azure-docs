---
title: Request limits and throttling
description: Describes how to use throttling with Azure Resource Manager requests when subscription limits have been reached.
ms.topic: conceptual
ms.date: 03/02/2023
ms.custom: seodec18, devx-track-arm-template
---
# Throttling Resource Manager requests

This article describes how Azure Resource Manager throttles requests. It shows you how to track the number of requests that remain before reaching the limit, and how to respond when you've reached the limit.

Throttling happens at two levels. Azure Resource Manager throttles requests for the subscription and tenant. If the request is under the throttling limits for the subscription and tenant, Resource Manager routes the request to the resource provider. The resource provider applies throttling limits that are tailored to its operations.

The following image shows how throttling is applied as a request goes from the user to Azure Resource Manager and the resource provider. The image shows that requests are initially throttled per principal ID and per Azure Resource Manager instance in the region of the user sending the request. The requests are throttled per hour. When the request is forwarded to the resource provider, requests are throttled per region of the resource rather than per Azure Resource Manager instance in region of the user. The resource provider requests are also throttled per principal user ID and per hour.

:::image type="content" source="./media/request-limits-and-throttling/request-throttling.svg" alt-text="Diagram that shows how throttling is applied as a request goes from the user to Azure Resource Manager and the resource provider.":::

## Subscription and tenant limits

Every subscription-level and tenant-level operation is subject to throttling limits. Subscription requests are ones that involve passing your subscription ID, such as retrieving the resource groups in your subscription. Tenant requests don't include your subscription ID, such as retrieving valid Azure locations.

The default throttling limits per hour are shown in the following table.

| Scope | Operations | Limit |
| ----- | ---------- | ------- |
| Subscription | reads | 12000 |
| Subscription | deletes | 15000 |
| Subscription | writes | 1200 |
| Tenant | reads | 12000 |
| Tenant | writes | 1200 |

These limits are scoped to the security principal (user or application) making the requests and the subscription ID or tenant ID. If your requests come from more than one security principal, your limit across the subscription or tenant is greater than 12,000 and 1,200 per hour.

These limits apply to each Azure Resource Manager instance. There are multiple instances in every Azure region, and Azure Resource Manager is deployed to all Azure regions.  So, in practice, the limits are higher than these limits. The requests from a user are usually handled by different instances of Azure Resource Manager.

The remaining requests are returned in the [response header values](#remaining-requests).

## Resource provider limits

Resource providers apply their own throttling limits. Within each subscription, the resource provider throttles per region of the resource in the request. Because Resource Manager throttles by instance of Resource Manager, and there are several instances of Resource Manager in each region, the resource provider might receive more requests than the default limits in the previous section.

This section discusses the throttling limits of some widely used resource providers.

### Storage throttling

[!INCLUDE [azure-storage-limits-azure-resource-manager](../../../includes/azure-storage-limits-azure-resource-manager.md)]

### Network throttling

The Microsoft.Network resource provider applies the following throttle limits:

| Operation | Limit |
| --------- | ----- |
| write / delete (PUT) | 1000 per 5 minutes |
| read (GET) | 10000 per 5 minutes |

> [!NOTE]
> **Azure DNS** and **Azure Private DNS** have a throttle limit of 500 read (GET) operations per 5 minutes.
>

### Compute throttling

For information about throttling limits for compute operations, see [Troubleshooting API throttling errors - Compute](/troubleshoot/azure/virtual-machines/troubleshooting-throttling-errors).

For checking virtual machine instances within a Virtual Machine Scale Set, use the [Virtual Machine Scale Sets operations](/rest/api/compute/virtualmachinescalesetvms). For example, use the [Virtual Machine Scale Set VMs - List](/rest/api/compute/virtualmachinescalesetvms/list) with parameters to check the power state of virtual machine instances. This API reduces the number of requests.

### Azure Resource Graph throttling

[Azure Resource Graph](../../governance/resource-graph/overview.md) limits the number of requests to its operations. The steps in this article to determine the remaining requests and how to respond when the limit is reached also apply to Resource Graph. However, Resource Graph sets its own limit and reset rate. For more information, see [Resource Graph throttling headers](../../governance/resource-graph/concepts/guidance-for-throttled-requests.md#understand-throttling-headers).

### Other resource providers

For information about throttling in other resource providers, see:

* [Azure Key Vault throttling guidance](../../key-vault/general/overview-throttling.md)
* [AKS troubleshooting](../../aks/troubleshooting.md#im-receiving-429---too-many-requests-errors)
* [Managed identities](../../active-directory/managed-identities-azure-resources/managed-identities-faq.md#are-there-any-rate-limits-that-apply-to-managed-identities)

## Error code

When you reach the limit, you receive the HTTP status code **429 Too many requests**. The response includes a **Retry-After** value, which specifies the number of seconds your application should wait (or sleep) before sending the next request. If you send a request before the retry value has elapsed, your request isn't processed and a new retry value is returned.

After waiting for specified time, you can also close and reopen your connection to Azure. By resetting the connection, you may connect to a different instance of Azure Resource Manager.

If you're using an Azure SDK, the SDK may have an auto retry configuration. For more information, see [Retry guidance for Azure services](/azure/architecture/best-practices/retry-service-specific).

Some resource providers return 429 to report a temporary problem. The problem could be an overload condition that isn't directly caused by your request. Or, it could represent a temporary error about the state of the target resource or dependent resource. For example, the network resource provider returns 429 with the **RetryableErrorDueToAnotherOperation** error code when the target resource is locked by another operation. To determine if the error comes from throttling or a temporary condition, view the error details in the response.

## Remaining requests

You can determine the number of remaining requests by examining response headers. Read requests return a value in the header for the number of remaining read requests. Write requests include a value for the number of remaining write requests. The following table describes the response headers you can examine for those values:

| Response header | Description |
| --- | --- |
| x-ms-ratelimit-remaining-subscription-deletes |Subscription scoped deletes remaining. This value is returned on delete operations. |
| x-ms-ratelimit-remaining-subscription-reads |Subscription scoped reads remaining. This value is returned on read operations. |
| x-ms-ratelimit-remaining-subscription-writes |Subscription scoped writes remaining. This value is returned on write operations. |
| x-ms-ratelimit-remaining-tenant-reads |Tenant scoped reads remaining |
| x-ms-ratelimit-remaining-tenant-writes |Tenant scoped writes remaining |
| x-ms-ratelimit-remaining-subscription-resource-requests |Subscription scoped resource type requests remaining.<br /><br />This header value is only returned if a service has overridden the default limit. Resource Manager adds this value instead of the subscription reads or writes. |
| x-ms-ratelimit-remaining-subscription-resource-entities-read |Subscription scoped resource type collection requests remaining.<br /><br />This header value is only returned if a service has overridden the default limit. This value provides the number of remaining collection requests (list resources). |
| x-ms-ratelimit-remaining-tenant-resource-requests |Tenant scoped resource type requests remaining.<br /><br />This header is only added for requests at tenant level, and only if a service has overridden the default limit. Resource Manager adds this value instead of the tenant reads or writes. |
| x-ms-ratelimit-remaining-tenant-resource-entities-read |Tenant scoped resource type collection requests remaining.<br /><br />This header is only added for requests at tenant level, and only if a service has overridden the default limit. |

The resource provider can also return response headers with information about remaining requests. For information about response headers returned by the Compute resource provider, see [Call rate informational response headers](/troubleshoot/azure/virtual-machines/troubleshooting-throttling-errors#call-rate-informational-response-headers).

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
Get-AzResourceGroup -Debug
```

Which returns many values, including the following response value:

```output
DEBUG: ============================ HTTP RESPONSE ============================

Status Code:
OK

Headers:
Pragma                        : no-cache
x-ms-ratelimit-remaining-subscription-reads: 11999
```

To get write limits, use a write operation: 

```powershell
New-AzResourceGroup -Name myresourcegroup -Location westus -Debug
```

Which returns many values, including the following values:

```output
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

```output
msrest.http_logger : Response status: 200
msrest.http_logger : Response headers:
msrest.http_logger :     'Cache-Control': 'no-cache'
msrest.http_logger :     'Pragma': 'no-cache'
msrest.http_logger :     'Content-Type': 'application/json; charset=utf-8'
msrest.http_logger :     'Content-Encoding': 'gzip'
msrest.http_logger :     'Expires': '-1'
msrest.http_logger :     'Vary': 'Accept-Encoding'
msrest.http_logger :     'x-ms-ratelimit-remaining-subscription-reads': '11998'
```

To get write limits, use a write operation: 

```azurecli
az group create -n myresourcegroup --location westus --verbose --debug
```

Which returns many values, including the following values:

```output
msrest.http_logger : Response status: 201
msrest.http_logger : Response headers:
msrest.http_logger :     'Cache-Control': 'no-cache'
msrest.http_logger :     'Pragma': 'no-cache'
msrest.http_logger :     'Content-Length': '163'
msrest.http_logger :     'Content-Type': 'application/json; charset=utf-8'
msrest.http_logger :     'Expires': '-1'
msrest.http_logger :     'x-ms-ratelimit-remaining-subscription-writes': '1199'
```

## Next steps

* For a complete PowerShell example, see [Check Resource Manager Limits for a Subscription](https://github.com/Microsoft/csa-misc-utils/tree/master/psh-GetArmLimitsViaAPI).
* For more information about limits and quotas, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
* To learn about handling asynchronous REST requests, see [Track asynchronous Azure operations](async-operations.md).
