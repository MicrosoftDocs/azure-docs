---  
title: Manage jobs in the Microsoft Sentinel data lake.
titleSuffix: Microsoft Security  
description: Managing jobs in the Defender portal for Microsoft Sentinel data lake.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.custom: sentinel-lake-graph
ms.date: 05/29/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a security engineer or an administrator, I want to manage jobs in the Microsoft Sentinel data lake so that I can run KQL queries and notebooks against the data in the lake tier and promote the results to the analytics tier.

---  
 
#  Manage jobs in the Microsoft Sentinel data lake (Preview)
 
## Overview  

Jobs run KQL queries or notebooks against the data in the lake tier and promote the results to the analytics tier. Jobs can be run on demand or scheduled to run at a specific time or on a recurring basis.
Jobs can be created and in the **KQL queries** editor under **Data lake exploration**  in the Defender portal for Microsoft Sentinel. For more informatioon see [KQL jobs](kql-jobs.md).  You can also create jobs using the VS Code notebook editor. For more information on creating jobs in VS Code, see [Jupyter notebooks and the Microsoft Sentinel data lake (Preview)](spark-notebooks.md).


## Manage jobs in the Defender portal

To manage jobs in the Defender portal for Microsoft Sentinel data lake, follow these steps:

1. Select **Data lake exploration** in the left navigation panel of the Defender portal under **Microsoft Sentinel**.
 
1. Select **Jobs** in the left navigation panel of the Data lake exploration to open the Jobs page. The Jobs page displays a list of all your jobs, including the job name, status, and job type. 
  
1. You can edit, disable, or delete a job from the main jobs list by selecting the check box next to the job and selecting appropriate button at the top of the list.

1. To see job details, double-click on the job. The job detail pain opens, showing the job name, description, workspace, repeat frequency, destination table, Start time, and KQL query. You can also see the job status, which indicates whether the job is running, completed, or failed.

    :::image type="content" source="media/manage-jobs/manage-job-details.png" alt-text="A screenshot showing the job details page." lightbox="media/manage-jobs/manage-job-details.png":::

    The following options are available from the job details panel:
      1. **Edit**: Edit the job details, including the job name, description, workspace, table, query, and schedule.
      1. **View history**: View the job history, including the run times, and statuses of the job. 
      1. **Disable**: Disable the job, preventing it from running until you enable it again.
      1. **Delete**: Delete the job, removing it from the list of jobs. This action is permanent and can't be undone.



## Next steps

- [Overview of the Microsoft Sentinel data lake](sentinel-lake-overview.md)
- [Create jobs in the Microsoft Sentinel data lake using KQL](kql-jobs.md)
- [Data lake exploration - KQL queries (Preview).](kql-queries.md)
- [Microsoft Sentinel lake roles and permissions](roles-permissions.md)