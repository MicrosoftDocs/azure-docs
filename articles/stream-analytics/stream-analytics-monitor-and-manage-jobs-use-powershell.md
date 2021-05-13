---
title: Monitor and manage Azure Stream Analytics jobs with PowerShell
description: This article describes how to use Azure PowerShell and cmdlets to monitor and manage Azure Stream Analytics jobs.
author: jseb225
ms.author: jeanb

ms.service: stream-analytics
ms.topic: how-to
ms.date: 03/28/2017
---
# Monitor and manage Stream Analytics jobs with Azure PowerShell cmdlets
Learn how to monitor and manage Stream Analytics resources with Azure PowerShell cmdlets and powershell scripting that execute basic Stream Analytics tasks.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites for running Azure PowerShell cmdlets for Stream Analytics
* Create an Azure Resource Group in your subscription. The following is a sample Azure PowerShell script. For Azure PowerShell information, see [Install and configure Azure PowerShell](/powershell/azure/);  

Azure PowerShell 0.9.8:  

```powershell
# Log in to your Azure account
Add-AzureAccount
# Select the Azure subscription you want to use to create the resource group if you have more han one subscription on your account.
Select-AzureSubscription -SubscriptionName <subscription name>
# If Stream Analytics has not been registered to the subscription, remove remark symbol below (#)to run the Register-AzureProvider cmdlet to register the provider namespace.
#Register-AzureProvider -Force -ProviderNamespace 'Microsoft.StreamAnalytics'
# Create an Azure resource group
New-AzureResourceGroup -Name <YOUR RESOURCE GROUP NAME> -Location <LOCATION>
```

Azure PowerShell 1.0:

```powershell
# Log in to your Azure account
Connect-AzAccount
# Select the Azure subscription you want to use to create the resource group.
Get-AzSubscription -SubscriptionName "your sub" | Select-AzSubscription
# If Stream Analytics has not been registered to the subscription, remove remark symbol below (#)to run the Register-AzureProvider cmdlet to register the provider namespace.
#Register-AzResourceProvider -Force -ProviderNamespace 'Microsoft.StreamAnalytics'
# Create an Azure resource group
New-AzResourceGroup -Name <YOUR RESOURCE GROUP NAME> -Location <LOCATION>
```


> [!NOTE]
> Stream Analytics jobs created programmatically do not have monitoring enabled by default.  You can manually enable monitoring in the Azure Portal by navigating to the job's Monitor page and clicking the Enable button or you can do this programmatically by following the steps located at [Azure Stream Analytics - Monitor Stream Analytics Jobs Programmatically](stream-analytics-monitor-jobs.md).
> 
> 

## Azure PowerShell cmdlets for Stream Analytics
The following Azure PowerShell cmdlets can be used to monitor and manage Azure Stream Analytics jobs. Note that Azure PowerShell has different versions. 
**In the examples listed the first command is for Azure PowerShell 0.9.8, the second command is for Azure PowerShell 1.0.** The Azure PowerShell 1.0 commands will always have "Az" in the command.

### Get-AzureStreamAnalyticsJob | Get-AzStreamAnalyticsJob
Lists all Stream Analytics jobs defined in the Azure subscription or specified resource group, or gets job information about a specific job within a resource group.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Get-AzureStreamAnalyticsJob
```

Azure PowerShell 1.0:  

```powershell
Get-AzStreamAnalyticsJob
```

This PowerShell command returns information about all the Stream Analytics jobs in the Azure subscription.

**Example 2**

Azure PowerShell 0.9.8:  

```powershell
Get-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US 
```

Azure PowerShell 1.0:  

```powershell
Get-AzStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US 
```

This PowerShell command returns information about all the Stream Analytics jobs in the resource group StreamAnalytics-Default-Central-US.

**Example 3**

Azure PowerShell 0.9.8:  

```powershell
Get-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob
```

Azure PowerShell 1.0:  

```powershell
Get-AzStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob
```

This PowerShell command returns information about the Stream Analytics job StreamingJob in the resource group StreamAnalytics-Default-Central-US.

### Get-AzureStreamAnalyticsInput | Get-AzStreamAnalyticsInput
Lists all of the inputs that are defined in a specified Stream Analytics job, or gets information about a specific input.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Get-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob
```

