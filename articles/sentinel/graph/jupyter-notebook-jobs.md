---  
title: Create and manage Jupyter notebook jobs (Preview)
titleSuffix: Microsoft Security  
description: This article describes how to explore and interact with lake data using Spark notebooks in Visual Studio Code.
author: EdB-MSFT  
ms.topic: how-to  
ms.date: 06/04/2025
ms.author: edbayansh  

# Customer intent: As a security engineer or data scientist, I want to explore and analyze security data in the Microsoft Sentinel data lake using Jupyter notebooks, so that I can gain insights and build advanced analytics solutions.
---

# Create and manage Jupyter notebook jobs (Preview)
 
You can create schedule jobs to run at specific times or intervals using the Microsoft Sentinel extension for Visual Studio Code. Jobs allow you to automate data processing tasks to summarize, transform, or analyze data in the Microsoft Sentinel data lake. Jobs are also used to process data and write results to custom tables in the lake tier or analytics tier.  

## Permissions

To create and run jobs, and write to the data lake and analytics tiers, you will need the correct roles and permissions. 

[!INCLUDE [sentinel-data-lake-notebook write-permissions](../includes/sentinel-data-lake-notebook-write-permissions.md)]
[!INCLUDE [sentinel-data-lake-job-permissions](../includes/sentinel-data-lake-job-permissions.md)]


## Create and schedule a job

To create schedule a job, you must save your notebook as a file.

1. Select **File** > **Save As** and save the notebook with a `.ipynb` extension.
1. Open the folder where you saved the notebook file using **File** > **Open folder**.

1. In the **Explorer** pane, right-click the notebook file and select **Microsoft Sentinel**, then select **Create schedule Job**.

    :::image type="content" source="./media/spark-notebooks/create-job.png" lightbox="./media/spark-notebooks/create-job.png" alt-text="A screenshot showing how to create a new job in VS Code."  :::

1. On the **Job configuration** page, in the **Job details** section enter a **name** and **description** for the job.
1. To run a job manually without a schedule select **Off** under **Scheduled Run** in the **Schedule Configuration** section.    
     
    1. Select **Publish job** to save the job configuration and publish the job.
    
1. To sepeficy a schedule for the job, select **On** under **Scheduled Run** in the **Schedule Configuration** section.  
    1. Select a **Repeat** frequency for the job. You can choose from **By the minute**, **By the hour**, or **By the day**.

    1. Select a **Start and end time** for the job to run.
    1. Select a **Time zone** for the start and end times.
    1. Select **Publish job** to save the job configuration and publish the job.

    :::image type="content" source="./media/spark-notebooks/job-configuration.png" lightbox="./media/spark-notebooks/job-configuration.png" alt-text="A screenshot showing the job configuration page."  :::

1. Select the Microsoft Sentinel shield icon in the left toolbar to view the job in the **Jobs** section.

1. Select the job then select **Run now** to run a job immediately. If your job is a scheduled job, it runs at the specified time and frequency. 
1. View the job status in the **Runs** tab.

  :::image type="content" source="./media/spark-notebooks/job-runs.png" lightbox="./media/spark-notebooks/job-runs.png" alt-text="A screenshot showing the job runs page."  :::


## Editing a published job

Publishing a job creates a job definition that includes the notebook file, the job configuration, and the schedule. The job definition is uploaded from your VS Code editor and stored in the Microsoft Sentinel data lake. Once published, the job is no longer connected to the notebook file on your local file system. If you want to edit the code in the notebook job, you must download the job definition, edit the notebook file, and then republish the job.




## Limitations 
 
+ Spark session takes about 5-6 minutes to start. You can view the status of the session at the bottom of your VS Code Notebook.
+ Only [Azure Synapse libraries](https://github.com/microsoft/synapse-spark-runtime/blob/main/Synapse/spark3.4/Official-Spark3.4-Rel-2025-04-16.0-rc.1.md) and the Microsoft Sentinel Provider library for abstracted functions are supported for querying lake. Pip installs or custom libraries aren't supported.


| Feature | Limitation | value |
|---------|-------------|-------|
|Interactive queries| Spark session inactivity timeout| 20 minutes|
|Interactive queries| interactive query timeout | 2 hours |
|Interactive queries| Gateway web socket timeout | 2 hours |
|Interactive queries| Maximum rows displayed| 10,000 rows |
|Jobs  | Job timeout| X hours <<<<<<>>>>>> |
| Compute resources| vCores are allocated per customer account|  1000|
| Compute resources| Maximum vCores allocated to interactive sessions | 760 vCores |
| Compute resources| Maximum vCores allocated to jobs | 240 vCores|
| Compute resources| Max concurrent users in interactive sessions| 10 users|
| Compute resources| Max concurrent running jobs| 3 jobs. The fourth and subsequent jobs are queued.|





## Related content

- [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md)
- [Microsoft Sentinel Provider class reference](./sentinel-provider-class-reference.md)
- [Microsoft Sentinel data lake overview](./sentinel-lake-overview.md)