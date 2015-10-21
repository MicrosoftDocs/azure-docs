<properties 
	pageTitle="Azure Data Factory - Frequently Asked Questions" 
	description="Frequently asked questions about Azure Data Factory." 
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
	ms.date="09/08/2015" 
	ms.author="spelluru"/>

# Azure Data Factory - Frequently Asked Questions

## General questions

### What is Azure Data Factory?

Data Factory is a cloud-based data integration service that orchestrates and automates the movement and transformation of data. Just like a manufacturing factory that runs equipment to take raw materials and transform them into finished goods, Data Factory orchestrates existing services that collect raw data and transform it into ready-to-use information. 

Data Factory works across on-premises and cloud data sources and SaaS to ingest, prepare, transform, analyze, and publish your data.  Use Data Factory to compose services into managed data flow pipelines to transform your data using services like [Azure HDInsight (Hadoop)](http://azure.microsoft.com/documentation/services/hdinsight/) and [Azure Batch](http://azure.microsoft.com/documentation/services/batch/) for your big data computing needs, and with [Azure Machine Learning](http://azure.microsoft.com/documentation/services/machine-learning/) to operationalize your analytics solutions.  Go beyond just a tabular monitoring view, and use the rich visualizations of Data Factory to quickly display the lineage and dependencies between your data pipelines. Monitor all of your data flow pipelines from a single unified view to easily pinpoint issues and setup monitoring alerts.

See [Overview & Key Concepts](data-factory-introduction.md) for more details. 
 
### What customer challenge does Data Factory solve?

Azure Data Factory balances the agility of leveraging diverse data storage, processing and movement services across traditional relational storage alongside unstructured data, with the control and monitoring capabilities of a fully managed service.

### Who are the target audiences for Data Factory?


- Data Developers: who are responsible for building integration services between Hadoop and other systems:
	- Must keep up and integrate with a continually changing and growing data landscape
	- Must write custom code for information production, and it  is expensive, hard to maintain, and not highly available or fault tolerant

- IT Professionals: who are looking to incorporate more diverse data within their IT infrastructure:
	- Required to look across all of an organization’s data to derive rich business insights
	- Must manage compute and storage resources to balance cost and scale across on-premises and cloud
	- Must quickly add diverse sources and processing to address new business needs, while maintaining visibility across all compute and storage assets

### Where can I find pricing details for Azure Data Factory?

See [Data Factory Pricing Details page][adf-pricing-details] for the pricing details for the Azure Data Factory.  

### How do I get started with Azure Data Factory?

- For an overview of Azure Data Factory, see [Introduction to Azure Data Factory][adf-introduction].
- For a quick tutorial, see [Get started with Azure Data Factory][adfgetstarted].
- For comprehensive documentation, see [Azure Data Factory documentation][adf-documentation-landingpage].

  
### How do customers access Data Factory?

Customers can get access to Data Factory through the [Azure Preview Portal][azure-preview-portal].

### What is the Data Factory’s region availability?

Data Factory is available in US West and North Europe. The compute and storage services used by data factories can be in other regions.
 
### What are the limits on number of data factories/pipelines/activities/datasets?
 
See **Azure Data Factory Limits** section of the [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md#data-factory-limits) article.


### What is the authoring/developer experience with Azure Data Factory service?

You can author/create data factories using one of the following:

- **Azure Preview Portal**. The Data Factory blades in the Azure Preview Portal provide rich user interface for you to create data factories ad linked services. The **Data Factory Editor**, which is also part of the portal, allows you to easily create linked services, tables, data sets, and pipelines by specifying JSON definitions for these artifacts. See [Data Factory Editor][data-factory-editor] for an overview of the editor and [Get started with Data Factory][datafactory-getstarted] for an example of using the portal/editor to create and deploy a data factory.   
- **Azure PowerShell**. If you are a PowerShell user and prefer to use PowerShell instead of Portal UI, you can use Azure Data Factory cmdlets that are shipped as part of Azure PowerShell to create and deploy data factories. See [Create and monitor Azure Data Factory using Azure PowerShell][create-data-factory-using-powershell] for a simple example and [Tutorial: Move and process log files using Data Factory][adf-tutorial] for an advanced example of using PowerShell cmdles to create ad deploy a data factory. See [Data Factory Cmdlet Reference][adf-powershell-reference] content on MSDN Library for a comprehensive documentation of Data Factory cmdlets.  
- **Visual Studio**. You can also use Visual Studio to programmatically create, monitor, and manage data factories. See [Create, monitor, and manage Azure data factories using Data Factory .NET SDK](data-factory-create-data-factories-programmatically) article for details.  
- **.NET Class Library**. You can programmatically create data factories by using Data Factory .NET SDK. See [Create, monitor, and manage data factories using .NET SDK][create-factory-using-dotnet-sdk] for a walkthrough of creating a data factory using .NET SDK. See [Data Factory Class Library Reference][msdn-class-library-reference] for a comprehensive documentation of Data Factory .NET SDK.  
- **REST API**. You can also use the REST API exposed by the Azure Data Factory service to create and deploy data factories. See [Data Factory REST API Reference][msdn-rest-api-reference] for  a comprehensive documentation of Data Factory REST API. 

### Can I rename a data factory?
No. Like other Azure resources, the name of an Azure data factory cannot be changed. 

## Activities - FAQ
### What are the supported data sources and activities?

See [Data Movement Activities](data-factory-data-movement-activities.md) and [Data Transformation Activities](data-factory-data-transformation-activities.md) articles for the supported data sources and activities.  

### When does an activity run?
The **availability** configuration setting in the output data table determines when the activity is run. The activity checks whether all the input data dependencies are satisfied (i.e., **Ready** state) before it starts running.

## Copy Activity - FAQ
### Is it better to have a pipeline with multiple activities or a separate pipeline for each activity? 
Pipelines are supposed to bundle related activities.  Logically, you can keep the activities in one pipeline if the tables that connect them are not consumed by any other activity outside the pipeline. This way, you would not need to chain pipeline active periods so that they align with each other. Also, the data integrity in the tables internal to the pipeline will be better preserved when updating the pipeline. Pipeline update essentially stops all the activities within the pipeline, removes them, and creates them again. From authoring perspective, it might also be easier to see the flow of data within the related activities in one JSON file for the pipeline. 

## HDInsight Activity - FAQ

### What regions are supported by HDInsight?

See the Geographic Availability section in the following article: or [HDInsight Pricing Details][hdinsight-supported-regions].

### What region is used by an on-demand HDInsight cluster?

The on-demand HDInsight cluster is created in the same region where the storage you specified to be used with the cluster exists.    

### How to associate additional storage accounts to your HDInsight cluster?

If you are using your own HDInsight Cluster (BYOC - Bring Your Own Cluster), see the following topics: 

- [Using an HDInsight Cluster with Alternate Storage Accounts and Metastores][hdinsight-alternate-storage]
- [Use Additional Storage Accounts with HDInsight Hive][hdinsight-alternate-storage-2]

If you are using an on-demand cluster that is created by the Data Factory service, you need to specify additional storage accounts for the HDInsight linked service so that the Data Factory service can register them on your behalf. In the JSON definition for the on-demand linked service, use **additionalLinkedServiceNames** property to specify alternate storage accounts as shown in the following JSON snippet:
 
	{
	    "name": "MyHDInsightOnDemandLinkedService",
	    "properties":
	    {
	        "type": "HDInsightOnDemandLinkedService",
	        "clusterSize": 1,
	        "timeToLive": "00:01:00",
	        "linkedServiceName": "LinkedService-SampleData",
	        "additionalLinkedServiceNames": [ "otherLinkedServiceName1", "otherLinkedServiceName2" ] 
	    }
	} 

In the example above, otherLinkedServiceName1 and otherLinkedServiceName2 represent linked services whose definitions contain credentials that the HDInsight cluster needs to access alternate storage accounts.

## Stored Procedure Activity - FAQ
### What data sources does the Stored Procedure Activity support?
The Stored Procedure Activity supports only Azure SQL Database at this time. 

## Slices - FAQ

### How can I rerun a slice?
You can rerun a slice in one of the following ways: 

- Click **Run** in the command bar on the **DATA SLICE** blade for the slice in the portal. 
- Run **Set-AzureDataFactorySliceStatus** cmdlet with Status set to **PendingExecution** for the slice.   
	
		Set-AzureDataFactorySliceStatus -Status PendingExecution -ResourceGroupName $ResourceGroup -DataFactoryName $df -TableName $table -StartDateTime "02/26/2015 19:00:00" -EndDateTime "02/26/2015 20:00:00" 

See [Set-AzureDataFactorySliceStatus][set-azure-datafactory-slice-status] for details about the cmdlet. 

### How long did it take to process a slice?
1. Click **Datasets** tile on the **DATA FACTORY** blade for your data factory.
2. Click the specific dataset on the **Datasets** blade.
3. Select the slice that you are interested in from the **Recent slices** list on the **TABLE** blade.
4. Click the activity run from the **Activity Runs** list on the **DATA SLICE** blade. 
5. Click **Properties** tile on the **ACTIVITY RUN DETAILS** blade. 
6. You should see the **DURATION** field with a value. This is the time taken to process the slice.   

### How to stop a running slice?
If you need to stop the pipeline from executing, you can use [Suspend-AzureDataFactoryPipeline](https://msdn.microsoft.com/library/dn834939.aspx) cmdlet. Currently, suspending the pipeline does not stop the slice executions that are in progress. Once the in-progress executions finish, no extra slice is picked up.

If you really want to stop all the executions immediately, the only way would be to delete the pipeline and create it again. If you choose to delete the pipeline, you do NOT need to delete tables and linked services used by the pipeline. 



[image-rerun-slice]: ./media/data-factory-faq/rerun-slice.png

[adfgetstarted]: data-factory-get-started.md
[adf-introduction]: data-factory-introduction.md
[adf-troubleshoot]: data-factory-troubleshoot.md
[data-factory-editor]: data-factory-editor.md
[datafactory-getstarted]: data-factory-get-started.md
[create-data-factory-using-powershell]: data-factory-monitor-manage-using-powershell.md
[adf-tutorial]: data-factory-tutorial.md
[create-factory-using-dotnet-sdk]: data-factory-create-data-factories-programmatically.md
[msdn-class-library-reference]: https://msdn.microsoft.com/library/dn883654.aspx
[msdn-rest-api-reference]: https://msdn.microsoft.com/library/dn906738.aspx

[adf-powershell-reference]: https://msdn.microsoft.com/library/dn820234.aspx 
[adf-documentation-landingpage]: http://go.microsoft.com/fwlink/?LinkId=516909
[azure-preview-portal]: http://portal.azure.com
[set-azure-datafactory-slice-status]: https://msdn.microsoft.com/library/azure/dn835095.aspx

[adf-pricing-details]: http://go.microsoft.com/fwlink/?LinkId=517777
[hdinsight-supported-regions]: http://azure.microsoft.com/pricing/details/hdinsight/
[hdinsight-alternate-storage]: http://social.technet.microsoft.com/wiki/contents/articles/23256.using-an-hdinsight-cluster-with-alternate-storage-accounts-and-metastores.aspx
[hdinsight-alternate-storage-2]: http://blogs.msdn.com/b/cindygross/archive/2014/05/05/use-additional-storage-accounts-with-hdinsight-hive.aspx
 
