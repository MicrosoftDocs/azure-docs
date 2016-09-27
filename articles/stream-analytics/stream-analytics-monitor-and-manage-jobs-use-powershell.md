<properties 
	pageTitle="Monitor and manage Stream Analytics jobs with PowerShell | Microsoft Azure" 
	description="Learn how to use Azure PowerShell and cmdlets to monitor and manage Stream Analytics jobs." 
	keywords="azure powershell, azure powershell cmdlets, powershell command, powershell scripting"	
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
	ms.date="07/27/2016" 
	ms.author="jeffstok"/>


# Monitor and manage Stream Analytics jobs with Azure PowerShell cmdlets

Learn how to monitor and manage Stream Analytics resources with Azure PowerShell cmdlets and powershell scripting that execute basic Stream Analytics tasks.

## Prerequisites for running Azure PowerShell cmdlets for Stream Analytics

 - Create an Azure Resource Group in your subscription. The following is a sample Azure PowerShell script. For Azure PowerShell information, see [Install and configure Azure PowerShell](../powershell-install-configure.md);  

Azure PowerShell 0.9.8:  

 		# Log in to your Azure account
		Add-AzureAccount

		# Select the Azure subscription you want to use to create the resource group if you have more than one subscription on your account.
		Select-AzureSubscription -SubscriptionName <subscription name>
 
		# If Stream Analytics has not been registered to the subscription, remove remark symbol below (#) to run the Register-AzureProvider cmdlet to register the provider namespace.
		#Register-AzureProvider -Force -ProviderNamespace 'Microsoft.StreamAnalytics'

		# Create an Azure resource group
		New-AzureResourceGroup -Name <YOUR RESOURCE GROUP NAME> -Location <LOCATION>

Azure PowerShell 1.0:  

 		# Log in to your Azure account
		Login-AzureRmAccount

		# Select the Azure subscription you want to use to create the resource group.
		Get-AzureRmSubscription –SubscriptionName “your sub” | Select-AzureRmSubscription

		# If Stream Analytics has not been registered to the subscription, remove remark symbol below (#) to run the Register-AzureProvider cmdlet to register the provider namespace.
		#Register-AzureRmResourceProvider -Force -ProviderNamespace 'Microsoft.StreamAnalytics'
		
		# Create an Azure resource group
		New-AzureRMResourceGroup -Name <YOUR RESOURCE GROUP NAME> -Location <LOCATION>
		


> [AZURE.NOTE] Stream Analytics jobs created programmatically do not have monitoring enabled by default.  You can manually enable monitoring in the Azure Portal by navigating to the job’s Monitor page and clicking the Enable button or you can do this programmatically by following the steps located at [Azure Stream Analytics - Monitor Stream Analytics Jobs Programatically](stream-analytics-monitor-jobs.md).

## Azure PowerShell cmdlets for Stream Analytics
The following Azure PowerShell cmdlets can be used to monitor and manage Azure Stream Analytics jobs. Note that Azure PowerShell has different versions. 
**In the examples listed the first command is for Azure PowerShell 0.9.8, the second command is for Azure PowerShell 1.0.** The Azure PowerShell 1.0 commands will always have "AzureRM" in the command.

### Get-AzureStreamAnalyticsJob | Get-AzureRMStreamAnalyticsJob
Lists all Stream Analytics jobs defined in the Azure subscription or specified resource group, or gets job information about a specific job within a resource group.

**Example 1**

Azure PowerShell 0.9.8:  

	Get-AzureStreamAnalyticsJob

Azure PowerShell 1.0:  

	Get-AzureRMStreamAnalyticsJob

This PowerShell command returns information about all the Stream Analytics jobs in the Azure subscription.

**Example 2**

Azure PowerShell 0.9.8:  

	Get-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US 

Azure PowerShell 1.0:  

	Get-AzureRMStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US 

This PowerShell command returns information about all the Stream Analytics jobs in the resource group StreamAnalytics-Default-Central-US.

**Example 3**

Azure PowerShell 0.9.8:  

	Get-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob

Azure PowerShell 1.0:  

	Get-AzureRMStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob

This PowerShell command returns information about the Stream Analytics job StreamingJob in the resource group StreamAnalytics-Default-Central-US.

### Get-AzureStreamAnalyticsInput | Get-AzureRMStreamAnalyticsInput
Lists all of the inputs that are defined in a specified Stream Analytics job, or gets information about a specific input.

**Example 1**

Azure PowerShell 0.9.8:  

	Get-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob

Azure PowerShell 1.0:  

	Get-AzureRMStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob

This PowerShell command returns information about all the inputs defined in the job StreamingJob.

**Example 2**

Azure PowerShell 0.9.8:  

	Get-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name EntryStream

Azure PowerShell 1.0:  

	Get-AzureRMStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name EntryStream

This PowerShell command returns information about the input named EntryStream defined in the job StreamingJob.

### Get-AzureStreamAnalyticsOutput | Get-AzureRMStreamAnalyticsOutput
Lists all of the outputs that are defined in a specified Stream Analytics job, or gets information about a specific output.

**Example 1**

Azure PowerShell 0.9.8:  

	Get-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob

