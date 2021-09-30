---
title: Disaster recovery guidance for Azure Data Lake Storage Gen1 | Microsoft Docs
description: Learn how to further protect your data from region-wide outages or accidental deletions beyond the locally redundant storage of Azure Data Lake Storage Gen1.

author: normesta
ms.service: data-lake-store
ms.topic: conceptual
ms.date: 02/21/2018
ms.author: normesta

---
# High availability and disaster recovery guidance for Data Lake Storage Gen1

Data Lake Storage Gen1 provides locally redundant storage (LRS). Therefore, the data in your Data Lake Storage Gen1 account is resilient to transient hardware failures within a datacenter through automated replicas. This ensures durability and high availability, meeting the Data Lake Storage Gen1 SLA. This article provides guidance on how to further protect your data from rare region-wide outages or accidental deletions.

## Disaster recovery guidance

It's critical for you to prepare a disaster recovery plan. Review the information in this article and these additional resources to help you create your own plan.

* [Disaster recovery and high availability for Azure applications](/azure/architecture/framework/resiliency/backup-and-recovery)
* [Azure resiliency technical guidance](/azure/architecture/framework/resiliency/app-design)

### Best practice recommendations

We recommend that you copy your critical data to another Data Lake Storage Gen1 account in another region with a frequency aligned to the needs of your disaster recovery plan. There are a variety of methods to copy data including [ADLCopy](data-lake-store-copy-data-azure-storage-blob.md), [Azure PowerShell](data-lake-store-get-started-powershell.md), or [Azure Data Factory](../data-factory/connector-azure-data-lake-store.md). Azure Data Factory is a useful service for creating and deploying data movement pipelines on a recurring basis.

If a regional outage occurs, you can then access your data in the region where the data was copied. You can monitor the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) to determine the Azure service status across the globe.

## Data corruption or accidental deletion recovery guidance

While Data Lake Storage Gen1 provides data resiliency through automated replicas, this does not prevent your application (or developers/users) from corrupting data or accidentally deleting it.

To prevent accidental deletion, we recommend that you first set the correct access policies for your Data Lake Storage Gen1 account. This includes applying [Azure resource locks](../azure-resource-manager/management/lock-resources.md) to lock down important resources and applying account and file level access control using the available [Data Lake Storage Gen1 security features](data-lake-store-security-overview.md). We also recommend that you routinely create copies of your critical data using [ADLCopy](data-lake-store-copy-data-azure-storage-blob.md), [Azure PowerShell](data-lake-store-get-started-powershell.md) or [Azure Data Factory](../data-factory/connector-azure-data-lake-store.md) in another Data Lake Storage Gen1 account, folder, or Azure subscription. This can be used to recover from a data corruption or deletion incident. Azure Data Factory is a useful service for creating and deploying data movement pipelines on a recurring basis.

You can also enable [diagnostic logging](data-lake-store-diagnostic-logs.md) for a Data Lake Storage Gen1 account to collect data access audit trails. The audit trails provide information about who might have deleted or updated a file.

## Next steps

* [Get started with Data Lake Storage Gen1](data-lake-store-get-started-portal.md)
* [Secure data in Data Lake Storage Gen1](data-lake-store-secure-data.md)
