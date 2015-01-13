<properties title="" pageTitle="Troubleshoot Azure Data Factory issues" description="Learn how to troubleshoot issues with using Azure Data Factory." metaKeywords="" services="data-factory" solutions="" documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar"/>

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/13/2014" ms.author="spelluru" />

# Troubleshoot Data Factory issues
You can troubleshoot Azure Data Factory issues using Azure Portal (or) Azure PowerShell cmdlets. This topic has walkthroughs that show you how to use the Azure Portal to quickly troubleshoot errors that you encounter with Data Factory. 

## Problem: Not able to run Data Factory cmdlets
To resolve this issue, switch Azure mode to **AzureResourceManager**: 

Launch **Azure PowerShell** and execute the following command to switch to the **AzureResourceManager** mode.The Azure Data Factory cmdlets are available in the **AzureResourceManager** mode.

         switch-azuremode AzureResourceManager

## Problem: Unauthorized error when running a Data Factory cmdlet
You are probably not using the right Azure account or subscription with the Azure PowerShell. Use the following cmdlets to select the right Azure account and subscription to use with the Azure PowerShell. 

1. Add-AzureAccount - Use the right user ID and password
2. Get-AzureSubscription - View all the subscriptions for the account. 
3. Select-AzureSubscription <subscription name> - Select the right subscription. Use the same one you use to create a data factory on the Azure Preview Portal.

## Problem: Input slices are in PendingExecution or PendingValidation state for ever

The slices could be in **PendingExecution** or **PendingValidation** state due to a number of reasons and one of the common reasons is that the **waitOnExternal** property is not specified in the **availability** section of the first table/dataset in the pipeline. Any dataset that is produced outside the scope of Azure Data Factory should be marked with **waitOnExternal** property under **availability** section. This indicates that the data is external and not backed by any pipelines within the data factory. The data slices are marked as **Ready** once the data is available in the respective store. 

See the following example for the usage of the **waitOnExternal** property. You can specify **waitOnExternal{}** without setting values for properties in the section so that the default values are used. 

See Tables topic in [JSON Scripting Reference][json-scripting-reference] for more details about this property.
	
	{
	    "name": "CustomerTable",
	    "properties":
	    {
	        "location":
	        {
	            "type": "AzureBlobLocation",
	            "folderPath": "MyContainer/MySubFolder/",
	            "linkedServiceName": "MyLinkedService",
	            "format":
	            {
	                "type": "TextFormat",
	                "columnDelimiter": ",",
	                "rowDelimiter": ";"
	            }
	        },
	        "availability":
	        {
	            "frequency": "Hour",
	            "interval": 1,
	            "waitOnExternal":
	            {
	                "dataDelay": "00:10:00",
	                "retryInterval": "00:01:00",
	                "retryTimeout": "00:10:00",
	                "maximumRetry": 3
	            }
	        }
	    }
	}

 To resolve the error, add the **waitOnExternal** section to the JSON definition of the input table and recreate the table. 

## Walkthroughs 

