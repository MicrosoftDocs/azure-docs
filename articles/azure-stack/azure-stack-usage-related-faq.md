---
title: Usage API related FAQs | Microsoft Docs
description: List of Azure Stack meters, comparison to Azure usage API, Usage Time and Reported Time, error codes.
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
ms.date: 09/27/2018
ms.author: mabrigg
ms.reviewer: alfredop

---

# Frequently asked questions in Azure Stack usage API

This article answers some frequently asked questions about the Azure Stack Usage API.

## What meter IDs can I see?
Usage is reported for the following resource providers:

### Network
  
**Meter ID**: F271A8A388C44D93956A063E1D2FA80B  
**Meter name**: Static IP Address Usage  
**Unit**: IP addresses  
**Notes**: Count of IP addresses used. If you call the usage API with a daily granularity, the meter returns IP address multiplied by the number of hours.  
  
**Meter ID**: 9E2739BA86744796B465F64674B822BA  
**Meter name**: Dynamic IP Address Usage  
**Unit**: IP addresses  
**Notes**: Count of IP addresses used. If you call the usage API with a daily granularity, the meter returns IP address multiplied by the number of hours.  
  
### Storage
  
**Meter ID**: B4438D5D-453B-4EE1-B42A-DC72E377F1E4  
**Meter name**: TableCapacity  
**Unit**: GB\*hours  
**Notes**: Total capacity consumed by tables.  
  
**Meter ID**: B5C15376-6C94-4FDD-B655-1A69D138ACA3  
**Meter name**: PageBlobCapacity  
**Unit**: GB\*hours  
**Notes**: Total capacity consumed by page blobs.  
  
**Meter ID**: B03C6AE7-B080-4BFA-84A3-22C800F315C6  
**Meter name**: QueueCapacity  
**Unit**: GB\*hours  
**Notes**: Total capacity consumed by queue.  
  
**Meter ID**: 09F8879E-87E9-4305-A572-4B7BE209F857  
**Meter name**: BlockBlobCapacity  
**Unit**: GB\*hours  
**Notes**: Total capacity consumed by block blobs.  
  
**Meter ID**: B9FF3CD0-28AA-4762-84BB-FF8FBAEA6A90  
**Meter name**: TableTransactions  
**Unit**: Request count in 10,000's  
**Notes**: Table service requests (in 10,000s).  
  
**Meter ID**: 50A1AEAF-8ECA-48A0-8973-A5B3077FEE0D  
**Meter name**: TableDataTransIn  
**Unit**: Ingress data in GB  
**Notes**: Table service data ingress in GB.  
  
**Meter ID**: 1B8C1DEC-EE42-414B-AA36-6229CF199370  
**Meter name**: TableDataTransOut  
**Unit**: Egress in GB  
**Notes**: Table service data egress in GB  
  
**Meter ID**: 43DAF82B-4618-444A-B994-40C23F7CD438  
**Meter name**: BlobTransactions  
**Unit**: Requests count in 10,000's  
**Notes**: Blob service requests (in 10,000s).  
  
**Meter ID**: 9764F92C-E44A-498E-8DC1-AAD66587A810  
**Meter name**: BlobDataTransIn  
**Unit**: Ingress data in GB  
**Notes**: Blob service data ingress in GB.  
  
**Meter ID**: 3023FEF4-ECA5-4D7B-87B3-CFBC061931E8  
**Meter name**: BlobDataTransOut  
**Unit**: Egress in GB  
**Notes**: Blob service data egress in GB.  
  
**Meter ID**: EB43DD12-1AA6-4C4B-872C-FAF15A6785EA  
**Meter name**: QueueTransactions  
**Unit**: Requests count in 10,000's  
**Notes**: Queue service requests (in 10,000s).  
  
**Meter ID**: E518E809-E369-4A45-9274-2017B29FFF25  
**Meter name**: QueueDataTransIn  
**Unit**: Ingress data in GB  
**Notes**: Queue service data ingress in GB.  
  
**Meter ID**: DD0A10BA-A5D6-4CB6-88C0-7D585CEF9FC2  
**Meter name**: QueueDataTransOut  
**Unit**: Egress in GB  
**Notes**: Queue service data egress in GB  

### Compute 
  
