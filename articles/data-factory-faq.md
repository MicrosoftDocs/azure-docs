<properties title="Azure Data Factory - Frequently Asked Questions" pageTitle="Azure Data Factory - Frequently Asked Questions" description="Frequently asked questions about Azure Data Factory." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/13/2014" ms.author="spelluru" />

# Azure Data Factory - Frequently Asked Questions

**Q: What is Azure Data Factory?**

Data Factory is a fully managed service for developers to compose data storage, movement, and processing services into highly available, fault tolerant data pipelines. Data Factory operates over both on-premises and cloud data storage. A pipeline is a set of data inputs, processing activities, and data outputs and is defined with simple JSON scripting and activated via PowerShell commands. Once activated, Data Factory orchestrates and schedules pipelines to run on HDInsight (Hadoop) with options for automatic cluster management on behalf of the user. Data Factory also provides a visual management and monitoring experience through the Azure Preview Portal to monitor all pipelines with rich operational and service health information in one dashboard.
 
**Q: What customer challenge does Data Factory solve for?**

Azure Data Factory balances the agility of leveraging diverse data storage, processing and movement services across traditional relational storage alongside unstructured data, with the control and monitoring capabilities of a fully managed service.

**Q: Who are the target audiences for Data Factory?**


- Data Developers: who are responsible for building integration services between Hadoop and other systems:
	- Must keep up and integrate with a continually changing and growing data landscape
	- Must write custom code for information production, and it  is expensive, hard to maintain, and not highly available or fault tolerant

- IT Professionals: who are looking to incorporate more diverse data within their IT infrastructure:
	- Required to look across all of an organization’s data to derive rich business insights
	- Must manage compute and storage resources to balance cost and scale across on-premises and cloud
	- Must quickly add diverse sources and processing to address new business needs, while maintaining visibility across all compute and storage assets

**Q: Where can I find pricing details for Azure Data Factory?**

See [Data Factory Pricing Details page][adf-pricing-details] for the pricing details for the Azure Data Factory.  

**Q. How do I get started with Azure Data Factory?**

- For an overview of Azure Data Factory, see [Introduction to Azure Data Factory][adf-introduction].
- For a quick tutorial, see [Get started with Azure Data Factory][adfgetstarted].
- For comprehensive documentation, see [Azure Data Factory documentation][adf-documentation-landingpage].
 
**Q: What are the supported data sources and activities?**

- **Supported data sources:** Azure Storage (Blob and Tables), SQL Server, Azure SQL Database. 
- **Supported activities:**: Copy Activity (on-premises to cloud, and cloud to on-premises), HDInsight Activity (Pig and Hive transformations), and custom C# activities.
  
**Q: How do customers access Data Factory?**

Customers can get access to Data Factory through the [Azure Preview Portal][azure-preview-portal].

**Q: What is the Data Factory’s region availability?**

At public preview, Data Factory will only be available in US West.  The compute and storage services used by data factories can be in other regions.
 
**Q: What are the limits on number of data factories/pipelines/activities/datasets?** 


- Number of data factories within a subscription: 50
- Number of pipelines within a data factory: 100
- Number of activities within a pipeline: 10
- Number of datasets with in a data factory: 100

**Q: What regions are supported by the Copy Activity ?**

The Copy Activity supports copying data into the following regions: East US 2, West US, North Europe, West Europe, and South East Asia.

Copying data into other regions is also supported, by using one of the five regions above for routing the data.  Copy operation is metered based on the region where data is routed through.

Region of copy destination | Region used for routing
-------------------------- | -----------------------
East US | East US 2
Central US | East US 2
North Central US | East US 2
South Central US | West US
East Asia | South East Asia
Japan East | West US
Japan West | West US
Brazil South | East US 2

**Q: When using a HDInsight cluster, which are the regions that are supported by HDInsight?**

See the Geographic Availability section in the following article: or [HDInsight Pricing Details][hdinsight-supported-regions].

**Q: What region is used by an on-demand HDInsight cluster?**

The on-demand HDInsight cluster is created in the same region where the storage you specified to be used with the cluster exists.    

## See Also
[Introduction to Azure Data Factory][adf-introduction]
[Get started with Azure Data Factory][adfgetstarted]
[Troubleshooting Guide for Data Factory][adf-troubleshoot]


[adfgetstarted]: ../data-factory-get-started
[adf-introduction]: ../data-factory-introduction
[adf-troubleshoot]: ../data-factory-troubleshoot
[adf-documentation-landingpage]: http://go.microsoft.com/fwlink/?LinkId=516909
[azure-preview-portal]: http://portal.azure.com

[adf-pricing-details]: http://go.microsoft.com/fwlink/?LinkId=517777
[hdinsight-supported-regions]: http://azure.microsoft.com/en-us/pricing/details/hdinsight/