Azure PowerShell 1.0:  

```powershell
Get-AzStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob
```

This PowerShell command returns information about all the inputs defined in the job StreamingJob.

**Example 2**

Azure PowerShell 0.9.8:  

```powershell
Get-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name EntryStream
```

Azure PowerShell 1.0:  

```powershell
Get-AzStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name EntryStream
```

This PowerShell command returns information about the input named EntryStream defined in the job StreamingJob.

### Get-AzureStreamAnalyticsOutput | Get-AzStreamAnalyticsOutput
Lists all of the outputs that are defined in a specified Stream Analytics job, or gets information about a specific output.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Get-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob
```

Azure PowerShell 1.0:  

```powershell
Get-AzStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob
```

This PowerShell command returns information about the outputs defined in the job StreamingJob.

**Example 2**

Azure PowerShell 0.9.8:  

```powershell
Get-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name Output
```

Azure PowerShell 1.0:  

```powershell
Get-AzStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name Output
```

This PowerShell command returns information about the output named Output defined in the job StreamingJob.

### Get-AzureStreamAnalyticsQuota | Get-AzStreamAnalyticsQuota
Gets information about the quota of streaming units in a specified region.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Get-AzureStreamAnalyticsQuota -Location "Central US" 
```

Azure PowerShell 1.0:  

```powershell
Get-AzStreamAnalyticsQuota -Location "Central US" 
```

This PowerShell command returns information about the quota and usage of streaming units in the Central US region.

### Get-AzureStreamAnalyticsTransformation | Get-AzStreamAnalyticsTransformation
Gets information about a specific transformation defined in a Stream Analytics job.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Get-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name StreamingJob
```

Azure PowerShell 1.0:  

```powershell
Get-AzStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name StreamingJob
```

This PowerShell command returns information about the transformation called StreamingJob in the job StreamingJob.

### New-AzureStreamAnalyticsInput | New-AzStreamAnalyticsInput
Creates a new input within a Stream Analytics job, or updates an existing specified input.

The name of the input can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify an input that already exists and do not specify the -Force parameter, the cmdlet will ask whether or not to replace the existing input.

If you specify the -Force parameter and specify an existing input name, the input will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Input (Azure Stream Analytics)][msdn-rest-api-create-stream-analytics-input] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -File "C:\Input.json" 
```

Azure PowerShell 1.0:  

```powershell
New-AzStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -File "C:\Input.json" 
```

This PowerShell command creates a new input from the file Input.json. If an existing input with the name specified in the input definition file is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

Azure PowerShell 0.9.8:  

```powershell
New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -File "C:\Input.json" -Name EntryStream
```

Azure PowerShell 1.0:  

```powershell
New-AzStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -File "C:\Input.json" -Name EntryStream
```

This PowerShell command creates a new input in the job called EntryStream. If an existing input with this name is already defined, the cmdlet will ask whether or not to replace it.

**Example 3**

Azure PowerShell 0.9.8:  

```powershell
New-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -File "C:\Input.json" -Name EntryStream -Force
```

Azure PowerShell 1.0:  

```powershell
New-AzStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -File "C:\Input.json" -Name EntryStream -Force
```

This PowerShell command replaces the definition of the existing input source called EntryStream with the definition from the file.

### New-AzureStreamAnalyticsJob | New-AzStreamAnalyticsJob
Creates a new Stream Analytics job in Microsoft Azure, or updates the definition of an existing specified job.

The name of the job can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify a job name that already exists and do not specify the -Force parameter, the cmdlet will ask whether or not to replace the existing job.

