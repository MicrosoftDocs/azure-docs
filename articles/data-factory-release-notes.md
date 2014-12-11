<properties title="Azure Data Factory - Release Notes" pageTitle="Data Factory - Release Notes | Azure" description="Data Factory release notes" metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/04/2014" ms.author="spelluru" />

# Azure Data Factory release notes

## Notes for 12/11/2014 release of Data Factory ##

### New improvements

- Azure Machine Learning integration
	- This release of Azure Data Factory service allows you to integrate Azure Data Factory with Azure Machine Learning (ML) by using **AzureMLLinkedService** and **AzureMLBatchScoringActivity**. See [Create predictive pipelines using Data Factory and Azure Machine Learning][adf-azure-ml] for details. 
- Gateway version status is provided
	- "NewVersionAvailable" status will be shown in the Azure Preview Portal and in the output of Get-AzureDataFactoryGateway cmdlet, if there is a newer version of the gateway available than the one that is currently installed. You can then follow the portal journey  to download the new installation file (.msi) and run it to install the latest gateway. There is no additional configuration is  needed.

### Changes

- JobsContainer in HdInsightOnDemandLinkedService is removed.
	- In the JSON definition for a HDInsightOnDemandLinkedService, you do not need to specify **jobsContainer** property anymore. If you have the property specified for an on-demand linked service, the property is ignored. You can remove the property from the JSON definition for the linked service and update the linked service definition by using New-AzureDataFactoryLinkedService cmdlet.
- Optional configuration parameters for HDInsightOnDemandLinkedService
	- This release introduces support for a few optional configuration parameters for HDInsightOnDemandLinked (on-demand HDInsight cluster). See [ClusterCreateParameters Properties][on-demand-hdi-parameters] for details.
- Gateway location is removed
	- When creating an Azure Data Factory gateway via portal or PowerShell (New-AzureDataFactoryGateway), you no longer need to specifiy the location for the gateway. The data factory region will be inherited. Similarly, to configure a SQL Server linked Service using JSON, "gatewayLocation" property is not needed anymore. Data Factory .NET SDK is also updated to refelct these changes.
	- If you use an older version of SDK and Azure PowerShell, you are still required to provide the location setting.
 
     

#### Breaking changes
	
- CustomActivity to DotNetActivity
	- **ICustomActivity** interface is renamed to **IDotNetActivity**. You will need to update Data Factory NuGet packages and change ICustomActivity to IDotNetActivity in the source code for your custom activity.  
	- The type of custom activity in the JSON definition for you custom activity must be changed from **CustomActivity** to **DotNetActivity**. 
	- The **CustomActivity** and **CustomActivityProperties** classes have been renamed to **DotNetActivity** and **DotNetActivityProperties** with the same set of properties.

		If you use the older verion of SDK and Azure PowerShell, you can continue using CustomActivity instead of DotNetActivity.
    
  		See [Use custom activities in an Azure Data Factory pipeline][adf-custom-activities] for a walkthrough on how to create a custom activity and use it in an Azure Data Factory pipeline.  

[adf-azure-ml]: ../data-factory-create-predictive-pipelines
[adf-custom-activities]: ../data-factory-use-custom-activities
[on-demand-hdi-parameters]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.management.hdinsight.clustercreateparameters_properties.aspx