Azure PowerShell 1.0:  

	Get-AzureRMStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob

This PowerShell command returns information about the outputs defined in the job StreamingJob.

**Example 2**

Azure PowerShell 0.9.8:  

	Get-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name Output

Azure PowerShell 1.0:  

	Get-AzureRMStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name Output

This PowerShell command returns information about the output named Output defined in the job StreamingJob.

### Get-AzureStreamAnalyticsQuota | Get-AzureRMStreamAnalyticsQuota
Gets information about the quota of streaming units in a specified region.

**Example 1**

Azure PowerShell 0.9.8:  

	Get-AzureStreamAnalyticsQuota –Location "Central US" 

Azure PowerShell 1.0:  

	Get-AzureRMStreamAnalyticsQuota –Location "Central US" 

This PowerShell command returns information about the quota and usage of streaming units in the Central US region.

### Get-AzureStreamAnalyticsTransformation | GetAzureRMStreamAnalyticsTransformation
Gets information about a specific transformation defined in a Stream Analytics job.

**Example 1**

Azure PowerShell 0.9.8:  

	Get-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name StreamingJob

Azure PowerShell 1.0:  

	Get-AzureRMStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –Name StreamingJob

This PowerShell command returns information about the transformation called StreamingJob in the job StreamingJob.

### New-AzureStreamAnalyticsInput | New-AzureRMStreamAnalyticsInput
Creates a new input within a Stream Analytics job, or updates an existing specified input.
  
The name of the input can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify an input that already exists and do not specify the –Force parameter, the cmdlet will ask whether or not to replace the existing input.

If you specify the –Force parameter and specify an existing input name, the input will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Input (Azure Stream Analytics)][msdn-rest-api-create-stream-analytics-input] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

Azure PowerShell 0.9.8:  

	New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" 

Azure PowerShell 1.0:  

	New-AzureRMStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" 

This PowerShell command creates a new input from the file Input.json. If an existing input with the name specified in the input definition file is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

Azure PowerShell 0.9.8:  

	New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" –Name EntryStream

Azure PowerShell 1.0:  

	New-AzureRMStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" –Name EntryStream

This PowerShell command creates a new input in the job called EntryStream. If an existing input with this name is already defined, the cmdlet will ask whether or not to replace it.

**Example 3**

Azure PowerShell 0.9.8:  

	New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" –Name EntryStream -Force

Azure PowerShell 1.0:  

	New-AzureRMStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob –File "C:\Input.json" –Name EntryStream -Force

This PowerShell command replaces the definition of the existing input source called EntryStream with the definition from the file.

### New-AzureStreamAnalyticsJob | New-AzureRMStreamAnalyticsJob
Creates a new Stream Analytics job in Microsoft Azure, or updates the definition of an existing specified job.

The name of the job can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify a job name that already exists and do not specify the –Force parameter, the cmdlet will ask whether or not to replace the existing job.

If you specify the –Force parameter and specify an existing job name, the job definition will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Stream Analytics Job][msdn-rest-api-create-stream-analytics-job] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

Azure PowerShell 0.9.8:  

	New-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\JobDefinition.json" 

Azure PowerShell 1.0:  

	New-AzureRMStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\JobDefinition.json" 

This PowerShell command creates a new job from the definition in JobDefinition.json. If an existing job with the name specified in the job definition file is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

Azure PowerShell 0.9.8:  

	New-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\JobDefinition.json" –Name StreamingJob -Force

Azure PowerShell 1.0:  

	New-AzureRMStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\JobDefinition.json" –Name StreamingJob -Force

This PowerShell command replaces the job definition for StreamingJob.

### New-AzureStreamAnalyticsOutput | New-AzureRMStreamAnalyticsOutput
Creates a new output within a Stream Analytics job, or updates an existing output.  

The name of the output can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify an output that already exists and do not specify the –Force parameter, the cmdlet will ask whether or not to replace the existing output.

If you specify the –Force parameter and specify an existing output name, the output will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Output (Azure Stream Analytics)][msdn-rest-api-create-stream-analytics-output] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

Azure PowerShell 0.9.8:  

	New-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Output.json" –JobName StreamingJob –Name output

Azure PowerShell 1.0:  

	New-AzureRMStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Output.json" –JobName StreamingJob –Name output

This PowerShell command creates a new output called "output" in the job StreamingJob. If an existing output with this name is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

Azure PowerShell 0.9.8:  

	New-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Output.json" –JobName StreamingJob –Name output -Force

Azure PowerShell 1.0:  

	New-AzureRMStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Output.json" –JobName StreamingJob –Name output -Force

This PowerShell command replaces the definition for "output" in the job StreamingJob.

### New-AzureStreamAnalyticsTransformation | New-AzureRMStreamAnalyticsTransformation
Creates a new transformation within a Stream Analytics job, or updates the existing transformation.
  
The name of the transformation can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify a transformation that already exists and do not specify the –Force parameter, the cmdlet will ask whether or not to replace the existing transformation.

If you specify the –Force parameter and specify an existing transformation name, the transformation will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Transformation (Azure Stream Analytics)][msdn-rest-api-create-stream-analytics-transformation] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

