---
title: Data sources supported in Azure Analysis Services | Microsoft Docs
description: Describes data sources and connectors supported for tabular 1200 and higher data models in Azure Analysis Services.
author: minewiskan
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 11/22/2019
ms.author: owend
ms.reviewer: minewiskan

---
# Data sources supported in Azure Analysis Services

Data sources and connectors shown in Get Data or Import Wizard in Visual Studio are shown for both Azure Analysis Services and SQL Server Analysis Services. However, not all data sources and connectors shown are supported in Azure Analysis Services. The types of data sources you can connect to depend on many factors such as model compatibility level, available data connectors, authentication type, providers, and On-premises data gateway support. The following tables describe supported data sources for Azure Analysis Services.

## Azure data sources

|Data source  |In-memory  |DirectQuery  |Notes |
|---------|---------|---------|---------|
|Azure SQL Database      |   Yes      |    Yes      |<sup>[2](#azprovider)</sup>, <sup>[3](#azsqlmanaged)</sup>|
|Azure SQL Data Warehouse      |   Yes      |   Yes       |<sup>[2](#azprovider)</sup>|
|Azure Blob Storage      |   Yes       |    No      | <sup>[1](#tab1400a)</sup> |
|Azure Table Storage <sup>[1](#tab1400a)</sup>    |   Yes       |    No      |<sup>[1](#tab1400a)</sup>|
|Azure Cosmos DB     |  Yes        |  No        |<sup>[1](#tab1400a)</sup> |
|Azure Data Lake Store Gen1      |   Yes       |    No      |<sup>[1](#tab1400a)</sup> |
|Azure Data Lake Store Gen2       |   Yes       |    No      |<sup>[1](#tab1400a)</sup>, <sup>[5](#gen2)</sup>|
|Azure HDInsight HDFS    |     Yes     |   No       |<sup>[1](#tab1400a)</sup> |
|Azure HDInsight Spark     |   Yes       |   No       |<sup>[1](#tab1400a)</sup>, <sup>[4](#databricks)</sup>|
||||

**Notes:**   
<a name="tab1400a">1</a> - Tabular 1400 and higher models only.  
<a name="azprovider">2</a> - For tabular 1200 models, or when specified as a *provider* data source in tabular 1400+ models, both in-memory and DirectQuery models require .NET Framework Data Provider for SQL Server.    
<a name="azsqlmanaged">3</a> - Azure SQL Database Managed Instance is supported. Because managed instance runs within Azure VNet with a private IP address, public endpoint must be enabled on the instance. If not enabled, an on-premises Data Gateway is required.    
<a name="databricks">4</a> - Azure Databricks using the Spark connector is currently not supported.   
<a name="gen2">5</a> - ADLS Gen2 connector is currently not supported, however, Azure Blob Storage connector can be used with an ADLS Gen2 data source.   

## Other data sources

|Data source | In-memory | DirectQuery |Notes   |
|  --- | --- | --- | --- |
|Access Database     |  Yes | No |  |
|Active Directory     |  Yes | No | <sup>[6](#tab1400b)</sup>  |
|Analysis Services     |  Yes | No |  |
|Analytics Platform System     |  Yes | No |  |
|CSV file  |Yes | No |  |
|Dynamics CRM     |  Yes | No | <sup>[6](#tab1400b)</sup> |
|Excel workbook     |  Yes | No |  |
|Exchange      |  Yes | No | <sup>[6](#tab1400b)</sup> |
|Folder      |Yes | No | <sup>[6](#tab1400b)</sup> |
|IBM Informix  |Yes | No |  |
|JSON document      |  Yes | No | <sup>[6](#tab1400b)</sup> |
|Lines from binary      | Yes | No | <sup>[6](#tab1400b)</sup> |
|MySQL Database     | Yes | No |  |
|OData Feed      |  Yes | No | <sup>[6](#tab1400b)</sup> |
|ODBC query     | Yes | No |  |
|OLE DB     |   Yes | No |  |
|Oracle  | Yes  |Yes  | <sup>[9](#oracle)</sup> |
|PostgreSQL Database   | Yes | No | <sup>[6](#tab1400b)</sup> |
|Salesforce Objects|  Yes | No | <sup>[6](#tab1400b)</sup> |
|Salesforce Reports |Yes | No | <sup>[6](#tab1400b)</sup> |
|SAP HANA     |  Yes | No |  |
|SAP Business Warehouse    |  Yes | No | <sup>[6](#tab1400b)</sup> |
|SharePoint List      |   Yes | No | <sup>[6](#tab1400b)</sup>, <sup>[11](#filesSP)</sup> |
|SQL Server |Yes   | Yes  | <sup>[7](#sqlim)</sup>, <sup>[8](#sqldq)</sup> | 
|SQL Server Data Warehouse |Yes   | Yes  | <sup>[7](#sqlim)</sup>, <sup>[8](#sqldq)</sup> |
|Sybase Database     |  Yes | No |  |
|Teradata | Yes  | Yes  | <sup>[10](#teradata)</sup> |
|TXT file  |Yes | No |  |
|XML table    |  Yes | No | <sup>[6](#tab1400b)</sup> |
| | | |

**Notes:**   
<a name="tab1400b">6</a> - Tabular 1400 and higher models only.  
<a name="sqlim">7</a> - For in-memory tabular 1200 models, or as a *provider* data source in in-memory tabular 1400+ models, specify Microsoft OLE DB Driver for SQL Server MSOLEDBSQL (recommended), SQL Server Native Client 11.0, or .NET Framework Data Provider for SQL Server.   
<a name="sqldq">8</a> - For DirectQuery tabular 1200 models, or as a *provider* data source in DirectQuery tabular 1400+ models, specify .NET Framework Data Provider for SQL Server.   
<a name="oracle">9</a> - For tabular 1200 models, or as a *provider* data source in a tabular 1400+ models, specify Oracle Data Provider for .NET.   
<a name="teradata">10</a> - For tabular 1200 models, or as a *provider* data source in a tabular 1400+ models, specify Teradata Data Provider for .NET.   
<a name="filesSP">11</a> - Files in on-premises SharePoint are not supported.

Connecting to on-premises data sources from an Azure Analysis Services server require an On-premises gateway. When using a gateway, 64-bit providers are required. 

## Understanding providers

For tabular 1400 and higher models, by default, you do not specify a provider when connecting to a data source. Tabular 1400 and higher models use the [Power Query](/power-query/power-query-what-is-power-query.md) connectors to manage connections and data queries between the data source and Analysis Services. You can, however, still specify certain data sources as a provider data source by directly modifying the Model.bim file. Doing so may provide improved performance by specifying OLE DB providers for in-memory models.

In tabular 1200 and lower data models, connections to any data source require a provider. A default provider is selected for you when using the Import Wizard in Visual Studio. In some cases, more than one type of provider is available; however, only one provider can be specified. The type of provider you choose can depend on whether or not the model is using in-memory storage or DirectQuery and which Analysis Services platform you deploy your model to.

### Specifying a different provider

For tabular 1200 models and tabular 1400 and higher data models in Azure Analysis Services, a different data provider may be required when connecting to certain data sources. Also when migrating an on-premises SQL Server Analysis Services tabular model to Azure Analysis Services, it may also be necessary to change the provider.

**To specify a provider in Visual Studio**

1. In Visual Studio > **Tabular Model Explorer** > **Data Sources**, right-click a data source connection, and then click **Edit Data Source**.
2. In **Edit Connection**, click **Advanced** to open the Advance properties window.
3. In **Set Advanced Properties** > **Providers**, then select the appropriate provider.

**To specify a provider directly in Model.bim**

Use TMSL to specify the **Provider** property in the [DataSource object](/bi-reference/tmsl/datasources-object-tmsl.md).

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

