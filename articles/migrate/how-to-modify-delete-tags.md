---
title: Add, Edit, and Delete Tags in Azure Migrate
description: Tags in Azure Migrate help you organize workloads for migration planning. Discover how to add, edit, and manage tags to streamline your migration process.
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: how-to
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 04/28/2026
monikerRange:
# Customer intent: As an IT administrator managing migration resources, I want to tag workloads with relevant attributes, so that I can enhance resource organization and visibility during the migration process.
---

# Modify and delete Tags for Workloads in Azure Migrate

This article explains how to update or remove existing tags associated with workloads in Azure Migrate. As your migration planning evolves, you might need to refine tag values or clean up metadata that’s no longer required. Manage these changes safely while keeping your inventory accurate and up to date.

## Edit tags

You can update the value of an existing tag by using any of the methods. 

To edit tags, follow these steps:

1. In the Azure Migrate project, go to the **Inventory** pane.
1. Select the workloads whose tags you want to edit.
1. Select **Tags** and then select **Add and edit tags**.
    
    >[!NOTE]
    > You can edit only the tags that are common across the selected workloads.
1. Update the tag values as needed:
    1. Reserved tags: You can change reserved tag value such as updating `AzM_Environment` from Dev to Test or `AzM_MigrationIntent` from Retire to Migrate.
    1. Custom tags: You can update the value of a custom tag you've defined, for example, change CostCenter from CC100 to CC200.
    
    :::image type="content" source="./media/resource-tagging/cost-center.png" alt-text="Screenshot of Azure Migrate Manage tags page with CostCenter tag value set to CC100 and affected resources listed." lightbox="./media/resource-tagging/cost-center.png":::

## Edit tags by using CSV export and import

You can make changes to existing tags by exporting workload data to a CSV file, editing it offline, and importing the updated file back into Azure Migrate.

To edit tags, follow these steps:

1. In the Azure Migrate project, go to the **Inventory** pane, and export **All inventory** CSV file.
1. Open the CSV file and locate the workloads you want to update.
1. Update the tag values as required:
    1. **Reserved tags**:
        1. Update the **Environment** column, for example, from Dev to Test.
        1. Update the **Migration Intent** column, for example, from Retire to Migrate.
        
    :::image type="content" source="./media/resource-tagging/import-excel-data.png" alt-text="Screenshot of an Excel spreadsheet showing Azure Migrate inventory data with the Tags column containing JSON values for workloads." lightbox="./media/resource-tagging/import-excel-data.png":::
       
    2. **Custom tags**: In the Tags column, update the value inside the JSON. For example, change `{"Dept":"Finance","CostCenter":"CC100"}` to `{"Dept":"Finance","CostCenter":"CC200"}`.
    

     :::image type="content" source="./media/resource-tagging/cost-center-data.png" alt-text="Screenshot of Excel displaying Azure Migrate data, highlighting the Tags column where JSON values like CostCenter and Department are shown." lightbox="./media/resource-tagging/cost-center-data.png":::
   
    3. Save the file and import it back via Tags > Import Tags.

## Delete tags

You can remove tags from workloads by using any of the methods. 

### Delete tags in the Azure portal

You can delete tags in the Azure portal when they're no longer needed for organizing or tracking your Azure Migrate resources.

To delete tags, follow these steps:

1. In the Azure Migrate project, go to the **Inventory** pane.
1. Select the workloads from which you want to remove tags.
1. Select **Tags** and then select **Add and edit tags**.
1. Delete the tag you want to remove:
    1. Remove `AzM_Environment` to delete the environment classification.
    1. Remove `AzM_MigrationIntent` or any custom tag that you no longer need.
    
    :::image type="content" source="./media/resource-tagging/delete-tag-button.png" alt-text="Screenshot of the Manage tags shows tag name, value fields, and the Delete option for removing tags." lightbox="./media/resource-tagging/delete-tag-button.png":::

### Delete tags via CSV export and import

You can delete tags in bulk by exporting workload data to a CSV file and reimporting it after removing the required entries.

To delete tags, follow these steps:

1. In the Azure Migrate project, go to the **Inventory** pane and export the **All inventory** CSV file.
1. Open the exported CSV file and locate the workloads that you want to update.
1. To remove reserved tags:
    1. For the target rows, clear the value in the **Environment** column or the **Migration Intent** column, or 
    1. Replace the existing value with a hyphen (-).
1. To remove custom tags:
    1. In the **Tags** column, set the value of the tag to empty inside the JSON. For example, change: `{"Dept":"Finance","CostCenter":"CC100"}` TO `{"Dept":"Finance","CostCenter":""}`. Removing the value deletes that tag on import.
    
    :::image type="content" source="./media/resource-tagging/custom-tags.png" alt-text="Screenshot shows removing the value deletes that tag on import." lightbox="./media/resource-tagging/custom-tags.png":::

    2. After updating the file, save it and import it again by selecting **Tags** > **Import tags**.

    > [!IMPORTANT]
    > - If a workload doesn’t have an Environment value, Azure Migrate treats it as Prod by default.
    > - If a workload doesn’t have a Migration Intent value, Azure Migrate treats it as Migrate by default.

## View tags

This section shows how to view existing tags for workloads in Azure Migrate so you can review their current state.

To view tags, follow these steps:

1. In the Azure Migrate project, go to the **Inventory** pane.
1. Select a workload to open its details.
1. In the workload details view, review the assigned tags, including **Environment, Migration Intent**, and any custom tags.
1. After applying tags, select a workload in the **Inventory** pane and confirm that the updated tags appear in the workload details view.


### Filter inventory using tags

You can use tags to filter the Azure Migrate inventory and focus on specific workloads that match your criteria.

To filter inventory using tags, follow these steps:

1. On the **Inventory** pane, select **Add filter** next to the search bar.
1. Select the tag key to filter by (for example, `AzM_Environment`, `AzM_MigrationIntent`, or a custom tag key).
1. Select one or more tag values to apply the filter.

You can use tag-based filters to scope **assessments, business cases**, and **reports** to a specific subset of your inventory.

## How Azure Migrate uses tags in downstream analysis

After you apply tags to workloads, Azure Migrate uses them across downstream features to scope assessments, build business cases, plan migration waves, and generate targeted reports.

| Downstream feature | How tags are used |
|---|---|
| **Assessments** | Filter workloads by Environment, Migration Intent, or custom tags to scope the assessment to a specific subset. Workloads set to Retain or Retire are excluded. |
| **Business case / ROI analysis** | Environment determines pricing model (standard vs Dev/Test discount). Migration Intent determines which workloads are included. Custom tags can be used to slice analysis by any organizational dimension. |
| **Wave planning** | Prod workloads are prioritized and sequenced first. Retain and Retire workloads are excluded. |
| **Reports** | Tags can be used to scope executive proposals to specific subsets of your inventory. |
| **Application grouping** | Custom tags can be used to identify and group workloads that belong to the same application. |

##  Next step

- [Build a business case](how-to-build-a-business-case.md).