Azure PowerShell 0.9.8:  

	New-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Transformation.json" –JobName StreamingJob –Name StreamingJobTransform

Azure PowerShell 1.0:  

	New-AzureRMStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Transformation.json" –JobName StreamingJob –Name StreamingJobTransform

This PowerShell command creates a new transformation called StreamingJobTransform in the job StreamingJob. If an existing transformation is already defined with this name, the cmdlet will ask whether or not to replace it.

**Example 2**

Azure PowerShell 0.9.8:  

	New-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Transformation.json" –JobName StreamingJob –Name StreamingJobTransform -Force

Azure PowerShell 1.0:  

	New-AzureRMStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US –File "C:\Transformation.json" –JobName StreamingJob –Name StreamingJobTransform -Force

 This PowerShell command replaces the definition of StreamingJobTransform in the job StreamingJob.

### Remove-AzureStreamAnalyticsInput | Remove-AzureRMStreamAnalyticsInput
Asynchronously deletes a specific input from a Stream Analytics job in Microsoft Azure.  
If you specify the –Force parameter, the input will be deleted without confirmation.

**Example 1**

Azure PowerShell 0.9.8:  

	Remove-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name EventStream

Azure PowerShell 1.0:  

	Remove-AzureRMStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name EventStream

This PowerShell command removes the input EventStream in the job StreamingJob.  

### Remove-AzureStreamAnalyticsJob | Remove-AzureRMStreamAnalyticsJob
Asynchronously deletes a specific Stream Analytics job in Microsoft Azure.  
If you specify the –Force parameter, the job will be deleted without confirmation.

**Example 1**

Azure PowerShell 0.9.8:  

	Remove-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –Name StreamingJob 

Azure PowerShell 1.0:  

	Remove-AzureRMStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –Name StreamingJob 

This PowerShell command removes the job StreamingJob.  

### Remove-AzureStreamAnalyticsOutput | Remove-AzureRMStreamAnalyticsOutput
Asynchronously deletes a specific output from a Stream Analytics job in Microsoft Azure.  
If you specify the –Force parameter, the output will be deleted without confirmation.

**Example 1**

Azure PowerShell 0.9.8:  

	Remove-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name Output

Azure PowerShell 1.0:  

	Remove-AzureRMStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name Output

This PowerShell command removes the output Output in the job StreamingJob.  

### Start-AzureStreamAnalyticsJob | Start-AzureRMStreamAnalyticsJob
Asynchronously deploys and starts a Stream Analytics job in Microsoft Azure.

**Example 1**

Azure PowerShell 0.9.8:  

	Start-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob -OutputStartMode CustomTime -OutputStartTime 2012-12-12T12:12:12Z

Azure PowerShell 1.0:  

	Start-AzureRMStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob -OutputStartMode CustomTime -OutputStartTime 2012-12-12T12:12:12Z

This PowerShell command starts the job StreamingJob with a custom output start time set to December 12, 2012, 12:12:12 UTC.


### Stop-AzureStreamAnalyticsJob | Stop-AzureRMStreamAnalyticsJob
Asynchronously stops a Stream Analytics job from running in Microsoft Azure and de-allocates resources that were that were being used. The job definition and metadata will remain available within your subscription through both the Azure portal and management APIs, such that the job can be edited and restarted. You will not be charged for a job in the stopped state.

**Example 1**

Azure PowerShell 0.9.8:  

	Stop-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –Name StreamingJob 

Azure PowerShell 1.0:  

	Stop-AzureRMStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US –Name StreamingJob 

This PowerShell command stops the job StreamingJob.  

### Test-AzureStreamAnalyticsInput | Test-AzureRMStreamAnalyticsInput
Tests the ability of Stream Analytics to connect to a specified input.

**Example 1**

Azure PowerShell 0.9.8:  

	Test-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name EntryStream

Azure PowerShell 1.0:  

	Test-AzureRMStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name EntryStream

This PowerShell command tests the connection status of the input EntryStream in StreamingJob.  

###Test-AzureStreamAnalyticsOutput | Test-AzureRMStreamAnalyticsOutput
Tests the ability of Stream Analytics to connect to a specified output.

**Example 1**

Azure PowerShell 0.9.8:  

	Test-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name Output

Azure PowerShell 1.0:  

	Test-AzureRMStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US –JobName StreamingJob –Name Output

This PowerShell command tests the connection status of the output Output in StreamingJob.  

## Get support
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics). 


## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
 



[msdn-switch-azuremode]: http://msdn.microsoft.com/library/dn722470.aspx
[powershell-install]: http://azure.microsoft.com/documentation/articles/powershell-install-configure/
[msdn-rest-api-create-stream-analytics-job]: https://msdn.microsoft.com/library/dn834994.aspx
[msdn-rest-api-create-stream-analytics-input]: https://msdn.microsoft.com/library/dn835010.aspx
[msdn-rest-api-create-stream-analytics-output]: https://msdn.microsoft.com/library/dn835015.aspx
[msdn-rest-api-create-stream-analytics-transformation]: https://msdn.microsoft.com/library/dn835007.aspx

[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
 
