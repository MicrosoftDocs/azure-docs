---
title: Learn about data sources supported in Azure Analysis Services | Microsoft Docs
description: Describes data sources and connectors supported for tabular 1200 and higher data models in Azure Analysis Services.
author: minewiskan
ms.service: analysis-services
ms.topic: conceptual
ms.date: 01/27/2023
ms.author: owend
ms.reviewer: minewiskan

---
# Data sources supported in Azure Analysis Services

Data sources and connectors shown in Get Data or Table Import Wizard in Visual Studio with Analysis Services projects are shown for both Azure Analysis Services and SQL Server Analysis Services. However, not all data sources and connectors shown are supported in Azure Analysis Services. The types of data sources you can connect to depend on many factors such as model compatibility level, available data connectors, authentication type, and On-premises data gateway support. The following tables describe supported data sources for Azure Analysis Services.

## Azure data sources

|Data source  |In-memory  |DirectQuery  |Notes |
|---------|---------|---------|---------|
|Azure SQL Database      |   Yes      |    Yes      |<sup>[2](#azprovider)</sup>, <sup>[3](#azsqlmanaged)</sup>|
|Azure Synapse Analytics (SQL DW)      |   Yes      |   Yes       |<sup>[2](#azprovider)</sup>|
|Azure Blob Storage      |   Yes       |    No      | <sup>[1](#tab1400a)</sup> |
|Azure Table Storage     |   Yes       |    No      | <sup>[1](#tab1400a)</sup>|
|Azure Cosmos DB     |  Yes        |  No        |<sup>[1](#tab1400a)</sup> |
|Azure Data Lake Store Gen1      |   Yes       |    No      |<sup>[1](#tab1400a)</sup> |
|Azure Data Lake Store Gen2       |   Yes       |    No      |<sup>[1](#tab1400a)</sup>, <sup>[5](#gen2)</sup>|
|Azure HDInsight HDFS    |     Yes     |   No       |<sup>[1](#tab1400a)</sup> |
|Azure HDInsight Spark     |   Yes       |   No       |<sup>[1](#tab1400a)</sup>, <sup>[4](#databricks)</sup>|
||||

**Notes:**

<a name="tab1400a">1</a> - Tabular 1400 and higher models only.  
<a name="azprovider">2</a> - When specified as a *provider* data source in tabular 1200 and higher models, both in-memory and DirectQuery models require Microsoft OLE DB Driver for SQL Server MSOLEDBSQL (recommended) or .NET Framework Data Provider for SQL Server.  
<a name="azsqlmanaged">3</a> - Azure SQL Managed Instance is supported. Because SQL Managed Instance runs within Azure VNet with a private IP address, public endpoint must be enabled on the instance. If not enabled, an [On-premises data gateway](analysis-services-gateway.md) is required.  
<a name="databricks">4</a> - Azure Databricks using the Spark connector is currently not supported.  
<a name="gen2">5</a> - ADLS Gen2 connector is currently not supported, however, Azure Blob Storage connector can be used with an ADLS Gen2 data source.

## Other data sources

Connecting to on-premises data sources from an Azure Analysis Services server require an [On-premises gateway](analysis-services-gateway.md). When using a gateway, 64-bit providers are required.

|Data source | In-memory | DirectQuery |Notes   |
|  --- | --- | --- | --- |
|Access Database     |  Yes | No |  |
|Active Directory     |  Yes | No | <sup>[6](#tab1400b)</sup>  |
|Analysis Services     |  Yes | No |  |
|Analytics Platform System     |  Yes | No |  |
|CSV file  |Yes | No |  |
|Dynamics 365     |  Yes | No | <sup>[6](#tab1400b)</sup>, <sup>[12](#tds)</sup> |
|Excel workbook     |  Yes | No |  |
|Exchange      |  Yes | No | <sup>[6](#tab1400b)</sup> |
|Folder      |Yes | No | <sup>[6](#tab1400b)</sup> |
|IBM Informix  |Yes | No |  |
|JSON document      |  Yes | No | <sup>[6](#tab1400b)</sup> |
|Lines from binary      | Yes | No | <sup>[6](#tab1400b)</sup> |
|MySQL Database     | Yes | No | <sup>[13](#mysql)</sup> |
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
|SQL Server |Yes   | Yes  | <sup>[7](#sqlim)</sup>, <sup>[8](#instgw)</sup> |
|SQL Server Data Warehouse |Yes   | Yes  | <sup>[7](#sqlim)</sup>, <sup>[8](#instgw)</sup> |
|Sybase Database     |  Yes | No |  |
|Teradata | Yes  | Yes  | <sup>[10](#teradata)</sup> |
|TXT file  |Yes | No |  |
|XML table    |  Yes | No | <sup>[6](#tab1400b)</sup> |
| | | |

**Notes:**  
<a name="tab1400b">6</a> - Tabular 1400 and higher models only.  
<a name="sqlim">7</a> - When specified as a *provider* data source in tabular 1200 and higher models, specify Microsoft OLE DB Driver for SQL Server MSOLEDBSQL (recommended), SQL Server Native Client 11.0, or .NET Framework Data Provider for SQL Server.  
<a name="instgw">8</a> - If specifying MSOLEDBSQL as the data provider, it may be necessary to download and install the [Microsoft OLE DB Driver for SQL Server](/sql/connect/oledb/oledb-driver-for-sql-server) on the same computer as the On-premises data gateway.  
<a name="oracle">9</a> - For tabular 1200 models, or as a *provider* data source in tabular 1400+ models, specify Oracle Data Provider for .NET. If specified as a structured data source, be sure to [enable Oracle managed provider](#enable-oracle-managed-provider).   
<a name="teradata">10</a> - For tabular 1200 models, or as a *provider* data source in tabular 1400+ models, specify Teradata Data Provider for .NET.  
<a name="filesSP">11</a> - Files in on-premises SharePoint aren't supported.  
<a name="tds">12</a> - Azure Analysis Services doesn't support direct connections to the Dynamics 365 [Dataverse TDS endpoint](/power-apps/developer/data-platform/dataverse-sql-query). When connecting to this data source from Azure Analysis Services, you must use an On-premises Data Gateway and refresh the tokens manually.  
<a name="mysql">13</a> - Azure Analysis Services doesn't support direct connections to MySQL databases. When connecting to this data source from Azure Analysis Services, you must use an On-premises Data Gateway and refresh the tokens manually.

## Understanding providers

When creating tabular 1400 and higher model projects in Visual Studio, by default you don't specify a data provider when connecting to a data source by using Get Data. Tabular 1400 and higher models use [Power Query](/power-query/power-query-what-is-power-query) connectors to manage connections, data queries, and mashups between the data source and Analysis Services. These are sometimes referred to as *structured* data source connections in that connection property settings are set for you. You can, however, enable legacy data sources for a model project in Visual Studio. When enabled, you can use Table Import Wizard to connect to certain data sources traditionally supported in tabular 1200 and lower models as *legacy*, or *provider* data sources. When specified as a provider data source, you can specify a particular data provider and other advanced connection properties. For example, you can connect to a SQL Server Data Warehouse instance or even an Azure SQL Database as a legacy data source. You can then select the OLE DB Driver for SQL Server MSOLEDBSQL data provider. In this case, selecting an OLE DB data provider may provide improved performance over the Power Query connector. 

When using the Table Import Wizard in Visual Studio, connections to any data source require a data provider. A default data provider is selected for you. You can change the data provider if needed. The type of provider you choose might depend on performance, whether or not the model is using in-memory storage or DirectQuery, and which Analysis Services platform you deploy your model to.

### Specify provider data sources in tabular 1400 and higher model projects

To enable provider data sources, in Visual Studio, click **Tools** > **Options** > **Analysis Services Tabular** > **Data Import**, select **Enable legacy data sources**.

![Screenshot of Enable legacy data sources.](media/analysis-services-datasource/aas-enable-legacy-datasources.png)

With legacy data sources enabled, in **Tabular Model Explorer**, right-click **Data Sources** > **Import From Data Source (Legacy)**.

![Screenshot of Legacy data sources in Tabular Model Explorer.](media/analysis-services-datasource/aas-import-legacy-datasources.png)

Just like with tabular 1200 model projects, use **Table Import Wizard** to connect to a data source. On the connect page, click **Advanced**. Specify data provider and other connection settings in **Set Advanced Properties**.

![Screenshot of Legacy data sources Advanced properties.](media/analysis-services-datasource/aas-import-legacy-advanced.png)

## Impersonation
In some cases, it may be necessary to specify a different impersonation account. Impersonation account can be specified in Visual Studio or SQL Server Management Studio (SSMS).

For on-premises data sources:

* If using SQL authentication, impersonation should be Service Account.
* If using Windows authentication, set Windows user/password. For SQL Server, Windows authentication with a specific impersonation account is supported only for in-memory data models.

For cloud data sources:

* If using SQL authentication, impersonation should be Service Account.


## OAuth credentials

For tabular models at the 1400 and higher compatibility level using *in-memory* mode, Azure SQL Database, Azure Synapse, Dynamics 365, and SharePoint List support OAuth credentials. To generate valid tokens, set credentials by using Power Query. Azure Analysis Services manages token refresh for OAuth data sources to avoid timeouts for long-running refresh operations. 
> [!NOTE]
> Managed token refresh is not supported for data sources accessed through a gateway. For example, one or more mashup query data sources is accessed through a gateway, and/or the [ASPaaS\AlwaysUseGateway](analysis-services-vnet-gateway.md) property is set to **true**. 

Direct Query mode is not supported with OAuth credentials.

## Enable Oracle managed provider

In some cases, DAX queries to an Oracle data source may return unexpected results. This might be due to the provider being used for the data source connection.

As described in the [Understanding providers](#understanding-providers) section, tabular models connect to data sources as either a *structured* data source or a *provider* data source. For models with an Oracle data source specified as a provider data source, ensure the specified provider is Oracle Data Provider for .NET (Oracle.DataAccess.Client). 

If the Oracle data source is specified as a structured data source, enable the **MDataEngine\UseManagedOracleProvider** server property. Setting this property ensures your model connects to the Oracle data source using the recommended Oracle Data Provider for .NET managed provider.
 
To enable Oracle managed provider:

1. In SQL Server Management Studio, connect to your server.
2. Create an XMLA query with the following script. Replace **ServerName** with the full server name, and then execute the query.

    ```xml
    <Alter AllowCreate="true" ObjectExpansion="ObjectProperties" xmlns="http://schemas.microsoft.com/analysisservices/2003/engine">
        <Object />
        <ObjectDefinition>
            <Server xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ddl2="http://schemas.microsoft.com/analysisservices/2003/engine/2" xmlns:ddl2_2="http://schemas.microsoft.com/analysisservices/2003/engine/2/2" 
    xmlns:ddl100_100="http://schemas.microsoft.com/analysisservices/2008/engine/100/100" xmlns:ddl200="http://schemas.microsoft.com/analysisservices/2010/engine/200" xmlns:ddl200_200="http://schemas.microsoft.com/analysisservices/2010/engine/200/200" 
    xmlns:ddl300="http://schemas.microsoft.com/analysisservices/2011/engine/300" xmlns:ddl300_300="http://schemas.microsoft.com/analysisservices/2011/engine/300/300" xmlns:ddl400="http://schemas.microsoft.com/analysisservices/2012/engine/400" 
    xmlns:ddl400_400="http://schemas.microsoft.com/analysisservices/2012/engine/400/400" xmlns:ddl500="http://schemas.microsoft.com/analysisservices/2013/engine/500" xmlns:ddl500_500="http://schemas.microsoft.com/analysisservices/2013/engine/500/500">
                <ID>ServerName</ID>
                <Name>ServerName</Name>
                <ServerProperties>
                    <ServerProperty>
                        <Name>MDataEngine\UseManagedOracleProvider</Name>
                        <Value>1</Value>
                    </ServerProperty>
                </ServerProperties>
            </Server>
        </ObjectDefinition>
    </Alter>
    ```

3. Restart the server.


## Next steps

* [On-premises gateway](analysis-services-gateway.md)
* [Manage your server](analysis-services-manage.md)