If you specify the -Force parameter and specify an existing job name, the job definition will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Stream Analytics Job][msdn-rest-api-create-stream-analytics-job] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
New-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\JobDefinition.json" 
```

Azure PowerShell 1.0:  

```powershell
New-AzStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\JobDefinition.json" 
```

This PowerShell command creates a new job from the definition in JobDefinition.json. If an existing job with the name specified in the job definition file is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

Azure PowerShell 0.9.8:  

```powershell
New-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\JobDefinition.json" -Name StreamingJob -Force
```

Azure PowerShell 1.0:  

```powershell
New-AzStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\JobDefinition.json" -Name StreamingJob -Force
```

This PowerShell command replaces the job definition for StreamingJob.

### New-AzureStreamAnalyticsOutput | New-AzStreamAnalyticsOutput
Creates a new output within a Stream Analytics job, or updates an existing output.  

The name of the output can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify an output that already exists and do not specify the -Force parameter, the cmdlet will ask whether or not to replace the existing output.

If you specify the -Force parameter and specify an existing output name, the output will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Output (Azure Stream Analytics)][msdn-rest-api-create-stream-analytics-output] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
New-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\Output.json" -JobName StreamingJob -Name output
```

Azure PowerShell 1.0:  

```powershell
New-AzStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\Output.json" -JobName StreamingJob -Name output
```

This PowerShell command creates a new output called "output" in the job StreamingJob. If an existing output with this name is already defined, the cmdlet will ask whether or not to replace it.

**Example 2**

Azure PowerShell 0.9.8:  

```powershell
New-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\Output.json" -JobName StreamingJob -Name output -Force
```

Azure PowerShell 1.0:  

```powershell
New-AzStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\Output.json" -JobName StreamingJob -Name output -Force
```

This PowerShell command replaces the definition for "output" in the job StreamingJob.

### New-AzureStreamAnalyticsTransformation | New-AzStreamAnalyticsTransformation
Creates a new transformation within a Stream Analytics job, or updates the existing transformation.

The name of the transformation can be specified in the .json file or on the command line. If both are specified, the name on the command line must be the same as the one in the file.

If you specify a transformation that already exists and do not specify the -Force parameter, the cmdlet will ask whether or not to replace the existing transformation.

If you specify the -Force parameter and specify an existing transformation name, the transformation will be replaced without confirmation.

For detailed information on the JSON file structure and contents, refer to the [Create Transformation (Azure Stream Analytics)][msdn-rest-api-create-stream-analytics-transformation] section of the [Stream Analytics Management REST API Reference Library][stream.analytics.rest.api.reference].

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
New-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\Transformation.json" -JobName StreamingJob -Name StreamingJobTransform
```

Azure PowerShell 1.0:  

```powershell
New-AzStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\Transformation.json" -JobName StreamingJob -Name StreamingJobTransform
```

This PowerShell command creates a new transformation called StreamingJobTransform in the job StreamingJob. If an existing transformation is already defined with this name, the cmdlet will ask whether or not to replace it.

**Example 2**

Azure PowerShell 0.9.8:  

```powershell
New-AzureStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\Transformation.json" -JobName StreamingJob -Name StreamingJobTransform -Force
```

Azure PowerShell 1.0:  

```powershell
New-AzStreamAnalyticsTransformation -ResourceGroupName StreamAnalytics-Default-Central-US -File "C:\Transformation.json" -JobName StreamingJob -Name StreamingJobTransform -Force
```

 This PowerShell command replaces the definition of StreamingJobTransform in the job StreamingJob.

### Remove-AzureStreamAnalyticsInput | Remove-AzStreamAnalyticsInput
Asynchronously deletes a specific input from a Stream Analytics job in Microsoft Azure.  
If you specify the -Force parameter, the input will be deleted without confirmation.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Remove-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name EventStream
```

