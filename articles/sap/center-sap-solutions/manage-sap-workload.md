---
title: Manage an SAP workload (Preview) - Azure Workload Center for SAP
description: Manage SAP workloads in Azure Workload Center for SAP by adding, updating, and deleting components and resource mappings. Learn how in this guide.
ms.date: 11/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# Manage an SAP workload (Preview)

After you onboard an SAP system to Azure Workload Center for SAP, you can manage the workload components and resources associated with its workload virtual instance (WVI).

You can:

- Add a new workload component.

- Update an existing non-API-discovered component to add or remove mapped resources.

- Delete a workload component.

- Delete multiple workload components.

- Delete the WVI.

> [!IMPORTANT]
> You can't update the resource mappings of an existing component that you discovered by using API-based discovery.

You can add a new component to a WVI even if you originally onboarded the WVI by using API-based discovery.

## Add a workload component

You can add components such as Application Server, Database, Central Services, and Web Dispatcher to an existing WVI.

1.  In the Azure portal, go to **Azure Workload Center for SAP**.

2.  Open the WVI that you want to update.

3.  From the WVI menu, select **Workload components**.

4.  On the **Workload components** page, select **Add**.

:::image type="content" source="media/workload-management/workload-components-add-button.png" alt-text="Screenshot of Workload components page listing SAP components with Add button highlighted.":::

5.  Select the **Component type** that you want to add. Available component types include:

    - Application Server

    - Database

    - Central Services

    - Web Dispatcher

6.  Enter the component name.

7.  Select how you want to map Azure resources to the component:

    - **Azure Resource Graph query-based discovery**

    - **Manual resource mapping**

:::image type="content" source="media/workload-management/add-component-panel-azure.png" alt-text="Screenshot of Add Component panel with ARG discovery option selected for Application Server.":::

### Discover resources by using Azure Resource Graph

Use Azure Resource Graph query-based discovery when the resources associated with the component can be identified through Azure resource properties.

1.  Select Azure Resource Graph query-based discovery.

2.  Add the filters that define the resources associated with the component.

3.  Add more filters as needed to narrow the discovery criteria.

4.  Select **Refresh preview** to preview the resources that match your query.

5.  Review the returned resources and verify that they're the resources that you want to associate with the component.

6.  Add the discovered resources to the component.
> [!NOTE] 
> Define filters that uniquely identify the resources associated with this SAP component. For example, if your organization follows a consistent resource naming convention, use the resource name as one of the discovery criteria.

### Map resources manually

If you select manual resource mapping:

1.  Review the available Azure resources.

2.  Select the resources that belong to the component.

3.  Add the selected resources to the component.

### Add other resources

You might encounter some resources associated with an SAP system that Azure Resource Graph discovery or the standard resource mapping experience doesn't support. For example, you might need to add an Azure file share.


To associate these resources with the component:

1.  Go to the section for adding other resources.

2.  Enter the complete Azure resource ID for each resource that you want to associate with the component.

3.  Add more resource IDs as needed.

This step is optional. When you finish configuring the component and its resources, select **Add**.


Azure Workload Center for SAP adds the new component and associates the selected or discovered resources with it.

## Update a workload component

You can update an existing component to add resources, remove already mapped resources, or modify supported component properties.

> [!IMPORTANT]   
> Updating resource mappings is supported only for components that aren't discovered through API-based discovery. You can't manually edit resource mappings for API-discovered components.

### Open the component

1.  Open the WVI that contains the component.

2.  Select **Workload components**.

3.  Select the component that you want to update.

4.  On the component **Overview** page, select **Edit**.

:::image type="content" source="media/workload-management/workload-component-overview-edit-button.png" alt-text="Screenshot of workload component overview page with Edit button highlighted in toolbar.":::

You can't change some component properties after you create the component. For example, you can't change **Component type** and **Component name**.

For database components, you can update supported database properties, such as database set and database type, where applicable.

### Review currently mapped resources

In the edit experience, open the resource mapping section to review the Azure resources currently associated with the component.

From here, you can:

- Remove resources that should no longer be associated with the component.

- Add resources by selecting them manually.

- Use an Azure Resource Graph query to discover resources.

- Provide resource IDs for other supported resources that can't otherwise be discovered or mapped.

:::image type="content" source="media/workload-management/edit-component-select-resources-manually.png" alt-text="Screenshot of Edit Component panel with Select resources manually option chosen and resource summary shown.":::

### Add resources manually

To add more Azure resources:

1.  Open the resource mapping experience.

2.  Review the available resources.

3.  Select the additional resources that you want to associate with the component.

4.  Verify the updated set of mapped resources.

### Remove mapped resources

To remove a resource:

1.  Review the resources currently mapped to the component.

2.  Select the resources that you no longer want associated with the component.

3.  Remove the selected resources.

4.  Verify the updated resource list before saving your changes.

Removing the mapping removes the association between the selected resource and the workload component.

### Update resources by using Azure Resource Graph

You can also use Azure Resource Graph query-based discovery to identify the resources that should be associated with the component.

1.  Select the Azure Resource Graph query-based discovery option.

2.  Define or update the discovery criteria.

3.  Run the discovery.

4.  Review the resources returned by the query.

5.  Verify that the expected resources are mapped to the component.

### Add other resources

If you need to associate a resource that you can't discover or map, provide its complete Azure resource ID.

For example, use this option to associate an Azure file share.

After you make all required changes, select **Save**.

Azure Workload Center for SAP updates the component with the revised resource mappings and supported component properties.

## Delete a workload component

You can delete an individual workload component that you no longer want represented in the WVI.

> [!CAUTION]
> Review the information and implications shown in the deletion experience before deleting the component.

To delete an individual component:

1.  Open the component that you want to delete.

2.  On the component page, select **Delete**.

3.  Review the information shown in the deletion pane.

4.  Confirm the deletion.

5.  Select **Delete**.

:::image type="content" source="media/workload-management/delete-workload-component-confirmation-pane.png" alt-text="Screenshot of delete confirmation pane for workload component ZH1-DB with Delete and Cancel buttons highlighted.":::

The component is removed from the WVI.

## Delete multiple workload components

You can also delete multiple components from a WVI in a single operation.

1.  Open the WVI.

2.  Select **Workload components**.

3.  Select the components that you want to delete.

4.  Select **Delete**.

:::image type="content" source="media/workload-management/select-workload-components-delete.png" alt-text="Screenshot of Workload components list with two components selected and Delete button highlighted.":::

5.  Review the deletion information.

6.  When prompted, enter **delete** to confirm the operation.

7.  Select **Delete**.

The selected components are removed from the WVI.

> [!CAUTION]
> Before confirming a bulk deletion, verify that you selected only the components that you intend to remove.

## Delete a workload virtual instance

You can delete an entire WVI when you no longer want the SAP system represented in Azure Workload Center for SAP.

> [!CAUTION]
> Deleting a WVI removes the workload representation from Azure Workload Center for SAP. Review the deletion information in the portal before confirming the operation.

To delete a WVI:

1.  Open the WVI that you want to delete.

2.  On the WVI **Overview** page, select **Delete**.

:::image type="content" source="media/workload-management/overview-delete-button-highlighted.png" alt-text="Screenshot of WVI Overview page with Delete button highlighted in the toolbar.":::

3.  Review the information shown in the deletion experience.

4.  Copy the WVI resource name.

5.  Enter the resource name when prompted to confirm the deletion.

6.  Select **Delete**.

Azure Workload Center for SAP deletes the WVI after you confirm the operation.
