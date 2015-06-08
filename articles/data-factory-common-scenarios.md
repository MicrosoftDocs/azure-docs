<properties 
	pageTitle="Common Scenarios for using Azure Data Factory" 
	description="Learn about a few common scenarios for using the Azure Data Factory service" 
	services="data-factory" 	
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/14/2015" 
	ms.author="spelluru"/>

# Common scenarios for using Azure Data Factory
This section describes a few example scenarios that the Azure Data Factory can support today, and will continue to grow as Hub scenarios.

> [AZURE.NOTE] Read through the [Introduction to Azure Data Factory][datafactory-introduction] article before reading through this one.   

##Scenario #1: Data Sources for the Data Hub
![Source the Data Hub][image-data-factory-introduction-secenario1-source-datahub]

Enterprises have data of disparate types located in disparate sources.  The first step in building an information production system is to connect to all the required sources of data and processing, such as SaaS services, file shares, FTP, web services, and move the data as-needed for subsequent processing.

Without Data Factory, enterprises must build custom data movement components or write custom services to integrate these data sources and processing.  This is expensive, and hard to integrate and maintain such systems, and it often lacks the enterprise grade monitoring and alerting, and the controls that a fully managed service can offer.
  
With Azure Data Factory data storage and processing services are collected into a Hub container which facilitates and optimizes computation and storage activities, enables unified resource consumption management, and provides services for data movement as-needed.

##Scenario #2: Operationalize Information Production
Operationalization scenarios are the next logical step after data sourcing scenarios. Once data is present in a Hub, you want to author and operationalize data pipelines to reliably produce transformed data on a maintainable and controlled schedule to feed production environments with trusted data.  Data transformation in Azure Data Factory is through Hive, Pig and custom C# processing running on Hadoop (Azure HDInsight).  These transformations can be used to clean data, mask critical data fields, and perform other operations on the data in a wide variety of complex ways.  Ordinarily, operationalization is achieved with complex and hard to maintain infrastructure and custom services, and poses a number of challenges for implementation, management, scaling, troubleshooting, and versioning such a solution.
  
With Data Factory as a fully managed service, users can operationalize these pipelines by defining them with one-time or complex recurring schedules, and orchestration is handled directly by the Data Factory service.  With Hubs, cluster management for all of the data and processing within a Hub is handled on behalf of the user, so users can focus on transformative analytics instead on infrastructure management.  Azure Data Factory removes the challenges of working with brittle custom services, and enables enterprises to produce trusted information reliably and reproducibly.


##Scenario #3:  Integrate Information Production with data discovery
Traditional BI approaches and technologies, while providing an “authoritative source of the truth”, almost always have a serious side effect: a constant backlog of requests due to a carefully controlled change request process.  To adapt to quickly changing business questions, there is a need for greater flexibility for enterprises to connect their information production systems with their information consumption systems.  Azure Data Factory helps address the challenge of connecting these systems with streamlined data pipelines for information production, and the information consumption challenge by making up-to-date trusted data available in easily consumable forms.
  
Azure Data Factory supports the following capabilities to enable simple consumption of the data produced:

- Easily move (one time or scheduled) the produced data assets to relational data marts for consumption using existing BI tools (Excel, Tableau, etc…).
- Consume data assets produced by a data factory directly using Power Query in Excel.

See the following topics for consuming data using Power Query: 

- [Power Query: Connect to Microsoft Azure Table Storage] [Power-Query-Azure-Table]
- [Power Query: Connect to Microsoft Azure Blob Storage] [Power-Query-Azure-Blob]
- [Power Query: Connect to Microsoft Azure SQL Database] [Power-Query-Azure-SQL]
- [Power Query: Connect to Microsoft On-premises SQL Server][Power-Query-OnPrem-SQL] 


[Power-Query-Azure-Table]: http://office.microsoft.com/en-001/excel-help/connect-to-microsoft-azuretable-storage-HA104122607.aspx
[Power-Query-Azure-Blob]: http://office.microsoft.com/en-001/excel-help/connect-to-microsoft-azure-blob-storage-HA104113447.aspx
[Power-Query-Azure-SQL]: http://office.microsoft.com/en-001/excel-help/connect-to-a-microsoft-azure-sql-database-HA104019809.aspx
[Power-Query-OnPrem-SQL]: http://office.microsoft.com/en-001/excel-help/connect-to-a-sql-server-database-HA104019808.aspx

[copy-data-with-adf]: http://azure.microsoft.com/documentation/articles/data-factory-copy-activity/
[use-pig-hive]: http://azure.microsoft.com/documentation/articles/data-factory-pig-hive-activities/
[run-map-reduce]: http://azure.microsoft.com/documentation/articles/data-factory-map-reduce/
[azure-ml-adf]: http://azure.microsoft.com/documentation/articles/data-factory-create-predictive-pipelines/

[msdn-stored-procedure-activity]: https://msdn.microsoft.com/library/dn912649.aspx

[adf-tutorial]: data-factory-tutorial.md
[datafactory-getstarted]: data-factory-get-started.md
[datafactory-introduction]: data-factory-introduction.md

[image-data-factory-introduction-secenario1-source-datahub]:./media/data-factory-common-scenarios/Scenario1SourceDataHub.png

[image-data-factory-introduction-secenario2-operationalize-infoproduction]:./media/data-factory-common-scenarios/Scenario2-OperationalizeInformationProduction.png



