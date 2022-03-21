---
title: Set daily cap on Log Analytics workspace
description: Set a 
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Set daily cap on Log Analytics workspace
A daily cap on a Log Analytics workspace allows you to avoid unexpected increases in charges for data ingestion by stopping collection of billable data for the rest of the day if a specified cap is reached. 

## Overview
You should use care when setting a daily cap because when data collection stops, your ability to observe and receive alerts when the health conditions of resources supporting IT services will be impacted. It can also impact other Azure services and solutions whose functionality may depend on up-to-date data being available in the workspace. Your goal shouldn't be to regularly hit the daily limit but rather use it as an infrequent method to avoid unplanned charges resulting from an unexpected increase in the volume of data collected.

You can't track the health and performance of your application after it reaches the daily cap.

Each workspace has its daily cap applied on a different hour of the day. The reset hour is shown in the **Daily Cap** page (see below). This reset hour can't be configured. Latency inherent in applying the daily cap means that the cap isn't applied at precisely the specified daily cap level. 

## Application Insights
The daily cap for a workspace includes data from any workspace-based Application Insights resources. You shouldn't create a separate daily cap for these resources. You do need to create a separate daily cap for classic Application Insights resources  since their data doesn't reside in a Log Analytics workspace. 

You can use the daily volume cap to limit the data collected. However, if the cap is met, a loss of all telemetry sent from your application for the remainder of the day occurs. It *isn't advisable* to have your application hit the daily cap. You can't track the health and performance of your application after it reaches the daily cap.


Instead of using the daily volume cap, use [sampling](../app/sampling.md) to tune the data volume to the level you want. Then, use the daily cap only as a "last resort" in case your application unexpectedly begins to send much higher volumes of telemetry.

## Determine your daily cap
To understand the data ingestion trend and the daily volume cap to define, review [Log Analytics Usage and estimated costs](../usage-estimated-costs.md). Consider it with care, because you can't monitor your resources after the limit is reached. 

Review Application Insights Usage and estimated costs to understand the data ingestion trend and what is the daily volume cap to define. It should be considered with care, since you won't be able to monitor your resources after the limit is reached.

> [!WARNING]
> For workspaces with Microsoft Defender for Cloud, the daily cap doesn't stop the collection of data types **WindowsEvent**, **SecurityAlert**, **SecurityBaseline**, **SecurityBaselineSummary**, **SecurityDetection**, **SecurityEvent**, **WindowsFirewall**, **MaliciousIPCommunication**, **LinuxAuditLog**, **SysmonEvent**, **ProtectionStatus**, **Update**, and **UpdateSummary**, except for workspaces in which Microsoft Defender for Cloud was installed before June 19, 2017. 

## When daily cap is reached
When the daily cap is reached, a warning banner appears across the top of the page for the selected Log Analytics workspace, and an operation event is sent to the *Operation* table under the **LogManagement** category. 


## When data collection resumes
Data collection resumes after the reset time defined under *Daily limit will be set at*. We recommend defining an alert rule that's based on this operation event, configured to notify when the daily data limit is reached. For more information, see [Alert when daily cap is reached](#alert-when-daily-cap-is-reached) section. 

> [!NOTE]
> The daily cap can't stop data collection at precisely the specified cap level and some excess data is expected, particularly if the workspace is receiving high volumes of data. If data is collected above the cap, it's still billed. For a query that is helpful in studying the daily cap behavior, see the [View the effect of the Daily Cap](#view-the-effect-of-the-daily-cap) section in this article. 


## Set the daily cap

### Log Analytics workspace
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

### Classic Applications Insights resource
To change the daily cap, in the **Configure** section of your Application Insights resource, in the **Usage and estimated costs** page, select  **Daily Cap**.

![Adjust the daily telemetry volume cap](../app/media/pricing/pricing-003.png)

To [change the daily cap via Azure Resource Manager](../app/powershell.md), the property to change is the `dailyQuota`.  Via Azure Resource Manager you can also set the `dailyQuotaResetTime` and the daily cap's `warningThreshold`.

## Alert when daily cap is reached

### Logs
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

### Classic Application Insights resource

The Application Insights Daily Cap creates an event in the Azure activity log when the ingested data volumes reaches the warning level or the daily cap level.  You can [create an alert based on these activity log events](../alerts/alerts-activity-log.md#azure-portal). The signal names for these events are:

* Application Insights component daily cap warning threshold reached
* Application Insights component daily cap reached

To disable the daily volume cap e-mails, under the **Configure** section of your Application Insights resource, in the **Usage and estimated costs** pane, select  **Daily Cap**. There are settings to send e-mail when the cap is reached, as well as when an adjustable warning level has been reached. If you wish to disable all daily cap volume-related emails, uncheck both boxes.

When you create an Application Insights resource in the Azure portal, the daily cap is set to 100 GB/day. When you create an Application Insights resource in Visual Studio, the default is small (only 32.3 MB/day). The daily cap default is set to facilitate testing. It's intended that the user will raise the daily cap before deploying the app into production. 

The maximum cap in Application Insights is 1,000 GB/day unless you request a higher maximum for a high-traffic application.


Warning emails about the daily cap are sent to account that are members of these roles for your Application Insights resource: "ServiceAdmin", "AccountAdmin", "CoAdmin", "Owner".

Use care when you set the daily cap. Your intent should be to *never hit the daily cap*. If you hit the daily cap, you lose data for the remainder of the day, and you can't monitor your application. To change the daily cap, use the **Daily volume cap** option. You can access this option in the **Usage and estimated costs** pane (this is described in more detail later in the article).

We've removed the restriction on some subscription types that have credit that couldn't be used for Application Insights. Previously, if the subscription has a spending limit, the daily cap dialog has instructions to remove the spending limit and enable the daily cap to be raised beyond 32.3 MB/day.


## View the effect of the daily cap

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

## Next steps
