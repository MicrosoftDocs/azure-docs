---
title: Understand how Azure Resource Manager throttles requests
description: Learn how Azure Resource Manager throttles requests when subscription limits are reached and how to respond.
ms.topic: conceptual
ms.date: 05/28/2025
ms.custom: devx-track-arm-template
---

# Understand how Azure Resource Manager throttles requests

This article describes how Azure Resource Manager throttles requests. It shows you how to track the number of requests that remain before reaching the limit, and how to respond when you reach the limit.

## Regional throttling and token bucket algorithm

Microsoft has migrated Azure subscriptions to an updated throttling architecture as of 2024. Throttling limits are now applied per region rather than per instance of Azure Resource Manager. This new architecture uses a [token bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket) to manage API throttling.

The token bucket represents the maximum number of requests that you can send for each second. When you reach the maximum number of requests, the refill rate determines how quickly tokens become available in the bucket.

These updated limits make it easier for you to refresh and manage your quota.

The updated limits are:

| Scope | Operations | Bucket size | Refill rate per sec |
| ----- | ---------- | ----------- | ------------------- |
| Subscription | reads | 250 | 25 |
| Subscription | deletes | 200 | 10 |
| Subscription | writes | 200 | 10  |
| Tenant | reads | 250 | 25 |
| Tenant | deletes | 200 | 10 |
| Tenant | writes | 200 | 10 |

The subscription limits apply per subscription, per service principal, and per operation type. There are also global subscription limits that are equivalent to 15 times the individual service principal limits for each operation type. The global limits apply across all service principals. Requests are throttled if the global, service principal, or tenant specific limits are exceeded.

The limits might be smaller for free or trial customers.

For example, suppose you have a bucket size of 250 tokens for read requests and refill rate of 25 tokens per second. If you send 250 read requests in a second, the bucket is empty and your requests are throttled. Each second, 25 tokens become available until the bucket reaches its maximum capacity of 250 tokens. You can use tokens as they become available.

Reading metrics using the `*/providers/microsoft.insights/metrics` API contributes significantly to overall Azure Resource Manager traffic and is a common cause of subscription throttling events. If you use this API heavily, we recommend that you switch to the `getBatch` API. You can query multiple resources in a single REST request, which improves performance and reduces throttling. For more information about converting your operations, see [How to migrate from the metrics API to the getBatch API](/azure/azure-monitor/essentials/migrate-to-batch-api).

### How can I view my throttled requests?

