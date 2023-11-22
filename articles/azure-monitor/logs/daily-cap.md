---
title: Set daily cap on Log Analytics workspace
description: Set a 
ms.topic: conceptual
ms.reviewer: Dale.Koetke
ms.date: 10/23/2023
---

# Set daily cap on Log Analytics workspace
A daily cap on a Log Analytics workspace allows you to avoid unexpected increases in charges for data ingestion by stopping collection of billable data for the rest of the day whenever a specified threshold is reached. This article describes how the daily cap works and how to configure one in your workspace.

> [!IMPORTANT]
> You should use care when setting a daily cap because when data collection stops, your ability to observe and receive alerts when the health conditions of your resources will be impacted. It can also impact other Azure services and solutions whose functionality may depend on up-to-date data being available in the workspace. Your goal shouldn't be to regularly hit the daily limit but rather use it as an infrequent method to avoid unplanned charges resulting from an unexpected increase in the volume of data collected.
> 
> For strategies to reduce your Azure Monitor costs, see [Cost optimization and Azure Monitor](../best-practices-cost.md).

## Permissions required

| Action | Permissions or role needed |
|------|------------------------------|
| Set the daily cap on a Log Analytics workspace | `Microsoft.OperationalInsights/workspaces/write` permissions to the Log Analytics workspaces you set the daily cap on, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example. |
| Set the daily cap on a classic Application Insights resource | `microsoft.insights/components/CurrentBillingFeatures/write` permissions to the classic Application Insights resources you set the daily cap on, as provided by the [Application Insights Component Contributor built-in role](../../role-based-access-control/built-in-roles.md#application-insights-component-contributor), for example. |
| Create an alert when the daily cap for a Log Analytics workspace is reached | `microsoft.insights/scheduledqueryrules/write` permissions, as provided by the [Monitoring Contributor built-in role](../../role-based-access-control/built-in-roles.md#monitoring-contributor), for example |
| Create an alert when the daily cap for a classic Application Insights resource is reached | `microsoft.insights/activitylogalerts/write` permissions, as provided by the [Monitoring Contributor built-in role](../../role-based-access-control/built-in-roles.md#monitoring-contributor), for example |
| View the effect of the daily cap | `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to the Log Analytics workspaces you query, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example. |

## How the daily cap works
Each workspace has a daily cap that defines its own data volume limit.  When the daily cap is reached, a warning banner appears across the top of the page for the selected Log Analytics workspace in the Azure portal, and an operation event is sent to the *Operation* table under the **LogManagement** category. You can optionally create an alert rule to send an alert when this event is created.

Data collection resumes at the reset time which is a different hour of the day for each workspace.  This reset hour can't be configured. You can optionally create an alert rule to send an alert when this event is created.

> [!NOTE]
> The daily cap can't stop data collection at precisely the specified cap level and some excess data is expected, particularly if the workspace is receiving high volumes of data. If data is collected above the cap, it's still billed. See [View the effect of the Daily Cap](#view-the-effect-of-the-daily-cap) for a query that is helpful in studying the daily cap behavior. 

## When to use a daily cap
Daily caps are typically used by organizations that are particularly cost conscious. They shouldn't be used as a method to reduce costs, but rather as a preventative measure to ensure that you don't exceed a particular budget. 

When data collection stops, you effectively have no monitoring of features and resources relying on that workspace. Instead of relying on the daily cap alone, you can [create an alert rule](#alert-when-daily-cap-is-reached) to notify you when data collection reaches some level before the daily cap. Notification allows you to address any increases before data collection shuts down, or even to temporarily disable collection for less critical resources.

## Application Insights
You should configure the daily cap setting for both Application Insights and Log Analytics to limit the amount of telemetry data ingested by your service. For workspace-based Application Insights resources, the effective daily cap is the minimum of the two settings. For classic Application Insights resources, only the Application Insights daily cap applies since their data doesn’t reside in a Log Analytics workspace. 

> [!TIP]
> If you're concerned about the amount of billable data collected by Application Insights, you should configure [sampling](../app/sampling.md) to tune its data volume to the level you want. Use the daily cap as a safety method in case your application unexpectedly begins to send much higher volumes of telemetry.

The maximum cap for an Application Insights classic resource is 1,000 GB/day unless you request a higher maximum for a high-traffic application. When you create a resource in the Azure portal, the daily cap is set to 100 GB/day. When you create a resource in Visual Studio, the default is small (only 32.3 MB/day). The daily cap default is set to facilitate testing. It's intended that the user will raise the daily cap before deploying the app into production. 

> [!NOTE]
> If you are using connection strings to send data to Application Insights using [regional ingestion endpoints](../app/ip-addresses.md#outgoing-ports), then the Application Insights and Log Analytics daily cap settings are effective per region. If you are using only instrumentation key (ikey) to send data to Application Insights using the [global ingestion endpoint](../app/ip-addresses.md#outgoing-ports), then the Application Insights daily cap setting may not be effective across regions, but the Log Analytics daily cap setting will still apply.

We've removed the restriction on some subscription types that have credit that couldn't be used for Application Insights. Previously, if the subscription has a spending limit, the daily cap dialog has instructions to remove the spending limit and enable the daily cap to be raised beyond 32.3 MB/day.

## Determine your daily cap
To help you determine an appropriate  daily cap for your workspace, see [Azure Monitor cost and usage](../cost-usage.md) to understand your data ingestion trends. You can also review [Analyze usage in Log Analytics workspace](analyze-usage.md) which provides methods to analyze your workspace usage in more detail. 



## Workspaces with Microsoft Defender for Cloud

> [!IMPORTANT]
> Starting September 18, 2023, the Log Analytics Daily Cap all billable data types will 
> be capped if the daily cap is met, and there is no special behavior for any data types when [Microsoft Defender for Servers](../../defender-for-cloud/plan-defender-for-servers-select-plan.md) is enabled on your workspace. 
> This change improves your ability to fully contain costs from higher-than-expected data ingestion. 
> If you have a Daily Cap set on your workspace which has Microsoft Defender for Servers, 
> be sure that the cap is high enough to accommodate this change. 
> Also, be sure to set an alert (see below) so that you are notified as soon as your Daily Cap is met. 

Until September 18, 2023, if a workspace enabled the [Microsoft Defenders for Servers](../../defender-for-cloud/plan-defender-for-servers-select-plan.md) solution after June 19, 2017, some security related data types are collected for Microsoft Defender for Cloud or Microsoft Sentinel despite any daily cap configured. The following data types will be subject to this special exception from the daily cap WindowsEvent, SecurityAlert, SecurityBaseline, SecurityBaselineSummary, SecurityDetection,  SecurityEvent, WindowsFirewall, MaliciousIPCommunication, LinuxAuditLog, SysmonEvent, ProtectionStatus, Update, UpdateSummary, CommonSecurityLog and Syslog 

## Set the daily cap
### Log Analytics workspace
To set or change the daily cap for a Log Analytics workspace in the Azure portal:  

1. From the **Log Analytics workspaces** menu, select your workspace, and then **Usage and estimated costs**.
2. Select **Daily Cap** at the top of the page. 
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
| Query | `_LogOperation | where Category =~ "Ingestion" | where Detail contains "OverQuota"` |
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
The following query can be used to track the data volumes that are subject to the daily cap for a Log Analytics workspace between daily cap resets. This accounts for the security data types that aren't included in the daily cap. In this example, the workspace's reset hour is 14:00. Change this value for your workspace.

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
