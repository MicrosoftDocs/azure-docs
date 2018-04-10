---
title: Usage API related FAQs | Microsoft Docs
description: List of Azure Stack meters, comparison to Azure usage API, Usage Time and Reported Time, error codes.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 847f18b2-49a9-4931-9c09-9374e932a071
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/09/2018
ms.author: mabrigg
ms.reviewer: alfredop

---
# Frequently asked questions in Azure Stack usage API
This article answers some frequently asked questions about the Azure Stack Usage API.

## What meter IDs can I see?
Usage is reported for the following resource providers:

| **Resource provider** | **Meter ID** | **Meter name** | **Unit** | **Additional information** |
| --- | --- | --- | --- | --- |
| **Network** |F271A8A388C44D93956A063E1D2FA80B |Static IP Address Usage |IP addresses| Count of IP addresses used. If you call the usage API with a daily granularity, the meter returns IP address multiplied by the number of hours. |
| |9E2739BA86744796B465F64674B822BA |Dynamic IP Address Usage |IP addresses| Count of IP addresses used. If you call the usage API with a daily granularity, the meter returns IP address multiplied by the number of hours. |
| **Storage** |B4438D5D-453B-4EE1-B42A-DC72E377F1E4 |TableCapacity |GB\*hours |Total capacity consumed by tables. |
| |B5C15376-6C94-4FDD-B655-1A69D138ACA3 |PageBlobCapacity |GB\*hours |Total capacity consumed by page blobs. |
| |B03C6AE7-B080-4BFA-84A3-22C800F315C6 |QueueCapacity |GB\*hours |Total capacity consumed by queue. |
| |09F8879E-87E9-4305-A572-4B7BE209F857 |BlockBlobCapacity |GB\*hours |Total capacity consumed by block blobs. |
| |B9FF3CD0-28AA-4762-84BB-FF8FBAEA6A90 |TableTransactions |Request count in 10,000's |Table service requests (in 10,000s). |
| |50A1AEAF-8ECA-48A0-8973-A5B3077FEE0D |TableDataTransIn |Ingress data in GB |Table service data ingress in GB. |
| |1B8C1DEC-EE42-414B-AA36-6229CF199370 |TableDataTransOut |Egress in GB |Table service data egress in GB |
| |43DAF82B-4618-444A-B994-40C23F7CD438 |BlobTransactions |Requests count in 10,000's |Blob service requests (in 10,000s). |
| |9764F92C-E44A-498E-8DC1-AAD66587A810 |BlobDataTransIn |Ingress data in GB |Blob service data ingress in GB. |
| |3023FEF4-ECA5-4D7B-87B3-CFBC061931E8 |BlobDataTransOut |Egress in GB |Blob service data egress in GB. |
| |EB43DD12-1AA6-4C4B-872C-FAF15A6785EA |QueueTransactions |Requests count in 10,000's |Queue service requests (in 10,000s). |
| |E518E809-E369-4A45-9274-2017B29FFF25 |QueueDataTransIn |Ingress data in GB |Queue service data ingress in GB. |
| |DD0A10BA-A5D6-4CB6-88C0-7D585CEF9FC2 |QueueDataTransOut |Egress in GB |Queue service data egress in GB |
| **Sql RP**            | CBCFEF9A-B91F-4597-A4D3-01FE334BED82 | DatabaseSizeHourSqlMeter   | MB\*hours   | Total DB capacity at creation. If you call the usage API with a daily granularity, the meter returns MB multiplied by the number of hours. |
| **MySql RP**          | E6D8CFCD-7734-495E-B1CC-5AB0B9C24BD3 | DatabaseSizeHourMySqlMeter | MB\*hours    | Total DB capacity at creation. If you call the usage API with a daily granularity, the meter returns MB multiplied by the number of hours. |
| **Compute** |FAB6EB84-500B-4A09-A8CA-7358F8BBAEA5 |Base VM Size Hours |Virtual core hours | Number of virtual cores multiplied by the hours the VM ran. |
| |9CD92D4C-BAFD-4492-B278-BEDC2DE8232A |Windows VM Size Hours |Virtual core hours | Number of virtual cores multiplied by hours the VM ran. |
| |6DAB500F-A4FD-49C4-956D-229BB9C8C793 |VM size hours |VM hours |Captures both Base and Windows VM. Does not adjust for cores. |
| **Key Vault** |EBF13B9F-B3EA-46FE-BF54-396E93D48AB4 |Key Vault transactions | Request count in 10,000's| Number of REST API requests received by Key Vault data plane. |
| |2C354225-B2FE-42E5-AD89-14F0EA302C87 |Advanced keys transactions | 10K transactions| 	RSA 3K/4K, ECC key transactions. (preview). |
| **App service** | 190C935E-9ADA-48FF-9AB8-56EA1CF9ADAA | App Service | Virtual core hours | Number of virtual cores used to run app service. Note: Microsoft uses this meter to charge the App Service on Azure Stack. Cloud Service Providers can use the other App Service meters (below) to calculate usage for their tenants. |
|  | 67CC4AFC-0691-48E1-A4B8-D744D1FEDBDE | Functions Requests | 10 Requests | Total number of requested executions (per 10 executions). Executions are counted each time a function runs in response to an event, or is triggered by a binding. |
|  | D1D04836-075C-4F27-BF65-0A1130EC60ED | Functions - Compute | GB-s | Resource consumption measured in gigabyte seconds (GB/s). **Observed resource consumption** is calculated by multiplying average memory size in GB by the time in milliseconds it takes to execute the function. Memory used by a function is measured by rounding up to the nearest 128 MB, up to the maximum memory size of 1,536 MB, with execution time calculated by rounding up to the nearest 1 ms. The minimum execution time and memory for a single function execution is 100 ms and 128 mb respectively. |
|  | 957E9F36-2C14-45A1-B6A1-1723EF71A01D | Shared App Service Hours | 1 hour | Per hour usage of shard App Service Plan. Plans are metered on a per App basis. |
|  | 539CDEC7-B4F5-49F6-AAC4-1F15CFF0EDA9 | Free App Service Hours | 1 hour | Per hour usage of free App Service Plan. Plans are metered on a per App basis. |
|  | 88039D51-A206-3A89-E9DE-C5117E2D10A6 | Small Standard App Service Hours | 1 hour | Calculated based on size and number of instances. |
|  | 83A2A13E-4788-78DD-5D55-2831B68ED825 | Medium Standard App Service Hours | 1 hour | Calculated based on size and number of instances. |
|  | 1083B9DB-E9BB-24BE-A5E9-D6FDD0DDEFE6 | Large Standard App Service Hours | 1 hour | Calculated based on size and number of instances. |
|  | *Custom Worker Tiers* | Custom Worker Tiers | Hours | Deterministic meter ID is created based on SKU and custom worker tier name. This meter ID is unique for each custom worker tier. |
|  | 264ACB47-AD38-47F8-ADD3-47F01DC4F473 | SNI SSL | Per SNI SSL Binding | App Service supports two types of SSL connections: Server Name Indication (SNI) SSL Connections and IP Address SSL Connections. SNI-based SSL works on modern browsers while IP-based SSL works on all browsers. |
|  | 60B42D72-DC1C-472C-9895-6C516277EDB4 | IP SSL | Per IP Based SSL Binding | App Service supports two types of SSL connections: Server Name Indication (SNI) SSL Connections and IP Address SSL Connections. SNI-based SSL works on modern browsers while IP-based SSL works on all browsers. |
|  | 73215A6C-FA54-4284-B9C1-7E8EC871CC5B | Web Process |  | Calculated per active site per hour. |
|  | 5887D39B-0253-4E12-83C7-03E1A93DFFD9 | External Egress Bandwidth | GB | Total incoming request response bytes + total outgoing request bytes + total incoming FTP request response bytes + total incoming web deploy request response bytes. |

## How do the Azure Stack usage APIs compare to the [Azure usage API](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c) (currently in public preview)?
* The Tenant Usage API is consistent with the Azure API, with one
  exception: the *showDetails* flag currently is not supported in
  Azure Stack.
* The Provider Usage API applies only to Azure Stack.
* Currently, the [RateCard
  API](https://msdn.microsoft.com/en-us/library/azure/mt219004.aspx)
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
