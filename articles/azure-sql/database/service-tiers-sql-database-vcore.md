---
title: vCore purchasing model
description: The vCore purchasing model lets you independently scale compute and storage resources, match on-premises performance, and optimize price for Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: kendralittle, sashan, moslake, mathoma
ms.date: 04/06/2022
ms.custom: references_regions, ignite-fall-2021
---
# vCore purchasing model - Azure SQL Database 
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!div class="op_single_selector"]
> * [Azure SQL Database](service-tiers-sql-database-vcore.md)
> * [Azure SQL Managed Instance](../managed-instance/service-tiers-managed-instance-vcore.md)

This article reviews the [vCore purchasing model](service-tiers-vcore.md) for [Azure SQL Database](sql-database-paas-overview.md). For help choosing between the vCore and DTU purchasing models, see the [differences between the vCore and DTU purchasing models](purchasing-models.md).

## Overview

[!INCLUDE [vcore-overview](../includes/vcore-overview.md)]

> [!IMPORTANT]
> Compute resources, I/O, and data and log storage are charged per database or elastic pool. Backup storage is charged per each database.

The vCore purchasing model used by Azure SQL Database provides several benefits over the DTU purchasing model:

- Higher compute, memory, I/O, and storage limits.
- Choice of hardware configuration to better match compute and memory requirements of the workload.
- Pricing discounts for [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md).
- Greater transparency in the hardware details that power the compute, that facilitates planning for migrations from on-premises deployments.
- [Reserved instance pricing](reserved-capacity-overview.md) is only available for vCore purchasing model. 
- Higher scaling granularity with multiple compute sizes available.


## Service tiers

Service tier options in the vCore purchasing model include General Purpose, Business Critical, and Hyperscale. The service tier generally service tier defines hardware, storage type and IOPS, high availability and disaster recovery options, and other features like memory-optimized object types.

For greater details, review resource limits for [logical server](resource-limits-logical-server.md), [single databases](resource-limits-vcore-single-databases.md), and [pooled databases](resource-limits-vcore-elastic-pools.md). 

