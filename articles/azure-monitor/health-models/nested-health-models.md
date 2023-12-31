---
title: Add a nested health model in Azure Health Models
description: Learn how to add a nested health model. This functionality can be helpful for some scenarios such as complex environments, meta-models, or centralized health models that don’t need the full level of detail.
ms.topic: conceptual
ms.date: 12/12/2023
---

# Add a nested health model in Azure Health Models

Azure Health Models allows adding nested health models to a health model. This functionality can be helpful for some scenarios like more complex environments, meta-models or centralized health models that don't need the full level of detail.

A "nested health model" is the representation of another health model as a single entity.

## Add a nested health model

A "nested health model" is added like any other resource.

1. Click on "+ Add" in the [Designer view](./health-model-create-modify-with-designer.md) and select "Azure resources".

   :::image type="content" source="./media/health-model-nested-health-models/health-model-designer-pane-command-bar.png" lightbox="./media/health-model-nested-health-models/health-model-designer-pane-command-bar.png" alt-text="Screenshot of the Designer pane command bar in the Azure portal with the Add dropdown selected.":::

1. In the "Select resources to add" dialog, search for the health model resource you want to add:

   :::image type="content" source="./media/health-model-nested-health-models/select-resources-to-add-dialog.png" lightbox="./media/health-model-nested-health-models/select-resources-to-add-dialog.png" alt-text="Screenshot of the Select resources to add dialog in the Azure portal.":::

1. Select one and add it to your health model.

   The newly added (nested) health model is shown as any other resource.

   :::image type="content" source="./media/health-model-nested-health-models/nested-health-model-resource-entity.png" lightbox="./media/health-model-nested-health-models/nested-health-model-resource-entity.png" alt-text="Screenshot of a nested health model resource entity.":::

   It provides you with three different metrics:

   :::image type="content" source="./media/health-model-nested-health-models/edit-metric-signal-dialog.png" lightbox="./media/health-model-nested-health-models/edit-metric-signal-dialog.png" alt-text="Screenshot of the Edit metric signal dialog in the Azure portal.":::

   | Metric option | Description |
   |:-------|:------------|
   | **Overall health score** | Represents the health score of the whole nested health model. |
   | **Health score per node** | Allows you to select the health score from a specific entity within the selected health model, by applying the respective _Dimension_ and filtering. |
   | **Query execution duration** | Contains the overall duration the execution of all configured queries in a health model. |
