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

This guide describes how to migrate SQL Managed Instances that use Business Critical service tier from non-availability zone support to availability zone support.

SQL Managed Instances offers a zone redundant configuration that uses [Azure availability zones](availability-zones-overview.md#availability-zones) to replicate your instances across multiple physical locations within an Azure region. With zone redundancy enabled, your Business Critical managed instances become resilient to a much larger set of failures, such as catastrophic datacenter outages, without any changes to application logic. For more information on the availability model for SQL Database, see [Business Critical service tier zone redundant availability section in the Azure SQL documentation](/azure/azure-sql/database/high-availability-sla?view=azuresql&tabs=azure-powershell#premium-and-business-critical-service-tier-zone-redundant-availability). 


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


## How to enable the zone redundant configuration

Zone redundant configuration can be enabled for all Business Critical instances that have received the November 2022 feature wave update – to learn more about November 2022 feature wave, see [November 2022 Feature Wave for Azure SQL Managed Instance](https://techcommunity.microsoft.com/t5/azure-sql-blog/november-2022-feature-wave-for-azure-sql-managed-instance/ba-p/3677741)

Once the zone redundant option is enabled, Azure SQL Managed Instance will automatically reconfigure the instance. You can configure this setting by using Portal or ARM API. The support for CLI and PowerShell will be coming in the next several months.

## Next steps

> [!div class="nextstepaction"]
> [Get started with SQL Managed Instance with our Quick Start reference guide](/azure/azure-sql/managed-instance/quickstart-content-reference-guide?view=azuresql)

> [!div class="nextstepaction"]
> [Learn more about Azure SQL Managed Instance zone redundancy and high availability](/azure/azure-sql/database/high-availability-sla?view=azuresql&tabs=azure-powershell#premium-and-business-critical-service-tier-zone-redundant-availability)



