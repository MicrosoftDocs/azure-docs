---  
title: Create and manage Jupyter notebook jobs (preview)
titleSuffix: Microsoft Security  
description: This article describes how to explore and interact with lake data using Spark notebooks in Visual Studio Code.
author: EdB-MSFT  
ms.author: edbaynash  
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph
ms.topic: how-to  
ms.date: 07/09/2025

# Customer intent: As a security engineer or data scientist, I want to explore and analyze security data in the Microsoft Sentinel data lake using Jupyter notebooks, so that I can gain insights and build advanced analytics solutions.
---

# Create and manage Jupyter notebook jobs (preview)
 
You can create scheduled jobs to run at specific times or intervals using the Microsoft Sentinel extension for Visual Studio Code. Jobs allow you to automate data processing tasks to summarize, transform, or analyze data in the Microsoft Sentinel data lake. Jobs are also used to process data and write results to custom tables in the lake tier or analytics tier.

## Permissions

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. To create and schedule jobs, read tables across all workspaces, write to the analytics and lake tiers, you must have one of the supported Microsoft Entra ID roles. For more information on roles and permissions, see [Roles and permissions in Microsoft Sentinel](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview).

To create new custom tables in the analytics tier, the data lake managed identity must be assigned the **Log Analytics Contributor** role in the Log Analytics workspace.

To assign the role, follow the steps below:

1. In the Azure portal, navigate to the Log Analytics workspace that you want to assign the role to.
1. Select **Access control (IAM)** in the left navigation pane.
1. Select **Add role assignment**.
1. In the **Role** table, select **Log Analytics Contributor**, then select **Next**
1. Select **Managed identity**, then select **Select members**.
1. Your data lake managed identity is a system assigned managed identity named `msg-resources-<guid>`. Select the managed identity, then select **Select**. 
1. Select **Review and assign**.

For more information on assigning roles to managed identities, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Create and schedule a job

To create schedule a job, you must save your notebook as a file.

1. Select **File** > **Save As** and save the notebook with a `.ipynb` extension.
1. Open the folder where you saved the notebook file using **File** > **Open folder**.

1. In the **Explorer** pane, right-click the notebook file and select **Microsoft Sentinel**, then select **Create schedule Job**.

    :::image type="content" source="./media/notebook-jobs/create-job.png" lightbox="./media/notebook-jobs/create-job.png" alt-text="A screenshot showing how to create a new job in Visual Studio Code."  :::

1. On the **Job configuration** page, in the **Job details** section enter a **name** and **description** for the job.
1. To run a job manually without a schedule, select **Off** under **Scheduled Run** in the **Schedule Configuration** section.    
     
    1. Select **Publish job** to save the job configuration and publish the job.
    
1. To specify a schedule for the job, select **On** under **Scheduled Run** in the **Schedule Configuration** section.  
    1. Select a **Repeat** frequency for the job. You can choose from **By the minute**, **By the hour**, or **By the day**.

    1. Select a **Start and end time** for the job to run.
    1. Select a **Time zone** for the start and end times.
    1. Select **Publish job** to save the job configuration and publish the job.

    :::image type="content" source="./media/notebook-jobs/job-configuration.png" lightbox="./media/notebook-jobs/job-configuration.png" alt-text="A screenshot showing the job configuration page."  :::

1. To view your jobs, select the Microsoft Sentinel shield icon in the left toolbar. Jobs are displayed on the **Jobs** panel.

1. Select the job then select **Run now** to run a job immediately. If your job is a scheduled job, it runs at the specified time and frequency. 

    :::image type="content" source="./media/notebook-jobs/job-details.png" lightbox="./media/notebook-jobs/job-details.png" alt-text="A screenshot showing the job details page."  :::

1. View the job status in the **Runs** tab.

    :::image type="content" source="./media/notebook-jobs/job-runs.png" lightbox="./media/notebook-jobs/job-runs.png" alt-text="A screenshot showing the job runs page."  :::


## Edit a published job

Publishing a job creates a job definition that includes the notebook file, the job configuration, and the schedule. The job definition is uploaded from your VS Code editor and stored in the Microsoft Sentinel data lake. Once published, the job is no longer connected to the notebook file on your local file system. If you want to edit the code in the notebook job, you must download the job definition, edit the notebook file, and then republish the job.

To edit a published job follow the steps below:

### Download a published job to your local file system

1. In the **Jobs** section, select the job you want to edit.
1. Select the **Download** icon to download the job definition to your local file system.
1. Save the workbook to your local file system.
    :::image type="content" source="./media/notebook-jobs/download-job.png" lightbox="./media/notebook-jobs/download-job.png" alt-text="A screenshot showing the download job icon in VS Code."  :::
1. Edit the downloaded `ipynb` workbook file to make your changes.
1. Test the notebook file in your local environment to ensure it runs correctly.

### Edit the configuration and republish

1. Right-click the yaml file for your notebook and select **Open With...** 
    :::image type="content" source="./media/notebook-jobs/right-click-yaml.png" lightbox="./media/notebook-jobs/right-click-yaml.png" alt-text="A screenshot showing how to open the job configuration editor in VS Code."  :::    
1. Select  **Scheduled job configuration editor** to open the job configuration editor.
    :::image type="content" source="./media/notebook-jobs/select-scheduled-jobs-configuration-editor.png" lightbox="./media/notebook-jobs/select-scheduled-jobs-configuration-editor.png" alt-text="A screenshot showing the editor selection dropdown.":::

1. In the job configuration editor, you can edit the job name, description, and schedule. Changing the job name creates a new job definition when you publish the job.
1. Select **Publish job** to upload the updated notebook file and job configuration.



## View jobs in the Microsoft Defender portal

In addition to viewing jobs in VS Code, you can also view your notebook jobs in the Defender portal. To view your jobs in the Defender portal, Select **Microsoft Sentinel** > **Data lake exploration** > **Jobs** .

The page shows a list of jobs and their types. Select a notebook job to view its details. You can enable and disable the job's schedule but you can't edit a notebook job in the Defender portal.

:::image type="content" source="media/notebook-jobs/view-jobs-in-defender-portal.png" lightbox="media/notebook-jobs/view-jobs-in-defender-portal.png" alt-text="A screenshot showing the jobs page in the Defender portal.":::


## Service parameters and limits and troubleshooting

For a list of service limits for the Microsoft Sentinel data lake, see [Microsoft Sentinel data lake service limits](notebooks.md#service-parameters-and-limits-for-vs-code-notebooks).  
  

For information on troubleshooting, see [Run notebooks on the Microsoft Sentinel data lake (preview)](notebooks.md#service-parameters-and-limits-for-vs-code-notebooks).

## Related content

- [Sample notebooks for Microsoft Sentinel data lake (preview)](./notebook-examples.md)
- [Microsoft Sentinel Provider class reference (preview)](./sentinel-provider-class-reference.md)
- [Microsoft Sentinel data lake overview (preview)](./sentinel-lake-overview.md)
- [Roles and permissions in Microsoft Sentinel](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview).
