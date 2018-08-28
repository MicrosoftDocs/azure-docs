---
title: Provider resource usage API | Microsoft Docs
description: Reference for the resource usage API, which retrieves Azure Stack usage information
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/24/2018
ms.author: mabrigg
ms.reviewer: alfredop

---
# Provider resource usage API
The term *provider* applies to the service administrator and to any delegated providers. Azure Stack operators and delegated providers can use the provider usage API to view the usage of their direct tenants. For example, as shown in the diagram, P0 can call the provider API to get usage information on P1's and P2's direct usage, and P1 can call for usage information on P3 and P4.

![Conceptual model of the provider hierarchy](media/azure-stack-provider-resource-api/image1.png)

## API call reference
### Request
The request gets consumption details for the requested subscriptions and for the requested time frame. There is no request body.

This usage API is a provider API, so the caller must be assigned an Owner, Contributor, or Reader role in the provider’s subscription.

| **Method** | **Request URI** |
| --- | --- |
| GET |https://{armendpoint}/subscriptions/{subId}/providers/Microsoft.Commerce.Admin/subscriberUsageAggregates?reportedStartTime={reportedStartTime}&reportedEndTime={reportedEndTime}&aggregationGranularity={granularity}&subscriberId={sub1.1}&api-version=2015-06-01-preview&continuationToken={token-value} |

### Arguments
| **Argument** | **Description** |
| --- | --- |
| *armendpoint* |Azure Resource Manager endpoint of your Azure Stack environment. The Azure Stack convention is that the name of the Azure Resource Manager endpoint is in the format `https://adminmanagement.{domain-name}`. For example, for the development kit, if the domain name is *local.azurestack.external*, then the Resource Manager endpoint is `https://adminmanagement.local.azurestack.external`. |
| *subId* |Subscription ID of the user who makes the call. |
| *reportedStartTime* |Start time of the query. The value for *DateTime* should be in Coordinated Universal Time (UTC) and at the beginning of the hour, for example, 13:00. For daily aggregation, set this value to UTC midnight. The format is *escaped* ISO 8601. For example, *2015-06-16T18%3a53%3a11%2b00%3a00Z*, where the colon is escaped to *%3a* and the plus is escaped to *%2b* so that it's URI friendly. |
| *reportedEndTime* |End time of the query. The constraints that apply to *reportedStartTime* also apply to this argument. The value for *reportedEndTime* can't be in the future or the current date. If it is, the result is set to "processing not complete." |
| *aggregationGranularity* |Optional parameter that has two discrete potential values: daily and hourly. As the values suggest, one returns the data in daily granularity, and the other is an hourly resolution. The daily option is the default. |
| *subscriberId* |Subscription ID. To get filtered data, the subscription ID of a direct tenant of the provider is required. If no subscription ID parameter is specified, the call returns usage data for all the provider’s direct tenants. |
| *api-version* |Version of the protocol that's used to make this request. This value is set to *2015-06-01-preview*. |
| *continuationToken* |Token retrieved from the last call to the usage API provider. This token is needed when a response is greater than 1,000 lines and it acts as a bookmark for the progress. If the token is not present, the data is retrieved from the beginning of the day or hour, based on the granularity passed in. |

### Response
GET
/subscriptions/sub1/providers/Microsoft.Commerce.Admin/subscriberUsageAggregates?reportedStartTime=reportedStartTime=2014-05-01T00%3a00%3a00%2b00%3a00&reportedEndTime=2015-06-01T00%3a00%3a00%2b00%3a00&aggregationGranularity=Daily&subscriberId=sub1.1&api-version=1.0

```json
{
"value": [
{

"id":
"/subscriptions/sub1.1/providers/Microsoft.Commerce.Admin/UsageAggregate/sub1.1-

meterID1",
"name": "sub1.1-meterID1",
"type": "Microsoft.Commerce.Admin/UsageAggregate",

"properties": {
"subscriptionId":"sub1.1",
"usageStartTime": "2015-03-03T00:00:00+00:00",
"usageEndTime": "2015-03-04T00:00:00+00:00",
"instanceData":"{\"Microsoft.Resources\":{\"resourceUri\":\"resourceUri1\",\"location\":\"Alaska\",\"tags\":null,\"additionalInfo\":null}}",
"quantity":2.4000000000,
"meterId":"meterID1"

}
},

…
```

### Response details
| **Argument** | **Description** |
| --- | --- |
| *id* |Unique ID of the usage aggregate. |
| *name* |Name of the usage aggregate. |
| *type* |Resource definition. |
| *subscriptionId* |Subscription identifier of the Azure Stack user. |
| *usageStartTime* |UTC start time of the usage bucket to which this usage aggregate belongs.|
| *usageEndTime* |UTC end time of the usage bucket to which this usage aggregate belongs. |
| *instanceData* |Key-value pairs of instance details (in a new format):<br> *resourceUri*: Fully qualified resource ID, which includes the resource groups and the instance name. <br> *location*: Region in which this service was run. <br> *tags*: Resource tags that are specified by the user. <br> *additionalInfo*: More details about the resource that was consumed, for example, the OS version or image type. |
| *quantity* |Amount of resource consumption that occurred in this time frame. |
| *meterId* |Unique ID for the resource that was consumed (also called *ResourceID*). |


## Retrieve usage information

### PowerShell

To generate the usage data, you should have resources that are running and actively using the system, For example, an active virtual machine, or a storage account containing some data etc. If you’re not sure whether you have any resources running in Azure Stack Marketplace, deploy a virtual machine (VM), and verify the VM monitoring blade to make sure it’s running. Use the following PowerShell cmdlets to view the usage data:

1. [Install PowerShell for Azure Stack.](azure-stack-powershell-install.md)
2. [Configure the Azure Stack user's](user/azure-stack-powershell-configure-user.md) or the [Azure Stack operator's](azure-stack-powershell-configure-admin.md) PowerShell environment 
3. To retrieve the usage data, use the [Get-UsageAggregates](/powershell/module/azurerm.usageaggregates/get-usageaggregates) PowerShell cmdlet:
```powershell
Get-UsageAggregates -ReportedStartTime "<Start time for usage reporting>" -ReportedEndTime "<end time for usage reporting>" -AggregationGranularity <Hourly or Daily>
```
### REST API

You can collect usage information for deleted subscriptions by calling the  Microsoft.Commerce.Admin service. 

**To return all tenant usage for deleted for active users:**

| **Method** | **Request URI** |
| --- | --- |
| GET | https://{armendpoint}/subscriptions/{subId}/providersMicrosoft.Commerce.Admin/subscriberUsageAggregates?reportedStartTime={start-time}&reportedEndTime={end-endtime}&aggregationGranularity=Hourly&api-version=2015-06-01-preview |

**To return the usage for deleted or active tenant:**

| **Method** | **Request URI** |
| --- | --- |
| GET |https://{armendpoint}/subscriptions/{subId}/providersMicrosoft.Commerce.Admin/subscriberUsageAggregates?reportedStartTime={start-time}&reportedEndTime={end-endtime}&aggregationGranularity=Hourly&subscriberId={subscriber-id}&api-version=2015-06-01-preview |


## Next steps
[Tenant resource usage API reference](azure-stack-tenant-resource-usage-api.md)

[Usage-related FAQ](azure-stack-usage-related-faq.md)
