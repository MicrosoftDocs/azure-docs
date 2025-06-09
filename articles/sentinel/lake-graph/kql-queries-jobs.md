---  
title: Data lake exploration (Preview).
titleSuffix: Microsoft Security  
description: Use the Defender portal's Data lake exploration KQL queries to query and interact with the Microsoft Sentinel data lake. Create, edit, and run KQL queries to explore your data lake resources. Create and schedule jobs to promote data to the analytics tier.
author: EdB-MSFT  
ms.service: sentinel  
ms.topic: conceptual
ms.custom: sentinel-lake-graph
ms.date: 05/29/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  
 
#  Data lake exploration (Preview).
 
## Overview  

Microsoft Sentinel data lake is a next-generation, cloud-native platform that extends Microsoft Sentinel with highly scalable, cost-effective long-term storage, advanced analytics, and AI-driven security operations. Data lake exploration in the Defender portal, provides a powerful interface for querying and interacting with your data lake.  
  

Data lake exploration in the Microsoft Defender portal provides a unified interface for managing and analyzing your data lake, enabling you to run KQL (Kusto Query Language) queries, and create and manage jobs.

Data lake exploration is found in the left navigation panel of the Defender portal, under **Microsoft Sentinel**


## KQL Queries

The **KQL queries** page enables you to write and run KQL queries against your data lake resources. Use the query editor to explore and analyze historical data, investigate incidents, and gather forensic evidence. You can also create and schedule jobs to promote selected data from the lake tier to the analytics tier for advanced analytics and machine learning. Leveraging lake-based KQL queries helps security teams detect patterns, establish baselines, and identify unusual activities, supporting comprehensive investigations and effective threat response.

The KQL queries provide several key features. The KQL Query Editor allows you to edit and run KQL queries with IntelliSense and autocomplete. You can create jobs to promote data from the lake to the Analytics tier. Jobs can be one-time or scheduled. The jobs page provides an interface to manage jobs, enabling, disabling, editing, or deleting them.

## Permissions
To access data lake KQL queries, you must have one of the following roles:
+ Global reader 
+ Security reader
+ Security operator 
+ Security administrator
+ Global administrator

For more information on roles and permissions, see [Microsoft Sentinel lake roles and permissions](./roles-permissions.md).


## Writing queries

Access the KQL query editor in the Data lake exploration by selecting **KQL queries** in the left navigation panel under **Microsoft Sentinel**.   

:::image type="content" source="media/kql-queries-jobs/query-editor.png" alt-text="A screenshot showing the advanced hunting page in the Defender portal." lightbox="media/kql-queries-jobs/query-editor.png":::

Writing queries in the lake workbench is similar to writing queries in the advanced hunting experience. You can use the same KQL syntax and functions. The query editor provides a powerful interface for writing and running KQL queries, with features such as IntelliSense and autocomplete to help you write your queries efficiently. For a detailed overview of KQL syntax and functions, see [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/).

Queries are run against a single workspace. Choose your workspace in the upper right corner of the query editor using the **Selected workspace** dropdown. The workspace you select determines the data available for querying. The *default* workspace contains data from Microsoft Entra, M365, and Microsoft Resource Graph. For more information these data assets see [Data assets in the data lake](data-assets.md). 

> [!NOTE] 
> The selected workspace applies to all query tabs in the query editor.


Select **New query** to create a new query tab. Your last query in each tab is saved. Switch between tabs to work on multiple queries simultaneously.   

### Time range selection
Use the time picker above the query editor to select the time range for your query. Using the **Custom time range** option, you can specify a custom time range. Time ranges can be up to 30 days in duration.  You can't specify a time range in query syntax. 

### Schema browser

The schema browser provides a list of available tables and their columns in the selected workspace. Use the schema browser to explore the data available in your data lake and discover tables and columns.

### Result window
The result window displays the results of your query. You can view the results in a table format, and you can also export the results to a CSV file. Export the results of your query to a CSV file using the  **Export** button in the upper left corner of the result window. Toggle the visibility of empty columns using the **Show empty columns** button.


### Query limitations

When writing queries in the Lake workbench, be aware of the following limitations:

The following limitations apply to queries:
+ Query results are limited to 30,000 rows or 64 MB of data. 
+ Queries time out after 10 minutes. 


## Jobs

A job is a one-time or scheduled task that runs a KQL query against the data in the lake tier to promote the results to the analytics tier. 
Promoting data to the analytics tier has the following benefits:

+ Combine current and historical data in the analytics tier to run advanced analytics and machine learning models on your data.

+ Reduce query costs by running queries in the Analytics tier
+ Combine data from multiple workspaces by promoting data from different workspaces to a single workspace in the analytics tier. 
+ Combine EntraID, M365, and Microsoft Resource Graph data in the analytics tier to run advanced analytics.

Storage in the analytics tier incurs higher billing rates than in the lake tier. To reduce costs, only promote data that you need to analyze further. Use the KQL in your query to project only the columns you need, and filter the data to reduce the amount of data promoted to the analytics tier.  

