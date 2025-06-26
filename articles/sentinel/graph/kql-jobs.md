---  
title:  Create jobs in the Microsoft Sentinel data lake (Preview)
titleSuffix: Microsoft Security  
description: Use the Defender portal's Data lake exploration KQL queries to create and schedule jobs to promote data to the analytics tier.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.custom: sentinel-graph
ms.date: 05/29/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a security engineer or administrator, I want to create jobs in the Microsoft Sentinel data lake so that I can run KQL queries against the data in the lake tier and promote the results to the analytics tier.

---  
 

#  Create KQL jobs in the Microsoft Sentinel data lake (Preview)
 

A job is a one-time or scheduled task that runs a KQL (Kusto Query Language) query against the data in the lake tier to promote the results to the analytics tier. Once in the analytics tier, use the Advanced hunting KQL editor to query the data. Promoting data to the analytics tier has the following benefits:

+ Combine current and historical data in the analytics tier to run advanced analytics and machine learning models on your data.

+ Reduce query costs by running queries in the Analytics tier
+ Combine data from multiple workspaces by promoting data from different workspaces to a single workspace in the analytics tier. 
+ Combine Microsoft Entra ID, Microsoft 365, and Microsoft Resource Graph data in the analytics tier to run advanced analytics across data sources.

Storage in the analytics tier incurs higher billing rates than in the lake tier. To reduce costs, only promote data that you need to analyze further. Use the KQL in your query to project only the columns you need, and filter the data to reduce the amount of data promoted to the analytics tier.  

