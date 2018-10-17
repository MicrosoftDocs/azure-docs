---
title: Azure SQL Database resource limits - managed instance | Microsoft Docs
description: This article provides an overview of the Azure SQL Database resource limits for managed instances. 
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: carlrab, jovanpop
manager: craigg
ms.date: 10/04/2018
---
# Overview Azure SQL Database Managed Instance resource limits

This article provides an overview of the Azure SQL Database Managed Instance resource limits and provides information how to create request to increase default regional subscription limits. 

> [!NOTE]
> For other Managed Instance limitations, see [vCore-based purchasing model](sql-database-managed-instance.md#vcore-based-purchasing-model) and [Managed Instance service tiers](sql-database-managed-instance.md#managed-instance-service-tiers). For differences in supported features and T-SQL statements see [Feature differences](sql-database-features.md) and [T-SQL statement support](sql-database-managed-instance-transact-sql-information.md).

## Instance-level resource limits

Managed Instance has characteristics and resource limits that depends on the underlying infrastructure and architecture. Limits depend on hardware generation and service tier.

### Hardware generation characteristics

Azure SQL Database Managed Instance can be deployed on two hardware generation (Gen4 and Gen5). Hardware generations have different characteristics that are described in the following table:

|   | **Gen 4** | **Gen 5** |
| --- | --- | --- |
| Hardware | Intel E5-2673 v3 (Haswell) 2.4-GHz processors, attached SSD vCore = 1 PP (physical core) | Intel E5-2673 v4 (Broadwell) 2.3-GHz processors, fast eNVM SSD, vCore=1 LP (hyper-thread) |
| Compute | 8, 16, 24 vCores | 8, 16, 24, 32, 40, 64, 80 vCores |
| Memory | 7 GB per vCore | 5.1 GB per vCore |
| Max storage (Business Critical) | 1 TB | 1 TB, 2 TB, or 4 TB depending on the number of cores |

### Service tier characteristics

Managed Instance has two service tiers - General Purpose and Business Critical (Public Preview). These tiers provide different capabilities, as described in the table below:

| **Feature** | **General Purpose** | **Business Critical (preview)** |
| --- | --- | --- |
| Number of vCores\* | Gen4: 8, 16, 24<br/>Gen5: 8, 16, 24, 32, 40, 64, 80 | Gen4: 8, 16, 24, 32 <br/> Gen5: 8, 16, 24, 32, 40, 64, 80 |
| Memory | Gen4: 56GB-156GB<br/>Gen5: 44GB-440GB<br/>\*Proportional to the number of vCores | Gen4: 56GB-156GB <br/> Gen5: 44GB-440GB<br/>\*Proportional to the number of vCores |
| Max storage size | 8 TB | Gen 4: 1 TB <br/> Gen 5: <br/>- 1 TB for 8, 16 vCores<br/>- 2 TB for 24 vCores<br/>- 4 TB for 32, 40, 64, 80 vCores |
| Max storage per database | Determined by the max storage size per instance | Determined by the max storage size per instance |
| Max number of databases per instance | 100 | 100 |
| Max database files per instance | Up to 280 | Unlimited |
| Expected max storage IOPS | 500-5000 ([depends on data file size](../virtual-machines/windows/premium-storage-performance.md#premium-storage-disk-sizes)). | Depends on the underlying SSD speed. |

## Supported regions

Managed Instanced can be created only in [supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=sql-database&regions=all). If you want to create a Managed Instance in the region that is currently not supported, you can [send support request via Azure portal](#obtaining-a-larger-quota-for-sql-managed-instance).

## Supported subscription types

Managed Instance currently supports deployment only on the following types of subscriptions:

- [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/)
- [Pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/)
- [Cloud Service Provider (CSP)](https://docs.microsoft.com/partner-center/csp-documents-and-learning-resources)

> [!NOTE]
> This limitation is temporary. New subscription types will be enabled in the future.

## Regional resource limitations

Supported subscription types can contain a limited number of resources per region. Managed Instance has two default limits per Azure region depending on a type of subscription type:

- **Subnet limit**: The maximum number of subnets where managed instances are deployed in a single region.
- **Instance number limit**: The maximum number of instances that can be deployed in a single region.

In the following table are shown default regional limits for supported subscriptions:

|Subscription type| Max number of Managed Instance subnets | Max number of instances |Max number of GP managed instances*|Max number of BC managed instances*|
| :---| :--- | :--- |:--- |:--- |
|Pay-as-you-go|1*|4*|4*|1*|
|CSP |1*|4*|4*|1*|
|EA|3**|12**|12**|3**|

\* You can either deploy 1 BC or 4 GP instances in one subnet, so that total number of “instance units” in the subnet never exceeds 4.

** Maximum number of instances in one service tier applies if there are no instances in another service tier. In case you plan to mix GP and BC instances within same subnet, use the following section as a reference for allowed combinations. As a simple rule, the total number of subnets cannot exceed 3, and the total number of instance units cannot exceed 12.

These limits can be increased by creating special [support request in the Azure portal](#obtaining-a-larger-quota-for-sql-managed-instance) if you need more Managed Instances in the current region. As an alternative, you can create new Managed Instances in another Azure region without sending support requests.

> [!IMPORTANT]
> When planning your deployments, consider that a Business Critical (BC) instance (due to added redundancy) generally consumes 4x more capacity than a General Purpose (GP) instance. So, for your calculations, 1 GP instance = 1 instance unit and 1 BC instance = 4 instance units. To simplify your consumption analysis against the default limits, summarize the instance units across all subnets in the region where Managed Instances are deployed and compare the results with the instance unit limits for your subscription type.

## Strategies for deploying mixed General Purpose and Business Critical instances

[Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/) subscriptions can have combinations of GP and BC instances. However, there are some constraints regarding the placement of the instances in the subnets.

> [!Note] 
> [Pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/) and [Cloud Service Provider (CSP)](https://docs.microsoft.com/partner-center/csp-documents-and-learning-resources) subscription types can have either one Business Critical or up to 4 General Purpose instances.

The following examples cover deployment cases with non-empty subnets and mixed GP and BC service tiers.

|Number of subnets|Subnet 1|Subnet 2|Subnet 3|
|:---|:---|:---|:---|
|1|1 BC and up to 8 GP<br>2 BC and up to 4 GP|N/A| N/A|
|2|0 BC, up to 4 GP|1 BC, up to 4 GP<br>2 BC, 0 GP|N/A|
|2|1 BC, 0 GP|0 BC, up to 8 GP<br>1 BC, up to 4 GP|N/A|
|2|2 BC, 0 GP|0 BC, up to 4 GP|N/A|
|3|1 BC, 0 GP|1 BC, 0 GP|0 BC, up to 4 GP|
|3|1 BC, 0 GP|0 BC, up to 4 GP|0 BC, up to 4 GP|

## Obtaining a larger quota for SQL Managed Instance

If you need more Managed Instances in your current regions, you can send the support request to extend the quota using Azure portal. 
To initiate the process of obtaining a larger quota:

1. Open **Help + support**, and click **New support request**. 

   ![Help and Support](media/sql-database-managed-instance-resource-limits/help-and-support.png)
2. On the Basics tab for the new support request:
   - For **Issue type**, select **Service and subscription limits (quotas)**.
   - For **Subscription**, select your subscription.
   - For **Quota type**, select **SQL Database Managed Instance**.
   - For **Support plan**, select your support plan.

     ![Issue type quota](media/sql-database-managed-instance-resource-limits/issue-type-quota.png)

3. Click **Next**.
4. On the Problem tab for the new support request:
   - For **Severity**, select the severity level of the problem.
   - For **Details**, provide additional information about your issue, including error messages.
   - For **File upload**, attach a file with more information (up to 4 MB).

     ![Problem details](media/sql-database-managed-instance-resource-limits/problem-details.png)

     > [!IMPORTANT]
     > A valid request should include:
     > - Region in which subscription limit needs to be increased
     > - Required number of instances, per service tier in existing subnets after the quota increase (if any of the existing subnets needs to be expanded
     > - Required number of new subnets and total number of instances per service tier within the new subnets (if you need to deploy managed instances in new subnets).
5. Click **Next**.
6. On the Contact Information tab for the new support request, enter preferred contact method (email or phone) and the contact details.
7. Click **Create**.

## Next steps

- For more information about Managed Instance, see [What is a Managed Instance?](sql-database-managed-instance.md). 
- For pricing information, see [SQL Database Managed Instance pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).
- To learn how to create your first Managed Instance, see [Quick-start guide](sql-database-managed-instance-get-started.md).
