---
title: Migrate Azure SQL Managed Instance to availability zone support 
description: Learn how to migrate your Azure SQL Managed Instance to availability zone support.
author: vladai78
ms.service: sql-database
ms.subservice: managed-instance
ms.topic: conceptual
ms.date: 01/23/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---
 
# Migrate SQL Managed Instance to availability zone support

>[!IMPORTANT]
>Zone redundancy for SQL Managed Instance is currently in Preview. To learn which regions support SQL Instance zone redundancy, see [Services support by region](availability-zones-service-support.md).

SQL Managed Instances offers a zone redundant configuration that uses [Azure availability zones](availability-zones-overview.md#availability-zones) to replicate your instances across multiple physical locations within an Azure region. With zone redundancy enabled, your Business Critical managed instances become resilient to a much larger set of failures, such as catastrophic datacenter outages, without any changes to application logic. For more information on the availability model for SQL Database, see [Business Critical service tier zone redundant availability section in the Azure SQL documentation](/azure/azure-sql/database/high-availability-sla?view=azuresql&tabs=azure-powershell#premium-and-business-critical-service-tier-zone-redundant-availability). 

This guide describes how to migrate SQL Managed Instances that use Business Critical service tier from non-availability zone support to availability zone support. Once the zone redundant option is enabled, Azure SQL Managed Instance will automatically reconfigure the instance. 


## Prerequisites

**To migrate to availability-zone support:**

1. Your instance must be running under Business Critical tier with the November 2022 feature wave update. To learn more about how to onboard an existing SQL managed instance to the November 2022 update, see [November 2022 Feature Wave for Azure SQL Managed Instance](https://techcommunity.microsoft.com/t5/azure-sql-blog/november-2022-feature-wave-for-azure-sql-managed-instance/ba-p/3677741)


1. Your instance must be located in one of the following regions:

    - Australia East
    - Brazil South
    - East US
    - Japan East
    - Korea Central
    - Norway East
    - South Africa North
    - Sweden Central
    - UAE North
    
2. Your instances must be running on standard-series (Gen5) hardware.

## Downtime requirements

All scaling operations in Azure SQL are online operations and so require minimal to no downtime. For more details on Azure SQL dynamic scaling, see [Dynamically scale database resources with minimal downtime](/azure/azure-sql/database/scale-resources?view=azuresql).

## How to enable the zone redundant configuration

You can configure the zone redundant option by using either Azure Portal or ARM API. Support for CLI and PowerShell will be coming in the next several months.

**To enable the zone redundant option:**

# [Azure Portal](#tab/portal)

The following versions of Windows support Storage Explorer:

* Windows 11
* Windows 10
* Windows 8
* Windows 7

For all versions of Windows, Storage Explorer requires .NET Framework 4.7.2 at a minimum.

# [ARM API](#tab/arm)

The following REST API commands can be used to enable the zone redundant configuration using the boolean `zoneRedundant` parameter.

- [Managed Instances - Create Or Update - REST API (Azure SQL Database)](/rest/api/sql/2021-02-01-preview/managed-instances/create-or-update?tabs=HTTP)
- [Managed Instances - Update - REST API (Azure SQL Database)](/rest/api/sql/2021-02-01-preview/managed-instances/update?tabs=HTTP)
- [Managed Instances - Get - REST API (Azure SQL Database)](/rest/api/sql/2021-02-01-preview/managed-instances/get?tabs=HTTP)
 
---

## Next steps

> [!div class="nextstepaction"]
> [Get started with SQL Managed Instance with our Quick Start reference guide](/azure/azure-sql/managed-instance/quickstart-content-reference-guide?view=azuresql)

> [!div class="nextstepaction"]
> [Learn more about Azure SQL Managed Instance zone redundancy and high availability](/azure/azure-sql/database/high-availability-sla?view=azuresql&tabs=azure-powershell#premium-and-business-critical-service-tier-zone-redundant-availability)



