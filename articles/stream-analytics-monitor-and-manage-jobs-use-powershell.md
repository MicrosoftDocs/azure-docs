<properties 
	pageTitle="Stream Analytics monitor and manage jobs using PowerShell | Azure" 
	description="Learn how to use Azure PowerShell cmdlets to monitor and manage Stream Analytics jobs" 
	services="stream-analytics" 
	documentationCenter="" 
	authors="mumian" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="03/16/2015" 
	ms.author="jgao"/>


# Monitor and manage Stream Analytics jobs using Azure PowerShell

Learn how to manage Azure Stream Analytics resources using Azure PowerShell.

## Prerequisites for running Stream Analytics PowerShell cmdlets

1.	Install and configure Azure PowerShell.

	Follow the instructions on [How to install and configure Azure PowerShell][powershell-install] to install Azure PowerShell.

	To connecto to your Azure subscription using the Azure AD method:

		Add-AzureAccount

	To select your Azure subscription with Azure Stream Analytics service enabled:

		Select-AzureSubscription

	>[WACOM.NOTE] The following error messages indicates that Azure Stream Analytics is not enabled on the subscription:
	>
		Error Code: InvalidResourceType.  Error Message: The resource type 'streamingjobs' could not be found in the namespace 'Microsoft.StreamAnalytics'.  
	
	>To resolve this issue, please enable Stream Analytics preview on the subscription and then run the following cmdlets to switch the subscription:
	>
		Select-AzureSubscription –SubscriptionId xxxxxxxx

2.	Configure Azure mode.

	After installing Azure PowerShell, run the [Switch-AzureMode][msdn-switch-azuremode] cmdlet to set the appropriate Azure mode to access Stream Analytics cmdlets:

		Switch-AzureMode AzureResourceManager

>[AZURE.NOTE] There is a temporary limitation where Stream Analytics jobs created via Azure PowerShell do not have monitoring enabled.  To workaround this issue, navigate to the job’s Monitor page in the Azure Portal and click the “Enable” button.  

## Stream Analytics PowerShell cmdlets
The follow Azure PowerShell cmdlets can be used to monitor and manage Azure Stream Analytics jobs.

### Get-AzureStreamAnalyticsJob
Lists all Stream Analytics jobs defined in the Azure subscription or specified resource group or gets job information about a specific job within a resource group.

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
Lists all of the inputs that are defined in a specified Stream Analytics job or gets information about a specific input.

**Example 1**

	Get-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob

This command returns information about all the inputs defined on the job StreamingJob.

**Example 2**

	Get-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name EntryStream
This command returns information about the input named EntryStream defined on the job StreamingJob.

### Get-AzureStreamAnalyticsOutput
Lists all of the outputs that are defined in a specified Stream Analytics job or gets information about a specific output.

**Example 1**

	Get-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob
This command returns information about the outputs defined on the job StreamingJob.

**Example 2**

	Get-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name Output
This command returns information about the output named Output defined on the job StreamingJob.

### Get-AzureStreamAnalyticsQuota
Gets information about the Streaming Unit quota of a specified region.

**Example 1**

	Get-AzureStreamAnalyticsQuota –Location "Central US" 
This command returns information about Streaming Unit quota and usage in the Central US region.

### Get-AzureStreamAnalyticsTransformation
Gets information about a specific transformation defined on Stream Analytics job.

**Example 1**

	Get-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name StreamingJob
This command returns information about the transformation called StreamingJob on the job StreamingJob.

### New-AzureStreamAnalyticsInput
Creates a new input within a Stream Analytics job or updates an existing specified input.
  
The name of the input can be specified in the .JSON file or on the command line.  If both are specified, the name on command line must be the same with the one in the file.

If you specify an input that already exists and do not specify –Force parameter, the cmdlet will ask whether or not to replace the existing input.

If you specify –Force parameter and specify an existing input name, the input will be replaced without confirmation.

**Example 1**

	New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" 
This command creates a new input from the file Input.json.  If an existing input with the name specified in the input definition file is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**
	
	New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" –Name EntryStream
This command creates a new input on the job called EntryStream.  If an existing input with this name is already defined, the cmdlet will ask whether or not to replace it.

**Example 3**

	New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" –Name EntryStream -Force
This command replaces the definition of the existing input source called EntryStream with the definition from file.

### New-AzureStreamAnalyticsJob
Creates a new Stream Analytics job in Microsoft Azure or updates the definition of an existing specified job.

The name of the job can be specified in the .JSON file or on the command line.  If both are specified, the name on command line must be the same with the one in the file.

If you specify a job name that already exists and do not specify –Force parameter, the cmdlet will ask whether or not to replace the existing job.

If you specify –Force parameter and specify an existing job name, the job definition will be replaced without confirmation.