When promoting data to the analytics tier, make sure that the destination workspace is visible in the Advanced hunting query editor. You can only query connected workspaces in the Advanced hunting query editor. For more information on connected workspaces, see [Connect a workspace](/defender-xdr/advanced-hunting-microsoft-defender#connect-a-workspace). You can promote data to a new table or append the results to an existing table in the analytics tier. When creating a new table, the table name is suffixed with *_KQL_CL* to indicate that the table was created by a KQL job.  


You can create a job by selecting the **Create job** button a KQL query tab or directly from the **Jobs** management page or by. For more information on the Jobs management page, see [Manage jobs in the Microsoft Sentinel data lake](kql-manage-jobs.md).

## Permissions

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. To read tables across all workspaces, write to the analytics tier, and schedule jobs using KQL queries, you must have one of the supported Microsoft Entra ID roles. For more information on roles and permissions, see [Microsoft Sentinel lake roles and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview).


## Create a job

You can create a job to run a KQL query against the data in the lake tier and promote the results to the analytics tier. You can create jobs to run on a schedule or one-time. When you create a job, you specify the destination workspace and table for the results. The results can be written to a new table or appended to an existing table in the analytics tier.

You can manage jobs from the **Jobs** management page under **Data lake exploration** in the navigation panel. Use the job page to create new jobs, view the list of jobs, their status, and their details. You can also run, edit, or delete and disable jobs. For more information on managing jobs, see [Manage KQL jobs](kql-manage-jobs.md).

To create jobs to run on a schedule or one-time, follow the steps below. 

1. You can start the job creation process from KQL query editor, or from the jobs management page.
    1. To create a job from the KQL query editor, select the **Create job** button in the upper right corner of the query editor. 
        :::image type="content" source="media/kql-jobs/kql-queries-create-job.png" alt-text="A screenshot showing the create job button in the KQL query editor." lightbox="media/kql-jobs/kql-queries-create-job.png":::
    1. To create a job from the jobs management page, select **Jobs** in the left navigation pane under **Data lake exploration**,  then select the **Create a new job**.
        :::image type="content" source="media/kql-jobs/jobs-page-create-job.png" alt-text="A screenshot showing the create job button in the jobs management page." lightbox="media/kql-jobs/jobs-page-create-job.png":::
1. Enter a **Job name**.       

1. Enter a **Job Description** providing the context and purpose of the job. 

1. From the **Select workspace** dropdown, select the destination workspace in the analytics tier to write the result to. 
    > [!NOTE]
    > The destination workspace must be connected to the Defender portal to be visible in the Advance hunting query editor. For more information on connected workspaces, see [Connect a workspace](/defender-xdr/advanced-hunting-microsoft-defender#connect-a-workspace).

1. Select the destination table:
    1. To create a new table, select **Create a new table** and enter a table name. Tables created by KQL jobs have the suffix *_KQL_CL* appended to the table name.
    
    1. To append to an existing table, select **Add to an exiting table** and select the table name form the drop-down list. When adding to an exiting table, the query results must match the schema of the existing table. 
    
1. Select **Next**
    :::image type="content" source="media/kql-jobs/enter-job-name-details.png" alt-text="A screenshot showing the new job details page." lightbox="media/kql-jobs/enter-job-name-details.png":::

1. Review or write your query in the Review the query panel. Check that the time picker is set to the required time range for the job if the date range isn't specified in the query.
1. Select the workspace to run the query against from the **Selected workspace** drop-down

    > [!NOTE]
    > The query must return a table with a schema that matches the destination table schema. If the query doesn't return a table with the correct schema, the job fails when it runs.
1. Select **Next**

    :::image type="content" source="media/kql-jobs/review-query.png" alt-text="A screenshot showing the review query panel." lightbox="media/kql-jobs/review-query.png":::
 
In the **Schedule the query job** panel, select whether you want to run the job once or on a schedule. If you select **One time**, the job runs as soon as the job definition is complete. If you select **Schedule**, you can specify a date and time for the job to run, or run the job on a recurring schedule.

1. Select **One time** or **Scheduled job**

1. If you selected **Schedule**, enter the following details:
    1. Select the run frequency from the **Run every** drop-down. Select *Daily*, Weekly*, or *Monthly*.
    1. Under **Start running**, enter the **Start running date** and **Start running time** . The job runs from this date and time according to the frequency select in the **Run every** dropdown.
    1. Select the **Set end date** checkbox to specify an end date and time for the job schedule. If you don't select the end date checkbox, the job runs according to the run frequency until you disable or delete it.
   
1. Select **Next** to review the job details.

    :::image type="content" source="media/kql-jobs/schedule-query-job.png" alt-text="A screenshot showing the schedule job panel." lightbox="media/kql-jobs/schedule-query-job.png":::

1. Review the job details and select **Submit** to create the job. If the job is a one-time job, it runs after you select **Submit**. If the job is scheduled, it's added to the list of jobs in the **Jobs** page of the data Data lake exploration and runs according to the start data and time.
    :::image type="content" source="media/kql-jobs/review-job-details.png" alt-text="A screenshot showing the review job details panel." lightbox="media/kql-jobs/review-job-details.png":::

1. The job is scheduled and the following page is displayed. You can view the job by selecting the link.
    :::image type="content" source="media/kql-jobs/job-successfully-scheduled.png" alt-text="A screenshot showing the job created page." lightbox="media/kql-jobs/job-successfully-scheduled.png":::



### Job limitations and troubleshooting

The following table lists the limitations for KQL jobs in the Microsoft Sentinel data lake.

|Category| Limit|
|---|---|
|Timeout| 1 hour|
|Queryable time range| 12 years|
|Job results destination | Analytics tier|
|Concurrent jobs| 3 jobs |
|Query scope| Single workspace|
|Output tables per job| 1 table |

> [!NOTE]
>  Partial results may be promoted if the job's query exceeds the one hour limit.

For troubleshooting tips and error messages, see [Troubleshooting KQL queries for the Microsoft Sentinel data lake (Preview)](kql-troubleshooting.md).


## Related content

- [Manage jobs in the Microsoft Sentinel data lake](kql-manage-jobs.md)
- [Microsoft Sentinel data lake overview (Preview)](sentinel-lake-overview.md)
- [KQL queries in the Microsoft Sentinel data lake](kql-queries.md)
- [Jupyter notebooks and the Microsoft Sentinel data lake (Preview)](notebooks.md)
