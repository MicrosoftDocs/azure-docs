---  
title:  Create jobs in the Microsoft Sentinel data lake
titleSuffix: Microsoft Security  
description: Use the Defender portal's Data lake exploration KQL queries to create and schedule jobs to promote data to the analytics tier.
author: EdB-MSFT  
ms.author: edbaynash  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.subservice: sentinel-graph
ms.date: 11/19/2025


ms.collection: ms-security  

# Customer intent: As a security engineer or administrator, I want to create jobs in the Microsoft Sentinel data lake so that I can run KQL queries against the data in the lake tier and promote the results to the analytics tier.

---  
 

#  Create KQL jobs in the Microsoft Sentinel data lake

KQL jobs are one-time or scheduled KQL queries on data in the Microsoft Sentinel data lake. Use jobs for investigative and analytical scenarios, such as: 
+ Long-running one-time queries for incident investigations and incident response (IR)
+ Data aggregation tasks that support enrichment workflows using low-fidelity logs
+ Historical threat intelligence (TI) matching scans for retrospective analysis
+ Anomaly detection scans that identify unusual patterns across multiple tables

KQL jobs are especially effective when queries use joins or unions across different datasets. 

Use jobs to promote data from the data lake tier to the analytics tier. Once in the analytics tier, use the advanced hunting KQL editor to query the data. Promoting data to the analytics tier has the following benefits:

+ Combine current and historical data in the analytics tier to run advanced analytics and machine learning models on your data.
+ Reduce query costs by running queries in the analytics tier.
+ Combine data from multiple workspaces to a single workspace in the analytics tier. 
+ Combine Microsoft Entra ID, Microsoft 365, and Microsoft Resource Graph data in the analytics tier to run advanced analytics across data sources.

> [!NOTE] 
> Storage in the analytics tier incurs higher billing rates than in the data lake tier. To reduce costs, only promote data that you need to analyze further. Use the KQL in your query to project only the columns you need, and filter the data to reduce the amount of data promoted to the analytics tier.  

You can promote data to a new table or append the results to an existing table in the analytics tier. When creating a new table, the table name is suffixed with *_KQL_CL* to indicate that the table was created by a KQL job.  

## Prerequisites

To create and manage KQL jobs in the Microsoft Sentinel data lake, you need the following prerequisites.

### Onboard to the data lake

To create and manage KQL jobs in the Microsoft Sentinel data lake, you must first onboard to the data lake. For more information on onboarding to the data lake, see [Onboard to the Microsoft Sentinel data lake](sentinel-lake-onboarding.md).

### Permissions

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. To read tables across all workspaces, write to the analytics tier, and schedule jobs using KQL queries, you must have one of the supported Microsoft Entra ID roles. For more information on roles and permissions, see [Microsoft Sentinel data lake roles and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake).

To create new custom tables in the analytics tier, assign the **Log Analytics Contributor** role in the Log Analytics workspace to the data lake managed identity.

To assign the role, follow these steps:

1. In the Azure portal, go to the Log Analytics workspace that you want to assign the role to.
1. Select **Access control (IAM)** in the left navigation pane.
1. Select **Add role assignment**.
1. In the **Role** table, select ***Log Analytics Contributor**, then select **Next**.
1. Select **Managed identity**, then select **Select members**.
1. Your data lake managed identity is a system assigned managed identity named `msg-resources-<guid>`. Select the managed identity, then select **Select**. 
1. Select **Review and assign**.

For more information on assigning roles to managed identities, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).


## Create a job

