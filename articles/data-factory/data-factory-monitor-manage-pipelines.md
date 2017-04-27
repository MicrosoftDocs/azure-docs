---
title: Monitor and manage pipelines by using the Azure portal and PowerShell | Microsoft Docs
description: Learn how to use the Azure portal and Azure PowerShell to monitor and manage the Azure data factories and pipelines that you have created.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: 9b0fdc59-5bbe-44d1-9ebc-8be14d44def9
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/21/2017
ms.author: spelluru

---
# Monitor and manage Azure Data Factory pipelines by using the Azure portal and PowerShell
> [!div class="op_single_selector"]
> * [Using Azure portal/Azure PowerShell](data-factory-monitor-manage-pipelines.md)
> * [Using Monitoring and Management app](data-factory-monitor-manage-app.md)


Azure Data Factory provides a reliable and complete view of your storage, processing, and data movement services. The service provides you a monitoring dashboard that you can use to:

* Quickly assess end-to-end data pipeline health.
* Identify issues, and take corrective action if needed.
* Track data lineage.
* Track relationships between your data across any of your sources.
* View full historical accounting of job execution, system health, and dependencies.

This article describes how to monitor, manage, and debug your pipelines. It also provides information on how to create alerts and get notified about failures.

## Understand pipelines and activity states
By using the Azure portal, you can:

* View your data factory as a diagram.
* View activities in a pipeline.
* View input and output datasets.

This section also describes how a slice transitions from one state to another state.   

### Navigate to your data factory
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **Data factories** on the menu on the left. If you don't see it, click **More services >**, and then click **Data factories** under the **INTELLIGENCE + ANALYTICS** category.

   ![Browse all > Data factories](./media/data-factory-monitor-manage-pipelines/browseall-data-factories.png)

   You should see all the data factories on the **Data factories** blade.
3. On the **Data factories** blade, select the data factory that you're interested in.

    ![Select data factory](./media/data-factory-monitor-manage-pipelines/select-data-factory.png)

   You should see the home page for the data factory.

   ![Data factory blade](./media/data-factory-monitor-manage-pipelines/data-factory-blade.png)

#### Diagram view of your data factory
The **Diagram** view of a data factory provides a single pane of glass to monitor and manage the data factory and its assets.

To see the **Diagram** view of your data factory, click **Diagram** on the home page for the data factory.

![Diagram view](./media/data-factory-monitor-manage-pipelines/diagram-view.png)

You can zoom in, zoom out, zoom to fit, zoom to 100%, lock the layout of the diagram, and automatically position pipelines and tables. You can also see the data lineage information (that is, show upstream and downstream items of selected items).

### Activities inside a pipeline
1. Right-click the pipeline, and then click **Open pipeline** to see all activities in the pipeline, along with input and output datasets for the activities. This feature is useful when your pipeline includes more than one activity and you want to understand the operational lineage of a single pipeline.

    ![Open pipeline menu](./media/data-factory-monitor-manage-pipelines/open-pipeline-menu.png)     
2. In the following example, you see a copy activity in the pipeline with an input and an output. 

    ![Activities inside a pipeline](./media/data-factory-monitor-manage-pipelines/activities-inside-pipeline.png)
3. You can navigate back to the home page of the data factory by clicking the **Data factory** link in the breadcrumb at the top-left corner.

    ![Navigate back to data factory](./media/data-factory-monitor-manage-pipelines/navigate-back-to-data-factory.png)

### View the state of each activity inside a pipeline
You can view the current state of an activity by viewing the status of any of the datasets that are produced by the activity.

By double-clicking the **OutputBlobTable** in the **Diagram**, you can see all the slices that are produced by different activity runs inside a pipeline. You can see that the copy activity ran successfully for the last eight hours and produced the slices in the **Ready** state.  

![State of the pipeline](./media/data-factory-monitor-manage-pipelines/state-of-pipeline.png)

The dataset slices in the data factory can have one of the following statuses:

<table>
<tr>
    <th align="left">State</th><th align="left">Substate</th><th align="left">Description</th>
</tr>
<tr>
    <td rowspan="8">Waiting</td><td>ScheduleTime</td><td>The time hasn't come for the slice to run.</td>
