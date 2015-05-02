<properties 
	pageTitle="Stream Analytics monitor and manage jobs using PowerShell | Azure" 
	description="Learn how to use Azure PowerShell cmdlets to monitor and manage Stream Analytics jobs" 
	services="stream-analytics" 
	documentationCenter="" 
	authors="jeffstokes72" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="04/28/2015" 
	ms.author="jeffstok"/>


# Monitor and manage Stream Analytics jobs by using Azure PowerShell

Learn how to manage Azure Stream Analytics resources by using Azure PowerShell.

## Prerequisites for running Azure PowerShell cmdlets for Stream Analytics

1.	Install and configure Azure PowerShell.

	Follow the instructions in [How to install and configure Azure PowerShell][powershell-install] to install Azure PowerShell.

	To connect to your Azure subscription by using the Azure Active Directory method:

		Add-AzureAccount

	To select your Azure subscription with the Azure Stream Analytics service enabled:

		Select-AzureSubscription

	>[AZURE.NOTE] The following error message indicates that Azure Stream Analytics is not enabled on the subscription:
	>
		Error Code: InvalidResourceType.  Error Message: The resource type 'streamingjobs' could not be found in the namespace 'Microsoft.StreamAnalytics'.  
	
	>To resolve this issue, please enable the Stream Analytics preview on the subscription and then run the following cmdlets to switch the subscription:
	>
		Select-AzureSubscription –SubscriptionId xxxxxxxx

2.	Configure the Azure mode.

	After installing Azure PowerShell, run the [Switch-AzureMode][msdn-switch-azuremode] cmdlet to set the appropriate Azure mode to access Stream Analytics cmdlets:

		Switch-AzureMode AzureResourceManager

>[AZURE.NOTE] There is a temporary limitation where Stream Analytics jobs created via Azure PowerShell do not have monitoring enabled. To work around this issue, navigate to the job’s **Monitor** page in the Azure portal and click the **Enable** button.  

## Azure PowerShell cmdlets for Stream Analytics
The following Azure PowerShell cmdlets can be used to monitor and manage Azure Stream Analytics jobs.

### Get-AzureStreamAnalyticsJob
Lists all Stream Analytics jobs defined in the Azure subscription or specified resource group, or gets job information about a specific job within a resource group.

**Example 1**

	Get-AzureStreamAnalyticsJob

This command returns information about all the Stream Analytics jobs in the Azure subscription.

**Example 2**

	Get-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US 
This command returns information about all the Stream Analytics jobs in the resource group StreamAnalytics-Default-Central-US.

**Example 3**

	Get-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob
This command returns information about the Stream Analytics job StreamingJob in the resource group StreamAnalytics-Default-Central-US.

### Get-AzureStreamAnalyticsInput
Lists all of the inputs that are defined in a specified Stream Analytics job, or gets information about a specific input.

**Example 1**

	Get-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob

This command returns information about all the inputs defined in the job StreamingJob.

**Example 2**

	Get-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name EntryStream
This command returns information about the input named EntryStream defined in the job StreamingJob.

### Get-AzureStreamAnalyticsOutput
Lists all of the outputs that are defined in a specified Stream Analytics job, or gets information about a specific output.

**Example 1**

	Get-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob
This command returns information about the outputs defined in the job StreamingJob.

**Example 2**

	Get-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name Output
This command returns information about the output named Output defined in the job StreamingJob.

### Get-AzureStreamAnalyticsQuota
Gets information about the quota of streaming units in a specified region.

**Example 1**

	Get-AzureStreamAnalyticsQuota –Location "Central US" 
This command returns information about the quota and usage of streaming units in the Central US region.

### Get-AzureStreamAnalyticsTransformation
Gets information about a specific transformation defined in a Stream Analytics job.

**Example 1**

	Get-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name StreamingJob
This command returns information about the transformation called StreamingJob in the job StreamingJob.

### New-AzureStreamAnalyticsInput
Creates a new input within a Stream Analytics job, or updates an existing specified input.
  
The name of the input can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify an input that already exists and do not specify the –Force parameter, the cmdlet will ask whether or not to replace the existing input.

If you specify the –Force parameter and specify an existing input name, the input will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Input (Azure Stream Analytics)][msdn-rest-api-create-stream-analytics-input] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

	New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" 
This command creates a new input from the file Input.json. If an existing input with the name specified in the input definition file is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**
	
	New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" –Name EntryStream
This command creates a new input in the job called EntryStream. If an existing input with this name is already defined, the cmdlet will ask whether or not to replace it.

**Example 3**

	New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" –Name EntryStream -Force
This command replaces the definition of the existing input source called EntryStream with the definition from the file.

### New-AzureStreamAnalyticsJob
Creates a new Stream Analytics job in Microsoft Azure, or updates the definition of an existing specified job.

The name of the job can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify a job name that already exists and do not specify the –Force parameter, the cmdlet will ask whether or not to replace the existing job.

