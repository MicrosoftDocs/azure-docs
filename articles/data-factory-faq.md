<properties title="Azure Data Factory - Frequently Asked Questions" pageTitle="Azure Data Factory - Frequently Asked Questions" description="Frequently asked questions about Azure Data Factory." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="spelluru" />

# Azure Data Factory - Frequently Asked Questions

**Q: What is Azure Data Factory?**

Data Factory provides a fully managed service for developers to compose data movement, processing activities that span varied technologies into highly available, fault tolerant data pipelines.   A pipeline is a set of data sources and activities that are orchestrated to be processed by a set of services.  Data Factory provides a management and monitoring experience that oversees the end-to-end view (all the pipelines overlaid with rich operational & services health information).
 
**Q: What customer challenge does Data Factory solve for?**

Azure Data Factory bridges the customer requirements of being more agile in using diverse data storage, processing and movement technologies wherever they might reside (i.e. outside of their traditional data warehouse or their internal network) alongside control and management within a single user interface.

**Q: Who are the target audiences for Data Factory?**


- Data Developers: who are responsible for coding up data movement in-between Hadoop and other systems:
	- Must keep up and integrate with a continually changing and growing data landscape
	- Custom code for information production is expensive, hard to maintain, and not highly available or fault tolerant

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
- **Supported activities:** : Copy Activity, HDInsight Activity (Pig and Hive transformations), and custom C# activities.
  
**Q: How do customers access Data Factory?**

Customers can get access to Data Factory through the [Azure Preview Portal][azure-preview-portal].

**Q: What is the Data Factory’s region availability?**
At public preview, Data Factory will only be available in US West.  The compute and storage services used by data factories can be in other regions.
 
**Q: What are the limits on number of data factories/pipelines/activities/datasets?** 


- Number of data factories within a subscription: 50
- Number of pipelines within a data factory: 100
- Number of activities within a pipeline: 10
- Number of datasets with in a data factory: 100


[adfgetstarted]: ../data-factory-get-started

[adf-introduction]: ../data-factory-introduction
[adf-documentation-landingpage]: http://go.microsoft.com/fwlink/?LinkId=516909
[azure-preview-portal]: http://portal.azure.com

[adf-pricing-details]: http://go.microsoft.com/fwlink/?LinkId=517777