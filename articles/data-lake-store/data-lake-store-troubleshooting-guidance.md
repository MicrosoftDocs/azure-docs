---
title: Frequently asked questions for Azure Data Lake Store | Microsoft Docs
description: Guidance on troublehsooting or mitigating issues with Azure Data Lake Store
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: bf7fd555-3e30-43ce-b28c-c3ad0a241fdb
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/10/2017
ms.author: nitinme

---
# Frequently asked questions for Azure Data Lake Store
In this article you will learn about FAQs related to Azure Data Lake Store.

## How can I further protect my data from region-wide disasters or accidental deletions?
The data in your Azure Data Lake Store account is resilient to transient hardware failures within a region through automated replicas. This ensures durability and high availability, meeting the Azure Data Lake Store SLA. Here's some guidance on how to further protect your data from rare region-wide outages or accidental deletions.

### Disaster recovery guidance
It is critical for every customer to prepare their own disaster recovery plan. Please refer to the Azure documentation below to build your disaster recovery plan. Here are some resources that can help you create your own plan.

* [Disaster recovery and high availability for Azure applications](../resiliency/resiliency-disaster-recovery-high-availability-azure-applications.md)
* [Azure resiliency technical guidance](../resiliency/resiliency-technical-guidance.md)

#### Best practices
We recommend that you copy your critical data to another Data Lake Store account in another region with a frequency aligned to the needs of your disaster recovery plan. There are a variety of methods to copy data including [ADLCopy](data-lake-store-copy-data-azure-storage-blob.md), [Azure PowerShell](data-lake-store-get-started-powershell.md) or [Azure Data Factory](../data-factory/data-factory-azure-datalake-connector.md). Azure Data Factory is a useful service for creating and deploying data movement pipelines on a recurring basis.

If a regional outage occurs, you can then access your data in the region where the data was copied.You can monitor the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) to determine the Azure service status across the globe.

### Data corruption or accidental deletion recovery guidance
While Azure Data Lake Store provides data resiliency through automated replicas, this does not prevent your application (or developers/users) from corrupting data or accidentally deleting it.

#### Best practices
To prevent accidental deletion, we recommend that you first set the correct access policies for your Data Lake Store account.  This includes applying [Azure resource locks](../azure-resource-manager/resource-group-lock-resources.md) to lock down important resources as well as applying account and file level access control using the available [Data Lake Store security features](data-lake-store-security-overview.md). We also recommend that you routinely create copies of your critical data using [ADLCopy](data-lake-store-copy-data-azure-storage-blob.md), [Azure PowerShell](data-lake-store-get-started-powershell.md) or [Azure Data Factory](../data-factory/data-factory-azure-datalake-connector.md) in another Data Lake Store account, folder, or Azure subscription.  This can be used to recover from a data corruption or deletion incident. Azure Data Factory is a useful service for creating and deploying data movement pipelines on a recurring basis.

Organizations can also enable [diagnostic logging](data-lake-store-diagnostic-logs.md) for their Azure Data Lake Store account to collect data access audit trails that provides information about who might have deleted or updated a file.

## Next steps
* [Get Started with Azure Data Lake Store](data-lake-store-get-started-portal.md)
* [Secure data in Data Lake Store](data-lake-store-secure-data.md)