If you specify the –Force parameter and specify an existing job name, the job definition will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Stream Analytics Job][msdn-rest-api-create-stream-analytics-job] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

	New-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\JobDefinition.json" 
This command creates a new job from the definition in JobDefinition.json. If an existing job with the name specified in the job definition file is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

	New-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\JobDefinition.json" –Name StreamingJob -Force
This command replaces the job definition for StreamingJob.

### New-AzureStreamAnalyticsOutput
Creates a new output within a Stream Analytics job, or updates an existing output.  

The name of the output can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify an output that already exists and do not specify the –Force parameter, the cmdlet will ask whether or not to replace the existing output.

If you specify the –Force parameter and specify an existing output name, the output will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Output (Azure Stream Analytics)][msdn-rest-api-create-stream-analytics-output] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

	New-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Output.json" –JobName StreamingJob –Name output
This command creates a new output called "output" in the job StreamingJob. If an existing output with this name is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

	New-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Output.json" –JobName StreamingJob –Name output -Force
This command replaces the definition for "output" in the job StreamingJob.

### New-AzureStreamAnalyticsTransformation
Creates a new transformation within a Stream Analytics job, or updates the existing transformation.
  
The name of the transformation can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify a transformation that already exists and do not specify the –Force parameter, the cmdlet will ask whether or not to replace the existing transformation.

If you specify the –Force parameter and specify an existing transformation name, the transformation will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Transformation (Azure Stream Analytics)][msdn-rest-api-create-stream-analytics-transformation] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

	New-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Transformation.json" –JobName StreamingJob –Name StreamingJobTransform
This command creates a new transformation called StreamingJobTransform in the job StreamingJob. If an existing transformation is already defined with this name, the cmdlet will ask whether or not to replace it.

**Example 2**

	New-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Transformation.json" –JobName StreamingJob –Name StreamingJobTransform -Force
 This command replaces the definition of StreamingJobTransform in the job StreamingJob.

### Remove-AzureStreamAnalyticsInput
Asynchronously deletes a specific input from a Stream Analytics job in Microsoft Azure.  
If you specify the –Force parameter, the input will be deleted without confirmation.

**Example 1**
	
	Remove-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name EventStream
This command removes the input EventStream in the job StreamingJob.  

### Remove-AzureStreamAnalyticsJob
Asynchronously deletes a specific Stream Analytics job in Microsoft Azure.  
If you specify the –Force parameter, the job will be deleted without confirmation.

**Example 1**

	Remove-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –Name StreamingJob 
This command removes the job StreamingJob.  

### Remove-AzureStreamAnalyticsOutput
Asynchronously deletes a specific output from a Stream Analytics job in Microsoft Azure.  
If you specify the –Force parameter, the output will be deleted without confirmation.

**Example 1**

	Remove-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name Output
This command removes the output Output in the job StreamingJob.  

### Start-AzureStreamAnalyticsJob
Asynchronously deploys and starts a Stream Analytics job in Microsoft Azure.

**Example 1**

	Start-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob -OutputStartMode CustomTime -OutputStartTime 2012-12-12T12:12:12Z

This command starts the job StreamingJob with a custom output start time set to December 12, 2012, 12:12:12 UTC.


### Stop-AzureStreamAnalyticsJob
Asynchronously stops a Stream Analytics job from running in Microsoft Azure and de-allocates resources that were that were being used. The job definition and metadata will remain available within your subscription through both the Azure portal and management APIs, such that the job can be edited and restarted. You will not be charged for a job in the stopped state.

**Example 1**

	Stop-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –Name StreamingJob 
This command stops the job StreamingJob.  

### Test-AzureStreamAnalyticsInput
Tests the ability of Stream Analytics to connect to a specified input.

**Example 1**

	Test-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name EntryStream
This command tests the connection status of the input EntryStream in StreamingJob.  

###Test-AzureStreamAnalyticsOutput
Tests the ability of Stream Analytics to connect to a specified output.

**Example 1**

	Test-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name Output
This command tests the connection status of the output Output in StreamingJob.  


## Get support
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics). 


## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
 



[msdn-switch-azuremode]: http://msdn.microsoft.com/library/dn722470.aspx
[powershell-install]: http://azure.microsoft.com/documentation/articles/install-configure-powershell/
[msdn-rest-api-create-stream-analytics-job]: https://msdn.microsoft.com/library/dn834994.aspx
[msdn-rest-api-create-stream-analytics-input]: https://msdn.microsoft.com/library/dn835010.aspx
[msdn-rest-api-create-stream-analytics-output]: https://msdn.microsoft.com/library/dn835015.aspx
[msdn-rest-api-create-stream-analytics-transformation]: https://msdn.microsoft.com/library/dn835007.aspx

[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.developer.guide]: stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.limitations]: stream-analytics-limitations.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
