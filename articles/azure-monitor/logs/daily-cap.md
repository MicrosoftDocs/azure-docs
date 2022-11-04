---
title: Set daily cap on Log Analytics workspace
description: Set a 
ms.topic: conceptual
ms.reviewer: Dale.Koetke
ms.date: 03/28/2022
---
 
# Set daily cap on Log Analytics workspace
A daily cap on a Log Analytics workspace allows you to avoid unexpected increases in charges for data ingestion by stopping collection of billable data for the rest of the day whenever a specified threshold is reached. This article describes how the daily cap works and how to configure one in your workspace.

> [!IMPORTANT]
> You should use care when setting a daily cap because when data collection stops, your ability to observe and receive alerts when the health conditions of your resources will be impacted. It can also impact other Azure services and solutions whose functionality may depend on up-to-date data being available in the workspace. Your goal shouldn't be to regularly hit the daily limit but rather use it as an infrequent method to avoid unplanned charges resulting from an unexpected increase in the volume of data collected.


## How the daily cap works
Each workspace has a daily cap that defines its own data volume limit.  When the daily cap is reached, a warning banner appears across the top of the page for the selected Log Analytics workspace in the Azure portal, and an operation event is sent to the *Operation* table under the **LogManagement** category. You can optionally create an alert rule to send an alert when this event is created.

Data collection resumes at the reset time which is a different hour of the day for each workspace.  This reset hour can't be configured. You can optionally create an alert rule to send an alert when this event is created.