To create jobs to run on a schedule or manually run jobs, follow the steps below:

1. Select the **Create job** button in the upper right corner of the query editor. 

    :::image type="content" source="media/kql-queries-jobs/create-a-job.png" alt-text="A screenshot showing the create job button." lightbox="media/kql-queries-jobs/create-a-job.png":::

1. Enter the following details for the job, then select **Next**:

    1. **Job name**: A unique name for the job.            
    1. **Job Description**: An optional description of the job, providing context and purpose for the job. 
    1. **Select workspace**: The workspace where the job runs.
    1. **Table selection**: The table in the analytics tier where the data will be promoted. If you're promoting data to a custom table and the table doesn't exist, you must create the table first. See [Create a custom table](/azure/azure-monitor/logs/create-custom-table-auxiliary) for more information on creating custom tables. 

    :::image type="content" source="media/kql-queries-jobs/enter-job-details.png" alt-text="A screenshot showing the new job details page." lightbox="media/kql-queries-jobs/enter-job-details.png":::

1. Review your query in the Review the query panel. Check that the time picker is set to the required time range for the job.
1. Select **Next**

    :::image type="content" source="media/kql-queries-jobs/review-query.png" alt-text="A screenshot showing the review query panel." lightbox="media/kql-queries-jobs/review-query.png":::
 
In the **Schedule the query job** panel, select whether you want to run the job immediately or on a schedule. If you select **One time**, the job runs as soon as the job definition is complete. If you select **Schedule**, you can specify a date and time for the job to run, or run the job on a recurring schedule.

1. Select **One time** or *Schedule**
1. If you selected **Schedule**, enter the following details:
    1. **Run every**: The frequency at which the job will run. You can choose to run the job daily, weekly, or monthly.
    1. **Start running**: Enter the date and time when the job will start running.
    1. Select the **Set end date** checkbox to specify an end date for the job. If you do not select the end date checkbox, the job will run according to the run frequency until you disable or delete it.
    1. Select the end date and time for the job. 

1. Select **Next** to review the job details.

    :::image type="content" source="media/kql-queries-jobs/schedule-query-job.png" alt-text="A screenshot showing the schedule job panel." lightbox="media/kql-queries-jobs/schedule-job.png":::

1. Review the job details and select **Schedule** to create the job. If the job is a one-time job, it will run immediately. If the job is scheduled, it's added to the list of jobs in the **Jobs** page of the data Data lake exploration and runs according to the start data and time.
    :::image type="content" source="media/kql-queries-jobs/review-job-details.png" alt-text="A screenshot showing the review job details panel." lightbox="media/kql-queries-jobs/review-job-details.png":::


## Manage jobs

The **Jobs** page in the Data lake exploration allows you to manage your KQL jobs. You can view, edit, disable, or delete jobs.
You can also enable or disable Jobs created using Notebooks. For more information on using Notebooks, see [Use notebooks to analyze data in the data lake](/azure/data-explorer/kusto/management/notebooks/).

1. Select **Jobs** in the left navigation panel of the Data lake exploration to open the Jobs page. The Jobs page displays a list of all your jobs, including the job name, status, and job type. 
  
1. You can edit, disable, or delete a job from the main jobs list by selecting the check box next to the job and selecting appropriate button at the top of the list.

1. To see job details, double-click on the job. The job detail pain opens, showing the job name, description, workspace, repeat frequency, destination table, Start time, and KQL query. You can also see the job status, which indicates whether the job is running, completed, or failed.

    :::image type="content" source="media/kql-queries-jobs/manage-job-details.png" alt-text="A screenshot showing the job details page." lightbox="media/kql-queries-jobs/manage-job-details.png":::

    The following options are available from the job details panel:
      1. **Edit**: Edit the job details, including the job name, description, workspace, table, query, and schedule.
      1. **View history**: View the job history, including the run times, and statuses of the job. 
      1. **Disable**: Disable the job, preventing it from running until you enable it again.
      1. **Delete**: Delete the job, removing it from the list of jobs. This action is permanent and can't be undone.




<!-- 
<<< confirm that this is or is not available for Public preview>>>
### Advanced hunting

Access the lake explorer from the **Advanced hunting** page in the Microsoft Defender portal. The lake explorer is integrated into the advanced hunting experience, allowing you to query and interact with your data lake resources directly from the advanced hunting interface. Use Advanced hunting to run KQL queries against the Analytics tier. The Analytics tier has a limited history, generally 30 days, so once you have identified an incident, you can use the lake explorer to expand the scope of your analysis. The lake tier can contain 2 years of history.
<<< when I hit the long term storage bnutton, does it copy my query to the lake explorer?>>>

To access the lake explorer from Advanced hunting, select the **Query long-term storage** button in the upper right corner of the Advanced hunting page. The lake explorer opens with your current query, allowing you to run it against the data lake.

:::image type="content" source="media/kql-queries-jobs/query-editor.png" alt-text="A screenshot showing the KQL query editor for the Data lake exploration.":::

>