**Example 1**

	New-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\JobDefinition.json" 
This command creates a new job from the definition in JobDefinition.json.  If an existing job with the name specified in the job definition file is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

	New-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\JobDefinition.json" –Name StreamingJob -Force
This command replaces the job definition for StreamingJob.

### New-AzureStreamAnalyticsOutput
Creates a new output within a Stream Analytics job or updates an existing output.  

The name of the output can be specified in the .JSON file or on the command line.  If both are specified, the name on command line must be the same with the one in the file.

If you specify an output that already exists and do not specify –Force parameter, the cmdlet will ask whether or not to replace the existing output.

If you specify –Force parameter and specify an existing output name, the output will be replaced without confirmation.

**Example 1**

	New-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Output.json" –JobName StreamingJob –Name output
This command creates a new output called "output" in the job StreamingJob.  If an existing output with this name is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

	New-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Output.json" –JobName StreamingJob –Name output -Force
This command replaces the definition for "output" in the job StreamingJob.

### New-AzureStreamAnalyticsTransformation
Creates a new transformation within a Stream Analytics job or updates the existing transformation.
  
The name of the transformation can be specified in the .JSON file or on the command line.  If both are specified, the name on command line must be the same with the one in the file.

If you specify a transformation that already exists and do not specify –Force parameter, the cmdlet will ask whether or not to replace the existing transformation.

If you specify –Force parameter and specify an existing transformation name, the transformation will be replaced without confirmation.

**Example 1**

	New-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Transformation.json" –JobName StreamingJob –Name StreamingJobTransform
This command creates a new transformation called StreamingJobTransform in the job StreamingJob.  If an existing transformation is already defined with this name, the cmdlet will ask whether or not to replace it.

**Example 2**

	New-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Transformation.json" –JobName StreamingJob –Name StreamingJobTransform -Force
 This command replaces the definition of StreamingJobTransform in the job StreamingJob.

### Remove-AzureStreamAnalyticsInput
Asynchronously deletes a specific input from a Stream Analytics job in Microsoft Azure.  
If you specify –Force parameter the input will be deleted without confirmation.

**Example 1**
	
	Remove-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name EventStream
This command removes the input EventStream in the job StreamingJob.  

### Remove-AzureStreamAnalyticsJob
Asynchronously deletes a specific Stream Analytics job in Microsoft Azure.  
If you specify –Force parameter the job will be deleted without confirmation.

**Example 1**

	Remove-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –Name StreamingJob 
This command removes the job StreamingJob.  

### Remove-AzureStreamAnalyticsOutput
Asynchronously deletes a specific output from a Stream Analytics job in Microsoft Azure.  
If you specify –Force parameter the output will be deleted without confirmation.

**Example 1**

	Remove-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name Output
This command removes the output Output in the job StreamingJob.  

### Start-AzureStreamAnalyticsJob
Asynchronously deploys and starts a Stream Analytics job in Microsoft Azure.

**Example 1**

	Start-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob -OutputStartMode CustomTime -OutputStartTime 2012-12-12T12:12:12Z

This command starts the job “StreamingJob” with a custom output start time set to December 12, 2012 12:12:12 UTC.


### Stop-AzureStreamAnalyticsJob
Asynchronously stops a Stream Analytics job from running in Microsoft Azure and de-allocates resources that were that were being used. The job definition and meta-data will remain available within your subscription through both the Azure Portal and Management APIs, such that the job can be edited and restarted. You will not be charged for a job in the Stopped state.

**Example 1**

	Stop-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –Name StreamingJob 
This command stops the job StreamingJob.  

### Test-AzureStreamAnalyticsInput
Tests the ability of Stream Analytics to connect to a specified input.

**Example 1**

	Test-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name EntryStream
This tests the connection status of the input EntryStream in StreamingJob.  

###Test-AzureStreamAnalyticsOutput
Tests the ability of Stream Analytics to connect to a specified output.

**Example 1**

	Test-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name Output
This tests the connection status of the output Output in StreamingJob.  


## See Also

- [Introduction to Azure Stream Analytics][stream.analytics.introduction]
- [Get started with Stream Analytics][stream.analytics.get.started]
- [Limits in the Stream Analytics preview release][stream.analytics.limitations]
- [Developer guide for Stream Analytics][stream.analytics.developer.guide]
- [Query language reference for Stream Analytics][stream.analytics.query.language.reference]
- [REST API reference for Stream Analytics][stream.analytics.rest.api.reference]
 



[msdn-switch-azuremode]: http://msdn.microsoft.com/library/dn722470.aspx
[powershell-install]: http://azure.microsoft.com/documentation/articles/install-configure-powershell/


[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.developer.guide]: stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.limitations]: stream-analytics-limitations.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301