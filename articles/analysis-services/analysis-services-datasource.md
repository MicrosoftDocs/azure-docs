---
title: Data sources supported in Azure Analysis Services | Microsoft Docs
description: Describes data sources supported for data models in Azure Analysis Services.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: erikre
editor: ''
tags: ''

ms.assetid: 6ec63319-ff9b-4b01-a1cd-274481dc8995
ms.service: analysis-services
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: na
ms.date: 06/01/2017
ms.author: owend

---
# Data sources supported in Azure Analysis Services
Azure Analysis Services servers support connecting to data sources in the cloud and on-premises in your organization. Additional supported data sources are being added all the time. Check back often. 

The following data sources are currently supported:

| Cloud  |
|---|
| Azure Blob Storage*  |
| Azure SQL Database  |
| Azure Data Warehouse |


| On-premises  |   |   |   |
|---|---|---|---|
| Access Database  | Folder* | Oracle Database  | Teradata Database |
| Active Directory*  | JSON document*  | Postgre SQL Database*  |XML table* |
| Analysis Services  | Lines from binary*  | SAP HANA*  |
| Analytics Platform System  | MySQL Database  | SAP Business Warehouse*  | |
| Dynamics CRM*  | OData Feed*  | SharePoint*  |
| Excel workbook  | ODBC query  | SQL Database  |
| Exchange*  | OLE DB  | Sybase Database  |

\* Tabular 1400 models only. 

> [!IMPORTANT]
> Connecting to on-premises data sources require an [On-premises data gateway](analysis-services-gateway.md) installed on a computer in your environment.

## Data providers

Data models in Azure Analysis Services may require different data providers when connecting to certain data sources. In some cases, tabular models connecting to data sources using native providers such as SQL Server Native Client (SQLNCLI11) may return an error.

For data models that connect to a cloud data source such as Azure SQL Database, if you use native providers other than SQLOLEDB, you may see error message: **“The provider 'SQLNCLI11.1' is not registered.”** Or, if you have a DirectQuery model connecting to on-premises data sources, if you use native providers you may see error message: **“Error creating OLE DB row set. Incorrect syntax near 'LIMIT'”**.

The following datasource providers are supported for in-memory or DirectQuery data models when connecting to data sources in the cloud or on-premises:

### Cloud
| **Datasource** | **In-memory** | **DirectQuery** |
|  --- | --- | --- |
| Azure SQL Data Warehouse |.NET Framework Data Provider for SQL Server |.NET Framework Data Provider for SQL Server |
| Azure SQL Database |.NET Framework Data Provider for SQL Server |.NET Framework Data Provider for SQL Server | |

### On-premises (via Gateway)
|**Datasource** | **In-memory** | **DirectQuery** |
|  --- | --- | --- |
| SQL Server |SQL Server Native Client 11.0 |.NET Framework Data Provider for SQL Server |
| SQL Server |Microsoft OLE DB Provider for SQL Server |.NET Framework Data Provider for SQL Server | |
| SQL Server |.NET Framework Data Provider for SQL Server |.NET Framework Data Provider for SQL Server | |
| Oracle |Microsoft OLE DB Provider for Oracle |Oracle Data Provider for .NET | |
| Oracle |Oracle Data Provider for .NET |Oracle Data Provider for .NET | |
| Teradata |OLE DB Provider for Teradata |Teradata Data Provider for .NET | |
| Teradata |Teradata Data Provider for .NET |Teradata Data Provider for .NET | |
| Analytics Platform System |.NET Framework Data Provider for SQL Server |.NET Framework Data Provider for SQL Server | |

> [!NOTE]
> Ensure 64-bit providers are installed when using On-premises gateway.
> 
> 

When migrating an on-premises SQL Server Analysis Services tabular model to Azure Analysis Services, it may be necessary to change the provider.

**To specify a datasource provider**

1. In SSDT > **Tabular Model Explorer** > **Data Sources**, right-click a data source connection, and then click **Edit Data Source**.
2. In **Edit Connection**, click **Advanced** to open the Advance properties window.
3. In **Set Advanced Properties** > **Providers**, then select the appropriate provider.

## Impersonation
In some cases, it may be necessary to specify a different impersonation account. Impersonation account can be specified in SSDT or SSMS.

For on-premises data sources:

* If using SQL authentication, impersonation should be Service Account.
* If using Windows authentication, set Windows user/password. For SQL Server, Windows authentication with a specific impersonation account is supported only for in-memory data models.

For cloud data sources:

* If using SQL authentication, impersonation should be Service Account.

## Next steps
If you have on-premises data sources, be sure to install the [On-premises gateway](analysis-services-gateway.md).   
To learn more about managing your server in SSDT or SSMS, see [Manage your server](analysis-services-manage.md).

