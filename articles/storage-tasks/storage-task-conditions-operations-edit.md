---
title: Define Storage Task conditions & operations
description: Description of conditions how to goes here.
author: normesta
ms.service: storage-tasks
ms.topic: how-to
ms.author: normesta
ms.date: 05/10/2023
---

# Define Storage Task Conditions and operations

Description goes here.

To learn more about Storage Task conditions, see [Storage Task conditions and operations](storage-task-conditions-operations.md)

## Open the conditions editor

Navigate to the storage task in the Azure portal and then under **Storage task management**, select **Conditions**.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Conditions button and the Conditions editor.](./media/storage-task-conditions-operations-edit/storage-task-condition-editor.png)

The **Visual builder** tab of the **Conditions** pane appears. You can add and remove conditions and operations by using controls that appear in this tab.

## Define conditions

A condition defines the relationship between a property and a value. To execute an operation defined in the storage task, the terms of that relationship must be met by each object.

### Add and remove conditions

To add a condition, select **Add new clause**, and to remove a condition, select the delete icon(:::image type="icon" source="./media/storage-task-conditions-operations-edit/conditions-delete-icon.png":::) that appears next to it.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Add new clause button and three conditions that were added to the list of conditions.](./media/storage-task-conditions-operations-edit/storage-task-add-conditions.png)

### Specify the terms of a condition

To define a condition, choose a property, specify a value for that property, and then choose an operator that relates them together.

1. In the **Blob property** drop-down list of the condition, choose a blob property. The following example selects the **Blob name** property. 

   > [!div class="mx-imgBorder"]
   > ![Screenshot of the property drop-down list of a condition.](./media/storage-task-conditions-operations-edit/storage-task-condition-choose-property.png)

   For a complete list of supported properties, see [Supported blob properties](storage-task-conditions-reference.md#supported-blob-properties).

2. In **Property value** box, enter a value to compare with the property, and in the **Operator** drop-down list, choose the operator that you want the storage task to use when comparing the property with the value.

   The following example specifies a value of `.log` along with the `Ends with` operator. This condition allows the operation defined in this storage task to execute only on blobs that have a `.log` file extension.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of an example condition.](./media/storage-task-conditions-operations-edit/storage-task-blob-name-condition.png)

   For a complete list of supported operations, see [Supported Operators](storage-task-conditions-reference.md#supported-operators).

### Change the order of conditions

Using the move up and move down clause.
Explain the impact on condition processing.
Show Screenshot of the move up button and screenshot of results on conditions.
Explain some constraints

### Group and ungroup conditions

Explain the impact of grouping and ungrouping. Why would you do this and what would happen.
Show use of grouping button and impact of doing that
Show screenshot of grouping
Explain some constraints.

## Define operations

Define an operation. Maybe explain the anatomy of an operation.

### Add and remove operations

Use the add new operation button
Use the delete operation.

### Edit an operation

Choosing operations and parameters.
Show screenshot typical operations.

### Change the order of operations

Using up and down buttons.
Explain the impact of reordering.
Show screenshot of reordering

### Grouping and ungrouping operations

Explain the impact of grouping and ungrouping. Why would you do this and what would happen.
Show use of grouping button and impact of doing that
Show screenshot of grouping
Explain some constraints.

### Deleting sections

What does this involve

## Use the Code view

What to put here?

## Preview results

You can see how the task will impact an account by previewing that result. Then, you can make tweaks and changes before deploying the task. Previewing results does not incur charges.

Open preview by using the Azure portal.
Column sorting and various other preview settings.
Receiving and then addressing validation errors.

## Fix validation errors

- What sorts of errors and validation issues can appear and how to address them.

## See also

- [Storage Tasks Overview](overview.md)
