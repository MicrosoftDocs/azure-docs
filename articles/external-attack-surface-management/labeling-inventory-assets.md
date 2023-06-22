---
title: Modifying inventory assets 
titleSuffix: Modifying inventory assets
description: This article outlines how to update assets with labels (custom text values of a user's choice) for improved categorization and operationalization of their inventory data. It also dives into 
ms.author: dandennis
author: dandennis
ms.service: defender-easm
ms.date: 3/1/2022
ms.topic: how-to
---

# Modifying inventory assets 

This article outlines how to modify inventory assets.  Users can change the state of an asset or apply labels to help better contextualize and operationalize inventory data. This article describes how to modify a single asset or multiple assets, and track any updates with the Task Manager.

## Labeling assets

Labels help you organize your attack surface and apply business context in a highly customizable way. You can apply any text label to a subset of assets to group assets and better operationalize your inventory. Customers commonly categorize assets that:  

- Have recently come under your organization’s ownership through a merger or acquisition.
- Require compliance monitoring.
- Are owned by a specific business unit in their organization. 
- Are impacted by a specific vulnerability that requires mitigation. 
- Relate to a particular brand owned by the organization.
- Were added to your inventory within a specific time range.

Labels are free-form text fields, so you can create a label for any use case that applies to your organization. 

[![Screenshot of inventory list view with filters column visible.](media/labels-1a.png)](media/labels-1a.png#lightbox)



## Applying labels and modifying asset states

Users can apply labels or modify asset states from both the inventory list and asset details pages.  You can make changes to a single asset from the asset details page, or multiple assets from the inventory list page. The following sections describe how to apply changes from the two inventory views depending on your use case.  

### Inventory list page  

You should modify assets from the inventory list page if you want to update numerous assets at once. This process also allows you to refine your asset list based on filter parameters, helping you identify assets that should be categorized with the desired label or state change. To modify assets from this page:  

1. Select the **Inventory** page from the left-hand navigation pane of your Defender EASM resource.  

2. Apply filters to produce your intended results. In this example, we are looking for domains expiring within 30 days that require renewal. The applied label helps you more quickly access any expiring domains, simplifying the remediation process. This is a simple use case; users can apply as many filters as needed to obtain the specific results needed. For more information on filters, see the [Inventory filters overview](inventory-filters.md) article. 

![Screenshot of inventory list view with 'add filter' dropdown opened, displaying the query editor.](media/labels-2.png)

3. Once your inventory list is filtered, select the dropdown by checkbox next to the "Asset" table header. This dropdown gives you the option to select all results that match your query, the results on that specific page (up to 25), or "none" which unselects all assets. You can also choose to select only specific results on the page by selecting the individual checkmarks next to each asset. 

![Screenshot of inventory list view with bulk selection dropdown opened.](media/labels-14.png) 
 
4. Select **Modify assets**. 

5. This action opens a new “Modify Assets” pane on the right-hand side of your screen. From this screen, you can quickly change the state of the selected asset(s). For this example, we will create a new label.  Select **Create a new label**. 

6. Determine the label name and display text values. The label name cannot be changed after you initially create the label, but the display text can be edited at a later time. The label name is used to query for the label in the product interface or via API, so edits are disabled to ensure these queries work properly. To edit a label name, you need to delete the original label and create a new one.  
 
Select a color for your new label, then select **Add**. This action navigates you back to the “Modify Assets” screen. 

![Screenshot of "Add label" pane that displays the configuration fields.](media/labels-4.png)


7. Apply your new label to the assets. Click inside the “Add labels” text box to view a full list of available labels, or type inside the box to search by keyword. Once you have selected the label(s) you wish to apply, select **Update**. 

![Screenshot of "Modify Asset" pane with newly created label applied.](media/labels-5.png)

8. Allow a few moments for the labels to be applied. You will immediately see a notification that confirms the update is in progress. Once complete, you'll see a "completed" notification and the page automatically refreshes, displaying your asset list with the labels visible. A banner at the top of the screen confirms that your labels have been applied.  

[![Screenshot of inventory list view with the selected assets now displaying the new label.](media/labels-6.png)](media/labels-6.png#lightbox)


### Asset details page 

Users can also modify a single asset from the asset details page. This is ideal for situations when assets need to be thoroughly reviewed before a label or state change is applied.  
 

1. Select the **Inventory** page from the left-hand navigation pane of your Defender EASM resource. 
 
2. Select the specific asset to which you want to modify to open the asset details page. 
 
3. From this page, select **Modify asset**. 

![Screenshot of asset details page with "Modify asset" button higlighted.](media/labels-7a.png)

4. Follow steps 5-7 as listed above in the “Inventory list page” section.  

5. Once complete, the asset details page refreshes, displaying the newly applied label or state change and a banner that indicates the asset was successfully updated.  


## Modify, remove or delete labels

Users may remove a label from an asset by accessing the same “Modify asset” pane from either the inventory list or asset details view.  From the inventory list view, you can select multiple assets at once and then add or remove the desired label in one action.  

To modify the label itself or delete a label from the system, access the main Labels management page.  
 

1. Select the **Labels (Preview)** page under the **Manage** section in the left-hand navigation pane of your Defender EASM resource.

[![Screenshot of Labels (Preview) page that enables label management.](media/labels-8a.png)](media/labels-8a.png#lightbox)

This page displays all the labels within your Defender EASM inventory. Please note that labels on this page may exist in the system but not be actively applied to any assets. You can also add new labels from this page.  

2. To edit a label, select the pencil icon in the **Actions** column of the label you wish to edit.  This action will open the right-hand pane that allows you to modify the name or color of a label. Once done, select **Update**.  

3. To remove a label, select the trash can icon from the **Actions** column of the label you wish to delete. A box appears that asks you to confirm the removal of this label; select **Remove Label** to confirm.  

![Screenshot of "Confirm Remove" option from Labels management page.](media/labels-9a.png)

 
 
The Labels page will automatically refresh and the label will be removed from the list, as well as removed from any assets that had the label applied. A banner appears to confirm the removal.  


## Task manager and notifications

Once a task is submitted, you will immediately see a notification pop-up that confirms that the update is in progress.  From any page in Azure, simply click on the notification (bell) icon to view additional information about recent tasks. 

![Screenshot of "Task submitted" notification immediately after submitting a task.](media/labels-12.png) ![Screenshot of opened Notifications panel displaying recent task statuses.](media/labels-13.png)


The Defender EASM system can take seconds to update a handful of assets or minutes to update thousands. The Task Manager enables you to check on the status of any modification tasks in progress. This section outlines how to access the Task Manager and use it to better understand the completion of submitted updates. 

1. From your Defender EASM resource, select **Task Manager** on the left-hand navigation menu. 

![Screenshot of "Task Manager" page with appropriate section in navigation pane highlighted.](media/labels-11a.png)

2. This page displays all your recent tasks and their status. Tasks will be listed as "Completed", "Failed" or "In Progress" with a completion percentage and progress bar also displayed. To see more details about a specific task, simply select the task name. A right-hand pane will open that provides additional information. 

3. Select **Refresh** to see the latest status of all items in the Task Manager. 



## Filtering for labels 

Once you have labeled assets in your inventory, you can use inventory filters to retrieve a list of all assets with a specific label applied.  


1. Select the **Inventory** page from the left-hand navigation pane of your Defender EASM resource.  

2. Select **Add filter**.  
 
3. Select **Labels** from the Common filter section. Select an operator, then choose a label from the drop-down list of options. The example below is searching for a single label, but you can use the “In” operator to search for multiple labels. For more information on filters, see the [Inventory filters overview](inventory-filters.md)

![Screenshot of the query editor used to apply filters, displaying the "Labels" filter with possible label values in a dropdown.](media/labels-10.png)

4. Select **Apply**. The inventory list page will reload, displaying all assets that match your criteria.  



## Next steps  

- [Inventory filters overview](inventory-filters.md)
- [Understanding inventory assets](understanding-inventory-assets.md) 
- [Understanding asset details](understanding-asset-details.md)

