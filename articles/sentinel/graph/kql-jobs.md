---  
title:  Create jobs in the Microsoft Sentinel data lake (Preview)
titleSuffix: Microsoft Security  
description: Use the Defender portal's Data lake exploration KQL queries to create and schedule jobs to promote data to the analytics tier.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.custom: sentinel-lake-graph
ms.date: 05/29/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a security engineer or administrator, I want to create jobs in the Microsoft Sentinel data lake so that I can run KQL queries  against the data in the lake tier and promote the results to the analytics tier.

---  
 

#  Create jobs in the Microsoft Sentinel data lake (Preview)
 

A job is an on-demand or scheduled task that runs a KQL (Kusto Query Language) query against the data in the lake tier to promote the results to the analytics tier. Once in the analytics tier, use the Advanced hunting KQL editor to query the data. Promoting data to the analytics tier has the following benefits:

+ Combine current and historical data in the analytics tier to run advanced analytics and machine learning models on your data.

+ Reduce query costs by running queries in the Analytics tier
+ Combine data from multiple workspaces by promoting data from different workspaces to a single workspace in the analytics tier. 
+ Combine EntraID, Microsoft 365, and Microsoft Resource Graph data in the analytics tier to run advanced analytics across data sources.

Storage in the analytics tier incurs higher billing rates than in the lake tier. To reduce costs, only promote data that you need to analyze further. Use the KQL in your query to project only the columns you need, and filter the data to reduce the amount of data promoted to the analytics tier.  

When promoting data to the analytics tier, make sure that the destination workspace is visible in the Advance hunting query editor. You can only query connected workspaces in the Advanced hunting query editor. For more information on connected workspaces, see [Connect a workspace](/defender-xdr/advanced-hunting-microsoft-defender#connect-a-workspace)

You can create a job by selecting the **Create job** button a KQL query tab or directly from the **Jobs** management page or by. For more information on the Jobs management page, see [Manage jobs in the Microsoft Sentinel data lake](manage-jobs.md).

To create jobs to run on a schedule or on-demand, follow the steps below:

1. Select the **Create job** button in the upper right corner of the query editor. 
    
    :::image type="content" source="media/kql-jobs/create-a-job.png" alt-text="A screenshot showing the create job button." lightbox="media/kql-jobs/create-a-job.png":::

1. Enter a **Job name**.            
1. Enter a **Job Description** providing the context and purpose of the job. 
1. In the **Select workspace**, select the destination workspace where in the analytics tier to write to.
1. Select the destination table:
    1. To create a new table, select **Create a new table** and enter a table name. The table will have the suffix *_KQL_CL* added to the name.
    1. To append to an existing table, select **Add to an exiting table** and select the table name form the drop-down list
1. Select **Next**
    :::image type="content" source="media/kql-jobs/enter-job-details.png" alt-text="A screenshot showing the new job details page." lightbox="media/kql-jobs/enter-job-details.png":::

1. Review or write your query in the Review the query panel. Check that the time picker is set to the required time range for the job.
1. Select **Next**

    :::image type="content" source="media/kql-jobs/review-query.png" alt-text="A screenshot showing the review query panel." lightbox="media/kql-jobs/review-query.png":::
 
In the **Schedule the query job** panel, select whether you want to run the job immediately or on a schedule. If you select **One time**, the job runs as soon as the job definition is complete. If you select **Schedule**, you can specify a date and time for the job to run, or run the job on a recurring schedule.

1. Select **One time** or *Schedule**
1. If you selected **Schedule**, enter the following details:
    1. **Run every**: The frequency at which the job will run. You can choose to run the job daily, weekly, or monthly.
    1. **Start running**: Enter the date and time when the job will start running.
    1. Select the **Set end date** checkbox to specify an end date for the job. If you don't select the end date checkbox, the job will run according to the run frequency until you disable or delete it.
    1. Select the end date and time for the job. 

1. Select **Next** to review the job details.

    :::image type="content" source="media/kql-jobs/schedule-query-job.png" alt-text="A screenshot showing the schedule job panel." lightbox="media/kql-jobs/schedule-job.png":::

1. Review the job details and select **Schedule** to create the job. If the job is an on-demand run job, You can run it using the **Run now** button after it's published. If the job is scheduled, it's added to the list of jobs in the **Jobs** page of the data Data lake exploration and runs according to the start data and time.
    :::image type="content" source="media/kql-jobs/review-job-details.png" alt-text="A screenshot showing the review job details panel." lightbox="media/kql-jobs/review-job-details.png":::



## Related content

- [Microsoft Sentinel data lake overview (Preview)](overview.md)
- [KQL queries in the Microsoft Sentinel data lake](kql-queries.md)
- [Manage jobs in the Microsoft Sentinel data lake](manage-jobs.md)
- [Jupyter notebooks and the Microsoft Sentinel data lake (Preview)](spark-notebooks.md)
