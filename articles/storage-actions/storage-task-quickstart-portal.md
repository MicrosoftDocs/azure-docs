---
title: 'Quickstart: Create, assign, and run a storage task'
titleSuffix: Azure Storage Tasks
description: Learn how to create your first storage task. You'll also assign that task to a storage account, queue the task to run, and then view the results of the run.
services: storage
author: normesta
ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: quickstart
ms.date: 05/16/2023
ms.author: normesta
---

# Quickstart: Create, assign, and run a storage task

In this quickstart, you learn how to use the [Azure portal](https://portal.azure.com/) to create a storage task and assign it to an Azure Storage account. Then, you'll review the results of the run. 

> [!IMPORTANT]
> Azure Storage Tasks is currently in PREVIEW and is available these [regions](overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure subscription. See [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure storage account. See [create a storage account](../storage/common/storage-account-create.md).

- A blob container that has a metadata key named `Classification` which is set to the string "Confidential". 

  Make sure to enable version-level immutability support on that container. See [Enable version-level immutability support on a container](../storage/blobs/immutable-policy-configure-version-scope.md#enable-version-level-immutability-support-on-a-container).

- One or more Microsoft Word documents stored to the blob container.

## Create a task

1. In the Azure portal, search for _Storage Tasks_.

2. Under **Services**, select **Storage Tasks**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the search result of the string storage tasks.](./media/storage-task-create/storage-task-search.png)

3. On the **Storage tasks** page, select **Create**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the storage task create button.](./media/storage-task-create/storage-task-create-button.png)

4. In the **Basics** page, under **Project details**, make sure that the correct subscription is selected. Then, create a new resource group by selecting the **Create new** link. Name that group _mystoragetaskresourcegroup_.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Project details section of the Basics tab.](./media/storage-task-quickstart-portal/project-details-section.png)

5. Under **Instance details**, enter *mystoragetask* for the **Storage task name**, and select any region that is supported by the preview of this service.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Instance details section of the Basics tab.](./media/storage-task-quickstart-portal/instance-details-section.png)

6. Select **Next** to open the **Conditions** page.

## Add clauses to a condition

You can specify the conditions of a storage task by making selections in **If** section of the **Visual Builder** tab. Every storage task has at least one condition with one clause in that condition.

1. In the **Select a property** drop-down list of the **If** section, select **Container metadata value**.

2. In the **Enter a metadata name** box, enter _Classification_, and in the **Enter a metadata value** box, enter _Confidential_.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the If condition section of the Visual Builder.](./media/storage-task-quickstart-portal/if-condition.png)

   This condition allows operations only on blobs that exist in containers which are marked as confidential.

3. Select **Add new clause**, and then in the **Select a property** drop-down list, select **Blob Name**.

4. For the **Operator** of that condition, select **Ends with**, and in the **Enter a string** box, enter _.docx_.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the clause that filters for blob name.](./media/storage-task-quickstart-portal/if-condition-blob-name.png)

   This condition allows operations only on Word documents.

## Add operations

You can specify the operations that a storage task performs by making selections in **Then** section of the **Visual Builder** tab. Every Storage task has at least one operation to perform when a blob or container meets the specified condition.

1. In the **Select an operation** drop-down list of the **Then** section, select **Set blob immutability policy**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Then operation which sets the immutabality policy.](./media/storage-task-quickstart-portal/then-operation-immutability-policy.png)

   This operation applies a legal hold to any container that is marked as confidential and which contains one or more Microsoft Word documents.

2. Select **Add new operation**, and then in the **Select a operation** drop-down list, select **Set blob tags**.

3. In the **Enter a tag name** box, Enter _ImmutabilityUpdatedBy_, and in the **Enter a tag value** box, enter _StorageTaskQuickstart_. 

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Then operation which sets a blob index tag.](./media/storage-task-quickstart-portal/then-operation-set-blob-tags.png)

   This operation adds a blob index tag to each Word document in that container.

4. Select **Next** to open the **Assignments** page.

## Add an assignment

A storage task _assignment_ specifies a storage account. After you enable the storage task, the conditions and operations of your task will be applied to that storage account. The assignment also contains configuration properties which help you target specific blobs, or specify when and how often the task runs. You can add an assignment for each account you want to target.

1. Select **Add assignment**.

   The **Add assignment** pane appears.

2. In the **Select scope** section, select your subscription and storage account and name the assignment _mystoragetaskassignment_.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Select scope section of the assignment pane.](./media/storage-task-quickstart-portal/assignment-pane-select-scope.png)

3. In the **Filter objects** section, make sure that the **Blob prefix** option is selected. Then, in the **Blob prefixes** box, enter the prefix of the container that you are using to complete this quickstart followed by the `/` character. For example, if your test container is named `mycontainer`, then enter `mycontainer/`.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Filter objects section of the Add assignment pane.](./media/storage-task-quickstart-portal/assignment-pane-filter-prefix.png)

   Filters help you narrow the scope of execution. If your want the task to evaluate all of the containers and blobs in an account, then you can select the **Do not filter** option instead.

4. In the **Trigger details** section, select **Single run (only once)** and then select the container where you'd like to store the execution reports.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Trigger details section of the Add assignment pane.](./media/storage-task-quickstart-portal/assignment-pane-trigger-details.png)

5. Select **Add**.

6. In the **Tags** tab, select **Next**.

7. In the **Review + Create** tab, select **Review + create**.

   When the task is deployed, the **Your deployment is complete** page appears.

8. Select **Go to resource** to open the **Overview** page of the storage task.

## Enable the task assignment

Storage task assignments are disabled by default. Enable assignments from the **Assignments** page.

1. Select **Assignments**, select the **mystoragetaskassignment** assignment, and then selet **Enable**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Assignments option and the storage task assignment link.](./media/storage-task-quickstart-portal/open-task-assignment.png)

   The task assignment is queued to run.

2. Periodically select **Refresh** to view an updated status.

   Until the task runs and then completes, the string **In progress** appears beneath the **Last run status** column. When the task completes, the string **Completed** appears in that column.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the completed status appearing next to the task assignment.](./media/storage-task-quickstart-portal/completed-status.png)

## View results of the task run

After the task completes running, you can view the results of the run.

1. With the **Assignments** page still open, select **View task runs**.

   The **Execution tasks** pane appears, and in that pane, a line item which describes the report appears.

2. Select the **View report** link to download a report.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Execution tasks pane.](./media/storage-task-quickstart-portal/run-report.png)

   The report appears as a comma-separated list of the container, the blob, and the operation performed along with a status.  You can also view these comma-separated reports in the container that you specified when you configured the assignment.

## Next steps

[Create a storage task](storage-task-create.md)