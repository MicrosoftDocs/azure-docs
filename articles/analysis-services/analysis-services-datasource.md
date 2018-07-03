---
title: Data sources supported in Azure Analysis Services | Microsoft Docs
description: Describes data sources supported for data models in Azure Analysis Services.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 07/03/2018
ms.author: owend
ms.reviewer: minewiskan

---
# Data sources supported in Azure Analysis Services

Data sources and connectors shown in Get Data or Import Wizard in Visual Studio are shown for both Azure Analysis Services and SQL Server Analysis Services. However, not all data sources and  connectors shown are supported in Azure Analysis Services. The types of data sources you can connect to depend on many factors such as model compatibility level, available data connectors, authentication type, providers, and On-premises data gateway support. 

## Azure data sources

|Datasource  |In-memory  |DirectQuery  |
|---------|---------|---------|
|Azure SQL Database     |   Yes      |    Yes      |
|Azure SQL Data Warehouse     |   Yes      |   Yes       |
|Azure Blob Storage*     |   Yes       |    No      |
|Azure Table Storage*    |   Yes       |    No      |
|Azure Cosmos DB*     |  Yes        |  No        |
|Azure Data Lake Store*     |   Yes       |    No      |
|Azure HDInsight HDFS*     |     Yes     |   No       |
|Azure HDInsight Spark*     |   Yes       |   No       |
||||

\* Tabular 1400 models only.

**Provider**   
In-memory and DirectQuery models connecting to Azure data sources use .NET Framework Data Provider for SQL Server.

## On-premises data sources

Connecting to on-premises data sources from and Azure AS server require an On-premises gateway. When using a gateway, 64-bit providers are required.

### In-memory and DirectQuery

|Datasource | In-memory provider | DirectQuery provider |
|  --- | --- | --- |
| SQL Server |SQL Server Native Client 11.0, Microsoft OLE DB Provider for SQL Server, .NET Framework Data Provider for SQL Server | .NET Framework Data Provider for SQL Server |
| SQL Server Data Warehouse |SQL Server Native Client 11.0, Microsoft OLE DB Provider for SQL Server, .NET Framework Data Provider for SQL Server | .NET Framework Data Provider for SQL Server |
| Oracle |Microsoft OLE DB Provider for Oracle, Oracle Data Provider for .NET |Oracle Data Provider for .NET | |
| Teradata |OLE DB Provider for Teradata, Teradata Data Provider for .NET |Teradata Data Provider for .NET | |
| | | |

### In-memory only

|Datasource  |  
|---------|---------|
|Access Database     |  
|Active Directory*     |  
|Analysis Services     |  
|Analytics Platform System     |  
|Dynamics CRM*     |  
|Excel workbook     |  
|Exchange*     |  
|Folder*     |
|IBM Informix* (Beta) |
|JSON document*     |  
|Lines from binary*     | 
|MySQL Database     | 
|OData Feed*     |  
|ODBC query     | 
|OLE DB     |   
|Postgre SQL Database*    | 
|Salesforce Objects* |  
|Salesforce Reports* |
|SAP HANA*    |  
|SAP Business Warehouse*    |  
|SharePoint*     |   
|Sybase Database     |  
|XML table*    |  
|||
 
\* Tabular 1400 models only.

## Specifying a different provider

Data models in Azure Analysis Services may require different data providers when connecting to certain data sources. In some cases, tabular models connecting to data sources using native providers such as SQL Server Native Client (SQLNCLI11) may return an error. If using native providers other than SQLOLEDB, you may see error message: **The provider 'SQLNCLI11.1' is not registered**. Or, if you have a DirectQuery model connecting to on-premises data sources and you use native providers, you may see error message: **Error creating OLE DB row set. Incorrect syntax near 'LIMIT'**.

When migrating an on-premises SQL Server Analysis Services tabular model to Azure Analysis Services, it may be necessary to change the provider.

**To specify a provider**

1. In SSDT > **Tabular Model Explorer** > **Data Sources**, right-click a data source connection, and then click **Edit Data Source**.
2. In **Edit Connection**, click **Advanced** to open the Advance properties window.
3. In **Set Advanced Properties** > **Providers**, then select the appropriate provider.

## Impersonation
In some cases, it may be necessary to specify a different impersonation account. Impersonation account can be specified in Visual Studio (SSDT) or SSMS.

For on-premises data sources:

* If using SQL authentication, impersonation should be Service Account.
* If using Windows authentication, set Windows user/password. For SQL Server, Windows authentication with a specific impersonation account is supported only for in-memory data models.

For cloud data sources:

* If using SQL authentication, impersonation should be Service Account.

## Next steps
[On-premises gateway](analysis-services-gateway.md)   
[Manage your server](analysis-services-manage.md)   

