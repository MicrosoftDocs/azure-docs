---
title: AzureDnsZone endpoints requirement FAQ
titleSuffix: Azure Storage
description: Commonly asked questions regarding the retirement of AzureDnsZone endpoints for blob storage accounts.
Services: storage
author: schoag-msft
ms.service: azure-storage
ms.topic: faq
ms.date: 4/9/2026
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#customer-intent: As a storage admin, I want to find answers to common questions about the retirement of general-purpose v1 (GPv1) standard ZRS accounts, so that I can plan my upgrade to general-purpose v2 (GPv2) and avoid service disruption.
---

# AzureDnsZone endpoints requirement FAQ

[AzureDnsZone endpoints (preview)](storage-account-overview.md#azure-dns-zone-endpoints-preview) for Azure Blob storage accounts enter retirement in March 2027. Customers using AzureDnsZone endpoints (preview) should transition to Standard endpoints for all new and existing blob storage account deployments by April 1, 2027. Standard endpoints are Generally Available and fully supported for production workloads.

### What do I need to do?  

- Your existing storage accounts are not impacted and are not deleted.   
- Over the coming months, we remove the ability to create new storage accounts with AzureDnsZone endpoints.

[Follow our instructions](https://aka.ms/AzStorageAccountCreate) to update your deployments to Standard endpoints. Standard endpoints are generally available and offer full support for production workloads.

### How do I identify my storage accounts with AzureDnsZone endpoints?  

To identify your storage accounts with AzureDnsZone endpoints, you can use the following Azure Resource Graph query:  

```kql
resources
| where type =~ "microsoft.storage/storageaccounts"
| where ['kind'] == "StorageV2"
| parse-where properties with * "dnsEndpointType\":\"" dnsEndpointType '",' *
| where dnsEndpointType == "AzureDnsZone"  
```

### I have more questions or require support

If you have questions, you can get answers from community experts in [Microsoft Q&A](https://aka.ms/classicstorageaccountmigration). If you have a support plan and need technical assistance, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). 