**Meter ID**: FAB6EB84-500B-4A09-A8CA-7358F8BBAEA5  
**Meter name**: Base VM Size Hours  
**Unit**: Virtual core hours  
**Notes**: Number of virtual cores multiplied by the hours the VM ran.  
  
**Meter ID**: 9CD92D4C-BAFD-4492-B278-BEDC2DE8232A  
**Meter name**: Windows VM Size Hours  
**Unit**: Virtual core hours  
**Notes**: Number of virtual cores multiplied by hours the VM ran.  
  
**Meter ID**: 6DAB500F-A4FD-49C4-956D-229BB9C8C793  
**Meter name**: VM size hours  
**Unit**: VM hours  
**Notes**: Captures both Base and Windows VM. Does not adjust for cores.  
  
### Managed Disks

**Meter ID**: 5d76e09f-4567-452a-94cc-7d1f097761f0   
**Meter name**: S4   
**Unit**: Count of Disks   
**Notes**: Standard Managed Disk – 32 GB 

**Meter ID**: dc9fc6a9-0782-432a-b8dc-978130457494   
**Meter name**: S6   
**Unit**: Count of Disks   
**Notes**: Standard Managed Disk – 64 GB 

**Meter ID**: e5572fce-9f58-49d7-840c-b168c0f01fff   
**Meter name**: S10   
**Unit**: Count of Disks   
**Notes**: Standard Managed Disk – 128 GB 

**Meter ID**: 9a8caedd-1195-4cd5-80b4-a4c22f9302b8   
**Meter name**: S15   
**Unit**: Count of Disks   
**Notes**: Standard Managed Disk – 256 GB 

**Meter ID**: 5938f8da-0ecd-4c48-8d5a-c7c6c23546be   
**Meter name**: S20   
**Unit**: Count of Disks      
**Notes**: Standard Managed Disk – 512 GB 

**Meter ID**: 7705a158-bd8b-4b2b-b4c2-0782343b81e6   
**Meter name**: S30   
**Unit**: Count of Disks   
**Notes**: Standard Managed Disk – 1024 GB 

**Meter ID**: d9aac1eb-a5d1-42f2-b617-9e3ea94fed88   
**Meter name**: S40   
**Unit**: Count of Disks   
**Notes**: Standard Managed Disk – 2048 GB 

**Meter ID**: a54899dd-458e-4a40-9abd-f57cafd936a7   
**Meter name**: S50   
**Unit**: Count of Disks   
**Notes**: Standard Managed Disk – 4096 GB 

**Meter ID**: 5c105f5f-cbdf-435c-b49b-3c7174856dcc   
**Meter name**: P4   
**Unit**: Count of Disks   
**Notes**: Premium Managed Disk – 32 GB 

**Meter ID**: 518b412b-1927-4f25-985f-4aea24e55c4f   
**Meter name**: P6   
**Unit**: Count of Disks   
**Notes**: Premium Managed Disk – 64 GB 

**Meter ID**: 5cfb1fed-0902-49e3-8217-9add946fd624   
**Meter name**: P10   
**Unit**: Count of Disks   
**Notes**: Premium Managed Disk – 128 GB  

**Meter ID**: 8de91c94-f740-4d9a-b665-bd5974fa08d4   
**Meter name**: P15  
**Unit**: Count of Disks   
**Notes**: Premium Managed Disk – 256 GB 

**Meter ID**: c7e7839c-293b-4761-ae4c-848eda91130b   
**Meter name**: P20   
**Unit**: Count of Disks   
**Notes**: Premium Managed Disk – 512 GB 

**Meter ID**: 9f502103-adf4-4488-b494-456c95d23a9f   
**Meter name**: P30   
**Unit**: Count of Disks   
**Notes**: Premium Managed Disk – 1024 GB 

**Meter ID**: 043757fc-049f-4e8b-8379-45bb203c36b1   
**Meter name**: P40   
**Unit**: Count of Disks    
**Notes**: Premium Managed Disk – 2048 GB 

**Meter ID**: c0342c6f-810b-4942-85d3-6eaa561b6570   
**Meter name**: P50   
**Unit**: Count of Disks   
**Notes**: Premium Managed Disk – 4096 GB 