- [Walkthrough: Troubleshooting an error with copying data](#copywalkthrough)
- [Walkthrough: Troubleshooting an error with Hive/Pig processing](#pighivewalkthrough)

## <a name="copywalkthrough"></a> Walkthrough: Troubleshooting an error with copying data
In this walkthrough, you will introduce an error in the tutorial from Get started with Data Factory article and learn how you can use Azure Portal to troubleshoot the error.

### Prerequisites
1. Complete the Tutorial in the [Get started with Azure Data Factory][adfgetstarted] article.
2. Confirm that the **ADFTutorialDataFactory** produces data in the **emp** table in the Azure SQL Database.  
3. Now, delete the **emp** table (**drop table emp**) from the Azure SQL Database. This will introduce an error.
4. Run the following command in the **Azure PowerShell** to update the active period for the pipeline so that it tries to write data to the **emp** table, which doesn’t exist anymore.

         
		Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -StartDateTime 2014-09-29 –EndDateTime 2014-09-30 –Name ADFTutorialPipeline
	
	> [AZURE.NOTE] Replace <b>StartDateTime</b> value with the current day and <b>EndDateTime</b> value with the next day. 


### Use Azure Preview Portal to troubleshoot the error

1.	Login to [Azure Preview Portal][azure-preview-portal]. 
2.	Click **ADFTutorialDataFactory** from the **Startboard**. If you don’t see the data factory link on the **Startboard**, click **BROWSE** hub and click **Everything**. Click **Data factories…** in the **Browse** blade, and click **ADFTutorialDataFactory**.
3.	Notice that you see **With errors** on the **Datasets** tile. Click **With errors**. You should see **Datasets with errors** blade.

	![Data Factory with Errors link][image-data-factory-troubleshoot-with-error-link]

4. In the **Datasets** with errors blade, click **EmpSQLTable** to see the **TABLE** blade.	

	![Datasets with errors blade][image-data-factory-troubleshoot-datasets-with-errors-blade]

5. In the **TABLE** blade, you should see the problem slices, i.e., slices with an error in the **Problem slices** list at the bottom. You can also see any recent slices with errors in the **Recent slices** list. Click on a slice in the **Problem slices** list. 

	![Table blade with problem slices][image-data-factory-troubleshoot-table-blade-with-problem-slices]

	If you click **Problem slices** (not on a specific problem), you will see the **DATA SLICES** blade and then click a **specific problem slice** to see the **DATA SLICE** slide for the selected data slice.

6. In the **DATA SLICE** blade for **EmpSQLTable**, you see all **activity runs** for the slice in the list at the bottom. Click on an **activity run** from the list that failed.

	![Data Slice blade with active runs][image-data-factory-troubleshoot-dataslice-blade-with-active-runs]


7. In the **Activity Run Details** blade for the activity run you selected, you should see details about the error. In this scenario, you see: **Invalid object name ‘emp’**.

	![Activity run details with an error][image-data-factory-troubleshoot-activity-run-with-error]

To resolve this issue, create the **emp** table using the SQL script from [Get started with Data Factory][adfgetstarted] article.


### Use Azure PowerShell cmdlets to troubleshoot the error
1.	Launch **Azure PowerShell**. 
2.	Switch to **AzureResourceManager** mode as the Data Factory cmdlets are available only in this mode.

         
		switch-azuremode AzureResourceManager

3. Run Get-AzureDataFactorySlice command to see the slices and their statuses. You should see a slice with the status: Failed.	

         
		Get-AzureDataFactorySlice -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -TableName EmpSQLTable -StartDateTime 2014-10-15

	> [AZURE.NOTE] Replace **StartDateTime** with the StartDateTime value you specified for the **Set-AzureDataFactoryPipelineActivePeriod**. 

		ResourceGroupName 		: ADFTutorialResourceGroup
		DataFactoryName   		: ADFTutorialDataFactory
		TableName         		: EmpSQLTable
		Start             		: 10/15/2014 4:00:00 PM
		End               		: 10/15/2014 5:00:00 PM
		RetryCount        		: 0
		Status            		: Failed
		LatencyStatus     		:
		LongRetryCount    		: 0

	Note the **Start** time for the problem slice (the slice with **Status** set to **Failed**) in the output. 
4. Now, run the **Get-AzureDataFactoryRun** cmdlet to get details about activity run for the slice.
         
		Get-AzureDataFactoryRun -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -TableName EmpSQLTable -StartDateTime "10/15/2014 4:00:00 PM"

	The value of **StartDateTime** is the Start time for the error/problem slice you noted from the previous step. The date-time should be enclosed in double quotes.
5. You should see the output with details about the error (similar to the following):

		Id                  	: 2b19475a-c546-473f-8da1-95a9df2357bc
		ResourceGroupName   	: ADFTutorialResourceGroup
		DataFactoryName     	: ADFTutorialDataFactory
		TableName           	: EmpSQLTable
		ResumptionToken    		:
		ContinuationToken   	:
		ProcessingStartTime 	: 10/15/2014 11:13:39 PM
		ProcessingEndTime  	 	: 10/15/2014 11:16:59 PM
		PercentComplete     	: 0
		DataSliceStart     		: 10/15/2014 4:00:00 PM
		DataSliceEnd       		: 10/15/2014 5:00:00 PM
		Status              	: FailedExecution
		Timestamp           	: 10/15/2014 11:13:39 PM
		RetryAttempt       		: 0
		Properties          	: {}
		ErrorMessage        	: Unknown error in CopyActivity: System.Data.SqlClient.SqlException (0x80131904): **Invalid object name 'emp'.**
                         at System.Data.SqlClient.SqlConnection.OnError(SqlException exception, Boolean
                      breakConnection, Action`1 wrapCloseInAction)
                         at System.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj,

 

## <a name="pighavewalkthrough"></a> Walkthrough: Troubleshooting an error with Hive/Pig processing
This walkthrough provides steps to troubleshoot an error with Hive/Pig processing by using both Azure Preview Portal and Azure PowerShell. 


### Walkthrough: Use Azure Portal to troubleshoot an error with Pig/Hive processing
In this scenario, data set is in an error state due to a failure in Hive processing on an HDInsight cluster.

1. Click **With errors** on **Datasets** tile on the **DATA FACTORY** home page.

	![With errors link on Datasets tile][image-data-factory-troubleshoot-walkthrough2-with-errors-link]

2. In the **Datasets with errors** blade, click the **table** that you are interested in.

	![Datasets with errors blade][image-data-factory-troubleshoot-walkthrough2-datasets-with-errors]

3. In the **TABLE** blade, Click on the **problem slice** with **STATUS** set to **Failed**.

	![Table with problem slices][image-data-factory-troubleshoot-walkthrough2-table-with-problem-slices]

4. In the **DATA SLICE** blade, click the **Activity Run** that failed.

	![Data slice with failed runs][image-data-factory-troubleshoot-walkthrough2-slice-activity-runs]

5. In the **ACTIVITY RUN DETAILS** blade, you can download the files associated with the HDInsight processing. Click **Download** for **Status/stderr** to download the error log file that contains details about the error.

	![Activity run details with download link][image-data-factory-troubleshoot-activity-run-details]

    
### Walkthrough: Use Azure PowerShell to troubleshoot an error with Pig/Hive processing
1.	Launch **Azure PowerShell**. 
2.	Switch to **AzureResourceManager** mode as the Data Factory cmdlets are available only in this mode.

         
		switch-azuremode AzureResourceManager

3. Run Get-AzureDataFactorySlice command to see the slices and their statuses. You should see a slice with the status: Failed.	

         
		Get-AzureDataFactorySlice -ResourceGroupName ADF -DataFactoryName LogProcessingFactory -TableName EnrichedGameEventsTable -StartDateTime 2014-05-04 20:00:00

	> [AZURE.NOTE] Replace **StartDateTime** with the StartDateTime value you specified for the **Set-AzureDataFactoryPipelineActivePeriod**. 

		ResourceGroupName : ADF
		DataFactoryName   : LogProcessingFactory
		TableName         : EnrichedGameEventsTable
		Start             : 5/5/2014 12:00:00 AM
		End               : 5/6/2014 12:00:00 AM
		RetryCount        : 0
		Status            : Failed
		LatencyStatus     :
		LongRetryCount    : 0


	Note the **Start** time for the problem slice (the slice with **Status** set to **Failed**) in the output. 
4. Now, run the **Get-AzureDataFactoryRun** cmdlet to get details about activity run for the slice.
         
		Get-AzureDataFactoryRun -ResourceGroupName ADF -DataFactoryName LogProcessingFactory -TableName EnrichedGameEventsTable -StartDateTime "5/5/2014 12:00:00 AM"

	The value of **StartDateTime** is the Start time for the error/problem slice you noted from the previous step. The date-time should be enclosed in double quotes.
5. You should see the output with details about the error (similar to the following):

		Id                  : 841b77c9-d56c-48d1-99a3-8c16c3e77d39
		ResourceGroupName   : ADF
		DataFactoryName     : LogProcessingFactory3
		TableName           : EnrichedGameEventsTable
		ProcessingStartTime : 10/10/2014 3:04:52 AM
		ProcessingEndTime   : 10/10/2014 3:06:49 AM
		PercentComplete     : 0
		DataSliceStart      : 5/5/2014 12:00:00 AM
		DataSliceEnd        : 5/6/2014 12:00:00 AM
		Status              : FailedExecution
		Timestamp           : 10/10/2014 3:04:52 AM
		RetryAttempt        : 0
		Properties          : {}
		ErrorMessage        : Pig script failed with exit code '5'. See 'wasb://adfjobs@spestore.blob.core.windows.net/PigQuery
								Jobs/841b77c9-d56c-48d1-99a3-8c16c3e77d39/10_10_2014_03_04_53_277/Status/stderr' for more details.
		ActivityName        : PigEnrichLogs
		PipelineName        : EnrichGameLogsPipeline
		Type                :

6. You can run **Save-AzureDataFactoryLog** cmdlet with Id value you see from the above output and download the log files using the **-DownloadLogs** option for the cmdlet.

## Troubleshooting Tips

### Fail to connect to on-premises SQL Server 
Verify that the SQL Server is reachable from the machine where the gateway is installed.


1. Ping the machine where the SQL Server is installed
2. On the machine on which the gateway is installed, Try connecting to the SQL Server instance using the credentials you specified on the Azure Portal using SQL Server Management Studio (SSMS).

### Copy operation fails
1. Launch Data Management Gateway Configuraiton Manager on the machine on which gateway was installed. Verify that the **Gateway name** is set to the logical gateway name on the **Azure Portal**, **Gateway key status** is **registered** and **Service status** is **Started**. 
2. Launch **Event Viewer**. Expand **Applications and Services Logs** and click **Data Management Gateway**. See if there are any errors related to Data Management Gateway. 



## See Also

Article | Description
------ | ---------------
[Enable your pipelines to work with on-premises data][use-onpremises-datasources] | This article has a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob.
[Use Pig and Hive with Data Factory][use-pig-and-hive-with-data-factory] | This article has a walkthrough that shows how to use HDInsight Activity to run a hive/pig script to process input data to produce output data. 
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an end-to-end walkthrough that shows how to implement a near real world scenario using Azure Data Factory to transform data from log files into insights.
[Use custom activities in a Data Factory][use-custom-activities] | This article provides a walkthrough with step-by-step instructions for creating a custom activity and using it in a pipeline. 
[Monitor and Manage Azure Data Factory using PowerShell][monitor-manage-using-powershell] | This article describes how to monitor an Azure Data Factory using Azure PowerShell cmdlets. 
[Troubleshoot Data Factory issues][troubleshoot] | This article describes how to troubleshoot Azure Data Factory issue. You can try the walkthrough in this article on the ADFTutorialDataFactory by introducing an error (deleting table in the Azure SQL Database). 
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 
[Azure Data Factory Cmdlet Reference][cmdlet-reference] | This reference content has details about all the **Data Factory cmdlets**.

[adfgetstarted]: ../data-factory-get-started
[use-onpremises-datasources]: ../data-factory-use-onpremises-datasources
[use-pig-and-hive-with-data-factory]: ../data-factory-pig-hive-activities
[adf-tutorial]: ../data-factory-tutorial
[use-custom-activities]: ../data-factory-use-custom-activities
[monitor-manage-using-powershell]: ../data-factory-monitor-manage-using-powershell
[troubleshoot]: ../data-factory-troubleshoot
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456
[json-scripting-reference]: http://go.microsoft.com/fwlink/?LinkId=516971

[azure-preview-portal]: https://portal.azure.com/

[image-data-factory-troubleshoot-with-error-link]: ./media/data-factory-troubleshoot/DataFactoryWithErrorLink.png

[image-data-factory-troubleshoot-datasets-with-errors-blade]: ./media/data-factory-troubleshoot/DatasetsWithErrorsBlade.png

[image-data-factory-troubleshoot-table-blade-with-problem-slices]: ./media/data-factory-troubleshoot/TableBladeWithProblemSlices.png

[image-data-factory-troubleshoot-activity-run-with-error]: ./media/data-factory-troubleshoot/DataSliceBladeWithActivityRuns.png

[image-data-factory-troubleshoot-dataslice-blade-with-active-runs]: ./media/data-factory-troubleshoot/ActivityRunDetailsWithError.png

[image-data-factory-troubleshoot-walkthrough2-with-errors-link]: ./media/data-factory-troubleshoot/Walkthrough2WithErrorsLink.png

[image-data-factory-troubleshoot-walkthrough2-datasets-with-errors]: ./media/data-factory-troubleshoot/Walkthrough2DataSetsWithErrors.png

[image-data-factory-troubleshoot-walkthrough2-table-with-problem-slices]: ./media/data-factory-troubleshoot/Walkthrough2TableProblemSlices.png

[image-data-factory-troubleshoot-walkthrough2-slice-activity-runs]: ./media/data-factory-troubleshoot/Walkthrough2DataSliceActivityRuns.png

[image-data-factory-troubleshoot-activity-run-details]: ./media/data-factory-troubleshoot/Walkthrough2ActivityRunDetails.png