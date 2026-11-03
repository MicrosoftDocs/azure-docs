---
title: 'Quickstart: Create, assign, and run a storage task'
titleSuffix: Azure Storage Actions
description: Learn how to create your first storage task. You'll also assign that task to a storage account, queue the task to run, and then view the results of the run.
services: storage
author: normesta
ms.service: azure-storage-actions
ms.custom: build-2023-metadata-update
ms.topic: quickstart
ms.date: 10/30/2026
ms.author: normesta
---

# Quickstart: Create, assign, and run a storage task

In this quickstart, you learn how to use the [Azure portal](https://portal.azure.com/) to create a storage task and assign it to an Azure Storage account. Then, you'll review the results of the run. The storage task applies a time-based immutability policy any Microsoft Word documents that exist in the storage account.

## Prerequisites

- An Azure subscription. See [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An Azure storage account. See [create a storage account](../../storage/common/storage-account-create.md). As you create the account, make sure to enable version-level immutability support and that you don't enable the hierarchical namespace feature.
  
   During the public, you can target only storage accounts that are in the same region as the storage tasks.

- The [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role is assigned to your user identity in the context of the storage account or resource group.

- A custom role assigned to your user identity in the context of the resource group that contains the RBAC actions necessary to assign a task to a storage account. See [Permissions required to assign a task](storage-task-authorization-roles-assign.md#permission-to-manage-storage-task-assignments).

- A blob container with one or more Microsoft Word documents stored in that container.

## Create a task

1. In the Azure portal, search for _Storage Actions_.

2. Under **Services**, select **Storage tasks - Azure Storage Actions**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the search result of the string storage tasks.](../media/storage-tasks/storage-task-create/storage-task-search.png)

3. On the **Azure Storage Actions | Storage Tasks** page, select **Create**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the storage task create button.](../media/storage-tasks/storage-task-create/storage-task-create-button.png)

4. On **Basics**, under **Project details**, select the subscription and resource group that contain your storage account.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Project details section of the Basics tab.](../media/storage-tasks/storage-task-quickstart-portal/project-details-section.png)

5. Under **Instance details**, enter *mystoragetask* for the **Storage task name**, and select any region that the service supports.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Instance details section of the Basics tab.](../media/storage-tasks/storage-task-quickstart-portal/instance-details-section.png)

6. Select **Next** to open the **Conditions** page.

## Add clauses to a condition

Specify the conditions of a storage task by making selections in the **If** section of the **Visual Builder** tab. Every storage task has at least one condition with one clause in that condition.

1. In the **Select a property** list of the **If** section, select **Blob name**.

2. For the **Operator** of that condition, select **Ends with**, and in the **Enter a string** box, enter `.docx`.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the clause that filters for blob name.](../media/storage-tasks/storage-task-quickstart-portal/if-condition-blob-name.png)

   This condition allows operations only on Word documents.

## Add operations

Specify the operations that a storage task performs by making selections in the **Then** section of the **Visual Builder** tab. Every storage task has at least one operation to perform when a blob or container meets the specified condition.

1. In the **Select an operation** drop-down list of the **Then** section, select **Set blob immutability policy**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Then operation which sets the immutability policy.](../media/storage-tasks/storage-task-quickstart-portal/then-operation-immutability-policy.png)

   This operation applies a time-based immutability policy to Microsoft Word documents.

2. Select **Add new operation**, and then in the **Select a operation** drop-down list, select **Set blob tags**.

3. In the **Enter a tag name** box, enter _ImmutabilityUpdatedBy_, and in the **Enter a tag value** box, enter _StorageTaskQuickstart_. 

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Then operation which sets a blob index tag.](../media/storage-tasks/storage-task-quickstart-portal/then-operation-set-blob-tags.png)

   This operation adds a blob index tag to each Word document in that container.

4. Select **Next** to open the **Assignments** page.

## Add an assignment

A storage task _assignment_ specifies a storage account on which the task runs. It includes execution configuration settings that help you target specific blobs, and specify when and how often the task runs. Add task assignments for each storage account where you want the task to run.

1. Select **Add assignment**.

   The **Add assignment** pane appears.

2. In the **Select scope** section, select your subscription and storage account. Name the assignment _mystoragetaskassignment_.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Select scope section of the assignment pane.](../media/storage-tasks/storage-task-quickstart-portal/assignment-pane-select-scope.png)

3. In the **Role assignment** section, in the **Role** drop-down list, select the **Storage Blob Data Owner** to assign that role to the system-assigned managed identity of the storage task.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Role assignment section of the assignment pane.](../media/storage-tasks/storage-task-assignment-create/assignment-role.png)

4. In the **Filter objects** section, select the **Blob prefix** option. In the **Include blob prefixes** box, enter the prefix of the container you're using to complete this quickstart followed by the `/` character. For example, if your test container is named `mycontainer`, enter `mycontainer/`.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Filter objects section of the Add assignment pane.](../media/storage-tasks/storage-task-quickstart-portal/assignment-pane-filter-prefix.png)

   Filters help you narrow the scope of execution. If you want the task to evaluate all of the containers and blobs in an account, select the **Do not filter** option instead.

5. In the **Trigger details** section, select **Single run (only once)** and then select the container where you'd like to store the execution reports.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Trigger details section of the Add assignment pane.](../media/storage-tasks/storage-task-quickstart-portal/assignment-pane-trigger-details.png)

6. Select **Add**.

7. In the **Tags** tab, select **Next**.

8. In the **Review + Create** tab, select **Review + create**.

   When the task is deployed, the **Your deployment is complete** page appears.

9. Select **Go to resource** to open the **Overview** page of the storage task.

## Enable the task assignment

Storage task assignments are disabled by default. Enable assignments from the **Assignments** page.

1. Select **Assignments**, select the **mystoragetaskassignment** assignment, and then select **Enable**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Assignments option and the storage task assignment link.](../media/storage-tasks/storage-task-quickstart-portal/open-task-assignment.png)

   The task assignment is queued to run.

2. Periodically select **Refresh** to view an updated status.

   Until the task runs and then completes, the string **In progress** appears beneath the **Last run status** column. When the task completes, the string **Completed** appears in that column.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the completed status appearing next to the task assignment.](../media/storage-tasks/storage-task-quickstart-portal/completed-status.png)

## View results of the task run

After the task finishes running, you can view the results.

1. With the **Assignments** page still open, select **View task runs**.

   This step opens the **Execution tasks** pane that displays the finished run and its execution report.

2. Select the **View report** link to download a report.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the Execution tasks pane.](../media/storage-tasks/storage-task-quickstart-portal/run-report.png)

   The execution report uses the CSV format and captures each object processed, including the blob container, blob name, the operation performed, and the operation result. You can also view these reports in the container that you specified when you configured the assignment.

## Next steps

[Create a storage task](storage-task-create.md)