**Meter ID**: 8a409390-1913-40ae-917b-08d0f16f3c38   
**Meter name**: ActualStandardDiskSize   
**Unit**: Byte      
**Notes**: The actual size on disk of standard managed disk  

**Meter ID**: 1273b16f-8458-4c34-8ce2-a515de551ef6  
**Meter name**: ActualPremiumDiskSize   
**Unit**: Byte      
**Notes**: The actual size on disk of premium managed disk 

**Meter ID**: 89009682-df7f-44fe-aeb1-63fba3ddbf4c  
**Meter name**: ActualStandardSnapshotSize   
**Unit**: Byte   
**Notes**: The actual size on disk of managed standard snapshot.  

**Meter ID**: 95b0c03f-8a82-4524-8961-ccfbf575f536   
**Meter name**: ActualPremiumSnapshotSize   
**Unit**: Byte   
**Notes**: The actual size on disk of managed premium.   

### Sql RP
  
**Meter ID**: CBCFEF9A-B91F-4597-A4D3-01FE334BED82  
**Meter name**: DatabaseSizeHourSqlMeter  
**Unit**: MB\*hours  
**Notes**: Total DB capacity at creation. If you call the usage API with a daily granularity, the meter returns MB multiplied by the number of hours.  
  
### MySql RP   
  
**Meter ID**: E6D8CFCD-7734-495E-B1CC-5AB0B9C24BD3  
**Meter name**: DatabaseSizeHourMySqlMeter  
**Unit**: MB\*hours  
**Notes**: Total DB capacity at creation. If you call the usage API with a daily granularity, the meter returns MB multiplied by the number of hours.    
### Key Vault   
  
**Meter ID**: EBF13B9F-B3EA-46FE-BF54-396E93D48AB4  
**Meter name**: Key Vault transactions  
**Unit**: Request count in 10,000's  
**Notes**: Number of REST API requests received by Key Vault data plane.  
  
**Meter ID**: 2C354225-B2FE-42E5-AD89-14F0EA302C87  
**Meter name**: Advanced keys transactions  
**Unit**:  10K transactions  
**Notes**: RSA 3K/4K, ECC key transactions. (preview).  
  
### App service   
  
**Meter ID**: 190C935E-9ADA-48FF-9AB8-56EA1CF9ADAA  
**Meter name**: App Service  
**Unit**: Virtual core hours  
**Notes**: Number of virtual cores used to run app service. Note: Microsoft uses this meter to charge the App Service on Azure Stack. Cloud Service Providers can use the other App Service meters (below) to calculate usage for their tenants.  
  
**Meter ID**: 67CC4AFC-0691-48E1-A4B8-D744D1FEDBDE  
**Meter name**: Functions Requests  
**Unit**: 10 Requests  
**Notes**: Total number of requested executions (per 10 executions). Executions are counted each time a function runs in response to an event, or is triggered by a binding.  
  
**Meter ID**: D1D04836-075C-4F27-BF65-0A1130EC60ED  
**Meter name**: Functions - Compute  
**Unit**:  GB-s  
**Notes**:  Resource consumption measured in gigabyte seconds (GB/s). **Observed resource consumption** is calculated by multiplying average memory size in GB by the time in milliseconds it takes to execute the function. Memory used by a function is measured by rounding up to the nearest 128 MB, up to the maximum memory size of 1,536 MB, with execution time calculated by rounding up to the nearest 1 ms. The minimum execution time and memory for a single function execution is 100 ms and 128 mb respectively.  
  
**Meter ID**: 957E9F36-2C14-45A1-B6A1-1723EF71A01D  
**Meter name**: Shared App Service Hours  
**Unit**: 1 hour  
**Notes**: Per hour usage of shard App Service Plan. Plans are metered on a per App basis.  
  
**Meter ID**: 539CDEC7-B4F5-49F6-AAC4-1F15CFF0EDA9  
**Meter name**: Free App Service Hours  
**Unit**: 1 hour  
**Notes**: Per hour usage of free App Service Plan. Plans are metered on a per App basis.  
  
**Meter ID**: 88039D51-A206-3A89-E9DE-C5117E2D10A6  
**Meter name**: Small Standard App Service Hours  
**Unit**: 1 hour  
**Notes**: Calculated based on size and number of instances.  
  
