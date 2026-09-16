---
# Required metadata
# For more information, see https://learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata
# For valid values of ms.service, ms.prod, and ms.topic, see https://learn.microsoft.com/en-us/help/platform/metadata-taxonomies

title: Create and Use a Storage Task Mock Run
description: Create a mock run for a storage task assignment to evaluate blob conditions and expected results safely before execution.
author: sshankMSFT
ms.author: shashankar # Microsoft alias
ms.service: azure-storage-actions
ms.topic: feature-guide
ms.date: 05/07/2026
---

# Create a mock run

This article shows you how to create a mock run for a storage task assignment. A mock run simulates task execution by scanning and evaluating blobs against your conditions without performing any operations. For a conceptual overview of mock runs, see [Mock runs for storage task assignments](storage-task-mock-run.md).

## Prerequisites

Before you create a mock run, ensure you have the following items:

- A storage task with at least one condition and one operation defined. See [Create a storage task](storage-task-quickstart-portal.md).
- The managed identity associated with the storage task has the appropriate role, such as **Storage Blob Data Reader** or **Storage Blob Data Owner**, on the target storage account.
- If the target storage account has network restrictions, ensure that the **Allow trusted Microsoft services** option is enabled.

## Create a mock run in the Azure portal

### Create a mock run from the storage task menu

1. Go to your storage task in the Azure portal.
1. Under **Storage task management**, select **Assignments**.
1. Select **\+ Add assignment**. The **Add assignment** pane appears.
1. In the **Select scope** section:
   1. Select the **Subscription** containing the target storage account.
   1. Enter a **Storage task assignment name** (2–62 characters, letters and numbers only).
   1. Select the target **Storage account**.
1. In the **Role assignment** section, select the role to assign to the managed identity. Use a role with at least Blob Data Reader permissions to ensure the mock run can scan blobs successfully.
1. In the **Filter objects** section, configure prefix filters to narrow the scope of blobs to evaluate, or select **Do not filter** to evaluate the entire account.
1. In the **Trigger details** section:
   1. Select **Mock run** as the run type.
   1. Set the **Start from** date and time.
   1. Optionally configure a **Max duration** for the run.
1. In the **Report** section, select the **Report export container** where the mock run report will be stored.

   > :::image type="content" source="../media/storage-tasks/storage-task-mock-run/add-assignment-mock-run.png" alt-text="Screenshot of Add assignment pane with Mock run selected, including role assignment, object filters, trigger details, and report export container.":::

1. Select **Add** to create the assignment.
1. After the assignment appears in the **Assignments** page, select the check box next to it and select **Enable** to schedule the mock run.

### Create a mock run from the storage account menu

1. Go to the storage account in the Azure portal.
1. Under **Data management**, select **Storage tasks**.
1. Select the **Task assignment** tab, and then select **\+ Create assignment** > **\+ Add assignment**.
1. Follow steps 4–10 in the preceding section, but instead of selecting a storage account, select the **Storage task** you want to assign.

> [!TIP]  
> Use the condition preview feature in the **Add assignment** pane to spot-check your conditions on a small sample of blobs before creating the mock run.

### Monitor a mock run

After you enable a mock run, monitor its progress the same way you monitor a real task run. For information about mock run states and what to expect, see [Mock run lifecycle and states](storage-task-mock-run.md#mock-run-lifecycle-and-states).

#### View mock run reports

When a mock run finishes, you can find a detailed report in the report export container. For information about report format, columns, and the summary JSON, see [Mock run reports](storage-task-mock-run.md#mock-run-reports).

To download the report:

1. Go to the assignment in the Azure portal.
1. Select **Go to mock run report** (or go directly to the report export container).
1. Download the CSV file.

### Transition to a real run

After reviewing the mock run report, you can transition the assignment to a real run:

1. Go to the assignment in the Azure portal.
1. Edit the assignment and change the trigger type from **Mock run** to **Run once** or **Recurring**.
1. Save the updated assignment.

> [!IMPORTANT]  
> You can't restart a completed mock run. To run another mock simulation, create a new assignment or duplicate the existing one.

### See also

- [Mock runs for storage task assignments](storage-task-mock-run.md)
- [Create and manage a storage task assignment](storage-task-assignment-create.md)
- [Analyze storage task runs](storage-task-runs.md)
