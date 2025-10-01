---  
title: Create and manage Jupyter notebook jobs
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

# Create and manage Jupyter notebook jobs
 
You can create scheduled jobs to run at specific times or intervals using the Microsoft Sentinel extension for Visual Studio Code. Jobs allow you to automate data processing tasks to summarize, transform, or analyze data in the Microsoft Sentinel data lake. Jobs are also used to process data and write results to custom tables in the lake tier or analytics tier.

## Permissions

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. To create and schedule jobs, read tables across all workspaces, write to the analytics and lake tiers, you must have one of the supported Microsoft Entra ID roles. For more information on roles and permissions, see [Roles and permissions in Microsoft Sentinel](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake).

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

You can create a job in one of three ways:

1. In the notebook editor, select **Create schedule Job** from the toolbar.
1. In the **Explorer** pane, right-click the notebook file and select **Microsoft Sentinel**, then select **Create schedule Job**.

    :::image type="content" source="./media/notebook-jobs/create-job.png" lightbox="./media/notebook-jobs/create-job.png" alt-text="A screenshot showing how to create a new job in Visual Studio Code."  :::
1. From the list of jobs, select the **+** icon to create a new job.

    :::image type="content" source="./media/notebook-jobs/create-job-from-toolbar.png" lightbox="./media/notebook-jobs/create-job-from-toolbar.png" alt-text="A screenshot showing how to create a new job from the jobs list in Visual Studio Code."  :::
1. Select **Use existing notebook** to select an existing notebook file, or select **Create new notebook** to create a new notebook file for the job.

    :::image type="content" source="./media/notebook-jobs/new-or-existing-workbook.png" lightbox="./media/notebook-jobs/new-or-existing-workbook.png" alt-text="A screenshot showing how to select an existing notebook for the job."  :::


1. On the **Job configuration** page, in the **Job details** section enter a **name** and **description** for the job.
1. Select the spark pool size to run the job according to your jobs compute needs.
1. To run a job manually without a schedule, select **On demand** in the  **Schedule** section, then select **Submit** to save the job configuration and publish the job.
    
1. To specify a schedule for the job, select **Scheduled** in the **Schedule** section.  
    1. Select a **Repeat frequency** for the job. You can choose from **By the minute**, **Hourly**, **Weekly**, **Daily**, or **Monthly**.
    1. Additional options are displayed to configure the schedule, depending on the frequency you select. For example day of the week, time of day, or day of the month.

    1. Select a **Start on** time for the schedule to start running.
    1. Select an **End on** time for the schedule to stop running. If you don't want to set an end time for the schedule, select **Set job to run indefinitely**.
    Dates and times are in the user's timezone.

    1. Select **Submit** to save the job configuration and publish the job.

    :::image type="content" source="./media/notebook-jobs/job-configuration.png" lightbox="./media/notebook-jobs/job-configuration.png" alt-text="A screenshot showing the job configuration page."  :::

1. To view your jobs, select the Microsoft Sentinel shield icon in the left toolbar. Jobs are displayed on the **Jobs** panel.

1. Select a job to see the job details. 
1. You can run the job immediately by selecting **Run now**, disable and enable the job schedule, or delete the job.

    :::image type="content" source="./media/notebook-jobs/job-details.png" lightbox="./media/notebook-jobs/job-details.png" alt-text="A screenshot showing the job details page."  :::

1. View the job history in the **Run history** tab.

    :::image type="content" source="./media/notebook-jobs/run-history.png" lightbox="./media/notebook-jobs/run-history.png" alt-text="A screenshot showing the job runs page."  :::

1. Select an activity to see more details.
    :::image type="content" source="./media/notebook-jobs/run-details.png" lightbox="./media/notebook-jobs/run-details.png" alt-text="A screenshot showing the job run details page.":::

## Edit a submitted job

Submitting a job creates a job definition that includes the notebook file, the job configuration, and the schedule. The job definition is uploaded from your VS Code editor and stored in the Microsoft Sentinel data lake. Once submitted, the job is no longer connected to the notebook file on your local file system. If you want to edit the code in the notebook job, you must download the job definition, edit the notebook file, and then resubmit the job.

To edit a submitted job follow the steps below:

1. In the **Jobs** section, select the job you want to edit.
1. Select the **Download** cloud icon to download the job definition to your local file system. In the jobs details editor, you can see the job configuration. You can also select **Download latest notebook**.

    :::image type="content" source="./media/notebook-jobs/edit-download-job.png" lightbox="./media/notebook-jobs/edit-download-job.png" alt-text="A screenshot showing the edit and download job icon in VS Code."  :::

1. Edit the downloaded `ipynb` workbook file to make your changes.

1. Return to the **Job details** tab and select **Edit job**.

1. Edit the job name, description, cluster configuration, and schedule. Changing the job name creates a new job definition when you submit the job.
1. Select **Submit** to upload the updated notebook file and job configuration.

1. A confirmation is displayed when the job is successfully submitted.

    :::image type="content" source="./media/notebook-jobs/edit-job.png" lightbox="./media/notebook-jobs/edit-job.png" alt-text="A screenshot showing the edit jib page in VS Code.":::



## View jobs in the Microsoft Defender portal

In addition to viewing jobs in VS Code, you can also view your notebook jobs in the Defender portal. To view your jobs in the Defender portal, Select **Microsoft Sentinel** > **Data lake exploration** > **Jobs** .

The page shows a list of jobs and their types. Select a notebook job to view its details. You can enable and disable the job's schedule but you can't edit a notebook job in the Defender portal.

:::image type="content" source="media/notebook-jobs/view-jobs-in-defender-portal.png" lightbox="media/notebook-jobs/view-jobs-in-defender-portal.png" alt-text="A screenshot showing the jobs page in the Defender portal.":::

1. Select a job to view the job details.

:::image type="content" source="media/notebook-jobs/portal-job-details.png" lightbox="media/notebook-jobs/portal-job-details.png" alt-text="A screenshot showing the job details in the Defender portal.":::

1. Select **View history** to see the history of job runs.

:::image type="content" source="media/notebook-jobs/portal-job-history.png" lightbox="media/notebook-jobs/portal-job-history.png" alt-text="A screenshot showing the jobs history page in the Defender portal.":::



## Service parameters and limits and troubleshooting

For a list of service limits for the Microsoft Sentinel data lake, see [Microsoft Sentinel data lake service limits](notebooks.md#service-parameters-and-limits-for-vs-code-notebooks).  
  

For information on troubleshooting, see [Run notebooks on the Microsoft Sentinel data lake](notebooks.md#service-parameters-and-limits-for-vs-code-notebooks).

## Related content

- [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md)
- [Microsoft Sentinel Provider class reference](./sentinel-provider-class-reference.md)
- [Microsoft Sentinel data lake overview](./sentinel-lake-overview.md)
- [Roles and permissions in Microsoft Sentinel](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake).
