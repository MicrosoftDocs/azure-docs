---
title: Migrate Azure SQL Managed Instance to availability zone support 
description: Learn how to migrate your Azure SQL Managed Instance to availability zone support.
author: vladai78
ms.service: sql-database
ms.topic: conceptual
ms.date: 05/25/2023
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---
 
# Migrate SQL Managed Instance to availability zone support

>[!IMPORTANT]
>Zone redundancy for SQL Managed Instance is currently in Preview. To learn which regions support SQL Instance zone redundancy, see [Services support by region](availability-zones-service-support.md).

SQL Managed Instance offers a zone redundant configuration that uses [Azure availability zones](availability-zones-overview.md#zonal-and-zone-redundant-services) to replicate your instances across multiple physical locations within an Azure region. With zone redundancy enabled, your Business Critical managed instances become resilient to a larger set of failures, such as catastrophic datacenter outages, without any changes to application logic. For more information on the availability model for SQL Database, see [Business Critical service tier zone redundant availability section in the Azure SQL documentation](/azure/azure-sql/database/high-availability-sla?view=azuresql&tabs=azure-powershell&preserve-view=true#premium-and-business-critical-service-tier-zone-redundant-availability). 

This guide describes how to migrate SQL Managed Instances that use Business Critical service tier from non-availability zone support to availability zone support. Once the zone redundant option is enabled, Azure SQL Managed Instance automatically reconfigures the instance. 


## Prerequisites

**To migrate to availability-zone support:**

1. Your instance must be running under Business Critical tier with the November 2022 feature wave update. To learn more about how to onboard an existing SQL managed instance to the November 2022 update, see [November 2022 Feature Wave for Azure SQL Managed Instance](https://techcommunity.microsoft.com/t5/azure-sql-blog/november-2022-feature-wave-for-azure-sql-managed-instance/ba-p/3677741)


1. Confirm that your instance is located in a supported region. To see the list of supported regions, see [Premium and Business Critical service tier zone redundant availability](/azure/azure-sql/database/high-availability-sla?view=azuresql&preserve-view=true&tabs=azure-powershell#premium-and-business-critical-service-tier-zone-redundant-availability):

    
1. Your instances must be running on standard-series (Gen5) hardware.

## Downtime requirements

All scaling operations in Azure SQL are online operations and require minimal to no downtime. For more details on Azure SQL dynamic scaling, see [Dynamically scale database resources with minimal downtime](/azure/azure-sql/database/scale-resources?view=azuresql&preserve-view=true).

## How to enable the zone redundant configuration

You can configure the zone redundant option by using either Azure portal or ARM API.

**To enable the zone redundant option:**

# [Azure portal](#tab/portal)


To update a current Business Critical managed instance to use a zone redundant configuration:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to the instance of SQL Managed Instance that you want to enable for zone redundancy.

1. In the Create Azure SQL Managed Instance tab, select **Configure Managed Instance**.

1. In the **Compute + Storage** page, select **Yes** to make the instance zone redundant.

1. For **Backup storage redundancy**, choose one of the compatible redundancy options:
    
    - ZRS (Zone Redundant Storage)
    - GZRS (Geo Zone Redundant Storage)

    To learn more about backup storage redundancy options, see [Introducing Geo-Zone Redundant Storage (GZRS) for Azure SQL Managed Instance backups](https://techcommunity.microsoft.com/t5/azure-sql-blog/introducing-geo-zone-redundant-storage-gzrs-for-azure-sql/ba-p/3654947).

1. Select **Apply**.

# [ARM API](#tab/arm)

Use the following REST API commands to enable zone redundant configuration with the boolean `zoneRedundant` parameter.

- [Azure SQL Managed Instances - Create Or Update - REST API (Azure SQL Database)](/rest/api/sql/2021-02-01-preview/managed-instances/create-or-update?tabs=HTTP)
- [Azure SQL Managed Instances - Update - REST API (Azure SQL Database)](/rest/api/sql/2021-02-01-preview/managed-instances/update?tabs=HTTP)
- [Azure SQL Managed Instances - Get - REST API (Azure SQL Database)](/rest/api/sql/2021-02-01-preview/managed-instances/get?tabs=HTTP)
 
---

## Next steps

> [!div class="nextstepaction"]
> [Get started with SQL Managed Instance with our Quick Start reference guide](/azure/azure-sql/managed-instance/quickstart-content-reference-guide?view=azuresql&preserve-view=true)

> [!div class="nextstepaction"]
> [Learn more about Azure SQL Managed Instance zone redundancy and high availability](/azure/azure-sql/database/high-availability-sla?view=azuresql&preserve-view=truetabs=azure-powershell#premium-and-business-critical-service-tier-zone-redundant-availability)