</tr>
<tr>
<td>DatasetDependencies</td><td>The upstream dependencies aren't ready.</td>
</tr>
<tr>
<td>ComputeResources</td><td>The compute resources aren't available.</td>
</tr>
<tr>
<td>ConcurrencyLimit</td> <td>All the activity instances are busy running other slices.</td>
</tr>
<tr>
<td>ActivityResume</td><td>The activity is paused and can't run the slices until the activity is resumed.</td>
</tr>
<tr>
<td>Retry</td><td>Activity execution is being retried.</td>
</tr>
<tr>
<td>Validation</td><td>Validation hasn't started yet.</td>
</tr>
<tr>
<td>ValidationRetry</td><td>Validation is waiting to be retried.</td>
</tr>
<tr>
<tr>
<td rowspan="2">InProgress</td><td>Validating</td><td>Validation is in progress.</td>
</tr>
<td>-</td>
<td>The slice is being processed.</td>
</tr>
<tr>
<td rowspan="4">Failed</td><td>TimedOut</td><td>The activity execution took longer than what is allowed by the activity.</td>
</tr>
<tr>
<td>Canceled</td><td>The slice was canceled by user action.</td>
</tr>
<tr>
<td>Validation</td><td>Validation has failed.</td>
</tr>
<tr>
<td>-</td><td>The slice failed to be generated and/or validated.</td>
</tr>
<td>Ready</td><td>-</td><td>The slice is ready for consumption.</td>
</tr>
<tr>
<td>Skipped</td><td>None</td><td>The slice isn't being processed.</td>
</tr>
<tr>
<td>None</td><td>-</td><td>A slice used to exist with a different status, but it has been reset.</td>
</tr>
</table>



You can view the details about a slice by clicking a slice entry on the **Recently Updated Slices** blade.

![Slice details](./media/data-factory-monitor-manage-pipelines/slice-details.png)

If the slice has been executed multiple times, you see multiple rows in the **Activity runs** list. You can view details about an activity run by clicking the run entry in the **Activity runs** list. The list shows all the log files, along with an error message if there is one. This feature is useful to view and debug logs without having to leave your data factory.

![Activity run details](./media/data-factory-monitor-manage-pipelines/activity-run-details.png)

If the slice isn't in the **Ready** state, you can see the upstream slices that aren't ready and are blocking the current slice from executing in the **Upstream slices that are not ready** list. This feature is useful when your slice is in **Waiting** state and you want to understand the upstream dependencies that the slice is waiting on.

![Upstream slices that are not ready](./media/data-factory-monitor-manage-pipelines/upstream-slices-not-ready.png)

### Dataset state diagram
After you deploy a data factory and the pipelines have a valid active period, the dataset slices transition from one state to another. Currently, the slice status follows the following state diagram:

![State diagram](./media/data-factory-monitor-manage-pipelines/state-diagram.png)

The dataset state transition flow in data factory is the following: Waiting -> In-Progress/In-Progress (Validating) -> Ready/Failed.

The slice starts in a **Waiting** state, waiting for preconditions to be met before it executes. Then, the activity starts executing, and the slice goes into an **In-Progress** state. The activity execution might succeed or fail. The slice is marked as **Ready** or **Failed**, based on the result of the execution.

You can reset the slice to go back from the **Ready** or **Failed** state to the **Waiting** state. You can also mark the slice state to **Skip**, which prevents the activity from executing and not processing the slice.

## Manage pipelines
You can manage your pipelines by using Azure PowerShell. For example, you can pause and resume pipelines by running Azure PowerShell cmdlets.

### Pause and resume pipelines
You can pause/suspend pipelines by using the **Suspend-AzureRmDataFactoryPipeline** PowerShell cmdlet. This cmdlet is useful when you don’t want to run your pipelines until an issue is fixed.

For example, in the following screenshot, an issue has been identified with the **PartitionProductsUsagePipeline** in the **productrecgamalbox1dev** data factory, and we want to suspend the pipeline.

![Pipeline to be suspended](./media/data-factory-monitor-manage-pipelines/pipeline-to-be-suspended.png)

To suspend a pipeline, run the following PowerShell command:

```powershell
Suspend-AzureRmDataFactoryPipeline [-ResourceGroupName] <String> [-DataFactoryName] <String> [-Name] <String>
```
For example:

```powershell
Suspend-AzureRmDataFactoryPipeline -ResourceGroupName ADF -DataFactoryName productrecgamalbox1dev -Name PartitionProductsUsagePipeline
```

After the issue has been fixed with the **PartitionProductsUsagePipeline**, you can resume the suspended pipeline by running the following PowerShell command:

