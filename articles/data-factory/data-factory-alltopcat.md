<properties
	pageTitle="All topics for Data Factory service | Microsoft Azure"
	description="Table of all topics for the Azure service named Data Factory that exist on http://azure.microsoft.com/documentation/articles/, Title and description."
	services="data-factory"
	documentationCenter=""
	authors="spelluru"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="data-factory"
	ms.workload="data-factory"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/21/2016"
	ms.author="spelluru"/>


# All topics for Azure Data Factory service

This topic lists every topic that applies directly to the **Data Factory** service of Azure. You can search this webpage for keywords by using **Ctrl+F**, to find the topics of current interest.




## New

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 1 | [Build your first Azure data factory using Data Factory REST API](data-factory-build-your-first-pipeline-using-rest-api.md) | In this tutorial, you create a sample Azure Data Factory pipeline using Data Factory REST API. |
| 2 | [Tutorial: Create a pipeline with Copy Activity using REST API](data-factory-copy-activity-tutorial-using-rest-api.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using REST API. |
| 3 | [Data Factory Copy Wizard](data-factory-copy-wizard.md) | Learn about how to use Data Factory Copy Wizard to copy data from supported data sources to sinks. |
| 4 | [Data Management Gateway](data-factory-data-management-gateway.md) | Set up a data gateway to move data between on-premises and the cloud. Use Data Management Gateway in Azure Data Factory to move your data. |
| 5 | [Move data from an on-premises Cassandra database using Azure Data Factory](data-factory-onprem-cassandra-connector.md) | Learn about how to move data from an on-premises Cassandra database using Azure Data Factory. |
| 6 | [Move data From MongoDB using Azure Data Factory](data-factory-on-premises-mongodb-connector.md) | Learn about how to move data from MongoDB database using Azure Data Factory. |
| 7 | [Move data from Salesforce by using Azure Data Factory](data-factory-salesforce-connector.md) | Learn about how to move data from Salesforce by using Azure Data Factory. |


## Updated articles

This section lists articles which were updated recently, where the update was big or significant. For each updated article, a rough snippet of the added markdown text is displayed. The articles were updated within the date range of **2016-07-26** to **2016-08-21**.

| &nbsp; | Article | Updated text, snippet |
| --: | :-- | :-- |
| 8 | [Create, monitor, and manage Azure data factories using Data Factory .NET SDK](data-factory-create-data-factories-programmatically.md) | ** Login without popup dialog box** The above sample code launches a dialog box for you to enter Azure credentials. If you need to sign-in programmatically without using a dialog-box, see  Authenticating a service principal with Azure Resource Manager (resource-group-authenticate-service-principal.md authenticate-service-principal-with-certificate---powershell). ** Example** Create GetAuthorizationHeaderNoPopup method as shown below:     public static string GetAuthorizationHeaderNoPopup()     {         var authority = new Uri(new Uri("https://login.windows.net"), ConfigurationManager.AppSettings "ActiveDirectoryTenantId" );         var context = new AuthenticationContext(authority.AbsoluteUri);         var credential = new ClientCredential(ConfigurationManager.AppSettings "AdfClientId" , ConfigurationManager.AppSettings "AdfClientSecret" );         AuthenticationResult result = context.AcquireTokenAsync(ConfigurationManager.AppSettings "WindowsManagementUri" , credential).Result;     |
| 9 | [Move data using Copy Activity](data-factory-data-movement-activities.md) | ** Supported file formats** Copy Activity can copy files as-is between two file-based data stores such as Azure Blob, File System, and Hadoop Distributed File System (HDFS).  To do so, you can skip the  format section (data-factory-create-datasets.md) in both input and output dataset definitions, and the data is copied efficiently without any serialization/deserialization. Copy Activity also reads from and writes to files in specified formats: text, Avro, ORC, and JSON.  Here are some examples of copy activities you can achieve: /	Copy data in text (CSV) format from Azure Blob and write to Azure SQL /	Copy files in text (CSV) format from File System on-premises and write to Azure Blob in Avro format /	Copy data in Azure SQL Database and write to HDFS on-premises in ORC format ** a. name="global"../a.Globally available data movement** The service that powers Copy Activity is available globally in the following regions and geographies, even though Azure Data Factory is available only in the West US, East US, and North Europe regions.|
| 10 | [Move data From a OData source using Azure Data Factory](data-factory-odata-connector.md) | ** Using Windows authentication accessing on-premises OData source**     {         "name": "inputLinkedService",         "properties":         {             "type": "OData",            	"typeProperties":             {                "url": ".endpoint of on-premises OData source e.g. Dynamics CRM.",                "authenticationType": "Windows",                 "username": "domain\\user",                "password": "password",                "gatewayName": "mygateway"            }        }     }  |





## Tutorials

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 11 | [Tutorial: Build your first pipeline to process data using Hadoop cluster](data-factory-build-your-first-pipeline.md) | This Azure Data Factory tutorial shows you how to create and schedule a data factory that processes data using Hive script on a Hadoop cluster. |
| 12 | [Tutorial: Build your first Azure data factory using Azure Resource Manager template](data-factory-build-your-first-pipeline-using-arm.md) | In this tutorial, you will create a sample Azure Data Factory pipeline using an Azure Resource Manager template. |
| 13 | [Build your first Azure data factory using Azure portal/Data Factory Editor](data-factory-build-your-first-pipeline-using-editor.md) | In this tutorial, you create a sample Azure Data Factory pipeline using Data Factory Editor in the Azure portal. |
| 14 | [Build your first Azure data factory using Azure PowerShell](data-factory-build-your-first-pipeline-using-powershell.md) | In this tutorial, you create a sample Azure Data Factory pipeline using Azure PowerShell. |
| 15 | [Build your Azure first data factory using Microsoft Visual Studio](data-factory-build-your-first-pipeline-using-vs.md) | In this tutorial, you create a sample Azure Data Factory pipeline using Visual Studio. |
| 16 | [Tutorial: Create a pipeline with Copy Activity using Data Factory Editor](data-factory-copy-activity-tutorial-using-azure-portal.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using the Data Factory Editor in the Azure portal. |
| 17 | [Tutorial: Create a pipeline with Copy Activity using Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using Azure PowerShell. |
| 18 | [Tutorial: Create a pipeline with Copy Activity using Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using Visual Studio. |
| 19 | [Copy data from Blob Storage to SQL Database using Data Factory](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) | This tutorial shows you how to use Copy Activity in an Azure Data Factory pipeline to copy data from Blob storage to SQL database. |
| 20 | [Tutorial: Create a pipeline with Copy Activity using Data Factory Copy Wizard](data-factory-copy-data-wizard-tutorial.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using the Copy Wizard supported by Data Factory |



## Data Movement

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 21 | [Move data to and from Azure Blob using Azure Data Factory](data-factory-azure-blob-connector.md) | Learn how to copy blob data in Azure Data Factory. Use our sample: How to copy data to and from Azure Blob Storage and Azure SQL Database. |
| 22 | [Move data to and from Azure Data Lake Store using Azure Data Factory](data-factory-azure-datalake-connector.md) | Learn how to move data to/from Azure Data Lake Store using Azure Data Factory |
| 23 | [Move data to and from DocumentDB using Azure Data Factory](data-factory-azure-documentdb-connector.md) | Learn how move data to/from Azure DocumentDB collection using Azure Data Factory |
| 24 | [Move data to and from Azure SQL Database using Azure Data Factory](data-factory-azure-sql-connector.md) | Learn how to move data to/from Azure SQL Database using Azure Data Factory. |
| 25 | [Move data to and from Azure SQL Data Warehouse using Azure Data Factory](data-factory-azure-sql-data-warehouse-connector.md) | Learn how to move data to/from Azure SQL Data Warehouse using Azure Data Factory |
| 26 | [Move data to and from Azure Table using Azure Data Factory](data-factory-azure-table-connector.md) | Learn how to move data to/from Azure Table Storage using Azure Data Factory. |
| 27 | [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) | Learn about key factors that impact performance of data movement in Azure Data Factory via the Copy Activity. |
| 28 | [Move data using Copy Activity](data-factory-data-movement-activities.md) | Learn about data movement in Data Factory pipelines: data migration between cloud stores, between on-premises and cloud. Use the Copy Activity. |
| 29 | [Release notes for Data Management Gateway](data-factory-gateway-release-notes.md) | Data Management Gateway tory release notes |
| 30 | [Move data From on-premises HDFS using Azure Data Factory](data-factory-hdfs-connector.md) | Learn about how to move data from on-premises HDFS using Azure Data Factory. |
| 31 | [Monitor and manage Azure Data Factory pipelines using new Monitoring and Management App](data-factory-monitor-manage-app.md) | Learn how to use Monitoring and Management App to monitor and manage Azure data factories and pipelines. |
| 32 | [Move data between on-premises sources and the cloud with Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) | Set up a data gateway to move data between on-premises and the cloud. Use Data Management Gateway in Azure Data Factory to move your data. |
| 33 | [Move data From a OData source using Azure Data Factory](data-factory-odata-connector.md) | Learn about how to move data from OData sources using Azure Data Factory. |
| 34 | [Move data From ODBC data stores using Azure Data Factory](data-factory-odbc-connector.md) | Learn about how to move data from ODBC data stores using Azure Data Factory. |
| 35 | [Move data from DB2 using Azure Data Factory](data-factory-onprem-db2-connector.md) | Learn about how move data from DB2 Database using Azure Data Factory |
| 36 | [Move data to and from On-premises file system using Azure Data Factory](data-factory-onprem-file-system-connector.md) | Learn how to move data to/from on-premises File System using Azure Data Factory. |
| 37 | [Move data From MySQL using Azure Data Factory](data-factory-onprem-mysql-connector.md) | Learn about how to move data from MySQL database using Azure Data Factory. |
| 38 | [Move data to/from on-premises Oracle using Azure Data Factory](data-factory-onprem-oracle-connector.md) | Learn how to move data to/from Oracle database that is on-premises using Azure Data Factory. |
| 39 | [Move data from PostgreSQL using Azure Data Factory](data-factory-onprem-postgresql-connector.md) | Learn about how to move data from PostgreSQL Database using Azure Data Factory. |
| 40 | [Move data from Sybase using Azure Data Factory](data-factory-onprem-sybase-connector.md) | Learn about how to move data from Sybase Database using Azure Data Factory. |
| 41 | [Move data from Teradata using Azure Data Factory](data-factory-onprem-teradata-connector.md) | Learn about Teradata Connector for the Data Factory service that lets you move data from Teradata Database |
| 42 | [Move data to and from SQL Server on-premises or on IaaS (Azure VM) using Azure Data Factory](data-factory-sqlserver-connector.md) | Learn about how to move data to/from SQL Server database that is on-premises or in an Azure VM using Azure Data Factory. |
| 43 | [Move data from a Web table source using Azure Data Factory](data-factory-web-table-connector.md) | Learn about how to move data from on-premises a table in a Web page using Azure Data Factory. |



## Data Transformation

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 44 | [Create predictive pipelines using Azure Machine Learning activities](data-factory-azure-ml-batch-execution-activity.md) | Describes how to create create predictive pipelines using Azure Data Factory and Azure Machine Learning |
| 45 | [Compute Linked Services](data-factory-compute-linked-services.md) | Learn about compute enviornments that you can use in Azure Data Factory pipelines to transform/process data. |
| 46 | [Process large-scale datasets using Data Factory and Batch](data-factory-data-processing-using-batch.md) | Describes how to process huge amounts of data in an Azure Data Factory pipeline by using parallel processing capability of Azure Batch. |
| 47 | [Learn about transforming and analyzing data in Azure Data Factory](data-factory-data-transformation-activities.md) | Learn about data transformation in Azure Data Factory. Transform and process data in Azure HDInsight cluster or an Azure Batch. |
| 48 | [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md) | Learn how you can use the Hadoop Streaming Activity in an Azure data factory to run Hadoop Streaming programs on an on-demand/your own HDInsight cluster. |
| 49 | [Hive Activity](data-factory-hive-activity.md) | Learn how you can use the Hive Activity in an Azure data factory to run Hive queries on an on-demand/your own HDInsight cluster. |
| 50 | [Invoke MapReduce Programs from Data Factory](data-factory-map-reduce.md) | Learn how to process data by running MapReduce programs on an Azure HDInsight cluster from an Azure data factory. |
| 51 | [Pig Activity](data-factory-pig-activity.md) | Learn how you can use the Pig Activity in an Azure data factory to run Pig scripts on an on-demand/your own HDInsight cluster. |
| 52 | [Invoke Spark Programs from Data Factory](data-factory-spark.md) | Learn how to invoke Spark programs from an Azure data factory using the MapReduce Activity. |
| 53 | [SQL Server Stored Procedure Activity](data-factory-stored-proc-activity.md) | Learn how you can use the SQL Server Stored Procedure Activity to invoke a stored procedure in an Azure SQL Database or Azure SQL Data Warehouse from a Data Factory pipeline. |
| 54 | [Use custom activities in an Azure Data Factory pipeline](data-factory-use-custom-activities.md) | Learn how to create custom activities and use them in an Azure Data Factory pipeline. |
| 55 | [Run U-SQL script on Azure Data Lake Analytics from Azure Data Factory](data-factory-usql-activity.md) | Learn how to process data by running U-SQL scripts on Azure Data Lake Analytics compute service. |



## Samples

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 56 | [Azure Data Factory - Samples](data-factory-samples.md) | Provides details about samples that ship with the Azure Data Factory service. |



## Use Cases

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 57 | [Customer case studies](data-factory-customer-case-studies.md) | Learn about how some of our customers have been using Azure Data Factory. |
| 58 | [Use Case - Customer Profiling](data-factory-customer-profiling-usecase.md) | Learn how Azure Data Factory is used to create a data-driven workflow (pipeline) to profile gaming customers. |
| 59 | [Use Case - Product Recommendations](data-factory-product-reco-usecase.md) | Learn about an use case implemented by using Azure Data Factory along with other services. |



## Monitor and Manage

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 60 | [Monitor and manage Azure Data Factory pipelines](data-factory-monitor-manage-pipelines.md) | Learn how to use Azure Portal and Azure PowerShell to monitor and manage Azure data factories and pipelines you have created. |



## SDK

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 61 | [Azure Data Factory - .NET API change log](data-factory-api-change-log.md) | Describes breaking changes, feature additions, bug fixes etc... in a specific version of .NET API for the Azure Data Factory. |
| 62 | [Create, monitor, and manage Azure data factories using Data Factory .NET SDK](data-factory-create-data-factories-programmatically.md) | Learn how to programmatically create, monitor, and manage Azure data factories by using Data Factory SDK. |
| 63 | [Azure Data Factory Developer Reference](data-factory-sdks.md) | Learn about different ways to create, monitor, and manage Azure data factories |



## Miscellaneous

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 64 | [Azure Data Factory - Frequently Asked Questions](data-factory-faq.md) | Frequently asked questions about Azure Data Factory. |
| 65 | [Azure Data Factory - Functions and System Variables](data-factory-functions-variables.md) | Provides a list of Azure Data Factory functions and system variables |
| 66 | [Azure Data Factory - Naming Rules](data-factory-naming-rules.md) | Describes naming rules for Data Factory entities. |
| 67 | [Troubleshoot Data Factory issues](data-factory-troubleshoot.md) | Learn how to troubleshoot issues with using Azure Data Factory. |