To view your throttled requests and other Resource Manager metrics, see [Accessing Azure Resource Manager metrics](/azure/azure-resource-manager/management/monitor-resource-manager#accessing-azure-resource-manager-metrics).

### Why is throttling per region rather than per instance?

Since different regions have a different number of Resource Manager instances, throttling per instance causes inconsistent throttling performance. Throttling per region makes throttling consistent and predictable.

### How does the updated throttling experience affect my limits?

You can send more requests. Write requests increase by 30 times. Delete requests increase by 2.4 times. Read requests increase by 7.5 times.

## Background Job Throttling

Background jobs in Azure Resource Manager (ARM) are automated tasks that run behind the scenes to support operations such as resource deployments, diagnostics, and system maintenance. These jobs are essential for processing user requests and ensuring service functionality. To maintain platform stability and reliability, ARM employs background job throttling to manage the load from these tasks.

You can identify when background job throttling occurs if you receive the following error message:

```error
The request for subscription '{0}' could not be processed due to an excessive volume of traffic. Please try again later.
```

Customers might experience throttling due to excessive background jobs, which can be triggered by high-frequency operations or system-wide activities. While customers do not have direct control over the creation or execution of these jobs, awareness of potential throttling is important.

## Throttling for non-public clouds

Throttling happens at two levels. Azure Resource Manager throttles requests for the subscription and tenant. If the request is under the throttling limits for the subscription and tenant, Resource Manager routes the request to the resource provider. The resource provider applies throttling limits that are tailored to its operations.

Requests are initially throttled per principal ID and per Azure Resource Manager instance in the region of the user sending the request. Requests to the Azure Resource Manager instance in the region are also throttled per principal user ID and per hour. When the request is forwarded to the resource provider, requests are throttled per region of the resource rather than per Azure Resource Manager instance in region of the user. 

> [!NOTE]
> The limits of a resource provider can differ from the limits of the Azure Resource Manager instance in the region of the user.

The following image shows how throttling is applied as a request goes from the user to Azure Resource Manager and the resource provider. 

:::image type="content" source="./media/request-limits-and-throttling/request-throttling.svg" alt-text="Diagram that shows how throttling is applied as a request goes from the user to Azure Resource Manager and the resource provider.":::

## Subscription and tenant limits

Every subscription-level and tenant-level operation is subject to throttling limits. Subscription requests are ones that involve passing your subscription ID, such as retrieving the resource groups in your subscription. For example, sending a request to `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups?api-version=2022-01-01` is a subscription-level operation. Tenant requests don't include your subscription ID, such as retrieving valid Azure locations. For example, sending a request to `https://management.azure.com/tenants?api-version=2022-01-01` is a tenant-level operation.

The default throttling limits per hour are shown in the following table.

| Scope | Operations | Limit |
| ----- | ---------- | ------- |
| Subscription | reads | 12,000 |
| Subscription | deletes | 15,000 |
| Subscription | writes | 1,200 |
| Tenant | reads | 12,000 |
| Tenant | writes | 1,200 |

These limits are scoped to the security principal (user or application) making the requests and the subscription ID or tenant ID. If your requests come from more than one security principal, your limit across the subscription or tenant is greater than 12,000 and 1,200 per hour.

These limits apply to each Azure Resource Manager instance. There are multiple instances in every Azure region, and Azure Resource Manager is deployed to all Azure regions. So, in practice, the limits are higher than these limits. Different instances of Azure Resource Manager usually handle the user's requests.

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
| write / delete (PUT) | 1,000 per 5 minutes |
| read (GET) | 10,000 per 5 minutes |

In addition to those general limits, see the [usage limits for Azure DNS](/azure/dns/dns-faq#what-are-the-usage-limits-for-azure-dns-).

### Compute throttling

Microsoft Compute implements throttling to provide an optimal experience for Virtual Machine and Virtual Machine Scale Set users. [Compute Throttling Limits](/azure/virtual-machines/compute-throttling-limits) provides comprehensive information on throttling policies and limits for VM, Virtual Machine Scale Sets, and Scale Set VMs.

### Azure Resource Graph throttling

[Azure Resource Graph](../../governance/resource-graph/overview.md) limits the number of requests to its operations. The steps in this article to determine the remaining requests and how to respond when the limit is reached also apply to Resource Graph. However, Resource Graph sets its own limit and reset rate. For more information, see [Resource Graph throttling headers](../../governance/resource-graph/concepts/guidance-for-throttled-requests.md#understand-throttling-headers).

Azure Resource Graph also has a solution that enables an additional mechanism for getting resource data when you have reached resource provider throttling limits by seamlessly integrating with existing Azure Resource Manager control plane GET and LIST APIs—offering a powerful, scalable solution for resource data access. For more information, see [ARG GET/LIST API](../../governance/resource-graph/concepts/arg-get-list-api.md)


### Other resource providers

For information about throttling in other resource providers, see:

* [Azure Key Vault throttling guidance](/azure/key-vault/general/overview-throttling)
* [AKS troubleshooting](/azure/aks/troubleshooting#im-receiving-429---too-many-requests-errors)
* [Managed identities](../../active-directory/managed-identities-azure-resources/managed-identities-faq.md#are-there-any-rate-limits-that-apply-to-managed-identities)

## Error code

When you reach the limit, you receive the HTTP status code **429 Too many requests**. The response includes a **Retry-After** value, which specifies the number of seconds your application should wait before sending the next request. If you send a request before the retry value elapses, your request isn't processed and a new retry value is returned.

If you're using an Azure SDK, the SDK might have an auto retry configuration. For more information, see [Retry guidance for Azure services](/azure/architecture/best-practices/retry-service-specific).

Some resource providers return 429 to report a temporary problem. The problem could be an overload condition that your request didn't cause. Or, it could be a temporary error about the state of the target resource or dependent resource. For example, the network resource provider returns 429 with the **RetryableErrorDueToAnotherOperation** error code when another operation locks the target resource. To determine if the error comes from throttling or a temporary condition, view the error details in the response.

## Remaining requests

You can determine the number of remaining requests by examining response headers. Read requests return a value in the header for the number of remaining read requests. Write requests include a value for the number of remaining write requests. The following table describes the response headers you can examine for those values:

| Response header | Description |
| --- | --- |
| x-ms-ratelimit-remaining-subscription-deletes |Subscription scoped deletes remaining. This value is returned on delete operations. |
| x-ms-ratelimit-remaining-subscription-reads |Subscription scoped reads remaining. This value is returned on read operations. |
| x-ms-ratelimit-remaining-subscription-writes |Subscription scoped writes remaining. This value is returned on write operations. |
| x-ms-ratelimit-remaining-tenant-reads |Tenant scoped reads remaining. |
| x-ms-ratelimit-remaining-tenant-writes |Tenant scoped writes remaining. |
| x-ms-ratelimit-remaining-subscription-resource-requests |Remaining subscription scoped resource type requests.<br /><br />This header value is returned only if a service overrides the default limit. Resource Manager adds this value instead of the subscription reads or writes. |
| x-ms-ratelimit-remaining-subscription-resource-entities-read |Remaining subscription scoped resource type collection requests.<br /><br />This header value is returned only if a service overrides the default limit. This value provides the number of remaining collection requests (list resources). |
| x-ms-ratelimit-remaining-tenant-resource-requests |Remaining tenant scoped resource type requests.<br /><br />This header is added for requests at tenant level and only if a service overrides the default limit. Resource Manager adds this value instead of the tenant reads or writes. |
| x-ms-ratelimit-remaining-tenant-resource-entities-read |Tenant scoped resource type collection requests remaining.<br /><br />This header is only added for requests at tenant level and only if a service overrides the default limit. |

The resource provider can also return response headers with information about remaining requests. For information about response headers returned by the Compute resource provider, see [Call rate informational response headers](/troubleshoot/azure/virtual-machines/troubleshooting-throttling-errors#call-rate-informational-response-headers).

## Retrieving the header values

Retrieving these header values in your code or script is no different than retrieving any header value.

For example, in **C#**, you retrieve the header value from an **HttpWebResponse** object named **response** with the following code:

```cs
response.Headers.GetValues("x-ms-ratelimit-remaining-subscription-reads").GetValue(0)
```

In **PowerShell**, retrieve the header value from an `Invoke-WebRequest` operation.

```powershell
$r = Invoke-WebRequest -Uri https://management.azure.com/subscriptions/{guid}/resourcegroups?api-version=2016-09-01 -Method GET -Headers $authHeaders
$r.Headers["x-ms-ratelimit-remaining-subscription-reads"]
```

For a complete PowerShell example, see [Check ARM Limits for a Given Subscription](https://github.com/Microsoft/csa-misc-utils/tree/master/psh-GetArmLimitsViaAPI).

To see the remaining requests for debugging, provide the **-Debug** parameter on your **PowerShell** cmdlet.

```powershell
Get-AzResourceGroup -Debug
```

The response includes many values, including the following response value:

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

The response includes many values, including the following values:

```output
DEBUG: ============================ HTTP RESPONSE ============================

Status Code:
Created

Headers:
Pragma                        : no-cache
x-ms-ratelimit-remaining-subscription-writes: 1199
```

In **Azure CLI**, you use the more verbose option to retrieve the header value:

```azurecli
az group list --verbose --debug
```

The command returns many values, including the following values:

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

The operation returns many values, including the following values:

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

* For more information about limits and quotas, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
* To learn about handling asynchronous REST requests, see [Track asynchronous Azure operations](async-operations.md).