```powershell
Resume-AzureRmDataFactoryPipeline [-ResourceGroupName] <String> [-DataFactoryName] <String> [-Name] <String>
```
For example:

```powershell
Resume-AzureRmDataFactoryPipeline -ResourceGroupName ADF -DataFactoryName productrecgamalbox1dev -Name PartitionProductsUsagePipeline
```
## Debug pipelines
Azure Data Factory provides rich capabilities for you to debug and troubleshoot pipelines by using the Azure portal and Azure PowerShell.

### Find errors in a pipeline
If the activity run fails in a pipeline, the dataset that is produced by the pipeline is in an error state because of the failure. You can debug and troubleshoot errors in Azure Data Factory by using the following methods.

#### Use the Azure portal to debug an error
1. On the **Table** blade, click the problem slice that has the **Status** set to **Failed**.

   ![Table blade with problem slice](./media/data-factory-monitor-manage-pipelines/table-blade-with-error.png)
2. On the **Data slice** blade, click the activity run that failed.

   ![Data slice with an error](./media/data-factory-monitor-manage-pipelines/dataslice-with-error.png)
3. On the **Activity run details** blade, you can download the files that are associated with the HDInsight processing. Click **Download** for Status/stderr to download the error log file that contains details about the error.

   ![Activity run details blade with error](./media/data-factory-monitor-manage-pipelines/activity-run-details-with-error.png)     

#### Use PowerShell to debug an error
1. Start **Azure PowerShell**.
2. Run the **Get-AzureRmDataFactorySlice** command to see the slices and their statuses. You should see a slice with the status of **Failed**.        

	```powershell   
	Get-AzureRmDataFactorySlice [-ResourceGroupName] <String> [-DataFactoryName] <String> [-DatasetName] <String> [-StartDateTime] <DateTime> [[-EndDateTime] <DateTime> ] [-Profile <AzureProfile> ] [ <CommonParameters>]
	```   
   For example:

	```powershell   
	Get-AzureRmDataFactorySlice -ResourceGroupName ADF -DataFactoryName LogProcessingFactory -DatasetName EnrichedGameEventsTable -StartDateTime 2014-05-04 20:00:00
	```

   Replace **StartDateTime** with the the StartDateTime value that you specified for the Set-AzureRmDataFactoryPipelineActivePeriod.
3. Now, run the **Get-AzureRmDataFactoryRun** cmdlet to get details about the activity run for the slice.

	```powershell   
	Get-AzureRmDataFactoryRun [-ResourceGroupName] <String> [-DataFactoryName] <String> [-DatasetName] <String> [-StartDateTime]
	<DateTime> [-Profile <AzureProfile> ] [ <CommonParameters>]
	```

    For example:

	```powershell   
    Get-AzureRmDataFactoryRun -ResourceGroupName ADF -DataFactoryName LogProcessingFactory -DatasetName EnrichedGameEventsTable -StartDateTime "5/5/2014 12:00:00 AM"
	```

    The value of StartDateTime is the start time for the error/problem slice that you noted from the previous step. The date-time should be enclosed in double quotes.
4. You should see output with details about the error that is similar to the following:

	```   
    Id                      : 841b77c9-d56c-48d1-99a3-8c16c3e77d39
    ResourceGroupName       : ADF
    DataFactoryName         : LogProcessingFactory3
    DatasetName               : EnrichedGameEventsTable
    ProcessingStartTime     : 10/10/2014 3:04:52 AM
    ProcessingEndTime       : 10/10/2014 3:06:49 AM
    PercentComplete         : 0
    DataSliceStart          : 5/5/2014 12:00:00 AM
    DataSliceEnd            : 5/6/2014 12:00:00 AM
    Status                  : FailedExecution
    Timestamp               : 10/10/2014 3:04:52 AM
    RetryAttempt            : 0
    Properties              : {}
    ErrorMessage            : Pig script failed with exit code '5'. See wasb://        adfjobs@spestore.blob.core.windows.net/PigQuery
                                    Jobs/841b77c9-d56c-48d1-99a3-
                8c16c3e77d39/10_10_2014_03_04_53_277/Status/stderr' for
                more details.
    ActivityName            : PigEnrichLogs
    PipelineName            : EnrichGameLogsPipeline
    Type                    :
	```
