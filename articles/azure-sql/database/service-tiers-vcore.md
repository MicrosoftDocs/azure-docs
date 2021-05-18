---
title: vCore purchasing model overview
titleSuffix: Azure SQL Database & Azure SQL Managed Instance 
description: The vCore purchasing model lets you independently scale compute and storage resources, match on-premises performance, and optimize price for Azure SQL Database and Azure SQL Managed Instance.
services: sql-database
ms.service: sql-db-mi
ms.subservice: features
ms.topic: conceptual
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sashan, moslake
ms.date: 05/18/2021
---
# vCore model overview - Azure SQL Database and Azure SQL Managed Instance 
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

The virtual core (vCore) purchasing model used by Azure SQL Database and Azure SQL Managed Instance provides several benefits:

- Higher compute, memory, I/O, and storage limits.
- Control over the hardware generation to better match compute and memory requirements of the workload.
- Pricing discounts for [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md) and [Reserved Instance (RI)](reserved-capacity-overview.md).
- Greater transparency in the hardware details that power the compute, that facilitates planning for migrations from on-premises deployments.

## Service tiers

- For information on Azure SQL Database service tiers for the vCore model, see [vCore model overview - Azure SQL Database](service-tiers-sqldb-vcore.md).
- For information on Azure SQL Managed Instance service tiers for the vCore model, see [vCore model overview - Azure SQL Managed Instance](../managed-instance/service-tiers-mi-vcore.md).

## Next steps

To get started, see: 
- [Creating a SQL Database using the Azure portal](single-database-create-quickstart.md)
- [Creating a SQL Managed Instance using the Azure portal](../managed-instance/instance-create-quickstart.md)

For pricing details, see the [Azure SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/single/).

For details about the specific compute and storage sizes available in the general purpose and business critical service tiers, see:

- [vCore-based resource limits for Azure SQL Database](resource-limits-vcore-single-databases.md).
- [vCore-based resource limits for pooled Azure SQL Database](resource-limits-vcore-elastic-pools.md).
- [vCore-based resource limits for Azure SQL Managed Instance](../managed-instance/resource-limits.md).
