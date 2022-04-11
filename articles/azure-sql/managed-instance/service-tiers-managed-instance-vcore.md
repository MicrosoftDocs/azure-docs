---
title: vCore purchasing model
description: The vCore purchasing model lets you independently scale compute and storage resources, match on-premises performance, and optimize price for Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: performance
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sashan, moslake
ms.date: 04/06/2022
ms.custom: ignite-fall-2021
---
# vCore purchasing model - Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

> [!div class="op_single_selector"]
> * [Azure SQL Database](../database/service-tiers-sql-database-vcore.md)
> * [Azure SQL Managed Instance](service-tiers-managed-instance-vcore.md)

This article reviews the [vCore purchasing model](../database/service-tiers-vcore.md) for [Azure SQL Managed Instance](sql-managed-instance-paas-overview.md). 

## Overview

[!INCLUDE [vcore-overview](../includes/vcore-overview.md)]

The virtual core (vCore) purchasing model used by Azure SQL Managed Instance provides the following benefits: 

- Control over hardware configuration to better match the compute and memory requirements of the workload.
- Pricing discounts for [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md) and [Reserved Instance (RI)](../database/reserved-capacity-overview.md).
- Greater transparency in the hardware details that power compute, helping facilitate planning for migrations from on-premises deployments.
- Higher scaling granularity with multiple compute sizes available.

## <a id="compute-tiers"></a>Service tiers

Service tier options in the vCore purchasing model include General Purpose and Business Critical. The service tier generally defines the storage architecture, space and I/O limits, and business continuity options related to availability and disaster recovery. 

For more details, review [resource limits](resource-limits.md). 

|**Category**|**General Purpose**|**Business Critical**|
|---|---|---|
|**Best for**|Most business workloads. Offers budget-oriented, balanced, and scalable compute and storage options. |Offers business applications the highest resilience to failures by using several isolated replicas, and provides the highest I/O performance.|
|**Availability**|1 replica, no read-scale replicas|4 replicas total, 1 [read-scale replica](../database/read-scale-out.md),<br/> 2 high availability replicas (HA)|
|**Read-only replicas**| 0 built-in <br> 0 - 4 using [geo-replication](../database/active-geo-replication-overview.md) | 1 built-in, included in price <br> 0 - 4 using [geo-replication](../database/active-geo-replication-overview.md) |
|**Pricing/billing**| [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/managed/) is charged. <br/>IOPS is not charged| [vCore, reserved storage, and backup storage](https://azure.microsoft.com/pricing/details/sql-database/managed/) is charged. <br/>IOPS is not charged.
|**Discount models**| [Reserved instances](../database/reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions|[Reserved instances](../database/reserved-capacity-overview.md)<br/>[Azure Hybrid Benefit](../azure-hybrid-benefit.md) (not available on dev/test subscriptions)<br/>[Enterprise](https://azure.microsoft.com/offers/ms-azr-0148p/) and [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0023p/) Dev/Test subscriptions|


> [!NOTE]
> For more information on the Service Level Agreement (SLA), see [SLA for Azure SQL Managed Instance](https://azure.microsoft.com/support/legal/sla/azure-sql-sql-managed-instance/). 

### Choosing a service tier

For information on selecting a service tier for your particular workload, see the following articles:

- [When to choose the General Purpose service tier](../database/service-tier-general-purpose.md#when-to-choose-this-service-tier)
- [When to choose the Business Critical service tier](../database/service-tier-business-critical.md#when-to-choose-this-service-tier)

## Compute

SQL Managed Instance compute provides a specific amount of compute resources that are continuously provisioned independent of workload activity, and bills for the amount of compute provisioned at a fixed price per hour.

## Hardware configurations

Hardware configuration options in the vCore model include standard-series (Gen5), premium-series, and memory optimized premium-series. Hardware configuration generally defines the compute and memory limits and other characteristics that impact workload performance.

For more information on the hardware configuration specifics and limitations, see [Hardware configuration characteristics](resource-limits.md#hardware-configuration-characteristics).

In the [sys.dm_user_db_resource_governance](/sql/relational-databases/system-dynamic-management-views/sys-dm-user-db-resource-governor-azure-sql-database) dynamic management view, hardware generation for instances using Intel&reg; SP-8160 (Skylake) processors appears as Gen6, while hardware generation for instances using Intel&reg; 8272CL (Cascade Lake) appears as Gen7. The Intel&reg; 8370C (Ice Lake) CPUs used by premium-series and memory optimized premium-series hardware generations appear as Gen8. Resource limits for all standard-series (Gen5) instances are the same regardless of processor type (Broadwell, Skylake, or Cascade Lake).

### Selecting a hardware configuration

You can select hardware configuration at the time of instance creation, or you can change hardware of an existing instance.

**To select hardware configuration when creating a SQL Managed Instance**

For detailed information, see [Create a SQL Managed Instance](../managed-instance/instance-create-quickstart.md).

On the **Basics** tab, select the **Configure database** link in the **Compute + storage** section, and then select desired hardware:

:::image type="content" source="../database/media/service-tiers-vcore/configure-managed-instance.png" alt-text="configure SQL Managed Instance"  loc-scope="azure-portal":::
  
**To change hardware of an existing SQL Managed Instance**

#### [The Azure portal](#tab/azure-portal)

From the SQL Managed Instance page, select **Pricing tier** link placed under the Settings section

:::image type="content" source="../database/media/service-tiers-vcore/change-managed-instance-hardware.png" alt-text="change SQL Managed Instance hardware"  loc-scope="azure-portal":::

On the Pricing tier page, you will be able to change hardware as described in the previous steps.

#### [PowerShell](#tab/azure-powershell)

Use the following PowerShell script:

```powershell-interactive
Set-AzSqlInstance -Name "managedinstance1" -ResourceGroupName "ResourceGroup01" -ComputeGeneration Gen5
```

For more details, check [Set-AzSqlInstance](/powershell/module/az.sql/set-azsqlinstance) command.

#### [The Azure CLI](#tab/azure-cli)

Use the following CLI command:

```azurecli-interactive
az sql mi update -g mygroup -n myinstance --family Gen5
```

For more details, check [az sql mi update](/cli/azure/sql/mi#az-sql-mi-update) command.

---

### Hardware availability

#### <a id="gen4gen5-1"></a> Gen4

Gen4 hardware is [being retired](https://azure.microsoft.com/updates/gen-4-hardware-on-azure-sql-database-approaching-end-of-life-in-2020/) and is no longer available for new deployments. All new instances must be deployed on other hardware configurations.

#### Standard-series (Gen5) and premium-series

Standard-series (Gen5) hardware is available in all public regions worldwide.
  
Premium-series and memory optimized premium-series hardware is in preview, and has limited regional availability. For more details, see [Azure SQL Managed Instance resource limits](../managed-instance/resource-limits.md#hardware-configuration-characteristics).

## Next steps

- To get started, see [Creating a SQL Managed Instance using the Azure portal](instance-create-quickstart.md)
- For pricing details, see 
    - [Azure SQL Managed Instance single instance pricing page](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/single/)
    - [Azure SQL Managed Instance pools pricing page](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/pools/)
- For details about the specific compute and storage sizes available in the General Purpose and Business Critical service tiers, see [vCore-based resource limits for Azure SQL Managed Instance](resource-limits.md).