5. You can run the **Save-AzureRmDataFactoryLog** cmdlet with the Id value that you see from the output, and download the log files by using the **-DownloadLogsoption** for the cmdlet.

	```powershell
	Save-AzureRmDataFactoryLog -ResourceGroupName "ADF" -DataFactoryName "LogProcessingFactory" -Id "841b77c9-d56c-48d1-99a3-8c16c3e77d39" -DownloadLogs -Output "C:\Test"
	```

## Rerun failures in a pipeline
### Use the Azure portal
After you troubleshoot and debug failures in a pipeline, you can rerun failures by navigating to the error slice and clicking the **Run** button on the command bar.

![Rerun a failed slice](./media/data-factory-monitor-manage-pipelines/rerun-slice.png)

In case the slice has failed validation because of a policy failure (for example, if data isn't available), you can fix the failure and validate again by clicking the **Validate** button on the command bar.
![Fix errors and validate](./media/data-factory-monitor-manage-pipelines/fix-error-and-validate.png)

### Use Azure PowerShell
You can rerun failures by using the **Set-AzureRmDataFactorySliceStatus** cmdlet. See the [Set-AzureRmDataFactorySliceStatus](https://msdn.microsoft.com/library/mt603522.aspx) topic for syntax and other details about the cmdlet.

**Example:**

The following example sets the status of all slices for the table 'DAWikiAggregatedData' to 'Waiting' in the Azure data factory 'WikiADF'.

The 'UpdateType' is set to 'UpstreamInPipeline', which means that statuses of each slice for the table and all the dependent (upstream) tables are set to 'Waiting'. The other possible value for this parameter is 'Individual'.

```powershell
Set-AzureRmDataFactorySliceStatus -ResourceGroupName ADF -DataFactoryName WikiADF -DatasetName DAWikiAggregatedData -Status Waiting -UpdateType UpstreamInPipeline -StartDateTime 2014-05-21T16:00:00 -EndDateTime 2014-05-21T20:00:00
```

## Create alerts
Azure logs user events when an Azure resource (for example, a data factory) is created, updated, or deleted. You can create alerts on these events. You can use Data Factory to capture various metrics and create alerts on metrics. We recommend that you use events for real-time monitoring and use metrics for historical purposes.

### Alerts on events
Azure events provide useful insights into what is happening in your Azure resources. When you're using Azure Data Factory, events are generated when:

* A data factory is created, updated, or deleted.
* Data processing (as "runs") has started or completed.
* An on-demand HDInsight cluster is created or removed.

You can create alerts on these user events and configure them to send email notifications to the administrator and coadministrators of the subscription. In addition, you can specify additional email addresses of users who need to receive email notifications when the conditions are met. This feature is useful when you want to get notified on failures and don’t want to continuously monitor your data factory.

> [!NOTE]
> Currently, the portal doesn't show alerts on events. Use the [Monitoring and Management app](data-factory-monitor-manage-app.md) to see all alerts.


#### Specify an alert definition
To specify an alert definition, you create a JSON file that describes the operations that you want to be alerted on. In the following example, the alert sends an email notification for the RunFinished operation. To be specific, an email notification is sent when a run in the data factory has completed and the run has failed (Status = FailedExecution).

```JSON
{
    "contentVersion": "1.0.0.0",
     "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "parameters": {},
    "resources":
    [
        {
            "name": "ADFAlertsSlice",
            "type": "microsoft.insights/alertrules",
            "apiVersion": "2014-04-01",
            "location": "East US",
            "properties":
            {
                "name": "ADFAlertsSlice",
                "description": "One or more of the data slices for the Azure Data Factory has failed processing.",
                "isEnabled": true,
                "condition":
                {
                    "odata.type": "Microsoft.Azure.Management.Insights.Models.ManagementEventRuleCondition",
                    "dataSource":
                    {
                        "odata.type": "Microsoft.Azure.Management.Insights.Models.RuleManagementEventDataSource",
                        "operationName": "RunFinished",
                        "status": "Failed",
                        "subStatus": "FailedExecution"   
                    }
                },
                "action":
                {
                    "odata.type": "Microsoft.Azure.Management.Insights.Models.RuleEmailAction",
                    "customEmails": [ "<your alias>@contoso.com" ]
                }
            }
        }
    ]
}
```

You can remove **subStatus** from the JSON definition if you don’t want to be alerted on a specific failure.

This example sets up the alert for all data factories in your subscription. If you want the alert to be set up for a particular data factory, you can specify data factory **resourceUri** in the **dataSource**:

```JSON
"resourceUri" : "/SUBSCRIPTIONS/<subscriptionId>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.DATAFACTORY/DATAFACTORIES/<dataFactoryName>"
```

The following table provides the list of available operations and statuses (and substatuses).

| Operation name | Status | Substatus |
| --- | --- | --- |
| RunStarted |Started |Starting |
| RunFinished |Failed / Succeeded |FailedResourceAllocation<br/><br/>Succeeded<br/><br/>FailedExecution<br/><br/>TimedOut<br/><br/><Canceled<br/><br/>FailedValidation<br/><br/>Abandoned |
| OnDemandClusterCreateStarted |Started | |
| OnDemandClusterCreateSuccessful |Succeeded | |
| OnDemandClusterDeleted |Succeeded | |

See [Create Alert Rule](https://msdn.microsoft.com/library/azure/dn510366.aspx) for details about the JSON elements that are used in the example.

#### Deploy the alert
To deploy the alert, use the Azure PowerShell cmdlet **New-AzureRmResourceGroupDeployment**, as shown in the following example:

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName adf -TemplateFile .\ADFAlertFailedSlice.json  
```

After the resource group deployment has finished successfully, you see the following messages:

```
VERBOSE: 7:00:48 PM - Template is valid.
WARNING: 7:00:48 PM - The StorageAccountName parameter is no longer used and will be removed in a future release.
Please update scripts to remove this parameter.
VERBOSE: 7:00:49 PM - Create template deployment 'ADFAlertFailedSlice'.
VERBOSE: 7:00:57 PM - Resource microsoft.insights/alertrules 'ADFAlertsSlice' provisioning status is succeeded

DeploymentName    : ADFAlertFailedSlice
ResourceGroupName : adf
ProvisioningState : Succeeded
Timestamp         : 10/11/2014 2:01:00 AM
Mode              : Incremental
TemplateLink      :
Parameters        :
Outputs           :
```

> [!NOTE]
> You can use the [Create Alert Rule](https://msdn.microsoft.com/library/azure/dn510366.aspx) REST API to create an alert rule. The JSON payload is similar to the JSON example.  


#### Retrieve the list of Azure resource group deployments
To retrieve the list of deployed Azure resource group deployments, use the cmdlet **Get-AzureRmResourceGroupDeployment**, as shown in the following example:

```powershell
Get-AzureRmResourceGroupDeployment -ResourceGroupName adf
```

```
DeploymentName    : ADFAlertFailedSlice
ResourceGroupName : adf
ProvisioningState : Succeeded
Timestamp         : 10/11/2014 2:01:00 AM
Mode              : Incremental
TemplateLink      :
Parameters        :
Outputs           :
```

#### Troubleshoot user events
1. You can see all the events that are generated after clicking the **Metrics and operations** tile.

    ![Metrics and operations tile](./media/data-factory-monitor-manage-pipelines/metrics-and-operations-tile.png)
2. Click the **Events** tile to see the events.

    ![Events tile](./media/data-factory-monitor-manage-pipelines/events-tile.png)
3. On the **Events** blade, you can see details about events, filtered events, and so on.

    ![Events blade](./media/data-factory-monitor-manage-pipelines/events-blade.png)
4. Click an **Operation** in the operations list that causes an error.

    ![Select an operation](./media/data-factory-monitor-manage-pipelines/select-operation.png)
5. Click an **Error** event to see details about the error.

    ![Event error](./media/data-factory-monitor-manage-pipelines/operation-error-event.png)

See [Azure Insight cmdlets](https://msdn.microsoft.com/library/mt282452.aspx) for PowerShell cmdlets that you can use to add, get, or remove alerts. Here are a few examples of using the **Get-AlertRule** cmdlet:

```powershell
get-alertrule -res $resourceGroup -n ADFAlertsSlice -det
```

```
Properties :
Action      : Microsoft.Azure.Management.Insights.Models.RuleEmailAction
Condition   :
DataSource :
EventName             :
Category              :
Level                 :
OperationName         : RunFinished
ResourceGroupName     :
ResourceProviderName  :
ResourceId            :
Status                : Failed
SubStatus             : FailedExecution
Claims                : Microsoft.Azure.Management.Insights.Models.RuleManagementEventClaimsDataSource
Condition      :
Description : One or more of the data slices for the Azure Data Factory has failed processing.
Status      : Enabled
Name:       : ADFAlertsSlice
Tags       :
$type          : Microsoft.WindowsAzure.Management.Common.Storage.CasePreservedDictionary, Microsoft.WindowsAzure.Management.Common.Storage
Id: /subscriptions/<subscription ID>/resourceGroups/<resource group name>/providers/microsoft.insights/alertrules/ADFAlertsSlice
Location   : West US
Name       : ADFAlertsSlice
```

```powershell
Get-AlertRule -res $resourceGroup
```
```
Properties : Microsoft.Azure.Management.Insights.Models.Rule
Tags       : {[$type, Microsoft.WindowsAzure.Management.Common.Storage.CasePreservedDictionary, Microsoft.WindowsAzure.Management.Common.Storage]}
Id         : /subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/microsoft.insights/alertrules/FailedExecutionRunsWest0
Location   : West US
Name       : FailedExecutionRunsWest0

Properties : Microsoft.Azure.Management.Insights.Models.Rule
Tags       : {[$type, Microsoft.WindowsAzure.Management.Common.Storage.CasePreservedDictionary, Microsoft.WindowsAzure.Management.Common.Storage]}
Id         : /subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/microsoft.insights/alertrules/FailedExecutionRunsWest3
Location   : West US
Name       : FailedExecutionRunsWest3
```

```powershell
Get-AlertRule -res $resourceGroup -Name FailedExecutionRunsWest0
```

```
Properties : Microsoft.Azure.Management.Insights.Models.Rule
Tags       : {[$type, Microsoft.WindowsAzure.Management.Common.Storage.CasePreservedDictionary, Microsoft.WindowsAzure.Management.Common.Storage]}
Id         : /subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/microsoft.insights/alertrules/FailedExecutionRunsWest0
Location   : West US
Name       : FailedExecutionRunsWest0
```

Run the following get-help commands to see details and examples for the Get-AlertRule cmdlet.

```powershell
get-help Get-AlertRule -detailed
```

```powershell
get-help Get-AlertRule -examples
```


If you see the alert generation events on the portal blade but you don't receive email notifications, check whether the email address that is specified is set to receive emails from external senders. The alert emails might have been blocked by your email settings.

### Alerts on metrics
In Data Factory, you can capture various metrics and create alerts on metrics. You can monitor and create alerts on the following metrics for the slices in your data factory:

* **Failed Runs**
* **Successful Runs**

These metrics are useful and help you to get an overview of overall failed and successful runs in the data factory. Metrics are emitted every time there is a slice run. At the beginning of the hour, these metrics are aggregated and pushed to your storage account. To enable metrics, set up a storage account.

#### Enable metrics
To enable metrics, click the following from the **Data Factory** blade:

**Monitoring** > **Metric** > **Diagnostic settings** > **Diagnostics**

![Diagnostics link](./media/data-factory-monitor-manage-pipelines/diagnostics-link.png)

On the **Diagnostics** blade, click **On**, select the storage account, and click **Save**.

![Diagnostics blade](./media/data-factory-monitor-manage-pipelines/diagnostics-blade.png)

It might take up to one hour for the metrics to be visible on the **Monitoring** blade because metrics aggregation happens hourly.

### Set up an alert on metrics
Click the **Data Factory metrics** tile:

![Data factory metrics tile](./media/data-factory-monitor-manage-pipelines/data-factory-metrics-tile.png)

On the **Metric** blade, click **+ Add alert** on the toolbar.
![Data factory metric blade > Add alert](./media/data-factory-monitor-manage-pipelines/add-alert.png)

On the **Add an alert rule** page, do the following steps, and click **OK**.

* Enter a name for the alert (example: "failed alert").
* Enter a description for the alert (example: "send an email when a failure occurs").
* Select a metric ("Failed Runs" vs. "Successful Runs").
* Specify a condition and a threshold value.   
* Specify the period of time.
* Specify whether an email should be sent to owners, contributors, and readers.

![Data factory metric blade > Add alert rule](./media/data-factory-monitor-manage-pipelines/add-an-alert-rule.png)

After the alert rule is added successfully, the blade closes and you see the new alert on the **Metric** blade.

![Data factory metric blade > New alert added](./media/data-factory-monitor-manage-pipelines/failed-alert-in-metric-blade.png)

You should also see the number of alerts in the **Alert rules** tile. Click the **Alert rules** tile.

![Data factory metric blade - Alert rules](./media/data-factory-monitor-manage-pipelines/alert-rules-tile-rules.png)

On the **Alerts rules** blade, you see any existing alerts. To add an alert, click **Add alert** on the toolbar.

![Alert rules blade](./media/data-factory-monitor-manage-pipelines/alert-rules-blade.png)

### Alert notifications
After the alert rule matches the condition, you should get an email that says the alert is activated. After the issue is resolved and the alert condition doesn’t match anymore, you get an email that says the alert is resolved.

This behavior is different than events where a notification is sent on every failure that an alert rule qualifies for.

### Deploy alerts by using PowerShell
You can deploy alerts for metrics the same way that you do for events.

**Alert definition**

```JSON
{
    "contentVersion" : "1.0.0.0",
    "$schema" : "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "parameters" : {},
    "resources" : [
    {
            "name" : "FailedRunsGreaterThan5",
            "type" : "microsoft.insights/alertrules",
            "apiVersion" : "2014-04-01",
            "location" : "East US",
            "properties" : {
                "name" : "FailedRunsGreaterThan5",
                "description" : "Failed Runs greater than 5",
                "isEnabled" : true,
                "condition" : {
                    "$type" : "Microsoft.WindowsAzure.Management.Monitoring.Alerts.Models.ThresholdRuleCondition, Microsoft.WindowsAzure.Management.Mon.Client",
                    "odata.type" : "Microsoft.Azure.Management.Insights.Models.ThresholdRuleCondition",
                    "dataSource" : {
                        "$type" : "Microsoft.WindowsAzure.Management.Monitoring.Alerts.Models.RuleMetricDataSource, Microsoft.WindowsAzure.Management.Mon.Client",
                        "odata.type" : "Microsoft.Azure.Management.Insights.Models.RuleMetricDataSource",
                        "resourceUri" : "/SUBSCRIPTIONS/<subscriptionId>/RESOURCEGROUPS/<resourceGroupName
>/PROVIDERS/MICROSOFT.DATAFACTORY/DATAFACTORIES/<dataFactoryName>",
                        "metricName" : "FailedRuns"
                    },
                    "threshold" : 5.0,
                    "windowSize" : "PT3H",
                    "timeAggregation" : "Total"
                },
                "action" : {
                    "$type" : "Microsoft.WindowsAzure.Management.Monitoring.Alerts.Models.RuleEmailAction, Microsoft.WindowsAzure.Management.Mon.Client",
                    "odata.type" : "Microsoft.Azure.Management.Insights.Models.RuleEmailAction",
                    "customEmails" : ["abhinav.gpt@live.com"]
                }
            }
        }
    ]
}
```

Replace *subscriptionId*, *resourceGroupName*, and *dataFactoryName* in the sample with appropriate values.

*metricName* currently supports two values:

* FailedRuns
* SuccessfulRuns

**Deploy the alert**

To deploy the alert, use the Azure PowerShell cmdlet **New-AzureRmResourceGroupDeployment**, as shown in the following example:

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName adf -TemplateFile .\FailedRunsGreaterThan5.json
```

You should see following message after a successful deployment:

```
VERBOSE: 12:52:47 PM - Template is valid.
VERBOSE: 12:52:48 PM - Create template deployment 'FailedRunsGreaterThan5'.
VERBOSE: 12:52:55 PM - Resource microsoft.insights/alertrules 'FailedRunsGreaterThan5' provisioning status is succeeded


DeploymentName    : FailedRunsGreaterThan5
ResourceGroupName : adf
ProvisioningState : Succeeded
Timestamp         : 7/27/2015 7:52:56 PM
Mode              : Incremental
TemplateLink      :
Parameters        :
Outputs           
```

You can also use the **Add-AlertRule** cmdlet to deploy an alert rule. See the [Add-AlertRule](https://msdn.microsoft.com/library/mt282468.aspx) topic for details and examples.  

## Move a data factory to a different resource group or subscription
You can move a data factory to a different resource group or a different subscription by using the **Move** command bar button on the home page of your data factory.

![Move data factory](./media/data-factory-monitor-manage-pipelines/MoveDataFactory.png)

You can also move any related resources (such as alerts that are associated with the data factory), along with the data factory.

![Move resources dialog box](./media/data-factory-monitor-manage-pipelines/MoveResources.png)
