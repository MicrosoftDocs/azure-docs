---
title: Data sources supported in Azure Analysis Services | Microsoft Docs
description: Describes data sources supported for data models in Azure Analysis Services.
author: minewiskan
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: owend
ms.reviewer: minewiskan

---
# Data sources supported in Azure Analysis Services

Data sources and connectors shown in Get Data or Import Wizard in Visual Studio are shown for both Azure Analysis Services and SQL Server Analysis Services. However, not all data sources and  connectors shown are supported in Azure Analysis Services. The types of data sources you can connect to depend on many factors such as model compatibility level, available data connectors, authentication type, providers, and On-premises data gateway support. 

## Azure data sources

|Data source  |In-memory  |DirectQuery  |
|---------|---------|---------|
|Azure SQL Database<sup>[2](#azsqlmanaged)</sup>     |   Yes      |    Yes      |
|Azure SQL Data Warehouse     |   Yes      |   Yes       |
|Azure Blob Storage<sup>[1](#tab1400a)</sup>     |   Yes       |    No      |
|Azure Table Storage<sup>[1](#tab1400a)</sup>    |   Yes       |    No      |
|Azure Cosmos DB<sup>[1](#tab1400a)</sup>     |  Yes        |  No        |
|Azure Data Lake Store (Gen1)<sup>[1](#tab1400a)</sup>, <sup>[4](#gen2)</sup>      |   Yes       |    No      |
|Azure HDInsight HDFS<sup>[1](#tab1400a)</sup>     |     Yes     |   No       |
|Azure HDInsight Spark<sup>[1](#tab1400a)</sup>, <sup>[3](#databricks)</sup>     |   Yes       |   No       |
||||

<a name="tab1400a">1</a> - Tabular 1400 and higher models only.   
<a name="azsqlmanaged">2</a> - Azure SQL Database Managed Instance is supported. Because managed instance runs within Azure VNet with a private IP address, public endpoint must be enabled on the instance. If not enabled, an on-premises Data Gateway is required.    
<a name="databricks">3</a> - Azure Databricks using the Spark connector is currently not supported.   
<a name="gen2">4</a> - ADLS Gen2 is currently not supported.


**Provider**   
In-memory and DirectQuery models connecting to Azure data sources use .NET Framework Data Provider for SQL Server.

## Other data sources

Connecting to on-premises data sources from and Azure AS server require an On-premises gateway. When using a gateway, 64-bit providers are required.

### In-memory and DirectQuery

|Data source | In-memory provider | DirectQuery provider |
|  --- | --- | --- |
| SQL Server |SQL Server Native Client 11.0, Microsoft OLE DB Provider for SQL Server, .NET Framework Data Provider for SQL Server | .NET Framework Data Provider for SQL Server |
| SQL Server Data Warehouse |SQL Server Native Client 11.0, Microsoft OLE DB Provider for SQL Server, .NET Framework Data Provider for SQL Server | .NET Framework Data Provider for SQL Server |
| Oracle | OLE DB Provider for Oracle, Oracle Data Provider for .NET |Oracle Data Provider for .NET |
| Teradata |OLE DB Provider for Teradata, Teradata Data Provider for .NET |Teradata Data Provider for .NET |
| | | |

### In-memory only

|Data source  |  
|---------|
|Access Database     |  
|Active Directory<sup>[1](#tab1400b)</sup>     |  
|Analysis Services     |  
|Analytics Platform System     |  
|CSV file  |
|Dynamics CRM<sup>[1](#tab1400b)</sup>     |  
|Excel workbook     |  
|Exchange<sup>[1](#tab1400b)</sup>     |  
|Folder<sup>[1](#tab1400b)</sup>     |
|IBM Informix<sup>[1](#tab1400b)</sup> (Beta) |
|JSON document<sup>[1](#tab1400b)</sup>     |  
|Lines from binary<sup>[1](#tab1400b)</sup>     | 
|MySQL Database     | 
|OData Feed<sup>[1](#tab1400b)</sup>     |  
|ODBC query     | 
|OLE DB     |   
|PostgreSQL Database<sup>[1](#tab1400b)</sup>    | 
|Salesforce Objects<sup>[1](#tab1400b)</sup> |  
|Salesforce Reports<sup>[1](#tab1400b)</sup> |
|SAP HANA<sup>[1](#tab1400b)</sup>    |  
|SAP Business Warehouse<sup>[1](#tab1400b)</sup>    |  
|SharePoint List<sup>[1](#tab1400b)</sup>, <sup>[2](#filesSP)</sup>     |   
|Sybase Database     |  
|TXT file  |
|XML table<sup>[1](#tab1400b)</sup>    |  
||
 
<a name="tab1400b">1</a> - Tabular 1400 and higher models only.   
<a name="filesSP">2</a> - Files in on-premises SharePoint are not supported.

## Specifying a different provider

Data models in Azure Analysis Services may require different data providers when connecting to certain data sources. In some cases, tabular models connecting to data sources using native providers such as SQL Server Native Client (SQLNCLI11) may return an error. If using native providers other than SQLOLEDB, you may see error message: **The provider 'SQLNCLI11.1' is not registered**. Or, if you have a DirectQuery model connecting to on-premises data sources and you use native providers, you may see error message: **Error creating OLE DB row set. Incorrect syntax near 'LIMIT'**.

When migrating an on-premises SQL Server Analysis Services tabular model to Azure Analysis Services, it may be necessary to change the provider.

**To specify a provider**

1. In Visual Studio > **Tabular Model Explorer** > **Data Sources**, right-click a data source connection, and then click **Edit Data Source**.
2. In **Edit Connection**, click **Advanced** to open the Advance properties window.
3. In **Set Advanced Properties** > **Providers**, then select the appropriate provider.

## Impersonation
In some cases, it may be necessary to specify a different impersonation account. Impersonation account can be specified in Visual Studio or SSMS.

For on-premises data sources:

* If using SQL authentication, impersonation should be Service Account.
* If using Windows authentication, set Windows user/password. For SQL Server, Windows authentication with a specific impersonation account is supported only for in-memory data models.

For cloud data sources:

* If using SQL authentication, impersonation should be Service Account.

## OAuth credentials

For tabular models at the 1400 and higher compatibility level, Azure SQL Database, Azure SQL Data Warehouse, Dynamics 365, and SharePoint List support OAuth credentials. Azure Analysis Services manages token refresh for OAuth data sources to avoid timeouts for long-running refresh operations. To generate valid tokens, set credentials by using SSMS.

## Next steps
[On-premises gateway](analysis-services-gateway.md)   
[Manage your server](analysis-services-manage.md)   