> [!NOTE]
> The daily cap can't stop data collection at precisely the specified cap level and some excess data is expected, particularly if the workspace is receiving high volumes of data. If data is collected above the cap, it's still billed. See [View the effect of the Daily Cap](#view-the-effect-of-the-daily-cap) for a query that is helpful in studying the daily cap behavior. 

## Application Insights
You shouldn't create a daily cap for workspace-based Application Insights resources but instead create a daily cap for their workspace. You do need to create a separate daily cap for any classic Application Insights resources since their data doesn't reside in a Log Analytics workspace. 

> [!TIP]
> If you're concerned about the amount of billable data collected by Application Insights, you should configure [sampling](../app/sampling.md) to tune its data volume to the level you want. Use the daily cap as a safety method in case your application unexpectedly begins to send much higher volumes of telemetry.

The maximum cap for an Application Insights classic resource is 1,000 GB/day unless you request a higher maximum for a high-traffic application. When you create a resource in the Azure portal, the daily cap is set to 100 GB/day. When you create a resource in Visual Studio, the default is small (only 32.3 MB/day). The daily cap default is set to facilitate testing. It's intended that the user will raise the daily cap before deploying the app into production. 

We've removed the restriction on some subscription types that have credit that couldn't be used for Application Insights. Previously, if the subscription has a spending limit, the daily cap dialog has instructions to remove the spending limit and enable the daily cap to be raised beyond 32.3 MB/day.


## Determine your daily cap
To help you determine an appropriate  daily cap for your workspace, see [Azure Monitor cost and usage](../usage-estimated-costs.md) to understand your data ingestion trends. You can also review [Analyze usage in Log Analytics workspace](analyze-usage.md) which provides methods to analyze your workspace usage in more detail. 



## Workspaces with Microsoft Defender for Cloud
Some data security-related data types collected [Microsoft Defender for Cloud](../../security-center/index.yml) or Microsoft Sentinel are collected despite any daily cap. The data types listed below will not be capped except for workspaces in which Microsoft Defender for Cloud was installed before June 19, 2017:

- WindowsEvent
- SecurityAlert
- SecurityBaseline
- SecurityBaselineSummary
- SecurityDetection
- SecurityEvent
- WindowsFirewall
- MaliciousIPCommunication
- LinuxAuditLog
- SysmonEvent
- ProtectionStatus
- Update
- UpdateSummary 


## Set the daily cap
### Log Analytics workspace
To set or change the daily cap for a Log Analytics workspace in the Azure portal:  

1. From the **Log Analytics workspaces** menu, select your workspace, and then **Usage and estimated costs**.
2. Select **Data Cap** at the top of the page. 
3. Select **ON** and then set the data volume limit in GB/day.

:::image type="content" source="media/manage-cost-storage/set-daily-volume-cap-01.png" lightbox="media/manage-cost-storage/set-daily-volume-cap-01.png" alt-text="Log Analytics configure data limit":::

> [!NOTE]
> The reset hour for the workspace is displayed but cannot be configured.  

To configure the daily cap with Azure Resource Manager, set the `dailyQuotaGb` parameter under `WorkspaceCapping` as described at [Workspaces - Create Or Update](/rest/api/loganalytics/workspaces/createorupdate#workspacecapping). 


### Classic Applications Insights resource
To set or change the daily cap for a classic Application Insights resource in the Azure portal:

1. From the **Monitor** menu, select **Applications**, your application, and then **Usage and estimated costs**.
2. Select **Data Cap** at the top of the page. 
3. Set the data volume limit in GB/day.
4. If you want an email sent to the subscription administrator when the daily limit is reached, then select that option.
3. Set the daily cap warning level in percentage of the data volume limit.
4. If you want an email sent to the subscription administrator when the daily cap warning level is reached, then select that option.

:::image type="content" source="../app/media/pricing/pricing-003.png" lightbox="../app/media/pricing/pricing-003.png" alt-text="Application Insights configure data limit":::

To configure the daily cap with Azure Resource Manager, set the `dailyQuota`, `dailyQuotaResetTime` and `warningThreshold` parameters as described at [Workspaces - Create Or Update](../app/powershell.md#set-the-daily-cap).


## Alert when daily cap is reached
When the daily cap is reached for a Log Analytics workspace, a banner is displayed in the Azure portal, and an event is written to the **Operations** table in the workspace. You should create an alert rule to proactively notify you when this occurs. 

To receive an alert when the daily cap is reached, create a [log alert rule](../alerts/alerts-unified-log.md) with the following details.

| Setting | Value |
|:---|:---|
| **Scope** | |
| Target scope | Select your Log Analytics workspace. |
| **Condition** | |
| Signal type | Log |
| Signal name | Custom log search |
| Query | `_LogOperation | where Operation =~ "Data collection stopped" | where Detail contains "OverQuota"` |
| Measurement | Measure: *Table rows*<br>Aggregation type: Count<br>Aggregation granularity: 5 minutes |
| Alert Logic | Operator: Greater than<br>Threshold value: 0<br>Frequency of evaluation: 5 minutes |
| Actions | Select or add an [action group](../alerts/action-groups.md) to notify you when the threshold is exceeded. |
| **Details** | |
| Severity| Warning |
| Alert rule name | Daily data limit reached |


### Classic Application Insights resource
When the daily cap is reach for a classic Application Insights resource, an event is created in the Azure Activity log with the following signal names. You can also optionally have an email sent to the subscription administrator both when the cap is reached and when a specified percentage of the daily cap has been reached.

* Application Insights component daily cap warning threshold reached
* Application Insights component daily cap reached

To create an alert when the daily cap is reached, create an [Activity log alert rule](../alerts/alerts-activity-log.md#azure-portal) with the following details.


| Setting | Value |
|:---|:---|
| **Scope** | |
| Target scope | Select your application. |
| **Condition** | |
| Signal type | Activity Log |
| Signal name | Application Insights component daily cap reached<br>Or<br>Application Insights component daily cap warning threshold reached |
| Severity| Warning |
| Alert rule name | Daily data limit reached |



## View the effect of the daily cap
The following query can be used to track the data volumes that are subject to the daily cap for a Log Analytics workspace between daily cap resets. This accounts for the security data types that aren't included in the daily cap. In this example, the workspace's reset hour is 14:00. Change this value this for your workspace.

```kusto
let DailyCapResetHour=14;
Usage
| where DataType !in ("SecurityAlert", "SecurityBaseline", "SecurityBaselineSummary", "SecurityDetection", "SecurityEvent", "WindowsFirewall", "MaliciousIPCommunication", "LinuxAuditLog", "SysmonEvent", "ProtectionStatus", "WindowsEvent")
| where TimeGenerated > ago(32d)
| extend StartTime=datetime_add("hour",-1*DailyCapResetHour,StartTime)
| where StartTime > startofday(ago(31d))
| where IsBillable
| summarize IngestedGbBetweenDailyCapResets=sum(Quantity)/1000. by day=bin(StartTime , 1d) // Quantity in units of MB
| render areachart  
```
Add `Update` and `UpdateSummary` data types to the `where Datatype` line when the Update Management solution is not running on the workspace or solution targeting is enabled ([learn more](../../security-center/security-center-pricing.md#what-data-types-are-included-in-the-500-mb-data-daily-allowance).)

## Next steps

- See [Azure Monitor Logs pricing details](cost-logs.md) for details on how charges are calculated for data in a Log Analytics workspace and different configuration options to reduce your charges.
- See [Azure Monitor Logs pricing details](cost-logs.md) for details on how charges are calculated for data in a Log Analytics workspace and different configuration options to reduce your charges.
- See [Analyze usage in Log Analytics workspace](analyze-usage.md) for details on analyzing the data in your workspace to determine to source of any higher than expected usage and opportunities to reduce your amount of data collected.