Azure PowerShell 1.0:  

```powershell
Remove-AzStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name EventStream
```

This PowerShell command removes the input EventStream in the job StreamingJob.  

### Remove-AzureStreamAnalyticsJob | Remove-AzStreamAnalyticsJob
Asynchronously deletes a specific Stream Analytics job in Microsoft Azure.  
If you specify the -Force parameter, the job will be deleted without confirmation.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Remove-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob 
```

Azure PowerShell 1.0:  

```powershell
Remove-AzStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob 
```

This PowerShell command removes the job StreamingJob.  

### Remove-AzureStreamAnalyticsOutput | Remove-AzStreamAnalyticsOutput
Asynchronously deletes a specific output from a Stream Analytics job in Microsoft Azure.  
If you specify the -Force parameter, the output will be deleted without confirmation.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Remove-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name Output
```

Azure PowerShell 1.0:  

```powershell
Remove-AzStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name Output
```

This PowerShell command removes the output Output in the job StreamingJob.  

### Start-AzureStreamAnalyticsJob | Start-AzStreamAnalyticsJob
Asynchronously deploys and starts a Stream Analytics job in Microsoft Azure.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Start-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob -OutputStartMode CustomTime -OutputStartTime 2012-12-12T12:12:12Z
```

Azure PowerShell 1.0:  

```powershell
Start-AzStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob -OutputStartMode CustomTime -OutputStartTime 2012-12-12T12:12:12Z
```

This PowerShell command starts the job StreamingJob with a custom output start time set to December 12, 2012, 12:12:12 UTC.

### Stop-AzureStreamAnalyticsJob | Stop-AzStreamAnalyticsJob
Asynchronously stops a Stream Analytics job from running in Microsoft Azure and de-allocates resources that were that were being used. The job definition and metadata will remain available within your subscription through both the Azure portal and management APIs, such that the job can be edited and restarted. You will not be charged for a job in the stopped state.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Stop-AzureStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob 
```

Azure PowerShell 1.0:  

```powershell
Stop-AzStreamAnalyticsJob -ResourceGroupName StreamAnalytics-Default-Central-US -Name StreamingJob 
```

This PowerShell command stops the job StreamingJob.  

### Test-AzureStreamAnalyticsInput | Test-AzStreamAnalyticsInput
Tests the ability of Stream Analytics to connect to a specified input.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Test-AzureStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name EntryStream
```

Azure PowerShell 1.0:  

```powershell
Test-AzStreamAnalyticsInput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name EntryStream
```

This PowerShell command tests the connection status of the input EntryStream in StreamingJob.  

### Test-AzureStreamAnalyticsOutput | Test-AzStreamAnalyticsOutput
Tests the ability of Stream Analytics to connect to a specified output.

**Example 1**

Azure PowerShell 0.9.8:  

```powershell
Test-AzureStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name Output
```

Azure PowerShell 1.0:  

```powershell
Test-AzStreamAnalyticsOutput -ResourceGroupName StreamAnalytics-Default-Central-US -JobName StreamingJob -Name Output
```

This PowerShell command tests the connection status of the output Output in StreamingJob.  

## Get support
For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html). 

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)

[msdn-switch-azuremode]: /previous-versions/azure/dn722470(v=azure.100)
[powershell-install]: /powershell/azure/
[msdn-rest-api-create-stream-analytics-job]: ./stream-analytics-quick-create-portal.md
[msdn-rest-api-create-stream-analytics-input]: ./stream-analytics-define-inputs.md
[msdn-rest-api-create-stream-analytics-output]: ./stream-analytics-define-outputs.md
[msdn-rest-api-create-stream-analytics-transformation]: /cli/azure/stream-analytics/transformation

[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.query.language.reference]: /stream-analytics-query/stream-analytics-query-language-reference
[stream.analytics.rest.api.reference]: /rest/api/streamanalytics/