---
title: What's New in Azure Data Catalog
description: This article provides an overview of new capabilities added to Azure Data Catalog.
services: data-catalog
author: markingmyname
ms.author: maghan
ms.assetid: 1201f8d4-6f26-4182-af3f-91e758a12303
ms.service: data-catalog
ms.topic: conceptual
ms.date: 01/18/2018
---
# What's new in Azure Data Catalog
Updates to **Azure Data Catalog** are released regularly. Not every release includes new user-facing features, as some releases are focused on back-end service capabilities. This page highlights new user-facing capabilities added to the Azure Data Catalog service.

## What's new for November 2017 
As of November 2017, the following capabilities have been added to Azure Data Catalog:

* Support for linking directly to specific business glossary terms in the Data Catalog portal. Users can copy links from the business glossary and embed them in documents, emails, reports, or other locations to link directly to the glossary term definition.
* Support for Azure Active Directory service principals. Data Catalog administrators can authorize client applications using service principals to access the catalog, and can grant those applications specific permissions just as they can grant permissions to users and security groups. For additional information see [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md).
* Support for Azure Active Directory authentication when connecting to Azure SQL Database and Azure SQL Data Warehouse data sources using the Data Catalog data source registration tool. For additional information see [Use Azure Active Directory Authentication for authentication with SQL Database or SQL Data Warehouse](../sql-database/sql-database-aad-authentication.md).


## What's new for September 2017 
As of September 2017, the following capabilities have been added to Azure Data Catalog:

* Support for extracting join relationship metadata from DB2 data sources when registering related tables using the data source registration tool.
* Support for registering MongoDB version 3.4 data sources using the data source registration tool.
* Support for deleting all metadata for contained objects in a single operation when removing a database or other container from Data Catalog.
* Support for viewing up to 1,000 tags, business glossary terms, or other search facets, when refining a search in the Data Catalog portal.


## What's new for August 2017 
As of August 2017, the following capabilities have been added to Azure Data Catalog:

