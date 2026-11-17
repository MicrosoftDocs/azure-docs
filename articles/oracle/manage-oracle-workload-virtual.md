---
title: Manage an Oracle workload (Preview)
titleSuffix: Azure Workload Center for Oracle
description: Learn how to view a WVI and add, update, or delete its workload components in Azure Workload Center for Oracle.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Manage an Oracle workload (Preview)

After you enroll an Oracle system, you can manage the components and resources of its *Workload Virtual Instance (WVI)*. You can:

- Add a workload component

- Update a workload component to add or remove mapped resources

- Delete one or more workload components

- Delete the WVI

## View a WVI

1.  In the Azure portal, go to **Azure Workload Center for Oracle**.

2.  Select **Workload Virtual Instances**, and then select the WVI.

The **Overview** page shows the essentials of the WVI, the number of components and resources, and the health state. The **Workload validation** summary shows the configuration template, the applicable checks, Advisor recommendations, and the deviation alert status.

:::image type="content" source="media/manage-workload-virtual/workload-virtual-instance-overview.png" alt-text="Screenshot that shows the Overview page of a WVI with the Workload validation section highlighted." lightbox="media/manage-workload-virtual/workload-virtual-instance-overview.png":::

## Add a workload component

1.  Open the WVI.

2.  Select **Workload components**.

3.  Select **Add**.

:::image type="content" source="media/manage-workload-virtual/workload-components-add.png" alt-text="Screenshot that shows the Workload components page of a WVI with the Add button." lightbox="media/manage-workload-virtual/workload-components-add.png":::

4.  Select the **Component type** and the **Component role**, and enter a **Component name**.

5.  Map resources by using Azure Resource Graph (ARG) query-based discovery or by manual selection. For the steps, see [Enroll an Oracle system](enroll-oracle-system.md).

6.  Optionally, add resources by resource ID in **Additional resources**.

7.  Select **Add**.

## Update a workload component

You can add or remove the resources of a component, and change how you add resources. You can't change the component type, the component role, or the component name.

1.  Open the WVI and select **Workload components**.

2.  Select the component.

3.  On the component **Overview** page, select **Edit**.

:::image type="content" source="media/manage-workload-virtual/component-edit-delete.png" alt-text="Screenshot that shows the Overview page of a workload component with the Edit and Delete buttons." lightbox="media/manage-workload-virtual/component-edit-delete.png":::

4.  In the **Edit Component** pane, review the resources that are mapped to the component. The type, role, and name are read-only.

5.  Change how you add resources, select resources, or add resources by resource ID. To remove a resource that you added by ID, select the delete icon next to it.

:::image type="content" source="media/manage-workload-virtual/edit-component-pane.png" alt-text="Screenshot that shows the Edit Component pane with the resource mapping options and a resource added by resource ID." lightbox="media/manage-workload-virtual/edit-component-pane.png":::

6.  Select **Save**.

Removing a resource removes it from the component. It doesn't delete the Azure resource.

## Delete a workload component

> [!CAUTION]  
> You can't create another component with the same name for 48 hours after you delete a component.

1.  Open the component that you want to delete.

2.  Select **Delete**.

3.  Review the information in the **Delete a workload component** pane, and then select **Delete**.

:::image type="content" source="media/manage-workload-virtual/delete-component-pane.png" alt-text="Screenshot that shows the Delete a workload component pane with the effects of the deletion and the Delete button." lightbox="media/manage-workload-virtual/delete-component-pane.png":::

The Azure resources that are mapped to the component aren't deleted.

To delete several components at once, open the WVI, select **Workload components**, select the components, and then select **Delete**. When prompted, enter **delete** to confirm.

## Delete a workload virtual instance

> [!CAUTION]  
> Deleting a WVI removes the workload representation and its health model from Azure Workload Center for Oracle. It doesn't delete the Oracle databases or other Azure resources that were mapped to it.

1.  Open the WVI that you want to delete.

2.  On the **Overview** page, select **Delete**.

:::image type="content" source="media/manage-workload-virtual/delete-workload-virtual-instance.png" alt-text="Screenshot that shows the Overview page of a WVI with the Delete button." lightbox="media/manage-workload-virtual/delete-workload-virtual-instance.png":::

3.  Review the information in the deletion pane.

4.  Enter the WVI name to confirm, and then select **Delete**.