You can create jobs to run on a schedule or one-time. When you create a job, you specify the destination workspace and table for the results. You can write the results to a new table or append them to an existing table in the analytics tier. You can create a new KQL job or create a job from a template containing the query and job settings. For more information, see [Create a KQL job from a template](#create-a-job-from-a-template).


1. Start the job creation process from KQL query editor, or from the jobs management page.
    1. To create a job from the KQL query editor, select the **Create job** button in the upper right corner of the query editor. 
        :::image type="content" source="media/kql-jobs/kql-queries-create-job.png" alt-text="A screenshot showing the create job button in the KQL query editor." lightbox="media/kql-jobs/kql-queries-create-job.png":::

    1. To create a job from the jobs management page, select **Microsoft Sentinel** > **Data lake exploration** > **Jobs**   then select the **Create job** button.
        :::image type="content" source="media/kql-jobs/create-job.png" alt-text="A screenshot showing the create job button on the jobs management page." lightbox="media/kql-jobs/create-job.png":::

1. Enter a **Job name**. The job name must be unique for the tenant. Job names can contain up to 256 characters. You can't use a `#` or a `-` in a job name.      

1. Enter a **Job Description** providing the context and purpose of the job. 

1. From the **Select workspace** dropdown, select the destination workspace. This workspace is in the analytics tier where you want to write the query results.

1. Select the destination table:
    1. To create a new table, select **Create a new table** and enter a table name. Tables created by KQL jobs have the suffix *_KQL_CL* appended to the table name.
    
    1. To append to an existing table, select **Add to an existing table** and select the table name form the drop-down list. When adding to an existing table, the query results must match the schema of the existing table. 
    
1. Select **Next**.
    :::image type="content" source="media/kql-jobs/enter-job-details.png" alt-text="A screenshot showing the new job details page." lightbox="media/kql-jobs/enter-job-details.png":::

1. Review or write your query in the **Prepare the query** panel. Check that the time picker is set to the required time range for the job if the date range isn't specified in the query.

1. Select the workspaces to run the query against from the **Selected workspaces** drop-down. These workspaces are the source workspaces whose tables you want to query. The workspaces you select determine the tables available for querying. The selected workspaces apply to all query tabs in the query editor. When using multiple workspaces, the `union()` operator is applied by default to tables with the same name and schema from different workspaces. Use the `workspace()` operator to query a table from a specific workspace, for example `workspace("MyWorkspace").AuditLogs`. 

    > [!NOTE]
    > If you're writing to an existing table, the query must return results with a schema that matches the destination table schema. If the query doesn't return results with the correct schema, the job fails when it runs.

1. Select **Next**.

    :::image type="content" source="media/kql-jobs/review-query.png" alt-text="A screenshot showing the review query panel." lightbox="media/kql-jobs/review-query.png":::
 
    On the **Schedule the query job** page, select whether you want to run the job once or on a schedule. If you select **One time**, the job runs as soon as the job definition is complete. If you select **Schedule**, you can specify a date and time for the job to run, or run the job on a recurring schedule.

1. Select **One time** or **Scheduled job**.
    > [!NOTE]
    > Editing a one-time job immediately triggers its execution.

1. If you selected **Schedule**, enter the following details:
    1. Select the **Repeat frequency** from the drop-down. You can select **By minute**, **Hourly**, **Daily**, **Weekly**, or **Monthly**. 
    1. Set the **Repeat every** value for how often you want the job to run with respect to the selected frequency.
    1. Under **Set schedule**, enter the **From** dates and time. The job start time in the **From** field must be at least 30 minutes after job creation. The job runs from this date and time according to the frequency select in the **Run every** dropdown.
    1. Select the **To** date and time to specify when the job schedule finishes. If you want the schedule to continue indefinitely, select **Set job to run indefinitely**.

    Job from and to times are set for the user's locale.

    > [!NOTE]
    > If you schedule a job to run at a high frequency, for example every 30 minutes, you must take into account the time it takes for data to become available in the data lake. There's typically a latency of up to 15 minutes before newly ingested data is available for querying.
   
1. Select **Next** to review the job details.

    :::image type="content" source="media/kql-jobs/schedule-query-job.png" alt-text="A screenshot showing the schedule job panel." lightbox="media/kql-jobs/schedule-query-job.png":::

1. Review the job details and select **Submit** to create the job. If the job is a one-time job, it runs after you select **Submit**. If the job is scheduled, it's added to the list of jobs in the **Jobs** page and runs according to the start data and time.
    :::image type="content" source="media/kql-jobs/review-job-details.png" alt-text="A screenshot showing the review job details panel." lightbox="media/kql-jobs/review-job-details.png":::

1. The job is scheduled and the following page is displayed. You can view the job by selecting the link.
    :::image type="content" source="media/kql-jobs/job-successfully-scheduled.png" alt-text="A screenshot showing the job created page." lightbox="media/kql-jobs/job-successfully-scheduled.png":::

## Create a job from a template

You can create a KQL job from a predefined job template. Job templates contain the KQL query and job settings, such as the destination workspace and table, schedule, and description. You can create your own job templates or use built-in templates provided by Microsoft.

To create a job from a template, follow these steps:

1. From the **Jobs** page or the KQL query editor, select **Create job**, then select **Create from template**.

1. On the **Job templates** page, select the template you want to use from the list of available templates. 

1. Review the **Description** and **KQL query** from the template. 

1. Select **Create job from template**.

    :::image type="content" source="media/kql-jobs/create-job-from-template.png" alt-text="A screenshot showing the job templates page." lightbox="media/kql-jobs/create-job-from-template.png":::

1. The job creation wizard opens with the **Create a new KQL job** page. The job details prepopulated from the template except for the destination workspace.

1. Select the destination workspace from the **Select workspace** dropdown.

1. Review and modify the job details as required, then select **Next** to proceed through the job creation wizard.

1. The remaining steps are the same as creating a new job. The fields are prepopulated from the template and can be modified as needed. For more information, see [Create a job](#create-a-job).
  

The following templates are available:


| Template name | Category |
|--------------|----------|
|<details><summary>**Anomalous sign-in locations increase**</summary><br>Analyze trend analysis of Entra ID sign-in logs to detect unusual location changes for users across applications by computing trend lines of location diversity. It highlights the top three accounts with the steepest increase in location variability and lists their associated locations within 21-day windows.<br><br>**Destination table:** UserAppSigninLocationTrend<br><br>**Query lookback:** 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Hunting |
|<details><summary>**Anomalous sign-in behavior based on location changes**</summary><br>Identify anomalous sign-in behavior based on location changes for Entra ID users and apps to detect sudden changes in behavior.<br><br>**Destination table:** UserAppSigninLocationAnomalies<br><br>**Query lookback:** 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Anomaly detection |
|<details><summary>**Audit rare activity by app**</summary><br>Find apps performing rare actions (for example, consent, grants) that can quietly create privilege. Compare the current day to last 14 days of audits to identify new audit activities. Useful for tracking malicious activity related to user/group additions or removals by Azure Apps and automated approvals.<br><br>**Destination table:** AppAuditRareActivity<br><br>**Query lookback:** 14 days<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Hunting |
|<details><summary>**Azure rare subscription level operations**</summary><br>Identify sensitive Azure subscription-level events based on Azure Activity Logs. For example, monitoring based on operation name "Create or Update Snapshot", which is used for creating backups but could be misused by attackers to dump hashes or extract sensitive information from the disk.<br><br>**Destination table:** AzureSubscriptionSensitiveOps<br><br>**Query lookback:** 14 days<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Hunting |
|<details><summary>**Daily activity trend by app in AuditLogs**</summary><br>From the last 14 days, identify any "Consent to application" operation occurs by a user or app. This could indicate that permissions to access the listed AzureApp was provided to a malicious actor. Consent to application, add service principal and add Auth2PermissionGrant events should be rare. If available, extra context is added from the AuditLogs based on CorrleationId from the same account that performed "Consent to application".<br><br>**Destination table:** AppAuditActivityBaseline<br><br>**Query lookback:** 14 days<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Baseline |
|<details><summary>**Daily location trend per user or app in SignInLogs**</summary><br>Build daily trends for all user sign-ins, locations count, and their app usage.<br><br>**Destination table:** UserAppSigninLocationBaseline<br><br>**Query lookback:** 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Baseline |
|<details><summary>**Daily network traffic trend per destination IP**</summary><br>Create a baseline including bytes and distinct peers to detect beaconing and exfiltration.<br><br>**Destination table:** NetworkTrafficDestinationIPDailyBaseline<br><br>**Query lookback:** 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Baseline |
|<details><summary>**Daily network traffic trend per destination IP with data transfer stats**</summary><br>Identify internal host that reached out outbound destination, including volume trends, estimating blast radius.<br><br>**Destination table:** NetworkTrafficDestinationIPTrend<br><br>**Query lookback**: 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Hunting |
|<details><summary>**Daily network traffic trend per source IP**</summary><br>Create a baseline including bytes and distinct peers to detect beaconing and exfiltration.<br><br>**Destination table:** NetworkTrafficSourceIPDailyBaseline<br><br>**Query lookback:** 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Baseline |
|<details><summary>**Daily network traffic trend per source IP with data transfer stats**</summary><br>Today's connections and bytes are evaluated against the host's day-over-day baseline to determine whether the observed behaviors deviate significantly from established pattern.<br><br>**Destination table:** NetworkTrafficSourceIPTrend<br><br>**Query lookback:** 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Hunting |
|<details><summary>**Daily sign-in location trend per user and app**</summary><br>Create a sign-in baseline for each user or application with typical geographic and IP, enabling efficient and cost-effective anomaly detection at scale.<br><br>**Destination table:** UserAppSigninLocationDailyBaseline<br><br>**Query lookback:** 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Baseline |
|<details><summary>**Daily process execution trend**</summary><br>Identify new processes and prevalence, making "new rare process" detections easier.<br><br>**Destination table:** EndpointProcessExecutionBaseline<br><br>**Query lookback:** 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Baseline |
|<details><summary>**Entra ID rare user agent per app**</summary><br>Establish a baseline of the type of UserAgent (that is, browser, office application, etc.) that is typically used for a particular application by looking back for a number of days. It then searches the current day for any deviations from this pattern, that is, types of UserAgents not seen before in combination with this application.<br><br>**Destination table:** UserAppRareUserAgentAnomalies<br><br>**Query lookback:** 7 days<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Anomaly detection |
|<details><summary>**Network log IOC matching**</summary><br>Identify any IP indicators of compromise (IOCs) from threat intelligence (TI), by searching for matches in CommonSecurityLog.<br><br>**Destination table:** NetworkLogIOCMatches<br><br>**Query lookback:** 1 hour<br><br>**Schedule:** hourly<br><br>**Start date:** Current date + 1 hr</details>| Hunting |
|<details><summary>**New processes observed in last 24 hours**</summary><br>New processes in stable environments may indicate malicious activity. Analyzing sign-in sessions where these binaries ran can help identify attacks.<br><br>**Destination table:** EndpointNewProcessExecutions<br><br>**Query lookback:** 14 days<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Hunting |
|<details><summary>**SharePoint file operation via previously unseen IPs**</summary><br>Identify anomalies using user behavior by setting a threshold for significant changes in file upload/download activities from new IP addresses. It establishes a baseline of typical behavior, compares it to recent activity, and flags deviations exceeding a default threshold of 25.<br><br>**Destination table:** SharePointFileOpsNewIPs<br><br>**Query lookback:** 14 days<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Hunting |
|<details><summary>**Palo Alto potential network beaconing**</summary><br>Identify beaconing patterns from Palo Alto Network traffic logs based on recurrent time delta patterns. The query uses various KQL functions to calculate time deltas and then compares it with total events observed in a day to find percentage of beaconing.<br><br>**Destination table:** PaloAltoNetworkBeaconingTrend<br><br>**Query lookback:** 1 day<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Hunting |
|<details><summary>**Windows suspicious login outside normal hours**</summary><br>Identify unusual Windows sign-in events outside a user's normal hours by comparing with the last 14 days' sign-in activity, flagging anomalies based on historical patterns.<br><br>**Destination table:** WindowsLoginOffHoursAnomalies<br><br>**Query lookback:** 14 days<br><br>**Schedule:** daily<br><br>**Start date:** Current date + 1 hr</details>| Anomaly detection |


## Considerations and limitations

When you create jobs in the Microsoft Sentinel data lake, consider the following limitations and best practices:

## KQL

+ All KQL operators and functions are supported except for the following:
  + `adx()`
  + `arg()`
  + `externaldata()`
  + `ingestion_time()`

+ When you use the `stored_query_results` command, provide the time range in the KQL query. The time selector above the query editor doesn't work with this command.

+ User-defined functions aren't supported.


## Jobs
+ Job names must be unique for the tenant.
+ Job names can be up to 256 characters. 
+ Job names can't contain a `#` or a `-`.
+ Job start time must be at least 30 minutes after job creation or editing.


## Data lake ingestion latency

The data lake tier stores data in cold storage. Unlike hot or near real-time analytics tiers, cold storage is optimized for long-term retention and cost efficiency and doesn't provide immediate access to newly ingested data. When new rows are added to existing tables in the data lake, there's a typical latency of up to 15 minutes before the data is available for querying. Account for the ingestion latency when you run queries and schedule KQL jobs by ensuring that lookback windows and job schedules are configured to avoid data that isn't available yet.

To avoid querying data that might not yet be available, include a delay parameter in your KQL queries or jobs. For example, when you schedule automated jobs, set the query's end time to `now() - delay`, where `delay` matches the typical data readiness latency of 15 minutes. This approach ensures that queries only target data that's fully ingested and ready for analysis.

``` kql 
let lookback = 15m;
let delay = 15m;
let endTime = now() - delay;
let startTime = endTime - lookback;
CommonSecurityLog
| where TimeGenerated between (startTime .. endTime)
```

This approach is effective for jobs with short lookback windows or frequent execution intervals. 
  
Consider overlapping the lookback period with job frequency to reduce the risk of missing late-arriving data.

For more information, see [Handle ingestion delay in scheduled analytics rules](/azure/sentinel/ingestion-delay).

### Column names
The following standard columns aren't supported for export. The ingestion process overwrites these columns in the destination tier:

+ TenantId
+ _TimeReceived
+ Type
+ SourceSystem
+ _ResourceId
+ _SubscriptionId
+ _ItemId
+ _BilledSize
+ _IsBillable
+ _WorkspaceId

+ `TimeGenerated` is overwritten if it's older than two days. To preserve the original event time, write the source timestamp to a separate column.



For service limits, see [Microsoft Sentinel data lake service limits](sentinel-lake-service-limits.md#service-parameters-and-limits-for-kql-jobs).

> [!NOTE]
>  Partial results might be promoted if the job's query exceeds the one hour limit.

[!INCLUDE [limitations for KQL jobs](../includes/service-limits-kql-jobs.md)]

For troubleshooting tips and error messages, see [Troubleshooting KQL queries for the Microsoft Sentinel data lake](kql-troubleshoot.md).


## Related content

- [Manage jobs in the Microsoft Sentinel data lake](kql-manage-jobs.md)
- [Microsoft Sentinel data lake overview](sentinel-lake-overview.md)
- [KQL queries in the Microsoft Sentinel data lake](kql-queries.md)
- [Jupyter notebooks and the Microsoft Sentinel data lake](notebooks.md)
