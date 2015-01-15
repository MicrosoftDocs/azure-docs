<properties title="" pageTitle="Monitor and manage Azure Data Factory using Azure PowerShell" description="Learn how to use Azure PowerShell to monitor and manage Azure data factories you have created." metaKeywords="" services="data-factory" solutions="" documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar"/>

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/13/2014" ms.author="spelluru" />

# Monitor and manage Azure Data Factory using Azure PowerShell
The following table lists cmdlets you can use monitor and manage Azure data factories by using Azure PowerShell. 

> [AZURE.NOTE] See [Data Factory Cmdlet Reference][cmdlet-reference] for comprehensive documentation on Data Factory cmdlets. 


- [Get-AzureDataFactory](#get-azuredatafactory)
- [Get-AzureDataFactoryLinkedService](#get-azuredatafactorylinkedservice)
- [Get-AzureDataFactoryTable](#get-azuredatafactorytable)
- [Get-AzureDataFactoryPipeline](#get-azuredatafactorypipeline)
- [Get-AzureDataFactorySlice](#get-azuredatafactoryslice)
- [Get-AzureDataFactoryRun](#get-azuredatafactoryrun)
- [Save-AzureDataFactoryLog](#save-azuredatafactorylog)
- [Get-AzureDataFactoryGateway](#get-azuredatafactorygateway)
- [Set-AzureDataFactoryPipelineActivePeriod](#set-azuredatafactorypipelineactiveperiod)
- [Set-AzureDataFactorySliceStatus](#set-azuredatafactoryslicestatus)
- [Suspend-AzureDataFactoryPipeline](#suspend-azuredatafactorypipeline)
- [Resume-AzureDataFactoryPipeline](#resume-azuredatafactorypipeline)


##<a name="get-azuredatafactory"></a>Get-AzureDataFactory
Gets the information about a specific data factory or all data factories in an Azure subscription within the specified resource group.
 
###Example 1

    Get-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup

This command returns all the data factories in the resource group ADFTutorialResourceGroup.
 
###Example 2

    Get-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactory

This command returns details about the ADFTutorialDataFactory datafactory in the resource group ADFTutorialResourceGroup. 

## <a name="get-azuredatafactorylinkedservice"></a> Get-AzureDataFactoryLinkedService ##
The Get-AzureDataFactoryLinkedService cmdlet gets information about a specific linked service or all linked services in an Azure data factory.

### Example 1 ###

    Get-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory
 
This command returns information about all linked services in the Azure data factory ADFTutorialDataFactory.


You can use the -DataFactory parameter instead of using DataFactoryName and ResourceGroupName parameters. This helps you with entering the resource group and factory names only once and use the Data Factory object as parameter for all the cmdlets that take both ResourceGroupName and DataFactoryName as parameters.

    $df = Get-AzureDataFactory -ResourceGroup ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory
	
	Get-AzureDataFactoryLinkedService -DataFactory $df 

### Example 2

    Get-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -Name MyBlobStore

This command returns information about the linked service MyBlobStore in the Azure data factoryADFTutorialDataFactory. 

You can use the -DataFactory parameter instead of using -ResourceGroup and -DataFactoryName parameters as shown below: 


    $df = Get-AzureDataFactory -ResourceGroup ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory
	
	Get-AzureDataFactoryLinkedService -DataFactory $df -Name MyBlobStore


## <a name="get-azuredatafactorytable"></a> Get-AzureDataFactoryTable
The Get-AzureDataFactoryTable cmdlet gets information about a specific table or all tables in an Azure data factory. 

### Example 1

    Get-AzureDataFactoryTable -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory

This command returns information about all tables in the Azure data factory ADFTutorialDataFactory.

You can use the -DataFactory parameter instead of using -ResourceGroup and -DataFactoryName parameters as shown below: 


    $df = Get-AzureDataFactory -ResourceGroup ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory
	
	Get-AzureDataFactoryTable -DataFactory $df

### Example 2

    Get-AzureDataFactoryTable -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -Name EmpTableFromBlob

This command returns information about the table EmpTableFromBlob in the Azure data factory ADFTutorialDataFactory.



## <a name="get-azuredatafactorypipeline"></a>Get-AzureDataFactoryPipeline
The Get-AzureDataFactoryPipeline cmdlet gets information about a specific pipeline or all pipelines in an Azure data factory.

### Example 1

    Get-AzureDataFactoryPipeline -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory

This command returns information about all pipelines in the Azure data factory ADFTutorialDataFactory.

### Example 2

    Get-AzureDataFactoryPipeline -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -Name ADFTutorialPipeline

Gets information about the pipeline ADFTutorialPipeline in the Azure data factory ADFTutorialDataFactory.

## <a name="get-azuredatafactoryslice"> </a> Get-AzureDataFactorySlice
The Get-AzureDataFactorySlice cmdlet gets all the slices for a table in an Azure data factory that are produced after the StartDateTime and before the EndDateTime. The data slice with status Ready is ready for consumption by dependent slices.

The following table lists all the statuses of a slice and their descriptions.

<table border="1">	
	<tr>
		<th align="left">Status</th>
		<th align="left">Descritpion</th>
	</tr>	

	<tr>
		<td>PendingExecution</td>
		<td>Data processing has not started yet.</td>
	</tr>	

	<tr>
		<td>InProgress</td>
		<td>Data processing is in-progress.</td>
	</tr>

	<tr>
		<td>Ready</td>
		<td>Data processing has completed and the data slice is ready.</td>
	</tr>

	<tr>
		<td>Failed</td>
		<td>Execution of the run that produces the slice failed.</td>
	</tr>

	<tr>
		<td>Skip</td>
		<td>Skip processing of the slice.</td>
	</tr>

	<tr>
		<td>Retry</td>
		<td>Retrying the run that produces the slice.</td>
	</tr>

	<tr>
		<td>Timed Out</td>
		<td>Data processing of the slice has timed out.</td>
	</tr>

	<tr>
		<td>PendingValidation</td>
		<td>Data slice is waiting for validation against validation policies before being processed.</td>
	</tr>

	<tr>
		<td>Retry Validation</td>
		<td>Retry the validation of the slice.</td>
	</tr>

	<tr>
		<td>Failed Validation</td>
		<td>Validation of the slice failed.</td>
	</tr>

	<tr>
		<td>LongRetry</td>
		<td>A slice will be in this status if LongRetry is specified in the table JSON, and regular retries for the slice have failed.</td>
	</tr>

	<tr>
		<td>ValidationInProgress</td>
		<td>Validation of the slice (based on the policies defined in the table JSON) is being performed.</td>
	</tr>

</table>

For each of the slices, you can drill-down deeper, and see more information about the run that is producing the slice by using Get-AzureDataFactoryRun and Save-AzureDataFactoryLog cmdlets.

### Example

    Get-AzureDataFactorySlice -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -TableName EmpSQLTable -StartDateTime 2014-05-20T10:00:00

This command gets all the slices for the table EmpSQLTable in the Azure data factory ADFTutorialDataFactory produced after 2014-05-20T10:00:00 (GMT). Replace the date-time with the start date time you specified when you ran the Set-AzureDataFactoryPipelineActivePeriod.

## <a name="get-azuredatafactoryrun"></a> Get-AzureDataFactoryRun

The Get-AzureDataFactoryRun cmdlet gets all the runs for a data slice of a table in an Azure data factory.  A table in an Azure data factory is composed of slices over the time axis. The width of a slice is determined by the schedule – hourly/daily. The run is a unit of processing for a slice. There could be one or more runs for a slice in case of retries or if you rerun your slice in case of failures. A slice is identified by its start time. Therefore for the Get-AzureDataFactoryRun cmdlet, you need to pass in the start time of the slice from the results of the Get-AzureDataFactorySlice cmdlet.

For example, to get a run for the following slice, you use 2015-04-02T20:00:00. 

    ResourceGroupName  	: ADFTutorialResourceGroup
    DataFactoryName 	: ADFTutorialDataFactory
    TableName 			: EmpSQLTable
    Start 				: 5/2/2014 8:00:00 PM
    End 				: 5/3/2014 8:00:00 PM
    RetryCount 			: 0
    Status 				: Ready
    LatencyStatus 		:



### Example

    Get-AzureDataFactoryRun -DataFactoryName ADFTutorialDataFactory -TableName EmpSQLTable -ResourceGroupName ADFTutorialResourceGroup -StartDateTime 2014-05-21T16:00:00

This command gets all runs for slices of the table EmpSQLTable in the Azure data factory ADFTutorialDataFactory starting from 4 PM GMT on 05/21/2014.

## <a name="save-azuredatafactorylog"></a> Save-AzureDataFactoryLog
The Save-AzureDataFactoryLog cmdlet downloads log files associated with Azure HDInsight processing of Pig or Hive projects or for custom activities to your local hard drive. You first run the Get-AzureDataFactoryRun cmdlet to get an ID for an activity run for a data slice, and then use that ID to retrieve log files from the binary large object (BLOB) storage associated with the HDInsight cluster. 

If you do not specify **–DownloadLogs** parameter, the cmdlet just returns the location of log files. 

If you specify **–DownloadLogs** parameter without specifying an output directory (**-Output **parameter), the log files are downloaded to the default **Documents** folder. 

If you specify **–DownloadLogs** parameter along with an output folder (**-Output**), the log files are downloaded to the specified folder. 


### Example 1
This command saves log files for the activity run with the ID of 841b77c9-d56c-48d1-99a3-8c16c3e77d39 where the activity belongs to a pipeline in the data factory named LogProcessingFactory in the resource group named ADF. The log files are saved to the C:\Test folder. 

	Save-AzureDataFactoryLog -ResourceGroupName "ADF" -DataFactoryName "LogProcessingFactory" -Id "841b77c9-d56c-48d1-99a3-8c16c3e77d39" -DownloadLogs -Output "C:\Test"
 

### Example 2
This command saves log files to Documents folder (default).


	Save-AzureDataFactoryLog -ResourceGroupName "ADF" -DataFactoryName "LogProcessingFactory" -Id "841b77c9-d56c-48d1-99a3-8c16c3e77d39" -DownloadLogs
 

### Example 3
This command returns the location of log files. Note that –DownloadLogs parameter is not specified. 
  
	Save-AzureDataFactoryLog -ResourceGroupName "ADF" -DataFactoryName "LogProcessingFactory" -Id "841b77c9-d56c-48d1-99a3-8c16c3e77d39"
 



## <a name="get-azuredatafactorygateway"></a> Get-AzureDataFactoryGateway
The Get-AzureDataFactoryGateway cmdlet gets information about a specific gateway or all gateways in an Azure data factory. You need to install a gateway on your on-premises computer so to be able add an on-premises SQL Server as a linked service to a data factory.

### Example 1
    Get-AzureDataFactoryGateway -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory
This command returns information about all gateways in the Azure data factory ADFTutorialDataFactory.

### Example 2

    Get-AzureDataFactoryGateway -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -Name ADFTutorialGateway

This command returns information about the gateway ADFTutorialGateway in the Azure data factory ADFTutorialDataFactory.

## <a name="set-azuredatafactorypipelineactiveperiod"></a> Set-AzureDataFactoryPipelineActivePeriod
This cmdlet sets the active period for the data slices that are processed by the pipeline. If you use Set-AzureDataFactorySliceStatus, make sure that the slice startdate and end date are in the active period of the pipeline.

Once the pipelines are created, you can specify the duration in which data processing will occur. By specifying the active period for a pipeline, you are defining the time duration in which the data slices will be processed based on the Availability properties that were defined for each ADF table.

### Example

    Set-AzureDataFactoryPipelineActivePeriod  -Name ADFTutorialPipeline -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -StartDateTime 2014-05-21T16:00:00 -EndDateTime 2014-05-22T16:00:00

This command sets the active period for the data slices that are processed by the pipeline ADFTutoiralPipeline to 5/21/2014 4 PM GMT to 5/22/2014 4 PM GMT.

## <a name="set-azuredatafactoryslicestatus"></a> Set-AzureDataFactorySliceStatus
Sets the status of a slice for a table. The slice start date and end date must be in the active period of the pipeline.

### Supported values for status
Each data slice for a table goes through different stages. These stages are slightly different based on whether validation policies are specified.


- If validation policies are  not specified: PendingExecution -> InProgress -> Ready
- If validation policies are specified: PendingExecution -> Pending Validation -> InProgress -> Ready

The following table provides descriptions for possible statuses of a slice and tells you whether the status can be set using the Set-AzureDataFactorySliceStatus or not.

<table border="1">	
	<tr>
		<th>Status</th>
		<th>Descritpion</th>
		<th>Can this be set using cmdlet></th>
	</tr>	

	<tr>
		<td>PendingExecution</td>
		<td>Data processing has not started yet.</td>
		<td>Y</td>
	</tr>	

	<tr>
		<td>InProgress</td>
		<td>Data processing is in-progress.</td>
		<td>N</td>
	</tr>

	<tr>
		<td>Ready</td>
		<td>Data processing has completed and the data slice is ready.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>Failed</td>
		<td>Execution of the run that produces the slice failed.</td>
		<td>N</td>
	</tr>

	<tr>
		<td>Skip</td>
		<td>Skip processing of the slice.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>Retry</td>
		<td>Retrying the run that produces the slice.</td>
		<td>N</td>
	</tr>

	<tr>
		<td>Timed Out</td>
		<td>Data processing has timed out.</td>
		<td>N</td>
	</tr>

	<tr>
		<td>PendingValidation</td>
		<td>Data slice is waiting for validation against validation policies before being processed.</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>Retry Validation</td>
		<td>Retry the validation of the slice.</td>
		<td>N</td>
	</tr>

	<tr>
		<td>Failed Validation</td>
		<td>Validation of the slice failed.</td>
		<td>N</td>
	</tr>
	</table>


### Supported Values - Update Type
For each table in an Azure data factory, when you set the status of a slice, you need to specify whether the status update applies to only to the table, or whether the status updates propagate to all affected slices.

<table border="1">	
	<tr>
		<th>Update Type</th>
		<th>Descritpion</th>
		<th>Can this be set using cmdlet</th>
	</tr>

	<tr>
		<td>Individual</td>
		<td>Sets the status of each slice for the table in the specified time range</td>
		<td>Y</td>
	</tr>

	<tr>
		<td>UpstreamInPipeline</td>
		<td>Sets the status of each slice for the table and all the dependent (upstream) tables which are used as input tables for activities in the pipeline.</td>
		<td>Y</td>
	</tr>

</table>
## <a name="suspend-azuredatafactorypipeline"></a> Suspend-AzureDataFactoryPipeline
The Suspend-AzureDataFactoryPipeline cmdlet suspends the specified pipeline in an Azure data factory. You can resume the pipeline later by using the Resume-AzureDataFactoryPipeline cmdlet.

### Example

    Suspend-AzureDataFactoryPipeline -Name ADFTutorialPipeline -DataFactoryName ADFTutorialDataFactory -ResourceGroupName ADFTutorialResourceGroup

This command suspends the pipeline ADFTutorialPipeline in the Azure data factory ADFTutorialDataFactory.

## <a name="resume-azuredatafactorypipeline"></a> Resume-AzureDataFactoryPipeline
The Resume-AzureDataFactoryPipeline cmdlet resumes the specified pipeline that is currently in suspended state in an Azure data factory. 

### Example

    Resume-AzureDataFactoryPipeline ADFTutorialPipeline -DataFactoryName ADFTutorialDataFactory -ResourceGroupName ADFTutorialResourceGroup

This command resumes the pipeline ADFTutorialPipeline in the Azure data factory ADFTutorialDataFactory that was suspended before by using the Suspend-AzureDataFactoryPipeline command.

## See Also

Article | Description
------ | ---------------
[Monitor and manage Azure Data Factory using Azure Preview Portal][monitor-manage-using-portal] | This article describes how to monitor and manage an Azure data factory using Azure Preview Portal.
[Enable your pipelines to work with on-premises data][use-onpremises-datasources] | This article has a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob.
[Use Pig and Hive with Data Factory][use-pig-and-hive-with-data-factory] | This article has a walkthrough that shows how to use HDInsight Activity to run a hive/pig script to process input data to produce output data. 
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an end-to-end walkthrough that shows how to implement a near real world scenario using Azure Data Factory to transform data from log files into insights.
[Use custom activities in a Data Factory][use-custom-activities] | This article provides a walkthrough with step-by-step instructions for creating a custom activity and using it in a pipeline. 
[Troubleshoot Data Factory issues][troubleshoot] | This article describes how to troubleshoot Azure Data Factory issue.
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 
[Azure Data Factory Cmdlet Reference][cmdlet-reference] | This reference content has details about all the **Data Factory cmdlets**.

[use-onpremises-datasources]: ../data-factory-use-onpremises-datasources
[use-pig-and-hive-with-data-factory]: ../data-factory-pig-hive-activities
[adf-tutorial]: ../data-factory-tutorial
[use-custom-activities]: ../data-factory-use-custom-activities
[monitor-manage-using-portal]: ../data-factory-monitor-manage-using-management-portal

[troubleshoot]: ../data-factory-troubleshoot
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456