|**Use case**|**General Purpose**|**Business Critical**|**Hyperscale**|
|---|---|---|---|
|**Best for**|Most business workloads. Offers budget-oriented, balanced, and scalable compute and storage options. |Offers business applications the highest resilience to failures by using several isolated replicas, and provides the highest I/O performance per database replica.|Most business workloads with highly scalable storage and read-scale requirements.  Offers higher resilience to failures by allowing configuration of more than one isolated database replica. |
|**Availability**|1 replica, no read-scale replicas, <br/>zone-redundant high availability (HA) (preview)|3 replicas, 1 [read-scale replica](read-scale-out.md),<br/>zone-redundant high availability (HA)|zone-redundant high availability (HA) (preview)|
|**Pricing/billing**  | [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS is not charged. |[vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS is not charged. |  [vCore for each replica and used storage](https://azure.microsoft.com/pricing/details/sql-database/single/) are charged. <br/>IOPS not yet charged. |
|**Discount models**| [Reserved instances](reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions|[Reserved instances](reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions  | [Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions|



> [!NOTE]
> For more information on the Service Level Agreement (SLA), see [SLA for Azure SQL Database](https://azure.microsoft.com/support/legal/sla/azure-sql-database/) 

### Choosing a service tier

For information on selecting a service tier for your particular workload, see the following articles:

- [When to choose the General Purpose service tier](service-tier-general-purpose.md#when-to-choose-this-service-tier)
- [When to choose the Business Critical service tier](service-tier-business-critical.md#when-to-choose-this-service-tier)
- [When to choose the Hyperscale service tier](service-tier-hyperscale.md#who-should-consider-the-hyperscale-service-tier)

## Resource limits

For vCore resource limits, see [logical servers](resource-limits-logical-server.md), [single databases](resource-limits-vcore-single-databases.md), [pooled databases](resource-limits-vcore-elastic-pools.md). 

## Compute tiers

Compute tier options in the vCore model include the provisioned and [serverless](serverless-tier-overview.md) compute tiers.

- While the **provisioned compute tier** provides a specific amount of compute resources that are continuously provisioned independent of workload activity, the **serverless compute tier** auto-scales compute resources based on workload activity. 
- While the **provisioned compute tier** bills for the amount of compute provisioned at a fixed price per hour, the **serverless compute tier** bills for the amount of compute used, per second.


## Hardware configuration

Hardware configurations in the vCore model include Gen4, Gen5, M-series, Fsv2-series, and DC-series. Hardware configuration defines compute and memory limits and other characteristics that impact workload performance.

### Gen4/Gen5

- Gen4/Gen5 hardware provides balanced compute and memory resources, and is suitable for most database workloads that do not have higher memory, higher vCore, or faster single vCore requirements as provided by Fsv2-series or M-series.

For regions where Gen4/Gen5 is available, see [Gen4/Gen5 availability](#gen4gen5-1).

### Fsv2-series

- Fsv2-series is a compute optimized hardware configuration delivering low CPU latency and high clock speed for the most CPU demanding workloads.
- Depending on the workload, Fsv2-series can deliver more CPU performance per vCore than other types of hardware. For example, the 72 vCore Fsv2 compute size can provide more CPU performance than 80 vCores on Gen5, at lower cost.
- Fsv2 provides less memory and tempdb per vCore than other hardware, so workloads sensitive to those limits may perform better on Gen5 or M-series.

Fsv2-series in only supported in the General Purpose tier. For regions where Fsv2-series is available, see [Fsv2-series availability](#fsv2-series-1).

### M-series

- M-series is a memory optimized hardware configuration for workloads demanding more memory and higher compute limits than provided by other types of hardware.
- M-series provides 29 GB per vCore and up to 128 vCores, which increases the memory limit relative to Gen5 by 8x to nearly 4 TB.

M-series is only supported in the Business Critical tier and does not support zone redundancy. For regions where M-series is available, see [M-series availability](#m-series-1).

#### Azure offer types supported by M-series

To create databases or elastic pools on M-series hardware, the subscription must be a paid offer type including Pay-As-You-Go or Enterprise Agreement (EA). For a complete list of Azure offer types supported by M-series, see [current offers without spending limits](https://azure.microsoft.com/support/legal/offer-details).

<!--
To enable M-series hardware for a subscription and region, a support request must be opened. The subscription must be a paid offer type including Pay-As-You-Go or Enterprise Agreement (EA).  If the support request is approved, then the selection and provisioning experience of M-series follows the same pattern as for other hardware generations. For regions where M-series is available, see [M-series availability](#m-series).
-->

### DC-series

- DC-series hardware uses Intel processors with Software Guard Extensions (Intel SGX) technology.
- DC-series is required for [Always Encrypted with secure enclaves](/sql/relational-databases/security/encryption/always-encrypted-enclaves), which is not supported with other hardware configurations.
- DC-series is designed for workloads that process sensitive data and demand confidential query processing capabilities, provided by Always Encrypted with secure enclaves.
- DC-series hardware provides balanced compute and memory resources.

DC-series is only supported for Provisioned compute (Serverless is not supported) and does not support zone redundancy. For regions where DC-series is available, see [DC-series availability](#dc-series-1).

#### Azure offer types supported by DC-series

To create databases or elastic pools on DC-series hardware, the subscription must be a paid offer type including Pay-As-You-Go or Enterprise Agreement (EA).  For a complete list of Azure offer types supported by DC-series, see [current offers without spending limits](https://azure.microsoft.com/support/legal/offer-details).

### Selecting hardware configuration

You can select hardware configuration for a database or elastic pool in SQL Database at the time of creation. You can also change hardware configuration of an existing database or elastic pool.

**To select a hardware configuration when creating a SQL Database or pool**

For detailed information, see [Create a SQL Database](single-database-create-quickstart.md).

On the **Basics** tab, select the **Configure database** link in the **Compute + storage** section, and then select the **Change configuration** link:

:::image type="content" source="./media/service-tiers-vcore/configure-sql-database.png" alt-text="configure SQL database" loc-scope="azure-portal":::

Select the desired hardware configuration:

:::image type="content" source="./media/service-tiers-vcore/select-hardware.png" alt-text="select hardware for SQL database" loc-scope="azure-portal":::

**To change hardware configuration of an existing SQL Database or pool**

For a database, on the Overview page, select the **Pricing tier** link:

:::image type="content" source="./media/service-tiers-vcore/change-hardware.png" alt-text="change hardware for SQL Database" loc-scope="azure-portal":::

For a pool, on the Overview page, select **Configure**.

Follow the steps to change configuration, and select hardware configuration as described in the previous steps.

### Hardware availability

#### <a id="gen4gen5-1"></a> Gen4/Gen5

Gen4 hardware is [being retired](https://azure.microsoft.com/updates/gen-4-hardware-on-azure-sql-database-approaching-end-of-life-in-2020/) and is no longer available for new deployments. All new databases must be deployed on other hardware configurations.

Gen5 hardware is available in all public regions worldwide.

#### Fsv2-series

Fsv2-series is available in the following regions:
Australia Central, Australia Central 2, Australia East, Australia Southeast, Brazil South, Canada Central, East Asia, East US, France Central, India Central, Korea Central, Korea South, North Europe, South Africa North, Southeast Asia, UK South, UK West, West Europe, West US 2.

#### M-series

M-series is available in the following regions:
East US, North Europe, West Europe, West US 2.
<!--
M-series may also have limited availability in additional regions. You can request a different region than listed here, but fulfillment in a different region may not be possible.

To enable M-series availability in a subscription, access must be requested by [filing a new support request](#create-a-support-request-to-enable-m-series).


##### Create a support request to enable M-series: 

1. Select **Help + support** in the portal.
2. Select **New support request**.

On the **Basics** page, provide the following:

1. For **Issue type**, select **Service and subscription limits (quotas)**.
2. For **Subscription** = select the subscription to enable M-series.
3. For **Quota type**, select **SQL database**.
4. Select **Next** to go to the **Details** page.

On the **Details** page, provide the following:

1. In the **PROBLEM DETAILS** section select the **Provide details** link. 
2. For **SQL Database quota type** select **M-series**.
3. For **Region**, select the region to enable M-series.
    For regions where M-series is available, see [M-series availability](#m-series).

Approved support requests are typically fulfilled within 5 business days.
-->

#### DC-series

DC-series is available in the following regions:
Canada Central, Canada East, East US, North Europe, UK South, West Europe, West US.

If you need DC-series in a currently unsupported region, [submit a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). On the **Basics** page, provide the following:

1. For **Issue type**, select **Technical**.
1. For **Service type**, select **SQL Database**.
1. For **Problem type**, select **Security, Private and Compliance**.
1. For **Problem subtype**, select **Always Encrypted**.

:::image type="content" source="./media/service-tiers-vcore/request-dc-series.png" alt-text="Request DC-series in a new region" loc-scope="azure-portal":::

## Compute resources (CPU and memory)

The following table compares compute resources in different hardware configurations and compute tiers: 

|Hardware configuration  |Compute  |Memory  |
|:---------|:---------|:---------|
|Gen4     |- Intel&reg; E5-2673 v3 (Haswell) 2.4-GHz processors<br>- Provision up to 24 vCores (1 vCore = 1 physical core)  |- 7 GB per vCore<br>- Provision up to 168 GB|
|Gen5     |**Provisioned compute**<br>- Intel&reg; E5-2673 v4 (Broadwell) 2.3-GHz, Intel&reg; SP-8160 (Skylake)\*, and Intel&reg; 8272CL (Cascade Lake) 2.5 GHz\* processors<br>- Provision up to 80 vCores (1 vCore = 1 hyper-thread)<br><br>**Serverless compute**<br>- Intel&reg; E5-2673 v4 (Broadwell) 2.3-GHz and Intel&reg; SP-8160 (Skylake)* processors<br>- Auto-scale up to 40 vCores (1 vCore = 1 hyper-thread)|**Provisioned compute**<br>- 5.1 GB per vCore<br>- Provision up to 408 GB<br><br>**Serverless compute**<br>- Auto-scale up to 24 GB per vCore<br>- Auto-scale up to 120 GB max|
|Fsv2-series     |- Intel&reg; 8168 (Skylake) processors<br>- Featuring a sustained all core turbo clock speed of 3.4 GHz and a maximum single core turbo clock speed of 3.7 GHz.<br>- Provision up to 72 vCores (1 vCore = 1 hyper-thread)|- 1.9 GB per vCore<br>- Provision up to 136 GB|
|M-series     |- Intel&reg; E7-8890 v3 2.5 GHz and Intel&reg; 8280M 2.7 GHz (Cascade Lake) processors<br>- Provision up to 128 vCores (1 vCore = 1 hyper-thread)|- 29 GB per vCore<br>- Provision up to 3.7 TB|
|DC-series     | - Intel&reg; XEON E-2288G processors<br>- Featuring Intel Software Guard Extension (Intel SGX))<br>- Provision up to 8 vCores (1 vCore = 1 physical core) | 4.5 GB per vCore |

\* In the [sys.dm_user_db_resource_governance](/sql/relational-databases/system-dynamic-management-views/sys-dm-user-db-resource-governor-azure-sql-database) dynamic management view, hardware generation for databases using Intel&reg; SP-8160 (Skylake) processors appears as Gen6, hardware generation for databases using Intel&reg; 8272CL (Cascade Lake) appears as Gen7 and hardware generation for databases using Intel Xeon&reg; Platinum 8307C (Ice Lake) appear as Gen8. For a given compute size and hardware configuration, resource limits are the same regardless of processor type (Broadwell, Skylake, or Cascade Lake).

For more information see resource limits for [single databases](resource-limits-vcore-single-databases.md) and [elastic pools](resource-limits-vcore-elastic-pools.md).

## Next steps

- To get started, see [Creating a SQL Database using the Azure portal](single-database-create-quickstart.md)
- For pricing details, see the [Azure SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/single/)
- For details about the specific compute and storage sizes available, see:
    - [vCore-based resource limits for Azure SQL Database](resource-limits-vcore-single-databases.md)
    - [vCore-based resource limits for pooled Azure SQL Database](resource-limits-vcore-elastic-pools.md)
