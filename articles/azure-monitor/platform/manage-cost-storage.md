---
title: Manage usage and costs for Azure Monitor Logs | Microsoft Docs
description: Learn how to change the pricing plan and manage data volume and retention policy for your Log Analytics workspace in Azure Monitor.   
services: azure-monitor
documentationcenter: azure-monitor
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: azure-monitor
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/05/2019
ms.author: bwren
ms.subservice: 
---
 
# Manage usage and costs with Azure Monitor Logs

> [!NOTE]
> This article describes how to understand and control your costs for Azure Monitor Logs. A related article, [Monitoring usage and estimated costs](https://docs.microsoft.com/azure/azure-monitor/platform/usage-estimated-costs) describes how to view usage and estimated costs across multiple Azure monitoring features for different pricing models.

> [!NOTE]
> All prices and costs shown in this article are for example purposes only. 

Azure Monitor Logs is designed to scale and support collecting, indexing, and storing massive amounts of data per day from any source in your enterprise or deployed in Azure.  While this may be a primary driver for your organization, cost-efficiency is ultimately the underlying driver. To that end, it's important to understand that the cost of a Log Analytics workspace isn't based only on the volume of data collected, it is also dependent on the plan selected, and how long you chose to store data generated from your connected sources.  

In this article we review how you can proactively monitor ingested data volume and storage growth, and define limits to control those associated costs. 

## Pricing model

The default pricing for Log Analytics is a **Pay-As-You-Go** model based on data volume ingested and optionally for longer data retention. Data volume is measured as the size of the data that will be stored. Each Log Analytics workspace is charged as a separate service and contributes to the bill for your Azure subscription. The amount of data ingestion can be considerable depending on the following factors: 

  - Number of management solutions enabled and their configuration (e.g. 
  - Number of VMs monitored
  - Type of data collected from each monitored VM 
  
In addition to the Pay-As-You-Go model, Log Analytics has **Capacity Reservation** tiers which enable you to save as much as 25% compared to the Pay-As-You-Go price. The capacity reservation pricing enables you to buy a reservation starting at 100 GB/day. Any usage above the reservation level will be billed at the Pay-As-You-Go rate. The Capacity Reservation tiers have a 31-day commitment period. During the commitment period, you can change to a higher level Capacity Reservation tier (which will restart the 31-day commitment period), but you cannot move back to Pay-As-You-Go or to a lower Capacity Reservation tier until after the commitment period is finished. 
[Learn more](https://azure.microsoft.com/pricing/details/monitor/) about Log Analytics Pay-As-You-Go and Capacity Reservation pricing. 

In all pricing tiers, the data volume is calculated from a string representation of the data as it is prepared to be stored. Several [properties common to all data types](https://docs.microsoft.com/azure/azure-monitor/platform/log-standard-properties) are not included in the calculation of the event size, including `_ResourceId`, `_ItemId`, `_IsBillable` and `_BilledSize`.

Also, note that Some solutions, such as [Azure Security Center](https://azure.microsoft.com/pricing/details/security-center/) 
and [Azure Sentinel](https://azure.microsoft.com/pricing/details/azure-sentinel/), have their own pricing model. 

## Estimating the costs to manage your environment 

If you're not yet using Azure Monitor Logs, you can use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate the cost of using Log Analytics. Start by entering "Azure Monitor" in the Search box, and clicking on the resulting Azure Monitor tile. Scroll down the page to Azure Monitor, and select Log Analytics from the Type dropdown.  Here you can enter the number of VMs and the GB of data you expect to collect from each VM. Typically 1 to 3 GB of data month is ingested from a typical Azure VM. If you're already evaluating Azure Monitor Logs already, you can use your data statistics from your own environment. See below for how to determine the [number of monitored VMs](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#understanding-nodes-sending-data) and the [volume of data your workspace is ingesting](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#understanding-ingested-data-volume). 

## Understand your usage and estimate costs

If you're using Azure Monitor Logs now, it's easy to understand what the costs are likely be based on recent usage patterns. To do this, use  **Log Analytics Usage and Estimated Costs** to review and analyze data usage. This shows how much data is collected by each solution, how much data is being retained and an estimate of your costs based on the amount of data ingested and any additional retention beyond the included amount.

![Usage and estimated costs](media/manage-cost-storage/usage-estimated-cost-dashboard-01.png)

To explore your data in more detail, click on the icon at the top right of either of the charts on the **Usage and Estimated Costs** page. Now you can work with this query to explore more details of your usage.  

![Logs view](media/manage-cost-storage/logs.png)

From the **Usage and Estimated Costs** page you can review your data volume for the month. This includes all the data received and retained in your Log Analytics workspace.  Click **Usage details** from the top of the page, to view the usage dashboard with information on data volume trends by source, computers, and offering. To view and set a daily cap or to modify the retention period, click **Data volume management**.
 
Log Analytics charges are added to your Azure bill. You can see details of your Azure bill under the Billing section of the Azure portal or in the [Azure Billing Portal](https://account.windowsazure.com/Subscriptions).  

## Viewing Log Analytics usage on your Azure bill 

Azure provides a great deal of useful functionality in the [Azure Cost Management + Billing](https://docs.microsoft.com/azure/cost-management/quick-acm-cost-analysis?toc=/azure/billing/TOC.json) hub. For instance, the "Cost analysis" functionality enables you to view your spends for Azure resources. Adding a filter by resource type (to microsoft.operationalinsights/workspace for Log Analytics) will allow you to track your spend.

More understanding of your usage can be gained by [downloading your usage from the Azure portal](https://docs.microsoft.com/azure/billing/billing-download-azure-invoice-daily-usage-date#download-usage-in-azure-portal). 
In the downloaded spreadsheet you can see usage per Azure resource (e.g. Log Analytics workspace) per day. In this Excel spreadsheet, usage from your Log Analytics workspaces can be found by first filtering on the "Meter Category" column to show "Insights and Analytics" (used by some of the legacy pricing tiers) and "Log Analytics", and then adding a filter on the "Instance ID" column which is "contains workspace". The usage is shown in the "Consumed Quantity" column and the unit for each entry is shown in the "Unit of Measure" column.  More details are available to help you [understand your Microsoft Azure bill](https://docs.microsoft.com/azure/billing/billing-understand-your-bill). 

## Changing pricing tier

To change the Log Analytics pricing tier of your workspace, 

1. In the Azure portal, open **Usage and estimated costs** from your workspace where you'll see a list of each of the pricing tiers available to this workspace.

2. Review the estimated costs for each of the pricing tiers. This estimate is based on the last 31 days of usage, so this cost estimate relies on the last 31 days being representative of your typical usage. In the example below you can see how, based on the data patterns from the last 31 days, this workspace would cost less in the Pay-As-You-Go tier (#1) compared to the 100 GB/day Capacity Reservation tier (#2).  

    ![Pricing tiers](media/manage-cost-storage/pricing-tier-estimated-costs.png)

3. After reviewing the estimated costs based on the last 31 days of usage, if you decide to change the pricing tier, click **Select**.  

You can also [set the pricing tier via Azure Resource Manager](https://docs.microsoft.com/azure/azure-monitor/platform/template-workspace-configuration#configure-a-log-analytics-workspace) using the `sku` parameter (`pricingTier` in the Azure Resource Manager template). 

## Legacy pricing tiers

Subscriptions who had a Log Analytics workspace or Application Insights resource in it before April 2, 2018, or are linked to an Enterprise Agreement that started prior to February 1, 2019, will continue to have access to use the legacy pricing tiers: **Free**, **Standalone (Per GB)** and **Per Node (OMS)**.  Workspaces in the Free pricing tier will have daily data ingestion limited to 500 MB (except for security data types collected by Azure Security Center) and the data retention is limited to 7 days. The Free pricing tier is intended only for evaluation purposes. Workspaces in the Standalone or Per Node pricing tiers have user-configurable retention of up to 2 years. 

Workspaces created prior to April 2016 can also access the original **Standard** and **Premium** pricing tiers which have fixed data retention of 30 and 365 days respectively. New workspaces cannot be created in the **Standard** or **Premium** pricing tiers, and if a workspace is moved out of these tiers, it cannot be moved back. 

More details of pricing tier limitations are available [here](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#log-analytics-workspaces).

> [!NOTE]
> To use the entitlements that come from purchasing OMS E1 Suite, OMS E2 Suite or OMS Add-On for System Center, choose the Log Analytics *Per Node* pricing tier.

## Change the data retention period

The following steps describe how to configure how long log data is kept by in your workspace.

### Default retention

To set the default retention for your workspace, 
 
1. In the Azure portal, from your workspace, select **Usage and estimated costs** from the left pane.
2. On the **Usage and estimated costs** page, click **Data volume management** from the top of the page.
3. On the pane, move the slider to increase or decrease the number of days and then click **OK**.  If you are on the *free* tier, you will not be able to modify the data retention period and you need to upgrade to the paid tier in order to control this setting.

    ![Change workspace data retention setting](media/manage-cost-storage/manage-cost-change-retention-01.png)
	
The retention can also be [set via Azure Resource Manager](https://docs.microsoft.com/azure/azure-monitor/platform/template-workspace-configuration#configure-a-log-analytics-workspace) using the `retentionInDays` parameter. Additionally, if you set the data retention to 30 days, you can trigger an immediate purge of older data using the `immediatePurgeDataOn30Days` parameter, which may be useful for compliance-related scenarios. This functionality is only exposed via Azure Resource Manager. 

Two data types -- `Usage` and `AzureActivity` -- are retained for 90 days by default, and there is no charge for for this 90 day retention. These data types are also free from data ingestion charges. 

### Retention by data type

It is also possible to specify different retention settings for individual data types. Each data type is a sub-resource of the workspace. For instance the SecurityEvent table can be addressed in [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) as:

```
/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent
```

Note that the data type (table) is case sensitive.  To get the current per data type retention settings of a particular data type (in this example SecurityEvent), use:

```JSON
    GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2017-04-26-preview
```

To get the current per data type retention settings for all data types in your workspace, just omit the specific data type, for example:

```JSON
    GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables?api-version=2017-04-26-preview
```

To set the retention of a particular data type (in this example SecurityEvent) to 730 days, do

```JSON
    PUT /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2017-04-26-preview
    {
	    "properties": 
		{
		    "retentionInDays": 730
        }
    }
```

The `Usage` and `AzureActivity` data types cannot be set with custom retention. They will take on the maximum of the default workspace retention or 90 days. 

A great tool to connect directly to Azure Resource Manager to set retention by data type is the OSS tool [ARMclient](https://github.com/projectkudu/ARMClient).  Learn more about ARMclient from articles by [David Ebbo](http://blog.davidebbo.com/2015/01/azure-resource-manager-client.html) and [Daniel Bowbyes](https://blog.bowbyes.co.nz/2016/11/02/using-armclient-to-directly-access-azure-arm-rest-apis-and-list-arm-policy-details/).  Here's an example using ARMClient, setting SecurityEvent data to a 730 day retention:

```
armclient PUT /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2017-04-26-preview "{properties: {retentionInDays: 730}}"
```

> [!NOTE]
> Setting retention on individual data types can be used to reduce your costs for data retention.  For data collected starting in October 2019 (when this feature was released), reducing the retention for some data types can  reduce your  retention cost over time.  For data collected earlier, setting a lower retention for an individual type will not affect your retention costs.  

## Manage your maximum daily data volume

You can configure a daily cap and limit the daily ingestion for your workspace, but use care as your goal should not be to hit the daily limit.  Otherwise, you lose data for the remainder of the day, which can impact other Azure services and solutions whose functionality may depend on up-to-date data being available in the workspace.  As a result, your ability to observe and receive alerts when the health conditions of resources supporting IT services are impacted.  The daily cap is intended to be used as a way to manage the unexpected increase in data volume from your managed resources and stay within your limit, or when you want to limit unplanned charges for your workspace.  

When the daily limit is reached, the collection of billable data types stops for the rest of the day. A warning banner appears across the top of the page for the selected Log Analytics workspace and an operation event is sent to the *Operation* table under **LogManagement** category. Data collection resumes after the reset time defined under *Daily limit will be set at*. We recommend defining an alert rule based on this operation event, configured to notify when the daily data limit has been reached. 

> [!NOTE]
> The daily cap does not stop the collection of data from Azure Security Center, except for workspaces in which Azure Security Center was installed before June 19, 2017. 

> [!NOTE]
> Latency inherent in applying the daily cap can mean that the cap is not applied as precisely the specified daily cap level. 

### Identify what daily data limit to define

Review [Log Analytics Usage and estimated costs](usage-estimated-costs.md) to understand the data ingestion trend and what is the daily volume cap to define. It should be considered with care, since you won’t be able to monitor your resources after the limit is reached. 

### Set the Daily Cap

The following steps describe how to configure a limit to manage the volume of data that Log Analytics workspace will ingest per day.  

1. From your workspace, select **Usage and estimated costs** from the left pane.
2. On the **Usage and estimated costs** page for the selected workspace, click **Data volume management** from the top of the page. 
3. Daily cap is **OFF** by default – click **ON** to enable it, and then set the data volume limit in GB/day.

    ![Log Analytics configure data limit](media/manage-cost-storage/set-daily-volume-cap-01.png)

### Alert when Daily Cap reached

While we present a visual cue in the Azure portal when your data limit threshold is met, this behavior doesn't necessarily align to how you manage operational issues requiring immediate attention.  To receive an alert notification, you can create a new alert rule in Azure Monitor.  To learn more, see [how to create, view, and manage alerts](alerts-metric.md).

To get you started, here are the recommended settings for the alert:

- Target: Select your Log Analytics resource
- Criteria: 
   - Signal name: Custom log search
   - Search query: Operation | where Detail has 'OverQuota'
   - Based on: Number of results
   - Condition: Greater than
   - Threshold: 0
   - Period: 5 (minutes)
   - Frequency: 5 (minutes)
- Alert rule name: Daily data limit reached
- Severity: Warning (Sev 1)

Once alert is defined and the limit is reached, an alert is triggered and performs the response defined in the Action Group. It can notify your team via email and text messages, or automate actions using webhooks, Automation runbooks or [integrating with an external ITSM solution](itsmc-overview.md#create-itsm-work-items-from-azure-alerts). 

## Troubleshooting why usage is higher than expected

Higher usage is caused by one, or both of:
- More nodes than expected sending data to Log Analytics workspace
- More data than expected being sent to Log Analytics workspace

## Understanding nodes sending data

To understand the number of computers reporting heartbeats each day in the last month, use

```kusto
Heartbeat | where TimeGenerated > startofday(ago(31d))
| summarize dcount(Computer) by bin(TimeGenerated, 1d)    
| render timechart
```

To get a list of computers which will be billed as nodes if the workspace is in the legacy Per Node pricing tier, look for nodes which are sending **billed data types** (some data types are free). 
To do this, use the `_IsBillable` [property](log-standard-properties.md#_isbillable) and use the leftmost field of the fully qualified domain name. This returns the list of computers with billed data:

```kusto
union withsource = tt * 
| where _IsBillable == true 
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize TotalVolumeBytes=sum(_BilledSize) by computerName
```

The count of billable nodes seen can be estimated as: 

```kusto
union withsource = tt * 
| where _IsBillable == true 
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize billableNodes=dcount(computerName)
```

> [!NOTE]
> Use these `union withsource = tt *` queries sparingly as scans across data types are expensive to execute. This query replaces the old way of querying per-computer information with the Usage data type.  

A more accurate calculation of what will actually be billed is to get the count of computers per hour that are sending billed data types. 
(For workspaces in the legacy Per Node pricing tier, Log Analytics calculates the number of nodes which need to be billed on an hourly basis.) 

```kusto
union withsource = tt * 
| where _IsBillable == true 
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize billableNodes=dcount(computerName) by bin(TimeGenerated, 1h) | sort by TimeGenerated asc
```

## Understanding ingested data volume

On the **Usage and Estimated Costs** page, the *Data ingestion per solution* chart shows the total volume of data sent and how much is being sent by each solution. This allows you to determine trends such as whether the overall data usage (or usage by a particular solution) is growing, remaining steady or decreasing. The query used to generate this is

```kusto
Usage | where TimeGenerated > startofday(ago(31d))| where IsBillable == true
| summarize TotalVolumeGB = sum(Quantity) / 1000. by bin(TimeGenerated, 1d), Solution| render barchart
```

Note that the clause "where IsBillable = true" filters out data types from certain solutions for which there is no ingestion charge. 

You can drill in further to see data trends for specific data types, for example if you want to study the data due to IIS logs:

```kusto
Usage | where TimeGenerated > startofday(ago(31d))| where IsBillable == true
| where DataType == "W3CIISLog"
| summarize TotalVolumeGB = sum(Quantity) / 1000. by bin(TimeGenerated, 1d), Solution| render barchart
```

### Data volume by computer

To see the **size** of billable events ingested per computer, use the `_BilledSize` [property](log-standard-properties.md#_billedsize), which provides the size in bytes:

```kusto
union withsource = tt * 
| where _IsBillable == true 
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| summarize Bytes=sum(_BilledSize) by  computerName | sort by Bytes nulls last
```

The `_IsBillable` [property](log-standard-properties.md#_isbillable) specifies whether the ingested data will incur charges.

To see the count of **billable** events ingested per computer, use 

```kusto
union withsource = tt * 
| where _IsBillable == true 
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| summarize eventCount=count() by computerName  | sort by eventCount nulls last
```

If you want to see counts for billable data types are sending data to a specific computer, use:

```kusto
union withsource = tt *
| where Computer == "computer name"
| where _IsBillable == true 
| summarize count() by tt | sort by count_ nulls last
```

### Data volume by Azure resource, resource group, or subscription

For data from nodes hosted in Azure you can get the **size** of billable events ingested __per computer__, use the _ResourceId [property](log-standard-properties.md#_resourceid), which provides the full path to the resource:

```kusto
union withsource = tt * 
| where _IsBillable == true 
| summarize Bytes=sum(_BilledSize) by _ResourceId | sort by Bytes nulls last
```

For data from nodes hosted in Azure you can get the **size** of billable events ingested __per Azure subscription__, parse the `_ResourceId` property as:

```kusto
union withsource = tt * 
| where _IsBillable == true 
| parse tolower(_ResourceId) with "/subscriptions/" subscriptionId "/resourcegroups/" 
    resourceGroup "/providers/" provider "/" resourceType "/" resourceName   
| summarize Bytes=sum(_BilledSize) by subscriptionId | sort by Bytes nulls last
```

Changing `subscriptionId` to `resourceGroup` will show the billable ingested data volume by Azure resource group. 


> [!NOTE]
> Some of the fields of the Usage data type, while still in the schema, have been deprecated and will their values are no longer populated. 
> These are **Computer** as well as fields related to ingestion (**TotalBatches**, **BatchesWithinSla**, **BatchesOutsideSla**, **BatchesCapped** and **AverageProcessingTimeMs**.

### Querying for common data types

To dig deeper into the source of data for a particular data type, here are some useful example queries:

+ **Security** solution
  - `SecurityEvent | summarize AggregatedValue = count() by EventID`
+ **Log Management** solution
  - `Usage | where Solution == "LogManagement" and iff(isnotnull(toint(IsBillable)), IsBillable == true, IsBillable == "true") == true | summarize AggregatedValue = count() by DataType`
+ **Perf** data type
  - `Perf | summarize AggregatedValue = count() by CounterPath`
  - `Perf | summarize AggregatedValue = count() by CounterName`
+ **Event** data type
  - `Event | summarize AggregatedValue = count() by EventID`
  - `Event | summarize AggregatedValue = count() by EventLog, EventLevelName`
+ **Syslog** data type
  - `Syslog | summarize AggregatedValue = count() by Facility, SeverityLevel`
  - `Syslog | summarize AggregatedValue = count() by ProcessName`
+ **AzureDiagnostics** data type
  - `AzureDiagnostics | summarize AggregatedValue = count() by ResourceProvider, ResourceId`

### Tips for reducing data volume

Some suggestions for reducing the volume of logs collected include:

| Source of high data volume | How to reduce data volume |
| -------------------------- | ------------------------- |
| Security events            | Select [common or minimal security events](https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection#data-collection-tier) <br> Change the security audit policy to collect only needed events. In particular, review the need to collect events for <br> - [audit filtering platform](https://technet.microsoft.com/library/dd772749(WS.10).aspx) <br> - [audit registry](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd941614(v%3dws.10))<br> - [audit file system](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772661(v%3dws.10))<br> - [audit kernel object](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd941615(v%3dws.10))<br> - [audit handle manipulation](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772626(v%3dws.10))<br> - audit removable storage |
| Performance counters       | Change [performance counter configuration](data-sources-performance-counters.md) to: <br> - Reduce the frequency of collection <br> - Reduce number of performance counters |
| Event logs                 | Change [event log configuration](data-sources-windows-events.md) to: <br> - Reduce the number of event logs collected <br> - Collect only required event levels. For example, do not collect *Information* level events |
| Syslog                     | Change [syslog configuration](data-sources-syslog.md) to: <br> - Reduce the number of facilities collected <br> - Collect only required event levels. For example, do not collect *Info* and *Debug* level events |
| AzureDiagnostics           | Change resource log collection to: <br> - Reduce the number of resources send logs to Log Analytics <br> - Collect only required logs |
| Solution data from computers that don't need the solution | Use [solution targeting](../insights/solution-targeting.md) to collect data from only required groups of computers. |

### Getting Security and Automation node counts

If you are on "Per node (OMS)" pricing tier, then you are charged based on the number of nodes and solutions you use, the number of Insights and Analytics nodes for which you are being billed will be shown in table on the **Usage and Estimated Cost** page.  

To see the number of distinct Security nodes, you can use the query:

```kusto
union
(
    Heartbeat
    | where (Solutions has 'security' or Solutions has 'antimalware' or Solutions has 'securitycenter')
    | project Computer
),
(
    ProtectionStatus
    | where Computer !in~
    (
        (
            Heartbeat
            | project Computer
        )
    )
    | project Computer
)
| distinct Computer
| project lowComputer = tolower(Computer)
| distinct lowComputer
| count
```

To see the number of distinct Automation nodes, use the query:

```kusto
 ConfigurationData 
 | where (ConfigDataType == "WindowsServices" or ConfigDataType == "Software" or ConfigDataType =="Daemons") 
 | extend lowComputer = tolower(Computer) | summarize by lowComputer 
 | join (
     Heartbeat 
       | where SCAgentChannel == "Direct"
       | extend lowComputer = tolower(Computer) | summarize by lowComputer, ComputerEnvironment
 ) on lowComputer
 | summarize count() by ComputerEnvironment | sort by ComputerEnvironment asc
```

## Create an alert when data collection is high

This section describes how to create an alert if:
- Data volume exceeds a specified amount.
- Data volume is predicted to exceed a specified amount.

Azure Alerts support [log alerts](alerts-unified-log.md) that use search queries. 

The following query has a result when there is more than 100 GB of data collected in the last 24 hours:

```kusto
union withsource = $table Usage 
| where QuantityUnit == "MBytes" and iff(isnotnull(toint(IsBillable)), IsBillable == true, IsBillable == "true") == true 
| extend Type = $table | summarize DataGB = sum((Quantity / 1000.)) by Type 
| where DataGB > 100
```

The following query uses a simple formula to predict when more than 100 GB of data will be sent in a day: 

```kusto
union withsource = $table Usage 
| where QuantityUnit == "MBytes" and iff(isnotnull(toint(IsBillable)), IsBillable == true, IsBillable == "true") == true 
| extend Type = $table 
| summarize EstimatedGB = sum(((Quantity * 8) / 1000.)) by Type 
| where EstimatedGB > 100
```

To alert on a different data volume, change the 100 in the queries to the number of GB you want to alert on.

Use the steps described in [create a new log alert](alerts-metric.md) to be notified when data collection is higher than expected.

When creating the alert for the first query -- when there is more than 100 GB of data in 24 hours, set the:  

- **Define alert condition** specify your Log Analytics workspace as the resource target.
- **Alert criteria** specify the following:
   - **Signal Name** select **Custom log search**
   - **Search query** to `union withsource = $table Usage | where QuantityUnit == "MBytes" and iff(isnotnull(toint(IsBillable)), IsBillable == true, IsBillable == "true") == true | extend Type = $table | summarize DataGB = sum((Quantity / 1000.)) by Type | where DataGB > 100`
   - **Alert logic** is **Based on** *number of results* and **Condition** is *Greater than* a **Threshold** of *0*
   - **Time period** of *1440* minutes and **Alert frequency** to every *60* minutes since the usage data only updates once per hour.
- **Define alert details** specify the following:
   - **Name** to *Data volume greater than 100 GB in 24 hours*
   - **Severity** to *Warning*

Specify an existing or create a new [Action Group](action-groups.md) so that when the log alert matches criteria, you are notified.

When creating the alert for the second query -- when it is predicted that there will be more than 100 GB of data in 24 hours, set the:

- **Define alert condition** specify your Log Analytics workspace as the resource target.
- **Alert criteria** specify the following:
   - **Signal Name** select **Custom log search**
   - **Search query** to `union withsource = $table Usage | where QuantityUnit == "MBytes" and iff(isnotnull(toint(IsBillable)), IsBillable == true, IsBillable == "true") == true | extend Type = $table | summarize EstimatedGB = sum(((Quantity * 8) / 1000.)) by Type | where EstimatedGB > 100`
   - **Alert logic** is **Based on** *number of results* and **Condition** is *Greater than* a **Threshold** of *0*
   - **Time period** of *180* minutes and **Alert frequency** to every *60* minutes since the usage data only updates once per hour.
- **Define alert details** specify the following:
   - **Name** to *Data volume expected to greater than 100 GB in 24 hours*
   - **Severity** to *Warning*

Specify an existing or create a new [Action Group](action-groups.md) so that when the log alert matches criteria, you are notified.

When you receive an alert, use the steps in the following section to troubleshoot why usage is higher than expected.

## Data transfer charges using Log Analytics

Sending data to Log Analytics might incur data bandwidth charges. As described in the [Azure Bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/), data transfer between Azure services located in two regions charged as outbound data transfer at the normal rate. Inbound data transfer is free. However, this charge is very small (few %) compared to the costs for Log Analytics data ingestion. Consequently controlling costs for Log Analytics needs to focus on your ingested data volume, and we have guidance to help understand that [here](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#understanding-ingested-data-volume).   


## Troubleshooting why Log Analytics is no longer collecting data

If you are on the legacy Free pricing tier and have sent more than 500 MB of data in a day, data collection stops for the rest of the day. Reaching the daily limit is a common reason that Log Analytics stops collecting data, or data appears to be missing.  Log Analytics creates an event of type Operation when data collection starts and stops. Run the following query in search to check if you are reaching the daily limit and missing data: 

```kusto
Operation | where OperationCategory == 'Data Collection Status'
```

When data collection stops, the OperationStatus is **Warning**. When data collection starts, the OperationStatus is **Succeeded**. The following table describes reasons that data collection stops and a suggested action to resume data collection:  

|Reason collection stops| Solution| 
|-----------------------|---------|
|Daily limit of legacy Free pricing tier  reached |Wait until the following day for collection to automatically restart, or change to a paid pricing tier.|
|Daily cap of your workspace was reached|Wait for collection to automatically restart, or increase the daily data volume limit described in manage the maximum daily data volume. The daily cap reset time is shows on the **Data volume management** page. |
|Azure subscription is in a suspended state due to:<br> Free trial ended<br> Azure pass expired<br> Monthly spending limit reached (for example on an MSDN or Visual Studio subscription)|Convert to a paid subscription<br> Remove limit, or wait until limit resets|

To be notified when data collection stops, use the steps described in *Create daily data cap* alert to be notified when data collection stops. Use the steps described in [create an action group](action-groups.md) to configure an e-mail, webhook, or runbook action for the alert rule. 

## Limits summary

There are some additional Log Analytics limits, some of which depend on the Log Analytics pricing tier. These are documented [here](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#log-analytics-workspaces).


## Next steps

- See [Log searches in Azure Monitor Logs](../log-query/log-query-overview.md) to learn how to use the search language. You can use search queries to perform additional analysis on the usage data.
- Use the steps described in [create a new log alert](alerts-metric.md) to be notified when a search criteria is met.
- Use [solution targeting](../insights/solution-targeting.md) to collect data from only required groups of computers.
- To configure an effective   event collection policy, review [Azure Security Center filtering policy](../../security-center/security-center-enable-data-collection.md).
- Change [performance counter configuration](data-sources-performance-counters.md).
- To modify your event collection settings, review [event log configuration](data-sources-windows-events.md).
- To modify your syslog collection settings, review [syslog configuration](data-sources-syslog.md).
