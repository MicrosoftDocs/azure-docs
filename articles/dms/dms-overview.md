---
title: What is Azure Database Migration Service?
description: Overview of Azure Database Migration Service, which provides seamless migrations from many database sources to Azure Data platforms.
author: abhims14
ms.author: abhishekum
ms.reviewer: randolphwest
ms.date: 02/08/2023
ms.service: dms
ms.topic: overview
---
# What is Azure Database Migration Service?

Azure Database Migration Service is a fully managed service designed to enable seamless migrations from multiple database sources to Azure data platforms with minimal downtime (online migrations).

With Azure Database Migration Service currently we offer two versions:

1. Database Migration Service - via [Azure SQL migration extension for Azure Data Studio](./migration-using-azure-data-studio.md), [Azure portal](https://portal.azure.com/#create/Microsoft.AzureDMS), PowerShell and Azure CLI.
1. Database Migration Service (classic) - via Azure portal, PowerShell and Azure CLI.

**Database Migration Service** powers the "Azure SQL Migration" extension for Azure Data Studio, and provides more features. Azure portal, PowerShell and Azure CLI can also be used to access DMS. Currently, it supports SQL Database modernization to Azure. For improved functionality and supportability, consider migrating to Azure SQL Database by using the DMS.

**Database Migration Service (classic)** via Azure portal, PowerShell and Azure CLI is an older version of the Azure Database Migration Service. It offers database modernization to Azure and support scenarios like – SQL Server, PostgreSQL, MySQL, and MongoDB.

[!INCLUDE [Azure Database Migration Service (classic) - SQL scenarios retirement announcement](../../includes/deprecation-announcement-dms-classic-sql.md)]

[!INCLUDE [database-migration-service-ads](../../includes/database-migration-service-ads.md)]

## Compare versions

Newer version of the Azure Database Migration Service is available as an extension for Azure Data Studio and can be accesses from Azure portal, which improved the functionality, user experience and supportability of the migration service. Consider using the [Azure SQL migration extension for Azure Data Studio](./migration-using-azure-data-studio.md) and DMS Azure portal whenever possible. 

The following table compares the functionality of the versions of the Database Migration Service: 

|Feature  |DMS(classic) |DMS - via Azure SQL extension for ADS|DMS - via Azure portal |Notes| 
|---------|---------|---------|---------|---------|
|Assessment | No | Yes | No | Assess compatibility of the source.         |
|SKU recommendation | No  | Yes | No | SKU recommendations for the target based on the assessment of the source.       |
|Azure SQL Database - Offline migration | Yes | Yes | Yes | Migrate to Azure SQL Database offline. |
|Azure SQL Managed Instance - Online migration  | Yes  |Yes | Yes | Migrate to Azure SQL Managed Instance online with minimal downtime. |
|Azure SQL Managed Instance - Offline migration | Yes |Yes  | Yes | Migrate to Azure SQL Managed Instance offline.    |
|SQL Server on Azure SQL VM - Online migration  | No | Yes  | Yes |Migrate to SQL Server on Azure VMs online with minimal downtime.|
|SQL Server on Azure SQL VM - Offline migration | Yes |Yes  | Yes |  Migrate to SQL Server on Azure VMs offline.  |
|Migrate logins|Yes  | Yes  | No | Migrate logins from your source to your target.|
|Migrate schemas| Yes  | No  | No | Migrate schemas from your source to your target. |
|Azure portal support |Yes  | Partial  | Yes | Create and Monitor your migration by using the Azure portal. |
|Integration with Azure Data Studio | No  | Yes  | No | Migration support integrated with Azure Data Studio. |
|Regional availability|Yes  |Yes  | Yes | More regions are available with the extension. |
|Improved user experience| No  | Yes  | Yes | The DMS is faster, more secure, and easier to troubleshoot. |
|Automation| Yes | Yes  | Yes |The DMS supports PowerShell and Azure CLI. |
|Private endpoints| No | Yes| Yes | Connect to your source and target using private endpoints.
|TDE support|No  | Yes  | No |Migrate databases encrypted with TDE. |

## Migrate databases to Azure with familiar tools

Azure Database Migration Service integrates some of the functionality of our existing tools and services. It provides customers with a comprehensive, highly available solution. The service uses the [Data Migration Assistant](/sql/dma/dma-overview) to generate assessment reports that provide recommendations to guide you through the required changes before a migration. It's up to you to perform any remediation required. Azure Database Migration Service performs all the required steps when ready to begin the migration process. Knowing that the process takes advantage of Microsoft's best practices, you can fire and forget your migration projects with peace of mind. 

## Regional availability

For up-to-date info about the regional availability of Azure Database Migration Service, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration).

## Next steps

* [Status of migration scenarios supported by Azure Database Migration Service](./resource-scenario-status.md)
* [Services and tools available for data migration scenarios](./dms-tools-matrix.md)
* [Migrate databases with Azure SQL Migration extension for Azure Data Studio](./migration-using-azure-data-studio.md)
* [FAQ about using Azure Database Migration Service](./faq.yml)

