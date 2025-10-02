---  
title: Manage KQL jobs
titleSuffix: Microsoft Security  
description: Managing KQL jobs in the Defender portal for Microsoft Sentinel data lake
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.subservice: sentinel-graph
ms.date: 07/09/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a threat hunter, security engineer or an security administrator, I want to manage jobs in the Microsoft Sentinel data lake so that I can run KQL queries  against the data in the lake tier and promote the results to the analytics tier.

---  
 
#  Manage KQL jobs in the Microsoft Sentinel data lake 
 

A KQL job is a one-time or scheduled task that runs a KQL (Kusto Query Language) query against the data in the data lake tier to promote the results to the analytics tier. Jobs can be created in the **KQL queries** editor, or the **Jobs** page under **Microsoft Sentinel** > **Data lake exploration**  in the Microsoft Defender portal for. For more information, see [KQL jobs](kql-jobs.md). 

The Jobs management page provides the following functions:

+ View all jobs in the Microsoft Sentinel data lake. You can view jobs created in the KQL queries editor or jobs created for notebooks. 
+ View a summary of KQL and Notebook jobs.
+ View details of all jobs and apply filter to narrow down the list.
+ View recent job health issues.
+ Create a new job to run a KQL query. For more information on creating jobs, see [Create jobs in the Microsoft Sentinel data lake using KQL](kql-jobs.md).
+ Edit job details. You can view but can't edit a notebook job from the jobs page. For more information on editing notebook jobs, see [Notebook notebooks](notebook-jobs.md).
+ Disable a job, preventing it from running until you enable it again.
+ Enable a job, allowing it to run again after being disabled.
+ View job history, including the run times, and statuses of the job.
+ Delete a job, removing it from the list of jobs. This action is permanent and can't be undone.


## Permissions

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. To read tables across all workspaces, write to the analytics tier, and schedule jobs using KQL queries, you must have one of the supported Microsoft Entra ID roles. For more information on roles and permissions, see [Microsoft Sentinel data lake roles and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake).


## Manage jobs

The Jobs page shows a list of jobs, including the job name, status, job type, last and next run dates, and the recent job health. You can filter the jobs by status, last run date, and creation date. **Jobs status** column indicates whether the job enabled or disabled. The **Job type** column indicates whether the job is a KQL query job or a notebook job.
:::image type="content" source="media/kql-manage-jobs/jobs-page.png" lightbox="media/kql-manage-jobs/jobs-page.png" alt-text="A screenshot showing the jobs page in the Defender portal.":::

The **Recent health issues** column shows whether the job encountered any issues in its recent runs as per the filters. Select the link to view the job's health details.

:::image type="content" source="media/kql-manage-jobs/recent-health-issues.png" lightbox="media/kql-manage-jobs/recent-health-issues.png" alt-text="A screenshot showing the recent health issues panel.":::



To create a job from the jobs page, select **Create a new KQL job**. For more information on creating jobs, see [Create jobs in the Microsoft Sentinel data lake using KQL](kql-jobs.md).

### Job details

To see a job's details, select the job from the table.
The job details panel opens, showing the job's details. You can enable and disable a job, view its history, edit, or delete it.
Select the **Destination table** link to open the table in the KQL query editor in Advanced hunting.  
The query can be copied by selecting **Copy query**.  

:::image type="content" source="media/kql-manage-jobs/manage-job-details.png" alt-text="A screenshot showing the job details page." lightbox="media/kql-manage-jobs/manage-job-details.png":::



### Edit a job

To edit a job, select  **Edit** in the job details panel. The job details panel opens, allowing you to edit the following fields:

+ Job description.
+ KQL query. The query can be updated but must return the same output schema as the original query. For example, you can change the time range in the query, but you can't change the columns returned by the query.
+ Job schedule. You can change the job to run once or on a schedule, or change the schedule.

Select **Next** to continue to the next screen. 

After you edit the job, select **Submit** to save the changes. The job is updated and runs according to the new schedule or query.

> [!NOTE]
> Editing a one-time job immediately triggers its execution.

### View a job's run history

To view the history of a job, select **View history** in the job details panel. The job history panel opens, showing a list of job run times and statuses. The row count reflects the number of rows sent to the destination table in the analytics tier.

:::image type="content" source="media/kql-manage-jobs/job-history.png" lightbox="media/kql-manage-jobs/job-history.png" alt-text="A screenshot showing the job history panel.":::

### Enable or disable a job

To enable or disable a job, select **Enable** or **Disable** in the job details panel. When a job is disabled, it won't run until you enable it again. The status of the job changes to reflect whether it's enabled or disabled.

### Delete a job

To delete a job, select  **Delete** in the job details panel. A confirmation dialog appears, asking you to confirm the deletion. If you confirm, the job is permanently deleted and can't be recovered. You can't delete a running job.

## Considerations and limitations

For information on considerations and limitations when managing KQL jobs in the Microsoft Sentinel data lake, see [KQL jobs](kql-jobs.md#considerations-and-limitations).

## Next steps

- [Overview of the Microsoft Sentinel data lake](sentinel-lake-overview.md)
- [Create jobs in the Microsoft Sentinel data lake using KQL](kql-jobs.md)
- [Data lake exploration - KQL queries](kql-queries.md)
- [Microsoft Sentinel data lake roles and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake)