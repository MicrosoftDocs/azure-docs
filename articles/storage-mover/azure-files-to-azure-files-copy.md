---
title: Get started with Azure Files-to-Azure Files data copy in Azure Storage Mover (preview)
description: The Azure Files-to-Azure Files data copy feature in Azure Storage Mover allows you to securely copy data from an SMB Azure file share to another SMB Azure file share in any storage account in a global Azure region.
author: jeevanbalanmanoj
ms.author: jeevanm
ms.service: azure-storage-mover
ms.topic: quickstart
ms.date: 10/07/2026
ms.custom: references_regions
---

# Get started with Azure Files-to-Azure Files data copy in Azure Storage Mover (preview)

The Azure Files-to-Azure Files data copy feature in Azure Storage Mover allows you to securely copy large datasets between SMB Azure file shares across different Azure storage accounts, subscriptions, and regions.

This article guides you through the complete process of configuring Storage Mover to copy your data between two Azure file shares. The process consists of creating a storage mover resource, configuring endpoints, and creating and running a data copy job.

> [!NOTE]
> Access to the preview is enabled per subscription. Complete the preview sign-up form: [Sign up for Preview: Files to Files Replication using Storage Mover](https://forms.cloud.microsoft/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR8CNg9dCXCtNsi4tmyLcYApUOENIOThaQlpMRzlVTk9JVURNNEVUWDVGSC4u&origin=lprLink&route=shorturl).
>
> The team enables the preview for your subscriptions and contacts you when the feature is available in your regions. You can create Azure Files-to-Azure Files data copy jobs only after the preview is enabled for your subscription.

> [!IMPORTANT]
> This feature is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Use cases

Storage Mover copies data between Azure file shares in a single, scheduled, or recurring job. Common scenarios include:

- **Cross-region disaster recovery to a region of your choice.** Maintain a secondary copy of a file share in any Azure region, not only the Azure paired region. This feature is useful for premium (SSD) file shares, which don't support geo-redundant storage. Schedule recurring incremental copies, keep the target share read-only between runs, and use the target as the recovery point if the primary region becomes unavailable. The target share stays readable, so you can also use it for disaster recovery drills or validation without affecting the primary workload.
- **Region and datacenter transitions.** Move file share data to another Azure region, for example to consolidate regions, meet data-residency requirements, or place data closer to the compute that uses it.
- **File share consolidation.** Merge the contents of several file shares into a single share by running one copy job per source share against the same target share, using the **Merge content into target** copy mode.
- **Copy to a new share.** Create a copy of a share in another storage account or subscription, for example to rename a share or to reorganize storage accounts.

> [!NOTE]
> Storage Mover is a copy and sync solution. Scheduled jobs copy changes at the interval you choose, but Storage Mover doesn't provide a recovery point objective (RPO) guarantee. In a disaster recovery scenario, the recovery point is the completion time of the last successful job run, not the schedule frequency.

## Prerequisites

Before you begin, ensure that you have:

- A [Storage Mover resource](storage-mover-create.md) deployed in your Azure subscription.
- A source SMB Azure file share and a target SMB Azure file share. Use SSD-provisioned v2 shares for both the source and target. The shares can be in different storage accounts, subscriptions, and regions, but they must be in the same Microsoft Entra tenant.
- Access to the preview for your subscription. See the note at the beginning of this article.

> [!NOTE]
> During the preview, Azure Files-to-Azure Files data copy is supported in the Azure portal only. Azure PowerShell and Azure CLI aren't supported for this scenario.

> [!NOTE]
> Storage Mover is available in these six Azure regions:
>
> - (Europe) North Europe
> - (Europe) Sweden Central
> - (US) East US
> - (US) East US 2
> - (US) West Central US
> - (US) West US 3
>
> For best performance, deploy the Storage Mover resource in the supported region closest to the target file share.

## Limits

The Azure Files-to-Azure Files data copy feature in Azure Storage Mover has the following limits:

- Only SMB Azure Files file shares are supported as source and target. NFS Azure Files file shares aren't supported.
- For the preview, use SSD provisioned v2 shares for both the source and target. Before using any other combination for production workloads, test it thoroughly in your environment.
- Source and target file shares must be in the same Entra tenant. They can be in different subscriptions, storage accounts, and regions.
- Data copy is scoped to the entire file share. You can't select a subdirectory of the source or target share.
- You can run up to 10 concurrent jobs per subscription in each Storage Mover region. If you need to run more than 10, [create a support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).
- Each job run creates a [share snapshot](/azure/storage/files/storage-snapshots-files) on the source file share and copies data from that snapshot, so that the copy is consistent while the source remains in use. The snapshot is deleted when the job run reaches a terminal state. If the snapshot can't be deleted, the job run completes with warnings and you must delete the snapshot manually.
- If a scheduled job run is due to start while the previous run is still in progress, the new run fails with an error indicating that the previous run is still in progress. If this condition happens regularly, choose a longer interval between runs.
- For recurring schedules, the end date must be within one year of the date on which the schedule was created. Set the start date up to 90 days from the creation date.
- Azure Files-to-Azure Files data copy doesn't allow you to select the same source and target endpoint in the same job.
- Don't modify the target file share between job runs. Storage Mover doesn't perform conflict resolution, and changes made on the target between runs can be overwritten or lost. Treat the target share as read-only while a copy schedule is active.
- Files aren't truly moved but copied. The source file share continues to exist in its current location along with the target location set.

## Configure source and target endpoints

In the context of the Azure Storage Mover service, an *endpoint* is a resource that contains the path to either a source or target location and other relevant information. Storage Mover *job definitions* use endpoints to define the source and target locations for copy operations.

Follow the steps in this section to configure an Azure Files source and target endpoints. To learn more about Storage Mover endpoints, refer to the [Manage Azure Storage Mover endpoints](endpoint-manage.md) article.

### Configure an Azure file share source endpoint

1. Go to your Storage Mover instance in Azure.
1. From the **Resource management** group in the left navigation, select **Storage endpoints**.
1. Select the **Source endpoints** tab, and then select **Create endpoint** to open the **Create source endpoint** pane.
1. In the **Create source endpoint** pane:

    - Select Azure to Azure as the **Migration type**.
    - Select Azure File share (Preview) as the **Source type**.
    - Select your subscription and storage account from the respective **Subscription** and **Storage account** drop-down lists. The **Media tier** of the storage account is displayed.
    - Under **Protocol**, **SMB** is selected. NFS isn't available in the preview.
    - Choose the file share you want to copy from the **File share** drop-down list.
    - Optionally, provide a description for the endpoint in the **Source description** field.

1. Verify that your selections are correct and select **Create** to create the endpoint as shown in the following image.

    :::image type="content" source="./media/files-to-files-copy/endpoint-source-create.png" alt-text="Screenshot of the Create source endpoint pane with Azure to Azure migration type, Azure File share (Preview) source type, storage account, SMB protocol, and file share selected.":::

### Configure an Azure Files target endpoint

1. From the **Resource management** group in the left navigation, select **Storage endpoints**.
1. Select the **Target endpoints** tab, and then select **Create endpoint** to open the **Create target endpoint** pane.
1. In the **Create target endpoint** pane:

    - Select your subscription and storage account from the respective **Subscription** and **Storage account** drop-down lists. The **Target type** is set to **File share** and the **Media tier** is displayed.
    - Under **Protocol**, select **SMB**. NFS isn't available in the preview.
    - Choose the file share to which you want to copy from the **File share** drop-down list.
    - Optionally, provide a description for the endpoint in the **Description** field.

1. Verify that your selections are correct and select **Create** to create the endpoint as shown in the following image.

    :::image type="content" source="./media/files-to-files-copy/endpoint-target-create.png" alt-text="Screenshot of the Create target endpoint pane with the subscription, storage account, File share target type, SMB protocol, and file share selected.":::

### Assign RBAC roles to source and target endpoints

When you start the job, Storage Mover automatically assigns the Storage File Data Privileged Contributor role on the source and target file shares, and the Storage Account Contributor role on the source and target storage accounts, to its managed identity. The **Start job** pane shows the result of each assignment. No other steps are required.

## Create a data copy project and job definition

After you define source and target endpoints for your data copy, the next steps are to create a Storage Mover project and job definition. By using a *project*, you can organize large data copy operations into smaller, more manageable units that make sense for your use case. A *job definition* describes resources and copy options for a specific set of copy operations undertaken by the Storage Mover service. These resources include, for example, the source and target endpoints, the copy mode, and the job schedule. To learn more, see [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md).

Follow the steps in this section to create a project and run a data copy job.

### Create a project

1. From the **Plan + run migrations** group in the left navigation, select **Projects**. On the **Get started** tab, select Azure to Azure as the migration type and Azure File share (Preview) as the source type. The guided steps **Source**, **Target**, **Project**, and **Migration job** appear.

    :::image type="content" source="./media/files-to-files-copy/get-started.png" alt-text="Screenshot of the Get started tab showing the guided Source, Target, Project, and Migration job steps for an Azure file share data copy.":::

1. In the **Source** step, select **Select existing source endpoint**, choose the Azure file share source endpoint created in the previous section, and select **Select**.

    :::image type="content" source="./media/files-to-files-copy/select-source.png" alt-text="Screenshot of the Select an existing source endpoint pane with an Azure file share endpoint selected.":::

1. In the **Target** step, select **Select existing target endpoint**, choose the Azure file share target endpoint created in the previous section, and select **Select**.

    :::image type="content" source="./media/files-to-files-copy/select-target.png" alt-text="Screenshot of the Select an existing target endpoint pane with an Azure file share endpoint selected.":::

1. In the **Project** step, select **Create project**, and enter values for the following fields:

    - **Project name**: A meaningful name for the project. You can't change the project name later.
    - **Project description**: A useful description for the project.

1. Select **Create** to create the project.

    :::image type="content" source="./media/files-to-files-copy/project-create.png" alt-text="Screenshot of the Create a project pane with the Project name and Project description fields.":::

### Create a job definition

1. In the **Migration job** step, select **Create Migration job**. The **Create a job** page opens to the **Basics** tab. The portal prepopulates the **Migration type** (Azure to Azure) and **Source type** (Azure File share (Preview)). Provide values for the following fields:

    - **Name**: A meaningful name for the data copy job.
    - **Description**: An optional description for the job.

    :::image type="content" source="./media/files-to-files-copy/job-basics.png" alt-text="Screenshot of the Create a job page Basics tab with Azure to Azure migration type and Azure File share (Preview) source type.":::

1. Under **Endpoints**, verify that the **Source endpoint** and **Target endpoint** you selected in the previous section are displayed. To change either one, select **Change or create source endpoint** or **Change or create target endpoint**. Select **Next** to continue to the **Schedule** tab.

    :::image type="content" source="./media/files-to-files-copy/job-endpoints.png" alt-text="Screenshot of the Create a job page Basics tab showing the selected source and target endpoints.":::

1. In the **Schedule** tab, select a **Migration frequency** option:

    - **No schedule**: The job runs only when you start it manually.
    - **One-time schedule**: The job runs once at a specific time. Select a **Start date (UTC)** and **Start time (UTC)**.
    - **Recurring schedule**: The job runs repeatedly. Select a **Start date (UTC)** and **Start time (UTC)**, a **Frequency** of **Hourly**, **Daily**, **Weekly**, or **Monthly**, and an end date in the **Until (UTC)** field. For **Hourly**, select a **Repeat every** interval of 1, 2, 3, 4, 6, 8, or 12 hours; the default is 12 hours. The **Until** date must be within one year of the date the schedule is created.

    A scheduled job doesn't run until you enable the schedule after the job is created. For more information, see [Job scheduling in Azure Storage Mover](job-scheduling.md). Select **Next** to continue to the **Settings** tab.

    :::image type="content" source="./media/files-to-files-copy/job-schedule.png" alt-text="Screenshot of the Create a job page Schedule tab with Recurring schedule selected, Hourly frequency, and Repeat every 12 hours.":::

1. In the **Settings** tab, select **Merge content into target** or **Mirror source to target** from the **Copy mode** drop-down list.

    - **Merge content into target**: Files are kept in the target even if they don't exist in the source. Files with matching names and paths are updated to match the source.
    - **Mirror source to target**: Files in the target are deleted if they don't exist in the source. Files and folders in the target are updated to match the source.

    The copy mode applies to file data and to metadata such as permissions (ACLs) and timestamps. Verify that the **Migration outcomes** results are appropriate for your use case, then select **Next**.

    :::image type="content" source="./media/files-to-files-copy/job-settings.png" alt-text="Screenshot of the Create a job page Settings tab showing the Copy mode drop-down list and the Migration outcomes.":::

1. After confirming that your settings are correct within the **Review** tab, select **Create** to deploy the job. You're redirected to the **Projects** tab after the job's deployment begins. After completion, the job appears within the associated project.

    :::image type="content" source="./media/files-to-files-copy/job-review.png" alt-text="Screenshot of the Create a job page Review tab with all settings displayed.":::

## Run a data copy job

1. On the **Projects** tab, select the project, and then select the job. The job shows the status **Never ran** until its first run.

    :::image type="content" source="./media/files-to-files-copy/job-never-ran.png" alt-text="Screenshot of the Projects page showing the job listed under its project with Never ran status.":::

1. Select **Start job** to open the **Start job** pane. The pane shows the RBAC roles assigned to the source and target file shares and storage accounts. Select **Start**. The job status changes to **Queued** and then to **Running**; it might take a few minutes for the job run to start.

    :::image type="content" source="./media/files-to-files-copy/job-start.png" alt-text="Screenshot of the job details page with the Start job button and the Properties tab.":::

    :::image type="content" source="./media/files-to-files-copy/job-start-pane.png" alt-text="Screenshot of the Start job pane showing the RBAC roles assigned to the source and target file shares and storage accounts.":::

1. If you configured a schedule, select **Schedule** > **Enable** to activate it. Subsequent job runs start automatically according to the schedule. To pause the schedule, select **Schedule** > **Disable**.

    :::image type="content" source="./media/files-to-files-copy/job-schedule-enable.png" alt-text="Screenshot of the job details page with the Schedule menu expanded showing Enable and Disable.":::

## Monitor data copy progress

As you use Storage Mover to copy your data to the target file share, monitor the copy operations for potential problems. The job's **Monitoring** tab displays data about the operations during your data copy. This data helps you track the progress of each job run by providing the current status and key information such as the number of files processed, the data volume, and the transfer throughput.

When configured, Azure Storage Mover can also provide copy logs and job run logs. These logs are especially useful because they allow you to trace the result of job runs and of individual files. Follow the steps in this section to monitor the progress of a Storage Mover data copy job. To learn more about Storage Mover copy and job logs, see [How to enable Azure Storage Mover copy and job logs](log-monitoring.md).

1. On the **Projects** tab, select the job. The status shows the result of the latest run.
1. Select the **Monitoring** tab to view the files and folders discovered and processed, the data volume, the processed breakdown (**Copied**, **Failed**, **Unsupported**, **Skipped**, **No copy needed**), and the transfer throughput over time.

    :::image type="content" source="./media/files-to-files-copy/job-monitoring.png" alt-text="Screenshot of the job Monitoring tab showing a successful run with all files copied.":::

1. Select the **Run history** tab to view each run with its status, start time, and duration. Select a run to view its properties and monitoring details.
1. Select **Logs** to check for any errors or warnings.
1. After the job run finishes, verify the data in the target Azure Files.

> [!IMPORTANT]
> A job run that finishes with copy errors isn't a complete, consistent copy of the source. Review the logs, resolve the errors, and run the job again before you rely on the target share. A job run that completes with warnings because the source share snapshot couldn't be deleted has copied the data successfully; delete the snapshot from the source share manually.

## Post-copy validation

Post-copy data validation ensures that your data is accurate and that the transfer from the source Azure file share is complete. This validation process verifies data integrity and consistency by comparing copied data to the same data from the source. You can also choose to conduct user acceptance tests to further confirm functionality. Validation helps identify and resolve discrepancies, ensuring the copied data is reliable and meets your business requirements.

Follow the steps in this section to complete manual validation.

1. Compare the source and target file shares to ensure you transferred all files and directories, including permissions (ACLs) and timestamps. For example, browse the target share in the Azure portal and confirm that the files and directories from the source are present.

    :::image type="content" source="./media/files-to-files-copy/target-share-browse.png" alt-text="Screenshot of the target Azure file share Browse page listing the copied files.":::

1. Use a recurring schedule if you need to keep the target Azure file share in sync with the source over time.
1. Delete the source Azure file share after the data copy is fully completed and verified if you don't need it anymore.

## Troubleshooting and support

Troubleshooting your data copy might involve a range of steps, from basic diagnostics to more advanced error handling. If you're encountering problems, start troubleshooting by taking the following steps.

- Job run failed? Check the logs for error messages.
- Permission problems? Verify that the Storage Mover managed identity has the Storage File Data Privileged Contributor role on the source and target file shares and the Storage Account Contributor role on the storage accounts. The **Start job** pane shows whether each role assignment succeeded.
- Scheduled run failed because the previous run was still in progress? Increase the interval between runs.
- Job run completed with warnings? Check whether the share snapshot created on the source for that run still exists, and delete it manually.

## Related content

The following articles can help you become more familiar with the Storage Mover service.

- [What is Azure Storage Mover?](service-overview.md)
- [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Create a Storage Mover resource](storage-mover-create.md)
- [Manage Azure Storage Mover endpoints](endpoint-manage.md)
- [Manage Azure Storage Mover projects](project-manage.md)
- [Job scheduling in Azure Storage Mover](job-scheduling.md)
- [How to enable Azure Storage Mover copy and job logs](log-monitoring.md)
- [Get started with blob-to-blob migration in Azure Storage Mover](azure-to-azure-migration.md)
