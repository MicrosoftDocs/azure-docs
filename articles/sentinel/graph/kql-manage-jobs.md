---  
title: Manage KQL jobs.
titleSuffix: Microsoft Security  
description: Managing KQL jobs in the Defender portal for Microsoft Sentinel data lake.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.subservice: sentinel-graph
ms.date: 06/19/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a threat hunter, security engineer or an security administrator, I want to manage jobs in the Microsoft Sentinel data lake so that I can run KQL queries  against the data in the lake tier and promote the results to the analytics tier.

---  
 
#  Manage KQL jobs in the Microsoft Sentinel data lake (Preview)
 
## Overview  
A job is an one-time or scheduled task that runs a KQL (Kusto Query Language) query against the data in the lake tier to promote the results to the analytics tier. Once in the analytics tier, use the Advanced hunting KQL editor to query the data. 
Jobs can be created and in the **KQL queries** editor under **Data lake exploration**  in the Defender portal for Microsoft Sentinel. For more information see [KQL jobs](kql-jobs.md). 

Jobs are managed in the **Jobs** page under **Data lake exploration** in the Defender portal for Microsoft Sentinel. The Jobs management page provides the following functions:

+ View all jobs in the Microsoft Sentinel data lake. You can view jobs created in the KQL queries editor or jobs created for notebooks. 
+ Create a new job to run a KQL query. For more information on creating jobs, see [Create jobs in the Microsoft Sentinel data lake using KQL](kql-jobs.md).
+ Edit job details. You can view but can't edit a notebook job from the jobs page. For more information on editing notebook jobs, see [KQL notebooks](kql-notebooks.md).
+ Disable a job, preventing it from running until you enable it again.
+ Enable a job, allowing it to run again after being disabled.
+ View job history, including the run times, and statuses of the job.
+ Delete a job, removing it from the list of jobs. This action is permanent and can't be undone.


## Permissions

For broad access to create queries and jobs for workspaces in the data lake, you can use one of the following Microsoft Entra ID roles:
+ Global reader 
+ Security reader
+ Security operator 
+ Security administrator
+ Global administrator

For more information on roles and permissions, see [Microsoft Sentinel lake roles and permissions](./roles-permissions.md).


## Manage jobs

The jobs page is found in the left navigation pane in the Defender portal under **Data lake exploration** in the *Microsoft Sentinel* menu.

The Jobs page shows a list of all your jobs, including the job name, status, and job type. The **Jobs status** column indicates whether the job enabled or disabled.  The **Job type** column indicates whether the job is a KQL query job or a notebook job. 

:::image type="content" source="media/kql-manage-jobs/jobs-page.png"  lightbox="media/kql-manage-jobs/jobs-page.png" alt-text="A screenshot showing the jobs page in the Defender portal.":::

To create a job select the **Create new job** button. For more information on creating jobs, see [Create jobs in the Microsoft Sentinel data lake using KQL](kql-jobs.md).

### Job details

To see a job's details, select a job. The job detail panel opens, showing the following information:

- **Job name**: The name of the job.
- **Job description**: A description of the job, providing context and purpose.
- **Job type**: The type of job, either a KQL query job or a notebook job.
- **Job status**: The status of the job, either enabled or disabled.
- **Run status**: The status of the last run of the job.  Status values are:
    - `Succeeded`
    - `Failed`
    - `In progress`
    - `Queued` - The job is queued and waiting to run whn resources are available.
- **Repeat frequency**: The frequency at which the job runs, such as daily, weekly, or monthly.
- **Destination table**: The table in the analytics tier where the job results are written to.
<!-- **Destination workspace**: The workspace in the analytics tier where the job results are written to -->
- **Job start on (UTC)**: The date and time in UTC when the job is first scheduled to start.
- **Target tier**: The destination tier of the job's results, such as Lake or Analytics tier.
- **Date range**: The date range set for the query. 
- **KQL query**: The KQL query that the job runs.

    :::image type="content" source="media/kql-manage-jobs/manage-job-details.png" alt-text="A screenshot showing the job details page." lightbox="media/kql-manage-jobs/manage-job-details.png":::

Select the **Destination table** link to open the table in the KQL query editor in Advanced hunting. The query can be copied bu selection the **Copy query** button.  

### Edit a job

To edit a job, select the **Edit** button in the job details panel. The job details panel opens, allowing you to edit the following fields:

The following details can be edited:
+ Job description
+ KQL query. The query can be updated but must return the same output schema as the original query. For example, you can cgane the time range in the query, but you can't change the columns returned by the query.
+ Job schedule. You can change the job to run once or on a schedule, or change the schedule.

Select **Next** to continue to the next screen. 

After you edit the job, select **Submit** to save the changes. The job is updated and runs according to the new schedule or query.


### View a job's run history

To view the history of a job, select the **View history** button in the job details panel. The job history panel opens, showing a list of job run times and statuses

:::image type="content" source="media/kql-manage-jobs/job-history.png" lightbox="media/kql-manage-jobs/job-history.png" alt-text="A screenshot showing the job history panel.":::

### Enable or disable a job

To enable or disable a job, select the **Enable** or **Disable** button in the job details panel. When a job is disabled, it won't run until you enable it again. The status of the job changes to reflect whether it's enabled or disabled.

### Delete a job

To delete a job, select the **Delete** button in the job details panel. A confirmation dialog appears, asking you to confirm the deletion. If you confirm, the job is permanently deleted and can't be recovered.



## Next steps

- [Overview of the Microsoft Sentinel data lake](sentinel-lake-overview.md)
- [Create jobs in the Microsoft Sentinel data lake using KQL](kql-jobs.md)
- [Data lake exploration - KQL queries (Preview).](kql-queries.md)
- [Microsoft Sentinel lake roles and permissions](roles-permissions.md)