---
title: Azure SQL Managed Instance vCore purchasing model overview
titleSuffix: Azure SQL Managed Instance compute hardware
description: The vCore purchasing model lets you independently scale compute and storage resources, match on-premises performance, and optimize price for Azure SQL Managed Instance.
services: sql-database
ms.service: sql-db-mi
ms.subservice: features
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sashan, moslake
ms.date: 05/18/2021
---
# Azure SQL Managed Instance - Compute Hardware in the vCore Service Tier
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

The virtual core (vCore) purchasing model deployment model used by Azure SQL Managed Instance has following characteristics:

- Control over the hardware generation to better match compute and memory requirements of the workload.
- Pricing discounts for [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md) and [Reserved Instance (RI)](../database/reserved-capacity-overview.md).
- Greater transparency in the hardware details that power the compute, that facilitates planning for migrations from on-premises deployments.

## <a id="compute-tiers">Service tiers</a>

Service tier options in the vCore model include General Purpose and Business Critical. The service tier generally defines the storage architecture, space and I/O limits, and business continuity options related to availability and disaster recovery.

|**Use case**|**General Purpose**|**Business Critical**|
|---|---|---|
|Best for|Most business workloads. Offers budget-oriented, balanced, and scalable compute and storage options. |Offers business applications the highest resilience to failures by using several isolated replicas, and provides the highest I/O performance.|
|Storage|Uses remote storage.<br/>**SQL Managed Instance**: 32 GB - 8 TB |Uses local SSD storage.<br/>**SQL Managed Instance**:<br/>32 GB - 4 TB |
|IOPS and throughput (approximate)|**SQL Managed Instance**: See [Overview Azure SQL Managed Instance resource limits](../managed-instance/resource-limits.md#service-tier-characteristics).|See resource limits for [single databases](../database/resource-limits-vcore-single-databases.md) and [elastic pools](../database/resource-limits-vcore-elastic-pools.md).|
|Availability|1 replica, no read-scale replicas|3 replicas, 1 [read-scale replica](../database/read-scale-out.md),<br/>zone-redundant high availability (HA)|1 read-write replica, plus 0-4 [read-scale replicas](../database/read-scale-out.md)|
|Backups|[Read-access geo-redundant storage (RA-GRS)](../../storage/common/geo-redundant-design.md), 1-35 days (7 days by default)|[RA-GRS](../../storage/common/geo-redundant-design.md), 1-35 days (7 days by default)|
|In-memory|Not supported|Supported|
||||

### Choosing a service tier

For information on selecting a service tier for your particular workload, see the following articles:

- [When to choose the General Purpose service tier](../database/service-tier-general-purpose.md#when-to-choose-this-service-tier)
- [When to choose the Business Critical service tier](../database/service-tier-business-critical.md#when-to-choose-this-service-tier)

## Compute

SQL Managed Instance compute provides a specific amount of compute resources that are continuously provisioned independent of workload activity, and bills for the amount of compute provisioned at a fixed price per hour.

## Hardware generations

Hardware generation options in the vCore model include Gen 5 hardware series. The hardware generation generally defines the compute and memory limits and other characteristics that impact the performance of the workload.

### Compute and memory specifications

|Hardware generation  |Compute  |Memory  |
|:---------|:---------|:---------|
|Gen4     |- Intel&reg; E5-2673 v3 (Haswell) 2.4 GHz processors<br>- Provision up to 24 vCores (1 vCore = 1 physical core)  |- 7 GB per vCore<br>- Provision up to 168 GB|
|Gen5     |- Intel&reg; E5-2673 v4 (Broadwell) 2.3-GHz, Intel&reg; SP-8160 (Skylake)\*, and Intel&reg; 8272CL (Cascade Lake) 2.5 GHz\* processors<br>- Provision up to 80 vCores (1 vCore = 1 hyper-thread)|5.1 GB per vCore<br>- Provision up to 408 GB|

\* In the [sys.dm_user_db_resource_governance](/sql/relational-databases/system-dynamic-management-views/sys-dm-user-db-resource-governor-azure-sql-database) dynamic management view, hardware generation for databases using Intel&reg; SP-8160 (Skylake) processors appears as Gen6, while hardware generation for databases using Intel&reg; 8272CL (Cascade Lake) appears as Gen7. Resource limits for all Gen5 databases are the same regardless of processor type (Broadwell, Skylake, or Cascade Lake).

### Selecting a hardware generation

In the Azure portal, you can select the hardware generation at the time of creation, or you can change the hardware generation of an existing SQL Managed Instance

**To select a hardware generation when creating a SQL Managed Instance**

For detailed information, see [Create a SQL Managed Instance](../managed-instance/instance-create-quickstart.md).

On the **Basics** tab, select the **Configure database** link in the **Compute + storage** section, and then select desired hardware generation:

  ![configure SQL Managed Instance](../database/media/service-tiers-vcore/configure-managed-instance.png)
  
**To change the hardware generation of an existing SQL Managed Instance**

#### [The Azure portal](#tab/azure-portal)

From the SQL Managed Instance page, select **Pricing tier** link placed under the Settings section

![change SQL Managed Instance hardware](../database/media/service-tiers-vcore/change-managed-instance-hardware.png)

On the Pricing tier page, you will be able to change hardware generation as described in the previous steps.

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

For more details, check [az sql mi update](/cli/azure/sql/mi#az_sql_mi_update) command.

---

### Hardware availability

#### <a name="gen4gen5-1"></a> Gen4/Gen5

Gen4 hardware is [being phased out](https://azure.microsoft.com/updates/gen-4-hardware-on-azure-sql-database-approaching-end-of-life-in-2020/) and is no longer available for new deployments. All new databases must be deployed on Gen5 hardware.

Gen5 is available in all public regions worldwide.

## Next steps

- To get started, see [Creating a SQL Managed Instance using the Azure portal](instance-create-quickstart.md)
- For pricing details, see the [Azure SQL Managed Instance pricing page](https://azure.microsoft.com/pricing/details/azure-sql-managed-instance/pools/).
- For details about the specific compute and storage sizes available in the general purpose and business critical service tiers, see [vCore-based resource limits for Azure SQL Managed Instance](resource-limits.md).