**Meter ID**: 83A2A13E-4788-78DD-5D55-2831B68ED825  
**Meter name**: Medium Standard App Service Hours  
**Unit**: 1 hour  
**Notes**: Calculated based on size and number of instances.  
  
**Meter ID**: 1083B9DB-E9BB-24BE-A5E9-D6FDD0DDEFE6  
**Meter name**: Large Standard App Service Hours  
**Unit**: 1 hour  
**Notes**: Calculated based on size and number of instances.  
  
### Custom Worker Tiers   
  
**Meter ID**: *Custom Worker Tiers*  
**Meter name**: Custom Worker Tiers  
**Unit**: Hours  
**Notes**: Deterministic meter ID is created based on SKU and custom worker tier name. This meter ID is unique for each custom worker tier.  
  
**Meter ID**: 264ACB47-AD38-47F8-ADD3-47F01DC4F473  
**Meter name**: SNI SSL  
**Unit**: Per SNI SSL Binding  
**Notes**: App Service supports two types of SSL connections: Server Name Indication (SNI) SSL Connections and IP Address SSL Connections. SNI-based SSL works on modern browsers while IP-based SSL works on all browsers.  
  
**Meter ID**: 60B42D72-DC1C-472C-9895-6C516277EDB4  
**Meter name**: IP SSL  
**Unit**: Per IP Based SSL Binding  
**Notes**: App Service supports two types of SSL connections: Server Name Indication (SNI) SSL Connections and IP Address SSL Connections. SNI-based SSL works on modern browsers while IP-based SSL works on all browsers.  
  
**Meter ID**: 73215A6C-FA54-4284-B9C1-7E8EC871CC5B  
**Meter name**:  Web Process  
**Unit**:  
**Notes**: Calculated per active site per hour.  
  
**Meter ID**: 5887D39B-0253-4E12-83C7-03E1A93DFFD9  
**Meter name**: External Egress Bandwidth  
**Unit**: GB  
**Notes**: Total incoming request response bytes + total outgoing request bytes + total incoming FTP request response bytes + total incoming web deploy request response bytes.  
  

## How do the Azure Stack usage APIs compare to the [Azure usage API](https://docs.microsoft.com/azure/billing/billing-usage-rate-card-overview#azure-resource-usage-api-preview) (currently in public preview)?
* The Tenant Usage API is consistent with the Azure API, with one
  exception: the *showDetails* flag currently is not supported in
  Azure Stack.
* The Provider Usage API applies only to Azure Stack.
* Currently, the [RateCard
  API](https://docs.microsoft.com/azure/billing/billing-usage-rate-card-overview#azure-resource-ratecard-api-preview)
  that is available in Azure is not available in Azure Stack.

## What is the difference between usage time and reported time?
Usage data reports have two main time values:

* **Reported Time**. The time when the usage event entered the usage
  system
* **Usage Time**. The time when the Azure Stack resource was consumed

You might see a discrepancy in values for Usage Time and Reported Time
for a specific usage event. The delay can be as long as multiple hours
in any environment.

Currently, you can query only by *Reported Time*.

## What do these usage API error codes mean?
| **HTTP status code** | **Error code** | **Description** |
| --- | --- | --- |
| 400/Bad Request |*NoApiVersion* |The *api-version* query parameter is missing. |
| 400/Bad Request |*InvalidProperty* |A property is missing or has an invalid value. The message in the error code in the response body identifies the missing property. |
| 400/Bad Request |*RequestEndTimeIsInFuture* |The value for *ReportedEndTime* is in the future. Values in the future are not allowed for this argument. |
| 400/Bad Request |*SubscriberIdIsNotDirectTenant* |A provider API call has used a subscription ID that is not a valid tenant of the caller. |
| 400/Bad Request |*SubscriptionIdMissingInRequest* |The subscription ID of the caller is missing. |
| 400/Bad Request |*InvalidAggregationGranularity* |An invalid aggregation granularity was requested. Valid values are daily and hourly. |
| 503 |*ServiceUnavailable* |A retryable error occurred because the service is busy or the call is being throttled. |

## Next Steps
[Customer billing and chargeback in Azure Stack](azure-stack-billing-and-chargeback.md)

[Provider Resource Usage API](azure-stack-provider-resource-api.md)

[Tenant Resource Usage API](azure-stack-tenant-resource-usage-api.md)