*	A new developer sample is available for creating and managing relationship metadata by using the Data Catalog REST API. The *Import relationship information into Data Catalog* sample is available on the [Data Catalog code samples page](https://azure.microsoft.com/resources/samples/?service=data-catalog&sort=0). 
* Support for extracting join relationship metadata from Teradata data sources when registering related tables using the data source registration tool.
* Support for SQL Server table valued function (TVF) objects when registering SQL Server data sources using the data source registration tool.
* Multiple updates and refinements to increase the performance and usability of the Data Catalog portal.

## What's new for July 2017 
As of July 2017, the following capabilities have been added to Azure Data Catalog:
*	Support for more granular control over permited metadata operations including:
    - Catalog administrators can restrict users’ ability to contribute tags and related metadata to the catalog, enabling read-only access to the catalog.
    - Catalog administrators can restrict users’ ability to register new data sources in the catalog.
    - Catalog administrators can restrict users’ ability to take ownership of data asset metadata in the catalog.
    - Permissions can be granted to Azure Active Directory security groups and users for ease of managing permissions.
* Support for relationships between registered data assets, and discovering related data assets in the Data Catalog portal, including:
    - Extraction of relationship metadata from SQL Server (including Azure SQL Database), Oracle, and MySQL data sources when using the Data Catalog data source registration tool.
    - Discovery of related data assets when viewing asset metadata in the Data Catalog portal.
    - Operations to define, discover, and manage relationships between data assets by using the Data Catalog REST API.

For additional details on managing permissions in Data Catalog, see [How to secure access to data catalog and data assets](data-catalog-how-to-secure-catalog.md).
For additional details on relationships in Data Catalog, see [How to view related data assets in Azure Data Catalog](data-catalog-how-to-view-related-data-assets.md).

## What's new for June 2017 
As of June 2017, the following capabilities have been added to Azure Data Catalog:
*	Support for Sybase, Apache Cassandra, and MongoDB data sources. Users can now register and discover Cassandra and MongoDB databases and tables, and Sybase databases, tables, and views.

> [!NOTE]
> When registering MongoDB and Cassandra tables that include columns with complex data types such as records and arrays, these columns will not be included in the metadata added to Data Catalog.

## What's new for May 2017 
As of May 2017, the following capabilities have been added to Azure Data Catalog:
*	A new developer sample is available for the bulk importing of business glossary terms. The Glossary Bulk Import sample is available on the [Data Catalog developer samples page](https://docs.microsoft.com/azure/data-catalog/data-catalog-samples). 
*	Support for editing ODBC connection information in the Azure Data Catalog portal. Data asset owners and Data Catalog administrators can now edit the connection information for registered ODBC data sources without needing to re-register the data sources.
*	Support for clickable URLs in business glossary definitions and descriptions. When URLs are included in the description and definition properties for business glossary terms, the URLs will be displayed as hyperlinks in the Data Catalog portal.
*	Support for displaying expert names in addition to expert email addresses. When viewing experts in the properties for a data asset in the Data Catalog portal, the expert’s full name from Azure Active Directory will be displayed in the tooltip.

## What's new for April 2017 
As of April 2017, the following capabilities have been added to Azure Data Catalog:
*	Support for ODBC data sources. Users can now register and discover ODBC databases, tables, and views using the Data Catalog data source registration tool.

## What's new for March 2017 
As of March 2017, the following capabilities have been added to Azure Data Catalog:
*	Support for using AAD security groups for Data Catalog administrators.
*	Azure Data Catalog is now available in a new Azure region. Customers can provision the Azure Data Catalog in the West Central US region, in addition to East US, West US, West Europe, and Australia East, North Europe, and Southeast Asia. For more information, see [Azure Regions](https://azure.microsoft.com/regions/).

## What's new for February 2017 
As of February 2017, the following capabilities have been added to Azure Data Catalog:
*	Support for advanced settings in the Data Catalog data source registration tool. Users can specify command timeout values when registering large data sources.
*	Support for FTP and PostgreSQL data sources. Users can now register and discover FTP files and directories, and PostgreSQL databases, tables, and views.

## What's new for January 2017 
As of January 2017, the following capabilities have been added to Azure Data Catalog:
*	Azure Data Catalog is now [CSA STAR](https://www.microsoft.com/en-us/trustcenter/compliance/csa-star-certification) compliant.
*	Integration with [Get & Transform in Excel 2016 and Power Query for Excel](https://support.office.com/article/Introduction-to-Microsoft-Power-Query-for-Excel-6E92E2F4-2079-4E1F-BAD5-89F6269CD605). Excel users can share queries and discover queries using Azure Data Catalog from inside Excel. This functionality is available to users with Power BI Pro licenses.

## What's new for December 2016
As of December 2016, the following capabilities have been added to Azure Data Catalog:
*	Azure Data Catalog is now [HIPAA](https://www.microsoft.com/en-us/TrustCenter/Compliance/hipaa) and [EU Model Clauses](https://www.microsoft.com/en-us/TrustCenter/Compliance/EU-Model-Clauses) compliant.
*	Support for editing data source connection information. Data asset owners and Data Catalog administrators can now edit the connection information for registered data sources without needing to re-register the data sources.
*	Support for Salesforce.com data sources. Users can now register and discover Salesforce objects.


## What's new for November 2016
As of November 2016, the following capabilities have been added to Azure Data Catalog:
*	Azure Data Catalog is now [ISO/IEC 27001](https://www.microsoft.com/en-us/trustcenter/compliance/iso-iec-27001) and [ISO/IEC 27018](https://www.microsoft.com/en-us/TrustCenter/Compliance/iso-iec-27018) compliant.
*	Support for the manual registration of ODBC data sources using the Data Catalog portal and REST API.

## What's new for September 2016
As of September 2016, the following capabilities have been added to Azure Data Catalog:

* Support for IBM DB2 data sources. Users can now register and discover DB2 databases, tables, and views.
* Support for Azure Cosmos DB data sources. Users can now register and discover Cosmos DB databases and collections.
* Support for customizing the catalog name in the Data Catalog portal. Catalog administrators can now provide text that is displayed in the portal title, such as the organization name.

## What's new for August 2016
As of August 2016, the following capabilities have been added to Azure Data Catalog:

* Enhancements for registration of SQL Server Master Data Services (MDS) data sources. Users can now include previews and data profiles when registering MDS entities using the Data Catalog data source registration tool.
* Support for admin-defined organizational saved searches. When saving a search in the Data Catalog portal, Data Catalog administrators can now choose to save searches for personal use or for all catalog users. Organizational saved searches are shared with all catalog users, and can provide standardized starting points for data source discovery.
* Updates to the properties view in the Data Catalog portal. All data asset properties are now displayed and managed in a single, resizable pane to provide a more consistent, and discoverable experience.

## What's new for July 2016
As of July 2016, the following capabilities have been added to Azure Data Catalog:

* Support for SQL Server Master Data Services (MDS) data sources. Users can now register and discover MDS models and entities.
* Support for SQL Server stored procedures. Users can now register and discover stored procedure objects in SQL Server data sources.
* Support for additional languages in the Azure Data Catalog portal and the data source registration tool, for a total of 18 supported languages. The Azure Data Catalog user experience is localized based on the language preferences set in Windows or in the web browser.
* Updates and refinement for the Data Catalog portal home page, including performance improvements and a streamlined user experience.

## What's new for June 2016
As of June 2016, the following capabilities have been added to Azure Data Catalog:

* Support for resizing columns in the list view when discovering data assets in the Data Catalog portal. Users can now resize individual columns to more easily read lengthy asset metadata such as tags and descriptions.
* Power Query for Excel has been added to the "Open in" menu in the Data Catalog portal. Users can now open supported data sources in Excel 2016 or in Excel 2010 and Excel 2013 with the [Power Query for Excel](https://support.office.com/article/Introduction-to-Microsoft-Power-Query-for-Excel-6E92E2F4-2079-4E1F-BAD5-89F6269CD605) add-in installed.
* Support for Azure Table Storage data sources. Users can now register and discover Table objects in Azure Storage data sources.

## What's new for May 2016
As of May 2016, the following capabilities have been added to Azure Data Catalog:

* A Business Glossary that allows catalog administrators to define business terms and hierarchies to create a common business vocabulary. Users can tag registered data assets with glossary terms to make it easier to discover and understand the contents of the catalog. For more information, see [How to set up the Business Glossary for Governed Tagging](data-catalog-how-to-business-glossary.md)  
* Enhancements to the Data Catalog Business Glossary that allows users to update multiple glossary terms in a single operation. Users can select multiple terms to edit the following fields:
  * Parent Term: The user can select a new parent term, and all selected terms are updated to be children of the selected parent term. If the selected terms all have the same parent, then that parent is shown in the textbox, otherwise the parent term field is set to blank.   
  * Tags and Stakeholders: Users can add and remove tags and stakeholders for multiple glossary terms using the same experience as tagging multiple data assets.

> [!NOTE]
> The business glossary is available only in the Standard Edition of Azure Data Catalog. The Free Edition does not provide capabilities for governed tagging or a business glossary.

## What's new for March 2016
As of March 2016, the following capabilities have been added to Azure Data Catalog:g:

* A consolidated REST API endpoint for programmatically accessing the search capabilities and catalog asset management capabilities of the Azure Data Catalog service. This search API endpoint and catalog API endpoint was deprecated and discontinued on March 21, 2016. There are no changes to the semantics of the API. Only the endpoint URI changed. For additional information, see the [Azure Data Catalog REST API Reference](https://msdn.microsoft.com/library/azure/mt267595.aspx). For API samples, see [Azure Data Catalog developer samples](data-catalog-samples.md).

## What's new for February 2016
As of February 2016, the following capabilities have been added to Azure Data Catalog:

* A newly redesigned data source selection experience in the Azure Data Catalog data source registration tool. The data source registration tool has been updated to make it easier you to locate and select from the data sources supported by Azure Data Catalog.
* Support for 10 additional languages in the Azure Data Catalog portal and the data source registration tool. In addition to English, the Azure Data Catalog experience is now available in German, Spanish, French, Italian, Japanese, Korean, Brazilian Portuguese, Russian, Simplified Chinese, and Traditional Chinese. The Azure Data Catalog user experience is localized based on the language preferences set in Windows or in the user’s web browser.
* Support for geo-replication of Azure Data Catalog data for business continuity and disaster recovery. All Azure Data Catalog contents, including data source metadata and crowdsourced annotations, are now replicated between two Azure regions at no additional cost to customers. The Azure regions are pre-paired, at least 500 miles apart, and follow the mapping as described in [Business continuity and disaster recovery (BCDR): Azure Paired Regions](../best-practices-availability-paired-regions.md).
* Support for changing the Azure subscription used by Azure Data Catalog. Azure Data Catalog administrators can use the Settings page in the Azure Data Catalog portal to select a different Azure subscription for billing purposes.

## What's new for January 2016
As of January 2016, the following capabilities have been added to Azure Data Catalog:

* Support for manually registering additional data sources. You can now use "Create Manual Entry" in the Azure Data Catalog portal, or use the Azure Data Catalog REST API to register the following data sources:
  * OData - Function, Entity Set, and Entity Container
  * HTTP - File, Endpoint, Report, and Site
  * File System - File
  * SharePoint - List
  * FTP - File and Directory
  * Salesforce.com - Object
  * DB2 - Table, View, and Database
  * PostgreSQL - Table, View, and Database
* Support for "Open in SQL Server Data Tools" for SQL Server (including Azure SQL DB and Azure SQL Data Warehouse) data sources.  
* Support for registering and discovering SAP HANA views and packages. You can register SAP HANA data sources using the Azure Data Catalog data source registration tool, and can annotate and discover registered SAP HANA data sources using the Azure Data Catalog portal.
* The ability to pin and unpin data assets in the Azure Data Catalog portal. You can choose to pin data assets to make them easier to rediscover and reuse.
* A newly redesigned home page in the Azure Data Catalog portal. The new home page includes insight into the current users activity - including recently published assets, pinned assets, and saved searches - and insight into the activity in the Catalog as a whole.
* Support for persistent user settings in the Azure Data Catalog portal. User experience settings - including grid or tile view, the number of results per page, and hit highlighting on or off - are persisted between user sessions.
* Azure Data Catalog is now available in two new Azure regions. Customers can provision the Azure Data Catalog in the North Europe and Southeast Asia regions, in addition to East US, West US, West Europe, and Australia East. For more information, see [Azure Regions](https://azure.microsoft.com/regions/).

> [!NOTE]
> "Open in SQL Server Data Tools" requires Visual Studio 2013 with Update 4 and SQL Server Tooling to be installed. To install the latest version of SQL Server Data Tools, visit [Download SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx).


## What's new for December 2015
As of December 2015, the following capabilities have been added to Azure Data Catalog:

* Support for data profiles for Azure SQL Data Warehouse data sources. When registering Azure SQL Data Warehouse tables and views, users can choose to include data profile metrics with the metadata extracted from the data source.
* Support for registering and discovering MySQL objects and databases. Users can register MySQL data sources using the Azure Data Catalog data source registration tool, and can annotate and discover registered MySQL data sources using the Azure Data Catalog portal.
* Support for SPNEGO and Windows authentication for Teradata data sources. When registering Teradata tables and views, users can choose to connect to Teradata using SPNEGO and Windows, and LDAP and TD2 authentication.
* Support for Azure Data Lake Store data sources. Users can now register and discover Azure Data Lake Store data sources using Azure Data Catalog.
* Support for manually specifying network proxy settings in the Azure Data Catalog data source registration tool. Users can select "Modify proxy settings" from the tool's welcome page, and can specify the proxy address and port to be used by the tool.

## What's new for November 2015
As of November 2015, the following capabilities have been added to Azure Data Catalog:

* The ability to view and copy connection strings from within the Azure Data Catalog portal for SQL Server (including Azure SQL Database) and Oracle data sources. Users can click "View Connection Strings" link in the connection information for a SQL Server or Oracle table, view, or database, to see the connection strings used to connect to the data source. ADO.NET, ODBC, OLEDB and JDBC connection strings are provided for SQL Server data sources. ODBC and OLEDB connection strings are provided for Oracle data sources.
* Support for including data profiles when registering Teradata tables and views.
* Support for "Open in Power BI Desktop" for SQL Server (including Azure SQL DB and Azure SQL Data Warehouse), SQL Server Analysis Services, Azure Storage, and HDFS sources.  
* Support for LDAP authentication for Teradata data sources. When registering Teradata tables and views, users can choose to connect to Teradata using LDAP, and TD2 authentication.
* Support for "Open in Excel" for Teradata data sources.
* Support for recent search terms in the Azure Data Catalog portal. When searching in the portal, users can select from recently used search terms to accelerate the discovery experience.
* Support for preview for Teradata data sources. When registering Teradata tables and views, users can choose to include snapshot records with the metadata extracted from the data source.
* Support for "Open in Excel" for Azure SQL Data Warehouse data sources.
* Support for defining and editing column-level schemas for manually registered data assets. After manually creating a data asset using the Azure Data Catalog portal, users can add column definitions in the data asset properties.
* Support for "has" queries when searching Azure Data Catalog, to enable the discovery of registered data assets that possess specific metadata. Azure Data Catalog query syntax now includes:

| Query syntax | Purpose |
| --- | --- |
| `has:previews` |Finds data assets that include a preview |
| `has:documentation` |Finds data assets for which documentation has been provided |
| `has:tableDataProfiles` |Finds data assets with table-level data profile information |
| `has:columnsDataProfiles` |Finds data assets with column-level data profile information |


> [!NOTE]
> "Open in Power BI Desktop" requires a current version of the Power BI Desktop application to be installed. If you encounter problems or errors using this feature, ensure that you have the latest version of Power BI Desktop from [PowerBI.com](https://powerbi.com).


## What's new for October 2015
As of October 2015, the following capabilities have been added to Azure Data Catalog:

* Support for encryption at rest of data previews and data profiles for registered data sources. Azure Data Catalog transparently encrypts any preview records and data profiles data sources registered with the service, without any need for key management by Catalog administrators.
* Support for Teradata data sources. Users can now register and discover Teradata tables and views.
* Support for on-premises Hive data sources. Users can now register and discover Hive tables for Apache Hive in Hadoop on-premises data sources.
* Support for saved searches in the Azure Data Catalog portal. Users can save search terms and filter selections to easily repeat previous searches and define useful views of the Catalog's contents. User can also mark a saved search as their default search. When a user clicks the "magnifying glass" search icon from the Azure Data Catalog portal home page or from the "getting started" page, the user is taken directly to the saved search flagged as default.
* Support for rich text documentation for registered data assets and containers in the Azure Data Catalog portal. Users can now provide documentation for data assets such as tables, views, and reports, and for containers such as databases and models, for scenarios where tags and descriptions are not sufficient.
* Support for manually registering known data source types. Users can manually enter data source information using the Azure Data Catalog portal for all data source types supported by Azure Data Catalog.
* Support for authorizing Azure Active Directory security groups. Catalog administrators can enable catalog access to security groups, user accounts, making it easier to manage access to Azure Data Catalog.
* Support for opening Hive data sources in Excel from the Azure Data Catalog portal.

> [!NOTE]
> For the current release, only Teradata TD2 authentication is supported. Additional authentication mechanisms are supported in future releases.

> [!NOTE]
> To use the "Open in Excel" feature for Hive data sources, users must have installed the ODBC driver for Hive.

## What's new for September 2015
As of September 2015, the following capabilities have been added to Azure Data Catalog:

* Support for including data profiles when registering Hive data sources.
* Support for programmatically discovering the Catalog API, making it easier for applications to integrate with Azure Data Catalog.
* A new "getting started" data source discovery experience in the Azure Data Catalog portal. When users enter the "discover" page of the Azure Data Catalog portal without entering a search term, they are presented with an overview of the catalog contents including the most frequently used tags, experts, data source types, and object types.
* Support for registering and discovering Azure SQL Data Warehouse objects and databases. For additional information on Azure SQL Data Warehouse, see [SQL Data Warehouse](https://azure.microsoft.com/services/sql-data-warehouse/).
* Support for registering and discovering SQL Server Analysis Services models and SQL Server Reporting Services servers as containers. When registering SSAS and SSRS objects, Azure Data Catalog creates an entry for the SSAS model and SSRS server, and for the reports and other objects. The containers can be discovered and annotated using the Azure Data Catalog portal. Users can also search and filter the contents of a model or server in addition to searching and filtering the contents of the catalog.
* Support for registering and discovering SQL Server Analysis Services objects via HTTP/HTTPS. Users can now connect to SSAS servers using a URL (such as https://servername/olap/msmdpump.dll) rather than a server name, and can use Basic authentication and Anonymous connections in addition to Windows authentication. For additional information on HTTP/HTTPS connections to SSAS, see [Configure HTTP Access to Analysis Services](https://msdn.microsoft.com/library/gg492140.aspx).
* Support for Hive data sources on HDInsight. Users can now register and discover Hive tables for Apache Hive in Hadoop on HDInsight data sources. For additional information on Hive on HDInsight, see the [HDInsight documentation center](../hdinsight/hadoop/hdinsight-use-hive.md).
* Support for registering and discovering Oracle databases and HDFS clusters as containers. When registering Oracle tables and views or HDFS, Azure Data Catalog creates an entry for the database, tables, and views. The database can be discovered and annotated using the Azure Data Catalog portal. Users can also search and filter the contents of a database or cluster in addition to searching and filtering the contents of the catalog.
* Support for manually registering unknown data source types. Users can manually enter data source information using the Azure Data Catalog portal, so that data sources not explicitly supported by the data source registration tool can be annotated and discovered.
* Support for registering and discovering SQL Server databases as containers. When registering SQL Server tables and views, Azure Data Catalog creates an entry for the database, tables, and views. The database can be discovered and annotated using the Azure Data Catalog portal. Users can also search and filter the contents of a database in addition to searching and filtering the contents of the catalog.

> [!NOTE]
> SSAS and SSRS objects that have been registered prior to the September 18 release must be re-registered using the data source registration tool before the model or server entry is added to the catalog. Re-registering a data source does not affect any annotations that have been added by users in the Azure Data Catalog portal.

> [!NOTE]
> Oracle tables and views and HDFS files and directories that have been registered prior to the September 11 release must be re-registered using the data source registration tool before the database or cluster entry is added to the catalog. Re-registering a data source does not affect any annotations that have been added by users in the Azure Data Catalog portal.

> [!NOTE]
> SQL Server tables and views that have been registered prior to the September 4 release must be re-registered using the data source registration tool before the database entry is added to the catalog. Re-registering a data source does not affect any annotations that have been added by users in the Azure Data Catalog portal.

## What's new for August 2015
As of August 2015, the following capabilities have been added to Azure Data Catalog:

* Support for data profiling of SQL Server and Oracle data sources. When registering SQL Server and Oracle tables and views, users can choose to include data profile information for the objects being registered. The data profile includes object-level and column-level statistics.
* Support for Hadoop HDFS data sources. Users can now register and discover HDFS files and directories.
* Support for providing access request information for registered data sources. For any registered data asset, users can now provide instructions for requesting access, including email links or URLs, to easily integrate with existing tools and processes.
* Tool tips for tags and experts, to make it easier to discover what users have provided what metadata for registered data assets.
* We’ve added a new “User” button and menu to our top navigation bar. This menu lets the user see the account used to log on to Azure Data Catalog, and to sign out if desired. This menu also displays the catalog name, which is valuable to developers using the Azure Data Catalog REST API.
* Standard Edition Only: When adding owners to data assets, Azure Data Catalog now supports both user accounts and security groups as owners. To add a security group as an owner for selected data assets, you can enter either the group’s display name or the group’s UPN email address, if it has one.
* Support for Azure Blob Storage data sources. Users can now register and discover Azure Storage blobs and directories.

