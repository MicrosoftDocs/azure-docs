---
title: Manage usage and costs for Azure Monitor Logs
description: Learn how to change the pricing plan and manage data volume and retention policy for your Log Analytics workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Manage maximum daily data volume in Log Analytics workspace
You can configure a daily cap and limit the daily ingestion for your workspace, but use care because your goal shouldn't be to hit the daily limit. Otherwise, you lose data for the remainder of the day, which can impact other Azure services and solutions whose functionality may depend on up-to-date data being available in the workspace. As a result, your ability to observe and receive alerts when the health conditions of resources supporting IT services are impacted. The daily cap is intended to be used as a way to manage an **unexpected increase** in data volume from your managed resources and stay within your limit, or when you want to limit unplanned charges for your workspace. It's not appropriate to set a daily cap so that it's met each day on a workspace.

Each workspace has its daily cap applied on a different hour of the day. The reset hour is shown in the **Daily Cap** page (see below). This reset hour can't be configured. 

Soon after the daily limit is reached, the collection of billable data types stops for the rest of the day. Latency inherent in applying the daily cap means that the cap isn't applied at precisely the specified daily cap level. A warning banner appears across the top of the page for the selected Log Analytics workspace, and an operation event is sent to the *Operation* table under the **LogManagement** category. Data collection resumes after the reset time defined under *Daily limit will be set at*. We recommend defining an alert rule that's based on this operation event, configured to notify when the daily data limit is reached. For more information, see [Alert when daily cap is reached](#alert-when-daily-cap-is-reached) section. 

> [!NOTE]
> The daily cap can't stop data collection at precisely the specified cap level and some excess data is expected, particularly if the workspace is receiving high volumes of data. If data is collected above the cap, it's still billed. For a query that is helpful in studying the daily cap behavior, see the [View the effect of the Daily Cap](#view-the-effect-of-the-daily-cap) section in this article. 

> [!WARNING]
> The daily cap doesn't stop the collection of data types **WindowsEvent**, **SecurityAlert**, **SecurityBaseline**, **SecurityBaselineSummary**, **SecurityDetection**, **SecurityEvent**, **WindowsFirewall**, **MaliciousIPCommunication**, **LinuxAuditLog**, **SysmonEvent**, **ProtectionStatus**, **Update**, and **UpdateSummary**, except for workspaces in which Microsoft Defender for Cloud was installed before June 19, 2017. 

### Identify what daily data limit to define

To understand the data ingestion trend and the daily volume cap to define, review [Log Analytics Usage and estimated costs](../usage-estimated-costs.md). Consider it with care, because you can't monitor your resources after the limit is reached. 

### Set the daily cap

The following steps describe how to configure a limit to manage the volume of data that Log Analytics workspace will ingest per day.  

1. From your workspace, select **Usage and estimated costs** in the left pane.
2. On the **Usage and estimated costs** page for the selected workspace, select **Data Cap** at the top of the page. 
3. By default, **Daily cap** is set to **OFF**. To enable it, select **ON**, and then set the data volume limit in GB/day.

:::image type="content" source="media/manage-cost-storage/set-daily-volume-cap-01.png" alt-text="Log Analytics configure data limit":::

You can use Azure Resource Manager to configure the daily cap. To configure it, set the `dailyQuotaGb` parameter under `WorkspaceCapping` as described at [Workspaces - Create Or Update](/rest/api/loganalytics/workspaces/createorupdate#workspacecapping). 

You can track changes made to the daily cap using this query:

```kusto
_LogOperation | where Operation == "Workspace Configuration" | where Detail contains "Daily quota"
```

Learn more about the [_LogOperation](./monitor-workspace.md) function. 

### View the effect of the daily cap

To view the effect of the daily cap, it's important to account for the security data types that aren't included in the daily cap, and the reset hour for your workspace. The daily cap reset hour is visible on the **Daily Cap** page. The following query can be used to track the data volumes that are subject to the daily cap between daily cap resets. In this example, the workspace's reset hour is 14:00. You'll need to update this for your workspace.

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

### Alert when daily cap is reached

Azure portal has a visual cue when your data limit threshold is met, but this behavior doesn't necessarily align to how you manage operational issues that require immediate attention. To receive an alert notification, you can create a new alert rule in Azure Monitor. To learn more, see [how to create, view, and manage alerts](../alerts/alerts-metric.md).

To get you started, here are the recommended settings for the alert querying the `Operation` table using the `_LogOperation` function ([learn more](./monitor-workspace.md)). 

- Target: Select your Log Analytics resource
- Criteria: 
   - Signal name: Custom log search
   - Search query: `_LogOperation | where Operation =~ "Data collection stopped" | where Detail contains "OverQuota"`
   - Based on: Number of results
   - Condition: Greater than
   - Threshold: 0
   - Period: 5 (minutes)
   - Frequency: 5 (minutes)
- Alert rule name: Daily data limit reached
- Severity: Warning (Sev 1)

After an alert is defined and the limit is reached, an alert is triggered and performs the response defined in the Action Group. It can notify your team in the following ways:

- Email and text messages
- Automated actions using webhooks
- Azure Automation runbooks
- [Integrated with an external ITSM solution](../alerts/itsmc-definition.md#create-itsm-work-items-from-azure-alerts). 
